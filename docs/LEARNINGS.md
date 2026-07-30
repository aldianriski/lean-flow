---
owner: Maintainer
last_updated: 2026-07-30
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
> new id continues from the highest id **ever issued** (currently **L-063**), not the highest visible.
> `L-001`–`L-021` above stay valid as-is — this rule starts now, not retroactively.
> **Retired ids:** `L-022`–`L-042` pruned/promoted → durable rule in `CLAUDE.md` anti-patterns ·
> skill red-flags · sprint archive. `L-016`/`L-017` were briefly reused pre-policy — the ORIGINAL
> 016/017 content is retired; today's `L-016`/`L-017` above are the current, legitimate entries.

---

## L-063 [tags: docs] [status: active]: In a repo that **documents a standard**, a repo-wide path rename cannot be a find/replace — every occurrence is either a link to our own file (rewrite) or a description of the standard itself (must NOT change). Migrating `docs/CHANGELOG.md` → root would have rewritten the migration map's own **source column** (it maps *from* the legacy path, so that path must stay named), DOCS_Guide's "still matched, second" note, `release-patch`'s legacy-detection fallback, and `prime`'s legacy read-order row — i.e. corrupted the very standard consumers rely on to migrate. Append-only files (ADRs) add a third class: their stale link is stale *by design*. Classify every occurrence before touching one, and **assert the prohibited paths were untouched afterwards** (`git diff --name-only`) rather than trusting intent.
- seen: Sprint-038
- count: 1
- promoted: no
- related: L-015 (consumer-leak class) · ADR-012

---

## L-062 [tags: process] [status: active]: "Retain the fixtures" needs a **three-way** split, or it gets argued away: the fixture **input** (deterministic, retain), the **assertions** over a finished run's artifacts (deterministic, retain), and the **run itself** (nondeterministic + costly, correctly on-demand). SPRINT-038 T2a declared behavioural fixtures unretainable *as a class* by conflating all three, and checked in nothing; T2b then followed that precedent and also checked in nothing — one task after the retention rule was promoted into CLAUDE.md. Salvage cost nothing (the scratch repos were intact) and the retained assertion script immediately caught a silent false-negative. **Mechanism worth naming: a framing one subagent asserts, and the coordinator commits without challenge, becomes binding on the next subagent.** Review a subagent's *reasoning*, not just its diff.
- seen: Sprint-038
- count: 1
- promoted: no
- related: L-058 · TD-012 · L-007

---

## L-061 [tags: process] [status: active]: A safety contract written as **prose in a doc** cannot be negative-tested by weakening that doc — the model's own priors hold the line independently of what the procedure says. Two attempts to induce a real violating run (Part 0's park protocol inverted, loaded via `--plugin-dir`, all "this is a fixture" tells removed) both failed: the model declined to self-approve the destructive step *even though the loaded procedure explicitly authorised it*, citing its own priors rather than the doc. Two consequences: (a) a behavioural eval suite over such a contract can validate its **observable artifacts** but cannot prove it catches a violation — say so rather than implying regression-gate strength; (b) the doc may be getting credit for behaviour that would happen anyway, so "the agent honoured our contract unprompted" is **weak evidence** the contract caused it. The contract still earns its place by fixing *which* artifact gets written and where — that part is real and testable.
- seen: Sprint-038
- count: 1
- promoted: no
- related: L-016 (verify on the consumer path) · L-057 · ADR-013

---

## L-060 [tags: tooling] [status: promoted] → promoted: yes → `.claude/CLAUDE.md` Edit-safety trap **(c)** (verify the artifact, not the command's self-report). Shell-specific multi-line string syntax fails silently across a two-shell session — a PowerShell here-string (`@'…'@`) handed to the Bash tool committed a literal `@` as the subject and demoted the real one into the body; git accepted it, the tool reported success, `git log --oneline` was the only tell. Match the quoting form to the tool actually executing, and when a command's job is to *record text*, inspect the stored text. Seen Sprint-037 · promoted as part of the 5-entry cluster (L-045 · L-049 · L-057 · L-059 · L-060, 4 sprints). Related: L-057 · L-059.

