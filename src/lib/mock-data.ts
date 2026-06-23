// Mock data — em PT-BR. Reset ao recarregar (Fase 1, sem backend).

export type PropertyStatus = "disponivel" | "reservado" | "negociacao" | "vendido" | "alugado" | "inativo";
export type PropertyPurpose = "venda" | "locacao" | "venda_locacao";
export type PropertyType = "apartamento" | "casa" | "terreno" | "comercial" | "galpao" | "chacara" | "cobertura" | "studio";

export interface Property {
  id: string;
  code: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  status: PropertyStatus;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  area: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking: number;
  salePrice?: number;
  rentPrice?: number;
  condoFee?: number;
  iptu?: number;
  commission: number;
  owner: string;
  broker: string;
  description: string;
  features: string[];
  photo: string;
  featured: boolean;
  leads: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyInterest?: string;
  source: "Instagram" | "Facebook" | "Anúncio" | "Indicação" | "Site" | "WhatsApp" | "Outros";
  referredBy?: string;
  notes: string;
  priority: "alta" | "media" | "baixa";
  stageId: string;
  broker: string;
  nextTask?: string;
  nextTaskDate?: string;
  status: "ativo" | "ganho" | "perdido" | "pausado";
}

export interface CrmStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  type: "locatario" | "comprador" | "proprietario" | "fiador" | "investidor";
}

export interface Contract {
  id: string;
  clientId: string;
  clientName: string;
  propertyId: string;
  propertyTitle: string;
  broker: string;
  startDate: string;
  endDate: string;
  totalMonths: number;
  mandatoryMonths: number;
  penalty: number;
  status: "ativo" | "encerrado" | "renovado" | "assinatura";
  monthlyValue: number;
}

export interface Payment {
  id: string;
  type: "aluguel" | "condominio" | "iptu" | "consumo" | "comissao" | "repasse" | "taxa" | "outros";
  payer: string;
  beneficiary?: string;
  propertyTitle: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "pendente" | "pago" | "vencido" | "cancelado";
}

export interface Inspection {
  id: string;
  clientName: string;
  propertyTitle: string;
  contractId: string;
  type: "entrada" | "saida" | "manutencao";
  status: "aguardando" | "assinado" | "recusado";
  createdAt: string;
}

const PHOTO = (seed: number) =>
  `https://images.unsplash.com/photo-${["1568605114967-8130f3a36994","1502672260266-1c1ef2d93688","1512917774080-9991f1c4c750","1505691938895-1758d7feb511","1564013799919-ab600027ffc6","1600585154340-be6161a56a0c","1600596542815-ffad4c1539a9","1613490493576-7fde63acd811"][seed % 8]}?w=800&q=80&auto=format`;

export const properties: Property[] = [
  { id: "p1", code: "AP-0142", title: "Apartamento Vista Mar 3 quartos", type: "apartamento", purpose: "venda", status: "disponivel", address: "Av. Boa Viagem, 4500", neighborhood: "Boa Viagem", city: "Recife", state: "PE", area: 120, bedrooms: 3, suites: 1, bathrooms: 2, parking: 2, salePrice: 890000, condoFee: 1200, iptu: 240, commission: 5, owner: "Carlos Mendes", broker: "Ana Souza", description: "Lindo apartamento com vista panorâmica para o mar.", features: ["Vista mar", "Lazer completo", "Reformado"], photo: PHOTO(0), featured: true, leads: 24 },
  { id: "p2", code: "CA-0089", title: "Casa em condomínio fechado", type: "casa", purpose: "venda_locacao", status: "disponivel", address: "Rua das Palmeiras, 230", neighborhood: "Aldeia", city: "Camaragibe", state: "PE", area: 280, bedrooms: 4, suites: 2, bathrooms: 4, parking: 4, salePrice: 1450000, rentPrice: 7800, condoFee: 850, iptu: 320, commission: 6, owner: "Marta Lima", broker: "Ana Souza", description: "Casa espaçosa em condomínio com segurança 24h.", features: ["Piscina", "Churrasqueira", "Condomínio fechado"], photo: PHOTO(1), featured: true, leads: 18 },
  { id: "p3", code: "AP-0156", title: "Studio mobiliado próximo metrô", type: "studio", purpose: "locacao", status: "alugado", address: "Rua do Hospício, 120", neighborhood: "Boa Vista", city: "Recife", state: "PE", area: 38, bedrooms: 0, suites: 0, bathrooms: 1, parking: 1, rentPrice: 2200, condoFee: 480, iptu: 90, commission: 8, owner: "João Pereira", broker: "Roberto Lima", description: "Studio compacto e funcional, totalmente mobiliado.", features: ["Mobiliado", "Próximo metrô"], photo: PHOTO(2), featured: false, leads: 9 },
  { id: "p4", code: "SC-0023", title: "Sala comercial corporativa", type: "comercial", purpose: "locacao", status: "disponivel", address: "Av. Conselheiro Aguiar, 2700", neighborhood: "Pina", city: "Recife", state: "PE", area: 65, bedrooms: 0, suites: 0, bathrooms: 2, parking: 1, rentPrice: 4500, condoFee: 950, iptu: 180, commission: 10, owner: "Construtora Edify", broker: "Ana Souza", description: "Sala em edifício corporativo de alto padrão.", features: ["Recepção", "Estacionamento", "Ar central"], photo: PHOTO(3), featured: false, leads: 6 },
  { id: "p5", code: "CO-0011", title: "Cobertura duplex 4 suítes", type: "cobertura", purpose: "venda", status: "negociacao", address: "Rua Setúbal, 1850", neighborhood: "Boa Viagem", city: "Recife", state: "PE", area: 320, bedrooms: 4, suites: 4, bathrooms: 5, parking: 4, salePrice: 3200000, condoFee: 2400, iptu: 680, commission: 4, owner: "Família Andrade", broker: "Ana Souza", description: "Cobertura exclusiva com piscina privativa.", features: ["Piscina privativa", "Vista 360°", "Alto padrão"], photo: PHOTO(4), featured: true, leads: 32 },
  { id: "p6", code: "AP-0167", title: "Apartamento 2 quartos reformado", type: "apartamento", purpose: "locacao", status: "disponivel", address: "Rua Bruno Veloso, 480", neighborhood: "Boa Viagem", city: "Recife", state: "PE", area: 72, bedrooms: 2, suites: 1, bathrooms: 2, parking: 1, rentPrice: 2800, condoFee: 620, iptu: 140, commission: 8, owner: "Helena Costa", broker: "Roberto Lima", description: "Apartamento reformado com acabamento moderno.", features: ["Reformado", "Andar alto"], photo: PHOTO(5), featured: false, leads: 12 },
];

