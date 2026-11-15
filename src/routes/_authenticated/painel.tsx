import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useAccount } from "@/hooks/useAccount";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({ meta: [{ title: "Painel — RAIOX" }, { name: "description", content: "Seus conteúdos RAIOX." }] }),
  component: Painel,
});

const TABS = [
  { id: "todos", label: "Tudo" }, { id: "video", label: "Vídeos" }, { id: "artigo", label: "Artigos" },
  { id: "prompt", label: "Prompts" }, { id: "download", label: "Downloads" },
] as const;
const LABEL: Record<string, string> = { video: "VÍDEO", artigo: "ARTIGO", prompt: "PROMPT", download: "DOWNLOAD" };

function Painel() {
  const { data: acc } = useAccount();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("todos");
  const canSee = acc?.active || acc?.isAdmin;
  const { data: items = [] } = useQuery({
    queryKey: ["contents"], enabled: !!canSee,
    queryFn: async () => (await supabase.from("contents").select("id,type,title,summary,category").eq("published", true).order("created_at")).data ?? [],
  });
  const { data: done = [] } = useQuery({
    queryKey: ["progress"], enabled: !!canSee,
    queryFn: async () => (await supabase.from("content_progress").select("content_id")).data?.map((d) => d.content_id) ?? [],
  });
  const list = tab === "todos" ? items : items.filter((i) => i.type === tab);

  return (
    <AppShell>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Olá, {acc?.profile?.full_name ?? "assinante"}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">Seu raio-x de IA</h1>
      {acc && !canSee ? (
        <div className="mt-10 rounded-2xl border border-primary bg-card p-8 shadow-glow">
          <h2 className="text-xl">Sua assinatura não está ativa</h2>
          <p className="mt-2 text-muted-foreground">Escolha um plano para liberar vídeos, artigos, prompts e materiais.</p>
          <Link to="/planos" className="mt-5 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Ver planos</Link>
        </div>
      ) : (
        <>
          {items.length > 0 && <p className="mt-3 text-muted-foreground">{done.length} de {items.length} concluídos</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`rounded-full border px-4 py-1.5 text-sm ${tab === t.id ? "border-primary text-primary" : "text-muted-foreground"}`}>{t.label}</button>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <Link key={c.id} to="/conteudo/$id" params={{ id: c.id }} className="group rounded-2xl border bg-card p-6 transition hover:border-primary">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-primary">{LABEL[c.type]}</span>
                  {done.includes(c.id) && <span className="text-primary">✓ concluído</span>}
                </div>
                <h3 className="mt-3 text-lg group-hover:text-primary">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.summary}</p>
                {c.category && <p className="mt-4 text-xs text-muted-foreground">{c.category}</p>}
              </Link>
            ))}
          </div>
        </>
      )}
    </AppShell>
  );
}
