import { Link } from "react-router-dom";
import { Compass, Home, Search } from "lucide-react";
import Reveal from "../components/Reveal";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Reveal direction="zoom">
        <div className="glass-card max-w-lg p-8 sm:p-12">
          <p
            className="anim-breathe text-gradient mb-3 text-7xl font-extrabold leading-none tracking-tight sm:text-8xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </p>
          <span
            className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--grad-brand)", boxShadow: "var(--shadow-glow)" }}
          >
            <Compass size={26} className="anim-spin-slow" />
          </span>
          <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            This page went missing
          </h1>
          <p className="mx-auto mb-7 max-w-sm text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
            The link you followed doesn't lead anywhere on this site. Check the address, or pick up
            from the lost-and-found board below.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/browse" className="btn btn-primary btn-lg">
              <Search size={18} /> Browse items
            </Link>
            <Link to="/" className="btn btn-secondary btn-lg">
              <Home size={18} /> Back to home
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
