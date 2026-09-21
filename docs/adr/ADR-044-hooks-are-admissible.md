---
id: ADR-044
tags: [process, tooling]
domain: governance
status: accepted
related: [ADR-001, ADR-002, ADR-011, ADR-010]
supersedes_in_part: [ADR-002, ADR-011]
---

# ADR-044 — Hooks are admissible, held to the curation bar, and the first one ships

- **Status:** accepted (2026-09-21)
- **Deciders:** Maintainer
- **Context driver:** `L-002` — a blocking question must be surfaced as an `AskUserQuestion` popup,
  never left in prose — is written in `.claude/CLAUDE.md`, `.claude/CONTEXT.md`, `docs/LEARNINGS.md`
  and the maintainer's own memory file, and appears in more than ten files. It still fails
  routinely. The owner, 2026-09-21: *"this happen every time, please fix this also."* Writing it a
  fifth time is the single intervention already known not to work.

## Context

`ADR-002` ruled that lean-flow leverages Claude's built-ins and **ships no agent definitions**.
`ADR-011` ruled there is **no gate enforcement** and no in-core hook. Both were right for what they
were deciding, and both have since been quoted as a blanket *"lean-flow ships no hooks"* — a line
that now appears in the plugin description, the README's second line, `CLAUDE.md`, `CONTEXT.md`,
`overview.md` and four other ADRs.

`ADR-001` never said that. It ruled **curated, not copied** — every component clears "genuinely
useful **and** important **and** actually used" — and explicitly recorded that framing the project
as *"no agents / no hooks / few features"* was **"too extreme"** and **"kept mis-describing"** the
intent, listing "Minimal-by-rule (no agents / no hooks, ever)" as a **rejected** option because it
*"exiled genuinely useful tools"*. `CLAUDE.md` already carries the correct reading: *"Agents/hooks
aren't banned — they're held to that same bar."*

So the blanket phrasing was a **proxy** for the curation bar, and it has done what proxies do: it
started being enforced in place of the thing it stood for. This is the same failure `EPIC-017`
documents one level down, where a newline count is enforced and `STANDARD` §157's "split, never
squeeze" is not.

**The whole `"no X"` family is the problem, and one member was simply false.** The banner read
*"No hooks · no scaffold · no custom agent definitions."* Checked against the code on 2026-09-21:

| Claim | Reality |
|---|---|
| no hooks | true until this ADR; now one ships |
| **no scaffold** | **FALSE, and has been for a long time** — `/lean-doc-generator init` is titled *"Scaffold a fresh repo"* and writes the doc tree plus a three-file safe-scaffold allowlist (`.env.example` · `.gitignore` · …) |
| no custom agent definitions | true today — there is no `agents/` directory |

A marketing line advertising the *absence* of a feature the plugin ships is worse than untidy: it
is the front door telling an evaluating consumer not to look for something that is there. Nobody
re-checked it because a negative claim reads as stable — there is no diff that makes "we still
don't have X" look wrong. That is exactly why it went unnoticed while `init` was built, shipped and
documented.

**Why `L-002` in particular cannot be fixed by more prose.** The rule's subject is *the moment a
turn ends*. There is no skill step at that moment — by definition the flow is over — so every
written placement is a reminder to an agent that has already stopped reading. A rule whose trigger
is an event the procedure does not cover has nowhere to live except a hook on that event. This is
`L-105`'s temporal test ("when does this fire relative to the thing it guards?") answered honestly:
never, in any of the four places it is written.

**The process has also matured past the original caution.** `ADR-011`'s worry was that enforcement
would harden advisory gates into blockers a consumer could not escape. That concern is about
*gates*, and it still stands — this ADR does not touch it. A Stop hook that fails open, blocks at
most once per turn, and asks the agent to re-surface a question is not gate enforcement.

## Decision

**Hooks are admissible components, held to exactly the curation bar `ADR-001` sets — no more, no
less. The blanket "ships no hooks" claim is retired as inaccurate.**

- `ADR-002` is **amended, not superseded**: lean-flow still ships **no agent definitions of its
  own**, and still dispatches Claude's built-ins. Only its hook clause is lifted.
- `ADR-011` is **amended, not superseded**: G1/G2 remain advisory, human-approved, and unenforced.
  **No hook may block a gate.** A hook that turned a gate into a blocker would need its own ADR and
  should expect to be refused.
- **The first hook ships:** `hooks/ask-dont-tell.ts`, registered on `Stop` via `hooks/hooks.json`.
  It blocks the stop when a turn ends on a decision point with no `AskUserQuestion` call in that
  turn, and hands back an instruction to re-surface it properly.
- **Agent definitions are admissible on the same terms.** None ship today and none are added here;
  the change is that "we ship none" stops being a *promise* and becomes a *fact about the current
  roster*, revisited when a candidate clears the bar. `ADR-010`'s dispatch discipline already
  governs how one would be used.
- **The "no scaffold" claim is deleted as false**, not softened. `/lean-doc-generator init`
  scaffolds, and the front door now says so.

**Describe the roster, never promise its absence.** Every remaining component claim states what is
*in* the plugin today. A negative claim is unfalsifiable by ordinary review — no diff makes "we
still don't have X" look wrong — which is how the scaffold line survived the shipping of `init`.

**Standing constraints on any hook here**, so this does not become the bulk-import `ADR-001` exists
to prevent:

1. **Fails open.** Every unexpected condition — unreadable transcript, malformed JSON, missing
   field — allows the action. A hook that wedges a session is worse than the miss it prevents.
2. **Cannot block a gate**, a commit, or a tool call. Advisory correction only.
3. **Bounded.** It must respect `stop_hook_active` (or its per-event equivalent) so it cannot loop.
4. **Retained fixtures, proven to discriminate.** Tier G: a must-FAIL case per branch with its
   named finding, must-NOT-catch controls, and a seeded break showing exactly the carrying cases
   redden. `evals/run-ask-dont-tell-fixtures.ts` is the retained proof.
5. **Clears the curation bar** — genuinely useful **and** important **and** actually used — argued
   in the ADR that adds it, not asserted.

## Consequences

- **Consumer-visible.** Installing the plugin now installs a Stop hook. Said plainly in the README
  and the plugin description rather than left for a consumer to discover in `/hooks`.
- The `verify` half of `L-002` becomes reachable for the first time: whether the rule fires is now
  observable, where before it was only assertable.
- **A real risk, named:** a false positive is more annoying than a false negative, because it
  interrupts correct work. Mitigated by anchoring detection to the last three lines and requiring
  decision-shaped language, with must-NOT-catch fixtures for a plain report and a mid-message
  rhetorical question. If it proves noisy in practice the honest response is to narrow the patterns
  or withdraw it, **not** to widen the fixture set until it looks green.
- Eight files carried the retired phrasing. All are corrected in this change; the four other ADRs
  that quote it (`ADR-016`, `ADR-027`, `ADR-033`, and `ADR-011` itself) keep their historical text —
  they are append-only records of what was true when written, and this row is what a reader follows
  forward.
