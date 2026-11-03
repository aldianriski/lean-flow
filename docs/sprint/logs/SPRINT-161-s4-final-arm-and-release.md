---
sprint: 161
slug: s4-final-arm-and-release
owner: Maintainer
last_updated: 2026-11-03
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-161 — Execution Log

> Append-only companion to [`../SPRINT-161-s4-final-arm-and-release.md`](../SPRINT-161-s4-final-arm-and-release.md). Uncapped by
> design: this file grows with the work done, which is exactly why it is not inside the Plan's 400-line budget (STANDARD §9 ·
> ADR-014). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry carrying the signed
> governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a `scope-change` entry — what broke ·
> impact · re-confirm G2 — **before** § Plan is edited. Its heading names every `Tn` it changes, and every path the entry names
> sits in one of those tasks' `Layers:` or `Cites:`.

### 2026-11-03 | promote | plan locked, governance signed, three members: S3's residual, the Final arm, the release
Promote governance checklist, signed by the owner by popup:
- ☑ L-promotion: none due (L-285 at count 1; L-251 and L-261 already promoted).
- ☑ TD aging: 107 rows, 106 open (TD-289 new) and 1 resolved; none `high` (63 low, 24 minor, 15 medium, 5 trivial).
- ☑ doc-aging, §11: nothing due (no release since SPRINT-159). ☑ doc-aging, §2: no breach (`check-doc-caps`).
- ☑ epic rollup currency: EPIC-023 current (`check-epic-archive.ts` PASS). ☑ epic coverage: S3 → TASK-597; S4's arrow moves from
  `next slice` to TASK-598, TASK-599 in this commit. ☑ roadmap: none. ☑ handoff ledger: none.
