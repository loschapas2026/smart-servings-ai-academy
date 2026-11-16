import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Bot,
  BrainCircuit,
  Check,
  Code2,
  Database,
  Image,
  Lightbulb,
  MessageSquareText,
  Rocket,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

const LOVABLE_INVITE = "https://lovable.dev/invite/WPOLHIM";

const aiTypes: Array<{
  icon: LucideIcon;
  title: string;
  examples: string;
  description: string;
  use: string;
}> = [
  {
    icon: MessageSquareText,
    title: "Conversa e raciocínio",
    examples: "Claude · ChatGPT · Gemini",
    description:
      "Entendem perguntas, analisam documentos, criam textos e ajudam a tomar decisões. São copilotos para pensar melhor antes de executar.",
    use: "Planejar, pesquisar e escrever",
  },
  {
    icon: Code2,
    title: "Criação de sistemas",
    examples: "Lovable · Replit · Bolt",
    description:
      "Transformam comandos em telas, funcionalidades e aplicações que você pode testar. Encurtam o caminho entre uma ideia e um sistema utilizável.",
    use: "Tirar uma ferramenta do papel",
  },
  {
    icon: Workflow,
    title: "Automações e agentes",
    examples: "n8n · Make · agentes de IA",
    description:
      "Conectam serviços e executam rotinas. Um agente também pode escolher próximos passos dentro de regras e permissões definidas por você.",
    use: "Eliminar trabalho repetitivo",
  },
  {
    icon: Image,
    title: "Imagem, voz e vídeo",
    examples: "Midjourney · ElevenLabs · Runway",
    description:
      "Criam e editam conteúdo visual e sonoro. Aceleram campanhas, vídeos, locuções e peças de comunicação sem começar sempre do zero.",
    use: "Produzir conteúdo e campanhas",
  },
];

const tools: Array<{
  id: string;
  name: string;
  short: string;
  eyebrow: string;
  icon: LucideIcon;
  description: string;
  bullets: string[];
  bestFor: string;
  attention: string;
}> = [
  {
    id: "lovable",
    name: "Lovable",
    short: "Construir e publicar",
    eyebrow: "NOSSA RECOMENDAÇÃO PARA COMEÇAR",
    icon: Sparkles,
    description:
      "Para iniciantes que querem resultado rápido, o Lovable é a opção mais completa: construção por IA, infraestrutura e publicação convivem no mesmo fluxo, sem você precisar montar tudo separadamente.",
    bullets: [
      "Você descreve o sistema em linguagem natural e acompanha o resultado na tela.",
      "O Lovable Cloud reúne banco de dados, login e demais recursos do seu projeto.",
      "Dá para testar no celular, publicar e continuar melhorando em pequenas etapas.",
    ],
    bestFor: "Quem tem uma ideia e quer colocar a primeira versão no ar sem aprender programação antes.",
    attention: "A IA acelera a construção, mas regras claras e testes continuam sendo seus.",
  },
  {
    id: "claude",
    name: "Claude",
    short: "Planejar e refinar",
    eyebrow: "COPILOTO PARA PENSAR MELHOR",
    icon: BrainCircuit,
    description:
      "É uma escolha forte para organizar ideias, analisar contextos longos, revisar instruções e discutir código. Funciona muito bem como parceiro de raciocínio durante o projeto.",
    bullets: [
      "Ajuda a transformar uma ideia solta em requisitos e etapas de construção.",
      "Pode revisar regras, textos e trechos de código com bastante contexto.",
      "É útil para investigar erros e explicar decisões técnicas com clareza.",
    ],
    bestFor: "Planejar, revisar e aprofundar o sistema que você começou a construir.",
    attention: "Para uma primeira experiência visual e publicável, use-o junto de uma plataforma de construção.",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    short: "Resolver o dia a dia",
    eyebrow: "ASSISTENTE GENERALISTA",
    icon: Bot,
    description:
      "Um assistente versátil para escrever, resumir, analisar arquivos, gerar ideias e trabalhar com texto e imagem. Bom para tarefas variadas da operação e do marketing.",
    bullets: [
      "Cria descrições, respostas para clientes e rascunhos de campanhas.",
      "Ajuda a interpretar planilhas, documentos e informações do negócio.",
      "Pode gerar prompts e organizar processos antes da automação.",
    ],
    bestFor: "Resolver demandas diferentes ao longo do dia com um único assistente.",
    attention: "Confira números, fatos e decisões importantes antes de colocar em prática.",
  },
  {
    id: "gemini",
    name: "Gemini",
    short: "Trabalhar com Google",
    eyebrow: "PRODUTIVIDADE NO ECOSSISTEMA GOOGLE",
    icon: Zap,
    description:
      "Combina assistência multimodal com recursos do ecossistema Google. Faz sentido para quem já concentra documentos, e-mails e arquivos nesse ambiente.",
    bullets: [
      "Auxilia com pesquisa, escrita, resumos e análise de diferentes formatos.",
      "Pode se integrar à rotina de quem usa as ferramentas do Google.",
      "Ajuda a preparar informações que depois entram no seu sistema.",
    ],
    bestFor: "Quem já trabalha bastante com Google e quer IA perto dessa rotina.",
    attention: "Os recursos e integrações disponíveis podem variar conforme o plano.",
  },
  {
    id: "n8n",
    name: "n8n / Make",
    short: "Automatizar processos",
    eyebrow: "A PONTE ENTRE SUAS FERRAMENTAS",
    icon: Workflow,
    description:
      "Não são modelos de IA como Claude ou ChatGPT: são plataformas para ligar sistemas e criar fluxos automáticos, com ou sem IA no meio do processo.",
    bullets: [
      "Recebem um acontecimento, consultam dados e disparam ações em outros serviços.",
      "Organizam rotinas como follow-up, notificações e atualização de cadastros.",
      "Ganham mais valor quando o processo manual já está claro e validado.",
    ],
    bestFor: "Automatizar uma rotina que você já entende e repete com frequência.",
    attention: "Comece com um fluxo pequeno e previsível; automação ruim repete erros em escala.",
  },
];

