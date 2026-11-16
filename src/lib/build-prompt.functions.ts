import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { briefOf, validatePain } from "@/lib/build-prompt";

const SYSTEM = `Você é o engenheiro de prompts do RAIOX, um clube para donos de restaurante e pequenos negócios que querem automatizar a própria operação com IA.
O assinante descreveu a dor dele. Transforme isso num prompt completo, pronto para colar no Lovable e construir o sistema.
Regras:
- Português do Brasil.
- Comece pelo objetivo do negócio e pela dor declarada. Não invente módulos que ele não pediu, mas inclua o mínimo necessário para o fluxo funcionar de ponta a ponta.
- Estruture em partes: objetivo, quem usa, telas, regras e dados, integrações, o que NÃO fazer, critérios de aceite.
- Deixe campos entre colchetes em MAIÚSCULAS para o que falta saber, ex: [NOME DO NEGÓCIO], [CIDADE], [CARDÁPIO PRINCIPAL].
- Se a dor for vaga, feche com um bloco "Perguntas antes de construir" com 5 a 8 perguntas objetivas.
- Nunca escreva senha, chave de API ou token no prompt. Segredo fica só no servidor.
- Se ele citar Suitable, SUIT ou WhatsApp, trate como integração que já existe no negócio.
- O texto final é um prompt de trabalho, não um artigo: imperativo, direto, sem marketing.`;

export type BuiltPrompt = { title: string; summary: string; body: string };

export const buildPromptFromPain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { pain: string; business?: string; area?: string }) => {
    const pain = validatePain(d.pain);
    return { pain, business: (d.business ?? "").trim().slice(0, 80), area: (d.area ?? "").trim().slice(0, 60) };
  })
  .handler(async ({ data, context }) => {
    const [{ data: isAdmin }, { data: active }] = await Promise.all([
      context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
      context.supabase.rpc("has_active_subscription", { _user_id: context.userId }),
    ]);
    if (!isAdmin && !active) throw new Error("Assinatura ativa necessária para criar seu prompt.");
    const brief = briefOf(data);

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Lovable-API-Key": process.env["LOVABLE_API_KEY"] ?? "", "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        // gpt-6-luna: modelo de baixo custo do gateway (~0,003 crédito/chamada, ~100x mais barato que o astra)
        model: "openai/gpt-6-luna",
        stream: true,
        store: false,
        instructions: SYSTEM,
        input: brief,
        text: { format: { type: "json_schema", name: "prompt", strict: true, schema: {
          type: "object", additionalProperties: false, required: ["title", "summary", "body"],
          properties: {
            title: { type: "string", description: "Título curto do sistema que vai nascer dessa dor" },
            summary: { type: "string", description: "O que esse prompt resolve, em uma frase" },
            body: { type: "string", description: "Prompt pronto para colar, com [CAMPOS] entre colchetes" },
          } } } },
      }),
    });
    if (res.status === 429) throw new Error("Muitas solicitações. Tente em instantes.");
    if (res.status === 402) throw new Error("Créditos de IA esgotados.");
    if (!res.ok || !res.body) throw new Error("A IA não respondeu. Tente de novo.");
    const reader = res.body.getReader(); const dec = new TextDecoder();
    let buf = "", out = "";
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n"); buf = lines.pop() ?? "";
      for (const l of lines) {
        if (!l.startsWith("data:")) continue;
        const d = l.slice(5).trim(); if (!d || d === "[DONE]") continue;
        try { const ev = JSON.parse(d); if (ev.type === "response.output_text.delta") out += ev.delta; } catch {}
      }
    }
    if (!out) throw new Error("A IA não devolveu o prompt.");
    return JSON.parse(out) as BuiltPrompt;
  });
