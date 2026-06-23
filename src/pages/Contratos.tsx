import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Sparkles, Upload } from "lucide-react";
import { contracts, formatBRL, formatDate } from "@/lib/mock-data";

export default function Contratos() {
  return (
    <>
      <PageHeader title="Contratos" description={`${contracts.length} contratos gerenciados`}>
        <Button variant="outline" className="gap-2"><Sparkles className="w-4 h-4 text-primary" />Extrair dados com IA</Button>
        <Button className="gradient-primary border-0 shadow-glow gap-2"><Plus className="w-4 h-4" />Novo contrato</Button>
      </PageHeader>

      <Card className="shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr><th className="text-left p-4">Imóvel</th><th className="text-left p-4">Cliente</th><th className="text-left p-4">Corretor</th><th className="text-left p-4">Vigência</th><th className="text-left p-4">Fidelidade</th><th className="text-right p-4">Valor</th><th className="text-center p-4">Status</th><th></th></tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
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
                <td className="p-4 text-right"><Button variant="ghost" size="sm">Abrir</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="mt-6 p-6 shadow-card border-2 border-dashed border-primary/30 bg-primary-soft/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"><Upload className="w-6 h-6" /></div>
          <div className="flex-1">
            <h3 className="font-semibold">Anexar contrato e extrair dados automaticamente</h3>
            <p className="text-sm text-muted-foreground">Faça upload do PDF e nossa IA extrai prazo, fidelidade, multa e cláusulas — em breve.</p>
          </div>
          <Button variant="outline" className="gap-2"><Sparkles className="w-4 h-4 text-primary" />Em breve</Button>
        </div>
      </Card>
    </>
  );
}
