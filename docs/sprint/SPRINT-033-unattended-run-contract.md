---
sprint: 033
slug: unattended-run-contract
owner: Maintainer
last_updated: 2026-07-29
status: active
plan_commit: 350fa4d
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-033 — Unattended-Run Contract

> **Theme:** Night-run shipped the *execution* half — a pre-flight checklist and a headless trigger for
> a sprint whose gates were already signed. It never said what an unattended run does when it *reaches*
> a HITL step, so the agent improvises. Under `--permission-mode dontAsk` an `AskUserQuestion` is
> auto-denied, and nothing in lean-flow states that a denied question is not an approval — a gate could
> be passed by nobody. This sprint encodes the boundary so the safe behaviour is the specified one.

## Scope

**In:** the AFK/HITL derivation rule + boundary table · the park protocol (park → continue disjoint →
clean halt) · absence≠consent as a hard invariant · wiring into every skill that owns a HITL step
(`/orchestrator` · `/flow` · `/lean-doc-generator` · `/triage`) · consumer surface (README · CHANGELOG ·
MINOR lockstep) · one real headless exercise.

**Out (deferred):** pre-authorizing HITL steps for unattended execution (charter is execute-only —
owner call, this session) · the OS-level watchdog (already specified, night-run Part 3) · allowlist-building
mechanics (still the open follow-up from `docs/research/night-run.md`) · TASK-074's ADR-012 relocation.

## Plan

### T1 — Encode the unattended-run contract `[size: M · risk: med]`
Layers: `skills/orchestrator/references/night-run.md`
The contract belongs where the operational night-run procedure already lives, not spread across skills.
It must be *derivable*, not a memorized list — a cold-context agent meeting an unlisted step needs a rule
that decides for it. Hence one derivation rule first, the table second as its worked output.

**Acceptance:** night-run.md answers, without judgement calls: how the run knows it is unattended, which
steps it may not run, what it does instead, and what the human reads in the morning.

**DoD:**
- [x] Mode signal stated — unattended is **declared** at trigger, never inferred; absent signal → interactive
- [x] Derivation rule stated — AFK-safe = additive + reversible + already-approved-in-scope; HITL = approval · judgement · lossy/destructive · scope-changing
- [x] HITL boundary table lists every known step (gates · grill · promote governance · close §11 · triage apply · migrate/init per-item · scope-change)
- [x] **Absence ≠ consent** — a denied/unanswerable question is a BLOCK, never a default-yes, never self-approval
- [x] Park protocol: park record → continue disjoint AFK work → clean halt when no AFK work remains
- [x] Pre-authorization rule: a gate is pre-signable only if its subject **exists and is frozen** at pre-flight
- [x] Part 4 rollup vocabulary gains `parked-hitl`

### T2 — Add the unattended contract to the CONTEXT.md SSOT `[size: S · risk: low]`
Layers: `.claude/CONTEXT.md`
CONTEXT is the SSOT for gates and modes; a contract that overrides gate behaviour has to be visible there
or it will be missed by anyone reading the gates section. Pointer, not a copy (ADR-007 cap).

**Acceptance:** a reader of § Gates learns unattended runs exist and never self-approve, in ≤8 lines.

**DoD:**
- [x] Charter + absence≠consent + park recorded, ≤8 lines, pointing at night-run.md for detail
- [x] No duplication of the boundary table
- [x] File still under its cap

### T3 — Wire the park protocol into /orchestrator + /flow `[size: S · risk: low]`
Layers: `skills/orchestrator/SKILL.md` · `skills/flow/SKILL.md`
Shipping ≠ wiring (L-020): the contract must fire at the two places that actually drive an unattended run.

**Acceptance:** `sprint-bulk` and `/flow` each state their unattended behaviour at the step where it applies.

**DoD:**
- [ ] sprint-bulk steps 4–5 state park-instead-of-ask under unattended
- [ ] Red flag added: a denied/unanswerable question read as approval
- [ ] `/flow` states only stage 4 (Build) runs unattended; stages 2 · 3 · 5 park
- [ ] Both files still within the ~110-line cap

### T4 — Wire the park protocol into /lean-doc-generator + /triage `[size: S · risk: low]`
Layers: `skills/lean-doc-generator/SKILL.md` · `skills/triage/SKILL.md`
These own the two HITL steps the real overnight run actually collided with (promote governance sign-off,
close §11 retention) plus triage's apply-after-`y`, which under `dontAsk` waits on a `y` that never comes.

