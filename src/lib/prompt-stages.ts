export type PromptStage = {
  id: string;
  label: string;
  description: string;
};

/** Etapas da página "Prompts para criação de sistemas", na ordem de trabalho. */
export const START_STAGE = "Comece por aqui";

export const PROMPT_STAGES: PromptStage[] = [
  {
    id: "inicio",
    label: START_STAGE,
    description: "O primeiro prompt de todos: logo, nome, cores, acessos e integrações. Use antes de qualquer outro.",
  },
  {
    id: "briefing",
    label: "Briefing e escopo",
    description: "Antes de escrever qualquer código: entender o problema, quem usa e o que o sistema precisa fazer.",
  },
  {
    id: "site-vendas",
    label: "Site e vendas",
    description: "Vitrine digital, cardápios, produtos, unidades e caminhos para o cliente pedir e entrar em contato.",
  },
  {
    id: "reservas-eventos",
    label: "Reservas e eventos",
    description: "Reservas, capacidade, eventos, inscrições e ações especiais com regras e painel de acompanhamento.",
  },
  {
    id: "promocoes-fidelidade",
    label: "Promoções e fidelidade",
    description: "Cupons, roleta, clube de clientes, cashback e experiências que fazem o cliente voltar.",
  },
  {
    id: "clientes-campanhas",
    label: "Clientes e campanhas",
    description: "Cadastro único, segmentação, WhatsApp, aniversários, réguas de relacionamento e medição de resultados.",
  },
  {
    id: "estoque-compras",
    label: "Estoque e compras",
    description: "Produtos, fornecedores, contagens, sugestões, cotações, pedidos de compra e entrada de notas.",
  },
  {
    id: "producao-equipe",
    label: "Produção e equipe",
    description: "Cozinha, linha de produção, escalas, folgas, ausências e dimensionamento da operação.",
  },
  {
    id: "entregas-motoboys",
    label: "Entregas e motoboys",
    description: "Fila, despacho, rotas, fretes, chave Pix e fechamento diário dos entregadores.",
  },
  {
    id: "financeiro-admin",
    label: "Financeiro e administrativo",
    description: "Contas a pagar, recorrências, folha, holerites, relatórios e visão gerencial.",
  },
  {
    id: "integracoes-automacoes",
    label: "Integrações e automações",
    description: "Suitable, WhatsApp, Telegram, rotinas agendadas e conexões seguras com outros serviços.",
  },
  {
    id: "regras",
    label: "Regras e dados",
    description: "O que o sistema guarda, quem pode fazer o quê e as decisões que ele toma sozinho.",
  },
  {
    id: "telas",
    label: "Telas e visual",
    description: "Como o sistema se organiza na tela e o que a pessoa vê e lê em cada parte.",
  },
  {
    id: "construcao",
    label: "Construção",
    description: "O passo a passo de geração: telas, rotinas e correções, sem quebrar o que já funciona.",
  },
  {
    id: "testes",
    label: "Testes e qualidade",
    description: "Provar que funciona, que não quebra e que não abre a porta para quem não deve.",
  },
  {
    id: "lancar",
    label: "Lançar e evoluir",
    description: "Publicar com segurança, documentar e decidir o que melhorar depois.",
  },
];

/** Posição da etapa na página. Etapas fora da lista vêm por último. */
export const stageOrder = (label: string | null | undefined): number => {
  const i = PROMPT_STAGES.findIndex((s) => s.label === label);
  return i === -1 ? PROMPT_STAGES.length : i;
};

export const stageDescription = (label: string | null | undefined): string | undefined =>
  PROMPT_STAGES.find((s) => s.label === label)?.description;

/** Campos que a pessoa precisa preencher antes de usar o prompt. */
export const placeholdersOf = (body: string | null | undefined): string[] => {
  if (!body) return [];
  const found = body.match(/\[[^\[\]\n]{1,60}\]/g) ?? [];
  // Ignora trechos como "[colchetes]": campo de verdade é escrito em maiúsculas.
  return [...new Set(found.map((f) => f.slice(1, -1).trim()).filter((f) => f && /[A-ZÀ-Ú]/.test(f)))];
};
