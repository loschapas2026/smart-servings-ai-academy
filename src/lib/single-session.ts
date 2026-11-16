import { supabase } from "@/integrations/supabase/client";

let claimedSid: string | null = null;
let claiming: Promise<void> | null = null;

/** Login session id from the access token: stable across reloads/refreshes, new on each sign-in. */
async function currentSid(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.session_id ?? null;
  } catch {
    return null;
  }
}

export function resetLocalSession() {
  claimedSid = null;
}

/** Claims this login as the user's only active session (once per sign-in). */
export async function ensureClaimed() {
  const sid = await currentSid();
  if (!sid || claimedSid === sid) return claiming ?? undefined;
  const key = `raiox_claimed_${sid}`;
  claimedSid = sid;
  if (localStorage.getItem(key)) return;
  claiming = Promise.resolve(supabase.rpc("claim_session", { _session: sid })).then(() => {
    localStorage.setItem(key, "1");
    claiming = null;
  });
  return claiming;
}

/** Returns false when another device took over this account. */
export async function stillCurrent() {
  if (claiming) await claiming;
  const sid = await currentSid();
  if (!sid) return true;
  const { data, error } = await supabase.rpc("is_current_session", { _session: sid });
  if (error) return true;
  return data === true;
}
