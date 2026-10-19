---
sprint: 130
slug: a-gate-you-can-trust
owner: Maintainer
last_updated: 2026-10-19
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-130 — Execution Log

> Append-only companion to [`../SPRINT-130-a-gate-you-can-trust.md`](../SPRINT-130-a-gate-you-can-trust.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line budget (STANDARD §9 · ADR-014).
> **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry carrying the signed
> governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a `scope-change` entry — what broke ·
> impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-19 | promote | plan locked, governance signed, three members: the trustworthy-gate debt slice
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due. The three active entries (L-236 · L-234 · L-210) are each at count 1; a second query that also
  matched L-155 · L-127 was checked by their headers, both `[status: promoted]`.
- ☑ TD aging: 102 of 106 open rows aged against sprint 130. Second route: 106 open + 20 resolved = 126, equal to the distinct-id
  count. Newly aged: TD-253 · TD-254 (low, filed at 127). No open row is `high`. TD-117 routed → TASK-367 beside TD-090 by owner
  ruling at this promote; TD-154 · TD-167 · TD-135 are this sprint's members.
- ☑ doc-aging: §11 store prune of `done/TASK-439` · `440` · `441` · `442` (closed SPRINT-127; no live `.md` citation), applied
  before this commit, owner-approved. `done/TASK-438` kept by owner ruling: it is named only in code comments (`tick-box.ts`,
  `qa-check.sh`, its harness), which the live-citation rule does not count, but those comments still send readers to it. TD
  deletion: none due (the 20 resolved rows are due at 131). CHANGELOG rotated at 2.10.0. §2 caps: no breach; two soft overruns
  retained in `.cap-dispositions`.
- ☑ epic rollup currency · epic coverage: no active epic. ☑ roadmap coverage: no roadmap. ☑ handoff ledger: none.
Size check: 3 S, no `L`. All three members are `origin: decomposer`, so each G1 is the fast-path confirm. Intake recon (Explore)
is the source for D2's facts: `invokes()`'s split-and-prefix rule, case 12's two `date` calls, and TD-135's suspect test gone.
promote-check 10/0 after one fix: four member-implied files (`discovery-order.test.ts` bare, `package.json`, `qa-check.sh`,
`TECH-DEBT.md`) added to the Cites: lines as read-only or coordinator-owned. Dispatch preflight: CLEAR (waves T1=0 T2=0 T3=1).

### 2026-10-19 | gate | G1 + G2 signed by the owner (one popup round); attended sprint-bulk, waves T1 · T2 → T3
G1: batch fast-path confirm, all three members `origin: decomposer`, scope unchanged since `plan_commit` 9c782185.
G2: T1 — `invokes()` keeps its prefix rule and adds a whole-token trailing-run rule after an executing head (`echo` · `printf` ·
`:` excluded), quotes still stripped first; tests add the wrapper as an invocation, an unquoted-echo must-FAIL and a wrapped
`.bak` bypass. T2 — a `date` shell function inside case 12's subshell freezes both clock reads (elapsed exactly 1263, exact
assertion kept); an empty capture prints a named harness-env FAIL; must-FAIL proven by a cmp-landed seed of the real ceiling
block in a worktree, not committed. T3 — coordinator-run measurement after T1 merges (5× VPS via git bundle · 3× Windows).
Verification: T1 → `bun test test/gate-discovery/discovery-order.test.ts`; T2 → `sh evals/run-qa-budget-fixtures.sh` + the
seeded proof; T3 → a recorded measurement (judgment tick). Reviews logged as `review · Tn` lines from the start (L-151).
Dispatch preflight: PASS base-ref: declared base matches live HEAD (9345cb17c980c5c857b671920eae6800b5634270) PASS wave-computation: T1=0 T2=0 T3=1 PREFLIGHT: CLEAR 

