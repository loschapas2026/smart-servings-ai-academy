import { loadStripe, type Stripe } from "@stripe/stripe-js";

export type StripeEnv = 'sandbox' | 'live';

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

// Derive the environment from the token PREFIX, never from its mere presence.
// A missing or unrecognized token means the build shipped before go-live
// finished — fail loudly instead of silently routing to live.
function paymentsEnvironment(): StripeEnv {
  if (clientToken?.startsWith('pk_test_')) return 'sandbox';
  if (clientToken?.startsWith('pk_live_')) return 'live';
  throw new Error(
    "Pagamentos ainda não estão configurados para esta versão. " +
    "Conclua a ativação dos pagamentos para liberar o checkout real.",
  );
}

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    paymentsEnvironment();
    stripePromise = loadStripe(clientToken as string);
  }
  return stripePromise;
}

export function getStripeEnvironment(): StripeEnv {
  return paymentsEnvironment();
}

// Reads (account, financial portal) must never break the whole app when the
// build has no token yet — they fall back to the test environment, which is
// the same one the banner tells the builder to finish.
export function readPaymentsEnv(): StripeEnv {
  try {
    return paymentsEnvironment();
  } catch {
    return 'sandbox';
  }
}
