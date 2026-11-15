import { createFileRoute } from "@tanstack/react-router";
import { planByPriceId, type PlanId } from "@/lib/plans";

type Env = "sandbox" | "live";
type SubStatus = "ativa" | "pendente" | "cancelada" | "inadimplente";

// Stripe subscription status -> the portal's own situation values.
const STATUS: Record<string, SubStatus> = {
  active: "ativa",
  trialing: "ativa",
  past_due: "inadimplente",
  unpaid: "inadimplente",
  incomplete: "pendente",
  incomplete_expired: "cancelada",
  canceled: "cancelada",
  paused: "pendente",
};

// Loaded inside the handler: route files reach the client bundle, and the
// service-role client plus the payment SDK must stay server-only.
async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function priceIdOf(payload: any): string | undefined {
  const item = payload?.items?.data?.[0];
  return (
    item?.price?.lookup_key ||
    item?.price?.metadata?.lovable_external_id ||
    item?.price?.id
  );
}

function customerIdOf(payload: any): string | undefined {
  const c = payload?.customer;
  return typeof c === "string" ? c : c?.id;
}

function periodOf(payload: any) {
  const item = payload?.items?.data?.[0];
  const start = item?.current_period_start ?? payload.current_period_start;
  const end = item?.current_period_end ?? payload.current_period_end;
  return {
    start: start ? new Date(start * 1000).toISOString() : null,
    end: end ? new Date(end * 1000).toISOString() : null,
  };
}

async function upsertSubscription(payload: any, env: Env) {
  const userId = payload.metadata?.userId;
  const priceId = priceIdOf(payload);
  const plan: PlanId | undefined = planByPriceId(priceId)?.id;
  if (!userId || !plan) {
    console.error("Subscription event without a known user or plan", { userId, priceId });
    return;
  }
  const { start, end } = periodOf(payload);
  const { error } = await (await db()).from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      status: STATUS[payload.status] ?? "pendente",
      current_period_start: start,
      current_period_end: end,
      stripe_subscription_id: payload.id,
      stripe_customer_id: customerIdOf(payload) ?? null,
      price_id: priceId ?? null,
      environment: env,
      cancel_at_period_end: !!payload.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("Failed to save subscription", error.message);
}

async function recordPayment(opts: {
  userId: string;
  amountInCents: number;
  description: string;
  invoiceId: string;
  paidAt: string;
  env: Env;
  chargeId?: string | null;
}) {
  const client = await db();
  // The invoice id is unique here, but check first so a retried delivery
  // never lands as a second row in the customer's history.
  const { data: seen } = await client
    .from("payments")
    .select("id")
    .eq("stripe_invoice_id", opts.invoiceId)
    .maybeSingle();
  if (seen) return;

  const { error } = await client.from("payments").insert({
    user_id: opts.userId,
    amount: Math.round(opts.amountInCents) / 100,
    status: "pago",
    description: opts.description,
    paid_at: opts.paidAt,
    stripe_invoice_id: opts.invoiceId,
    stripe_charge_id: opts.chargeId ?? null,
    environment: opts.env,
  });
  if (error) console.error("Failed to save payment", error.message);
}

async function handleSubscriptionDeleted(payload: any, env: Env) {
  const { error } = await (await db())
    .from("subscriptions")
    .update({ status: "cancelada", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", payload.id)
    .eq("environment", env);
  if (error) console.error("Failed to cancel subscription", error.message);
}

// One-time purchases (the semestral plan) have no subscription object, so
// access is granted straight from the completed checkout session.
async function fulfillOneTime(session: any, env: Env) {
  const userId = session.metadata?.userId;
  const priceId: string | undefined = session.metadata?.priceId ?? session.line_items?.data?.[0]?.price?.lookup_key;
  const plan = planByPriceId(priceId);
  if (!userId || !plan) {
    console.error("Checkout without a known user or plan", { userId, priceId });
    return;
  }
  const start = new Date();
  const end = new Date(start);
  end.setMonth(end.getMonth() + plan.months);

  const client = await db();
  const { error } = await client.from("subscriptions").upsert(
    {
      user_id: userId,
      plan: plan.id,
      status: "ativa",
      current_period_start: start.toISOString(),
      current_period_end: end.toISOString(),
      stripe_customer_id: customerIdOf(session) ?? null,
      price_id: priceId ?? null,
      environment: env,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) console.error("Failed to grant one-time access", error.message);

  await recordPayment({
    userId,
    amountInCents: session.amount_total ?? 0,
    description: `RAIOX — ${plan.name} (pagamento único)`,
    invoiceId: typeof session.invoice === "string" ? session.invoice : `checkout:${session.id}`,
    paidAt: new Date().toISOString(),
    env,
    chargeId: session.payment_intent ?? null,
  });
}

async function handleInvoicePaid(invoice: any, env: Env) {
  const subscriptionId =
    typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
  const client = await db();

  let userId: string | undefined = invoice.metadata?.userId;
  if (!userId && subscriptionId) {
    const { data } = await client
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscriptionId)
      .maybeSingle();
    userId = data?.user_id;
  }
  if (!userId) {
    console.error("Invoice without a known user", { id: invoice.id });
    return;
  }

  await recordPayment({
    userId,
    amountInCents: invoice.amount_paid ?? 0,
    description: invoice.lines?.data?.[0]?.description ?? "Assinatura RAIOX",
    invoiceId: invoice.id,
    paidAt: new Date((invoice.status_transitions?.paid_at ?? invoice.created ?? Date.now() / 1000) * 1000).toISOString(),
    env,
    chargeId: invoice.payment_intent ?? null,
  });

  // A renewal that succeeded clears an earlier overdue flag.
  if (subscriptionId) {
    await client
      .from("subscriptions")
      .update({ status: "ativa", updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", subscriptionId)
      .eq("environment", env)
      .eq("status", "inadimplente");
  }
}

async function handleInvoiceFailed(invoice: any, env: Env) {
  const subscriptionId =
    typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
  if (!subscriptionId) return;
  await (await db())
    .from("subscriptions")
    .update({ status: "inadimplente", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscriptionId)
    .eq("environment", env);
}

async function handleWebhook(req: Request, env: Env) {
  const { verifyWebhook } = await import("@/lib/stripe.server");
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await upsertSubscription(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      // "unpaid" means a slow payment method (boleto, SEPA...) was only
      // submitted — the async events settle it later.
      if (session.payment_status === "unpaid") break;
      if (session.mode === "payment") await fulfillOneTime(session, env);
      break;
    }
    case "checkout.session.async_payment_failed":
      console.error("Delayed payment failed", event.data.object?.id);
      break;
    case "invoice.paid":
      await handleInvoicePaid(event.data.object, env);
      break;
    case "invoice.payment_failed":
      await handleInvoiceFailed(event.data.object, env);
      break;
    default:
      console.log("Unhandled payment event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Payment webhook with missing or invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Payment webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
