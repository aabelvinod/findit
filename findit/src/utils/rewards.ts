// Honesty rewards: points, tiers, badges and the honour board.
// Everything is derived from the reports saved in this browser, so the
// numbers always reflect what the student has actually posted.

import type { Claim, Report } from "../types";

/** Categories that usually hold something worth returning quickly. */
const VALUABLE_CATEGORIES = new Set([
  "Electronics",
  "Keys & Personal Items",
  "Bags & Pencil Cases",
  "Sports Equipment",
]);

export const POINTS = {
  reportLost: 5,
  reportFound: 15,
  foundReturned: 45,
  valuableBonus: 35,
  lostRecovered: 25,
  claim: 8,
} as const;

export interface Tier {
  id: string;
  name: string;
  min: number;
  blurb: string;
}

export const TIERS: Tier[] = [
  { id: "spark", name: "First Spark", min: 0, blurb: "You started looking out for your school." },
  { id: "helper", name: "Helpful Hand", min: 40, blurb: "You report what you find instead of walking past it." },
  { id: "trusted", name: "Trusted Finder", min: 120, blurb: "Classmates trust you with their lost things." },
  { id: "honest", name: "Honest Heart", min: 220, blurb: "You return valuable items without being asked." },
  { id: "guardian", name: "Gold Guardian", min: 360, blurb: "The reason the lost-and-found box stays empty." },
];

export interface RewardStats {
  points: number;
  tier: Tier;
  nextTier: Tier | null;
  tierProgress: number;
  pointsToNext: number;
  totalReports: number;
  foundPosted: number;
  returned: number;
  reunited: number;
  valuableFound: number;
  valuableWaiting: number;
  claims: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
}

/** An item counts as valuable when the reporter flags it, or it is a high-risk category. */
export function isValuable(report: Report): boolean {
  if (report.valuable) return true;
  return report.type === "found" && VALUABLE_CATEGORIES.has(report.category);
}

export function computeStats(reports: Report[], claims: Claim[]): RewardStats {
  let points = 0;
  let foundPosted = 0;
  let returned = 0;
  let reunited = 0;
  let valuableFound = 0;
  let valuableWaiting = 0;

  for (const report of reports) {
    const valuable = isValuable(report);

    if (report.type === "found") {
      foundPosted += 1;
      points += POINTS.reportFound;
      if (valuable) {
        valuableFound += 1;
        points += POINTS.valuableBonus;
        if (report.status === "active") valuableWaiting += 1;
      }
      if (report.status === "resolved") {
        returned += 1;
        points += POINTS.foundReturned;
      }
    } else {
      points += POINTS.reportLost;
      if (report.status === "resolved") {
        reunited += 1;
        points += POINTS.lostRecovered;
      }
    }
  }

  points += claims.length * POINTS.claim;

  const tier = [...TIERS].reverse().find((t) => points >= t.min) ?? TIERS[0];
  const tierIndex = TIERS.indexOf(tier);
  const nextTier = TIERS[tierIndex + 1] ?? null;
  const tierProgress = nextTier
    ? Math.min(((points - tier.min) / (nextTier.min - tier.min)) * 100, 100)
    : 100;

  return {
    points,
    tier,
    nextTier,
    tierProgress,
    pointsToNext: nextTier ? Math.max(nextTier.min - points, 0) : 0,
    totalReports: reports.length,
    foundPosted,
    returned,
    reunited,
    valuableFound,
    valuableWaiting,
    claims: claims.length,
  };
}

const BADGE_DEFS: Array<{ id: string; name: string; description: string; test: (s: RewardStats) => boolean }> = [
  {
    id: "first-step",
    name: "First Report",
    description: "You posted your very first lost or found report.",
    test: (s) => s.totalReports >= 1,
  },
  {
    id: "good-finder",
    name: "Good Finder",
    description: "Handed in three or more things you found lying around.",
    test: (s) => s.foundPosted >= 3,
  },
  {
    id: "reunited",
    name: "Back Home",
    description: "One of your lost-item reports ended in a happy reunion.",
    test: (s) => s.reunited >= 1,
  },
  {
    id: "valuable-return",
    name: "Valuable Return",
    description: "Returned something valuable to its owner instead of keeping it.",
    test: (s) => s.returned >= 1 && s.valuableFound >= 1,
  },
  {
    id: "helper-streak",
    name: "Helper Streak",
    description: "Five items matched and closed through your reports.",
    test: (s) => s.returned + s.reunited >= 5,
  },
  {
    id: "community-hero",
    name: "Community Hero",
    description: "Ten or more reports posted for your school community.",
    test: (s) => s.totalReports >= 10,
  },
];

export function computeBadges(stats: RewardStats): Badge[] {
  return BADGE_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    description: def.description,
    earned: def.test(stats),
  }));
}

export interface HonourEntry {
  name: string;
  points: number;
  returned: number;
  valuable: number;
}

/**
 * Builds the honour board from named reporters on found reports.
 * Reports without a name are counted towards your own points only.
 */
export function buildHonourBoard(reports: Report[]): HonourEntry[] {
  const board = new Map<string, HonourEntry>();

  for (const report of reports) {
    if (report.type !== "found") continue;
    const name = (report.reporterName || "").trim();
    if (!name) continue;

    const entry = board.get(name) ?? { name, points: 0, returned: 0, valuable: 0 };
    entry.points += POINTS.reportFound;
    if (isValuable(report)) {
      entry.points += POINTS.valuableBonus;
      entry.valuable += 1;
    }
    if (report.status === "resolved") {
      entry.points += POINTS.foundReturned;
      entry.returned += 1;
    }
    board.set(name, entry);
  }

  return [...board.values()].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

/** How many points a freshly submitted report is worth. */
export function pointsForReport(report: Report): number {
  let points = report.type === "found" ? POINTS.reportFound : POINTS.reportLost;
  if (report.type === "found" && isValuable(report)) points += POINTS.valuableBonus;
  return points;
}
