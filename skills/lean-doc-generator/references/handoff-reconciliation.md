# Handoff reconciliation — STANDARD §12(b)'s conversion, performed

> SPRINT-094 T2. Disclosed here per STANDARD's disclosure test (`S2.R-DISCLOSE`): every promote and
> close reads the two-line pointer in `SKILL.md`; only a sprint that actually has an outstanding
> handoff needs this detail.

## Why this exists

STANDARD §12(b)'s Meeting-notes row prescribes *"convert outcomes into requirements / ADRs / issues;
never commit the raw notes."* The temp-dir placement of a `/handoff` doc is correct and unchanged by
this task — what lean-flow shipped none of is the **conversion step itself**: a handoff was written,
the session ended, and whether anything in it reached a durable home was answered by nobody. A
sprint could close with a `live` handoff still sitting in someone's temp directory and nothing in the
repo would ever know.

## The status vocabulary

Every handoff record — an Execution Log `handoff` entry, or a `HANDOFF-LEDGER.md` row (no sprint, or
a side handoff) — carries exactly one of three states, tracked via two fields (`handoff-status:` +
`handoff-path:`) inside its `### <date> | handoff | <summary>` block:

| Status | Means | Set by |
|---|---|---|
| `live` | a session may still resume it | `/handoff`, when it writes the temp doc |
| `consumed` | a session resumed it and the work continued | `/handoff`, at the START of a later invocation, when it finds a `live` record for the same context |
| `spent` | superseded, or the sprint closed past it | `/lean-doc-generator close`'s reconciliation sweep (this file) |

Where the same `handoff-path` appears in more than one entry (a later one updating an earlier one —
the Log is never edited in place), the **latest entry by file position is authoritative**; earlier
ones are not separately reported. A record naming no `handoff-path` cannot be deduplicated against
anything and remains UNKNOWN until reconciled. **An UNKNOWN status is never read as `spent`** —
that assumption is exactly the silent loss this task closes.

## The close-time sweep (mandatory, gates the close)

Before setting `status: closed`:

1. Read the Execution Log's `handoff` entries. Resolve each `handoff-path` to its latest status.
2. For every one not already `spent`:
   - Read the referenced temp doc if it still exists (it may not — that is not itself a defect;
     the doc is throwaway by STANDARD §12(a)/(b), and the stub's own content plus the session's
     own Execution Log entries are frequently enough to reconcile against).
   - Route every item **not already durable** (already in the sprint file · an Execution Log entry ·
     a task file under `docs/work/` · a `TECH-DEBT.md` TD · a `LEARNINGS.md` L-NNN · a commit) to its
     home, exactly as the Retro's four-bucket routing already does (§10) — this is the same routing,
     applied to one more source.
   - A follow-up **TASK** becomes a **new task file in `docs/work/backlog/`**, never a `TODO.md` row:
     `TASK-NNN-<kebab-slug>.md`, frontmatter `origin: close-retro`, no `sprint:` (it is unscheduled).
     Derive NNN as one above the **numeric** maximum `TASK-NNN` in use across every `docs/work/*/`
     folder (`done/` and `cancel/` included) — never `TODO.md`'s rows (reading its content is
     `migrate`'s job alone), never the id you remember, and never by a bare recursive search from the repo root, which also counts
     the full repo copies under `.claude/worktrees/` and returns a maximum that is not a row.
   - Anything genuinely needing no further action is **ruled**, not silently dropped: note it inline
     in the reconciliation entry (a ruling is a record; silence is not — CLAUDE.md § Behavioral
     Guidelines).
3. Append one closing `handoff` entry per outstanding record, reusing its `handoff-path`:
   ```
   ### YYYY-MM-DD | handoff | reconciled at close -- <one-line summary of where items went>
   handoff-status: spent
   handoff-path: <the same path as the record being closed out>
   ```
4. Re-read the Log before closing: every outstanding handoff must be reconciled to `spent`.
   Resolve any `live`/`consumed` or UNKNOWN record through steps 1–3 before setting `status: closed`.

## The ledger (root `HANDOFF-LEDGER.md`)

Governance work, a `/triage` pass, or a research session has no sprint Execution Log to write into, and a
side session unrelated to the active sprint must not write into it: a handoff is the sprint's own when the
session's focus names a member task of that sprint; any other is a side handoff and goes to the ledger, so
a side `live` entry never fails that sprint's close. `/handoff` creates `HANDOFF-LEDGER.md` lazily (STANDARD's create-lazily rule — never pre-created
empty) with the same ownership header + two-field entry shape. There is no "close" event to hook a
hard gate onto, so:

- **UNKNOWN entries need reconciliation** — resolve an unparseable entry during the ledger review;
  never treat a missing or malformed status as `spent`.
- **`live`/`consumed` rows are reconciled** at the next `promote`'s
  governance review (the `☐ handoff ledger` checklist line in `SKILL.md`) — the same propose→approve
  shape as TD aging and epic rollup currency. Mark a reconciled row `spent` the same way a sprint's
  close does (step 3 above), or rule it needs none.

## What NOT to do

- Never restate the handoff doc's content inside the stub — the stub is a status record, not a
  second copy of the raw notes (STANDARD §12(b) still bars committing those).
- Never mark a record `spent` without having actually routed its items — a `spent` stamp with no
  reconciliation behind it reproduces exactly the silent loss this task closes, just one layer deeper.
- Never assume UNKNOWN means `spent`, in either context. That is the one rule this whole mechanism
  exists to enforce.
