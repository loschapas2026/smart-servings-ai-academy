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

export const SAFE_EVOLUTION_REQUIREMENTS = `EVOLUÇÃO SEGURA DE SISTEMAS JÁ CRIADOS
- Antes de construir, mapeie as telas, menus, rotas, componentes, permissões, tabelas e fluxos que já existem. Preserve tudo que funciona; não apague, não sobrescreva e não reescreva módulos sem necessidade.
- Toda nova funcionalidade deve entrar como um módulo separado, acessado por um menu novo e claramente identificado. Não misture a novidade em menus ou telas existentes nem desfigure a navegação atual. Se o sistema ainda não existir, crie uma estrutura de menus preparada para receber módulos futuros.
- Alinhe o banco de dados à estrutura atual: reutilize tabelas e campos quando fizer sentido, crie somente as estruturas necessárias, mantenha relações e permissões organizadas, faça migrações incrementais e nunca quebre ou duplique registros existentes. Não use o banco local para duplicar dados que já pertencem à Suitable API.
- Trabalhe em atualizações pequenas, rápidas, organizadas e testáveis. Entregue uma fatia funcional por vez, mantenha nomes e componentes consistentes e evite grandes reescritas.
- Todas as telas novas devem ser responsivas em celular, tablet e computador, mantendo a identidade visual e a navegação do sistema atual.
- Antes de concluir cada atualização, teste o módulo novo e os fluxos antigos que podem ser afetados. Se algo existente quebrar, restaure a compatibilidade antes de seguir.`;

/** Garante integração e evolução segura mesmo quando a IA omite essas exigências. */
export const withSuitableApi = (body: string): string => {
  const original = body.trim();
  const withIntegration = original.endsWith(SUITABLE_API_REQUIREMENTS)
    ? original
    : `${original}\n\n${SUITABLE_API_REQUIREMENTS}`;
  if (withIntegration.endsWith(SAFE_EVOLUTION_REQUIREMENTS)) return withIntegration;
  return `${withIntegration}\n\n${SAFE_EVOLUTION_REQUIREMENTS}`;
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
    "Contexto obrigatório: o assinante é cliente Suitable; a solução deve consultar a Suitable API como fonte oficial dos dados operacionais.",
  ].filter(Boolean).join("\n");
};
