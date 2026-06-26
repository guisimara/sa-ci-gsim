import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search, MapPin, BedDouble, Bath, Car, MessageCircle,
  Phone, Mail, Star,
} from "lucide-react";
import { properties, formatBRL, Property } from "@/lib/mock-data";
import { useSite } from "@/context/SiteContext";

// ─── Shared sub-components ────────────────────────────────────────────────────

function PropertyCard({
  p,
  radius = "rounded-xl",
  brandColor,
}: {
  p: Property;
  radius?: string;
  brandColor: string;
}) {
  return (
    <Card className={`overflow-hidden shadow-card group cursor-pointer ${radius}`}>
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={p.photo}
          alt={p.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold font-montserrat">{p.title}</h3>
        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3" />
          {p.neighborhood}, {p.city}
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms}</span>
          <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" />{p.parking}</span>
          <span>{p.area}m²</span>
        </div>
        <div className="font-bold text-lg mt-3" style={{ color: brandColor }}>
          {formatBRL(p.salePrice ?? p.rentPrice ?? 0)}
          {!p.salePrice && p.rentPrice && (
            <span className="text-xs font-normal text-muted-foreground">/mês</span>
          )}
        </div>
      </div>
    </Card>
  );
}

function ReviewsSection({ radius = "rounded-xl" }: { radius?: string }) {
  const reviews = [
    { n: "Marcos R.", t: "Atendimento impecável, encontrei minha casa em 2 semanas!" },
    { n: "Cláudia P.", t: "Profissional dedicada, super recomendo a Imobiliária Souza." },
    { n: "Diego L.", t: "Processo de locação muito tranquilo, tudo digital." },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {reviews.map((r) => (
        <Card key={r.n} className={`p-6 shadow-card ${radius}`}>
          <div className="flex gap-1 text-yellow-400 mb-3">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
          <p className="text-sm text-muted-foreground font-light">"{r.t}"</p>
          <div className="font-semibold mt-4">{r.n}</div>
        </Card>
      ))}
    </div>
  );
}

function AboutSection({
  about,
  bioImage,
  name,
  radius = "rounded-xl",
}: {
  about: string;
  bioImage: string | null;
  name: string;
  radius?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto">
      {bioImage && (
        <img
          src={bioImage}
          alt={`Sobre ${name}`}
          className={`w-48 h-48 object-cover flex-shrink-0 ${radius}`}
        />
      )}
      <p className="text-lg text-muted-foreground font-light leading-relaxed">{about}</p>
    </div>
  );
}

function FooterSection({
  name,
  whatsapp,
  email,
  slug,
}: {
  name: string;
  whatsapp: string;
  email: string;
  slug: string | undefined;
}) {
  return (
    <footer id="contato" className="bg-slate-900 text-slate-200 py-12 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <div className="text-xl font-bold font-montserrat text-white">{name}</div>
          <p className="text-sm mt-2 text-slate-400">CRECI 12345 · Recife, PE</p>
        </div>
        <div>
          <div className="font-semibold text-white mb-3">Contato</div>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {whatsapp}</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {email}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Av. Boa Viagem, 4500</div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-white mb-3">Site</div>
          <p className="text-sm text-slate-300">/site/{slug}</p>
          <p className="text-xs mt-4 text-slate-500">Powered by Corretor360</p>
        </div>
      </div>
    </footer>
  );
}

function SearchPanel({
  brandColor,
  radius = "rounded-xl",
}: {
  brandColor: string;
  radius?: string;
}) {
  return (
    <div className={`flex flex-col md:flex-row gap-2 ${radius}`}>
      <select className={`px-4 py-3 bg-white text-gray-800 text-sm flex-shrink-0 border border-gray-200 ${radius}`}>
        <option>Comprar</option>
        <option>Alugar</option>
      </select>
      <select className={`px-4 py-3 bg-white text-gray-800 text-sm flex-shrink-0 border border-gray-200 ${radius}`}>
        <option>Todos os tipos</option>
        <option>Apartamento</option>
        <option>Casa</option>
      </select>
      <Input
        placeholder="Bairro, cidade ou código..."
        className={`flex-1 bg-white text-gray-800 border-gray-200 ${radius}`}
      />
      <Button
        className="gap-2 px-6 font-semibold"
        style={{ background: brandColor, color: "#fff", border: "none" }}
      >
        <Search className="w-4 h-4" />Buscar
      </Button>
    </div>
  );
}

// ─── Hero image overlay helper ────────────────────────────────────────────────

function HeroOverlay({ heroImage, brandColor }: { heroImage: string | null; brandColor: string }) {
  if (!heroImage) return null;
  return (
    <>
      <img
        src={heroImage}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: brandColor,
          opacity: 0.75,
        }}
      />
    </>
  );
}

