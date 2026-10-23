import { PackageCheck } from "lucide-react";
import ReportForm from "../components/ReportForm";
import Reveal from "../components/Reveal";
import { POINTS } from "../utils/rewards";

export default function ReportFound() {
  return (
    <div className="container-page max-w-2xl py-10">
      <Reveal>
        <div className="mb-6 flex items-start gap-4">
          <span
            className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "var(--grad-gold)", color: "#3d2a05", boxShadow: "var(--shadow-gold)" }}
          >
            <PackageCheck size={22} />
          </span>
          <div>
            <p className="eyebrow mb-1">You found something</p>
            <h1 className="mb-2 text-3xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
              Report a <span className="text-gradient">found item</span>
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
              Posting a found item is how it gets back to the right hands. Keep one identifying detail
              private so you can confirm the real owner in person.
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-gold)" }}>
              +{POINTS.reportFound} honesty points · +{POINTS.foundReturned} when it is returned
            </p>
          </div>
        </div>
      </Reveal>
      <ReportForm type="found" />
    </div>
  );
}
