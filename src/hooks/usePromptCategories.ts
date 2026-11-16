import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PROMPT_STAGES } from "@/lib/prompt-stages";

export type PromptCategory = { id: string; label: string; description: string | null; position: number };

const FALLBACK: PromptCategory[] = PROMPT_STAGES.map((s, i) => ({ id: s.id, label: s.label, description: s.description, position: i }));

export const promptCategoriesQuery = {
  queryKey: ["prompt-categories"],
  queryFn: async (): Promise<PromptCategory[]> => {
    const { data, error } = await supabase.from("prompt_categories").select("id,label,description,position").order("position").order("label");
    if (error || !data) return FALLBACK;
    return data;
  },
};

export function usePromptCategories() {
  const q = useQuery(promptCategoriesQuery);
  const cats = q.data ?? FALLBACK;
  const order = (label: string | null | undefined) => { const i = cats.findIndex((c) => c.label === label); return i === -1 ? cats.length : i; };
  const describe = (label: string | null | undefined) => cats.find((c) => c.label === label)?.description ?? undefined;
  return { ...q, cats, order, describe };
}
