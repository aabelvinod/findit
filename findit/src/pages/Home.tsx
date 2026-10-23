import { useCallback, useEffect, useMemo, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Gem,
  MapPin,
  PackagePlus,
  PackageSearch,
  ClipboardList,
  Search as SearchIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import ItemGrid from "../components/ItemGrid";
import SafetyTips from "../components/SafetyTips";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import { CATEGORIES } from "../types";
import { getCategoryIcon } from "../utils/categoryIcons";
import { useReports } from "../hooks/useReports";
import { computeStats, isValuable } from "../utils/rewards";
import type { Report } from "../types";

interface HomeProps {
  onViewReport: (report: Report) => void;
}

export default function Home({ onViewReport }: HomeProps) {
  const navigate = useNavigate();
  const { reports, claims } = useReports();
  const heroRef = useRef<HTMLDivElement | null>(null);

  const stats = useMemo(() => {
    const activeLost = reports.filter((r) => r.type === "lost" && r.status === "active").length;
    const activeFound = reports.filter((r) => r.type === "found" && r.status === "active").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    return { activeLost, activeFound, resolved };
  }, [reports]);

  const rewards = useMemo(() => computeStats(reports, claims), [reports, claims]);

  const recent = useMemo(
    () =>
      [...reports]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [reports]
  );

  const ticker = useMemo(
    () =>
      [...reports]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    [reports]
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const report of reports) {
      if (report.status !== "active") continue;
      counts.set(report.category, (counts.get(report.category) ?? 0) + 1);
    }
    return counts;
  }, [reports]);

  // Pointer parallax on the hero artwork: one write per animation frame.
  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const node = heroRef.current;
    if (!node) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (event.pointerType !== "mouse") return;

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    requestAnimationFrame(() => {
      node.style.setProperty("--px", x.toFixed(3));
      node.style.setProperty("--py", y.toFixed(3));
    });
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    return () => {
      node?.style.removeProperty("--px");
      node?.style.removeProperty("--py");
    };
  }, []);

  function handleHeroSearch(query: string) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    navigate(`/browse${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div>
      {/* ---------------------------------------------------------------- Hero */}
      <section
        ref={heroRef}
        onPointerMove={handlePointerMove}
        className="container-page relative grid grid-cols-1 items-center gap-12 pb-16 pt-10 md:grid-cols-2 md:pt-16"
      >
        <div>
          <Reveal>
            <span
              className="glass-float inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              <ShieldCheck size={14} /> Little Kites · Class 10 Web Development
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1
              className="mt-5 text-[2.6rem] font-extrabold leading-[1.06] sm:text-5xl md:text-[3.4rem]"
              style={{ color: "var(--color-text)" }}
            >
              Lost something?
              <br />
              <span className="text-gradient">Let&apos;s find it.</span>
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-5 max-w-lg text-base leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
              From forgotten notebooks to missing water bottles, FindIt helps your school community
              report, search and safely return the belongings that matter.
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-7">
              <SearchBar
                onSearch={handleHeroSearch}
                size="lg"
                placeholder="Try “water bottle”, “notebook”, “library”..."
              />
            </div>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/browse" className="btn btn-primary">
                <SearchIcon size={16} /> Search items
              </Link>
              <Link to="/report-lost" className="btn btn-secondary">
                <PackageSearch size={16} /> I lost something
              </Link>
              <Link to="/report-found" className="btn btn-secondary">
                <PackagePlus size={16} /> I found something
              </Link>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-9 grid max-w-md grid-cols-3 gap-3">
              <StatBlock label="Active lost" value={stats.activeLost} />
              <StatBlock label="Active found" value={stats.activeFound} />
              <StatBlock label="Reunited" value={stats.resolved} />
            </div>
          </Reveal>
        </div>

        {/* Artwork with floating glass chips */}
        <Reveal direction="zoom" delay={120} className="relative">
          <div className="relative mx-auto w-full max-w-lg">
            <span
              className="anim-breathe absolute -inset-6 -z-10 rounded-[46px]"
              style={{ background: "var(--grad-brand-soft)" }}
              aria-hidden="true"
            />
            <div className="glass-card overflow-hidden" style={{ borderRadius: "var(--radius-xl)" }}>
              <img
                src="/images/hero-illustration.webp"
                alt="Glass cards floating in soft light holding a water bottle, notebook, backpack, umbrella, keys and headphones"
                width={1200}
                height={675}
                className="w-full"
                loading="eager"
                decoding="async"
              />
            </div>

            <FloatChip
              className="left-[-6%] top-[14%] hidden sm:flex"
              depth={26}
              icon={<BadgeCheck size={15} style={{ color: "var(--color-success)" }} />}
              title="Notebook returned"
              sub="Class 10-B · just now"
            />
            <FloatChip
              className="bottom-[12%] right-[-4%] hidden sm:flex"
              depth={-32}
              icon={<Gem size={15} style={{ color: "var(--color-gold)" }} />}
              title="Valuable find"
              sub="+35 honesty points"
            />
            <FloatChip
              className="bottom-[-4%] left-[10%] flex"
              depth={18}
              icon={<MapPin size={15} style={{ color: "var(--color-primary)" }} />}
              title="92% match"
              sub="Sports Room"
            />
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------------- Ticker */}
      {ticker.length > 0 && (
        <section className="relative overflow-hidden py-3" aria-label="Latest activity">
          <div className="marquee-track flex">
            <div className="marquee">
              {[...ticker, ...ticker].map((report, i) => (
                <span
                  key={`${report.id}-${i}`}
                  className="glass-float mx-1.5 flex items-center gap-2 px-4 py-2 text-xs"
                  style={{ color: "var(--color-text-soft)" }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background:
                        report.status === "resolved"
                          ? "var(--color-success)"
                          : report.type === "lost"
                            ? "var(--color-danger)"
                            : "var(--color-primary)",
                    }}
                  />
                  <strong style={{ color: "var(--color-text)" }}>{report.title}</strong>
                  <span>· {report.location}</span>
                  {isValuable(report) && <Gem size={12} style={{ color: "var(--color-gold)" }} />}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------- Categories */}
      <section className="container-page py-12">
        <Reveal className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Start here</span>
            <h2 className="section-title mt-2">Browse by category</h2>
          </div>
          <Link to="/browse" className="btn btn-ghost btn-sm">
            View all <ArrowRight size={14} />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORIES.map((category, i) => {
            const Icon = getCategoryIcon(category);
            const count = categoryCounts.get(category) ?? 0;
            return (
              <Reveal key={category} delay={i * 40}>
                <Link
                  to={`/browse?category=${encodeURIComponent(category)}`}
                  className="glass-card group flex h-full flex-col items-center gap-2.5 px-3 py-6 text-center"
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "var(--grad-brand-soft)", color: "var(--color-primary)" }}
                  >
                    <Icon size={21} />
                  </span>
                  <span className="text-xs font-semibold leading-tight" style={{ color: "var(--color-text)" }}>
                    {category}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--color-text-soft)" }}>
                    {count} active
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------- Recent reports */}
      <section className="container-page py-12">
        <Reveal className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Fresh off the board</span>
            <h2 className="section-title mt-2">Recently reported</h2>
          </div>
          <Link to="/browse" className="btn btn-ghost btn-sm">
            Browse all <ArrowRight size={14} />
          </Link>
        </Reveal>

        <ItemGrid
          reports={recent}
          onView={onViewReport}
          emptyTitle="No reports yet"
          emptyDescription="Be the first to report a lost or found item, or load sample data from My Reports to explore the app."
        />
      </section>

      {/* ----------------------------------------------------------- Rewards */}
      <section className="container-page py-12">
        <Reveal direction="zoom">
          <div
            className="glass-panel relative overflow-hidden p-7 sm:p-10"
            style={{ borderColor: "color-mix(in srgb, var(--color-gold) 35%, transparent)" }}
          >
            <span
              className="anim-breathe pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(circle, var(--ambient-4), transparent 70%)" }}
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1.3fr_1fr]">
              <div>
                <span className="eyebrow" style={{ color: "var(--color-gold)" }}>
                  <Crown size={14} /> Honesty rewards
                </span>
                <h2 className="mt-3 text-3xl font-extrabold" style={{ color: "var(--color-text)" }}>
                  Valuable things get noticed here
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
                  Hand in a phone, a wallet or a set of house keys and FindIt remembers it. Earn
                  honesty points, unlock badges and climb the school honour board — from First Spark
                  all the way to Gold Guardian.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/rewards" className="btn btn-gold">
                    <Sparkles size={16} /> See my rewards
                  </Link>
                  <Link to="/report-found" className="btn btn-secondary">
                    <PackagePlus size={16} /> Report a valuable find
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <RewardTile value={rewards.valuableFound} label="Valuable finds" gold />
                <RewardTile value={rewards.returned} label="Safely returned" />
                <RewardTile value={rewards.points} label="Honesty points" gold />
                <RewardTile value={rewards.tierProgress} label="Tier progress" suffix="%" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------- How it works */}
      <section id="how-it-works" className="container-page scroll-mt-24 py-12">
        <Reveal className="mb-8">
          <span className="eyebrow">Three steps</span>
          <h2 className="section-title mt-2">How FindIt works</h2>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
          <span
            className="hairline pointer-events-none absolute left-[16%] right-[16%] top-1/2 hidden md:block"
            aria-hidden="true"
          />
          <HowStep
            icon={ClipboardList}
            step="1"
            title="Report the item"
            text="Submit a quick report for something you lost or found, with a category, description and location."
            delay={0}
          />
          <HowStep
            icon={SearchIcon}
            step="2"
            title="Search & discover matches"
            text="Browse active reports or let FindIt suggest possible matches using category, keywords and location."
            delay={90}
          />
          <HowStep
            icon={ShieldCheck}
            step="3"
            title="Recover it safely"
            text="Verify identifying details and coordinate pickup through a teacher or the school office."
            delay={180}
          />
        </div>
      </section>

      {/* ------------------------------------------------------ Trust & safety */}
      <section className="container-page pb-16 pt-4">
        <Reveal>
          <SafetyTips />
        </Reveal>
      </section>

      {/* --------------------------------------------------------------- Call to action */}
      <section className="container-page pb-20">
        <Reveal direction="zoom">
          <div
            className="relative overflow-hidden rounded-[var(--radius-xl)] px-7 py-12 text-center sm:px-12"
            style={{ background: "var(--grad-brand)", boxShadow: "var(--shadow-glow)" }}
          >
            <span
              className="anim-spin-slow pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-30"
              style={{ background: "conic-gradient(from 0deg, #fff0, #fff5, #fff0)" }}
              aria-hidden="true"
            />
            <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl">
              Something missing? Start the search.
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/85">
              Post it in under a minute. If it is in this school, someone has probably already seen it.
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/report-lost" className="btn bg-white text-[color:var(--color-primary)] hover:brightness-95">
                <PackageSearch size={16} /> Report lost
              </Link>
              <Link
                to="/report-found"
                className="btn"
                style={{ background: "rgba(255,255,255,0.16)", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
              >
                <PackagePlus size={16} /> Report found
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card px-3 py-4 text-center">
      <div className="text-2xl font-extrabold" style={{ color: "var(--color-primary)" }}>
        <CountUp value={value} />
      </div>
      <div className="text-[11px] font-medium" style={{ color: "var(--color-text-soft)" }}>
        {label}
      </div>
    </div>
  );
}

function RewardTile({
  value,
  label,
  suffix,
  gold,
}: {
  value: number;
  label: string;
  suffix?: string;
  gold?: boolean;
}) {
  return (
    <div className="glass-card px-4 py-5 text-center">
      <div
        className="text-3xl font-extrabold"
        style={{ color: gold ? "var(--color-gold)" : "var(--color-text)" }}
      >
        <CountUp value={value} suffix={suffix} />
      </div>
      <div className="mt-1 text-xs font-medium" style={{ color: "var(--color-text-soft)" }}>
        {label}
      </div>
    </div>
  );
}

function FloatChip({
  className,
  icon,
  title,
  sub,
  depth,
}: {
  className: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
  depth: number;
}) {
  // The parallax transform lives on the outer node and the float animation on
  // the inner one — both animate `transform`, so they must not share an element.
  const style = {
    "--depth": `${depth}px`,
    transform:
      "translate3d(calc(var(--px, 0) * var(--depth, 0px)), calc(var(--py, 0) * var(--depth, 0px)), 0)",
  } as CSSProperties;

  return (
    <div className={`absolute ${className}`} style={style}>
      <div className="glass-float anim-float flex items-center gap-2.5 px-3.5 py-2.5">
        {icon}
        <span className="leading-tight">
          <span className="block text-xs font-bold" style={{ color: "var(--color-text)" }}>
            {title}
          </span>
          <span className="block text-[10px]" style={{ color: "var(--color-text-soft)" }}>
            {sub}
          </span>
        </span>
      </div>
    </div>
  );
}

function HowStep({
  icon: Icon,
  step,
  title,
  text,
  delay,
}: {
  icon: typeof ClipboardList;
  step: string;
  title: string;
  text: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="relative">
      <div className="glass-card h-full p-6">
        <div className="mb-4 flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-extrabold text-white"
            style={{ background: "var(--grad-brand)", boxShadow: "var(--shadow-glow)" }}
          >
            {step}
          </span>
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ background: "var(--grad-brand-soft)", color: "var(--color-primary)" }}
          >
            <Icon size={20} />
          </span>
        </div>
        <h3 className="mb-1.5 font-bold" style={{ color: "var(--color-text)" }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
          {text}
        </p>
      </div>
    </Reveal>
  );
}
