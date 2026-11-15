import { supabase } from "@/integrations/supabase/client";

const KEY = "raiox_sid";

export function resetLocalSession() {
  localStorage.removeItem(KEY);
}

/** Claims this window as the user's only active session (when it has none yet). */
export async function ensureClaimed() {
  if (localStorage.getItem(KEY)) return;
  const sid = crypto.randomUUID();
  localStorage.setItem(KEY, sid);
  await supabase.rpc("claim_session", { _session: sid });
}

/** Returns false when another device/window took over this account. */
export async function stillCurrent() {
  const sid = localStorage.getItem(KEY);
  if (!sid) return true;
  const { data, error } = await supabase.rpc("is_current_session", { _session: sid });
  if (error) return true;
  return data === true;
}
