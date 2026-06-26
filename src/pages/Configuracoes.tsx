import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Zap, Star, Building2 } from "lucide-react";
import { toast } from "sonner";

// ─── Planos ───────────────────────────────────────────────────────────────────
const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    color: "text-info",
    bg: "bg-info-soft",
    features: ["1 usuário", "30 imóveis", "CRM Kanban", "Site básico", "Central do cliente"],
    prices: { mensal: 39.90, semestral: 199.90, anual: 349.90 },
  },
  {
    id: "pro",
    name: "PRO",
    icon: Star,
    color: "text-primary",
    bg: "bg-primary-soft",
    featured: true,
    features: ["3 usuários", "Imóveis ilimitados", "Site white-label", "Contratos e vistorias", "Relatórios avançados"],
    prices: { mensal: 39.90, semestral: 199.90, anual: 349.90 },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    color: "text-success",
    bg: "bg-success-soft",
    features: ["Usuários ilimitados", "Matriz + corretores", "Dashboards consolidados", "Permissões avançadas", "Suporte prioritário"],
    prices: { mensal: 39.90, semestral: 199.90, anual: 349.90 },
  },
];

const cycles = [
  { id: "mensal" as const, label: "Mensal", price: "R$ 39,90", sub: "/mês", badge: null },
  { id: "semestral" as const, label: "Semestral", price: "R$ 199,90", sub: "/semestre", badge: "Economize 16%" },
  { id: "anual" as const, label: "Anual", price: "R$ 349,90", sub: "/ano", badge: "2 meses grátis" },
];

type Cycle = "mensal" | "semestral" | "anual";

export default function Configuracoes() {
  const [cycle, setCycle] = useState<Cycle>("mensal");
  const [activePlan, setActivePlan] = useState("pro");
  const [selecting, setSelecting] = useState<string | null>(null);

  const handleSelect = (planId: string) => {
    setSelecting(planId);
    setTimeout(() => {
      setActivePlan(planId);
      setSelecting(null);
      const plan = plans.find((p) => p.id === planId)!;
      const c = cycles.find((c) => c.id === cycle)!;
      toast.success(`Plano ${plan.name} (${c.label}) ativado! ${c.price}`);
    }, 800);
  };

  return (
    <>
      <PageHeader title="Configurações" description="Conta, organização e plano" />

      {/* Profile + Org */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-5">Perfil</h3>
          <div className="space-y-3">
            <div><Label>Nome</Label><Input className="mt-1.5" defaultValue="Ana Souza" /></div>
            <div><Label>CPF</Label><Input className="mt-1.5" placeholder="000.000.000-00" defaultValue="123.456.789-00" /></div>
            <div><Label>E-mail</Label><Input type="email" className="mt-1.5" defaultValue="ana@corretor360.com" /></div>
            <div><Label>CRECI</Label><Input className="mt-1.5" defaultValue="12345-PE" /></div>
            <Button className="mt-2 gradient-primary border-0" onClick={() => toast.success("Perfil salvo!")}>Salvar perfil</Button>
          </div>
        </Card>
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-5">Organização</h3>
          <div className="space-y-3">
            <div><Label>Nome fantasia</Label><Input className="mt-1.5" defaultValue="Imobiliária Souza" /></div>
            <div><Label>CNPJ</Label><Input className="mt-1.5" defaultValue="00.000.000/0001-00" /></div>
            <div><Label>Domínio do site</Label><Input className="mt-1.5" defaultValue="imobiliaria-souza.corretor360.app" /></div>
            <Button className="mt-2 gradient-primary border-0" onClick={() => toast.success("Organização salva!")}>Salvar organização</Button>
          </div>
        </Card>
      </div>

      {/* Plans */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold">Plano e cobrança</h3>
            <p className="text-sm text-muted-foreground">
              Plano atual: <strong className="text-primary">{plans.find((p) => p.id === activePlan)?.name}</strong>
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.info("Histórico de faturas em breve.")}>Histórico de faturas</Button>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex gap-2 mt-5 mb-6 p-1 bg-muted rounded-xl w-fit">
          {cycles.map((c) => (
            <button key={c.id} onClick={() => setCycle(c.id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${cycle === c.id ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {c.label}
              {c.badge && (
                <span className="absolute -top-2 -right-2 text-[9px] bg-success text-white px-1.5 py-0.5 rounded-full font-semibold whitespace-nowrap">
                  {c.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((p) => {
            const isActive = activePlan === p.id;
            const isLoading = selecting === p.id;
            const priceVal = p.prices[cycle];
            const cycleInfo = cycles.find((c) => c.id === cycle)!;

            return (
              <div key={p.id}
                className={`relative p-5 rounded-xl border-2 transition-all ${isActive ? "border-primary bg-primary-soft/40 shadow-glow" : "border-border hover:border-primary/40"}`}>
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                    Plano atual
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${p.bg} ${p.color} flex items-center justify-center`}>
                    <p.icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-lg">{p.name}</div>
                </div>

                <div className="mb-1">
                  <span className="text-3xl font-bold">R$ {priceVal.toFixed(2).replace(".", ",")}</span>
                  <span className="text-sm text-muted-foreground ml-1">{cycleInfo.sub}</span>
                </div>

                {cycle !== "mensal" && (
                  <p className="text-xs text-success font-medium mb-3">
                    {cycle === "semestral"
                      ? `R$ ${(priceVal / 6).toFixed(2).replace(".", ",")}/mês`
                      : `R$ ${(priceVal / 12).toFixed(2).replace(".", ",")}/mês`}
                  </p>
                )}

                <ul className="mt-4 mb-5 space-y-1.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : "text-success"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${isActive ? "border-primary text-primary" : "gradient-primary border-0 text-white"}`}
                  variant={isActive ? "outline" : "default"}
                  disabled={isActive || isLoading}
                  onClick={() => handleSelect(p.id)}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Ativando...
                    </span>
                  ) : isActive ? "Plano atual" : `Assinar ${p.name}`}
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Pagamento seguro via cartão, PIX ou boleto · Cancele quando quiser
        </p>
      </Card>
    </>
  );
}
