import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePromptCategories } from "@/hooks/usePromptCategories";

const NONE = "Sem categoria";
const inp = "rounded-xl border bg-input/40 px-4 py-2 text-sm outline-none focus:border-primary";

export function PromptCategoriesBoard() {
  const qc = useQueryClient();
  const { cats } = usePromptCategories();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [over, setOver] = useState<string | null>(null);
  const { data: prompts = [] } = useQuery({
    queryKey: ["admin-prompts-board"],
    queryFn: async () => (await supabase.from("contents").select("id,title,category,published").eq("type", "prompt").order("position").order("title")).data ?? [],
  });
  const refresh = () => qc.invalidateQueries();

  const create = async () => {
    const label = name.trim();
    if (!label) return;
    if (cats.some((c) => c.label.toLowerCase() === label.toLowerCase())) { toast.error("Essa categoria já existe."); return; }
    const { error } = await supabase.from("prompt_categories").insert({ label, description: desc.trim() || null, position: cats.length });
    if (error) { toast.error(error.message); return; }
    setName(""); setDesc(""); toast.success("Categoria criada."); refresh();
  };
  const rename = async (id: string, old: string) => {
    const label = prompt("Novo nome da categoria:", old)?.trim();
    if (!label || label === old) return;
    const { error } = await supabase.from("prompt_categories").update({ label }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    await supabase.from("contents").update({ category: label }).eq("type", "prompt").eq("category", old);
    refresh();
  };
  const remove = async (id: string, label: string, count: number) => {
    if (count > 0) { toast.error("Mova os prompts para outra categoria antes de excluir."); return; }
    if (!confirm(`Excluir a categoria "${label}"?`)) return;
    await supabase.from("prompt_categories").delete().eq("id", id); refresh();
  };
  const move = async (dir: -1 | 1, i: number) => {
    const j = i + dir; if (j < 0 || j >= cats.length) return;
    const a = cats[i]!, b = cats[j]!;
    await Promise.all([
      supabase.from("prompt_categories").update({ position: j }).eq("id", a.id),
      supabase.from("prompt_categories").update({ position: i }).eq("id", b.id),
    ]);
    // normaliza as demais posições
    await Promise.all(cats.map((c, k) => (k !== i && k !== j && c.position !== k ? supabase.from("prompt_categories").update({ position: k }).eq("id", c.id) : null)));
    refresh();
  };
  const drop = async (e: React.DragEvent, label: string) => {
    e.preventDefault(); setOver(null);
    const id = e.dataTransfer.getData("text/plain");
    const p = prompts.find((x) => x.id === id);
    if (!p || (p.category || NONE) === label) return;
    qc.setQueryData(["admin-prompts-board"], prompts.map((x) => (x.id === id ? { ...x, category: label === NONE ? null : label } : x)));
    const { error } = await supabase.from("contents").update({ category: label === NONE ? null : label }).eq("id", id);
    if (error) toast.error(error.message); else toast.success(`"${p.title}" movido para ${label}.`);
    refresh();
  };

  const labels = cats.map((c) => c.label);
  const orphans = prompts.filter((p) => !p.category || !labels.includes(p.category));
  const columns = [...cats.map((c, i) => ({ c, i, items: prompts.filter((p) => p.category === c.label) })), ...(orphans.length ? [{ c: null, i: -1, items: orphans }] : [])];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-2 rounded-2xl border bg-card p-5">
        <div className="flex-1 min-w-[200px]"><p className="mb-1 font-mono text-xs uppercase text-primary">Nova categoria</p><input value={name} onChange={(e) => setName(e.target.value)} className={`${inp} w-full`} placeholder="Ex: Telas de operação" /></div>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} className={`${inp} flex-[2] min-w-[200px]`} placeholder="Descrição curta (opcional)" />
        <button onClick={create} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">Criar</button>
      </div>
      <p className="text-sm text-muted-foreground">Arraste um prompt e solte na categoria desejada. A ordem das categorias é a mesma da página Prompts.</p>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(({ c, i, items }) => {
          const label = c?.label ?? NONE;
          return (
            <div key={label} onDragOver={(e) => { e.preventDefault(); setOver(label); }} onDragLeave={() => setOver(null)} onDrop={(e) => drop(e, label)}
              className={`flex w-72 shrink-0 flex-col rounded-2xl border bg-card p-3 transition ${over === label ? "border-primary bg-secondary" : ""}`}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div><p className="font-bold leading-tight">{label}</p><p className="font-mono text-xs text-muted-foreground">{items.length} prompts</p></div>
                {c && <div className="flex shrink-0 gap-1 text-xs">
                  <button title="Mover para esquerda" onClick={() => move(-1, i)} className="rounded border px-1.5">←</button>
                  <button title="Mover para direita" onClick={() => move(1, i)} className="rounded border px-1.5">→</button>
                  <button title="Renomear" onClick={() => rename(c.id, c.label)} className="rounded border px-1.5">✎</button>
                  <button title="Excluir" onClick={() => remove(c.id, c.label, items.length)} className="rounded border border-destructive px-1.5 text-destructive">×</button>
                </div>}
              </div>
              <div className="min-h-24 space-y-2">
                {items.map((p) => (
                  <div key={p.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", p.id)}
                    className="cursor-grab rounded-xl border bg-background p-2.5 text-sm active:cursor-grabbing">
                    {p.title}{!p.published && <span className="ml-1 text-xs text-muted-foreground">(rascunho)</span>}
                  </div>
                ))}
                {items.length === 0 && <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">Solte prompts aqui</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
