# TASK-596 evidence — /diagnose: which file the checker took as the log's baseline

Redacted: the scratch worktree's local path is replaced with `<scratch-worktree>`. No host, address, auth header,
token or secret appears in any excerpt below.

## 1. The loop (the item's repro, ~4.6 s, deterministic)

```
$ cd <scratch-worktree>   # detached at 16f28eaa; the checker is byte-identical there and at 1fec0b04
$ bun scripts/lib/check-sprint-by-reference.ts docs/sprint/SPRINT-155-consumer-docs-codex-built.md | grep -v '^PASS'
FAIL  LOG-REWRITTEN -- the logs/ file as of 2ea2af7 is no longer a prefix of today's -- a past entry was edited; its entries are not counted
FAIL  FREEZE-EDIT TASK-563 -- ## Done when changed since 2ea2af7 with no scope-change entry new since then naming TASK-563
FAIL  FREEZE-EDIT TASK-564 -- ## Done when changed since 2ea2af7 with no scope-change entry new since then naming TASK-564
check-sprint-by-reference: 4 pass, 3 fail
```

## 2. `--follow` reads the SPRINT-155 log's creation as a COPY

```
$ git log --follow --format='%h %s' --name-status 16f28eaa -- docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md | grep -E '^C'
C065	docs/sprint/logs/SPRINT-154-a2-migrate-arm.md	docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md
$ git show --stat --format='%h' 2ea2af75 -- docs/sprint/logs
 .../logs/SPRINT-155-consumer-docs-codex-built.md   | 39 ++++++++++++++++++++++
```

Shows: the copy commit is `2ea2af75`, which is also SPRINT-155's `plan_commit`. It did not touch SPRINT-154's log, so
`--follow` chose an unchanged file that still exists as the copy source.

## 3. Tagged probe at the baseline read (throwaway copy, removed afterwards)

One `[DEBUG-td596]` line after `const now = body(live)` in `scopedSince`, for the logs/ source:

```
[DEBUG-td596] base=2ea2af75 path=docs/sprint/logs/SPRINT-154-a2-migrate-arm.md logPaths=docs/sprint/logs/SPRINT-155-consumer-docs-codex-built.md,docs/sprint/logs/SPRINT-154-a2-migrate-arm.md head="\n# SPRINT-154 — Execution Log\n\n> Append-" own155prefix=true
```

Shows: `fileAt(2ea2af75, "log")` returned SPRINT-154's log path, and the baseline text was SPRINT-154's log.
`own155prefix=true` means the SPRINT-155 log's own text at `2ea2af75` IS a prefix of today's, so H2 ("the log really
changed") is falsified. The probe copy was restored with `git checkout --`, and `git status` was clean afterwards.

## 4. After the fix, same loop

```
FAIL  FREEZE-EDIT TASK-563 -- ## Done when changed since 2ea2af7 with no scope-change entry new since then naming TASK-563
check-sprint-by-reference: 5 pass, 1 fail
```

Shows: `LOG-REWRITTEN` is gone. `FREEZE-EDIT TASK-564` is gone too: a scope-change entry in the log covers it, and that
entry had been discarded along with the log. `FREEZE-EDIT TASK-563` is a separate finding and out of this item's scope.
Its second box's ` ✓` evidence runs onto three new continuation lines, so the line counts differ, and no scope-change
entry names TASK-563.

## 5. Fixture proof (`bun evals/run-by-reference-fixtures.ts`)

- RED, unfixed checker (blob `2dfeb365`, == `HEAD:scripts/lib/check-sprint-by-reference.ts`), `BYREF_ONLY=log-copied-from-prior`:
  `FAIL ... log-copied-from-prior-sprint-logged-edit ... expected [] got [FREEZE-EDIT TASK-901, LOG-REWRITTEN]`.
  The sibling `...-old-entry-reworded` PASSes (`[FREEZE-EDIT TASK-901, LOG-REWRITTEN]`).
- GREEN, fixed checker (blob `dac0d0ea`), full run: `by-reference-fixtures: 166 pass, 0 fail`.
- Mutation: delete the one claim-bearing line `if (f[0]!.startsWith("C")) break;`. The seed's match count was 1, `diff`
  showed exactly that line removed, 618 → 617 lines, and the file still parses. Result: the claim case reddens with the
  symptom above, while the sibling plus 7 rename/archive controls (`renamed-sprint*`, `archived*`,
  `close-fired-sprint-119-full`) stay green. A first seed attempt matched 0 lines (CRLF working tree), and `cmp` showed
  the file unchanged, so that run was counted as a green control only, never as a mutation result. Restore:
  `cmp` identical to the saved fixed copy, and `git hash-object` == `dac0d0ea` on both.
