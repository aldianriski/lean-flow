---
id: TASK-682
title: "Prepare the graphify and RTK arms on a per-scenario export and price the 18-run set"
priority: P2
size: M
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: [TASK-681]
---

# TASK-682 — Prepare the graphify and RTK arms on a per-scenario export and price the 18-run set

## Why
Both arms must be shown to fire on this repo before money is spent on them, and the real run price must be known: the second gate. An affordable projection proceeds; only a non-fit asks.

## Done when
- [ ] graphify 0.9.103 arm: in a spare-scenario export (audited and scrubbed), `graphify update` (code-only) with a `.graphifyignore` for non-source dirs, build time and node/edge counts recorded, then `graphify install --project` (never the global form); a hook nudge (Read|Glob, Bash|Grep) is visible in a smoke run's transcript; the install's edit to the tracked project CLAUDE.md under the export's .claude folder is reverted AFTER the arm's run, not before.
- [ ] RTK arm: full v1.1.0 at D:\tools\rtk-full\1.1.0 by absolute path, PATH prefix on the RTK child only; trusted `.rtk/pipeline.toml` extending `rtk:terse` and `rtk:posthook` with `strip-line-numbers` and `json-reads` on (`rtk pipeline show` resolves it); `rtk init` project mode (never -g); PreToolUse Bash rewrite hook in the export's project settings; Read/Grep compression recorded untestable (no PostToolUse processor in v1.1.0); a Bash rewrite and one `rtk recall` of a cut output are shown; the allowlist admits `Bash(rtk:*)` and one mutating `rtk` command is shown denied; the information-loss audit procedure (re-run in an unmodified copy, byte-compare with `rtk recall`) is exercised once.
- [ ] Each arm's install and removal is run once on a spare export: after removal the directory equals the baseline (`git status --porcelain --ignored` empty, tree hash equal to the export's), and global files keep their hashes: ~/.claude CLAUDE.md and settings.json, the global skills folder for graphify (~/.claude/skills/graphify), and the RTK AppData folder.
- [ ] One smoke run per arm (3 runs) on a spare pool scenario (not one of the six) reports USD, tokens, tool calls and first-turn cache state; the paid-set projection is recorded: max smoke price x 18 x 1.25 + scorer 2.00 + hold-back 1.50 <= remaining cap. If it fits, 683 proceeds without asking; if not, the task ends `blocked` with the projection and the owner is asked (5 scenarios x 3 arms, more budget, or stop); the run count is never shrunk silently.
- [ ] The minimum detectable differences are recomputed once more from the smoke runs and recorded.
- [ ] This task's lines total at most 1.50 USD.
- [ ] Negative: a graphify smoke run with no hook nudge in its transcript is an arm failure to fix, never a datum; if `graphify update` needs an LLM pass the task blocks and asks.
- [ ] Negative: a plain-config smoke run with any graphify or rtk call is void.
- [ ] Negative: no global hook is added (`rtk init -g` and the global graphify install never run) and the live repo and lean-flow skills, hooks, manifests and README are unchanged.

## Touches
D:\Research\bloodlines-exports (temporary arm files, one export at a time, reverted); D:\tools\rtk-full\1.1.0 read-only; docs/research/graphify-rtk-retest-results.md (ledger rows).

## Assumes
- graphify code-only AST runs on a ~1,300-file export without LLM tokens.
- RTK v1.1.0 is the only eligible release; the SPRINT-182 ruling "Test what v1.1.0 supports" stands.
- Smoke price on a spare scenario is representative of a scored run.

## Tracker
Precedent TASK-677 and 678; owner "Price gate: ask only if it doesn't fit".
