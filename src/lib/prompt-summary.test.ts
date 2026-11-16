import { describe, expect, it } from "vitest";
import { summarizePrompt } from "./prompt-summary";

const BODY = [
  "Antes de criar qualquer tela, configure a BASE do sistema.",
  "",
  "1. QUEM SOMOS",
  "- Negócio: [NOME DO NEGÓCIO]",
  "",
  "2. IDENTIDADE VISUAL",
  "- Logo: [ANEXE A LOGO]",
  "",
  "3. ACESSOS E SETORES",
  "",
  "Visual:",
  "- tema escuro",
  "",
  "Aba Configuração (único lugar onde se editam áreas):",
  "- salvar",
  "",
  "1) Nome, cidade e endereço. 2) Logo e cores. 3) Quais telas pretendo usar",
  "",
  "## Entrega final",
].join("\n");

describe("summarizePrompt", () => {
  it("extrai seções numeradas, rótulos e títulos de markdown", () => {
    expect(summarizePrompt(BODY, null).blocks).toEqual([
      "Quem Somos",
      "Identidade Visual",
      "Acessos e Setores",
      "Visual",
      "Aba Configuração (único lugar onde se editam áreas)",
      "Entrega final",
    ]);
  });

  it("reescreve títulos em maiúsculas sem perder as siglas", () => {
    const s = summarizePrompt("4. CONEXÃO COM O SUITABLE (API do SUIT)\n- token no servidor", null);
    expect(s.blocks).toEqual(["Conexão com o Suitable (API do SUIT)"]);
  });

  it("não confunde palavra comum com sigla", () => {
    const s = summarizePrompt("9. ANTES DE CONSTRUIR: PERGUNTE E ME GUIE\n10. O QUE ENTREGAR NESTA BASE\n- x", null);
    expect(s.blocks).toEqual(["Antes de Construir: Pergunte e me Guie", "O que Entregar Nesta Base"]);
  });

  it("ignora lista corrida de itens numerados na mesma linha", () => {
    const s = summarizePrompt(BODY, null);
    expect(s.blocks.some((b) => b.includes("Nome, cidade"))).toBe(false);
  });

  it("usa o resumo cadastrado quando existe", () => {
    expect(summarizePrompt(BODY, "Resumo curto.").resumo).toBe("Resumo curto.");
  });

  it("causa para a primeira frase quando não há resumo", () => {
    expect(summarizePrompt(BODY, null).resumo).toBe("Antes de criar qualquer tela, configure a BASE do sistema.");
  });

  it("conta linhas e palavras e lista os campos a preencher", () => {
    const s = summarizePrompt("A [B]\nC", null);
    expect(s.lines).toBe(2);
    expect(s.words).toBe(3);
    expect(s.fields).toEqual(["B"]);
  });

  it("avisa quando o prompt é longo demais para uma colagem só", () => {
    const long = Array.from({ length: 800 }, () => "palavra").join(" ");
    expect(summarizePrompt(long, null).tip).toBe("cole tudo de uma vez e peça a resposta em partes");
    expect(summarizePrompt("uma linha curta", null).tip).toBe("cole tudo de uma vez");
  });
});
