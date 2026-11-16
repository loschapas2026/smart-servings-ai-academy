import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { thumbOf } from "@/lib/video";
import { Logo } from "./Logo";

type C = { id: string; type: string; title: string; summary: string | null; video_url: string | null; thumbnail_url: string | null; duration: string | null; category?: string | null };
const LABEL: Record<string, string> = { video: "AULA", artigo: "ARTIGO", prompt: "PROMPT", download: "MATERIAL" };

function usePromptImage(c: C) {
  const path = c.type === "prompt" ? c.thumbnail_url : null;
  const direct = path && /^(https?:|\/)/.test(path) ? path : null;
  const q = useQuery({
    queryKey: ["prompt-img", path],
    enabled: !!path && !direct,
    staleTime: 50 * 60 * 1000,
    queryFn: async () => (await supabase.storage.from("prompt-images").createSignedUrl(path!, 3600)).data?.signedUrl ?? null,
  });
  return direct ?? q.data ?? null;
}

export function LessonCard({ c, done, index }: { c: C; done: boolean; index?: number }) {
  const promptImg = usePromptImage(c);
  const t = c.type === "prompt" ? promptImg : thumbOf(c);
  const inner = (
    <>
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-card transition group-hover:border-primary group-hover:shadow-glow">
        {t ? <img src={t} alt="" loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
           : <div className="flex h-full items-center justify-center bg-secondary"><Logo className="text-2xl opacity-60" /></div>}
        <div className="absolute inset-0 bg-fade opacity-80" />
        {c.type === "video" && (
          <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition group-hover:opacity-100">▶</span>
        )}
        <span className="absolute left-3 top-3 rounded bg-background/80 px-2 py-0.5 font-mono text-[10px] text-primary">{LABEL[c.type]}{index ? ` ${String(index).padStart(2, "0")}` : ""}</span>
        {c.duration && <span className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-0.5 font-mono text-[10px]">{c.duration}</span>}
        {done && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>}
        {done && <span className="absolute inset-x-0 bottom-0 h-1 bg-primary" />}
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-bold group-hover:text-primary">{c.title}</p>
      {c.summary && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.summary}</p>}
    </>
  );
  const cls = "group w-64 shrink-0 snap-start md:w-72";
  return c.type === "prompt"
    ? <Link to="/prompts" className={cls}>{inner}</Link>
    : <Link to="/conteudo/$id" params={{ id: c.id }} className={cls}>{inner}</Link>;
}

export function Row({ title, subtitle, children, action }: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3">
        <h3 className="text-base md:text-lg">{title}</h3>
        {subtitle && <span className="font-mono text-xs text-muted-foreground">{subtitle}</span>}
        <div className="ml-auto flex items-center gap-2">
          {action}
          <button aria-label="Voltar" onClick={() => scroll(-1)} className="hidden h-8 w-8 rounded-full border text-sm hover:border-primary hover:text-primary md:block">‹</button>
          <button aria-label="Avançar" onClick={() => scroll(1)} className="hidden h-8 w-8 rounded-full border text-sm hover:border-primary hover:text-primary md:block">›</button>
        </div>
      </div>
      <div ref={ref} className="-mx-5 mt-4 flex snap-x gap-4 overflow-x-auto scroll-smooth px-5 pb-3">{children}</div>
    </section>
  );
}
