import { PLANS, perMonth, brl } from "@/lib/plans";

export function PlanCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {PLANS.map((p) => (
        <div key={p.id} className={`relative rounded-2xl border bg-card p-7 ${p.highlight ? "border-primary shadow-glow" : ""}`}>
          {p.highlight && (
            <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 font-mono text-xs text-primary-foreground">MAIS ESCOLHIDO</span>
          )}
          <h3 className="text-lg">{p.name}</h3>
          <p className="mt-4 font-display text-4xl font-bold">{brl(perMonth(p))}<span className="text-base font-normal text-muted-foreground">/mês</span></p>
          <p className="mt-1 text-sm text-muted-foreground">
            {p.months === 1 ? "cobrado todo mês" : `${brl(p.total)} a cada ${p.months} meses`}
          </p>
          <button disabled className="mt-6 w-full rounded-full border border-primary py-3 font-bold text-primary opacity-70">
            Em breve
          </button>
        </div>
      ))}
    </div>
  );
}