// ─── Layout 1 — Classic ───────────────────────────────────────────────────────

function Layout1({
  config,
  forSale,
  forRent,
  slug,
  isDark,
}: {
  config: ReturnType<typeof useSite>["config"];
  forSale: Property[];
  forRent: Property[];
  slug: string | undefined;
  isDark: boolean;
}) {
  const { name, whatsapp, email, heroTitle, heroSubtitle, about, brandColor, logo, heroImage, bioImage, blocks } = config;
  const radius = "rounded-md";
  const blockOn = (id: string) => blocks.find((b) => b.id === id)?.on !== false;

  return (
    <>
      {/* Menu */}
      {blockOn("menu") && (
        <header className={`sticky top-0 z-40 backdrop-blur border-b ${isDark ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-gray-200"}`}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {logo ? (
                <img src={logo} alt={name} className="h-9 object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-md" style={{ background: brandColor }} />
              )}
              <span className="font-bold text-lg font-montserrat">{name}</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#comprar">Comprar</a>
              <a href="#alugar">Alugar</a>
              <a href="#sobre">Sobre</a>
              <a href="#contato">Contato</a>
            </nav>
            <Button
              className="gap-2 font-semibold"
              style={{ background: brandColor, color: "#fff", border: "none" }}
            >
              <MessageCircle className="w-4 h-4" />WhatsApp
            </Button>
          </div>
        </header>
      )}

      {/* Hero */}
      {blockOn("hero") && (
        <section className="relative text-white py-20 px-6 overflow-hidden" style={{ background: brandColor }}>
          <HeroOverlay heroImage={heroImage} brandColor={brandColor} />
          <div className="relative max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight font-montserrat">{heroTitle}</h1>
            <p className="text-lg md:text-xl mt-4 opacity-90 font-light">{heroSubtitle}</p>
            <Card className={`mt-10 p-2 max-w-3xl mx-auto shadow-lg ${radius}`}>
              <SearchPanel brandColor={brandColor} radius={radius} />
            </Card>
          </div>
        </section>
      )}

      {/* For sale */}
      {blockOn("sale") && (
        <section id="comprar" className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: brandColor }}>À venda</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-montserrat">Destaques para compra</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {forSale.map((p) => <PropertyCard key={p.id} p={p} radius={radius} brandColor={brandColor} />)}
            </div>
          </div>
        </section>
      )}

      {/* For rent */}
      {blockOn("rent") && (
        <section id="alugar" className={`px-6 py-16 ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: brandColor }}>Para alugar</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-montserrat">Destaques para locação</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {forRent.map((p) => <PropertyCard key={p.id} p={p} radius={radius} brandColor={brandColor} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      {blockOn("cta1") && (
        <section className="px-6 py-16">
          <div
            className={`max-w-5xl mx-auto ${radius} text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg`}
            style={{ background: brandColor }}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold font-montserrat">Quer vender ou alugar seu imóvel?</h3>
              <p className="mt-2 opacity-80 font-light">Fale com nosso especialista e tenha seu imóvel divulgado em todos os portais.</p>
            </div>
            <Button size="lg" variant="secondary" className="gap-2 flex-shrink-0">
              <MessageCircle className="w-5 h-5" />Falar agora
            </Button>
          </div>
        </section>
      )}

      {/* Reviews */}
      {blockOn("reviews") && (
        <section className={`px-6 py-16 ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: brandColor }}>Avaliações</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-montserrat">O que dizem nossos clientes</h2>
            <ReviewsSection radius={radius} />
          </div>
        </section>
      )}

      {/* About */}
      {blockOn("about") && (
        <section id="sobre" className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: brandColor }}>Quem somos</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-montserrat">Sobre a {name}</h2>
            <AboutSection about={about} bioImage={bioImage} name={name} radius={radius} />
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      {blockOn("whats") && (
        <section className="px-6 py-10 text-center">
          <Button
            size="lg"
            className="gap-3 text-base font-semibold px-8"
            style={{ background: "#25D366", color: "#fff", border: "none" }}
          >
            <MessageCircle className="w-5 h-5" />Falar pelo WhatsApp
          </Button>
        </section>
      )}

      {/* Footer */}
      {blockOn("footer") && (
        <FooterSection name={name} whatsapp={whatsapp} email={email} slug={slug} />
      )}
    </>
  );
}

// ─── Layout 2 — Quinto Andar style ───────────────────────────────────────────

