import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ensureClaimed, resetLocalSession, stillCurrent } from "@/lib/single-session";

export function SessionGuard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      await ensureClaimed();
      if (!(await stillCurrent())) {
        resetLocalSession();
        qc.clear();
        await supabase.auth.signOut({ scope: "local" });
        toast.error("Sua conta foi acessada em outro dispositivo. Esta sessão foi encerrada.");
        navigate({ to: "/auth", replace: true });
      }
    };
    check();
    timer = setInterval(check, 20000);
    window.addEventListener("focus", check);
    const { data: sub } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_IN") check();
      if (e === "SIGNED_OUT") resetLocalSession();
    });
    return () => { clearInterval(timer); window.removeEventListener("focus", check); sub.subscription.unsubscribe(); };
  }, [navigate, qc]);
  return null;
}