---

## L-059 [tags: tooling] [status: promoted] → promoted: yes → `.claude/CLAUDE.md` Edit-safety trap **(c)**. A gate's exit status can come from the **plumbing** rather than the gate — `sh scripts/qa-check.sh > "$TMPDIR/qa.txt"` with `$TMPDIR` unset made the *redirect* fail, reporting `EXIT=1` while qa-check never ran. The tell is structural: a non-zero status with **no report behind it** is not a verdict. Seen Sprint-037 · promoted as part of the 5-entry cluster (4 sprints). Related: L-057 (status from the wrong command) · L-058 (a gate that lies quietly).

---

## L-058 [tags: tooling] [status: promoted]: A gate's worst failure is the silent false-negative — only a must-FAIL fixture per check exposes it, and the fixtures must be retained.
- L-058 → promoted: `.claude/CLAUDE.md` anti-patterns (folded into the spec-only-debt bullet, whose
  "exercised once on real input" bar it completes for gates) · seen Sprint-036 · Sprint-037 · count 2
- related: L-007 · L-057 · L-059 · TD-012 (the retention leg, still open)

---

## L-057 [tags: tooling] [status: promoted] → promoted: yes → `.claude/CLAUDE.md` Edit-safety trap **(c)**. A gate piped into a formatter stops gating — `check | tail && commit` commits on the FORMATTER's exit code; twice at SPRINT-035 close a genuine FAIL (missing corpus metadata; stale README footer version) was committed through, because POSIX pipeline status is the last command's and `tail` always exits 0. The failing line was printed — the chain, not the reader, made the decision. Run the gate bare, or gate on its captured status. Seen Sprint-035 (×2, same close) · promoted as part of the 5-entry cluster (4 sprints). Related: L-045 (the same friction, filed as a separate entry instead of a `count` bump — which is why the `count ≥ 2` trigger never fired) · L-007 · ADR-008.

---

## L-056 [tags: process] [status: active]: A defect *class* fixed in one file recurs in text newly written the same sprint — and the author cannot see it. SPRINT-035 T3 resolved TD-010 (repo-local path leaked into shipped skill text, the L-015 class); two tasks later T5 wrote a fresh instance of the same class into the shipped SPRINT template (`qa-check.sh` cited as an authoritative enforcer consumers don't have). Only the fresh-context reviewer caught it. Fixing an instance doesn't inoculate the sprint against the class: when writing NEW shipped text, grep for the class just fixed, and keep the isolated review pass even in the sprint that is busy fixing that very class.
- seen: Sprint-035
- count: 1
- promoted: no
- related: L-015 (the class) · L-006 (fresh-context review as the catch mechanism) · L-009

---

## L-055 [tags: tooling] [status: active]: Agent-tool worktrees branch from the SESSION-START commit, not current main — every mid-session commit before dispatch diverges the fleet's base. SPRINT-035 wave 1: four parallel worktree agents all branched from pre-promote HEAD; merges became cherry-picks, and one agent reported "TASK entries missing" because its tree predated the promote commit — undetected until merge-back. Treat the branch point as *declared state, verified at spawn*, never assumed: tell the agent what base it should see, have it verify, halt on mismatch (→ TASK-118 / ADR-013's `base_ref` condition; the same check must re-run at every wave boundary, since HEAD moves as waves land).
- seen: Sprint-035
- count: 1
- promoted: no
- related: L-044 (worktree mechanics) · L-020 (wire the check at the entry point, not inside) · ADR-013

---

## L-054 [tags: process] [status: active]: A guard that runs *inside* the process it protects cannot stop the decision to start that process. `sprint-bulk` step 0 asked exactly the right question — "is there a promoted sprint?" — but it executes inside the spawned headless run, where there is no ask channel: it can halt, never prevent or ask. So "run a night run for `<un-promoted intent>`" spawned first and discovered the problem second, in the one context that cannot report it. The entry-side check has to live in the session doing the spawning. Generalization: when a rule protects a boundary crossing, ask which *side* of the boundary the check runs on — a correct check on the wrong side reads as coverage and provides none. Corollary on L-020: the promoted wiring-check enumerates a capability's trigger points and downstream consumers, which is why this passed review — the *entry path into* the capability was never read as one of its trigger points.
- seen: Sprint-034
- count: 1
- promoted: no
- related: L-020 (shipped ≠ wired — this is its entry-side blind spot) · L-016 (the consumer path is where it surfaced) · L-007

