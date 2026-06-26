import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { clients } from "@/lib/mock-data";
import { toast } from "sonner";

const typeColor: Record<string, string> = {
  locatario: "bg-info-soft text-info",
  proprietario: "bg-primary-soft text-primary",
  comprador: "bg-success-soft text-success",
  fiador: "bg-warning-soft text-warning",
  investidor: "bg-accent text-accent-foreground",
};

const typeOptions = [
  { value: "locatario", label: "Locação" },
  { value: "comprador", label: "Venda" },
  { value: "proprietario", label: "Dono do imóvel" },
  { value: "fiador", label: "Fiador" },
  { value: "investidor", label: "Investidor" },
];

interface NewClient {
  name: string; cpf: string; email: string; phone: string;
  type: string; address: string; propertyCode: string;
}

const empty: NewClient = { name: "", cpf: "", email: "", phone: "", type: "locatario", address: "", propertyCode: "" };

export default function Clientes() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<NewClient>(empty);
  const [list, setList] = useState(clients);

  const filtered = list.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Preencha nome e e-mail obrigatórios.");
      return;
    }
    setList((prev) => [...prev, {
      id: `c${Date.now()}`, name: form.name, cpf: form.cpf, email: form.email,
      phone: form.phone, type: form.type as any, address: form.address,
    }]);
    toast.success("Cliente cadastrado!");
    setSheetOpen(false);
    setForm(empty);
  };

  return (
    <>
      <PageHeader title="Clientes" description={`${list.length} clientes cadastrados`}>
        <Button className="gradient-primary border-0 shadow-glow gap-2" onClick={() => { setForm(empty); setSheetOpen(true); }}>
          <Plus className="w-4 h-4" />Novo cliente
        </Button>
      </PageHeader>

      <Card className="p-4 mb-6 shadow-card">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome, CPF ou e-mail..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </Card>

      <Card className="shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left p-4">Cliente</th>
              <th className="text-left p-4">CPF</th>
              <th className="text-left p-4">Contato</th>
              <th className="text-left p-4">Tipo</th>
              <th className="text-left p-4">Endereço</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarFallback className="bg-primary-soft text-primary font-semibold">{c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                    <div className="font-medium">{c.name}</div>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs">{c.cpf}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-xs"><Mail className="w-3 h-3 text-muted-foreground" />{c.email}</div>
                  <div className="flex items-center gap-2 text-xs mt-1"><Phone className="w-3 h-3 text-muted-foreground" />{c.phone}</div>
                </td>
                <td className="p-4"><span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${typeColor[c.type]}`}>{c.type}</span></td>
                <td className="p-4 text-muted-foreground">{c.address}</td>
                <td className="p-4 text-right"><Button variant="ghost" size="sm">Ver</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Novo cliente Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>Novo cliente</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-6">
            <div>
              <Label>Nome completo *</Label>
              <Input className="mt-1.5" placeholder="João da Silva" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>CPF</Label>
              <Input className="mt-1.5" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>E-mail *</Label>
                <Input type="email" className="mt-1.5" placeholder="joao@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input className="mt-1.5" placeholder="(81) 99999-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Tipo de serviço</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {typeOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Endereço</Label>
              <Input className="mt-1.5" placeholder="Rua, número, bairro, cidade" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <Label>COD do imóvel</Label>
              <Input className="mt-1.5" placeholder="Ex: AP-001" value={form.propertyCode} onChange={(e) => setForm({ ...form, propertyCode: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setSheetOpen(false)}>Cancelar</Button>
              <Button className="flex-1 gradient-primary border-0" onClick={save}>Cadastrar cliente</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
