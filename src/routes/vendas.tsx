import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  ChefHat,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Code2,
  Database,
  Layers3,
  MessageCircle,
  PackageCheck,
  Route as RouteIcon,
  ScanLine,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react";
import hero from "@/assets/hero-raiox.jpg";
import francisco from "@/assets/francisco-neto-palco.jpg.asset.json";
import wellington from "@/assets/wellington-morais-evento.jpg.asset.json";
import { Logo } from "@/components/Logo";
import { PlanCards } from "@/components/PlanCards";
import { useAdhesion } from "@/hooks/useAdhesion";
import { brl } from "@/lib/plans";

export const Route = createFileRoute("/vendas")({
  head: () => ({
    meta: [
      { title: "RAIOX — Transforme a dor do seu restaurante em um sistema com IA" },
      {
        name: "description",
        content:
          "Aprenda a criar módulos de IA sob medida para o seu restaurante, conectados ao SUIT. Prompts prontos, aulas práticas e um gerador que transforma sua dor em sistema.",
      },
      { property: "og:title", content: "RAIOX — A dor que você tem, a IA resolve" },
      {
        property: "og:description",
        content:
          "Não troque o que já funciona. Crie módulos sob medida para a operação do seu restaurante com IA, Suitable API e RAIOX.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SalesPage,
});

const pains = [
  {
    icon: RouteIcon,
    title: "A entrega saiu. O problema chegou junto.",
    text: "Motoboy sem rota conferida, pedido pendente e você só descobre quando o cliente liga reclamando.",
    tag: "ENTREGAS",
  },
  {
    icon: PackageCheck,
    title: "O estoque fecha no papel. E abre no prejuízo.",
    text: "Compra no escuro, ficha técnica esquecida e aquele ingrediente que acaba justo no horário de pico.",
    tag: "ESTOQUE",
  },
  {
    icon: MessageCircle,
    title: "O cliente chama. A equipe não dá conta.",
    text: "As mesmas perguntas todos os dias, oportunidades paradas no WhatsApp e nenhum acompanhamento depois da venda.",
    tag: "ATENDIMENTO",
  },
  {
    icon: BarChart3,
    title: "O número existe. A resposta, não.",
    text: "Pedidos, CMV e ticket médio espalhados. Você tem dados, mas continua decidindo no feeling.",
    tag: "GESTÃO",
  },
];

const deliverables = [
  {
    icon: BrainCircuit,
    title: "Sua dor vira um prompt completo",
    text: "Você descreve o problema com as suas palavras. O RAIOX devolve objetivo, telas, regras, integrações e critérios de teste.",
    featured: true,
  },
  {
    icon: Layers3,
    title: "Biblioteca pronta para copiar",
    text: "Prompts de operação, gestão, CRM, estoque, motoboys, financeiro e automações para adaptar ao seu negócio.",
  },
  {
    icon: Database,
    title: "Suitable API como fonte oficial",
    text: "Os módulos nascem ligados aos dados reais da sua operação, sem planilha paralela ou número inventado.",
  },
  {
    icon: Code2,
    title: "Criação guiada no Lovable",
    text: "Você não precisa programar. Copie o prompt, preencha os campos e construa com uma ferramenta visual de IA.",
  },
  {
    icon: Zap,
    title: "Evolução sem bagunçar seu sistema",
    text: "Cada novidade entra como um módulo com menu próprio, preservando o que já funciona no seu restaurante.",
  },
];

const steps = [
  {
    number: "01",
    title: "Conte qual é a sua dor",
    text: "Sem linguagem técnica. Explique o que trava sua operação e o resultado que você quer enxergar.",
  },
  {
    number: "02",
    title: "Receba o desenho da solução",
    text: "O RAIOX organiza telas, regras, dados do SUIT e perguntas antes de qualquer construção.",
  },
  {
    number: "03",
    title: "Construa seu novo módulo",
    text: "Leve o prompt para o Lovable, conecte a Suitable API e coloque a solução para trabalhar na rotina.",
  },
];

const faqs = [
  {
    q: "Preciso saber programar para usar o RAIOX?",
    a: "Não. A proposta é justamente traduzir a sua necessidade em instruções claras para construir com IA. Você começa pelo prompt inicial, preenche os campos indicados e segue o passo a passo.",
  },
  {
    q: "Vou precisar trocar o sistema do meu restaurante?",
    a: "Não. O RAIOX foi pensado para clientes Suitable e usa a Suitable API como fonte oficial dos dados. A ideia é acrescentar módulos ao que você já usa, sem quebrar a operação atual.",
  },
  {
    q: "Os prompts servem para qualquer restaurante?",
    a: "Eles são moldes, não limites. Cada prompt traz campos entre colchetes para você adaptar à sua realidade. E, se não existir um prompt para a sua dor, você pode gerar um novo dentro da plataforma.",
  },
  {
    q: "Como funciona a cota de adesão?",
    a: "Ela é paga uma única vez, junto com a primeira mensalidade. Os 100 primeiros membros pagam R$ 399; os 100 seguintes, R$ 599; depois, R$ 999. O lote muda conforme as vagas são preenchidas.",
  },
  {
    q: "Posso compartilhar meu acesso com outra pessoa?",
    a: "Não. Cada assinatura permite uma sessão ativa por vez. Assim, o conteúdo e o acesso ficam protegidos para os membros.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
      {children}
    </p>
  );
}

function SalesHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/vendas">
          <Logo className="text-2xl" />
        </Link>
        <Link
          to="/planos"
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow"
        >
          Assinar agora
        </Link>
      </div>
    </header>
  );
}

function SalesCta({ children = "Quero resolver minha dor" }: { children?: React.ReactNode }) {
  return (
    <Link
      to="/planos"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-90"
    >
      {children} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function SalesPage() {
  const { tier, left, next } = useAdhesion();

  return (
    <main className="overflow-hidden bg-background">
      <SalesHeader />

      <section className="relative min-h-[94vh] border-b pt-28">
        <div className="pointer-events-none absolute -right-32 top-10 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:pb-24">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              <ScanLine className="h-3.5 w-3.5" /> IA aplicada à operação real
            </div>
            <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.08] md:text-6xl xl:text-7xl">
              Seu restaurante não precisa de mais um sistema.
              <span className="mt-3 block text-primary">Precisa de um que entenda o seu jeito.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              O <Logo /> transforma a dor da sua operação em módulos de IA sob medida, conectados ao SUIT. Você aprende, cria e coloca para rodar — sem depender de programador.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <SalesCta>Garantir meu acesso ao RAIOX</SalesCta>
              <a
                href="https://suitable.com.br"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold transition hover:border-primary hover:text-primary"
              >
                Entender a parceria SUIT <ChevronRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Acesso imediato após aprovação</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Todos os planos com acesso completo</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 shadow-glow">
              <img
                src={hero}
                alt="Cozinha de restaurante analisada por inteligência artificial"
                width={1536}
                height={1024}
                className="aspect-[4/5] w-full object-cover grayscale md:aspect-[5/5]"
              />
              <div className="absolute inset-0 bg-primary/15 mix-blend-color" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
              <div className="scanlines absolute inset-0" />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-primary/40 bg-background/80 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> RAIOX da operação
              </div>
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border bg-background/90 p-5 backdrop-blur-md">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Diagnóstico → solução</p>
                <p className="mt-3 font-display text-xl font-bold leading-snug">“Perco pedido porque o motoboy sai sem conferir a rota.”</p>
                <div className="my-4 h-px bg-border" />
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-bold">Módulo de conferência de rotas</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Tela, regras e dados prontos para construir.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -left-3 top-24 rounded-2xl border border-primary/40 bg-card p-4 shadow-glow sm:-left-8">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">A sua operação</p>
              <p className="mt-1 font-display text-sm font-bold text-primary">No centro de tudo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-7 text-center sm:grid-cols-3 sm:text-left">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <Utensils className="h-5 w-5 text-primary" />
            <div><p className="text-sm font-bold">Nascido no salão e no delivery</p><p className="text-xs text-muted-foreground">Não em uma sala longe da operação.</p></div>
          </div>
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <Database className="h-5 w-5 text-primary" />
            <div><p className="text-sm font-bold">Conectado ao SUIT</p><p className="text-xs text-muted-foreground">Dados reais, não achismos.</p></div>
          </div>
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <Sparkles className="h-5 w-5 text-primary" />
            <div><p className="text-sm font-bold">Feito para criar, não só assistir</p><p className="text-xs text-muted-foreground">Você sai com algo construído.</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <SectionLabel>Se isso dói, é por aqui que começa</SectionLabel>
            <h2 className="mt-5 text-3xl leading-tight md:text-5xl">O problema não é falta de esforço.</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">É tentar encaixar uma operação única em telas e processos feitos para todo mundo igual.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {pains.map((pain) => {
              const Icon = pain.icon;
              return (
                <article key={pain.tag} className="group rounded-2xl border bg-card p-6 transition hover:border-primary/60">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" /></span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">{pain.tag}</span>
                  </div>
                  <h3 className="mt-6 font-sans text-lg font-bold leading-snug">{pain.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{pain.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-24 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>O método RAIOX</SectionLabel>
            <h2 className="mt-5 text-3xl leading-tight md:text-5xl">Não é mágica. É um caminho claro da dor ao sistema.</h2>
            <p className="mt-5 text-muted-foreground">Você entende o que está construindo antes de colocar a mão na ferramenta.</p>
          </div>
          <div className="relative mt-14 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.number} className="relative rounded-2xl border bg-background p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-black text-primary">{step.number}</span>
                  {index < steps.length - 1 && <ArrowRight className="hidden h-5 w-5 text-muted-foreground md:block" />}
                </div>
                <h3 className="mt-7 font-sans text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="https://lovable.dev/invite/WPOLHIM"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              Conheça a ferramenta recomendada para construir <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <div className="max-w-3xl">
          <SectionLabel>O que destrava com o seu acesso</SectionLabel>
          <h2 className="mt-5 text-3xl leading-tight md:text-5xl">Uma biblioteca para começar. Um motor para criar o que ainda não existe.</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={`rounded-2xl border bg-card p-7 ${item.featured ? "border-primary shadow-glow md:row-span-2" : ""}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-6 font-sans text-xl font-bold leading-snug">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                {item.featured && (
                  <div className="mt-8 rounded-2xl border border-primary/30 bg-background p-5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">Exemplo de saída</p>
                    <ul className="mt-4 space-y-3 text-sm">
                      {["Objetivo e quem vai usar", "Telas para celular e computador", "Regras e dados do SUIT", "Critérios para testar antes de publicar"].map((line) => (
                        <li key={line} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1fr_auto] md:py-20">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">O RAIOX não entrega uma caixa fechada</p>
            <h2 className="mt-4 max-w-3xl text-3xl leading-tight md:text-5xl">Se a sua dor não está na biblioteca, ela vira o próximo sistema.</h2>
            <p className="mt-5 max-w-2xl leading-7 opacity-80">Você descreve. A IA estrutura. O SUIT fornece os dados. O Lovable ajuda a construir. O resultado nasce para o seu negócio — não para uma média de mercado.</p>
          </div>
          <Link to="/planos" className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-7 py-4 text-sm font-bold text-foreground transition hover:opacity-90">
            Quero criar minha solução <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid grid-cols-2 gap-4">
            {[
              { image: francisco.url, name: "Francisco Neto", business: "Los Chapas", icon: ChefHat },
              { image: wellington.url, name: "Wellington Morais", business: "Pizza do Engenheiro", icon: BarChart3 },
            ].map((founder) => {
              const Icon = founder.icon;
              return (
                <article key={founder.name} className="relative overflow-hidden rounded-2xl border bg-card">
                  <img src={founder.image} alt={`${founder.name}, ${founder.business}`} className="aspect-[3/4] w-full object-cover object-top grayscale" loading="lazy" />
                  <div className="absolute inset-0 bg-primary/15 mix-blend-color" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  <div className="scanlines absolute inset-0" />
                  <Icon className="absolute right-4 top-4 h-5 w-5 text-primary" />
                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="text-sm leading-tight md:text-xl">{founder.name}</h3>
                    <p className="mt-1 text-[10px] text-muted-foreground md:text-xs">{founder.business}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div>
            <SectionLabel>Criado por quem vive a sua rotina</SectionLabel>
            <h2 className="mt-5 text-3xl leading-tight md:text-5xl">Dois negócios diferentes. A mesma dor.</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Francisco vive a operação do Los Chapas. Wellington toca o delivery da Pizza do Engenheiro e vive de número: pedido, ticket médio, taxa de entrega e horário de pico.</p>
            <p className="mt-4 leading-7 text-muted-foreground">Os dois bateram no mesmo muro: sistemas prontos que não entregam a singularidade de cada negócio. O RAIOX nasceu para você parar de adaptar sua operação ao sistema — e começar a adaptar o sistema à sua operação.</p>
            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-6"><strong>Você não precisa esperar uma desenvolvedora entender seu restaurante.</strong><br /><span className="text-muted-foreground">Quem melhor conhece a dor já está dentro dela: você.</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-card/40" id="planos">
        <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <SectionLabel>Seu próximo sistema começa aqui</SectionLabel>
            <h2 className="mt-5 text-3xl leading-tight md:text-5xl">Entre antes do próximo lote.</h2>
            <p className="mt-5 text-lg text-muted-foreground">Acesso completo em todos os planos. A adesão é cobrada uma única vez e fica mais cara a cada lote preenchido.</p>
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-xs text-primary">
              <CircleDollarSign className="h-4 w-4" />
              Lote atual: {brl(tier.total)}
              {left !== null && <span>· {left} vagas restantes</span>}
              {next && <span>· depois {brl(next.total)}</span>}
            </div>
          </div>
          <PlanCards />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24 md:py-32">
        <div className="text-center">
          <SectionLabel>Sem dúvida antes de começar</SectionLabel>
          <h2 className="mt-5 text-3xl md:text-5xl">Perguntas de quem está decidindo</h2>
        </div>
        <div className="mt-12 divide-y border-y">
          {faqs.map((faq, index) => (
            <details key={faq.q} className="group py-6" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold">
                {faq.q}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-primary transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border-2 border-primary bg-card px-6 py-16 text-center shadow-glow md:px-12 md:py-20">
          <div className="scanlines absolute inset-0" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <Logo className="text-3xl" />
            <h2 className="mx-auto mt-7 max-w-4xl text-3xl leading-tight md:text-5xl">A dor que você tem hoje pode ser o sistema que você usa amanhã.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Comece pelo que mais trava sua operação. O resto você constrói um módulo por vez.</p>
            <div className="mt-9"><SalesCta>Sim, quero entrar no RAIOX</SalesCta></div>
            <p className="mt-5 text-xs text-muted-foreground">Para clientes Suitable · Acesso individual · Pagamento seguro</p>
          </div>
        </div>
      </section>

      <footer className="border-t px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <div><Logo /> <span className="ml-2">· Clube do SUIT</span></div>
          <a href="https://suitable.com.br" target="_blank" rel="noreferrer" className="hover:text-primary">
            Suitable — o sistema por trás dos dados
          </a>
        </div>
      </footer>
    </main>
  );
}
