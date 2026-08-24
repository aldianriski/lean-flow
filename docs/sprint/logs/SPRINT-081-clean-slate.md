---
sprint: 081
slug: clean-slate
owner: Maintainer
last_updated: 2026-08-24
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-081 — Execution Log

> Append-only companion to [`../SPRINT-081-clean-slate.md`](../SPRINT-081-clean-slate.md). Uncapped by
> design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-24 | progress | Batch G1 + G2 signed; run is attended and sequential

Mode `sprint-bulk`, attended. Gates approved by the owner in one frontier round, alongside T2's arm
choice (below). Three facts fixed at the gate:

- **Sequencing: T1 → T2 → T3, fully sequential.** No worktree parallelism. T3 depends on T2 (D1), and
  T1 ∩ T2 share `TECH-DEBT.md`.
- **An overlap D2 did not name.** D2 mapped `evals/` (T2 first, T3 second) but not `TECH-DEBT.md`,
  which T1 touches for TD-064 and T2 for TD-077. Resolved by the sequential order rather than by
  per-hunk staging, so L-042's rule is not load-bearing this run. `docs/research/` looked like a third
  overlap and is not: T3's `conformance-coverage.md` is **not** among T1's 13 — it already carried an
  `update_trigger:`.
- **Execution is inline, by owner ruling.** The session instruction forbids the Agent tool unless
  asked; the owner confirmed inline over dispatch. The orchestrator's default (dispatch every
  Implement step) is therefore overridden for this run, deliberately and not by drift.

Skill freshness: `/prime` reported `1.52.0 base-dir != 1.54.0 repo → STALE`. Checked rather than
assumed — every file under `skills/` is byte-identical to the repo once line endings are normalised
(14 SKILL.md + every `references/`), so the two version bumps touched no procedure and the staleness is
nominal. Recorded because L-021's failure is running a stale *procedure*, which is not what happened
here; the row firing without drift behind it is the expected case, not a near miss.

### 2026-08-24 | progress | T1 — the sixteen ownership headers written; two rules cleared

`TASK-257` · TD-064. Baseline re-derived **before** writing anything, per the DoD's first line and the
row's own closing instruction:

| | before | after |
|---|---|---|
| `ownership-header-missing` | 3 (`docs/qa/` ×3) | 0 |
| `ownership-header-field-missing` | 13 (`docs/research/` ×13) | 0 |
| `update-trigger-absent` | 16 (the union) | 0 |
| FAIL lines total | 34 | 2 |
| `level:` blocking rules | 3 | 1 (`S6.BASE`) |
| `counts:` passed | 28 | 30 |

**A1 confirmed — the numbers had not moved**, matching TD-064's evidence exactly. Three-way
reconciliation (3 + 13 = 16) as the row prescribes, plus a fourth from the other side: `S1.LAW3` and
`S3.SCHEMA` each reported **206** clean docs before and **222** after, and 206 + 16 = 222. The
`counts:` line moving 28 → 30 is the same fact a third way — exactly the two rules T1 targeted, and no
others.

**A2 confirmed.** The `level:` line now names one rule where it named three. The remainder is
`S6.BASE`, which is T2's and, as TD-077 states, not clearable by writing anything.

Each of the 16 triggers was derived from what would actually change that doc, never a placeholder that
satisfies a grep — §1 LAW 3's mechanical half is presence, but a trigger that can never fire is the
failure the law exists to stop. Three spot-reads: `loop-hygiene-prd.md` (`status: superseded`) takes
§11's archive leg — *nothing live cites it any more* — which is the only event that can still move a
spent verdict; `model-purpose.md` takes its upstream doctrine changing or ADR-010 revising what
lean-flow adopts from it, both live and external to the doc; `okf-adoption.md` takes an OKF spec
release changing its keep-current verdict. The three `docs/qa/` cases take *the case is re-run* —
`docs/qa/README.md` states Last run / Result are updated in place each run, so that is the trigger that
actually fires most often — or the behaviour under test changing.

`last_updated: 2026-08-24` on the three QA files is the honest value: adding the header **is** today's
update. Backdating them to the 2026-06-21 last-run date would have written a header that trips §3's
own *flag if `last_updated` > 60 days* on the day it was created.

### 2026-08-24 | scope-change | T1 DoD 2 names a check that cannot reach its subject

