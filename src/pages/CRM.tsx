import { useState, useRef, useCallback } from "react";
import { DndContext, DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors, useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GripVertical, Plus, MoreVertical, Phone, Building2, Search, Check, AlertTriangle } from "lucide-react";
import { crmStages as seedStages, leads as seed, Lead, CrmStage } from "@/lib/mock-data";
import { useApp } from "@/context/AppContext";

const priorityColor = { alta: "bg-destructive", media: "bg-warning", baixa: "bg-success" } as const;

export default function CRM() {
  const { properties } = useApp();
  const [items, setItems] = useState<Lead[]>(seed);
  const [stages, setStages] = useState<CrmStage[]>(seedStages);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [leadSheetOpen, setLeadSheetOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [inlineEdit, setInlineEdit] = useState<{ id: string; name: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; stageId: string; input: string }>({ open: false, stageId: "", input: "" });
  const [propSearch, setPropSearch] = useState("");
  const [propPopOpen, setPropPopOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const boardRef = useRef<HTMLDivElement>(null);
  const pan = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onBoardMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-lead-card]")) return;
    pan.current = { active: true, startX: e.pageX, scrollLeft: boardRef.current?.scrollLeft ?? 0 };
    if (boardRef.current) boardRef.current.style.cursor = "grabbing";
  }, []);

  const onBoardMouseMove = useCallback((e: React.MouseEvent) => {
    if (!pan.current.active) return;
    e.preventDefault();
    if (boardRef.current) boardRef.current.scrollLeft = pan.current.scrollLeft - (e.pageX - pan.current.startX);
  }, []);

  const onBoardMouseUp = useCallback(() => {
    pan.current.active = false;
    if (boardRef.current) boardRef.current.style.cursor = "default";
  }, []);

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    if (active.data.current?.type === "column") {
      const oldIdx = stages.findIndex((s) => s.id === active.id);
      const newIdx = stages.findIndex((s) => s.id === over.id);
      if (oldIdx !== newIdx) setStages(arrayMove(stages, oldIdx, newIdx));
      return;
    }
    const targetStageId = stages.find((s) => s.id === over.id)?.id || items.find((l) => l.id === over.id)?.stageId;
    if (targetStageId) setItems((prev) => prev.map((l) => l.id === active.id ? { ...l, stageId: targetStageId } : l));
  };

  const openNew = () => {
    setEditing({ id: `l${Date.now()}`, name: "", email: "", phone: "", source: "Site", notes: "", priority: "media", stageId: stages[0]?.id ?? "s1", broker: "Ana Souza", status: "ativo" });
    setErrors({}); setPropSearch(""); setLeadSheetOpen(true);
  };

  const openEdit = (l: Lead) => { setEditing(l); setErrors({}); setPropSearch(l.propertyInterest ?? ""); setLeadSheetOpen(true); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!editing?.name?.trim()) e.name = "Nome obrigatório";
    if (!editing?.phone?.trim()) e.phone = "Telefone obrigatório";
    if (!editing?.email?.trim()) e.email = "E-mail obrigatório";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!editing || !validate()) return;
    setItems((prev) => prev.find((p) => p.id === editing.id) ? prev.map((p) => p.id === editing.id ? editing : p) : [...prev, editing]);
    setLeadSheetOpen(false);
  };

  const handleDeleteStage = () => {
    if (deleteConfirm.input !== "DELETE") return;
    setStages((prev) => prev.filter((s) => s.id !== deleteConfirm.stageId));
    setItems((prev) => prev.filter((l) => l.stageId !== deleteConfirm.stageId));
    setDeleteConfirm({ open: false, stageId: "", input: "" });
  };

  const saveInlineEdit = () => {
    if (!inlineEdit) return;
    setStages((prev) => prev.map((s) => s.id === inlineEdit.id ? { ...s, name: inlineEdit.name } : s));
    setInlineEdit(null);
  };

  const filteredProps = properties.filter((p) =>
    p.title.toLowerCase().includes(propSearch.toLowerCase()) || p.code.toLowerCase().includes(propSearch.toLowerCase())
  );

  return (
    <>
      <PageHeader title="CRM" description="Funil de leads — arraste os cards entre as etapas">
        <Button variant="outline" onClick={() => setCustomizeOpen(true)}>Personalizar colunas</Button>
        <Button className="gradient-primary border-0 shadow-glow gap-2" onClick={openNew}><Plus className="w-4 h-4" /> Novo lead</Button>
      </PageHeader>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={stages.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
          <div ref={boardRef} className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 select-none"
            style={{ minHeight: "calc(100vh - 220px)" }}
            onMouseDown={onBoardMouseDown} onMouseMove={onBoardMouseMove}
            onMouseUp={onBoardMouseUp} onMouseLeave={onBoardMouseUp}>
            {stages.map((stage) => (
              <SortableColumn key={stage.id} stage={stage}
                leads={items.filter((l) => l.stageId === stage.id)}
                onCardClick={openEdit}
                onRename={(id, name) => setInlineEdit({ id, name })}
                onCustomize={() => setCustomizeOpen(true)}
                onDelete={(id) => setDeleteConfirm({ open: true, stageId: id, input: "" })}
                inlineEdit={inlineEdit}
                onInlineEditChange={(name) => setInlineEdit((e) => e ? { ...e, name } : e)}
                onInlineEditSave={saveInlineEdit}
                onInlineEditCancel={() => setInlineEdit(null)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Lead Sheet */}
      <Sheet open={leadSheetOpen} onOpenChange={setLeadSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>{editing && items.find((p) => p.id === editing.id) ? "Editar lead" : "Novo lead"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="space-y-4 mt-6">
              <div>
                <Label>Nome *</Label>
                <Input className="mt-1.5" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>E-mail *</Label>
                  <Input className="mt-1.5" type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label>Telefone *</Label>
                  <Input className="mt-1.5" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label>Imóvel de interesse</Label>
                <Popover open={propPopOpen} onOpenChange={setPropPopOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1.5 justify-between font-normal text-left h-auto py-2">
                      <span className="truncate text-sm">
                        {editing.propertyInterest ? `${editing.propertyInterest} — ${properties.find((p) => p.code === editing.propertyInterest)?.title ?? ""}` : "Selecionar imóvel..."}
                      </span>
                      <Building2 className="w-4 h-4 opacity-50 flex-shrink-0 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[380px] p-2" align="start">
                    <div className="relative mb-2">
                      <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Buscar por título ou código..." className="pl-8 h-8 text-sm" value={propSearch} onChange={(e) => setPropSearch(e.target.value)} />
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-0.5">
                      <button className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted text-muted-foreground" onClick={() => { setEditing({ ...editing, propertyInterest: undefined }); setPropPopOpen(false); }}>Nenhum</button>
                      {filteredProps.map((p) => (
                        <button key={p.id} className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted flex items-center justify-between gap-2 ${editing.propertyInterest === p.code ? "bg-primary-soft text-primary font-medium" : ""}`}
                          onClick={() => { setEditing({ ...editing, propertyInterest: p.code }); setPropPopOpen(false); setPropSearch(""); }}>
                          <span className="flex-1 truncate">{p.code} — {p.title}</span>
                          {editing.propertyInterest === p.code && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                        </button>
                      ))}
                      {filteredProps.length === 0 && <p className="text-sm text-muted-foreground px-3 py-2">Nenhum resultado</p>}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Origem</Label>
                  <Select value={editing.source} onValueChange={(v: Lead["source"]) => setEditing({ ...editing, source: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Instagram", "Facebook", "Anúncio", "Indicação", "Site", "WhatsApp", "Outros"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Etapa</Label>
                  <Select value={editing.stageId} onValueChange={(v) => setEditing({ ...editing, stageId: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{stages.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
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
              <div><Label>Anotações</Label><Textarea className="mt-1.5" rows={3} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="outline" className="flex-1" onClick={() => setLeadSheetOpen(false)}>Cancelar</Button>
                <Button className="flex-1 gradient-primary border-0" onClick={save}>Salvar lead</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Personalizar Colunas */}
      <Sheet open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle>Personalizar Colunas</SheetTitle></SheetHeader>
          <p className="text-sm text-muted-foreground mt-2 mb-4">Arraste para reordenar. Clique no nome para renomear. Use × para deletar.</p>
          <DndContext sensors={sensors} onDragEnd={(e) => {
            const { active, over } = e;
            if (!over || active.id === over.id) return;
            const oldIdx = stages.findIndex((s) => s.id === active.id);
            const newIdx = stages.findIndex((s) => s.id === over.id);
            if (oldIdx !== newIdx) setStages(arrayMove(stages, oldIdx, newIdx));
          }}>
            <SortableContext items={stages.map((s) => s.id)} strategy={undefined as any}>
              <div className="space-y-2">
                {stages.map((stage, idx) => (
                  <PanelSortableItem key={stage.id} stage={stage} idx={idx}
                    leadCount={items.filter((l) => l.stageId === stage.id).length}
                    inlineEdit={inlineEdit}
                    onInlineEdit={(id, name) => setInlineEdit({ id, name })}
                    onInlineEditChange={(name) => setInlineEdit((e) => e ? { ...e, name } : e)}
                    onInlineEditSave={saveInlineEdit}
                    onInlineEditCancel={() => setInlineEdit(null)}
                    onDelete={(id) => setDeleteConfirm({ open: true, stageId: id, input: "" })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Button variant="outline" className="w-full mt-4 gap-2"
            onClick={() => setStages((prev) => [...prev, { id: `s${Date.now()}`, name: "Nova etapa", order: prev.length + 1, color: "primary" }])}>
            <Plus className="w-4 h-4" /> Adicionar etapa
          </Button>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={deleteConfirm.open} onOpenChange={(v) => setDeleteConfirm((d) => ({ ...d, open: v }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" /> Deletar coluna</DialogTitle>
            <DialogDescription>Esta ação é irreversível. Todos os leads desta coluna serão removidos do funil.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-muted-foreground">Para confirmar, digite <strong className="font-mono text-foreground">DELETE</strong> em maiúsculo no campo abaixo:</p>
            <Input placeholder="DELETE" value={deleteConfirm.input} onChange={(e) => setDeleteConfirm((d) => ({ ...d, input: e.target.value }))} className={deleteConfirm.input === "DELETE" ? "border-success ring-success" : ""} />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm({ open: false, stageId: "", input: "" })}>Cancelar</Button>
              <Button variant="destructive" className="flex-1" disabled={deleteConfirm.input !== "DELETE"} onClick={handleDeleteStage}>Confirmar exclusão</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SortableColumn({ stage, leads, onCardClick, onRename, onCustomize, onDelete, inlineEdit, onInlineEditChange, onInlineEditSave, onInlineEditCancel }: {
  stage: CrmStage; leads: Lead[]; onCardClick: (l: Lead) => void;
  onRename: (id: string, name: string) => void; onCustomize: () => void; onDelete: (id: string) => void;
  inlineEdit: { id: string; name: string } | null; onInlineEditChange: (n: string) => void;
  onInlineEditSave: () => void; onInlineEditCancel: () => void;
}) {
  const { attributes, listeners, setNodeRef: setSortRef, transform, transition, isDragging } = useSortable({ id: stage.id, data: { type: "column" } });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: stage.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setSortRef} style={style} className={`flex-shrink-0 w-72 rounded-2xl bg-muted/50 transition-colors ${isOver ? "bg-primary-soft/30" : ""}`}>
      <div ref={setDropRef} className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 flex-1 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
          {inlineEdit?.id === stage.id ? (
            <input autoFocus className="text-sm font-semibold bg-transparent border-b border-primary outline-none flex-1 min-w-0"
              value={inlineEdit.name} onChange={(e) => onInlineEditChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") onInlineEditSave(); if (e.key === "Escape") onInlineEditCancel(); }}
              onClick={(e) => e.stopPropagation()} />
          ) : (
            <h3 className="font-semibold text-sm">{stage.name}</h3>
          )}
          <span className="text-xs text-muted-foreground bg-card px-1.5 rounded">{leads.length}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onRename(stage.id, stage.name)}>Editar nome</DropdownMenuItem>
            <DropdownMenuItem onClick={onCustomize}>Reorganizar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(stage.id)}>Deletar coluna</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="px-3 pb-3 space-y-2 min-h-[100px]">
        {leads.map((l) => <LeadCard key={l.id} lead={l} onClick={() => onCardClick(l)} />)}
      </div>
    </div>
  );
}

function PanelSortableItem({ stage, idx, leadCount, inlineEdit, onInlineEdit, onInlineEditChange, onInlineEditSave, onInlineEditCancel, onDelete }: {
  stage: CrmStage; idx: number; leadCount: number;
  inlineEdit: { id: string; name: string } | null;
  onInlineEdit: (id: string, name: string) => void;
  onInlineEditChange: (n: string) => void;
  onInlineEditSave: () => void;
  onInlineEditCancel: () => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stage.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 px-3 py-3 rounded-xl border border-border bg-muted/30">
      <button className="cursor-grab active:cursor-grabbing touch-none" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>
      <span className="w-6 h-6 rounded-full bg-primary-soft text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
      {inlineEdit?.id === stage.id ? (
        <div className="flex-1 flex gap-2">
          <Input value={inlineEdit.name} onChange={(e) => onInlineEditChange(e.target.value)} className="h-8" autoFocus
            onKeyDown={(e) => { if (e.key === "Enter") onInlineEditSave(); if (e.key === "Escape") onInlineEditCancel(); }} />
          <Button size="sm" className="h-8 px-2" onClick={onInlineEditSave}><Check className="w-3.5 h-3.5" /></Button>
        </div>
      ) : (
        <span className="flex-1 text-sm font-medium cursor-pointer hover:text-primary" onClick={() => onInlineEdit(stage.id, stage.name)}>{stage.name}</span>
      )}
      <span className="text-xs text-muted-foreground">{leadCount} leads</span>
      <button className="text-destructive hover:text-destructive/70 text-lg font-bold leading-none" onClick={() => onDelete(stage.id)}>×</button>
    </div>
  );
}

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id, data: { type: "lead" } });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <Card ref={setNodeRef} style={style} data-lead-card {...listeners} {...attributes} onClick={onClick}
      className={`p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-card transition-shadow ${isDragging ? "opacity-40" : ""}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="font-medium text-sm leading-tight">{lead.name}</div>
        <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${priorityColor[lead.priority]}`} />
      </div>
      {lead.propertyInterest && <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Building2 className="w-3 h-3" />{lead.propertyInterest}</div>}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone.split(" ")[1] ?? lead.phone}</span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
        <span className="text-[10px] font-medium uppercase text-muted-foreground tracking-wider">{lead.source}</span>
        <StatusBadge status={lead.priority} />
      </div>
    </Card>
  );
}
