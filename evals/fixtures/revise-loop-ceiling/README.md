# revise-loop-ceiling — retained fixtures (SPRINT-098 T2)

Guards `check_revise_ceiling()` in `scripts/night-run.sh`, called from `reap()` before the run's
`terminal ·` state is derived. ADR-022 § Decision item 2 sets the ceiling — one retry per review
pass, total; still-open after it → `parked-hitl`, never a second firing — and this is the mechanical
proof that a run's own Execution Log never crosses it. Run the harness:
`sh evals/run-revise-loop-ceiling-fixtures.sh`.

Two named findings, so a fixture asserts on the checker's own finding rather than a bare exit code
(L-058):

- `revise-loop-ceiling-exceeded` — a task fired more than one `retry` line in the run's window.
- `revise-loop-escalation-missing` — a `still-open` retry with no matching `Tn · parked-hitl ·` line.

## Cases

| Dir | Shape | Verdict |
|---|---|---|
| `ceiling-exceeded/` | one task, two `retry` lines, both `fixed` | must-FAIL — `revise-loop-ceiling-exceeded` |
| `ceiling-ok-sibling/` | same task, one `retry` line, `fixed` | control (L-142) — PASS |
| `escalation-missing/` | one `retry` line ending `still-open`, no `parked-hitl` line | must-FAIL — `revise-loop-escalation-missing` |
| `escalation-ok-sibling/` | same `still-open` retry, followed by `parked-hitl` | control (L-142) — PASS |
| `rejection-unevidenced/` | a `rejected (…)` retry, parked, its parenthesis naming no evidence token | must-FAIL — `revise-loop-rejection-unevidenced` (SPRINT-143 T2) |
| `rejection-evidenced-sibling/` | the same rejection with `fixture` inside the parenthesis | control (L-142) — PASS |
| `rejection-token-outside/` | an evidence token in the finding text, none inside the parenthesis | must-vary-**selection** (L-186) — FAIL `revise-loop-rejection-unevidenced`; a checker matching the token anywhere on the line would pass it |
| `rejection-unparked/` | an evidenced `rejected (…)` retry with no `parked-hitl` line | must-FAIL — `revise-loop-escalation-missing` (a rejection parks too) |
| `rejection-prior-outcome-quoted/` | the finding quotes an earlier `→ rejected (test: …)`; the actual outcome's parenthesis has none | must-vary-**selection** — FAIL `revise-loop-rejection-unevidenced` |
| `rejection-paren-crossing/` | an evidence token just past the rejection's closing `)` | must-vary-**selection** — FAIL `revise-loop-rejection-unevidenced` |
| `rejection-inner-arrow-parked/` | `→ rejected (reviewer quoted → fixed)`, parked: the inner arrow is payload | must-FAIL — `revise-loop-rejection-unevidenced` |
| `rejection-inner-arrow-unparked/` | `→ rejected (check: observed -> fixed)` with no park | must-FAIL — `revise-loop-escalation-missing` |
| `outcome-unbalanced-paren/` | an unmatched `(` in the finding text before a `→ rejected (…)` outcome | must-FAIL — `revise-loop-outcome-unparseable` (fail closed, never open) |
| `rejection-nested-evidence-sibling/` | evidence after a nested parenthesis inside `rejected (…)` | control — PASS (read to the matching `)`) |
| `quoted-rejection-then-fixed/` | the finding quotes an old `-> rejected (…)`; the actual outcome is `fixed` | control — PASS (no park, no evidence needed) |
| `deferred-escalation-missing/` | a `deferred (…)` retry with no `parked-hitl` line | must-FAIL — `revise-loop-escalation-missing` (unattended, a deferral parks) |
| `selection-window/` | two textually-identical `T6 · retry ·` lines, one either side of a `<!-- fixture: this-run-window-starts-here -->` marker | must-vary-**selection** (L-186) — fed with `base=0` the two lines collapse into one task's count and FAIL; fed with the marker-derived base only this run's single retry is in scope and PASS. Same verdict math either time — what differs is which line is in the window |

`ceiling-exceeded/` and `escalation-missing/` are each built to carry only their own trigger (no
`still-open` at all in the ceiling fixture; only one `retry` line in the escalation fixture), so
neither can arm the other finding — the harness also asserts this in the negative
(`ceiling-case-stays-isolated` / `escalation-case-stays-isolated`, L-189), because both findings can
plausibly fire off the same malformed log and a checker emitting both would pass either case alone.

## Motivating real artifact

No real **unattended** ADR-022 firing exists in this repo yet (T4, the real unattended run, hasn't
happened). The harness instead points at `docs/sprint/archive/logs/SPRINT-067-the-proof-layer.md` —
a genuine **attended** run that fired the revise loop twice in one sprint, once per task, each
closed at the one-retry ceiling ("the revise loop fired twice, once per task, both closed at the
one-retry ceiling") — confirming the guard does not false-positive on a real, compliant, multi-task
retry history. Read live via `grep`, never copied into this directory, so an edit to that archived
log cannot silently drift out of sync with this fixture (the same discipline
`run-night-run-rollup-fixtures.sh` case 8/11 already apply one file down).

## Seeded-break discrimination (one convention: `git hash-object` vs a stated checkpoint)

Both named findings, and the harness's own selection-window marker guard, were independently seeded
and confirmed to redden **only** their own case(s) while every sibling stayed green, then restored
byte-for-byte under `git hash-object` against a stated pre-seed checkpoint. Full evidence lives in
the SPRINT-098 T2 report/log rather than duplicated here; this file exists to be read again, not to
re-derive the proof.
