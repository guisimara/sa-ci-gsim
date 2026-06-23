import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from "@dnd-kit/core";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, MoreVertical, Phone, Mail, Building2, X } from "lucide-react";
import { crmStages, leads as seed, properties, Lead } from "@/lib/mock-data";

const priorityColor = { alta: "bg-destructive", media: "bg-warning", baixa: "bg-success" } as const;

export default function CRM() {
  const [items, setItems] = useState<Lead[]>(seed);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [open, setOpen] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    setItems((prev) => prev.map((l) => (l.id === active.id ? { ...l, stageId: String(over.id) } : l)));
  };

  const openNew = () => {
    setEditing({ id: `l${Date.now()}`, name: "", email: "", phone: "", source: "Site", notes: "", priority: "media", stageId: "s1", broker: "Ana Souza", status: "ativo" });
    setOpen(true);
  };
  const openEdit = (l: Lead) => { setEditing(l); setOpen(true); };

  const save = () => {
    if (!editing) return;
    setItems((prev) => prev.find((p) => p.id === editing.id) ? prev.map((p) => p.id === editing.id ? editing : p) : [...prev, editing]);
    setOpen(false);
  };

  return (
    <>
      <PageHeader title="CRM" description="Funil de leads — arraste os cards entre as etapas">
        <Button variant="outline">Personalizar colunas</Button>
        <Button className="gradient-primary border-0 shadow-glow gap-2" onClick={openNew}><Plus className="w-4 h-4" /> Novo lead</Button>
      </PageHeader>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
          {crmStages.map((stage) => {
            const stageLeads = items.filter((l) => l.stageId === stage.id);
            return <Column key={stage.id} stage={stage} leads={stageLeads} onCardClick={openEdit} />;
          })}
        </div>
      </DndContext>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing && items.find((p) => p.id === editing.id) ? "Editar lead" : "Novo lead"}</SheetTitle>
          </SheetHeader>
          {editing && (
            <div className="space-y-4 mt-6">
              <div><Label>Nome *</Label><Input className="mt-1.5" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>E-mail</Label><Input className="mt-1.5" type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
                <div><Label>Telefone/WhatsApp</Label><Input className="mt-1.5" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
              </div>
              <div>
                <Label>Imóvel de interesse</Label>
                <Select value={editing.propertyInterest} onValueChange={(v) => setEditing({ ...editing, propertyInterest: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Buscar imóvel..." /></SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => <SelectItem key={p.id} value={p.code}>{p.code} — {p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Origem</Label>
                  <Select value={editing.source} onValueChange={(v: Lead["source"]) => setEditing({ ...editing, source: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Instagram", "Facebook", "Anúncio", "Indicação", "Site", "WhatsApp", "Outros"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Etapa</Label>
                  <Select value={editing.stageId} onValueChange={(v) => setEditing({ ...editing, stageId: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{crmStages.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              {editing.source === "Indicação" && (
                <div><Label>Quem indicou?</Label><Input className="mt-1.5" value={editing.referredBy ?? ""} onChange={(e) => setEditing({ ...editing, referredBy: e.target.value })} /></div>
              )}
              <div>
                <Label>Prioridade</Label>
                <div className="flex gap-2 mt-1.5">
                  {(["alta", "media", "baixa"] as const).map((p) => (
                    <button key={p} type="button" onClick={() => setEditing({ ...editing, priority: p })}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium capitalize ${editing.priority === p ? "border-primary bg-primary-soft" : "border-border"}`}>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${priorityColor[p]}`} />{p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Próxima tarefa</Label><Input className="mt-1.5" placeholder="Ex: Confirmar visita" value={editing.nextTask ?? ""} onChange={(e) => setEditing({ ...editing, nextTask: e.target.value })} /></div>
                <div><Label>Data</Label><Input type="date" className="mt-1.5" value={editing.nextTaskDate ?? ""} onChange={(e) => setEditing({ ...editing, nextTaskDate: e.target.value })} /></div>
              </div>
              <div><Label>Anotações</Label><Textarea className="mt-1.5" rows={4} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button className="flex-1 gradient-primary border-0" onClick={save}>Salvar lead</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Column({ stage, leads, onCardClick }: { stage: typeof crmStages[0]; leads: Lead[]; onCardClick: (l: Lead) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  return (
    <div ref={setNodeRef} className={`flex-shrink-0 w-72 rounded-2xl bg-muted/50 p-3 transition-colors ${isOver ? "bg-primary-soft" : ""}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <h3 className="font-semibold text-sm">{stage.name}</h3>
          <span className="text-xs text-muted-foreground bg-card px-1.5 rounded">{leads.length}</span>
        </div>
        <button className="text-muted-foreground hover:text-foreground"><MoreVertical className="w-4 h-4" /></button>
      </div>
      <div className="space-y-2 min-h-[100px]">
        {leads.map((l) => <LeadCard key={l.id} lead={l} onClick={() => onCardClick(l)} />)}
      </div>
    </div>
  );
}

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`p-3 shadow-sm cursor-grab hover:shadow-card transition-shadow ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium text-sm">{lead.name}</div>
        <span className={`w-2 h-2 rounded-full mt-1.5 ${priorityColor[lead.priority]}`} />
      </div>
      {lead.propertyInterest && <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Building2 className="w-3 h-3" />{lead.propertyInterest}</div>}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone.split(" ")[1] ?? lead.phone}</span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <span className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">{lead.source}</span>
        <span className="text-xs text-muted-foreground">{lead.broker.split(" ")[0]}</span>
      </div>
    </Card>
  );
}
