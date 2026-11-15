import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

export const Route = createFileRoute("/api/public/jobs/notifications")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { generateScheduled, processPending } = await import("@/lib/notify/engine.server");
        const created = await generateScheduled(supabaseAdmin);
        const r = await processPending(supabaseAdmin, new URL(request.url).origin);
        return Response.json({ created, ...r });
      },
    },
  },
});
