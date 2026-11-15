import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { PlanCards } from "@/components/PlanCards";

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
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 pt-36 pb-24">
        <h1 className="text-4xl md:text-6xl">Planos</h1>
        <p className="mt-3 mb-12 text-muted-foreground">Acesso completo em todos os planos. Quanto mais tempo, menor o valor por mês.</p>
        <PlanCards />
      </section>
    </main>
  );
}
