import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Copy, Wand2, ShoppingBag, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  name: string; username: string; specialty: string; city: string; yearsExp: string;
  differentials: string; targetAudience: string; link: string; highlights: string;
}
const emptyProfile: Profile = {
  name: "", username: "", specialty: "", city: "", yearsExp: "", differentials: "", targetAudience: "", link: "", highlights: "",
};

function generateBios(p: Profile): string[] {
  const base = [
    `🏡 ${p.name} | Corretor de Imóveis\n📍 ${p.city} | ${p.specialty}\n✨ ${p.differentials}\n🎯 Especialista para ${p.targetAudience}\n🔗 ${p.link || "link.bio"}\n\n📌 Destaques: ${p.highlights}`,
    `@${p.username || "corretor"} 🏠 Realizando sonhos em ${p.city}\n${p.yearsExp ? `${p.yearsExp} anos de experiência` : "Experiência"} · ${p.specialty}\n💬 ${p.differentials}\n👇 Fale comigo!\n${p.link || ""}`,
    `✅ ${p.name} — ${p.specialty}\n📌 ${p.city} · CRECI Ativo\n🏆 ${p.differentials}\nAtendimento para: ${p.targetAudience}\n🔗 ${p.link || "link.bio"}\n📲 Destaques: ${p.highlights}`,
    `${p.name} 🏡\nEspecialista em ${p.specialty} · ${p.city}\n"${p.differentials}"\n${p.yearsExp ? `${p.yearsExp} anos transformando buscas em chaves 🗝️` : ""}\n📩 DM para agendamentos\n${p.link || ""}`,
    `🔑 ${p.name} | Corretor Digital\n${p.specialty} em ${p.city}\n💡 ${p.differentials}\nPara quem busca: ${p.targetAudience}\n📌 ${p.highlights}\n👉 ${p.link || "link.bio"}`,
  ];
  return base;
}

function generateCopy(p: Profile, type: string): string {
  const T: Record<string, string> = {
    post: `🏡 Você sabia que ${p.city} tem as melhores oportunidades de ${p.specialty}?\n\nSou ${p.name} e há ${p.yearsExp || "anos"} ajudo ${p.targetAudience} a encontrar o imóvel perfeito.\n\n✅ ${p.differentials}\n\n💬 Comenta "INFO" que te mando tudo!\n\n${["#imoveis", `#${p.specialty?.toLowerCase().replace(/\s+/g, "")}`, "#corretor", `#${p.city?.toLowerCase().replace(/\s+/g, "")}`].join(" ")}`,
    whatsapp: `Olá! Tudo bem? 😊\n\nSou ${p.name}, corretor especialista em ${p.specialty} em ${p.city}.\n\nVi que você pode estar buscando um imóvel. Tenho ótimas opções para ${p.targetAudience}!\n\nPosso te apresentar algumas opções essa semana? Qual o melhor horário? 🗓️`,
    stories: `[Slide 1] 🏡 Você ainda NÃO tem seu imóvel?\n[Slide 2] Eu sou ${p.name}, especialista em ${p.specialty}\n[Slide 3] Já ajudei dezenas de ${p.targetAudience}\n[Slide 4] ${p.differentials}\n[Slide 5] 👉 Arrasta e manda mensagem!`,
  };
  return T[type] ?? "";
}

