---
id: ADR-045
tags: [process, docs]
domain: doc-standard
status: accepted
related: [ADR-001, ADR-003]
---

# ADR-045 — The work-item store: three axes, and `git mv` owns transitions

- **Status:** accepted (2026-09-24)
- **Deciders:** Maintainer
- **Context driver:** EPIC-017 decomposed into 26 task files (`docs/work/`) against a provisional
  schema before any doc stated the schema itself, and the epic's own Open questions left the
  transition mechanic unruled. `TASK-359` / SPRINT-106 T1 is the dependency root every other task
  in the epic depends on — the schema and the transition rule had to be settled once, here, before
  a second task could touch the store.

## Context

EPIC-017 replaces the single `TODO.md` + sprint-Plan-copy layout with `docs/work/<status>/
TASK-NNN-slug.md` — one file per task, growing sideways instead of downward into a capped file.
The epic adopted `kerjaan`'s invariant ("one fact lives in one place only — title in the filename,
status in the folder") but flagged three required departures ("Reference adopted"): orthogonal
axes rather than one, no spaces in filenames (concurrent `.claude/worktrees/` checkouts on
Windows), and explicit `priority:` + a per-status order file instead of folder-encoded sequence.

Left unresolved at decomposition time: whether a status transition is committed as `git mv`
(rename detection, `git log --follow`) or as a plain move + `git add -A`. EPIC-017's Open questions
section named this explicitly and deferred it "to D6's sprint" — this ADR is that ruling.

## Decision

**D1 — three axes, not one.** Status, sprint membership and epic membership are orthogonal facts
and each gets exactly one home:

- **Status** is the directory the file lives in (`backlog · todo · in_progress · review · done ·
  cancel`, `kerjaan`'s vocabulary adopted verbatim).
- **Title** is the filename (`TASK-NNN-kebab-slug.md`); the frontmatter `title:` field is the same
  title as full prose, never an independent second title.
- **Membership** (`sprint:` / `epic:`) is frontmatter only.

**Why not nest membership under status.** A `docs/work/<sprint>/<status>/` (or the reverse) layout
would answer "what does SPRINT-106 contain?" with one glob but make "what is in `review`, across
every sprint?" — the query EPIC-016's Work & Queue dashboard exists to answer — require scanning
every sprint subtree. Folders can only encode one axis for free; status was chosen because it is
the axis every consumer (queue skills, the dashboard, `/triage`) filters on first, and membership
stays a frontmatter read regardless of foldering, so nesting buys nothing and costs the dashboard
query.

**D6 — a status transition is `git mv`, in its own commit; a content edit never shares that
commit.** EPIC-017 D6 already ruled transitions **coordinator-owned** (a merge-back coordinator
performs the move; a duplicate-id check runs at merge, because two isolated worktrees can each
claim the same ticket from their own snapshot). This ADR settles the mechanic the coordinator
uses: `git mv old/path new/path`, committed alone, never combined with a content edit. `git mv`
keeps a task's full history traceable with `git log --follow` without depending on
content-similarity heuristics to recover the rename; bundling a move with a content edit removes
that reliability and leaves a `--follow`/bisect walk to untangle "moved" from "changed" out of one
commit instead of reading them as two clean ones.

## Consequences

**Positive:** one glob answers a cross-sprint status query; `git log --follow` recovers a task's
full lifecycle across every folder it has occupied. Verified against a real transition (retained
fixture: `evals/fixtures/work-store/round-trip/`, `evals/run-work-store-fixtures.ts`): a
`git mv`-only round trip (`backlog/` → `todo/` → `backlog/`, no intervening checkout) is
byte-identical, and a real edit committed between the two moves is caught by the same comparison
the round trip uses. **Stored content round-trips identically even through a fresh checkout**,
verified by blob identity (`git rev-parse HEAD:<path>` and `git hash-object` on the checked-out
file both match the blob id recorded at first commit — CLAUDE.md's hash-convention discipline,
L-169: normalization-aware by construction, not a raw working-tree byte compare). Working-tree
line endings on disk following the host's `core.autocrlf` setting after a checkout is expected git
behavior, by design, not a data-loss defect — the invariant this ADR guarantees is the stored
object, never the transient on-disk bytes. No folder ever needs renaming to reflect a sprint or
epic change, since membership lives in frontmatter, not the path.

**Negative (trade-offs accepted):** a task's full history is spread across git log at multiple
paths rather than one file's linear history alone — a reader who does not know to pass `--follow`
sees only the segment since the file's last move. The coordinator-owned transition (EPIC-017 D6)
also means a contributor cannot self-merge a status change; it is deliberately a merge-back-time
operation, accepted as the cost of the duplicate-id check that move requires. A reader who diffs
working-tree bytes directly (rather than blob ids) across a checkout on a `core.autocrlf=true` host
will see line-ending noise that is not a content change — expected, but worth knowing before
reaching for a raw byte diff instead of `git diff`/`git hash-object`.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Nest membership under status (`<status>/<sprint>/TASK-NNN.md`) | Forecloses the cross-sprint "what's in review" query to a multi-directory scan; membership already needs a frontmatter read for epic anyway, so the folder buys nothing |
| Move + `git add -A` instead of `git mv` | Produces the same tree but relies on content-similarity heuristics to recover the rename; `git mv` states the rename outright and keeps `--follow` reliable without tuning similarity thresholds |
| Bundle the transition with the content edit that motivated it | Cheaper (one commit) but makes a `git bisect`/`--follow` walk conflate "moved" with "changed", and D6 rules them apart specifically so a move's own commit is a pure, reviewable no-op on content |
| Encode ordering in the folder (kerjaan's shape, no `order.md`) | Folders cannot sequence; EPIC-017 keeps ordering explicit via `priority:` + a per-status order file owned by `/triage`, out of this ADR's scope |
