import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Download, FileText, KeyRound, CreditCard, ClipboardCheck,
  Mail, Phone, AlertCircle, Clock, CheckCircle2, Upload, MessageCircle,
} from "lucide-react";
import { payments, contracts, inspections, formatBRL, formatDate } from "@/lib/mock-data";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

// ─── Mock: logged-in client ───────────────────────────────────────────────────
const CLIENTE = {
  name: "Beatriz Mota",
  email: "beatriz.mota@email.com",
  phone: "(81) 99988-7766",
  cpf: "123.456.789-00",
};

// Find contract & inspection by client name (simulated CPF/email/name match)
const clientContract = contracts.find((c) =>
  c.clientName.toLowerCase().includes("beatriz") || c.clientName === CLIENTE.name
) ?? contracts[0];

const clientInspection = inspections.find((i) =>
  i.clientName.toLowerCase().includes("beatriz") || i.clientName === CLIENTE.name
) ?? inspections[0];

const clientPayments = payments.filter((p) => p.payer === CLIENTE.name || p.payer.toLowerCase().includes("beatriz")).length
  ? payments.filter((p) => p.payer === CLIENTE.name || p.payer.toLowerCase().includes("beatriz"))
  : payments.slice(0, 4);

// ─── Payment notification bar ─────────────────────────────────────────────────
function PaymentBar() {
  const next = clientPayments.find((p) => p.status === "pendente" || p.status === "vencido");
  if (!next) return null;

  const dueMs = new Date(next.dueDate).getTime() - Date.now();
  const daysLeft = Math.ceil(dueMs / (1000 * 60 * 60 * 24));

  if (next.status === "vencido") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Pagamento em atraso — {formatBRL(next.amount)} venceu em {formatDate(next.dueDate)}</span>
      </div>
    );
  }
  if (daysLeft <= 3) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-medium">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Atenção! Seu pagamento vence em <strong>{daysLeft} dia{daysLeft !== 1 ? "s" : ""}</strong> — {formatBRL(next.amount)}</span>
      </div>
    );
  }
  if (daysLeft <= 7) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-warning/10 border border-warning/30 text-warning text-sm font-medium">
        <Clock className="w-4 h-4 flex-shrink-0" />
        <span>Seu pagamento vence em <strong>{daysLeft} dias</strong> — {formatBRL(next.amount)}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-info-soft border border-info/20 text-info text-sm font-medium">
      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
      <span>Pagamento pendente — {formatBRL(next.amount)} · vence em {formatDate(next.dueDate)}</span>
    </div>
  );
}

// ─── Elapsed months calculation ───────────────────────────────────────────────
function calcElapsed(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
}

