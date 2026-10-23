// Shared type definitions for FindIt.
// Kept intentionally small and beginner-friendly.

export type ReportType = "lost" | "found";
export type ReportStatus = "active" | "resolved";

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  category: string;
  description: string;
  location: string;
  eventDate: string; // date lost / date found, YYYY-MM-DD
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  status: ReportStatus;
  image: string | null; // compressed base64 data URL, or null
  color?: string; // optional distinguishing feature (lost items)
  instructions?: string; // safe recovery instructions (lost items)
  handedToStaff?: boolean; // found items
  valuable?: boolean; // found items worth an honesty reward
  reporterName?: string; // optional name for the honour board
  isSample?: boolean; // demo data flag
}

export interface Claim {
  id: string;
  reportId: string;
  message: string;
  createdAt: string;
}

export type NewReportInput = Omit<
  Report,
  "id" | "createdAt" | "updatedAt" | "status" | "isSample"
>;

export const CATEGORIES = [
  "Books & Notebooks",
  "Water Bottles",
  "Bags & Pencil Cases",
  "School Accessories",
  "Clothing & Uniforms",
  "Umbrellas",
  "Electronics",
  "Sports Equipment",
  "Keys & Personal Items",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
