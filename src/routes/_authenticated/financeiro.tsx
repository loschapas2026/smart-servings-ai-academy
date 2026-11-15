import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useAccount } from "@/hooks/useAccount";
import { PLANS, brl } from "@/lib/plans";
import { WhatsAppSettings } from "@/components/WhatsAppSettings";
import { createPortalSession } from "@/lib/payments.functions";
import { readPaymentsEnv } from "@/lib/stripe";

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — RAIOX" }, { name: "description", content: "Sua assinatura e pagamentos." }] }),
  validateSearch: (search: Record<string, unknown>): { checkout?: string } =>
    typeof search["checkout"] === "string" ? { checkout: search["checkout"] } : {},
  component: Financeiro,
});

const STATUS: Record<string, string> = { ativa: "Ativa", pendente: "Pendente", cancelada: "Cancelada", inadimplente: "Pagamento em atraso" };
const d = (s?: string | null) => (s ? new Date(s).toLocaleDateString("pt-BR") : "—");

function Financeiro() {
  const { checkout } = Route.useSearch();
  const { data: acc } = useAccount();
  const qc = useQueryClient();
  const env = readPaymentsEnv();
  const told = useRef(false);

  useEffect(() => {
    if (checkout !== "ok" || told.current) return;
    told.current = true;
    toast.success("Pagamento aprovado! Seu acesso já está liberado.");
    qc.invalidateQueries();
  }, [checkout, qc]);

  const { data: pays = [] } = useQuery({
    queryKey: ["payments", acc?.user.id], enabled: !!acc,
    queryFn: async () => (await supabase.from("payments").select("*").eq("user_id", acc!.user.id).order("paid_at", { ascending: false })).data ?? [],
  });
  const sub = acc?.subscription;
  const plan = PLANS.find((p) => p.id === sub?.plan);

  const openPortal = async () => {
    const r = await createPortalSession({ data: { environment: env, returnUrl: `${window.location.origin}/financeiro` } });
    if ("error" in r) { toast.error(r.error); return; }
    window.open(r.url, "_blank");
  };

  return (
    <AppShell>
      <h1 className="text-3xl md:text-4xl">Financeiro</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card label="Plano">{plan?.name ?? "Nenhum"}</Card>
        <Card label="Situação"><span className={acc?.active ? "text-primary" : "text-destructive"}>{sub ? STATUS[sub.status] : "Sem assinatura"}</span></Card>
        <Card label={plan && !plan.recurring ? "Acesso até" : "Próxima cobrança"}>{d(sub?.current_period_end)}</Card>
      </div>
      {plan && !plan.recurring && (
        <p className="mt-3 text-sm text-muted-foreground">O plano {plan.name} é um pagamento único: o acesso vale até a data acima e não renova sozinho.</p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/planos" className="rounded-full border border-primary px-5 py-2 text-sm font-bold text-primary">{sub ? "Mudar de plano" : "Assinar agora"}</Link>
        {sub?.stripe_customer_id && (
          <button onClick={openPortal} className="rounded-full border px-5 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            Trocar cartão ou cancelar
          </button>
        )}
      </div>
      <WhatsAppSettings />
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
