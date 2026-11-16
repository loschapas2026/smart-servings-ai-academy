import { describe, expect, it } from "vitest";
import { briefOf, PAIN_MAX, PAIN_MIN, SAFE_EVOLUTION_REQUIREMENTS, SUITABLE_API_REQUIREMENTS, validatePain, withSuitableApi } from "./build-prompt";

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
      "Dor descrita pelo assinante: Fila de entrega cresce no pico\nNegócio: Pizza do Engenheiro\nÁrea que dói hoje: entregas\nContexto obrigatório: o assinante é cliente Suitable; a solução deve consultar a Suitable API como fonte oficial dos dados operacionais.",
    );
    expect(briefOf({ pain: "Fila de entrega cresce no pico", business: "  " })).toBe(
      "Dor descrita pelo assinante: Fila de entrega cresce no pico\nContexto obrigatório: o assinante é cliente Suitable; a solução deve consultar a Suitable API como fonte oficial dos dados operacionais.",
    );
  });
});

describe("withSuitableApi", () => {
  it("acrescenta a integração obrigatória quando a IA omite o Suitable", () => {
    const result = withSuitableApi("Construa uma tela de conferência de entregas.");
    expect(result).toContain("INTEGRAÇÃO OBRIGATÓRIA — SUITABLE API");
    expect(result).toContain("Use a Suitable API como fonte oficial dos dados operacionais");
  });

  it("proíbe dados paralelos e exige endpoints documentados", () => {
    const result = withSuitableApi("Mostre os pedidos atrasados.");
    expect(result).toContain("sem criar cadastros paralelos nem dados fictícios");
    expect(result).toContain("Não invente endpoints, campos ou retornos");
  });

  it("mantém credenciais somente no servidor", () => {
    expect(withSuitableApi("Prompt do restaurante")).toContain("Faça as chamadas à API somente no servidor");
  });

  it("exige módulo e menu novos sem destruir o sistema atual", () => {
    const result = withSuitableApi("Adicione uma conferência de entregas.");
    expect(result).toContain("Toda nova funcionalidade deve entrar como um módulo separado, acessado por um menu novo");
    expect(result).toContain("Preserve tudo que funciona; não apague, não sobrescreva e não reescreva módulos sem necessidade");
  });

  it("exige banco alinhado, responsividade e atualizações incrementais", () => {
    const result = withSuitableApi("Adicione um painel de pedidos.");
    expect(result).toContain("Alinhe o banco de dados à estrutura atual");
    expect(result).toContain("responsivas em celular, tablet e computador");
    expect(result).toContain("atualizações pequenas, rápidas, organizadas e testáveis");
  });

  it("não duplica os blocos ao ser aplicada mais de uma vez", () => {
    const once = withSuitableApi("Prompt do restaurante");
    expect(withSuitableApi(once)).toBe(once);
    expect(once.split(SUITABLE_API_REQUIREMENTS)).toHaveLength(2);
    expect(once.split(SAFE_EVOLUTION_REQUIREMENTS)).toHaveLength(2);
  });
});