export default function IA() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [bios, setBios] = useState<string[]>([]);
  const [copyType, setCopyType] = useState("post");
  const [copyOutput, setCopyOutput] = useState("");
  const [tab, setTab] = useState<"bio" | "copy" | "pack">("bio");

  const handleGen = () => {
    if (!profile.name.trim() || !profile.city.trim()) {
      toast.error("Preencha ao menos nome e cidade.");
      return;
    }
    setBios(generateBios(profile));
    toast.success("5 variações de bio geradas!");
  };

  const handleCopy = () => {
    if (!profile.name.trim()) { toast.error("Preencha o perfil primeiro."); return; }
    setCopyOutput(generateCopy(profile, copyType));
  };

  const tabs = [
    { id: "bio", label: "Gerador de Bio", icon: Instagram },
    { id: "copy", label: "Gerador de Copy", icon: Wand2 },
    { id: "pack", label: "Pack de Artes", icon: ShoppingBag },
  ] as const;

  return (
    <>
      <PageHeader title="Gestão de Redes Sociais" description="Crie sua presença digital e atraia clientes">
        <span className="text-xs px-3 py-1.5 rounded-full bg-primary-soft text-primary font-medium flex items-center gap-1">
          <Instagram className="w-3.5 h-3.5" />Para corretores
        </span>
      </PageHeader>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 w-fit">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* Profile form (shared) */}
      {(tab === "bio" || tab === "copy") && (
        <div className="grid lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-2 p-6 shadow-card space-y-3">
            <h3 className="font-semibold mb-1">Seu perfil profissional</h3>
            <div><Label>Nome completo</Label><Input className="mt-1.5" placeholder="João Silva" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
            <div><Label>@ do Instagram</Label><Input className="mt-1.5" placeholder="joaosilva.imoveis" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} /></div>
            <div><Label>Especialidade</Label><Input className="mt-1.5" placeholder="Imóveis de alto padrão" value={profile.specialty} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} /></div>
            <div><Label>Cidade de atuação</Label><Input className="mt-1.5" placeholder="Recife, PE" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} /></div>
            <div><Label>Anos de experiência</Label><Input className="mt-1.5" placeholder="5" value={profile.yearsExp} onChange={(e) => setProfile({ ...profile, yearsExp: e.target.value })} /></div>
            <div><Label>Diferenciais</Label><Input className="mt-1.5" placeholder="Atendimento personalizado, agilidade..." value={profile.differentials} onChange={(e) => setProfile({ ...profile, differentials: e.target.value })} /></div>
            <div><Label>Público-alvo</Label><Input className="mt-1.5" placeholder="Famílias, investidores..." value={profile.targetAudience} onChange={(e) => setProfile({ ...profile, targetAudience: e.target.value })} /></div>
            <div><Label>Link (Linktree / site)</Label><Input className="mt-1.5" placeholder="https://link.bio/joao" value={profile.link} onChange={(e) => setProfile({ ...profile, link: e.target.value })} /></div>
            <div><Label>Destaques do perfil</Label><Input className="mt-1.5" placeholder="Visitas, Imóveis, Dicas, Sobre mim" value={profile.highlights} onChange={(e) => setProfile({ ...profile, highlights: e.target.value })} /></div>
          </Card>

          <div className="lg:col-span-3">
            {tab === "bio" && (
              <Card className="p-6 shadow-card">
                <Button className="w-full gradient-primary border-0 shadow-glow gap-2 mb-5" onClick={handleGen}>
                  <Instagram className="w-4 h-4" />Gerar 5 variações de bio
                </Button>
                {bios.length > 0 && (
                  <div className="space-y-4">
                    {bios.map((bio, i) => (
                      <div key={i} className="border border-border rounded-xl p-4 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-primary">Variação {i + 1}</span>
                          <Button size="sm" variant="ghost" className="gap-1 h-7 px-2" onClick={() => { navigator.clipboard.writeText(bio); toast.success("Copiada!"); }}>
                            <Copy className="w-3.5 h-3.5" />Copiar
                          </Button>
                        </div>
                        <Textarea value={bio} onChange={(e) => { const n = [...bios]; n[i] = e.target.value; setBios(n); }} rows={6} className="font-mono text-xs resize-none" />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {tab === "copy" && (
              <Card className="p-6 shadow-card space-y-4">
                <div>
                  <Label>Tipo de copy</Label>
                  <div className="flex gap-2 mt-2">
                    {[{ v: "post", l: "Post Feed" }, { v: "whatsapp", l: "WhatsApp" }, { v: "stories", l: "Stories" }].map((o) => (
                      <button key={o.v} onClick={() => setCopyType(o.v)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${copyType === o.v ? "border-primary bg-primary-soft text-primary" : "border-border"}`}>
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>
                <Button className="w-full gradient-primary border-0 shadow-glow gap-2" onClick={handleCopy}>
                  <Wand2 className="w-4 h-4" />Gerar copy
                </Button>
                {copyOutput && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Resultado</Label>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => { navigator.clipboard.writeText(copyOutput); toast.success("Copiado!"); }}>
                        <Copy className="w-3.5 h-3.5" />Copiar
                      </Button>
                    </div>
                    <Textarea value={copyOutput} onChange={(e) => setCopyOutput(e.target.value)} rows={12} className="font-mono text-sm" />
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      )}

      {tab === "pack" && (
        <Card className="p-8 shadow-card">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3">PACK EDITÁVEIS DE ARTES PARA CORRETORES DE IMÓVEIS</h2>
            <p className="text-muted-foreground mb-2 text-lg">+100 templates prontos para Instagram, Stories e WhatsApp</p>
            <div className="grid sm:grid-cols-3 gap-4 my-8 text-left">
              {[
                { icon: "🏡", title: "Posts de imóveis", desc: "Templates prontos para divulgar seu portfólio." },
                { icon: "📊", title: "Dicas e conteúdo", desc: "Posts educativos para engajar seus seguidores." },
                { icon: "🏆", title: "Depoimentos", desc: "Layouts para mostrar resultados e avaliações." },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-xl border border-border bg-muted/30">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="bg-primary-soft rounded-2xl p-6 mb-6">
              <div className="text-4xl font-bold text-primary">R$ 97,00</div>
              <div className="text-sm text-muted-foreground mt-1">Acesso vitalício · Editável no Canva</div>
            </div>
            <Button size="lg" className="gradient-primary border-0 shadow-glow gap-2 text-base px-8" asChild>
              <a href="https://pay.kiwify.com.br" target="_blank" rel="noopener noreferrer">
                <ShoppingBag className="w-5 h-5" />Quero meu Pack agora <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">Compra segura · Pagamento via Kiwify</p>
          </div>
        </Card>
      )}
    </>
  );
}
