---
owner: Maintainer
last_updated: 2026-11-15
update_trigger: coordinator.md sections or TASK-664 inputs change
status: current
---

# TASK-664 — replay of the real bloodlines run against `skills/orchestrator/references/coordinator.md`

Input: `inputs.md` (same folder; the two 11-14T14:22 briefs are whole, no `…[+N]` cut on them). Reference: the 7 sections of
`coordinator.md`. Result: **0 gaps**. Every in-scope requirement maps to a reference section or named existing coverage.
Two real-run deviations from the reference are recorded in §2 and §3. They show the reference catches them; they are not gaps.

## 1. Message type to outcome

| Message (inputs.md) | Outcome | Basis |
|---|---|---|
| 14:22 lane briefs (stream, sprint, worktree, branch@sha, /prime then /orchestrator, uncommitted inventory, report) | coordinator.md § 2 "Launching a lane" | brief shape, field by field in §2 below |
| 14:22 brief, gate status | coordinator.md § 2 (gate-status field); the real briefs had none | recorded difference |
| 14:22 brief, "Cross-stream rules": shared touring files, send diff before commit | coordinator.md § 6 "Shared files across lanes" | |
| 14:22 brief, builder worktrees created from sprint HEAD, check base | existing coverage: `skills/orchestrator/references/dispatch.md` § Pre-dispatch preflight (base-ref) and the worktree-base guard in § Worktree dispatch protocol | not a coordinator concern |
| 14:22 brief, phone and Gradle serial, ask before any phone or Patrol run | owner-ruled exclusion: learning-only, L-317 (intake popup 2026-11-15, Q2 "6 procedure, 2 learnings (Recommended)", TASK-662 § Tracker) | physical slots |
| 14:22 brief, host tests only with >3 GB free RAM | owner-ruled exclusion: physical slots are learning-only (intake popup 2026-11-15 Q2, filed as L-317 "one lock-holder, slots in order, handover by message"); the RAM gate is one such slot | the specific threshold is adopter detail and stays out of the reference |
| 14:22 brief, web-owned questions go to the web session | coordinator.md § 1 "When this applies" (multi-repo work: one session per repo) and § 4 "Relayed rulings and approval" (labelled relay, and a peer message is never approval) | which questions are web-owned is the adopter's call |
| 14:22 brief, "report to me at milestones" | coordinator.md § 2 (the "reply requested" field) | |
| 14:22 brief, task IDs 122-139 belong to the stream | coordinator.md § 7 "Id booking" | TASK range only; see §3 |
| 14:35 (a) approve shared fixture diff, "stage per hunk (`git add -p`)" | coordinator.md § 6 | approve file by file, lane stages per hunk |
| 14:35 (b) phone batched, phone lock, slot order | owner-ruled exclusion: L-317 (Q2 popup, as above) | physical slots |
| 14:42 cherry-pick backed out as a whole-branch merge, "Log ... in your Execution Log" | coordinator.md § 6, last bullet | |
| 14:42 phone "slot 3" | owner-ruled exclusion: L-317 | |
| 14:46 approve `test/member_shell_test.dart` hunks, "Stage only your hunks" | coordinator.md § 6 | the 3-random-order condition is the coordinator's own approval condition, not a requirement |
| 15:05 status check on idle notice (x2) | coordinator.md § 3 "Status check" | 3 lines: done / waiting on / next |
| 09:23 lane proposes a range, coordinator "ok 100-119" and a final map | coordinator.md § 7 | see §3 note on the lane-proposed range |
| 15:29 id allocation (x2) | coordinator.md § 7 | compared in §3 |
| 02:30 correction, TASK-170 taken, range now 171..199 | coordinator.md § 7 ("a range change is sent as a message and logged") | compared in §3 |
| 15:42 relayed owner rulings to the web session | coordinator.md § 4 "Relayed rulings and approval" | who relayed it: yes. Where the owner gave it: "14 Nov evening" only (see §2 note) |
| 15:42 lost subagent report re-requested | coordinator.md § 5 "Lost reports" | the real message asks for the full report and not to infer it |
| "owner-signed plan stands as the batch G1/G2" (not a message; the design's second learning) | owner-ruled exclusion: L-318 (Q2 popup). The § 2 gate-status field cites a signed gate by its record in any case | |

Gaps: **0 gaps**. No in-scope requirement is uncovered, so no TD is proposed and no synthetic row is added.

## 2. Produced lane brief, by following § 2

Facts from `inputs.md` for the 14:22 brief to mobile-47: stream API; sprint SPRINT-008; worktree `.claude/worktrees/api`;
branch `sprint/008-api-stream-1` @ `3073828`; uncommitted work listed in the message; reply requested = milestones.

> **Stream:** API. **Sprint:** SPRINT-008. **Worktree / branch @ sha:** `.claude/worktrees/api`, `sprint/008-api-stream-1` @ `3073828`.
> Start with `/prime` then `/orchestrator`, working only in the worktree.
> **Uncommitted state:** the TASK-071/072 builder's work: invitations inbox (Terima/Tolak), "Aktivitas" on ride detail,
> "Profil darurat" opening the emergency profile, and tests `ride_activity_ui_test`, `touring_invitations_ui_test`, plus an edit to
> `touring_hub_test`.
> **Gate status:** G1 unsigned, G2 unsigned (no record of either is in the inputs, so none is cited): take your G1/G2 to the owner
> as a popup in your own session.
> **Id ranges:** TD, L and TASK ranges booked for this lane (the §3 allocation).
> **Reply requested:** report to the coordinator at milestones: a task committed, a gate needing the user, or a blocker.

| Field (§ 2) | Real 14:22 brief | Result |
|---|---|---|
| stream | "You own the API stream" | match |
| sprint | "resume SPRINT-008" | match |
| worktree | `.claude/worktrees/api` | match |
| branch @ sha | `sprint/008-api-stream-1 @ 3073828` | match |
| "start with /prime then /orchestrator, working only in the worktree" | "Start with /lean-flow:prime, then /lean-flow:orchestrator, working only in .claude/worktrees/api" | match (plugin-qualified names; the worktree is named explicitly) |
| inventory of uncommitted state | itemised: 4 features and 3 test files, "builder (slot B)" | match |
| gate status | absent | differs: a field the reference adds. The real brief predates the reference, so this is a recorded difference, not a failure. It also does not claim a sign-off the owner did not give. |
| reply requested | "Report to me at milestones: a task committed, a gate needing the user, or a blocker" | match |
| id ranges (§ 7: TD, L, TASK in the brief) | only "Task IDs 122-139 belong to your stream"; no TD or L range | differs: the TD and L ranges came later, in the 15:29 message |
| extra content in the real brief | cause of the death (ENOTFOUND), cross-stream rules, phone and RAM rules, the diff to review, "From: SPRINT-009 coordinator" | not required by § 2; kept as free content. The phone and RAM parts fall under the owner-ruled exclusion (L-317, §1 table). |

The c9 brief (SPRINT-007, `.claude/worktrees/s007`, `sprint/007-converge-wave-2` @ `84d9e09`) has the same shape: all
required fields match; it also lacks gate status, though it cites "design signed at d9aefe3" (a record) for T3; it has no id
range at all, and its reply requested is "send me the fake-backend/fixture diff to approve" plus milestone reports.

Note on § 4: the 15:42 relay names who relayed ("the mobile coordinator") and "14 Nov evening", but not the session or place
where the owner answered. § 4 asks for "where the owner gave it". This is a minor difference: the proposal ("Your proposal
stands") is correctly kept apart from the ruling.

## 3. Produced id allocation, by following § 7

Facts at 15:29: SPRINT-009 (coordinator tree) uses TD up to 017, L up to 015, TASK up to 151. The c9 lane holds the outstanding
booking TD-018..022, L-016..019, TASK-152..153. The touring tasks take TASK-160+ for the coordinator. mobile-47 needs ids for
its SPRINT-008 close. No other lane-tree maxima appear in the inputs.

Max in use (coordinator tree and outstanding bookings): TD 022, L 019, TASK 153; the coordinator's touring work starts at 160.

Produced booking (range size is the coordinator's call):

| Holder | TD | L | TASK |
|---|---|---|---|
| mobile-c9 (outstanding, unchanged) | 018..022 | 016..019 | 152..153 |
| coordinator (touring tasks, bounded) | none booked | none booked | 160..179 |
| mobile-47 (new) | 023..027 | 020..023 | 180..193 |

Invariant check:
- Above max in use: TD 023 > 022; L 020 > 019; TASK 180 > 179, 153 and 151. Pass.
- Disjoint: TD 018..022 / 023..027; L 016..019 / 020..023; TASK 152..153 / 160..179 / 180..193. Pass.

Comparison with the real messages:

| Field | Real | Produced | Result |
|---|---|---|---|
| mobile-47 TD | TD-023..027 | TD-023..027 | match |
| mobile-47 L | L-020..023 | L-020..023 | match |
| mobile-47 TASK | TASK-126..139, "your reserved range" | TASK-180..193 | differs. 126..139 is below the SPRINT-009 max in use (151), so a literal reading of the § 7 invariant fails it. It is a range reserved at 14:22 (122..139 then). Whether it is free is not shown in the inputs, so it cannot be called disjoint from SPRINT-009's used ids. The reference would have required a booking above 153. |
| c9 booking | TD-018..022, L-016..019, TASK-152..153, confirmed "none of these are taken" | unchanged | match |
| touring (coordinator) | TASK-160+ (open-ended) | TASK-160..179 (bounded) | differs. An open-ended "160+" overlaps any lane range above 160, so the invariant's "mutually disjoint" needs a bound. |
| outstanding-bookings statement ("Taken elsewhere: 009 ... c9 ...") | present in the lane message | the lane message carries its own range | match in effect: it lets the lane see what is taken |
| recorded in the brief and the coordinator's log | the brief and 15:29 message carry it; the coordinator's Execution Log is not in the inputs | | not shown (no evidence either way) |

02:30 correction: the coordinator needed TASK-170 and gave mobile-47 "TASK-171..199". Check against § 7: it is a revised
booking above the touring ids it holds (170) and clear of the 15:29 touring "160+" only because the coordinator stopped at
170. It was sent as a message ("the rest of the brief is unchanged"), as § 7 requires; logging is not shown in the inputs. With
the bounded touring range above (160..179), no correction would have been needed. That is an inference, not a measured fact.

09:23 earlier booking (different lanes, mobile-91 and mobile-38): the lane proposed 100..119, the coordinator's "ok 100-119"
and final map made it a booking. It starts above the stated maxima (069 on sprint/006 and 007, 074 on the proposer's tree)
and the map is disjoint (070-074, 100-119, 075-079, 080-099). It matches § 7, except the range came from the lane, not the
coordinator (the coordinator's ok is the booking).

## 4. Summary

1. Brief fields: all but gate status and TD/L ranges match; the real brief predates the reference, so both are recorded differences.
2. Neither real brief claims a G1/G2 sign-off the owner did not give. The reference makes the gate-status field explicit.
3. Allocation: TD and L ranges for mobile-47 and the c9 booking match the produced booking.
4. Allocation differences: TASK-126..139 sat below the max in use (151), and the touring range was open-ended; § 7 asks for a bound.
5. 0 gaps; physical slots and the signed-plan rule are owner-ruled exclusions (L-317, L-318).
