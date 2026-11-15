import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { contentsQuery } from "./painel";
import { embedOf } from "@/lib/video";

export const Route = createFileRoute("/_authenticated/conteudo/$id")({
  head: () => ({ meta: [{ title: "Aula — RAIOX" }, { name: "description", content: "Conteúdo exclusivo RAIOX." }] }),
  component: Conteudo,
});

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

  if (isLoading) return <AppShell>{null}</AppShell>;
  if (!c) return <AppShell><p className="text-muted-foreground">Conteúdo indisponível. Verifique se sua assinatura está ativa.</p></AppShell>;

  const embed = embedOf(c.video_url);
  const modules = [...new Set(siblings.map((v) => v.category || "Aulas"))];

  return (
    <AppShell>
      <Link to="/painel" className="text-sm text-muted-foreground hover:text-primary">← Voltar para o início</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          {embed ? (
            <div className="aspect-video overflow-hidden rounded-2xl border bg-card shadow-glow">
              <iframe key={embed} src={embed} title={c.title} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap items-start gap-4">
            <div className="mr-auto">
              <p className="font-mono text-xs uppercase text-primary">{c.category}{c.duration ? ` · ${c.duration}` : ""}</p>
              <h1 className="mt-1 text-2xl md:text-3xl">{c.title}</h1>
            </div>
            <button onClick={() => toggle(false)} className={`rounded-full px-5 py-2.5 text-sm font-bold ${isDone ? "border border-primary text-primary" : "bg-primary text-primary-foreground"}`}>
              {isDone ? "✓ Concluída" : "Marcar como concluída"}
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            {prev && <Link to="/conteudo/$id" params={{ id: prev.id }} className="rounded-full border px-5 py-2 text-sm">← Anterior</Link>}
            {next && <button onClick={() => toggle(true)} className="rounded-full border border-primary px-5 py-2 text-sm text-primary">Concluir e avançar →</button>}
          </div>
          {c.summary && <p className="mt-6 text-lg text-muted-foreground">{c.summary}</p>}
          {c.body && (c.type === "prompt" ? (
            <div className="mt-6 rounded-2xl border border-primary bg-card p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm">{c.body}</pre>
              <button onClick={() => { navigator.clipboard.writeText(c.body!); toast.success("Prompt copiado!"); }} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">Copiar prompt</button>
            </div>
          ) : <div className="mt-6 whitespace-pre-wrap leading-relaxed">{c.body}</div>)}
          {c.file_url && <a href={c.file_url} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full border border-primary px-6 py-3 font-bold text-primary">⬇ Baixar material</a>}
        </div>

        <aside className="h-fit rounded-2xl border bg-card lg:sticky lg:top-20">
          <p className="border-b p-4 font-display text-sm">Conteúdo do curso</p>
          <div className="max-h-[70vh] overflow-y-auto">
            {modules.map((m, mi) => <ModuleBlock key={m} title={`Módulo ${mi + 1} · ${m}`} items={siblings.filter((v) => (v.category || "Aulas") === m)} current={id} done={done} />)}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function ModuleBlock({ title, items, current, done }: { title: string; items: { id: string; title: string; duration: string | null }[]; current: string; done: string[] }) {
  const [open, setOpen] = useState(items.some((i) => i.id === current));
  const d = items.filter((i) => done.includes(i.id)).length;
  return (
    <div className="border-b last:border-b-0">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 p-4 text-left">
        <div className="mr-auto"><p className="text-sm font-bold">{title}</p><p className="font-mono text-xs text-muted-foreground">{d}/{items.length} concluídas</p></div>
        <span className="text-muted-foreground">{open ? "−" : "+"}</span>
      </button>
      {open && items.map((l) => (
        <Link key={l.id} to="/conteudo/$id" params={{ id: l.id }} className={`flex items-center gap-3 px-4 py-3 text-sm ${l.id === current ? "bg-secondary text-primary" : "hover:bg-secondary/50"}`}>
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${done.includes(l.id) ? "border-primary bg-primary text-primary-foreground" : ""}`}>{done.includes(l.id) ? "✓" : ""}</span>
          <span className="mr-auto line-clamp-2">{l.title}</span>
          {l.duration && <span className="font-mono text-xs text-muted-foreground">{l.duration}</span>}
        </Link>
      ))}
    </div>
  );
}
