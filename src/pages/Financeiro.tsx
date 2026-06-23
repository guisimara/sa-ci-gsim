import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Wallet, Receipt, ArrowDownLeft, ArrowUpRight, PiggyBank } from "lucide-react";
import { formatBRL, monthlyRevenue, payments } from "@/lib/mock-data";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Financeiro() {
  return (
    <>
      <PageHeader title="Financeiro" description="Receitas, comissões e repasses">
        <Button variant="outline">Exportar Excel</Button>
      </PageHeader>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Receita prevista (mês)" value={formatBRL(64200)} icon={<TrendingUp className="w-5 h-5" />} accent="info" />
        <KpiCard label="Receita recebida" value={formatBRL(47600)} icon={<ArrowDownLeft className="w-5 h-5" />} accent="success" trend={{ value: "12%", up: true }} />
        <KpiCard label="Comissões a receber" value={formatBRL(28600)} icon={<Wallet className="w-5 h-5" />} accent="primary" />
        <KpiCard label="Repasses pendentes" value={formatBRL(8420)} icon={<ArrowUpRight className="w-5 h-5" />} accent="warning" />
        <KpiCard label="Despesas" value={formatBRL(6800)} icon={<Receipt className="w-5 h-5" />} accent="destructive" />
        <KpiCard label="Lucro estimado" value={formatBRL(33980)} icon={<PiggyBank className="w-5 h-5" />} accent="success" />
      </div>

      <Card className="p-6 shadow-card mt-6">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="font-semibold">Evolução de receita</h3><p className="text-xs text-muted-foreground">Últimos 6 meses</p></div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(258 78% 60%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(258 78% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
            <Tooltip formatter={(v: number) => formatBRL(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
            <Area type="monotone" dataKey="value" stroke="hsl(258 78% 60%)" strokeWidth={3} fill="url(#area)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 shadow-card mt-6">
        <h3 className="font-semibold mb-4">Pendências financeiras</h3>
        <div className="space-y-2">
          {payments.filter((p) => p.status !== "pago").map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40">
              <div>
                <div className="font-medium capitalize">{p.type} — {p.payer}</div>
                <div className="text-xs text-muted-foreground">{p.propertyTitle}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatBRL(p.amount)}</div>
                <div className="text-xs text-muted-foreground">Vence {new Date(p.dueDate).toLocaleDateString("pt-BR")}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
