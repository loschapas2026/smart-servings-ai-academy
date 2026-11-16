import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Stripe } from "stripe";
import type { StripeEnv } from "@/lib/stripe";

type CheckoutResult = { clientSecret: string } | { error: string };
type PortalResult = { url: string } | { error: string };

const PRICE_ID_RE = /^[a-zA-Z0-9_-]+$/;

// Looks up an existing Customer by userId metadata (then by email), or creates
// one. Keeping userId on the Customer object is what makes later reads
// (portal, dashboards) resolvable without depending on Session metadata.
async function resolveOrCreateCustomer(
  stripe: any,
  options: { email?: string | undefined; userId?: string | undefined },
): Promise<string> {
  // userId is interpolated into a Stripe Search query string below; reject
  // anything that could break out of the quoted value.
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

async function productName(stripe: any, stripePrice: any): Promise<string> {
  const productId = typeof stripePrice.product === "string" ? stripePrice.product : stripePrice.product?.id;
  if (!productId) return "Acesso RAIOX";
  const product = await stripe.products.retrieve(productId);
  return product.name || "Acesso RAIOX";
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { priceId: string; environment: StripeEnv; returnUrl: string }) => {
    if (!PRICE_ID_RE.test(data.priceId ?? "")) throw new Error("Plano inválido");
    if (data.environment !== "sandbox" && data.environment !== "live") throw new Error("Ambiente inválido");
    if (typeof data.returnUrl !== "string" || !data.returnUrl.startsWith("http")) throw new Error("Origem inválida");
    return data;
  })
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    const { supabase, userId } = context;
    try {
      // Never let someone stack a second paid plan on top of a live one.
      const { data: current } = await supabase
        .from("subscriptions")
        .select("id, status, current_period_end, price_id")
        .eq("user_id", userId)
        .eq("environment", data.environment)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (
        current &&
        (current.status === "ativa" || current.status === "inadimplente") &&
        (!current.current_period_end || new Date(current.current_period_end) > new Date())
      ) {
        return { error: "Você já tem um plano ativo. Cancele ou aguarde o fim do período para assinar outro." };
      }

      const { createStripeClient, getStripeErrorMessage } = await import("@/lib/stripe.server");
      const stripe = createStripeClient(data.environment);

      // Human-readable price id -> Stripe price via lookup_keys.
      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      const stripePrice = prices.data[0];
      if (!stripePrice) return { error: "Plano não encontrado no catálogo de pagamentos." };
      const isRecurring = stripePrice.type === "recurring";

      // Cota de adesão: cobrada uma vez só, na primeira compra desta conta.
      const { count: paidBefore } = await supabase
        .from("payments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("environment", data.environment);
      let adhesionLine: { price: string; quantity: number } | null = null;
      if (!paidBefore) {
        const adhesion = (await stripe.prices.list({ lookup_keys: ["raiox_adesao"] })).data[0];
        if (!adhesion) return { error: "Cota de adesão não encontrada no catálogo de pagamentos." };
        adhesionLine = { price: adhesion.id, quantity: 1 };
      }

      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email ?? undefined;
      const customerId = await resolveOrCreateCustomer(stripe, { email, userId });

      const base: Stripe.Checkout.SessionCreateParams = {
        line_items: [{ price: stripePrice.id, quantity: 1 }, ...(adhesionLine ? [adhesionLine] : [])],
        mode: isRecurring ? "subscription" : "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        // Prices are set in BRL; don't show visitors a converted currency.
        adaptive_pricing: { enabled: false },
        metadata: { userId, priceId: data.priceId },
        ...(isRecurring && { subscription_data: { metadata: { userId, priceId: data.priceId } } }),
        ...(!isRecurring && { payment_intent_data: { description: await productName(stripe, stripePrice) } }),
      };

      // Seller is in Brazil: Stripe calculates and collects tax at checkout
      // while the seller handles filing. On a sandbox that is not claimed yet
      // tax is not switched on, so fall back to a plain checkout instead of
      // leaving the customer without a payment form.
      let session;
      try {
        session = await stripe.checkout.sessions.create({ ...base, automatic_tax: { enabled: true } });
      } catch (taxError) {
        const reason = getStripeErrorMessage(taxError);
        if (!/stripe_tax_inactive|Stripe Tax is not supported/i.test(reason)) throw taxError;
        session = await stripe.checkout.sessions.create(base);
      }

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      const { getStripeErrorMessage } = await import("@/lib/stripe.server");
      return { error: getStripeErrorMessage(error) };
    }
  });

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: StripeEnv; returnUrl?: string }) => {
    if (data.environment !== "sandbox" && data.environment !== "live") throw new Error("Ambiente inválido");
    return data;
  })
  .handler(async ({ data, context }): Promise<PortalResult> => {
    const { supabase, userId } = context;
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .eq("environment", data.environment)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!sub?.stripe_customer_id) return { error: "Nenhuma cobrança ativa encontrada para esta conta." };

    try {
      const { createStripeClient, getStripeErrorMessage } = await import("@/lib/stripe.server");
      const stripe = createStripeClient(data.environment);
      const portal = await stripe.billingPortal.sessions.create({
        customer: sub.stripe_customer_id,
        ...(data.returnUrl && { return_url: data.returnUrl }),
      });
      return { url: portal.url };
    } catch (error) {
      const { getStripeErrorMessage } = await import("@/lib/stripe.server");
      return { error: getStripeErrorMessage(error) };
    }
  });
