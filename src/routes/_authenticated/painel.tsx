import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { LessonCard, Row } from "@/components/LessonCard";
import { useAccount } from "@/hooks/useAccount";
import { thumbOf } from "@/lib/video";
import { AiLaunchGuide } from "@/components/AiLaunchGuide";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Radar IA e seus conteúdos — RAIOX" },
      {
        name: "description",
        content: "Entenda os tipos de IA, escolha por onde começar e construímos sua primeira solução com Lovable, prompts e automação.",
      },
      { property: "og:title", content: "Radar IA e seus conteúdos — RAIOX" },
      {
        property: "og:description",
        content: "Um guia visual para escolher sua primeira ferramenta de IA e tirar um sistema do papel.",
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
  const { data: done = [] } = useQuery({
    queryKey: ["progress"], enabled: !!canSee,
    queryFn: async () => (await supabase.from("content_progress").select("content_id")).data?.map((d) => d.content_id) ?? [],
  });

  if (acc && !canSee) return (
    <AppShell>
      <div className="mt-10 rounded-2xl border border-primary bg-card p-8 shadow-glow">
        <h1 className="text-2xl">Sua assinatura não está ativa</h1>
        <p className="mt-2 text-muted-foreground">Escolha um plano para liberar as aulas, prompts e materiais.</p>
        <Link to="/planos" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Ver planos</Link>
      </div>
    </AppShell>
  );

  const videos = items.filter((i) => i.type === "video");
  const modules = [...new Set(videos.map((v) => v.category || "Aulas"))];
  const next = videos.find((v) => !done.includes(v.id)) ?? videos[0];
  const pct = videos.length ? Math.round((videos.filter((v) => done.includes(v.id)).length / videos.length) * 100) : 0;
  const others = [
    { t: "artigo", title: "Artigos" },
    { t: "download", title: "Materiais para baixar" },
  ];

  return (
    <AppShell>
      {next && (
        <section className="relative overflow-hidden rounded-3xl border">
          {thumbOf(next) && <img src={thumbOf(next)!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="relative max-w-xl p-8 md:p-12">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Olá, {acc?.profile?.full_name ?? "assinante"} · continue de onde parou</p>
            <h1 className="mt-3 text-2xl md:text-4xl">{next.title}</h1>
            <p className="mt-2 text-muted-foreground">{next.category}</p>
            <div className="mt-6 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary" style={{ width: `${pct}%` }} /></div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{pct}% do curso concluído</p>
            <Link to="/conteudo/$id" params={{ id: next.id }} className="mt-6 inline-block rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground shadow-glow">▶ Assistir agora</Link>
          </div>
        </section>
      )}

      {modules.map((m, mi) => {
        const ls = videos.filter((v) => (v.category || "Aulas") === m);
        const d = ls.filter((v) => done.includes(v.id)).length;
        return (
          <Row key={m} title={`Módulo ${mi + 1} · ${m}`} subtitle={`${d}/${ls.length} aulas`}>
            {ls.map((c, i) => <LessonCard key={c.id} c={c} index={i + 1} done={done.includes(c.id)} />)}
          </Row>
        );
      })}

      <Link to="/prompts" className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-primary bg-card p-6 shadow-glow">
        <div className="mr-auto">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Biblioteca</p>
          <h2 className="mt-1 text-lg md:text-xl">Prompts para criação de sistemas</h2>
          <p className="mt-1 text-sm text-muted-foreground">Do briefing ao lançamento: prompts prontos para criar seu sistema com IA.</p>
        </div>
        <span className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">Abrir biblioteca →</span>
      </Link>

      {others.map(({ t, title }) => {
        const ls = items.filter((i) => i.type === t);
        return ls.length ? <Row key={t} title={title}>{ls.map((c) => <LessonCard key={c.id} c={c} done={done.includes(c.id)} />)}</Row> : null;
      })}
    </AppShell>
  );
}
