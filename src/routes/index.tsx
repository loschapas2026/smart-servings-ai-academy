import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-raiox.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { PlanCards } from "@/components/PlanCards";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RAIOX — A IA que personaliza o seu restaurante" },
      { name: "description", content: "Aprenda IA, prompts e automação para restaurantes com o Clube do SUIT. A dor que você tem, a IA resolve." },
      { property: "og:title", content: "RAIOX — A IA que personaliza o seu restaurante" },
      { property: "og:description", content: "IA, prompts e automação para donos de restaurante. Clube do SUIT." },
    ],
  }),
  component: Index,
});

const PILLARS = [
  { tag: "01", title: "Inteligência Artificial", text: "Entenda a IA sem enrolação e aplique no dia a dia do salão e da cozinha." },
  { tag: "02", title: "Prompts prontos", text: "Biblioteca de prompts testados para cardápio, marketing, atendimento e gestão." },
  { tag: "03", title: "Automação", text: "Pedidos, WhatsApp, estoque e financeiro rodando sozinhos." },
];

function Index() {
  return (
    <main>
      <SiteHeader />
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <img src={hero} alt="Cozinha de restaurante vista em raio-x por inteligência artificial" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-fade" />
        <div className="scanlines absolute inset-0" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Clube do SUIT · Chico & Welligton</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] md:text-7xl">
            A dor que você tem, a <span className="text-primary">IA</span> resolve.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            <Logo /> — a inteligência artificial que personaliza o seu restaurante com SUIT.
          </p>
          <Link to="/planos" className="mt-8 inline-block rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-glow">
            Quero entrar no RAIOX
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.tag} className="rounded-2xl border bg-card p-7">
              <span className="font-mono text-sm text-primary">{p.tag}</span>
              <h2 className="mt-3 text-xl">{p.title}</h2>
              <p className="mt-3 text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-28">
        <h2 className="text-3xl md:text-5xl">Escolha seu plano</h2>
        <p className="mt-3 mb-10 text-muted-foreground">Vídeos, artigos, prompts e materiais para baixar. Cancele quando quiser.</p>
        <PlanCards />
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <Logo /> · Clube do SUIT
      </footer>
    </main>
  );
}
