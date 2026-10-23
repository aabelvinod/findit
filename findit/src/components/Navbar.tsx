import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Compass, Menu, X, Sun, Moon, PackageSearch, Sparkles } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const LINKS = [
  { to: "/browse", label: "Browse Items" },
  { to: "/report-lost", label: "Report Lost" },
  { to: "/report-found", label: "Report Found" },
  { to: "/my-reports", label: "My Reports" },
  { to: "/rewards", label: "Rewards" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`glass-nav sticky top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container-page flex h-17 items-center justify-between gap-3 py-2.5">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:rotate-[18deg]"
            style={{ background: "var(--grad-brand)", boxShadow: "var(--shadow-glow)" }}
          >
            <Compass size={20} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
              Find<span style={{ color: "var(--color-primary)" }}>It</span>
            </span>
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase" style={{ color: "var(--color-text-soft)" }}>
              Lost &amp; Found
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive ? "" : "hover:-translate-y-0.5"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? "#fff" : "var(--color-text-soft)",
                background: isActive ? "var(--grad-brand)" : "transparent",
                boxShadow: isActive ? "var(--shadow-glow)" : "none",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="icon-btn"
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link to="/rewards" className="btn btn-gold btn-sm hidden md:inline-flex">
            <Sparkles size={15} /> Rewards
          </Link>
          <Link to="/browse" className="btn btn-primary btn-sm hidden sm:inline-flex">
            <PackageSearch size={16} /> Search
          </Link>
          <button
            type="button"
            className="icon-btn lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="glass-nav anim-slide-down border-t lg:hidden"
          style={{ borderColor: "var(--color-border)" }}
          aria-label="Mobile navigation"
        >
          <div className="container-page flex flex-col gap-1 py-3">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3.5 py-3 text-sm font-medium transition-colors"
                style={({ isActive }) => ({
                  color: isActive ? "var(--color-primary)" : "var(--color-text)",
                  background: isActive ? "var(--color-primary-soft)" : "transparent",
                })}
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/browse" onClick={() => setOpen(false)} className="btn btn-primary btn-sm mt-2">
              <PackageSearch size={15} /> Search items
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
