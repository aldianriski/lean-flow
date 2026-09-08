---
id: ADR-040
tags: [process, tooling]
domain: governance
status: accepted
related: [ADR-029, ADR-021]
---

# ADR-040 — Commit ownership trusts the cited sprint number, symmetrically, and accepts the laundering channel

- **Status:** accepted (2026-09-08)
- **Deciders:** Maintainer
- **Context driver:** three designs in one sprint were each broken by an independent review, each the
  same class one level deeper. The loop does not end by refining; it ends by ruling.

## Context

`check-layers-observed.sh` asks two different questions of the same list. *Is this sprint still active
work?* — where excluding `docs/sprint/archive/` is right. *Does this sprint own its commits?* — where
a closed sprint owns its history forever, archived or not. One list answered both, which is what
**TD-125** records.

To answer the second question, something must decide whether a commit belongs to another sprint. The
only available signal is the **sprint number in the commit subject**, and that is a claim nobody
verifies. SPRINT-095 T1 tried three ways to make it verifiable, and an independent review broke each:

1. **Trust the cited number.** The archive holds 91 sprints, so 91 numbers exempt anything.
2. **Number + window.** Windows legitimately nest — SPRINT-089 (`5f0682b..cc46d18`) and SPRINT-090
   (`b7437de..cc46d18`) share a close commit, so 090's window sits inside 089's.
3. **Number + declarations.** Declarations are shared: `docs/LEARNINGS.md` is declared by **74 of 91**
   archived sprints.

Each fix was locally reasonable and each strictly narrowed the hole, which is why the loop was
seductive — progress was real and convergence never arrived (**L-190**).

**What makes now the right time is a fact found outside the task.** The **active**-sibling arm has
always been skipped on the cited number alone, with no declaration test and no window test
(`check-layers-observed.sh:519`, and identically at `2335eab~1`, before any of this work). All three
designs were therefore being held to a bar the surrounding code had never met — and the code says so
about itself, in the comment directly above the skip: *"Two ownership tests, deliberately asymmetric
(TD-125)."* The asymmetry was asserted as intentional and never ruled. That is **TD-141**.

**Measured blast radius.** The third design is on `main`, **unticked**: `2335eab` · `f1fdf02` ·
`e4547b3`, **+94 lines / 0 removed** against one file, at **0 of 6 DoD**. The repository is currently
running a design its own review rejected. The two arms it produced are asymmetric in bar: archived
sprints face declaration + window, active siblings face a bare string match.

## Decision

**A commit citing another sprint's number belongs to that sprint — archived or active, with no
further test — and this repository accepts the laundering channel that follows.**

The rule is one rule, applied to both arms. SPRINT-095 T1's declaration + window machinery is
reverted, because it buys a bar on one arm that the other arm does not meet, and an inconsistent bar
is not a stronger guard — it is an unruled tension wearing the shape of one.

Concretely, both arms are decided by one membership test against `sibling_sprints`: the **active** arm
already skips on membership alone (`case " $sibling_sprints " in *" $c_sprint "*`) and is unchanged,
and the **archived** arm stops carrying a second, stricter test and joins it. Symmetric acceptance
therefore requires archived sprint numbers to be *in* `sibling_sprints`, so archived sprints are
discovered from their filenames — no `git`, no frontmatter read, no window — rather than excluded from
it by the `*/archive/*` filter on the list build. A literal revert would drop them from the set
entirely and flip the asymmetry instead of removing it.

**Why this over the alternatives:** the question is not answerable from the inputs. A commit subject
is prose a human typed, and every mechanism that tries to make it verifiable is another proxy for the
same unverifiable claim. The choice is therefore not *which proxy* but *which failure this repository
accepts* — and between a guard that produces false positives on every archival and a guard with a
documented, bounded hole, the hole is the one that does not block work. Naming it is what makes it a
decision rather than an accident: the previous state had the same hole on one arm and called it
*"the pre-existing behaviour"*.

## Consequences

**Positive:** archiving a closed sprint no longer turns the gate red, which unblocks §11 retention
after four consecutive closes parked it. One rule covers both arms, so the next reader who finds the
skip finds the ruling beside it instead of re-opening the loop for a fourth time. 94 lines of unticked,
review-rejected machinery leave the tree, and the guard stops claiming a strength it does not have.

**Negative (trade-offs accepted):** the laundering channel is now open on **both** arms and documented
as accepted — a commit whose subject cites a real sprint number is exempt from the undeclared-file
check, so mislabelled, copy-pasted, cherry-picked or deliberately evasive subjects can hide genuinely
undeclared work. The set is bounded by the sprint numbers that exist (currently 96, of which 93 are
archived), not unbounded, but that is a narrower hole rather than no hole. **`check-layers-observed.sh`
is therefore not a guard against a dishonest commit subject and must not be cited as one.** Closing
this properly needs a signal that is not the subject; the route is recorded below, not taken.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Keep the archived-arm window test as defence-in-depth | The bar stays knowingly inconsistent, the kept code is at 0 of 6 DoD and was broken by an independent review, and TD-141's finding — that the two arms are held to different bars for no stated reason — survives the ruling meant to settle it |
| Number + window (design 2) | Windows nest: SPRINT-089 and SPRINT-090 share a close commit, so one sprint's window sits inside another's |
| Number + declarations (design 3) | Declarations are shared — `docs/LEARNINGS.md` is declared by 74 of 91 archived sprints |
| Make archival not change the checker's input set — glob `archive/` into `qa-check.sh` | Checker subjects go **3 → 96**, a 32× increase on a gate that already cannot finish (TD-090 · TD-117, and an attempt during this sprint's own promote was killed for host memory before emitting one check) |
| Change the signal — a `Sprint: NNN` git trailer written at commit time and checked against the Plan | The only option that **closes** the channel rather than narrowing it, and the only one whose ownership claim is written by tooling rather than typed by a human. Rejected on size, not on merit: 0 of the last 60 commits carry any trailer, so it is new protocol on every future commit, and it cannot retro-fit the 91 archived sprints. **Re-open this if the accepted hole is ever exercised in anger** |
| Remove the skip entirely and report every sibling commit | Returns TD-125's false positives by choice; the gate blames one stream for another's in-flight work, which is the behaviour the skip exists to prevent |
