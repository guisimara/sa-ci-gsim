import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, CreditCard, FileText, ClipboardCheck, KeyRound, FolderOpen, MessageCircle, Building2, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const nav = [
  { to: "/cliente", label: "Início", icon: Home, end: true },
  { to: "/cliente/pagamentos", label: "Pagamentos", icon: CreditCard },
  { to: "/cliente/contrato", label: "Contrato", icon: FileText },
  { to: "/cliente/vistoria", label: "Vistoria", icon: ClipboardCheck },
  { to: "/cliente/locacao", label: "Acompanhamento", icon: KeyRound },
  { to: "/cliente/arquivos", label: "Arquivos", icon: FolderOpen },
  { to: "/cliente/suporte", label: "Suporte", icon: MessageCircle },
];

export default function ClienteLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center"><Building2 className="w-5 h-5 text-primary-foreground" /></div>
            <div><div className="font-bold">Imobiliária Souza</div><div className="text-xs text-muted-foreground">Área do cliente</div></div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted"><Bell className="w-5 h-5 text-muted-foreground" /></button>
            <Avatar><AvatarFallback className="bg-primary text-primary-foreground">BM</AvatarFallback></Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="md:sticky md:top-20 md:self-start">
          <nav className="bg-card rounded-2xl p-2 shadow-card flex md:flex-col gap-1 overflow-x-auto">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${isActive ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                <n.icon className="w-4 h-4" />{n.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/login" className="block text-xs text-muted-foreground hover:text-foreground mt-4 px-3">← Voltar ao login</Link>
        </aside>
        <main className="animate-fade-in min-w-0"><Outlet /></main>
      </div>
    </div>
  );
}