**What broke.** T1's second DoD reads: *"`docs/qa/QA-001…QA-003` carry the full four-field header —
Verify: `sh scripts/lib/check-doc-caps.sh` still PASSes each, and `conformance.sh` drops all 3
`ownership-header-missing`."* The second half fires and passes. The first half **cannot**:
`check-doc-caps.sh` derives its caps from §2's cap table rather than a hand-list (deliberately —
TD-041), and §2 states **no cap for `docs/qa/`**. The string `docs/qa` appears nowhere in
`spec/STANDARD.md` and nowhere in any checker under `scripts/lib/`. So the three files are outside that
checker's scope by design; it can neither PASS nor FAIL them.

**Impact.** The criterion is *unreachable*, not failed. The checker does run green — `66 PASS, 0 FAIL`,
exit 0 — and that green says nothing whatever about `docs/qa/`. Ticking DoD 2 on the strength of it
would be the L-156 shape precisely: a case that was never reached, scoring as a pass. The subject
itself is verified, but by the *other* half of the clause — `conformance.sh` dropped all 3
`ownership-header-missing` and `S3.SCHEMA` now reports all 222 docs carrying a complete header.

**Re-confirm G2.** No scope moves: the same three files, the same headers, the same work. What changes
is the evidence the tick rests on. Surfaced to the owner rather than reinterpreted quietly, per the
red flag on re-reading a DoD to fit what was built.

**Why it was written that way** — worth recording, because it is the third sighting of one shape.
*"`check-doc-caps.sh` PASSes `docs/qa/`"* is a **structural claim about another artifact**, frozen into
a DoD at promote without ever being queried — L-130/L-136's second grain, after SPRINT-071's `~121`
sites (a figure) and SPRINT-074's *"the checker reads §14's tables"* (a claim about a document). This
one is a claim about a **checker's scope**, which is the same grain against a third kind of artifact,
and it failed the same way: authoring felt like planning, so nothing prompted the second query. A
candidate `L-NNN` at close, not a new rule mid-run.

### 2026-08-24 | progress | T1 Layers gains `docs/knowledge-index.md`; two gate findings cleared

The first gate run printed **`158 pass, 2 fail`** while its runner exited **0** — L-120 exactly, and the
reason the DoD names the *printed verdict line* rather than a status. Read through a wrapper this would
have committed green. Both failures were real and neither was in the doc work:

1. **`knowledge index STALE`.** The generated index carries its own `last_updated`, and T1 wrote a newer
   one onto the three `docs/qa/` files, so the freshness comparison went stale by date. Regenerated with
   `sh scripts/gen-index.sh`; the whole diff is the index's own date line — its *content* is unmoved,
   which is the expected result since ADR-009's index reads `id`/`tags`/`domain`/`status`/`related` and
   never `update_trigger:`. So `docs/knowledge-index.md` is declared on T1's `Layers:` now, per L-100:
   the Plan could not have named a file that is downstream of a date this task had not yet written, and
   a mid-sprint `Layers:` correction is the expected cost of declaring before the work, not a defect.
2. **`layers observed: … changed but undeclared`** naming `.caps.txt`, `.conf-full.txt`, `.conf-t1.txt`,
   `.qa-t1.txt` — **my own mess, not the repo's.** Those were capture files for the conformance and gate
   runs, written to the repo root when they belonged in the session scratchpad. Moved out. Worth the
   line because the check did its job: it caught working residue on its way to a commit, which is the
   one place stray files become permanent.

