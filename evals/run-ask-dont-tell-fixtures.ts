// evals/run-ask-dont-tell-fixtures.ts -- retained proof for hooks/ask-dont-tell.ts (EPIC-017).
// Run by Bun: `bun evals/run-ask-dont-tell-fixtures.ts`
//
// These drive the REAL hook as a subprocess over stdin, exactly as Claude Code invokes it, rather
// than importing its functions. A hook that works when called directly and fails over the wire is
// the failure mode worth catching, and only the subprocess path exercises the JSON contract.
//
// RETAINED, not deleted with the prototype (TD-012).
//
// The must-NOT-catch cases are the point. A hook that blocks everything "works" against a
// block-expected suite and is unusable in practice; the three allow-cases are what show it
// discriminates rather than just fires.

import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const HOOK = "hooks/ask-dont-tell.ts";

const userMsg = (text: string) => ({ type: "user", message: { role: "user", content: [{ type: "text", text }] } });
const toolResult = () => ({ type: "user", message: { role: "user", content: [{ type: "tool_result", text: "ok" }] } });
const asstText = (text: string) => ({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text }] } });
const asstAsk = () => ({ type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", name: "AskUserQuestion", input: {} }] } });

interface Case {
  readonly name: string;
  readonly entries: object[];
  readonly stopHookActive?: boolean;
  readonly expect: "block" | "allow";
  readonly why: string;
}

const CASES: Case[] = [
  {
    name: "inline-question-no-ask",
    entries: [userMsg("do the thing"), asstText("Done.\n\nShould I also update the consumer repo?")],
    expect: "block",
    why: "the motivating case: a real question, left in prose",
  },
  {
    name: "offers-options-no-ask",
    entries: [userMsg("go"), asstText("Two paths here.\n\nLet me know which you prefer.")],
    expect: "block",
    why: "offering alternatives without asking is the same failure",
  },
  {
    name: "asked-properly",
    // The trailing text is DELIBERATELY decision-shaped ("which one do you want"), so the only
    // thing that can allow this case is askedThisTurn() finding the AskUserQuestion call. An
    // earlier draft ended on "Waiting on your pick." -- not decision-shaped -- so it allowed via
    // endsOnDecision() and never exercised the detection it claimed to guard. A seeded break that
    // neutered AskUserQuestion detection left it green, which is how the vacuum was found (L-142).
    entries: [userMsg("go"), asstAsk(), asstText("Which option do you want?")],
    expect: "allow",
    why: "must-NOT-catch: the turn DID call AskUserQuestion, and the ending is decision-shaped so nothing else can save it",
  },
  {
    name: "plain-report",
    entries: [userMsg("go"), asstText("Committed both repos. Nothing pushed.")],
    expect: "allow",
    why: "must-NOT-catch: a statement is not a decision point",
  },
  {
    name: "question-not-at-end",
    entries: [userMsg("go"), asstText("Should I have done X? I did, and it worked.\n\nAll 14 checks pass.\nNothing further.\nDone.")],
    expect: "allow",
    why: "must-NOT-catch: anchored to the LAST lines, so a rhetorical mid-message question is ignored",
  },
  {
    name: "stop-hook-active",
    entries: [userMsg("go"), asstText("Should I proceed?")],
    stopHookActive: true,
    expect: "allow",
    why: "loop guard: we already blocked once this turn",
  },
  {
    name: "tool-results-dont-end-the-turn",
    entries: [userMsg("go"), asstAsk(), toolResult(), asstText("Which option do you want?")],
    expect: "allow",
    why: "SELECTION test: a tool_result is also a `user` entry; treating it as the turn boundary would hide the earlier AskUserQuestion and block wrongly",
  },
];

const dir = mkdtempSync(join(tmpdir(), "adt-"));
let pass = 0;
let fail = 0;

for (const c of CASES) {
  const tpath = join(dir, `${c.name}.jsonl`);
  writeFileSync(tpath, c.entries.map((e) => JSON.stringify(e)).join("\n") + "\n");

  const proc = Bun.spawnSync({
    cmd: ["bun", "run", HOOK],
    stdin: Buffer.from(JSON.stringify({
      hook_event_name: "Stop",
      stop_hook_active: c.stopHookActive ?? false,
      transcript_path: tpath,
    })),
    stdout: "pipe",
    stderr: "pipe",
  });

  const out = proc.stdout.toString().trim();
  let got: "block" | "allow" = "allow";
  if (out !== "") {
    try {
      got = JSON.parse(out).decision === "block" ? "block" : "allow";
    } catch {
      got = "allow";
    }
  }

  if (got === c.expect && proc.exitCode === 0) {
    console.log(`PASS  ask-dont-tell: ${c.name} -> ${got} (${c.why})`);
    pass++;
  } else {
    console.log(`FAIL  ask-dont-tell: ${c.name} -> expected ${c.expect}, got ${got} (exit ${proc.exitCode}) (${c.why})`);
    if (proc.stderr.toString().trim()) console.log(`        stderr: ${proc.stderr.toString().trim().slice(0, 200)}`);
    fail++;
  }
}

console.log(`ask-dont-tell-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
