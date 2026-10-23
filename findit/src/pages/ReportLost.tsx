import { Compass } from "lucide-react";
import ReportForm from "../components/ReportForm";
import Reveal from "../components/Reveal";
import { POINTS } from "../utils/rewards";

export default function ReportLost() {
  return (
    <div className="container-page max-w-2xl py-10">
      <Reveal>
        <div className="mb-6 flex items-start gap-4">
          <span
            className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--grad-brand)", boxShadow: "var(--shadow-glow)" }}
          >
            <Compass size={22} />
          </span>
          <div>
            <p className="eyebrow mb-1">Lost something</p>
            <h1 className="mb-2 text-3xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
              Report a <span className="text-gradient">lost item</span>
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
              Share details about what you lost so the community can help you find it. Avoid including
              personal contact details — recovery should go through a teacher or the school office.
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
              +{POINTS.reportLost} honesty points for reporting · +{POINTS.lostRecovered} more when it comes home
            </p>
          </div>
        </div>
      </Reveal>
      <ReportForm type="lost" />
    </div>
  );
}
