<a id="readme-top"></a>

<!-- HERO -->
<div align="center">

# lean-flow

**A lean agentic dev loop for Claude Code** — twelve standalone skills, a one-command conductor, and an opt-in decision council.
<br />**No hooks · no scaffold · no custom agent definitions.** Drop it into any repo and adapt.

[![MIT License][license-shield]][license-url]
[![Claude Code][claude-shield]][claude-url]
[![Skills][skills-shield]][skills-url]
[![Website][website-shield]][website-url]

[Quickstart](#quickstart) · [The skills](#the-skills) · [How it works](#how-it-works) · [Architecture](#architecture) · [Report a bug][issues-url]

</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>

- [Why lean-flow](#why-lean-flow)
- [Quickstart](#quickstart)
- [The loop](#the-loop)
- [The skills](#the-skills)
- [How it works](#how-it-works)
- [What you get](#what-you-get)
- [Adapting to your repo](#adapting-to-your-repo)
- [What lean-flow does NOT do](#what-lean-flow-does-not-do)
- [Architecture](#architecture)
- [Design principles](#design-principles)
- [Provenance](#provenance)
- [License](#license)

</details>

> [!NOTE]
> **Why this exists.** [`dev-flow`](https://github.com/aldianriski/dev-flow) was a brutal
> implementation — every reference bulk-imported, docs bloated past managing. lean-flow is the
> answer: **curated, not copied** — each component reviewed against "genuinely useful · important ·
> actually used" and *approved before adding*. The point isn't fewer features by rule; it's that
> nothing gets in unreviewed.

---

## Why lean-flow

Coding agents fail in recognizable ways. Each skill is the fix for one of them.

**1 · It built the wrong thing.** You assumed it understood you; it didn't.
→ **`/task-decomposer`** grills ambiguous intent *at intake* — by **frontier round**: everything whose
prerequisites are settled is asked together, dependent questions wait their turn, and it stops when
nothing is left assumed. It presents interpretations rather than picking silently, and its assumption
registry surfaces what it's guessing;
**G1 Scope** restates the task as one verifiable sentence; **G2** re-grills anything still open
(an unconfirmed assumption blocks the gate). Align *before* building.

**2 · We keep reworking it.** Scope and design problems surface only after the code exists.
→ The gates run **before any commit**; **`/task-decomposer`** cuts work into tracer-bullet vertical
slices; **`/prototype`** answers a shaky design with throwaway code before you commit to it.

**3 · The code doesn't work.** The agent flies blind without feedback.
→ **`/tdd`** writes the failing test first (red-green-refactor); **`/diagnose`** builds a fast,
deterministic feedback loop *before* hypothesising — the loop is the skill.

**4 · It became a ball of mud.** Agents accelerate coding, so they accelerate entropy.
→ **`/refactor-advisor`** finds shallow modules (the deletion test) and designs the deepening into
small interfaces over deep implementations. Run it every few days.

**5 · The docs rotted; the thread vanished between sessions.**
→ **`/lean-doc-generator`** keeps docs WHY/WHERE-only against locked templates; **`/prime`** reloads
context in a fixed order; **`/handoff`** carries the live thread to the next session.

**6 · The backlog is chaos.** Priorities drift, duplicates pile up, rejected ideas keep returning.
→ **`/triage`** re-ranks, states each task (ready / needs-info / blocked), and routes rejects to an
`.out-of-scope/` memory so they aren't re-litigated.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Quickstart

### Claude Code

Add the marketplace and install the plugin:

```bash
claude plugin marketplace add https://github.com/aldianriski/lean-flow
claude plugin install lean-flow@lean-flow
```

Start a new Claude Code session, then invoke skills with slash commands such as `/prime`.

### Codex

Add the GitHub repository as a Codex marketplace:

```bash
codex plugin marketplace add aldianriski/lean-flow
```

Then start Codex, enter `/plugins`, select the **lean-flow** marketplace, and install and enable
**Lean Flow**. Start a new Codex session so its bundled skills are loaded.

Codex invokes skills with `$` mentions rather than custom slash commands. Plugin skills are
namespaced, so use `$lean-flow:prime` instead of `/prime`:

```text
$lean-flow:prime Prime this repository.
```

You can also enter `/skills` and select any `lean-flow:*` skill. The command examples below use
Claude Code's shorter `/skill-name` spelling; in Codex, use the corresponding
`$lean-flow:skill-name` mention.

### Kimi Code CLI

Install the plugin from GitHub (or from a local checkout), then reload:

```text
/plugins install https://github.com/aldianriski/lean-flow
/plugins install /path/to/lean-flow     # local checkout instead
/reload
```

Kimi invokes skills with `/skill:` slash commands, so `/prime` becomes `/skill:prime`, `/flow`
becomes `/skill:flow`, and so on — or just describe the task and let the model auto-invoke the
skill from its description. Manifest → [`.kimi-plugin/plugin.json`](.kimi-plugin/plugin.json).

Two ways to run it — **conducted** or **à la carte**.

**Conducted** — the whole disciplined loop in one command (gates + governance enforced, never auto-approved):

```text
/flow "add OAuth login"     # drives: prime → feed → gated build → governed close
```

**À la carte** — the same loop, your hand on each step:

```text
/prime                               # load context + health check
/task-decomposer "add OAuth login"   # intent → TASK-NNN backlog entries
/lean-doc-generator promote          # form a sprint from the backlog
/orchestrator sprint-bulk            # build it through the G1 / G2 gates
/lean-doc-generator close            # retro → CHANGELOG · TD · LEARNINGS, then /release-patch
```

The rest — `/triage` · `/diagnose` · `/tdd` · `/refactor-advisor` · `/prototype` · `/handoff` — is
invoked as the work needs it. Every skill also runs **alone**; `/flow` just conducts them in order.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## The loop

```
  /prime ──▶ /lean-doc-generator ──▶ /orchestrator ──┐
   load          plan & document         build, gated │
     ▲           (promote / close)       (G1 → G2 → ship)
     │                                                 │
     └──────────────────── repeat ◀────────────────────┘

  session end → /handoff  ──▶  temp-dir doc  ──▶  next session: /prime reads it
```

1. **`/prime`** — load project context in a fixed order, emit a health check (including a `Skills:`
   row: is the plugin copy this session loaded the same version as the repo, or stale?).
2. **`/lean-doc-generator`** — capture WHY/WHERE (never HOW); run the sprint lifecycle.
3. **`/orchestrator`** — execute through the G1 Scope and G2 Design gates, then commit.
4. Repeat. When a session ends mid-work, **`/handoff`** compacts it so `/prime` can resume next time.

Run it **conducted** (`/flow` drives every stage in order, gates enforced) or **à la carte** (each skill
by hand) — same artifacts either way.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## The skills

One conductor + twelve standalone stages + an opt-in decision council. `/flow` conducts; the twelve
stage-skills each also run **standalone** (none require another); `/council` is for hard forks.

| Stage | Skill | Use it for |
|---|---|---|
| **conduct** | `/flow` | opt-in — run the whole loop in order; enforces gates + governance, never auto-approves |
| **orient** | `/prime` | session start — ordered context load + health check (incl. whether the installed skills match the repo) |
| **plan** | `/lean-doc-generator` | docs / ADRs / sprint promote + close (WHY & WHERE only) — **ships its own templates + standard** |
| | `/task-decomposer` | intent / ticket / PRD → `TASK-NNN` backlog entries (tracer-bullet slices; or a **fog-map** for foggy work too big to plan) |
| | `/triage` | re-prioritise + state the backlog; route rejects to `.out-of-scope/` |
| **build** | `/orchestrator` | gate-driven execution — `quick` · `mvp` · `sprint-bulk` |
| | `/prototype` | throwaway code to answer one design question (logic TUI / web UI variants) |
| | `/tdd` | build NEW behaviour test-first — vertical-slice red-green-refactor |
| **maintain** | `/diagnose` | 6-phase systematic debugging with a regression test |
| | `/refactor-advisor` | find shallow→deep refactors (seams · deletion test) and design them |
| **ship** | `/release-patch` | manifest-detect PATCH bump + changelog; stops before push |
| **continuity** | `/handoff` | compact the conversation → temp-dir doc for the next session |
| **learn** | `/insights` | capture a friction → an `L-NNN` learning candidate anytime; bumps a match toward promotion |
| **decide** | `/council` | opt-in — pressure-test a hard/ambiguous call via 5 advisors → a calibrated `verdict-<slug>.md` (pre-mortem · confidence+dissent · optional gated fact-verify) → feed an ADR (uses sub-agents) |

The feed side is a pipeline: `/task-decomposer` (intake) → `/triage` (groom) → `/lean-doc-generator
promote` (form sprint) → `/orchestrator` (build). Canonical roster · gates · modes →
[`.claude/CONTEXT.md`](.claude/CONTEXT.md).

> [!NOTE]
> **Standalone, not isolated.** Skills cross-reference each other only as routing/handoff
> suggestions (`→ try /X next`), never as requirements — invoke any one cold and it completes its
> own job. The pipeline and routing are the *optimal composition*, not a dependency graph. The only
> inherent ordering is the sprint lifecycle (you can't `close` a sprint you didn't `promote`).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## How it works

A gated loop: you give intent → it becomes tasks → executes with human checkpoints → ships. The
gates are **inline checklists** (lean-flow ships no agent definitions of its own), and the loop dispatches Claude's
**built-in** agents where they help — recon → `Explore`, review → `/code-review`, verify → `/verify`,
security → `/security-review`. `/council` is the one skill that orchestrates sub-agents internally.

**Gates** — humans approve; the skill never self-approves:
- **G1 Scope** (all modes) — goal restated as one verifiable sentence · size S/M/L (an **L splits**) · files / blast-radius · out-of-scope named · assumptions confirmed.
- **G2 Design** (`mvp` · `sprint-bulk`) — approach + one-line WHY · verifiable micro-tasks · an ADR only if the decision is hard-to-reverse **and** surprising **and** a real trade-off · residual grill until the goal is unambiguous (the detailed grill already ran at intake, in `/task-decomposer`).

Before any **parallel wave**, `sprint-bulk` also runs a mechanical **pre-dispatch preflight** — cycle ·
shared-file single-owner · declared-base-vs-HEAD · wave computation — all derived from tokens your sprint
Plan already carries, so there is nothing extra to maintain. A failure halts that wave with a *named*
finding. Not a human gate (nothing to approve); it just refuses to fan out work whose ordering is unsafe.

**Modes** (`/orchestrator <mode>`) — three: `quick` (single small low-risk task, G1 only) · `mvp`
(feature work, medium+, G1+G2) · `sprint-bulk` (auto-loop the Active Sprint task list, G1+G2 once) —
full mode/gate contract → [`.claude/CONTEXT.md`](.claude/CONTEXT.md) (SSOT).

**Unattended runs (night-run)** — a promoted sprint can be executed headless while you sleep:
`claude -p "/orchestrator sprint-bulk unattended" --permission-mode dontAsk --allowedTools "<scoped list>"`,
fired by cron / Task Scheduler. The charter is **execute-only** — the run executes a Plan a human already
approved and decides nothing new. Two rules make that safe. **Unattended is declared, never inferred**
(no signal → it behaves interactively). And **absence ≠ consent**: a headless session has *no ask
channel at all* — `AskUserQuestion` isn't registered there and `dontAsk` auto-denies anything that would
prompt — so a missing channel, a denial, or a missing human is a **BLOCK**, never a default-yes and
never an invitation to reason the answer out and carry on. Anything needing a human (a gate, a grill, `promote`'s governance
sign-off, `close`'s §11 retention, a `/triage` apply) is **parked** — recorded with its unblock condition
— while disjoint AFK work carries on; the run then halts cleanly through `/handoff`, and morning `/prime`
reads it back. It never reshapes a task to dodge a gate. `bypassPermissions` is never the fallback.

**Every run reports how much of the Plan it finished.** A `sprint-bulk` loop is driven by the model, and
nothing outside it checks the Plan was exhausted — so a run can end after four of seven tasks with every
commit correct and still exit `success`, saying nothing about the three it never began. The morning
rollup therefore opens with `run · N of M DoD ticked` at *every* exit, and `unattempted` is a state
alongside blocked, parked, denied and stalled. Asking the run to write that was tried and measured: it
completed all its work and wrote none of its bookkeeping. So the bundled launcher
[`scripts/night-run.sh`](scripts/night-run.sh) emits the rollup and the cost row itself, from the wrapper
that outlives the model — and the QA gate fails a recorded run that is missing one. Fire `claude -p`
directly instead and the format still applies; you just have no guarantee it was written (ADR-016).
Pre-flight + contract → [`skills/orchestrator/references/night-run.md`](skills/orchestrator/references/night-run.md).

**Implement routing** — at the build step, orchestrator routes by work type: new testable
behaviour → `/tdd` · a bug or failing test → `/diagnose` · hard-to-change code → `/refactor-advisor`
· docs / config / spikes implement directly. It also wires Claude's built-in commands — `/goal`
(drive-until-DoD) · `/plan` (G2) · `/batch` (parallel sprint) · `/run` + `/verify` (Review).

**Documentation discipline** — `/lean-doc-generator` follows the LEAN DOCUMENTATION STANDARD: WHY
and WHERE only, never HOW. Its core is the TemiDev repo-structure standard (ADR-012) — a tiered
scaffold (base → backend/integration → medium/complex → multi-service) where every doc carries a
full create/update/archive lifecycle trigger, gated by a §12 Git-boundary rule (what belongs in the
repo vs a secret manager / document store) that `migrate` also scans for on adoption. It bundles its
own canonical templates and reads the matching one *before* generating any core doc, so output
matches a fixed format instead of free-improvising; `init`'s only non-doc writes are a safe-scaffold
allowlist (`.env.example` · `.gitignore` · `LICENSE`, write-if-absent, never overwritten). Standard →
[`skills/lean-doc-generator/references/DOCS_Guide.md`](skills/lean-doc-generator/references/DOCS_Guide.md).

**Continuous learning** — every iteration feeds the next. At **Sprint Close** the Retro auto-files
four buckets to durable homes — *shipped* → CHANGELOG, *tech debt* → `TD-NNN` (root `TECH-DEBT.md`), *follow-ups* →
`TASK-NNN` backlog, *learnings* → `LEARNINGS.md`. At **Sprint Promote** a governance checkpoint
promotes any learning that recurs (**count ≥ 2**) into a durable rule and ages tech debt. Learning
and debt can't silently rot. Governance → DOCS_Guide §10.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## What you get

The skills write durable, human-readable state into your repo — plain markdown, no database, no lock-in:

| Artifact | Written by | Holds |
|---|---|---|
| `TODO.md` | `/task-decomposer` · `/triage` | backlog (P0–P3) · active-sprint pointer(s) |
| `TECH-DEBT.md` | sprint close · `/triage` | tech-debt ledger (`TD-NNN` — filed at close, aged at promote) |
| `docs/epic/EPIC-NNN-*.md` | `/lean-doc-generator epic` | a **multi-sprint** outcome + the sprints that carried it. Skip it when the work fits one sprint |
| `docs/sprint/SPRINT-NNN-*.md` | `/lean-doc-generator` | active sprint plan · files changed · retro (400-line hard cap) |
| `docs/sprint/logs/SPRINT-NNN-*.md` | `/orchestrator` during execution | that sprint's execution log — append-only, uncapped, so it never eats the Plan's budget (ADR-014) |
| `docs/DECISIONS.md` / `docs/adr/` | `/lean-doc-generator` | ADRs — the WHY behind hard-to-reverse choices |
| `CHANGELOG.md` | `/release-patch` · sprint close | what shipped, per release |
| `docs/LEARNINGS.md` | sprint close | confirmed learnings; recurring → durable rules |
| `docs/research/<slug>.md` | `/lean-doc-generator` | a research question → options · evidence · recommendation (feeds an ADR) |
| `docs/research/logs/<slug>.md` | `/lean-doc-generator` | that question's **measurement series** — append-only, uncapped, created lazily at the second round, so a growing body of evidence never has to be deleted to keep the decision doc under its cap |
| `docs/deployment/deployment-guide.md` | `/lean-doc-generator` | the standard-release runbook (push · verify) |
| `docs/deployment/rollback-guide.md` | `/lean-doc-generator` | the rollback procedure |
| `.out-of-scope/` | `/triage` | rejected ideas, so they aren't re-litigated |
| `CLAUDE.md` · `CONTEXT.md` · `docs/architecture/overview.md` | `/lean-doc-generator` | project shape · vocab · where-things-live |

Commit them, and your team — and their agents — start from the same map.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Adapting to your repo

Skills auto-discover at the repo root after install. There is **nothing to scaffold** — the skills
read whatever context files your project already has (`CLAUDE.md`, `README.md`, `TODO.md`,
`docs/CHANGELOG.md`, `docs/ARCHITECTURE.md` — legacy root locations still matched) and degrade
gracefully when one is missing. `/prime` aborts on
nothing. No code-graph dependency — lean-flow neither integrates nor depends on
[graphify](https://github.com/Graphify-Labs/graphify); it's a fine on-demand tool if you're onboarding an
unfamiliar repo or doing a pre-refactor audit (usage + maintenance recipe: `docs/research/graphify-daily-value.md` § Consumer path — a lean-flow-repo decision record, not required reading).

**Already have docs (or ran dev-flow / adlc-flow)?** `/lean-doc-generator migrate` aligns them to
lean-flow's placement · format · wiring — plan → approve → apply, surgically (never deletes your
content), so you're not hand-reconciling or lost in existing code.

**Requirements:** Claude Code CLI. (Node / language toolchains matter only for whatever your own
project needs — lean-flow itself is Markdown.)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## What lean-flow does NOT do

- No app-code generation, CI/CD pipeline, or automated coverage tooling.
- No background hooks, and no agent definitions of its own — the loop leans on Claude's built-in agents (`Explore`, `/code-review`, `/verify`, `/security-review`) rather than re-shipping them. The one skill that orchestrates sub-agents internally is the opt-in `/council`.
- No project scaffold written into your repo (that was dev-flow's `/orchestrator init`).
- No telemetry. Nothing is sent anywhere.

If you want the richer agent roster, gated init scaffold, and ADLC modes, use
[`dev-flow`](https://github.com/aldianriski/dev-flow) / `adlc-flow` instead. lean-flow is the lean cut.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Architecture

Full map — composition rule, the loop, integration points, boundaries →
[`docs/architecture/overview.md`](docs/architecture/overview.md).

<details>
  <summary><b>Repo layout</b> — skills, references, manifests</summary>

```
.claude-plugin/   plugin.json · marketplace.json        (lockstep versions)
.codex-plugin/    plugin.json                           (Codex CLI manifest, lockstep version)
.kimi-plugin/     plugin.json                           (Kimi Code CLI manifest, lockstep version)
skills/           14 skills — /flow conductor + 12 stages + /council (auto-discovered)
  lean-doc-generator/
    references/   DOCS_Guide.md · migration-map.md · ADR-example.md
    templates/    33 canonical doc templates (core, incl. EPIC · SPRINT · ADR · RESEARCH ·
                  DEPLOYMENT · ROLLBACK · BUG · TECH-DEBT · CONTRIBUTING · CODE_OF_CONDUCT ·
                  SECURITY · AGENTS; +2 non-core: DESIGN · QA-TESTCASE = 35 total)
  tdd/references/             testability.md
  diagnose/references/        feedback-loops.md
  task-decomposer/references/ prd-and-slices.md · fog-map.md
  refactor-advisor/references/ deepening.md
  prototype/references/       logic.md · ui.md
  council/                    opt-in agent decision aid
.claude/          CLAUDE.md (shape) · CONTEXT.md (vocab · loop · gates · roster — SSOT)
docs/             architecture/ · development/ · deployment/ · DECISIONS.md · LEARNINGS.md · adr/ · sprint/
TODO.md · TECH-DEBT.md · README.md · CHANGELOG.md · AGENTS.md · SECURITY.md · LICENSE
```

</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Design principles

- **Curated, not copied** — the core discipline. Every component was reviewed against "genuinely useful · important · actually used" and approved before adding — the opposite of bulk-importing from every reference. The bar is review, not a feature ban.
- **Standalone, conducted when you want** — the twelve stage-skills each run alone (none require another); the opt-in `/flow` conductor sequences them through the full loop without bypassing a gate.
- **Ships no custom agent definitions; leverages the built-in ones** — the loop dispatches Claude's built-in agents (`Explore` · `/code-review` · `/verify` · `/security-review`) in isolated passes. `/council` is the one skill that orchestrates sub-agents internally.
- **Lean** — most SKILL.md ≤ ~140 lines; the one skill that needs a canonical format (`lean-doc-generator`) bundles its own templates + standard and stays self-contained.
- **Adaptable** — no required scaffold; skills detect the host project's layout and degrade gracefully.
- **Human-gated** — G1 Scope and G2 Design need explicit sign-off; `/release-patch` never pushes.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Provenance

Distilled from [`dev-flow`](https://github.com/aldianriski/dev-flow). Techniques adapted from
[mattpocock/skills](https://github.com/mattpocock/skills): the ADR "offer sparingly" test + glossary
discipline + grilling moves (grill-with-docs) · `/handoff` · `/triage` + `.out-of-scope/` · `/tdd` ·
`/diagnose`'s feedback-loop discipline · `/refactor-advisor`'s deep-module vocabulary
(improve-codebase-architecture) · `/prototype` · this README's failure-mode framing. Behavioral
Guidelines borrow [Karpathy's LLM-coding guidelines](https://github.com/multica-ai/andrej-karpathy-skills);
`/council` adapts the LLM Council method; this README's layout follows the
[Best-README-Template](https://github.com/othneildrew/Best-README-Template). All re-cut for lean-flow's
markdown-first, agent-free-core, stack-agnostic constraints.

**Further reading:** [`.claude/CONTEXT.md`](.claude/CONTEXT.md) (SSOT) ·
[`.claude/CLAUDE.md`](.claude/CLAUDE.md) ·
[`DOCS_Guide.md`](skills/lean-doc-generator/references/DOCS_Guide.md) (the standard).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## License

MIT — see [`LICENSE`](LICENSE). Built and maintained by [Aldian Rizki][website-url].

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<sub>Doc owner: Maintainer · last updated 2026-08-10 · status: current · v1.37.0</sub>

<!-- REFERENCE LINKS -->
[license-shield]: https://img.shields.io/badge/license-MIT-green?style=for-the-badge
[license-url]: LICENSE
[claude-shield]: https://img.shields.io/badge/Claude_Code-plugin-8A63D2?style=for-the-badge
[claude-url]: https://claude.com/claude-code
[skills-shield]: https://img.shields.io/badge/skills-14-blue?style=for-the-badge
[skills-url]: #the-skills
[website-shield]: https://img.shields.io/badge/website-aldianrizki.com-orange?style=for-the-badge
[website-url]: https://aldianrizki.com/
[issues-url]: https://github.com/aldianriski/lean-flow/issues
