// Retry classification (TASK-543). An infra failure is the harness's or the platform's fault, never the arm's:
// it retries (at most 2 times) and only the first non-infra attempt is scored. A task failure never retries.
import type { Stream } from "./parse.ts";
import type { RawRun } from "./run.ts";

export type InfraKind = "harness-crash" | "api-error" | "network" | "sandbox-before-action";
export type AttemptClass = "ok" | "task-failure" | `infra:${InfraKind}`;
export const isInfra = (c: AttemptClass | string): boolean => c.startsWith("infra:");
export const MAX_RETRIES = 2;

/** The agent's first action: any assistant tool_use or text block in the stream. */
export function firstActionSeen(s: Stream): boolean {
  return s.events.some((e) => e.type === "assistant" && (e.message?.content ?? []).some((b: any) => b?.type === "tool_use" || (b?.type === "text" && String(b.text ?? "").trim() !== "")));
}

const API = /rate[ _-]?limit|\b429\b|overloaded|\b5(?:00|02|03|04|29)\b|api[ _]?error|api_error/i;
const NETWORK = /ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|EPIPE|socket hang up|fetch failed|network (?:error|unreachable)|getaddrinfo/i;
const SANDBOX = /sandbox/i;

export type AttemptEvidence = {
  /** the runner threw (spawn failure, harness bug) */
  thrown?: string | undefined;
  raw?: RawRun | undefined;
  stream?: Stream | undefined;
  /** the finished attempt's own verdict word: "ok" or any task-level exit */
  exit?: string | undefined;
};

/**
 * Class of one attempt. A runner exception is a harness crash. A run that errored is infra when its evidence says API /
 * rate-limit, network, or a sandbox error before the agent's first action; a run with no result event and no first action is a
 * harness crash. Everything else that did not finish ok -- including a run killed mid-work -- is the task's failure: not retried.
 */
export function classifyAttempt(a: AttemptEvidence): AttemptClass {
  if (a.thrown !== undefined) return "infra:harness-crash";
  const s = a.stream;
  const res = s?.result;
  const errored = a.raw ? a.raw.exitCode !== 0 || !!res?.is_error || !res : !!res?.is_error || !res;
  if (!errored) return a.exit === undefined || a.exit === "ok" ? "ok" : "task-failure";
  const evidence = [String(res?.result ?? ""), String(res?.terminal_reason ?? ""), a.raw?.stderr ?? "", ...(s?.events ?? []).filter((e) => e.type === "system" && /error|retry/.test(String(e.subtype ?? ""))).map((e) => JSON.stringify(e))].join("\n");
  const acted = s ? firstActionSeen(s) : false;
  if (API.test(evidence)) return "infra:api-error";
  if (NETWORK.test(evidence)) return "infra:network";
  if (SANDBOX.test(evidence) && !acted) return "infra:sandbox-before-action";
  if (!res && !acted) return "infra:harness-crash";
  return "task-failure";
}

export type Attempt<T> = { n: number; cls: AttemptClass; value: T | undefined };
export type RetryRun<T> = { attempts: Attempt<T>[]; scored: Attempt<T> | undefined; infraLost: boolean };

/** Run attempts 1..(1+maxRetries); `retryIf` defaults to "infra only" and is the one thing a bug could widen. */
export async function runWithRetry<T>(run: (n: number) => Promise<{ cls: AttemptClass; value?: T }>, o: { maxRetries?: number; retryIf?: (c: AttemptClass) => boolean } = {}): Promise<RetryRun<T>> {
  const max = o.maxRetries ?? MAX_RETRIES;
  const retryIf = o.retryIf ?? isInfra;
  const attempts: Attempt<T>[] = [];
  for (let n = 1; n <= 1 + max; n++) {
    let r: { cls: AttemptClass; value?: T };
    try {
      r = await run(n);
    } catch (e) {
      r = { cls: "infra:harness-crash" };
    }
    attempts.push({ n, cls: r.cls, value: r.value });
    if (!retryIf(r.cls)) break;
  }
  const scored = attempts.find((a) => !isInfra(a.cls));
  return { attempts, scored, infraLost: scored === undefined };
}

/** Findings against one slot's attempt log: a retry after a non-infra attempt, more than 1+MAX_RETRIES attempts, or a scored attempt that is not the first non-infra one. */
export function retryAudit(classes: AttemptClass[]): string[] {
  const out: string[] = [];
  const firstNonInfra = classes.findIndex((c) => !isInfra(c));
  if (firstNonInfra >= 0 && firstNonInfra < classes.length - 1) out.push(`task-failure-retried: attempt ${firstNonInfra + 1} was ${classes[firstNonInfra]} yet ${classes.length - 1 - firstNonInfra} more ran`);
  if (classes.length > 1 + MAX_RETRIES) out.push(`too-many-attempts: ${classes.length} > ${1 + MAX_RETRIES}`);
  return out;
}
