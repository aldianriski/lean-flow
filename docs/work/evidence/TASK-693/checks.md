# TASK-693 — builder checks and remaining evidence

Build base: `12ccee239034566f4539bfed3f1b1f1618b3bf65`. Builder: Codex. No Git writes or Claude proof runs were performed. The inventory and exact coordinator proof packet are in `lean-doc-generator.md`.

## Measurements

The body starts immediately after the closing frontmatter delimiter and newline; normalize CRLF to LF, keeping the following blank line and final newline. Bun and an independent PowerShell extraction agree; `wc -c` on those normalized body snapshots printed:

```text
18428 .task693-before-body.txt
17678 .task693-after-body.txt
36106 total
```

Saving: 750 B (4.07%); target 17,680 B, headroom 2 B. Whole-file LF bytes: 19,124 → 18,374; raw checkout bytes: 19,264 → 18,512. Whole-file lines: 140 → 138. Inventory: 105 exact nonblank source-line rows plus all 27 blank lines accounted for, 130 lines total. The two snapshots and all probes are scratch and removed before the report.

## Printed verdicts

| Check | Printed verdict / result |
|---|---|
| `bun --no-env-file evals/run-layout-fixtures.ts` before and after | `layout-fixtures: 41 pass, 0 fail`; repo classifies v2 |
| `bun --no-env-file evals/run-v1-to-v2-fixtures.ts` before and after | `v1-to-v2-fixtures: 101 pass, 0 fail` |
| `bun --no-env-file scripts/lib/check-doc-caps.ts` | Exit 0; `PASS  cap skills/lean-doc-generator/SKILL.md (138 <= 140) [ADR-006, not §2]`; `PASS  doc-caps: token-budget ~10700 tokens <= budget 11021` |
| `sh scripts/lib/check-count-claims.sh .` | Exit 0, 11 PASS lines; `PASS  tmpl-core: README.md claims 34 = disk 34`; `PASS  tmpl-total: README.md claims 36 = disk 36` |
| qa-check leg 13, extracted unchanged from `scripts/qa-check.sh` into an in-tree scratch wrapper | Four `PASS  headless park-record cue` lines: ask-channel probe and park-record instruction present in both migration-map.md and init.md |
| `bun --no-env-file evals/run-store-writers-fixtures.ts` | `store-writers-fixtures: 29 pass, 0 fail` |
| `sh evals/run-skill-freshness-fixtures.sh` | `SKILL-FRESHNESS FIXTURES: all green` (3 cases) |
| `sh scripts/lib/check-manifest-lockstep.sh .` | Four `PASS  manifest lockstep` lines, all 2.26.0; README footer also remains v2.26.0 |
| `bun --no-env-file scripts/lib/check-prose-density.ts .` | Exit 1; `prose-density: 26 pass, 4 fail`; task file itself: `PASS  prose-density: skills/lean-doc-generator/SKILL.md (8 <= 11 dense lines)` |
| Independent PowerShell inventory / scope probe | `PASS independent inventory: 105 exact source rows; 27 blank lines preserved; no unlisted changes`; `PASS independent bytes: 18428 -> 17678; target 17680` |
| Release/scope probe and `git diff --check` | PASS: only original skill L107/L121/L127–129 changed; every-call text/frontmatter unchanged; no added repo-specific path, TASK-692 release line or version bump; past release blocks unchanged; whitespace check clean |

Temporary roots for fixture writers were set to this worktree for their invocations; their cleanup completed. The first prose-density invocation lacked its required root argument and printed usage; the one corrected retry printed the findings below. The PowerShell probe's file invocation was refused by the host execution policy; the one retry as ordinary inline PowerShell commands passed. No execution-policy setting was changed.

## Existing density failures and deferred checks

All four failing files and `scripts/lib/prose-density-baseline.txt` were independently compared with HEAD and are unchanged by this task: `docs/research/bloodlines-retest-scenarios.md` (13 dense lines, no baseline), `docs/research/graphify-rtk-retest-results.md` (6, no baseline), `docs/research/rtk-trial-verdict.md` (5, no baseline), and `skills/orchestrator/SKILL.md` (14 against baseline 13). They are outside T10's Layers; no repair or gate-green claim is made.

The work-store and orchestrator-store fixture suites execute Git writes (init/add/commit/mv/checkout); they were not run under this worker's no-Git-write contract. The full integrated/off-host gate remains the coordinator's check. No credential or environment file was opened.

## Frozen Done-when evidence

| Box | Evidence / outstanding work |
|---|---|
| 1 — body target | Met: 18,428 → 17,678 B; normalized `wc -c`, independent PowerShell count and pinned hashes in the inventory agree |
| 2 — complete inventory | Met mechanically: every nonblank source line quoted once with a disposition; blank-line census complete; every-call text unchanged; no moved route or new reference pointer |
| 3 — real-input runs/spend | Pending coordinator: promote before/after only; exact prompt, fixture contents, plugin bases and flags in the inventory; builder spend $0.00 of $4.50; coordinator writes actual transcripts and `spend.md` |
| 4 — release lines | Met: README and Unreleased cover TASK-688/690/691/693; cancelled TASK-692 omitted under its scope-change; v2.26.0 style has no maintainer-only bullets; version unchanged |
| 5 — independent review/gates | Pending isolated Claude review, at most two rounds, proof comparison and integrated gate; local results above include the four existing density failures |
| 6 — negative | Mechanically preserved: layout, template-before-write, promote/close approval, retention and headless-stop text; init/migrate references untouched; no added repo-specific path. Semantic equivalence remains an independent reviewer judgment |

## Proposed Execution Log entry (coordinator only)

`### 2026-11-21 | progress | T10 (TASK-693) built: lean-doc-generator body 18,428 → 17,678 B (−750, 4.07%), target ≤17,680; proof and review pending`

Codex changed four promote-only rationale spans in place, with every-call instructions and approval/retention stops retained. The 130-line inventory quotes all 105 nonblank original body lines and accounts for 27 blank lines; no procedure moved. README and Unreleased carry TASK-688/690/691/693, no TASK-692 or version bump. Layout 41/0, v1-to-v2 101/0, store-writers 29/0, doc caps, count claims, leg 13, freshness, lockstep and independent inventory/whitespace checks pass. Prose-density prints 26 pass/4 fail in unchanged files outside T10; lean-doc-generator passes 8≤11. Coordinator still owes promote before/after runs and spend.md, isolated Claude review and the integrated gate (including the Git-writing suites). No task box or status was changed by the worker.
