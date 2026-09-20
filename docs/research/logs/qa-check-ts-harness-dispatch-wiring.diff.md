# Wiring diff — `.ts` eval harnesses in leg 12 (SPRINT-103 T1)

**Status: NOT APPLIED.** Committed as a reviewable file first, per D3 (`scripts/qa-check.sh` is
coordinator-owned) and L-151 (three SPRINT-102 reviewers could not audit wiring that lived only in
chat). Apply only after review.

## Why this exists

SPRINT-103 T1 retains `evals/run-sprint-family-spec-reduction-fixtures.ts` — the must-FAIL fixtures
for the spec-reduction drift anchor. It is TypeScript because new executable logic in this repo is
TypeScript run by Bun, and **leg 12 cannot see it**:

- the **run** loop (`:1192`) iterates a hand-maintained list and invokes each entry with a hardcoded
  `sh "$hp"`;
- the **census** loop (`:1255`) globs `evals/run-*.sh evals/selftest-*.sh`.

So today a `.ts` harness is not run *and is not reported as unregistered either* — it is invisible
to the very check that exists to catch an ungated harness (`TD-013`'s shape). That second half is
the more serious one and it is **pre-existing**, not created by this task: the census's population
is `.sh`-only, so it cannot answer the question it is asked for any `.ts` harness in `evals/`. This
is L-186 at the gate's own level — the detection logic is sound, the member set it runs over is not.

## The three changes

### 1. Run loop — dispatch by extension (`:1240`)

```diff
-  hout=$(QA_PROFILE_OUT= sh "$hp" 2>&1); hcode=$?
+  case "$hp" in
+    *.ts)
+      if ! command -v bun >/dev/null 2>&1; then
+        bad "eval harness $h: bun not found on PATH -- cannot run $hp. This FAILS rather than skipping on purpose, same rule as the dod-delta leg (TD-101 - ADR-037): a skip is indistinguishable from a pass"
+        continue
+      fi
+      hout=$(QA_PROFILE_OUT= bun "$hp" 2>&1); hcode=$?
+      ;;
+    *)
+      hout=$(QA_PROFILE_OUT= sh "$hp" 2>&1); hcode=$?
+      ;;
+  esac
```

The `bun`-absent branch copies the existing FAIL-never-skip rule already used by the doc-caps,
epic-archive, night-run-rollup, layers-completeness and authority legs — not a new policy.

### 2. Census glob — admit `.ts` to the population (`:1255`)

```diff
-for hp in evals/run-*.sh evals/selftest-*.sh; do
+for hp in evals/run-*.sh evals/run-*.ts evals/selftest-*.sh; do
```

**This change has consequences beyond T1 and is the reason this diff is not self-applying.** The
glob currently hides 12 `.ts` files in `evals/`. Admitting them means each must be registered in
`eval_harnesses_always`, `eval_harnesses_optin`, or `eval_harnesses_excluded` **with a reason**, or
the census FAILs by name. Several are `*.test.ts` run under `bun test` rather than standalone, and
at least one (`run-doc-caps-differential.ts`) states in its own header that it is deliberately not
wired. Those need `eval_harnesses_excluded` entries written by someone who knows why each is out —
that is a review task, not a mechanical one, and it is the whole reason this sits here unapplied.

A reviewer may reasonably decide to take change 1 and 3 now and defer change 2 with a TD row. Taking
2 *without* writing the exclusions turns the gate red on eleven files that were always fine.

### 3. Register the new fixture (`:1128`, `eval_harnesses_always`)

```diff
-run-dod-delta-fixtures.sh"
+run-dod-delta-fixtures.sh run-sprint-family-spec-reduction-fixtures.ts"
```

Always-on rather than opt-in, by the original cost rule: no git, no engine invocation, four `sh`
subprocesses over awk-derived spec copies. **Measured at 1.4 s** on the same host where the gate
totals ~1200 s.

## Verification before applying

Change 3 is inert until change 1 lands (the list entry would be invoked with `sh` and fail). Apply
1 and 3 together, then:

```
bun evals/run-sprint-family-spec-reduction-fixtures.ts     # expect: 4 PASS, exit 0
sh scripts/qa-check.sh 2>&1 | grep 'sprint-family-spec-reduction'   # expect: PASS eval harness ...
```
