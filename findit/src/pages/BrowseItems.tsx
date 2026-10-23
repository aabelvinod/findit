import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, RotateCcw, PackageSearch } from "lucide-react";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ItemGrid from "../components/ItemGrid";
import Pagination from "../components/Pagination";
import Reveal from "../components/Reveal";
import { useReports } from "../hooks/useReports";
import type { Report } from "../types";

const PAGE_SIZE = 8;

type TypeFilter = "all" | "lost" | "found";
type SortOrder = "newest" | "oldest" | "az";

interface BrowseItemsProps {
  onViewReport: (report: Report) => void;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function BrowseItems({ onViewReport }: BrowseItemsProps) {
  const { reports } = useReports();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Reflect the active search text back into the URL for shareable links.
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category]);

  useEffect(() => {
    setPage(1);
  }, [query, typeFilter, category, location, dateFrom, dateTo, sortOrder]);

  // Lock background scroll and support Escape when the mobile filter drawer is open.
  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    let list = reports.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (category && r.category !== category) return false;
      if (location && !normalize(r.location).includes(normalize(location))) return false;
      if (dateFrom && r.eventDate < dateFrom) return false;
      if (dateTo && r.eventDate > dateTo) return false;
      if (q) {
        const haystack = normalize(
          `${r.title} ${r.description} ${r.category} ${r.location} ${r.id}`
        );
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [reports, query, typeFilter, category, location, dateFrom, dateTo, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters = !!(query || category || location || dateFrom || dateTo || typeFilter !== "all" || sortOrder !== "newest");

  function clearFilters() {
    setQuery("");
    setTypeFilter("all");
    setCategory("");
    setLocation("");
    setDateFrom("");
    setDateTo("");
    setSortOrder("newest");
  }

  const filterControls = (
    <div className="flex flex-col gap-4">
      <div>
        <p className="field-label">Type</p>
        <div className="flex gap-2">
          {(["all", "lost", "found"] as TypeFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`chip ${typeFilter === t ? "active" : ""}`}
              onClick={() => setTypeFilter(t)}
            >
              {t === "all" ? "All items" : t === "lost" ? "Lost" : "Found"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="field-label">Category</p>
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label htmlFor="location-filter" className="field-label">
            Location contains
          </label>
          <input
            id="location-filter"
            className="input-field"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. library"
          />
        </div>
        <div>
          <label htmlFor="sort-order" className="field-label">
            Sort by
          </label>
          <select id="sort-order" className="input-field" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <div>
          <label htmlFor="date-from" className="field-label">
            Date from
          </label>
          <input id="date-from" type="date" className="input-field" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div>
          <label htmlFor="date-to" className="field-label">
            Date to
          </label>
          <input id="date-to" type="date" className="input-field" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      {hasActiveFilters && (
        <button type="button" className="btn btn-ghost btn-sm self-start" onClick={clearFilters}>
          <RotateCcw size={14} /> Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-page py-10 md:py-14">
      <Reveal>
        <span className="eyebrow">
          <PackageSearch size={13} /> The board
        </span>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl" style={{ color: "var(--color-text)" }}>
          Browse <span className="text-gradient">items</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-soft)" }}>
          Search across every active and resolved report saved in this browser.
        </p>
      </Reveal>

      <div className="mt-7 mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchBar value={query} onSearch={setQuery} />
        </div>
        <button type="button" className="btn btn-secondary sm:hidden" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] lg:grid-cols-[292px_1fr]">
        <aside className="hidden md:block">
          <Reveal direction="left">
            <div className="glass-panel p-5">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold" style={{ color: "var(--color-text)" }}>
                <SlidersHorizontal size={15} style={{ color: "var(--color-primary)" }} /> Filters
              </p>
              {filterControls}
            </div>
          </Reveal>
        </aside>

        <div id="browse-results" className="scroll-mt-28">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="glass-float px-3.5 py-1.5 text-sm font-medium" style={{ color: "var(--color-text-soft)" }}>
              <strong style={{ color: "var(--color-text)" }}>{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>

          <ItemGrid reports={pageItems} onView={onViewReport} />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[70] flex md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="scrim absolute inset-0" onClick={() => setFiltersOpen(false)} />
          <div
            className="glass-modal relative ml-auto flex h-full w-[88%] max-w-sm flex-col overflow-y-auto rounded-none border-y-0 border-r-0 p-5"
            style={{ animation: "slide-in-right 0.3s var(--ease-out) both" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                Filters
              </h2>
              <button type="button" className="icon-btn" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            {filterControls}
            <button type="button" className="btn btn-primary mt-6" onClick={() => setFiltersOpen(false)}>
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
