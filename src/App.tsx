import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import AppLayout from "./layouts/AppLayout";
import ClienteLayout from "./layouts/ClienteLayout";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Imoveis from "./pages/Imoveis";
import Site from "./pages/Site";
import SitePublic from "./pages/SitePublic";
import CRM from "./pages/CRM";
import Clientes from "./pages/Clientes";
import Locacoes from "./pages/Locacoes";
import Pagamentos from "./pages/Pagamentos";
import Contratos from "./pages/Contratos";
import Vistorias from "./pages/Vistorias";
import Financeiro from "./pages/Financeiro";
import Equipe from "./pages/Equipe";
import IA from "./pages/IA";
import Configuracoes from "./pages/Configuracoes";
import {
  ClienteHome, ClientePagamentos, ClienteContrato, ClienteVistoria,
  ClienteLocacao, ClienteArquivos, ClienteSuporte,
} from "./pages/cliente/ClientePages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/site/:slug" element={<SitePublic />} />

          {/* App (corretor) */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/imoveis" element={<Imoveis />} />
            <Route path="/site" element={<Site />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/locacoes" element={<Locacoes />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/contratos" element={<Contratos />} />
            <Route path="/vistorias" element={<Vistorias />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/ia" element={<IA />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>

          {/* Área do cliente */}
          <Route path="/cliente" element={<ClienteLayout />}>
            <Route index element={<ClienteHome />} />
            <Route path="pagamentos" element={<ClientePagamentos />} />
            <Route path="contrato" element={<ClienteContrato />} />
            <Route path="vistoria" element={<ClienteVistoria />} />
            <Route path="locacao" element={<ClienteLocacao />} />
            <Route path="arquivos" element={<ClienteArquivos />} />
            <Route path="suporte" element={<ClienteSuporte />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
