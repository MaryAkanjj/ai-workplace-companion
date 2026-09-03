import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarRange, Plus, RotateCcw, Trash2 } from "lucide-react";
import { AppLayout, AiNotice } from "@/components/AppLayout";
import { CopyButton, ErrorMessage, FormattedOutput, LoadingLines } from "@/components/AiOutput";
import { generatePlan } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Lumina AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Enter tasks with deadlines, durations and priorities to get a prioritized daily or weekly schedule with time-management tips.",
      },
      { property: "og:title", content: "AI Task Planner — Lumina" },
      {
        property: "og:description",
        content: "Turn a task list into a prioritized daily or weekly plan.",
      },
    ],
  }),
  component: PlannerPage,
});

type Priority = "High" | "Medium" | "Low";
type Task = { name: string; deadline: string; duration: string; priority: Priority };

const emptyTask: Task = { name: "", deadline: "", duration: "", priority: "Medium" };
const priorities: Priority[] = ["High", "Medium", "Low"];

function PlannerPage() {
  const [range, setRange] = useState<"Daily" | "Weekly">("Daily");
  const [tasks, setTasks] = useState<Task[]>([{ ...emptyTask }]);

  const fn = useServerFn(generatePlan);
  const mutation = useMutation({
    mutationFn: (input: { range: string; tasks: Task[] }) => fn({ data: input as never }),
  });

  const plan = mutation.data?.text ?? "";
  const validTasks = tasks.filter((t) => t.name.trim());

  const update = (i: number, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  return (
    <AppLayout>
      <section className="pt-10 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-peach/15 grid size-11 place-items-center rounded-2xl">
              <CalendarRange className="text-peach size-5" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-medium tracking-tight">AI Task Planner</h1>
              <p className="text-inksoft mt-1 text-sm">
                A prioritized, time-boxed plan built from your task list.
              </p>
            </div>
          </div>
          <div className="glass flex items-center gap-1 rounded-full p-1 text-sm">
            {(["Daily", "Weekly"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`rounded-full px-4 py-1.5 transition ${
                  range === r ? "bg-card text-ink font-medium shadow-sm" : "text-inksoft"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-soft rounded-3xl p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">Your tasks</h2>

          <div className="mt-4 space-y-3">
            {tasks.map((task, i) => (
              <div key={i} className="bg-card border-border rounded-2xl border p-4">
                <div className="flex items-center gap-2">
                  <input
                    value={task.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    placeholder={`Task ${i + 1} name`}
                    className="placeholder:text-inksoft/70 flex-1 bg-transparent text-sm font-medium focus:outline-none"
                  />
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      aria-label="Remove task"
                      onClick={() => setTasks((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-inksoft hover:text-destructive transition"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <input
                    value={task.deadline}
                    onChange={(e) => update(i, { deadline: e.target.value })}
                    placeholder="Deadline (e.g. Fri 14 Mar)"
                    className="bg-muted placeholder:text-inksoft/70 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                  <input
                    value={task.duration}
                    onChange={(e) => update(i, { duration: e.target.value })}
                    placeholder="Estimated duration (e.g. 2h)"
                    className="bg-muted placeholder:text-inksoft/70 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="mt-3 flex gap-1.5">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update(i, { priority: p })}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                        task.priority === p
                          ? p === "High"
                            ? "bg-peach/20 text-peach"
                            : "bg-ink text-primary-foreground"
                          : "bg-muted text-inksoft"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTasks((prev) => [...prev, { ...emptyTask }])}
            className="text-inksoft hover:text-ink mt-3 inline-flex items-center gap-1.5 text-xs font-medium transition"
          >
            <Plus className="size-3.5" /> Add another task
          </button>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => mutation.mutate({ range, tasks: validTasks })}
              disabled={mutation.isPending || validTasks.length === 0}
              className="bg-ink text-primary-foreground flex-1 rounded-full py-3 text-sm font-semibold shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? "Building plan…" : `Generate ${range} Plan`}
            </button>
            <button
              type="button"
              onClick={() => {
                setTasks([{ ...emptyTask }]);
                mutation.reset();
              }}
              className="bg-card border-border inline-flex items-center gap-1.5 rounded-full border px-4 py-3 text-sm font-medium transition hover:opacity-80"
            >
              <RotateCcw className="size-4" /> Reset
            </button>
          </div>
          {validTasks.length === 0 && (
            <p className="text-inksoft mt-2 text-xs">Name at least one task to generate a plan.</p>
          )}
        </div>

        <div className="glass-soft rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{range} plan</h2>
            {plan && !mutation.isPending && <CopyButton text={plan} />}
          </div>

          <div className="mt-4">
            {mutation.isPending && <LoadingLines label="Prioritizing your tasks…" />}
            {!mutation.isPending && mutation.isError && (
              <ErrorMessage message={(mutation.error as Error).message} />
            )}
            {!mutation.isPending && !mutation.isError && !plan && (
              <p className="text-inksoft text-sm leading-relaxed">
                You'll get high-priority tasks first, a suggested schedule, an efficient order and
                time-management tips based only on what you entered.
              </p>
            )}
            {!mutation.isPending && plan && <FormattedOutput text={plan} />}
          </div>
        </div>
      </div>

      <div className="pt-8">
        <AiNotice />
      </div>
    </AppLayout>
  );
}
