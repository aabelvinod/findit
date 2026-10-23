// Data-management layer for FindIt.
// Every piece of code in the app that needs to read or write reports
// should go through these functions instead of touching localStorage directly.

import type { Claim, NewReportInput, Report } from "../types";
import { CATEGORIES } from "../types";

const REPORTS_KEY = "findit_reports_v1";
const CLAIMS_KEY = "findit_claims_v1";
const STORAGE_VERSION = 1;

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__findit_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const storageAvailable = isLocalStorageAvailable();

export function generateId(prefix = "FIT"): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().split("-")[0]
      : Math.random().toString(36).slice(2, 10);
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  return `${prefix}-${stamp}${random}`.toUpperCase();
}

/** Loads all reports from storage. Returns [] if storage is empty or unavailable. */
export function loadReports(): Report[] {
  if (!storageAvailable) return [];
  try {
    const raw = window.localStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidReport);
  } catch (err) {
    console.warn("FindIt: could not read saved reports.", err);
    return [];
  }
}

/** Persists the full report list. Handles quota errors gracefully. */
export function saveReports(reports: Report[]): { ok: boolean; error?: string } {
  if (!storageAvailable) {
    return { ok: false, error: "Local storage is not available in this browser." };
  }
  try {
    window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    return { ok: true };
  } catch (err) {
    console.error("FindIt: failed to save reports.", err);
    const isQuota = err instanceof DOMException && /quota/i.test(err.name + err.message);
    return {
      ok: false,
      error: isQuota
        ? "Storage is full. Try removing an image or deleting older reports."
        : "Could not save your data. Please try again.",
    };
  }
}

export function createReport(input: NewReportInput, isSample = false): Report {
  const now = new Date().toISOString();
  return {
    ...input,
    id: generateId(input.type === "lost" ? "LST" : "FND"),
    createdAt: now,
    updatedAt: now,
    status: "active",
    isSample,
  };
}

export function loadClaims(): Claim[] {
  if (!storageAvailable) return [];
  try {
    const raw = window.localStorage.getItem(CLAIMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveClaims(claims: Claim[]): void {
  if (!storageAvailable) return;
  try {
    window.localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  } catch (err) {
    console.warn("FindIt: could not save claim.", err);
  }
}

/** Basic structural validation used both when loading and importing data. */
export function isValidReport(value: unknown): value is Report {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    (r.type === "lost" || r.type === "found") &&
    typeof r.title === "string" &&
    typeof r.category === "string" &&
    typeof r.description === "string" &&
    typeof r.location === "string" &&
    typeof r.eventDate === "string" &&
    typeof r.createdAt === "string" &&
    (r.status === "active" || r.status === "resolved")
  );
}

export interface ImportResult {
  ok: boolean;
  added: number;
  skipped: number;
  message: string;
}

/** Validates and merges an imported backup without wiping existing data. */
export function importReportsBackup(jsonText: string, existing: Report[]): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false, added: 0, skipped: 0, message: "That file is not valid JSON." };
  }

  const incoming: unknown[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { reports?: unknown[] })?.reports)
      ? (parsed as { reports: unknown[] }).reports
      : [];

  if (incoming.length === 0) {
    return { ok: false, added: 0, skipped: 0, message: "No reports were found in that file." };
  }

  const existingIds = new Set(existing.map((r) => r.id));
  const validNew: Report[] = [];
  let skipped = 0;

  for (const item of incoming) {
    if (isValidReport(item) && !existingIds.has(item.id)) {
      validNew.push(item);
      existingIds.add(item.id);
    } else {
      skipped += 1;
    }
  }

  if (validNew.length === 0) {
    return { ok: false, added: 0, skipped, message: "No new valid reports could be imported." };
  }

  const merged = [...existing, ...validNew];
  const result = saveReports(merged);
  if (!result.ok) {
    return { ok: false, added: 0, skipped, message: result.error || "Could not save imported data." };
  }

  return {
    ok: true,
    added: validNew.length,
    skipped,
    message: `Imported ${validNew.length} report${validNew.length === 1 ? "" : "s"}.${
      skipped ? ` Skipped ${skipped} invalid record${skipped === 1 ? "" : "s"}.` : ""
    }`,
  };
}

export function exportReportsBackup(reports: Report[]): string {
  return JSON.stringify(
    {
      app: "FindIt",
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      reports,
    },
    null,
    2
  );
}

