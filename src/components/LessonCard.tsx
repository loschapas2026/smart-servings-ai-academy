import { Link } from "@tanstack/react-router";
import { Check, Clock, Play } from "lucide-react";
import { thumbOf } from "@/lib/video";
import { Logo } from "./Logo";

type C = { id: string; type: string; title: string; summary: string | null; video_url: string | null; thumbnail_url: string | null; duration: string | null };
const LABEL: Record<string, string> = { video: "AULA", artigo: "ARTIGO", prompt: "PROMPT", download: "MATERIAL" };

export function LessonCard({ c, done, index }: { c: C; done: boolean; index?: number }) {
  const t = thumbOf(c);
  return (
    <Link to="/conteudo/$id" params={{ id: c.id }} className="group w-64 shrink-0 snap-start md:w-72">
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-card transition group-hover:border-primary group-hover:shadow-glow">
        {t ? <img src={t} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
           : <div className="flex h-full items-center justify-center bg-secondary"><Logo className="text-2xl opacity-60" /></div>}
        <div className="absolute inset-0 bg-fade opacity-80" />
        {c.type === "video" && (
          <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-glow transition group-hover:opacity-100"><Play className="h-5 w-5 translate-x-0.5 fill-current" /></span>
        )}
        <span className="absolute left-3 top-3 rounded bg-background/80 px-2 py-0.5 font-mono text-[10px] text-primary">{LABEL[c.type]}{index ? ` ${String(index).padStart(2, "0")}` : ""}</span>
        {c.duration && <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-2 py-0.5 font-mono text-[10px]"><Clock className="h-3 w-3" />{c.duration}</span>}
        {done && <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>}
        {done && <span className="absolute inset-x-0 bottom-0 h-1 bg-primary" />}
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-bold group-hover:text-primary">{c.title}</p>
      {c.summary && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{c.summary}</p>}
    </Link>
  );
}

export function Row({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline gap-3"><h2 className="text-lg md:text-xl">{title}</h2>{subtitle && <span className="font-mono text-xs text-muted-foreground">{subtitle}</span>}</div>
      <div className="-mx-5 mt-4 flex snap-x gap-4 overflow-x-auto px-5 pb-3">{children}</div>
    </section>
  );
}