**Acceptance:** each HITL approval point names its unattended behaviour inline.

**DoD:**
- [ ] promote governance sign-off states the unattended park
- [ ] close §11 retention + doc-freshness state the unattended park (four-bucket auto-file stays AFK-safe — additive)
- [ ] `/triage` apply states the park
- [ ] Line caps hold

### T5 — Surface night-run + the contract on the consumer face `[size: S · risk: low]`
Layers: `README.md` · `docs/CHANGELOG.md` · `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json`
L-015: README currently says **nothing** about the unattended path — a shipped capability invisible to the
consumer who installs the plugin. Feature sprint → MINOR by hand.

**Acceptance:** a consumer reading README learns the unattended path exists and what it will and will not do.

**DoD:**
- [ ] README documents the unattended run + its execute-only charter
- [ ] CHANGELOG entry written
- [ ] plugin.json + marketplace.json bumped to the same MINOR version (lockstep)

### T6 — Exercise the park protocol on a real headless run `[size: S · risk: med]`
Layers: (verification — no source change)
The spec-only-debt trap (L-007 · TD-001): a new capability's final DoD is *exercised once on real input*.
A contract about unattended behaviour that has only ever been read, never run, is exactly that debt.

**Acceptance:** a real `claude -p --permission-mode dontAsk` invocation meets a HITL step and parks —
observed, not asserted.

**DoD:**
- [ ] Headless run fired at a HITL step
- [ ] Observed outcome: parks (record + clean exit), does not self-approve and does not hang
- [ ] Transcript/result recorded in this file's Execution Log

## Decisions (pre-locked)

- **D1** — Charter is **execute-only + park**: an unattended run executes a promoted Plan and parks every
  HITL step. Rejected: pre-authorizing HITL steps (grants approval over content that does not exist yet)
  and halt-on-first-HITL (burns the rest of the night). Owner call, this session. Not hard-to-reverse
  (a checklist + wiring, no schema change) → no ADR, consistent with `docs/research/night-run.md`.
- **D2** — The boundary is **derived, not enumerated**: AFK-safe = additive + reversible +
  already-approved-in-scope. The table is the worked output, so an unlisted step still resolves.
- **D3** — Unattended is **declared at trigger, never inferred**. No reliable in-session headless signal
  exists to detect it; a wrong inference in either direction is unsafe, so it is an explicit input.

## Assumptions

- **A1** — Under `--permission-mode dontAsk` an `AskUserQuestion` is auto-denied rather than answered.
  *Confirm: T6's real headless run — this is the assumption the whole sprint rests on.*
- **A2** — The real overnight run collided with promote governance + close retention specifically.
  *Confirm: owner report, this session.*

## Execution Log

### 2026-07-29 | promote | Plan locked
Six tasks pulled from TODO Backlog P1 (TASK-100…105) in dependency order: contract → SSOT → wiring →
consumer surface → real-input exercise. Governance review ran clean (no L-promotion at count≥2, no open
TD, no §11 doc-aging due). Trigger: a real overnight run improvised a HITL split instead of following a
specified behaviour.

### 2026-07-29 | T1 | Contract encoded — night-run.md Part 0
Derivation rule first, table as its worked output. Two findings while writing it: (a) `close` is not
all-or-nothing — Retro + four-bucket auto-file + `close_commit` are additive and stay AFK-safe, only
§11 retention and doc-freshness park, which keeps most of close's value overnight; (b) added an
explicit "never work around the park" clause — rewriting a task to dodge a gate is itself
scope-changing, and that is exactly the improvisation this sprint exists to remove.

### 2026-07-29 | T2 | SSOT entry added — CONTEXT.md § Gates
First draft ran the file to 134/130 (ADR-007 cap). Compressed to two dense lines rather than raising the
cap or deleting neighbouring content — lands at **exactly 130/130, zero headroom**. That is the L-008 /
TD-006 signal firing again: the SSOT has no room for the next rule. Filing a TD at close rather than
running an unrequested dedup pass mid-sprint.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/orchestrator/references/night-run.md` | T1 | the contract had no home — night-run covered execution only | Med | T6 real headless run |
| `.claude/CONTEXT.md` | T2 | gate readers must see that unattended runs never self-approve | Low | cap check 130/130 |

## Retro

**Retrieval check** — did we fail to find, or contradict, a prior `L-NNN`/ADR this sprint?

**Worked**

**Friction**

**Pattern candidate** (surface to user → `docs/LEARNINGS.md`)
