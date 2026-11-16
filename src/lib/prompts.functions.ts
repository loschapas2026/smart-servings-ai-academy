import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PROMPT_STAGES } from "@/lib/prompt-stages";

const SYSTEM = `Você transforma prompts reais usados pela equipe do Clube do SUIT (criados no Lovable para os próprios negócios) em modelos reutilizáveis para donos de restaurante e pequenos negócios.
Regras:
- Mantenha a estrutura, a ordem e o nível de detalhe do original. Não resuma.
- Troque tudo que é específico (nome do negócio, cidade, produtos, preços, cores, nomes de pessoas, números, endereços) por campos entre colchetes em MAIÚSCULAS, ex: [NOME DO RESTAURANTE], [CIDADE], [PREÇO DO PLANO].
- Reutilize o mesmo campo quando o mesmo dado aparece mais de uma vez.
- Remova senhas, chaves, e-mails e telefones reais.
- Escreva em português do Brasil.
Etapas possíveis: ${PROMPT_STAGES.map((s) => s.label).join(", ")}.`;

export const generalizePrompt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { raw: string }) => {
    if (!d.raw?.trim() || d.raw.length > 20000) throw new Error("Cole um prompt de até 20 mil caracteres.");
    return d;
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Acesso restrito");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM }, { role: "user", content: data.raw }],
        tools: [{ type: "function", function: { name: "save", parameters: { type: "object", properties: {
          title: { type: "string", description: "Título curto do modelo" },
          summary: { type: "string", description: "Quando usar, em uma frase" },
          stage: { type: "string", enum: PROMPT_STAGES.map((s) => s.label) },
          body: { type: "string", description: "Prompt generalizado com [CAMPOS]" },
        }, required: ["title", "summary", "stage", "body"] } } }],
        tool_choice: { type: "function", function: { name: "save" } },
      }),
    });
    if (res.status === 429) throw new Error("Muitas solicitações. Tente em instantes.");
    if (res.status === 402) throw new Error("Créditos de IA esgotados.");
    if (!res.ok) throw new Error("A IA não respondeu. Tente de novo.");
    const j: any = await res.json();
    const args = j.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("A IA não devolveu o prompt.");
    return JSON.parse(args) as { title: string; summary: string; stage: string; body: string };
  });
