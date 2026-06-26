import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, Search, Grid3x3, List, BedDouble, Bath, Car, Maximize, MapPin, Star, Building, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { properties as seed, units as seedUnits, formatBRL, Property, Unit } from "@/lib/mock-data";

export default function Imoveis() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("todos");
  const [purposeF, setPurposeF] = useState("todos");
  const [unitF, setUnitF] = useState("todos");

  const [units, setUnits] = useState<Unit[]>(seedUnits);
  const [properties, setProperties] = useState(seed);

  const [showImovelSheet, setShowImovelSheet] = useState(false);
  const [showUnitSheet, setShowUnitSheet] = useState(false);
  const [unitPopOpen, setUnitPopOpen] = useState(false);

  const [imovelForm, setImovelForm] = useState<Partial<Property & { unitId: string }>>({
    status: "disponivel",
    purpose: "venda",
    type: "apartamento",
    bedrooms: 2,
    suites: 0,
    bathrooms: 1,
    parking: 1,
    area: 60,
    commission: 6,
    leads: 0,
    featured: false,
    features: [],
  });

  const [unitForm, setUnitForm] = useState<Partial<Unit>>({ state: "PE", totalUnits: 1 });

  const filtered = properties.filter((p) =>
    (statusF === "todos" || p.status === statusF) &&
    (purposeF === "todos" || p.purpose === purposeF) &&
    (unitF === "todos" || p.unitId === unitF) &&
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()))
  );

  function saveUnit() {
    if (!unitForm.name?.trim() || !unitForm.address?.trim()) return;
    const newUnit: Unit = {
      id: `un${Date.now()}`,
      name: unitForm.name,
      address: unitForm.address,
      city: unitForm.city ?? "",
      state: unitForm.state ?? "PE",
      totalUnits: unitForm.totalUnits ?? 1,
    };
    setUnits((prev) => [...prev, newUnit]);
    setUnitForm({ state: "PE", totalUnits: 1 });
    setShowUnitSheet(false);
  }

  function saveImovel() {
    if (!imovelForm.title?.trim()) return;
    const code = `AP-${String(properties.length + 1).padStart(4, "0")}`;
    const PHOTO = `https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format`;
    const newProp: Property = {
      id: `p${Date.now()}`,
      code,
      title: imovelForm.title ?? "",
      type: imovelForm.type ?? "apartamento",
      purpose: imovelForm.purpose ?? "venda",
      status: imovelForm.status ?? "disponivel",
      address: imovelForm.address ?? "",
      neighborhood: imovelForm.neighborhood ?? "",
      city: imovelForm.city ?? "",
      state: imovelForm.state ?? "PE",
      area: imovelForm.area ?? 0,
      bedrooms: imovelForm.bedrooms ?? 0,
      suites: imovelForm.suites ?? 0,
      bathrooms: imovelForm.bathrooms ?? 1,
      parking: imovelForm.parking ?? 0,
      salePrice: imovelForm.purpose !== "locacao" ? imovelForm.salePrice : undefined,
      rentPrice: imovelForm.purpose !== "venda" ? imovelForm.rentPrice : undefined,
      commission: imovelForm.commission ?? 6,
      owner: imovelForm.owner ?? "",
      broker: imovelForm.broker ?? "",
      description: imovelForm.description ?? "",
      features: [],
      photo: PHOTO,
      featured: false,
      leads: 0,
      unitId: imovelForm.unitId,
    };
    setProperties((prev) => [newProp, ...prev]);
    setImovelForm({ status: "disponivel", purpose: "venda", type: "apartamento", bedrooms: 2, suites: 0, bathrooms: 1, parking: 1, area: 60, commission: 6, leads: 0, featured: false, features: [] });
    setShowImovelSheet(false);
  }

  return (
    <>
      <PageHeader title="Imóveis" description={`${properties.length} imóveis cadastrados`}>
        <Button className="gradient-primary border-0 shadow-glow gap-2" onClick={() => setShowImovelSheet(true)}>
          <Plus className="w-4 h-4" /> Cadastrar imóvel
        </Button>
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

          {/* Filtro de Unidade */}
          <Popover open={unitPopOpen} onOpenChange={setUnitPopOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-9 text-sm font-normal">
                <Building className="w-4 h-4 text-muted-foreground" />
                {unitF === "todos" ? "Todas as unidades" : units.find((u) => u.id === unitF)?.name ?? "Unidade"}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-2" align="start">
              <div className="space-y-0.5 mb-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted ${unitF === "todos" ? "bg-primary-soft text-primary font-medium" : ""}`}
                  onClick={() => { setUnitF("todos"); setUnitPopOpen(false); }}
                >
                  Todas as unidades
                </button>
                {units.map((u) => (
                  <button
                    key={u.id}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted ${unitF === u.id ? "bg-primary-soft text-primary font-medium" : ""}`}
                    onClick={() => { setUnitF(u.id); setUnitPopOpen(false); }}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
              <div className="border-t border-border pt-2">
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-primary hover:bg-primary-soft flex items-center gap-2 font-medium"
                  onClick={() => { setUnitPopOpen(false); setShowUnitSheet(true); }}
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar unidade
                </button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex items-center gap-1 bg-muted rounded-lg p-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-md ${view === "grid" ? "bg-card shadow-sm" : ""}`}><Grid3x3 className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-card shadow-sm" : ""}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </Card>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => <PropertyCard key={p.id} p={p} unitName={units.find((u) => u.id === p.unitId)?.name} />)}
        </div>
      ) : (
        <Card className="shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left p-4">Imóvel</th>
                <th className="text-left p-4">Código</th>
                <th className="text-left p-4">Unidade</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Finalidade</th>
                <th className="text-right p-4">Valor</th>
                <th className="text-right p-4">Leads</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.photo} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-muted-foreground">{p.neighborhood}, {p.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs">{p.code}</td>
                  <td className="p-4 text-xs text-muted-foreground">{units.find((u) => u.id === p.unitId)?.name ?? "—"}</td>
                  <td className="p-4"><StatusBadge status={p.status} /></td>
                  <td className="p-4 capitalize">{p.purpose.replace("_", " e ")}</td>
                  <td className="p-4 text-right font-semibold">
                    {formatBRL(p.salePrice ?? p.rentPrice ?? 0)}
                    {p.rentPrice && !p.salePrice && <span className="text-xs font-normal text-muted-foreground">/mês</span>}
                  </td>
                  <td className="p-4 text-right">{p.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Sheet — Cadastrar Imóvel */}
      <Sheet open={showImovelSheet} onOpenChange={setShowImovelSheet}>
        <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Cadastrar Imóvel</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6 pb-10">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input placeholder="Ex: Apartamento Vista Mar 3 quartos" value={imovelForm.title ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, title: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={imovelForm.type} onValueChange={(v) => setImovelForm((f) => ({ ...f, type: v as Property["type"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="cobertura">Cobertura</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="galpao">Galpão</SelectItem>
                    <SelectItem value="chacara">Chácara</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Finalidade</Label>
                <Select value={imovelForm.purpose} onValueChange={(v) => setImovelForm((f) => ({ ...f, purpose: v as Property["purpose"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="locacao">Locação</SelectItem>
                    <SelectItem value="venda_locacao">Venda e locação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Unidade / Empreendimento</Label>
              <Select value={imovelForm.unitId ?? ""} onValueChange={(v) => setImovelForm((f) => ({ ...f, unitId: v || undefined }))}>
                <SelectTrigger><SelectValue placeholder="Selecionar unidade (opcional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button className="text-xs text-primary hover:underline flex items-center gap-1" onClick={() => { setShowImovelSheet(false); setShowUnitSheet(true); }}>
                <Plus className="w-3 h-3" /> Cadastrar nova unidade
              </button>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={imovelForm.status} onValueChange={(v) => setImovelForm((f) => ({ ...f, status: v as Property["status"] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="negociacao">Em negociação</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="alugado">Alugado</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input placeholder="Rua, número" value={imovelForm.address ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, address: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Input placeholder="Boa Viagem" value={imovelForm.neighborhood ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, neighborhood: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input placeholder="Recife" value={imovelForm.city ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, city: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label>Área (m²)</Label>
                <Input type="number" value={imovelForm.area ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, area: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Quartos</Label>
                <Input type="number" value={imovelForm.bedrooms ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, bedrooms: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Banheiros</Label>
                <Input type="number" value={imovelForm.bathrooms ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, bathrooms: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Vagas</Label>
                <Input type="number" value={imovelForm.parking ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, parking: +e.target.value }))} />
              </div>
            </div>

            {imovelForm.purpose !== "locacao" && (
              <div className="space-y-2">
                <Label>Valor de venda (R$)</Label>
                <Input type="number" placeholder="Ex: 890000" value={imovelForm.salePrice ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, salePrice: +e.target.value }))} />
              </div>
            )}
            {imovelForm.purpose !== "venda" && (
              <div className="space-y-2">
                <Label>Valor de aluguel (R$/mês)</Label>
                <Input type="number" placeholder="Ex: 2800" value={imovelForm.rentPrice ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, rentPrice: +e.target.value }))} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Proprietário</Label>
                <Input placeholder="Nome do proprietário" value={imovelForm.owner ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, owner: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Corretor</Label>
                <Input placeholder="Nome do corretor" value={imovelForm.broker ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, broker: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Comissão (%)</Label>
              <Input type="number" value={imovelForm.commission ?? ""} onChange={(e) => setImovelForm((f) => ({ ...f, commission: +e.target.value }))} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gradient-primary border-0 shadow-glow" onClick={saveImovel}>
                Salvar imóvel
              </Button>
              <Button variant="outline" onClick={() => setShowImovelSheet(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sheet — Cadastrar Unidade */}
      <Sheet open={showUnitSheet} onOpenChange={setShowUnitSheet}>
        <SheetContent className="w-[420px] sm:max-w-[420px]">
          <SheetHeader>
            <SheetTitle>Cadastrar Unidade</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label>Nome da unidade *</Label>
              <Input placeholder="Ex: Edifício Atlântico" value={unitForm.name ?? ""} onChange={(e) => setUnitForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Endereço *</Label>
              <Input placeholder="Av. Boa Viagem, 4500" value={unitForm.address ?? ""} onChange={(e) => setUnitForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input placeholder="Recife" value={unitForm.city ?? ""} onChange={(e) => setUnitForm((f) => ({ ...f, city: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input placeholder="PE" value={unitForm.state ?? ""} onChange={(e) => setUnitForm((f) => ({ ...f, state: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total de unidades</Label>
              <Input type="number" value={unitForm.totalUnits ?? ""} onChange={(e) => setUnitForm((f) => ({ ...f, totalUnits: +e.target.value }))} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gradient-primary border-0 shadow-glow" onClick={saveUnit}>
                Salvar unidade
              </Button>
              <Button variant="outline" onClick={() => setShowUnitSheet(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function PropertyCard({ p, unitName }: { p: Property; unitName?: string }) {
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
        {unitName && (
          <p className="text-xs text-primary flex items-center gap-1 mt-0.5"><Building className="w-3 h-3" />{unitName}</p>
        )}
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
