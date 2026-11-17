import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/vendas" });
  },
  head: () => ({
    meta: [
      { title: "RAIOX — A dor que você tem, a IA resolve" },
      {
        name: "description",
        content: "Transforme a dor do seu restaurante em um sistema sob medida com IA, Suitable API e RAIOX.",
      },
      { property: "og:title", content: "RAIOX — A dor que você tem, a IA resolve" },
      {
        property: "og:description",
        content: "Apresentação pública do RAIOX: prompts, automação e módulos de IA para restaurantes clientes Suitable.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
