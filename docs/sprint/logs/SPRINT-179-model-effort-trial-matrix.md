---
sprint: 178
slug: model-effort-trial-matrix
owner: Maintainer
last_updated: 2026-11-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-179 — Execution Log

> Append-only companion to [`../SPRINT-179-model-effort-trial-matrix.md`](../SPRINT-179-model-effort-trial-matrix.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-16 | promote | plan locked, 1 member: TASK-670 (1 plan step)
Owner rulings, verbatim: "Durable rule in LEARNINGS (Recommended)" (L-306: move-to-reference into LEARNINGS § Durable rules, the L body collapsed to a pointer, no CLAUDE.md line) · "Merge into the template (Recommended)" (L-319: merged into the LEARNINGS template's `related:` comment, corpus ids only, plus a CHANGELOG [Unreleased] line) · "Build TASK-670 only (Recommended)" (SPRINT-179 has one member; TASK-671 stays in the backlog, `blocked`, unstamped).
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Sign it (Recommended)".
- ☑ L-promotion: L-306 and L-319, both count 2 and `promoted: no`. Two selections agree (a walk of every `## L-` heading with count of 2 or more and `promoted: no`; the distinct `promoted:` values, whose only other count-2 hit is L-235, merged into L-224). L-306 → `docs/LEARNINGS.md` § Durable rules › host-tooling, disposition move-to-reference. L-319 → `skills/lean-doc-generator/templates/LEARNINGS.md.template` `related:` comment, disposition merge. Commit `57d65d5a`; `check-doc-caps.ts` after it: token budget ~12679 of 12691, no FAIL or WARN.
- ☑ TD aging: 120 open rows (76 low, 24 minor, 13 medium, 7 trivial, none high), 119 aged three sprints or more against sprint 179; the one younger row is TD-316 (filed at 178). TD-315 crossed the line at this promote. Nothing escalates. Disposition: keep all open, no re-review sweep.
- ☑ TD deletion, §11: none; no row is `resolved`.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 103 PASS, 0 FAIL, 0 WARN. CHANGELOG rotation not due. LEARNINGS pointer-collapse: deferred to the close compaction sweep. Caps at the limit: `.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80, always-loaded token budget ~12679 of 12691, so T1's CONTEXT edit must add no net line (D3).
- ☑ epic rollup currency: EPIC-025 (rows for SPRINT-172 and SPRINT-173 carry their `close_commit`, header 2026-11-15) and EPIC-026 (row for SPRINT-178 carries `dfd668f7`, header 2026-11-16, its ticked condition names SPRINT-178). None.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`. EPIC-026 has 3 open conditions, all marked `→ next slice: …`. 0 uncovered. TASK-670 is standalone: no `epic:`, no override.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent).
- ☑ handoff ledger: one row, "2026-11-16 | handoff | model × effort routing matrix, measured trial", `handoff-status: live`, path `C:\Users\HYPE AMD\AppData\Local\Temp\handoff-model-effort-matrix.md`. Promote writes no transition: `/handoff` sets `consumed` and close sets `spent`.
Sprint number: 179, the maximum in use plus one. Four selections all gave 178: `docs/sprint/`, the archive plans, the archive logs, `git ls-files`; fixture ids excluded.
Composition: 1 member, size M, no epic, no stream. Commits: filing `ce0a4078`, learnings `57d65d5a`, status move `98d99ba1`.
Baseline gate (off-host, run by the coordinator on HEAD `a4d3e906`; the two untracked paths were TASK-670 and TASK-671): `gate-remote: ran a4d3e90603988cc90ff8f6ffbd059d7126eb9fcc` · `bun test: 638 pass, 0 fail (rc 0)` · `qa-check: QA-CHECK: 225 pass, 0 fail (rc 0)`.
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.
consequence · T1 · behaviour:low · governance:low

### 2026-11-16 | gate | G1 + G2 signed for T1 (TASK-670)
The owner signed by popup. Answers, verbatim: "Sign G1+G2 (Recommended)" · exercise box: "Yes, it ticks the box (Recommended)" (the review of T1's own diff, run under the shipped review cell with its record, ticks the exercised-on-real-input box; it is early data outside the next sprint's cap of 6) · build route: "Codex builds, Fable + fresh Codex review (Recommended)".
G1: fast path, `origin: decomposer`, scope unchanged since the intake approve.
G2 design: Codex builds the text in a worktree; the coordinator lands and commits. dispatch.md keeps the three class rows and gains an opt-in `### Trial cells` subsection keyed to ADR-010 role names (`mechanical-ingest` · `execution` · `decision-escalation`), plus the effort sentence and one § Escalation sentence. CONTEXT line 98 is rewritten to a pointer and a `dispatch-trial:` line is added, net-zero on lines and inside the token budget, or the build reports blocked. ADR-010 gets a 2026-11-16 amendment reversing item 3 only. CHANGELOG [Unreleased] and README get one line each.
Builder-check settlements: the diagnose cell is item 4's existing fail-point dispatch on the `decision-escalation` tier, under the 2026-11-13 amendment's conditions unchanged, so it sits inside the exception and nothing widens · "Releases are not blocked" is met by the default-off opt-in (judgment tick) · a Codex build row is added outside the measured set, so the `execution`-high fallback has a source · review order: Fable first, then Codex, Codex never shown Fable's findings.
Early-data records (pre-rule, default effort, harness-reported subagent_tokens): intake worker 102.5k over 4 passes · intake draft review Fable 75.5k (R1+R2) and Codex 7.2k + 16.0k · promote worker 161.8k · builder-check reader 61.4k.
builder-check · T1 · 2 contradictions · 4 questions · facts settled by the coordinator; exercise-box and build-route intent answered by owner popup
consequence · T1 · behaviour:low · governance:high
