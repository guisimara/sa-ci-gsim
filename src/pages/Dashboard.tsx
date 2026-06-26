import { Card } from "@/components/ui/card";
import { Building2, Users, FileText, TrendingUp, KeyRound, Wallet, AlertTriangle, Send } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { PageHeader } from "@/components/PageHeader";
import { leadsBySource, monthlyRevenue, properties, payments, leads, formatBRL, formatDate } from "@/lib/mock-data";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Dashboard() {
  const topProperties = [...properties].sort((a, b) => b.leads - a.leads).slice(0, 5);
  const nextPayments = payments.filter((p) => p.status === "pendente").slice(0, 5);

  return (
    <>
      <PageHeader title="Olá, Ana 👋" description="Aqui está um panorama da sua operação hoje." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Imóveis cadastrados" value={properties.length} icon={<Building2 className="w-5 h-5" />} trend={{ value: "12%", up: true }} />
        <KpiCard label="Leads ativos" value={leads.filter((l) => l.status === "ativo").length} icon={<Users className="w-5 h-5" />} accent="info" trend={{ value: "8%", up: true }} />
        <KpiCard label="Propostas enviadas" value={3} icon={<Send className="w-5 h-5" />} accent="warning" />
        <KpiCard label="Vendas fechadas (mês)" value={2} icon={<FileText className="w-5 h-5" />} accent="success" trend={{ value: "1", up: true }} />
        <KpiCard label="Locações ativas" value={8} icon={<KeyRound className="w-5 h-5" />} accent="primary" />
        <KpiCard label="Receita prevista" value={formatBRL(187400)} icon={<TrendingUp className="w-5 h-5" />} accent="success" hint="próximos 30 dias" />
        <KpiCard label="Comissões a receber" value={formatBRL(28600)} icon={<Wallet className="w-5 h-5" />} accent="primary" />
        <KpiCard label="Pendências" value={5} icon={<AlertTriangle className="w-5 h-5" />} accent="destructive" hint="contratos, vistorias, boletos" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-6 shadow-card lg:col-span-1">
          <h3 className="font-semibold mb-1">Leads por origem</h3>
          <p className="text-xs text-muted-foreground mb-4">Últimos 30 dias</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={leadsBySource} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {leadsBySource.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
            {leadsBySource.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Faturamento mensal</h3>
              <p className="text-xs text-muted-foreground">Receita recebida nos últimos 6 meses</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatBRL(240600)}</div>
              <div className="text-xs text-success font-medium">↑ 18% vs período anterior</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(258 78% 60%)" />
                  <stop offset="100%" stopColor="hsl(258 78% 80%)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
              <Tooltip formatter={(v: number) => formatBRL(v)} contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="value" fill="url(#bar)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-6 shadow-card lg:col-span-2">
          <h3 className="font-semibold mb-4">Imóveis com mais leads</h3>
          <div className="space-y-3">
            {topProperties.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="text-sm font-bold text-muted-foreground w-5">{i + 1}</div>
                <img src={p.photo} alt={p.title} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.code} · {p.neighborhood}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{p.leads}</div>
                  <div className="text-xs text-muted-foreground">leads</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-4">Próximas cobranças</h3>
          <div className="space-y-3">
            {nextPayments.map((p) => (
              <div key={p.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-lg bg-warning-soft text-warning flex items-center justify-center text-xs font-bold">
                  {new Date(p.dueDate).getDate()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate capitalize">{p.type}</div>
                  <div className="text-xs text-muted-foreground truncate">{p.payer}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatBRL(p.amount)}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(p.dueDate)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </>
  );
}
