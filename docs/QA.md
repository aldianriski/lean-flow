---
owner: Maintainer
last_updated: 2026-08-01
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
| Line caps | `SKILL.md` <=110 · `CLAUDE.md` <=80 · `CONTEXT.md` <=130 · active `SPRINT-*` <=400 |
| Skill count | disk count of `skills/*/SKILL.md` == the number claimed in CLAUDE.md / CONTEXT.md / docs/architecture/overview.md |
| Template count | `templates/*.md.template` files == claimed core + 2 non-core (DESIGN, QA-TESTCASE); claim in CLAUDE.md + docs/architecture/overview.md |
| Frontmatter | every `SKILL.md` has `---`/`name`/`description`; every core ledger has `owner`/`last_updated`/`status` |
| Task schema | active-sprint `### Tn` Plan blocks carry `class:` + an autonomy tag (HITL/AFK) in header meta, plus `Depends-on:`/`Layers:`/`**Acceptance:**` — else FAIL (TASK-110) |
| Eval harnesses (TD-013, split TD-016) | every zero-API harness under `evals/` (`ls evals/run-*.sh evals/selftest-*.sh` — see the split below) is gated on **that harness's own exit status** — a FAIL names both the harness and the finding it reported |
| Headless park-record cue (TD-019) | migrate's and init's procedures (`skills/lean-doc-generator/references/{migration-map,init}.md`) each still carry the ask-channel probe (`ToolSearch select:AskUserQuestion`) and the park-record instruction naming a `/handoff` doc — a FAIL names the procedure and which of the two it lost |
| Layers/Depends-on completeness (TD-020, escape TD-032) | for every `### Tn` block in an active sprint's Plan, `scripts/lib/check-layers-completeness.sh` derives a second, DoD/Acceptance-prose-sourced candidate touched-file and dependency set and diffs it against the block's `Layers:`/`Depends-on:` — a FAIL names the block and the file or task id the declaration omitted. An optional **`Cites:`** line exempts tokens the prose merely *cites* rather than touches; absence changes nothing, so a forgotten escape still FAILs, and a token in both `Cites:` and `Layers:` is a contradiction with its own named FAIL. A declaration continues onto **indented** following lines; an unindented continuation is a named FAIL rather than silently read as prose (SPRINT-049 T3) |
| Layers observed vs git diff (TD-022, attribution TD-031/TD-035) | for an active sprint, `scripts/lib/check-layers-observed.sh` reads the actual git state since the sprint's recorded `plan_commit:` — a third, *observed* source that reads history rather than authored text, so it catches an **invented** file a DoD/Acceptance-prose source (leg above) cannot. Two paths since SPRINT-049 T1: **committed** changes are attributed to a task (a `Task: T<n>` trailer, else `sprint(NN) T<n>:` / `merge(…): T<n>` / trailing `(SPRINT-NNN T<n>)`, else `sprint(NN):` as coordinator bookkeeping, else **UNATTRIBUTED — its own named FAIL**) and tested against **that task's** `Layers:` alone, so a task editing a file only a sibling declared now FAILs by name; **uncommitted** work in progress has no commit to attribute and is still tested against the union (TD-037). Exclusions on the committed path are down to three — `docs/sprint/**`, `docs/knowledge-index.md`, `.claude/worktrees/agent-*` — since attribution answers the rest by role; the full close-bookkeeping list still applies to the uncommitted path. Every exclusion states its reason in the checker, never a silent list |

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

- [ ] **No HOW content** — every doc passes the WHY/WHERE filter (DOCS_Guide §5); HOW belongs in code comments.
- [ ] **Cross-ref sanity** — `/skill` references and `references/` paths resolve; no dangling links.
- [ ] **Description-trigger quality** — each `SKILL.md` `description:` fires on the right intents, not the wrong ones (deep pass → TASK-012, `skill-creator` eval).
- [ ] **Lockstep versions** — `plugin.json` == `marketplace.json`.
- [ ] **DoD met** — the CLAUDE.md Definition of Done for any changed skill / loop.

## When to run

At **sprint close** and before any **release** — and any time a count or cap might have drifted (after
adding a skill or template). The mechanical pass is the gate; the judgment pass is the floor.
