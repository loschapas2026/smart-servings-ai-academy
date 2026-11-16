import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { PlanCards } from "@/components/PlanCards";
import { useAccount, useSession } from "@/hooks/useAccount";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdhesion } from "@/hooks/useAdhesion";
import { brl, perMonth, type Plan } from "@/lib/plans";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos RAIOX — Mensal, Semestral e Anual" },
      { name: "description", content: "Assine o RAIOX a partir de R$ 49,90/mês e automatize seu restaurante com IA." },
      { property: "og:title", content: "Planos RAIOX" },
      { property: "og:description", content: "Mensal, semestral ou anual. IA para restaurantes com o Clube do SUIT." },
    ],
  }),
  component: Planos,
});

function Planos() {
  const { session } = useSession();
  const { data: acc } = useAccount();
  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();
  const adh = useAdhesion();
  const [plan, setPlan] = useState<Plan | null>(null);

  const choose = (p: Plan) => {
    if (!session?.user) return;
    setPlan(p);
    openCheckout({
      priceId: p.priceId,
      returnUrl: `${window.location.origin}/financeiro?checkout=ok`,
    });
  };

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 pt-36 pb-24">
        <h1 className="text-4xl md:text-6xl">Planos</h1>
        <p className="mt-3 mb-12 text-muted-foreground">Acesso completo em todos os planos. Quanto mais tempo, menor o valor por mês.</p>
        <PlanCards signedIn={!!session} active={!!acc?.active} onChoose={choose} />
      </section>

      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { closeCheckout(); setPlan(null); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{plan ? `Assinar o plano ${plan.name}` : "Assinar"}</DialogTitle>
            <DialogDescription>
              {plan ? `${brl(plan.total)} (${brl(perMonth(plan))} por mês) + cota de adesão de ${brl(adh.tier.total)} (lote ${adh.tier.lote}) na primeira compra. Acesso liberado assim que o pagamento for aprovado.` : ""}
            </DialogDescription>
          </DialogHeader>
          {checkoutElement}
        </DialogContent>
      </Dialog>
    </main>
  );
}
