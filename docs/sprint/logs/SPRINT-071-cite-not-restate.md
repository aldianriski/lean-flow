---
sprint: 071
slug: cite-not-restate
owner: Maintainer
last_updated: 2026-08-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-071 — Execution Log

> Append-only companion to [`../SPRINT-071-cite-not-restate.md`](../SPRINT-071-cite-not-restate.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-16 | scope-change | A1's site census was wrong at promote — corrected 121 → 39 before any task ran

**What broke.** A1 states the candidate set as *"38 files / ~121 raw sites"*. The **file** figures are
correct and reconcile (23 templates + 15 non-template = 38, re-derived at G2). The **site** figure is
not. Diagnosed rather than guessed: `~121` was the sum of **eight overlapping per-section scans**
(120 exactly), so any line matching two patterns was counted twice, and one of those scans used a §9
pattern that is not in the combined regex at all. Re-derived over the 15 non-template files:

```
distinct (file,line) sites .... 39     <- the actual unit of work
total matches in those files .. 57
total matches, all 38 files ... 92
```

**Impact.** T1's DoD 1 requires its three bucket counts to *"sum to the site census taken at promote"*.
Against 121 that criterion is unsatisfiable — the buckets would have summed to ~39 and read as a
failed inventory when the inventory was in fact complete. Scope is untouched: same three tasks, same
15 files, same sizes, same chain. What went stale is a **criterion**, which is L-088's case and is why
this is an owner ruling rather than a quiet re-read.

**Owner ruling (2026-08-16).** Correct A1 to **39 distinct sites**, keeping the 121's provenance on
the record so the error is not silently overwritten. T1's DoD 1 is read as: reconcile the buckets
against **both** the corrected promote census **and** T1's own re-derivation, and the two must agree.
Dropping the promote figure entirely was considered and declined — a self-derived census cannot catch
a scan that silently missed files, which is the exact failure mode T1's DoD 4 is guarding against.

**Re-confirm G2.** Ownership map, wave order and preflight are unaffected and stand as signed. No task
changed size; nothing needs splitting.

**The part worth keeping.** The bad figure was produced by precisely the uncross-checked query that
**this sprint's own T1 DoD 4 exists to prevent** — a search whose result was acted on immediately,
with no second query that had to agree. The rule was not merely known, it was *being written into the
Plan in the same session*, and it still did not fire on the Plan's own authoring. That is the fourth
stale figure this session and the third caught only by a disagreeing second number, never by recalling
the rule. It is a candidate learning about where the cross-check rule fails to reach: authoring a
criterion feels like planning, not like querying, so the discipline that applies to queries is not
recognised as applying.

### 2026-08-16 | progress | G1+G2 signed @ `0ab0e01` — batch pass, full checklist

Batch G1 ran the **full** checklist rather than the `origin: decomposer` fast path: the Plan's
`### Tn` blocks carry no `origin:` field, and a missing origin is treated as ungrilled by rule — the
same ruling taken at SPRINT-070, kept consistent rather than relaxed because the tasks happen to be
fresh. Three `M` tasks, no `L`, nothing to split.

**Assumptions at G2:** A2 re-derived (`grep -rln 'spec/STANDARD.md' skills/` → exactly 1 of 14 skills,
`lean-doc-generator` — the premise of the whole sprint holds) · A3 owner-signed at promote · A4 holds
(`spec/STANDARD.md` uncapped, TD-058 filed, not this sprint's work) · A5 confirmed: base-dir **1.41.0**
vs repo **1.44.0**, stale. A5 matters more here than usual because **T2 edits `skills/`** — mitigated
by the standing rule that procedures and edits both go through the repo source, never the plugin cache
(L-010 forbids editing the cache; L-021 forbids trusting it). A1 failed and is handled in the
`scope-change` above.

**Ownership map** — built from `Layers:`, plus the two files no task can declare:
`skills/**` → **T2 sole owner** (T1 reads it; declared on `Cites:`, which the preflight deliberately
excludes from the overlap map) · `spec/STANDARD.md` → **T3 owner**, T1 read-only ·
`docs/epic/EPIC-003-the-standard.md` → **T3 sole owner** (D2: both conditions close, one writer) ·
the sprint file and this Log → **coordinator**, never assigned to a task.

**Sequencing.** Pre-dispatch preflight CLEAR before signing: `PASS base-ref`, `PASS wave-computation:
T1=0 T2=1 T3=2`, no unowned overlap. A strict chain, so no parallel wave — D3 pre-locked that and the
preflight confirms it rather than the other way round.

**Execution shape: all three inline** (owner ruling). T1 and T3 are `class: decision` and stay inline
by the dispatch rule anyway. T2 is `class: execution` and would dispatch by default; ruled inline
because its hard part is per-file judgement — deciding which text is the *rule* (goes) and which is the
*routing that tells a reader the rule applies here* (stays, L-015) — over a bounded ~39 sites, where
briefing a subagent costs more than the conversion. Recorded as a stated reason, not an omission.
