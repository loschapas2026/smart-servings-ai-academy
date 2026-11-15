import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useAccount } from "@/hooks/useAccount";
import { PLANS, brl } from "@/lib/plans";

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — RAIOX" }, { name: "description", content: "Sua assinatura e pagamentos." }] }),
  component: Financeiro,
});

const STATUS: Record<string, string> = { ativa: "Ativa", pendente: "Pendente", cancelada: "Cancelada", inadimplente: "Pagamento em atraso" };
const d = (s?: string | null) => (s ? new Date(s).toLocaleDateString("pt-BR") : "—");

function Financeiro() {
  const { data: acc } = useAccount();
  const { data: pays = [] } = useQuery({
    queryKey: ["payments", acc?.user.id], enabled: !!acc,
    queryFn: async () => (await supabase.from("payments").select("*").eq("user_id", acc!.user.id).order("paid_at", { ascending: false })).data ?? [],
  });
  const sub = acc?.subscription;
  const plan = PLANS.find((p) => p.id === sub?.plan);

  return (
    <AppShell>
      <h1 className="text-3xl md:text-4xl">Financeiro</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card label="Plano">{plan?.name ?? "Nenhum"}</Card>
        <Card label="Situação"><span className={acc?.active ? "text-primary" : "text-destructive"}>{sub ? STATUS[sub.status] : "Sem assinatura"}</span></Card>
        <Card label="Próxima cobrança">{d(sub?.current_period_end)}</Card>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/planos" className="rounded-full border border-primary px-5 py-2 text-sm font-bold text-primary">{sub ? "Mudar de plano" : "Assinar agora"}</Link>
        <span className="rounded-full border px-5 py-2 text-sm text-muted-foreground">Trocar cartão e cancelar: em breve</span>
      </div>
      <h2 className="mt-12 text-xl">Histórico de pagamentos</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border">
        {pays.length === 0 ? <p className="p-6 text-muted-foreground">Nenhum pagamento ainda.</p> : (
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-muted-foreground"><tr><th className="p-4">Data</th><th className="p-4">Descrição</th><th className="p-4">Valor</th><th className="p-4">Status</th></tr></thead>
            <tbody>{pays.map((p) => (
              <tr key={p.id} className="border-t"><td className="p-4">{d(p.paid_at)}</td><td className="p-4">{p.description}</td><td className="p-4">{brl(Number(p.amount))}</td><td className="p-4 text-primary">{p.status}</td></tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border bg-card p-6"><p className="font-mono text-xs uppercase text-muted-foreground">{label}</p><p className="mt-2 font-display text-xl">{children}</p></div>;
}
