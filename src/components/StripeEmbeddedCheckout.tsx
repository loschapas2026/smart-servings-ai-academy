import { useMemo } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCheckoutSession } from "@/lib/payments.functions";

interface StripeEmbeddedCheckoutProps {
  priceId: string;
  returnUrl?: string;
}

export function StripeEmbeddedCheckout({ priceId, returnUrl }: StripeEmbeddedCheckoutProps) {
  // The provider rejects a changed options object, so keep it stable for the
  // lifetime of this checkout (priceId/returnUrl never change while open).
  const options = useMemo(() => {
    const fetchClientSecret = async (): Promise<string> => {
      const result = await createCheckoutSession({
        data: {
          priceId,
          returnUrl: returnUrl || window.location.href,
          environment: getStripeEnvironment(),
        },
      });
      if ("error" in result) throw new Error(result.error);
      if (!result.clientSecret) throw new Error("O checkout não foi criado. Tente novamente.");
      return result.clientSecret;
    };
    return { fetchClientSecret };
  }, [priceId, returnUrl]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
