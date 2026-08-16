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
   - **Boundary scan (§12)** — also scan the tracked tree for **STANDARD §12b** violations: committed
     secrets/dumps/backups by pattern (`.env`, `*.pem`, `id_rsa*`, `*.sql` dumps, `service-account*.json`)
     plus obvious PII fixtures. **Report-only** — list each hit with its §12 proper-home routing in the
     migrate plan; never auto-delete, never auto-rewrite git history. A committed secret additionally
     needs **rotation** (removing the file from the tree doesn't un-leak it) — surface that as an
     owner-action, not something migrate does. Purging the secret from git history is out of scope; point
     the user to the host's security process.
2. **Plan** — for *each* existing doc, propose one action: **keep · reformat · relocate · split ·
   index · archive · consolidate · retire · leave (out of scope)** — with its lean-flow target and a
   one-line why. Present the whole plan; **wait for approval**. Never start rewriting before the human
   signs off.
   - **Headless (no approval can arrive)** — you are headless when there is no ask channel: probe it
     (`ToolSearch select:AskUserQuestion` → *no matching deferred tools* means unregistered, and under
     `dontAsk` any prompting call is auto-denied). Verify before concluding either way; an interactive
     session waits in prose and that is correct. Once verified, waiting is not an option and neither is
     deciding, so the halt is *recorded* before it happens: write the proposed plan and what it waits on into a
     `/handoff` doc (there is no sprint file at this entry point) and name the unblock condition —
     "owner approves the per-file plan". Then halt. A prose-only "waiting on your approval" ends the
     session with **no artifact that migrate ran at all**, which is what an overnight owner wakes up
     to: the safety property held, and nothing recorded that it did (TD-017 · night-run.md Part 0).
3. **Apply incrementally** — preserve **content**; change only format / placement / wiring. Update
   cross-references so the loop works (`DECISIONS` index ↔ `docs/adr/`, TODO § Active Sprint pointer,
   `/prime` read-order). Flag anything ambiguous instead of guessing.
   - **After each relocate/rename**: `grep` the old filename/path across the repo and fix every inbound link before moving to the next file.
4. **Verify** — `/prime` reads cleanly, no dangling references, ADR index resolves, sprint pointer valid.

## Re-run (update sync — report-only)

migrate is **re-runnable**. On a repo already adopted, re-running it (e.g. after a plugin update)
switches from adopt to **sync**: detect what changed in the lean-flow *standard / templates* since
adoption and **report the deltas** — new template sections, changed doc shape, new conventions/wiring —
as a per-item plan, exactly like first adoption. Guarantees:

- **Idempotent** — nothing changed upstream → a no-op ("already current"); no churn, no diff.
- **Report-only, never clobber** — the sync **never auto-writes over an existing doc**; it surfaces
  each delta for the user to apply or skip under the same plan → approve → apply gate. A user's edits to
  their own docs are never overwritten — their content is theirs; only *their* approval applies a change.
- **What it compares** — the current plugin's standard/templates against the repo's docs' current
  *shape/convention* (a doc missing a new template section, an outdated wiring pointer), **not** the
  user's prose. Structure drift is flagged; wording is left alone.

## Surgical rules

- **Never delete pre-existing content silently** — reformat/relocate/archive it, or surface it and ask. Content is the user's; format is ours. The **only** sanctioned deletion is `retire`-by-hard-delete, and only on **explicit per-item approval** (below) — never a batch "delete all".
- WHY/WHERE only — if a migrated doc explains HOW, that line moves to a code comment (STANDARD §5).
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

## Placement — relocate to the canonical layout (STANDARD §2, ADR-012)

Applies to **any** source pattern. A relocation is a `git mv` + inbound-link fixes (grep the
filename) — content untouched. Propose these in the per-file plan like any other action:

| Found at | Relocate to |
|---|---|
| `docs/CHANGELOG.md` (pre-ADR-012 lean placement — now legacy) | `CHANGELOG.md` (root — **direction reversed from before ADR-012**: root is now canonical, always-core; `docs/CHANGELOG.md` is the legacy source `/prime` still matches second) |
| `LEARNINGS.md` (root) | `docs/LEARNINGS.md` |
| `DECISIONS.md` (root) | `docs/DECISIONS.md` (stays the thin index; ADRs already `docs/adr/`) |
| `ARCHITECTURE.md` (root) or `docs/ARCHITECTURE.md` (pre-ADR-012 lean placement) | `docs/architecture/overview.md` |
| `SETUP.md` (root) or `docs/SETUP.md` (pre-ADR-012 lean placement) | `docs/development/setup.md` |
| `DEPLOY.md` / `deploy/` (root) or `docs/DEPLOY.md` (pre-ADR-012 lean placement) | `docs/deployment/deployment-guide.md` — **split out** any rollback-specific content into `docs/deployment/rollback-guide.md` (present source) rather than folding it into the guide |
| `CONTEXT.md` / `CLAUDE.md` (root) | `.claude/CONTEXT.md` / `.claude/CLAUDE.md` |
| `README.md` · `TODO.md` · `TECH-DEBT.md` | stay at root (front-door · daily working files) — never relocate |

## Legacy-lean layout → TemiDev layout (ADR-012 re-run)

A repo already adopted under the **pre-ADR-012 lean standard** — `docs/ARCHITECTURE.md` ·
`docs/SETUP.md` · `docs/DEPLOY.md` · `docs/CHANGELOG.md` — is not stale or wrong; `/prime` still
matches all four (legacy, second). It gets a **relocation proposal on its next `migrate` re-run**,
exactly like any other re-run delta (see "Re-run" above): report-only until approved, never
auto-applied.

| Legacy-lean file | Proposed relocation | Note |
|---|---|---|
| `docs/ARCHITECTURE.md` | `docs/architecture/overview.md` | content untouched; split into siblings only if already past the 150-line cap |
| `docs/SETUP.md` | `docs/development/setup.md` | content untouched |
| `docs/DEPLOY.md` | `docs/deployment/deployment-guide.md` | split out rollback content → `docs/deployment/rollback-guide.md` if present |
| `docs/CHANGELOG.md` | `CHANGELOG.md` (root) | **direction reversed** — root is now canonical; propose moving *up*, not down |

Same guarantees as any sync re-run: **propose → approve → apply**, never clobber an existing
canonical file, and `git mv` + inbound-link fixes only — content is never rewritten by the move
itself.

## Known mappings — dev-flow / adlc-flow → lean-flow

| Existing | Action | lean-flow target |
|---|---|---|
| `DECISIONS.md` (single ADR log) | split + index | one rich ADR per file `docs/adr/ADR-NNN-<slug>.md` + `docs/DECISIONS.md` as the index |
| `docs/codemap/CODEMAP.md` (3-tier) | fold + drop | structure into `docs/architecture/overview.md`; lean-flow has no codemap |
| `.claude/CONTEXT.md` (dev-flow vocab · gates · agent roster) | reformat | lean-flow `CONTEXT.md` (loop · gates · modes · roster) |
| `.claude/CLAUDE.md` | reformat | `CLAUDE.md.template` shape (Behavioral Guidelines incl. concise-reporting) |
| sprint files | reformat | `SPRINT.md.template` (Retro → §10 routing) |
| `TODO.md` | reformat | Backlog-pool (P0–P3) + Active-Sprint **pointer**; a § Tech Debt inside it **splits out** (next row) |
| tech debt inside `TODO.md` (or an ad-hoc debt list) | split + relocate | root `TECH-DEBT.md` via `TECH-DEBT.md.template` — `TD-NNN` rows move verbatim; `TODO.md` keeps a pointer line |
| `CHANGELOG.md` | keep / align | Keep-a-Changelog; sprint-close feeds it |
| ad-hoc deploy doc · `deploy/` · `RELEASE.md` | reformat + relocate | `docs/deployment/deployment-guide.md` via `deployment-guide.md.template` (operational runbook; code-HOW → comments); split rollback steps → `docs/deployment/rollback-guide.md` via `deployment-rollback.md.template` |
| research · spike · decision write-ups · `notes/` | reformat | `docs/research/<slug>.md` via `RESEARCH.md.template` (desk synthesis → feeds an ADR) |
| `graphify-out/` + graphify mentions | **flag, don't delete** | lean-flow no longer integrates graphify (on-demand only) — note it's inert under the loop; leave the artifact, offer to clean the mentions, **never auto-delete** |
| existing `LEARNINGS.md` lacking `related:` | keep as-is | the `related:` field is **optional + additive** — never backfill; entries without it stay conforming |
| `agents/`, `hooks/` | **flag, don't delete** | lean-flow ships none — the loop dispatches built-ins; tell the user these are now inert under lean-flow |
| adlc-flow `HYPOTHESIS.md` · `EVAL-SUITE/` · `GOLDEN-DATASET/` · `OBSERVABILITY.md` … | **leave untouched + note** | out of lean-flow scope (those are adlc-flow's domain) |

## Generic existing docs (no dev-flow/adlc-flow)

- Existing `README` → align to `README.md.template` sections; keep the content.
- Existing architecture / design doc → `docs/architecture/overview.md` format (`architecture-overview.md.template`).
- Existing deploy / release runbook → `docs/deployment/deployment-guide.md` (`deployment-guide.md.template`) + `docs/deployment/rollback-guide.md` (`deployment-rollback.md.template`) if rollback content exists; keep the steps, move code-HOW to comments.
- Existing research / spike / decision write-up → `docs/research/<slug>.md` (`RESEARCH.md.template`).
- Existing decision notes / ADRs (any shape) → rich `docs/adr/ADR-NNN-<slug>.md` + `DECISIONS.md` index.
- Existing changelog → keep; align to Keep-a-Changelog if it diverges.
- Existing backlog / issues file → `TODO.md` Backlog-pool + sprint pointer.
- Existing `CONTEXT`/`CLAUDE`/agent-instruction file → lean-flow `CONTEXT.md` / `CLAUDE.md` format.
- **Unrecognized docs** → leave untouched, list them, ask where they belong (don't force a mapping).
