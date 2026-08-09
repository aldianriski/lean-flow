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
| WHERE things live | `docs/architecture/overview.md` or `README.md` |
| WHAT changed | `CHANGELOG.md` (root) |
| Unsure | code |

## Bundled assets (load these — do not free-generate)

- `${CLAUDE_SKILL_DIR}/references/DOCS_Guide.md` — the standard: 4 Laws, Core Files + line caps, ownership header, ADR format, HOW filter, checklist. **Read first.**
- `${CLAUDE_SKILL_DIR}/templates/*.md.template` — the canonical format per doc type. **The template IS the format** — read the matching one before writing any core doc.
- `templates/DESIGN.md.template` — **OPTIONAL · frontend-only · non-core.** Offer only for UI/frontend repos wanting a shared design-system / token contract (`docs/DESIGN.md` or repo's design dir). Never auto-create; never include in core doc generation.
- `templates/RESEARCH.md.template` — **occasional · create-lazily.** A decision-driving question → options · evidence · recommendation that **feeds an ADR** (desk synthesis; distinct from `/prototype` = design you must *feel*, and `/council` = a hard fork). → `docs/research/<slug>.md`.
- `templates/deployment-guide.md.template` + `templates/deployment-rollback.md.template` — **occasional · create-lazily.** Deploy flow, env matrix, migration order, health checks, release verification (guide) + rollback process + verification (rollback) — operational, like setup. `/release-patch` bumps + stops before push; these own the push/deploy/rollback steps. → `docs/deployment/deployment-guide.md` / `docs/deployment/rollback-guide.md`.

## Modes

| Command | Behavior |
|---|---|
| `/lean-doc-generator` | Update every doc touched this session; refresh `last_updated` |
| `/lean-doc-generator <type> <subject>` | Create/update one core file |
| `/lean-doc-generator promote` | Sprint Promote (below) |
| `/lean-doc-generator close` | Sprint Close (below) |
| `/lean-doc-generator migrate` | **Adopt + clean** existing docs (dev-flow · adlc-flow · any layout) — align placement/format/wiring, **consolidate dupes, retire dead docs**. Plan → approve → apply. **Re-runnable as an update sync** (report standard/template deltas, never clobber). |
| `/lean-doc-generator init` | **Scaffold a fresh repo** (greenfield) — scope-interactive: base tier always + higher tiers by repo type; docs + the 3-file safe-scaffold allowlist only (never `settings.json`). The twin of migrate. |

## Migrate (adopt + clean existing docs)

For a repo that already has documentation — ran dev-flow / adlc-flow, or has its own ad-hoc docs —
align it to lean-flow's **placement · format · wiring**, and **clean house** (consolidate duplicates,
retire dead docs), so you don't hand-reconcile or get lost in existing code. **HITL + surgical**:
detect (incl. dupes / orphans / stale) → propose a per-file plan (keep / reformat / relocate / split /
index / archive / consolidate / retire / leave) → **wait for approval** → apply incrementally; never
delete content without explicit per-item approval, never touch out-of-scope artifacts. **Re-runnable
as an update sync** — on an already-adopted repo, migrate detects standard/template deltas since
adoption and **reports** them (idempotent · report-only · never clobbers user edits). **Headless** — no
approval can arrive, so record the park before halting: the plan + what it waits on → the `/handoff`
doc (no sprint file exists here). A prose-only "waiting on your approval" leaves the morning owner no
artifact that the run happened. Full mapping + re-run procedure → `${CLAUDE_SKILL_DIR}/references/migration-map.md`.

## Init (scaffold a fresh repo)

For a **greenfield** repo with no lean-flow docs yet — the twin of migrate. **Scope-interactive +
docs-only** — the base-tier mandatory minimum always, higher tiers offered via an AskUserQuestion
popup; writes docs plus exactly the three-file safe-scaffold allowlist (`.env.example` ·
`.gitignore` · `LICENSE`, write-if-absent), never `settings.json` or any other non-doc file. **Headless**
— the tier popup cannot be answered, so record the park before halting: the detected substrate + the
unanswered tier choice → the `/handoff` doc. Declining in prose alone leaves no artifact. Full
procedure, base-tier table, and the safe-scaffold allowlist → `${CLAUDE_SKILL_DIR}/references/init.md`.

## Execution flow

1. **Load the standard** — read `references/DOCS_Guide.md`. It defines the Core Files, line caps, and the template-load protocol.
2. **Date check** — compare today's date to any `last_updated:` you are about to write; if it would drift ≥1 day, ask before correcting. Never silently fix.
3. **Staleness scan** — read existing docs; flag any with a stale/missing ownership header before using them as a source.
4. **Read manifests** — `package.json` / `pyproject.toml` / `go.mod` etc. + existing docs. If inaccessible, ask the user to paste the file tree + manifest.
5. **HOW filter** — discard anything that explains implementation; keep WHY / WHERE / WHAT only.
6. **Template-load protocol** *(this is the step that, when skipped, produces wrong docs)* — for each core file, **Read `${CLAUDE_SKILL_DIR}/templates/<X>.md.template` BEFORE writing**. Match its frontmatter order, section order, and placeholders; replace `[CUSTOMIZE]` / `[bracket]` tokens with real content. If the template is missing, WARN and fall back to `DOCS_Guide.md §2` — never hard-stop. Template wins on any divergence; note the correction inline.
7. **Write** — target the canonical placement (DOCS_Guide §2: root for README/TODO · `.claude/` for AI-context · `docs/` for the rest); enforce the line cap and the ownership header on every file touched. **If the project maintains a generated knowledge index, regenerate it after writing a metadata-carrying doc (LEARNINGS · ADR · research)** — a derived view, never hand-edited (lean-flow itself: `sh scripts/gen-index.sh` → `docs/knowledge-index.md`).
8. **Close** — list docs delivered + headers to verify + recommended follow-ups.

