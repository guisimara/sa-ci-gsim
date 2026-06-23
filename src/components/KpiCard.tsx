import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  hint?: string;
  trend?: { value: string; up: boolean };
  accent?: "primary" | "success" | "warning" | "info" | "destructive";
}

const accentMap = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  destructive: "bg-destructive/10 text-destructive",
};

export function KpiCard({ label, value, icon, hint, trend, accent = "primary" }: KpiCardProps) {
  return (
    <Card className="p-5 shadow-card border-border/60 hover:shadow-lg-custom transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", accentMap[accent])}>
          {icon}
        </div>
        {trend && (
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", trend.up ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive")}>
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      {hint && <div className="text-xs text-muted-foreground/70 mt-2">{hint}</div>}
    </Card>
  );
}
