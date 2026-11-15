/** Pure helpers for WhatsApp notifications (no I/O). */

/** Normalizes Brazilian numbers to E.164 (+55...). Returns null when invalid. */
export function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 10 || d.length === 11) d = "55" + d;
  if (!/^55\d{10,11}$/.test(d)) return null;
  return "+" + d;
}

/** Days before the due date on which subscribers get a reminder. */
export const DUE_REMINDER_DAYS = [3, 0] as const;

export function dueMessage(name: string, days: number, date: Date) {
  const d = date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const first = name?.split(" ")[0] || "tudo bem";
  return days === 0
    ? `Olá, ${first}! Sua assinatura RAIOX vence hoje (${d}). Renove para continuar com acesso às aulas e prompts.`
    : `Olá, ${first}! Sua assinatura RAIOX vence em ${days} dias (${d}). Garanta a renovação para não perder o acesso.`;
}

export function meetingMessage(title: string, startsAt: Date, link?: string | null, reminder = false) {
  const when = startsAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" });
  const head = reminder ? `⏰ Começa em breve: ${title}` : `📢 Reunião ao vivo RAIOX: ${title}`;
  return `${head}\n🗓 ${when}${link ? `\n🔗 ${link}` : ""}`;
}

const RANK: Record<string, number> = { pendente: 0, enviando: 1, enviado: 2, entregue: 3, lido: 4, falhou: 5 };

/** Maps a Twilio status to ours; returns null if it would move status backwards. */
export function nextStatus(current: string, twilio: string): string | null {
  const map: Record<string, string> = {
    queued: "enviado", sending: "enviado", sent: "enviado",
    delivered: "entregue", read: "lido", failed: "falhou", undelivered: "falhou",
  };
  const s = map[twilio];
  if (!s) return null;
  if (current === "falhou" || current === "lido") return null;
  if (s === "falhou") return s;
  return RANK[s] > RANK[current] ? s : null;
}
