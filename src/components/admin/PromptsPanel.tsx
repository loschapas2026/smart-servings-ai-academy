import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PROMPT_STAGES, placeholdersOf } from "@/lib/prompt-stages";
import { usePromptCategories } from "@/hooks/usePromptCategories";
import { PromptCategoriesBoard } from "./PromptCategoriesBoard";
import { generalizePrompt } from "@/lib/prompts.functions";

const inp = "w-full rounded-xl border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary";
const EMPTY = { title: "", summary: "", stage: PROMPT_STAGES[0]!.label, body: "" };

export function PromptsPanel() {
  const qc = useQueryClient();
  const gen = useServerFn(generalizePrompt);
  const { cats } = usePromptCategories();
  const [view, setView] = useState<"novo" | "categorias">("categorias");
  const [raw, setRaw] = useState("");
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const list = useQuery({
    queryKey: ["admin-prompts"],
    queryFn: async () => (await supabase.from("contents").select("id,title,category,published,created_at").eq("type", "prompt").order("created_at", { ascending: false })).data ?? [],
  });

  const generalize = async () => {
    setBusy(true);
    try { const r = await gen({ data: { raw } }); setF(r); toast.success("Prompt generalizado. Revise antes de publicar."); }
    catch (e: any) { toast.error(e.message); } finally { setBusy(false); }
  };
  const save = async (published: boolean) => {
    if (!f.title.trim() || !f.body.trim()) { toast.error("Preencha título e prompt."); return; }
    let thumbnail_url: string | null = null;
    if (file) {
      const path = `${crypto.randomUUID()}.${file.name.split(".").pop() || "png"}`;
      const up = await supabase.storage.from("prompt-images").upload(path, file, { contentType: file.type });
      if (up.error) { toast.error("Falha ao enviar imagem: " + up.error.message); return; }
      thumbnail_url = path;
    }
    const { error } = await supabase.from("contents").insert({ type: "prompt", title: f.title.trim(), summary: f.summary.trim(), body: f.body, category: f.stage, published, thumbnail_url });
    if (error) { toast.error(error.message); return; }
    toast.success(published ? "Publicado na página Prompts." : "Salvo como rascunho.");
    setF(EMPTY); setRaw(""); setFile(null); qc.invalidateQueries();
  };
  const toggle = async (id: string, published: boolean) => { await supabase.from("contents").update({ published }).eq("id", id); qc.invalidateQueries(); };
  const remove = async (id: string) => { if (!confirm("Excluir este prompt?")) return; await supabase.from("contents").delete().eq("id", id); qc.invalidateQueries(); };
  const fields = placeholdersOf(f.body);

  const tabs = (
    <div className="mb-6 flex gap-2">
      {(["categorias", "novo"] as const).map((t) => (
        <button key={t} onClick={() => setView(t)} className={`rounded-full border px-4 py-1.5 text-sm ${view === t ? "border-primary text-primary" : "text-muted-foreground"}`}>{t === "categorias" ? "Organizar categorias" : "Adicionar prompt"}</button>
      ))}
    </div>
  );
  if (view === "categorias") return <>{tabs}<PromptCategoriesBoard /></>;

  return (
    <>{tabs}
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-2xl border bg-card p-6">
          <p className="font-mono text-xs uppercase text-primary">1. Cole o prompt original</p>
          <p className="mt-1 text-sm text-muted-foreground">O prompt que vocês usaram no próprio negócio. A IA troca nomes, preços e detalhes por campos entre colchetes.</p>
          <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={8} className={`${inp} mt-3 font-mono`} placeholder="Ex: Crie o portal do restaurante Los Chapas em Fortaleza..." />
          <button disabled={busy || !raw.trim()} onClick={generalize} className="mt-3 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50">{busy ? "Generalizando…" : "Generalizar com IA"}</button>
        </div>
        <div className="rounded-2xl border bg-card p-6 space-y-3">
          <p className="font-mono text-xs uppercase text-primary">2. Revise e publique</p>
          <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={inp} placeholder="Título" />
          <input value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} className={inp} placeholder="Quando usar" />
          <select value={f.stage} onChange={(e) => setF({ ...f, stage: e.target.value })} className={inp}>
            {cats.map((s) => <option key={s.id} value={s.label}>{s.label}</option>)}
          </select>
          <textarea value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} rows={12} className={`${inp} font-mono`} placeholder="Prompt com [CAMPOS] para o assinante preencher" />
          <label className="block rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            <span className="font-bold text-foreground">Imagem do resultado</span> (print do sistema pronto — chama atenção na página)
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-xs" />
            {file && <img src={URL.createObjectURL(file)} alt="Prévia" className="mt-3 max-h-40 rounded-lg border" />}
          </label>
          {fields.length > 0 && <p className="text-xs text-muted-foreground">Campos para preencher: {fields.join(", ")}</p>}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => save(true)} className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">Publicar</button>
            <button onClick={() => save(false)} className="rounded-full border px-5 py-2 text-sm">Salvar rascunho</button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border bg-card p-6">
        <p className="font-mono text-xs uppercase text-muted-foreground">Prompts cadastrados ({list.data?.length ?? 0})</p>
        <ul className="mt-4 divide-y">
          {list.data?.map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-3 py-3">
              <div><p className="font-bold">{p.title}</p><p className="text-xs text-muted-foreground">{p.category} · {p.published ? "publicado" : "rascunho"}</p></div>
              <div className="flex shrink-0 gap-2 text-xs">
                <button onClick={() => toggle(p.id, !p.published)} className="rounded-full border px-3 py-1">{p.published ? "Ocultar" : "Publicar"}</button>
                <button onClick={() => remove(p.id)} className="rounded-full border border-destructive px-3 py-1 text-destructive">Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}
