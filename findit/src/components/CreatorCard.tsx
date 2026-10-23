import { Code2, Coffee, Sparkles, Heart } from "lucide-react";

const SKILLS = ["React", "TypeScript", "Vite", "Tailwind CSS", "UI design", "localStorage"];

export default function CreatorCard() {
  return (
    <section className="glass-panel relative overflow-hidden p-6 sm:p-8">
      {/* Decorative glow behind the card content. */}
      <span
        className="anim-breathe pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
        style={{ background: "radial-gradient(circle, var(--ambient-2), transparent 68%)" }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Monogram — kept as initials so no photo of a minor is published. */}
        <div className="shrink-0">
          <div
            className="anim-float-tilt relative flex h-24 w-24 items-center justify-center rounded-3xl"
            style={{ background: "var(--grad-brand)", boxShadow: "var(--shadow-glow)" }}
          >
            <span
              className="flex h-[86px] w-[86px] items-center justify-center rounded-[22px]"
              style={{ background: "var(--glass-bg-strong)", color: "var(--color-text)" }}
            >
              <span
                className="text-3xl font-extrabold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                AV
              </span>
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <span className="eyebrow">
            <Sparkles size={13} /> About the developer
          </span>
          <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Created by Aabel Vinod
          </h2>
          <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-primary)" }}>
            15-year-old web developer · Class 10, Little Kites
          </p>

          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
            FindIt was designed, built and tested by one fifteen-year-old who got tired of watching
            water bottles and notebooks disappear into a cardboard box in the corridor. Everything on
            this site — the match scoring, the glass interface, the rewards system — was written from
            scratch as a school web development project.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span key={skill} className="chip" style={{ cursor: "default" }}>
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs" style={{ color: "var(--color-text-soft)" }}>
            <span className="flex items-center gap-1.5">
              <Code2 size={14} /> Hand-written React, no page builders
            </span>
            <span className="flex items-center gap-1.5">
              <Coffee size={14} /> Powered by school breaks and filter coffee
            </span>
            <span className="flex items-center gap-1.5">
              <Heart size={14} /> Built for the students of Little Kites
            </span>
          </div>

          {/* Signature line in a handwriting face. */}
          <p
            className="mt-5 text-2xl"
            style={{ fontFamily: "Caveat, cursive", color: "var(--color-text)" }}
          >
            — Aabel Vinod
          </p>
        </div>
      </div>
    </section>
  );
}
