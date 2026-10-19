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

### 2026-10-19 | progress | T1 built inline (`b88e89c8`); T3 census and T4 table builder dispatched in parallel
T1: `references/builder-check.md` is new: the procedure plus the prompt exercised at this sprint's G2, generic (the grep for
`scripts/|docs/sprint|lean-flow|TASK-|L-[0-9]` prints nothing). SKILL.md § G2 gains one line, PASS cap 140 ≤ 140. The prose-density
check reports SKILL.md at 13 ≤ 13. night-run.md's pre-flight G2 item adds one clause: a G2 counts as signed only with its
`builder-check · Tn` lines. Wiring citations: `skills/flow/SKILL.md:36` (stage 4 → `/orchestrator sprint-bulk` through G1 / G2)
· `night-run.md:210` (entry step 4 → `sprint-bulk` steps 1–2) · SKILL.md `### mvp` step 4 → the same § G2.
Correction to the G2 popup: it said "9 contradictions or near-contradictions". The four reports' own counts are 1 + 2 + 5 + 4 = 12,
which is what the gate entry's per-task lines record. 27 questions is correct.
consequence · T1 · behaviour:low · governance:high → one scoped reviewer (Codex, D3) + the adversarial floor if it returns 0 findings
review · T1 · scoped-reviewer · Codex gpt-6-astra (static) · T-a.1–4 · T-b–T-f all OK · VERDICT: CLEAR (0 findings) → adversarial floor re-run dispatched
consequence · T4 · behaviour:low · governance:low → self-review of the table diff; the reader-test record goes to Codex once before the verdict (D3)

