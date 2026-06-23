import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, MapPin, BedDouble, Bath, Car, MessageCircle, Phone, Mail, Star } from "lucide-react";
import { properties, formatBRL } from "@/lib/mock-data";

export default function SitePublic() {
  const { slug } = useParams();
  const name = "Imobiliária Souza";
  const forRent = properties.filter((p) => p.purpose !== "venda").slice(0, 3);
  const forSale = properties.filter((p) => p.purpose !== "locacao").slice(0, 3);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Menu */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary" />
            <span className="font-bold text-lg">{name}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#comprar">Comprar</a><a href="#alugar">Alugar</a><a href="#sobre">Sobre</a><a href="#contato">Contato</a>
          </nav>
          <Button className="gradient-primary border-0 shadow-glow gap-2"><MessageCircle className="w-4 h-4" />WhatsApp</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative gradient-hero text-primary-foreground py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_30%,white,transparent_50%)]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">Encontre o imóvel dos seus sonhos</h1>
          <p className="text-lg md:text-xl mt-4 text-primary-foreground/80">Imóveis selecionados em Recife e região com atendimento personalizado.</p>

          <Card className="mt-10 p-2 max-w-3xl mx-auto shadow-lg-custom">
            <div className="flex flex-col md:flex-row gap-2">
              <select className="px-4 py-3 rounded-lg bg-muted text-foreground text-sm flex-shrink-0">
                <option>Comprar</option><option>Alugar</option>
              </select>
              <select className="px-4 py-3 rounded-lg bg-muted text-foreground text-sm flex-shrink-0">
                <option>Todos os tipos</option><option>Apartamento</option><option>Casa</option>
              </select>
              <Input placeholder="Bairro, cidade ou código..." className="flex-1 text-foreground" />
              <Button className="gradient-primary border-0 gap-2 px-6"><Search className="w-4 h-4" />Buscar</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* For sale */}
      <Section id="comprar" eyebrow="À venda" title="Destaques para compra">
        <Grid items={forSale} />
      </Section>

      {/* For rent */}
      <Section id="alugar" eyebrow="Para alugar" title="Destaques para locação" muted>
        <Grid items={forRent} />
      </Section>

      {/* CTA banner */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto rounded-3xl gradient-hero text-primary-foreground p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg-custom">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Quer vender ou alugar seu imóvel?</h3>
            <p className="mt-2 text-primary-foreground/80">Fale com nosso especialista e tenha seu imóvel divulgado em todos os portais.</p>
          </div>
          <Button size="lg" variant="secondary" className="gap-2 flex-shrink-0"><MessageCircle className="w-5 h-5" />Falar agora</Button>
        </div>
      </section>

      {/* Reviews */}
      <Section title="O que dizem nossos clientes" eyebrow="Avaliações" muted>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: "Marcos R.", t: "Atendimento impecável, encontrei minha casa em 2 semanas!" },
            { n: "Cláudia P.", t: "Profissional dedicada, super recomendo a Imobiliária Souza." },
            { n: "Diego L.", t: "Processo de locação muito tranquilo, tudo digital." },
          ].map((r) => (
            <Card key={r.n} className="p-6 shadow-card">
              <div className="flex gap-1 text-warning mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
              <p className="text-sm text-muted-foreground">"{r.t}"</p>
              <div className="font-semibold mt-4">{r.n}</div>
            </Card>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section id="sobre" eyebrow="Quem somos" title={`Sobre a ${name}`}>
        <div className="max-w-3xl mx-auto text-center text-muted-foreground text-lg">
          Há mais de 10 anos conectando pessoas aos melhores imóveis do Nordeste. Time especializado em compra, venda, locação e administração de imóveis.
        </div>
      </Section>

      {/* Footer */}
      <footer id="contato" className="bg-sidebar text-sidebar-foreground py-12 px-6 mt-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-bold text-sidebar-accent-foreground">{name}</div>
            <p className="text-sm mt-2">CRECI 12345 · Recife, PE</p>
          </div>
          <div>
            <div className="font-semibold text-sidebar-accent-foreground mb-3">Contato</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> (81) 99999-0000</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> contato@imobsouza.com.br</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Av. Boa Viagem, 4500</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-sidebar-accent-foreground mb-3">Site</div>
            <p className="text-sm">/site/{slug}</p>
            <p className="text-xs mt-4 text-sidebar-foreground/50">Powered by Corretor360</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, title, eyebrow, children, muted }: { id?: string; title: string; eyebrow?: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <section id={id} className={`px-6 py-16 ${muted ? "bg-muted/40" : ""}`}>
      <div className="max-w-7xl mx-auto">
        {eyebrow && <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">{eyebrow}</div>}
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Grid({ items }: { items: typeof properties }) {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {items.map((p) => (
        <Card key={p.id} className="overflow-hidden shadow-card group cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img src={p.photo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-5">
            <h3 className="font-semibold">{p.title}</h3>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{p.neighborhood}, {p.city}</div>
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.bedrooms}</span>
              <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms}</span>
              <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" />{p.parking}</span>
              <span>{p.area}m²</span>
            </div>
            <div className="font-bold text-primary text-lg mt-3">{formatBRL(p.salePrice ?? p.rentPrice ?? 0)}{!p.salePrice && p.rentPrice && <span className="text-xs font-normal text-muted-foreground">/mês</span>}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
