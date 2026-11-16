import { describe, expect, it } from "vitest";
import { PROMPT_STAGES, placeholdersOf, stageDescription, stageOrder } from "./prompt-stages";

describe("etapas da página de prompts", () => {
  it("mostra as seis etapas na ordem de trabalho", () => {
    expect(PROMPT_STAGES.map((s) => s.label)).toEqual([
      "Briefing e escopo",
      "Regras e dados",
      "Telas e visual",
      "Construção",
      "Testes e qualidade",
      "Lançar e evoluir",
    ]);
  });

  it("cada etapa tem id único e descrição própria", () => {
    expect(new Set(PROMPT_STAGES.map((s) => s.id)).size).toBe(PROMPT_STAGES.length);
    for (const s of PROMPT_STAGES) {
      expect(s.description.length).toBeGreaterThan(20);
      expect(s.description).toContain(" ");
    }
  });

  it("etapa fora da lista vem depois das conhecidas", () => {
    expect(stageOrder("Briefing e escopo")).toBe(0);
    expect(stageOrder("Lançar e evoluir")).toBe(PROMPT_STAGES.length - 1);
    expect(stageOrder("Categoria avulsa")).toBe(PROMPT_STAGES.length);
    expect(stageOrder(null)).toBe(PROMPT_STAGES.length);
  });

  it("a descrição vem só para etapas conhecidas", () => {
    expect(stageDescription("Construção")).toContain("passo a passo");
    expect(stageDescription("Não existe")).toBeUndefined();
  });

  it("extrai uma vez cada campo a preencher", () => {
    expect(
      placeholdersOf("Escreva para [NOME DO PRATO] usando [INGREDIENTES] e repetir [NOME DO PRATO]"),
    ).toEqual(["NOME DO PRATO", "INGREDIENTES"]);
    expect(placeholdersOf("")).toEqual([]);
    expect(placeholdersOf(null)).toEqual([]);
  });
});
