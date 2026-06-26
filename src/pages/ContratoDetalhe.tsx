import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Upload, Download, Trash2 } from "lucide-react";
import { contracts, formatBRL, formatDate } from "@/lib/mock-data";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
const ALLOWED_EXT = [".pdf", ".docx", ".txt"];

interface Attachment { name: string; size: number; url: string; }

export default function ContratoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contract = contracts.find((c) => c.id === id);
  const inputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  if (!contract) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Contrato não encontrado.</p>
        <Button className="mt-4" onClick={() => navigate("/contratos")}>Voltar</Button>
      </div>
    );
  }

  const handleFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.some((e) => file.name.endsWith(e))) {
      toast.error("Formato inválido. Use PDF, DOCX ou TXT.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Arquivo muito grande. Máximo 10MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setAttachments((prev) => [...prev, { name: file.name, size: file.size, url }]);
    toast.success("Documento anexado!");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach(handleFile);
  };

  return (
    <>
      <PageHeader title={contract.propertyTitle} description={`Contrato · ${contract.clientName}`}>
        <Button variant="outline" className="gap-2" onClick={() => navigate("/contratos")}><ArrowLeft className="w-4 h-4" />Voltar</Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 shadow-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary" />Detalhes do contrato</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Imóvel</span><p className="font-medium mt-0.5">{contract.propertyTitle}</p></div>
              <div><span className="text-muted-foreground">Cliente</span><p className="font-medium mt-0.5">{contract.clientName}</p></div>
              <div><span className="text-muted-foreground">Corretor</span><p className="font-medium mt-0.5">{contract.broker}</p></div>
              <div><span className="text-muted-foreground">Status</span><div className="mt-0.5"><StatusBadge status={contract.status} /></div></div>
              <div><span className="text-muted-foreground">Início</span><p className="font-medium mt-0.5">{formatDate(contract.startDate)}</p></div>
              <div><span className="text-muted-foreground">Término</span><p className="font-medium mt-0.5">{formatDate(contract.endDate)}</p></div>
              <div><span className="text-muted-foreground">Vigência</span><p className="font-medium mt-0.5">{contract.totalMonths} meses</p></div>
              <div><span className="text-muted-foreground">Fidelidade</span><p className="font-medium mt-0.5">{contract.mandatoryMonths} meses</p></div>
              <div><span className="text-muted-foreground">Multa rescisória</span><p className="font-medium mt-0.5">{contract.penalty}x o valor mensal</p></div>
              <div><span className="text-muted-foreground">Valor mensal</span><p className="font-bold text-primary mt-0.5">{formatBRL(contract.monthlyValue)}</p></div>
            </div>
          </Card>

          {/* Document upload */}
          <Card className="p-6 shadow-card">
            <h3 className="font-semibold mb-4">Documentos anexados</h3>
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary-soft/10 transition-colors"
              onClick={() => inputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Clique ou arraste para anexar</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX ou TXT · máx. 10MB por arquivo</p>
            </div>
            <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" multiple className="hidden"
              onChange={(e) => Array.from(e.target.files ?? []).forEach(handleFile)} />

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{(a.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1" asChild>
                      <a href={a.url} download={a.name}><Download className="w-4 h-4" /></a>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6 shadow-card">
            <h3 className="font-semibold mb-4">Resumo financeiro</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Valor/mês</span><span className="font-bold">{formatBRL(contract.monthlyValue)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total vigência</span><span className="font-semibold">{formatBRL(contract.monthlyValue * contract.totalMonths)}</span></div>
              <div className="flex justify-between border-t border-border pt-3"><span className="text-muted-foreground">Multa atual</span><span className="font-semibold text-destructive">{formatBRL(contract.monthlyValue * contract.penalty)}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
