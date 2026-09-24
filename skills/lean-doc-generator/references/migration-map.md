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

## v1 → v2 work-item store (2.0)

Carries a v1 `TODO.md` (Backlog + an active sprint's Plan) onto `docs/work/<status>/
TASK-NNN-slug.md` (schema: `docs/work/README.md`, `ADR-045`, `ADR-046`). **Agent-run procedure —
no Bun/TS script ships to consumers** (ADR-043's consumer contract); an agent reads this section
and performs the steps by hand, same plan → approve → apply gate as any other migrate action.
Detection that gates entry to this path is existence-only (`TODO.md` present / `docs/work/`
present — `SKILL.md` § above); this section is what runs once that gate has already let a v1 or
mixed tree through.

**WHY.** The hard cut (ADR-046) makes `migrate` the only 2.x path onto the store — every other
queue skill refuses a v1/mixed tree by name. **WHERE.** `docs/work/<status>/TASK-NNN-slug.md` per
task; `TODO.md` itself, once empty of tasks.

### Field-by-field mapping

| v1 (`TODO.md` Backlog row) | v2 frontmatter / section | Note |
|---|---|---|
| `TASK-NNN` (the row's id) | `id:` + filename `TASK-NNN-kebab-slug.md` | id never changes |
| title (after the em dash) | `title:` + filename slug | kebab-case the slug, `[a-z0-9-]` only |
| which `### P0`–`P3` heading the row sits under | `priority:` | `P0`/`P1`/`P2`/`P3` |
| `[size: X]` | `size:` | verbatim |
| `[risk: X]` | `risk:` | verbatim |
| `[HITL]` / `[AFK]` tag | `autonomy:` | verbatim |
| `class:` | `class:` | verbatim; if absent, flag in the plan — never guess |
| `tier:` | `tier:` | verbatim; if absent, flag in the plan (ADR-029: declared, never inferred) |
| `authority:` | `authority:` | verbatim |
| `origin:` | `origin:` | defaults `manual` if absent |
| `state:` | `state:` | defaults `ready` if absent (an undecorated Backlog row is assumed ready) |
| `depends-on:` | `depends-on:` | prose list → array; `none` → omit |
| an `EPIC-NNN` cited in `tracker:` | `epic:` | set only on an explicit citation — never inferred from theme/wording |
| — | `sprint:` | absent for a pure-Backlog row (see Plan mapping below) |
| `done-when:` prose | `## Done when` | one `- [ ]` per criterion (split on `;`/numbered clauses if the prose itemizes more than one; otherwise a single box); starts unticked — a Backlog row has no Plan tick state to inherit |
| `why:` | `## Why` (optional) | prose, verbatim |
| `touches:` | `## Touches` | bullet per item |
| `assumes:` | `## Assumes` | prose/bullet, verbatim |
| `tracker:` | `## Tracker` | bullet per item, verbatim |

### Plan-task mapping (active sprint)

Each `### Tn — title `[size · risk · class · HITL · Jn]`` block in the sprint file's § Plan:

| Plan element | v2 field |
|---|---|
| `Cites:` naming a `TASK-NNN` | that id (filename + `id:`) — **a `Tn` naming none gets the next free id**, derived as the max in use across `docs/work/**` with `evals/fixtures/` and `.claude/worktrees/` excluded (never incremented from memory) |
| `[size · risk · class · HITL · Jn]` | `size:` · `risk:` · `class:` · `autonomy: HITL` · `authority: Jn` |
| `Layers:` | `## Touches` |
| `Depends-on:` | `depends-on:` |
| `Cites:` (the rest) | `## Tracker` |
| the sprint's `sprint:`/`epic:` frontmatter | `sprint:` / `epic:` on the task file |
| each DoD `- [ ]`/`- [x]` line | one `## Done when` box, **tick state preserved exactly** |

**Status folder** (readiness `state:` stays a field, never a folder — `docs/work/README.md`):
a Backlog-only task → `backlog/`. A Plan task → `todo/`, unless every one of its mapped
`## Done when` boxes is ticked, in which case → `done/`.

**Plan-only task (no Backlog row) — the common v1 case.** `TODO.md.template` has a promoted task
*leave* the Backlog, so a `Tn` citing an id with no matching Backlog row is normal, not an error.
Nothing in the Plan block supplies `priority:`, `state:`, or `origin:` — the Plan carries no P0–P3
tier, no readiness, no filing provenance. These three fields have **no v1 source** for a Plan-only
task: list them in the migrate plan for **owner input**, exactly like an absent `class:`/`tier:`
above — **never guessed, never defaulted.** (Only when the id *also* has a Backlog row — the
overlap case below — do `priority:`/`state:`/`origin:` come from that row as usual.) The file is
not written until the owner supplies them; an unanswered one is the same kind of open item a
missing `class:`/`tier:` already is.

Only an **active** sprint is read this way — a closed/archived sprint's Plan is never migrated
(an archived sprint file is never rewritten).

### Overlap rule

A `TASK-NNN` present both as a Backlog row and as a Plan `Tn`'s `Cites:` becomes **one file**, not
two: the Plan mapping wins wherever the two disagree — DoD tick state, `class:`/`tier:`/
`authority:` (frozen at G2), `sprint:` set — and any Backlog-only field the Plan block doesn't
restate (`why:`, `assumes:`) is filled in from the Backlog row. Producing two files for one id is
a defect, not a variant. **This rule decides what content to generate — it runs before checking
whether a file already exists.** What happens to an existing file is the next rule's job, not
this one's.

### Resume / conflict rule (and precedence between the two rules above)

Once the overlap rule has decided what content an id *should* have, check `docs/work/**/
TASK-NNN-*.md` by id (any status folder) before writing anything:

- **No file exists** → write the mapped content. This is the common case (a fresh id).
- **File exists, content identical** to what this mapping would produce → **skip, not rewritten**
  — this is what makes an interrupted run resumable: re-running it lands on the same tree.
- **File exists, content differs** → **report the conflict, never overwrite.** The file is left
  exactly as it stood.

**A reported conflict is not auto-resolved by reporting it.** It is shown to the owner in the
migrate plan as a per-file delta (what the mapping would write vs. what is already there) with
**three choices**: **apply the delta** (write the mapped content, replacing the existing file) ·
**keep the existing file** (the mapped content is discarded, the id is considered settled as-is) ·
**edit by hand** (owner reconciles the file themselves outside migrate). The id stays
**unresolved** until the owner picks one — migrate does not guess, and does not treat "reported"
as "done."

A run killed mid-way and re-run therefore reproduces the same final tree: every id already
written is a no-op, every unresolved conflict is reported again identically, and everything after
the kill point that has no existing file still gets created.

### `TODO.md` removal + non-task prose disposition

`migrate` **removes `TODO.md`** only once **every** Backlog row and every Plan `Tn` resolves to a
file with no open conflict — written this run, or already present with content the mapping agrees
with. **An id still sitting at a reported, owner-unresolved conflict blocks the removal entirely**
— `TODO.md` stays exactly as it was, unpruned, until that last conflict is chosen one of the three
ways above. (Owner ruling, superseding an earlier "tombstone" design — a tombstone would itself
classify as `mixed` and be refused by every other 2.x skill, ADR-046 — but "no tombstone" is not
"remove unconditionally": a blocked removal is not a tombstone, it is the run not being done yet.)
Non-task prose in `TODO.md` — the ownership header, the "how to use this file" blurb, the
Active-Sprint pointer block, any "Standing facts" narrative, section headings — is **never
silently dropped**: list each block in the migrate plan with a proposed disposition
(`relocate: <target>` or `drop`) and apply only on the owner's per-item approval, same as any
other `retire`/`consolidate` action (§ Surgical rules above). A later 1.x write that recreates
`TODO.md` makes the tree classify `mixed` again — `/prime` reports it, and a `migrate` re-run
ingests the stray task.

### Verification (run every time, plan and apply alike)

- **Id set, diffed both ways.** `v1_ids` = every `TASK-NNN` in the Backlog + every Plan `Tn`'s
  `Cites:` id, taken before the run. `v2_ids` = every id now present as a `docs/work/**/
  TASK-NNN-*.md` file (written this run, or already-present/resumed). `v1_ids ∖ v2_ids` and
  `v2_ids ∖ v1_ids` must both be empty — a count alone does not prove this (two different sets of
  the same size still passes a count check).
- **Ticked-box count, before vs. after.** Sum of `- [x]` under every Plan `Tn`'s DoD (before) must
  equal the sum of `- [x]` under `## Done when` across the files those `Tn`s mapped to (after,
  including resumed files whose count was never touched by this run). A mismatch on a *resumed*
  file (pre-existing content this run correctly left alone) is reported, not silently passed —
  it means that file's tick state and the Plan's tick state have already drifted apart, a fact
  worth surfacing even though fixing it is outside `migrate`'s write path (never-overwrite still
  holds).
- **Re-run is report-only.** A second run against an already-migrated tree produces zero writes
  and zero new conflicts (`git status` clean) — every id resolves to "already present, identical."
