import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Copy, Wand2, Instagram, MessageCircle, Video, Mail } from "lucide-react";
import { properties } from "@/lib/mock-data";
import { toast } from "sonner";

const generators = [
  { id: "desc", icon: Wand2, title: "Descrição de imóvel", desc: "Texto comercial para anúncios e portais." },
  { id: "insta", icon: Instagram, title: "Legenda para Instagram", desc: "Post otimizado com hashtags e CTA." },
  { id: "follow", icon: MessageCircle, title: "Follow-up de lead", desc: "Mensagem de WhatsApp personalizada." },
  { id: "reels", icon: Video, title: "Roteiro de Reels", desc: "Script curto de até 30 segundos." },
  { id: "proposta", icon: Mail, title: "E-mail de proposta", desc: "Mensagem profissional após envio." },
];

function generate(kind: string, propTitle: string, neighborhood: string, price: string): string {
  const T: Record<string, string> = {
    desc: `🏡 ${propTitle} — Oportunidade única em ${neighborhood}!\n\nImóvel pronto para morar, com acabamento de primeira, localização privilegiada e excelente custo-benefício. Próximo a comércios, escolas e fácil acesso às principais vias.\n\n✨ Diferenciais: vista, lazer completo, segurança 24h.\n💰 Valor: ${price}\n\nAgende sua visita agora mesmo!`,
    insta: `✨ Novidade no portfólio! ✨\n\n${propTitle} em ${neighborhood} 📍\n\nUm imóvel pensado para quem busca qualidade de vida, conforto e localização. 🏡\n\nDM ou WhatsApp para agendar visita 📩\n\n#imoveis #${neighborhood.replace(/\s+/g, "")} #corretordeimoveis #imovelnovo #realestate #compredeimovel`,
    follow: `Olá! Tudo bem? 😊\n\nSou da equipe Corretor360 e vi que você demonstrou interesse no imóvel ${propTitle} em ${neighborhood}.\n\nTenho disponibilidade para te apresentar este e outros imóveis similares ainda essa semana. Qual o melhor dia e horário para você?\n\nAguardo seu retorno! 🏡`,
    reels: `[CENA 1 — 3s] Plano aéreo da fachada\nVO: "Conhece esse imóvel?"\n\n[CENA 2 — 10s] Tour pelos ambientes\nVO: "${propTitle} em ${neighborhood} — ${price}"\n\n[CENA 3 — 8s] Destaques (varanda, lazer)\nTexto na tela: "Pronto para morar"\n\n[CENA 4 — 5s] CTA\nVO: "Comenta INFO que te mando todos os detalhes!"`,
    proposta: `Prezado(a) cliente,\n\nConforme nossa conversa, segue em anexo a proposta para o imóvel ${propTitle}, localizado em ${neighborhood}, no valor de ${price}.\n\nFico à disposição para esclarecer qualquer dúvida e seguir com os próximos passos.\n\nAtenciosamente,\nEquipe Corretor360`,
  };
  return T[kind] ?? "";
}

export default function IA() {
  const [active, setActive] = useState("desc");
  const [prop, setProp] = useState(properties[0].id);
  const [output, setOutput] = useState("");

  const run = () => {
    const p = properties.find((x) => x.id === prop)!;
    const price = (p.salePrice ?? p.rentPrice ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    setOutput(generate(active, p.title, p.neighborhood, price));
  };

  return (
    <>
      <PageHeader title="IA e Conteúdo" description="Geradores inteligentes para acelerar seu marketing">
        <span className="text-xs px-3 py-1.5 rounded-full bg-primary-soft text-primary font-medium flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />Beta</span>
      </PageHeader>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-2">
          {generators.map((g) => (
            <button key={g.id} onClick={() => { setActive(g.id); setOutput(""); }} className={`w-full text-left p-4 rounded-xl border-2 transition-all flex gap-3 ${active === g.id ? "border-primary bg-primary-soft" : "border-border bg-card hover:border-primary/40"}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${active === g.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}><g.icon className="w-5 h-5" /></div>
              <div><div className="font-semibold text-sm">{g.title}</div><div className="text-xs text-muted-foreground">{g.desc}</div></div>
            </button>
          ))}
        </div>

        <Card className="lg:col-span-3 p-6 shadow-card">
          <div className="space-y-4">
            <div><Label>Imóvel base</Label>
              <Select value={prop} onValueChange={setProp}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.code} — {p.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Tom / instruções extras (opcional)</Label><Input className="mt-1.5" placeholder="Ex: tom descontraído, foco em famílias..." /></div>
            <Button onClick={run} className="w-full gradient-primary border-0 shadow-glow gap-2"><Sparkles className="w-4 h-4" />Gerar conteúdo</Button>

            {output && (
              <div>
                <div className="flex items-center justify-between mb-2"><Label>Resultado</Label>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copiado!"); }}><Copy className="w-3.5 h-3.5" />Copiar</Button>
                </div>
                <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={14} className="font-mono text-sm" />
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
