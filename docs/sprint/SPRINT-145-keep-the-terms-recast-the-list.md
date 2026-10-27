---
sprint: 145
slug: keep-the-terms-recast-the-list
owner: Maintainer
last_updated: 2026-10-26
status: closed
gates_signed: G1,G2 @ 941242f1
plan_commit: 756aba28
update_trigger: sprint execute/close events
---

# SPRINT-145 — Keep the Terms, Recast the List

> **Theme:** A real Indonesian request memo needed three owner corrections after the humanizer pass, and none of them was
> a pattern the catalogs know: plain Indonesian written for infra terms of art, an internal to-do list handed to the
> recipient, and hedges and label-first fragments. This sprint teaches the Indonesian catalog to keep English terms of art
> and the overlay to recast a working list as requests, both proved on a retained sample that fails first.

## Scope

**In:** a "Domain terms of art" rule in the Indonesian term policy, with the Keep Indonesian list scoped to general
vocabulary and a synthetic memo fixture (T1) · LF-6, the to-do list recast as requests, with the Indonesian hedge and
fragment forms and the overlay count at six (T2).
**Out (deferred):** TASK-507 and TASK-523 (`needs-info`) · TASK-367, 402, 489, 498 (blocked) · TD-276 and TD-277 (filed,
not scheduled).

## Members

- docs/work/todo/TASK-525-keep-english-terms-of-art-in-indonesian-domain-text.md
- docs/work/todo/TASK-526-recast-an-internal-to-do-list-in-an-outward-request.md

## Plan

### T1 — Keep English terms of art in Indonesian domain text `[size: S · risk: low · class: execution · HITL · J1]`
Layers: `skills/humanizer/references/patterns-id.md` · `evals/fixtures/humanizer/term-of-art/` · `CHANGELOG.md`
  · `docs/work/todo/TASK-525-keep-english-terms-of-art-in-indonesian-domain-text.md`
  · `docs/work/in_progress/TASK-525-keep-english-terms-of-art-in-indonesian-domain-text.md`
  · `docs/work/done/TASK-525-keep-english-terms-of-art-in-indonesian-domain-text.md`
Depends-on: none
Cites: `TASK-525` · L-255 · L-252 · L-259 · `evals/fixtures/humanizer/fact-keep/`

The pass wrote plain Indonesian for infra terms of art because the term policy only knows KBBI coinages. A rule with five
example rows fixes the class, not the five words; the fixture is synthetic (owner ruling at triage: the memo's
pre-correction text is gone) and must fail on 2.17.0 before the fix is judged.

**Acceptance:** three runs on the new fixture keep every term of art in English and every fact, where the 2.17.0 baseline
did not.

### T2 — Recast an internal to-do list in an outward request `[size: S · risk: med · class: execution · HITL · J1]`
Layers: `skills/humanizer/references/patterns-lf.md` · `skills/humanizer/references/patterns-id.md`
  · `skills/humanizer/SKILL.md` · `README.md` · `CHANGELOG.md` · `evals/fixtures/humanizer/term-of-art/NOTES.md`
  · `docs/work/todo/TASK-526-recast-an-internal-to-do-list-in-an-outward-request.md`
  · `docs/work/in_progress/TASK-526-recast-an-internal-to-do-list-in-an-outward-request.md`
  · `docs/work/done/TASK-526-recast-an-internal-to-do-list-in-an-outward-request.md`
Depends-on: T1
Cites: `TASK-526` · `evals/fixtures/humanizer/term-of-art/` · L-252 · L-259

A request should hand the recipient terms, not the writer's open questions; the pattern recasts each item and drops
none, so it stays inside the keep-every-fact rule. Depends on T1 for the fixture and for the order of
`skills/humanizer/references/patterns-id.md` and `CHANGELOG.md` (D1).

**Acceptance:** three runs on the T1 fixture recast every open item as a request or question, keep every fact, and drop
the fragments and the hedging wording.

## Decisions (pre-locked)

- **D1** — `CHANGELOG.md` and `patterns-id.md` are shared by both tasks, owned in T order: execution is sequential in the
  main tree (T1 → T2). Status moves, Log and sprint-file edits commit as bare `sprint(145):` (L-238); each member's
  `review/` path is declared in `Layers:` up front, so a tick there is attributable (L-258).
- **D2** — Both tasks change a shipped skill, so each takes the Codex review → fix → re-review loop, cap 2 rounds; the
  review input carries every file the verdict rests on. One `consequence · Tn ·` line per task in the log.
- **D3** — Before ticking, run every check that reads the touched file, each as itself (L-251); the full gate runs on
  the VPS runner.
