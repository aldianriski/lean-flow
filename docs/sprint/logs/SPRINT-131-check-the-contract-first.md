---
sprint: 131
slug: check-the-contract-first
owner: Maintainer
last_updated: 2026-10-19
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-131 — Execution Log

> Append-only companion to [`../SPRINT-131-check-the-contract-first.md`](../SPRINT-131-check-the-contract-first.md). Uncapped by
> design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line budget (STANDARD §9 ·
> ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry carrying the signed
> governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a `scope-change` entry — what broke ·
> impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-19 | promote | plan locked, governance signed, four members: the reference re-judgement
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. The four active entries (L-237 · L-236 · L-234 · L-210) are each at count 1; a query that also matched
  L-155 was checked by its header, `[status: promoted]`.
- ☑ TD aging: 103 of 103 open rows aged against sprint 131. Second route: 126 rows − 23 resolved = 103, each filed at 128 or
  earlier. Newly aged and named in the ledger's sweep: TD-253 · 254 (aged at 130) and TD-255 · 256 · 257 · 258. The SPRINT-129 and
  SPRINT-130 promotes wrote no sweep — a miss, recorded in the sweep itself. No open row is `high`.
- ☑ doc-aging: §11 TD deletion of the 20 rows resolved at 128 (ids retired) and §11 store prune of `done/TASK-443` · `444` ·
  `445` · `446` · `447` (closed SPRINT-128; no live `.md` citation) — both owner-approved, applied before this commit, each in its
  own commit; deletion verified to remove exactly 20 row headers and no heading or note. §2 caps: no breach.
- ☑ epic rollup currency · epic coverage: no active epic. ☑ roadmap coverage: no roadmap. ☑ handoff ledger: none.
Size check: 2 M + 2 S, no `L`. All four members are `origin: decomposer`. TASK-461 stays in the backlog (`blocked` on TASK-460).
promote-check 13/0 first run. Dispatch preflight: CLEAR (all four tasks wave 0; no shared Layers file).

### 2026-10-19 | gate | G1 + G2 signed by the owner (two popup rounds); attended sprint-bulk, all four tasks wave 0, T2 last
G1: batch fast-path confirm, all four members `origin: decomposer`, scope unchanged since `plan_commit` 8fd58050.
G2 ran the new builder check on its own four designs before sign-off (TASK-458's L-007 exercise). Four fresh Sonnet readers ran
in parallel, one per task design, each given the design, the member's frozen `## Done when` and the touched paths. Their reports
were settled before the popup: factual questions by the coordinator, contradictions by fixing the design, and intent calls in
the popup.
builder-check · T1 · 1 contradiction · 6 questions · fixed: the pre-signed overnight G2 never reached the checklist line, so night-run.md's pre-flight item now requires the check's record; the rest factual
builder-check · T2 · 2 near-contradictions · 9 questions · fixed: Codex tokens are unmetered and excluded from both arms; the thresholds are cited at 8fd58050; the window, defect and brief rules are set
builder-check · T3 · 5 contradictions · 7 questions · fixed: self-contained packets with the real prior answers; picker readers keep "Other"; the verdict rule is fixed with tie → none (owner); the census is one row per question
builder-check · T4 · 4 contradictions · 5 questions · fixed: the trim is net zero (147 kept); one authoritative record per row; completed vs stopped follows night-run's DELIVERED/PARTIAL map; "removed" = revert the commit
Cost of the check: 245k tokens in total (56k · 62k · 63k · 64k) and 29–49 s per design.
Approved designs:
- **T1** — a new `references/builder-check.md` holds the prompt and procedure, plus one G2 checklist line in SKILL.md (139 → 140)
  and one clause in night-run.md's pre-flight G2 item. /flow and mvp reach the line through SKILL.md § G2, cited rather than
  re-stated. Built inline by the coordinator (stated reason: the prompt is the coordinator's exercised artifact). Codex review
  plus the adversarial floor.
- **T2** — the dispatch arm is rebuilt from the 2026-10-19 transcript (main thread and its 30 sub-agent transcripts; per-call
  input + cache-creation + cache-read + output) and the archived logs. The inline arm is one Opus agent per sprint in a scratch
  checkout of `b1712732` / `9c782185`, given the first-dispatch briefs as written, with the same reviews and verification and one
  bounded retry. Thresholds as frozen; one run, no re-run; it runs last (owner).
- **T3** — a census of the day's AskUserQuestion questions (one row each) from the main-thread transcripts. Self-contained
  packets go to 2 open-form and 2 picker-form Sonnet readers, and a blind judge scores each against the verbatim answer. Gain =
  open intent sum > picker on the three "Other" questions AND clarity loss vs picker on ≤1 of 11 per reader; a tie is none (owner).
- **T4** — a 5-row loop table under § The loop (task · sprint · epic · overnight run · revise loop), net-zero trim from the
  § Base-tier blockquote and the directory notes. A reader test of 8 cases × 2 arms (16 Sonnet agents) runs in scratch checkouts,
  and the frozen keep rule decides; "removed" reverts the commit. A dispatched Sonnet builder writes the table.
Verification: T1 → `wc -l` ≤ 140, the doc-caps and prose-density legs, and a generic-path grep. T4 → `wc -l` = 147 and the same
legs. T2 · T3 · T4's verdicts → judgment ticks citing their records (no mechanical method reaches a measurement).
Shared files: `docs/research/reference-rejudge.md` · CHANGELOG · the sprint file, log and member files — coordinator-owned (D1).
Live concurrency noted: two other Claude sessions (pids 19916 · 29872) hold locks on 4 of the 12 stale worktrees, so none is
touched. Shared files are staged per path and `git diff --cached` is read before each commit.
Dispatch preflight: PASS base-ref: declared base matches live HEAD (15d35c0907d7abf6792c772ed5c95b3773ff1499) PASS wave-computation: T1=0 T2=0 T3=0 T4=0 PREFLIGHT: CLEAR
