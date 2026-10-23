import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Claim, NewReportInput, Report } from "../types";
import {
  createReport,
  generateSampleReports,
  loadClaims,
  loadReports,
  saveClaims,
  saveReports,
} from "../utils/storage";

interface ReportsContextValue {
  reports: Report[];
  claims: Claim[];
  addReport: (input: NewReportInput) => Report;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  toggleResolved: (id: string) => void;
  replaceAllReports: (reports: Report[]) => void;
  addSampleData: () => number;
  removeSampleData: () => number;
  addClaim: (reportId: string, message: string) => void;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function ReportsProvider({ children }: { children: ReactNode }) {
  // Reports are loaded from storage exactly once when the app mounts.
  const [reports, setReports] = useState<Report[]>(() => loadReports());
  const [claims, setClaims] = useState<Claim[]>(() => loadClaims());

  const persist = useCallback((next: Report[]) => {
    setReports(next);
    saveReports(next);
  }, []);

  const addReport = useCallback(
    (input: NewReportInput) => {
      const report = createReport(input);
      setReports((prev) => {
        const next = [report, ...prev];
        saveReports(next);
        return next;
      });
      return report;
    },
    []
  );

  const updateReport = useCallback(
    (id: string, updates: Partial<Report>) => {
      setReports((prev) => {
        const next = prev.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        );
        saveReports(next);
        return next;
      });
    },
    []
  );

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveReports(next);
      return next;
    });
  }, []);

  const toggleResolved = useCallback((id: string) => {
    setReports((prev) => {
      const next = prev.map((r) =>
        r.id === id
          ? { ...r, status: (r.status === "active" ? "resolved" : "active") as Report["status"], updatedAt: new Date().toISOString() }
          : r
      );
      saveReports(next);
      return next;
    });
  }, []);

  const replaceAllReports = useCallback((next: Report[]) => {
    persist(next);
  }, [persist]);

  const addSampleData = useCallback(() => {
    const samples = generateSampleReports();
    let added = 0;
    setReports((prev) => {
      const existingSampleTitles = new Set(prev.filter((r) => r.isSample).map((r) => r.title));
      const toAdd = samples.filter((s) => !existingSampleTitles.has(s.title));
      added = toAdd.length;
      const next = [...toAdd, ...prev];
      saveReports(next);
      return next;
    });
    return added;
  }, []);

  const removeSampleData = useCallback(() => {
    let removed = 0;
    setReports((prev) => {
      removed = prev.filter((r) => r.isSample).length;
      const next = prev.filter((r) => !r.isSample);
      saveReports(next);
      return next;
    });
    return removed;
  }, []);

  const addClaim = useCallback((reportId: string, message: string) => {
    setClaims((prev) => {
      const next: Claim[] = [
        ...prev,
        { id: `CLM-${Date.now()}`, reportId, message, createdAt: new Date().toISOString() },
      ];
      saveClaims(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      reports,
      claims,
      addReport,
      updateReport,
      deleteReport,
      toggleResolved,
      replaceAllReports,
      addSampleData,
      removeSampleData,
      addClaim,
    }),
    [reports, claims, addReport, updateReport, deleteReport, toggleResolved, replaceAllReports, addSampleData, removeSampleData, addClaim]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports(): ReportsContextValue {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error("useReports must be used within a ReportsProvider");
  return ctx;
}