---

## L-053 [tags: process] [status: active]: A new rule's value can sit *after* the decision it appears to be about — and a control that shares an independent stop-reason proves nothing. SPRINT-033 encoded "never self-approve a HITL step unattended", then tested it: a pre-contract control (worktree at the prior release) refused the unapprovable step in near-identical terms to the post-contract HEAD. The refusal instinct was already there; what only HEAD produced was the *protocol* after refusing — park record, `parked-hitl` rollup line, continue disjoint work, clean halt. The first comparison was also confounded (an open DoD gave both arms a second reason to stop) and had to be re-scoped to isolate the variable. Before claiming a change caused a behaviour: isolate the variable, and check whether the real gap is the decision or what follows it.
- seen: Sprint-033
- count: 1
- promoted: no
- related: L-007 (exercising on real input is what exposed it) · L-052 (same sprint, same test pass)

---

## L-052 [tags: process] [status: active]: A spec's inaccurate mechanism becomes agent reasoning verbatim — so platform facts get *run*, not inferred. SPRINT-033's contract stated that under `--permission-mode dontAsk` a gate `AskUserQuestion` "comes back denied, not answered" (inferred from the permission-mode docs). A real headless run showed the tool is **not registered in a headless session at all** — no ask channel to deny — and the session is flagged non-interactive; the observed pressure is therefore an agent that *cannot* ask reasoning the answer out and proceeding. A later run then quoted the wrong mechanism straight back out of the spec. Any platform behaviour a rule depends on is verified by executing it once; documentation-derived mechanism is a hypothesis until then.
- seen: Sprint-033
- count: 1
- promoted: no
- related: L-007 (spec-only debt — the same "exercise it once" discipline) · L-053 (same test pass)

---

## L-051 [tags: docs] [status: active]: A placement-standard row without a full explicit path invites a mis-scaffold — DOCS_Guide §2 listed the ADR index as bare "`DECISIONS.md`" (no `docs/` prefix), and the T7 three-tier exercise scaffolded it at fixture root before catching the ambiguity by cross-inference from README.md.template's docs-map link (SPRINT-032). A generation standard is executed literally by cold-context agents: every §2-class row states its full path from repo root; disambiguation-by-sibling-inference is a trap. Fixed same-sprint (row now says "both under `docs/`").
- seen: Sprint-032
- count: 1
- promoted: no
- related: L-001 (the original no-placement-defined gap — same failure class at standard scale) · L-007 (exercising on real input is what surfaced it)

---

## L-050 [tags: docs] [status: active]: A shipped template carried a repo-local task ID — `SPRINT.md.template`'s Retro line and DOCS_Guide §10 both pointed at lean-flow's own `TASK-040`, surviving multiple L-015 consumer-leak sweeps because those sweeps grep for repo-specific PATHS (`scripts/…`, `docs/knowledge-index.md`), not repo-local IDs (SPRINT-031: found only when the referenced task was archived and the pointer dangled). Consumer-leak sweeps must also match ID namespaces (`TASK-`/`TD-`/`L-`/`ADR-` + repo names) inside `skills/**/templates/` + `references/`.
- seen: Sprint-031
- count: 1
- promoted: no
- related: L-015 (consumer-leak class — promoted) · L-048 (same shape for version strings: the sweep only finds what its pattern names)

---

## L-049 [tags: process] [status: promoted] → promoted: yes → `.claude/CLAUDE.md` Edit-safety trap **(c)** (the fan-out leg: the per-unit output FILE is the success signal, not the agent's reply). A graphify extraction subagent was killed mid-run by a session limit AFTER writing valid chunk JSON — the reply channel reported failure, the file-on-disk protocol recovered the work with zero re-extraction. Design dispatches so each unit writes to a known path and the coordinator verifies the artifact. Seen 2026-07-29 (graphify reference run, non-sprint) · promoted as part of the 5-entry cluster (4 sprints). Related: L-046 · dispatch.md § Merge-back queue · night-run.md (per-task commit as durable checkpoint).