The two relayed `S6.BASE` lines in the same output are **not** among the 2 — `qa-check.sh` relays engine
findings rather than counting them (SPRINT-075 T2's ruling), so they neither redden this gate nor get
silently dropped. They are T2's subject.

### 2026-08-24 | surprise | TD-078 filed — the template that caused TD-064's `docs/qa/` third

Writing the three `docs/qa/` headers by hand raised the obvious question: where did the gap come from?
`QA-TESTCASE.md.template` ships with **no §3 ownership header**, and it renders into `docs/qa/` — a
tree the engine governs. So every adopter who renders it collects an `S3.SCHEMA` finding the moment the
file lands, for following the template exactly. QA-001…003 lacked headers because the template they
came from had none to give.

Census of the template tree: **6 of 35 lack a leading `---`** — `AGENTS` · `BUG` · `CODE_OF_CONDUCT` ·
`DESIGN` · `QA-TESTCASE` · `README`. `README.md.template` is **not** a defect: §3 states the README
exception in full (ownership moves to a footer line, since a top YAML block renders as an ugly metadata
table). The other four are untriaged, and the row says so rather than guessing — some are plausibly
legitimate intake scaffolding that never lands in a governed tree, and nobody has ruled which.

**Filed as a row, not fixed here** (owner ruling). T1's declared scope is three instances and thirteen
fields; the template lives under `skills/`. Fixing it inside T1 would have widened the task by
expedience and still left the other four untriaged — the judgement is the triage, not the typing.

The asymmetry is what makes it worth a row rather than a Retro footnote: **dogfooding cured the half we
can see while the cause ships unchanged in every `plugin install`.** That is L-015's shape and L-016's
correction together — our own tree is now clean, and reading that as "clean" would be exactly the
mistake, because the consumer path is untouched. Id derived from the ledger maximum and cross-checked
repo-wide before writing (`TD-077` both ways → `TD-078`), never incremented from memory (L-143).

### 2026-08-24 | progress | T1 gate: `159 pass, 1 fail` → both findings closed

Second gate run printed **`159 pass, 1 fail`** — four `FAIL` lines, only one of them counted, and the
arithmetic is the point. `qa-check.sh` relays engine findings as *informational* rather than counting
them (SPRINT-075 T2), so the two `S6.BASE` lines **and** an `S9.VERIFYCLAUSE` line sit outside the
tally. Cross-checked against the run's own ruling line — *"conformance engine: informational except the
two FULLY-COVERED families"* — rather than inferred from the gap between 4 and 1, because two numbers
disagreeing is the finding and guessing which is right is how it gets buried.

Both findings were caused by this task and both are now closed:

1. **`layers completeness` (the counted one)** — T1's DoD prose names `check-doc-caps.sh`, which the
   task **cites** but never touches, and the check said so precisely: *"if the prose only cites it
   rather than touching it, declare it on a `Cites:` line."* Done, with the DoD-2 ruling recorded on
   the same line so the citation carries its own caveat.
2. **`dod-criterion-names-no-check` (relayed, `S9.VERIFYCLAUSE`)** — DoD 5 (`TD-064 → status:
   resolved`) was the one criterion in T1 written **without** a `*Verify:*` clause, so ticking it
   produced a claim with nothing behind it. Not a defect of the work — the row *was* verified — but a
   real defect of the criterion, and exactly the rule's purpose. A proof clause now states what was
   checked. Relayed rather than counted is not a reason to leave it: a named finding left standing is
   the silent false-negative L-058 exists to prevent, and the tally would never have shown it.

Worth noting which way these two point. The gate did not catch a mistake in the sixteen headers; it
caught two defects in **how the Plan described its own verification** — one criterion citing a file it
does not touch, one ticking without evidence. Both were introduced at promote and both surfaced only
once a box was ticked, which is L-105's timing question answering itself: a criterion-quality check
cannot fire until execution reaches the criterion.

### 2026-08-24 | progress | T1 gate green — `160 pass, 0 fail`; all six DoD ticked

Third gate run: **`160 pass, 0 fail`**. The only `FAIL` lines left are the two relayed `S6.BASE`
findings, which are T2's subject and informational by the engine's own ruling.

The intervening run had gone the wrong way, and the reason is worth the entry: **the previous fix
caused the next finding.** Annotating DoD 2 with the ruling introduced two backticked tokens into T1's
prose — a bare caps-checker filename and the QA directory path — and `check-layers-completeness.sh`
reads every backticked file-shaped token in a task's prose as a declaration obligation. So the
annotation manufactured an *implied* file absent from `Layers:`, and adding it to `Cites:` then
manufactured a *second* finding, because a token in both `Cites:` and `Layers:` is a contradiction by
design (the escape must not double as a declaration). Two findings, both mine, neither about the work.

Diagnosed by reading the checker's matching rather than guessing at it: `grep -qxF` on line 145 is an
**exact whole-token** match, so `scripts/lib/check-doc-caps.sh` on the Cites line could never satisfy an
implied bare `check-doc-caps.sh` — the two strings are simply different, and no amount of re-running
would have shown that. The fix was to reword the annotation with no backticked paths at all and revert
the `Cites:` addition; the original DoD text was never a problem, because its own reference carries a
space (`sh scripts/…`) and falls outside the token pattern.

Before re-running, the outcome was **predicted** from the checker's rules — every file-shaped prose
token resolving to `Layers:` or `Cites:`, and no cites token appearing in the layers line — and the run
then agreed. Predicting first is what makes the green meaningful: a gate that goes green after a change
nobody could explain is indistinguishable from a gate that stopped looking.

**T1 complete: 6 of 6 DoD ticked.** Sprint total 6 of 19.
