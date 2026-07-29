---
owner: Maintainer
last_updated: 2026-07-29
update_trigger: A learning confirmed at Sprint Close, or a learning promoted to a durable rule
status: current
---

# lean-flow — Learnings Ledger

Append-only record of confirmed corrections and patterns surfaced at Sprint Close. A learning that
**recurs (count ≥ 2)** is promoted into a *durable* rule — a `CLAUDE.md` anti-pattern, a `CONTEXT.md`
rule, or a skill red-flag — and marked below. Reviewed at every **Sprint Promote** before planning.

<!-- Newest first. Never edit a past entry except to bump `seen` / `count` or set `promoted`. -->

<!-- Per-entry metadata (schema, ADR-009): the heading carries `[tags: <tag>] [status: active|promoted|superseded]`;
     the body keeps `seen · count · promoted · related`. Tags: process · docs · tooling · edit-safety · sprint-model.
     The by-tag index is GENERATED corpus-wide into docs/knowledge-index.md — `sh scripts/gen-index.sh`. -->

> **By-tag index** → [`docs/knowledge-index.md`](knowledge-index.md) — generated corpus-wide by
> `scripts/gen-index.sh` (LEARNINGS + ADRs + research). This file is the LEARNINGS SSOT; the index is derived.

> **Id policy — monotonic, never reused:** a pruned/promoted entry's id retires forever; the next
> new id continues from the highest id **ever issued** (currently **L-046**), not the highest visible.
> `L-001`–`L-021` above stay valid as-is — this rule starts now, not retroactively.
> **Retired ids:** `L-022`–`L-042` pruned/promoted → durable rule in `CLAUDE.md` anti-patterns ·
> skill red-flags · sprint archive. `L-016`/`L-017` were briefly reused pre-policy — the ORIGINAL
> 016/017 content is retired; today's `L-016`/`L-017` above are the current, legitimate entries.

---

## L-046 [tags: tooling] [status: active]: Agent worktrees fork from the REMOTE default branch, not local HEAD (unless `worktree.baseRef: "head"`) — a wave dispatched over unpushed local commits hands every agent a tree missing them (SPRINT-026: both agents lacked the very research docs they were briefed on; both correctly fell back to `git show main:<path>`). Brief the read-fallback explicitly, or set baseRef; the three-way merge reconciles the stale base as long as agents touch only their own files. Encoded in dispatch.md § Worktree dispatch protocol (base-ref caveat).
- seen: Sprint-026
- count: 1
- promoted: no
- related: L-044 · L-043 · dispatch.md base-ref caveat

---

## L-045 [tags: process] [status: active]: A piped quality gate masks its exit code — `qa-check.sh | tail` returns *tail's* status, so a FAIL sailed into a `&&`-chained commit unseen (SPRINT-025: vocab-tag lint failure committed, caught only by reading the output after). Chain the commit on the *lint's own* exit (`sh qa-check.sh && git commit …`, no pipe), or read the full output before committing — never pipe a gate into a formatter inside the same chain that commits.
- seen: Sprint-025
- count: 1
- promoted: no
- related: L-013 (a "required" rule is only real if a check enforces it — and a check is only real if its exit code is read)

---

## L-044 [tags: tooling] [status: promoted] → promoted: yes → dispatch.md § Merge-back queue (cleanup step encodes the full procedure). Windows holds a handle-lock on a git worktree any shell has `cd`'d into — `git worktree remove` fails with Permission denied until a fresh shell runs it; partial failure leaves the admin entry deleted but the directory on disk (needs manual `rm -rf` + `git worktree prune`). Coordinator cleanup procedure: leave the worktree dir *before* removing it, retry from a fresh shell, verify with `git worktree list`. Feed into TASK-096's merge-back/cleanup step.
- seen: Sprint-025 · Sprint-026 (recurred live on the int-026 integration worktree — documented recovery worked)
- count: 2
- promoted: yes → dispatch.md § Merge-back queue (SPRINT-027 promote governance)
- related: L-043 (coordinator-only worktree cleanup) · docs/research/fog-fleet-orchestration.md (prototype friction) · dispatch.md § Merge-back queue (procedure encodes it)

