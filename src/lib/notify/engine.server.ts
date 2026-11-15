import { DUE_REMINDER_DAYS, dueMessage, meetingMessage, normalizePhone } from "./templates";

type Admin = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];
type NotifType = "vencimento" | "reuniao" | "aviso" | "pagamento";

const GATEWAY = "https://connector-gateway.lovable.dev/twilio";

/** Sends one WhatsApp message through the Twilio connector. Returns Twilio's message SID. */
export async function sendWhatsApp(to: string, body: string, origin: string) {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const twilioKey = process.env["TWILIO_API_KEY"];
  const from = process.env["TWILIO_WHATSAPP_FROM"];
  if (!lovableKey || !twilioKey || !from) throw new Error("WhatsApp ainda não conectado (conta Twilio ou número remetente ausente)");
  const params = new URLSearchParams({
    To: `whatsapp:${to}`,
    From: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
    Body: body,
  });
  const token = process.env["TWILIO_STATUS_TOKEN"];
  if (token && origin.startsWith("https://")) params.set("StatusCallback", `${origin}/api/public/twilio/status?t=${token}`);
  const res = await fetch(`${GATEWAY}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": twilioKey, "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Twilio [${res.status}]: ${text.slice(0, 300)}`);
  return (JSON.parse(text) as { sid: string }).sid;
}

/** Queues a message per recipient. Duplicate dedupe keys are ignored. */
export async function enqueue(admin: Admin, rows: { user_id: string; phone: string | null; type: NotifType; body: string; dedupe_key?: string; scheduled_for?: string }[]) {
  const valid = rows
    .map((r) => ({ ...r, to: normalizePhone(r.phone) }))
    .filter((r) => r.to)
    .map((r) => ({ user_id: r.user_id, to_phone: r.to!, type: r.type, body: r.body, dedupe_key: r.dedupe_key ?? null, scheduled_for: r.scheduled_for ?? new Date().toISOString() }));
  if (!valid.length) return 0;
  const { error, data } = await admin.from("notifications").upsert(valid, { onConflict: "dedupe_key", ignoreDuplicates: true }).select("id");
  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}

async function recipients(admin: Admin, audience: "ativos" | "todos") {
  const { data: profiles, error } = await admin.from("profiles").select("id, full_name, phone, whatsapp_opt_in").eq("whatsapp_opt_in", true).not("phone", "is", null);
  if (error) throw new Error(error.message);
  if (audience === "todos") return profiles ?? [];
  const { data: subs } = await admin.from("subscriptions").select("user_id, current_period_end").eq("status", "ativa");
  const now = Date.now();
  const active = new Set((subs ?? []).filter((s) => !s.current_period_end || new Date(s.current_period_end).getTime() > now).map((s) => s.user_id));
  return (profiles ?? []).filter((p) => active.has(p.id));
}

export async function broadcast(admin: Admin, type: NotifType, message: string, audience: "ativos" | "todos") {
  const list = await recipients(admin, audience);
  return enqueue(admin, list.map((p) => ({ user_id: p.id, phone: p.phone, type, body: message })));
}

export async function announceMeeting(admin: Admin, meetingId: string) {
  const { data: m } = await admin.from("live_meetings").select("*").eq("id", meetingId).single();
  if (!m) throw new Error("Reunião não encontrada");
  const list = await recipients(admin, "ativos");
  const n = await enqueue(admin, list.map((p) => ({ user_id: p.id, phone: p.phone, type: "reuniao" as const, body: meetingMessage(m.title, new Date(m.starts_at), m.link), dedupe_key: `reuniao:${m.id}:anuncio:${p.id}` })));
  await admin.from("live_meetings").update({ announced_at: new Date().toISOString() }).eq("id", m.id);
  return n;
}

/** Creates due-date and meeting reminders that are due now (idempotent via dedupe keys). */
export async function generateScheduled(admin: Admin) {
  let created = 0;
  const today = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" }) + "T00:00:00-03:00");
  const { data: subs } = await admin.from("subscriptions").select("user_id, current_period_end").eq("status", "ativa").not("current_period_end", "is", null);
  const { data: profiles } = await admin.from("profiles").select("id, full_name, phone, whatsapp_opt_in");
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  for (const s of subs ?? []) {
    const p = byId.get(s.user_id);
    if (!p || !p.whatsapp_opt_in) continue;
    const end = new Date(s.current_period_end!);
    const endDay = new Date(end.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" }) + "T00:00:00-03:00");
    const days = Math.round((endDay.getTime() - today.getTime()) / 86400000);
    if ((DUE_REMINDER_DAYS as readonly number[]).includes(days)) {
      created += await enqueue(admin, [{ user_id: p.id, phone: p.phone, type: "vencimento", body: dueMessage(p.full_name ?? "", days, end), dedupe_key: `venc:${p.id}:${end.toISOString().slice(0, 10)}:${days}` }]);
    }
  }
  const soon = new Date(Date.now() + 90 * 60000).toISOString();
  const { data: meetings } = await admin.from("live_meetings").select("*").is("reminder_sent_at", null).gt("starts_at", new Date().toISOString()).lte("starts_at", soon);
  for (const m of meetings ?? []) {
    const list = await recipients(admin, "ativos");
    created += await enqueue(admin, list.map((p) => ({ user_id: p.id, phone: p.phone, type: "reuniao" as const, body: meetingMessage(m.title, new Date(m.starts_at), m.link, true), dedupe_key: `reuniao:${m.id}:lembrete:${p.id}` })));
    await admin.from("live_meetings").update({ reminder_sent_at: new Date().toISOString() }).eq("id", m.id);
  }
  return created;
}

/** Sends queued messages. Failed sends retry up to 3 attempts. */
export async function processPending(admin: Admin, origin: string, limit = 50) {
  const { data: rows } = await admin.from("notifications").select("id, to_phone, body, attempts")
    .eq("status", "pendente").lte("scheduled_for", new Date().toISOString()).lt("attempts", 3)
    .order("scheduled_for").limit(limit);
  let sent = 0, failed = 0;
  for (const r of rows ?? []) {
    const { data: claimed } = await admin.from("notifications").update({ status: "enviando", attempts: r.attempts + 1 }).eq("id", r.id).eq("status", "pendente").select("id");
    if (!claimed?.length) continue;
    try {
      const sid = await sendWhatsApp(r.to_phone, r.body, origin);
      await admin.from("notifications").update({ status: "enviado", twilio_sid: sid, sent_at: new Date().toISOString(), error: null }).eq("id", r.id);
      sent++;
    } catch (e) {
      const last = r.attempts + 1 >= 3;
      await admin.from("notifications").update({ status: last ? "falhou" : "pendente", error: String((e as Error).message) }).eq("id", r.id);
      failed++;
    }
  }
  return { sent, failed };
}
