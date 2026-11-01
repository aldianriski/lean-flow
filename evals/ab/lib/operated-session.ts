// A headless claude session whose popups are answered by the setup operator (lib/operator.ts) instead of a person.
// Protocol (stream-json over stdio, proven by a spike): `--permission-prompt-tool stdio` makes AskUserQuestion and every permission
// prompt arrive as a `control_request`/`can_use_tool` line on stdout; the host answers with a `control_response` line on stdin.
import fs from "node:fs";
import path from "node:path";
import { capChat, type Answerer, type ChatAnswerer } from "./classifier.ts";
import type { Question } from "./operator.ts";

export type OperatedOpts = {
  /** the full command line, built with `operatedCommand` (tests substitute a fake CLI) */
  cmd: string[];
  cwd: string;
  env: Record<string, string>;
  /** the first user message, e.g. `/lean-doc-generator migrate` */
  prompt: string;
  /** chooses the frozen entry that answers each popup question (the classifier; tests substitute a fake model); a stop stops the popup */
  answerer: Answerer;
  /** classifies a turn-ending chat request that asks the user for decisions (one reply, one line per part) */
  chatAnswerer: ChatAnswerer;
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

/** At most this many chat follow-ups per session; the next one stops. */
export const MAX_CHAT_FOLLOW_UPS = 6;
/** Does a turn's closing text ask the user something (a question or an approval request)? Not "which": an ordinary summary uses it. */
export const asksUser = (t: string) => /\?\s*$|\bapprov|\bconfirm|\bshould I\b/i.test(t.trim());

/** The flags that make the CLI speak stream-json and route every permission prompt to the host. */
export const STREAM_FLAGS = ["-p", "--input-format", "stream-json", "--output-format", "stream-json", "--verbose", "--permission-prompt-tool", "stdio"];

/** The CLI prefix (`AB_OPERATOR_CLI`, a JSON array, replaces `claude` for tests), the stream-json flags, then the session's own flags. */
export function operatedCommand(sessionFlags: string[], env: Record<string, string | undefined> = process.env): string[] {
  const prefix: string[] = env.AB_OPERATOR_CLI ? JSON.parse(env.AB_OPERATOR_CLI) : ["claude"];
  return [...prefix, ...STREAM_FLAGS, ...sessionFlags];
}

/** An allow-list entry is `Tool` (any input) or `Tool(pattern)`: the pattern (`*` = wildcard) must match the request's relevant input (skill name, command, path). */
export function toolEntryAllows(entry: string, tool: string, input: Record<string, unknown>): boolean {
  const m = /^([^(]+)(?:\((.*)\))?$/.exec(entry);
  if (!m || m[1] !== tool) return false;
  if (m[2] === undefined) return true;
  const subject = [input.skill, input.command, input.file_path, input.path, input.pattern].find((v) => typeof v === "string") as string | undefined;
  if (subject === undefined) return false;
  const re = new RegExp("^" + m[2].split("*").map((x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$", "s");
  return re.test(subject);
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
  const isAllowed = (tool: string, input: Record<string, unknown>) => o.allowTools.some((entry) => toolEntryAllows(entry, tool, input));
  const stderr = new Response(proc.stderr).text();
  let timedOut = false;
  const timer = setTimeout(() => ((timedOut = true), proc.kill()), o.timeoutMs ?? 60 * 60 * 1000); // armed until the process has exited
  send({ type: "control_request", request_id: "init-1", request: { subtype: "initialize", hooks: null } });
  send({ type: "user", message: { role: "user", content: o.prompt } });

  let result: OperatedResult | undefined;
  let lastMsgId: string | undefined;
  let lastText = ""; // the session's last assistant text in the current turn
  let chatFollowUps = 0;
  const dec = new TextDecoder();
  let buf = "";
  const handle = async (m: any): Promise<boolean> => {
    if (m.type === "assistant") {
      const texts = ((m.message?.content ?? []) as { type?: string; text?: string }[]).filter((b) => b.type === "text" && b.text?.trim()).map((b) => b.text!);
      if (texts.length > 0) {
        // all text blocks of the final assistant message, joined; events of one message (same id) accumulate
        const id = m.message?.id as string | undefined;
        lastText = id !== undefined && id === lastMsgId ? `${lastText}\n\n${texts.join("\n\n")}` : texts.join("\n\n");
        lastMsgId = id;
      }
      return false;
    }
    if (m.type === "result") {
      const sub = String(m.subtype ?? "");
      if (!(sub === "success" && !m.is_error)) {
        result = { status: "failed", resultSubtype: sub, reason: `result ${sub}${m.is_error ? " (is_error)" : ""}` };
        return true;
      }
      result = { status: "done", resultSubtype: sub };
      const text = lastText.trim();
      lastText = "";
      lastMsgId = undefined;
      if (!asksUser(text)) return true;
      // the turn ended asking the user something in chat: classify the whole request (one reply may cover several decisions)
      const question = capChat(text);
      const popup = [{ question, header: "chat" }];
      const stopChat = (reason: string) => {
        log({ kind: "chat", question, header: "chat", stop: reason });
        result = { status: "stopped", popup: { questions: popup, reason } };
        return true;
      };
      if (chatFollowUps >= MAX_CHAT_FOLLOW_UPS) return stopChat(`too many chat follow-ups (more than ${MAX_CHAT_FOLLOW_UPS}); the operator never loops without end`);
      const a = await o.chatAnswerer(question);
      if ("stop" in a) return stopChat(a.stop);
      chatFollowUps++;
      for (const p of a.parts) log({ kind: "chat", header: "chat", part: p.part, id: p.id, reason: p.reason, answer: p.answer });
      result = undefined;
      send({ type: "user", message: { role: "user", content: a.reply } });
      return false;
    }
    if (m.type !== "control_request" || m.request?.subtype !== "can_use_tool") return false;
    const id = m.request_id as string;
    const tool = m.request.tool_name as string;
    const input = m.request.input ?? {};
    if (tool === "AskUserQuestion") {
      const questions = (input.questions ?? []) as (Question & { question: string; options?: unknown[] })[];
      const answers: Record<string, string> = {};
      const decided: Record<string, unknown>[] = [];
      let stop: string | undefined;
      const texts = questions.map((q) => q.question);
      const repeated = texts.find((t, i) => texts.indexOf(t) !== i);
      if (repeated !== undefined) {
        // answers are keyed by question text, so a repeat would overwrite an earlier answer
        stop = `question text repeats within one popup ("${repeated}"); answers are keyed by question text`;
        decided.push({ question: repeated, header: questions[texts.indexOf(repeated)]?.header, stop });
      }
      for (const q of stop === undefined ? questions : []) {
        const a = await o.answerer({ question: q.question, header: q.header ?? "", options: q.options });
        if ("stop" in a) {
          stop = a.stop;
          decided.push({ question: q.question, header: q.header, stop: a.stop });
          break;
        }
        answers[q.question] = a.answer;
        decided.push({ question: q.question, header: q.header, id: a.id, reason: a.reason, answer: a.answer });
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
      const ok = isAllowed(tool, input);
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
      if (await handle(m)) break outer;
    }
  }
  try {
    proc.stdin.end();
  } catch {
    /* already closed */
  }
  if (result?.status === "stopped") proc.kill();
  else if (result) setTimeout(() => proc.kill(), 5000).unref(); // a finished session should exit on its own once stdin closes
  const code = await proc.exited;
  clearTimeout(timer);
  if (!result && timedOut) return { status: "failed", reason: `timed out after ${o.timeoutMs ?? 60 * 60 * 1000} ms without a result event; the CLI was killed` };
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