function Layout2({
  config,
  forSale,
  forRent,
  slug,
  isDark,
}: {
  config: ReturnType<typeof useSite>["config"];
  forSale: Property[];
  forRent: Property[];
  slug: string | undefined;
  isDark: boolean;
}) {
  const { name, whatsapp, email, heroTitle, heroSubtitle, about, brandColor, logo, heroImage, bioImage, blocks } = config;
  const radius = "rounded-2xl";
  const blockOn = (id: string) => blocks.find((b) => b.id === id)?.on !== false;

  return (
    <>
      {/* Hero — full viewport height */}
      {blockOn("hero") && (
        <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: brandColor }}>
          <HeroOverlay heroImage={heroImage} brandColor={brandColor} />

          {/* Minimal nav */}
          {blockOn("menu") && (
            <div className="relative z-10 flex items-center justify-between px-8 py-6">
              <div className="flex items-center gap-2">
                {logo ? (
                  <img src={logo} alt={name} className="h-10 object-contain" />
                ) : (
                  <span className="text-white font-extrabold text-2xl font-montserrat">{name}</span>
                )}
              </div>
              <Button
                variant="outline"
                className="gap-2 border-white/60 text-white bg-white/10 hover:bg-white/20"
              >
                <MessageCircle className="w-4 h-4" />{whatsapp}
              </Button>
            </div>
          )}

          {/* Big centered text */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-32">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight max-w-4xl font-montserrat">
              {heroTitle}
            </h1>
            <p className="text-xl md:text-2xl mt-6 text-white/80 font-light max-w-2xl">
              {heroSubtitle}
            </p>
          </div>

          {/* Search pill near bottom */}
          <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-12">
            <Card className={`p-3 shadow-2xl ${radius}`}>
              <SearchPanel brandColor={brandColor} radius={radius} />
            </Card>
          </div>
        </section>
      )}

      {/* For sale */}
      {blockOn("sale") && (
        <section id="comprar" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: brandColor }}>À venda</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-10 font-montserrat">Destaques para compra</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {forSale.map((p) => <PropertyCard key={p.id} p={p} radius={radius} brandColor={brandColor} />)}
            </div>
          </div>
        </section>
      )}

      {/* For rent */}
      {blockOn("rent") && (
        <section id="alugar" className={`px-6 py-20 ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: brandColor }}>Para alugar</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-10 font-montserrat">Destaques para locação</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {forRent.map((p) => <PropertyCard key={p.id} p={p} radius={radius} brandColor={brandColor} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {blockOn("cta1") && (
        <section className="px-6 py-20">
          <div
            className={`max-w-5xl mx-auto ${radius} text-white p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl`}
            style={{ background: brandColor }}
          >
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold font-montserrat">Quer vender ou alugar seu imóvel?</h3>
              <p className="mt-3 text-lg opacity-80 font-light">Fale com nosso especialista hoje.</p>
            </div>
            <Button size="lg" variant="secondary" className="gap-2 flex-shrink-0 text-base px-8">
              <MessageCircle className="w-5 h-5" />Falar agora
            </Button>
          </div>
        </section>
      )}

      {/* Reviews */}
      {blockOn("reviews") && (
        <section className={`px-6 py-20 ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: brandColor }}>Avaliações</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-10 font-montserrat">O que dizem nossos clientes</h2>
            <ReviewsSection radius={radius} />
          </div>
        </section>
      )}

      {/* About */}
      {blockOn("about") && (
        <section id="sobre" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: brandColor }}>Quem somos</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-10 font-montserrat">Sobre a {name}</h2>
            <AboutSection about={about} bioImage={bioImage} name={name} radius={radius} />
          </div>
        </section>
      )}

      {blockOn("whats") && (
        <section className="px-6 py-12 text-center">
          <Button
            size="lg"
            className="gap-3 text-base font-semibold px-10 rounded-full"
            style={{ background: "#25D366", color: "#fff", border: "none" }}
          >
            <MessageCircle className="w-5 h-5" />Falar pelo WhatsApp
          </Button>
        </section>
      )}

      {blockOn("footer") && (
        <FooterSection name={name} whatsapp={whatsapp} email={email} slug={slug} />
      )}
    </>
  );
}

// ─── Layout 3 — Search outside banner ────────────────────────────────────────