export const crmStages: CrmStage[] = [
  { id: "s1", name: "Primeiro contato", order: 1, color: "info" },
  { id: "s2", name: "Segundo contato", order: 2, color: "info" },
  { id: "s3", name: "Terceiro contato", order: 3, color: "info" },
  { id: "s4", name: "Proposta enviada", order: 4, color: "warning" },
  { id: "s5", name: "Em análise", order: 5, color: "warning" },
  { id: "s6", name: "Assinatura", order: 6, color: "primary" },
  { id: "s7", name: "Cliente", order: 7, color: "success" },
];

export const leads: Lead[] = [
  { id: "l1", name: "Mariana Alves", email: "mari@email.com", phone: "(81) 99999-1010", propertyInterest: "AP-0142", source: "Instagram", notes: "Quer visitar no sábado.", priority: "alta", stageId: "s1", broker: "Ana Souza", nextTask: "Confirmar visita", nextTaskDate: "2025-01-22", status: "ativo" },
  { id: "l2", name: "Pedro Henrique", email: "ph@email.com", phone: "(81) 98888-2020", propertyInterest: "CA-0089", source: "Site", notes: "Pré-aprovado financiamento.", priority: "alta", stageId: "s2", broker: "Ana Souza", nextTask: "Enviar documentos", nextTaskDate: "2025-01-23", status: "ativo" },
  { id: "l3", name: "Júlia Ramos", email: "ju@email.com", phone: "(81) 97777-3030", propertyInterest: "AP-0156", source: "Indicação", referredBy: "Carlos M.", notes: "Mudança em fevereiro.", priority: "media", stageId: "s3", broker: "Roberto Lima", status: "ativo" },
  { id: "l4", name: "Felipe Castro", email: "felipe@email.com", phone: "(81) 96666-4040", propertyInterest: "CO-0011", source: "Facebook", notes: "Proposta de R$ 3.0M enviada.", priority: "alta", stageId: "s4", broker: "Ana Souza", status: "ativo" },
  { id: "l5", name: "Sandra Oliveira", email: "sandra@email.com", phone: "(81) 95555-5050", propertyInterest: "SC-0023", source: "Anúncio", notes: "Analisando contrato.", priority: "media", stageId: "s5", broker: "Ana Souza", status: "ativo" },
  { id: "l6", name: "Rafael Souza", email: "rafa@email.com", phone: "(81) 94444-6060", propertyInterest: "AP-0167", source: "WhatsApp", notes: "Assinatura agendada.", priority: "alta", stageId: "s6", broker: "Roberto Lima", status: "ativo" },
  { id: "l7", name: "Beatriz Mota", email: "bia@email.com", phone: "(81) 93333-7070", propertyInterest: "AP-0156", source: "Site", notes: "Cliente ativa.", priority: "baixa", stageId: "s7", broker: "Roberto Lima", status: "ganho" },
];

