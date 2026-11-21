---
owner: Maintainer
last_updated: 2026-11-16
update_trigger: Skill roster, the loop, gates, modes, or tiers changed
status: current
---

# lean-flow — CONTEXT

SSOT for the loop, roster, gates, modes, tiers, and sprint model. README and CLAUDE.md defer here; this file points to their prose rather than duplicating it (cap: ADR-007).

## The loop

`/prime → (/task-decomposer → /triage →) /lean-doc-generator promote → /orchestrator → repeat` · session end → `/handoff` (temp-dir doc) → next `/prime` reads it.
Every skill works standalone; the loop is just the order they reward most together. (Diagram → README.)

## Skill roster (16 — 12 stage-skills · 1 conductor · 1 decision aid · 2 utilities)

| Skill | Role | One-line purpose |
|---|---|---|
| `/flow` | **conductor** | opt-in — drives the whole loop, calling stage-skills in sequence; enforces gates + governance, never auto-approves |
| `/prime` | entry | ordered context load + health check (read-only) — incl. a `Skills:` freshness row: installed base-dir version vs repo manifest (report, never a block) |
| `/lean-doc-generator` | plan | WHY/WHERE docs · ADRs · **epic** (multi-sprint) · sprint promote/close · **migrate** (adopt + clean) · **init** (scaffold fresh); both write the repo profile — bundles templates; **creates** every core doc, `/task-decomposer` consumes them |
| `/orchestrator` | build | gate-driven execution — `quick` · `mvp` · `sprint-bulk` |
| `/task-decomposer` | feed | intent / ticket / PRD / epic-slice → `TASK-NNN` (or a **fog-map** when work's too foggy to plan) — **the detailed grill lives here** (intake). **Consumes docs, never creates them** |
| `/triage` | groom | re-prioritise + state the backlog (`docs/work/backlog/`); flag stale/dupe/conflict; route rejects to `.out-of-scope/` |
| `/prototype` | explore | throwaway code to answer one design question; capture → ADR/PRD, delete |
| `/tdd` | test-first | build NEW behaviour test-first — vertical-slice red-green-refactor |
| `/diagnose` | fix | 6-phase systematic debugging with a regression test |
| `/refactor-advisor` | deepen | find shallow→deep refactors (seams, deletion test); design the deepening |
| `/release-patch` | ship | manifest-detect PATCH bump + changelog; stops before push |
| `/handoff` | continuity | compact the conversation → temp-dir doc for the next session |
| `/insights` | learn | anytime — a friction → an `L-NNN` candidate in `LEARNINGS` (or bump a match's `count`); complements the Sprint-Close Retro |
| `/council` | decide | **opt-in, agent-using** — pressure-test a hard call via 5 advisors + peer review → `verdict-<slug>.md` → ADR |
| `/humanizer` | utility | rewrite AI-sounding prose in place; EN catalog vendored from blader/humanizer (MIT) + overlay + ID catalog; audit, EN↔ID if asked. Not a stage, so `/flow` does not name it; wired: `/lean-doc-generator` · `/release-patch` · `/handoff` · commit messages (inline) · PR bodies (child) |
| `/diagram` | utility | Mermaid + evidence table: each box and arrow tied to a source line; standalone |

**Grill** at intake (`/task-decomposer`); G2 re-grills residuals (an unconfirmed assumption blocks G2). Both run **by frontier round** — batch every question whose prerequisites are settled into one popup, serialise only dependents (dependency decides, not count); facts are the agent's job to resolve, never the user's. **Implement routing** (`/orchestrator`):
new behaviour→`/tdd` **(default, test-first)** · bug→`/diagnose` · hard-to-change→`/refactor-advisor` · docs/spike→direct. `/prototype` feeds design (can't resolve on paper → fold into G2 + ADR); `/council` feeds a hard fork → verdict → ADR §4.

## Built-in leverage
lean-flow ships **no custom agent definitions and no hooks today** — both are *admissible* under ADR-044, held to ADR-001's bar, and the first hook candidate was withdrawn at review (TASK-366). It dispatches Claude's built-ins in **isolated passes** (fresh context): recon→`Explore` ·
`/code-review` (small/med → one scoped `sonnet`; **Standards vs Spec** reported separately; the worst finding per axis feeds **one bounded builder retry** — attended auto; unattended only per ADR-022's mechanical carve-out, → `review-scoping.md` § The revise loop) · `/verify` · `/security-review` ·
`/council` (internal sub-agents); commands `/goal /plan /batch /loop /run /simplify`. Wiring → docs/architecture/overview.md § Key integration points. Cross-model route (opt-in): another provider's CLI may review, build or diagnose; see `orchestrator/references/cross-model-route.md`.
cross-model: draft-review, design-review, code-review, build, diagnose via codex

**Standalone contract** — stage-skill cross-refs are routing *suggestions* (`→ /X`), never requirements; each completes its job
invoked cold. Only inherent ordering: the sprint lifecycle. **`/flow` is the sole exception** — it *sequences* the stages, never
re-implements one. **Bug intake** — a bug enters at `/triage` as a `type: bug` item → trivial = `ready` · unknown = `/diagnose` (fills its root cause) · architectural = `TD-NNN`. **Curated, not copied** — review, not a feature ban; cleared "useful **and** important **and** actually used" (full rationale → CLAUDE.md · ADR-001).

## Gates

| Gate | Name | Where | Checks |
|---|---|---|---|
| G1 | Scope | all `/orchestrator` modes | goal restated · size S/M/L (**L splits — but `promote` size-checks first, since G1 runs after the Plan is frozen and splitting then costs a `scope-change`**) · files/blast-radius · out-of-scope named · assumptions confirmed · decomposer-approved task → fast-path confirm (scope unchanged?) |
| G2 | Design | `mvp` · `sprint-bulk` | approach + WHY · verifiable micro-tasks (each notes its mechanical check where one exists; that check's FAIL blocks a *silent* tick — owner override recorded, ADR-021) · ADR if hard-to-reverse · `risk:high` on auth/input/secrets/data → one-line abuse-case sketch · **overlap-ownership map** (shared files → single owner + commit order) · fresh-reader builder check · residual grill until unambiguous |

Humans approve gates — the skill never self-approves; G1/G2 are inline, human-approved checklists. Review may dispatch an isolated built-in or ad-hoc subagent (`/code-review` et al.) — lean-flow ships no custom agent definitions.

**A guard is placed in time, not only in text** — ask when it fires relative to its subject and what else changes in the same commit. A guard firing after its subject freezes, or disarmed by its own commit, is absent; check timing as well as wording (L-105 · L-099).

**A criterion is reachable only after the decisions it rests on are taken** — the Plan freezes at **promote**; run mode, dispatch shape and routing are ruled at **G2**. At G2, ask per task whether acceptance depends on a decision being made now and stays checkable under the other choice (L-111).

**A guard is matched by shape, not by substring** — markdown describes itself: quoted formats, examples and fixture names can match without satisfying the contract. Anchor to a **position** (e.g. `Tn · <state> · ` at line start) and the **window that can legitimately contain a hit** (this run's append, not the whole log); never name a fixture after a token its assertion greps for. Sightings and counts belong in `docs/LEARNINGS.md` (L-108), never copied here.

**A value written into a frozen artifact is a query result** — figures, structural claims, assumptions, DoD, thresholds and new row ids: apply `.claude/CLAUDE.md` § Behavioral Guidelines, cross-check bullet (L-130 · L-136 · L-143). In multi-lane runs, each lane derives ids inside its booked range; only the coordinator reads named lane worktrees past the `.claude/worktrees/` exclusion (→ `orchestrator/references/coordinator.md`).

**A decision recorded where its reader cannot reach it is not a decision** — at authoring time ask who reads it to act, and whether they can reach this destination. Write the ruling in the artifact its consumer parses (a gate sign-off → the sprint frontmatter `gates_signed:`; a close-Retro follow-up → `docs/work/backlog/`); an unreachable ruling silently has no effect (L-151).

**Unattended** (headless night-run) — **execute-only**: run a promoted Plan, decide nothing. Declare at trigger (`sprint-bulk unattended`), never infer. **Absence ≠ consent**: no ask channel (`AskUserQuestion` unregistered; `dontAsk` auto-denies); missing channel/denial/timeout = BLOCK, never default-yes or self-reasoned approval.
A HITL step is **parked**: record → continue disjoint AFK → clean halt via `/handoff`; never ask, decide or work around it. **AFK-safe = additive + reversible + already-approved-in-scope**; pre-sign a gate only if its subject is frozen at pre-flight. Table + protocol → `orchestrator/references/night-run.md` Part 0.
**Every exit emits a rollup** — launcher writes `run · N of M DoD ticked` + a line per non-green (incl. `unattempted`), never relies on the run: a mid-Plan exit can report `success` (ADR-016).
**Prepare, then launch** — "run a night run for `<X>`" means interactive feed → promote → pre-flight (including gates) → trigger only when green. No mode keyword bypasses feed; never spawn on an unpromoted Plan. The spawned step-0 guard is too late to ask (Part 1a).
**Scope the terminal step hardest** — pre-flight checks commands needed to **finish**, including shared merge-back and clean-halt `/handoff`. A denial there costs the whole run; scrutinise a single integration point as closely as the fan-out (L-072).

## Modes (`/orchestrator`)

| Mode | Gates | Use when |
|---|---|---|
| `quick` | G1 | single small low-risk task |
| `mvp` | G1 + G2 | feature work, medium+, multi-step |
| `sprint-bulk` | G1+G2 once | auto-loop the active sprint's member tasks |

**`overnight`** is the **canonical** name for the unattended headless run; its aliases (`night-run` · `unattended` · `sprint-bulk unattended`) still resolve, and an unrecognised mode string is refused, never defaulted → `orchestrator/SKILL.md` § Mode dispatch · `orchestrator/references/night-run.md` Part 0.

**Continuation contract** — a run does not pause between tasks the owner already approved, and ends at exactly one of five terminal states, named in the rollup by the launcher: `PLAN_EXHAUSTED` · `AUTHORITY_BOUNDARY` · `HARD_FAILURE` · `BUDGET_STOP` · `USER_STOP` → `orchestrator/references/night-run.md` Part 0b.

## Model tiers (dispatch discipline · ADR-010)
Route by **nature, not size — ambiguity & consequence up, volume & repetition down**. lean-flow controls only the models it **dispatches** (Agent-tool `model:`); the session model is advisory. **Role-based + remappable** — undefined role → next-strongest defined.

| Role (default) | Fires on |
|---|---|
| `decision` → **Opus** *(session · advisory)* | gates · grill · design · synthesis · review judgment · council chairman |
| `execution` → **Sonnet** *(dispatched)* | implement · recon (`Explore`) · council advisors + review · research |
| `mechanical-ingest` → **Haiku** *(dispatched)* | bulk extraction · validation · triage · high-volume reads |

**`decision-escalation` → Fable**: manual by default on two execution failures or ADR-grade fork (opt. `/council`); **no automated ladder** (fail-point built-in allowed, never hook). Spawn-with-brief: execution gets procedure skill (runtime Skill, `general-purpose`), not paraphrase; G1/G2 + review guard quality. Routing, preflight → `orchestrator/references/dispatch.md`.
Opted in here: intake draft check (`decision-escalation` high, blind Codex pair; cell in `dispatch.md`).

## Sprint model

- **`docs/epic/EPIC-NNN-<slug>.md`** (+ lazy `INDEX.md`): multi-sprint outcome + decisions, `EPIC.md.template`, 200 soft. Admission: unnameable → fog (`--fog`); fits one sprint → sprint; otherwise epic. `/lean-doc-generator epic` creates; `/task-decomposer --epic` only consumes. `promote` stamps member `epic:` + appends its row; `close` completes the row, closing the epic only when every § Closed-when condition is `[x]`. **Coverage (STANDARD §2):** every open condition of an `active` epic ends `→ TASK-NNN[, …]` (open task) or `→ next slice: <name>`; `promote` refuses uncovered conditions without owner override, `/triage` + `/prime` report; `proposed` exempt.
- **`docs/work/`** = the task store (status = folder). **`TECH-DEBT.md`** (root) = the `TD-NNN` ledger — filed at close, aged at promote. `/triage` grooms both. **`docs/product/roadmap.md`** = a lazy delivery plan, rows `Status` + `Covered by`; `/task-decomposer --roadmap <row>` consumes one (read-only); `/prime` + `/triage` flag an uncovered `active` row.
- **`docs/sprint/SPRINT-NNN-<slug>.md`**: active sprint (`SPRINT.md.template`), **400 hard**: Theme · Scope · Plan (Tn meta only; v2 member `## Done when` = DoD, `plan_commit` = freeze, ADR-047) · Owner-action · Decisions→ADR · Assumptions · Files Changed · **Retro** (§10). **Execution Log**: uncapped, append-only `docs/sprint/logs/SPRINT-NNN-<slug>.md` (`sprint-log.md.template`, created at promote with `promote` first; satisfies STANDARD §9, ADR-014). Plan freezes at promote; before editing it, log `scope-change` there (what broke · impact · re-confirm G2). Keep `logs/`: non-recursive `docs/sprint/SPRINT-*.md` checks would cap/schema-check a same-dir `-log.md` as a Plan.
- Flow: `promote` renders the sprint (sets `plan_commit`; no git: a promote-entry snapshot, ADR-054) → `sprint-bulk` loops the DoD → execute appends to the Log → `close` writes the Retro, routes buckets, sets `close_commit`. `/prime` counts open DoD. Before `plan locked`, run `bun scripts/promote-check.ts <sprint-file>` (layers-completeness + 400-char rule; FAIL blocks; this repo only, TASK-368).
- **A sprint commit's SUBJECT is how leg 15 attributes it, so the subject is load-bearing, not prose.** `check-layers-observed` maps `plan_commit..HEAD` in order: `Task:` trailer · `sprint(NNN) Tn:` · `merge(...): Tn` · trailing `(SPRINT-NNN Tn)` (LAST if several) · `sprint(NNN) Tn <qualifier>:` · bare `sprint(NNN):` = COORD · all-governance-files = GOVERNANCE; else **UNATTRIBUTED → FAIL**. Inside a sprint use `sprint(NNN) Tn: …` or `Task:`; `research:` / `todo:` / `fix(...)` belong outside its range. Every file must fit **that task's** `Layers:` (L-151). **A coordinator write is never a task's commit:** status moves undeclared in its Layers, Log/sprint edits and shared files use bare `sprint(NNN):` (L-238).
- **Promote and close run the OPT-IN profile** — `QA_FULL=1 sh scripts/qa-check.sh`; the bare gate omits slow git-repo builders and frozen differential-parity pairs. Off-host: `bun --no-env-file scripts/gate-remote.ts` (`LF_GATE_HOST`/`KEY`/`DIR`).
- A task's **`Layers:` is a live declaration, corrected per task — not a frozen prediction to defend.** For a mid-sprint correction, log it, then edit **the Plan line itself: exact path or `dir/` token, never a glob**; that is what checkers read (L-100 · L-229).
- **Streams** (optional): one active sprint per `stream:`; omit for single-stream. Cross-stream file overlap → coordinate, never parallel-build. Disjoint tasks may parallel-build in isolated worktrees (`Agent(isolation:"worktree")` per task + coordinator merge-back queue → `orchestrator/references/dispatch.md`). **Intra-tree**, including coordinator merge resolutions: `git add -p` + verify `git diff --cached`, never `git add <shared>` over another's WIP (L-042). Multi-stream/repo: one coordinator + one lane session per stream; within a stream one session runs workers, never relays. Split by stream, never step. → `orchestrator/references/coordinator.md` § Lane rotation (ceiling 200k).

## Doc standard

**Creates vs consumes** — `/lean-doc-generator` creates every core doc (`epic` · `prd` · sprint · ADRs · `migrate`/`init`); `/task-decomposer` consumes them and emits tasks. Two things share the name "PRD": the **working feature PRD** is disposable intake scaffolding the decomposer synthesizes to slice against (not a §2 file), while **`docs/product/requirements.md`** is the durable project-scoped core doc — pipeline is *feature PRD → sanitize → requirements.md*, and that write is the generator's. `--prd <path>` always means *consume*.

LEAN standard on the **TemiDev repo-structure core** (ADR-012; WHY/WHERE, never HOW) → `spec/STANDARD.md` (the SSOT — ADR-023): §2 lifecycle-bound core · §6 four-tier scaffold (cap-hit → split into tree; an **append-only series** splits to a `logs/` sibling instead — ADR-014's mechanism, carried by the `sprint/logs/` and `research/logs/` rows) · §12 Git boundary; templates → `…/templates/` (34 core + 2 non-core). Domain glossary lives **here** when the project has terms worth fixing (canonical + `_Avoid_:` synonyms) — **create-lazily**, never pre-created empty (STANDARD §7); lean-flow has none yet; `/refactor-advisor` adds the first when one is named. ADRs only when hard-to-reverse **and** surprising **and** a real trade-off (§4).

## Orientation

Where-things-live = **`docs/architecture/overview.md`**; no hand-maintained codemap (it rots — LAW 3). graphify: not integrated — on-demand only, for onboarding or a pre-refactor audit (verdict → `docs/research/graphify-daily-value.md`).

## Continuous learning governance

Every iteration feeds the next (full rules → STANDARD §10/§11). **Close** Retro auto-files four buckets: Shipped→CHANGELOG · Tech debt→`TD-NNN` ·
**Deferring a question** — before parking one for want of evidence, name the **class of fact** that would close it: a *measurement* · a *documented behaviour* · a *judgement call*. Only a measurement accumulates; a documented behaviour is closed by reading and a judgement call by ruling, so "unblock when a measurable signal appears" parks those two **forever** (L-094).
Follow-ups→`TASK-NNN` · Learnings→`L-NNN`. **Promote** checkpoint: promote any `L-NNN` (`count ≥ 2, promoted: no`) → durable rule **placed by §10's placement test** —
ask which flows can hit the failure, place it where all of them read (a skill red-flag fires in that skill's flow alone); age TD; doc-aging. Propose → approve, never silent. Learnings + ADRs + research carry ADR-009 metadata; the by-tag/-domain index is **generated** into `docs/knowledge-index.md`, lint-checked by `qa-check.sh`.

## Task entry shape

One file per task, `docs/work/<status>/TASK-NNN-<slug>.md` — status is the folder, never a field; a new task is born in `docs/work/backlog/` (`/task-decomposer` writes it there; promote moves it to `todo/`). Full schema → `skills/task-decomposer/references/task-file.md`.

```
---
id: TASK-NNN
title: "<verb-first title>"   type: feature|bug|debt
epic: EPIC-NNN · sprint: SPRINT-NNN   # each only when set (sprint by promote)
priority: P0-P3 · size: S|M|L · risk: low|med|high · autonomy: HITL|AFK · tier: G|X|P
class:     decision | execution | mechanical-ingest   (advisory default — dispatch may override, ADR-010)
authority: J0 | J1 | J2   (whose authority it runs on — declared at promote/G2; ABSENT reads as J2)
origin:    decomposer | close-retro | triage-bug | manual   (set by whoever files it)
state:     ready | needs-info | blocked   (backlog only; set by /triage)
depends-on: [TASK-NNN]
---
## Done when    <- the DoD: observable `- [ ]` outcomes + a `Negative:` box (`n/a: <reason>` if exempt)
```

**States** — `ready` (promotable) · `needs-info` (open questions) · `blocked` (`depends-on`). Orthogonal to `HITL`/`AFK` (who acts).
**Authority** — `J0` · `J1` · `J2`, declared per task, never inferred; absent = J2 → `orchestrator/references/night-run.md` Part 0. Rejected work → `.out-of-scope/<slug>.md` (lazily created by `/triage`).
**Origin** gates G1's fast-path: only `origin: decomposer` met the intake grill, so only it confirms scope in one line — every other origin gets the full G1 checklist. A **fact about where the task came from**, never a self-assessed "was it grilled?" and never inferred from `tracker:`; close-Retro follow-ups and `/triage`-converted bugs are stamped by the skill that files them.
**QA (optional, never a gate)** — a task may note a `qa:` hint (tests/lint/security/perf to suggest at Review).
