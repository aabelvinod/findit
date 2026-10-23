import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Code2,
  Users,
  ShieldAlert,
  Rocket,
  Target,
  Sparkles,
  Layers,
} from "lucide-react";
import Reveal from "../components/Reveal";
import CreatorCard from "../components/CreatorCard";

const TECH = [
  "React 19",
  "Vite",
  "TypeScript",
  "Tailwind CSS v4",
  "Custom design tokens",
  "CSS Glassmorphism",
  "LocalStorage",
  "Lucide Icons",
];

const FUTURE = [
  "A secure backend with real accounts for cross-device syncing.",
  "Moderation tools for school staff to verify and manage reports.",
  "Push or email notifications when a possible match appears.",
  "QR-code tagging for school property such as library books.",
  "A verified honour board the school can recognise in assembly.",
];

const VALUES = [
  {
    icon: Target,
    title: "Honesty, made visible",
    text: "Returning something valuable should count for something. FindIt tracks it and shows it off.",
  },
  {
    icon: ShieldAlert,
    title: "Safe by design",
    text: "No phone numbers, no addresses, no ID photos — hand-overs go through a teacher or the office.",
  },
  {
    icon: Layers,
    title: "Light and fast",
    text: "Runs on a school laptop or an old phone: no server, no tracking, animations stay on the GPU.",
  },
];

export default function About() {
  return (
    <div className="container-page max-w-4xl py-12 md:py-16">
      {/* Header */}
      <Reveal className="text-center">
        <span
          className="anim-float mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-white"
          style={{ background: "var(--grad-brand)", boxShadow: "var(--shadow-glow)" }}
        >
          <Compass size={28} />
        </span>
        <span className="eyebrow mt-6 justify-center">
          <Sparkles size={13} /> The project
        </span>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
          <span className="text-gradient">FindIt</span> — Smart Lost &amp; Found
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: "var(--color-text-soft)" }}>
          Little Kites IT Initiative · Class 10 Web Development Project
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed" style={{ color: "var(--color-text)" }}>
          FindIt is an educational web application built for the Little Kites IT initiative. It shows
          how modern front-end technology can help a school organise lost-and-found reports, surface
          possible matches, and recognise the students who hand things in.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/browse" className="btn btn-primary">
            Browse the board
          </Link>
          <Link to="/rewards" className="btn btn-gold">
            See the rewards
          </Link>
        </div>
      </Reveal>

      {/* Creator */}
      <Reveal className="mt-12" delay={80}>
        <CreatorCard />
      </Reveal>

      {/* Values */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {VALUES.map((value, i) => (
          <Reveal key={value.title} className="glass-card p-5" delay={i * 80}>
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: "var(--grad-brand-soft)", color: "var(--color-primary)" }}
            >
              <value.icon size={19} />
            </span>
            <h2 className="mt-3 font-bold" style={{ color: "var(--color-text)" }}>
              {value.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
              {value.text}
            </p>
          </Reveal>
        ))}
      </div>

      {/* Story sections */}
      <div className="mt-12">
        <Section icon={Target} title="The problem" delay={0}>
          School items like water bottles, notebooks and bags get lost every day, and there is rarely
          an organised way to report or search for them. Items end up forgotten in a lost-and-found
          box, unclaimed for weeks.
        </Section>

        <Section icon={Rocket} title="The proposed solution" delay={60}>
          FindIt gives students one place to report a lost or found item, browse active reports, and
          see explainable &quot;possible match&quot; suggestions based on category, keywords, location
          and dates — helping people reconnect with their belongings faster.
        </Section>

        <Section icon={Users} title="Intended users" delay={0}>
          Students, teachers and school staff who want a lightweight, shared way to track lost and
          found belongings across their school community.
        </Section>

        <Section icon={Code2} title="Technology stack" delay={60}>
          <ul className="mt-2 flex flex-wrap gap-2">
            {TECH.map((t) => (
              <li key={t} className="chip" style={{ cursor: "default" }}>
                {t}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={ShieldAlert} title="Privacy limitations" delay={0}>
          <p>
            This is a frontend-only demonstration. All reports are stored using your browser&apos;s
            LocalStorage, which means:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Reports do not sync across devices or browsers.</li>
            <li>Anyone using the same browser profile can see locally saved reports.</li>
            <li>There is no real user authentication or server-side moderation.</li>
            <li>LocalStorage is not a secure database — never store sensitive personal data.</li>
          </ul>
          <p className="mt-2">
            A real multi-user school system would require a secure backend, access controls,
            moderation tools and proper data-protection measures.
          </p>
        </Section>

        <Section icon={Rocket} title="Future improvements" delay={60}>
          <ul className="list-disc space-y-1 pl-5">
            {FUTURE.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Section>
      </div>

      <Reveal className="glass-panel mt-12 p-7 text-center">
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
          Have a lost item, a found one, or feedback on the project?
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link to="/report-lost" className="btn btn-primary btn-sm">
            Report something lost
          </Link>
          <Link to="/report-found" className="btn btn-secondary btn-sm">
            Report something found
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof Target;
  title: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <section className="glass-card mb-4 p-6">
        <h2 className="mb-2 flex items-center gap-2.5 text-base font-bold" style={{ color: "var(--color-text)" }}>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: "var(--grad-brand-soft)", color: "var(--color-primary)" }}
          >
            <Icon size={16} />
          </span>
          {title}
        </h2>
        <div className="text-sm leading-relaxed" style={{ color: "var(--color-text-soft)" }}>
          {children}
        </div>
      </section>
    </Reveal>
  );
}
