export type PlanId = "mensal" | "semestral" | "anual";

export type Plan = {
  id: PlanId;
  name: string;
  months: number;
  total: number;
  /** Id do preço no catálogo de pagamentos (igual no teste e no real). */
  priceId: string;
  /** true = renova sozinho; false = pagamento único com acesso por N meses. */
  recurring: boolean;
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  { id: "mensal", name: "Mensal", months: 1, total: 69.9, priceId: "raiox_mensal", recurring: true },
  { id: "semestral", name: "Semestral", months: 6, total: 359.4, priceId: "raiox_semestral", recurring: false, highlight: true },
  { id: "anual", name: "Anual", months: 12, total: 598.8, priceId: "raiox_anual", recurring: true },
];

export const planByPriceId = (priceId?: string | null): Plan | undefined =>
  PLANS.find((p) => p.priceId === priceId);

export const perMonth = (p: Plan) => Math.round((p.total / p.months) * 100) / 100;

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const periodEnd = (p: Plan, from = new Date()) => {
  const d = new Date(from);
  d.setMonth(d.getMonth() + p.months);
  return d;
};
