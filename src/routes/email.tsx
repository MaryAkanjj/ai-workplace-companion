import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Mail, RefreshCw, Pencil } from "lucide-react";
import { AppLayout, AiNotice } from "@/components/AppLayout";
import { CopyButton, ErrorMessage, LoadingLines } from "@/components/AiOutput";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Lumina AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate clear, professional workplace emails from a purpose, audience, tone and your own key details.",
      },
      { property: "og:title", content: "Smart Email Generator — Lumina" },
      {
        property: "og:description",
        content: "Draft on-tone workplace emails from the details you provide.",
      },
    ],
  }),
  component: EmailPage,
});

const audiences = ["Manager", "Client", "Team member", "Colleague"] as const;
const tones = ["Formal", "Informal", "Persuasive"] as const;

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState<(typeof audiences)[number]>("Manager");
  const [tone, setTone] = useState<(typeof tones)[number]>("Formal");
  const [details, setDetails] = useState("");
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);

  const fn = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: (input: { purpose: string; audience: string; tone: string; details: string }) =>
      fn({ data: input as never }),
  });

  useEffect(() => {
    if (mutation.data?.text) {
      setDraft(mutation.data.text);
      setEditing(false);
    }
  }, [mutation.data]);

  const submit = () => {
    if (purpose.trim().length < 3) return;
    mutation.mutate({ purpose, audience, tone, details });
  };

  return (
    <AppLayout>
      <section className="pt-10 pb-8">
        <div className="flex items-center gap-3">
          <div className="bg-lilac/15 grid size-11 place-items-center rounded-2xl">
            <Mail className="text-lilac size-5" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight">
              Smart Email Generator
            </h1>
            <p className="text-inksoft mt-1 text-sm">
              Turn a rough idea into a clear, on-tone message.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-soft rounded-3xl p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">What should the email say?</h2>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="purpose" className="mb-1.5 block text-sm font-medium">
                Purpose of the email
              </label>
              <input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Confirm the revised project timeline"
                className="bg-card border-border placeholder:text-inksoft/70 focus:ring-lilac w-full rounded-2xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
              />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium">Recipient / audience</span>
              <div className="flex flex-wrap gap-2">
                {audiences.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAudience(a)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                      audience === a
                        ? "bg-ink text-primary-foreground"
                        : "bg-card border-border text-inksoft border"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium">Desired tone</span>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                      tone === t
                        ? "bg-lilac text-primary-foreground"
                        : "bg-card border-border text-inksoft border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="details" className="mb-1.5 block text-sm font-medium">
                Important information
              </label>
              <textarea
                id="details"
                rows={5}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Dates, names, decisions, next steps… the AI will only use what you write here."
                className="bg-card border-border placeholder:text-inksoft/70 focus:ring-lilac w-full resize-none rounded-2xl border px-4 py-3 text-sm focus:ring-2 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={mutation.isPending || purpose.trim().length < 3}
              className="bg-ink text-primary-foreground w-full rounded-full py-3 text-sm font-semibold shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mutation.isPending ? "Generating…" : "Generate Email"}
            </button>
            {purpose.trim().length < 3 && (
              <p className="text-inksoft text-xs">Add a purpose to enable generation.</p>
            )}
          </div>
        </div>

        <div className="glass-soft flex flex-col rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Generated email</h2>
            {draft && !mutation.isPending && (
              <span className="bg-mint/15 text-mint rounded-full px-2.5 py-1 text-[11px] font-medium">
                {tone} · {audience}
              </span>
            )}
          </div>

          <div className="mt-4 flex-1">
            {mutation.isPending && <LoadingLines label="Drafting your email…" />}
            {!mutation.isPending && mutation.isError && (
              <ErrorMessage message={(mutation.error as Error).message} />
            )}
            {!mutation.isPending && !mutation.isError && !draft && (
              <p className="text-inksoft text-sm leading-relaxed">
                Your draft will appear here. The AI uses only the information you provide and will
                flag anything missing.
              </p>
            )}
            {!mutation.isPending && draft && editing && (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={16}
                className="bg-card border-border focus:ring-lilac w-full resize-none rounded-2xl border p-4 font-mono text-[12.5px] leading-relaxed focus:ring-2 focus:outline-none"
              />
            )}
            {!mutation.isPending && draft && !editing && (
              <div className="bg-card border-border text-ink/85 rounded-2xl border p-4 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap">
                {draft}
              </div>
            )}
          </div>

          {draft && !mutation.isPending && (
            <div className="mt-4 flex flex-wrap gap-2">
              <CopyButton text={draft} />
              <button
                type="button"
                onClick={submit}
                className="bg-card border-border inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition hover:opacity-80"
              >
                <RefreshCw className="size-3.5" /> Regenerate
              </button>
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="bg-card border-border inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition hover:opacity-80"
              >
                <Pencil className="size-3.5" /> {editing ? "Done editing" : "Edit"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8">
        <AiNotice />
      </div>
    </AppLayout>
  );
}
