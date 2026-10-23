import type { Report } from "../types";
import ItemCard from "./ItemCard";
import EmptyState from "./EmptyState";
import Reveal from "./Reveal";

interface ItemGridProps {
  reports: Report[];
  onView: (report: Report) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function ItemGrid({ reports, onView, emptyTitle, emptyDescription }: ItemGridProps) {
  if (reports.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || "No items found"}
        description={emptyDescription || "Try adjusting your search or filters to see more results."}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {reports.map((report, index) => (
        <Reveal as="div" key={report.id} delay={Math.min(index * 55, 330)}>
          <ItemCard report={report} onView={onView} />
        </Reveal>
      ))}
    </div>
  );
}