---

## L-043 [tags: edit-safety] [status: active]: Parallel-dispatched subagents must NEVER run tree-wide git state ops (`stash` / `checkout` / `restore` / `reset`) — one agent's `git stash` mid-wave swept a sibling task's uncommitted edits into the stash (SPRINT-024 W1: T8's work looked destroyed for two turns; restored on `pop` — pure luck the window didn't interleave with a write). Fixture-test lints via scratchpad copies or inject-and-immediately-revert with an editing tool; compare baselines via `git show REF:file`, never by mutating the shared tree. Ban stated verbatim in every parallel-wave dispatch brief from W2 on.
- seen: Sprint-024
- count: 1
- promoted: no
- related: L-010 (repo source vs cache) · the retired per-hunk-staging rule (now a CLAUDE.md anti-pattern)

---

## L-021 [tags: tooling] [status: active]: After a plugin update, the RUNNING session keeps the OLD cached skill version — verify the loaded skill's base-dir version, not just `/plugin`'s report. SPRINT-023: `/plugin` said 1.10.1, but the live session loaded `/orchestrator` from the stale `…/cache/…/1.5.0/…` dir (pre-improvement content), so none of the shipped dispatch improvements fired — the "orchestrator doesn't spawn after update" complaint was a **stale-session / leftover-cache-dir** issue, not a code gap. Fix: restart the session to load the current version; remove stale cache version dirs (keep only the latest). Pattern: when a plugin change "doesn't take effect," check the skill's base-dir version in the invocation header BEFORE debugging the code.
- seen: Sprint-023
- count: 1
- promoted: no
- related: L-010 (edit the repo source, never the install cache)

---

