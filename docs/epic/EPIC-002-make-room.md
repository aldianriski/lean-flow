---
epic: 002
slug: make-room
owner: Maintainer
last_updated: 2026-08-14
status: active
member_sprints: [SPRINT-062, SPRINT-063, SPRINT-064, SPRINT-065]
update_trigger: a member sprint closes, or a decision lands that changes the outcome
---

# EPIC-002 — Make Room

> **Outcome:** the repo has room to absorb a standard — both SSOT files carry real headroom, no doc
> sits over a soft cap without an ADR saying why, and every guard that survives the pass is one
> somebody can name a reason for.

## Why this, why now

`CLAUDE.md` is at 80/80 and `CONTEXT.md` at 132/150. Every new rule already costs an old one, and
EPIC-003…005 are three epics' worth of incoming rules. This is not housekeeping deferred until it
feels tidy — it is the prerequisite that makes the other three writable, which is why it runs first.

The driver is measured, not felt: the last 15 sprints spent 10.9 lines of doc churn per line of
product churn, against 91 learnings, 17 ADRs, 31 research docs, 11 checkers and 24 eval harnesses
(`docs/research/platform-readiness-audit.md` F1 · F7). It spans sprints because the corpus cannot be
cut in one pass without breaking the evidence rule below.

**The evidence rule binds every task here.** Nothing is deleted because it is old, long or
inconvenient — only because it can be shown not to be load-bearing. The guards find real defects
(F2: SPRINT-056 found five gates green over input they never read), and TD-012 already records what
happens when fixtures are deleted with the prototype that created them. A removal without evidence is
this epic failing, not this epic succeeding.

## Scope

**In:** rule the three over-cap docs (raise by ADR, or split per §6) · give the §2 soft-cap report a
consumer at promote · collapse the LEARNINGS corpus per §11 · archive spent research per §11 ·
restructure the SSOT caps with an ADR · consolidate overlapping logic across the 11 `check-*.sh`
checkers.

**Out (explicitly not):** deleting eval fixtures (TD-012 binds — a must-FAIL fixture is the guard) ·
retiring any *rule* that a promoted `L-NNN` stands behind · touching the sprint archive (61 closed
records are history, and history is not corpus) · relaxing a gate to reduce work.

## Member sprints

| Sprint | Theme | Status | What it contributed to the outcome |
|---|---|---|---|
| [SPRINT-062](../sprint/archive/SPRINT-062-room-to-write.md) | Room to Write — three governance signals, and whether anything is listening | closed · `f0f72c0` | Ruled the first cap by **splitting** rather than moving a number, and generalised it: §2's Growth rule now sorts a breach into drift vs a cap that was never reachable, so the remaining three have a procedure instead of a hypothesis. Gave the §2 cap report a consumer at promote — the review had been reporting doc-aging clean over three standing breaches. Established that the LEARNINGS corpus is healthy and that the count suggesting otherwise was measuring its own query. **Headroom delivered: none** — that is TASK-196's, now unblocked. |
| [SPRINT-063](../sprint/archive/SPRINT-063-headroom.md) | Headroom — spend the procedure SPRINT-062 built | closed · `3998e23` | **Delivered the headroom SPRINT-062 could not.** `CLAUDE.md` 80→61 by removing a codemap that duplicated `overview.md` — cap **held**, the first cap breach this epic resolved by subtraction rather than by a number. Two numbers ruled where subtraction was impossible: **ADR-019** (`TODO.md` 320 — the entry schema costs ~17.6 lines/entry, so cap and schema could not both hold) and **ADR-020** (research 130, plus `status: superseded` ⇒ **frozen**, because the cap was counting the annotation that marks a doc dead). Closed conditions **2 and 3**. Also killed the epic's checker open question by showing it was *premature*, not unanswerable. |
| [SPRINT-064](../sprint/archive/SPRINT-064-where-it-fires.md) | Where It Fires — mechanisms that exist and do not reach | closed · `92a16c9` | **Partial member — only T1 was epic-tracked, and it closed condition 4.** Applied the LEARNINGS §11 leg (count 0), completing the pair SPRINT-063 started; the audit behind it was found to be scanning 20 of 31 entries and was rebuilt before the answer was accepted. T2 and T3 sat outside this epic but share its lesson: in all three tasks the rule already existed and was gated on something that could not reach the failure. **Leaves condition 1 as the only one open** — `CLAUDE.md` 63/80 (21%), `CONTEXT.md` held at 12% by the SPRINT-063 ruling → **TASK-206**. |
| [SPRINT-065](../sprint/SPRINT-065-the-critic-loop.md) | The Critic Loop — the first build from the gauntlet-loop scan | active · `plan locked` | _(completed at close)_ — **partial member: only its T2 is epic-tracked**, carrying the condition-1 ruling that is the last thing holding this epic open. T1 and T3 are EPIC-004-shaped work from `docs/research/gauntlet-loop-delta.md`. |

## Decisions

- **D1** — Subtraction is scoped as a first-class epic rather than a recurring background chore,
  because the caps are a hard blocker for the roadmap and a chore never gets a Closed-when. **→ no ADR**
  (not surprising, and reversible).
