import { useState, useRef } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Download, Upload, Paperclip, X } from "lucide-react";
import { payments, clients, formatBRL, formatDate, Payment } from "@/lib/mock-data";
import { toast } from "sonner";

interface PaymentFile { name: string; size: number; }

const typeLabel: Record<string, string> = {
  aluguel: "Aluguel", condominio: "Condomínio", iptu: "IPTU", consumo: "Consumo",
  comissao: "Comissão", repasse: "Repasse ao proprietário", taxa: "Taxa administrativa", outros: "Outros",
};

interface NewPayment {
  type: string; payer: string; propertyTitle: string; dueDate: string; amount: string; description: string;
}
const empty: NewPayment = { type: "aluguel", payer: "", propertyTitle: "", dueDate: "", amount: "", description: "" };

export default function Pagamentos() {
  const [filter, setFilter] = useState("todos");
  const [list, setList] = useState<Payment[]>(payments);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<NewPayment>(empty);
  const [payFile, setPayFile] = useState<PaymentFile | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePayFile = (file: File) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    const allowedExt = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    if (!allowed.includes(file.type) && !allowedExt.some((e) => file.name.toLowerCase().endsWith(e))) {
      toast.error("Formato inválido. Use PDF ou imagem (JPG, PNG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { toast.error("Arquivo muito grande. Máx 10MB."); return; }
    setPayFile({ name: file.name, size: file.size });
    toast.success("Comprovante anexado!");
  };

  const filtered = filter === "todos" ? list : list.filter((p) => p.status === filter);

  const totals = {
    pendente: list.filter((p) => p.status === "pendente").reduce((a, p) => a + p.amount, 0),
    pago: list.filter((p) => p.status === "pago").reduce((a, p) => a + p.amount, 0),
    vencido: list.filter((p) => p.status === "vencido").reduce((a, p) => a + p.amount, 0),
  };

  const save = () => {
    if (!form.payer.trim() || !form.dueDate || !form.amount) {
      toast.error("Preencha pagador, vencimento e valor.");
      return;
    }
    const amount = parseFloat(form.amount.replace(",", "."));
    if (isNaN(amount)) { toast.error("Valor inválido."); return; }
    setList((prev) => [...prev, {
      id: `pay${Date.now()}`, type: form.type as any, payer: form.payer,
      propertyTitle: form.propertyTitle, dueDate: form.dueDate, amount, status: "pendente",
    }]);
    toast.success(`Cobrança registrada!${payFile ? " Comprovante anexado." : ""}`);
    setSheetOpen(false);
    setForm(empty);
    setPayFile(null);
  };

  return (
    <>
      <PageHeader title="Pagamentos" description="Boletos, guias e comprovantes">
        <Button className="gradient-primary border-0 shadow-glow gap-2" onClick={() => { setForm(empty); setSheetOpen(true); }}>
          <Plus className="w-4 h-4" />Nova cobrança
        </Button>
      </PageHeader>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 shadow-card"><div className="text-sm text-muted-foreground">A receber</div><div className="text-2xl font-bold text-warning mt-1">{formatBRL(totals.pendente)}</div></Card>
        <Card className="p-5 shadow-card"><div className="text-sm text-muted-foreground">Recebido (mês)</div><div className="text-2xl font-bold text-success mt-1">{formatBRL(totals.pago)}</div></Card>
        <Card className="p-5 shadow-card"><div className="text-sm text-muted-foreground">Vencidos</div><div className="text-2xl font-bold text-destructive mt-1">{formatBRL(totals.vencido)}</div></Card>
      </div>

      <Card className="p-4 mb-4 shadow-card">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos status</SelectItem>
            <SelectItem value="pendente">Pendentes</SelectItem>
            <SelectItem value="pago">Pagos</SelectItem>
            <SelectItem value="vencido">Vencidos</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr><th className="text-left p-4">Tipo</th><th className="text-left p-4">Pagador</th><th className="text-left p-4">Imóvel</th><th className="text-left p-4">Vencimento</th><th className="text-right p-4">Valor</th><th className="text-center p-4">Status</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-4 font-medium">{typeLabel[p.type] ?? p.type}</td>
                <td className="p-4">{p.payer}</td>
                <td className="p-4 text-muted-foreground">{p.propertyTitle}</td>
                <td className="p-4">{formatDate(p.dueDate)}</td>
                <td className="p-4 text-right font-semibold">{formatBRL(p.amount)}</td>
                <td className="p-4 text-center"><StatusBadge status={p.status} /></td>
                <td className="p-4 text-right"><Button variant="ghost" size="sm" className="gap-1"><Download className="w-4 h-4" />PDF</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Nova cobrança Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>Nova cobrança</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>Tipo de cobrança</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pagador (cliente) *</Label>
              <Select value={form.payer} onValueChange={(v) => setForm({ ...form, payer: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecionar cliente..." /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Imóvel (título)</Label>
              <Input className="mt-1.5" placeholder="Ex: Apartamento 3 quartos Boa Viagem" value={form.propertyTitle} onChange={(e) => setForm({ ...form, propertyTitle: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Vencimento *</Label>
                <Input type="date" className="mt-1.5" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div>
                <Label>Valor (R$) *</Label>
                <Input className="mt-1.5" placeholder="0,00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea className="mt-1.5" rows={2} placeholder="Informações adicionais..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* Comprovante upload */}
            <div>
              <Label>Comprovante de pagamento (PDF, JPG, PNG · máx. 10MB)</Label>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePayFile(f); e.target.value = ""; }} />
              {payFile ? (
                <div className="mt-1.5 flex items-center gap-3 p-3 rounded-xl border border-success/40 bg-success-soft/30">
                  <Paperclip className="w-4 h-4 text-success flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{payFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(payFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={() => setPayFile(null)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="mt-1.5 w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors text-left">
                  <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Clique para anexar comprovante (opcional)</span>
                </button>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => { setSheetOpen(false); setPayFile(null); }}>Cancelar</Button>
              <Button className="flex-1 gradient-primary border-0" onClick={save}>Registrar cobrança</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
