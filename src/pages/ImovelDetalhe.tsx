import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ArrowLeft, Edit2, Save, X, ImagePlus, BedDouble,
  Bath, Car, Maximize, MapPin, Building, Star, ChevronLeft, ChevronRight,
} from "lucide-react";
import { units, formatBRL, Property } from "@/lib/mock-data";
import { useApp } from "@/context/AppContext";
import { optimizeImage } from "@/lib/image-utils";

export default function ImovelDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, updateProperty } = useApp();

  const property = properties.find((p) => p.id === id);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Property | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">Imóvel não encontrado.</p>
        <Button onClick={() => navigate("/imoveis")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Imóveis
        </Button>
      </div>
    );
  }

  const photos = (editing ? form?.photos : property.photos) ?? [property.photo];
  const currentPhoto = photos[photoIdx] ?? property.photo;
  const unitName = units.find((u) => u.id === property.unitId)?.name;

  function startEdit() {
    setForm({ ...property });
    setEditing(true);
    setPhotoIdx(0);
  }

  function cancelEdit() {
    setForm(null);
    setEditing(false);
    setPhotoIdx(0);
  }

  function saveEdit() {
    if (!form) return;
    updateProperty(property.id, form);
    setEditing(false);
    setForm(null);
  }

  async function handlePhotoUpload(files: FileList | null) {
    if (!form || !files) return;
    const remaining = 10 - (form.photos?.length ?? 0);
    const toProcess = Array.from(files).slice(0, remaining);
    const optimized = await Promise.all(toProcess.map((f) => optimizeImage(f)));
    setForm((prev) => prev ? { ...prev, photos: [...(prev.photos ?? []), ...optimized] } : prev);
  }

  function removePhoto(idx: number) {
    if (!form) return;
    setForm((prev) => {
      if (!prev) return prev;
      const photos = prev.photos.filter((_, i) => i !== idx);
      return { ...prev, photos, photo: photos[0] ?? prev.photo };
    });
    if (photoIdx >= idx && photoIdx > 0) setPhotoIdx(photoIdx - 1);
  }

  const displayPhotos = editing ? (form?.photos ?? []) : property.photos;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/imoveis")} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <div className="flex-1" />
        {!editing ? (
          <Button onClick={startEdit} variant="outline" className="gap-2">
            <Edit2 className="w-4 h-4" /> Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={cancelEdit} variant="outline" className="gap-2">
              <X className="w-4 h-4" /> Cancelar
            </Button>
            <Button onClick={saveEdit} className="gradient-primary border-0 shadow-glow gap-2">
              <Save className="w-4 h-4" /> Salvar
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Gallery — col-span-3 */}
        <div className="lg:col-span-3 space-y-4">
          {/* Main photo */}
          <Card className="overflow-hidden shadow-card">
            <div className="relative aspect-[4/3] bg-muted">
              <img
                key={currentPhoto}
                src={currentPhoto}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {displayPhotos.length > 1 && (
                <>
                  <button
                    onClick={() => setPhotoIdx((i) => (i - 1 + displayPhotos.length) % displayPhotos.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPhotoIdx((i) => (i + 1) % displayPhotos.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {displayPhotos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPhotoIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIdx ? "bg-white w-3" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2">
            {displayPhotos.map((src, i) => (
              <div
                key={i}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  i === photoIdx ? "border-primary shadow-glow" : "border-transparent hover:border-primary/40"
                }`}
                onClick={() => setPhotoIdx(i)}
              >
                <img src={src} className="w-full h-full object-cover" />
                {editing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-[10px]"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {/* Upload slot when editing */}
            {editing && displayPhotos.length < 10 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex items-center justify-center bg-muted/30 hover:bg-primary-soft/20 transition-colors">
                <ImagePlus className="w-5 h-5 text-muted-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                />
              </label>
            )}
          </div>
          {editing && (
            <p className="text-xs text-muted-foreground">{displayPhotos.length}/10 fotos — imagens são otimizadas automaticamente ao subir.</p>
          )}
        </div>

        {/* Details — col-span-2 */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 shadow-card">
            {!editing ? (
              <>
                {/* Status badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <StatusBadge status={property.status} />
                  {property.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-warning text-warning-foreground text-xs font-semibold">
                      <Star className="w-3 h-3" /> Destaque
                    </span>
                  )}
                  <Badge variant="outline" className="ml-auto font-mono text-xs">{property.code}</Badge>
                </div>

                <h1 className="text-xl font-bold leading-tight mb-2">{property.title}</h1>

                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4" />{property.neighborhood}, {property.city} — {property.state}
                </p>
                {unitName && (
                  <p className="text-sm text-primary flex items-center gap-1.5 mb-3">
                    <Building className="w-4 h-4" />{unitName}
                  </p>
                )}

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Maximize className="w-4 h-4" />{property.area} m²
                  </div>
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BedDouble className="w-4 h-4" />{property.bedrooms} quarto{property.bedrooms > 1 ? "s" : ""}
                      {property.suites > 0 && <span className="text-xs">({property.suites} suíte{property.suites > 1 ? "s" : ""})</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Bath className="w-4 h-4" />{property.bathrooms} banheiro{property.bathrooms > 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Car className="w-4 h-4" />{property.parking} vaga{property.parking > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  {property.salePrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Venda</span>
                      <span className="font-bold text-primary text-lg">{formatBRL(property.salePrice)}</span>
                    </div>
                  )}
                  {property.rentPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Aluguel</span>
                      <span className="font-bold text-primary">{formatBRL(property.rentPrice)}<span className="text-xs font-normal text-muted-foreground">/mês</span></span>
                    </div>
                  )}
                  {property.condoFee && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Condomínio</span>
                      <span>{formatBRL(property.condoFee)}/mês</span>
                    </div>
                  )}
                  {property.iptu && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IPTU</span>
                      <span>{formatBRL(property.iptu)}/mês</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Edit mode
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Título</Label>
                  <Input value={form?.title ?? ""} onChange={(e) => setForm((f) => f ? { ...f, title: e.target.value } : f)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={form?.status} onValueChange={(v) => setForm((f) => f ? { ...f, status: v as Property["status"] } : f)}>
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
                  <div className="space-y-1.5">
                    <Label>Finalidade</Label>
                    <Select value={form?.purpose} onValueChange={(v) => setForm((f) => f ? { ...f, purpose: v as Property["purpose"] } : f)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venda">Venda</SelectItem>
                        <SelectItem value="locacao">Locação</SelectItem>
                        <SelectItem value="venda_locacao">Venda e Locação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <Label>Bairro</Label>
                    <Input value={form?.neighborhood ?? ""} onChange={(e) => setForm((f) => f ? { ...f, neighborhood: e.target.value } : f)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cidade</Label>
                    <Input value={form?.city ?? ""} onChange={(e) => setForm((f) => f ? { ...f, city: e.target.value } : f)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Estado</Label>
                    <Input value={form?.state ?? ""} onChange={(e) => setForm((f) => f ? { ...f, state: e.target.value } : f)} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1.5">
                    <Label>Área m²</Label>
                    <Input type="number" value={form?.area ?? ""} onChange={(e) => setForm((f) => f ? { ...f, area: +e.target.value } : f)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Quartos</Label>
                    <Input type="number" value={form?.bedrooms ?? ""} onChange={(e) => setForm((f) => f ? { ...f, bedrooms: +e.target.value } : f)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Banheiros</Label>
                    <Input type="number" value={form?.bathrooms ?? ""} onChange={(e) => setForm((f) => f ? { ...f, bathrooms: +e.target.value } : f)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Vagas</Label>
                    <Input type="number" value={form?.parking ?? ""} onChange={(e) => setForm((f) => f ? { ...f, parking: +e.target.value } : f)} />
                  </div>
                </div>
                {form?.purpose !== "locacao" && (
                  <div className="space-y-1.5">
                    <Label>Valor Venda (R$)</Label>
                    <Input type="number" value={form?.salePrice ?? ""} onChange={(e) => setForm((f) => f ? { ...f, salePrice: +e.target.value || undefined } : f)} />
                  </div>
                )}
                {form?.purpose !== "venda" && (
                  <div className="space-y-1.5">
                    <Label>Aluguel (R$/mês)</Label>
                    <Input type="number" value={form?.rentPrice ?? ""} onChange={(e) => setForm((f) => f ? { ...f, rentPrice: +e.target.value || undefined } : f)} />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label>Condomínio (R$)</Label>
                    <Input type="number" value={form?.condoFee ?? ""} onChange={(e) => setForm((f) => f ? { ...f, condoFee: +e.target.value || undefined } : f)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>IPTU (R$)</Label>
                    <Input type="number" value={form?.iptu ?? ""} onChange={(e) => setForm((f) => f ? { ...f, iptu: +e.target.value || undefined } : f)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label>Proprietário</Label>
                    <Input value={form?.owner ?? ""} onChange={(e) => setForm((f) => f ? { ...f, owner: e.target.value } : f)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Corretor</Label>
                    <Input value={form?.broker ?? ""} onChange={(e) => setForm((f) => f ? { ...f, broker: e.target.value } : f)} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Comissão (%)</Label>
                  <Input type="number" value={form?.commission ?? ""} onChange={(e) => setForm((f) => f ? { ...f, commission: +e.target.value } : f)} />
                </div>
              </div>
            )}
          </Card>

          {/* Info extra (proprietário, corretor etc.) quando não editando */}
          {!editing && (
            <Card className="p-5 shadow-card space-y-3">
              <h3 className="font-semibold text-sm mb-2">Informações adicionais</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Tipo</div>
                  <div className="font-medium capitalize">{property.type}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Comissão</div>
                  <div className="font-medium">{property.commission}%</div>
                </div>
                {property.owner && (
                  <div>
                    <div className="text-xs text-muted-foreground">Proprietário</div>
                    <div className="font-medium">{property.owner}</div>
                  </div>
                )}
                {property.broker && (
                  <div>
                    <div className="text-xs text-muted-foreground">Corretor</div>
                    <div className="font-medium">{property.broker}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs text-muted-foreground">Leads</div>
                  <div className="font-medium">{property.leads}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Fotos</div>
                  <div className="font-medium">{property.photos.length}</div>
                </div>
              </div>
              {property.description && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Descrição</div>
                  <p className="text-sm text-muted-foreground">{property.description}</p>
                </div>
              )}
              {property.features.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1.5">Características</div>
                  <div className="flex flex-wrap gap-1.5">
                    {property.features.map((f) => (
                      <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
