import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { LessonCard, Row, CategoryCard } from "@/components/LessonCard";
import { useAccount } from "@/hooks/useAccount";
import { usePromptCategories } from "@/hooks/usePromptCategories";
import { AiLaunchGuide } from "@/components/AiLaunchGuide";
import { FoundersAiSection } from "@/components/FoundersAiSection";
import { BuildYourOwnSection } from "@/components/BuildYourOwnSection";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Prompts, Radar IA e o seu próprio sistema — RAIOX" },
      {
        name: "description",
        content: "Copie os prompts prontos, crie um prompt a partir da sua própria dor e use o Radar IA para escolher por onde começar.",
      },
      { property: "og:title", content: "Prompts, Radar IA e o seu próprio sistema — RAIOX" },
      {
        property: "og:description",
        content: "Prompts prontos para copiar, um gerador a partir da sua dor e um guia para escolher sua ferramenta de IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Painel,
});

export const contentsQuery = {
  queryKey: ["contents"],
  queryFn: async () => (await supabase.from("contents").select("id,type,title,summary,category,video_url,thumbnail_url,duration,position,created_at").eq("published", true).order("position").order("created_at")).data ?? [],
};

function Painel() {
  const { data: acc } = useAccount();
  const canSee = acc?.active || acc?.isAdmin;
  const { data: items = [] } = useQuery({ ...contentsQuery, enabled: !!canSee });
  const { order } = usePromptCategories();
  const { data: done = [] } = useQuery({
    queryKey: ["progress"], enabled: !!canSee,
    queryFn: async () => (await supabase.from("content_progress").select("content_id")).data?.map((d) => d.content_id) ?? [],
  });

  if (acc && !canSee) return (
    <AppShell>
      <div className="mt-10 rounded-2xl border border-primary bg-card p-8 shadow-glow">
        <h1 className="text-2xl">Sua assinatura não está ativa</h1>
        <p className="mt-2 text-muted-foreground">Escolha um plano para liberar os prompts e materiais.</p>
        <Link to="/planos" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Ver planos</Link>
      </div>
    </AppShell>
  );

  const prompts = items.filter((i) => i.type === "prompt");
  const promptGroups = [...new Set(prompts.map((p) => p.category || "Sem categoria"))]
    .sort((x, y) => order(x) - order(y))
    .map((cat) => [cat, prompts.filter((p) => (p.category || "Sem categoria") === cat)] as const);
  const others = [
    { t: "artigo", title: "Artigos" },
    { t: "download", title: "Materiais para baixar" },
  ];

  return (
    <AppShell>
      <section className="grid gap-3 md:grid-cols-3">
        {[
          { n: "1", t: "Copie o prompt inicial", d: "Ele cria a base do seu sistema: nome, cores, acessos e integrações.", to: "/prompts" as const, hash: undefined },
          { n: "2", t: "Crie a partir da sua dor", d: "O que dói no seu negócio vira sistema: descreva e receba o prompt do seu.", to: "/painel" as const, hash: "sua-dor" },
          { n: "3", t: "Escolha sua ferramenta de IA", d: "Veja o Radar IA no fim da página e comece pela infraestrutura certa.", to: "/painel" as const, hash: "radar" },
        ].map((s) => (
          <Link key={s.n} to={s.to} {...(s.hash ? { hash: s.hash } : {})} className="group flex gap-4 rounded-2xl border bg-card p-5 transition hover:border-primary">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">{s.n}</span>
            <div><p className="font-bold group-hover:text-primary">{s.t}</p><p className="mt-1 text-sm text-muted-foreground">{s.d}</p></div>
          </Link>
        ))}
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end gap-3">
          <div className="mr-auto">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Passo 1 · Prompts</p>
            <h2 className="mt-1 text-2xl md:text-3xl">Copie, adapte e construa</h2>
          </div>
          <Link to="/prompts" className="rounded-full border border-primary px-5 py-2 text-sm font-bold text-primary">Abrir biblioteca →</Link>
        </div>
        <Row title="Escolha uma categoria" subtitle={`${prompts.length} prompts no total`}>
          {promptGroups.map(([cat, ls], i) => <CategoryCard key={cat} label={cat} count={ls.length} cover={ls.find((x) => x.thumbnail_url) ?? ls[0]!} n={i + 1} />)}
        </Row>
      </section>

      <BuildYourOwnSection />

      <FoundersAiSection />

      {others.map(({ t, title }) => {
        const ls = items.filter((i) => i.type === t);
        return ls.length ? <Row key={t} title={title}>{ls.map((c) => <LessonCard key={c.id} c={c} done={done.includes(c.id)} />)}</Row> : null;
      })}

      <AiLaunchGuide />
    </AppShell>
  );
}
