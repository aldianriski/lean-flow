---
id: ADR-044
tags: [process, tooling]
domain: governance
status: accepted
related: [ADR-001, ADR-002, ADR-011, ADR-010]
supersedes_in_part: [ADR-011]
---

# ADR-044 — Hooks and agent definitions are admissible, held to the curation bar

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
| no hooks | true, and still true — this ADR makes hooks *admissible*, not present; the first candidate was withdrawn at review (TASK-366) |
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

**What `ADR-011` actually rejected, stated properly.** An earlier draft of this ADR claimed
`ADR-011`'s worry was "about gates" and therefore untouched. That was a reframing, and an outside
review caught it. `ADR-011`'s rejected option **B** is *"hook inside the lean-flow plugin — Platform
fact: hooks auto-activate with the plugin, **no per-hook disable ⇒ mandatory for every consumer** —
violates the opt-in requirement and the hook-free core."* The load-bearing reason is the
**platform fact**, not gates, and it applies to any hook this plugin ships, including a Stop hook.
Re-verified against the installed CLI: `disableAllHooks` and `allowManagedHooksOnly` exist, both
all-or-nothing; there is **no per-hook disable**.

So a hook here is **mandatory for every consumer**, and their only escape is switching off all
hooks or uninstalling. That does not make hooks inadmissible — it sets the bar one notch above
"useful": a hook must be one a consumer would not want to disable, because they effectively
cannot. `ADR-011` is therefore **superseded in part**, on the record, rather than reframed.

**The first candidate did not clear that bar, and was withdrawn.** `ask-dont-tell` (a `Stop` hook
for `L-002`) was built, reviewed worktree-isolated, and measured against 48 real transcripts —
5,451 assistant blocks, 746 completed turns. It would have blocked ~35 turns with **~22 false
positives (≈60%)**, while missing ≥9 genuine inline decisions, 8 of them because its patterns were
English-only and the maintainer works bilingually (`Mau saya …?` is "Want me to …?"). Its own
fixture suite could not see any of this: both blocking fixtures were keyed to patterns that fire
**0 and 2 times** in the corpus, and deleting every pattern that *does* fire left the suite fully
green. Withdrawn under this ADR's own clause — *narrow it or withdraw it, never widen the fixtures
until it looks green* — and re-filed as `TASK-366`. Recorded here because "we considered a hook and
it failed the bar" is the part a future reader needs; an ADR that only lists what shipped teaches
nothing about the bar.

## Decision

**Hooks are admissible components, held to exactly the curation bar `ADR-001` sets — no more, no
less. The blanket "ships no hooks" claim is retired as inaccurate.**

- **`ADR-002` is untouched.** An earlier draft of this ADR said "only its hook clause is lifted"
  and listed it under `supersedes_in_part`. That was **factually wrong** and an outside review
  caught it: `grep -ci hook` over `ADR-002` returns **0**. It rules on *agent definitions* and says
  nothing about hooks. There was no clause to lift. The blanket "no hooks" reading was `ADR-011`'s
  gloss on `ADR-002`'s lineage, never `ADR-002`'s own ruling — and this ADR briefly repeated the
  same mis-citation it exists to correct.
- **`ADR-011` is superseded in part**, honestly and not softened — see § Context for the reason it
  actually gave. What survives untouched: G1/G2 remain advisory, human-approved and unenforced, and
  **no hook may block a gate**. A hook that turned a gate into a blocker needs its own ADR and
  should expect refusal.
- **No hook ships today.** The stance changes; the roster does not. The first candidate was
  withdrawn at review (§ Context), so this ADR opens a door rather than walking through it.
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
2b. **Worth being mandatory.** There is no per-hook disable, so shipping one imposes it on every
   consumer. The bar is not "useful" but "a consumer would not want to switch this off" -- and it
   is measured against REAL input before shipping, never argued.
3. **Bounded.** It must respect `stop_hook_active` (or its per-event equivalent) so it cannot loop.
4. **Retained fixtures, proven to discriminate.** Tier G: a must-FAIL case per branch with its
   named finding, must-NOT-catch controls, and a seeded break showing exactly the carrying cases
   redden -- AND the fixtures must be drawn from REAL input, not invented. The withdrawn candidate
   passed 7 of 7 hand-written fixtures while being wrong on 60% of real turns.
5. **Clears the curation bar** — genuinely useful **and** important **and** actually used — argued
   in the ADR that adds it, not asserted.

## Consequences

- **No consumer-visible change today.** The roster is unchanged; only what is *permitted* moved.
  Had the candidate shipped, it would have been mandatory for every consumer at a 60% false-positive
  rate -- which is precisely what ADR-011 was protecting against, and why its reason had to be
  engaged rather than reframed. Superseded text kept for the record:
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
