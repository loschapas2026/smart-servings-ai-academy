// Ambiente de pagamentos (teste ou real) decidido pela própria versão publicada,
// nunca pelo que o navegador envia. Sem dependências: serve ao navegador e ao servidor.

export type PaymentsEnv = "sandbox" | "live";

/** Lê o ambiente pelo PREFIXO do token público; token ausente ou estranho = null. */
export function envFromClientToken(token?: string | null): PaymentsEnv | null {
  if (token?.startsWith("pk_test_")) return "sandbox";
  if (token?.startsWith("pk_live_")) return "live";
  return null;
}

/** Ambiente desta versão do site (o token é fixado no momento da publicação). */
export function buildPaymentsEnv(): PaymentsEnv | null {
  return envFromClientToken(import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"]);
}

type Decision = { ok: true; env: PaymentsEnv } | { ok: false; error: string };

/**
 * O servidor só atende pedidos no ambiente da própria versão. Um pedido de
 * checkout de teste feito à versão real é recusado, para que ninguém ganhe
 * acesso pagando com cartão de teste.
 */
export function authorizePaymentsEnv(requested: unknown, buildEnv: PaymentsEnv | null): Decision {
  if (!buildEnv) return { ok: false, error: "Pagamentos ainda não estão configurados para esta versão." };
  if (requested !== buildEnv) return { ok: false, error: "Ambiente de pagamento inválido para esta versão." };
  return { ok: true, env: buildEnv };
}
