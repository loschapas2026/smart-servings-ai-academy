import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useAccount } from "@/hooks/useAccount";
import { START_STAGE, PROMPT_STAGES, placeholdersOf, stageDescription, stageOrder } from "@/lib/prompt-stages";
import { summarizePrompt } from "@/lib/prompt-summary";

export const Route = createFileRoute("/_authenticated/prompts")({
  head: () => ({
    meta: [
      { title: "Prompts para criação de sistemas — RAIOX" },
      {
        name: "description",
        content:
          "Biblioteca de prompts prontos para criar um sistema com inteligência artificial: briefing, regras, telas, construção, testes e lançamento.",
      },
    ],
  }),
  component: Prompts,
});

type Prompt = {
  thumbnail_url: string | null;
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  category: string | null;
};

const RULES = [
  "Uma tarefa por vez. Prompt pequeno e específico funciona melhor do que pedido gigante.",
  "Dê o contexto antes do pedido: o que é o sistema, quem usa e o que já existe.",
  "Preencha tudo que está entre [COLCHETES]. O que a IA não sabe, ela inventa.",
  "Peça a resposta no formato que você quer receber: tabela, lista, código ou passo a passo.",
];

export const promptsQuery = {
  queryKey: ["prompts"],
  queryFn: async () =>
    (
      await supabase
        .from("contents")
        .select("id,title,summary,body,category,thumbnail_url")
        .eq("type", "prompt")
        .eq("published", true)
        .order("category")
        .order("created_at")
    ).data ?? ([] as Prompt[]),
};

