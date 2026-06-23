import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, FileText, KeyRound, CreditCard, ClipboardCheck } from "lucide-react";
import { payments, contracts, inspections, formatBRL, formatDate } from "@/lib/mock-data";

export function ClienteHome() {
  const c = contracts[0];
  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-card gradient-hero text-primary-foreground border-0">
        <div className="text-sm opacity-80">Bem-vinda,</div>
        <h1 className="text-2xl font-bold">Beatriz Mota</h1>
        <p className="text-sm opacity-80 mt-1">Seu imóvel: {c.propertyTitle}</p>
      </Card>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5 shadow-card"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center"><CreditCard className="w-5 h-5" /></div><div><div className="text-xs text-muted-foreground">A pagar</div><div className="font-bold">{formatBRL(2680)}</div></div></div></Card>
        <Card className="p-5 shadow-card"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-success-soft text-success flex items-center justify-center"><FileText className="w-5 h-5" /></div><div><div className="text-xs text-muted-foreground">Contrato</div><div className="font-bold">Ativo</div></div></div></Card>
        <Card className="p-5 shadow-card"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><KeyRound className="w-5 h-5" /></div><div><div className="text-xs text-muted-foreground">Tempo decorrido</div><div className="font-bold">9 meses</div></div></div></Card>
      </div>
    </div>
  );
}

export function ClientePagamentos() {
  return (
    <Card className="shadow-card overflow-hidden">
      <div className="p-5 border-b border-border"><h2 className="font-semibold">Seus pagamentos</h2></div>
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground text-xs"><tr><th className="text-left p-3">Tipo</th><th className="text-left p-3">Vencimento</th><th className="text-right p-3">Valor</th><th className="text-center p-3">Status</th><th></th></tr></thead>
        <tbody>
          {payments.slice(0, 4).map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="p-3 capitalize">{p.type}</td><td className="p-3">{formatDate(p.dueDate)}</td>
              <td className="p-3 text-right font-semibold">{formatBRL(p.amount)}</td>
              <td className="p-3 text-center"><StatusBadge status={p.status} /></td>
              <td className="p-3 text-right"><Button size="sm" variant="ghost" className="gap-1"><Download className="w-4 h-4" />Boleto</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

export function ClienteContrato() {
  const c = contracts[0];
  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5"><div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><FileText className="w-6 h-6" /></div><div><h2 className="font-semibold">Contrato de locação</h2><p className="text-sm text-muted-foreground">{c.propertyTitle}</p></div></div>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div><div className="text-muted-foreground text-xs">Início</div><div className="font-medium">{formatDate(c.startDate)}</div></div>
        <div><div className="text-muted-foreground text-xs">Término</div><div className="font-medium">{formatDate(c.endDate)}</div></div>
        <div><div className="text-muted-foreground text-xs">Aluguel mensal</div><div className="font-medium">{formatBRL(c.monthlyValue)}</div></div>
        <div><div className="text-muted-foreground text-xs">Fidelidade</div><div className="font-medium">{c.mandatoryMonths} meses</div></div>
      </div>
      <Button className="mt-6 gradient-primary border-0 gap-2"><Download className="w-4 h-4" />Baixar contrato em PDF</Button>
    </Card>
  );
}

export function ClienteVistoria() {
  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-center gap-3 mb-5"><div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><ClipboardCheck className="w-6 h-6" /></div><div><h2 className="font-semibold">Vistoria de entrada</h2><p className="text-sm text-muted-foreground">{inspections[0].propertyTitle}</p></div></div>
      <div className="flex items-center justify-between p-4 bg-success-soft rounded-xl">
        <div><div className="font-medium text-success">Vistoria assinada</div><div className="text-xs text-success/80">em {formatDate(inspections[0].createdAt)}</div></div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Baixar PDF</Button>
      </div>
    </Card>
  );
}

export function ClienteLocacao() {
  const c = contracts[0];
  const elapsed = 9;
  const mandPct = (c.mandatoryMonths / c.totalMonths) * 100;
  const curPct = (elapsed / c.totalMonths) * 100;
  return (
    <Card className="p-6 shadow-card">
      <h2 className="font-semibold mb-5">Acompanhamento da sua locação</h2>
      <div className="relative">
        <div className="h-3 rounded-full bg-muted overflow-hidden flex">
          <div className="bg-warning h-full" style={{ width: `${mandPct}%` }} />
          <div className="bg-success h-full" style={{ width: `${100 - mandPct}%` }} />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-card shadow-glow" style={{ left: `${curPct}%` }} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="bg-muted/50 rounded-xl p-3"><div className="text-xs text-muted-foreground">Decorridos</div><div className="font-bold text-lg">{elapsed}m</div></div>
        <div className="bg-muted/50 rounded-xl p-3"><div className="text-xs text-muted-foreground">Restantes</div><div className="font-bold text-lg">{c.totalMonths - elapsed}m</div></div>
        <div className="bg-warning-soft rounded-xl p-3"><div className="text-xs text-warning">Fidelidade</div><div className="font-bold text-lg text-warning">{Math.max(0, c.mandatoryMonths - elapsed)}m</div></div>
        <div className="bg-success-soft rounded-xl p-3"><div className="text-xs text-success">Multa hoje</div><div className="font-bold text-lg text-success">{elapsed < c.mandatoryMonths ? formatBRL(c.monthlyValue * c.penalty) : "R$ 0,00"}</div></div>
      </div>
    </Card>
  );
}

export function ClienteArquivos() {
  const files = [
    { n: "Contrato_assinado.pdf", t: "Contrato", s: "245 KB" },
    { n: "Vistoria_entrada.pdf", t: "Vistoria", s: "1.2 MB" },
    { n: "Boleto_Janeiro_2025.pdf", t: "Boleto", s: "98 KB" },
    { n: "Comprovante_caucao.pdf", t: "Recibo", s: "120 KB" },
  ];
  return (
    <Card className="shadow-card overflow-hidden">
      <div className="p-5 border-b border-border"><h2 className="font-semibold">Seus arquivos</h2></div>
      <div className="divide-y divide-border">
        {files.map((f) => (
          <div key={f.n} className="p-4 flex items-center gap-3 hover:bg-muted/30">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><FileText className="w-4 h-4 text-muted-foreground" /></div>
            <div className="flex-1 min-w-0"><div className="font-medium text-sm truncate">{f.n}</div><div className="text-xs text-muted-foreground">{f.t} · {f.s}</div></div>
            <Button size="sm" variant="ghost" className="gap-1"><Download className="w-4 h-4" />Baixar</Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ClienteSuporte() {
  return (
    <Card className="p-6 shadow-card">
      <h2 className="font-semibold mb-1">Suporte</h2>
      <p className="text-sm text-muted-foreground mb-5">Precisa de ajuda? Entre em contato conosco.</p>
      <Button className="gradient-primary border-0 shadow-glow gap-2">Abrir conversa no WhatsApp</Button>
    </Card>
  );
}
