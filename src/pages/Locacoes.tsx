import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contracts, formatBRL, formatDate, Contract } from "@/lib/mock-data";
import { Calendar, Clock, AlertCircle } from "lucide-react";

function monthsBetween(a: string, b: string) {
  const d1 = new Date(a), d2 = new Date(b);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

function ContractProgress({ c }: { c: Contract }) {
  const elapsed = Math.max(0, Math.min(c.totalMonths, monthsBetween(c.startDate, new Date().toISOString())));
  const remaining = c.totalMonths - elapsed;
  const mandatoryPct = (c.mandatoryMonths / c.totalMonths) * 100;
  const currentPct = (elapsed / c.totalMonths) * 100;
  const inMandatory = elapsed < c.mandatoryMonths;

  return (
    <Card className="p-6 shadow-card">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h3 className="font-semibold">{c.propertyTitle}</h3>
          <p className="text-sm text-muted-foreground">{c.clientName} · Corretor: {c.broker}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={c.status} />
          <div className="text-right">
            <div className="font-bold">{formatBRL(c.monthlyValue)}</div>
            <div className="text-xs text-muted-foreground">por mês</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-3 rounded-full overflow-hidden bg-muted flex">
          <div className="h-full bg-warning" style={{ width: `${mandatoryPct}%` }} />
          <div className="h-full bg-success" style={{ width: `${100 - mandatoryPct}%` }} />
        </div>
        {/* current marker */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-card shadow-glow" style={{ left: `${currentPct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>Início: {formatDate(c.startDate)}</span>
        <span className="font-medium" style={{ marginLeft: `${mandatoryPct - 8}%` }}>Fim da fidelidade ({c.mandatoryMonths}m)</span>
        <span>Término: {formatDate(c.endDate)}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <div className="bg-muted/50 rounded-xl p-3"><div className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />Decorridos</div><div className="font-bold text-lg mt-1">{elapsed}m</div></div>
        <div className="bg-muted/50 rounded-xl p-3"><div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Restantes</div><div className="font-bold text-lg mt-1">{remaining}m</div></div>
        <div className="bg-warning-soft rounded-xl p-3"><div className="text-xs text-warning flex items-center gap-1"><AlertCircle className="w-3 h-3" />Fidelidade</div><div className="font-bold text-lg mt-1 text-warning">{inMandatory ? `${c.mandatoryMonths - elapsed}m` : "Cumprida"}</div></div>
        <div className="bg-success-soft rounded-xl p-3"><div className="text-xs text-success">Multa atual</div><div className="font-bold text-lg mt-1 text-success">{inMandatory ? formatBRL(c.monthlyValue * c.penalty) : "Sem multa"}</div></div>
      </div>
    </Card>
  );
}

export default function Locacoes() {
  return (
    <>
      <PageHeader title="Locações" description="Acompanhamento de contratos de aluguel ativos">
        <Button variant="outline">Exportar relatório</Button>
      </PageHeader>
      <div className="space-y-4">
        {contracts.filter((c) => c.status === "ativo").map((c) => <ContractProgress key={c.id} c={c} />)}
      </div>
    </>
  );
}