function Prompts() {
  const { data: acc } = useAccount();
  const canSee = acc?.active || acc?.isAdmin;
  const { data: items = [], isLoading } = useQuery({ ...promptsQuery, enabled: !!canSee });
  const { data: used = [] } = useQuery({
    queryKey: ["progress"],
    enabled: !!canSee,
    queryFn: async () => (await supabase.from("content_progress").select("content_id")).data?.map((d) => d.content_id) ?? [],
  });
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<string>("Todas");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((p) => {
      if (stage !== "Todas" && (p.category || "Sem categoria") !== stage) return false;
      if (!needle) return true;
      return `${p.title} ${p.summary ?? ""} ${p.body ?? ""}`.toLowerCase().includes(needle);
    });
  }, [items, q, stage]);

  const groups = useMemo(() => {
    const map = new Map<string, Prompt[]>();
    for (const p of filtered) {
      const key = p.category || "Sem categoria";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return [...map.entries()].sort(
      (a, b) => stageOrder(a[0]) - stageOrder(b[0]) || a[0].localeCompare(b[0], "pt-BR"),
    );
  }, [filtered]);

  if (acc && !canSee)
    return (
      <AppShell>
        <div className="mt-10 rounded-2xl border border-primary bg-card p-8 shadow-glow">
          <h1 className="text-2xl">Sua assinatura não está ativa</h1>
          <p className="mt-2 text-muted-foreground">Escolha um plano para liberar os prompts de criação de sistemas.</p>
          <Link to="/planos" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">
            Ver planos
          </Link>
        </div>
      </AppShell>
    );

  const chips = ["Todas", ...PROMPT_STAGES.map((s) => s.label)];

  return (
    <AppShell>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Biblioteca RAIOX</p>
      <h1 className="mt-2 text-3xl md:text-5xl">Prompts para criação de sistemas</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        Prompts prontos para tirar uma ideia do papel com inteligência artificial: do briefing ao lançamento. Copie,
        preencha o que está entre colchetes e cole na sua IA.
      </p>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {RULES.map((r, i) => (
          <div key={r} className="rounded-2xl border bg-card p-4">
            <p className="font-mono text-xs text-primary">REGRA {String(i + 1).padStart(2, "0")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por assunto: banco de dados, tela de login, teste..."
          className="w-full rounded-full border bg-input/40 px-5 py-3 text-sm outline-none focus:border-primary"
        />
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => setStage(c)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                stage === c ? "border-primary bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto self-center font-mono text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "prompt" : "prompts"}
          </span>
        </div>
      </div>

      {isLoading && <p className="mt-10 font-mono text-sm text-muted-foreground">Carregando biblioteca…</p>}

      {!isLoading && groups.length === 0 && (
        <p className="mt-10 rounded-2xl border bg-card p-6 text-muted-foreground">
          Nenhum prompt com essa busca. Tente outra palavra ou volte para "Todas".
        </p>
      )}

      {groups.map(([label, list], gi) => (
        <section key={label} className={label === START_STAGE ? "mt-12 rounded-3xl border-2 border-primary bg-primary/5 p-5 shadow-glow md:p-8" : "mt-12"}>
          {label === START_STAGE && (
            <span className="mb-4 inline-block animate-pulse rounded-full bg-primary px-4 py-1 font-mono text-xs font-bold uppercase text-primary-foreground">
              ★ Comece por esse aqui
            </span>
          )}
          <div className="flex flex-wrap items-baseline gap-3 border-b pb-3">
            <h2 className="text-xl md:text-2xl">
              <span className="font-mono text-sm text-primary">{String(gi + 1).padStart(2, "0")} · </span>
              {label}
            </h2>
            <span className="font-mono text-xs text-muted-foreground">{list.length} prompts</span>
          </div>
          {stageDescription(label) && <p className="mt-3 max-w-3xl text-sm text-muted-foreground">{stageDescription(label)}</p>}
          <div className="mt-6 space-y-6">
            {list.map((p) => (
              <div key={p.id} className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
                <PromptCard p={p} used={used.includes(p.id)} />
                <PromptSummaryPanel p={p} />
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-14 rounded-2xl border border-primary bg-card p-6 shadow-glow">
        <h2 className="text-lg">Falta um prompt aqui?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A equipe do Clube do SUIT adiciona novos prompts toda semana. Diga qual tarefa está travada no seu restaurante
          e ela vira prompt.
        </p>
        <Link to="/painel" className="mt-4 inline-block rounded-full border border-primary px-5 py-2 text-sm text-primary">
          ← Voltar para o início
        </Link>
      </div>
    </AppShell>
  );
}

function PromptCard({ p, used }: { p: Prompt; used: boolean }) {
  const qc = useQueryClient();
  const [copied, setCopied] = useState(false);
  const fields = placeholdersOf(p.body);

  const copy = async () => {
    if (!p.body) return;
    await navigator.clipboard.writeText(p.body);
    setCopied(true);
    toast.success("Prompt copiado. Cole na sua IA.");
    setTimeout(() => setCopied(false), 2200);
  };

  const toggleUsed = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    if (used) await supabase.from("content_progress").delete().eq("content_id", p.id);
    else await supabase.from("content_progress").insert({ content_id: p.id, user_id: u.user.id });
    await qc.invalidateQueries({ queryKey: ["progress"] });
  };

  const img = useQuery({
    queryKey: ["prompt-img", p.thumbnail_url],
    enabled: !!p.thumbnail_url,
    staleTime: 50 * 60 * 1000,
    queryFn: async () => (await supabase.storage.from("prompt-images").createSignedUrl(p.thumbnail_url!, 3600)).data?.signedUrl ?? null,
  });

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-card p-5">
      {img.data && (
        <a href={img.data} target="_blank" rel="noreferrer" className="-mx-5 -mt-5 mb-5 block border-b">
          <img src={img.data} alt={`Resultado do prompt: ${p.title}`} className="aspect-video w-full object-cover object-top transition hover:opacity-90" loading="lazy" />
        </a>
      )}
      <div className="flex items-start gap-3">
        <div className="mr-auto">
          <h3 className="font-display text-base leading-snug">{p.title}</h3>
          {p.summary && <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>}
        </div>
        {used && <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] text-primary-foreground">USADO</span>}
      </div>

      {p.body && (
        <pre className="mt-4 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border bg-background/60 p-4 font-mono text-[13px] leading-relaxed">
          {p.body}
        </pre>
      )}

      {fields.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {fields.map((f) => (
            <span key={f} className="rounded border border-primary/50 px-2 py-0.5 font-mono text-[10px] text-primary">
              {f}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={copy}
          disabled={!p.body}
          className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-40"
        >
          {copied ? "✓ Copiado" : "Copiar prompt"}
        </button>
        <button
          onClick={toggleUsed}
          className={`rounded-full border px-4 py-2 text-sm ${used ? "border-primary text-primary" : "text-muted-foreground"}`}
        >
          {used ? "✓ Usei este prompt" : "Marcar como usado"}
        </button>
      </div>
    </article>
  );
}

function PromptSummaryPanel({ p }: { p: Prompt }) {
  const s = useMemo(() => summarizePrompt(p.body, p.summary), [p.body, p.summary]);
  const stage = stageDescription(p.category);

  return (
    <aside className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-5 xl:sticky xl:top-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Resumo</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.resumo}</p>

      {stage && <p className="mt-3 text-xs text-muted-foreground/80">Quando usar: {stage}</p>}

      {s.blocks.length > 0 && (
        <div className="mt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">O que ele cobre</p>
          <ol className="mt-2 space-y-1.5">
            {s.blocks.map((b, i) => (
              <li key={b} className="flex gap-2 text-sm text-muted-foreground">
                <span className="font-mono text-[10px] text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span>{b}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {s.fields.length > 0 && (
        <div className="mt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">O que ter em mãos</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {s.fields.length} {s.fields.length === 1 ? "campo" : "campos"} para preencher:{" "}
            {s.fields
              .slice(0, 4)
              .map((f) => (f.length > 26 ? `${f.slice(0, 25)}…` : f))
              .join(", ")}
            {s.fields.length > 4 ? ` e +${s.fields.length - 4}` : ""}.
          </p>
        </div>
      )}

      <div className="mt-5 border-t pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">Tamanho</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {s.lines} linhas · {s.words} palavras — {s.tip}.
        </p>
      </div>
    </aside>
  );
}