/* ------------------------------------------------------------------ */
/* Sample / demonstration data                                         */
/* ------------------------------------------------------------------ */

interface SampleSeed
  extends Pick<Report, "type" | "title" | "category" | "description" | "location" | "color"> {
  daysAgo: number;
  valuable?: boolean;
  reporterName?: string;
  returnedToOwner?: boolean;
}

const SAMPLE_SEED: SampleSeed[] = [
  { type: "lost", title: "Blue Water Bottle", category: "Water Bottles", description: "Steel bottle with a black cap and a cricket sticker on the side.", location: "School Library", color: "Blue", daysAgo: 1 },
  { type: "found", title: "Maths Notebook", category: "Books & Notebooks", description: "Spiral notebook, class 10 maths, name page torn out.", location: "Classroom 10-B", daysAgo: 2, reporterName: "Aarav Menon · 10-B" },
  { type: "lost", title: "Grey Backpack", category: "Bags & Pencil Cases", description: "Grey backpack with a broken front zip and a keychain.", location: "Basketball Court", color: "Grey", daysAgo: 3, returnedToOwner: true },
  { type: "found", title: "Black Umbrella", category: "Umbrellas", description: "Compact black umbrella, slightly bent rib on one side.", location: "Main Gate", daysAgo: 4, reporterName: "Diya Shroff · 9-A" },
  { type: "lost", title: "Wired Earphones", category: "Electronics", description: "White wired earphones in a small blue pouch.", location: "Computer Lab", color: "White", daysAgo: 5 },
  { type: "found", title: "House Keys", category: "Keys & Personal Items", description: "Two keys on a red keyring with a small bell.", location: "School Office Corridor", daysAgo: 6, valuable: true, reporterName: "Rhea Thomas · 10-A", returnedToOwner: true },
  { type: "lost", title: "School Sweater", category: "Clothing & Uniforms", description: "Navy blue sweater, size M, name tag washed off.", location: "Assembly Ground", color: "Navy Blue", daysAgo: 7 },
  { type: "found", title: "Badminton Racket", category: "Sports Equipment", description: "Yonex racket with a torn grip, found after sports period.", location: "Sports Room", daysAgo: 8, valuable: true, reporterName: "Kabir Nair · 9-C" },
  { type: "lost", title: "Pencil Case", category: "Bags & Pencil Cases", description: "Clear pencil case with geometry tools and a calculator.", location: "Classroom 9-A", color: "Transparent", daysAgo: 9 },
  { type: "found", title: "Water Bottle", category: "Water Bottles", description: "Pink bottle with cartoon stickers, half full.", location: "Canteen", daysAgo: 10, reporterName: "Meera Iyer · 8-B" },
  { type: "found", title: "Scientific Calculator", category: "Electronics", description: "Casio fx-991 with a class label on the back cover.", location: "Exam Hall", daysAgo: 11, valuable: true, reporterName: "Arjun Pillai · 10-C", returnedToOwner: true },
  { type: "found", title: "Smart Watch", category: "Electronics", description: "Black strap band, small crack on the screen corner.", location: "Swimming Pool Deck", daysAgo: 12, valuable: true, reporterName: "Sana Qureshi · 9-B" },
];

export function generateSampleReports(): Report[] {
  return SAMPLE_SEED.map((seed, index) => {
    const created = new Date();
    created.setDate(created.getDate() - seed.daysAgo);
    const eventDate = created.toISOString().slice(0, 10);
    const report = createReport(
      {
        type: seed.type,
        title: seed.title,
        category: seed.category,
        description: seed.description,
        location: seed.location,
        eventDate,
        image: null,
        color: seed.color,
        instructions: seed.type === "lost" ? "Please hand over to the school office if found." : undefined,
        handedToStaff: seed.type === "found" ? true : undefined,
        valuable: seed.type === "found" ? seed.valuable : undefined,
        reporterName: seed.type === "found" ? seed.reporterName : undefined,
      },
      true
    );

    return {
      ...report,
      createdAt: new Date(Date.now() - index * 36e5).toISOString(),
      status: seed.returnedToOwner ? "resolved" : report.status,
    } as Report;
  });
}

export function hasSampleData(reports: Report[]): boolean {
  return reports.some((r) => r.isSample);
}

export { CATEGORIES };
