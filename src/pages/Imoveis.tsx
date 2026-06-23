import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Grid3x3, List, BedDouble, Bath, Car, Maximize, MapPin, Star } from "lucide-react";
import { properties as seed, formatBRL, Property } from "@/lib/mock-data";

export default function Imoveis() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("todos");
  const [purposeF, setPurposeF] = useState("todos");

  const filtered = seed.filter((p) =>
    (statusF === "todos" || p.status === statusF) &&
    (purposeF === "todos" || p.purpose === purposeF) &&
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <PageHeader title="Imóveis" description={`${seed.length} imóveis cadastrados`}>
        <Button className="gradient-primary border-0 shadow-glow gap-2"><Plus className="w-4 h-4" /> Cadastrar imóvel</Button>
      </PageHeader>

      <Card className="p-4 mb-6 shadow-card">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por título ou código..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="disponivel">Disponível</SelectItem>
              <SelectItem value="reservado">Reservado</SelectItem>
              <SelectItem value="negociacao">Em negociação</SelectItem>
              <SelectItem value="vendido">Vendido</SelectItem>
              <SelectItem value="alugado">Alugado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={purposeF} onValueChange={setPurposeF}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas finalidades</SelectItem>
              <SelectItem value="venda">Venda</SelectItem>
              <SelectItem value="locacao">Locação</SelectItem>
              <SelectItem value="venda_locacao">Venda e locação</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-1 bg-muted rounded-lg p-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-md ${view === "grid" ? "bg-card shadow-sm" : ""}`}><Grid3x3 className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-card shadow-sm" : ""}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </Card>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      ) : (
        <Card className="shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr><th className="text-left p-4">Imóvel</th><th className="text-left p-4">Código</th><th className="text-left p-4">Status</th><th className="text-left p-4">Finalidade</th><th className="text-right p-4">Valor</th><th className="text-right p-4">Leads</th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4"><div className="flex items-center gap-3"><img src={p.photo} className="w-12 h-12 rounded-lg object-cover" /><div><div className="font-medium">{p.title}</div><div className="text-xs text-muted-foreground">{p.neighborhood}, {p.city}</div></div></div></td>
                  <td className="p-4 font-mono text-xs">{p.code}</td>
                  <td className="p-4"><StatusBadge status={p.status} /></td>
                  <td className="p-4 capitalize">{p.purpose.replace("_", " e ")}</td>
                  <td className="p-4 text-right font-semibold">{formatBRL(p.salePrice ?? p.rentPrice ?? 0)}{p.rentPrice && !p.salePrice && <span className="text-xs font-normal text-muted-foreground">/mês</span>}</td>
                  <td className="p-4 text-right">{p.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}

function PropertyCard({ p }: { p: Property }) {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-lg-custom transition-all group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={p.photo} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex gap-2">
          <StatusBadge status={p.status} />
          {p.featured && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warning text-warning-foreground text-xs font-semibold"><Star className="w-3 h-3" /> Destaque</span>}
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-background/90 backdrop-blur text-xs font-mono">{p.code}</div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{p.title}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{p.neighborhood}, {p.city}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{p.area}m²</span>
          <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{p.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms}</span>
          <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" />{p.parking}</span>
        </div>
        <div className="flex items-end justify-between mt-4 pt-3 border-t border-border">
          <div>
            <div className="text-xs text-muted-foreground capitalize">{p.purpose === "locacao" ? "Aluguel" : "Venda"}</div>
            <div className="font-bold text-primary">{formatBRL(p.salePrice ?? p.rentPrice ?? 0)}{!p.salePrice && p.rentPrice && <span className="text-xs font-normal text-muted-foreground">/mês</span>}</div>
          </div>
          <div className="text-right text-xs text-muted-foreground"><div className="font-semibold text-foreground">{p.leads} leads</div></div>
        </div>
      </div>
    </Card>
  );
}
