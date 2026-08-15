---
sprint: 068
slug: open-the-standard
owner: Maintainer
last_updated: 2026-08-15
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-068 — Execution Log

> Append-only companion to [`../SPRINT-068-open-the-standard.md`](../SPRINT-068-open-the-standard.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close (run-complete = the whole run exited — a finished task logs progress). -->

### 2026-08-15 | progress | T1 ruled — CONTEXT.md becomes a consumer; ADR-023 + Layers correction
T1: gates approved (batch G1+G2, owner-signed via popup; T2/T3 parallel worktree dispatch, T2→T3
merge order, evals/README.md owned by T2). Fork ruled B — the extracted `spec/` tree is the SSOT
for standard-owned rules, `.claude/CONTEXT.md` becomes a consumer keeping only project-local facts;
migration window closed by move+cite atomic extraction commits. Recorded as ADR-023 (owner chose
ADR over an epic D4 note); EPIC-003 Q3 marked answered with the pointer; DECISIONS.md indexed;
knowledge index regenerated. CONTEXT.md measured 132/150 — the ruling spent 0 lines, as the DoD
required. **Layers correction (L-100):** recording an ADR entails its index row — `docs/DECISIONS.md`
added to T1's `Layers:` (flagged by the layers-observed gate leg, exactly its job; logged here
before the Plan edit).

### 2026-08-15 | progress | T2 wired the system-verify checker into qa-check.sh
Dispatched builder (worktree, base 622f420; merged 85d8012). Promoted SPRINT-067 T1's
deliberately-nested harness (`evals/fixtures/system-verify/run-checks.sh`) to the standard
`evals/run-system-verify-fixtures.sh` location and registered it in qa-check.sh leg 12's
`eval_harnesses_always` — measured 0.66s, dependency-free POSIX sh, no git: always-on per TD-016's
cost axis. Five fixture legs green in-gate, findings unchanged. Must-FAIL proof: stripping the
`owner-ruling:` line from the owner-ruled fixture turned the gate red naming
`system-verify-fail-silently-closed` verbatim (QA-CHECK 144/2, exit 1); reverted byte-identical,
gate back green. `evals/README.md` updated to the wired state. TD-056 piggyback scan (report-only):
the two Layers-family checkers are the only variadic `check-*.sh` with no `$#`-guard — a bare call
is a silent no-op rather than a note line, unlike every sibling.

### 2026-08-15 | progress | T3 renamed the run-level complete event to run-complete
Dispatched builder (worktree, base 622f420; merged f449e6b + 877fbd0). TD-055's ruled cure shipped:
`complete` → `run-complete` in check-night-run-rollup.sh (match anchored to the delimited event
field, L-108), its 3 existing rollup fixtures, and a new `task-level-complete-does-not-arm` fixture
proving the exact SPRINT-064 misfire shape (task-level `| complete |`, no rollup) now stays green.
`sprint-log.md.template`'s event taxonomy updated in the same commit (L-123). Archives verified
unaffected against two real archived logs still on the old token. TD-055 → `resolved → TASK-211`.
Builder flagged, did not touch (boundary respected): `scripts/night-run.sh:120` still emits the old
token, and the new fixture was not yet wired into `evals/run-night-run-rollup-fixtures.sh`.

### 2026-08-15 | scope-change | T3's rename missed the live writer — extended by owner ruling
What broke: TD-055's ruling scoped the rename to checker + fixtures + template, but the run-level
event's *writer* is `scripts/night-run.sh:120` (ADR-016's launcher wrapper) — unnamed in the ruling
and outside T3's `Layers:`. Merged as-was, the checker recognizes only `run-complete` while real
runs write `complete`: the rollup gate goes silently dark on genuine completed runs — the exact
L-058 false-negative. Same review found the new fixture unwired into its harness (TD-012's trap).
Impact: two one-line files join T3's blast radius (`scripts/night-run.sh` ·
`evals/run-night-run-rollup-fixtures.sh`). G2 re-confirmed: owner ruled "extend T3 now" over
"merge + follow-up task" (popup, 2026-08-15) — writer and checker stay renamed together (L-123),
no window with a dark gate. Applied by the coordinator post-merge.

