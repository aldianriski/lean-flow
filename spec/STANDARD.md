---
owner: Maintainer
last_updated: 2026-08-16
update_trigger: The standard's content changes (bump per spec/CHANGELOG.md)
version: 0.2.0
status: current
---

# LEAN DOCUMENTATION STANDARD — Reference

> WHY and WHERE only. Never HOW. This guide is the authority lean-doc-generator loads before
> generating anything. Where a template exists, the **template** is the canonical format — not the
> inline examples here.

---

## §1 — The 4 Laws

| Law | Name | Rule |
|---|---|---|
| LAW 1 | Minimal by Default | No doc created unless its absence causes repeated interruptions or mistakes |
| LAW 2 | Owned, Not Shared | Every doc has exactly one owner *role*; shared = no ownership |
| LAW 3 | Lifecycle-Bound | Every doc has defined create / update / archive triggers |
| LAW 4 | Signal-Dense | Every line carries info not already in code; repeating code = delete |

---

## §2 — Core Files (TemiDev repo-structure standard — ADR-012)

Every row carries its **full lifecycle contract** (LAW 3): *create* ← the event that brings it into
existence · *update* ← the event that refreshes it (mirrored in its ownership header's
`update_trigger`) · *archive* ← its retention leg (§11; `—` = lives as long as the repo). Tier
gating → §6.

**Root files:**

| File | Reader | Cap | Create ← | Update ← | Archive |
|---|---|---|---|---|---|
| `README.md` | Anyone | no hard cap¹ | init (always) | project scope changes | — |
| `CONTRIBUTING.md` | Contributor | ~100 | init (team ≥ 2, or on request) | branching / commit / review / DoD convention changes | — |
| `CODE_OF_CONDUCT.md` | Anyone | ~120 | init (team ≥ 2, or on request — same gate as CONTRIBUTING; a single-maintainer repo has not met the condition and is not deviating) | the enforcement contact or the policy changes | — |
| `SECURITY.md` | Anyone | ~80 | init (always) | auth model · secret policy · vulnerability-reporting change | — |
| `CHANGELOG.md` | Reviewer | append-only | first release or sprint close (always-core — ADR-012 deviation) | sprint close · release | rotate at new MINOR → `docs/changelog/` (§11) |
| `LICENSE` | Anyone | — | init (license chosen; private → proprietary notice) | license change (rare) | — |
| `AGENTS.md` | AI tools | 12 (ADR-015) | init (always) — **thin pointer to `.claude/CLAUDE.md`, never duplicated instructions** | pointer targets move | — |
| `.env.example` | Dev | — | init **safe-scaffold** (write-if-absent; names only, never values) | a new env var is introduced | — |
| `.gitignore` | git | — | init **safe-scaffold** (write-if-absent; from the §12 boundary rule) | a new generated-artifact class appears | — |
| `TODO.md` | Dev / AI | 320 soft (ADR-019) | init (always) | backlog change · sprint promote/close | §11 prune |
| `TECH-DEBT.md` | Dev / AI | open rows only | first TD filed | close files TD · promote ages · debt resolved | §11 delete (3 sprints after resolved) |

**AI context (`.claude/`):**

| File | Reader | Cap | Create ← | Update ← | Archive |
|---|---|---|---|---|---|
| `CLAUDE.md` | AI assistant | 80 | init (always) | project shape / workflow / anti-patterns change | — |
| `CONTEXT.md` | AI assistant | 150 (ADR-017) | init (always) | vocabulary / patterns / conventions change | — |

**`docs/` tree** (tier column per §6; legacy lean paths in parentheses stay matched second):

