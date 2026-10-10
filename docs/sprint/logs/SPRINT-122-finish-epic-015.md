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

### 2026-10-10 | scope-change | T1 DoD1 narrowed again: only TERM is a user stop (owner ruling, popup)
What broke: DoD1 named INT/TERM/HUP received by the wrapper. Measured at build: INT and HUP are ignored on entry to a shell started
under nohup and as an async command, so they never reach the trap and the run continues (POSIX; same on Linux). Nothing is
misreported, because an ignored signal stops nothing. Impact: DoD1 reads "a TERM received by the launcher's wrapper"; night-run.md
already tells operators to use TERM. Rejected: keeping INT/HUP with a TD, or building a launch helper that resets ignored signals
(new Tier G machinery, ~200k tokens). G2 is unaffected.

### 2026-10-10 | progress | T1 (TASK-423) 4 of 4 ticked; EPIC-015 CW6 ticked
DoD1 ✓ `wrapper-term-is-user-stop` + the real-launcher `fire-site-wrapper-catches-term`. DoD2 ✓ the must-FAIL against the old wrapper,
two controls, and seeds S1-S7 each reddening their own case. DoD3 ✓ `night-run.sh:312-316`. DoD4 ✓ CW6 ticked with terminals
:344-368 and fields :424-430. TD-247 is named on the tick and does not block it: CW6 is about emission, and TD-247 is about trusting
a USER_STOP claim. Next: T2 (TASK-415), whose vehicle sprint and envelope come to the owner first.

### 2026-10-10 | g2 | T2 vehicle rulings signed (owner, one popup); TASK-415's J2 re-scoped to a judgment park met mid-run
Recon: TASK-415 DoD1 asked for "one seeded J2 task", but pre-flight item 3 refuses any Plan with a declared J2 (`night-run.md:297`,
TD-109, ruled STRICT by SPRINT-093 D3). night-run.md:73-75 names the J2 shape a run parks: one met mid-run, first example "a revise-loop
judgment finding". `check-prose-density.ts` covers sprint files and no task file or log (proseFiles census on this tree), so a
seeded over-400 line must land in the vehicle sprint file. Rulings (L-220, the STRICT ruling named in the option):
- **J2 control:** a second J1 task whose review is seeded to return a judgment finding; ADR-022 parks it. STRICT is unchanged.
- **Seed:** vehicle T1's brief supplies a Files Changed row over 400 characters; its done-when names `check-prose-density.ts`; one
  ADR-022 retry shortens it; the re-check PASSes.
- **Host and budget:** the VPS `~/lf-run`, results back by git bundle, nothing pushed, $10 / 60 min.
- **Fire:** the coordinator fires via ssh once pre-flight is green, under the same delegation as SPRINT-118.
consequence · T2 · behaviour: material (a live unattended run on the autonomy machinery) · governance: high (the epic's proof
criteria) → scoped review of the vehicle before the envelope is signed; claims are verified against artifacts after the run.

### 2026-10-10 | scope-change | TASK-415 DoD1/DoD2: "a seeded J2 task" becomes a seeded judgment park met mid-run
What broke: a declared J2 task makes the vehicle unlaunchable (pre-flight item 3, STRICT). Impact: DoD1 seeds a second J1 task whose
review returns a judgment finding; DoD2 reads "the seeded judgment finding parks". CW7's "J2 park or seeded control" and D5's "seed
it" are both still met. G2 is re-confirmed by the popup above.

