import { ShieldCheck, Eye, Users, FileX } from "lucide-react";

const TIPS = [
  { icon: Eye, text: "Confirm specific identifying details before collecting any item." },
  { icon: FileX, text: "Never publish personal information such as phone numbers or addresses." },
  { icon: Users, text: "Use a teacher or the school office to exchange sensitive belongings." },
  { icon: ShieldCheck, text: "Never upload photos of IDs, documents, or other confidential papers." },
];

export default function SafetyTips() {
  return (
    <div className="glass-panel p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: "var(--grad-brand)", color: "#fff", boxShadow: "var(--shadow-glow)" }}
        >
          <ShieldCheck size={18} />
        </span>
        <div>
          <h3 className="text-base font-bold" style={{ color: "var(--color-text)" }}>
            Safe recovery tips
          </h3>
          <p className="text-xs" style={{ color: "var(--color-text-soft)" }}>
            Four rules that keep every hand-back honest.
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TIPS.map(({ icon: Icon, text }, i) => (
          <li
            key={i}
            className="glass-card flex items-start gap-3 p-4"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}
            >
              <Icon size={16} />
            </span>
            <div className="min-w-0">
              <span className="mb-1 block text-[0.68rem] font-bold tracking-[0.14em]" style={{ color: "var(--color-text-soft)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-snug" style={{ color: "var(--color-text)" }}>
                {text}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
