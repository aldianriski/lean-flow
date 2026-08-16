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

### 2026-08-16 | progress | T2 — all 6 restatements converted; the L-015 tension resolved on evidence

**The #5/#6 ruling turned out not to be a judgement call at all.** T1 flagged the §2 placement gloss
in `lean-doc-generator/SKILL.md:74` and `init.md:61` as a real L-015 tension — the gloss *is* §2's
rule, but removing it might leave the generator unable to place a file without the spec. Checked
rather than weighed: `lean-doc-generator/SKILL.md:30` lists `spec/STANDARD.md` under § Bundled + cited
assets with **"Read first."** The generator already loads the standard before it does anything, so the
inline mapping was duplication with *zero* usability cost to remove. The tension was real in the
abstract and empty in this specific corpus — which is the difference between weighing a trade-off and
looking for the fact that dissolves it.

**Conversions (all six, one commit, each atomic within it — ADR-023).**

| # | File | Before → after |
|---|---|---|
| 1 | `council/SKILL.md:54` | "Hard-to-reverse + surprising + a real trade-off →" → "Where the decision clears **STANDARD §4's bar** for one," |
| 2 | `prototype/SKILL.md:44` | "an **ADR** (hard-to-reverse + surprising + a real trade-off)" → "an **ADR**, where it clears **STANDARD §4's bar** for one" |
| 3 | `lean-doc-generator/SKILL.md:23` | "Offer one only when hard-to-reverse **and** surprising **and** a real trade-off (STANDARD §4)" → "Offer one only when it clears **STANDARD §4's three-part bar**" |
| 4 | `lean-doc-generator/SKILL.md:123` | "every doc touched gets a fresh header before you leave it" → "**STANDARD §3** requires one on every doc; refresh it before you leave the file" |
| 5 | `lean-doc-generator/SKILL.md:74` | "(STANDARD §2: root for README/TODO · `.claude/` … · `docs/` …)" → "the canonical placement **STANDARD §2** defines (the standard is read first)" |
| 6 | `init.md:61` | same gloss, same fix |

**DoD 1's reconciliation, and why the census moved rather than held.** The census went **39 → 36**,
which looked wrong for a moment and is exactly right: for #1, #2 and #3 the restated phrase *was* the
thing the pattern matched, so converting them removes the site from the scan entirely; for #4, #5 and
#6 the surviving words (`ownership header`, `canonical placement`, `§2`) still match, now as
citations. So the buckets are **0 restatement / 28 citation / 8 legitimately-local = 36**, and the
citation bucket grew by exactly 3 — the three conversions that stayed visible to the scan. 25 + 3 = 28.

Worth stating because it is a trap for T3 and for anyone re-running this later: **the scan cannot be
used as a progress metric.** A converted site may vanish from it or remain in it depending on which
words the pattern happened to key on, so "count went down" and "count held" are both consistent with
a correct conversion. The bucket classification is the measurement; the raw count is not.

**DoD 3 — read back as a consumer with no `spec/` open.** Each converted line still tells the reader
that a rule applies and where it lives: a bar exists and §4 holds it · §3 requires a header on every
doc · §2 defines placement. What is gone is the rule's *content*, which is the intended split. #3 keeps
the words "three-part" deliberately — that is a shape hint, not the test.

**DoD 4 — structure re-read, not inferred from the diff.** #3 edits a **markdown table row**, which is
L-009's exact hazard (a row edit can fuse neighbours while grep and line caps both stay clean). Re-read
lines 21–25: the `HOW it works` / `WHY decided` / `WHERE things live` / `WHAT changed` rows are all
intact and separate.

**DoD 5** — gate **149 pass / 0 fail**. Caps hold on every touched file: `council` 74/140 ·
`prototype` 54/140 · `lean-doc-generator` 126/140 · `init.md` 130.

### 2026-08-16 | progress | T3 — spec-standalone audit: two real gaps at Gated, both closed; spec 0.3.0

Walked ADR-024's three levels as a tool-builder would, asking of each check *"which `spec/` section
defines this?"* — with "implied by §N" counted as a gap, not a mapping.

**Structural — fully checkable from `spec/` alone.**

| Check a tool performs | Defined by |
|---|---|
| the core doc set exists | §2's core-files tables (root · `.claude/` · `docs/` tree) |
| each file is in canonical placement | §2, same tables — placement is the row |
| each file carries an ownership header | §3 — the exact YAML schema, field by field |
| each file is within its stated cap | §2's `Cap` column, tier-gated by §6 |

**Attested — fully checkable from `spec/` alone**, and this was true before the audit started (it is
what SPRINT-070 T1 shipped): §13 gives the three trailer fields, which commit carries them, how they
relate to the sprint-level record, and the claim-vs-proof boundary that says what a verifier may and
may not conclude.

**Gated — two genuine gaps, and they were the whole finding.** ADR-024 defines Gated as *"human
approval is recorded against the work … checkable from the repo's own planning records."* The spec did
not define those records.

- **Gap A — `gates_signed:` was referenced but never defined.** Both of its two occurrences in the
  spec were in **§13**, and line 529 pointed at *"the sprint file — §9"* for it. §9's frontmatter list
  read `status · plan_commit · close_commit`. So the spec contained a **dangling internal
  cross-reference**: §13 sent a reader to §9 for a field §9 did not have. Worth owning plainly — that
  reference is one I wrote last sprint, and it read as correct precisely because §9 was never checked
  against it.
- **Gap B — the `*Verify:*` clause had zero occurrences in the spec.** Gated requires criteria to name
  how they were verified; nothing defined what that looks like, so a tool could not distinguish a
  mechanically-checked criterion from a judged one — which is the *only* thing that property is for.

**Both closed in `spec/` rather than deferred, because both are schema, and schema is what a spec
owns.** Neither is an engine question, so neither belongs to EPIC-004. §9 now specifies the
`gates_signed:` format plus the three properties that make it evidence (absence ⇒ NOT SIGNED · the
record lives in the file, not the session · a malformed record is worse than none), and specifies the
`*Verify:*` clause with the judgment-tick fallback. Spec bumped **0.2.0 → 0.3.0** with its changelog
entry; the four manifests are untouched (EPIC-003 D3).

**What was deliberately NOT closed — the EPIC-004 boundary, stated so it is not mistaken for an
oversight.** The audit maps each check to a defining section; it does not specify *how a tool decides*
whether the repo satisfies it. Where a check needs a traversal strategy rather than a definition —
which files count as "the core doc set" for a repo that has not adopted every optional row, how a cap
is measured against a grandfathered file, how a trailer is matched to the sprint record it claims — the
spec defines the property and EPIC-004's engine defines the procedure. That split is ADR-024's own
boundary ("a level whose description required the engine would make the standard depend on one
implementation of itself"), and this audit does not move it.

**DoD 3 — read as an adopter without the plugin installed.** The reachability question is what surfaced
Gap A: the mapping was done from `spec/` only, and a reader with `skills/` open would have found
`gates_signed:` documented in `lean-doc-generator/SKILL.md` and in `night-run.md` and never noticed the
spec was silent. This is L-016 working exactly as written — the repo cannot become that reader by
accident, so the consumer path was traced deliberately rather than assumed from a green gate.

**Note carried from T1, and it mattered here.** A2 read as "1 of 14 skills cites the spec", which
sounds like a corpus that ignores it; the real figure is 25 name-citations (`STANDARD §N`) plus 1 path
citation. Had the audit taken A2 at face value it would have looked for missing citations, which were
never the problem — the problem was the spec's own internal consistency.
