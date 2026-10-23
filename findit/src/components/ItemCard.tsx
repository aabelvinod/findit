import { MapPin, CalendarDays, Hash, Gem } from "lucide-react";
import type { Report } from "../types";
import StatusBadge from "./StatusBadge";
import { getCategoryIcon } from "../utils/categoryIcons";
import { isValuable } from "../utils/rewards";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

interface ItemCardProps {
  report: Report;
  onView: (report: Report) => void;
}

export default function ItemCard({ report, onView }: ItemCardProps) {
  const Icon = getCategoryIcon(report.category);
  const valuable = isValuable(report);

  return (
    <article className="item-card">
      <div className="item-thumb">
        {report.image ? (
          <img
            src={report.image}
            alt={report.title}
            className="item-thumb-img"
            loading="lazy"
            width={320}
            height={168}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ color: "var(--color-primary)" }}>
            <Icon size={44} className="anim-float opacity-45" />
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          <StatusBadge report={report} />
          {valuable && (
            <span className="badge badge-valuable">
              <Gem size={11} /> Valuable
            </span>
          )}
        </div>

        {report.isSample && (
          <span className="absolute right-2.5 top-2.5">
            <span className="badge badge-demo">Demo</span>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold" style={{ color: "var(--color-text)" }}>
          {report.title}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-primary)" }}>
          {report.category}
        </p>
        <p className="line-clamp-2 text-sm" style={{ color: "var(--color-text-soft)" }}>
          {report.description}
        </p>

        <div className="mt-1 flex flex-col gap-1 text-xs" style={{ color: "var(--color-text-soft)" }}>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> {report.location}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} /> {formatDate(report.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Hash size={13} /> {report.id}
          </span>
        </div>

        <button type="button" onClick={() => onView(report)} className="btn btn-secondary btn-sm mt-3 w-full">
          View details
        </button>
      </div>
    </article>
  );
}
