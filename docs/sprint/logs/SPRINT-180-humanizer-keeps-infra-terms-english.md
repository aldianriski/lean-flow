---
sprint: 180
slug: humanizer-keeps-infra-terms-english
owner: Maintainer
last_updated: 2026-11-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-180 — Execution Log

> Append-only companion to [`../SPRINT-180-humanizer-keeps-infra-terms-english.md`](../SPRINT-180-humanizer-keeps-infra-terms-english.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-16 | promote | plan locked, 1 member: TASK-672 (1 plan step)
Owner rulings, verbatim: "Delete now (Recommended)" (the §11 prune: TASK-659, 660, 663 and 665, closed at least 3 sprints ago with no live citation, deleted in their own commit `86def8bf` before plan locked) · "Sign as shown" (the governance checklist and the sprint draft).
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Sign as shown".
- ☑ L-promotion: none. The handoff's L-306 and L-319 were already promoted at the SPRINT-179 promote (`57d65d5a`). Two selections agree: every `## L-` entry with count 2 or more and `promoted: no` returns none (73 of 305 entries are active, none with count 2 or more); the active entries with two dated sightings (L-314, L-304, L-272) all carry count 1, both sightings in one sprint.
- ☑ TD aging: 120 open rows (76 low, 24 minor, 13 medium, 7 trivial, none high), 119 aged three sprints or more against sprint 180; the one younger row is TD-316 (filed at 178, crosses at the SPRINT-181 promote). A row parse and a `grep -c` both give 120. Nothing escalates. Disposition: keep all open, no re-review sweep.
- ☑ TD deletion, §11: none; no row is `resolved`.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 103 PASS, 0 FAIL, 0 WARN. CHANGELOG rotation not due (v2.24.0 and v2.23.0 inline). LEARNINGS pointer-collapse deferred to the close compaction sweep. §11 task-file prune: 4 files eligible (TASK-659, 660 of SPRINT-174; TASK-663 of SPRINT-176; TASK-665 of SPRINT-177), nothing live cites them (a scan of 929 live `.md` files and a `git grep` with the history paths excluded agree; 93 other closed files are kept because cited); approved and deleted in `86def8bf`. Not eligible by the rule's text: 8 uncited `done/` files with no `sprint:` stamp (TASK-596, 607, 608, 613, 616, 617, 621, 639). Caps at the limit: `.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80, token budget ~12680 of 12691; TASK-672 touches none of them.
- ☑ epic rollup currency: EPIC-025 (rows for SPRINT-172 and SPRINT-173 carry their `close_commit`, header 2026-11-15) and EPIC-026 (row for SPRINT-178 carries `dfd668f7`, header 2026-11-16). None.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`. EPIC-026 has 3 open conditions, all marked `→ next slice: …`. 0 uncovered. TASK-672 advances none of them: no `epic:`, no override.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent).
- ☑ handoff ledger: none live; the latest entry for the one path is `spent`.
Sprint number: 180, the maximum in use plus one. Four selections all gave 179: `git ls-files docs/sprint`, the archive plans, the archive logs, the INDEX lines; `.claude/worktrees/` absent.
Composition: 1 member, size S, no epic, no stream. Commits: filing `2be92fcd`, prune `86def8bf`, status move `40677313`.
Baseline gate (off-host, run by the coordinator on clean HEAD `2be92fcd`, settings inline per L-324):
```
gate-remote: ran 2be92fcd8918dc38ef64c6e3592778f6fe20a1e4
bun test rc: 0
bun test: 638 pass, 0 fail (rc 0)
qa-check rc: 0
qa-check: QA-CHECK: 225 pass, 0 fail (rc 0)
exit 0
```
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.
consequence · T1 · behaviour:low · governance:low

#### Dispatch-trial record (carried verbatim from the coordinator's record)
# Dispatch trial — per-dispatch record (carry into the trial sprint's Log at promote)

Fields (CONTEXT dispatch-trial): role · cell (model+effort) · reported tokens · retries · findings · who ruled them real

| # | Date | Role | Cell | Reported tokens | Retries | Findings | Ruled real by | Fired? |
|---|---|---|---|---|---|---|---|---|
| 1 | 2026-11-16 | intake worker (humanizer calque, round 1) | sonnet · medium | 89,804 (baseline 86.5k → +3.8%; 20% bar not met, under 1.25× cap) | 0 | 0 misses: coverage claims spot-checked (terms-of-art L121, Keep list L138 pindai/unggah, 0 of 6 sampled pairs present) | coordinator | yes (session coordinator read dispatch.md) |
| 2 | 2026-11-16 | intake worker (resume, round 2 → draft) | sonnet · medium | 94,817 cumulative (round delta ≈5.0k) | 0 | 1 miss caught by coordinator review in round 1 output: coverage map omitted the KBBI coinage table (patterns-id L92-119) → counts against the cell | coordinator |
| 3 | 2026-11-16 | intake draft check (strongest tier, blind pair 1 of 2; draft ~10 KB, S task) | fable · high | 103,369 | 0 | 2H 3M 4L. Coordinator verified against repo: H1 real (embedded.md item 3 passes text/voice/format only; item 7 UNAVAILABLE would drop the pass), H2 real (uji fio L58, lapisan L29 in catalog's own after-examples), M1 real (L136 note already exists), M2 real (no v2.24.0 tag); M3, L1-L4 plausible, not yet checked | coordinator | yes |
| 4 | 2026-11-16 | intake draft check (blind pair 2 of 2, comparator) | codex exec · default | 102,781 | 0 | 1H 1M 2L. H1 (kunci boxes contradict: L56 → "dependency" vs L68 control unchanged) real, MISSED by Fable. M (wiring) = Fable H1, shallower. L3 = Fable L1. L4 (tier rationale: L-007 binds all tiers, ADR-029:68) real, minor | coordinator | yes |

Pair 1 verdict (intake draft check): Fable unique real = H2, M1, M2 (+M3 plausible) → cell condition "≥1 real finding the pair missed" MET. Cost 103,369 / 102,781 = 1.006× (cap 2×). Codex unique real = kunci contradiction. Strongest-tier dispatches used: 1 of 6.

| 5 | 2026-11-16 | intake worker (resume, revision 2) | sonnet · medium | 110,830 cumulative (round delta ≈16.0k); intake cell total 110.8k vs baseline 86.5k = 1.28× → OVER the 1.25× cap (note: baseline intake had 3 resumes; this one had 3 too, incl. a 13-finding revision) | 0 | revision answered 13 of 13 findings (coordinator checked the change list) | coordinator | yes |
| 6 | 2026-11-16 | intake draft check round 2 (blind pair 1 of 2) | fable · high | 112,524 | 0 | 0 blocking, 11 G2 notes (N1 di-test unreachable · N2 lapisan · N3 kunci leftover grep vs control · N4 glossary _Avoid_ scope unbounded (consumer) · N5 unconditional CONTEXT read cost · N6 count unexercised · N7-N11 low) | coordinator (pending verify) | yes |
| 7 | 2026-11-16 | intake draft check round 2 (blind pair 2 of 2) | codex exec · default | 102,973 | 0 | 0 blocking, 3 notes: kunci contextual leftover (= Fable N3) · counts unobservable in embedded (= Fable N6) · "no glossary behaves exactly as before" contradicts the global change — real, MISSED by Fable | coordinator | yes |

Pair 2 verdict: Fable unique real = N1 (di-test unreachable, evident in draft L88 vs L55-56), N4 (glossary _Avoid_ scope; coordinator verified CONTEXT.md.template L30-36), N2, N5 → condition MET. Cost 112,524 / 102,973 = 1.09× (cap 2×). Codex unique real = Negative-box contradiction.
Intake draft check cell: 2 samples, both met → eligible for keep at TASK-671 (n=2 minimum). Strongest-tier used: 2 of 6.
Coordinator folded 4 in-draft contradictions (N1, N3, N4, Codex #3) as one-clause fixes into TASK-672-draft-final.md; rest → Assumes as G2 notes. No third review round.

| 8 | 2026-11-16 | intake worker (resume, write after approve) | sonnet · medium | 125,493 cumulative (write delta ≈14.7k); intake cell final 125.5k vs baseline 86.5k = 1.45× (vs baseline's final resume 96k = 1.31×) → over the 1.25× cap either way; note 5 resumes here (2 grill rounds + 2 review revisions folded into one + write) vs baseline's 3 | 0 | 0 misses: 10/10 boxes match the approved draft; only template reshaping | coordinator | yes |

Intake committed 2be92fcd (round count 2 recorded in the message).

Coordinator self-check findings (logged before either reviewer, not shown to them): (a) DoD box 1 carries "rule wording TBD in build" — a passive placeholder in a frozen artifact (CLAUDE.md anti-pattern); reword as "drafted at build, settled at G2". (b) none else.

| 9 | 2026-11-16 | promote worker (scan and draft) | sonnet · medium | 195,905 (baseline 151k → 1.30×, over the 1.25× cap) | 0 | L-306/L-319 stale flag in the handoff (already promoted at `57d65d5a`); 4 §11 prune candidates the SPRINT-179 promote did not report; a stray `=2` file the worker created and removed (a worker slip, not a finding) | coordinator: stale flag real, 4 prune candidates real (owner approved deletion) | yes |
| 10 | 2026-11-16 | promote worker (resume, writes after sign-off) | sonnet · medium | filled by the coordinator at report time | | | | |

Strongest-tier used: 2 of 6.
Coordinator note: baseline off-host gate run by the coordinator, not the worker: LF_GATE_* is not in the worker environment (L-324); the brief said so this time.

### 2026-11-16 | progress | dispatch-trial: row 10 tokens, promote cell total

Row 10 (promote worker, resume, writes after sign-off) reported 210,964 tokens cumulative, so the resume itself took about 15.1k. Retries 0. Findings 0: the coordinator re-ran `promote-check` on its own (`promote-check: PASS -- 4 pass, 0 fail`), and `git status` was clean after b190c6e1.
Promote cell total: 211.0k against the 151k baseline, which is 1.40×, over the 1.25× cap. Strongest-tier used: 2 of 6.

### 2026-11-16 | gate | G1 passed for T1 (TASK-672), fast-path

origin: decomposer, so G1 is one confirm. Owner, verbatim: "Unchanged (Recommended)". The same popup also took three G2 intent rulings, verbatim:
- verb uji: "Compounds only (Recommended)"
- lapis: "'lapis' only (Recommended)"
- bare kunci: "Owner phrase only (Recommended)"
The G2 design draft is in the coordinator's scratchpad until sign-off.
Coordinator's own G2 check, logged before any reviewer saw the design (trial pair for the G2 design check cell):
- (a) 15 candidate rows plus 3 compound rows gives 18 rows, against Q2's "12-15" and box 1's "about 12 to 15". Move the compounds into the one-liner.
- (b) The design does not pin the model for the headless runs. Baseline and after must run on the same model.
- (c) The inline-fallback wiring run is the only non-child proof. The commit-inline path is not run; it reads the same catalog, so the proof holds by construction only.

### 2026-11-16 | progress | T1 G2: builder check and the G2 design check (dispatch trial)

builder-check · T1 · 4 contradictions · 5 questions · coordinator settled all of them in design revision 2: 15 table rows; `lapis` became a scoped row, so it is not in the one-liner (box 2); "inti data" is a seed; override at `.claude/CONTEXT.md`; "Queue worker" casing; one bounded eval retry.
Dispatch-trial rows:

| # | Date | Role | Cell | Reported tokens | Retries | Findings | Ruled real by | Fired? |
|---|---|---|---|---|---|---|---|---|
| 11 | 2026-11-16 | builder-check reader (T1) | sonnet · low | 66,026 (baseline 62k → 1.06×; 20% bar not met, under the 1.25× cap) | 0 | 4C 5Q. C2 (`lapis` in the one-liner contradicts frozen box 2) was real and missed by the coordinator. The rest were real or factual and settled. | coordinator | yes |
| 12 | 2026-11-16 | G2 design check (T1; no same-unit comparator; counts toward the cap) | fable · high | 141,419 | 0 | 1H 9M 9L. Confirmed the coordinator's (a), (b) and (c). Unique and real: H1 (the override proof could not tell "followed the glossary" from "missed the seed"; fixed with a third form, "dry run", plus a Read-call validity rule), M3 (the Keep-list note needed explicit precedence or the controls are at risk), M4 (the unrelated control was vacuous), M7 (Translate target), M8 (seeds unnamed; the di-fix affix was unreachable), M9 (run validity). M1 and M5 overlapped the builder check. | coordinator | yes |

G2 design check pair verdict: the cell condition holds, since Fable produced real findings the coordinator's own check missed (H1, M3, M4, M7, M8, M9). No same-unit token comparator exists, so the count cap applies instead. Strongest-tier used: 3 of 6.
