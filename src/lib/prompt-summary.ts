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
  const num = line.match(/^\s*\d{1,2}[.)]\s+(\S.{1,70})$/);
  if (num) return isRunOn(num[1]) ? null : num[1];
  const md = line.match(/^\s*#{1,4}\s+(\S.{1,70})$/);
  if (md) return md[1];
  const label = line.match(/^\s{0,3}([A-Za-zÀ-ú][^:\n]{2,58}):\s*$/);
  if (label) return label[1];
  const caps = line.match(/^\s*([A-ZÀ-Ú][A-ZÀ-Ú0-9 ,:()/&%.]{2,58})$/);
  if (caps) return caps[1];
  return null;
};

const cleanBlock = (t: string): string => {
  let s = t.replace(/\*\*/g, "").replace(/\s+/g, " ").trim().replace(/[:.]+$/g, "").trim();
  if (!/[a-zà-ú]/.test(s)) s = s.charAt(0) + s.slice(1).toLowerCase();
  return s.length > 62 ? `${s.slice(0, 59)}…` : s;
};

const firstSentences = (body: string, max = 240): string => {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
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
