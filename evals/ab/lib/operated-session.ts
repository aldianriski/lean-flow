// A headless claude session whose popups are answered by the setup operator (lib/operator.ts) instead of a person.
// Protocol (stream-json over stdio, proven by a spike): `--permission-prompt-tool stdio` makes AskUserQuestion and every permission
// prompt arrive as a `control_request`/`can_use_tool` line on stdout; the host answers with a `control_response` line on stdin.
import fs from "node:fs";
import path from "node:path";
import { answerFor, type Files, type Question, type Rule } from "./operator.ts";

export type OperatedOpts = {
  /** the full command line, built with `operatedCommand` (tests substitute a fake CLI) */
  cmd: string[];
  cwd: string;
  env: Record<string, string>;
  /** the first user message, e.g. `/lean-doc-generator migrate` */
  prompt: string;
  files: Files;
  rules: Rule[];
  /** tool names (or `Name(pattern)` entries, matched on the name) the operator allows; any other tool request is denied */
  allowTools: string[];
  /** every decision is appended here as one JSON line */
  operatorLog: string;
  timeoutMs?: number;
};
export type OperatedResult =
  | { status: "done"; resultSubtype: string }
  | { status: "failed"; resultSubtype?: string; reason: string }
  | { status: "stopped"; popup: { questions: unknown[]; reason: string } };

/** The flags that make the CLI speak stream-json and route every permission prompt to the host. */
export const STREAM_FLAGS = ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--permission-prompt-tool", "stdio"];

/** The CLI prefix (`AB_OPERATOR_CLI`, a JSON array, replaces `claude` for tests), the stream-json flags, then the session's own flags. */
export function operatedCommand(sessionFlags: string[], env: Record<string, string | undefined> = process.env): string[] {
  const prefix: string[] = env.AB_OPERATOR_CLI ? JSON.parse(env.AB_OPERATOR_CLI) : ["claude"];
  return [...prefix, ...STREAM_FLAGS, ...sessionFlags];
}

export async function runOperatedSession(o: OperatedOpts): Promise<OperatedResult> {
  const proc = Bun.spawn(o.cmd, { cwd: o.cwd, env: o.env, stdin: "pipe", stdout: "pipe", stderr: "pipe" });
  const send = (m: unknown) => {
    try {
      proc.stdin.write(JSON.stringify(m) + "\n");
      proc.stdin.flush();
    } catch {
      /* the process already ended */
    }
  };
  const log = (rec: unknown) => fs.appendFileSync(o.operatorLog, JSON.stringify(rec) + "\n");
  const allowed = new Set(o.allowTools.map((t) => t.replace(/\(.*$/, "")));
  const stderr = new Response(proc.stderr).text();
  const timer = setTimeout(() => proc.kill(), o.timeoutMs ?? 60 * 60 * 1000);
  send({ type: "control_request", request_id: "init-1", request: { subtype: "initialize", hooks: null } });
  send({ type: "user", message: { role: "user", content: o.prompt } });

  let result: OperatedResult | undefined;
  const dec = new TextDecoder();
  let buf = "";
  const handle = (m: any): boolean => {
    if (m.type === "result") {
      const sub = String(m.subtype ?? "");
      result = sub === "success" && !m.is_error ? { status: "done", resultSubtype: sub } : { status: "failed", resultSubtype: sub, reason: `result ${sub}${m.is_error ? " (is_error)" : ""}` };
      return true;
    }
    if (m.type !== "control_request" || m.request?.subtype !== "can_use_tool") return false;
    const id = m.request_id as string;
    const tool = m.request.tool_name as string;
    const input = m.request.input ?? {};
    if (tool === "AskUserQuestion") {
      const questions = (input.questions ?? []) as (Question & { question: string })[];
      const answers: Record<string, string> = {};
      const decided: Record<string, unknown>[] = [];
      let stop: string | undefined;
      for (const q of questions) {
        const a = answerFor({ question: q.question, header: q.header ?? "" }, o.files, o.rules);
        if ("stop" in a) {
          stop = a.stop;
          decided.push({ question: q.question, header: q.header, stop: a.stop });
          break;
        }
        answers[q.question] = a.answer;
        decided.push({ question: q.question, header: q.header, answer: a.answer, source: a.source });
      }
      if (stop !== undefined) {
        for (const d of decided) log(d);
        send({ type: "control_response", response: { subtype: "success", request_id: id, response: { behavior: "deny", message: `operator stopped: ${stop}` } } });
        result = { status: "stopped", popup: { questions, reason: stop } };
        return true;
      }
      for (const d of decided) log(d);
      send({ type: "control_response", response: { subtype: "success", request_id: id, response: { behavior: "allow", updatedInput: { ...input, answers } } } });
    } else {
      const ok = allowed.has(tool);
      log({ tool, decision: ok ? "allow" : "deny" });
      send({ type: "control_response", response: { subtype: "success", request_id: id, response: ok ? { behavior: "allow", updatedInput: input } : { behavior: "deny", message: `operator: tool ${tool} is not in the allow-list` } } });
    }
    return false;
  };
  outer: for await (const chunk of proc.stdout) {
    buf += dec.decode(chunk, { stream: true });
    let i: number;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i);
      buf = buf.slice(i + 1);
      if (!line.trim()) continue;
      let m: unknown;
      try {
        m = JSON.parse(line);
      } catch {
        continue;
      }
      if (handle(m)) break outer;
    }
  }
  clearTimeout(timer);
  try {
    proc.stdin.end();
  } catch {
    /* already closed */
  }
  if (result?.status === "stopped") proc.kill();
  else if (result) setTimeout(() => proc.kill(), 5000).unref(); // a finished session should exit on its own once stdin closes
  const code = await proc.exited;
  return result ?? { status: "failed", reason: `the CLI exited (code ${code}) without a result event: ${(await stderr).slice(0, 300)}` };
}

/** Print the outcome for a CLI entry point and return its exit code: 0 done, 3 stopped (popup in full), 1 failed. */
export function reportAndExit(res: OperatedResult, operatorLog: string): number {
  if (res.status === "done") {
    console.log(`operated session done (result ${res.resultSubtype}). operator log: ${operatorLog}`);
    return 0;
  }
  if (res.status === "stopped") {
    console.log(`OPERATOR STOPPED: ${res.popup.reason}
popup:
${JSON.stringify(res.popup.questions, null, 2)}
operator log: ${operatorLog}`);
    return 3;
  }
  console.error(`operated session FAILED: ${res.reason}. operator log: ${operatorLog}`);
  return 1;
}

/** The two answers files of a repo (`<repo>.md`, `<repo>-operator.md`); throws naming a missing one. */
export function readAnswers(dir: string, repo: string): { repo: string; operator: string } {
  const read = (f: string) => {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) throw new Error(`answers file ${p} is missing`);
    return fs.readFileSync(p, "utf8");
  };
  return { repo: read(`${repo}.md`), operator: read(`${repo}-operator.md`) };
}
