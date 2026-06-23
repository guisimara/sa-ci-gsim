import { Link } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const initialBlocks = [
  { id: "menu", name: "Menu com logo", on: true },
  { id: "hero", name: "Hero com painel de busca", on: true },
  { id: "rent", name: "Destaques para locação", on: true },
  { id: "sale", name: "Destaques para compra", on: true },
  { id: "cta1", name: "Banner: Quer vender ou alugar?", on: true },
  { id: "reviews", name: "Melhores avaliações", on: true },
  { id: "about", name: "Sobre o corretor/imobiliária", on: true },
  { id: "whats", name: "CTA WhatsApp", on: true },
  { id: "footer", name: "Rodapé com dados de contato", on: true },
];

export default function Site() {
  const [blocks, setBlocks] = useState(initialBlocks);

  return (
    <>
      <PageHeader title="Site / Portfólio" description="Configure seu site profissional white-label">
        <Button variant="outline" asChild className="gap-2">
          <Link to="/site/imobiliaria-souza" target="_blank"><ExternalLink className="w-4 h-4" /> Ver preview público</Link>
        </Button>
        <Button className="gradient-primary border-0 shadow-glow">Publicar alterações</Button>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 shadow-card lg:col-span-2">
          <h3 className="font-semibold mb-5">Identidade da marca</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nome</Label><Input className="mt-1.5" defaultValue="Imobiliária Souza" /></div>
              <div><Label>Slug do site</Label><Input className="mt-1.5" defaultValue="imobiliaria-souza" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>WhatsApp</Label><Input className="mt-1.5" defaultValue="(81) 99999-0000" /></div>
              <div><Label>E-mail</Label><Input className="mt-1.5" defaultValue="contato@imobsouza.com.br" /></div>
            </div>
            <div><Label>Logo</Label>
              <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground hover:border-primary cursor-pointer">
                Clique para fazer upload do logo (PNG/SVG, até 2MB)
              </div>
            </div>
            <div>
              <Label>Cores da marca</Label>
              <div className="flex gap-2 mt-1.5">
                {["#7c3aed", "#0ea5e9", "#f97316", "#10b981", "#ef4444", "#0f1b3d"].map((c) => (
                  <button key={c} className="w-10 h-10 rounded-lg ring-2 ring-transparent hover:ring-primary" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div><Label>Título do hero</Label><Input className="mt-1.5" defaultValue="Encontre o imóvel dos seus sonhos" /></div>
              <div><Label>Subtítulo</Label><Input className="mt-1.5" defaultValue="Imóveis selecionados em Recife e região" /></div>
            </div>
            <div><Label>Texto sobre / bio</Label><Textarea rows={3} className="mt-1.5" defaultValue="Há mais de 10 anos conectando pessoas aos melhores imóveis do Nordeste." /></div>
          </div>
        </Card>

        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-1">Blocos da página</h3>
          <p className="text-xs text-muted-foreground mb-5">Ative/desative as seções do seu site.</p>
          <div className="space-y-3">
            {blocks.map((b, i) => (
              <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-muted text-xs font-semibold flex items-center justify-center text-muted-foreground">{i + 1}</span>
                  <span className="text-sm font-medium">{b.name}</span>
                </div>
                <Switch checked={b.on} onCheckedChange={(v) => setBlocks(blocks.map((x) => x.id === b.id ? { ...x, on: v } : x))} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