function Layout3({
  config,
  forSale,
  forRent,
  slug,
  isDark,
}: {
  config: ReturnType<typeof useSite>["config"];
  forSale: Property[];
  forRent: Property[];
  slug: string | undefined;
  isDark: boolean;
}) {
  const { name, whatsapp, email, heroTitle, heroSubtitle, about, brandColor, logo, heroImage, bioImage, blocks } = config;
  const radius = "rounded-xl";
  const blockOn = (id: string) => blocks.find((b) => b.id === id)?.on !== false;

  return (
    <>
      {/* Menu */}
      {blockOn("menu") && (
        <header className={`sticky top-0 z-40 backdrop-blur border-b ${isDark ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-gray-200"}`}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {logo ? (
                <img src={logo} alt={name} className="h-9 object-contain" />
              ) : (
                <div className="w-9 h-9 rounded-lg" style={{ background: brandColor }} />
              )}
              <span className="font-bold text-lg font-montserrat">{name}</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#buscar">Buscar</a>
              <a href="#comprar">Comprar</a>
              <a href="#alugar">Alugar</a>
              <a href="#contato">Contato</a>
            </nav>
            <Button className="gap-2" style={{ background: brandColor, color: "#fff", border: "none" }}>
              <MessageCircle className="w-4 h-4" />WhatsApp
            </Button>
          </div>
        </header>
      )}

      {/* Hero — image only, smaller */}
      {blockOn("hero") && (
        <section className="relative text-white py-16 px-6 overflow-hidden" style={{ background: brandColor }}>
          <HeroOverlay heroImage={heroImage} brandColor={brandColor} />
          <div className="relative max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight font-montserrat">{heroTitle}</h1>
            <p className="text-lg mt-3 opacity-90 font-light">{heroSubtitle}</p>
          </div>
        </section>
      )}

      {/* Search — separate section below banner */}
      <section id="buscar" className="px-6 py-0">
        <div className="max-w-4xl mx-auto -mt-6 relative z-10">
          <Card className={`p-4 shadow-xl ${radius}`}>
            <h3 className="font-semibold mb-3 font-montserrat">Buscar imóvel</h3>
            <SearchPanel brandColor={brandColor} radius={radius} />
          </Card>
        </div>
      </section>

      {/* For sale */}
      {blockOn("sale") && (
        <section id="comprar" className="px-6 py-16 mt-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: brandColor }}>À venda</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-montserrat">Destaques para compra</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {forSale.map((p) => <PropertyCard key={p.id} p={p} radius={radius} brandColor={brandColor} />)}
            </div>
          </div>
        </section>
      )}

      {/* For rent */}
      {blockOn("rent") && (
        <section id="alugar" className={`px-6 py-16 ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: brandColor }}>Para alugar</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-montserrat">Destaques para locação</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {forRent.map((p) => <PropertyCard key={p.id} p={p} radius={radius} brandColor={brandColor} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {blockOn("cta1") && (
        <section className="px-6 py-16">
          <div
            className={`max-w-5xl mx-auto ${radius} text-white p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg`}
            style={{ background: brandColor }}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold font-montserrat">Quer vender ou alugar seu imóvel?</h3>
              <p className="mt-2 opacity-80 font-light">Fale com nosso especialista e tenha seu imóvel divulgado em todos os portais.</p>
            </div>
            <Button size="lg" variant="secondary" className="gap-2 flex-shrink-0">
              <MessageCircle className="w-5 h-5" />Falar agora
            </Button>
          </div>
        </section>
      )}

      {/* Reviews */}
      {blockOn("reviews") && (
        <section className={`px-6 py-16 ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: brandColor }}>Avaliações</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-montserrat">O que dizem nossos clientes</h2>
            <ReviewsSection radius={radius} />
          </div>
        </section>
      )}

      {/* About */}
      {blockOn("about") && (
        <section id="sobre" className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: brandColor }}>Quem somos</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-montserrat">Sobre a {name}</h2>
            <AboutSection about={about} bioImage={bioImage} name={name} radius={radius} />
          </div>
        </section>
      )}

      {blockOn("whats") && (
        <section className="px-6 py-10 text-center">
          <Button
            size="lg"
            className="gap-3 text-base font-semibold px-8"
            style={{ background: "#25D366", color: "#fff", border: "none" }}
          >
            <MessageCircle className="w-5 h-5" />Falar pelo WhatsApp
          </Button>
        </section>
      )}

      {blockOn("footer") && (
        <FooterSection name={name} whatsapp={whatsapp} email={email} slug={slug} />
      )}
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SitePublic() {
  const { slug } = useParams();
  const { config } = useSite();
  const isDark = config.theme === "dark";

  const forRent = properties.filter((p) => p.purpose !== "venda").slice(0, 3);
  const forSale = properties.filter((p) => p.purpose !== "locacao").slice(0, 3);

  // Inject Montserrat font
  useEffect(() => {
    const id = "montserrat-font-link";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const rootStyle: React.CSSProperties = {
    fontFamily: "'Montserrat', sans-serif",
    ...(isDark ? { background: "#0f172a", color: "#f8fafc" } : {}),
  };

  return (
    <div
      className={`min-h-screen ${isDark ? "dark" : ""}`}
      style={rootStyle}
    >
      {config.layout === 1 && (
        <Layout1 config={config} forSale={forSale} forRent={forRent} slug={slug} isDark={isDark} />
      )}
      {config.layout === 2 && (
        <Layout2 config={config} forSale={forSale} forRent={forRent} slug={slug} isDark={isDark} />
      )}
      {config.layout === 3 && (
        <Layout3 config={config} forSale={forSale} forRent={forRent} slug={slug} isDark={isDark} />
      )}
    </div>
  );
}
