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
  return [...new Set(found.map((f) => f.slice(1, -1).trim()).filter(Boolean))];
};
