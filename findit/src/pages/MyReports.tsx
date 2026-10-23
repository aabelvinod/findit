import { useMemo, useState } from "react";
import { Download, Upload, FlaskConical, Trash2, Pencil, CheckCircle2, RotateCcw, Info, Gem } from "lucide-react";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import Reveal from "../components/Reveal";
import { useReports } from "../hooks/useReports";
import { useToast } from "../hooks/useToast";
import { exportReportsBackup, importReportsBackup } from "../utils/storage";
import { validateReportForm, sanitizeText, truncate, TEXT_LIMITS } from "../utils/validation";
import { isValuable, pointsForReport } from "../utils/rewards";
import { CATEGORIES } from "../types";
import type { Report } from "../types";

type FilterKey = "all" | "lost" | "found" | "active" | "resolved";

export default function MyReports() {
  const { reports, updateReport, deleteReport, toggleResolved, addSampleData, removeSampleData, replaceAllReports } = useReports();
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [editing, setEditing] = useState<Report | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Report | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports.filter((r) => {
      if (filter === "lost" && r.type !== "lost") return false;
      if (filter === "found" && r.type !== "found") return false;
      if (filter === "active" && r.status !== "active") return false;
      if (filter === "resolved" && r.status !== "resolved") return false;
      if (q && !`${r.title} ${r.description} ${r.id}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [reports, query, filter]);

  function handleExport() {
    const json = exportReportsBackup(reports);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `findit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup downloaded. It may include descriptions and photos.", "success");
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importReportsBackup(String(reader.result), reports);
      if (result.ok) {
        // Reload from storage into state via replaceAllReports for consistency.
        const refreshed = JSON.parse(localStorage.getItem("findit_reports_v1") || "[]");
        replaceAllReports(refreshed);
        showToast(result.message, "success");
      } else {
        showToast(result.message, "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleAddSample() {
    const added = addSampleData();
    showToast(added > 0 ? `Added ${added} sample reports.` : "Sample data is already loaded.", added > 0 ? "success" : "info");
  }

  function handleRemoveSample() {
    const removed = removeSampleData();
    showToast(removed > 0 ? `Removed ${removed} sample reports.` : "No sample data to remove.", "info");
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteReport(pendingDelete.id);
    showToast("Report deleted.", "success");
    setPendingDelete(null);
  }

  return (
    <div className="container-page py-10">
      <Reveal>
        <p className="eyebrow mb-2">Your activity</p>
        <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-gradient">My reports</span>
        </h1>
        <p className="mb-4 max-w-2xl text-sm" style={{ color: "var(--color-text-soft)" }}>
          These are the reports saved in this browser only. This demo version does not identify you
          as a user, so reports created here will not appear on another device or browser.
        </p>
      </Reveal>
      <Reveal delay={80}>
        <div className="glass-panel mb-6 flex items-start gap-2 p-3 text-xs" style={{ color: "var(--color-text)" }}>
          <Info size={15} className="mt-0.5 shrink-0" style={{ color: "var(--color-primary)" }} />
          Data lives in LocalStorage on this device/browser. Use export/import below to move it elsewhere.
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="glass-panel mb-6 flex flex-wrap items-center gap-2 p-3">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleExport}>
            <Download size={15} /> Export backup
          </button>
          <label className="btn btn-secondary btn-sm cursor-pointer">
            <Upload size={15} /> Import backup
            <input type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
          </label>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddSample}>
            <FlaskConical size={15} /> Load sample data
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleRemoveSample}>
            <Trash2 size={15} /> Remove sample data
          </button>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar value={query} onSearch={setQuery} placeholder="Search your reports..." />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "lost", "found", "active", "resolved"] as FilterKey[]).map((f) => (
              <button key={f} type="button" className={`chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <p className="mb-4 text-sm font-medium" style={{ color: "var(--color-text-soft)" }}>
        {filtered.length} {filtered.length === 1 ? "report" : "reports"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No reports to show"
          description="Create a lost or found report, or load sample data above to explore My Reports."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((report, index) => (
            <Reveal as="li" key={report.id} delay={Math.min(index * 60, 240)} className="glass-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <StatusBadge report={report} />
                  {isValuable(report) && (
                    <span className="badge badge-valuable">
                      <Gem size={11} /> Valuable
                    </span>
                  )}
                  {report.isSample && <span className="badge badge-demo">Demo</span>}
                  <span className="text-xs" style={{ color: "var(--color-text-soft)" }}>{report.id}</span>
                  <span className="badge badge-gold">{pointsForReport(report)} pts</span>
                </div>
                <h3 className="truncate font-semibold" style={{ color: "var(--color-text)" }}>{report.title}</h3>
                <p className="line-clamp-1 text-sm" style={{ color: "var(--color-text-soft)" }}>
                  {report.category} · {report.location}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(report)}>
                  <Pencil size={14} /> Edit
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => toggleResolved(report.id)}>
                  {report.status === "active" ? (
                    <>
                      <CheckCircle2 size={14} /> Resolve
                    </>
                  ) : (
                    <>
                      <RotateCcw size={14} /> Reopen
                    </>
                  )}
                </button>
                <button type="button" className="btn btn-danger-soft btn-sm" onClick={() => setPendingDelete(report)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </Reveal>
          ))}
        </ul>
      )}

      {editing && (
        <EditReportDialog
          report={editing}
          onClose={() => setEditing(null)}
          onSave={(updates) => {
            updateReport(editing.id, updates);
            showToast("Report updated.", "success");
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this report?"
        message={`This will permanently remove "${pendingDelete?.title}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function EditReportDialog({
  report,
  onClose,
  onSave,
}: {
  report: Report;
  onClose: () => void;
  onSave: (updates: Partial<Report>) => void;
}) {
  const [title, setTitle] = useState(report.title);
  const [category, setCategory] = useState(report.category);
  const [description, setDescription] = useState(report.description);
  const [location, setLocation] = useState(report.location);
  const [eventDate, setEventDate] = useState(report.eventDate);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateReportForm({ title, category, description, location, eventDate }, report.type);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSave({
      title: truncate(sanitizeText(title), TEXT_LIMITS.title),
      category,
      description: truncate(sanitizeText(description), TEXT_LIMITS.description),
      location: truncate(sanitizeText(location), TEXT_LIMITS.location),
      eventDate,
    });
  }

  return (
    <div className="scrim fixed inset-0 z-[85] flex items-center justify-center p-4" style={{ animation: "fade-in 0.2s ease both" }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-modal max-h-[85vh] w-full max-w-lg overflow-y-auto p-6" role="dialog" aria-modal="true" aria-labelledby="edit-report-title" style={{ animation: "pop-in 0.28s var(--ease-spring) both" }}>
        <h2 id="edit-report-title" className="mb-4 text-lg font-semibold" style={{ color: "var(--color-text)" }}>
          Edit report
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="edit-title" className="field-label">Item name</label>
            <input id="edit-title" className={`input-field ${errors.title ? "has-error" : ""}`} value={title} onChange={(e) => setTitle(e.target.value)} />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="edit-category" className="field-label">Category</label>
            <select id="edit-category" className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="edit-description" className="field-label">Description</label>
            <textarea id="edit-description" rows={3} className={`input-field ${errors.description ? "has-error" : ""}`} value={description} onChange={(e) => setDescription(e.target.value)} />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-location" className="field-label">Location</label>
              <input id="edit-location" className={`input-field ${errors.location ? "has-error" : ""}`} value={location} onChange={(e) => setLocation(e.target.value)} />
              {errors.location && <p className="field-error">{errors.location}</p>}
            </div>
            <div>
              <label htmlFor="edit-date" className="field-label">Date</label>
              <input id="edit-date" type="date" max={new Date().toISOString().slice(0, 10)} className={`input-field ${errors.eventDate ? "has-error" : ""}`} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              {errors.eventDate && <p className="field-error">{errors.eventDate}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
