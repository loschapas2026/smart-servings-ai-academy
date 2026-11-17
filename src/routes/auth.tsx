import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { resetLocalSession } from "@/lib/single-session";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar — RAIOX" },
    { name: "description", content: "Acesse sua conta RAIOX." },
    { property: "og:title", content: "Entrar — RAIOX" },
    { property: "og:description", content: "Acesse sua conta RAIOX." },
  ] }),
  component: AuthPage,
});

const input = "w-full rounded-xl border bg-input/40 px-4 py-3 outline-none focus:border-primary";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [f, setF] = useState({ name: "", restaurant: "", phone: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/painel" }); });
    const { data } = supabase.auth.onAuthStateChange((e, s) => { if (e === "SIGNED_IN" && s) navigate({ to: "/painel" }); });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); resetLocalSession();
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
      if (error) toast.error("E-mail ou senha inválidos.");
    } else {
      const { error } = await supabase.auth.signUp({
        email: f.email, password: f.password,
        options: { emailRedirectTo: window.location.origin, data: { full_name: f.name, restaurant_name: f.restaurant, phone: f.phone } },
      });
      if (error) toast.error(error.message);
      else toast.success("Conta criada! Confira seu e-mail para confirmar o cadastro.");
    }
    setBusy(false);
  };

  const google = async () => {
    resetLocalSession();
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error("Não foi possível entrar com Google.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-glow">
        <Logo className="text-3xl" />
        <h1 className="mt-6 text-xl">{mode === "in" ? "Entrar na sua conta" : "Criar sua conta"}</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          {mode === "up" && <>
            <input className={input} placeholder="Seu nome" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <input className={input} placeholder="Nome do restaurante" value={f.restaurant} onChange={(e) => setF({ ...f, restaurant: e.target.value })} />
            <input className={input} type="tel" placeholder="WhatsApp com DDD" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          </>}
          <input className={input} type="email" placeholder="E-mail" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          <input className={input} type="password" placeholder="Senha" minLength={6} required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <button disabled={busy} className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground">
            {mode === "in" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <button onClick={google} className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-full border border-[#8E918F] bg-[#131314] py-3 text-sm font-medium text-[#E3E3E3]">
          <svg aria-hidden="true" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
          Continuar com Google
        </button>
        <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-5 w-full text-sm text-muted-foreground hover:text-primary">
          {mode === "in" ? "Ainda não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
        <div className="mt-6 border-t pt-5 text-center">
          <Link to="/vendas" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            Ver apresentação sem login <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
