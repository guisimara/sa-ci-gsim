import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { properties as seedProperties, units, Property } from "@/lib/mock-data";

export type NotificationType = "support" | "payment" | "lead" | "contract" | "signature";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

interface AppContextType {
  // Unit filter
  selectedUnit: string | null; // null = Matriz (todas)
  setSelectedUnit: (id: string | null) => void;
  unitName: string;

  // Properties (shared state so Imoveis + ImovelDetalhe sync)
  properties: Property[];
  addProperty: (p: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: AppNotification) => void;
}

const AppContext = createContext<AppContextType>(null!);

const initialNotifications: AppNotification[] = [
  {
    id: "n1", type: "support",
    title: "Suporte solicitado",
    message: "Beatriz Mota abriu uma solicitação de suporte na Central do Cliente.",
    time: "5 min atrás", read: false, link: "/cliente",
  },
  {
    id: "n2", type: "payment",
    title: "Pagamento via Pix recebido",
    message: "Aluguel de R$ 2.200 referente ao Studio Boa Vista foi confirmado via Pix.",
    time: "20 min atrás", read: false, link: "/pagamentos",
  },
  {
    id: "n3", type: "lead",
    title: "Novo lead do site",
    message: "Carlos Henrique entrou em contato via formulário do site sobre AP-0142.",
    time: "1h atrás", read: false, link: "/crm",
  },
  {
    id: "n4", type: "contract",
    title: "Contrato vencendo em breve",
    message: "Contrato de Diego Ramos vence em 28 dias — Apto 2 quartos reformado.",
    time: "2h atrás", read: true, link: "/contratos",
  },
  {
    id: "n5", type: "signature",
    title: "Aguardando assinatura",
    message: "Empresa Acme Ltda ainda não assinou o contrato da Sala Comercial.",
    time: "1 dia atrás", read: true, link: "/contratos",
  },
];

const notifIcons: Record<NotificationType, string> = {
  support: "🎧",
  payment: "💰",
  lead: "📩",
  contract: "⏳",
  signature: "✍️",
};

export const getNotifIcon = (type: NotificationType) => notifIcons[type];

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedUnit, setSelectedUnitState] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const setSelectedUnit = useCallback((id: string | null) => setSelectedUnitState(id), []);

  const addProperty = useCallback((p: Property) => {
    setProperties((prev) => [p, ...prev]);
  }, []);

  const updateProperty = useCallback((id: string, updates: Partial<Property>) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback((n: AppNotification) => {
    setNotifications((prev) => [n, ...prev]);
  }, []);

  const unitName = selectedUnit
    ? (units.find((u) => u.id === selectedUnit)?.name ?? "Unidade")
    : "Matriz (Todas)";

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        selectedUnit, setSelectedUnit, unitName,
        properties, addProperty, updateProperty,
        notifications, unreadCount, markAsRead, markAllAsRead, addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
