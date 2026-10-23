import { useEffect, useMemo, useRef, useState } from "react";
import { X, MapPin, CalendarDays, Hash, ShieldCheck, Sparkles, Info, Gem, Palette, CheckCircle2 } from "lucide-react";
import type { Report } from "../types";
import StatusBadge from "./StatusBadge";
import { getCategoryIcon } from "../utils/categoryIcons";
import { findPossibleMatches } from "../utils/matching";
import { isValuable, POINTS } from "../utils/rewards";
import { useReports } from "../hooks/useReports";
import { useToast } from "../hooks/useToast";
import { sanitizeText, truncate } from "../utils/validation";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

interface ItemModalProps {
  report: Report;
  onClose: () => void;
  onSelectReport?: (report: Report) => void;
}

export default function ItemModal({ report, onClose, onSelectReport }: ItemModalProps) {
  const { reports, addClaim } = useReports();
  const { showToast } = useToast();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [claimText, setClaimText] = useState("");
  const [claimSent, setClaimSent] = useState(false);
  const Icon = getCategoryIcon(report.category);

  const matches = useMemo(
    () => findPossibleMatches(report, reports, 3),
    // Only recompute when the viewed report or the stored reports change.
    [report.id, reports]
  );

  const sensitiveCategory = report.category === "Keys & Personal Items";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function submitClaim(e: React.FormEvent) {
    e.preventDefault();
    const clean = sanitizeText(claimText);
    if (clean.length < 5) {
      showToast("Please describe an identifying detail (at least 5 characters).", "error");
      return;
    }
    addClaim(report.id, truncate(clean, 300));
    setClaimSent(true);
    showToast("Your claim was saved. Please follow up with school staff.", "success");
  }

  return (
    <div
      className="scrim fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{ animation: "fade-in 0.2s ease both" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        tabIndex={-1}
        className="glass-modal flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden outline-none"
        style={{ animation: "pop-in 0.32s var(--ease-spring) both" }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge report={report} />
            {isValuable(report) && (
              <span className="badge badge-valuable">
                <Gem size={11} /> Valuable
              </span>
            )}
            {report.isSample && <span className="badge badge-demo">Demo</span>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close details" className="icon-btn">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <div
            className="mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl"
            style={{ background: "var(--grad-brand-soft)" }}
          >
            {report.image ? (
              <img src={report.image} alt={report.title} className="h-full w-full object-cover" width={560} height={192} decoding="async" />
            ) : (
              <Icon size={54} className="anim-float opacity-45" />
            )}
          </div>

          <h2 id="item-modal-title" className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
            {report.title}
          </h2>
          <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
            {report.category}
          </p>

          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
            {report.description}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2" style={{ color: "var(--color-text-soft)" }}>
            <span className="glass-panel flex items-center gap-2 px-3 py-2">
              <MapPin size={15} style={{ color: "var(--color-primary)" }} /> {report.location}
            </span>
            <span className="glass-panel flex items-center gap-2 px-3 py-2">
              <CalendarDays size={15} style={{ color: "var(--color-primary)" }} /> {report.type === "lost" ? "Lost" : "Found"} on {formatDate(report.eventDate)}
            </span>
            <span className="glass-panel flex items-center gap-2 px-3 py-2">
              <Hash size={15} style={{ color: "var(--color-primary)" }} /> Report ID: {report.id}
            </span>
            {report.color && (
              <span className="glass-panel flex items-center gap-2 px-3 py-2">
                <Palette size={15} style={{ color: "var(--color-primary)" }} /> {report.color}
              </span>
            )}
            {report.type === "found" && (
              <span className="glass-panel flex items-center gap-2 px-3 py-2">
                <ShieldCheck size={15} style={{ color: "var(--color-primary)" }} />
                {report.handedToStaff ? "Handed to school staff" : "Still with the finder"}
              </span>
            )}
          </div>

          {report.instructions && (
            <div className="glass-panel mt-4 flex gap-2 p-3 text-sm" style={{ color: "var(--color-text)" }}>
              <ShieldCheck size={18} className="mt-0.5 shrink-0" style={{ color: "var(--color-primary)" }} />
              <p>{report.instructions}</p>
            </div>
          )}

          {sensitiveCategory && (
            <div className="mt-3 flex gap-2 rounded-xl p-3 text-sm" style={{ background: "var(--color-warning-soft)", color: "var(--color-text)" }}>
              <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--color-warning)" }} />
              <p>This is a sensitive item. Please coordinate recovery through a teacher or the school office.</p>
            </div>
          )}

          {/* Possible matches */}
          <div className="mt-6">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              <Sparkles size={15} style={{ color: "var(--color-primary)" }} /> Possible matches
            </h3>
            {matches.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-text-soft)" }}>
                No possible matches yet. Check back later as more reports are added.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {matches.map((m) => (
                  <li key={m.report.id} className="glass-card p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        className="font-medium underline-offset-2 hover:underline"
                        style={{ color: "var(--color-primary)" }}
                        onClick={() => onSelectReport?.(m.report)}
                      >
                        {m.report.title}
                      </button>
                      <span
                        className="badge"
                        style={{
                          background: m.label === "Strong" ? "var(--color-success-soft)" : "var(--color-warning-soft)",
                          color: m.label === "Strong" ? "var(--color-success)" : "var(--color-warning)",
                        }}
                      >
                        {m.label} · {m.score}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs" style={{ color: "var(--color-text-soft)" }}>
                      {m.reasons.join(" • ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs" style={{ color: "var(--color-text-soft)" }}>
              This is only a suggestion based on category, keywords, location, and dates — not a verified match. Always confirm identifying details in person.
            </p>
          </div>

          {/* Claim form, only relevant for found items that are still active */}
          {report.type === "found" && report.status === "active" && (
            <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--color-border)" }}>
              <h3 className="mb-1 text-base font-semibold" style={{ color: "var(--color-text)" }}>
                I think this is mine
              </h3>
              <p className="mb-3 text-xs" style={{ color: "var(--color-text-soft)" }}>
                Describe something only the real owner would know. Submitting a claim earns {POINTS.claim} honesty points.
              </p>
              {claimSent ? (
                <p className="glass-panel flex items-start gap-2 p-3 text-sm" style={{ color: "var(--color-success)" }}>
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                  <span>Your claim has been saved locally. Please visit the school office or a teacher with identifying details to arrange recovery.</span>
                </p>
              ) : (
                <form onSubmit={submitClaim} className="flex flex-col gap-2">
                  <label htmlFor="claim-text" className="field-label">
                    Describe an identifying detail (kept private, not shown publicly)
                  </label>
                  <textarea
                    id="claim-text"
                    className="input-field"
                    rows={3}
                    maxLength={300}
                    value={claimText}
                    onChange={(e) => setClaimText(e.target.value)}
                    placeholder="e.g. There's a small scratch near the cap and a sticker inside the lid."
                  />
                  <button type="submit" className="btn btn-primary btn-sm self-start">
                    Submit claim
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
