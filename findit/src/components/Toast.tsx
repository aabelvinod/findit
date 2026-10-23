import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToast } from "../hooks/useToast";

const ICONS = {
  success: <CheckCircle2 size={18} style={{ color: "var(--color-success)" }} />,
  error: <AlertCircle size={18} style={{ color: "var(--color-danger)" }} />,
  info: <Info size={18} style={{ color: "var(--color-primary)" }} />,
};

const ACCENTS: Record<keyof typeof ICONS, string> = {
  success: "var(--color-success)",
  error: "var(--color-danger)",
  info: "var(--color-primary)",
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex w-[min(380px,calc(100vw-2.5rem))] flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass-modal anim-toast-in flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm"
          style={{
            color: "var(--color-text)",
            borderLeft: `3px solid ${ACCENTS[toast.kind]}`,
            boxShadow: `0 18px 40px -18px color-mix(in srgb, ${ACCENTS[toast.kind]} 55%, transparent), var(--shadow-sm)`,
          }}
        >
          <span className="mt-px shrink-0">{ICONS[toast.kind]}</span>
          <p className="flex-1 leading-snug">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 opacity-60 transition hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
