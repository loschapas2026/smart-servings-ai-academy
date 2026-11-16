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

/** Cota de adesão por lote: sobe conforme os membros entram. Cobrada uma vez, na primeira compra. */
export const ADHESION_TIERS = [
  { lote: 1, upTo: 100, total: 399, priceId: "raiox_adesao" },
  { lote: 2, upTo: 200, total: 599, priceId: "raiox_adesao_lote2" },
  { lote: 3, upTo: Infinity, total: 999, priceId: "raiox_adesao_lote3" },
] as const;
export type AdhesionTier = (typeof ADHESION_TIERS)[number];

/** Lote vigente dado quantos membros já pagaram, e quantas vagas restam nele. */
export const adhesionTier = (members: number) => {
  const tier = ADHESION_TIERS.find((t) => members < t.upTo) ?? ADHESION_TIERS[2];
  const next = ADHESION_TIERS.find((t) => t.lote === tier.lote + 1);
  return { tier, next, left: Number.isFinite(tier.upTo) ? tier.upTo - members : null };
};

/** Valor da primeira cobrança: plano + adesão do lote (0 se já pagou a adesão). */
export const firstCharge = (p: Plan, adhesion = 0) => Math.round((p.total + adhesion) * 100) / 100;

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