- **D4** — Fixture runs are judged by a reader that did not write the brief (L-259): a fresh judge or Codex, never the
  coordinator alone.

## Assumptions

- **A1** — A synthetic sample built from the four reported corrections can make the 2.17.0 pass fail on terms of art.
  If the baseline keeps them, the sample is strengthened before the fix is judged (L-255). *Confirm: T1 baseline runs.*
- **A2** — Recasting a list keeps every item, so LF-6 does not conflict with the embedded fact list and check; the T1
  fixture's fact list counts each open item. *Confirm: T2 G2.*
- **A3** — The fixture is a document, so its runs take the embedded child path (format `markdown`), not the inline
  commit-message path. *Confirm: T1 G2 against `embedded.md` § Route.*

## Execution Log

> **Lives in its own file** — [`logs/SPRINT-145-keep-the-terms-recast-the-list.md`](logs/SPRINT-145-keep-the-terms-recast-the-list.md)
> (STANDARD §9 · ADR-014). Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `skills/humanizer/references/patterns-id.md` | T1 · T2 | Domain terms of art subsection, Keep Indonesian scope line; ID-18 and an ID-2 fragment example | Med | baseline 0/3 → after 3/3 (T1); final text 3/3 (T2); fresh judge |
| `evals/fixtures/humanizer/term-of-art/` | T1 · T2 | new synthetic memo fixture: sample, 15 facts, NOTES with every recorded run | Low | fails on 2.17.0 first (L-255) |
| `skills/humanizer/references/patterns-lf.md` | T2 | LF-6: a working list recast as requests; count six | Med | final text 3/3; Codex R2 |
| `skills/humanizer/SKILL.md` | T2 | overlay count six, audit order LF-1 to LF-6 | Low | grep |
| `README.md` | T2 | overlay count six | Low | count-claims harness green |
| `CHANGELOG.md` | T1 · T2 | two `[Unreleased]` lines | Low | read-through |

## Retro
<!-- Written at close. Route the buckets to durable homes (STANDARD §10):
     shipped → CHANGELOG.md (root; legacy docs/) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->

**Outcome** — 2 of 2 members delivered (TASK-525, TASK-526); 10 of 10 DoD boxes ticked. System verify on the VPS gate
FAILed once on `86b8afad` (`layers observed`: the two `review/` tokens declared at promote matched nothing), was fixed by
scope-change and passed 315/0 on `72b30d12` (owner ruling: fixed-and-rerun). Both tasks were exercised on a retained
synthetic memo that failed on the 2.17.0 pass first: T1 went from 0 of 3 to 3 of 3; T2 reached 3 of 3 on its final text
after one retry, an owner ruling on what counts as a hedge, and a Codex-driven rewrite of ID-18.

**Retrieval check** — one miss, one overcorrection. L-258's first sighting was read as "declare `review/` up front", and
that guess failed the other way at close (unused tokens, L-240); L-258 now carries both sightings and the route-free rule.
L-255 (baseline first), L-252 (three runs), L-254 (pinned exports), L-259 (a judge that did not write the brief) and
L-257 (full paths in scope-change bodies) were all applied and held. L-254 slipped once in the coordinator's setup: two
exports under one `--add-dir` let a run read the wrong catalog; the run was discarded unjudged.

**Cost** — coordinator inline (Opus) for both builds. Sub-agents: two Sonnet builder checks (~58k each); one Sonnet judge
for T1 (~55k) and one for T2 reused three times (~54k–60k); Codex rounds: intake ×2, T1 ×1, T2 ×2 (~20k–29k agent tokens
each). Headless: sixteen child-path runs ($0.29–$0.39 each; T1 three baseline and four after, one discarded; T2 nine).
Gate: three VPS runs. Coordinator tokens were not measured.

**Worked**
- Baseline first: the synthetic sample failed on 2.17.0 in 3 of 3, so the fix had something to prove.
- The blind judge (shuffled labels) and the reused T2 judge kept every verdict off the coordinator's own reading.
- Codex caught two example pairs that broke the overlay's facts-equal rule after the builder check had passed them.

**Friction**
- The hedge criterion needed an owner ruling ("by our calculation" is the claim's basis, not a hedge), then a catalog
  rewrite and a re-measure to match it; three T2 run sets where one was planned.
- System verify failed at close again, this time on the SPRINT-144 fix itself.

**Buckets** — Shipped → CHANGELOG `[Unreleased]` (two lines). Tech debt → none new. Follow-ups → none. Learnings → L-258
to count 2 with the refinement (promotable at the next promote).
