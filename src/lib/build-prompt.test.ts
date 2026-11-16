import { describe, expect, it } from "vitest";
import { briefOf, PAIN_MAX, PAIN_MIN, validatePain } from "./build-prompt";

describe("validatePain", () => {
  it("aceita uma dor escrita em uma frase", () => {
    const pain = "Perco pedido na sexta porque o motoboy sai sem conferir a rota.";
    expect(validatePain(pain)).toBe(pain);
  });

  it("recusa texto curto demais", () => {
    expect(() => validatePain("caiu")).toThrow("Escreva pelo menos uma frase sobre a sua dor.");
    expect(() => validatePain(null)).toThrow();
  });

  it("recusa texto maior que o limite", () => {
    expect(() => validatePain("a".repeat(PAIN_MAX + 1))).toThrow("Máximo de 3 mil caracteres. Resuma um pouco.");
  });

  it("limpa espaços sobrando antes de contar", () => {
    const short = `   ${"x".repeat(PAIN_MIN - 1)}   `;
    expect(() => validatePain(short)).toThrow();
    expect(validatePain(`\n ${"x".repeat(PAIN_MIN)} \n`)).toHaveLength(PAIN_MIN);
  });

  it("aceita o tamanho máximo exato", () => {
    expect(validatePain("a".repeat(PAIN_MAX))).toHaveLength(PAIN_MAX);
  });
});

describe("briefOf", () => {
  it("traz a dor e só as informações opcionais preenchidas", () => {
    expect(briefOf({ pain: "Fila de entrega cresce no pico", business: "Pizza do Engenheiro", area: "entregas" })).toBe(
      "Dor descrita pelo assinante: Fila de entrega cresce no pico\nNegócio: Pizza do Engenheiro\nÁrea que dói hoje: entregas",
    );
    expect(briefOf({ pain: "Fila de entrega cresce no pico", business: "  ", area: undefined })).toBe(
      "Dor descrita pelo assinante: Fila de entrega cresce no pico",
    );
  });
});