---

## L-048 [tags: tooling] [status: active]: release-patch bumps only the manifest cascade — a version string echoed OUTSIDE the manifests (README footer `v1.14.1`) shipped stale in the same release commit; qa-check's footer↔manifest lint caught it one step later (SPRINT-030 batch: v1.14.2 released, footer fixed in a trailing commit). Version echoes live outside the skill's step-5 stale-doc clear (which only sees `last_updated:` frontmatter) — at release, grep the OLD version string repo-wide before emitting the push gate.
- seen: Sprint-030
- count: 1
- promoted: no
- related: L-013 (a check is only real if it runs — qa-check ran and caught it, but post-release)

---

## L-047 [tags: process] [status: active]: A derived view regenerated mid-wave is stale on arrival — `gen-index.sh` ran while two parallel agents were still writing their research docs, so the very next `qa-check` FAILed "knowledge index STALE" (SPRINT-028: the coordinator regenerated after T1's notification but before T2/T3 landed). The coordinator owns not just the regen but its *timing*: regenerate derived views (index, graph view, any generated artifact) only after the whole wave settles, immediately before the gate that checks them.
- seen: Sprint-028
- count: 1
- promoted: no
- related: L-013 (a check is only real if read) · TASK-040 guardrail (ii) (read-time staleness must fail LOUD — it did, working as designed)

---

## L-046 [tags: tooling] [status: active]: Agent worktrees fork from the REMOTE default branch, not local HEAD (unless `worktree.baseRef: "head"`) — a wave dispatched over unpushed local commits hands every agent a tree missing them (SPRINT-026: both agents lacked the very research docs they were briefed on; both correctly fell back to `git show main:<path>`). Brief the read-fallback explicitly, or set baseRef; the three-way merge reconciles the stale base as long as agents touch only their own files. Encoded in dispatch.md § Worktree dispatch protocol (base-ref caveat).
- seen: Sprint-026
- count: 1
- promoted: no
- related: L-044 · L-043 · dispatch.md base-ref caveat

---

## L-045 [tags: process] [status: promoted] → promoted: yes → `.claude/CLAUDE.md` Edit-safety trap **(c)**. A piped quality gate masks its exit code — `qa-check.sh | tail` returns *tail's* status, so a vocab-tag lint FAIL sailed into an `&&`-chained commit unseen (SPRINT-025). **First occurrence of the class, and the promotion miss itself is the lesson**: the recurrence ten sprints later was filed as a *new* entry (L-057) rather than a `count` bump here, so `count` stayed at 1 on both and the `count ≥ 2` promotion trigger never fired — at close, check whether a "new" learning is an existing entry's second sighting. Seen Sprint-025 · promoted as part of the 5-entry cluster (4 sprints). Related: L-013 · L-057.

---

## L-044 [tags: tooling] [status: promoted] → promoted: yes → dispatch.md § Merge-back queue (leave the worktree dir before removing it; retry from a fresh shell — the Windows handle-lock caveat). Seen Sprint-025 + Sprint-026 (count 2). Related: L-043 · docs/research/fog-fleet-orchestration.md.

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

## L-020 [tags: process] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern + DoD (wire a new capability into every triggering/chaining job; verify it fires end-to-end). Seen Sprint-022 + Sprint-024 (count 2). Related: L-007 · L-015.

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

## L-009 [tags: edit-safety] [status: promoted] → promoted: yes → CLAUDE.md anti-pattern (structure-adjacent edits — table rows / list entries — silently fuse or corrupt neighbors; re-read the structure after the edit; fresh-context review catches author-blind corruption). Seen Sprint-007 + Sprint-028, + a 3rd found at 029 promote (TASK-006's TODO.md heading fused into TASK-099's block) (count 3). Related: L-006.

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
