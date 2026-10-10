---
sprint: 122
slug: finish-epic-015
owner: Maintainer
last_updated: 2026-10-10
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-122 — Execution Log

> Append-only companion to [`../SPRINT-122-finish-epic-015.md`](../SPRINT-122-finish-epic-015.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-10 | promote | plan locked, governance signed, two members: make USER_STOP reportable, then prove repair and Dogfood 2 overnight
Promote governance checklist, signed by the owner by popup, and written here at promote (the SPRINT-121 lesson, S10.PROMOTEREVIEW):
- ☑ L-promotion (count≥2, promoted:no): three were due. L-185 (F, ×8) was merged into L-111's durable rule. L-219 (G, ×5) moved
  to reference (`dispatch.md` § Worktree dispatch protocol). L-217 (H, ×4) was retained, with TASK-417's stop rule as its home
  (`3de96544`, `01f499bb`). One active entry is left (L-210).
- ☑ TD aging (≥3 sprints unaddressed): none newly aged. Nothing was filed at SPRINT-119, so the 120 aged rows are already named in
  the sweeps.
- ☑ doc-aging (§11 retention + §2 caps): the store prune deletes `done/TASK-405` (closed at 119 and cited only in history;
  `1b83b647`). TASK-320 is kept, because an `evals/fixtures/` file cites it and the engine counts that as live. No TD row is due
  (TD-206 at 123). No cap breach.
- ☑ epic coverage (every active epic), the new rule's first promote: EPIC-015 is fully covered. CW5 → 415, CW6 → 423,
  CW7 → 415 (416 done), CW8 → 417.
- ☑ epic rollup currency: EPIC-015 is current (the SPRINT-121 row is closed). ☑ handoff ledger: none.
Size check: both members are M. TASK-417 was in the owner-approved list but is `state: blocked` on 415 and 423, and promote takes
only `ready` tasks, so it is deferred to the promote after both land.

### 2026-10-10 | g2 | G1 + G2 signed (owner); T1 stop signal and rank ruled, T2 reads CW5's finding as a named-check FAIL
Recon before G2. A2 (Read of `scripts/night-run.sh`) is **half-refuted**: the watchdog stall-kill (night-run.md Part 3) SIGTERMs
`claude -p`, which exits 143, so an exit status cannot mark a human stop. The wrapper the launcher prints as `pid=` (`night-run.sh:853`,
an inline `sh -c`) has no trap: killing it orphans the run with no exit file and no rollup. A1 (Explore) is **partial**: the overnight
path reviews and continues, but ADR-022:35-41 admits an unattended retry only on a done-when-named check FAIL under a granting
`repair-policy`, and a critic-judgment finding always parks. No unattended run has a repair cycle on record (SPRINT-119 `repair-cycles · 0`).
G1: T1 got the full checklist (`origin: manual`); T2's fast-path does not apply because A1 changed its scope. Rulings (one popup):
- **T1 stop signal: wrapper trap only.** INT/TERM/HUP caught by the wrapper → USER_STOP. A bare child exit of 130/143 stays HARD_FAILURE.
- **T1 rank: below the integrity fails.** A member-count error or a revise-ceiling breach still reports HARD_FAILURE; USER_STOP outranks
  a non-zero exit, stalled/denied-tool, unattempted and parks.
- **T1 design:** the inline wrapper becomes an internal `--wrap` subcommand (as `--reap` is), so a fixture drives the real code. The trap
  records a stop marker, forwards the signal, waits for the child, then reaps. Verify: DoD1 by new `--wrap` cases in
  `evals/run-reap-terminal-fixtures.sh` plus `check-night-run-rollup` on the produced log; DoD2 by seeded breaks (trap removed → the
  case reddens; exit-3 and a direct child TERM stay HARD_FAILURE as controls); DoD3 and DoD4 are judgment ticks with file:line.
  Consequential Tier G, so a worktree-isolated Codex review.
- **T2: seed a named-check FAIL.** The J1 task's done-when names a check that FAILs on its first build, and `repair-policy` grants
  ADR-022's carve-out. The vehicle's details and its ten-dimension envelope come to the owner after T1 lands.

### 2026-10-10 | scope-change | T1 DoD1 narrowed to a wrapper-caught signal; T1 Layers gain night-run.md
What broke: TASK-423 DoD1 counts "the wrapped run being stopped by the user" as USER_STOP, and its Assumes names exit 130/143. The
watchdog's stall-kill produces the same 143, so that half cannot be told apart from a stall (owner ruling above). Impact: DoD1 now
reads a signal received by the launcher's wrapper; a direct kill of the child stays HARD_FAILURE and becomes DoD2's second control.
T1 `Layers:` gain `skills/orchestrator/references/night-run.md`, because adopters need Part 3/4 to say which pid to stop for a
USER_STOP (consumer side, L-015). G2 is re-confirmed by the same popup.

### 2026-10-10 | scope-change | T2 CW5 "critic finding" is proven as a done-when-named check FAIL (ADR-022)
What broke: TASK-415 DoD1 seeds "a review ... to return one concrete finding". Under ADR-022:35-36 a judgment finding always parks,
so that seed could prove only the park path, never a repair. Impact: DoD1 and DoD2 now seed a done-when-named check FAIL under a
`repair-policy` that grants the carve-out. CW5's text is unchanged, and its tick will name this reading. ADR-022 is unchanged.
G2 is re-confirmed by the same popup.

### 2026-10-10 | dispatch | T1 (TASK-423) to a Sonnet builder in the main tree (single wave; T2 depends on it)
consequence · T1 · behaviour: changes how the launcher derives the terminal state (a new USER_STOP path) · governance: workflow
contract (night-run.md Part 3/4, read by every adopter firing a run) → material, Consequential Tier G: scoped Sonnet review, then a
worktree-isolated Codex review that seeds breaks. Preflight: one task in the wave, no cycle, no shared file (D1 orders the epic file).

### 2026-10-10 | progress | T1 built (`eae1c1b0`); coordinator re-ran the reaper fixtures green; two isolated reviews dispatched
Builder (Sonnet): the inline wrapper became `night-run.sh --wrap` (`wrap()` :450-488, fire site :903-905). reap() reads `<log>.stop`
(:317) and ranks it (:343-348). The `die_doa` comment is corrected (:312-316), and night-run.md's USER_STOP row and Part 3 say which
pid to stop. Red before: against the old wrapper body, wrapper-term-is-user-stop and ceiling-breach-outranks-stop FAILed while both
controls PASSed. Green after, re-run by the coordinator as its own call: `REAP-TERMINAL FIXTURES: all green`, all four new cases PASS.
**Empirical finding (Windows Git Bash, launched the way the fire site launches it):** TERM is caught; INT, HUP and QUIT are ignored on
entry (nohup plus an async start) and never reach the trap, so the wrapper stays alive. Only TERM is a working user stop.
Reviews: (1) a worktree-isolated Sonnet seeding campaign, six seeds including S6, the fire-site wiring; (2) a static Codex review,
items C1-C7. Round 1 of at most 2.

### 2026-10-10 | review | T1 round 1: seeding found three untested claims; both reviewers found the race and the exit-status overclaim
Seeding (worktree-isolated, every seed restored to `6b1312eb` by `git hash-object` == `git rev-parse HEAD:`): S1 trap removed, S2
marker ignored, S3 rank swapped, S5 forward removed: each reddens its claim-bearing case while the controls stay green. **Nothing
reddens** under S4 (re-wait loop removed), S6 (fire site reverted to the old trap-free inline wrapper, a wiring gap: the one
full-launcher harness fires `true`) or S7 (member-count rank removed). Codex (static, per-item): C4 fire-site args, C5 rank order and
C7 night-run.md wording OK; C1 race FINDING (a TERM before `wr_child=$!` forwards nothing); C2 FINDING (the exit file can hold the
interrupted wait's 143); C3 stale marker and C6 guard accepts an unbacked USER_STOP → **TD-247** (zero census, outside T1's Layers).
Fix round 1 to the same builder: F1 race, F2 exit status, plus fixtures G1 (S4), G2 (S6, real launcher), G3 (S7). Stop rule: one
re-review (re-seed S4/S6/S7, Codex round 2 on the fix diff), then the owner.
Spend so far on T1: build ~103k, seeding ~80k, Codex ~20k subagent tokens.

### 2026-10-10 | review | T1 round 2 (final): the three uncaught seeds now redden; Codex R2 comment narrowed, R4 refuted by reading
Fix round (`9f70412e`): F1 forwards a stop caught before `wr_child=$!`; F2 recovers the child's status after a stop; new cases G1
`stop-keeps-child-exit-status`, G2 `fire-site-wrapper-catches-term` (the real launcher, its printed pid TERMed), G3
`stop-plus-unresolved-member-is-hard-failure`. Coordinator's own run: `REAP-TERMINAL FIXTURES: all green`.
Re-seed, done by the coordinator in a scratch worktree at `9f70412e`, one seed at a time: S4 (loop and F2 recovery both removed, -2
lines) reddens only G1 (`exit file holds '143', wanted 7`); S6 (fire site reverted to a trap-free `nohup sh -c`) reddens only G2
(`stop marker=''`); S7 (member-count branch → `if false`) reddens only G3 (got USER_STOP). Every other case stays green. Restore:
`git hash-object` == `git rev-parse HEAD:` (`2b524f7a`), and the worktree was removed.
Codex round 2: R1 race closed OK; R3 no-stop path unchanged OK; R2 FINDING, a residual window remains (a TERM landing as `wait`
reaps the child leaves 128+n) → comment narrowed (`663d9a5c`); the terminal is unaffected, because the marker decides it. R4
FINDING refuted by reading: G1's comparison is quoted (:200), and G2 runs in a fresh mktemp case directory where only the trap writes
the marker (:238-252). Stop rule reached: no third round.
Spend on T1: build ~103k + fix ~139k, seeding ~80k, Codex ~38k ≈ 360k subagent tokens.
