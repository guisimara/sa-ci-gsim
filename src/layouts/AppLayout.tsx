import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, Globe, Kanban, Users, KeyRound,
  CreditCard, FileText, ClipboardCheck, TrendingUp, UserCog,
  Sparkles, Settings, LogOut, Search, Plus, Bell, ChevronDown,
  CheckSquare, ExternalLink, Home, User, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp, getNotifIcon } from "@/context/AppContext";
import { units } from "@/lib/mock-data";
import { properties, leads, clients } from "@/lib/mock-data";

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
  { to: "/tarefas", label: "Tarefas", icon: CheckSquare },
  { to: "/equipe", label: "Corretores / Equipe", icon: UserCog },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

const SEARCH_ITEMS = [
  ...properties.map((p) => ({ type: "Imóvel", label: p.title, sub: p.code, to: `/imoveis/${p.id}` })),
  ...clients.map((c) => ({ type: "Cliente", label: c.name, sub: c.email, to: "/clientes" })),
  ...leads.map((l) => ({ type: "Lead", label: l.name, sub: l.phone, to: "/crm" })),
];

export default function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { selectedUnit, setSelectedUnit, unitName, notifications, unreadCount, markAsRead, markAllAsRead } = useApp();

  const current = nav.find((n) => pathname.startsWith(n.to))?.label ?? "Dashboard";

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [orgSheetOpen, setOrgSheetOpen] = useState(false);
  const [orgForm, setOrgForm] = useState({ name: "", city: "" });

  const searchResults = searchQ.length > 1
    ? SEARCH_ITEMS.filter((i) =>
        i.label.toLowerCase().includes(searchQ.toLowerCase()) ||
        i.sub.toLowerCase().includes(searchQ.toLowerCase())
      ).slice(0, 8)
    : [];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col gradient-sidebar text-sidebar-foreground sticky top-0 h-screen">
        <div className="px-6 py-6 flex items-center gap-2 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sidebar-accent-foreground font-bold text-lg leading-none">
              Corretor<span className="text-primary-glow">360</span>
            </div>
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
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
          <NavLink
            to="/cliente"
            className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">Central do Cliente</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </NavLink>
          <NavLink
            to="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="w-4 h-4" /> Sair
          </NavLink>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar — full width */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border h-16 flex items-center px-6 gap-3 w-full">
          {/* Search — grows to fill space */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar imóveis, leads, clientes..."
              className="pl-9 bg-muted/50 border-transparent cursor-pointer w-full"
              readOnly
              onClick={() => { setSearchOpen(true); setSearchQ(""); }}
            />
          </div>

          {/* Unidade / Org dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
                <span className="hidden sm:inline text-sm">{unitName}</span>
                <Badge variant="secondary" className="bg-primary-soft text-primary border-0">
                  {selectedUnit ? "Filial" : "Matriz"}
                </Badge>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Unidades</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setSelectedUnit(null)}
                className={!selectedUnit ? "bg-primary-soft text-primary font-medium" : ""}
              >
                {!selectedUnit && <Check className="w-4 h-4 mr-2" />}
                Matriz (Todas)
              </DropdownMenuItem>
              {units.map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => setSelectedUnit(u.id)}
                  className={selectedUnit === u.id ? "bg-primary-soft text-primary font-medium" : ""}
                >
                  {selectedUnit === u.id && <Check className="w-4 h-4 mr-2" />}
                  {u.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOrgSheetOpen(true)}
                className="text-primary font-medium"
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar unidade
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* + Criar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gradient-primary shadow-glow gap-2 border-0 whitespace-nowrap">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Criar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Novo</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate("/imoveis?create=true")}>
                <Building2 className="w-4 h-4 mr-2" /> Imóvel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/clientes")}>
                <Users className="w-4 h-4 mr-2" /> Cliente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/contratos")}>
                <FileText className="w-4 h-4 mr-2" /> Contrato
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/tarefas?create=true")}>
                <CheckSquare className="w-4 h-4 mr-2" /> Tarefa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notificações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-lg hover:bg-muted flex-shrink-0">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold text-sm">Notificações</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
              <ScrollArea className="max-h-[360px]">
                {notifications.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nenhuma notificação
                  </p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.link) navigate(n.link);
                      }}
                      className={`w-full flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 text-left transition-colors ${
                        !n.read ? "bg-primary-soft/30" : ""
                      }`}
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{getNotifIcon(n.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {n.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.message}
                        </div>
                        <div className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</div>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      )}
                    </button>
                  ))
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Avatar + Perfil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex-shrink-0">
                <Avatar className="w-9 h-9 ring-2 ring-primary-soft cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">AS</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-3 py-2 border-b border-border">
                <div className="font-semibold text-sm">Ana Souza</div>
                <div className="text-xs text-muted-foreground">ana@corretor360.com</div>
              </div>
              <DropdownMenuItem onClick={() => navigate("/configuracoes")}>
                <User className="w-4 h-4 mr-2" /> Acessar perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/contratos")}>
                <FileText className="w-4 h-4 mr-2" /> Meus contratos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/configuracoes")}>
                <Settings className="w-4 h-4 mr-2" /> Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/login")} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in">
          <div className="mb-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {current}
            {selectedUnit && (
              <span className="ml-2 text-primary">
                · {unitName}
              </span>
            )}
          </div>
          <Outlet />
        </main>
      </div>

      {/* Dialog de busca global */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[560px] p-0 gap-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Busca global</DialogTitle>
          </DialogHeader>
          <div className="relative border-b border-border">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              placeholder="Buscar imóveis, leads, clientes..."
              className="w-full pl-11 pr-4 py-4 text-sm bg-transparent outline-none"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </div>
          <div className="max-h-80 overflow-y-auto">
            {searchQ.length <= 1 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                Digite para buscar...
              </p>
            )}
            {searchQ.length > 1 && searchResults.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                Nenhum resultado encontrado
              </p>
            )}
            {searchResults.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left transition-colors"
                onClick={() => { navigate(item.to); setSearchOpen(false); setSearchQ(""); }}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-soft text-primary min-w-[52px] text-center">
                  {item.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{item.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sheet — Adicionar unidade */}
      <Sheet open={orgSheetOpen} onOpenChange={setOrgSheetOpen}>
        <SheetContent className="w-[400px] sm:max-w-[400px]">
          <SheetHeader>
            <SheetTitle>Adicionar Unidade</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 mt-6">
            <div className="space-y-2">
              <Label>Nome da unidade *</Label>
              <Input
                placeholder="Ex: Filial Recife Norte"
                value={orgForm.name}
                onChange={(e) => setOrgForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                placeholder="Recife"
                value={orgForm.city}
                onChange={(e) => setOrgForm((f) => ({ ...f, city: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 gradient-primary border-0 shadow-glow"
                onClick={() => { setOrgSheetOpen(false); setOrgForm({ name: "", city: "" }); }}
              >
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setOrgSheetOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
