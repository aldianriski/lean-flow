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
| `SECURITY.md` | Anyone | ~80 | init (always) | auth model · secret policy · vulnerability-reporting change | — |
| `CHANGELOG.md` | Reviewer | append-only | first release or sprint close (always-core — ADR-012 deviation) | sprint close · release | rotate at new MINOR → `docs/changelog/` (§11) |
| `LICENSE` | Anyone | — | init (license chosen; private → proprietary notice) | license change (rare) | — |
| `AGENTS.md` | AI tools | ~10 | init (always) — **thin pointer to `.claude/CLAUDE.md`, never duplicated instructions** | pointer targets move | — |
| `.env.example` | Dev | — | init **safe-scaffold** (write-if-absent; names only, never values) | a new env var is introduced | — |
| `.gitignore` | git | — | init **safe-scaffold** (write-if-absent; from the §12 boundary rule) | a new generated-artifact class appears | — |
| `TODO.md` | Dev / AI | ~150 soft | init (always) | backlog change · sprint promote/close | §11 prune |
| `TECH-DEBT.md` | Dev / AI | collapsed rows | first TD filed | close files TD · promote ages · debt resolved | §11 collapse |

**AI context (`.claude/`):**

| File | Reader | Cap | Create ← | Update ← | Archive |
|---|---|---|---|---|---|
| `CLAUDE.md` | AI assistant | 80 | init (always) | project shape / workflow / anti-patterns change | — |
| `CONTEXT.md` | AI assistant | 130 (ADR-007) | init (always) | vocabulary / patterns / conventions change | — |

**`docs/` tree** (tier column per §6; legacy lean paths in parentheses stay matched second):

| File | Tier | Reader | Cap | Create ← | Update ← |
|---|---|---|---|---|---|
| `product/requirements.md` | base | Dev / PM | 150 soft | init, or first sanitized PRD lands | a requirement is approved / changed (via PR) |
| `product/acceptance-criteria.md` | base | Dev / QA | 120 soft | with requirements | acceptance criteria change |
| `architecture/overview.md` *(was `docs/ARCHITECTURE.md`)* | base | Tech lead | 150 | init (always) | major structural change |
| `architecture/data-flow.md` | backend, or overview cap-split | Dev | 120 | a non-trivial data path exists | that flow changes |
| `architecture/authentication.md` | auth exists | Dev | 120 | auth is introduced | authn/authz architecture changes |
| `architecture/integrations.md` | backend/integration | Dev | 120 | first external integration | an integration is added / changed |
| `adr/ADR-NNN-<slug>.md` + `DECISIONS.md` index | medium+ | Team | per file, append-only | a qualifying decision (§4) | new ADR → index row |
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
| `sprint/SPRINT-NNN-<slug>.md` | lean loop | AI mid-sprint | 400 hard | promote | append during sprint; retro at close → §11 archive |
| `LEARNINGS.md` | lean loop | Team / AI | append-only | first confirmed learning | close confirms · promote collapses (§11) |
| `research/<slug>.md` | as needed | Team / AI | 120 soft | a decision-driving question | question revisited · verdict changes |
| `BUG-<slug>.md` | ephemeral | Anyone | lean | a defect is reported | routed away at `/triage` |

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
to stay under a cap, and never raise the cap (§7). Ledgers (§11) compress; **knowledge docs split**.

**LAW 1, reinterpreted (ADR-012).** The mandatory minimum above is scaffolded at **init** — with
real content prompts, never empty shells; beyond the minimum, create-lazily still governs (no doc
until its absence causes repeated interruptions). Minimal stays the floor *per doc* (LAW 4), not a
ceiling on the doc *set*.

**Temp-dir artifacts** (council verdicts, handoff docs) are never referenced from durable docs — copy to `docs/research/` (verdicts) before citing.

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

**SKILL.md cap (ADR-006).** A skill's `SKILL.md` stays ≤ ~110 lines of **procedure + scaffolding**;
**executable artifacts** (prompt templates, persona/advisor definitions, schemas) live in the skill's
own `references/` and **don't count** toward the cap. "Executable artifact" must not stretch to cover
ordinary prose — police it honestly.

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
ANOTHER skill's `references/`/`templates/`. **Caps**: `SKILL.md` ≤ ~110 lines procedure+scaffolding
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
| **Base** | every dev repo | the TemiDev mandatory minimum: root set (§2) · `product/{requirements,acceptance-criteria}` · `architecture/overview` · `development/{setup,coding-standards}` · `testing/testing-guide` · `deployment/{deployment,rollback}-guide` — conditional rows (`database/` · `authentication`) fire on substrate (DB / auth exists) |
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
| Mega doc (over line limit) | Split per §2; never raise the limit |
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

