import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  icon: ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ icon, title, description, ctaLabel, onCta }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
      {ctaLabel && (
        <Button className="mt-5 gradient-primary border-0 shadow-glow" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
