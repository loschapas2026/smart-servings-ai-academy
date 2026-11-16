<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Plan prices live only in src/lib/plans.ts (with tests in plans.test.ts); UI reads from there so prices change in one place.
- Single active session: each window stores a session id (localStorage) claimed in profiles.active_session_id; SessionGuard in __root signs out windows that lost the claim — keeps account sharing blocked.
- Access to content is enforced by RLS via has_active_subscription(); admins use has_role().
- Payments run through the built-in Stripe integration: the webhook at /api/public/payments/webhook is the only writer of subscription status, and every subscriptions/payments row carries `environment` ('sandbox' | 'live') so test purchases never count as real revenue. Reads must filter by the environment the build's client token points at (readPaymentsEnv()).
- WhatsApp notifications: every message goes through the `notifications` queue (dedupe_key for idempotency) and is sent by src/lib/notify/engine.server.ts via the Twilio connector; an hourly cron at /api/public/jobs/notifications creates due-date/meeting reminders and drains the queue; Twilio status callbacks hit /api/public/twilio/status (secret token in URL).
- Prompt categories (label, description, order) live in the prompt_categories table, managed in Admin → Prompts; contents.category stores the label (renames update prompts too). src/lib/prompt-stages.ts is only the offline fallback.
- The "Resumo" panel beside each prompt on the Prompts page is derived from the prompt text by src/lib/prompt-summary.ts (section titles, fields in brackets, size); the stored summary only overrides the first paragraph — never hand-maintain a per-prompt description elsewhere.
- AI calls that write prompts for members or admins (src/lib/build-prompt.functions.ts, src/lib/prompts.functions.ts) run on the gateway's lowest-cost chat model that still meets quality, not the default top-tier one; swap models only when the user asks for a different quality/cost balance.
