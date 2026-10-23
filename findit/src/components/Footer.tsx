import { Link } from "react-router-dom";
import { Compass, ShieldAlert, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24">
      <div className="container-page">
        <div className="glass-panel grid grid-cols-1 gap-8 p-7 sm:grid-cols-2 md:grid-cols-4 sm:p-9">
          <div>
            <div className="mb-3 flex items-center gap-2.5 font-bold" style={{ color: "var(--color-text)" }}>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--grad-brand)", boxShadow: "var(--shadow-glow)" }}
              >
                <Compass size={17} />
              </span>
              <span className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                Find<span style={{ color: "var(--color-primary)" }}>It</span>
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-soft)" }}>
              A Little Kites project helping school communities reunite with lost belongings.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold" style={{ color: "var(--color-text)" }}>Explore</h4>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: "var(--color-text-soft)" }}>
              <li><Link to="/browse" className="transition-colors hover:text-[var(--color-primary)]">Browse Items</Link></li>
              <li><Link to="/report-lost" className="transition-colors hover:text-[var(--color-primary)]">Report Lost</Link></li>
              <li><Link to="/report-found" className="transition-colors hover:text-[var(--color-primary)]">Report Found</Link></li>
              <li><Link to="/my-reports" className="transition-colors hover:text-[var(--color-primary)]">My Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold" style={{ color: "var(--color-text)" }}>Project</h4>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: "var(--color-text-soft)" }}>
              <li><Link to="/about" className="transition-colors hover:text-[var(--color-primary)]">About FindIt</Link></li>
              <li>
                <Link to="/rewards" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--color-primary)]">
                  <Sparkles size={13} style={{ color: "var(--color-gold)" }} /> Honesty Rewards
                </Link>
              </li>
              <li><a href="/#how-it-works" className="transition-colors hover:text-[var(--color-primary)]">How it works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              <ShieldAlert size={15} /> Privacy note
            </h4>
            <p className="text-sm" style={{ color: "var(--color-text-soft)" }}>
              FindIt stores data only in this browser. Never share phone numbers, addresses, or ID numbers in public reports.
            </p>
          </div>
        </div>
      </div>

      <div
        className="container-page mt-4 flex flex-col items-center justify-between gap-3 border-t py-5 text-center text-xs sm:flex-row sm:text-left"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-soft)" }}
      >
        <span>Built for the Little Kites IT initiative · Class 10 Web Development Project</span>
        <span>
          Designed &amp; developed by{" "}
          <Link to="/about" className="font-semibold transition-colors hover:text-[var(--color-primary)]">
            Aabel Vinod
          </Link>
          , a 15-year-old web developer.
        </span>
      </div>
    </footer>
  );
}
