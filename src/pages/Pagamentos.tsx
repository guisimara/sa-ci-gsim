import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download } from "lucide-react";
import { payments, formatBRL, formatDate } from "@/lib/mock-data";

const typeLabel: Record<string, string> = {
  aluguel: "Aluguel", condominio: "Condomínio", iptu: "IPTU", consumo: "Consumo",
  comissao: "Comissão", repasse: "Repasse ao proprietário", taxa: "Taxa administrativa", outros: "Outros",
};

export default function Pagamentos() {
  const [filter, setFilter] = useState("todos");
  const filtered = filter === "todos" ? payments : payments.filter((p) => p.status === filter);

  const totals = {
    pendente: payments.filter((p) => p.status === "pendente").reduce((a, p) => a + p.amount, 0),
    pago: payments.filter((p) => p.status === "pago").reduce((a, p) => a + p.amount, 0),
    vencido: payments.filter((p) => p.status === "vencido").reduce((a, p) => a + p.amount, 0),
  };

  return (
    <>
      <PageHeader title="Pagamentos" description="Boletos, guias e comprovantes">
        <Button className="gradient-primary border-0 shadow-glow gap-2"><Plus className="w-4 h-4" />Nova cobrança</Button>
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
                <td className="p-4 font-medium">{typeLabel[p.type]}</td>
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
    </>
  );
}
