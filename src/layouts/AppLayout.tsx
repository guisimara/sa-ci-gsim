import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Globe, Kanban, Users, KeyRound,
  CreditCard, FileText, ClipboardCheck, TrendingUp, UserCog,
  Sparkles, Settings, LogOut, Search, Plus, Bell, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/imoveis", label: "Imóveis", icon: Building2 },
  { to: "/site", label: "Site / Portfólio", icon: Globe },
  { to: "/crm", label: "CRM", icon: Kanban },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/locacoes", label: "Locações", icon: KeyRound },
  { to: "/pagamentos", label: "Pagamentos", icon: CreditCard },
  { to: "/contratos", label: "Contratos", icon: FileText },
  { to: "/vistorias", label: "Vistorias", icon: ClipboardCheck },
  { to: "/financeiro", label: "Financeiro", icon: TrendingUp },
  { to: "/equipe", label: "Corretores / Equipe", icon: UserCog },
  { to: "/ia", label: "IA e Conteúdo", icon: Sparkles },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function AppLayout() {
  const { pathname } = useLocation();
  const current = nav.find((n) => pathname.startsWith(n.to))?.label ?? "Dashboard";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col gradient-sidebar text-sidebar-foreground sticky top-0 h-screen">
        <div className="px-6 py-6 flex items-center gap-2 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sidebar-accent-foreground font-bold text-lg leading-none">Corretor<span className="text-primary-glow">360</span></div>
            <div className="text-xs text-sidebar-foreground/60 mt-0.5">Plano Pro</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-sidebar-border">
          <NavLink to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="w-4 h-4" /> Sair
          </NavLink>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border h-16 flex items-center px-6 gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar imóveis, leads, clientes..." className="pl-9 bg-muted/50 border-transparent" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <span className="hidden sm:inline">Imobiliária Souza</span>
                <Badge variant="secondary" className="bg-primary-soft text-primary border-0">Matriz</Badge>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Organizações</DropdownMenuLabel>
              <DropdownMenuItem>Imobiliária Souza (Matriz)</DropdownMenuItem>
              <DropdownMenuItem>Filial Recife Sul</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Criar organização</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="gradient-primary shadow-glow gap-2 border-0">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Criar</span>
          </Button>

          <button className="relative p-2 rounded-lg hover:bg-muted">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>

          <Avatar className="w-9 h-9 ring-2 ring-primary-soft">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">AS</AvatarFallback>
          </Avatar>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          <div className="mb-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">{current}</div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
