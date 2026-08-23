---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: Skill roster, the loop, gates, modes, or tiers changed
status: current
---

# lean-flow — CONTEXT

SSOT for the loop, roster, gates, modes, tiers, and sprint model. README and CLAUDE.md defer here; this file points to their prose rather than duplicating it (cap: ADR-007).

## The loop

`/prime → (/task-decomposer → /triage →) /lean-doc-generator promote → /orchestrator → repeat` · session end → `/handoff` (temp-dir doc) → next `/prime` reads it.
Every skill works standalone; the loop is just the order they reward most together. (Diagram → README.)

## Skill roster (14 — 12 stage-skills · 1 conductor · 1 decision aid)

| Skill | Role | One-line purpose |
|---|---|---|
| `/flow` | **conductor** | opt-in — drives the whole loop, calling stage-skills in sequence; enforces gates + governance, never auto-approves |
| `/prime` | entry | ordered context load + health check (read-only) — incl. a `Skills:` freshness row: installed base-dir version vs repo manifest (report, never a block) |
| `/lean-doc-generator` | plan | WHY/WHERE docs · ADRs · **epic** (open a multi-sprint outcome) · sprint promote/close · **migrate** (adopt + clean) · **init** (scaffold fresh) — bundles templates + standard; **creates** every core doc, `/task-decomposer` consumes them |
| `/orchestrator` | build | gate-driven execution — `quick` · `mvp` · `sprint-bulk` |
| `/task-decomposer` | feed | intent / ticket / PRD / epic-slice → `TASK-NNN` (or a **fog-map** when work's too foggy to plan) — **the detailed grill lives here** (intake). **Consumes docs, never creates them** |
| `/triage` | groom | re-prioritise + state the Backlog; flag stale/dupe/conflict; route rejects to `.out-of-scope/` |
| `/prototype` | explore | throwaway code to answer one design question; capture → ADR/PRD, delete |
| `/tdd` | test-first | build NEW behaviour test-first — vertical-slice red-green-refactor |
| `/diagnose` | fix | 6-phase systematic debugging with a regression test |
| `/refactor-advisor` | deepen | find shallow→deep refactors (seams, deletion test); design the deepening |
| `/release-patch` | ship | manifest-detect PATCH bump + changelog; stops before push |
| `/handoff` | continuity | compact the conversation → temp-dir doc for the next session |
| `/insights` | learn | anytime — a friction → an `L-NNN` candidate in `LEARNINGS` (or bump a match's `count`); complements the Sprint-Close Retro |
| `/council` | decide | **opt-in, agent-using** — pressure-test a hard call via 5 advisors + peer review → `verdict-<slug>.md` → ADR |

**Grill** at intake (`/task-decomposer`); G2 re-grills residuals (an unconfirmed assumption blocks G2). Both run **by frontier round** — batch every question whose prerequisites are settled into one popup, serialise only dependents (dependency is the discriminator, not count); facts are the agent's job to resolve, never the user's. **Implement routing** (`/orchestrator`):
new behaviour→`/tdd` **(default, test-first)** · bug→`/diagnose` · hard-to-change→`/refactor-advisor` · docs/spike→direct. `/prototype` feeds design (can't resolve on paper → fold into G2 + ADR); `/council` feeds a hard fork → verdict → ADR §4.

## Built-in leverage

lean-flow ships **no custom agents/hooks** — it dispatches Claude's built-ins in **isolated passes** (fresh context): recon→`Explore` ·
`/code-review` (small/med → one scoped `sonnet`; **Standards vs Spec** reported separately; the worst finding per axis feeds **one bounded builder retry** — attended auto; unattended only per ADR-022's mechanical carve-out, → `review-scoping.md` § The revise loop) · `/verify` · `/security-review` ·
`/council` (internal sub-agents); commands `/goal /plan /batch /loop /run /simplify`. Wiring → docs/architecture/overview.md § Key integration points.

**Standalone contract** — stage-skill cross-refs are routing *suggestions* (`→ /X`), never requirements; each completes its job
invoked cold. Only inherent ordering: the sprint lifecycle. **`/flow` is the sole exception** — it *sequences* the stages, never
re-implements one. **Bug intake** — a bug (`BUG.md.template`) enters at `/triage` → trivial known cause = `TASK` · needs investigation = `/diagnose` · architectural = `TD-NNN`.

**Curated, not copied** — review, not a feature ban; cleared "useful **and** important **and** actually used" (full rationale → CLAUDE.md · ADR-001).

## Gates

| Gate | Name | Where | Checks |
|---|---|---|---|
| G1 | Scope | all `/orchestrator` modes | goal restated · size S/M/L (**L splits — but `promote` size-checks first, since G1 runs after the Plan is frozen and splitting then costs a `scope-change`**) · files/blast-radius · out-of-scope named · assumptions confirmed · decomposer-approved task → fast-path confirm (scope unchanged?) |
| G2 | Design | `mvp` · `sprint-bulk` | approach + WHY · verifiable micro-tasks (each notes its mechanical check where one exists; that check's FAIL blocks a *silent* tick — owner override recorded, ADR-021) · ADR if hard-to-reverse · `risk:high` on auth/input/secrets/data → one-line abuse-case sketch · **overlap-ownership map** (shared files → single owner + commit order, before first task) · residual grill until unambiguous |

Humans approve gates — the skill never self-approves; G1/G2 are inline, human-approved checklists. Review may dispatch an isolated built-in or ad-hoc subagent (`/code-review` et al.) — lean-flow ships no custom agent definitions.

**A guard is placed in time, not only in text** — for any rule that guards something, ask *when does this fire relative to the thing it guards, and what else changes in that same commit?* One that fires after its subject froze (G1 splitting an `L` the Plan already locked), or that a change in its own commit disarms (`status: closed` silencing the sprint checks), is an absent guard wearing the shape of a present one; review reads what a rule says, never when it runs (L-105 ×2 — L-099's temporal sibling).

**A criterion is reachable only after the decisions it rests on are taken** — L-105's criterion-side sibling: that rule asks when a *guard* fires, this one asks when an *acceptance* becomes checkable. The Plan freezes at **promote**, but the run mode, dispatch shape and routing are ruled at **G2**, so a criterion resting on one of those is unreachable before anyone notices — SPRINT-060 T5 required *"a real unattended run that stops mid-Plan"*, and G2's correct ruling of *interactive* (four of five tasks were HITL) silently foreclosed the only vehicle; by the time T5 was reached any run would **park** it rather than leave it `unattempted`, which is a different state and not the one the criterion tested. Neither gate caught it, because both read a criterion for *clarity* and never for what it rests on that is not yet decided. At G2, per task: *does this acceptance depend on anything I am deciding right now — and if I decide it the other way, is the criterion still checkable?* (L-111 ×2 — the second sighting refused a night run at pre-flight rather than parking 2 of 2.)

**A guard is matched by shape, not by substring** — L-105's spatial sibling one level down. A keyword search standing in for a structural claim fails *green*, and a markdown corpus is **self-describing**: logs quote formats, docs carry worked examples, fixtures are named after what they test — so any grep over it eventually matches prose *about* the search (a reaper read its own format documentation as this run's output and dropped a task; a must-FAIL fixture passed because its slug was `unrevisited`). A false positive on a substring is a false negative on the contract. Anchor the match to a **position** (a line starting `Tn · <state> · `), scope it to the **window that can legitimately contain a hit** (what *this run* appended, not the whole append-only file), and never name a fixture after a token its own assertion greps for. **The newest sighting is a verbatim repeat of a recorded one** — a `TECH-DEBT.md` census counting the ledger's own *legend line* as a resolved row, the same file and the same string as an earlier entry, with this rule loaded; caught only because open+resolved overshot the total by one. Sightings are tallied in `docs/LEARNINGS.md` (L-108), not here: a count copied into a second place drifts from the one it copied, which is how this line came to claim three against a ledger recording six.

**A value written into a frozen artifact is a query result** — L-105's sibling at *authoring* time. An assumption, a DoD, an acceptance threshold: each is read later by someone who cannot re-derive it, against a Plan nobody can amend cheaply, so it earns the same second query as a live search — once when written, again at execution. Two grains, one failure: a **figure** (`~121` sites into an assumption; the real count was 39, making the DoD unsatisfiable the moment it froze) and a **structural claim about another document** ("the checker reads §14's tables", copied into three artifacts; §14 is the legend and holds no per-rule table). The cross-check clause does not fire here on its own because *authoring feels like planning, not querying* — which is why the durable form names the artifact kinds rather than the activity (L-130 ×2 · L-136). **A third grain: an identifier for a new row** (`TD-NNN` · `TASK-NNN` · `L-NNN`) — derive the maximum in use, never increment the one you remember. Nothing rejects a duplicate id, and a second row carrying an existing number reads as an edit to the first rather than as a collision (L-143 ×2).

**A decision recorded where its reader cannot reach it is not a decision** — the L-105 family's *destination* sibling: those rules ask when a guard fires and whether a written value was ever queried; this one asks **who reads this to act on it, and can they reach where I am about to write it.** A ruling filed outside the artifact its consumer parses leaves the system behaving exactly as if it had never been taken — and it fails *silently*, because the author saw themselves decide. Four sightings, four different consumers: eleven `scope-out` dispositions in `docs/research/` where the engine dispatches on the spec's Mark column, so every adopter's report named them as checks the standard owes and has not written (ADR-028); a gate sign-off in the launching transcript rather than the sprint frontmatter, which an unattended run reads and nothing else (L-099); a collapse ruling in a commit message rather than the entry it governs; and close-Retro **follow-ups** named only in a sprint's own summary rather than `TODO.md` — the Backlog is what `promote` reads, so `TASK-254/255/256` were invisible to every promote that followed and were satisfied later by coincidence of scope, not by routing. **The test at authoring time is one question, and it is about the reader, never the record** (L-151 ×4).

**Unattended** (headless night-run) — charter **execute-only**: run a promoted Plan, decide nothing. **Declared** at trigger (`sprint-bulk unattended`), never inferred. **Absence ≠ consent**: headless has *no ask channel* (`AskUserQuestion` unregistered; `dontAsk` auto-denies) — missing channel/denial/timeout = BLOCK, never a default-yes, and never reason the answer out yourself.
A HITL step is **parked** (record → continue disjoint AFK → clean halt via `/handoff`), never asked, decided, or worked around; boundary derives from **AFK-safe = additive + reversible + already-approved-in-scope**; a gate is pre-signable only if its subject is frozen at pre-flight. Table + protocol → `orchestrator/references/night-run.md` Part 0.
**Every exit emits a rollup** — `run · N of M DoD ticked` + a line per non-green (incl. `unattempted`), written by the launcher, not asked of the run: a run can end mid-Plan and exit `success`, and a bookkeeping step nothing depends on is the first an agent drops (ADR-016).
**Prepare, then launch** — "run a night run for `<X>`" is compound: the *interactive* session runs feed → promote → pre-flight (gates and all) and fires the trigger only once pre-flight is green. A mode keyword never bypasses the feed pipeline, and the run is never spawned against an unpromoted Plan — step 0's guard sits inside the spawned process, too late to ask (Part 1a).
**Scope the terminal step hardest** — an autonomous run's **shared landing path** (merge-back · the clean-halt `/handoff`) is the one point every unit funnels through, so a denial *there* costs the whole run, however many units succeeded, while a per-task denial costs one task. Pre-flight covers the commands the run needs to **finish**, not only the ones its tasks need to work; generally, a single integration point earns the scrutiny normally spent on the fan-out (L-072, ×2).

## Modes (`/orchestrator`)

| Mode | Gates | Use when |
|---|---|---|
| `quick` | G1 | single small low-risk task |
| `mvp` | G1 + G2 | feature work, medium+, multi-step |
| `sprint-bulk` | G1+G2 once | auto-loop the Active Sprint task list |

## Model tiers (dispatch discipline · ADR-010)

Route by **nature, not size — ambiguity & consequence up, volume & repetition down**. lean-flow controls only the models it **dispatches** (Agent-tool `model:`); the session model is advisory. **Role-based + remappable** — undefined role → next-strongest defined.

| Role (default) | Fires on |
|---|---|
| `decision` → **Opus** *(session · advisory)* | gates · grill · design · synthesis · review judgment · council chairman |
| `execution` → **Sonnet** *(dispatched)* | implement · recon (`Explore`) · council advisors + review · research |
| `mechanical-ingest` → **Haiku** *(dispatched)* | bulk extraction · validation · triage · high-volume reads |

**Fable = manual escalation, no dispatch row** — invoke by hand when execution fails twice or a fork is ADR-grade (opt. `/council`); **no automated ladder** (a fail point may dispatch a built-in — never a hook). Contract: spawn-with-brief — execution dispatch hands the subagent its **procedure skill** (runtime Skill invocation on a `general-purpose` agent), not a re-described brief; G1/G2 + review guard quality. Full doctrine → ADR-010; dispatch-by-classification + parallel/sequential + the **pre-dispatch preflight** (cycle · ownership · base-ref · waves) → `orchestrator/references/dispatch.md`.

## Sprint model

- **`docs/epic/EPIC-NNN-<slug>.md`** (+ lazy `INDEX.md`) = a **multi-sprint outcome** with its own decision set — `EPIC.md.template`; 200 soft. Admission test in order: outcome not nameable → fog (`--fog`) · nameable but fits one sprint → a sprint · otherwise an epic. Created by `/lean-doc-generator epic`, **consumed** by `/task-decomposer --epic` (which never creates one). `promote` stamps `epic:` on a member sprint and appends its row; `close` completes that row and closes the epic only when every § Closed-when condition is `[x]` — a member sprint closing is not an epic closing.
- **`TODO.md`** = Backlog pool (P0–P3); § Active Sprint is a pointer. **`TECH-DEBT.md`** (root) = the `TD-NNN` ledger — filed at close, aged at promote. `/triage` grooms both.
- **`docs/sprint/SPRINT-NNN-<slug>.md`** = the active sprint (`SPRINT.md.template`), **400 hard**: Theme · Scope · Plan (Tn + **DoD `[ ]`**) · Owner-action · Decisions→ADR · Assumptions · Files Changed · **Retro** (§10). Its **Execution Log** is an *uncapped sibling* — `docs/sprint/logs/SPRINT-NNN-<slug>.md` (`sprint-log.md.template`, created lazily at the first entry; **ADR-014**): append-only, plan frozen at promote — a mid-sprint scope shift logs a `scope-change` **there** (what broke · impact · re-confirm G2) before the Plan is edited. The `logs/` subdirectory is load-bearing — the sprint-file checks glob `docs/sprint/SPRINT-*.md` non-recursively, so a same-dir `-log.md` suffix would be capped and schema-checked as a Plan.
- Flow: `promote` renders the sprint (sets `plan_commit`) → `sprint-bulk` loops the DoD → execute appends to the Log → `close` writes the Retro, routes buckets, sets `close_commit`. `/prime` counts open DoD.
- A task's **`Layers:` is a live declaration, corrected per task — not a frozen prediction to defend.** Written at promote, it cannot name the files implementation invents; a mid-sprint `Layers:` edit is the expected cost of declaring before the work, so log it, declare it, continue (L-100).
- **Streams** (optional) — parallel streams run one active sprint *each* (`stream:` frontmatter · one pointer per stream); cross-stream file overlap → coordinate, never parallel-build. **Disjoint tasks may parallel-build in isolated worktrees** (one `Agent(isolation:"worktree")` per task + coordinator merge-back queue → `orchestrator/references/dispatch.md`); L-042's per-hunk staging rule (`git add -p` + verify `git diff --cached`, never a plain `git add <shared>` over another's WIP) binds **intra-tree** — one shared working tree, or the coordinator staging merge resolutions. Single-stream omits `stream:`.

## Doc standard

**Creates vs consumes** — `/lean-doc-generator` creates every core doc (`epic` · `prd` · sprint · ADRs · `migrate`/`init`); `/task-decomposer` consumes them and emits tasks. Two things share the name "PRD": the **working feature PRD** is disposable intake scaffolding the decomposer synthesizes to slice against (not a §2 file), while **`docs/product/requirements.md`** is the durable project-scoped core doc — pipeline is *feature PRD → sanitize → requirements.md*, and that write is the generator's. `--prd <path>` always means *consume*.

LEAN standard on the **TemiDev repo-structure core** (ADR-012; WHY/WHERE, never HOW) → `spec/STANDARD.md` (the SSOT — ADR-023): §2 lifecycle-bound core · §6 four-tier scaffold (cap-hit → split into tree; when the growth is an **append-only series** it splits to a `logs/` sibling instead — ADR-014's mechanism, now carried by both the `sprint/logs/` and `research/logs/` rows) · §12 Git boundary; templates → `…/templates/` (33 core + 2 non-core). Domain glossary lives **here** when the project has terms worth fixing (canonical + `_Avoid_:` synonyms) — **create-lazily**, never pre-created empty (STANDARD §7); lean-flow has none yet, and `/refactor-advisor` adds the first term when one is named. ADRs only when hard-to-reverse **and** surprising **and** a real trade-off (§4).

## Orientation

Where-things-live = **`docs/architecture/overview.md`**; no hand-maintained codemap (it rots — LAW 3). graphify: not integrated — on-demand only, for onboarding or a pre-refactor audit (verdict → `docs/research/graphify-daily-value.md`).

## Continuous learning governance

Every iteration feeds the next (full rules → STANDARD §10/§11). **Close** Retro auto-files four buckets: Shipped→CHANGELOG · Tech debt→`TD-NNN` ·
**Deferring a question** — before parking one for want of evidence, name the **class of fact** that would close it: a *measurement* · a *documented behaviour* · a *judgement call*. Only a measurement accumulates; a documented behaviour is closed by reading and a judgement call by ruling, so "unblock when a measurable signal appears" parks those two **forever** (L-094).
Follow-ups→`TASK-NNN` · Learnings→`L-NNN`. **Promote** checkpoint: promote any `L-NNN` (`count ≥ 2, promoted: no`) → durable rule **placed by §10's placement test** —
ask which flows can hit the failure, place it where all of them read (a skill red-flag fires in that skill's flow alone); age TD; doc-aging. Propose → approve, never silent. Learnings + ADRs + research carry ADR-009 metadata; the by-tag/-domain index is **generated** into `docs/knowledge-index.md`, lint-checked by `qa-check.sh`.

## Task entry shape

```
- [ ] TASK-NNN — <verb-first title>  [size: M] [risk: med] [HITL|AFK]
      class:     decision | execution | mechanical-ingest   (advisory default — dispatch may override, ADR-010)
      done-when: <observable outcome>
      touches:   <files / layers>
      depends-on: <TASK-NNN/Tn list, or none>
      assumes:   <key assumptions, or none>
      tracker:   <ticket URL, or none — justification>
      origin:    decomposer | close-retro | triage-bug | manual   (where the task came from — set by whoever files it)
      state:     ready | needs-info | blocked   (Backlog only; set by /triage)
```

**States** — `ready` (promotable) · `needs-info` (open questions) · `blocked` (`depends-on`). Orthogonal to `HITL`/`AFK` (who acts). Rejected work → `.out-of-scope/<slug>.md` (lazily created by `/triage`).
**Origin** gates G1's fast-path: only `origin: decomposer` met the intake grill, so only it confirms scope in one line — every other origin gets the full G1 checklist. A **fact about where the task came from**, never a self-assessed "was it grilled?" and never inferred from `tracker:`; close-Retro follow-ups and `/triage`-converted bugs are stamped by the skill that files them.
**QA (optional, never a gate)** — a task may note a `qa:` hint (tests/lint/security/perf to suggest at Review) — a suggestion for the owner, not a requirement.
