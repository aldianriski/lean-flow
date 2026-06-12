# Migrate / adopt — align existing docs to the lean-flow standard

Used by `/lean-doc-generator migrate`. Brings an existing repo's documentation into lean-flow's
**placement · format · wiring** — whether the repo ran **dev-flow**, **adlc-flow**, or just has its
own ad-hoc docs — **and cleans house**: consolidates duplicates and retires dead docs. Goal: you
don't hand-reconcile, and you're not lost in your own existing code.

## Procedure (HITL · surgical)

1. **Detect** — scan for docs and identify the source pattern: dev-flow / adlc-flow footprint (known
   mappings below) or **generic** (any other layout). List what was found.
   - **Clean-sweep scan** — also flag **duplicates** (same content in two+ places), **orphans** (no
     inbound links from any doc/code), and **stale/superseded** (contradicts current code, or
     `last_updated` long past §3's 60-day flag). **Apply the out-of-scope filter first** — never flag an
     out-of-scope artifact (adlc-flow's, app-specific, generated) as a dupe/consolidate candidate; two
     *frameworks'* same-named files (e.g. a lean-flow `CONTEXT.md` beside an adlc-flow one) are
     coexistence, not a dupe. Heuristic only — flags for human judgment, never an auto-verdict.
2. **Plan** — for *each* existing doc, propose one action: **keep · reformat · relocate · split ·
   index · archive · consolidate · retire · leave (out of scope)** — with its lean-flow target and a
   one-line why. Present the whole plan; **wait for approval**. Never start rewriting before the human
   signs off.
3. **Apply incrementally** — preserve **content**; change only format / placement / wiring. Update
   cross-references so the loop works (`DECISIONS` index ↔ `docs/adr/`, TODO § Active Sprint pointer,
   `/prime` read-order). Flag anything ambiguous instead of guessing.
   - **After each relocate/rename**: `grep` the old filename/path across the repo and fix every inbound link before moving to the next file.
4. **Verify** — `/prime` reads cleanly, no dangling references, ADR index resolves, sprint pointer valid.

## Surgical rules

- **Never delete pre-existing content silently** — reformat/relocate/archive it, or surface it and ask. Content is the user's; format is ours. The **only** sanctioned deletion is `retire`-by-hard-delete, and only on **explicit per-item approval** (below) — never a batch "delete all".
- WHY/WHERE only — if a migrated doc explains HOW, that line moves to a code comment (DOCS_Guide §5).
- **Out-of-scope artifacts stay untouched + noted** — anything lean-flow doesn't own (adlc-flow's ADLC artifacts, app-specific docs, generated files). Don't "tidy" them.
- One doc at a time; show the before→after shape for each.

## Consolidate & retire (the clean sweep)

Adoption isn't only alignment — a long-lived repo accrues dead and duplicated docs. Two actions clean
that up, both **HITL and per-item** (never silent, never batched):

- **consolidate** — two+ docs cover the same ground → merge into one canonical file, fold in any unique
  content, fix inbound links to point at the survivor. Nothing is lost; the duplicates collapse.
- **retire** — a doc is dead (orphaned · superseded · contradicted by current code). Default is
  **archive** (move → `docs/archive/`, content intact). **Hard-delete is offered only when the user
  explicitly approves that item** — the one sanctioned deletion; git keeps the history regardless.

Detection (step 1) is heuristic — duplicate-content match · inbound-link graph · `last_updated` age ·
code contradiction — and only ever **proposes**; the human decides consolidate vs retire vs keep.

## Placement — relocate to the canonical layout (DOCS_Guide §2)

Applies to **any** source pattern. A relocation is a `git mv` + inbound-link fixes (grep the
filename) — content untouched. Propose these in the per-file plan like any other action:

| Found at | Relocate to |
|---|---|
| `CHANGELOG.md` (root) | `docs/CHANGELOG.md` |
| `LEARNINGS.md` (root) | `docs/LEARNINGS.md` |
| `DECISIONS.md` (root) | `docs/DECISIONS.md` (stays the thin index; ADRs already `docs/adr/`) |
| `ARCHITECTURE.md` (root) | `docs/ARCHITECTURE.md` |
| `SETUP.md` (root) | `docs/SETUP.md` |
| `CONTEXT.md` / `CLAUDE.md` (root) | `.claude/CONTEXT.md` / `.claude/CLAUDE.md` |
| `README.md` · `TODO.md` | stay at root (front-door · daily working file) — never relocate |

## Known mappings — dev-flow / adlc-flow → lean-flow

| Existing | Action | lean-flow target |
|---|---|---|
| `DECISIONS.md` (single ADR log) | split + index | one rich ADR per file `docs/adr/ADR-NNN-<slug>.md` + `DECISIONS.md` as the index |
| `docs/codemap/CODEMAP.md` (3-tier) | fold + drop | structure into `ARCHITECTURE.md`; lean-flow has no codemap |
| `.claude/CONTEXT.md` (dev-flow vocab · gates · agent roster) | reformat | lean-flow `CONTEXT.md` (loop · gates · modes · roster) |
| `.claude/CLAUDE.md` | reformat | `CLAUDE.md.template` shape (Behavioral Guidelines incl. concise-reporting) |
| sprint files | reformat | `SPRINT.md.template` (Retro → §10 routing) |
| `TODO.md` | reformat | Backlog-pool (P0–P3) + Tech Debt + Active-Sprint **pointer** |
| `CHANGELOG.md` | keep / align | Keep-a-Changelog; sprint-close feeds it |
| `agents/`, `hooks/` | **flag, don't delete** | lean-flow ships none — the loop dispatches built-ins; tell the user these are now inert under lean-flow |
| adlc-flow `HYPOTHESIS.md` · `EVAL-SUITE/` · `GOLDEN-DATASET/` · `OBSERVABILITY.md` … | **leave untouched + note** | out of lean-flow scope (those are adlc-flow's domain) |

## Generic existing docs (no dev-flow/adlc-flow)

- Existing `README` → align to `README.md.template` sections; keep the content.
- Existing architecture / design doc → `ARCHITECTURE.md` format.
- Existing decision notes / ADRs (any shape) → rich `docs/adr/ADR-NNN-<slug>.md` + `DECISIONS.md` index.
- Existing changelog → keep; align to Keep-a-Changelog if it diverges.
- Existing backlog / issues file → `TODO.md` Backlog-pool + sprint pointer.
- Existing `CONTEXT`/`CLAUDE`/agent-instruction file → lean-flow `CONTEXT.md` / `CLAUDE.md` format.
- **Unrecognized docs** → leave untouched, list them, ask where they belong (don't force a mapping).
