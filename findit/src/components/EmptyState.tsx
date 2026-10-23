import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-3 border-dashed py-16 px-6 text-center">
      <div
        className="anim-float flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}
      >
        {icon || <SearchX size={28} />}
      </div>
      <h3 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
        {title}
      </h3>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
