const clientToken = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"];

export function PaymentTestModeBanner() {
  if (!clientToken) {
    return (
      <div className="w-full border-b border-destructive/40 bg-destructive/15 px-4 py-2 text-center text-sm text-destructive">
        O checkout real ainda não está ativado. Conclua a ativação dos pagamentos para receber de verdade.
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full border-b border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm text-primary">
        Modo de teste: as compras feitas aqui não cobram dinheiro de verdade.
      </div>
    );
  }
  return null;
}
