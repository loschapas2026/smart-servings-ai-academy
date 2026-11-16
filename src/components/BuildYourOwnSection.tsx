import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight, Check, Copy, DatabaseZap, RefreshCw, Sparkles, Target, Wrench } from "lucide-react";
import { buildPromptFromPain, type BuiltPrompt } from "@/lib/build-prompt.functions";
import { PAIN_MAX, PAIN_MIN } from "@/lib/build-prompt";

const inp = "w-full rounded-xl border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary";

const CAN = [
  {
    icon: Target,
    t: "Começar pela sua dor",
    d: "Não é menu fechado. Você escreve o que dói hoje — fila de entrega, estoque que some, cliente sem retorno — e o sistema nasce disso.",
  },
  {
    icon: Wrench,
    t: "Criar o que não existe na biblioteca",
    d: "Se o seu caso não está entre os prompts prontos, a gente monta o seu. Tela, regra, integração e relatório do seu jeito.",
  },
  {
    icon: Sparkles,
    t: "Adaptar tudo que já está aqui",
    d: "Cada prompt é molde, não gaiola: troque campos, cores, etapas e integrações antes de mandar construir.",
  },
];

export function BuildYourOwnSection() {
  const build = useServerFn(buildPromptFromPain);
  const [pain, setPain] = useState("");
  const [business, setBusiness] = useState("");
  const [area, setArea] = useState("");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<BuiltPrompt | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setBusy(true);
    try {
      const r = await build({ data: { pain, business, area } });
      setOut(r);
      setCopied(false);
      toast.success("Prompt criado. Revise os campos entre colchetes e cole no Lovable.");
    } catch (e: any) {
      toast.error(e?.message ?? "Não deu para gerar agora. Tente de novo.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!out) return;
    try {
      await navigator.clipboard.writeText(out.body);
      setCopied(true);
      toast.success("Copiado.");
    } catch {
      toast.error("Seu navegador bloqueou a cópia. Selecione o texto e copie manualmente.");
    }
  };

  return (
    <section id="sua-dor" aria-labelledby="sua-dor-title" className="relative mt-16 overflow-hidden rounded-3xl border bg-card">
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative p-6 md:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
          <Target className="h-3.5 w-3.5" /> Além dos prompts
        </div>
        <h2 id="sua-dor-title" className="mt-5 max-w-2xl text-2xl leading-tight md:text-4xl">
          A sua dor vira sistema.
          <br />
          <span className="text-primary">Você cria o que precisar.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
          Os prompts prontos são atalhos, não o limite. Se a sua operação tem um problema que ninguém mais tem, escreva ele aqui. O RAIOX transforma a sua dor em um prompt de construção completo, com as suas telas, as suas regras e as suas integrações — pronto para colar no Lovable e sair funcionando.
        </p>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {CAN.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.t} className="rounded-2xl border bg-background/60 p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-3 font-bold">{c.t}</p>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{c.d}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border bg-background/60 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Monte o seu agora</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Descreva a dor com as suas palavras, do jeito que você contaria para um funcionário. O resto a IA organiza.
            </p>
            <textarea
              value={pain}
              onChange={(e) => setPain(e.target.value)}
              rows={5}
              maxLength={PAIN_MAX}
              className={`${inp} mt-4`}
              placeholder="Ex: toda sexta eu perco pedido porque o motoboy sai sem conferir a rota e eu só descubro quando o cliente liga reclamando."
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input value={business} onChange={(e) => setBusiness(e.target.value)} maxLength={80} className={inp} placeholder="Nome do negócio (opcional)" />
              <input value={area} onChange={(e) => setArea(e.target.value)} maxLength={60} className={inp} placeholder="Onde dói: estoque, entrega, caixa…" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={generate}
                disabled={busy || pain.trim().length < PAIN_MIN}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {busy ? "Montando seu prompt…" : "Gerar meu prompt"}
              </button>
              {out && (
                <button onClick={() => { setOut(null); setCopied(false); }} className="rounded-full border px-4 py-2 text-sm text-muted-foreground">
                  Começar de novo
                </button>
              )}
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {pain.trim().length}/{PAIN_MAX} caracteres
            </p>
          </div>

          <div className="rounded-2xl border bg-background/60 p-6">
            {out ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="mr-auto min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Seu prompt está pronto</p>
                    <h3 className="mt-1 text-lg leading-tight">{out.title}</h3>
                  </div>
                  <button onClick={copy} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary px-4 py-2 text-sm font-bold text-primary">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{out.summary}</p>
                <pre className="mt-4 max-h-[26rem] overflow-auto whitespace-pre-wrap rounded-xl border bg-card p-4 font-mono text-xs leading-6">{out.body}</pre>
                <p className="mt-3 text-xs text-muted-foreground">
                  Troque os campos entre colchetes pelos seus dados reais antes de colar no Lovable.
                </p>
              </>
            ) : (
              <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Resultado</p>
                <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                  Aqui aparece o prompt do seu sistema, escrito a partir da dor que você descreveu.
                </p>
                <ArrowRight className="mt-4 h-4 w-4 text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
