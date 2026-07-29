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

## §2 — Core Files

| File | Place | Reader | Max lines | Update trigger | Template |
|---|---|---|---|---|---|
| `README.md` | root | Anyone | no hard cap¹ | Project scope changes | `templates/README.md.template` |
| `TODO.md` | root | Dev / AI | ~150 soft (§11) | Backlog change · sprint promote/close | `templates/TODO.md.template` |
| `TECH-DEBT.md` | root | Dev / AI | collapsed rows (§11) | Sprint close files TD · promote ages it · debt resolved | `templates/TECH-DEBT.md.template` |
| `CLAUDE.md` | `.claude/` | AI assistant | 80 | Project shape / workflow / anti-patterns change | `templates/CLAUDE.md.template` |
| `CONTEXT.md` | `.claude/` | AI assistant | 130 (ADR-007 — dense SSOT) | Vocabulary / patterns / conventions change | `templates/CONTEXT.md.template` |
| `ARCHITECTURE.md` | `docs/` | Tech lead | 150 | Major structural change | `templates/ARCHITECTURE.md.template` |
| `SETUP.md` | `docs/` | New dev / CI | 100 | Setup process changes | `templates/SETUP.md.template` |
| `DECISIONS.md` | `docs/` | Team | thin index | A new ADR is added under `docs/adr/` | `templates/DECISIONS.md.template` |
| `ADR-NNN-<slug>.md` | `docs/adr/` | Team | per file, append-only | Each significant decision (one ADR per file) | `templates/ADR.md.template` |
| `CHANGELOG.md` | `docs/` | Reviewer | append-only · rotated (§11) | Sprint closed | `templates/CHANGELOG.md.template` |
| `LEARNINGS.md` | `docs/` | Team / AI | append-only · pruned (§11) | A learning confirmed at close, or promoted | `templates/LEARNINGS.md.template` |
| `research/<slug>.md` | `docs/research/` | Team / AI | 120 soft · create-lazily | Question revisited, or a new source changes the verdict | `templates/RESEARCH.md.template` |
| `DEPLOY.md` | `docs/` | Dev / ops | 100 soft · create-lazily | Release process / rollback changes | `templates/DEPLOY.md.template` |
| `BUG-<slug>.md` | wherever raised (ephemeral — routed away at `/triage`, no durable directory) | Anyone | lean · create-lazily per bug | A defect is reported | `templates/BUG.md.template` |
| `SPRINT-NNN-<slug>.md` | `docs/sprint/` | AI mid-sprint | 400 hard cap | Append during sprint; retro at close | `templates/SPRINT.md.template` |

Templates resolve under `${CLAUDE_SKILL_DIR}/templates/`. Paths above are relative to that dir.

**Placement is canonical.** Root keeps only the daily working files (`README.md` front-door ·
`TODO.md` · `TECH-DEBT.md`); AI-context lives in `.claude/`; everything else lives in `docs/`. Generation targets
these paths; `/prime` searches them first (legacy root locations still matched, second); `migrate`
relocates a legacy layout (`git mv` + inbound-link fixes — content untouched).

**Temp-dir artifacts** (council verdicts, handoff docs) are never referenced from durable docs — copy to `docs/research/` (verdicts) before citing.

¹ **README is the full front-door** — the complete overview of the repo. Don't truncate it to hit a
line count; deep detail belongs in `CLAUDE.md` (project shape) and `CONTEXT.md` (vocabulary) and
`ARCHITECTURE.md` (structure), which the README links to. Keep it signal-dense (LAW 4), not short.
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
3. **Divergence** → template wins. Surface a one-line note (e.g. `"Section order corrected per ARCHITECTURE.md.template"`). Never silently rewrite — the user must see the divergence.

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

## §6 — Tiered scale model

| Tier | Team | Files |
|---|---|---|
| 1 | Solo | README · SETUP · CONTEXT |
| 2 | Small team | + ARCHITECTURE · DECISIONS · TODO · CHANGELOG · sprint/ |
| 3+ | Multi-service | + service registry · dependency map · global decisions |

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
| Shipped | `docs/CHANGELOG.md` |
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
| `TODO.md` Backlog entries (shipped/promoted) | sprint close | **remove outright** (propose→approve) — no shipped-in-SPRINT breadcrumb comments left in TODO.md; history's durable homes are `docs/CHANGELOG.md` + `docs/sprint/archive/` |
| `TECH-DEBT.md` | `resolved` ≥ 3 sprints ago | collapse the row to one line in § Resolved: `TD-NNN resolved → TASK-NNN (Sprint-NNN)` |
| `TODO.md` whole file | > ~150 lines at promote | flag in the governance review; prune with the user |
| `docs/CHANGELOG.md` | a new MINOR version lands | keep current + previous minor inline; older blocks move verbatim → `docs/changelog/CHANGELOG-<version>.md` + one link line |
| `docs/LEARNINGS.md` | an entry reaches `promoted: yes` | collapse it to a pointer line — `L-NNN → promoted: <where>`; the durable rule is the record now. **Ids are monotonic, never reused** — pruning removes the body, never frees the id; the next new id = highest-ever + 1 |
| `docs/sprint/SPRINT-NNN-<slug>.md` | sprint closed | move → `docs/sprint/archive/`; add to `docs/sprint/INDEX.md` (created lazily) one line: `- SPRINT-NNN — <theme> — closed YYYY-MM-DD · <close_commit>` |

**When it runs** — close-time triggers (Backlog removal · sprint archive) execute during `close`;
scan-based triggers (TD collapse · rotation · LEARNINGS collapse · the soft cap) run at **Promote**
as **doc-aging**, alongside tech-debt aging in the governance review. Always propose → approve →
apply; never compress silently.
