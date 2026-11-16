import { Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, ScanLine, Utensils, Workflow } from "lucide-react";
import franciscoPalco from "@/assets/francisco-neto-palco.jpg.asset.json";
import franciscoEvento from "@/assets/francisco-neto-evento.jpg.asset.json";
import wellingtonEvento from "@/assets/wellington-morais-evento.jpg.asset.json";
import wellingtonPalco from "@/assets/wellington-morais-palco.jpg.asset.json";

const founders = [
  {
    name: "Francisco Neto",
    role: "Los Chapas · Operação de restaurante",
    marker: "01 / LOS CHAPAS",
    shortMarker: "01/LOS CHAPAS",
    icon: Utensils,
    photo: franciscoPalco,
    alternate: franciscoEvento,
    alt: "Francisco Neto falando ao microfone em um evento",
  },
  {
    name: "Wellington Morais",
    role: "Pizza do Engenheiro · Engenharia de sistemas",
    marker: "02 / PIZZA DO ENGENHEIRO",
    shortMarker: "02/PIZZA ENG.",
    icon: Workflow,
    photo: wellingtonEvento,
    alternate: wellingtonPalco,
    alt: "Wellington Morais em um evento sobre o setor de alimentação",
  },
];

export function FoundersAiSection() {
  return (
    <section aria-labelledby="founders-title" className="relative mt-16 overflow-hidden rounded-3xl border bg-card">
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
            <BrainCircuit className="h-3.5 w-3.5" /> Por trás do RAIOX
          </div>
          <h2 id="founders-title" className="mt-5 text-2xl leading-tight md:text-4xl">
            A dor é real.<br /><span className="text-primary">A solução também.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground md:text-base">
            Francisco traz a vivência do Los Chapas. Wellington traz a engenharia. O RAIOX transforma esse encontro em prompts para você construir sistemas que fazem sentido na rotina do seu restaurante.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
            <span className="rounded-md border px-2.5 py-1.5 text-muted-foreground">Vivência</span>
            <span className="text-primary">+</span>
            <span className="rounded-md border px-2.5 py-1.5 text-muted-foreground">Engenharia</span>
            <span className="text-primary">=</span>
            <span className="rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-primary">IA aplicável</span>
          </div>

          <Link to="/prompts" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90">
            Explorar os prompts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-5">
          {founders.map((founder) => {
            const Icon = founder.icon;
            return (
              <article key={founder.name} className="group relative overflow-hidden rounded-2xl border bg-background shadow-glow">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={founder.photo.url}
                    alt={founder.alt}
                    className="absolute inset-0 h-full w-full object-cover object-top grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-0"
                    loading="lazy"
                  />
                  <img
                    src={founder.alternate.url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-top opacity-0 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-primary/15 mix-blend-color transition duration-700 group-hover:opacity-0" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />
                  <div className="scanlines pointer-events-none absolute inset-0" />

                  <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
                    <span className="whitespace-nowrap rounded-md border border-primary/40 bg-background/80 px-2 py-1 font-mono text-[7px] uppercase tracking-wider text-primary backdrop-blur-md sm:text-[8px] md:text-[10px]">
                      <span className="md:hidden">{founder.shortMarker}</span>
                      <span className="hidden md:inline">{founder.marker}</span>
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-background/80 text-primary backdrop-blur-md">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                    <div className="mb-2 hidden items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-primary md:flex md:text-[10px]">
                      <ScanLine className="h-3 w-3" /> Perfil identificado
                    </div>
                    <h3 className="text-sm leading-tight md:text-xl">{founder.name}</h3>
                    <p className="mt-1 text-[10px] text-muted-foreground md:text-sm">{founder.role}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
