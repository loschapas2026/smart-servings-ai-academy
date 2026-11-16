import { Link } from "@tanstack/react-router";
import { PLANS, ADHESION_TIERS, perMonth, brl, type Plan } from "@/lib/plans";
import { useAdhesion } from "@/hooks/useAdhesion";

interface Props {
  signedIn?: boolean;
  active?: boolean;
  onChoose?: (plan: Plan) => void;
}

function AdhesionBox() {
  const { tier, next, left } = useAdhesion();
  const pctTaken = left === null ? 100 : Math.round(((100 - left) / 100) * 100);
  return (
    <div className="mb-6 rounded-2xl border-2 border-primary bg-primary/5 p-5 shadow-glow">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-mono text-xs uppercase text-primary">Passo 1 · Cota de adesão</p>
        <span className="rounded-full bg-primary px-3 py-0.5 font-mono text-[10px] font-bold text-primary-foreground animate-pulse">LOTE {tier.lote} · PREÇO SOBE</span>
      </div>
      <p className="mt-2 font-display text-3xl font-bold md:text-4xl">{brl(tier.total)} <span className="text-base font-normal text-muted-foreground">pagamento único de entrada</span></p>
      {left !== null && next && (
        <>
          <p className="mt-2 text-lg font-bold text-primary">Restam só {left} vagas neste valor. Depois sobe para {brl(next.total)}.</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary"><div className="h-full bg-primary" style={{ width: `${pctTaken}%` }} /></div>
        </>
      )}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {ADHESION_TIERS.map((t) => (
          <div key={t.lote} className={`rounded-xl border p-2 ${t.lote === tier.lote ? "border-primary bg-primary/10" : t.lote < tier.lote ? "opacity-40 line-through" : "opacity-70"}`}>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">{t.lote === 1 ? "100 primeiros" : t.lote === 2 ? "+100 seguintes" : "depois"}</p>
            <p className="font-display text-lg font-bold">{brl(t.total)}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Garanta o menor valor agora: a adesão é cobrada uma vez só, junto com a primeira mensalidade. Depois você paga apenas o plano escolhido abaixo.</p>
    </div>
  );
}

export function PlanCards({ signedIn = false, active = false, onChoose }: Props) {
  return (
    <div>
    <AdhesionBox />
    <p className="mb-4 font-mono text-xs uppercase text-muted-foreground">Passo 2 · Escolha sua mensalidade</p>
    <div className="grid gap-5 md:grid-cols-3">
      {PLANS.map((p) => (
        <div key={p.id} className={`relative rounded-2xl border bg-card p-7 ${p.highlight ? "border-primary shadow-glow" : ""}`}>
          {p.highlight && (
            <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 font-mono text-xs text-primary-foreground">MAIS ESCOLHIDO</span>
          )}
          <h3 className="text-lg">{p.name}</h3>
          <p className="mt-4 font-display text-4xl font-bold">{brl(perMonth(p))}<span className="text-base font-normal text-muted-foreground">/mês</span></p>
          <p className="mt-1 text-sm text-muted-foreground">
            {p.months === 1
              ? "renova todo mês"
              : p.recurring
                ? `${brl(p.total)} uma vez por ano`
                : `${brl(p.total)} em pagamento único`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {p.recurring ? "Acesso enquanto a cobrança estiver em dia." : `Acesso por ${p.months} meses, sem renovação automática.`}
          </p>

          {active ? (
            <Link to="/financeiro" className="mt-6 block w-full rounded-full border border-primary py-3 text-center font-bold text-primary">
              Assinatura ativa
            </Link>
          ) : onChoose && signedIn ? (
            <button onClick={() => onChoose(p)} className="mt-6 w-full rounded-full bg-primary py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90">
              Assinar {p.name.toLowerCase()}
            </button>
          ) : onChoose ? (
            <Link to="/auth" className="mt-6 block w-full rounded-full border border-primary py-3 text-center font-bold text-primary">
              Entrar para assinar
            </Link>
          ) : (
            <Link to="/planos" className="mt-6 block w-full rounded-full border border-primary py-3 text-center font-bold text-primary">
              Assinar {p.name.toLowerCase()}
            </Link>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}
