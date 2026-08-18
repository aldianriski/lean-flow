---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: A QA rule added/changed, the check script changes, or a release-checklist gap is found
status: current
---

# lean-flow — QA checklist

The release-time consistency check for the plugin's own docs + skills. **Hybrid (ADR-008):** the
mechanical rules are enforced by `scripts/qa-check.sh`; the judgment rules need a human/agent pass.
Run both before cutting a release or closing a sprint.

## Mechanical — `sh scripts/qa-check.sh` (exit 0 = clean)

| Rule | What it checks |
|---|---|
| Line caps | `SKILL.md` <=140 · `CLAUDE.md` <=80 · `CONTEXT.md` <=130 · active `SPRINT-*` <=400 |
| Skill count | disk count of `skills/*/SKILL.md` == the number claimed in CLAUDE.md / CONTEXT.md / docs/architecture/overview.md |
| Template count (SPRINT-055 T1) | `templates/*.md.template` files == claimed core + 2 non-core (DESIGN, QA-TESTCASE). **Both halves on all three surfaces** — core *and* total, in CLAUDE.md + docs/architecture/overview.md + **README.md**. The README was the surface that drifted (`30 … = 32 total` against 32/34) precisely because it was the one not checked, and the *total* was claimed everywhere and guarded nowhere. Delegated to `scripts/lib/check-count-claims.sh` so it can be pointed at a fixture; a claim file that exists but carries no claim is a FAIL, not a silent skip |
| Epic retention (SPRINT-055 T2) | `scripts/lib/check-epic-archive.sh` enforces STANDARD §11's epic row **in both directions**: an epic under `docs/epic/archive/` must be `status: closed` with every `## Closed when` box ticked (and must state at least one — "all met" is vacuously true otherwise), and an epic still in `docs/epic/` that already meets every condition is a FAIL. Checking only the first would pass the state the rule was written about: EPIC-001 sat closed and fully ticked, unarchived, for five sprints |
| Research retention (SPRINT-055 T3) | `scripts/lib/check-research-archive.sh` — a research doc is archivable only when `status: superseded` **and** nothing live still cites it, because a spent verdict is usually the WHY-trail for what replaced it. Closed history (`docs/sprint/archive/`, `docs/changelog/`) and the generated index never count as citers. Archived docs stay in `knowledge-index.md`, marked `(archived)` |
| Ephemeral intake (SPRINT-055 T4) | `scripts/lib/check-ephemeral-intake.sh` — a committed `BUG-*.md` report is a FAIL: defect reports and the working feature PRD are temp-dir intake scaffolding (§2), so once `/triage` routes the substance there is nothing left to commit. The glob distinguishes a *report* from `BUG.md.template`, the blank form every consumer legitimately ships |
| Task origin (SPRINT-055 T6) | `scripts/lib/check-task-origin.sh` — every `TODO.md` § Backlog entry declares `origin: decomposer \| close-retro \| triage-bug \| manual`. This is the **mechanical half** of G1's fast-path rule (no task reaches G1 unstamped); G1's own clause — only `decomposer` fast-paths, a missing origin reads as ungrilled — is procedure and is not claimed as covered here |
| §13 attestation (SPRINT-074 T2) | `scripts/lib/check-attestation.sh` verifies `HEAD`'s HITL attestation against `spec/STANDARD.md` §13 — and is the first checker here whose **rule set and marks are read from the spec at runtime** rather than hard-coded (EPIC-004 D1). Five named findings: `attestation-trailers-incomplete` · `attestation-not-on-task-commit` · `evidence-path-unpinned` · `attestation-disagrees-with-sprint` · `attestation-unsigned-claim-only`. Two verdicts are deliberately **not** FAILs, and both would otherwise be silent passes: a commit carrying *no* trailers reports "no attestation claimed" (absence is neither a failure nor approval), and a well-formed attestation over an **unsigned** commit reports `level: Gated (not Attested)` at **exit 0** — §14 says a report states a level and the findings preventing the next one, and Gated is a level reached. Because the honest cases exit 0, their fixtures assert the **output**, never the status (L-103). §13's two `implementation-directed` rules are excluded **by the spec's Mark column**, not by a skip list, so re-marking a rule changes the checker with no code edit; a mechanical rule with no assertion is `rule-unimplemented` and an unparseable table is `spec-table-unreadable`, so a broken rule source can never degrade into checking nothing. The **checker** is always-on (it reads git objects that already exist); its **harness** `evals/run-attestation-fixtures.sh` is opt-in, because it builds throwaway repos — TD-016's declared cost boundary, applied to the two halves separately |
| Frontmatter | every `SKILL.md` has `---`/`name`/`description`; every core ledger has `owner`/`last_updated`/`status` |
| Task schema | active-sprint `### Tn` Plan blocks carry `class:` + an autonomy tag (HITL/AFK) in header meta, plus `Depends-on:`/`Layers:`/`**Acceptance:**` — else FAIL (TASK-110) |
| Eval harnesses (TD-013, split TD-016) | every zero-API harness under `evals/` (`ls evals/run-*.sh evals/selftest-*.sh` — see the split below) is gated on **that harness's own exit status** — a FAIL names both the harness and the finding it reported |
| Headless park-record cue (TD-019) | migrate's and init's procedures (`skills/lean-doc-generator/references/{migration-map,init}.md`) each still carry the ask-channel probe (`ToolSearch select:AskUserQuestion`) and the park-record instruction naming a `/handoff` doc — a FAIL names the procedure and which of the two it lost |
| Layers/Depends-on completeness (TD-020, escape TD-032) | for every `### Tn` block in an active sprint's Plan, `scripts/lib/check-layers-completeness.sh` derives a second, DoD/Acceptance-prose-sourced candidate touched-file and dependency set and diffs it against the block's `Layers:`/`Depends-on:` — a FAIL names the block and the file or task id the declaration omitted. An optional **`Cites:`** line exempts tokens the prose merely *cites* rather than touches; absence changes nothing, so a forgotten escape still FAILs, and a token in both `Cites:` and `Layers:` is a contradiction with its own named FAIL. **Both completeness FAILs name the escape in the message** (TD-039), so an author who trips the gate is not left inferring that the fix is to declare a touch that never happened; the fixtures assert the hint, so it cannot silently disappear. A declaration continues onto **indented** following lines; an unindented continuation is a named FAIL rather than silently read as prose (SPRINT-049 T3) |
| Layers observed vs git diff (TD-022, attribution TD-031/TD-035) | for an active sprint, `scripts/lib/check-layers-observed.sh` reads the actual git state since the sprint's recorded `plan_commit:` — a third, *observed* source that reads history rather than authored text, so it catches an **invented** file a DoD/Acceptance-prose source (leg above) cannot. Two paths since SPRINT-049 T1: **committed** changes are attributed to a task (a `Task: T<n>` trailer, else `sprint(NN) T<n>:` / `merge(…): T<n>` / trailing `(SPRINT-NNN T<n>)`, else `sprint(NN):` as coordinator bookkeeping, else **UNATTRIBUTED — its own named FAIL**) and tested against **that task's** `Layers:` alone, so a task editing a file only a sibling declared now FAILs by name; **uncommitted** work in progress has no commit to attribute and is still tested against the union — but since SPRINT-074 T3 it **says so**: a tree with real uncommitted work reports a named `SKIP … [WIP, unattributed]` instead of a bare `PASS`, naming the file count, that per-task attribution needs a commit, and that the committed run applies a stricter rule and **may FAIL where this leg does not** (TD-037, **resolved**). The two legs are still permitted to disagree — one has a commit to read and one does not — they are no longer permitted to disagree *silently*, which is what a coordinator checking its own WIP mid-flight was reading as clean. Nothing was weakened: a file declared by **no** task still FAILs from this leg, and the SKIP counts files *after* exclusions, so a tree whose only uncommitted files are excluded ones still earns a plain `PASS` (a caveat that fires on every tree stops being read). Exclusions on the committed path are down to three — `docs/sprint/**`, `docs/knowledge-index.md`, `.claude/worktrees/agent-*` — since attribution answers the rest by role. The uncommitted path splits its list by **kind, not file** (SPRINT-056 T3, TD-044): *structural* exclusions (`docs/sprint/**`, generated views, `.claude/settings*.json`, agent worktrees, the release-owned manifests) hold in every phase because those paths are undeclarable by construction; *close-time* exclusions (`TODO.md`, `TECH-DEBT.md`, `CHANGELOG.md`, `docs/LEARNINGS.md`) hold **only when the sprint has zero open DoD**, which is the phase their stated reason — "written at close" — actually describes. During execution an edit to one of them is task work and must be declared, which is what SPRINT-055 T6 did unreported for a whole task before surfacing against T7. Reads a *phase*, never *which task* is in flight (TD-037's warning stands). Every exclusion states its reason in the checker, never a silent list |

Non-zero exit = fix before release. Watch the near-cap files the run prints — one edit can breach
them.

**Eval-harness split (TD-013).** `evals/` also holds a fourth class of check — behavioural fixtures
that drive a real headless `claude -p` run (`evals/README.md` § "Real-run fixtures"). Those cost real
API tokens and are not deterministic enough to gate on, so they stay a manual `sh evals/run-...`
step, never wired into this always-on script. Only the zero-API harnesses above — which extract the
actual shipped snippet from its doc and assert against retained fixtures with zero network/API calls
— belong in the gate. Editing a snippet one of those harnesses guards (e.g. `night-run.md`'s
skill-freshness check) now fails `sh scripts/qa-check.sh` by name, closing the "check exists but
nothing runs it" gap TD-013 described.

**Always-on vs opt-in split (TD-016).** Within the zero-API set, `qa-check.sh` further splits
always-on from opt-in — a *different* boundary than the manual step above (that one is excluded
entirely; this one is gated either way, just not both on every run). The 3 `selftest-assert-*.sh`
harnesses, plus `run-layers-observed-fixtures.sh` (SPRINT-043 T1), each spin up throwaway git repos
via `mktemp -d` + `git init` and account for most of the leg's runtime (measured 2026-08-09: ~19s for
the 12 repos the layers-observed harness builds, on top of the selftests' own cost), so a bare run skips them;
`QA_FULL=1 sh scripts/qa-check.sh` runs the full set, selftests + layers-observed included.
Everything else — the snippet-runner harnesses (skill-freshness, worktree-usability,
dispatch-preflight) that guard shipped `skills/**` text, and the layers-completeness harness
(maintainer-facing but cheap and git-free, so it stays always-on rather than hiding a
corrupted-merge false-negative behind a flag) — always runs. So nothing drops out silently: what a
bare run skips is named right here, and `QA_FULL=1` recovers it.

## Judgment — manual / agent pass (a script can't decide these)

- [ ] **No HOW content** — every doc passes the WHY/WHERE filter (STANDARD §5); HOW belongs in code comments.
- [ ] **Cross-ref sanity** — `/skill` references and `references/` paths resolve; no dangling links.
- [ ] **Description-trigger quality** — each `SKILL.md` `description:` fires on the right intents, not the wrong ones (deep pass → TASK-012, `skill-creator` eval).
- [ ] **Lockstep versions** — `plugin.json` == `marketplace.json`.
- [ ] **DoD met** — the CLAUDE.md Definition of Done for any changed skill / loop.

## When to run

At **sprint close** and before any **release** — and any time a count or cap might have drifted (after
adding a skill or template). The mechanical pass is the gate; the judgment pass is the floor.
