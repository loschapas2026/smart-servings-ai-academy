import { describe, it, expect } from "vitest";
import { PLANS, perMonth, planByPriceId, adhesionTier, firstCharge } from "./plans";

describe("planos RAIOX", () => {
  it("semestral sai a R$ 59,90 por mês", () => {
    expect(perMonth(PLANS.find((p) => p.id === "semestral")!)).toBe(59.9);
  });
  it("média mensal dos três planos fica em torno de R$ 59,90", () => {
    const avg = PLANS.reduce((a, p) => a + perMonth(p), 0) / PLANS.length;
    expect(Math.abs(avg - 59.9)).toBeLessThan(1);
  });
  it("cada plano aponta para o preço certo do catálogo de pagamentos", () => {
    expect(PLANS.map((p) => p.priceId)).toEqual(["raiox_mensal", "raiox_semestral", "raiox_anual"]);
    expect(PLANS.map((p) => Math.round(p.total * 100))).toEqual([6990, 35940, 59880]);
  });
  it("mensal e anual renovam sozinhos; semestral é pagamento único", () => {
    expect(PLANS.find((p) => p.id === "mensal")!.recurring).toBe(true);
    expect(PLANS.find((p) => p.id === "anual")!.recurring).toBe(true);
    expect(PLANS.find((p) => p.id === "semestral")!.recurring).toBe(false);
  });
  it("o preço da cobrança devolve o plano certo", () => {
    expect(planByPriceId("raiox_anual")?.id).toBe("anual");
    expect(planByPriceId("raiox_inexistente")).toBeUndefined();
  });
  it("adesão: 100 primeiros R$ 399, próximos 100 R$ 599, depois R$ 999", () => {
    expect(adhesionTier(0).tier.total).toBe(399);
    expect(adhesionTier(0).left).toBe(100);
    expect(adhesionTier(99).tier.total).toBe(399);
    expect(adhesionTier(100).tier.total).toBe(599);
    expect(adhesionTier(199).tier.total).toBe(599);
    expect(adhesionTier(200).tier.total).toBe(999);
    expect(adhesionTier(5000).left).toBeNull();
    expect(adhesionTier(100).tier.priceId).toBe("raiox_adesao_lote2");
  });
  it("adesão entra só na primeira cobrança", () => {
    expect(firstCharge(PLANS[0]!, 399)).toBe(468.9);
    expect(firstCharge(PLANS[0]!)).toBe(69.9);
  });
});
