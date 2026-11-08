---
sprint: 167
slug: grant-scope-and-token-room
owner: Maintainer
last_updated: 2026-11-08
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-167 — Execution Log

> Append-only companion to [`../SPRINT-167-grant-scope-and-token-room.md`](../SPRINT-167-grant-scope-and-token-room.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-08 | promote | plan locked, two members: TD-301 and TD-302
Promote governance checklist, signed by the owner by popup. Sign-off text, verbatim: "Sign as drafted (Recommended)" (option text: "All 7 lines signed; TD aging disposition = keep, nothing escalated. Worker then makes the 3 commits (file · move to todo · plan locked)."). Epic question, verbatim: "No epic (Recommended)" (option text: "Tasks carry no epic:; TASK-621 records the trial's verdict in EPIC-024 itself. No Member-sprints row.").
- ☑ L-promotion: none. 274 entries; none at count 2 or more with `promoted: no`.
- ☑ TD aging: 115 open rows, none `high` (13 medium); 111 aged 3 or more sprints and 4 newer. Disposition: keep, nothing escalated, rows not re-reviewed.
- ☑ doc-aging, §11 and §2 caps: none. `check-doc-caps.ts` printed no FAIL and no soft over-cap; four research docs print named `retained:` dispositions and one is FROZEN. Token budget ~12688 against 12691.
- ☑ epic rollup currency: EPIC-024 current. ☑ epic coverage: EPIC-024 fully covered (3 open, 3 mapped), not touched by this sprint. ☑ roadmap: none (no roadmap file). ☑ handoff ledger: none (no ledger file).
Composition: TASK-622 (S), TASK-623 (S); no `L`. No dependency; disjoint files. Single stream; no epic. TASK-621 is outside the sprint and untouched. Filing commit `ecb4ad27`; status moves `2eab339c`.
G1 and G2 are not yet signed; `gates_signed` is recorded in the sprint frontmatter only after the owner's sign-off is relayed.

### 2026-11-08 | gates | G1 + G2 signed (batch, sprint-bulk)
G1: fast-path, both members `origin: decomposer`; scope unchanged since the decomposer `approve`. G2: designs for T1 and T2 as settled by the builder checks (coordinator scratch design file). Owner sign-off by popup, verbatim: "Sign G1 + G2 (Recommended)". Recorded as `gates_signed: G1,G2 @ ea0e636d`.
builder-check · T1 · 0 contradictions · 2 questions · both factual, settled in the design: both probe arms run with `--setting-sources project`, and an arm whose JSON shows no `/diagram` output is void
builder-check · T2 · 0 contradictions · 3 questions · all factual, settled by the coordinator: the alias resolver and "refused, never defaulted" sit in `night-run.md` Part 0 and `orchestrator/SKILL.md` Mode dispatch; "launcher writes the state" sits in `night-run.md` Part 0b; `night-run.md` has no "Authority classes" heading, so the Authority pointer cites `night-run.md` Part 0
consequence · T1 · behaviour: low (narrower grant) · governance: shipped-skill security grant → one scoped `sonnet` reviewer pre-merge
consequence · T2 · behaviour: none · governance: always-loaded workflow-contract text → one scoped `sonnet` reviewer pre-merge
Overlap map: T1 owns `skills/diagram/SKILL.md` · `SECURITY.md` · `CHANGELOG.md`; T2 owns `.claude/CONTEXT.md`; no shared file, no `Depends-on` → one parallel wave, worktree-isolated, declared base `ea0e636d` plus this commit. Coordinator owns the sprint file, this Log, member ticks and moves, the T1 headless probe and system verify.
Worktree cleanup before the fan-out, owner ruling by popup, verbatim: "Remove 8 clean, keep 9 (Recommended)". Removed 8 merged and clean agent worktrees (branches kept); 9 holding uncommitted work stay for a separate review.
