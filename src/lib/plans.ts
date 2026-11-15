export type Plan = {
  id: "mensal" | "semestral" | "anual";
  name: string;
  months: number;
  total: number;
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  { id: "mensal", name: "Mensal", months: 1, total: 69.9 },
  { id: "semestral", name: "Semestral", months: 6, total: 359.4, highlight: true },
  { id: "anual", name: "Anual", months: 12, total: 598.8 },
];

export const perMonth = (p: Plan) => Math.round((p.total / p.months) * 100) / 100;

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