// ─── ClienteHome ──────────────────────────────────────────────────────────────
export function ClienteHome() {
  const c = clientContract;
  const elapsed = Math.max(0, calcElapsed(c.startDate));

  const contractStatusColor: Record<string, string> = {
    ativo: "text-success",
    encerrado: "text-muted-foreground",
    pendente: "text-warning",
  };

  return (
    <div className="space-y-4">
      {/* Banner card */}
      <Card className="p-6 shadow-card gradient-hero text-primary-foreground border-0">
        <div className="text-sm opacity-80">Bem-vinda,</div>
        <h1 className="text-2xl font-bold">{CLIENTE.name}</h1>
        <p className="text-sm opacity-80 mt-0.5">Seu imóvel: {c.propertyTitle}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm opacity-90">
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{CLIENTE.phone}</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{CLIENTE.email}</span>
        </div>
      </Card>

      {/* Payment notification bar */}
      <PaymentBar />

      {/* KPI cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Valor Contrato</div>
              <div className="font-bold">{formatBRL(c.monthlyValue)}<span className="text-xs font-normal text-muted-foreground">/mês</span></div>
            </div>
          </div>
        </Card>
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-soft text-success flex items-center justify-center"><FileText className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Contrato</div>
              <div className={`font-bold capitalize ${contractStatusColor[c.status] ?? ""}`}>{c.status === "ativo" ? "Ativo" : c.status === "encerrado" ? "Cancelado" : c.status}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center"><KeyRound className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Tempo decorrido</div>
              <div className="font-bold">{elapsed} {elapsed === 1 ? "mês" : "meses"}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── ClientePagamentos ────────────────────────────────────────────────────────
export function ClientePagamentos() {
  return (
    <Card className="shadow-card overflow-hidden">
      <div className="p-5 border-b border-border"><h2 className="font-semibold">Seus pagamentos</h2></div>
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground text-xs">
          <tr><th className="text-left p-3">Tipo</th><th className="text-left p-3">Vencimento</th><th className="text-right p-3">Valor</th><th className="text-center p-3">Status</th><th className="text-right p-3">Ações</th></tr>
        </thead>
        <tbody>
          {clientPayments.map((p) => (
            <tr key={p.id} className="border-t border-border hover:bg-muted/30">
              <td className="p-3 capitalize">{p.type}</td>
              <td className="p-3">{formatDate(p.dueDate)}</td>
              <td className="p-3 text-right font-semibold">{formatBRL(p.amount)}</td>
              <td className="p-3 text-center"><StatusBadge status={p.status} /></td>
              <td className="p-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button size="sm" variant="ghost" className="gap-1 text-xs h-7 px-2" onClick={() => toast.info("Baixando boleto/PIX...")}><Download className="w-3.5 h-3.5" />Boleto/PIX</Button>
                  <Button size="sm" variant="outline" className="gap-1 text-xs h-7 px-2" onClick={() => toast.success("Comprovante enviado!")}>
                    <Upload className="w-3.5 h-3.5" />Comprovante
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// ─── ClienteContrato ──────────────────────────────────────────────────────────
export function ClienteContrato() {
  const c = clientContract;
  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><FileText className="w-6 h-6" /></div>
        <div>
          <h2 className="font-semibold">Contrato de locação</h2>
          <p className="text-sm text-muted-foreground">{c.propertyTitle}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={c.status} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div><div className="text-muted-foreground text-xs">Início</div><div className="font-medium">{formatDate(c.startDate)}</div></div>
        <div><div className="text-muted-foreground text-xs">Término</div><div className="font-medium">{formatDate(c.endDate)}</div></div>
        <div><div className="text-muted-foreground text-xs">Aluguel mensal</div><div className="font-medium">{formatBRL(c.monthlyValue)}</div></div>
        <div><div className="text-muted-foreground text-xs">Fidelidade</div><div className="font-medium">{c.mandatoryMonths} meses</div></div>
        <div><div className="text-muted-foreground text-xs">Multa rescisória</div><div className="font-medium">{formatBRL(c.monthlyValue * c.penalty)}</div></div>
        <div><div className="text-muted-foreground text-xs">Corretor</div><div className="font-medium">{c.broker}</div></div>
      </div>
      <div className="mt-6 p-4 rounded-xl bg-primary-soft/50 border border-primary/20 flex items-center gap-3">
        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Contrato_assinado_{c.clientName.replace(" ", "_")}.pdf</p>
          <p className="text-xs text-muted-foreground">Vinculado automaticamente ao seu cadastro</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1 flex-shrink-0"><Download className="w-4 h-4" />Baixar</Button>
      </div>
    </Card>
  );
}

// ─── ClienteVistoria ──────────────────────────────────────────────────────────
export function ClienteVistoria() {
  const i = clientInspection;
  const typeLabel: Record<string, string> = {
    entrada: "Vistoria de Entrada",
    saida: "Vistoria de Saída",
    manutencao: "Vistoria de Manutenção",
    ENTRADA: "Vistoria de Entrada",
    SAIDA: "Vistoria de Saída",
    MANUTENCAO: "Vistoria de Manutenção",
  };
  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><ClipboardCheck className="w-6 h-6" /></div>
        <div>
          <h2 className="font-semibold">{typeLabel[i.type] ?? "Vistoria"}</h2>
          <p className="text-sm text-muted-foreground">{i.propertyTitle}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={i.status} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 text-sm mb-5">
        <div><div className="text-muted-foreground text-xs">Data</div><div className="font-medium">{formatDate(i.createdAt)}</div></div>
        <div><div className="text-muted-foreground text-xs">Cliente</div><div className="font-medium">{i.clientName}</div></div>
      </div>
      <div className={`flex items-center justify-between p-4 rounded-xl ${i.status === "assinado" ? "bg-success-soft" : "bg-warning-soft"}`}>
        <div>
          <div className={`font-medium ${i.status === "assinado" ? "text-success" : "text-warning"}`}>
            {i.status === "assinado" ? "Vistoria assinada" : "Aguardando assinatura"}
          </div>
          <div className={`text-xs mt-0.5 ${i.status === "assinado" ? "text-success/80" : "text-warning/80"}`}>
            {i.status === "assinado" ? `Assinada em ${formatDate(i.createdAt)}` : "Pendente de assinatura digital"}
          </div>
        </div>
        {i.status === "assinado" && (
          <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" />Baixar PDF</Button>
        )}
      </div>
      <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border flex items-center gap-3">
        <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Vistoria_{i.type}_{i.clientName.replace(" ", "_")}.pdf</p>
          <p className="text-xs text-muted-foreground">Vinculado automaticamente ao seu cadastro</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1 flex-shrink-0"><Download className="w-4 h-4" />Baixar</Button>
      </div>
    </Card>
  );
}

// ─── ClienteLocacao ───────────────────────────────────────────────────────────
export function ClienteLocacao() {
  const c = clientContract;
  const elapsed = Math.max(0, Math.min(calcElapsed(c.startDate), c.totalMonths));
  const curPct = (elapsed / c.totalMonths) * 100;
  const mandPct = (c.mandatoryMonths / c.totalMonths) * 100;
  const fidRestante = Math.max(0, c.mandatoryMonths - elapsed);
  const multa = elapsed < c.mandatoryMonths ? c.monthlyValue * c.penalty : 0;

  return (
    <Card className="p-6 shadow-card">
      <h2 className="font-semibold mb-6">Acompanhamento da sua locação</h2>

      {/* Progress bar */}
      <div className="relative mb-10">
        {/* Labels */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Início</span>
          <span className="text-warning font-medium">Fidelidade ({c.mandatoryMonths}m)</span>
          <span>Fim ({c.totalMonths}m)</span>
        </div>

        {/* Track */}
        <div className="relative h-4 rounded-full overflow-visible bg-primary/10">
          {/* Filled portion (elapsed) */}
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all"
            style={{
              width: `${curPct}%`,
              background: elapsed < c.mandatoryMonths
                ? "linear-gradient(to right, hsl(45 93% 47%), hsl(45 93% 60%))"
                : "linear-gradient(to right, hsl(258 78% 60%), hsl(258 78% 72%))",
            }}
          />
          {/* Fidelidade marker line */}
          <div
            className="absolute top-0 h-full w-0.5 bg-warning/50"
            style={{ left: `${mandPct}%` }}
          />
          {/* Current position: vertical tab/arrow */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${curPct}%` }}
          >
            <div className="w-3 h-3 rotate-45 bg-primary border-2 border-card shadow-glow" />
            <div className="mt-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
              Agora
            </div>
          </div>
        </div>

        {/* Remaining track label */}
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-primary/50">Restante (pastel)</span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
        <div className="bg-primary-soft rounded-xl p-4">
          <div className="text-xs text-primary font-medium mb-1">Meses concluídos</div>
          <div className="font-bold text-2xl text-primary">{elapsed}</div>
          <div className="text-xs text-primary/70">de {c.totalMonths} meses</div>
        </div>
        <div className="bg-muted/50 rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-medium mb-1">Meses restantes</div>
          <div className="font-bold text-2xl">{Math.max(0, c.totalMonths - elapsed)}</div>
          <div className="text-xs text-muted-foreground">até o fim</div>
        </div>
        <div className="bg-warning-soft rounded-xl p-4">
          <div className="text-xs text-warning font-medium mb-1">Fidelidade restante</div>
          <div className="font-bold text-2xl text-warning">{fidRestante}</div>
          <div className="text-xs text-warning/70">{fidRestante === 0 ? "Cumprida ✓" : "meses"}</div>
        </div>
        <div className="bg-muted/40 rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-medium mb-1">Vigência contratual</div>
          <div className="font-bold text-2xl">{c.totalMonths}</div>
          <div className="text-xs text-muted-foreground">meses totais</div>
        </div>
        <div className={`rounded-xl p-4 ${multa > 0 ? "bg-destructive/10" : "bg-success-soft"}`}>
          <div className={`text-xs font-medium mb-1 ${multa > 0 ? "text-destructive" : "text-success"}`}>Valor multa hoje</div>
          <div className={`font-bold text-lg ${multa > 0 ? "text-destructive" : "text-success"}`}>{formatBRL(multa)}</div>
          <div className={`text-xs ${multa > 0 ? "text-destructive/70" : "text-success/70"}`}>{multa > 0 ? `${c.penalty}x valor mensal` : "Sem multa"}</div>
        </div>
      </div>
    </Card>
  );
}

// ─── ClienteArquivos ──────────────────────────────────────────────────────────
const arquivos = {
  contrato: [
    { n: "Contrato_assinado.pdf", s: "245 KB", date: "10/01/2025" },
    { n: "Aditivo_contrato.pdf", s: "98 KB", date: "15/03/2025" },
  ],
  vistoria: [
    { n: "Vistoria_entrada.pdf", s: "1.2 MB", date: "10/01/2025" },
  ],
  pagamentos: [
    { n: "Boleto_Janeiro_2025.pdf", s: "98 KB", date: "05/01/2025" },
    { n: "Comprovante_caucao.pdf", s: "120 KB", date: "10/01/2025" },
    { n: "Boleto_Fevereiro_2025.pdf", s: "98 KB", date: "05/02/2025" },
  ],
};

export function ClienteArquivos() {
  const [tab, setTab] = useState<"contrato" | "vistoria" | "pagamentos">("contrato");
  const tabs: { id: typeof tab; label: string; count: number }[] = [
    { id: "contrato", label: "Contrato", count: arquivos.contrato.length },
    { id: "vistoria", label: "Vistoria", count: arquivos.vistoria.length },
    { id: "pagamentos", label: "Pagamentos", count: arquivos.pagamentos.length },
  ];

  return (
    <Card className="shadow-card overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/30">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 px-4 py-3.5 text-sm font-medium transition-colors border-b-2 ${tab === t.id ? "border-primary text-primary bg-card" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="divide-y divide-border">
        {arquivos[tab].map((f) => (
          <div key={f.n} className="p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center"><FileText className="w-4 h-4" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{f.n}</div>
              <div className="text-xs text-muted-foreground">{f.s} · {f.date}</div>
            </div>
            <Button size="sm" variant="ghost" className="gap-1"><Download className="w-4 h-4" />Baixar</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── ClienteSuporte ───────────────────────────────────────────────────────────
export function ClienteSuporte() {
  const { addNotification } = useApp();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const BROKER_PHONE = "5581999990000"; // mock broker WhatsApp
  const BROKER_EMAIL = "ana@corretor360.com";

  const submit = () => {
    if (!message.trim()) { toast.error("Escreva sua mensagem."); return; }
    // Add notification for broker
    addNotification({
      id: `sup${Date.now()}`,
      type: "support",
      title: "🎧 Novo suporte solicitado",
      message: `${CLIENTE.name} enviou uma mensagem: "${message.slice(0, 60)}${message.length > 60 ? "..." : ""}"`,
      time: "agora",
      read: false,
      link: "/crm",
    });
    toast.success(`Mensagem enviada! ${BROKER_EMAIL} foi notificado.`);
    setSent(true);
  };

  const waText = encodeURIComponent(
    `Olá! Sou ${CLIENTE.name} (${CLIENTE.phone}), cliente da Imobiliária Souza. Preciso de suporte: ${message || "..."}`
  );

  if (sent) {
    return (
      <Card className="p-8 shadow-card text-center">
        <div className="w-16 h-16 rounded-2xl bg-success-soft text-success flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
        <h2 className="font-semibold text-lg">Mensagem enviada!</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6">O corretor foi notificado e entrará em contato em breve.</p>
        <Button variant="outline" onClick={() => { setSent(false); setMessage(""); }}>Enviar nova mensagem</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><MessageCircle className="w-6 h-6" /></div>
        <div>
          <h2 className="font-semibold">Suporte</h2>
          <p className="text-sm text-muted-foreground">Fale com o seu corretor</p>
        </div>
      </div>

      {/* Pre-filled client data */}
      <div className="grid sm:grid-cols-2 gap-3 mb-4 p-4 rounded-xl bg-muted/40 border border-border text-sm">
        <div><span className="text-xs text-muted-foreground">Nome</span><p className="font-medium">{CLIENTE.name}</p></div>
        <div><span className="text-xs text-muted-foreground">CPF</span><p className="font-medium">{CLIENTE.cpf}</p></div>
        <div><span className="text-xs text-muted-foreground">E-mail</span><p className="font-medium flex items-center gap-1"><Mail className="w-3 h-3" />{CLIENTE.email}</p></div>
        <div><span className="text-xs text-muted-foreground">Telefone</span><p className="font-medium flex items-center gap-1"><Phone className="w-3 h-3" />{CLIENTE.phone}</p></div>
      </div>

      <div className="mb-4">
        <Label>Sua mensagem *</Label>
        <Textarea
          className="mt-1.5"
          rows={5}
          placeholder="Descreva sua dúvida, problema ou solicitação..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 gradient-primary border-0 shadow-glow gap-2" onClick={submit}>
          <MessageCircle className="w-4 h-4" />Enviar para o corretor
        </Button>
        <Button variant="outline" className="flex-1 gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10" asChild>
          <a href={`https://wa.me/${BROKER_PHONE}?text=${waText}`} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.102.549 4.076 1.503 5.795L.057 23.625a.75.75 0 00.916.919l5.84-1.49A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.72 9.72 0 01-4.98-1.372l-.352-.21-3.655.933.96-3.543-.23-.365A9.72 9.72 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
            Chamar no WhatsApp
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Sua solicitação será registrada no sistema do corretor e você receberá retorno em até 24h.
      </p>
    </Card>
  );
}