### 2026-10-19 | progress | T1 reviewed (two Spec findings, one retry, CLEAR) and merged; T2 in its retry
Worktree-base guard: PASS for both wave-1 worktrees (branched from 1af49c44). T1 → `1e0d443a`; pre-merge Codex review:
Standards CLEAR · Spec F1 (the wrapped match accepted an INTERIOR token run — the frozen Done-when says TRAILING; the coordinator's
G2 wording "or followed by a space" was looser, and the Done-when governs) · F2 (only a literal space was a token boundary).
Retry → `1da1259b` (`endsWithTokens`: the last N whitespace-split tokens equal the declared tokens, behind a non-builtin head);
re-review CLEAR. Merged `b64ff9c0` (`integ-130`, `--no-ff`); main fast-forwarded; gate-discovery 15/0 on the merged tree.
TD-154 resolved. TASK-455 boxes 1–3 ticked via tick-box.
T2 → `3dc85e47`; first review CLEAR (0 findings) → adversarial floor: the empty-capture line asserted a cause (a host fork/memory
failure) that a code regression also produces (a block exiting before it prints). The coordinator had exercised that branch with
a seeded empty capture beforehand; the finding is about its diagnosis, not its firing. In its one retry now.
consequence · T1 · behaviour:low · governance:low
review · T1 · scoped-reviewer · behaviour:low · governance:low
consequence · T2 · behaviour:low · governance:low

### 2026-10-19 | progress | T2 reviewed (adversarial finding, one retry, CLEAR) and merged; T3 measured 8/8 agreeing; every member done
T2: retry → `f3a6e64e` — the empty-capture line now states the child's exit status and no asserted cause; both empty shapes
seeded and fire (`out12` blanked: exit 0; a block exiting before it prints: exit 1, case 13 green), restores cmp-identical;
re-review CLEAR. Merged `acccc165` on `integ-130`; harness PASS on the merged tree; main fast-forwarded. TD-167 resolved.
review · T2 · scoped-reviewer · behaviour:low · governance:low
T3 (coordinator-run measurement, inline by design: it uses the owner's VPS route and changes no code) at `896e3ab9`:
VPS 5/5 `441 pass, 0 fail` across 11 files (6.78–6.92 s); Windows 3/3 `441 pass, 0 fail` (67.18–73.66 s). Each read from the run's
own summary line, rc 0 each, no `(fail)` line. All eight agree → TD-135 resolved as not reproduced; its wrong impact line
corrected in the ledger (`bun test` is `package.json`'s second stage, outside `qa-check.sh`).
consequence · T3 · behaviour:low · governance:low
review · T3 · self-review · behaviour:low · governance:low
TASK-456 boxes 1–4 and TASK-457 boxes 1–3 ticked via tick-box. All three members built and verified.

### 2026-10-19 | close | 3 of 3 members in `done/` (close gate 8/0), PLAN_EXHAUSTED; unreleased (no consumer-visible change); Retro + buckets
run · 10 of 10 DoD ticked
terminal · PLAN_EXHAUSTED
System verify: QA_FULL 299/0 on the VPS at `8b1d207f`, the final integrated tree (111 s; no truncation, all 59 declared harnesses
run; two fewer passes than SPRINT-129's 301 because some checks run once per member, and this sprint has 3 to its 4). No release:
`git diff --name-only 9c782185..HEAD` touches only `test/`, `evals/`, the ledgers and the sprint's own files — `skills/`, the
manifests, README, `spec/`, `scripts/` and `conformance.sh` are untouched, so CHANGELOG carries an unreleased SPRINT-130 block.
Doc-freshness: no §2 trigger fired (roster, loop and CONTEXT unchanged).
Buckets: Shipped → the unreleased CHANGELOG block. Tech debt → TD-154 · TD-167 · TD-135 resolved by this sprint, TD-117 routed to
TASK-367 at promote; no new row; the ledger reads 126 rows (103 open · 23 resolved). Follow-ups → none. Learnings → L-237 new
(a G2 paraphrase loosened a frozen Done-when). Handoff ledger: no `handoff` entry was taken. No epic is attached.
