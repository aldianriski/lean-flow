---
sprint: 053
slug: surface-truth
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-053 — Execution Log

> Append-only companion to [`../SPRINT-053-surface-truth.md`](../SPRINT-053-surface-truth.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | progress | G2 confirmed A1 and A2 from source; preflight CLEAR at current HEAD
A1 holds and more cheaply than assumed: `init.md` step 1 already detects stack, DB and auth, and step 3
already runs the pattern the fix needs — "substrate-conditional rows fire automatically when detected
(confirmed, not asked)". Extending it to the base table is a condition column plus reuse, so T1 stays M
and does not split on that axis. A2 holds: L-094's deferring flows are `/triage` (setting `needs-info`),
promote (TD re-review), close (routing a follow-up), research scans, and `.out-of-scope/` revisit-ifs —
no single skill covers them, so `.claude/CONTEXT.md` (123/130) is the nameable home and `CLAUDE.md`
needs no displacement. A3 already carries its evidence from the promote. Preflight re-run against the
moved base: CLEAR, `T1=0 T2=0 T3=0 T4=1`, `.claude/CONTEXT.md` owned T3→T4.

### 2026-08-09 | scope-change | T1's premise was falsified by its own confirm step; narrowed by owner ruling
**What broke.** T1's `done-when` asserted that a docs-only repo should receive **no deployment guides**.
Reading `init.md` to confirm A1 showed lean-flow itself is a docs-only repo that legitimately *has*
both deployment guides — it publishes a plugin, and those docs own the push/deploy steps
`/release-patch` deliberately stops short of. So "docs-only" is the wrong axis entirely; the real
conditions are independent and per-substrate: *has code* · *publishes an artifact* · *has DB* · *has
auth*. Checking all 18 base rows also showed T1's second half was mis-sized: lean-flow misses 7, but
only 2 (`coding-standards`, `testing-guide`) are substrate-gateable. The other 5 — `CONTRIBUTING.md`,
`SECURITY.md`, `AGENTS.md`, `product/requirements.md`, `product/acceptance-criteria.md`,
`development/setup.md` — have no substrate excuse; they are simply absent, and creating them is a
sprint of its own, not an exemption ruling.

**Impact.** T1 keeps the mechanism (per-substrate conditions on the genuinely conditional rows, the §6
wording, the consumer trace) and **drops** "lean-flow's own absent base docs resolved", which leaves
with it the `docs/product/requirements.md` layer. T2, T3 and T4 are untouched; waves and ownership are
unchanged, so no re-run of the preflight is required beyond the CLEAR above.

**Re-confirm G2.** Owner ruled *narrow to the mechanism* rather than split T1 or widen it across all 18
rows. The dropped half is filed as TASK-165 in the Backlog with the six named docs, so it is deferred
with a record rather than lost. This is L-088's rule applied in its intended direction: the criterion
went stale while the scope held, so it was ruled on rather than quietly re-read to fit.
