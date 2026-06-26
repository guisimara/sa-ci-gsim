import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { toast } from "sonner";

const plans = [
  { name: "Starter", price: "R$ 97", features: ["1 usuário", "30 imóveis", "CRM Kanban", "Site básico"] },
  { name: "PRO", price: "R$ 197", featured: true, features: ["3 usuários", "Imóveis ilimitados", "Site white-label", "IA de conteúdo", "Contratos e vistorias"] },
  { name: "Enterprise", price: "R$ 499", features: ["Usuários ilimitados", "Matriz + corretores", "Dashboards consolidados", "Permissões avançadas", "Suporte prioritário"] },
];

const billing = [
  { id: "mensal", label: "Mensal", price: "R$ 29,90/mês", desc: "Cobrado mensalmente" },
  { id: "semestral", label: "Semestral", price: "R$ 149,50", desc: "R$ 24,91/mês · economia de 17%" },
  { id: "anual", label: "Anual", price: "R$ 299,00", desc: "R$ 24,91/mês · 2 meses grátis" },
];

export default function Configuracoes() {
  const [billingCycle, setBillingCycle] = useState("mensal");

  return (
    <>
      <PageHeader title="Configurações" description="Conta, organização e plano" />

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

      {/* Billing cycle */}
      <Card className="p-6 shadow-card mb-6">
        <h3 className="font-semibold mb-1">Ciclo de cobrança</h3>
        <p className="text-sm text-muted-foreground mb-4">Escolha a periodicidade do seu plano (em breve)</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {billing.map((b) => (
            <button key={b.id} onClick={() => setBillingCycle(b.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all opacity-60 cursor-not-allowed ${billingCycle === b.id ? "border-primary bg-primary-soft" : "border-border"}`}
              disabled>
              <div className="font-semibold text-sm">{b.label}</div>
              <div className="text-lg font-bold text-primary mt-1">{b.price}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{b.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div><h3 className="font-semibold">Plano e cobrança</h3><p className="text-sm text-muted-foreground">Você está no plano <strong className="text-primary">PRO</strong> (em breve)</p></div>
          <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">Histórico de faturas</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.name} className={`p-5 rounded-xl border-2 opacity-70 ${p.featured ? "border-primary bg-primary-soft" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.name}</div>
                {p.featured && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Atual</span>}
              </div>
              <div className="text-3xl font-bold mt-2">{p.price}<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.features.map((f) => <li key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-success flex-shrink-0" />{f}</li>)}
              </ul>
              <Button disabled className="w-full mt-5 opacity-50 cursor-not-allowed" variant={p.featured ? "outline" : "default"}>
                {p.featured ? "Plano atual" : "Em breve"}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
