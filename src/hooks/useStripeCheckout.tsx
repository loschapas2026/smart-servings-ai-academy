import { useCallback, useState } from "react";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";

interface CheckoutOptions {
  priceId: string;
  returnUrl?: string;
}

// Returns the rendered checkout element directly: handing back a component
// factory makes the provider remount and throw
// "You cannot change the client secret after creation".
export function useStripeCheckout() {
  const [options, setOptions] = useState<CheckoutOptions | null>(null);

  const openCheckout = useCallback((opts: CheckoutOptions) => setOptions(opts), []);
  const closeCheckout = useCallback(() => setOptions(null), []);

  const checkoutElement = options ? <StripeEmbeddedCheckout {...options} /> : null;

  return { openCheckout, closeCheckout, isOpen: !!options, checkoutElement };
}
