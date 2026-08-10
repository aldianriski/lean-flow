---
sprint: 062
slug: room-to-write
epic: EPIC-002
owner: Maintainer
last_updated: 2026-08-10
status: active
gates_signed: G1,G2 @ 19485be
plan_commit: ade3b81
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-062 — Room to Write

> **Theme:** EPIC-002's opening move. Three governance signals, and in each case the question is
> whether anything is listening: a cap that cannot be met (T1), a report with a matcher and no
> consumer (T2), and a promotion that may never be stamped (T3). None is a bug — every mechanism runs
> exactly as written, on every gate pass, and has done for sprints. That is what makes them the right
> first sprint: EPIC-003 and EPIC-004 are three epics' worth of new rules aimed at files that are
> already full, and rules land in the same machinery these three tasks are asking about.

## Scope

**In:** a recorded ruling on `qa-gate-timing.md`'s cap, carrying L-106's durable rule with it · a
consumer for the §2 soft-cap report at promote · a verdict on whether LEARNINGS promotion is being
stamped, and §11's collapse applied on that basis.

**Out (deferred):** the SSOT and TODO cap rulings (TASK-196 — `blocked` on T1, which sets the
precedent it applies) · the `docs/research/` archive pass (TASK-195) · the checker-consolidation
decision (TASK-197) · what `CONTEXT.md` becomes under extraction (TASK-198 — EPIC-003, not this
epic) · the other two §2 breaches, `graph-engineering.md` (122) and `loop-hygiene-prd.md` (139),
which TASK-192 explicitly rules a different question and must not be bulked in here.

## Plan

### T1 — Rule `qa-gate-timing.md`'s cap, and write the rule behind it `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/qa-gate-timing.md` · `skills/lean-doc-generator/references/DOCS_Guide.md` §2 ·
        `docs/adr/` · `docs/LEARNINGS.md` · `scripts/lib/doc-caps-grandfathered.txt`
Cites: `check-doc-caps.sh`
Depends-on: none

The doc is 223 against a 120 soft cap and is a longitudinal measurement log accreting one round per
sprint — it cannot be trimmed without deleting the measurements that are the point, which is L-106's
tell that the number is wrong rather than the file. ADR-015 forbids grandfathering a soft cap, so
"add it to the list" is unavailable and the figure has to be argued. The promote sign-off folded
L-106's promotion (count 3, `promoted: no`) into this task: the concrete ruling and the general rule
get written once, together, by the task holding the evidence.

**Acceptance:** `qa-gate-timing.md` no longer breaches a cap nobody intends it to meet, by a recorded
ruling — and L-106 reads `promoted: yes → <where>`, placed by §10's placement test.

**DoD:**
- [x] The ruling is recorded: either a §2 cap raised for this doc-kind by ADR, or the doc split per §6
- [x] The reasoning is written down either way — including why the *other* two breaches are a different question
- [x] L-106 is promoted to a durable rule, placed by §10's test (which flows can author an approximate figure a checker reads?), and its entry collapsed to a pointer per §11
- [x] `check-doc-caps.sh` no longer reports `qa-gate-timing.md`, and reports no *new* breach it did not report before

### T2 — Give the §2 soft-cap report a consumer at promote `[size: S · risk: low · class: decision · HITL]`
Layers: `skills/lean-doc-generator/SKILL.md` § Governance review ·
        `skills/lean-doc-generator/references/DOCS_Guide.md` §10/§11
Cites: `check-doc-caps.sh` `TODO.md` T1
Depends-on: none

`check-doc-caps.sh` has printed three `OVER-CAP (soft)` rows on every gate run for sprints, and the
promote governance scan reports doc-aging **clean** — because the checklist enumerates §11's four
triggers and a §2 breach is not among them. This sprint's own promote scan reproduced it a third
time: the checklist caught `TODO.md` (a §11 trigger) and stayed silent on all three research docs.
A matcher with no consumer, which is the exact inverse of the rule SPRINT-061 T1 promoted.

Re-derive before writing (L-091): "add a fifth checklist line" is the obvious move and may be wrong.
The honest question is whether §11's trigger list or §2's caps should own this — and TD-047 already
describes how items on a checklist read under time pressure get skipped, which is an argument against
lengthening the checklist at all.

**Acceptance:** a §2 soft-cap breach is visible to whoever signs the promote governance checklist,
not only to the gate's scrollback.

