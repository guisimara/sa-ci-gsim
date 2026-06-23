import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const plans = [
  { name: "Starter", price: "R$ 79", features: ["1 usuário", "30 imóveis", "CRM Kanban", "Site básico"] },
  { name: "Pro", price: "R$ 199", featured: true, features: ["3 usuários", "Imóveis ilimitados", "Site white-label", "IA de conteúdo", "Contratos e vistorias"] },
  { name: "Enterprise", price: "R$ 499", features: ["Usuários ilimitados", "Matriz + corretores", "Dashboards consolidados", "Permissões avançadas", "Suporte prioritário"] },
];

export default function Configuracoes() {
  return (
    <>
      <PageHeader title="Configurações" description="Conta, organização e plano" />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-5">Perfil</h3>
          <div className="space-y-3">
            <div><Label>Nome</Label><Input className="mt-1.5" defaultValue="Ana Souza" /></div>
            <div><Label>E-mail</Label><Input type="email" className="mt-1.5" defaultValue="ana@corretor360.com" /></div>
            <div><Label>CRECI</Label><Input className="mt-1.5" defaultValue="12345-PE" /></div>
          </div>
        </Card>
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-5">Organização</h3>
          <div className="space-y-3">
            <div><Label>Nome fantasia</Label><Input className="mt-1.5" defaultValue="Imobiliária Souza" /></div>
            <div><Label>CNPJ</Label><Input className="mt-1.5" defaultValue="00.000.000/0001-00" /></div>
            <div><Label>Domínio do site</Label><Input className="mt-1.5" defaultValue="imobiliaria-souza.corretor360.app" /></div>
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div><h3 className="font-semibold">Plano e cobrança</h3><p className="text-sm text-muted-foreground">Você está no plano <strong className="text-primary">Pro</strong></p></div>
          <Button variant="outline">Histórico de faturas</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.name} className={`p-5 rounded-xl border-2 ${p.featured ? "border-primary bg-primary-soft" : "border-border"}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{p.name}</div>
                {p.featured && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Atual</span>}
              </div>
              <div className="text-3xl font-bold mt-2">{p.price}<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.features.map((f) => <li key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-success flex-shrink-0" />{f}</li>)}
              </ul>
              <Button variant={p.featured ? "outline" : "default"} className={`w-full mt-5 ${!p.featured ? "gradient-primary border-0" : ""}`}>{p.featured ? "Plano atual" : "Mudar para " + p.name}</Button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
