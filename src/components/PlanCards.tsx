import { Link } from "@tanstack/react-router";
import { PLANS, ADHESION, perMonth, brl, type Plan } from "@/lib/plans";

interface Props {
  signedIn?: boolean;
  active?: boolean;
  onChoose?: (plan: Plan) => void;
}

export function PlanCards({ signedIn = false, active = false, onChoose }: Props) {
  return (
    <div>
    <div className="mb-6 rounded-2xl border border-primary/40 bg-primary/5 p-5">
      <p className="font-mono text-xs uppercase text-primary">Passo 1 · Cota de adesão</p>
      <p className="mt-1 font-display text-2xl font-bold">{brl(ADHESION.total)} <span className="text-base font-normal text-muted-foreground">pagamento único de entrada</span></p>
      <p className="mt-1 text-sm text-muted-foreground">Cobrada uma vez só, junto com a primeira mensalidade. Depois você paga apenas o plano escolhido abaixo.</p>
    </div>
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
