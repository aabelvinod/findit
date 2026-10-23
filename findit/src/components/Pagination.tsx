import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/** Page numbers shown as buttons: current page plus its immediate neighbours. */
function pageWindow(page: number, totalPages: number): number[] {
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, page + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages);

  function go(next: number) {
    onChange(next);
    document.getElementById("browse-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        className="icon-btn"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="glass-panel flex items-center gap-1 px-2 py-1.5">
        {page > 2 && (
          <>
            <PageButton current={false} page={1} onChange={go} />
            {page > 3 && <span className="px-1 text-sm" style={{ color: "var(--color-text-soft)" }}>…</span>}
          </>
        )}
        {pages.map((p) => (
          <PageButton key={p} page={p} current={p === page} onChange={go} />
        ))}
        {page < totalPages - 1 && (
          <>
            {page < totalPages - 2 && <span className="px-1 text-sm" style={{ color: "var(--color-text-soft)" }}>…</span>}
            <PageButton current={false} page={totalPages} onChange={go} />
          </>
        )}
      </div>

      <button
        type="button"
        className="icon-btn"
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

function PageButton({
  page,
  current,
  onChange,
}: {
  page: number;
  current: boolean;
  onChange: (page: number) => void;
}) {
  return (
    <button
      type="button"
      aria-current={current ? "page" : undefined}
      onClick={() => onChange(page)}
      className={`page-btn ${current ? "is-current" : ""}`}
    >
      {page}
    </button>
  );
}
