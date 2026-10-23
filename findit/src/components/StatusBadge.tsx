import { CheckCircle2, Search, PackageCheck } from "lucide-react";
import type { Report } from "../types";

export default function StatusBadge({ report }: { report: Report }) {
  if (report.status === "resolved") {
    return (
      <span className="badge badge-resolved">
        <CheckCircle2 size={12} /> Resolved
      </span>
    );
  }
  if (report.type === "lost") {
    return (
      <span className="badge badge-lost">
        <Search size={12} /> Lost
      </span>
    );
  }
  return (
    <span className="badge badge-found">
      <PackageCheck size={12} /> Found
    </span>
  );
}
