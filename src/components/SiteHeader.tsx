import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const clientToken = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"];
const hasPaymentNotice = !clientToken || clientToken.startsWith("pk_test_");

export function SiteHeader() {
  return (
    <header className={`absolute inset-x-0 z-20 ${hasPaymentNotice ? "top-14 sm:top-9" : "top-0"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/"><Logo className="text-2xl" /></Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/suitable" className="hidden text-muted-foreground hover:text-foreground sm:inline">Parceria SUIT</Link>
          <Link to="/planos" className="text-muted-foreground hover:text-foreground">Planos</Link>
          <Link to="/painel" className="text-muted-foreground hover:text-foreground">Entrar</Link>
          <Link to="/planos" className="rounded-full bg-primary px-4 py-2 font-bold text-primary-foreground shadow-glow">Assinar</Link>
        </nav>
      </div>
    </header>
  );
}
