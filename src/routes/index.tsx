import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarRange, Mail, NotebookPen } from "lucide-react";
import { AppLayout, AiNotice } from "@/components/AppLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumina — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings and plan your week with three calm AI tools built for everyday work.",
      },
      { property: "og:title", content: "Lumina — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Three AI tools for clearer emails, sharper meeting notes and better planning.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppLayout>
      <section className="grid items-center gap-10 pt-14 pb-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="glass text-inksoft inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
            <span className="bg-mint size-1.5 rounded-full" /> AI Workplace Assistant
          </div>
          <h1 className="font-display mt-5 text-[2.6rem] leading-[1.05] font-medium tracking-tight sm:text-5xl">
            Work feels lighter when <span className="text-lilac">everyday</span> tasks are handled
            for you.
          </h1>
          <p className="text-inksoft mt-5 max-w-md text-[15px] leading-relaxed">
            Draft emails, summarize meetings, and plan your week with three calm AI tools — built
            for people, not power users.
          </p>
          <div className="mt-7">
            <Link
              to="/email"
              className="bg-ink text-primary-foreground inline-flex rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition hover:opacity-90"
            >
              Explore the tools
            </Link>
          </div>
          <div className="text-inksoft mt-6 flex items-center gap-2 text-xs">
            <span className="bg-peach size-1.5 rounded-full" /> No sign-up to try the prototype
          </div>
        </div>

        <div className="relative">
          <div className="glass shadow-lilac/10 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Email generated</span>
              <span className="bg-mint/15 text-mint rounded-full px-2.5 py-1 text-[11px] font-medium">
                Tone · Formal
              </span>
            </div>
            <p className="text-ink/80 mt-4 font-mono text-[12.5px] leading-relaxed">
              "Hi Priya, following our sync, I've attached the Q3 forecast. Could you flag any
              changes before Thursday's client review? Thank you."
            </p>
            <div className="mt-4 flex gap-2">
              <span className="bg-lilac/15 text-lilac flex-1 rounded-xl py-2 text-center text-xs font-semibold">
                Copy
              </span>
              <span className="bg-card border-border flex-1 rounded-xl border py-2 text-center text-xs font-medium">
                Regenerate
              </span>
            </div>
          </div>
          <div className="glass absolute -bottom-6 -left-5 w-52 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="bg-mint size-2 rounded-full" /> Meeting summary
            </div>
            <p className="text-inksoft mt-2 text-[11px] leading-snug">
              3 decisions · 4 action items · 1 deadline
            </p>
          </div>
        </div>
      </section>

      <section className="pt-10 pb-10">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-medium tracking-tight">
            Three tools, one calm workspace
          </h2>
          <p className="text-inksoft mt-1 text-sm">Each one does a single job really well.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Link
            to="/email"
            className="glass-soft rounded-3xl p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="bg-lilac/15 grid size-11 place-items-center rounded-2xl">
              <Mail className="text-lilac size-5" />
            </div>
            <h3 className="font-display mt-4 text-lg font-semibold">Smart Email Generator</h3>
            <p className="text-inksoft mt-1.5 text-sm leading-relaxed">
              Turn a rough idea into a clear, on-tone message in a few taps.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Formal", "Persuasive", "Client"].map((tag) => (
                <span
                  key={tag}
                  className="bg-lilac/12 text-lilac rounded-full px-2.5 py-1 text-[11px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="bg-ink text-primary-foreground mt-5 block rounded-2xl py-2.5 text-center text-xs font-semibold">
              Open email generator
            </span>
          </Link>

          <Link
            to="/notes"
            className="glass-soft rounded-3xl p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="bg-mint/15 grid size-11 place-items-center rounded-2xl">
              <NotebookPen className="text-mint size-5" />
            </div>
            <h3 className="font-display mt-4 text-lg font-semibold">Meeting Notes Summarizer</h3>
            <p className="text-inksoft mt-1.5 text-sm leading-relaxed">
              Paste a long transcript; get decisions, action items and deadlines.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-mint/25 text-mint grid size-4 place-items-center rounded-full text-[9px] font-bold">
                  1
                </span>
                Finalize onboarding copy <span className="text-inksoft ml-auto">Rae · Fri</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-mint/25 text-mint grid size-4 place-items-center rounded-full text-[9px] font-bold">
                  2
                </span>
                Draft launch checklist <span className="text-inksoft ml-auto">No owner</span>
              </div>
            </div>
            <span className="bg-mint/15 text-mint mt-5 block rounded-2xl py-2.5 text-center text-xs font-semibold">
              Summarize notes
            </span>
          </Link>

          <Link
            to="/planner"
            className="glass-soft rounded-3xl p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="bg-peach/15 grid size-11 place-items-center rounded-2xl">
              <CalendarRange className="text-peach size-5" />
            </div>
            <h3 className="font-display mt-4 text-lg font-semibold">AI Task Planner</h3>
            <p className="text-inksoft mt-1.5 text-sm leading-relaxed">
              Drop in tasks and get a prioritized, time-boxed schedule.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="font-medium">09:00</span>
              <span className="flex items-center gap-1.5 font-semibold">
                Ship release notes
                <span className="bg-peach/20 text-peach rounded-full px-2 py-0.5 text-[10px] font-semibold">
                  High
                </span>
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="font-medium">11:00</span>
              <span className="text-inksoft font-medium">Review pull requests</span>
            </div>
            <span className="bg-peach/15 text-peach mt-5 block rounded-2xl py-2.5 text-center text-xs font-semibold">
              Generate plan
            </span>
          </Link>
        </div>
      </section>

      <section className="pb-4">
        <AiNotice />
      </section>
    </AppLayout>
  );
}
