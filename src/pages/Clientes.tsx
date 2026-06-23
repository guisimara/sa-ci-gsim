import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Mail, Phone } from "lucide-react";
import { clients } from "@/lib/mock-data";

const typeColor: Record<string, string> = {
  locatario: "bg-info-soft text-info",
  proprietario: "bg-primary-soft text-primary",
  comprador: "bg-success-soft text-success",
  fiador: "bg-warning-soft text-warning",
  investidor: "bg-accent text-accent-foreground",
};

export default function Clientes() {
  return (
    <>
      <PageHeader title="Clientes" description={`${clients.length} clientes cadastrados`}>
        <Button className="gradient-primary border-0 shadow-glow gap-2"><Plus className="w-4 h-4" />Novo cliente</Button>
      </PageHeader>

      <Card className="p-4 mb-6 shadow-card">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome, CPF ou e-mail..." className="pl-9" />
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
            {clients.map((c) => (
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
    </>
  );
}
