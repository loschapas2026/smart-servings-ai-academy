import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/conteudo/$id")({
  head: () => ({ meta: [{ title: "Conteúdo — RAIOX" }, { name: "description", content: "Conteúdo exclusivo RAIOX." }] }),
  component: Conteudo,
});

function Conteudo() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: c, isLoading } = useQuery({
    queryKey: ["content", id],
    queryFn: async () => (await supabase.from("contents").select("*").eq("id", id).maybeSingle()).data,
  });
  const { data: done } = useQuery({
    queryKey: ["progress", id],
    queryFn: async () => !!(await supabase.from("content_progress").select("content_id").eq("content_id", id).maybeSingle()).data,
  });
  const toggle = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (done) await supabase.from("content_progress").delete().eq("content_id", id);
    else await supabase.from("content_progress").insert({ content_id: id, user_id: u.user!.id });
    qc.invalidateQueries({ queryKey: ["progress"] });
  };

  return (
    <AppShell>
      <Link to="/painel" className="text-sm text-muted-foreground hover:text-primary">← Voltar</Link>
      {isLoading ? null : !c ? (
        <p className="mt-8 text-muted-foreground">Conteúdo indisponível. Verifique se sua assinatura está ativa.</p>
      ) : (
        <article className="mt-6 max-w-3xl">
          <p className="font-mono text-xs uppercase text-primary">{c.type} · {c.category}</p>
          <h1 className="mt-2 text-3xl md:text-4xl">{c.title}</h1>
          {c.summary && <p className="mt-3 text-lg text-muted-foreground">{c.summary}</p>}
          {c.video_url && (
            <div className="mt-8 aspect-video overflow-hidden rounded-2xl border">
              <iframe src={c.video_url} title={c.title} className="h-full w-full" allowFullScreen />
            </div>
          )}
          {c.body && (
            c.type === "prompt" ? (
              <div className="mt-8 rounded-2xl border border-primary bg-card p-6">
                <pre className="whitespace-pre-wrap font-mono text-sm">{c.body}</pre>
                <button onClick={() => { navigator.clipboard.writeText(c.body!); toast.success("Prompt copiado!"); }} className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">Copiar prompt</button>
              </div>
            ) : <div className="mt-8 whitespace-pre-wrap leading-relaxed">{c.body}</div>
          )}
          {c.file_url && <a href={c.file_url} target="_blank" rel="noreferrer" className="mt-8 inline-block rounded-full border border-primary px-6 py-3 font-bold text-primary">Baixar material</a>}
          <div className="mt-10">
            <button onClick={toggle} className={`rounded-full px-6 py-3 font-bold ${done ? "border border-primary text-primary" : "bg-primary text-primary-foreground"}`}>
              {done ? "✓ Concluído" : "Marcar como concluído"}
            </button>
          </div>
        </article>
      )}
    </AppShell>
  );
}