## Sprint lifecycle

The active sprint is its own file — `docs/sprint/SPRINT-NNN-<slug>.md` from `templates/SPRINT.md.template`.
`TODO.md` is the Backlog **pool**; the sprint file is the **active** plan + Retro, and the Execution Log is its uncapped sibling `docs/sprint/logs/SPRINT-NNN-<slug>.md` (ADR-014).
Optional **streams**: a multi-stream repo runs one active sprint *per stream* (`stream:` frontmatter ·
one pointer per stream in TODO § Active Sprint); single-stream repos omit it — unchanged.

| User says… | Do |
|---|---|
| "promote" / "start sprint" | **Governance review first** (below) → pull chosen `state: ready` Backlog tasks (TODO.md, dependency order) into a new `docs/sprint/SPRINT-NNN-<slug>.md` rendered from `templates/SPRINT.md.template` (each task → a Plan `Tn` with DoD checkboxes); set `status: active` + `plan_commit`; point the stream's pointer in TODO.md § Active Sprint at the file (single-stream: the lone pointer; **multi-stream: confirm which stream this sprint belongs to before writing `stream:`**); commit `sprint(N): plan locked` |
| executing during a sprint | Tick DoD `[x]` as each passes; **append to the Execution Log sibling (`docs/sprint/logs/`, rendered lazily from `templates/sprint-log.md.template` at the first entry), never edit § Plan** (the plan is frozen); keep Files Changed current |
| "close" / "sprint done" | Verify all DoD `[x]`; **sweep the full session** (Execution Log + any TD/follow-up surfaced mid-run but not yet filed) for the buckets; write the **Retro** + route its buckets (§10); set `status: closed` + `close_commit`; clear that stream's pointer in TODO § Active Sprint; **run §11 retention as one propose→approve pass** — apply only on owner approval: **archival pass** (move closed sprint → `docs/sprint/archive/` **and its log → `docs/sprint/archive/logs/` in the same commit** + a line in `docs/sprint/INDEX.md` · remove shipped tasks' Backlog entries outright, no shipped-in comments · scrub remaining TODO.md refs to the closed SPRINT-NNN outside § Active Sprint · verify CHANGELOG rotation links resolve) + **compaction sweep** (periodic, same gate: promoted `L-NNN` bodies → one-line pointers; superseded/duplicated research → supersede note or archive; measured line delta reported); **doc-freshness check** — map Files Changed against §2 update triggers and propose refreshes for affected docs (propose→approve, never silent); squash-commit `sprint(N): <summary>`; then **fixes-only → `/release-patch` (PATCH) · feature sprint → MINOR by hand** (release-patch is PATCH-only) |

**Retro at close** — first **sweep the full session** (the Execution Log + any TD/follow-up surfaced mid-run but not yet filed), then sort the sprint into four buckets and **route each to its durable home** (DOCS_Guide §10):
Shipped → `CHANGELOG.md` (root; legacy `docs/`) · Tech debt → `TD-NNN` in root `TECH-DEBT.md` · Follow-ups → `TASK-NNN` in TODO § Backlog · Learnings → `L-NNN` in `docs/LEARNINGS.md`. **Auto-file all four** (per `templates/LEARNINGS.md.template`); show the user what was filed.
**Unattended** — close splits: the Retro, the four-bucket auto-file, `close_commit`, and clearing the stream pointer are **additive → they run**; §11 retention (archive · move · prune · compact) and the doc-freshness propose→approve are **lossy or approval-bound → they park** for the morning. Never approve your own retention pass to "finish the close".

**Governance review at promote** — before planning, run the scan and **emit it as a checklist the owner signs off on**, never silent prose:
`☐ L-promotion (count≥2, promoted:no): <findings|none>` · `☐ TD aging (≥3 sprints unaddressed): <findings|none>` · `☐ doc-aging §11 (TD deletion · CHANGELOG rotation · LEARNINGS pointer-collapse · TODO ~150-line cap): <findings|none>`.
Resolve each ☑ line before sign-off: promote flagged learnings into a durable rule (CLAUDE.md anti-pattern / CONTEXT.md rule / skill red-flag) and mark `promoted: yes → <where>`; aged TD → re-review prompt, `severity: high` → auto-escalate Backlog P1; doc-aging → propose compression, apply on approval. **Explicit owner sign-off on the checklist is required before rendering the sprint file or committing `plan locked`.**
**Unattended** — promote is HITL end-to-end (it *forms* the Plan, so nothing here is pre-approvable): a headless run **parks** at the scan and exits; it never signs its own checklist, and never renders a sprint to get on with the night. Same for `migrate`/`init` per-item approvals (recorded there too — see each section). Every park is **recorded, not merely performed**: no sprint file to log into → the record (what stopped · its unblock condition) goes in the `/handoff` doc. Contract → `orchestrator/references/night-run.md` Part 0.

## Red flags

❌ **Writing a core doc without reading its template** — the cause of skipped/wrong generation; Step 6 is mandatory.
❌ **HOW in a doc** — redirect to a code comment; never raise a line cap to fit HOW.
❌ **No ownership header** — every doc touched gets a fresh header before you leave it.
❌ **A person as owner** ("Alice") — reassign to a role.
❌ **Stale doc used as source** — run the staleness scan first.
❌ **A new file outside the core set** — fit it into an existing core file or a code comment.
