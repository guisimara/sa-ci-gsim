import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Building2, Check } from "lucide-react";

const plans = [
  { id: "starter", name: "Starter", price: "R$ 79", desc: "Para corretores autônomos começando.", features: ["1 usuário", "Até 30 imóveis", "CRM Kanban", "Site básico"] },
  { id: "pro", name: "Pro", price: "R$ 199", desc: "Para corretores em crescimento.", features: ["3 usuários", "Imóveis ilimitados", "Site white-label", "IA de conteúdo", "Contratos e vistorias"], featured: true },
  { id: "enterprise", name: "Enterprise", price: "R$ 499", desc: "Para imobiliárias e equipes.", features: ["Usuários ilimitados", "Matriz + corretores", "Dashboards consolidados", "Permissões avançadas", "Suporte prioritário"] },
];

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">Corretor<span className="text-primary">360</span></span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold">Bem-vindo! Vamos configurar sua organização.</h1>
        <p className="text-muted-foreground mt-2">Em menos de 2 minutos você tem seu painel pronto.</p>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 shadow-card">
            <h2 className="font-semibold text-lg">Dados da organização</h2>
            <div className="space-y-4 mt-5">
              <div>
                <Label>Nome da imobiliária / corretor</Label>
                <Input className="mt-1.5" placeholder="Ex: Imobiliária Souza" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>CRECI</Label><Input className="mt-1.5" placeholder="12345" /></div>
                <div><Label>UF</Label><Input className="mt-1.5" placeholder="PE" /></div>
              </div>
              <div><Label>WhatsApp principal</Label><Input className="mt-1.5" placeholder="(81) 99999-0000" /></div>
              <div><Label>Subdomínio do seu site</Label>
                <div className="flex mt-1.5">
                  <Input placeholder="imobiliaria-souza" className="rounded-r-none" />
                  <span className="px-3 inline-flex items-center text-sm bg-muted text-muted-foreground border border-l-0 border-border rounded-r-md">.corretor360.app</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card">
            <h2 className="font-semibold text-lg">Escolha seu plano</h2>
            <div className="space-y-3 mt-5">
              {plans.map((p) => (
                <label key={p.id} className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${p.featured ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"}`}>
                  <div className="flex items-start gap-3">
                    <input type="radio" name="plan" defaultChecked={p.featured} className="mt-1 accent-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{p.name}{p.featured && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Recomendado</span>}</div>
                        <div className="font-bold">{p.price}<span className="text-xs font-normal text-muted-foreground">/mês</span></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                        {p.features.map((f) => <span key={f} className="inline-flex items-center text-xs text-muted-foreground gap-1"><Check className="w-3 h-3 text-success" />{f}</span>)}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex justify-end mt-8">
          <Button asChild size="lg" className="gradient-primary border-0 shadow-glow">
            <Link to="/dashboard">Concluir configuração →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