### 2026-10-10 | scope-change | T1 and T2 Layers gain their member files at both locations (layers-observed, the SPRINT-118 route)
What broke: `check-layers-observed.ts` FAILed on SPRINT-122. The coordinator's move commits `d6206ba1` (`sprint(122) T1:`) and
`4c005190` (`sprint(122) T2:`) touch TASK-423 and TASK-415's member files, which neither block declared. Rewording them would rewrite
every later commit, including SPRINT-123's `838e714` pins, so each block now declares its member file at `todo/` and `in_progress/`.
That is accurate: those commits did touch them. Also, TASK-423's DoD4 evidence now names `scripts/night-run.sh` by full path
(promote-check's member-layers rule matched the bare basename). Re-run: layers-observed PASS (base d399167), promote-check
`7 pass, 0 fail`. Coordinator rule from here: member tick and move commits use the bare `sprint(122):` subject. G2 is unaffected.

### 2026-10-10 | progress | vehicle SPRINT-123 promoted and pinned (`838e714`, pins `3ccc41d6`); VPS pre-flight next
Two J1 members (TASK-424 seeded named-check FAIL · TASK-425 seeded judgment park). Seed reachability was proven both ways before
promote (see SPRINT-123's log). Envelope `PASS (all 10 dimensions covered, pinned @ 838e714)`. Next: the `~/lf-run` clone at the
local tip, the allowlist probe with a must-deny control, the pre-flight gate, a pre-run review of the trigger, then the fire.

### 2026-10-10 | progress | VPS pre-flight: probe allowed the run's commands and denied the control; gate `286 pass, 2 fail`, both mine, fixed
`~/lf-run` was fetched to `9e7ef270` by bundle (no remote; tree clean; `bun install` no changes). The clone-local allowlist gains
`check-prose-density.ts` and `ps` (backup `~/settings.local.json.bak-run123`). Probe: see SPRINT-123's scope-change (the literal
`ps -eo` form is ALLOWED, `touch` is DENIED). Gate `QA_BUDGET_SECONDS=1200 sh scripts/qa-check.sh`: `QA-CHECK: 286 pass, 2 fail`. Both are
`scope-change-outside-layers` FAILs from this session's own log entries: they name `check-layers-observed.ts`, `todo/` and `in_progress/`
(SPRINT-122) and `check-authority.ts` (SPRINT-123), none of which was on its task's Layers or Cites. Each is now on a `Cites:` line,
because each is read and not edited (log entries stay append-only). Local re-run: `check-sprint-by-reference --scope-change` 4/0 on both
sprints, and promote-check 7/0 on both.

### 2026-10-10 | progress | T2 fired: vehicle run AUTHORITY_BOUNDARY, 1 repair, 1 park; merged `29cefb66`; every claim checked against artifacts
**Fire (J2, owner-delegated):** `~/lf-run` at `eed60569`; launcher pre-flight gate `QA-CHECK: 288 pass, 0 fail`; `run mode: overnight` ·
`fired detached: pid=1390349` · `ALIVE` · rc 0. Run: exit 0 · `subtype=success` · **$1.32** · 26 turns · **0 permission denials** · about
3 min. Seven commits (six by the run, all bare `sprint(123):`; one for the reaper's block), bundled back and fast-forwarded. Nothing pushed.
**Verified against artifacts, not the run's report (SPRINT-123 log line numbers):**
- **Fired line:** l.79 `fired · 2026-10-10T10:05:33Z · overnight`.
- **Live wrapper (SPRINT-122 T1 on real input):** TASK-424 transcribes ancestor `1390349 1 sh scripts/night-run.sh --wrap …`, the same pid
  the launcher printed.
- **Finding → repair → re-check (CW5):** l.94 `prose-density: 29 pass, 1 fail`; l.96 `29 pass, 0 fail`; l.97
  `T1 · retry · standards: prose-density Change cell 493 > 400 chars → fixed`, column 0; repair commit `86672c57`. Exactly one retry.
- **Park (D5 control):** l.106 `T2 · parked-hitl · reviewer FINDING "the draft must name the option lean-flow adopts" is a judgment
  (ADR-022, no retry) · unblock: the owner … picks A or B for TD-247`; reviewer `review · T2 · scoped-reviewer`; commit `b56272b5`.
- **Reaper block:** `run · 3 of 4 DoD ticked` · `outcome · PARTIAL` · `terminal · AUTHORITY_BOUNDARY` · `repair-cycles · 1` · `parks · 1`.
- Guards: layers-observed PASS (base 838e714) · by-reference `--scope-change` 4/0 · prose-density 29/0 · authority all J1.
**One named check FAILs:** `check-night-run-rollup.ts` on the log: "claims terminal · AUTHORITY_BOUNDARY but carries no 'Tn · parked-hitl ·'
… line". The guard reads only the LAST `run-complete` block (`check-night-run-rollup.ts:107-120, 176`), and the reaper copies only
`unattempted` lines into it (`night-run.sh:432-447`, "a task the run DID report as … parked … already has its line and is left alone").
That contradicts ADR-016 / Part 4 / SKILL.md step 5 (a park is one line *inside* the rollup block). So every reaped AUTHORITY_BOUNDARY
FAILs, and the gate (`qa-check.sh:528-545`) is red on SPRINT-123's log. This is the first reaped AUTHORITY_BOUNDARY since the guard was
windowed (census: SPRINT-088, SPRINT-090 and SPRINT-123 carry one; only 123 postdates SPRINT-093), and no fixture covers it. L-181's shape
(producer and consumer read different windows) again. **Owner ruling (popup): fix the reaper now.**

### 2026-10-10 | scope-change | T2 gains the reaper fix: the launcher's block carries every non-green task line (ADR-016)
What broke: TASK-415 DoD3 ("the rollup guard PASSes on the committed log") cannot pass, because the producer omits what the contract
requires. Impact: T2 `Layers:` gain `scripts/night-run.sh` · `evals/run-reap-terminal-fixtures.sh` · `evals/fixtures/night-run-reaper/`.
Consequential Tier G (D4): a must-FAIL fixture plus a sibling control, seeded breaks, and a worktree-isolated outside review (Codex).
After the fix, SPRINT-123's log is re-reaped ONCE with the fixed launcher, using the run's own `--reap` arguments (from the transcribed
wrapper line). It is appended, not edited, and logged as a re-reap; DoD3's guard verdict is read on that. G2 is re-confirmed by the popup.

### 2026-10-10 | progress | T2 reaper fix built (`27d75a78`) after one coordinator-caught regression; two isolated reviews dispatched
Builder (Sonnet), round 1: the block copies the run's own non-green lines; counters read a window that cuts earlier reaper entries.
**Coordinator catch before review:** the cut matched ANY `| run-complete |` header, but a census of docs/sprint gives 10 run-complete
headers, 8 of them model- or coordinator-written (e.g. SPRINT-090 l.249 "T1 executed, T2 parked"). A run whose only park line sits in
its own run-complete entry would have read BUDGET_STOP. Round 2: the cut matches only the reaper's exact header, now one shared variable
for writer and cut (`night-run.sh:196`, :329, :434). New must-FAIL M2 (`block-keeps-model-runcomplete`) is red under the broad cut and
green after. C3 (`block-recount`) is red with the cut removed (`parks · 2`) and green with it. Dry run on a temp copy of SPRINT-123 (base
79): the block carries `T2 · parked-hitl · …`, and the guard prints `PASS … agrees with its per-task lines`. Coordinator re-run as its own
call: `REAP-TERMINAL FIXTURES: all green`, all six new cases PASS. Reviews: a worktree seeding campaign (S1-S6) and a static Codex pass
(K1-K5, round 1 of at most 2). Spend on the fix so far: builder ~192k subagent tokens.

### 2026-10-10 | review | T2 reaper fix round 1: seeding finds the copy's other states uncovered; Codex K1 a real window mismatch; one fix round
Seeding (worktree-isolated at `27d75a78`; every seed restored to `98920c96` by hash): S1 (copy removed) reddens M1 and M2; S2 (copy from the
unstripped window) reddens C2b; S3 (whole file) reddens C2a and C2b; S4 (cut any run-complete) reddens M2; S5 (no cut) reddens C3 (`parks · 2`).
**S6 (drop `blocked` from the copy regex) reddens nothing**: only `parked-hitl` has a copy fixture. Siblings rollup, outcome and ceiling
are all green.
Codex (static, per-item): **K1 FINDING, confirmed**: the counters read fenced lines and the copy strips them, so a park written only inside
a run's own fenced rollup is counted but not copied, and the guard FAILs again. The second half (a copied line contradicting the terminal)
is refuted by reading: the guard's matrix rules only PLAN_EXHAUSTED, AUTHORITY_BOUNDARY and BUDGET_STOP, and reap()'s order keeps them
consistent. **K2 FINDING**: the header cut is a substring match → anchor it to the end. **K3 refuted**: `check_revise_ceiling` strips fences
(`night-run.sh:153-155`), and retry lines are never copied. **K4 refuted**: on a re-reap the old code read its own earlier `unattempted`
copies as "reached"; excluding them corrects it. K5 OK.
Fix round 2 (final): copy exactly what was counted (dedupe); C2b inverts to `block-copies-counted-fenced-park`; anchor the header; new
fixtures for `blocked` and `stalled`/`denied-tool`. Stop rule: then Codex round 2 on that diff only, and the owner.
Spend: seeding ~68k, Codex ~20k.

### 2026-10-10 | review | T2 reaper fix round 2 (final): Codex R1 OK; R2 CRLF fixed inline and proven on Linux; R3 moot; R4 covered
Fix round (`39787db8`): the copy reads what was counted (deduped); the header cut is end-anchored; fixtures for blocked and
stalled/denied-tool, each red under its own dropped alternative. Codex round 2: **R1 OK** (K1 closed). **R2 FINDING**: a CRLF or
trailing-space header defeats the end anchor → fixed inline (`dc490880`; one line plus `block-recount-crlf`, a deterministic
change proven by its fixture, past the review stop rule). Measured: MSYS gawk drops the CR itself, so the case cannot discriminate
on this host. On the VPS (GNU Awk 5.2.1) the seed (strip removed, landing confirmed `found 1` and `1 file changed`) reddens ONLY
`block-recount-crlf` (`parks · 2`) while `block-recount` stays green; restored by hash `d7182bec`. Two earlier seed attempts did not
land (sed/heredoc escaping) and were caught by the landing check, not read as green. **R3 moot**: the guard never reads `parks ·`.
**R4 covered**: each new case was shown red under its own break. Spend on the T2 reaper fix: builder ~205k, seeding ~68k, Codex ~39k.

### 2026-10-10 | progress | T2 (TASK-415) 4 of 4 ticked: re-reap guard PASS; EPIC-015 CW5 and CW7 ticked; TD-248 filed
**Re-reap (once, on the VPS, fixed launcher `dc490880`):** `sh scripts/night-run.sh --reap /home/ubuntu/run123.log /home/ubuntu/lf-run
1791626733 79 docs/sprint/SPRINT-123-repair-and-park-vehicle.md` → reap_rc 0. It appended a second launcher block, leaving the first
in place: `run · 3 of 4` · `AUTHORITY_BOUNDARY` · `parks · 1` (the earlier block in the window is not recounted) · `repair-cycles · 1` ·
the copied `T2 · parked-hitl · …` line. Its calibration wall reads `67 min` because it is measured to the re-reap. The run's real wall
is the first block's `3 min`. Committed `d4b726db`, bundled back, fast-forwarded. **Guard:** `check-night-run-rollup.ts` →
`PASS … agrees with its per-task lines`, on the VPS and on this Windows CRLF checkout.
TASK-415: DoD1-4 ✓. CW5 ✓ (with the owner's G2 reading of "critic finding"). CW7 ✓ (Dogfood 1 SPRINT-121, Dogfood 2 SPRINT-123).
EPIC-015 has one open condition left: CW8, the freeze re-arm (TASK-417, which was blocked on 415 and 423, both now done).
**TD-248** (id derived: ledger max 247; nothing cites 248 or 249): `check-layers-observed.ts` attributes `sprint(NNN) Tn:` to Tn for any
NNN, so SPRINT-122 T2's reaper commits FAIL SPRINT-123's leg. It leaves the gate when SPRINT-123 is archived at close; the owner
rules on the close-time override.

### 2026-10-10 | system-verify | QA_FULL on the VPS at `cc965c3b`: `QA-CHECK: 301 pass, 0 fail`; TD-248 narrowed
`QA_FULL=1 QA_BUDGET_SECONDS=1200 sh scripts/qa-check.sh` in `~/lf-gate` (detached at the local tip): `QA-CHECK: 301 pass, 0 fail`, rc 0.
The rollup leg PASSes on SPRINT-123. Cross-check of TD-248 (a direct single-file run FAILs, the gate leg PASSes): the gate calls the
checker with every sprint file at once, and it skips sibling sprints' commits (`check-layers-observed.ts:538`). Reproduced locally in
both orders: PASS/PASS. TD-248 is narrowed to the single-file direct run, severity low.