### 2026-10-19 | scope-change | TASK-460: the frozen "14 questions, 3 Other" premise is wrong; re-scoped to the census (owner ruling)
**What broke:** the census of the 2026-10-19 main-thread AskUserQuestion questions (window 2026-10-18T17:00Z → 2026-10-19T12:18:22Z,
the commit that wrote the research doc) finds **37 questions in 18 popups**: 4 in session 6986f732 and 33 in ae0243da. Two routes
agree: tool_use matched to `answers` (37), and tool_result answer pairs counted separately (37 once both reply phrasings are
read). Only **2** answers are free-text "Other": Q09 ("docs backlogtask and codex rescue for all we doit…") and Q36 ("how status of
research please inform me about this first"). No answer carries a note. The "3 of 14" in `reference-rejudge.md` and in TASK-460's
Done-when ("the three known Other answers" · "the other eleven") was written without a census, the same failure as a figure
frozen into an artifact (L-143 family).
**Impact (owner ruling):** measure all 37. The intent targets are Q09 and Q36; the clarity check covers the other 35. The
verdict rule keeps its shape: gain = open intent sum > picker sum on the 2 targets AND clarity loss vs picker on ≤ 3 of 35 per
reader (the same ~9% bar as 1 of 11); a tie is none. The research doc's "3 of 14" is corrected whatever the verdict. Done-when
boxes 1–2 are ticked against this ruling, and their text is not edited.

### 2026-10-19 | progress | T1 adversarial retry CLEAR; T3 verdict none (TASK-461 proposed for cancellation); T4 table removed by its rule
T1: the adversarial floor (Codex, assume-guilty) found 2 issues, and both were fixed in the one retry, `2e1c9eef`. F1: night-run's
entry path said "before any spawn" while its G2 step now spawns readers, so it now says "before the run is spawned". F2: there
was no path for a host without sub-agents; now a fresh session is the reader, and failing that the line records `not run` in the
popup. Re-review CLEAR. TASK-458 boxes 1–4 ticked; box 5 (CHANGELOG) waits for close.
review · T1 · adversarial-floor · Codex gpt-6-astra · FINDINGS (2) → retry 2e1c9eef → re-review CLEAR
T3 (TASK-460): 37 packets; 4 Sonnet owner-proxies (2 open, 2 picker with "Other"); a blind Sonnet judge (148 lines). Intent: open 3
vs picker 2, passing. Relative clarity loss: open r1 2/35 and open r2 5/35, so r2 fails the ≤3 bar. **Verdict: none.** The verdict
is judge-sensitive: discounting Q18 · Q32 (sprint names) flips it to gain, and the record says so. TASK-461 gains a note proposing
cancellation, and the owner rules at close. Cost: census 110k · readers 88k + 84k + 95k + 92k · judge 59k tokens.
review · T3 · scoped-reviewer · Codex gpt-6-astra · FINDINGS (2) (an overclaim on Q09; reader freshness not stated) → record retry → re-review CLEAR
T4 (TASK-462): the table was built (`d339763b`, net-zero 147, cap PASS), and 8 real-artifact cases ran × 2 arms (16 Sonnet readers,
leakage files deleted from both checkouts). Records were 8/8 correct in both arms, with 0 classification errors. Median 22.5 s
with the table vs 24.5 s without (ratio 0.92 > 0.75), so it is **removed**: reverts `9a35d692` · `d552c03d`, and
`git diff 07113e12 HEAD -- docs/architecture/overview.md` is empty. The revert commits were made by `git revert --no-edit` and lack
the session trailers.
review · T4 · scoped-reviewer · Codex gpt-6-astra · FINDINGS (1) (Done-when item 1 evidence) → record retry → re-review FINDINGS (1): leakage deletions asserted, not shown → still-open → owner
  evidence since: `git status --short` in both reader checkouts lists ` D` for reference-rejudge.md · SPRINT-131 sprint + log · TASK-462 (4 files each)

### 2026-10-19 | decision | T2: how the inline arm counts coordinator context, fixed before any inline figure exists
Dispatch-arm baseline (from the 2026-10-19 transcript, deduped by message id; Codex's own tokens are unmetered and excluded from
both arms). S129 (06:00:16Z → 06:16:23Z, elapsed 967 s, owner wait 0): coordinator 12.40M · builders 2.55M · retries 0.45M ·
Codex wrapper 0.22M = **15.61M**, 3 material defects. S130 (09:18:22Z → 09:31:33Z, 790 s, owner wait 0, T3-only calls 1.63M
excluded): coordinator 12.65M · builders 1.23M · retries 0.61M · wrapper 0.26M = **14.75M**, 3 material defects. The
coordinator is 79–86% of each arm. It made 36 and 27 calls, each re-reading the session's carried context: a median of 318k
tokens per call at the S129 window's start and 510k at S130's.
**The bias:** the replay's inline agent starts with a fresh, small context. Real inline execution would run every one of its
calls inside that carried coordinator context. TASK-459's Done-when counts "coordinator context", so the verdict reads the
**context-adjusted** inline total: `inline_raw + N_inline_calls × C0`, where C0 is the first-five-call median above (S129 318,088
· S130 510,392) and N is the inline agent's unique model calls. Review and Codex-wrapper agents stay as measured, as in the
dispatch arm. The raw inline total is reported beside it, and the bias is named either way. The thresholds are unchanged
(≤ 70% tokens · defects ≤ dispatch · elapsed ≤ 110%).

### 2026-10-19 | progress | T2 measured: inline fails on cost (context-adjusted 1.01× and 2.00× vs the ≤0.70 bar); dispatch default stands
Inline arm: one fresh Opus agent per sprint in a bundle clone ending at `plan_commit` (b1712732 · 9c782185), with the
first-dispatch briefs as written. S129: 42 calls, 3.49M raw. S130: 49 calls, 4.24M raw. Codex wrapper: 0.11M · 0.21M. Reviews
mirrored the dispatch arm: Codex first pass, adversarial floor on zero-finding passes, one retry by the inline agent, one
re-review. All re-reviews were CLEAR. Defects at review: S129 had 2 (prompt wiring F1+F2 · whole-suite rule duplicated). S130
had 3 (interior run · quoted-head bypass · empty-capture cause). Wall clock: 1117 s vs 1059 s, and 798 s vs 790 s.
Adjusted per `efa851d4`: S129 16.96M vs 16.79M (1.01×), S130 29.46M vs 14.75M (2.00×), so **fail**. The raw ratios would pass
(0.21× · 0.30×). The record is in `reference-rejudge.md` § Experiment results.
review · T2 · scoped-reviewer · Codex gpt-6-astra · FINDINGS (4) → record retry → re-review FINDINGS (3) → still-open → owner: defect comparison not blind for S129 (its inline adversarial review ran git in the main repo); S130 elapsed confounded by T3 time; defects compared at review only. Claims narrowed in the record; the verdict rests on cost alone.
Found by the replay, in the LIVE repo: (1) the TD-154 guard `invokes()` accepts `"echo" sh scripts/qa-check.sh`, `'echo' …` and
`e"ch"o …` as gate invocations (probe output: true ×3); (2) `review-scoping.md:241` still restates the whole-suite rule, against
SPRINT-129's one-place ruling. Both are TD candidates for close.

### 2026-10-19 | owner-ruling | T2 accepted with caveat; T4 accepted; TASK-461 cancelled at close; the two live defects filed as TD at close
owner-ruling: review · T2 — accepted with caveat. Box 1 is ticked citing the disclosed blinding breach in one review; the cost verdict does not depend on that review.
owner-ruling: review · T4 — accepted. The leakage evidence (`git status` of both checkouts) is recorded above.
owner-ruling: TASK-461 — cancel (T3 found no gain under its fixed rule).
owner-ruling: the live TD-154 quoted-head bypass and the review-scoping.md:241 duplicate are filed as TD rows at close, not fixed in this sprint.

### 2026-10-19 | gate | system verify FAIL (2 attribution findings) → owner ruling: fixed-and-rerun; 4 commit subjects rewritten
system-verify · FAIL(layers observed · dod-delta) · QA_FULL on the VPS at `55d581ff`: 298 pass, 2 fail, 113 s; `bun test` 441/0
owner-ruling: system-verify — fixed-and-rerun. The two findings were commit attribution, not content: a combined `sprint(131) T3 + T4:` subject that no attribution arm reads, two `Revert …` subjects with no sprint attribution, and T2's commit writing the coordinator-owned `reference-rejudge.md` under a `T2:` subject that T2's Layers do not declare.
Fix: `git filter-branch --msg-filter` over `e16397c8..main` (local, unpushed) rewrote 4 subjects only. Trees are byte-identical:
HEAD^{tree} `6a4ce691` before and after. The old history is kept at `backup/sprint131-pre-rewrite`. Sha map (old → new), for
every reference above: `9a35d692 → 0afee584` · `d552c03d → 09eba192` · `75b49a59 → 171a41f9` · `cf1a78ea → 555a28f9` ·
`da1b5a2e → 4f5b203a` · `efa851d4 → fc18fb45` · `b6755a54 → 180f9a6b` · `e09cf26a → 0c9dd216` · `f968f871 → 30c4d7d7` ·
`55d581ff → 69ad1edd`. The tick evidence in TASK-459 and TASK-462 cites the old shas, which resolve through this map.
`reference-rejudge.md` is updated in place.
