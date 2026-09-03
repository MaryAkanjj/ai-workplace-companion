import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/email", label: "Email" },
  { to: "/notes", label: "Notes" },
  { to: "/planner", label: "Planner" },
] as const;

export function AiNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`glass-soft flex items-start gap-3 rounded-3xl ${compact ? "p-4" : "p-5 sm:p-6"}`}
    >
      <div className="bg-lilac/15 grid size-9 shrink-0 place-items-center rounded-2xl">
        <ShieldCheck className="text-lilac size-4.5" />
      </div>
      <div>
        <h3 className="font-display text-base font-semibold">Responsible by design</h3>
        <p className="text-inksoft mt-1.5 max-w-2xl text-sm leading-relaxed">
          AI-generated content should be reviewed by the user before being used. The AI may make
          mistakes or misunderstand information. Always verify important dates, names, decisions,
          deadlines and other details.
        </p>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-cream text-ink font-sans relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="f1 bg-lilac/30 absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl" />
        <div className="f2 bg-mint/25 absolute top-40 right-0 h-80 w-80 rounded-full blur-3xl" />
        <div className="f3 bg-peach/25 absolute bottom-0 left-1/3 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-6 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="glass grid size-9 place-items-center rounded-xl shadow-sm">
            <Sparkles className="text-lilac size-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">Lumina</span>
        </Link>
        <nav className="glass flex items-center gap-1 rounded-full p-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-card text-ink font-medium shadow-sm" }}
              inactiveProps={{ className: "text-inksoft hover:text-ink" }}
              className="rounded-full px-3 py-1.5 transition sm:px-3.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="from-lilac to-mint text-primary-foreground hidden size-9 place-items-center rounded-full bg-gradient-to-br text-xs font-semibold shadow-sm sm:grid">
          AK
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 sm:px-8">{children}</main>

      <footer className="text-inksoft mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 pt-10 pb-10 text-xs sm:flex-row sm:px-8">
        <span>Lumina — an AI Workplace Assistant prototype</span>
        <span>Always review AI output before you use it.</span>
      </footer>
    </div>
  );
}