### 2026-08-15 | progress | Scope-change applied; census swept the last old-token holdouts
`night-run.sh:120` now emits `| run-complete |`; the `task-level-complete-does-not-arm` fixture
wired as leg 5 of `run-night-run-rollup-fixtures.sh` (5/5 green). The post-edit census
(repo-wide grep for the old token outside archives — the second-query rule) caught one more
remainder all three prior passes missed: the four system-verify fixture logs still simulated a run
exit as `| complete |`. Inert to their own checker (verified — it keys on `| close |`, never the
event), but a canonical example carrying a dead token is how TD-055 arose, so all four updated to
`run-complete`; system-verify legs stay 5/5 green. Remaining old-token hits are archives and
prose *about* the rename — correct by design.

### 2026-08-15 | progress | Scoped review returned — Spec clean, one Standards finding, retried once
One isolated reviewer (sonnet) over `622f420..HEAD`, briefed with the rulings verbatim as Spec
comparands (L-122). Spec axis: zero findings after the adversarial re-pass — ADR-023 consistent vs
ADR-018, T2's legs matched the retained fixtures verbatim, T3's rename + scope-change verified live.
Standards axis worst finding: this Log's own boilerplate taxonomy comment still read `complete`
(instantiated from the template before T3's rename landed) — inert to every checker, but the one
doc narrating the rename displayed the pre-rename vocabulary. Fixed on the single bounded retry
(boilerplate, not a past entry — append-only intact); delta verified. T2's must-FAIL red-run
evidence (DoD 3): gate exit 1, `QA-CHECK: 144 pass, 2 fail`, naming
`system-verify-fail-silently-closed` verbatim; fixture reverted byte-identical, gate green.

### 2026-08-15 | surprise | System-verify's first real firing was RED — on its own sprint
The integrated-tree gate pass (step 6, first run ever through the T2-wired leg) exited 1:
`FAIL corpus metadata: ADR-023-context-becomes-consumer.md(tag:governance)` — T1's ADR used
`governance` as a tag, but the ADR-009 vocabulary allows it only as a *domain*
(`TAGS="process docs tooling edit-safety sprint-model"`, gen-index.sh:16). Neither the builder-side
checks nor the scoped review caught it: the corpus-metadata leg is the one comparand nobody briefed.
Blocked the close per ADR-021 — no silent tick. Fix: `tags: [process, docs]` (domain stays
`governance`), index regenerated, full gate re-run for the clean PASS before close.

### 2026-08-15 | run-complete | Plan exhausted — all three tasks landed; rollup below
system-verify · PASS — `sh scripts/qa-check.sh` over the integrated tree at the fix commit:
`QA-CHECK: 147 pass, 0 fail`, exit 0 (after one RED blocked the close and was fixed — the
`surprise` entry above). First `run-complete` event ever written — the rename dogfooding itself.

```
run · 13 of 13 DoD ticked
run · ~410k dispatched tokens + coordinator · ~14 coordinator turns · ~65 min · 3 of 3 units · coordinator + 2 worktree builders (sonnet) + 1 scoped reviewer (sonnet), T1 inline
T1.1 · ticked · owner-ruling — fork ruled B via popup; ADR-023; review vs ADR-018 clean
T1.2 · ticked · review — ADR-023 § Decision names the window + move+cite atomic mechanism
T1.3 · ticked · review — EPIC-003 Q3 struck through with pointer, reviewer-verified
T1.4 · ticked · check — wc -l = 132/150 post-ruling, 0 lines spent
T2.1 · ticked · check — gate output names `PASS eval harness run-system-verify-fixtures.sh`; 0.66s → always-on
T2.2 · ticked · fixture — 5/5 legs green standalone + in-gate, findings verbatim vs SPRINT-067 retained set
T2.3 · ticked · fixture — must-FAIL red run captured (exit 1, `system-verify-fail-silently-closed` named), reverted byte-identical
T2.4 · ticked · review — evals/README.md § system-verify read in full, matches wired reality
T3.1 · ticked · check — commit f449e6b file list: checker + fixtures + template together; writer joined in b3d8c03 (owner-ruled scope-change)
T3.2 · ticked · fixture — leg 5 `task-level-complete-does-not-arm` green, wired in harness
T3.3 · ticked · check — two real archived logs on the old token skip silently; full gate green over repo
T3.4 · ticked · check — TD-055 row `resolved → TASK-211` (877fbd0)
OA.1 · ticked · owner-ruling — plugin reinstalled to 1.41.0 this session (invocation header, the L-021 signal)
```