- **D2** — The SSOT cap question is settled by ADR, not by trimming to fit. ADR-015 rules that a soft
  cap cannot be grandfathered, so "add it to the list" is unavailable and the number itself must be
  argued. **→ ADR-019** (`TODO.md` 320) **· ADR-020** (research 130 + frozen verdicts), SPRINT-063.
- **D3** — **The 11 checkers stand alone; consolidation defers to EPIC-004** (SPRINT-063 T4). They
  share no input model — markdown tables, frontmatter, git history, JSON manifests and prose inference
  are five different parsing problems — so a single engine today is a dispatcher with eleven bodies:
  the file count changes and nothing else does. EPIC-004 D1 makes the engine **spec-driven**, and a
  spec is precisely the common rule representation they currently lack; building it before EPIC-003
  exists means inventing a representation EPIC-003 will then define differently. The contract being
  protected is the **named finding** (L-058) — ~82 of them asserted across 16 retained fixture
  harnesses — never the file count. **Deferral closes on a documented behaviour** (L-094): the EPIC-003
  spec existing in a form a checker can read as its rule source. Not "when a measurable signal
  appears", which would park it forever.

  | Checker | What it guards | Input model |
  |---|---|---|
  | `count-claims` | hand-written counts vs what is on disk | prose claims across 4 files |
  | `doc-caps` | §2's caps, derived from the standard's own table | markdown table + line counts |
  | `ephemeral-intake` | a BUG report is temp-dir scaffolding, never committed | filesystem walk |
  | `epic-archive` | an epic archives only when every Closed-when is ticked | frontmatter + checkboxes |
  | `gates-signed` | `gates_signed` present or absent — absence is never approval | frontmatter |
  | `layers-completeness` | a file implied by DoD prose but absent from `Layers:` | prose inference |
  | `layers-observed` | the real git diff since `plan_commit`, attributed per task | git history |
  | `manifest-lockstep` | four manifests + the README footer at one version | JSON |
  | `night-run-rollup` | a run emits its rollup at exit | append-only log |
  | `research-archive` | §11: `superseded` **and** no live citer | frontmatter + cross-corpus refs |
  | `task-origin` | `origin:` is stamped — it gates G1's fast-path | TODO entry fields |

## Open questions

- ~~Does §11's trigger list or §2's caps own the soft-cap report?~~ **Answered, SPRINT-062 T2:** §2
  owns caps, §11 owns retention; the doc-aging line reads both. The "fifth checklist line" instinct was
  indeed wrong — the enumeration was the wrong *source*, not an incomplete list.
- ~~Can 11 checkers consolidate without losing per-check named findings?~~ **Answered, SPRINT-063 T4
  → D3:** the question was premature, not unanswerable. They share no input model, so consolidation
  today buys a file count and risks ~82 named findings; it becomes a real question once EPIC-003's
  spec gives them a common rule representation. Settled on paper — no `/prototype` needed.

## Closed when

- [x] Both SSOT files carry headroom measured in **sprints of growth**, not a flat percentage —
      **re-worded and then judged** by TASK-206 (SPRINT-065 T2), owner-ruled. The original wording
      (`≥ 15% headroom`) was the wrong *instrument*, not merely an unmet target: ADR-017 had already
      ruled — before this task and independent of it — that a percentage misreads a file growing at
      **0.83 lines/sprint** whose diet pass found nothing removable. A percentage calls 18 free lines
      in a 150-line file scarcer than 17 in an 80-line one, when the two absorb **~21** and **~20**
      sprints respectively. Measured 2026-08-14: **`.claude/CLAUDE.md` 63/80 = 17 lines ≈ 20 sprints ·
      `.claude/CONTEXT.md` 132/150 = 18 lines ≈ 21 sprints.** Both clear what the epic actually wants —
      room to absorb a standard. The gap was **not** closed by trimming `CONTEXT.md` to make a number
      go green (§2's Growth rule names that as the tell, and ADR-017 already ran that pass):
      `CONTEXT.md` is unchanged at 132 lines, and SPRINT-065 T1 deliberately spent **0** of them
- [x] No doc sits over a soft cap without an ADR recording the ruling — **SPRINT-063**: ADR-019
      (`TODO.md`), ADR-020 (research cap + frozen verdicts). `qa-check.sh` emits **zero** `OVER-CAP` lines
- [x] Every surviving `check-*.sh` is either consolidated or has a one-line reason it stands alone —
      **D3**, all 11 with their input model named; consolidation deferred to EPIC-004
- [x] LEARNINGS and `docs/research/` have had one §11 pass applied, with the evidence rule honoured —
      **both legs done, each returning zero.** `docs/research/`: SPRINT-063 T2, all four superseded docs
      kept with their live citers named. `LEARNINGS`: SPRINT-064 T1 — 96 entries (64 active · 31
      promoted · 1 superseded), all 31 promoted already carrying their pointer, verified by a query
      proven to fire on a seeded gap after the first audit was found to be examining 20 of 31
