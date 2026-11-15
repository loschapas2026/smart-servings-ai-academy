import { describe, it, expect } from "vitest";
import { PLANS, perMonth } from "./plans";

describe("planos RAIOX", () => {
  it("semestral sai a R$ 59,90 por mês", () => {
    expect(perMonth(PLANS.find((p) => p.id === "semestral")!)).toBe(59.9);
  });
  it("média mensal dos três planos fica em torno de R$ 59,90", () => {
    const avg = PLANS.reduce((a, p) => a + perMonth(p), 0) / PLANS.length;
    expect(Math.abs(avg - 59.9)).toBeLessThan(1);
  });
});
