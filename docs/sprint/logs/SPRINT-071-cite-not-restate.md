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

### 2026-08-16 | progress | T1 — inventory complete: 39 sites, and only 6 are restatements

**Headline, because it resizes the rest of the sprint: 6 of 39 sites are actual restatements.** The
other 33 are already correct. Condition 2 is far closer to satisfied than the promote framing implied,
and T2 is a much smaller task than "sweep 15 files" suggested.

**Bucket 1 — RESTATEMENT (6). T2's worklist.**

| # | File · line | Rule restated | Target § |
|---|---|---|---|
| 1 | `council/SKILL.md:54` | §4's three-test, spelled out *alongside* its own `STANDARD §4` citation | §4 |
| 2 | `prototype/SKILL.md:44` | §4's three-test, no citation at all | §4 |
| 3 | `lean-doc-generator/SKILL.md:23` | §4's three-test ("only when hard-to-reverse **and** surprising **and** a real trade-off"), alongside its citation | §4 |
| 4 | `lean-doc-generator/SKILL.md:123` | §3's ownership-header mandate, stated as a red flag, no citation | §3 |
| 5 | `lean-doc-generator/SKILL.md:74` | §2's placement mapping, glossed inline after the citation | §2 |
| 6 | `lean-doc-generator/references/init.md:61` | §2's placement mapping, same shape as #5 | §2 |

Note the shape of 1, 3, 5 and 6: **they already cite the section and restate it anyway.** That is the
harder half of ADR-023's "no rule stated twice" — the citation's presence makes them look compliant to
any check that greps for one, which is precisely L-108's false-positive-is-a-false-negative.

**#5 and #6 carry a live L-015 tension and T2 must not resolve it by reflex.** The placement gloss
*is* §2's rule, so it duplicates. But it is also what lets the generator place a file without opening
the spec, and a skill has to stay usable by someone who has the plugin and not the spec. Flagged on
the worklist rather than pre-decided: T2's DoD 3 is the right place to rule it per file.

**Bucket 2 — ALREADY-A-CITATION (25).** Leave alone. `init.md` ×7 (13·29·63·65·107·127·129) ·
`lean-doc-generator/SKILL.md` ×7 (30·82·107·109·111·114·115) · `task-decomposer/SKILL.md` ×3
(87·94·95) · `prd-and-slices.md` ×2 (8·57) · `migration-map.md:80` · `prime/SKILL.md:23` ·
`release-patch/SKILL.md:44` · `triage/SKILL.md:50` · `flow/SKILL.md:43` · `night-run.md:54`.

**Bucket 3 — LEGITIMATELY-LOCAL (8), each with its reason** — converting any of these would point a
reader at a spec section that does not contain the rule:

| File · line | Why it stays |
|---|---|
| `orchestrator/SKILL.md:54` | Routing, not §4's offer-test: *when to escalate a fork to `/council`*. A project-local decision the spec does not own. |
| `lean-doc-generator/SKILL.md:70` | Procedural *use* of the ownership-header concept (a staleness scan step), not a statement of §3's rule. |
| `lean-doc-generator/SKILL.md:73` | The template-load protocol — the generator's own procedure, owned by the skill. |
| `lean-doc-generator/SKILL.md:3` | Frontmatter `description:` — trigger text a router matches on, not a rule. |
| `council/SKILL.md:3` | Same: `description:` trigger text. |
| `ADR-example.md:8` | A worked *example ADR* — rendered sample output, the same class D1 ruled out of scope for templates. |
| `night-run.md:127` | The unattended parking classes — a local contract, not a spec rule. |
| `night-run-checks.md:239` | **Pattern false positive.** "retention" here means *fixture* retention (L-058/TD-012), an unrelated sense of the word from §11's document retention. |

**Cross-checks (DoD 4), both run before acting on the result.** (a) Bucket sum reconciles: 6 + 25 + 8
= **39** = the census, and the corrected promote figure and this re-derivation agree, as the owner
ruling requires. (b) **Seeded gap:** a planted restatement in a throwaway tree was **detected**, and a
clean file in the same tree matched nothing. The negative control alone would have proved only that
the scan fires on rows it reaches — the seed is what shows it reaches them.

**A2 is true but was misleading as a premise, and this matters for T3.** A2 measured skills citing
`spec/STANDARD.md` **by path** — exactly 1. But 25 sites cite the standard **by name** (`STANDARD §N`),
which is what SPRINT-069 T3's 86-site sweep produced. So "1 of 14 cites the spec" reads as a corpus
that ignores the spec, when the corpus overwhelmingly cites it and simply does not spell out the file
path. No task changes; recorded because T3's audit must not mistake a name-citation for a missing one.
