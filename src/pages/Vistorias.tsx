import { useState, useRef } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Shield, FileSignature, Download, Upload, Trash2, FileText } from "lucide-react";
import { inspections, clients, properties, formatDate, Inspection } from "@/lib/mock-data";
import { toast } from "sonner";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXT = [".pdf", ".docx", ".txt"];

const docTypes = [
  { value: "ENTRADA", label: "Vistoria de Entrada", desc: "Documento de estado do imóvel no ingresso do locatário." },
  { value: "MANUTENCAO", label: "Vistoria de Manutenção", desc: "Registro de manutenção ou melhoria no imóvel." },
  { value: "SAIDA", label: "Vistoria de Saída", desc: "Documento de devolução do imóvel ou quebra de contrato." },
];

interface NewInspection {
  type: string; propertyId: string; clientName: string; scheduledDate: string; notes: string;
}
const empty: NewInspection = { type: "ENTRADA", propertyId: "", clientName: "", scheduledDate: "", notes: "" };
interface Attachment { name: string; size: number; url: string; }

export default function Vistorias() {
  const [signing, setSigning] = useState<string | null>(null);
  const [step, setStep] = useState<"validate" | "sign" | "done">("validate");
  const [accept, setAccept] = useState(false);
  const [fullName, setFullName] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<NewInspection>(empty);
  const [list, setList] = useState<Inspection[]>(inspections);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const openSign = (id: string) => { setSigning(id); setStep("validate"); setAccept(false); setFullName(""); };

  const handleFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.some((e) => file.name.endsWith(e))) {
      toast.error("Formato inválido. Use PDF, DOCX ou TXT.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Arquivo muito grande. Máximo 15MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setAttachments((prev) => [...prev, { name: file.name, size: file.size, url }]);
  };

  const save = () => {
    if (!form.propertyId || !form.clientName.trim() || !form.scheduledDate) {
      toast.error("Preencha imóvel, cliente e data.");
      return;
    }
    const prop = properties.find((p) => p.id === form.propertyId);
    setList((prev) => [...prev, {
      id: `v${Date.now()}`,
      type: form.type as any,
      propertyTitle: prop?.title ?? form.propertyId,
      clientName: form.clientName,
      status: "aguardando" as any,
      createdAt: form.scheduledDate,
    }]);
    toast.success("Vistoria criada!");
    setSheetOpen(false);
    setForm(empty);
    setAttachments([]);
  };

  return (
    <>
      <PageHeader title="Vistorias" description="Documentos de entrada, saída e manutenção">
        <Button className="gradient-primary border-0 shadow-glow gap-2" onClick={() => { setForm(empty); setAttachments([]); setSheetOpen(true); }}>
          <Plus className="w-4 h-4" />Nova vistoria
        </Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-4">
        {list.map((i) => (
          <Card key={i.id} className="p-5 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><FileSignature className="w-5 h-5" /></div>
              <StatusBadge status={i.status} />
            </div>
            <div className="text-xs font-medium uppercase text-muted-foreground tracking-wider">{i.type}</div>
            <h3 className="font-semibold mt-1">{i.propertyTitle}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{i.clientName}</p>
            <p className="text-xs text-muted-foreground mt-3">Criada em {formatDate(i.createdAt)}</p>
            <div className="flex gap-2 mt-4">
              {i.status === "aguardando" ? (
                <Button className="flex-1 gradient-primary border-0" onClick={() => openSign(i.id)}>Iniciar assinatura</Button>
              ) : (
                <Button variant="outline" className="flex-1 gap-1"><Download className="w-4 h-4" />Baixar PDF</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Nova vistoria Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>Nova vistoria</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>Tipo de documento</Label>
              <div className="mt-2 space-y-2">
                {docTypes.map((dt) => (
                  <button key={dt.value} type="button" onClick={() => setForm({ ...form, type: dt.value })}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${form.type === dt.value ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"}`}>
                    <div className="font-medium text-sm">{dt.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{dt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Imóvel *</Label>
              <Select value={form.propertyId} onValueChange={(v) => setForm({ ...form, propertyId: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecionar imóvel..." /></SelectTrigger>
                <SelectContent>
                  {properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.code} — {p.title}</SelectItem>)}
                </SelectContent>
              </Select>
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
              <Label>Data agendada *</Label>
              <Input type="date" className="mt-1.5" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
            </div>
            <div>
              <Label>Observações</Label>
              <Textarea className="mt-1.5" rows={3} placeholder="Condições especiais, itens a inspecionar..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            {/* File upload */}
            <div>
              <Label>Documentos (PDF, DOCX, TXT · máx. 15MB)</Label>
              <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); Array.from(e.dataTransfer.files).forEach(handleFile); }}
                onDragOver={(e) => e.preventDefault()}>
                <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Clique ou arraste arquivos aqui</p>
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" multiple className="hidden"
                onChange={(e) => Array.from(e.target.files ?? []).forEach(handleFile)} />
              {attachments.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {attachments.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/30 text-xs">
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="flex-1 truncate">{a.name}</span>
                      <span className="text-muted-foreground">{(a.size / 1024).toFixed(0)}KB</span>
                      <button onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))} className="text-destructive hover:text-destructive/70">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setSheetOpen(false)}>Cancelar</Button>
              <Button className="flex-1 gradient-primary border-0" onClick={save}>Criar vistoria</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Signature modal */}
      {signing && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSigning(null)}>
          <Card className="max-w-lg w-full p-6 shadow-lg-custom" onClick={(e) => e.stopPropagation()}>
            {step === "validate" && (
              <>
                <div className="flex items-center gap-3 mb-1"><div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><Shield className="w-5 h-5" /></div><h3 className="font-semibold text-lg">Validar identidade</h3></div>
                <p className="text-sm text-muted-foreground mb-5">Confirme seus dados para prosseguir com a assinatura.</p>
                <div className="space-y-3">
                  <div><Label>E-mail cadastrado</Label><Input type="email" className="mt-1.5" placeholder="voce@email.com" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>CPF</Label><Input className="mt-1.5" placeholder="000.000.000-00" /></div>
                    <div><Label>Telefone</Label><Input className="mt-1.5" placeholder="(81) 99999-0000" /></div>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setSigning(null)}>Cancelar</Button>
                  <Button className="flex-1 gradient-primary border-0" onClick={() => setStep("sign")}>Validar e continuar</Button>
                </div>
              </>
            )}
            {step === "sign" && (
              <>
                <h3 className="font-semibold text-lg">Assinatura simples</h3>
                <p className="text-sm text-muted-foreground mb-5">Li e concordo com o documento de vistoria.</p>
                <div className="bg-muted/50 rounded-xl p-4 mb-4 text-xs text-muted-foreground max-h-40 overflow-y-auto">
                  Eu declaro estar de acordo com o conteúdo do documento de vistoria do imóvel, confirmando o estado atual em que recebo/entrego o imóvel. Esta assinatura tem validade jurídica conforme MP 2.200-2/2001.
                </div>
                <div><Label>Nome completo</Label><Input className="mt-1.5" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                <label className="flex items-start gap-2 mt-4 cursor-pointer">
                  <Checkbox checked={accept} onCheckedChange={(v) => setAccept(!!v)} className="mt-0.5" />
                  <span className="text-sm">Aceito e assino digitalmente o documento de vistoria.</span>
                </label>
                <div className="text-xs text-muted-foreground mt-3">Data: {new Date().toLocaleString("pt-BR")} · IP: 200.xxx.xxx.xxx</div>
                <div className="flex gap-2 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("validate")}>Voltar</Button>
                  <Button className="flex-1 gradient-primary border-0" disabled={!accept || !fullName} onClick={() => { setStep("done"); toast.success("Vistoria assinada com sucesso!"); }}>Assinar vistoria</Button>
                </div>
              </>
            )}
            {step === "done" && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-success-soft text-success flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                <h3 className="font-semibold text-lg">Vistoria assinada!</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-6">Você receberá o PDF assinado por e-mail.</p>
                <Button className="w-full gradient-primary border-0" onClick={() => setSigning(null)}>Fechar</Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
