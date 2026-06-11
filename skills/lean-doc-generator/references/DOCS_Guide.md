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
| `TODO.md` | root | Dev / AI | unlimited | Backlog change · sprint promote/close | `templates/TODO.md.template` |
| `CLAUDE.md` | `.claude/` | AI assistant | 80 | Project shape / workflow / anti-patterns change | `templates/CLAUDE.md.template` |
| `CONTEXT.md` | `.claude/` | AI assistant | 100 | Vocabulary / patterns / conventions change | `templates/CONTEXT.md.template` |
| `ARCHITECTURE.md` | `docs/` | Tech lead | 150 | Major structural change | `templates/ARCHITECTURE.md.template` |
| `SETUP.md` | `docs/` | New dev / CI | 100 | Setup process changes | `templates/SETUP.md.template` |
| `DECISIONS.md` | `docs/` | Team | thin index | A new ADR is added under `docs/adr/` | `templates/DECISIONS.md.template` |
| `ADR-NNN-<slug>.md` | `docs/adr/` | Team | per file, append-only | Each significant decision (one ADR per file) | `templates/ADR.md.template` |
| `CHANGELOG.md` | `docs/` | Reviewer | unlimited (append-only) | Sprint closed | `templates/CHANGELOG.md.template` |
| `LEARNINGS.md` | `docs/` | Team / AI | unlimited (append-only) | A learning confirmed at close, or promoted | `templates/LEARNINGS.md.template` |
| `SPRINT-NNN-<slug>.md` | `docs/sprint/` | AI mid-sprint | 400 hard cap | Append during sprint; retro at close | `templates/SPRINT.md.template` |

Templates resolve under `${CLAUDE_SKILL_DIR}/templates/`. Paths above are relative to that dir.

**Placement is canonical.** Root keeps only the daily working files (`README.md` front-door ·
`TODO.md`); AI-context lives in `.claude/`; everything else lives in `docs/`. Generation targets
these paths; `/prime` searches them first (legacy root locations still matched, second); `migrate`
relocates a legacy layout (`git mv` + inbound-link fixes — content untouched).

¹ **README is the full front-door** — the complete overview of the repo. Don't truncate it to hit a
line count; deep detail belongs in `CLAUDE.md` (project shape) and `CONTEXT.md` (vocabulary) and
`ARCHITECTURE.md` (structure), which the README links to. Keep it signal-dense (LAW 4), not short.

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

Every iteration feeds the next. At **Sprint Close**, the Retro sorts work into four buckets, each
**routed to a durable home** (don't leave them in the sprint file):

| Bucket | Routes to |
|---|---|
| Shipped | `docs/CHANGELOG.md` |
| Tech debt | `TD-NNN` row in `TODO.md` § Tech Debt (`severity` + `created: Sprint-NNN`) |
| Follow-ups | `TASK-NNN` entry in `TODO.md` § Backlog (re-enters the loop) |
| Learnings | `L-NNN` entry in `docs/LEARNINGS.md` |

**Promotion rule** — a learning that recurs (**count ≥ 2** — a second sprint hits the same friction)
is promoted from a ledger line into a *durable* rule: a `CLAUDE.md` anti-pattern, a `CONTEXT.md`
rule, or a skill red-flag. Mark `promoted: yes → <where>` on the entry. One-offs stay ledger lines —
they're context, not law. Don't promote on a single occurrence; don't let a 2nd occurrence pass unpromoted.

**Tech-debt aging** — at **Sprint Promote**: any `TD-NNN` unaddressed ≥ 3 sprints triggers a
re-review prompt; `severity: high` auto-escalates to Backlog P1. Rows are never deleted — resolved
debt is marked `status: resolved → TASK-NNN` for the audit trail.

**Promote review (the governance checkpoint)** — before planning a sprint, scan `docs/LEARNINGS.md` for any
`count ≥ 2, promoted: no`, and run tech-debt aging. This is what stops learning and debt from rotting.
