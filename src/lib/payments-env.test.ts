import { describe, it, expect } from "vitest";
import { authorizePaymentsEnv, envFromClientToken } from "./payments-env";

describe("ambiente de pagamentos", () => {
  it("lê o ambiente pelo prefixo do token público", () => {
    expect(envFromClientToken("pk_test_abc")).toBe("sandbox");
    expect(envFromClientToken("pk_live_abc")).toBe("live");
  });
  it("token ausente ou desconhecido não define ambiente", () => {
    expect(envFromClientToken(undefined)).toBeNull();
    expect(envFromClientToken("sk_live_abc")).toBeNull();
  });
  it("versão real recusa pedido de checkout de teste", () => {
    expect(authorizePaymentsEnv("sandbox", "live").ok).toBe(false);
  });
  it("versão de teste recusa pedido de checkout real", () => {
    expect(authorizePaymentsEnv("live", "sandbox").ok).toBe(false);
  });
  it("aceita quando o pedido bate com o ambiente da versão", () => {
    expect(authorizePaymentsEnv("live", "live")).toEqual({ ok: true, env: "live" });
    expect(authorizePaymentsEnv("sandbox", "sandbox")).toEqual({ ok: true, env: "sandbox" });
  });
  it("recusa tudo quando a versão não tem pagamentos configurados", () => {
    expect(authorizePaymentsEnv("live", null).ok).toBe(false);
    expect(authorizePaymentsEnv("sandbox", null).ok).toBe(false);
  });
});
