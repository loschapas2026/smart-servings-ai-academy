import { placeholdersOf } from "./prompt-stages";

export type PromptSummary = {
  resumo: string;
  blocks: string[];
  fields: string[];
  lines: number;
  words: number;
  tip: string;
};

const BULLET = /^\s*[-*•]\s/;

/** "1) Nome, cidade. 2) Logo e cores." é lista corrida, não título de parte. */
const isRunOn = (t: string) => /\.\s/.test(t);

const headingOf = (line: string): string | null => {
  if (BULLET.test(line)) return null;
  const num = line.match(/^\s*\d{1,2}[.)]\s+(\S.{1,70})$/)?.[1];
  if (num) return isRunOn(num) ? null : num;
  const md = line.match(/^\s*#{1,4}\s+(\S.{1,70})$/)?.[1];
  if (md) return md;
  const label = line.match(/^\s{0,3}([A-Za-zÀ-ú][^:\n]{2,58}):\s*$/)?.[1];
  if (label) return label;
  const caps = line.match(/^\s*([A-ZÀ-Ú][A-ZÀ-Ú0-9 ,:()/&%.]{2,58})$/)?.[1];
  if (caps) return caps;
  return null;
};

const LOWER_WORDS = new Set([
  "do", "da", "de", "das", "dos", "e", "a", "o", "as", "os", "em", "com", "que", "quem", "como", "onde",
  "um", "uma", "no", "na", "nos", "nas", "para", "por", "se", "ao", "à", "às", "me", "meu", "minha",
  "seu", "sua", "seus", "suas", "dia", "sem", "ate", "até", "foi", "tem", "mas", "entre", "sobre",
  "guie", "veja", "faça", "leia", "use", "crie", "diga", "liste", "mostre", "envie", "traga", "pense",
  "mude", "troque", "aplique", "prove", "abra", "feche", "entregue", "responda",
]);

/** Título escrito quase todo em maiúsculas: precisa ser reescrito para leitura. */
const isShouty = (t: string): boolean => {
  const letters = t.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (!letters) return false;
  const upper = letters.replace(/[^A-ZÀ-Ú]/g, "").length;
  return upper / letters.length >= 0.5;
};

/** Siglas de verdade: curtas, sem vogal, ou conhecidas. "BASE" e "GUIE" não são siglas. */
const ACRONYMS = new Set(["api", "suit", "mcp", "ai", "tv", "url", "uri", "cpf", "cnpj", "pix", "id", "llm", "crm", "erp", "saas", "ux", "ui", "br", "rs", "sp", "rj", "mg"]);
const VOWELS = /[aeiouàáâãéêíóôõúy]/i;

const isAcronym = (letters: string): boolean => {
  const bare = letters.toLowerCase();
  return letters.length <= 5 && (ACRONYMS.has(bare) || !VOWELS.test(bare));
};

/** "CONEXÃO COM O SUITABLE (API do SUIT)" -> "Conexão com o Suitable (API do SUIT)". */
const toTitle = (t: string): string => {
  const out = t
    .split(/(\s+)/)
    .map((tok) => {
      if (/^\s+$/.test(tok)) return tok;
      const letters = tok.replace(/[^A-Za-zÀ-ÿ]/g, "");
      if (!letters) return tok;
      if (LOWER_WORDS.has(letters.toLowerCase())) return tok.toLowerCase();
      if (isAcronym(letters) && tok === tok.toUpperCase()) return tok; // sigla: TV, API, SUIT
      return tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase();
    })
    .join("");
  return out.charAt(0).toUpperCase() + out.slice(1);
};

const cleanBlock = (t: string): string => {
  let s = t.replace(/\*\*/g, "").replace(/\s+/g, " ").trim().replace(/[:.]+$/g, "").trim();
  if (isShouty(s)) s = toTitle(s);
  return s.length > 62 ? `${s.slice(0, 59)}…` : s;
};

const firstSentences = (body: string, max = 240): string => {
  const flat = body.replace(/\r\n/g, "\n").trim();
  const para = (flat.split(/\n\s*\n/)[0] ?? "").replace(/\s+/g, " ").trim();
  if (para.length <= max) return para;
  const cut = para.slice(0, max);
  const dot = cut.lastIndexOf(". ");
  return dot > 80 ? cut.slice(0, dot + 1) : `${cut.trimEnd()}…`;
};

/** Resumo de um prompt lido do próprio texto: partes, campos e tamanho. */
export const summarizePrompt = (body: string | null | undefined, summary?: string | null): PromptSummary => {
  const text = (body ?? "").replace(/\r\n/g, "\n");
  const blocks: string[] = [];
  for (const line of text.split("\n")) {
    const h = headingOf(line);
    if (!h) continue;
    const c = cleanBlock(h);
    if (c.length > 2 && !blocks.includes(c)) blocks.push(c);
    if (blocks.length === 10) break;
  }
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const lines = trimmed ? trimmed.split("\n").length : 0;
  return {
    resumo: (summary ?? "").trim() || firstSentences(text),
    blocks,
    fields: placeholdersOf(text),
    lines,
    words,
    tip: words <= 700 ? "cole tudo de uma vez" : "cole tudo de uma vez e peça a resposta em partes",
  };
};