**DoD:**
- [ ] The ownership question is answered explicitly (§11 triggers vs §2 caps), with the reasoning recorded
- [ ] The chosen mechanism is wired where the promote flow actually reads it, and fires — verified against the three live breaches
- [ ] The fix is exercised on input that **must FAIL**: a breach that should surface does, naming the doc (L-058)
- [ ] Nothing else the checklist already catches stops being caught (re-run the scan and diff the findings)

### T3 — Establish whether LEARNINGS promotion is being stamped, then apply §11 `[size: M · risk: low · class: decision · HITL]`
Layers: `docs/LEARNINGS.md` · `docs/knowledge-index.md` · possibly `DOCS_Guide` §10/§11
Depends-on: none

91 entries carry zero `promoted: yes`. That has two readings and they demand opposite actions: either
§11's collapse already ran and left pointer lines (healthy, nothing to do), or promotion happens
without the field ever being stamped — in which case the `count ≥ 2` promotion rule has been running
blind, and *pruning would destroy the evidence of that*. Establish which before editing anything.
EPIC-002's evidence rule binds: nothing is removed without showing it is not load-bearing.

**Acceptance:** it is known why the count is zero, and §11's collapse is applied on that basis, with
no durable rule losing the reader that stands on it.

**DoD:**
- [ ] The zero is explained — collapsed-already vs never-stamped — with the evidence that settles it
- [ ] If never-stamped: the governance defect is filed (`TD-NNN`), and the promotion rule's blind spot named
- [ ] §11's collapse is applied on that basis, or explicitly not applied with the reason recorded
- [ ] Every promoted rule still has a reader — spot-check each pointer resolves to a live durable rule
- [ ] Line delta reported (§11 asks for the measurement, not just the pass)

## Owner-action checklist
- [ ] Reinstall the lean-flow plugin and restart the session — this session ran against a **1.32.0**
      cache with a 1.35.0 repo, and every artifact in this sprint was written by reading the repo's
      templates and procedure directly rather than through the installed skill (L-021)

## Decisions (pre-locked)
- **D1** — L-106's promotion is folded into T1 rather than executed at promote, so the rule and the
  concrete ruling that generalizes it are written once, together. *(Promote sign-off, Sprint-062.)*
- **D2** — `TODO.md`'s 206/150 breach is scoped into TASK-196, not fixed here: it is the same question
  as the SSOT caps on a third file, and the cleanest arithmetic case of the three. *(Promote sign-off.)*
- **D3** — Five TD rows are ≥3 sprints unaddressed (TD-037 at 13; TD-045/047/048/049). None is
  `severity: high`, so none auto-escalates; re-review noted, nothing pulled. *(Promote sign-off.)*
- **D4** — No two tasks share a file, so there is no single-owner or commit-order constraint to fix.
  T1 and T3 both touch `docs/LEARNINGS.md` — T1 collapses L-106's entry, T3 applies §11 across the
  corpus. **T1 commits first; T3 re-reads the file before its pass.** Per-hunk staging if they overlap
  in one working tree (L-042/L-037).

## Assumptions
- **A1** — `qa-gate-timing.md` is genuinely a longitudinal log, not a doc that grew fat. *Confirm:*
  read it at T1 start; if a section is removable, this is ordinary drift and the ruling changes.
- **A2** — The three §2 breaches are three different questions, not one. *Confirm:* TASK-192's own
  assumption, carried from the SPRINT-061 Retro; re-check before any bulk fix in T1 or T2.
- **A3** — §11's collapse format is what produces a zero `promoted: yes` count. *Confirm:* T3's first
  DoD line — this is the assumption the whole task exists to test, so it must not be assumed true.

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-062-room-to-write.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `docs/research/qa-gate-timing.md` | T1 | 223 → 87: keeps the standing verdict, sheds the series it could not hold under a 120 cap | Low | `check-doc-caps.sh` no longer reports it |
| `docs/research/logs/qa-gate-timing.md` | T1 | new — the three measurement rounds, append-only and uncapped (ADR-014 precedent) | Low | excluded by the derived non-recursive glob; verified no new breach |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §2 gains a `research/logs/<slug>.md` row; Growth rule gains L-106's promoted rule | Low | cap report unchanged; §2-derived glob verified against the new row |
| `docs/LEARNINGS.md` | T1 | L-106 collapsed to a pointer per §11 (718 → 698) | Low | 91 entries intact; neighbours L-105/107 unfused |
| `docs/knowledge-index.md` | T1 | **unchanged** — regenerated twice, byte-identical both times; the log is outside the corpus glob and `related:` is not index input | Low | `gen-index.sh` produced no diff; the re-pointed `related:` resolves to a corpus doc |

## Retro

<!-- Written at close. Route the four buckets to their durable homes (DOCS_Guide §10). -->
