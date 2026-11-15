import { describe, it, expect } from "vitest";
import { normalizePhone, nextStatus, DUE_REMINDER_DAYS } from "./templates";

describe("notificações WhatsApp", () => {
  it("normaliza celular brasileiro com DDD", () => {
    expect(normalizePhone("(11) 98765-4321")).toBe("+5511987654321");
  });
  it("rejeita número inválido", () => {
    expect(normalizePhone("123")).toBeNull();
  });
  it("lembra 3 dias antes e no dia do vencimento", () => {
    expect([...DUE_REMINDER_DAYS]).toEqual([3, 0]);
  });
  it("não volta de 'lido' para 'entregue'", () => {
    expect(nextStatus("lido", "delivered")).toBeNull();
  });
  it("marca entregue após enviado", () => {
    expect(nextStatus("enviado", "delivered")).toBe("entregue");
  });
});