export function AiLaunchGuide() {
  const [selectedId, setSelectedId] = useState("lovable");
  const selected = tools.find((tool) => tool.id === selectedId) ?? tools[0]!;
  const SelectedIcon = selected.icon;

  return (
    <section id="radar" aria-labelledby="radar-ia-title" className="mt-16 scroll-mt-6">
      <div className="relative overflow-hidden rounded-3xl border border-primary/60 bg-card shadow-glow">
        <div className="scanlines pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
                Comece por aqui
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Radar IA · Guia 01</span>
            </div>
            <h2 id="radar-ia-title" className="mt-5 max-w-3xl text-3xl leading-tight md:text-5xl">
              A IA certa para sair da ideia e chegar ao <span className="text-primary">sistema no ar.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Nem toda IA faz a mesma coisa. Entenda o mapa, escolha sua ferramenta e comece pela infraestrutura que
              entrega uma primeira versão sem exigir conhecimento técnico.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={LOVABLE_INVITE}
                target="_blank"
                rel="sponsored noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow transition hover:opacity-90"
              >
                Começar no Lovable <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                to="/prompts"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-bold transition hover:border-primary hover:text-primary"
              >
                Pegar o prompt inicial <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Link de convite da equipe RAIOX. Abre em uma nova aba.</p>
          </div>

          <div className="rounded-2xl border bg-background/70 p-5 backdrop-blur">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Sua primeira infraestrutura</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary p-3 text-primary-foreground">
                <Blocks className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-xl">Lovable + Cloud</p>
                <p className="text-xs text-muted-foreground">Construção, dados, acesso e publicação</p>
              </div>
            </div>
            <div className="my-5 border-t" />
            <ol className="space-y-4">
              {[
                ["01", "Descreva", "Explique a dor e quem vai usar."],
                ["02", "Construa", "Use o prompt inicial no Lovable."],
                ["03", "Valide", "Teste no celular e no computador."],
                ["04", "Evolua", "Automatize só depois de validar."],
              ].map(([number, title, text]) => (
                <li key={number} className="flex gap-3">
                  <span className="font-mono text-xs text-primary">{number}</span>
                  <div>
                    <p className="text-sm font-bold">{title}</p>
                    <p className="text-xs text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">O mapa em 4 famílias</p>
            <h2 className="mt-2 text-2xl md:text-3xl">IA não é tudo igual</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Pense pelo trabalho que precisa ser feito, não pela ferramenta mais comentada.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {aiTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <article key={type.title} className="group rounded-2xl border bg-card p-5 transition hover:border-primary/70">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-secondary p-2.5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-base">{type.title}</h3>
                <p className="mt-1 font-mono text-[11px] leading-relaxed text-primary">{type.examples}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{type.description}</p>
                <p className="mt-4 border-t pt-3 text-xs font-bold">{type.use}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Comparador sem complicação</p>
        <h2 className="mt-2 text-2xl md:text-3xl">Qual ferramenta entra em cena?</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Toque em uma ferramenta para entender onde ela brilha. Não existe uma campeã para todas as tarefas — existe
          uma melhor ordem para começar.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-5" role="group" aria-label="Escolha uma ferramenta para comparar">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const active = tool.id === selected.id;
            return (
              <button
                key={tool.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(tool.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active ? "border-primary bg-primary/10 shadow-glow" : "bg-card hover:border-primary/50"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="mt-3 block font-display text-sm">{tool.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{tool.short}</span>
              </button>
            );
          })}
        </div>

        <article className="mt-4 rounded-3xl border bg-card p-6 md:p-8" aria-live="polite">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <SelectedIcon className="h-6 w-6" />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{selected.eyebrow}</p>
              </div>
              <h3 className="mt-5 text-2xl md:text-3xl">{selected.name}</h3>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{selected.description}</p>
              <ul className="mt-6 space-y-3">
                {selected.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              {selected.id === "lovable" && (
                <a
                  href={LOVABLE_INVITE}
                  target="_blank"
                  rel="sponsored noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow transition hover:opacity-90"
                >
                  Criar meu projeto pelo convite <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
            <aside className="space-y-4 lg:border-l lg:pl-8">
              <div className="rounded-2xl bg-secondary/70 p-5">
                <Lightbulb className="h-5 w-5 text-primary" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">Melhor momento</p>
                <p className="mt-2 text-sm leading-relaxed">{selected.bestFor}</p>
              </div>
              <div className="rounded-2xl border p-5">
                <Database className="h-5 w-5 text-primary" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">Olho de dono</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.attention}</p>
              </div>
            </aside>
          </div>
        </article>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Rocket,
            title: "1. Comece no Lovable",
            text: "Pegue o prompt inicial da biblioteca e adapte os campos ao seu negócio.",
          },
          {
            icon: BrainCircuit,
            title: "2. Refine com um copiloto",
            text: "Use Claude, ChatGPT ou Gemini para pensar nas regras e revisar decisões.",
          },
          {
            icon: Workflow,
            title: "3. Automatize depois",
            text: "Quando o fluxo funcionar, conecte serviços e elimine as tarefas repetitivas.",
          },
        ].map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-2xl border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-display text-sm">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
