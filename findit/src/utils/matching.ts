// Lightweight, explainable "possible match" engine.
// No external AI is used — this is a transparent, weighted scoring system.
// A match is only a suggestion; people must verify details themselves.

import type { Report } from "../types";

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "of", "in", "on", "at", "with", "for", "to",
  "is", "was", "it", "my", "has", "have", "had", "this", "that", "near",
  "found", "lost", "item", "some", "very", "small", "big",
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 999;
  return Math.abs(a - b) / (1000 * 60 * 60 * 24);
}

export interface MatchResult {
  report: Report;
  score: number; // 0-100
  label: "Strong" | "Possible" | "Weak";
  reasons: string[];
}

/** Scores how well two reports (one lost, one found) might relate to each other. */
export function scoreReportPair(a: Report, b: Report): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Category match — the strongest, most reliable signal.
  if (a.category && b.category && a.category === b.category) {
    score += 34;
    reasons.push(`Same category (${a.category})`);
  }

  // Shared keywords from title + description.
  const tokensA = new Set([...tokenize(a.title), ...tokenize(a.description), ...tokenize(a.color || "")]);
  const tokensB = new Set([...tokenize(b.title), ...tokenize(b.description), ...tokenize(b.color || "")]);
  const shared = [...tokensA].filter((t) => tokensB.has(t));
  if (shared.length > 0) {
    const keywordScore = Math.min(30, shared.length * 9);
    score += keywordScore;
    reasons.push(`Shared keywords: ${shared.slice(0, 4).join(", ")}`);
  }

  // Title similarity (helps catch near-identical names like "Water Bottle").
  const titleA = normalizeText(a.title);
  const titleB = normalizeText(b.title);
  if (titleA && titleB && (titleA.includes(titleB) || titleB.includes(titleA))) {
    score += 12;
    reasons.push("Very similar item name");
  }

  // Location proximity (simple case-insensitive partial match).
  const locA = normalizeText(a.location);
  const locB = normalizeText(b.location);
  if (locA && locB && (locA === locB || locA.includes(locB) || locB.includes(locA))) {
    score += 14;
    reasons.push(`Nearby location (${a.location})`);
  }

  // Date relevance — found reports close in time to the lost date score higher.
  const gap = daysBetween(a.eventDate, b.eventDate);
  if (gap <= 1) {
    score += 10;
    reasons.push("Reported on the same or adjacent day");
  } else if (gap <= 5) {
    score += 6;
    reasons.push("Reported within a few days of each other");
  } else if (gap <= 14) {
    score += 2;
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), reasons };
}

function labelFor(score: number): MatchResult["label"] {
  if (score >= 60) return "Strong";
  if (score >= 35) return "Possible";
  return "Weak";
}

/**
 * Finds possible matches for a given report among the opposite report type.
 * Only returns results with a meaningful score, sorted best-first.
 */
export function findPossibleMatches(report: Report, allReports: Report[], limit = 5): MatchResult[] {
  const opposite = report.type === "lost" ? "found" : "lost";
  const candidates = allReports.filter((r) => r.type === opposite && r.status === "active" && r.id !== report.id);

  const scored = candidates
    .map((candidate) => {
      const { score, reasons } = scoreReportPair(report, candidate);
      return { report: candidate, score, reasons, label: labelFor(score) };
    })
    .filter((m) => m.score >= 25)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
