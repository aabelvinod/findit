import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Crown,
  Gem,
  HeartHandshake,
  Lock,
  Medal,
  PackagePlus,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import ItemGrid from "../components/ItemGrid";
import EmptyState from "../components/EmptyState";
import { useReports } from "../hooks/useReports";
import type { Report } from "../types";
import { POINTS, buildHonourBoard, computeBadges, computeStats, isValuable } from "../utils/rewards";

const TIER_MEDALS = ["#f5c451", "#cfd8ea", "#d79a6c"];

const POINT_GUIDE = [
  { label: "Report a lost item", value: POINTS.reportLost, icon: ShieldCheck },
  { label: "Hand in a found item", value: POINTS.reportFound, icon: PackagePlus },
  { label: "Marked as valuable", value: POINTS.valuableBonus, icon: Gem },
  { label: "Item returned to owner", value: POINTS.foundReturned, icon: HeartHandshake },
  { label: "Your lost item recovered", value: POINTS.lostRecovered, icon: Trophy },
  { label: "Claim submitted", value: POINTS.claim, icon: Star },
];

interface RewardsProps {
  onViewReport: (report: Report) => void;
}

export default function Rewards({ onViewReport }: RewardsProps) {
  const { reports, claims } = useReports();
  const [barReady, setBarReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setBarReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const stats = useMemo(() => computeStats(reports, claims), [reports, claims]);
  const badges = useMemo(() => computeBadges(stats), [stats]);
  const honour = useMemo(() => buildHonourBoard(reports), [reports]);
  const valuableWaiting = useMemo(
    () =>
      reports
        .filter((r) => r.type === "found" && r.status === "active" && isValuable(r))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [reports]
  );
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="container-page py-10 md:py-14">
      {/* Header */}
      <Reveal className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} /> Honesty programme
          </span>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            <span className="text-gradient">Rewards</span> for doing the right thing
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
            Every water bottle is easy to hand in. It is the wallets, phones and house keys that test
            us. FindIt keeps score of the honest moments — valuable finds, safe returns and the
            students who make the school a place where lost things come home.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/report-found" className="btn btn-gold">
              <Gem size={16} /> Report a valuable find
            </Link>
            <Link to="/browse" className="btn btn-secondary">
              Browse waiting items
            </Link>
          </div>
        </div>

        {/* Tier medallion */}
        <div className="glass-card anim-float-tilt mx-auto w-full max-w-sm p-6 text-center">
          <div
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background: "var(--grad-gold)",
              boxShadow: "var(--shadow-gold)",
            }}
          >
            <div
              className="flex h-[86px] w-[86px] items-center justify-center rounded-full"
              style={{ background: "var(--glass-bg-strong)", color: "var(--color-gold)" }}
            >
              <Crown size={34} />
            </div>
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--color-text-soft)" }}>
            Current tier
          </p>
          <h2 className="mt-1 text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            {stats.tier.name}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-soft)" }}>
            {stats.tier.blurb}
          </p>

          <div className="mt-5 text-4xl font-extrabold" style={{ color: "var(--color-gold)" }}>
            <CountUp value={stats.points} />
            <span className="ml-1 text-base font-semibold" style={{ color: "var(--color-text-soft)" }}>
              honesty points
            </span>
          </div>

          <div
            className="mt-4 h-2.5 w-full overflow-hidden rounded-full"
            style={{ background: "var(--color-primary-soft)" }}
            role="progressbar"
            aria-valuenow={Math.round(stats.tierProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress to next tier"
          >
            <div
              className="h-full rounded-full"
              style={{
                width: barReady ? `${Math.max(stats.tierProgress, 4)}%` : "0%",
                background: "var(--grad-gold)",
                transition: "width 1.2s var(--ease-out)",
              }}
            />
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--color-text-soft)" }}>
            {stats.nextTier
              ? `${stats.pointsToNext} points to ${stats.nextTier.name}`
              : "Top tier reached — outstanding honesty."}
          </p>
        </div>
      </Reveal>

      {/* Stat rail */}
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Valuable finds", value: stats.valuableFound, icon: Gem, hint: "flagged as precious" },
          { label: "Returned safely", value: stats.returned, icon: HeartHandshake, hint: "matched and closed" },
          { label: "Reunited owners", value: stats.reunited, icon: Trophy, hint: "your lost items found" },
          { label: "Still waiting", value: stats.valuableWaiting, icon: Lock, hint: "need an owner" },
        ].map((item, i) => (
          <Reveal key={item.label} className="glass-card p-5" delay={i * 70}>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "var(--color-gold-soft)", color: "var(--color-gold)" }}
            >
              <item.icon size={18} />
            </span>
            <div className="mt-3 text-3xl font-bold" style={{ color: "var(--color-text)" }}>
              <CountUp value={item.value} />
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              {item.label}
            </div>
            <div className="text-xs" style={{ color: "var(--color-text-soft)" }}>
              {item.hint}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Badges */}
      <section className="mt-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Badge collection</h2>
            <p className="text-sm" style={{ color: "var(--color-text-soft)" }}>
              {earnedCount} of {badges.length} earned so far.
            </p>
          </div>
          <Link to="/my-reports" className="btn btn-ghost btn-sm">
            Manage my reports
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge, i) => (
            <Reveal key={badge.id} className="glass-card flex items-start gap-4 p-5" delay={i * 60}>
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={
                  badge.earned
                    ? { background: "var(--grad-gold)", color: "#3d2a05", boxShadow: "var(--shadow-gold)" }
                    : {
                        background: "var(--glass-bg-subtle)",
                        color: "var(--color-text-soft)",
                        border: "1px dashed var(--color-border)",
                      }
                }
              >
                {badge.earned ? <Award size={22} /> : <Lock size={18} />}
              </span>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--color-text)" }}>
                  {badge.name}
                </h3>
                <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-soft)" }}>
                  {badge.description}
                </p>
                <span
                  className="mt-2 inline-block text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: badge.earned ? "var(--color-gold)" : "var(--color-text-soft)" }}
                >
                  {badge.earned ? "Earned" : "Locked"}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Valuable items still waiting */}
      <section className="mt-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">Valuable things waiting for their owner</h2>
            <p className="text-sm" style={{ color: "var(--color-text-soft)" }}>
              Recognise any of these? Claiming one back is how the honesty circle closes.
            </p>
          </div>
          <Link to="/browse?type=found" className="btn btn-ghost btn-sm">
            See all found items
          </Link>
        </div>

        {valuableWaiting.length > 0 ? (
          <ItemGrid reports={valuableWaiting} onView={onViewReport} />
        ) : (
          <EmptyState
            title="Nothing valuable is waiting"
            description="Every flagged valuable item has been claimed back. Load sample data or report a find to see the rewards flow."
          />
        )}
      </section>

      {/* Honour board */}
      <section className="mt-14">
        <div className="mb-5">
          <h2 className="section-title">School honour board</h2>
          <p className="text-sm" style={{ color: "var(--color-text-soft)" }}>
            Built from the found reports saved in this browser. Add your name on a report to appear here.
          </p>
        </div>

        {honour.length > 0 ? (
          <Reveal className="glass-panel overflow-hidden p-2 sm:p-3">
            <ol className="flex flex-col">
              {honour.slice(0, 8).map((entry, i) => (
                <li
                  key={entry.name}
                  className="flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors"
                  style={{ background: i === 0 ? "var(--color-gold-soft)" : "transparent" }}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold"
                    style={{
                      background: i < 3 ? TIER_MEDALS[i] : "var(--glass-bg-subtle)",
                      color: i < 3 ? "#2a2013" : "var(--color-text-soft)",
                      border: i < 3 ? "1px solid var(--glass-edge)" : "1px solid var(--color-border)",
                      boxShadow: i === 0 ? "var(--shadow-gold)" : "none",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold" style={{ color: "var(--color-text)" }}>
                      {entry.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-soft)" }}>
                      {entry.returned} returned · {entry.valuable} valuable {entry.valuable === 1 ? "find" : "finds"}
                    </p>
                  </div>
                  {i === 0 && <Medal size={18} style={{ color: "var(--color-gold)" }} />}
                  <span className="shrink-0 text-right">
                    <span className="block text-lg font-bold" style={{ color: "var(--color-text)" }}>
                      {entry.points}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider" style={{ color: "var(--color-text-soft)" }}>
                      points
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        ) : (
          <EmptyState
            title="The honour board is empty"
            description="Hand in a found item with your name on it and you will be the first student listed."
            action={
              <Link to="/report-found" className="btn btn-primary btn-sm">
                Report a found item
              </Link>
            }
          />
        )}
      </section>

      {/* Points guide */}
      <section className="mt-14">
        <h2 className="section-title mb-5">How points are earned</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POINT_GUIDE.map((row, i) => (
            <Reveal key={row.label} className="glass-card flex items-center justify-between gap-3 px-5 py-4" delay={i * 50}>
              <span className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--color-text)" }}>
                <row.icon size={17} style={{ color: "var(--color-primary)" }} /> {row.label}
              </span>
              <span
                className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
                style={{ background: "var(--color-gold-soft)", color: "var(--color-gold)" }}
              >
                +{row.value}
              </span>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--color-text-soft)" }}>
          Points are a classroom demonstration only — they live in your browser and are not a real
          school certificate.
        </p>
      </section>
    </div>
  );
}
