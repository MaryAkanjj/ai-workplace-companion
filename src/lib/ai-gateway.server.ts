import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const LOVABLE_AIG_RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  let resolveRunId: (value: string | undefined) => void = () => {};
  let runIdResolved = false;
  const runIdReady = new Promise<string | undefined>((resolve) => {
    resolveRunId = resolve;
  });

  const publishRunId = (value?: string) => {
    const nextRunId = value?.trim() || undefined;
    if (!runId && nextRunId) {
      runId = nextRunId;
    }
    if (!runIdResolved) {
      runIdResolved = true;
      resolveRunId(runId);
    }
  };
  if (runId) publishRunId(runId);

  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(LOVABLE_AIG_RUN_ID_HEADER)) {
        headers.set(LOVABLE_AIG_RUN_ID_HEADER, runId);
      }

      try {
        const response = await fetch(input, { ...init, headers });
        publishRunId(response.headers.get(LOVABLE_AIG_RUN_ID_HEADER) ?? undefined);
        return response;
      } catch (error) {
        publishRunId(undefined);
        throw error;
      }
    },
    getRunId: () => runId,
    waitForRunId: () => (runId ? Promise.resolve(runId) : runIdReady),
  };
}

export function createLovableAiGatewayProvider(
  lovableApiKey: string,
  initialRunId?: string,
  options?: { structuredOutputs?: boolean },
) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);

  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    supportsStructuredOutputs: options?.structuredOutputs ?? false,
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch as typeof fetch,
  });

  return Object.assign(provider, {
    getRunId: runIdFetch.getRunId,
    waitForRunId: runIdFetch.waitForRunId,
  });
}

export const AI_MODEL = "google/gemini-3.7-flash";

export const GROUNDING_RULES = `Strict grounding rules you must always follow:
- Use ONLY the information the user provided. Never invent facts, names, dates, deadlines, decisions, owners or numbers.
- If something important is missing, explicitly say it is missing (e.g. "Not stated in the notes") or use a clearly marked placeholder like [add date].
- Never add filler statistics, attachments, links or commitments that were not provided.
- Keep language clear, professional and easy to read.`;

export function toFriendlyAiError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("402")) {
    return "The AI workspace is out of credits. Please add credits to continue using the assistant.";
  }
  if (message.includes("403")) {
    return "AI access is currently blocked for this workspace. Please check your workspace AI settings.";
  }
  if (message.includes("429")) {
    return "Too many requests right now. Please wait a few seconds and try again.";
  }
  if (message.includes("401")) {
    return "The AI service is not configured correctly. Please contact the app owner.";
  }
  return "The AI service could not complete this request. Please try again.";
}
