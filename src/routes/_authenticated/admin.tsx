import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useAccount } from "@/hooks/useAccount";
import { PLANS, brl, periodEnd } from "@/lib/plans";
import { readPaymentsEnv } from "@/lib/stripe";
import { WhatsAppPanel } from "@/components/admin/WhatsAppPanel";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — RAIOX" }, { name: "description", content: "Painel administrativo RAIOX." }] }),
  component: Admin,
});

const inp = "w-full rounded-xl border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary";

function Admin() {
  const { data: acc, isLoading } = useAccount();
  const [tab, setTab] = useState<"geral" | "assinantes" | "conteudo" | "whatsapp">("geral");
  if (isLoading) return <AppShell>{null}</AppShell>;
  if (!acc?.isAdmin) return <AppShell><p className="text-muted-foreground">Acesso restrito à equipe do Clube do SUIT.</p></AppShell>;
  return (
    <AppShell>
      <h1 className="text-3xl md:text-4xl">Admin</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {(["geral", "assinantes", "conteudo", "whatsapp"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full border px-4 py-1.5 text-sm capitalize ${tab === t ? "border-primary text-primary" : "text-muted-foreground"}`}>
            {t === "geral" ? "Visão geral" : t === "conteudo" ? "Conteúdo" : t === "whatsapp" ? "WhatsApp" : "Assinantes"}
          </button>
        ))}
      </div>
      <div className="mt-8">{tab === "geral" ? <Overview /> : tab === "assinantes" ? <Subscribers /> : tab === "whatsapp" ? <WhatsAppPanel /> : <Contents />}</div>
    </AppShell>
  );
}

function useAdminData() {
  return useQuery({
    queryKey: ["admin-data"],
    queryFn: async () => {
      const [p, s, pay] = await Promise.all([
        supabase.from("profiles").select("id,full_name,restaurant_name,email,phone,created_at").order("created_at", { ascending: false }),
        supabase.from("subscriptions").select("*"),
        supabase.from("payments").select("*"),
      ]);
      const ids = new Set((p.data ?? []).map((x) => x.id));
      // Ignore records of accounts that no longer exist
      return { profiles: p.data ?? [], subs: (s.data ?? []).filter((x) => ids.has(x.user_id)), pays: (pay.data ?? []).filter((x) => ids.has(x.user_id)) };
    },
  });
}

function Overview() {
  const { data } = useAdminData();
  if (!data) return null;
  const now = new Date();
  const ativos = data.subs.filter((s) => s.status === "ativa" && (!s.current_period_end || new Date(s.current_period_end) > now)).length;
  const inad = data.subs.filter((s) => s.status === "inadimplente").length;
  const receita = data.pays.filter((p) => p.status === "pago").reduce((a, p) => a + Number(p.amount), 0);
  const mes = data.pays.filter((p) => p.status === "pago" && new Date(p.paid_at).getMonth() === now.getMonth() && new Date(p.paid_at).getFullYear() === now.getFullYear()).reduce((a, p) => a + Number(p.amount), 0);
  const stats = [["Cadastrados", data.profiles.length], ["Assinantes ativos", ativos], ["Inadimplentes", inad], ["Receita no mês", brl(mes)], ["Receita total", brl(receita)]];
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {stats.map(([l, v]) => (
        <div key={l} className="rounded-2xl border bg-card p-6"><p className="font-mono text-xs uppercase text-muted-foreground">{l}</p><p className="mt-2 font-display text-2xl text-primary">{v}</p></div>
      ))}
    </div>
  );
}

function Subscribers() {
  const { data } = useAdminData();
  const qc = useQueryClient();
  const activate = async (userId: string, planId: string) => {
    const plan = PLANS.find((p) => p.id === planId)!;
    const env = readPaymentsEnv();
    const { error } = await supabase.from("subscriptions").upsert({ user_id: userId, plan: plan.id, status: "ativa", current_period_end: periodEnd(plan).toISOString(), environment: env, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) { toast.error(error.message); return; }
    await supabase.from("payments").insert({ user_id: userId, amount: plan.total, description: `Plano ${plan.name} (manual)`, status: "pago", environment: env });
    toast.success("Acesso liberado."); qc.invalidateQueries();
  };
  const setStatus = async (userId: string, status: "cancelada" | "inadimplente") => {
    await supabase.from("subscriptions").update({ status, updated_at: new Date().toISOString() }).eq("user_id", userId);
    toast.success("Assinatura atualizada."); qc.invalidateQueries();
  };
  if (!data) return null;
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-left text-muted-foreground"><tr><th className="p-4">Cliente</th><th className="p-4">Plano</th><th className="p-4">Situação</th><th className="p-4">Vence</th><th className="p-4">Ações</th></tr></thead>
        <tbody>{data.profiles.map((p) => {
          const s = data.subs.find((x) => x.user_id === p.id);
          return (
            <tr key={p.id} className="border-t align-top">
              <td className="p-4"><p className="font-bold">{p.full_name ?? "—"}</p><p className="text-muted-foreground">{p.email}</p><p className="text-xs text-muted-foreground">{p.restaurant_name}</p>{p.phone && <p className="font-mono text-xs text-muted-foreground">{p.phone}</p>}</td>
              <td className="p-4">{s?.plan ?? "—"}</td>
              <td className="p-4">{s?.status ?? "sem assinatura"}</td>
              <td className="p-4">{s?.current_period_end ? new Date(s.current_period_end).toLocaleDateString("pt-BR") : "—"}</td>
              <td className="p-4">
                <div className="flex flex-wrap gap-2">
                  <select defaultValue="" onChange={(e) => { if (e.target.value) activate(p.id, e.target.value); e.target.value = ""; }} className="rounded-full border bg-card px-3 py-1">
                    <option value="">Liberar plano…</option>
                    {PLANS.map((pl) => <option key={pl.id} value={pl.id}>{pl.name}</option>)}
                  </select>
                  {s && s.status === "ativa" && <>
                    <button onClick={() => setStatus(p.id, "inadimplente")} className="rounded-full border px-3 py-1">Inadimplente</button>
                    <button onClick={() => setStatus(p.id, "cancelada")} className="rounded-full border border-destructive px-3 py-1 text-destructive">Cancelar</button>
                  </>}
                </div>
              </td>
            </tr>
          );
        })}</tbody>
      </table>
    </div>
  );
}

const EMPTY = { type: "video" as "video" | "artigo" | "prompt" | "download", title: "", summary: "", body: "", video_url: "", file_url: "", category: "", thumbnail_url: "", duration: "", position: 0 };

function Contents() {
  const qc = useQueryClient();
  const [f, setF] = useState(EMPTY);
  const { data: items = [] } = useQuery({
    queryKey: ["admin-contents"],
    queryFn: async () => (await supabase.from("contents").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("contents").insert({ ...f, video_url: f.video_url || null, file_url: f.file_url || null, thumbnail_url: f.thumbnail_url || null, duration: f.duration || null });
    if (error) { toast.error(error.message); return; }
    toast.success("Conteúdo publicado."); setF(EMPTY); qc.invalidateQueries();
  };
  const update = async (id: string, patch: { published?: boolean }) => { await supabase.from("contents").update(patch).eq("id", id); qc.invalidateQueries(); };
  const remove = async (id: string) => { if (!confirm("Excluir este conteúdo?")) return; await supabase.from("contents").delete().eq("id", id); qc.invalidateQueries(); };

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <form onSubmit={save} className="space-y-3 rounded-2xl border bg-card p-6">
        <h2 className="text-lg">Novo conteúdo</h2>
        <select className={inp} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as typeof f.type })}>
          <option value="video">Vídeo</option><option value="artigo">Artigo</option><option value="prompt">Prompt</option><option value="download">Download</option>
        </select>
        <input className={inp} placeholder="Título" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <input className={inp} placeholder={f.type === "video" ? "Módulo (ex: Fundamentos)" : f.type === "prompt" ? "Etapa (ex: Briefing e escopo, Construção, Testes e qualidade)" : "Categoria (ex: Cardápio)"} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} />
        <input className={inp} placeholder="Resumo" value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} />
        {f.type === "video" && <>
          <input className={inp} placeholder="Link do vídeo (YouTube ou Vimeo)" value={f.video_url} onChange={(e) => setF({ ...f, video_url: e.target.value })} />
          <div className="flex gap-2">
            <input className={inp} placeholder="Duração (ex: 12:30)" value={f.duration} onChange={(e) => setF({ ...f, duration: e.target.value })} />
            <input className={inp} type="number" placeholder="Ordem" value={f.position} onChange={(e) => setF({ ...f, position: Number(e.target.value) })} />
          </div>
          <input className={inp} placeholder="Link da capa (opcional)" value={f.thumbnail_url} onChange={(e) => setF({ ...f, thumbnail_url: e.target.value })} />
        </>}
        {f.type === "download" && <input className={inp} placeholder="Link do arquivo" value={f.file_url} onChange={(e) => setF({ ...f, file_url: e.target.value })} />}
        <textarea className={inp} rows={6} placeholder={f.type === "prompt" ? "Texto do prompt" : "Texto"} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
        <button className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground">Publicar</button>
      </form>
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4">
            <span className="font-mono text-xs uppercase text-primary">{c.type}</span>
            <p className="mr-auto font-bold">{c.title}</p>
            <button onClick={() => update(c.id, { published: !c.published })} className="rounded-full border px-3 py-1 text-xs">{c.published ? "Publicado" : "Rascunho"}</button>
            <button onClick={() => remove(c.id)} className="rounded-full border border-destructive px-3 py-1 text-xs text-destructive">Excluir</button>
          </div>
        ))}
      </div>
    </div>
  );
}
