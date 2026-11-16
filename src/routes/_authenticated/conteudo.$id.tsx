import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Copy, Download, Play } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { contentsQuery } from "./painel";
import { embedOf, thumbOf, withAutoplay } from "@/lib/video";

export const Route = createFileRoute("/_authenticated/conteudo/$id")({
  head: () => ({ meta: [{ title: "Aula — RAIOX" }, { name: "description", content: "Conteúdo exclusivo RAIOX." }] }),
  component: Conteudo,
});

const KIND: Record<string, string> = { video: "Aula", artigo: "Artigo", prompt: "Prompt", download: "Material" };

function Conteudo() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: c, isLoading } = useQuery({
    queryKey: ["content", id],
    queryFn: async () => (await supabase.from("contents").select("*").eq("id", id).maybeSingle()).data,
  });
  const { data: all = [] } = useQuery(contentsQuery);
  const { data: done = [] } = useQuery({
    queryKey: ["progress"],
    queryFn: async () => (await supabase.from("content_progress").select("content_id")).data?.map((d) => d.content_id) ?? [],
  });
  const isDone = done.includes(id);
  const siblings = all.filter((x) => x.type === c?.type);
  const idx = siblings.findIndex((x) => x.id === id);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];

  const toggle = async (advance = false) => {
    const { data: u } = await supabase.auth.getUser();
    if (isDone && !advance) await supabase.from("content_progress").delete().eq("content_id", id);
    else if (!isDone) await supabase.from("content_progress").insert({ content_id: id, user_id: u.user!.id });
    await qc.invalidateQueries({ queryKey: ["progress"] });
    if (advance && next) navigate({ to: "/conteudo/$id", params: { id: next.id } });
  };

  if (isLoading) return (
    <AppShell>
      <div className="grid animate-pulse gap-6 lg:grid-cols-[1fr_340px]">
        <div><div className="aspect-video rounded-2xl bg-secondary" /><div className="mt-6 h-8 w-2/3 rounded bg-secondary" /></div>
        <div className="hidden h-96 rounded-2xl bg-secondary lg:block" />
      </div>
    </AppShell>
  );
  if (!c) return <AppShell><p className="text-muted-foreground">Conteúdo indisponível. Verifique se sua assinatura está ativa.</p></AppShell>;

  const embed = embedOf(c.video_url);
  const modules = [...new Set(siblings.map((v) => v.category || "Aulas"))];
  const kind = KIND[c.type] ?? "Conteúdo";
  const doneCount = siblings.filter((v) => done.includes(v.id)).length;
  const pct = siblings.length ? Math.round((doneCount / siblings.length) * 100) : 0;

  return (
    <AppShell>
      <Link to="/painel" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Voltar para o início</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          {embed ? (
            <div className="aspect-video overflow-hidden rounded-2xl border bg-black shadow-glow">
              <Player key={id} embed={embed} poster={thumbOf(c)} title={c.title} />
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase text-muted-foreground">
            {c.category && <span className="text-primary">{c.category}</span>}
            {idx >= 0 && <span>{kind} {idx + 1} de {siblings.length}</span>}
            {c.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>}
          </div>
          <h1 className="mt-2 text-2xl leading-tight md:text-3xl">{c.title}</h1>
          {c.summary && <p className="mt-3 text-lg text-muted-foreground">{c.summary}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-y py-4">
            <button onClick={() => toggle(false)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${isDone ? "border border-primary text-primary" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
              <Check className="h-4 w-4" strokeWidth={3} /> {isDone ? "Concluída" : "Marcar como concluída"}
            </button>
            <div className="ml-auto flex gap-2">
              {prev && <Link to="/conteudo/$id" params={{ id: prev.id }} className="inline-flex items-center gap-1 rounded-full border px-4 py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary"><ChevronLeft className="h-4 w-4" /> Anterior</Link>}
              {next && <button onClick={() => toggle(true)} className="inline-flex items-center gap-1 rounded-full border border-primary px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground">Concluir e avançar <ChevronRight className="h-4 w-4" /></button>}
            </div>
          </div>

          {c.body && (c.type === "prompt" ? (
            <div className="mt-6 rounded-2xl border border-primary bg-card p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm">{c.body}</pre>
              <button onClick={() => { navigator.clipboard.writeText(c.body!); toast.success("Prompt copiado!"); }} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground"><Copy className="h-4 w-4" /> Copiar prompt</button>
            </div>
          ) : <div className="mt-6 whitespace-pre-wrap leading-relaxed">{c.body}</div>)}
          {c.file_url && <a href={c.file_url} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 font-bold text-primary"><Download className="h-4 w-4" /> Baixar material</a>}

          {next && (
            <Link to="/conteudo/$id" params={{ id: next.id }} className="group mt-8 flex items-center gap-4 rounded-2xl border bg-card p-4 transition hover:border-primary">
              {thumbOf(next) && <img src={thumbOf(next)!} alt="" loading="lazy" className="aspect-video w-28 shrink-0 rounded-lg object-cover md:w-36" />}
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase text-muted-foreground">A seguir</p>
                <p className="mt-1 line-clamp-2 font-bold group-hover:text-primary">{next.title}</p>
                {next.duration && <p className="mt-1 font-mono text-xs text-muted-foreground">{next.duration}</p>}
              </div>
              <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          )}
        </div>

        <aside className="h-fit overflow-hidden rounded-2xl border bg-card lg:sticky lg:top-20">
          <div className="border-b p-4">
            <p className="font-display text-sm">Conteúdo do curso</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{doneCount} de {siblings.length} concluídas · {pct}%</p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {modules.map((m, mi) => <ModuleBlock key={m} title={`Módulo ${mi + 1} · ${m}`} items={siblings.filter((v) => (v.category || "Aulas") === m)} current={id} done={done} />)}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

/** Shows the lesson cover with a play button; the video player only loads after the click. */
function Player({ embed, poster, title }: { embed: string; poster: string | null; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing || !poster) {
    return <iframe src={playing ? withAutoplay(embed) : embed} title={title} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />;
  }
  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={`Assistir: ${title}`} className="group relative block h-full w-full">
      <img src={poster} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
      <span className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition group-hover:scale-110 md:h-20 md:w-20">
        <Play className="h-7 w-7 translate-x-0.5 fill-current md:h-8 md:w-8" />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-4 text-left font-display text-sm text-white md:p-6 md:text-lg">{title}</span>
    </button>
  );
}

function ModuleBlock({ title, items, current, done }: { title: string; items: { id: string; title: string; duration: string | null }[]; current: string; done: string[] }) {
  const hasCurrent = items.some((i) => i.id === current);
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? hasCurrent;
  const d = items.filter((i) => done.includes(i.id)).length;
  return (
    <div className="border-b last:border-b-0">
      <button onClick={() => setManual(!open)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-secondary/40">
        <div className="mr-auto"><p className="text-sm font-bold">{title}</p><p className="font-mono text-xs text-muted-foreground">{d}/{items.length} concluídas</p></div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && items.map((l, i) => {
        const isCurrent = l.id === current;
        const isDone = done.includes(l.id);
        return (
          <Link key={l.id} to="/conteudo/$id" params={{ id: l.id }} className={`flex items-center gap-3 border-l-2 px-4 py-3 text-sm ${isCurrent ? "border-primary bg-secondary text-primary" : "border-transparent hover:bg-secondary/50"}`}>
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] ${isDone ? "border-primary bg-primary text-primary-foreground" : isCurrent ? "border-primary" : "text-muted-foreground"}`}>
              {isDone ? <Check className="h-3 w-3" strokeWidth={3} /> : isCurrent ? <Play className="h-2.5 w-2.5 fill-current" /> : i + 1}
            </span>
            <span className="mr-auto line-clamp-2">{l.title}</span>
            {l.duration && <span className="font-mono text-xs text-muted-foreground">{l.duration}</span>}
          </Link>
        );
      })}
    </div>
  );
}
