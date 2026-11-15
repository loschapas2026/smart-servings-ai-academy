import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { readPaymentsEnv } from "@/lib/stripe";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return { session, ready };
}

export function useAccount() {
  const { session } = useSession();
  const uid = session?.user.id;
  return useQuery({
    queryKey: ["account", uid],
    enabled: !!uid,
    queryFn: async () => {
      const [p, r, s] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid!).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", uid!),
        supabase.from("subscriptions").select("*").eq("user_id", uid!).eq("environment", readPaymentsEnv()).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      const sub = s.data;
      const active = !!sub && sub.status === "ativa" && (!sub.current_period_end || new Date(sub.current_period_end) > new Date());
      return {
        user: session!.user,
        profile: p.data,
        isAdmin: (r.data ?? []).some((x) => x.role === "admin"),
        subscription: sub,
        active,
      };
    },
  });
}
