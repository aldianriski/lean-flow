---
name: lean-doc-generator
description: Use when creating, updating, or reviewing technical documentation, ADRs, sprint files, or AI-context files; running the sprint lifecycle (promote / execute / close); or **migrating existing docs** (dev-flow / adlc-flow / any layout) into the lean-flow standard. Follows the LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW. Bundles its own templates + standard, so generated docs match a canonical format. Do not use to document HOW something works; redirect to code comments instead.
argument-hint: "[ | type subject | promote | close]"
allowed-tools: Read, Write, Edit, Bash(git *), Glob, Grep
user-invocable: true
version: "0.4.0"
---

# Lean Documentation Generator

Generate high-signal docs against a canonical format. Self-contained — the standard and every
template ship inside this skill under `${CLAUDE_SKILL_DIR}/`.

## Golden Rule

> Never generate documentation that explains HOW something works.

| Explains… | Goes in… |
|---|---|
| HOW it works | code (comments, types, tests) |
| WHY decided | a rich ADR — one file at `docs/adr/ADR-NNN-<slug>.md` (`templates/ADR.md.template`); add a row to the `docs/DECISIONS.md` index. Offer one only when hard-to-reverse **and** surprising **and** a real trade-off (DOCS_Guide §4) |
| WHERE things live | `docs/ARCHITECTURE.md` or `README.md` |
| WHAT changed | `docs/CHANGELOG.md` |
| Unsure | code |

## Bundled assets (load these — do not free-generate)