Composition by owner popup (2026-11-03): TASK-597 (ready), TASK-598 (ready) and TASK-599 (blocked on TASK-598, joining with its
blocker); stream s4-release (new). Sizes S, M, M; no `L`. TASK-598 and TASK-599 came from `/task-decomposer --epic` the same day,
intake rulings R1 (add-one admission) and R2 (S1 measured on A1's docs), draft reviewed by Codex in two rounds, CLEAR.
Status moves in `6fdf5463`.
promote-check: 10 pass, 0 fail (T1 cites the A/B repo's business-notes file, as at SPRINT-160).

### 2026-11-03 | gate | G1 signed for T1-T3, G2 for T1, by owner popup; T2 and T3 take their G2 when reached
G1: T1 (`origin: manual`) took the full checklist: size S, files as in its `Layers:`, out of scope as § Scope says. T2 and T3
(`origin: decomposer`) fast-path: scope unchanged since intake approval. T1's Assume (cancel if the release arm shows no missed
source) lapses: D3 pins Final after T1, so T1 lands first.
G2 T1: line 48 of `skills/orchestrator/SKILL.md` replaced in place: the design finds each business-facts source (the profile's
pointer, requirements and business-notes files) by file name in any case, not by content, and calls one absent only if no name
matches; it reads every fact and quotes the line of each fact the change touches. 400 characters, still 140 lines. The CHANGELOG
line-20 bullet gains the clause. Evidence: two development runs of self-onboarding-guard on a pinned clone of the T1 commit, after a
no-spend preflight; pass = each opens `BUSINESS-NOTES.md` and quotes fact 6; a miss allows one wording revision. Codex read-only
review, at most 2 rounds (D5). T2's and T3's G2 come when each is reached (A1, A2 at T2; A3 at T3).
builder-check · T1 · 0 contradictions · 2 questions · settled: case-insensitive name match folded in ("in any case"); requirements found by name like the rest

### 2026-11-03 | progress | T1 done on real input: both development runs find the sources by name and quote fact 6
Commit `cea7ffb8`: line 48 replaced in place (400 characters, 140 lines, cap and prose-density PASS; the one density FAIL is the
untracked `docs/research/plugin-reference-delta.md`, outside this sprint). CHANGELOG line-20 bullet extended.
Development batch on pin `D:\Research\ab-pins\lean-flow-161-cea7ffb8` (hash `b979ae44…`), research copy `dev156/workdoo`, no-spend
preflight `PREFLIGHT-OK` first (L-285); two single-slot runs in parallel, 2.79 USD, about 5.5 min wall: `iso-9C9f3P` and
`iso-BfZSjn`, both `ok` and passed, 0 deletes, 0 denials. Each ran a mixed-case file-name Glob
(`**/*{requirement,business,REQUIREMENT,BUSINESS,…}*`), read `BUSINESS-NOTES.md` and quoted fact 6 verbatim ("The intake creator
is initially available for all three preparation responsibilities"). No wording revision needed. Ticked; `done/`.
consequence · T1 · behaviour:material · governance:low
review · T1 · scoped outside review (Codex, read-only, 1 round, CLEAR, 6.8k tokens) · behaviour:material · governance:low

### 2026-11-03 | gate | T2 G2 and Amendment 9 signed by owner popup; freeze lines written; pilots launched
G2 rulings (popup, before the draft): Final against A1 by non-inferiority (lower end above -0.05, no symptom below -0.05), the gain
over A1 reported only; S1 decided by the pooled point difference Final minus Final-on-A1 >= -0.05; A2 confirmed (Final = A4b's 32
slots renamed, then the 16 trial-3 slots appended; Final-on-A1 = A4b's order on A1's snapshots); run plan: both pilots, one owner
review, then the two arms chained at two workers. A1 confirmed: all four frozen snapshots (A1 and A2, both repos) match their
manifests (no-spend preflight).
Build `aa678cc1`, `bd524775`: four arms on pin `cea7ffb8` (each `PREFLIGHT-OK`), `schedule-final.json` 48 and
`schedule-final-a1.json` 32 (pilot N = 2 each), two logs, `hash-prereg.ts` pins them. Harness fix found while drafting: `lfDocsOf`
matched only `-a<digits>` arm ids, so A4a's and A4b's judges kept lean-flow docs in context; kept streams show no A4b trial wrote a
listed doc (Write/Edit none of 239; the 5 shell commands naming one are reads). Fixed; selftest S37 fails on the old parser (must-FAIL)
and passes on the new, 82 of 82. Disclosed as Amendment 9 item 10.
Codex R1 (read-only, 16.0k tokens): CLEAR; one Med (item 10 checked Write/Edit only), fixed by the shell-command check.
builder-check · T2 · via Codex R1 · 0 contradictions · 0 owner questions
Signed: `evals/ab/PREREGISTRATION.md` sha256 `77334de9…` at `bd524775`; freeze lines 2026-11-03T03:17:08Z in both logs (`FREEZE-OK`).

### 2026-11-03 | progress | T2 pilots approved by owner popup; the two arms launched as one detached chain
Pilots (2 slots each, at two workers, driver exit 10 both): Final workdoo access-activity-type-filter #1 and clinic
appointment-lookup #1; Final-on-A1 the same slots. All `ok`, graders pass, 0 parks, pin `cea7ffb8`; cost 1.45-1.85 USD a slot
(A4b's same slots 1.35-1.67), pilot spend 6.74 USD. Judges: Final-on-A1 all PASS; Final two UNKNOWN, both ordinary under the frozen
rules: an unparseable convention reply (appointment-lookup) and a business judge that could not see the event-type sources
(access-activity-type-filter; that slot is not-passed; the same task drew a business UNKNOWN in TASK-586's capacity check).
Launched detached (`chain.ps1`): Final's remaining 46 slots, then, only on its exit 0, Final-on-A1's 30; about 3 h, about 120 USD;
an exit watcher notifies. No clinic development trial runs beside it (D4, TD-289).

### 2026-11-03 | scope-change | T2: arm Final cut to k = 2 by Amendment 10; release-arm policy D19; TASK-600 filed
What broke: the owner asked whether a 3-hour release arm is normal; a Codex process review (7.8k tokens) found the k = 3 third
trial answered no question declared in advance (about 38 min, 27 USD), while Final-on-A1 alone decides S1 and stays.
Impact: TASK-598 box 1's "k = 3" is superseded by Amendment 10 (owner-signed popup; Codex R1 CLEAR, 7.2k tokens, one Low: fill
the slot count, done). Applied with 9 of Final's slots scored and none of trial 3 started: the amendment's hash change made the
driver refuse its next slot, the running trials finished and recorded, the driver exited 2, and both logs were re-frozen
(2026-11-03T03:53:04Z, sha256 `633c4c09…` at `1e4c5af8`) carrying over the rows since Amendment 9's freeze; build-slots counts
the 9 rows against the 32-slot schedule. Chain relaunched 10:53 local; about 2 h left, ending about 12:55.
EPIC-023 D18 (stacked add-one admission, intake R1) and D19 (release-arm policy: one 32-slot final-stack arm at two workers, only
for `/orchestrator` or gate behaviour changes; isolation arms and k = 3 only when declared decision-relevant) recorded. TASK-600
(backlog; serialise clinic DB provisioning, re-check N = 3; TD-289) filed. Re-confirm G2: owner signed Amendment 10.

### 2026-11-03 | scope-change | T2: Layers widened to the reference-delta research note and the knowledge index
What broke: the owner's untracked `docs/research/plugin-reference-delta.md` (pstack, ECC, Helix against lean-flow's surface) failed
two gate legs (prose density: 11 lines over 400 characters; layers observed: undeclared). T2's close-out of S3 (TASK-598 box 4:
S3a/b/c recorded as not built, deferred roles checked) cites it, as the owner asked for the role-agent ruling to weigh ECC.
Impact: T2's `Layers:` gains `docs/research/plugin-reference-delta.md` and `docs/knowledge-index.md` (regenerated for the note).
The note's 11 long paragraphs are wrapped at 130 characters with the word sequence asserted unchanged; density PASS. No DoD
changes. Re-confirm G2: owner chose this work by popup (option D).

### 2026-11-03 | gate | T2 rulings (Amendment 9 item 7, Final at k = 2): Final passes; bundles 1, 2 and S1 ship; bundle 3 ruled out
Both arms VALID on their own 32 slots, 0 infra-lost, 0 parks; Final-on-A1 resumed once after a usage-limit stop (attempt voided,
`void: usage-limit`, slot re-run). Reports: scratch `t3/out/vs-{A2,A1,A4B,FINAL-A1}.md`.
- 7a Final vs A2: 96.9% vs 78.1%, +18.8 [6.3, 31.3], no symptom regression. Pass.
- 7b Final vs A1: +15.6 [1.0, 31.3] (lower end above -5), no symptom regression. Pass.
- 7c above A0 (89.6%), cost 0.73x A1. **Final passes.** 7d: bundles 1 and 2 ship (D15, D17).
- 7e bundle 3 with TASK-597 vs A4B: +3.1 [-6.3, 15.6], convention -11.5 (Final 80.8% vs A4b 92.3%: three duplicated-logic FAILs,
  two judge UNKNOWNs). Lower end and a symptom fail: **ruled out**. Its target held (invitation-issued-by business PASS in both
  trials, FAIL in both A4b trials); Final-on-A1, the same pin, also sits below A4b on convention (84.6%). Item 9 secondary
  (13 untouched tasks): -3.8, not reached since 7e failed. Exposure (item 3): 0 slots.
- 7f S1: Final minus Final-on-A1 = -3.1 (point, >= -5): **S1 ships**. Final-on-A1 scored 100.0%.
Owner ruling (popup), strict: revert bundle 3 and TASK-597 off `main`, then one further 32-slot arm on the exact release set
(Amendment 11) before any release. Spend: Final and Final-on-A1 about 105 USD including pilots.
consequence · T2 · behaviour:material · governance:high
