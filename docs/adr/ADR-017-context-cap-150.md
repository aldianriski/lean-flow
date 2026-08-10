---
id: ADR-017
tags: [docs, process]
domain: doc-standard
status: accepted
related: [ADR-007, ADR-015]
---

# ADR-017 — `CONTEXT.md`'s cap moves to 150, because the file grows by design

- **Status:** accepted (2026-08-10)
- **Deciders:** Maintainer
- **Context driver:** a learning that earned promotion had nowhere to be written.

## Context

At the SPRINT-060 promote, `L-108` cleared the promotion bar (`count: 3`) and could not be recorded.
§10's placement test sends a rule to where every flow that can hit it reads; for L-108 that is
`CONTEXT.md` or `CLAUDE.md`. Both were **exactly at their caps** — 130/130 and 80/80. The continuous
learning mechanism had stalled on line count.

§7 permits a cap to move by ADR, and only after a **measured** diet pass. That pass ran (SPRINT-060
T1) and is the substance of this decision, because it falsified the standing assumption.

**The diet pass found nothing removable.** TD-006 and L-008 both describe `CONTEXT.md` "accreting its
satellites' prose", and the task was written expecting to find duplication. Diffing the three files
section by section found the opposite: every `CONTEXT.md` section that touches a satellite's territory
*already* terminates in a pointer — `full rationale → CLAUDE.md`, `Diagram → README`, `→ DOCS_Guide`,
`→ ADR-010`, `→ dispatch.md`, `→ night-run.md`. The duplication that exists runs the **other
direction**: `README.md` restates the gates and modes as a front-door summary and defers to
`CONTEXT.md` as SSOT. Deleting those from `CONTEXT.md` would not remove a copy; it would remove the
original.

**Measured blast radius — what is actually driving growth.** Across the last ~12 sprints the file went
120 → 130 lines, **0.83 lines per sprint**. Every increment traces to a promoted rule or a new
governance mechanism, not to prose creep: L-094 and L-105's promotions, G1's fast-path provenance
clause, the epic-layer wiring, the PRD creates-vs-consumes boundary, ADR-016's rollup guarantee. The
file is at its cap **because the loop works** — each sprint's Retro is supposed to deposit durable
rules, and this is where the multi-flow ones land.

That is the difference between this ADR and a mega-doc. A cap exists to stop a document absorbing
content that belongs elsewhere. This document is absorbing content that belongs *here*, at a rate that
is slow, measured, and produced by the mechanism the project most wants to keep running.

## Decision

**`CONTEXT.md`'s cap moves from 130 to 150, hard**, cited inline in DOCS_Guide §2 as ADR-007 is.

150 is a real number, not a gesture (ADR-015): at the measured 0.83 lines/sprint it buys roughly **24
sprints** of headroom, which is a horizon long enough that the next occupant of this decision will have
new evidence rather than replaying this one.

It stays **hard**. A soft cap would have been the comfortable choice and it is rejected on purpose: the
forcing function is what produced this measurement. A hard cap converted a vague two-sprint-old
suspicion ("the file is bloating") into a diff that falsified it. A cap that merely reports would have
let the belief stand indefinitely, and the belief was wrong.

`CLAUDE.md` stays at 80. It is at 80/80 and was assessed in the same pass, but nothing forced the
question there — no rule is currently blocked on it. Moving a second cap on the strength of the first
one's argument is exactly the ceremony §7 exists to prevent; when a rule cannot land in `CLAUDE.md`,
that ADR gets written then, with its own diet pass.

## Consequences

**Positive:** `L-108` can be promoted at the next promote, and the learning loop resumes. The SSOT
stays a single file that `/prime` reads in one pass and every skill reads whole — no pointer-following
to assemble the contract. The growth rate is now a recorded number, so the next cap conversation starts
from evidence instead of an impression.

**Negative (trade-offs accepted):**

- **The conversation returns in ~24 sprints**, and at that point the honest answer may well be the
  split this ADR declines. Raising a cap twice is the pattern §7 warns about; a third raise should be
  read as a signal that one file is doing too many jobs, not as a routine renewal.
- **Nothing is deleted, so nothing gets cheaper to read.** A 150-line SSOT is more to hold than a
  130-line one, and the cost lands on every skill flow that reads it. The rate is what makes this
  tolerable, and the rate is the thing to re-measure — not the total.
- **TD-006's premise is now known to be false** and the row needs re-scoping rather than closing; the
  file was never accreting duplicated prose. Left as a debt row correction, not silently dropped.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Split `CONTEXT.md` into a tree (§7's first response) | Fragments the one file every skill flow reads and `/prime` loads whole; a reader would follow pointers to assemble a contract that is currently one read. ADR-007 already chose one-file deliberately, and nothing in the measurement argues that choice was wrong — only that the number was too small. |
| Raise to 150 **soft** | Comfortable, and it matches how §11 treats `TODO.md`. Rejected because the hard cap is what forced this diff to happen at all; converting it to a report would retire the only mechanism that has ever made anyone look. |
| Compress `CONTEXT.md`'s own content to fit | Explicitly forbidden by TASK-182's own done-when and by L-106's shape: re-wrapping prose to make a number go green leaves the same words, fewer lines, and a document that is no leaner. |
| Promote `L-108` somewhere with room | Fails §10's placement test — L-108 is about authoring checks in general, and burying it in a single skill's reference means the next checker author never reads it. |