## L-020 [tags: process] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern + DoD (wire new capability into all related jobs). Shipping a capability ≠ wiring it. A new behaviour must be connected into **every related job/flow that should TRIGGER or CHAIN it** — entry routing · the dispatch/reviewer brief · the `/flow` conductor · the `CONTEXT.md` SSOT — not just written in its own file. The v1.9.0/v1.10.0 wiring audit (SPRINT-022) found 3 features shipped but half-connected: skill-powered dispatch orphaned from the Implement steps · Standards-vs-Spec never injected into the reviewer brief · foggy intent not routed to fog-mode. Pattern: at G2 for any new capability, enumerate its trigger points + downstream consumers and wire each; verify it FIRES end-to-end, don't stop at "the file exists." Owner-directed promote (base knowledge for future improvements). Related: L-007 (exercise on real input) · L-015 (consumer surface).
- seen: Sprint-022 · Sprint-024 (the loop-hygiene audit's founding thesis — a prose rule with no lint/checklist matcher is unwired by definition)
- count: 2
- promoted: yes → CLAUDE.md anti-pattern + DoD (2026-07-10, owner-directed)
- related: L-007 · L-015

---

## L-019 [tags: process] [status: active]: Same-provider model tiers don't decorrelate *factual* errors — cross-tier ≠ cross-provider. Probe (TASK-065, SPRINT-021 T2): one factual claim with knowable ground truth run across Haiku/Sonnet/Opus/Fable — the base dispatch tier (Sonnet) was already correct, so Opus/Fable *confirmed* rather than corrected, and Haiku honestly abstained (no hallucination). No divergence → no shared crack exposed to decorrelate. Pattern: model-diversity that shares a training lineage buys confirmation, not error-correction; genuine factual decorrelation needs a *cross-provider* model — the exact dependency that gates the multi-model backend (TASK-047). A cheap probe can only fail to find a crack, never prove absence (N=1, can't manufacture a shared-blind-spot case).
- seen: Sprint-021
- count: 1
- promoted: no
- related: L-018 (framing diverges, factual untestable on a judgment fork) · L-014 (fact-verify) · TASK-047

---

## L-018 [tags: process] [status: active]: A single-model `/council` diverges on *framing* but not (testably) on shared *factual* priors — so "5 personas = theater" is false for framing. Measured (TASK-048, SPRINT-020 T4): on a judgment fork the 5 personas surfaced 5 *distinct* decision dimensions (First Principles strongest 3/5; the lone build-lens flagged biggest blind-spot 5/5) — genuine framing divergence, matching council-improvements finding #4 (single-model reduces framing blind spots). But a judgment fork has no external-facts surface, so it CANNOT test shared knowledge/factual gaps — the real ceiling. Pattern: measure council divergence on the axis you actually doubt; framing divergence is demonstrable and real, the shared-factual-priors crack needs a FACTUAL decision to expose (→ TASK-065).
- seen: Sprint-020
- count: 1
- promoted: no
- related: L-014 (adversarial fact-verify catches shared-prior misattribution) · council-improvements.md finding #4

---

## L-017 [tags: process] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern (adoption = delta over existing surface). An adoption scan judges the DELTA over lean-flow's existing surface, not the tool's standalone merit — map each candidate to what we already have FIRST; only the unmatched remainder is a keeper. Seen Sprint-014 (bmad → 5 keepers) + Sprint-016 (structarmed → 0 · brainstorming → ~90% owned) (count 2). Related: ADR-001 · L-015.

---

## L-016 [tags: process] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern (L-015 extension: when the repo can't dogfood a feature, verify on the consumer path). A skill/tool repo can't dogfood a feature whose substrate it lacks — markdown-only lean-flow has no testable code, so `/tdd` never fires and skill-powered-dispatch's `/tdd` path can't be exercised → trace the consumer scenario / exercise the mechanism, don't read "didn't fire here" as broken OR fine. Seen Sprint-015 + Sprint-020 (count 2). Related: L-015 · L-007.

---

## L-015 [tags: process] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern + DoD item ("consumer-facing surface checked"). Evaluate every lean-flow change against the CONSUMER who installs the plugin, not only lean-flow's own dogfooding: generic skills/templates stay self-contained + adaptable (no leaked `scripts/…` / `docs/knowledge-index.md` path), and README/CHANGELOG reflect user-visible changes. Recurred — SPRINT-013 leaked gen-index refs into generic skills; SPRINT-014 extended the leak, shipped a stale README (v1.1.0 at v1.5.0) + an out-of-date `/council` worked example — the maintainer flagged it as a persistent skip, so promoted on first explicit surfacing. Related: L-007 · L-001.

---

## L-014 [tags: process] [status: active]: Adversarial fact-verify catches misattribution that reasoning-review — and author judgment — miss. SPRINT-014 T3's new `/council` fact-verify pass found `arXiv:2604.03173` is a REAL paper whose *cited figures* were fabricated; the sprint author had earlier dismissed the ID itself as fake — wrong on both counts. A reasoning-only critique cannot catch a claim whose source EXISTS but doesn't say what's claimed; only fetching the primary source does. Pattern: when a decision/doc rests on external citations, verify the source *says the thing*, not merely that a source exists.
- seen: Sprint-014
- count: 1
- promoted: no
- related: L-007 (exercise on real input) · L-006 (fresh eyes catch author-blind gaps)

---

## L-013 [tags: tooling] [status: active]: Convention isn't enforcement — a field/rule called "required" is only required if a check enforces it. SPRINT-013 T1's `[tags][status]` schema was "required" only via template + skill prose until an assume-guilty self-review flagged it; a `qa-check.sh` metadata-completeness lint made it real (a missing/typo'd tag now FAILs, instead of silently dropping from the generated index). Pattern: back any "required" field with a lint, or it silently rots.
- seen: Sprint-013
- count: 1
- promoted: no
- related: L-007 (spec/convention isn't trusted until exercised on real input)

---

## L-012 [tags: docs] [status: active]: References-first under a SKILL cap — when a skill is near its ≤110 cap, add behaviour via `references/` (uncounted, ADR-006) or reword existing lines in place, rather than append a section. SPRINT-012 landed 5 behaviours with `orchestrator/SKILL.md` held at 109/110; a naive "append per task" would have busted the cap. Pattern: at G2, choose the landing spot (references vs body) before editing a near-cap skill.
- seen: Sprint-012
- count: 1
- promoted: no
- related: L-008 (SSOT dedup near cap) · ADR-006 (references uncounted)

---

## L-011 [tags: tooling] [status: active]: A committed shell script must be pinned to LF (`*.sh eol=lf` in `.gitattributes`). On a Windows checkout with `autocrlf`, git rewrites the file to CRLF and the `#!/usr/bin/env sh` shebang gains a trailing `\r` — the interpreter becomes `sh\r` and the script fails to run. Caught only by git's "LF will be replaced by CRLF" warning, not by any test. Pattern: when a markdown/config repo gains its first executable script, add the `eol=lf` attribute in the same change.
- seen: Sprint-008
- count: 1
- promoted: no
- related: L-005 (edit-mechanism discipline — text round-trips corrupt files)

---

## L-010 [tags: tooling] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern (edit the repo source, never the install cache). When editing an installed plugin the target is the REPO SOURCE (`skills/…`), not the cache (`~/.claude/plugins/cache/…`); a cache Read doesn't satisfy read-before-edit. Seen Sprint-007 + Sprint-009 (count 2). Related: L-005.

---

## L-009 [tags: edit-safety] [status: active]: A row-deletion Edit on a markdown TABLE can silently FUSE adjacent rows — removing the graphify row in `ARCHITECTURE.md` matched the wrong newline and merged the built-in-commands + Hooks rows (the Hooks row vanished from the render); grep and line-caps stayed clean, so it was caught ONLY by the fresh-context review. Pattern: after deleting a table row, re-read the table (diff the rendered rows) — don't trust the edit; and a reviewer who didn't write the edit catches author-blind structural defects.
- seen: Sprint-007
- count: 1
- promoted: no
- related: L-006 (fresh/cold eyes catch author-blind issues — this is a 2nd occurrence of that pattern)

---

## L-008 [tags: docs] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern (periodic SSOT dedup at promote) + TD-006. SSOT docs accrete duplication of their satellites until they near the cap; seen Sprint-006 + Sprint-008 (count 2 — CONTEXT hit 129/130).

---

## L-007 [tags: process] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern ("a new behaviour's final DoD must be exercised once on real input"). Spec-only-debt trap; seen Sprint-003 (TD-001) + Sprint-004 (T3/T5); validation follow-ups TASK-023 · TASK-024.

---

## L-006 [tags: process] [status: promoted] → promoted: yes → orchestrator § Review (the fresh-context Review pass). Cold-context agents surface author-blind spec gaps (7 in one fresh-install run); seen Sprint-003 + Sprint-007 (count 2). Related: L-009 (table-row deletion fused neighbors — caught only by that review).

---

## L-005 [tags: edit-safety] [status: active]: PowerShell `Get-Content`→`Set-Content` round-trips corrupt UTF-8 markdown (em-dashes → mojibake) — edit files with the Write/Edit tools, never shell text pipelines
- seen: Sprint-002
- count: 1
- promoted: no

---

## L-004 [tags: sprint-model] [status: active]: Append-only-forever ledgers contradict LAW 3 — no archive trigger exists anywhere, so TODO.md / CHANGELOG.md bloat in a long agentic loop → fix: TASK-012 (§11 Retention)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-003 [tags: sprint-model] [status: active]: The sprint model assumes a single work stream — one Active Sprint pointer + the "one sprint at a time" rule make two parallel streams in one repo collide on TODO/ledgers → fix: TASK-011 (stream concept)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-002 [tags: process] [status: active]: The detailed grill never fires on the conducted path — task-decomposer's "don't re-interview" escape hatch + sprint-bulk's batch-G2 collapse it to one pass, and G2 is too late anyway (tasks already written) → fix: TASK-010 (grill at intake)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-001 [tags: docs] [status: active]: DOCS_Guide §2 defines no placement — generated docs pile up at the host-repo root, and the standard contradicts lean-flow's own repo (docs/ARCHITECTURE, docs/CHANGELOG) → fix: TASK-009 (placement column + prime/migrate alignment)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no
