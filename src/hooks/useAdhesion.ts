import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { readPaymentsEnv } from "@/lib/stripe";
import { adhesionTier } from "@/lib/plans";

export function useAdhesion() {
  const q = useQuery({
    queryKey: ["adhesion-members"],
    queryFn: async () => {
      const { data } = await supabase.rpc("adhesion_members_count", { _env: readPaymentsEnv() });
      return data ?? 0;
    },
  });
  return { members: q.data ?? 0, ...adhesionTier(q.data ?? 0) };
}
