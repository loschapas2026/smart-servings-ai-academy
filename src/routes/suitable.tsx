import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Logo } from "@/components/Logo";

const SUIT = "https://suitable.com.br";
const IMG = "https://suitablecontents.com/site/home/app-demo-preview.webp";

export const Route = createFileRoute("/suitable")({
  head: () => ({
    meta: [
      { title: "RAIOX + Suitable — IA conectada ao seu restaurante" },
      { name: "description", content: "O RAIOX resolve sua dor quando você é cliente SUIT: o sistema mais completo e conectado com IA do foodservice." },
      { property: "og:title", content: "RAIOX + Suitable — a parceria que conecta IA ao seu restaurante" },
      { property: "og:description", content: "Caixa, delivery, estoque, motoboy, garçom, KDS, financeiro e WhatsApp oficial em um só sistema — e o RAIOX usa tudo isso com IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: IMG },
      { name: "twitter:image", content: IMG },
    ],
  }),
  component: SuitablePage,
});

const GROUPS = [
  { t: "Salão e atendimento", items: ["Caixa e TEF", "App do Garçom", "Gestão de salão", "KDS na cozinha", "NFC-e e impressões"], href: `${SUIT}/produto/salao/` },
  { t: "Delivery e logística", items: ["Delivery próprio", "App do Motoboy (SUIT Express)", "Rotas com Google Maps", "Agendamento e encomendas"], href: `${SUIT}/produto/delivery/` },
  { t: "Vendas e cardápio", items: ["Cardápio digital que mais vende", "Pix e cartão online", "Roleta de prêmios", "CRM e campanhas"], href: `${SUIT}/produto/loja-online/` },
  { t: "Gestão e números", items: ["Estoque e ficha técnica", "CMV e XML", "Financeiro e DRE", "Dashboard de BI"], href: `${SUIT}/produto/financeiro/` },
  { t: "IA e WhatsApp", items: ["WhatsApp oficial (Coexistência), sem banimento", "Robô de atendimento", "Automações que fidelizam"], href: `${SUIT}/marketing/coex/` },
  { t: "Integrações", items: ["iFood, AiqFome, 99Food, Keeta, Delivery Much", "Open Delivery e Wabiz", "Suitable API aberta", "Pixel e Google Tag Manager"], href: `${SUIT}/produto/integracoes/suitable-api/` },
];

function SuitablePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative overflow-hidden px-5 pb-20 pt-32">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Parceria oficial</p>
            <h1 className="mt-4 text-4xl leading-tight md:text-6xl"><Logo className="inline" /> + Suitable</h1>
            <p className="mt-5 text-xl text-muted-foreground">
              O RAIOX só resolve a sua dor de verdade quando o seu restaurante roda no <strong className="text-foreground">SUIT</strong> — o sistema mais completo e conectado com IA do foodservice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={SUIT} target="_blank" rel="noreferrer" className="rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground shadow-glow">Conhecer a Suitable →</a>
              <Link to="/planos" className="rounded-full border border-primary px-7 py-3 font-bold text-primary">Já sou cliente SUIT · Assinar RAIOX</Link>
            </div>
          </div>
          <img src={IMG} alt="Cardápio digital da Suitable no celular" className="mx-auto max-h-[480px] rounded-3xl" loading="eager" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl md:text-4xl">Por que precisa ser SUIT?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["1", "Seus dados num lugar só", "Pedidos, caixa, estoque, entregas e clientes já estão no SUIT. A IA só acerta quando enxerga a operação inteira."],
            ["2", "API aberta e conectada", "Os prompts do RAIOX usam a Suitable API para criar telas e automações em cima dos seus números reais."],
            ["3", "Resultado no dia seguinte", "Sem planilha, sem copiar e colar: você constrói o sistema e ele já nasce ligado ao seu restaurante."],
          ].map(([n, t, d]) => (
            <div key={n} className="rounded-2xl border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">{n}</span>
              <p className="mt-4 text-lg font-bold">{t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Tudo que o SUIT entrega</p>
        <h2 className="mt-2 text-2xl md:text-4xl">Um ecossistema do salão à entrega</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <a key={g.t} href={g.href} target="_blank" rel="noreferrer" className="group rounded-2xl border bg-card p-6 transition hover:border-primary hover:shadow-glow">
              <p className="text-lg font-bold group-hover:text-primary">{g.t}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {g.items.map((i) => <li key={i}>• {i}</li>)}
              </ul>
              <p className="mt-4 font-mono text-xs text-primary">Ver na Suitable →</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-28">
        <div className="rounded-3xl border-2 border-primary bg-card p-8 text-center shadow-glow md:p-14">
          <h2 className="text-2xl md:text-4xl">A dor que você tem, a IA resolve — com SUIT.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Ainda não é cliente? Fale com um especialista da Suitable. Já é? Entre no RAIOX e comece pelo prompt inicial.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`${SUIT}/comecar-agora/`} target="_blank" rel="noreferrer" className="rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground">Falar com especialista SUIT</a>
            <Link to="/planos" className="rounded-full border border-primary px-7 py-3 font-bold text-primary">Ver planos RAIOX</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
