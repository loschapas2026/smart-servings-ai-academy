import { supabase } from "@/integrations/supabase/client";

const KEY = "raiox_sid";
let claiming: Promise<void> | null = null;

export function resetLocalSession() {
  localStorage.removeItem(KEY);
}

/** Claims this window as the user's only active session (once, even if called concurrently). */
export function ensureClaimed() {
  if (localStorage.getItem(KEY)) return claiming ?? Promise.resolve();
  const sid = crypto.randomUUID();
  localStorage.setItem(KEY, sid);
  claiming = supabase.rpc("claim_session", { _session: sid }).then(() => { claiming = null; });
  return claiming;
}

/** Returns false when another device/window took over this account. */
export async function stillCurrent() {
  if (claiming) await claiming;
  const sid = localStorage.getItem(KEY);
  if (!sid) return true;
  const { data, error } = await supabase.rpc("is_current_session", { _session: sid });
  if (error) return true;
  return data === true;
}
