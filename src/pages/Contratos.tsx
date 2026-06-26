import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, FileText, Sparkles, Upload, Paperclip, X } from "lucide-react";
import { contracts, clients, properties, formatBRL, formatDate, Contract } from "@/lib/mock-data";
import { toast } from "sonner";

const ALLOWED_CONTRACT_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
const ALLOWED_CONTRACT_EXT = [".pdf", ".docx", ".txt"];
interface ContractFile { name: string; size: number; }

interface NewContract {
  propertyCode: string; propertyTitle: string; clientName: string; broker: string;
  startDate: string; endDate: string; mandatoryMonths: string; monthlyValue: string; status: string;
}
const empty: NewContract = {
  propertyCode: "", propertyTitle: "", clientName: "", broker: "Ana Souza",
  startDate: "", endDate: "", mandatoryMonths: "12", monthlyValue: "", status: "ativo",
};

export default function Contratos() {
  const navigate = useNavigate();
  const [list, setList] = useState<Contract[]>(contracts);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<NewContract>(empty);
  const [contractFile, setContractFile] = useState<ContractFile | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleContractFile = (file: File) => {
    if (!ALLOWED_CONTRACT_TYPES.includes(file.type) && !ALLOWED_CONTRACT_EXT.some((e) => file.name.endsWith(e))) {
      toast.error("Formato inválido. Use PDF, DOCX ou TXT.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) { toast.error("Arquivo muito grande. Máx 20MB."); return; }
    setContractFile({ name: file.name, size: file.size });
    toast.success("Arquivo anexado!");
  };

  // Auto-fill property title from code
  const handleCodeChange = (code: string) => {
    const p = properties.find((x) => x.code === code);
    setForm((f) => ({ ...f, propertyCode: code, propertyTitle: p ? p.title : f.propertyTitle }));
  };

  const save = () => {
    if (!form.propertyTitle.trim() || !form.clientName.trim() || !form.startDate || !form.monthlyValue) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    const monthly = parseFloat(form.monthlyValue.replace(",", "."));
    const mandatory = parseInt(form.mandatoryMonths) || 12;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate || form.startDate);
    const totalMonths = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const penalty = 3;
    setList((prev) => [...prev, {
      id: `ct${Date.now()}`, propertyTitle: form.propertyTitle, clientName: form.clientName,
      broker: form.broker, startDate: form.startDate, endDate: form.endDate || form.startDate,
      totalMonths, mandatoryMonths: mandatory, penalty, monthlyValue: isNaN(monthly) ? 0 : monthly,
      status: form.status as any,
    }]);
    toast.success(`Contrato criado!${contractFile ? " Documento anexado." : ""}`);
    setSheetOpen(false);
    setForm(empty);
    setContractFile(null);
  };

  return (
    <>
      <PageHeader title="Contratos" description={`${list.length} contratos gerenciados`}>
        <Button className="gradient-primary border-0 shadow-glow gap-2" onClick={() => { setForm(empty); setSheetOpen(true); }}>
          <Plus className="w-4 h-4" />Novo contrato
        </Button>
      </PageHeader>

      <Card className="shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr><th className="text-left p-4">Imóvel</th><th className="text-left p-4">Cliente</th><th className="text-left p-4">Corretor</th><th className="text-left p-4">Vigência</th><th className="text-left p-4">Fidelidade</th><th className="text-right p-4">Valor</th><th className="text-center p-4">Status</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                    <div className="font-medium">{c.propertyTitle}</div>
                  </div>
                </td>
                <td className="p-4">{c.clientName}</td>
                <td className="p-4 text-muted-foreground">{c.broker}</td>
                <td className="p-4"><div className="text-xs">{formatDate(c.startDate)} → {formatDate(c.endDate)}</div><div className="text-xs text-muted-foreground">{c.totalMonths} meses</div></td>
                <td className="p-4">{c.mandatoryMonths}m · multa {c.penalty}x</td>
                <td className="p-4 text-right font-semibold">{formatBRL(c.monthlyValue)}</td>
                <td className="p-4 text-center"><StatusBadge status={c.status} /></td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/contratos/${c.id}`)}>Abrir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="mt-6 p-6 shadow-card border-2 border-dashed border-muted-foreground/20 bg-muted/20 opacity-60">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted text-muted-foreground flex items-center justify-center"><Upload className="w-6 h-6" /></div>
          <div className="flex-1">
            <h3 className="font-semibold text-muted-foreground">Anexar contrato e extrair dados automaticamente</h3>
            <p className="text-sm text-muted-foreground">Faça upload do PDF e nossa IA extrai prazo, fidelidade, multa e cláusulas — em breve.</p>
          </div>
          <Button variant="outline" className="gap-2 opacity-50 cursor-not-allowed" disabled><Sparkles className="w-4 h-4" />Em breve</Button>
        </div>
      </Card>

      {/* Novo contrato Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>Novo contrato</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>COD do imóvel</Label>
                <Input className="mt-1.5" placeholder="Ex: AP-001" value={form.propertyCode} onChange={(e) => handleCodeChange(e.target.value)} />
              </div>
              <div>
                <Label>Título do imóvel *</Label>
                <Input className="mt-1.5" placeholder="Ex: Apt 3Q Boa Viagem" value={form.propertyTitle} onChange={(e) => setForm({ ...form, propertyTitle: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Cliente *</Label>
              <Select value={form.clientName} onValueChange={(v) => setForm({ ...form, clientName: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecionar cliente..." /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Corretor</Label>
              <Input className="mt-1.5" value={form.broker} onChange={(e) => setForm({ ...form, broker: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Início da vigência *</Label>
                <Input type="date" className="mt-1.5" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <Label>Fim da vigência</Label>
                <Input type="date" className="mt-1.5" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Fidelidade (meses)</Label>
                <Input className="mt-1.5" type="number" min="0" value={form.mandatoryMonths} onChange={(e) => setForm({ ...form, mandatoryMonths: e.target.value })} />
              </div>
              <div>
                <Label>Valor mensal (R$) *</Label>
                <Input className="mt-1.5" placeholder="0,00" value={form.monthlyValue} onChange={(e) => setForm({ ...form, monthlyValue: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="encerrado">Encerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Document upload */}
            <div>
              <Label>Documento do contrato (PDF, DOCX, TXT · máx. 20MB)</Label>
              <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleContractFile(f); e.target.value = ""; }} />
              {contractFile ? (
                <div className="mt-1.5 flex items-center gap-3 p-3 rounded-xl border border-primary/40 bg-primary-soft/30">
                  <Paperclip className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{contractFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(contractFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={() => setContractFile(null)} className="text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="mt-1.5 w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors text-left">
                  <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Clique para anexar o documento do contrato</span>
                </button>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => { setSheetOpen(false); setContractFile(null); }}>Cancelar</Button>
              <Button className="flex-1 gradient-primary border-0" onClick={save}>Criar contrato</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