| File | Tier | Reader | Cap | Create ← | Update ← |
|---|---|---|---|---|---|
| `product/requirements.md` | base | Dev / PM | 150 soft | init, or first sanitized PRD lands — **skipped on an existing repo whose AI-context files already ARE the spec** (`CONTEXT.md` carries the behaviour, `CLAUDE.md` the principles + DoD): a third copy is a second SSOT. Greenfield `init` is unaffected — nothing owns the content yet | a requirement is approved / changed (via PR) |
| `product/acceptance-criteria.md` | base | Dev / QA | 120 soft | with requirements | acceptance criteria change |
| `architecture/overview.md` *(was `docs/ARCHITECTURE.md`)* | base | Tech lead | 150 | init (always) | major structural change |
| `architecture/data-flow.md` | backend, or overview cap-split | Dev | 120 | a non-trivial data path exists | that flow changes |
| `architecture/authentication.md` | auth exists | Dev | 120 | auth is introduced | authn/authz architecture changes |
| `architecture/integrations.md` | backend/integration | Dev | 120 | first external integration | an integration is added / changed |
| `adr/ADR-NNN-<slug>.md` + `DECISIONS.md` index (both under `docs/`) | medium+ | Team | per file, append-only | a qualifying decision (§4) | new ADR → index row |
| `database/erd.md` (Mermaid) | DB exists | Dev | 120 | the schema's first entities land | a migration changes entities / relations |
| `database/schema.md` | DB exists | Dev | 150 | with erd | a migration lands |
| `database/migration-guide.md` | DB exists | Dev | 100 | first migration | migration / seed process changes |
| `api/openapi.yaml` | API exists | API consumer | — (spec is project-generated; **placement rule only, no template**) | first endpoint ships | an endpoint / contract changes |
| `development/setup.md` *(was `docs/SETUP.md`)* | base | New dev / CI | 100 | init (always) | setup process changes |
| `development/coding-standards.md` | base | Dev | 120 | init | a convention is adopted / changed (mirror what config enforces — `.editorconfig` etc. — don't duplicate it) |
| `testing/testing-guide.md` | base | Dev | 100 | a test harness exists | strategy · harness · coverage rule changes |
| `deployment/deployment-guide.md` *(was `docs/DEPLOY.md`)* | base | Dev / ops | 100 | a deploy target exists | deploy flow · environment matrix changes |
| `deployment/rollback-guide.md` | base | Dev / ops | 80 | with deployment-guide | rollback process changes |
| `flows/<slug>.md` (Mermaid) | medium+ | Dev | 100 each | a flow needs shared understanding | that flow changes |
| `epic/EPIC-NNN-<slug>.md` + `epic/INDEX.md` (created lazily) | lean loop | Team / AI | 200 soft | a **multi-sprint** outcome is named — one sprint's worth of work is a sprint, and an unnameable destination is fog (`--fog`) until it isn't | a member sprint closes, or a decision changes the outcome |
| `sprint/SPRINT-NNN-<slug>.md` | lean loop | AI mid-sprint | 400 hard | promote | DoD ticks · Files Changed · Retro during sprint (Plan frozen at promote) → §11 archive |
| `sprint/logs/SPRINT-NNN-<slug>.md` | lean loop | AI mid-sprint | append-only | lazily, at the first Execution Log entry | every Execution Log entry → §11 archive with its sprint. **Must live in the `logs/` subdirectory**: the sprint-file checks glob `docs/sprint/SPRINT-*.md`, which is non-recursive, so a sibling here is excluded for free while a same-directory `-log.md` suffix would be capped at 400 and schema-checked as a Plan (ADR-014) |
| `LEARNINGS.md` | lean loop | Team / AI | append-only | first confirmed learning | close confirms · promote collapses (§11) |
| `research/<slug>.md` | as needed | Team / AI | 130 soft (ADR-020) | a decision-driving question | question revisited · verdict changes; a verdict a decision has been built on is marked `status: superseded` rather than edited → §11 archive once nothing live cites it. **`status: superseded` ⇒ FROZEN, and the cap does not apply** (ADR-020): the only content that can still legally grow on a spent verdict is the annotation recording *why* it is spent, so a cap here measures the supersession trail and asks you to delete it. It exits via §11 archive, never via a diet |
| `research/logs/<slug>.md` | as needed | Team / AI | append-only | a research question accretes a **second measurement round** — created lazily, never pre-created (**placement rule only, no template**: it is the decision doc's appendix — carry the same frontmatter with `id: <slug>-log` and `status: active`, then append one `## Round N — <question> (<source>, <date>)` section per measurement) | every round appended → §11 archive with its decision doc. **Must live in the `logs/` subdirectory**: the cap check derives its glob from this table's File cell and `docs/research/*.md` is non-recursive, so a sibling here is excluded for free while a same-directory `-log.md` suffix would be capped at 120 and schema-checked as a decision doc (the ADR-014 mechanism, applied to research — SPRINT-062 T1). **Never a `related:` id** — the index globs `docs/research/*.md` non-recursively too, so naming it would dangle the corpus-ref check; link it from the body |
| `BUG-<slug>.md` | ephemeral | Anyone | lean | a defect is reported — **written to the OS temp dir, never committed** (see the temp-dir note below) | routed away at `/triage`; the file is intake scaffolding, so once its content lands in a `TASK-NNN` / `TD-NNN` / `/diagnose` run there is nothing to retain and no §11 row to reach |

Templates resolve under `${CLAUDE_SKILL_DIR}/templates/`; tree docs use a flattened name
(`architecture-overview.md.template` · `database-erd.md.template` · …).

**Placement is canonical.** Root keeps the daily working files + the TemiDev root set above;
AI-context lives in `.claude/`; everything else lives under the `docs/` tree. Generation targets
these paths; `/prime` searches them first (**legacy locations — `docs/ARCHITECTURE.md` ·
`docs/SETUP.md` · `docs/DEPLOY.md` · `docs/CHANGELOG.md` — still matched, second**); `migrate`
relocates a legacy layout (`git mv` + inbound-link fixes — content untouched).

**Growth rule (cap-hit → split, never squeeze).** A core file at its cap **splits into its canonical
tree**: `architecture/overview.md` spawns `data-flow.md` / `authentication.md` / `integrations.md`
(overview keeps the map + links); `development/setup.md` can spawn per-platform pages;
`deployment-guide.md` spawns the environment matrix. Move whole sections; never compress signal away
to stay under a cap, and never raise the cap to fit content (§7 — a cap moves only by ADR, diet first).

**A figure a checker reads is exact — and a breach that resists every honest fix means the number is
wrong, not the file** (L-106, promoted SPRINT-062 T1; three sightings). Writing a cap as `~10` or
`120 soft` buys the appearance of judgement and defers the decision onto whoever next trips it: the
check compares `actual <= cap` as integers, and `soft` changes only whether a breach FAILs or merely
reports, never the arithmetic. So before trimming anything, sort the breach into one of two kinds —
they need opposite actions, and the report cannot tell them apart:

- **Drift** — removable content accreted past a cap that was always reachable. Trim, or split per the
  growth rule above.
- **The cap was never reachable.** Either the standard *mandates* content the number never budgeted
  for (`AGENTS.md` at 11 against `~10`: nine lines plus the two-line ownership footer §3 requires), or
  the doc's growth is an **append-only series** whose rounds are the whole point (`qa-gate-timing.md`
  at 223 against `120 soft`: three measurement rounds). Neither can be trimmed without deleting what
  the file exists to say. Fix the *number* — restate it exactly by ADR — or split the series into a
  `logs/` sibling so the cap lands on the decision and never on the series (ADR-014's mechanism; the
  `research/logs/` row above is its first application outside `docs/sprint/`).

The tell is that every route back under the cap runs through deleting signal or re-wrapping prose —
same words, fewer physical lines, number green, document unchanged. When that is the only route, stop
and rule the number. Approximate a figure a human reads; state a real one wherever a checker can reach it.
Ledgers (§11) compress; **knowledge docs split**.

**LAW 1, reinterpreted (ADR-012).** The mandatory minimum above is scaffolded at **init** — with
real content prompts, never empty shells; beyond the minimum, create-lazily still governs (no doc
until its absence causes repeated interruptions). Minimal stays the floor *per doc* (LAW 4), not a
ceiling on the doc *set*.

**Temp-dir artifacts** (council verdicts, handoff docs, **`BUG-<slug>.md` reports**, and the
**working feature PRD** `/task-decomposer` synthesizes) are never referenced from durable docs — copy
to `docs/research/` (verdicts) before citing. They are intake or hand-off scaffolding: their substance
moves into a durable artifact (a `TASK-NNN` · `TD-NNN` · a regression test · `docs/product/requirements.md`)
and the scaffolding itself is simply gone. **This is why §11 has no row for either** — retention acts on
committed files, and neither is ever committed. Absence there is the rule, not a gap in it.

¹ **README is the full front-door** — the complete overview of the repo. Don't truncate it to hit a
line count; deep detail belongs in `CLAUDE.md` (project shape) and `CONTEXT.md` (vocabulary) and
`architecture/overview.md` (structure), which the README links to. Keep it signal-dense (LAW 4), not short.
The bundled template models a human-showcase front-door (hero · why · quick start · features ·
docs map) — adapt freely, structure is a suggestion; only invariants are the anti-SSOT rule and the footer ownership line.

**Template-as-canonical-format rule**: when a template exists for a doc type, the template IS the
canonical format — NOT this guide's inline examples. Consult the template before generating to
verify section ordering, frontmatter shape, and placeholder tokens. Templates use bracket
placeholders (`[Project Name]`, `[CUSTOMIZE]`, `[role — not personal name]`). If template and this
guide diverge → **template wins**; note the divergence so the user can reconcile.

**Template-load protocol** (mandatory — this is the step that, when skipped, causes free-generation):

1. **Read** `${CLAUDE_SKILL_DIR}/templates/<X>.md.template` BEFORE writing the doc. Verify (a) frontmatter field order, (b) section order, (c) placeholder tokens preserved or replaced consistently.
2. **Missing template** → WARN: `"Template <X> not found — proceeding with §2 inline format as fallback; raised as a friction note."` Do NOT hard-stop; degraded output beats no output.
3. **Divergence** → template wins. Surface a one-line note (e.g. `"Section order corrected per architecture-overview.md.template"`). Never silently rewrite — the user must see the divergence.

Before creating any new file → ask "can this live in a code comment?" If yes → code.

**Create lazily.** Only create a doc when you have something concrete to write — an empty scaffold is
not a doc. Don't pre-create `DECISIONS.md` / `docs/adr/` / a glossary until the first real entry exists.

**DESIGN.md — optional, frontend-only, outside the core set.**
`docs/DESIGN.md` (or the repo's design dir) · template `templates/DESIGN.md.template`.
Create trigger: a frontend/UI project wants a shared design-system / token contract.
WHY/WHERE carve-out: exempt from the "never document HOW" golden rule because it is a **spec/contract
artifact** — it defines agreed tokens and components (as SPRINT captures WHAT/WHEN). It carries its
own design-token frontmatter instead of the §3 ownership header. Never auto-create; never add to the
core doc generation loop; never listed in the §2 table.

**SKILL.md cap (ADR-006).** A skill's `SKILL.md` stays ≤ ~140 lines of **procedure + scaffolding**;
**executable artifacts** (prompt templates, persona/advisor definitions, schemas) live in the skill's
own `references/` and **don't count** toward the cap. "Executable artifact" must not stretch to cover
ordinary prose — police it honestly.

**The disclosure test — what belongs inline vs in `references/`.** The cap is a size limit, not a
criterion; it tells you *when* to move something, never *which* something. The test is branching:
**inline what EVERY path needs; disclose what only SOME paths reach.** A step every invocation
executes belongs in `SKILL.md` even when it is long; a table consulted only on one branch belongs in
`references/` even when it is short. Push too little down and the top bloats until the procedure is
buried; push too much and the agent cannot act without a second read. Two budgets are in tension and
they are not the same: **context load** (tokens spent every turn — steep) versus **cognitive load**
(what a human must hold to navigate — acceptable where judgment lives).

**Completion criteria are a behavioural lever, not decoration.** A step's stopping condition changes
how thoroughly it is executed. Vague bounds — "understanding reached", "reviewed", "produce output" —
invite stopping at the first plausible moment. Demanding ones — "every rule applied", "each fixture
FAILs with its named finding", "all four touchpoints agree" — drive exhaustiveness without ever
saying "be thorough". Applies to DoD lines, `**Acceptance:**` lines, and any skill step whose
completion is a judgement call: **write the bound you would accept as proof, not the activity**.

**SKILL.md skeleton (canonical structure).** Frontmatter: exactly 6 fields, in order — `name` ·
`description` (trigger surface: what it does + a `Do not use for X → /Y` redirect where a confusable
sibling exists) · `argument-hint` (may be `""`) · `allowed-tools` · `user-invocable` · `version`.
**Bash scoping**: scope `Bash` to subcommands where the set is enumerable (the `release-patch`
pattern — `Bash(git diff *)` etc.); leave `Bash` unscoped only where arbitrary commands are inherent
to the job (test runners / build tools — `tdd` · `diagnose` · `prototype` · `orchestrator`), and that
rationale is the documented default, not silence. **Section order**: `## When to invoke` (optional;
canonical name — never "When to run") → one procedure section (name free — Steps/Flow/Procedure/
Workflow/Phases) → `## Output format` (required only for deterministic-output skills; canonical
name — never bare "Output") → `## Hard rules` (optional) → `## Red flags` (required, ❌-bullets).
**References**: internal pointers use `${CLAUDE_SKILL_DIR}/references/...`; a skill never points into
ANOTHER skill's `references/`/`templates/`. **Caps**: `SKILL.md` ≤ ~140 lines procedure+scaffolding
(ADR-006); `references/` uncapped.

---

## §3 — Ownership header (mandatory on every doc)

```yaml
---
owner: [role, not a person name]
last_updated: YYYY-MM-DD
update_trigger: [specific event that triggers an update]
status: current | needs-review | stale
---
```

Flag if: `status: stale`, `status: needs-review`, `last_updated` > 60 days, or no header present.

**README exception** — the README is the front-door; a top YAML block renders as an ugly metadata
table. So the README carries its ownership as a small **footer line** instead
(`<sub>Doc owner: … · last updated: … · status: …</sub>`), and leads with the project hero. The
ownership is still tracked — just at the foot, not the top.

**AGENTS.md exception** — same rationale, extended: `AGENTS.md` is a ~10-line thin pointer file, and
a 6-line YAML block would defeat that budget — so it too carries ownership as a footer `<sub>` line
instead of a top header (`AGENTS.md.template`).

---

## §4 — ADR format + when to offer one

ADRs are **rare but thorough.** Offer one only when ALL THREE hold — else skip (you'd just reverse it,
or nobody will wonder why):

1. **Hard to reverse** — changing your mind later carries meaningful cost.
2. **Surprising without context** — a future reader looks at the code and wonders "why this way?"
3. **A real trade-off** — genuine alternatives existed; you picked one for reasons.

When one qualifies, write it **in full** against `templates/ADR.md.template` — **one file per ADR** at
`docs/adr/ADR-NNN-<slug>.md`, append-only (never edit a decided ADR — mark it `deprecated` or
`superseded by ADR-NNN`). `DECISIONS.md` is a thin **index** linking them. Worked example →
`references/ADR-example.md`.

Required sections: **Status** (`proposed | accepted | deprecated | superseded`) · **Deciders** (roles) ·
**Context** (WHY — include a *measured blast radius* where scope drives the call, so it isn't a guess) ·
**Decision** (stated, not hedged) · **Consequences** (**at least one Negative** — no decision is
cost-free) · **Alternatives considered** (with the reason each was rejected). Never invent a decision —
record only what the user confirmed. WHY only, never HOW.

For a genuinely high-stakes call, **pressure-test it before recording** — run `/council` (5 advisors +
peer review → `verdict-<slug>.md`), then fold its recommendation + alternatives into the ADR.

**Qualifies**: architectural shape · integration patterns · tech choices with lock-in · boundary/scope
decisions (the explicit no's matter) · deliberate deviations · constraints invisible in code.
**Does not**: easy-to-reverse choices · the obvious path · single-module detail.

---

## §5 — HOW filter

| KEEP (WHY / WHERE) | DISCARD (HOW → belongs in code) |
|---|---|
| System purpose, scope boundaries | Implementation details, algorithm steps |
| Component names, responsibilities | Step-by-step code flow, function logic |
| Architectural decisions + trade-offs | Internal library behavior |
| External dependencies, setup commands | What each function does internally |

Discard log: `"Skipped: '[detail]' explains HOW → add as a comment in [file]."`

---

## §6 — Tiered scale model (gates the §2 tier column; detected from manifest/stack at init, confirmed by popup)

| Tier | Trigger | Doc set |
|---|---|---|
| **Base** | every dev repo | the TemiDev mandatory minimum: root set (§2) · `product/{requirements,acceptance-criteria}` · `architecture/overview` · `development/setup` — plus **substrate-conditional** rows that are skipped, not owed, when the substrate is absent: `development/coding-standards` + `testing/testing-guide` (**has code**) · `deployment/{deployment,rollback}-guide` (**publishes an artifact**) · `database/` (DB) · `authentication` (auth). Gate per substrate, never on a repo label — a docs repo that publishes still deploys |
| **Backend / integration** | repo exposes an API or external integrations | + `api/openapi.yaml` (placement rule) · `architecture/integrations.md` |
| **Medium / complex** | multi-dev, sustained, or architecturally forked | + `adr/` + `DECISIONS.md` · `flows/` (CHANGELOG is already always-core — ADR-012) |
| **Multi-service** | several deployable services / repos | + service registry · cross-service dependency map · global decisions index — per-service repos each carry their own Base+ set; the umbrella repo owns the cross-cutting three |

A repo **moves up a tier by event, not by ceremony** — the trigger appearing (first API, second dev,
second service) is the create-event for that tier's docs. Moving down never deletes: docs stay until
their §11 leg retires them.

---

## §7 — Anti-patterns

| Anti-pattern | Response |
|---|---|
| HOW documentation | Redirect to a code comment |
| Orphan doc (no header) | Add header before touching file |
| Person ownership ("Alice") | Reassign to a role |
| Mega doc (over line limit) | Split per §2; never raise the limit **to fit content**. A cap moves only by ADR, and only after a diet pass has been measured first — the precedent is ADR-007 then ADR-017 (`CONTEXT.md` → 130 → 150) and ADR-006 as amended (`SKILL.md` → 140); **a second raise on one file is a signal that file is doing too many jobs, not a routine renewal**. Raising it silently is what the rule forbids; an ADR that records the argument is the escape hatch, cited inline in §2 |
| Sprint file > 400 lines | Block — split the sprint |
| Stale doc used as source | Run the staleness scan first |
| File outside the core set | Redirect to code or an existing core file |
| Ledger past a §11 retention trigger | Compress / rotate / archive at the next promote |

---

## §8 — Pre-delivery checklist

- [ ] Template was read before generating (template-load protocol §2)
- [ ] Ownership header present and complete
- [ ] No HOW content (every line passes the §5 filter)
- [ ] Under the line limit for this file type
- [ ] No person names as owners
- [ ] `status` field set correctly
- [ ] All referenced files exist

---

## §9 — Sprint file (`templates/SPRINT.md.template`)

The active sprint is **two files** — a capped Plan and an uncapped log (ADR-014):

| File | Cap | Holds |
|---|---|---|
| `docs/sprint/SPRINT-NNN-<slug>.md` | **400 hard** | frontmatter (`status` · `plan_commit` · `close_commit`) · Theme · Scope (In/Out) · Plan (Tn + size·risk + Acceptance + **DoD checkboxes** — what `/orchestrator sprint-bulk` loops and `/prime` counts) · Owner-action checklist · Decisions→ADR · Assumptions · Files Changed · **Retro** (routed per §10) |
| `docs/sprint/logs/SPRINT-NNN-<slug>.md` | **append-only, uncapped** | the **Execution Log** only — created lazily at the first entry |

`TODO.md` holds the Backlog **pool**. **Why they are separate:** the Log grows with the work done, so
sharing one 400-line budget means the more a run accomplishes the closer the file gets to breaching —
which caps how many tasks a Plan may hold, and therefore how much an unattended run can consume before
it clean-halts. Measured before the split: six consecutive sprints ran 232–368 lines holding only 2–6
tasks, one of them reaching 368 lines on **two** tasks. The Plan was never what filled the file.

The Plan stays frozen at promote; a mid-sprint scope shift is logged as a `scope-change` entry in the
log file (what broke · impact · re-confirm G2) **before** § Plan is edited.

---

## §10 — Continuous learning governance

Every iteration feeds the next. At **Sprint Close**, first **sweep the full session** — the Execution
Log AND any tech-debt / follow-up surfaced mid-run but never written down — then the Retro sorts work
into four buckets, each **routed to a durable home** (don't leave them in the sprint file):

| Bucket | Routes to |
|---|---|
| Shipped | `CHANGELOG.md` (root) |
| Tech debt | `TD-NNN` row in root `TECH-DEBT.md` (`severity` + `created: Sprint-NNN`) |
| Follow-ups | `TASK-NNN` entry in `TODO.md` § Backlog (re-enters the loop) |
| Learnings | `L-NNN` entry in `docs/LEARNINGS.md` |

**Retrieval-miss check** (at close) — also ask: *did we fail to find, or contradict, a prior
`L-NNN`/ADR this sprint?* A yes is a fileable friction (→ Learnings bucket) **and** the observed signal
for investing in a derived knowledge-graph view — track the miss rather than guessing on corpus size.

**Promotion rule** — a learning that recurs (**count ≥ 2** — a second sprint hits the same friction)
is promoted from a ledger line into a *durable* rule. Mark `promoted: yes → <where>` on the entry.
One-offs stay ledger lines — they're context, not law. Don't promote on a single occurrence; don't let
a 2nd occurrence pass unpromoted.

**Placement test — the three homes are not interchangeable.** Ask **which flows can hit this failure**,
then place the rule where *all* of them read. A `skills/<x>/SKILL.md` red-flag is scoped to that skill's
flow — correct only when the failure is confined to it. A `CONTEXT.md` rule reaches every flow that reads
the SSOT. A `CLAUDE.md` anti-pattern reaches every flow in the repo, and is the answer when the honest
enumeration is "all of them" (it is capped, so landing there displaces something — a ruling, not an
append). Picking off the menu instead of enumerating is how a rule ends up firing in exactly one flow and
staying silent in the rest: L-087 was filed into `/diagnose` and then failed to fire during a `promote`;
a redaction rule lived in `/handoff` and never reached `/diagnose`, the skill that instructs capturing HAR
files. Where the rule already appears on more than one surface, **rewrite the duplicates to point at the
one home** — a stale second copy reproduces the failure it was promoted to stop. This is L-020
(shipped ≠ wired) applied to rules rather than capabilities: a promotion earns the same wiring check a
capability gets (L-092).

**Every hygiene rule gets a matcher.** The placement test decides *where* a rule fires; this decides
**whether it fires at all**. A hygiene rule earns either a lint in the project's quality gate or a named
checklist line in a close/promote sweep — a rule with neither is aspirational, and is deleted or wired
rather than left looking enforced. What it prevents is not a wrong rule but an **absent rule that reads
as present**, which is the shape every recurring miss in this class shares: a dedup pass nothing swept,
a consumer-surface check nothing verified, a wiring check nothing ran, a retention convention nothing
matched. So name the matcher in the same change that writes the rule, or say plainly that the line is
documentation — documentation is a legitimate answer, and calling it a gate is the error. This is
L-099's authoring-time twin: L-099 catches a rule written where its checker cannot read it, this one
catches a rule with no checker at all. *Applied to itself:* its matcher is the Promote review's
L-promotion line below, which is where a durable rule gets written and can therefore be asked for one.

**A `Mitigation:` line is a hypothesis, not a plan.** A `TD-NNN` row's proposed cure is the filer's best
guess, written at the moment the cost was being felt; by the time it reaches a Plan, repeated re-reading
has made it read as settled. Cite the evidence for the *problem*, re-derive the *fix* — at **close** (when
filing one) and at **promote** (before a DoD is built on one). Two rows have now been right about the
symptom and wrong about the cause, and in one case the proposed cure would have destroyed evidence
(L-091).

**A number inside a criterion is remembered, not measured.** Its facts-level sibling. A figure written
into a DoD, a `TD-NNN` Summary or a Backlog `assumes:` line looks like evidence and reads as settled,
but it was measured once — at authoring — and nothing re-measures it, so the criterion rots while its
prose stays confident. A stated figure with no check behind it is a comment: that is how a research doc
absorbed 39 lines over its cap across four sprints while an open row cited a count that had been wrong
since the sprint it was filed in, and how a DoD shipped clauses that were unsatisfiable when written.
**Re-derive a stated figure before acting on it** — at **promote** when a DoD is built on one, at the
**TD re-review** when a row is held on one, and at **decompose/triage** when one is written into or
groomed in a Backlog entry. One command is the whole cost (L-097).

**Tech-debt aging** — at **Sprint Promote**: any `TD-NNN` unaddressed ≥ 3 sprints triggers a
re-review prompt; `severity: high` auto-escalates to Backlog P1. Rows are never deleted — resolved
debt is marked `status: resolved → TASK-NNN` for the audit trail.

**Promote review (the governance checkpoint)** — before planning a sprint, run the L-promotion scan, TD
aging, and doc-aging triggers, then **emit the result as an explicit checklist** rather than silent
prose — `☐ L-promotion (count≥2, promoted:no): <findings|none>` · `☐ TD aging (≥3 sprints unaddressed):
<findings|none>` · `☐ doc-aging — §11 retention + §2 cap breaches: <findings|none>`. **Explicit owner
sign-off on the checklist is required before rendering the sprint file or committing `plan locked`.**
This is what stops learning and debt from rotting — and stops the review itself from being skipped unnoticed.

**Doc-aging has two sources, and §11 is only one of them.** §11's ledger is a *retention* table — what
gets archived, pruned or collapsed. **Caps are §2's**, and the two are not the same question. The
doc-aging line therefore reports **both**: every §11 retention trigger that fired, *and* every §2 cap
breach, sourced from the project's own cap check where it has one and otherwise measured directly
against §2's table. **Never restate a §2 cap inside this checklist**: a copied figure is a second SSOT
that drifts silently from the row it copied, and enumerating triggers by hand is what lets an entire
category go unreported (a cap check printed three soft breaches on every run for sprints while this
review reported doc-aging clean — the report had a matcher and no consumer; SPRINT-062 T2 · L-106).
The `TODO.md` whole-file row in §11's table is a **cap wearing a retention row's clothes** — it is listed
there for its prune action, and it is the reason exactly one of §2's caps used to reach this checklist
while the rest did not.

---

## §11 — Retention (LAW 3's archive leg)

The single-file ledgers grow forever in an agentic loop. Compression keeps them lean without losing
history: **git is the full audit trail — archives, collapses and deletions move or shrink blocks, never rewrite
them**. Append-only is preserved *inside* each archive file.

| Ledger | Trigger | Action |
|---|---|---|
| `TODO.md` Backlog entries (shipped/promoted) | sprint close | **remove outright** (propose→approve) — no shipped-in-SPRINT breadcrumb comments left in TODO.md; history's durable homes are root `CHANGELOG.md` + `docs/sprint/archive/` |
| `TECH-DEBT.md` | `resolved` ≥ 3 sprints ago | **delete the row.** The substance already lives in `CHANGELOG.md`, the sprint archive and git, so a permanent in-file pointer is a breadcrumb rather than a record — and a ledger that only ever grows stops being read. **Ids stay monotonic: deleting a row never frees its id for reuse.** The 3-sprint delay is deliberate — a just-resolved debt is still context at the next promote |
| `TODO.md` whole file | over its §2 cap at promote | flag in the governance review; prune with the user |
| `CHANGELOG.md` (root) | a new MINOR version lands | keep current + previous minor inline; older blocks move verbatim → `docs/changelog/CHANGELOG-<version>.md` + one link line |
| `docs/LEARNINGS.md` | an entry reaches `promoted: yes` | collapse it to a pointer line — `L-NNN → promoted: <where>`; the durable rule is the record now. **Ids are monotonic, never reused** — pruning removes the body, never frees the id; the next new id = highest-ever + 1. **The collapse consumes the trigger it fires on:** a promoted entry ends up as `[status: promoted]` + the pointer, so `promoted: yes` is *never* the stored form and grepping for it returns zero on a perfectly healthy corpus. Count promotion state by `[status: promoted]` (position-anchored, per L-108); a zero here is evidence about the query, not about the corpus (SPRINT-062 T3) |
| `docs/sprint/SPRINT-NNN-<slug>.md` | sprint closed | move → `docs/sprint/archive/`; add to `docs/sprint/INDEX.md` (created lazily) one line: `- SPRINT-NNN — <theme> — closed YYYY-MM-DD · <close_commit>` |
| `docs/epic/EPIC-NNN-<slug>.md` | **every** member sprint closed **and** the epic's Closed-when conditions all `[x]` | move → `docs/epic/archive/`; keep its `INDEX.md` row (the row is the durable pointer, the file is the detail). **Never archive on member-sprint count alone** — an epic whose last sprint closed with exit conditions unmet is unfinished, not done, and archiving it hides that |
| `docs/research/<slug>.md` | `status: superseded` **and** nothing live still cites it | move → `docs/research/archive/`; it stays in the generated `knowledge-index.md`, marked `(archived)`. **Supersession alone is not enough** — a spent verdict is usually the WHY-trail for whatever replaced it, so while any live surface still points at it the doc stays put (closed history — `docs/sprint/archive/`, `docs/changelog/` — and the generated index never count as citers). A doc that never reaches `superseded` is never archived: the state is set by the author when a decision is built on it, per the RESEARCH template |
| `docs/sprint/logs/SPRINT-NNN-<slug>.md` | sprint closed | move → `docs/sprint/archive/logs/` **with its Plan**, same commit — the pair is one record and splitting them across an archive boundary strands the evidence the Retro cites. No INDEX row of its own; the Plan's row covers both. Never compacted: the log is the append-only audit trail the Retro was written from |

**When it runs** — close-time triggers (Backlog removal · sprint archive) execute during `close`;
scan-based triggers (TD deletion · rotation · LEARNINGS collapse · the `TODO.md` prune) run at
**Promote** as **doc-aging**, alongside tech-debt aging in the governance review. Always propose →
approve → apply; never compress silently.

**Doc-aging is not bounded by this table.** The rows above are retention triggers; the promote review's
doc-aging line also carries **every §2 cap breach**, which this table does not enumerate and must not
try to (§10 Promote review). A breach and a retention trigger need different actions — a cap breach is
ruled (trim · split · restate the number, per §2's Growth rule), not archived.

---

## §12 — The Git boundary (what belongs in the repo, what never does)

Placement (§2) says *where in the repo*; this section says *whether the repo at all*. A doc/file
clears the boundary on content, not format — a well-formatted secret is still a secret.

**a. The decision rule.** Commit it when it:

| Commit when it… | Keep it out when it is… |
|---|---|
| must change together with code | commercial / legal / HR / financial / client-management material |
| is required to understand the code | confidential or personal data |
| is needed to run / test / deploy / maintain | a large editable design source |
| benefits from version history + code review | temporary, or reproducible by a command |
| contains no secrets / personal / commercial data | capable of exposing production infrastructure or credentials |

**b. Never-commit table** — category → examples → proper home instead:

| Category | Examples | Proper home |
|---|---|---|
| Secrets & credentials | `.env`, `*.pem`, `id_rsa`, `service-account.json`, API keys, tokens | secret manager |
| Client contracts / NDAs / legal | signed agreements, legal correspondence | controlled document storage |
| Pricing / financial | proposals, invoices, salaries | document storage |
| Personal & customer data | real records, PII, medical, payment, production DB exports | production systems only — sanitized fixtures in-repo, e.g. `{"name":"Example User","email":"user@example.test"}` |
| Raw production logs | app/server logs pulled from prod | logging / monitoring platform |
| Database backups | `backup.sql`, `production-dump.sql` | backup storage (small FAKE seed files are fine in-repo) |
| Original design sources | large Figma exports, `.ai` / `.psd`, video mockups | design tool / asset storage — only assets the app actually uses go in `public/` or `src/assets/` |
| Meeting notes | raw notes from any meeting | convert outcomes into requirements / ADRs / issues; never commit the raw notes |
| Draft proposals / pitch decks | unshipped commercial drafts | document storage |

**c. Generated/temporary excludes.** The standard `.gitignore` classes: `node_modules/`, `dist/`,
`build/`, `coverage/`, `.cache/`, `*.log`, `.DS_Store`, `Thumbs.db`, IDE dirs (`.idea/` + personal
`.vscode/settings.json` — shared `.vscode/extensions.json` MAY be committed). Rule: **anything
reproducible by a command stays out**; the only exceptions are artifacts a deployment/distribution
process actually requires.

**d. The clean separation:**

- **Git** = source + technical truth
- **PM tool** = tasks / progress
- **Document storage** = contracts / BRD / commercial
- **Design tool** = UI/UX sources
- **Secret manager** = credentials

Even a private repo is treated as potentially exposed.

**Wiring.** `init`'s `.gitignore` safe-scaffold derives its content from **§12c** (write-if-absent);
`migrate`'s adoption scan checks the tree against **§12b** (report-only — never auto-remediates).

---

## §13 — HITL attestation (git-native)

The **Attested** conformance level requires that human approval be provable to a third party *from a
clone alone*. §13 defines the format that carries it. It is a contract, not a procedure: it says what
must be true of a commit, never how a tool produces or reads one. The reader that matters is someone
with your repository and nothing else — no access to your planning tool, your CI, or you.

**a. What carries the attestation.** Three git trailers on the **task's own commit** — the commit that
implements the work, not a separate approval commit and not the merge:

| Trailer | Value | Meaning |
|---|---|---|
| `Gate-Signed-By:` | `Name <email>` | the **human** who approved the gate. One line per approver; repeat the trailer for more than one. |
| `Gate:` | gate identifiers, comma-separated (e.g. `G1,G2`) | which gates that approval covers. |
| `Evidence:` | a repo-relative path, optionally `@ <sha>` | where the approval is recorded in the repo, so the claim can be read in full rather than taken on faith. |

All three are required together. A commit carrying `Gate:` without `Gate-Signed-By:` asserts that a
gate applied and declines to say who approved it, which is weaker than saying nothing.

**b. Relation to the sprint-level record.** A conformant repo already records gate sign-off once per
sprint (`gates_signed: <GATES> @ <sha>` in the sprint file — §9). The trailer does not replace that
record and does not move approval to a per-task cadence: it **carries the sprint-level fact onto the
commits it covers**, so a reader with a clone can reach it without knowing your sprint file exists or
how to parse it. The two must agree; the sprint file stays the place the approval is *recorded*, and
`Evidence:` is the pointer back to it.

What this buys is **verifiability, not approval frequency.** An implementation that batches G1/G2 once
per sprint and one that signs every task can both be conformant here; what §13 forbids is a repo that
claims per-commit approval it never obtained. State the cadence honestly in `Evidence:` and the claim
stays true at either granularity.

**c. The claim-vs-proof boundary — this is the load-bearing paragraph.**

**An unsigned trailer is an assertion by whoever wrote the commit, and nothing more.** Trailers are
plain text in the commit message. Anyone who can write a commit can write any `Gate-Signed-By:` line
they like, naming anyone. Nothing in git checks it. A verifier reading an unsigned trailer may
conclude *"this repository states that this person approved these gates, and points at where it says
so"* — and may **not** conclude that the named person approved anything.

**Signing is what converts the claim into proof.** When the commit carries a valid signature
(`git log --format=%G?` → `G`), the trailer's contents are covered by that signature, and a verifier
with the signer's public key can conclude the *signer* attested to this text. Note precisely what
that does and does not establish: it binds the **signer** to the claim, so `Gate-Signed-By:` is proof
only when the signer and the named approver are the same party, or when the signer is an authority
you already trust to make the statement.

Consequently **Attested is not reachable by trailers alone.** An implementation that emits perfect
trailers over unsigned commits has reached Gated and has made its records easier to read; it has not
reached Attested, and reporting otherwise is exactly the theatre a conformance level exists to
prevent. Do not soften this in an implementation's own documentation: the honest statement is that
the format is in place and the signing is not.

**d. Worked example — a real commit, shown in the weaker state.**

Taken from this specification's own reference implementation, so the example is checkable rather than
illustrative. Commit `97eca0b` was produced under a sprint whose gates were signed and recorded as
`gates_signed: G1,G2 @ cac204b`. Its conformant trailer block would read:

```
sprint(70) T2: cure the worktree base pin at its cause, and guard it

<body>

Gate-Signed-By: Aldian Rizki <aldian.mar@gmail.com>
Gate: G1,G2
Evidence: docs/sprint/SPRINT-070-attested.md @ cac204b
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

**What a verifier may conclude from it, and what it may not.** Re-derived at the time of writing
rather than assumed: `git log -1 --format=%G?  97eca0b` → **`N`** — no signature. Across the whole
repository, `git log --format=%G? | sort | uniq -c` → **673 of 673 commits `N`**. So for this example
a verifier may conclude only that the repository *states* these gates were approved by that person
and points at `docs/sprint/SPRINT-070-attested.md` for the record. It may **not** conclude that the
named human approved anything, because nothing here is signed. Reaching Attested on this repository
requires commit signing, which it does not yet do.

This example is deliberately the unsigned case. Illustrating §13 with a signed commit that does not
exist would demonstrate the format by misrepresenting the implementation — and a standard whose own
worked example overstates its author's conformance has taught the wrong lesson before its first
adopter has read a second page.

**e. Author identity is not the attestation.** Do not infer the approver from the commit's `author`
or `committer`. Both vary by setup: an agent may commit under its own identity, or under a human's
git config with the agent recorded as `Co-Authored-By:` (the case above). Neither arrangement says
anything about who approved a gate. That is what `Gate-Signed-By:` is for, and why it is a separate
field rather than something a verifier derives.
