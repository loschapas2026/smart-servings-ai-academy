/** Regras do gerador de prompt a partir da dor (módulo seguro para o navegador). */

export const PAIN_MIN = 10;
export const PAIN_MAX = 3000;

/** Bloco obrigatório anexado a todo prompt, sem depender da interpretação da IA. */
export const SUITABLE_API_REQUIREMENTS = `INTEGRAÇÃO OBRIGATÓRIA — SUITABLE API
- Este sistema será usado por clientes Suitable. Use a Suitable API como fonte oficial dos dados operacionais do restaurante.
- Antes de implementar, consulte a documentação e os endpoints habilitados na conta do cliente. Não invente endpoints, campos ou retornos; se um dado não estiver disponível, mostre essa limitação e pergunte como proceder.
- Busque na Suitable API os dados necessários para a dor descrita — pedidos, clientes, entregas, estoque ou financeiro — sem criar cadastros paralelos nem dados fictícios para substituir a integração.
- Faça as chamadas à API somente no servidor. Nunca exponha token, chave ou senha no navegador, no prompt ou em logs.
- Trate carregamento, ausência de dados, erro e indisponibilidade da API sem apresentar números inventados.
- O sistema deve funcionar em celular, tablet e computador.`;

/** Garante a integração mesmo quando a IA omite essa exigência na resposta. */
export const withSuitableApi = (body: string): string => {
  const prompt = body.trim();
  if (prompt.endsWith(SUITABLE_API_REQUIREMENTS)) return prompt;
  return `${prompt}\n\n${SUITABLE_API_REQUIREMENTS}`;
};

/** Valida a dor escrita pelo assinante e devolve o texto limpo. */
export const validatePain = (pain: string | null | undefined): string => {
  const text = (pain ?? "").trim();
  if (text.length < PAIN_MIN) throw new Error("Escreva pelo menos uma frase sobre a sua dor.");
  if (text.length > PAIN_MAX) throw new Error("Máximo de 3 mil caracteres. Resuma um pouco.");
  return text;
};

/** Monta o briefing enviado para a IA: dor + negócio + área, sem linhas vazias. */
export const briefOf = (p: { pain: string; business?: string; area?: string }): string => {
  const business = (p.business ?? "").trim();
  const area = (p.area ?? "").trim();
  return [
    `Dor descrita pelo assinante: ${p.pain}`,
    business ? `Negócio: ${business}` : "",
    area ? `Área que dói hoje: ${area}` : "",
  ].filter(Boolean).join("\n");
};
