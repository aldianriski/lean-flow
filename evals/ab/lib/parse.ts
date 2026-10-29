// Facts from the CLI's own stream-json output. Nothing here is estimated: tokens come from the result event.
import type { InitPlugin } from "./pin.ts";

type Json = Record<string, any>;
export type Init = { plugins: InitPlugin[]; skills: string[]; memoryPaths: Record<string, string>; apiKeySource: string; cwd: string; model: string };
export type Totals = { input: number; output: number; cacheRead: number; cacheWrite: number; costUsd: number; models: string[] };
export type Stream = { events: Json[]; init: Init | undefined; result: Json | undefined; hooksStarted: string[] };

export function parseStream(text: string): Stream {
  const events: Json[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim().startsWith("{")) continue;
    try {
      events.push(JSON.parse(line));
    } catch {
      /* a torn line is not an event */
    }
  }
  const i = events.find((e) => e.type === "system" && e.subtype === "init");
  const init: Init | undefined = i && {
    plugins: i.plugins ?? [],
    skills: i.skills ?? [],
    memoryPaths: i.memory_paths ?? {},
    apiKeySource: i.apiKeySource ?? "",
    cwd: i.cwd ?? "",
    model: i.model ?? "",
  };
  const hooksStarted = events.filter((e) => e.type === "system" && e.subtype === "hook_started").map((e) => String(e.hook_name ?? e.hook_event ?? ""));
  return { events, init, result: events.find((e) => e.type === "result"), hooksStarted };
}

export type Popup = { tool: string; input: unknown };
/** The whole popup set: a tool_use of AskUserQuestion or ExitPlanMode, or ANY denied permission (headless, a denied prompt is the only other way a run asks a human). */
export function detectPopups(s: Stream): Popup[] {
  const out: Popup[] = [];
  for (const e of s.events) {
    if (e.type !== "assistant") continue;
    for (const b of e.message?.content ?? []) if (b?.type === "tool_use" && (b.name === "AskUserQuestion" || b.name === "ExitPlanMode")) out.push({ tool: b.name, input: b.input });
  }
  for (const d of s.result?.permission_denials ?? []) out.push({ tool: String(d.tool_name ?? "unknown"), input: d.tool_input ?? null });
  return out;
}

/** Run totals summed over `modelUsage` (all models, so dispatch tiers are included); null when the CLI reported no usage. */
export function totalsOf(result: Json | undefined): Totals | null {
  const mu = result?.modelUsage as Record<string, Json> | undefined;
  if (!result?.usage || !mu || Object.keys(mu).length === 0) return null;
  const sum = (k: string) => Object.values(mu).reduce((n, m) => n + (Number(m[k]) || 0), 0);
  return { input: sum("inputTokens"), output: sum("outputTokens"), cacheRead: sum("cacheReadInputTokens"), cacheWrite: sum("cacheCreationInputTokens"), costUsd: sum("costUSD"), models: Object.keys(mu) };
}
