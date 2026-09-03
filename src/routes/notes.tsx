import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { NotebookPen, RotateCcw } from "lucide-react";
import { AppLayout, AiNotice } from "@/components/AppLayout";
import { CopyButton, ErrorMessage, FormattedOutput, LoadingLines } from "@/components/AiOutput";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Lumina AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste long meeting notes and get a concise summary with key points, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Lumina" },
      {
        property: "og:description",
        content: "Turn long meeting notes into decisions, owners and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const fn = useServerFn(summarizeMeeting);
  const mutation = useMutation({
    mutationFn: (input: { notes: string }) => fn({ data: input as never }),
  });

  const summary = mutation.data?.text ?? "";

  return (
    <AppLayout>
      <section className="pt-10 pb-8">
        <div className="flex items-center gap-3">
          <div className="bg-mint/15 grid size-11 place-items-center rounded-2xl">
            <NotebookPen className="text-mint size-5" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight">
              Meeting Notes Summarizer
            </h1>
            <p className="text-inksoft mt-1 text-sm">
              Decisions, action items and deadlines — only what your notes actually say.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-soft rounded-3xl p-6 shadow-sm">
          <label htmlFor="notes" className="font-display block text-lg font-semibold">
            Paste your meeting notes
          </label>
          <textarea
            id="notes"
            rows={16}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste the full transcript or your raw notes here…"
            className="bg-card border-border placeholder:text-inksoft/70 focus:ring-mint mt-4 w-full resize-none rounded-2xl border p-4 text-sm leading-relaxed focus:ring-2 focus:outline-none"
          />
          <p className="text-inksoft mt-2 text-xs">{notes.trim().length} characters</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => mutation.mutate({ notes })}
              disabled={mutation.isPending || notes.trim().length < 20}
              className="bg-ink text-primary-foreground flex-1 rounded-full py-3 text-sm font-semibold shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? "Summarizing…" : "Summarize"}
            </button>
            <button
              type="button"
              onClick={() => {
                setNotes("");
                mutation.reset();
              }}
              className="bg-card border-border inline-flex items-center gap-1.5 rounded-full border px-4 py-3 text-sm font-medium transition hover:opacity-80"
            >
              <RotateCcw className="size-4" /> Clear
            </button>
          </div>
          {notes.trim().length < 20 && (
            <p className="text-inksoft mt-2 text-xs">
              Add at least a short paragraph of notes to summarize.
            </p>
          )}
        </div>

        <div className="glass-soft rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Summary</h2>
            {summary && !mutation.isPending && <CopyButton text={summary} />}
          </div>

          <div className="mt-4">
            {mutation.isPending && <LoadingLines label="Reading your notes…" />}
            {!mutation.isPending && mutation.isError && (
              <ErrorMessage message={(mutation.error as Error).message} />
            )}
            {!mutation.isPending && !mutation.isError && !summary && (
              <p className="text-inksoft text-sm leading-relaxed">
                You'll get a short summary, key points, decisions, action items with owners and
                deadlines, plus anything the notes left unclear.
              </p>
            )}
            {!mutation.isPending && summary && <FormattedOutput text={summary} />}
          </div>
        </div>
      </div>

      <div className="pt-8">
        <AiNotice />
      </div>
    </AppLayout>
  );
}
