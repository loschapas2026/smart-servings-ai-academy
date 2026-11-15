import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAccount } from "@/hooks/useAccount";
import { normalizePhone } from "@/lib/notify/templates";

export function WhatsAppSettings() {
  const { data: acc } = useAccount();
  const qc = useQueryClient();
  const [phone, setPhone] = useState("");
  const [optIn, setOptIn] = useState(true);
  useEffect(() => { if (acc?.profile) { setPhone(acc.profile.phone ?? ""); setOptIn(acc.profile.whatsapp_opt_in); } }, [acc?.profile]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const norm = phone ? normalizePhone(phone) : null;
    if (phone && !norm) { toast.error("Informe um celular válido com DDD."); return; }
    const { error } = await supabase.from("profiles").update({ phone: norm, whatsapp_opt_in: optIn }).eq("id", acc!.user.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Preferências salvas."); qc.invalidateQueries({ queryKey: ["account"] });
  };
  return (
    <form onSubmit={save} className="mt-10 flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-6">
      <div className="mr-auto">
        <h2 className="text-lg">Avisos no WhatsApp</h2>
        <p className="text-sm text-muted-foreground">Vencimento, reuniões ao vivo e novidades.</p>
      </div>
      <input type="tel" placeholder="(11) 98765-4321" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} /> Receber avisos</label>
      <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Salvar</button>
    </form>
  );
}