The active sprint is its own working doc — `docs/sprint/SPRINT-NNN-<slug>.md`, 400-line hard cap.
`TODO.md` holds the Backlog **pool**; the sprint file holds the **active** plan + history. Sections
(see the template): frontmatter (`status` · `plan_commit` · `close_commit`) · Theme · Scope (In/Out) ·
Plan (Tn + size·risk + Acceptance + **DoD checkboxes** — what `/orchestrator sprint-bulk` loops and
`/prime` counts) · Owner-action checklist · Decisions→ADR · Assumptions · **Execution Log**
(append-only; plan frozen at promote) · Files Changed · **Retro** (routed per §10).

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
is promoted from a ledger line into a *durable* rule: a `CLAUDE.md` anti-pattern, a `CONTEXT.md`
rule, or a skill red-flag. Mark `promoted: yes → <where>` on the entry. One-offs stay ledger lines —
they're context, not law. Don't promote on a single occurrence; don't let a 2nd occurrence pass unpromoted.

**Tech-debt aging** — at **Sprint Promote**: any `TD-NNN` unaddressed ≥ 3 sprints triggers a
re-review prompt; `severity: high` auto-escalates to Backlog P1. Rows are never deleted — resolved
debt is marked `status: resolved → TASK-NNN` for the audit trail.

**Promote review (the governance checkpoint)** — before planning a sprint, run the L-promotion scan, TD
aging, and doc-aging (§11) triggers, then **emit the result as an explicit checklist** rather than silent
prose — `☐ L-promotion (count≥2, promoted:no): <findings|none>` · `☐ TD aging (≥3 sprints unaddressed):
<findings|none>` · `☐ doc-aging §11: <findings|none>`. **Explicit owner sign-off on the checklist is
required before rendering the sprint file or committing `plan locked`.** This is what stops learning and
debt from rotting — and stops the review itself from being skipped unnoticed.

---

## §11 — Retention (LAW 3's archive leg)

The single-file ledgers grow forever in an agentic loop. Compression keeps them lean without losing
history: **git is the full audit trail — archives and collapses move or shrink blocks, never rewrite
them**. Append-only is preserved *inside* each archive file.

| Ledger | Trigger | Action |
|---|---|---|
| `TODO.md` Backlog entries (shipped/promoted) | sprint close | **remove outright** (propose→approve) — no shipped-in-SPRINT breadcrumb comments left in TODO.md; history's durable homes are root `CHANGELOG.md` + `docs/sprint/archive/` |
| `TECH-DEBT.md` | `resolved` ≥ 3 sprints ago | collapse the row to one line in § Resolved: `TD-NNN resolved → TASK-NNN (Sprint-NNN)` |
| `TODO.md` whole file | > ~150 lines at promote | flag in the governance review; prune with the user |
| `CHANGELOG.md` (root) | a new MINOR version lands | keep current + previous minor inline; older blocks move verbatim → `docs/changelog/CHANGELOG-<version>.md` + one link line |
| `docs/LEARNINGS.md` | an entry reaches `promoted: yes` | collapse it to a pointer line — `L-NNN → promoted: <where>`; the durable rule is the record now. **Ids are monotonic, never reused** — pruning removes the body, never frees the id; the next new id = highest-ever + 1 |
| `docs/sprint/SPRINT-NNN-<slug>.md` | sprint closed | move → `docs/sprint/archive/`; add to `docs/sprint/INDEX.md` (created lazily) one line: `- SPRINT-NNN — <theme> — closed YYYY-MM-DD · <close_commit>` |

**When it runs** — close-time triggers (Backlog removal · sprint archive) execute during `close`;
scan-based triggers (TD collapse · rotation · LEARNINGS collapse · the soft cap) run at **Promote**
as **doc-aging**, alongside tech-debt aging in the governance review. Always propose → approve →
apply; never compress silently.

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
