import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Shield, FileSignature, Download } from "lucide-react";
import { inspections, formatDate } from "@/lib/mock-data";
import { toast } from "sonner";

export default function Vistorias() {
  const [signing, setSigning] = useState<string | null>(null);
  const [step, setStep] = useState<"validate" | "sign" | "done">("validate");
  const [accept, setAccept] = useState(false);
  const [fullName, setFullName] = useState("");

  const openSign = (id: string) => { setSigning(id); setStep("validate"); setAccept(false); setFullName(""); };

  return (
    <>
      <PageHeader title="Vistorias" description="Documentos de entrada, saída e manutenção">
        <Button className="gradient-primary border-0 shadow-glow gap-2"><Plus className="w-4 h-4" />Nova vistoria</Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-4">
        {inspections.map((i) => (
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
                  <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground text-center">
                    [reCAPTCHA placeholder] — sou humano
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
