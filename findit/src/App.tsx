import { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastContainer from "./components/Toast";
import ItemModal from "./components/ItemModal";
import AuroraBackground from "./components/AuroraBackground";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import { ThemeProvider } from "./hooks/useTheme";
import { ToastProvider } from "./hooks/useToast";
import { ReportsProvider } from "./hooks/useReports";
import type { Report } from "./types";

const Home = lazy(() => import("./pages/Home"));
const BrowseItems = lazy(() => import("./pages/BrowseItems"));
const ReportLost = lazy(() => import("./pages/ReportLost"));
const ReportFound = lazy(() => import("./pages/ReportFound"));
const MyReports = lazy(() => import("./pages/MyReports"));
const Rewards = lazy(() => import("./pages/Rewards"));
const About = lazy(() => import("./pages/About"));
const ItemDetailsPage = lazy(() => import("./pages/ItemDetailsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} />
    </div>
  );
}

function AppShell() {
  const [quickView, setQuickView] = useState<Report | null>(null);

  return (
    <BrowserRouter>
      <AuroraBackground />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home onViewReport={setQuickView} />} />
            <Route path="/browse" element={<BrowseItems onViewReport={setQuickView} />} />
            <Route path="/report-lost" element={<ReportLost />} />
            <Route path="/report-found" element={<ReportFound />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/rewards" element={<Rewards onViewReport={setQuickView} />} />
            <Route path="/about" element={<About />} />
            <Route path="/item/:id" element={<ItemDetailsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <BackToTop />
      <ToastContainer />

      {quickView && (
        <ItemModal
          report={quickView}
          onClose={() => setQuickView(null)}
          onSelectReport={(next) => setQuickView(next)}
        />
      )}
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ReportsProvider>
          <AppShell />
        </ReportsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
