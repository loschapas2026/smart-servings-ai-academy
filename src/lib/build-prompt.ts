/** Regras do gerador de prompt a partir da dor (módulo seguro para o navegador). */

export const PAIN_MIN = 10;
export const PAIN_MAX = 3000;

/** Valida a dor escrita pelo assinante e devolve o texto limpo. */
export const validatePain = (pain: string | null | undefined): string => {
  const text = (pain ?? "").trim();
  if (text.length < PAIN_MIN) throw new Error("Escreva pelo menos uma frase sobre a sua dor.");
  if (text.length > PAIN_MAX) throw new Error("Máximo de 3 mil caracteres. Resuma um pouco.");
  return text;
};

/** Monta o briefing enviado para a IA: dor + negócio + área, sem linhas vazias. */
export const briefOf = (p: { pain: string; business?: string; area?: string }): string =>
  [
    `Dor descrita pelo assinante: ${p.pain}`,
    p.business ? `Negócio: ${p.business}` : "",
    p.area ? `Área que dói hoje: ${p.area}` : "",
  ].filter(Boolean).join("\n");