export const clients: Client[] = [
  { id: "c1", name: "Beatriz Mota", email: "bia@email.com", cpf: "123.456.789-00", phone: "(81) 93333-7070", address: "Rua do Hospício, 120", type: "locatario" },
  { id: "c2", name: "Carlos Mendes", email: "carlos@email.com", cpf: "987.654.321-00", phone: "(81) 92222-8080", address: "Av. Boa Viagem, 4500", type: "proprietario" },
  { id: "c3", name: "Marta Lima", email: "marta@email.com", cpf: "456.789.123-00", phone: "(81) 91111-9090", address: "Rua das Palmeiras, 230", type: "proprietario" },
  { id: "c4", name: "Helena Costa", email: "helena@email.com", cpf: "321.654.987-00", phone: "(81) 90000-1111", address: "Rua Bruno Veloso, 480", type: "proprietario" },
];

export const contracts: Contract[] = [
  { id: "ct1", clientId: "c1", clientName: "Beatriz Mota", propertyId: "p3", propertyTitle: "Studio mobiliado próximo metrô", broker: "Roberto Lima", startDate: "2024-04-01", endDate: "2026-04-01", totalMonths: 24, mandatoryMonths: 18, penalty: 3, status: "ativo", monthlyValue: 2200 },
  { id: "ct2", clientId: "c1", clientName: "Diego Ramos", propertyId: "p6", propertyTitle: "Apartamento 2 quartos reformado", broker: "Roberto Lima", startDate: "2023-09-15", endDate: "2025-09-15", totalMonths: 24, mandatoryMonths: 12, penalty: 3, status: "ativo", monthlyValue: 2800 },
  { id: "ct3", clientId: "c1", clientName: "Empresa Acme Ltda", propertyId: "p4", propertyTitle: "Sala comercial corporativa", broker: "Ana Souza", startDate: "2024-11-01", endDate: "2027-11-01", totalMonths: 36, mandatoryMonths: 24, penalty: 6, status: "ativo", monthlyValue: 4500 },
];

export const payments: Payment[] = [
  { id: "pm1", type: "aluguel", payer: "Beatriz Mota", propertyTitle: "Studio mobiliado próximo metrô", amount: 2200, dueDate: "2025-02-05", status: "pendente" },
  { id: "pm2", type: "condominio", payer: "Beatriz Mota", propertyTitle: "Studio mobiliado próximo metrô", amount: 480, dueDate: "2025-02-10", status: "pendente" },
  { id: "pm3", type: "aluguel", payer: "Diego Ramos", propertyTitle: "Apartamento 2 quartos reformado", amount: 2800, dueDate: "2025-01-15", paidDate: "2025-01-14", status: "pago" },
  { id: "pm4", type: "iptu", payer: "Carlos Mendes", propertyTitle: "Apartamento Vista Mar", amount: 240, dueDate: "2025-01-10", status: "vencido" },
  { id: "pm5", type: "comissao", payer: "Corretor360", beneficiary: "Ana Souza", propertyTitle: "Cobertura duplex 4 suítes", amount: 12800, dueDate: "2025-02-20", status: "pendente" },
  { id: "pm6", type: "repasse", payer: "Corretor360", beneficiary: "Helena Costa", propertyTitle: "Apartamento 2 quartos reformado", amount: 2520, dueDate: "2025-02-08", status: "pendente" },
];

export const inspections: Inspection[] = [
  { id: "in1", clientName: "Beatriz Mota", propertyTitle: "Studio mobiliado próximo metrô", contractId: "ct1", type: "entrada", status: "assinado", createdAt: "2024-04-01" },
  { id: "in2", clientName: "Diego Ramos", propertyTitle: "Apartamento 2 quartos reformado", contractId: "ct2", type: "manutencao", status: "aguardando", createdAt: "2025-01-18" },
];

export const team = [
  { id: "u1", name: "Ana Souza", role: "Corretora Sênior", email: "ana@corretor360.com", deals: 12, revenue: 84000, avatar: "AS" },
  { id: "u2", name: "Roberto Lima", role: "Corretor", email: "roberto@corretor360.com", deals: 8, revenue: 52000, avatar: "RL" },
  { id: "u3", name: "Patrícia Gomes", role: "Financeiro", email: "patricia@corretor360.com", deals: 0, revenue: 0, avatar: "PG" },
];

export const leadsBySource = [
  { name: "Instagram", value: 38, color: "hsl(258 78% 60%)" },
  { name: "Site", value: 26, color: "hsl(218 90% 58%)" },
  { name: "Indicação", value: 18, color: "hsl(152 62% 42%)" },
  { name: "Facebook", value: 12, color: "hsl(28 95% 55%)" },
  { name: "WhatsApp", value: 14, color: "hsl(168 70% 45%)" },
  { name: "Outros", value: 6, color: "hsl(232 12% 60%)" },
];

export const monthlyRevenue = [
  { month: "Ago", value: 28500 },
  { month: "Set", value: 32400 },
  { month: "Out", value: 41200 },
  { month: "Nov", value: 38800 },
  { month: "Dez", value: 52100 },
  { month: "Jan", value: 47600 },
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("pt-BR");
