---
owner: Maintainer
last_updated: 2026-09-20
update_trigger: leg 14's invocation changes, or the TS port's CLI contract changes
status: current
---

# qa-check.sh leg 14 — wiring diff for `check-layers-completeness` (TASK-355)

**NOT APPLIED.** This is a reviewable artifact, not a change. It exists because three outside
reviewers in this wave each reported the same blocker: a wiring proposal that lives only in an
agent's chat cannot be audited by a worktree-isolated reviewer, which is the review mode
[ADR-029](../../adr/) (ii) mandates. A decision recorded where its reader cannot reach it is not a
decision (L-151).

## Why it is owed

The port (`scripts/lib/check-layers-completeness.ts`) currently saves time only inside
`evals/run-layers-completeness-fixtures.sh` (54.7 s → 0.70 s). **Leg 14 still spawns the `.sh`
oracle, so the gate itself gains nothing from the port until this diff lands.** Shipping the port
without wiring it is L-020's shape — present in its own file, not fired by the job that uses it.

## The diff

```diff
--- a/scripts/qa-check.sh
+++ b/scripts/qa-check.sh
@@ leg 14: layers completeness
-lc_script="scripts/lib/check-layers-completeness.sh"
-if [ ! -f "$lc_script" ]; then
-  bad "layers completeness: checker not found at $lc_script"
-else
+lc_script="scripts/lib/check-layers-completeness.ts"
+if ! command -v bun >/dev/null 2>&1; then
+  bad "layers completeness: bun not found on PATH -- cannot run $lc_script. This FAILS rather than skipping on purpose, same rule as the dod-delta leg (TD-101 - ADR-037): a skip is indistinguishable from a pass"
+elif [ ! -f "$lc_script" ]; then
+  bad "layers completeness: checker not found at $lc_script"
+else
   lc_files=$(ls docs/sprint/SPRINT-*.md 2>/dev/null)
   if [ -z "$lc_files" ]; then
     note "layers completeness: skip (missing): docs/sprint/SPRINT-*.md"
   else
-    lc_out=$(sh "$lc_script" $lc_files 2>&1); lc_code=$?
+    lc_out=$(bun "$lc_script" $lc_files 2>&1); lc_code=$?
```

Everything below the invocation line is **untouched** — the `lc_code -eq 0` branch, the
`grep -cE '^PASS'` count, TD-042's zero-verified-is-a-SKIP note, and the nonzero-exit handling all
stay exactly as they are.

## Held against the dod-delta precedent (`scripts/qa-check.sh:1421-1444`)

| Requirement | This diff |
|---|---|
| `command -v bun` **FAILs**, never skips (TD-101 · ADR-037) | ✅ first arm, ahead of "checker not found" so a softer message cannot mask it |
| `bun` replaces `sh`, same argument shape (`$lc_files`, unquoted word-split is intentional) | ✅ |
| PASS accounting `grep -cE '^PASS'` unchanged | ✅ untouched |
| TD-042 zero-verified-is-a-SKIP-never-a-PASS | ✅ untouched |
| Nonzero exit with no FAIL line still guarded | ✅ untouched |

## Two notes for whoever applies it

**`lc_files` stays relative.** It is built by `ls docs/sprint/SPRINT-*.md`, and relative paths are
what the port expects. An absolute POSIX path handed to native `bun.exe` is MSYS-rewritten
(`/c/Users/...` → `C:/Users/...`) where MSYS `sh` leaves it alone — established while reviewing the
leg 2g wiring. Relative paths avoid the whole class.

**The `.sh` oracle stays on disk.** It is the parity reference that
`evals/layers-completeness-differential.ts` compares against, and it is the only guard on the IFS
word-splitting fix (the TS suite cannot catch a regression there — verified by seeding exactly that
break, which left the suite 19/19 green while the differential diverged). Deleting the oracle would
silently remove that guard.
