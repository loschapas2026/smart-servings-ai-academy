import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/useAccount";
import { resetLocalSession } from "@/lib/single-session";
import { Logo } from "./Logo";

export function AppShell({ children }: { children: ReactNode }) {
  const { data } = useAccount();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const signOut = async () => {
    await qc.cancelQueries(); qc.clear(); resetLocalSession();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  const link = "rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground";
  const active = { className: "rounded-full px-3 py-1.5 text-sm bg-secondary text-primary" };
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-5 py-3">
          <Link to="/painel" className="mr-auto"><Logo className="text-xl" /></Link>
          <Link to="/painel" className={link} activeProps={active}>Conteúdo</Link>
          <Link to="/prompts" className={link} activeProps={active}>Prompts</Link>
          <Link to="/financeiro" className={link} activeProps={active}>Financeiro</Link>
          {data?.isAdmin && <Link to="/admin" className={link} activeProps={active}>Admin</Link>}
          <button onClick={signOut} className={link}>Sair</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
