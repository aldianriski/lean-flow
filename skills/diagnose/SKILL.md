---
name: diagnose
description: Use when debugging a defect, unexpected behaviour, failing test, or performance regression. Runs a disciplined 6-phase loop — build a feedback loop, reproduce, hypothesise, instrument, fix with regression test, cleanup + post-mortem. Do not use for architectural analysis or planning — use /orchestrator mvp instead.
argument-hint: "[bug description | failing test | performance regression]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
version: "0.2.0"
---

# Diagnose

A discipline for hard bugs. The rate of feedback is your speed limit — build the loop first. Skip a
phase only when you can explicitly justify it.

## Phase 1 — Build a feedback loop

**This is the skill** — everything else just consumes the signal. Get a fast, deterministic,
agent-runnable pass/fail signal for the bug and you will find the cause. Spend disproportionate
effort here; be aggressive, refuse to give up.

- Prefer an **automated test** at the seam that reaches the bug; then curl/HTTP, CLI snapshot-diff, headless browser, replay a captured trace, a throwaway harness, fuzz, `git bisect run`, or a differential loop. Full menu → `${CLAUDE_SKILL_DIR}/references/feedback-loops.md`.
- **Iterate on the loop** — faster, sharper signal, more deterministic. A 2-second deterministic loop beats a 30-second flaky one.
- **Non-deterministic bug?** Raise the reproduction *rate* (loop 100×, parallelise, stress), don't chase a clean one-shot repro.
- **Genuinely can't build one?** Stop, list what you tried, ask for env access / a captured artifact / instrumentation permission. **Do not hypothesise without a loop.**

## Phase 2 — Reproduce

Run the loop; watch the bug appear. Confirm:
- [ ] It produces the failure mode the **user** described — not a different nearby one (wrong bug = wrong fix).
- [ ] Reproducible across runs (or at a high enough rate to debug against).
- [ ] You've captured the exact symptom (error / wrong output / timing) so later phases can verify the fix.

## Phase 3 — Hypothesise

Generate **3–5 ranked, falsifiable** hypotheses *before* testing any — single-hypothesis generation
anchors on the first plausible idea. Each must state a **prediction**:

```
H1: [cause] — If this is it, then [changing Y] makes the bug disappear / [Z] makes it worse.
H2: …
```
If you can't state the prediction, it's a vibe — sharpen or discard it. **Show the ranked list to the
user before testing** (they re-rank instantly: "we just deployed #3"). Don't block if they're AFK.

## Phase 4 — Instrument

- Each probe maps to a specific Phase-3 prediction. **Change one variable at a time.**
- **Debugger / REPL > targeted logs at the distinguishing boundary > never "log everything and grep".**
- **Tag every debug log** with a unique prefix (`[DEBUG-a4f2]`) so cleanup is a single grep.
- **Perf regression?** Logs are usually wrong — establish a baseline measurement, then bisect. Measure first.

## Phase 5 — Fix + regression test

Write the regression test **before** the fix — but only if a **correct seam** exists (one that
exercises the real bug pattern at the call site). A too-shallow seam gives false confidence.
**If no correct seam exists, that itself is the finding** — the architecture is preventing lockdown;
flag it for Phase 6. When a seam exists: failing test (RED) → minimal fix (GREEN) → re-run the Phase 1
loop against the original, un-minimised scenario → full suite still passes.

## Phase 6 — Cleanup + post-mortem

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop)
- [ ] Regression test passes (or the absence of a seam is documented)
- [ ] All `[DEBUG-…]` instrumentation removed (grep the prefix); throwaway harnesses deleted
- [ ] The winning hypothesis is stated in the commit / PR message — so the next debugger learns

**Then ask: what would have prevented this?** If the answer is architectural (no good seam, tangled
callers, hidden coupling), file it as a `TD-NNN` tech-debt entry (groomed by `/triage`, aged at
promote) and hand the specifics to `/refactor-advisor` to design the deepening — make the call
*after* the fix lands, when you know the most.

## Red flags

❌ **Hypothesising without a feedback loop** — guessing compounds bugs; Phase 1 is non-negotiable.
❌ **Fixing the wrong bug** — the loop must reproduce the *user's* symptom, not a nearby one.
❌ **Multiple simultaneous changes** — violates one-variable-per-test; invalidates the diagnosis.
❌ **Untagged debug logs** — they survive cleanup; tag with `[DEBUG-…]` and grep them out.
❌ **Regression test at a false seam** — a shallow test that can't replicate the bug gives false confidence; no seam is a finding, not a skip.
❌ **Believing the mechanism a report arrives with** — a symptom is *observed*, the explanation welded to it is *inferred*, and they look equally factual on the page. Wrong three times running here (TD-024 blamed `git -C` on MSYS paths, then transient worktree state, before an inherited `MSYS_NO_PATHCONV`; TD-027 claimed a degrading permission surface, falsified by a 26-turn probe). Treat the symptom as data and the mechanism as the **first thing to test**, and prefer a recorded "not established" over a plausible story — a plausible story ends inquiry, an honest gap invites it (L-087).
