// hooks/ask-dont-tell.ts -- lean-flow Stop hook. Run by Bun.
//
// WHY THIS EXISTS. L-002 says a blocking or clarifying question is *asked* -- surfaced as an
// AskUserQuestion popup, never buried in inline prose. That rule is written in `.claude/CLAUDE.md`,
// in `.claude/CONTEXT.md`, in `docs/LEARNINGS.md`, and in the maintainer's own memory file: four
// places, ten-plus files mentioning it, and it still fails routinely. The owner's words, 2026-09-21:
// "this happen every time, please fix this also".
//
// Writing it a fifth time is the one intervention already known not to work. This is the same
// diagnosis EPIC-017 makes about line caps -- an unenforced rule loses to whatever is actually
// enforced -- applied to the rule about asking. So: a forcing function, not another sentence.
//
// WHAT IT DOES. On Stop, it looks at the turn that is ending. If the assistant's final message ends
// on a decision point (a question to the user, or an offer of alternatives) and the turn contained
// no AskUserQuestion tool call, it blocks the stop and says so. The turn then continues and the
// question gets asked properly.
//
// TRANSCRIPT SCHEMA -- VERIFIED, NOT ASSUMED. Published guidance describes a top-level
// `tool_calls[]` array with a `name` field. That is NOT this format. Checked against a live
// transcript on 2026-09-21, each JSONL line is:
//   { type: "assistant"|"user"|..., uuid, parentUuid, timestamp, message: { role, content: [...] } }
// and a tool call is a content block `{ type: "tool_use", name: "AskUserQuestion", ... }`.
// Reading `tool_calls` would have found nothing, silently, and the hook would never have fired --
// an absent guard wearing the shape of a present one.
//
// FAIL-OPEN, DELIBERATELY. Every unexpected condition (unreadable transcript, malformed JSON, no
// turn boundary) exits 0 and allows the stop. A hook that wedges a session because it could not
// parse something is worse than the problem it solves, and this one is advisory by nature.

interface ContentBlock {
  readonly type?: string;
  readonly name?: string;
  readonly text?: string;
}
interface Entry {
  readonly type?: string;
  readonly isSidechain?: boolean;
  readonly message?: { readonly role?: string; readonly content?: ContentBlock[] | string };
}

const ALLOW = () => process.exit(0);

/** Blocks the stop and hands `reason` back to the model as its next instruction. */
function block(reason: string): never {
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
  process.exit(0);
}

/**
 * Decision-shaped endings. Deliberately narrow and anchored to the END of the message, because
 * that is where a question awaiting an answer lives. A rhetorical "?" mid-report is not this, and
 * a hook that cries wolf on correct output gets switched off -- which would be a worse outcome
 * than the miss it prevents.
 */
const DECISION_PATTERNS: RegExp[] = [
  /\b(should|shall) (i|we)\b[^.!]*\?/i,
  /\bdo you (want|prefer|need)\b/i,
  /\bwould you (like|prefer|rather)\b/i,
  /\bwhich (one|option|approach|would)\b/i,
  /\blet me know\b/i,
  /\b(want me to|shall i proceed|proceed\?)/i,
  /\byour call\b/i,
  /\b(option a|option 1)\b/i,
];

export function finalAssistantText(entries: Entry[]): string {
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i]!;
    if (e.type !== "assistant" || e.isSidechain) continue;
    const c = e.message?.content;
    if (typeof c === "string") return c;
    if (!Array.isArray(c)) continue;
    const text = c.filter((b) => b.type === "text" && b.text).map((b) => b.text!).join("\n").trim();
    if (text !== "") return text;
  }
  return "";
}

/**
 * Did THIS turn ask properly? Scans back to the most recent real user message -- a `user` entry
 * whose content is not purely tool_result, since tool results are also recorded as user entries and
 * treating one as a turn boundary would shrink the window to nothing.
 */
export function askedThisTurn(entries: Entry[]): boolean {
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i]!;
    if (e.isSidechain) continue;
    const c = e.message?.content;
    if (e.type === "user") {
      const onlyToolResults =
        Array.isArray(c) && c.length > 0 && c.every((b) => b.type === "tool_result");
      if (!onlyToolResults) return false; // reached the turn start without finding a call
    }
    if (e.type === "assistant" && Array.isArray(c)) {
      if (c.some((b) => b.type === "tool_use" && b.name === "AskUserQuestion")) return true;
    }
  }
  return false;
}

export function endsOnDecision(text: string): boolean {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== "");
  if (lines.length === 0) return false;
  const tail = lines.slice(-3).join("\n");
  return DECISION_PATTERNS.some((re) => re.test(tail));
}

async function main(): Promise<void> {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;

  let input: { stop_hook_active?: boolean; transcript_path?: string };
  try {
    input = JSON.parse(raw);
  } catch {
    ALLOW();
    return;
  }

  // MANDATORY first check: we already blocked once this turn. Blocking again loops.
  if (input.stop_hook_active === true) ALLOW();

  const path = input.transcript_path;
  if (!path) ALLOW();

  let entries: Entry[];
  try {
    const file = Bun.file(path!);
    if (!(await file.exists())) ALLOW();
    entries = (await file.text())
      .split(/\r?\n/)
      .filter((l) => l.trim() !== "")
      .map((l) => {
        try {
          return JSON.parse(l) as Entry;
        } catch {
          return {} as Entry;
        }
      });
  } catch {
    ALLOW();
    return;
  }

  if (askedThisTurn(entries)) ALLOW();

  const text = finalAssistantText(entries);
  if (!endsOnDecision(text)) ALLOW();

  block(
    "STOP BLOCKED by lean-flow's ask-dont-tell hook (L-002).\n\n" +
      "This turn is ending on a decision point stated in prose, and no AskUserQuestion call was " +
      "made. A question left inline is not asked -- the user has to notice it, retype it, and " +
      "re-enter the context you already had.\n\n" +
      "Do this now: re-surface the decision as an AskUserQuestion popup with concrete options. " +
      "Lead each option with your recommendation where you have one. Then stop.\n\n" +
      "If the ending was NOT a real question (a rhetorical aside, or a decision already settled " +
      "earlier in this turn), say so in one line and stop -- this hook fails open and will not " +
      "block you twice.",
  );
}

if (import.meta.main) await main();
