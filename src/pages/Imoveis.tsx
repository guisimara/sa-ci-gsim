import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Search, Grid3x3, List, BedDouble, Bath, Car, Maximize, MapPin, Star, Building, ChevronDown, ImagePlus, X } from "lucide-react";
import { units as seedUnits, formatBRL, Property, Unit } from "@/lib/mock-data";
import { useApp } from "@/context/AppContext";
import { optimizeImage } from "@/lib/image-utils";

export default function Imoveis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { properties, addProperty, selectedUnit } = useApp();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("todos");
  const [purposeF, setPurposeF] = useState("todos");
  const [unitF, setUnitF] = useState("todos");
  const [units, setUnits] = useState<Unit[]>(seedUnits);

  const [showImovelSheet, setShowImovelSheet] = useState(false);
  const [showUnitSheet, setShowUnitSheet] = useState(false);
  const [unitPopOpen, setUnitPopOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);

  const headerBtnRef = useRef<HTMLDivElement>(null);

  // Auto-open sheet via URL param (?create=true)
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setShowImovelSheet(true);
    }
  }, [searchParams]);

  // Unit filter from global context
  useEffect(() => {
    if (selectedUnit) setUnitF(selectedUnit);
    else setUnitF("todos");
  }, [selectedUnit]);

  // Floating button on scroll
  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 180);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [imovelForm, setImovelForm] = useState<{
    title: string; type: Property["type"]; purpose: Property["purpose"];
    status: Property["status"]; unitId: string; neighborhood: string;
    city: string; state: string; area: number; bedrooms: number;
    suites: number; bathrooms: number; parking: number;
    salePrice: string; rentPrice: string; condoFee: string; iptu: string;
    commission: number; owner: string; broker: string; description: string;
    photos: string[];
  }>({
    title: "", type: "apartamento", purpose: "venda", status: "disponivel",
    unitId: "", neighborhood: "", city: "", state: "PE",
    area: 60, bedrooms: 2, suites: 0, bathrooms: 1, parking: 1,
    salePrice: "", rentPrice: "", condoFee: "", iptu: "",
    commission: 6, owner: "", broker: "", description: "", photos: [],
  });

  const [unitForm, setUnitForm] = useState<Partial<Unit>>({ state: "PE", totalUnits: 1 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = properties.filter((p) =>
    (statusF === "todos" || p.status === statusF) &&
    (purposeF === "todos" || p.purpose === purposeF) &&
    (unitF === "todos" || p.unitId === unitF) &&
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()))
  );

  async function handlePhotoUpload(files: FileList | null) {
    if (!files) return;
    const remaining = 10 - imovelForm.photos.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const optimized = await Promise.all(toProcess.map((f) => optimizeImage(f)));
    setImovelForm((f) => ({ ...f, photos: [...f.photos, ...optimized] }));
  }

  function validateImovel() {
    const e: Record<string, string> = {};
    if (!imovelForm.title.trim()) e.title = "Título obrigatório";
    if (!imovelForm.neighborhood.trim()) e.neighborhood = "Bairro obrigatório";
    if (!imovelForm.city.trim()) e.city = "Cidade obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function saveImovel() {
    if (!validateImovel()) return;
    const code = `AP-${String(properties.length + 1).padStart(4, "0")}`;
    const fallbackPhoto = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&auto=format";
    const newProp: Property = {
      id: `p${Date.now()}`,
      code,
      title: imovelForm.title,
      type: imovelForm.type,
      purpose: imovelForm.purpose,
      status: imovelForm.status,
      address: `${imovelForm.neighborhood}, ${imovelForm.city}`,
      neighborhood: imovelForm.neighborhood,
      city: imovelForm.city,
      state: imovelForm.state,
      area: imovelForm.area,
      bedrooms: imovelForm.bedrooms,
      suites: imovelForm.suites,
      bathrooms: imovelForm.bathrooms,
      parking: imovelForm.parking,
      salePrice: imovelForm.purpose !== "locacao" && imovelForm.salePrice ? +imovelForm.salePrice : undefined,
      rentPrice: imovelForm.purpose !== "venda" && imovelForm.rentPrice ? +imovelForm.rentPrice : undefined,
      condoFee: imovelForm.condoFee ? +imovelForm.condoFee : undefined,
      iptu: imovelForm.iptu ? +imovelForm.iptu : undefined,
      commission: imovelForm.commission,
      owner: imovelForm.owner,
      broker: imovelForm.broker,
      description: imovelForm.description,
      features: [],
      photo: imovelForm.photos[0] ?? fallbackPhoto,
      photos: imovelForm.photos.length > 0 ? imovelForm.photos : [fallbackPhoto],
      featured: false,
      leads: 0,
      unitId: imovelForm.unitId || undefined,
    };
    addProperty(newProp);
    resetImovelForm();
    setShowImovelSheet(false);
  }

  function resetImovelForm() {
    setImovelForm({
      title: "", type: "apartamento", purpose: "venda", status: "disponivel",
      unitId: "", neighborhood: "", city: "", state: "PE",
      area: 60, bedrooms: 2, suites: 0, bathrooms: 1, parking: 1,
      salePrice: "", rentPrice: "", condoFee: "", iptu: "",
      commission: 6, owner: "", broker: "", description: "", photos: [],
    });
    setErrors({});
  }

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

  return (
    <>
      <div ref={headerBtnRef}>
        <PageHeader title="Imóveis" description={`${filtered.length} imóveis${search || statusF !== "todos" || purposeF !== "todos" || unitF !== "todos" ? " encontrados" : " cadastrados"}`}>
          <Button
            className="gradient-primary border-0 shadow-glow gap-2"
            onClick={() => setShowImovelSheet(true)}
          >
            <Plus className="w-4 h-4" /> Cadastrar imóvel
          </Button>
        </PageHeader>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6 shadow-card">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou código..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-md ${view === "grid" ? "bg-card shadow-sm" : ""}`}>
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-card shadow-sm" : ""}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Grid — 4 por linha */}
      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              p={p}
              unitName={units.find((u) => u.id === p.unitId)?.name}
              onClick={() => navigate(`/imoveis/${p.id}`)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhum imóvel encontrado com os filtros selecionados.
            </div>
          )}
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
                <tr
                  key={p.id}
                  className="border-t border-border hover:bg-muted/30 cursor-pointer"
                  onClick={() => navigate(`/imoveis/${p.id}`)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.photo} loading="lazy" className="w-12 h-12 rounded-lg object-cover" />
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

      {/* FAB — botão flutuante */}
      {showFab && (
        <button
          onClick={() => setShowImovelSheet(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full gradient-primary text-primary-foreground font-semibold shadow-glow text-sm hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> Cadastrar imóvel
        </button>
      )}

      {/* Sheet — Cadastrar Imóvel */}
      <Sheet open={showImovelSheet} onOpenChange={(v) => { setShowImovelSheet(v); if (!v) resetImovelForm(); }}>
        <SheetContent className="w-[520px] sm:max-w-[520px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Cadastrar Imóvel</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-6 pb-10">
            {/* Título */}
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input
                placeholder="Ex: Apartamento Vista Mar 3 quartos"
                value={imovelForm.title}
                onChange={(e) => setImovelForm((f) => ({ ...f, title: e.target.value }))}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            {/* Tipo + Finalidade */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <Label>Finalidade</Label>
                <Select value={imovelForm.purpose} onValueChange={(v) => setImovelForm((f) => ({ ...f, purpose: v as Property["purpose"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="locacao">Locação</SelectItem>
                    <SelectItem value="venda_locacao">Venda e Locação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
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

            {/* Unidade */}
            <div className="space-y-1.5">
              <Label>Unidade / Empreendimento</Label>
              <Select
                value={imovelForm.unitId || "nenhuma"}
                onValueChange={(v) => setImovelForm((f) => ({ ...f, unitId: v === "nenhuma" ? "" : v }))}
              >
                <SelectTrigger><SelectValue placeholder="Selecionar unidade (opcional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhuma">Nenhuma</SelectItem>
                  {units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                onClick={() => { setShowImovelSheet(false); setShowUnitSheet(true); }}
              >
                <Plus className="w-3 h-3" /> Cadastrar nova unidade
              </button>
            </div>

            {/* Endereço — apenas bairro, cidade, estado */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 col-span-1">
                <Label>Bairro *</Label>
                <Input
                  placeholder="Boa Viagem"
                  value={imovelForm.neighborhood}
                  onChange={(e) => setImovelForm((f) => ({ ...f, neighborhood: e.target.value }))}
                />
                {errors.neighborhood && <p className="text-xs text-destructive">{errors.neighborhood}</p>}
              </div>
              <div className="space-y-1.5 col-span-1">
                <Label>Cidade *</Label>
                <Input
                  placeholder="Recife"
                  value={imovelForm.city}
                  onChange={(e) => setImovelForm((f) => ({ ...f, city: e.target.value }))}
                />
                {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
              </div>
              <div className="space-y-1.5 col-span-1">
                <Label>Estado</Label>
                <Input
                  placeholder="PE"
                  value={imovelForm.state}
                  onChange={(e) => setImovelForm((f) => ({ ...f, state: e.target.value }))}
                />
              </div>
            </div>

            {/* Características */}
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1.5">
                <Label>Área (m²)</Label>
                <Input type="number" value={imovelForm.area} onChange={(e) => setImovelForm((f) => ({ ...f, area: +e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Quartos</Label>
                <Input type="number" min={0} value={imovelForm.bedrooms} onChange={(e) => setImovelForm((f) => ({ ...f, bedrooms: +e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Banheiros</Label>
                <Input type="number" min={1} value={imovelForm.bathrooms} onChange={(e) => setImovelForm((f) => ({ ...f, bathrooms: +e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Vagas</Label>
                <Input type="number" min={0} value={imovelForm.parking} onChange={(e) => setImovelForm((f) => ({ ...f, parking: +e.target.value }))} />
              </div>
            </div>

            {/* Suítes */}
            <div className="space-y-1.5">
              <Label>Suítes</Label>
              <Input type="number" min={0} value={imovelForm.suites} onChange={(e) => setImovelForm((f) => ({ ...f, suites: +e.target.value }))} />
            </div>

            {/* Valores */}
            {imovelForm.purpose !== "locacao" && (
              <div className="space-y-1.5">
                <Label>Valor de Venda (R$)</Label>
                <Input type="number" placeholder="Ex: 890000" value={imovelForm.salePrice} onChange={(e) => setImovelForm((f) => ({ ...f, salePrice: e.target.value }))} />
              </div>
            )}
            {imovelForm.purpose !== "venda" && (
              <div className="space-y-1.5">
                <Label>Valor de Aluguel (R$/mês)</Label>
                <Input type="number" placeholder="Ex: 2800" value={imovelForm.rentPrice} onChange={(e) => setImovelForm((f) => ({ ...f, rentPrice: e.target.value }))} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Condomínio (R$/mês)</Label>
                <Input type="number" placeholder="Ex: 800" value={imovelForm.condoFee} onChange={(e) => setImovelForm((f) => ({ ...f, condoFee: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>IPTU (R$/mês)</Label>
                <Input type="number" placeholder="Ex: 200" value={imovelForm.iptu} onChange={(e) => setImovelForm((f) => ({ ...f, iptu: e.target.value }))} />
              </div>
            </div>

            {/* Proprietário + Corretor + Comissão */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Proprietário</Label>
                <Input placeholder="Nome do proprietário" value={imovelForm.owner} onChange={(e) => setImovelForm((f) => ({ ...f, owner: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Corretor</Label>
                <Input placeholder="Nome do corretor" value={imovelForm.broker} onChange={(e) => setImovelForm((f) => ({ ...f, broker: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Comissão (%)</Label>
              <Input type="number" min={0} max={100} value={imovelForm.commission} onChange={(e) => setImovelForm((f) => ({ ...f, commission: +e.target.value }))} />
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <textarea
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                placeholder="Descrição do imóvel..."
                value={imovelForm.description}
                onChange={(e) => setImovelForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            {/* Upload de fotos */}
            <div className="space-y-2">
              <Label>Fotos ({imovelForm.photos.length}/10)</Label>
              <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${imovelForm.photos.length >= 10 ? "opacity-50 pointer-events-none" : "hover:border-primary hover:bg-primary-soft/30"}`}>
                <ImagePlus className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {imovelForm.photos.length >= 10 ? "Limite de 10 fotos atingido" : "Clique para adicionar fotos"}
                </span>
                <span className="text-xs text-muted-foreground/70">PNG, JPG, WEBP — otimizadas automaticamente</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={imovelForm.photos.length >= 10}
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                />
              </label>
              {imovelForm.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {imovelForm.photos.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                      <img src={src} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setImovelForm((f) => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }))}
                        className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 text-[9px] bg-background/80 px-1 rounded font-medium">
                          Capa
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gradient-primary border-0 shadow-glow" onClick={saveImovel}>
                Salvar imóvel
              </Button>
              <Button variant="outline" onClick={() => { setShowImovelSheet(false); resetImovelForm(); }}>
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
              <Button className="flex-1 gradient-primary border-0 shadow-glow" onClick={saveUnit}>Salvar unidade</Button>
              <Button variant="outline" onClick={() => setShowUnitSheet(false)}>Cancelar</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function PropertyCard({ p, unitName, onClick }: { p: Property; unitName?: string; onClick: () => void }) {
  return (
    <Card
      className="overflow-hidden shadow-card hover:shadow-lg-custom transition-all group cursor-pointer"
      onClick={onClick}
    >
      {/* Foto limpa */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={p.photo}
          alt={p.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-3">
        {/* Status + Destaque acima do título */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <StatusBadge status={p.status} />
          {p.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-warning text-warning-foreground text-xs font-semibold">
              <Star className="w-3 h-3" /> Destaque
            </span>
          )}
        </div>

        {/* Título + Código */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight flex-1 min-w-0 truncate">{p.title}</h3>
          <span className="text-[10px] font-mono text-muted-foreground flex-shrink-0 bg-muted px-1.5 py-0.5 rounded">{p.code}</span>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />{p.neighborhood}, {p.city}
        </p>
        {unitName && (
          <p className="text-xs text-primary flex items-center gap-1 mt-0.5">
            <Building className="w-3 h-3" />{unitName}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{p.area}m²</span>
          {p.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{p.bedrooms}</span>}
          <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms}</span>
          <span className="flex items-center gap-1"><Car className="w-3 h-3" />{p.parking}</span>
        </div>

        <div className="flex items-end justify-between mt-3 pt-2 border-t border-border">
          <div>
            <div className="text-xs text-muted-foreground">{p.purpose === "locacao" ? "Aluguel" : "Venda"}</div>
            <div className="font-bold text-primary text-sm">
              {formatBRL(p.salePrice ?? p.rentPrice ?? 0)}
              {!p.salePrice && p.rentPrice && <span className="text-xs font-normal text-muted-foreground">/mês</span>}
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            <div className="font-semibold text-foreground">{p.leads} leads</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
