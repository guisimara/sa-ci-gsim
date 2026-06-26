import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Plus, Check, Search, ChevronDown, CalendarIcon } from "lucide-react";
import { tasks as seedTasks, clients, leads, Task, formatDate } from "@/lib/mock-data";

const allPeople = [
  ...clients.map((c) => ({ id: c.id, name: c.name })),
  ...leads.map((l) => ({ id: l.id, name: l.name })),
].filter((v, i, arr) => arr.findIndex((x) => x.name === v.name) === i);

export default function Tarefas() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [clientPopOpen, setClientPopOpen] = useState(false);

  const [form, setForm] = useState<Partial<Task>>({
    priority: "media",
    done: false,
  });

  const filtered = allPeople.filter((p) =>
    p.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  function toggleDone(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function saveTask() {
    if (!form.title?.trim()) return;
    const newTask: Task = {
      id: `tk${Date.now()}`,
      title: form.title,
      priority: form.priority as Task["priority"],
      dueDate: form.dueDate,
      clientId: form.clientId,
      clientName: form.clientName,
      done: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTasks((prev) => [newTask, ...prev]);
    setForm({ priority: "media", done: false });
    setClientSearch("");
    setSheetOpen(false);
  }

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <>
      <PageHeader title="Tarefas" description={`${pending.length} pendentes · ${done.length} concluídas`}>
        <Button className="gradient-primary border-0 shadow-glow gap-2" onClick={() => setSheetOpen(true)}>
          <Plus className="w-4 h-4" /> Nova tarefa
        </Button>
      </PageHeader>

      {/* Notepad card */}
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2rem_1fr_140px_160px_200px] gap-4 px-5 py-3 bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div />
          <div>Tarefa</div>
          <div>Prioridade</div>
          <div>Data prevista</div>
          <div>Cliente</div>
        </div>

        {/* Pending rows */}
        {pending.length === 0 && (
          <div className="px-5 py-10 text-center text-muted-foreground text-sm">
            Nenhuma tarefa pendente 🎉
          </div>
        )}
        {pending.map((task) => (
          <TaskRow key={task.id} task={task} onToggle={toggleDone} />
        ))}

        {/* Done rows */}
        {done.length > 0 && (
          <>
            <div className="px-5 py-2 bg-muted/20 border-t border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Concluídas
            </div>
            {done.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleDone} />
            ))}
          </>
        )}
      </div>

      {/* Sheet — nova tarefa */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[420px] sm:max-w-[420px]">
          <SheetHeader>
            <SheetTitle>Nova Tarefa</SheetTitle>
          </SheetHeader>

          <div className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label>Nome da tarefa *</Label>
              <Input
                placeholder="Ex: Confirmar visita com cliente"
                value={form.title ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm((f) => ({ ...f, priority: v as Task["priority"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data prevista de conclusão</Label>
              <Input
                type="date"
                value={form.dueDate ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <Popover open={clientPopOpen} onOpenChange={setClientPopOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    {form.clientName ?? "Selecionar cliente..."}
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[340px] p-2" align="start">
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome..."
                      className="pl-8 h-8 text-sm"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    <button
                      className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted text-muted-foreground"
                      onClick={() => {
                        setForm((f) => ({ ...f, clientId: undefined, clientName: undefined }));
                        setClientPopOpen(false);
                        setClientSearch("");
                      }}
                    >
                      Nenhum
                    </button>
                    {filtered.map((p) => (
                      <button
                        key={p.id}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm hover:bg-muted flex items-center justify-between",
                          form.clientId === p.id && "bg-primary-soft text-primary font-medium"
                        )}
                        onClick={() => {
                          setForm((f) => ({ ...f, clientId: p.id, clientName: p.name }));
                          setClientPopOpen(false);
                          setClientSearch("");
                        }}
                      >
                        {p.name}
                        {form.clientId === p.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                    {filtered.length === 0 && (
                      <p className="text-sm text-muted-foreground px-3 py-2">Nenhum resultado</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gradient-primary border-0 shadow-glow" onClick={saveTask}>
                Salvar tarefa
              </Button>
              <Button variant="outline" onClick={() => setSheetOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[2rem_1fr_140px_160px_200px] gap-4 px-5 py-3.5 border-b border-border/60 last:border-0 items-center hover:bg-muted/20 transition-colors group",
        task.done && "opacity-50"
      )}
    >
      {/* Checkbox círculo */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
          task.done
            ? "bg-success border-success text-success-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        )}
      >
        {task.done && <Check className="w-3 h-3" />}
      </button>

      {/* Nome */}
      <span className={cn("text-sm font-medium truncate", task.done && "line-through text-muted-foreground")}>
        {task.title}
      </span>

      {/* Prioridade */}
      <div>
        <StatusBadge status={task.priority} />
      </div>

      {/* Data */}
      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
        <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
        {task.dueDate ? formatDate(task.dueDate) : "—"}
      </span>

      {/* Cliente */}
      <span className="text-sm text-muted-foreground truncate">
        {task.clientName ?? "—"}
      </span>
    </div>
  );
}
