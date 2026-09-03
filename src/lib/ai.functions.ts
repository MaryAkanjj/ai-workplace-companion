import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const EmailInput = z.object({
  purpose: z.string().min(3),
  audience: z.enum(["Manager", "Client", "Team member", "Colleague"]),
  tone: z.enum(["Formal", "Informal", "Persuasive"]),
  details: z.string().default(""),
});

const NotesInput = z.object({
  notes: z.string().min(20),
});

const PlannerInput = z.object({
  range: z.enum(["Daily", "Weekly"]),
  tasks: z
    .array(
      z.object({
        name: z.string().min(1),
        deadline: z.string().default(""),
        duration: z.string().default(""),
        priority: z.enum(["High", "Medium", "Low"]),
      }),
    )
    .min(1),
});

async function runPrompt(system: string, prompt: string) {
  const { AI_MODEL, createLovableAiGatewayProvider, toFriendlyAiError } = await import(
    "./ai-gateway.server"
  );
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  try {
    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway(AI_MODEL),
      system,
      prompt,
    });
    const text = await result.text;
    if (!text.trim()) {
      throw new Error("Empty response from the AI service.");
    }
    return { text };
  } catch (error) {
    console.error("AI request failed", error);
    throw new Error(toFriendlyAiError(error));
  }
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { GROUNDING_RULES } = await import("./ai-gateway.server");
    const system = `You are a workplace writing assistant that drafts emails.
${GROUNDING_RULES}
Output format:
Subject: <one line subject>

<email body with greeting, short paragraphs and a sign-off>

If a name or date the email needs was not supplied, use a bracketed placeholder such as [Recipient name] instead of inventing one.
End with a short line starting with "Missing information:" only when something important was not provided.
Do not add any commentary, markdown fences or explanations.`;

    const prompt = `Purpose of the email: ${data.purpose}
Recipient / audience: ${data.audience}
Desired tone: ${data.tone}
Important information provided by the user:
${data.details.trim() || "(none provided)"}`;

    return runPrompt(system, prompt);
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const { GROUNDING_RULES } = await import("./ai-gateway.server");
    const system = `You summarize meeting notes.
${GROUNDING_RULES}
Return plain text using EXACTLY these section headings, each on its own line beginning with "## ":

## Summary
2-4 sentences.

## Key Points
Bullet lines starting with "- ".

## Decisions Made
Bullet lines starting with "- ". If none are stated, write "- No decisions were stated in the notes."

## Action Items
Bullet lines starting with "- " in the form: Task — Owner: <name or "Not stated"> — Deadline: <deadline or "Not stated">.

## Missing or Unclear
Bullet lines noting anything important that was not stated. Write "- Nothing notable." if all is clear.

No markdown other than the "## " headings and "- " bullets.`;

    return runPrompt(system, `Meeting notes:\n\n${data.notes}`);
  });

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const { GROUNDING_RULES } = await import("./ai-gateway.server");
    const system = `You are a task planning assistant.
${GROUNDING_RULES}
Return plain text using EXACTLY these section headings, each on its own line beginning with "## ":

## High Priority First
Bullet lines listing the tasks that are most urgent and important, with a one-line reason based only on the given deadline/priority.

## Suggested Schedule
Bullet lines. For a Daily plan use time blocks (e.g. "- 09:00-10:30 — Task name (High)"). For a Weekly plan group by day (e.g. "- Monday: Task name (High, 2h)"). Only use durations and deadlines the user supplied; if a duration is missing write "duration not stated".

## Recommended Order
A numbered-style bullet list ("- 1. ...") explaining the efficient order.

## Time-Management Tips
3-5 short bullet lines tailored to this task list.

## Missing or Unclear
Bullets noting tasks lacking deadlines or durations. Write "- Nothing notable." if all is clear.

No markdown other than the "## " headings and "- " bullets.`;

    const taskLines = data.tasks
      .map(
        (t, i) =>
          `${i + 1}. ${t.name} | Deadline: ${t.deadline.trim() || "not stated"} | Estimated duration: ${
            t.duration.trim() || "not stated"
          } | Priority: ${t.priority}`,
      )
      .join("\n");

    return runPrompt(system, `Plan type: ${data.range}\nTasks:\n${taskLines}`);
  });