- `${CLAUDE_SKILL_DIR}/references/DOCS_Guide.md` — the standard: 4 Laws, Core Files + line caps, ownership header, ADR format, HOW filter, checklist. **Read first.**
- `${CLAUDE_SKILL_DIR}/templates/*.md.template` — the canonical format per doc type. **The template IS the format** — read the matching one before writing any core doc.
- `templates/DESIGN.md.template` — **OPTIONAL · frontend-only · non-core.** Offer only for UI/frontend repos wanting a shared design-system / token contract (`docs/DESIGN.md` or repo's design dir). Never auto-create; never include in core doc generation.

## Modes

| Command | Behavior |
|---|---|
| `/lean-doc-generator` | Update every doc touched this session; refresh `last_updated` |
| `/lean-doc-generator <type> <subject>` | Create/update one core file |
| `/lean-doc-generator promote` | Sprint Promote (below) |
| `/lean-doc-generator close` | Sprint Close (below) |
| `/lean-doc-generator migrate` | **Adopt** existing docs (dev-flow · adlc-flow · any layout) into the lean-flow standard — placement, format, wiring. Plan → approve → apply. |

## Migrate (adopt existing docs)

For a repo that already has documentation — ran dev-flow / adlc-flow, or has its own ad-hoc docs —
align it to lean-flow's **placement · format · wiring** so you don't hand-reconcile or get lost in
existing code. **HITL + surgical**: detect → propose a per-file plan (keep / reformat / relocate /
split / index / archive / leave) → **wait for approval** → apply incrementally; never delete
pre-existing content, never touch out-of-scope artifacts. Full mapping + procedure →
`${CLAUDE_SKILL_DIR}/references/migration-map.md`.

## Execution flow

1. **Load the standard** — read `references/DOCS_Guide.md`. It defines the Core Files, line caps, and the template-load protocol.
2. **Date check** — compare today's date to any `last_updated:` you are about to write; if it would drift ≥1 day, ask before correcting. Never silently fix.
3. **Staleness scan** — read existing docs; flag any with a stale/missing ownership header before using them as a source.
4. **Read manifests** — `package.json` / `pyproject.toml` / `go.mod` etc. + existing docs. If inaccessible, ask the user to paste the file tree + manifest.
5. **HOW filter** — discard anything that explains implementation; keep WHY / WHERE / WHAT only.
6. **Template-load protocol** *(this is the step that, when skipped, produces wrong docs)* — for each core file, **Read `${CLAUDE_SKILL_DIR}/templates/<X>.md.template` BEFORE writing**. Match its frontmatter order, section order, and placeholders; replace `[CUSTOMIZE]` / `[bracket]` tokens with real content. If the template is missing, WARN and fall back to `DOCS_Guide.md §2` — never hard-stop. Template wins on any divergence; note the correction inline.
7. **Write** — target the canonical placement (DOCS_Guide §2: root for README/TODO · `.claude/` for AI-context · `docs/` for the rest); enforce the line cap and the ownership header on every file touched.
8. **Close** — list docs delivered + headers to verify + recommended follow-ups.

## Sprint lifecycle

The active sprint is its own file — `docs/sprint/SPRINT-NNN-<slug>.md` from `templates/SPRINT.md.template`.
`TODO.md` is the Backlog **pool**; the sprint file is the **active** plan + Execution Log + Retro.
Optional **streams**: a multi-stream repo runs one active sprint *per stream* (`stream:` frontmatter ·
one pointer per stream in TODO § Active Sprint); single-stream repos omit it — unchanged.

| User says… | Do |
|---|---|
| "promote" / "start sprint" | **Governance review first** (below) → pull chosen Backlog tasks (TODO.md, dependency order) into a new `docs/sprint/SPRINT-NNN-<slug>.md` rendered from `templates/SPRINT.md.template` (each task → a Plan `Tn` with DoD checkboxes); set `status: active` + `plan_commit`; point the stream's pointer in TODO.md § Active Sprint at the file (single-stream: the lone pointer; **multi-stream: confirm which stream this sprint belongs to before writing `stream:`**); commit `sprint(N): plan locked` |
| executing during a sprint | Tick DoD `[x]` as each passes; **append to the Execution Log, never edit § Plan** (the plan is frozen); keep Files Changed current |
| "close" / "sprint done" | Verify all DoD `[x]`; write the **Retro** + route its buckets (§10); set `status: closed` + `close_commit`; clear that stream's pointer in TODO § Active Sprint; **close-time retention (§11)**: delete Backlog tombstones · move the closed sprint → `docs/sprint/archive/` + a line in `docs/sprint/INDEX.md`; squash-commit `sprint(N): <summary>`; **invoke** `/release-patch` |

**Retro at close** — sort the sprint into four buckets and **route each to its durable home** (DOCS_Guide §10):
Shipped → `docs/CHANGELOG.md` · Tech debt → `TD-NNN` in TODO § Tech Debt · Follow-ups → `TASK-NNN` in TODO § Backlog · Learnings → `L-NNN` in `docs/LEARNINGS.md`. **Auto-file all four** (per `templates/LEARNINGS.md.template`); show the user what was filed.

**Governance review at promote** — before planning: scan `docs/LEARNINGS.md` for any `count ≥ 2, promoted: no` → promote it into a durable rule (CLAUDE.md anti-pattern / CONTEXT.md rule / skill red-flag) and mark `promoted: yes → <where>`. Then age tech debt: any `TD-NNN` unaddressed ≥ 3 sprints → re-review prompt; `severity: high` → auto-escalate to Backlog P1. Then **doc-aging (§11)**: any ledger past a retention trigger (TD collapse · CHANGELOG rotation · LEARNINGS pointer-collapse · TODO ~150-line soft cap) → propose the compression, apply on approval — never silently.

## Red flags

❌ **Writing a core doc without reading its template** — the cause of skipped/wrong generation; Step 6 is mandatory.
❌ **HOW in a doc** — redirect to a code comment; never raise a line cap to fit HOW.
❌ **No ownership header** — every doc touched gets a fresh header before you leave it.
❌ **A person as owner** ("Alice") — reassign to a role.
❌ **Stale doc used as source** — run the staleness scan first.
❌ **A new file outside the core set** — fit it into an existing core file or a code comment.
