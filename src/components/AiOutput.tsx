import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
      className={`bg-lilac/15 text-lilac inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition hover:opacity-80 ${className}`}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function LoadingLines({ label }: { label: string }) {
  return (
    <div className="space-y-3">
      <p className="text-inksoft flex items-center gap-2 text-xs font-medium">
        <span className="bg-lilac size-1.5 animate-pulse rounded-full" />
        {label}
      </p>
      {["w-full", "w-11/12", "w-9/12", "w-10/12", "w-6/12"].map((w, i) => (
        <div key={i} className={`bg-muted h-3 animate-pulse rounded-full ${w}`} />
      ))}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="bg-destructive/10 text-destructive rounded-2xl px-4 py-3 text-sm" role="alert">
      {message}
    </p>
  );
}

/** Renders the plain-text AI output: "## " headings and "- " bullets. */
export function FormattedOutput({ text }: { text: string }) {
  const blocks: Array<{ heading: string | null; lines: string[] }> = [];

  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) {
      blocks.push({ heading: line.slice(3).trim(), lines: [] });
    } else if (line.trim()) {
      if (blocks.length === 0) blocks.push({ heading: null, lines: [] });
      blocks[blocks.length - 1].lines.push(line.trim());
    }
  }

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => (
        <section key={i}>
          {block.heading && (
            <h3 className="font-display text-base font-semibold tracking-tight">{block.heading}</h3>
          )}
          <div className={`space-y-1.5 ${block.heading ? "mt-2" : ""}`}>
            {block.lines.map((line, j) =>
              line.startsWith("- ") ? (
                <div key={j} className="flex gap-2.5 text-sm leading-relaxed">
                  <span className="bg-mint mt-2 size-1.5 shrink-0 rounded-full" />
                  <span className="text-ink/85">{line.slice(2)}</span>
                </div>
              ) : (
                <p key={j} className="text-ink/85 text-sm leading-relaxed">
                  {line}
                </p>
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
