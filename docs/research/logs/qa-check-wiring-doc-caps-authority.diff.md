# qa-check.sh wiring diffs — doc-caps + authority TS cutover (TASK-355)

Not applied. `scripts/qa-check.sh` is shared with three other in-flight ports and is off-limits to
this agent per its brief's hard constraints. Committed here as a reviewable artifact per the
coordinator's round-2 instruction (three reviewers could not audit a chat-only diff). The coordinator
applies these centrally.

Both diffs are relative to `scripts/qa-check.sh` as of this worktree's branch point (commit `53fa8d5`,
`todo: file TASK-355 -- cut the QA gate's wall-clock cost (P0)`).

## Leg 1 — doc-caps (~line 163)

Current:

```sh
doccaps=$(sh scripts/lib/check-doc-caps.sh); doccaps_rc=$?
printf '%s\n' "$doccaps"
pass=$((pass + $(printf '%s\n' "$doccaps" | grep -c '^PASS' || true)))
[ "$doccaps_rc" -eq 0 ] || fail=$((fail + $(printf '%s\n' "$doccaps" | grep -c '^FAIL' || true)))
```

Proposed:

```sh
if ! command -v bun >/dev/null 2>&1; then
  bad "doc-caps: bun not found on PATH -- cannot run scripts/lib/check-doc-caps.ts. This FAILS rather than skipping on purpose, same rule as the dod-delta leg (TD-101 - ADR-037): a skip is indistinguishable from a pass"
else
  doccaps=$(bun scripts/lib/check-doc-caps.ts); doccaps_rc=$?
  printf '%s\n' "$doccaps"
  pass=$((pass + $(printf '%s\n' "$doccaps" | grep -c '^PASS' || true)))
  [ "$doccaps_rc" -eq 0 ] || fail=$((fail + $(printf '%s\n' "$doccaps" | grep -c '^FAIL' || true)))
fi
```

**Invariants preserved (confirmed):**
- `pass += grep -c '^PASS'` over the checker's own relayed output — unchanged, same line, same
  counting rule, now reading `check-doc-caps.ts`'s stdout instead of `check-doc-caps.sh`'s. The two
  are differential-parity-verified byte-identical (`evals/run-doc-caps-differential.ts`, 15/15 on
  this host including fixtures, the live repo, the stress-name population, and empty-string-argument
  invocations), so this substitution changes nothing the gate counts.
- `fail` incremented **only when `doccaps_rc != 0`** (`[ "$doccaps_rc" -eq 0 ] || fail=$((...))`) —
  unchanged; still gated on the checker's own exit code, never inferred from output shape alone.
- `command -v bun` FAIL-rather-than-skip guard — copied verbatim in spirit from the dod-delta leg at
  `qa-check.sh:1421-1422` (`bad "dod-delta: bun not found on PATH ..."`), same message shape, same
  rule (TD-101/ADR-037: a skip is indistinguishable from a pass, so a missing runtime FAILs loudly
  rather than silently degrading this leg to "0 checked").

## Leg 14-bis — authority (~line 1299–1307)

Current:

```sh
au_script="scripts/lib/check-authority.sh"
if [ ! -f "$au_script" ]; then
  bad "authority: checker not found at $au_script"
else
  au_files=$(ls docs/sprint/SPRINT-*.md 2>/dev/null)
  if [ -z "$au_files" ]; then
    note "authority: skip (missing): docs/sprint/SPRINT-*.md"
  else
    au_out=$(sh "$au_script" $au_files 2>&1); au_code=$?
```

Proposed:

```sh
au_script="scripts/lib/check-authority.ts"
if ! command -v bun >/dev/null 2>&1; then
  bad "authority: bun not found on PATH -- cannot run $au_script. This FAILS rather than skipping on purpose, same rule as the dod-delta leg (TD-101 - ADR-037): a skip is indistinguishable from a pass"
elif [ ! -f "$au_script" ]; then
  bad "authority: checker not found at $au_script"
else
  au_files=$(ls docs/sprint/SPRINT-*.md 2>/dev/null)
  if [ -z "$au_files" ]; then
    note "authority: skip (missing): docs/sprint/SPRINT-*.md"
  else
    au_out=$(bun "$au_script" $au_files 2>&1); au_code=$?
```

Everything below this point in the leg (the `au_code -eq 0` branch, the `au_n -eq 0` SKIP note, the
`bad "authority: $au_find"` FAIL path) is **untouched** — only `au_script`'s path, the new bun-missing
guard as an added `elif` arm, and `sh` → `bun` on the invocation line change.

**Invariants preserved (confirmed):**
- **Skip-not-FAIL when the sprint glob is empty**: `[ -z "$au_files" ]` → `note "authority: skip
  (missing): ..."` is unchanged, still reached before the checker is ever invoked, on either script.
- **`au_code==0 && au_n==0` → SKIP note (TD-042, "zero verified is a skip, never a pass")**: this is
  the unmodified code directly below the invocation line (`if [ "$au_n" -eq 0 ]; then note "authority:
  SKIP (0 task-checks verified -- nothing in scope)"`) — untouched by this diff, and verified to still
  apply identically because `check-authority.ts` reproduces the exact same PASS/FAIL/note line shapes
  as the oracle (differential-parity-verified: `evals/run-authority-differential.ts`, 11/11 real-logic
  fixture inputs — including `active-sprint-mixed`, a single real active-sprint-shaped file exercising
  HONOURED, BYPASSED, ATTENDED-EXECUTED and a J1 sibling together — plus 103/103 confirmed-trivial-path
  inputs, archived sprints and the zero-arg call, reported as two separate tallies rather than one
  combined headline per the outside review's correction; see `check-authority.ts`'s own header comment
  and `evals/run-authority-fixtures.sh`'s header comment for the full statement of what that split
  does and does not prove).
- **`command -v bun` FAIL-rather-than-skip guard** — same shape and message convention as leg 1 and
  the existing dod-delta leg at `qa-check.sh:1421-1422`, added as the first `elif`-chain arm so a
  missing runtime is reported before the "checker not found" and "no sprint files" arms ever get a
  chance to mask it with a different (softer) message.

## Not touched by either diff

- `evals/lib/harness-common.sh`, `scripts/qa-check.sh`'s `eval_harnesses_always` list — both harness
  NAMES (`run-doc-caps-fixtures.sh`, `run-authority-fixtures.sh`) are unchanged; only their internal
  implementation now calls `bun` instead of spawning `sh <checker>.sh` per case. No qa-check.sh edit
  needed for that half of the cutover.
- `scripts/lib/check-doc-caps.sh`, `scripts/lib/check-authority.sh` — byte-for-byte unmodified,
  remain the live oracles.
