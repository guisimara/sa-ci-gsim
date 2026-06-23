import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, { label: string; cls: string }> = {
  disponivel: { label: "Disponível", cls: "bg-success-soft text-success" },
  reservado: { label: "Reservado", cls: "bg-info-soft text-info" },
  negociacao: { label: "Em negociação", cls: "bg-warning-soft text-warning" },
  vendido: { label: "Vendido", cls: "bg-primary-soft text-primary" },
  alugado: { label: "Alugado", cls: "bg-primary-soft text-primary" },
  inativo: { label: "Inativo", cls: "bg-muted text-muted-foreground" },
  pendente: { label: "Pendente", cls: "bg-warning-soft text-warning" },
  pago: { label: "Pago", cls: "bg-success-soft text-success" },
  vencido: { label: "Vencido", cls: "bg-destructive/10 text-destructive" },
  cancelado: { label: "Cancelado", cls: "bg-muted text-muted-foreground" },
  ativo: { label: "Ativo", cls: "bg-success-soft text-success" },
  encerrado: { label: "Encerrado", cls: "bg-muted text-muted-foreground" },
  renovado: { label: "Renovado", cls: "bg-info-soft text-info" },
  assinatura: { label: "Em assinatura", cls: "bg-warning-soft text-warning" },
  aguardando: { label: "Aguardando", cls: "bg-warning-soft text-warning" },
  assinado: { label: "Assinado", cls: "bg-success-soft text-success" },
  recusado: { label: "Recusado", cls: "bg-destructive/10 text-destructive" },
  alta: { label: "Alta", cls: "bg-destructive/10 text-destructive" },
  media: { label: "Média", cls: "bg-warning-soft text-warning" },
  baixa: { label: "Baixa", cls: "bg-success-soft text-success" },
};

export function StatusBadge({ status }: { status: string }) {
  const item = map[status] ?? { label: status, cls: "bg-muted text-muted-foreground" };
  return <Badge className={cn("border-0 font-medium", item.cls)}>{item.label}</Badge>;
}
