import { createFileRoute } from "@tanstack/react-router";

// Twilio delivery-status callbacks. Authenticated by a secret token in the callback URL.
export const Route = createFileRoute("/api/public/twilio/status")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["TWILIO_STATUS_TOKEN"];
        const got = new URL(request.url).searchParams.get("t");
        if (!expected || got !== expected) return new Response("Unauthorized", { status: 401 });
        const form = await request.formData();
        const sid = String(form.get("MessageSid") ?? "");
        const twStatus = String(form.get("MessageStatus") ?? "");
        if (!sid) return new Response("ok");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { nextStatus } = await import("@/lib/notify/templates");
        const { data: row, error } = await supabaseAdmin.from("notifications").select("id,status").eq("twilio_sid", sid).maybeSingle();
        if (error) return new Response("db error", { status: 500 });
        if (!row) return new Response("ok");
        const s = nextStatus(row.status, twStatus);
        if (s) {
          const now = new Date().toISOString();
          const patch = {
            status: s as "enviado" | "entregue" | "lido" | "falhou",
            ...(s === "entregue" ? { delivered_at: now } : {}),
            ...(s === "lido" ? { read_at: now } : {}),
            ...(s === "falhou" ? { error: `Twilio: ${form.get("ErrorCode") ?? twStatus}` } : {}),
          };
          const { error: e2 } = await supabaseAdmin.from("notifications").update(patch).eq("id", row.id);
          if (e2) return new Response("db error", { status: 500 });
        }
        return new Response("ok");
      },
    },
  },
});
