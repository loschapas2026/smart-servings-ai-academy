import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function adminOnly(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Acesso restrito");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}
const origin = () => new URL(getRequest().url).origin;

export const sendBroadcast = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { type: "aviso" | "pagamento"; message: string; audience: "ativos" | "todos" }) => {
    if (!d.message?.trim() || d.message.length > 1500) throw new Error("Mensagem inválida");
    return d;
  })
  .handler(async ({ data, context }) => {
    const admin = await adminOnly(context);
    const { broadcast, processPending } = await import("./notify/engine.server");
    const queued = await broadcast(admin, data.type, data.message.trim(), data.audience);
    const r = await processPending(admin, origin());
    return { queued, ...r };
  });

export const createMeeting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { title: string; starts_at: string; link?: string; announce: boolean }) => {
    if (!d.title?.trim() || isNaN(Date.parse(d.starts_at))) throw new Error("Dados inválidos");
    return d;
  })
  .handler(async ({ data, context }) => {
    const admin = await adminOnly(context);
    const { data: m, error } = await admin.from("live_meetings").insert({ title: data.title.trim(), starts_at: new Date(data.starts_at).toISOString(), link: data.link || null }).select("id").single();
    if (error) throw new Error(error.message);
    let queued = 0;
    if (data.announce) {
      const { announceMeeting, processPending } = await import("./notify/engine.server");
      queued = await announceMeeting(admin, m.id);
      await processPending(admin, origin());
    }
    return { queued };
  });

export const runNotificationsNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = await adminOnly(context);
    const { generateScheduled, processPending } = await import("./notify/engine.server");
    const created = await generateScheduled(admin);
    const r = await processPending(admin, origin());
    return { created, ...r };
  });
