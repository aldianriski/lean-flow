---
sprint: 097
slug: guards-that-run-over-the-wrong-set
owner: Maintainer
last_updated: 2026-09-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-097 — Execution Log

> Append-only companion to [`../SPRINT-097-guards-that-run-over-the-wrong-set.md`](../SPRINT-097-guards-that-run-over-the-wrong-set.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-09-10 | promote | Plan locked at `2789dbd`, five tasks, 30 DoD

**Governance review — the §10 checklist, owner-signed before the Plan was rendered.**

`☑ L-promotion (count≥2, promoted:no): none.` Twenty-seven entries in `docs/LEARNINGS.md` still carry
a full metadata block; twenty-six are `promoted: no` and every one of those is at `count: 1`. The only
entry at `count ≥ 2` is `L-144` (count 5), already `promoted: yes`. Cross-checked: the grep for
`promoted: *no` returns 26 lines, and the per-entry extraction returns 26 + 1 promoted = 27 blocks.

`☑ TD aging (≥3 sprints unaddressed): 70 of 76 open rows.` Derived, then cross-checked against a
second query that agrees — 70 aged + 6 unaged = 76 open; and independently, S-096's 61 aged plus the
9 rows filed at Sprint-094 (which age to 3 here) = 70. **The first derivation was wrong and is
recorded rather than smoothed:** a `sed 's/[*-]//g'` in the extraction turned `Sprint-096` into
`Sprint096`, so every row parsed as age 0 and the query returned "76 of 76 aged". Caught by the
number disagreeing with the unaged list, not by re-reading the pipeline (L-108's family — the
disagreeing second number is what caught it, exactly as the rule predicts).

Two dispositions and one flag:
- **`TD-143` escalated P3 → P1.** It is `severity: high` and its tracker `TASK-334` was filed
  unranked at the SPRINT-096 close, because close routes follow-ups and does not rank them.
- **`TD-141` closed** as `resolved → accepted (no task)` under ADR-040, re-derived against the tree
  rather than inherited: its own unblock condition was *"stays open until T3 lands the code"*, and
  `scripts/lib/check-layers-observed.sh:501-508` now runs one ownership test whose comment names this
  row by number.
- **Flagged, not acted on:** `TD-090` → `TASK-322` and `TD-117`/`TD-128` → `TASK-329` are
  `severity: high` rows whose trackers sit at **P2**. Every sweep since S-084 has read "carries a
  Backlog entry" as satisfying the escalation rule; the rule says P1. That divergence is `/triage`'s
  to settle, not a promote's to silently re-rank.

`☑ doc-aging — §11 retention + every §2 cap breach: four triggers fired, all executed; three §2 soft
breaches, one partially cleared.`
- **§11 archival: SPRINT-094 and SPRINT-095 archived** with their logs, in the promote commit. Their
  own closes never ran the §11 pass, so two `status: closed` Plans sat in `docs/sprint/` for two
  sprints being schema-checked as *active* Plans by checkers that glob `docs/sprint/SPRINT-*.md`
  non-recursively — 33 of the 82 FAIL lines on the gate this promote read. INDEX rows added; 96
  archived files reconcile against 96 INDEX rows.
- **§11 deletion clock executed on schedule:** `TD-101` and `TD-113`, dated to this promote by the
  S-094 sweep because their clock runs from the sweep that verified them rather than the sprint that
  fixed them. Ledger 78 → 76 rows; id set diffed before and after showing exactly those two removed,
  and the `- Summary:` count fell 78 → 76 in step, so no neighbouring row was fused (L-009).
- **§2 caps (sourced from `check-doc-caps.sh`, never restated from a list):** 76 PASS · 0 FAIL · 3
  soft over-cap — `TODO.md`, `docs/research/adlc-epic-sequencing.md`, and
  `docs/research/LEAN-FLOW-PRE-EPIC-FOUNDATION-HARDENING-V3.md` (the latter two are TD-082's reasoned
  carry). The `TODO.md` prune was offered at S-096 and declined; **taken this time**, 545 → 455, by
  collapsing the five promoted tasks' Backlog entries to pointers at the sprint file that now owns
  their specs (L-008). Still over the 320 soft cap — closing the remaining 135 lines means cutting
  the live specs of eleven un-promoted tasks, which is a content ruling for `/triage`.
- **Ownership header** added to `docs/development/Lean-Flow-Governance-Roadmap-2026-2027.md`, which
  had no frontmatter at all (S1.LAW3 + S3.SCHEMA). Body verified byte-identical after the insert.
- **`docs/LEARNINGS.md` id-policy line** corrected `L-191` → `L-192`; `L-192` had been filed while the
  policy line still named the previous maximum.

**Filed at this promote:** `TD-144` and `TASK-337` — the epic-state checker resolves a member sprint's
number against *this* repository's archive, so `EPIC-016`'s workdoo members (ADR-041) resolve to
lean-flow's own same-numbered sprints and produce two false `close_commit` mismatches on a correct
artifact. L-186's shape: the detection logic is sound, the member set it runs over is not. Promoted
straight into the Plan as T5.

**Gate at promote: `QA-CHECK: 225 pass, 33 fail`** (opt-in profile per ADR-039 — promote and close run
`QA_FULL=1`, and a green bare gate says nothing about TS/Shell §4 parity).

### 2026-09-10 | surprise | The promote's own governance record failed two checks it had just run

The post-promote gate re-run confirmed assumption **A4** in the part that mattered — every
SPRINT-094/095 FAIL cleared (33 → 0), as did the roadmap header pair, the two `layers` findings and
`verify-does-not-reach-target`. But two findings landed on the promote itself, and both are the same
failure the sprint is named after: **a record written where its reader cannot reach it (L-151).**

- **`S10.PROMOTEREVIEW` FAILed** because it greps the promote record for three literal tokens —
  `L-promotion`, `TD[ -]aging`, `doc[ -]aging` — and the plan-lock commit message named the first two
  and spelled the third out as its findings ("Deletion clock executed", "TODO.md pruned", "Ownership
  header added") without ever writing the words `doc-aging`. The checklist was run in full and
  recorded in full; the token its only mechanical reader looks for was absent. **This entry is the
  fix** — the checker accepts either the plan-lock commit message *or* this Execution Log, by explicit
  design, "because §10 fixes the checklist's content and not its location."
- **`S10.TDAGING` FAILed 33 times** because it reads the ledger header for each aged row's id **by
  name**, and the S-094 and S-096 sweeps both recorded the aging *count* without the *list* — so 33
  rows were aged and named by no sweep at all, and the re-review prompt §10 asks for was never raised
  for any of them. The count rose 19 → 33 across this promote for the same reason. Corrected by
  enumerating all 70 aged rows in the S-097 sweep note; the checker's own condition was then re-run
  by hand against the edited header and returns none unnamed.

Neither was caught by recalling the governing rule, which was loaded throughout. Both were caught by
running the gate again and reading its output — the same instrument that found everything else this
promote fixed.

consequence · promote · behaviour:low · governance:high
