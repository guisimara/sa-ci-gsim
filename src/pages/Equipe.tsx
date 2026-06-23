import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Mail, Shield } from "lucide-react";
import { team, formatBRL } from "@/lib/mock-data";

export default function Equipe() {
  return (
    <>
      <PageHeader title="Corretores e Equipe" description="Gerencie sua equipe e permissões — Plano Enterprise">
        <Button className="gradient-primary border-0 shadow-glow gap-2"><Plus className="w-4 h-4" />Convidar membro</Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {team.map((m) => (
          <Card key={m.id} className="p-5 shadow-card">
            <div className="flex items-start gap-3">
              <Avatar className="w-14 h-14"><AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">{m.avatar}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.role}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Mail className="w-3 h-3" />{m.email}</div>
              </div>
              <Badge variant="secondary" className="bg-success-soft text-success border-0">Ativo</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-border">
              <div><div className="text-xs text-muted-foreground">Negócios</div><div className="font-bold text-lg">{m.deals}</div></div>
              <div><div className="text-xs text-muted-foreground">Receita</div><div className="font-bold text-lg">{formatBRL(m.revenue)}</div></div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-card">
        <div className="flex items-center gap-3 mb-5"><Shield className="w-5 h-5 text-primary" /><h3 className="font-semibold">Permissões e compartilhamento</h3></div>
        <div className="space-y-4">
          {[
            { label: "Corretores veem leads de outros corretores", desc: "Ao ativar, todos os corretores enxergam o CRM consolidado." },
            { label: "Corretores veem faturamento total da matriz", desc: "Por padrão, apenas a matriz vê o faturamento global." },
            { label: "Permitir transferência de leads entre corretores", desc: "Movimentação livre de leads no CRM." },
            { label: "Compartilhar imóveis com toda a equipe", desc: "Todos os imóveis ficam visíveis para todos os corretores." },
          ].map((p) => (
            <div key={p.label} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
              <div><div className="font-medium text-sm">{p.label}</div><div className="text-xs text-muted-foreground">{p.desc}</div></div>
              <Switch defaultChecked={false} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
