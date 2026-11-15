import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createMeeting, runNotificationsNow, sendBroadcast } from "@/lib/notify.functions";

const inp = "w-full rounded-xl border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary";
const STATUS_COLOR: Record<string, string> = { falhou: "text-destructive", lido: "text-primary", entregue: "text-primary" };
type R = { queued?: number; sent?: number; failed?: number; created?: number };

export function WhatsAppPanel() {
  const qc = useQueryClient();
  const broadcastFn = useServerFn(sendBroadcast);
  const meetingFn = useServerFn(createMeeting);
  const runFn = useServerFn(runNotificationsNow);
  const [msg, setMsg] = useState({ type: "aviso" as "aviso" | "pagamento", message: "", audience: "ativos" as "ativos" | "todos" });
  const [meet, setMeet] = useState({ title: "", starts_at: "", link: "", announce: true });
  const [busy, setBusy] = useState(false);

  const { data: log = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await supabase.from("notifications").select("id,type,to_phone,body,status,error,created_at").order("created_at", { ascending: false }).limit(50)).data ?? [],
  });
  const { data: meetings = [] } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => (await supabase.from("live_meetings").select("*").order("starts_at", { ascending: false }).limit(10)).data ?? [],
  });

  const run = async (fn: () => Promise<R>, ok: (r: R) => string) => {
    setBusy(true);
    try { const r = await fn(); toast.success(ok(r)); qc.invalidateQueries(); }
    catch (e) { toast.error((e as Error).message); }
    setBusy(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form className="space-y-3 rounded-2xl border bg-card p-6" onSubmit={(e) => { e.preventDefault(); run(() => broadcastFn({ data: msg }), (r) => `${r.queued} na fila · ${r.sent} enviadas · ${r.failed} com erro`); }}>
        <h2 className="text-lg">Enviar aviso</h2>
        <div className="flex gap-2">
          <select className={inp} value={msg.type} onChange={(e) => setMsg({ ...msg, type: e.target.value as typeof msg.type })}><option value="aviso">Aviso geral</option><option value="pagamento">Pagamento</option></select>
          <select className={inp} value={msg.audience} onChange={(e) => setMsg({ ...msg, audience: e.target.value as typeof msg.audience })}><option value="ativos">Assinantes ativos</option><option value="todos">Todos cadastrados</option></select>
        </div>
        <textarea className={inp} rows={4} required placeholder="Mensagem" value={msg.message} onChange={(e) => setMsg({ ...msg, message: e.target.value })} />
        <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground">Enviar no WhatsApp</button>
      </form>

      <form className="space-y-3 rounded-2xl border bg-card p-6" onSubmit={(e) => { e.preventDefault(); run(() => meetingFn({ data: meet }), (r) => `Reunião criada · ${r.queued} avisos na fila`); setMeet({ title: "", starts_at: "", link: "", announce: true }); }}>
        <h2 className="text-lg">Reunião ao vivo</h2>
        <input className={inp} required placeholder="Título" value={meet.title} onChange={(e) => setMeet({ ...meet, title: e.target.value })} />
        <input className={inp} required type="datetime-local" value={meet.starts_at} onChange={(e) => setMeet({ ...meet, starts_at: e.target.value })} />
        <input className={inp} placeholder="Link (Meet, Zoom…)" value={meet.link} onChange={(e) => setMeet({ ...meet, link: e.target.value })} />
        <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={meet.announce} onChange={(e) => setMeet({ ...meet, announce: e.target.checked })} /> Avisar assinantes agora (lembrete automático ~1h antes)</label>
        <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground">Agendar reunião</button>
        {meetings.length > 0 && <ul className="space-y-1 pt-2 text-sm text-muted-foreground">{meetings.map((m) => <li key={m.id}>• {m.title} — {new Date(m.starts_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</li>)}</ul>}
      </form>

      <div className="lg:col-span-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="mr-auto text-lg">Histórico de mensagens</h2>
          <button disabled={busy} onClick={() => run(() => runFn(), (r) => `${r.created} lembretes criados · ${r.sent} enviadas`)} className="rounded-full border border-primary px-4 py-1.5 text-sm text-primary">Processar lembretes agora</button>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border">
          {log.length === 0 ? <p className="p-6 text-muted-foreground">Nenhuma mensagem ainda.</p> : (
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-muted-foreground"><tr><th className="p-3">Quando</th><th className="p-3">Tipo</th><th className="p-3">Para</th><th className="p-3">Mensagem</th><th className="p-3">Status</th></tr></thead>
              <tbody>{log.map((n) => (
                <tr key={n.id} className="border-t align-top">
                  <td className="whitespace-nowrap p-3">{new Date(n.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
                  <td className="p-3">{n.type}</td><td className="p-3 font-mono text-xs">{n.to_phone}</td>
                  <td className="max-w-xs p-3"><p className="line-clamp-2">{n.body}</p></td>
                  <td className={`p-3 ${STATUS_COLOR[n.status] ?? ""}`}>{n.status}{n.error && <p className="text-xs text-destructive">{n.error}</p>}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
