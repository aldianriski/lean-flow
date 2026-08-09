---
sprint: 051
slug: keeper-adoption
owner: Maintainer
last_updated: 2026-08-09
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-051 — Execution Log

> Append-only companion to [`../SPRINT-051-keeper-adoption.md`](../SPRINT-051-keeper-adoption.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | progress | G2 — A1 and A3 confirmed, A2 falsified

**A3 confirmed.** Every target file has ample cap headroom: `/diagnose` 79 · `/tdd` 82 ·
`/refactor-advisor` 60 · `/prototype` 54, against ~140. So no addition is forced into `references/`
by a cap, and the disclosure test decides placement on its merits rather than by default.

**A1** is confirmed per-item while writing T3, as its confirm step specifies.

**A2 falsified — TD-034 is a reconstruction, not a reconcile.** The assumption read "a straightforward
fusion with no lost content", and its own confirm step said: *if they carry materially different
content, T4 is not trivial and wants a ruling.* They do.

| Section | What it actually is |
|---|---|
| `## Files Changed` (l.117) | **5 rows written during execution** — carries the parked-fixture row, `end-to-end run blocked by denials — owner to re-run`, and `unrunnable under inherited MSYS_NO_PATHCONV` |
| `## Retro` (l.129) | **not a retro** — an empty heading whose only content is the stranded `2026-08-01 scope-change` Execution Log entry |
| `## Files Changed` (l.156) | **6 rows written at close** — consolidated, and adds close-time rows (`night-run.md` calibration row three, `.claude/settings.json` pre-flight) the first table cannot have |
| `## Retro` (l.167) | **the real Retro** — retrieval check, cost, worked/friction, pattern candidates, bucket routing |

So the first table is not a duplicate of the second: each holds rows and per-row verification notes the
other lacks, and the during-execution table records *the state of the run at the time*, including work
that was still parked. Merging them means deciding which of two honest snapshots survives — a
judgement about a closed archive record, which is precisely why this row has been deferred twice
rather than fixed in passing. Parked for an owner ruling instead of resolved by me.

### 2026-08-09 | complete | T1 — `/diagnose` gains a redaction discipline

Placed as its own `## Redact before you show` section **between the intro and Phase 1**, so it is read
before any phase produces an artifact — the DoD's placement requirement, and the reason it is not a
red flag alone. The section leads with the *mechanism* (build the loop against env vars, so the
credential never enters the command you show) and treats `<REDACTED>` as the fallback for whatever
must still be shown, because redacting after the fact removes instances while the env var removes the
class. A matching red flag added, phrased to say explicitly that `/handoff` already carries this rule
and the two must not disagree about a safety default — the inconsistency was the actual finding
(SPRINT-050 T3), not the absence.

One line added to `feedback-loops.md` at entry 5 (*replay a captured trace*), which is the specific
mechanic that puts live auth headers on disk. Consumer check (L-015): the rule names no repo-specific
path and reads correctly for any host project. `/diagnose` 79 → 94 lines, cap ~140.

### 2026-08-09 | complete | T2 — the tautological-test anti-pattern in `/tdd`

Added as a sibling section beside `## Anti-pattern: horizontal slicing`, not in `references/` — this is
a per-cycle check every path hits, which is the disclosure test ADR-006 carries (inline what every path
needs; disclose what only some reach). Carries the tell as a question the author can actually apply —
*what would have to be wrong for this to fail?* If the only answer is "the language", it is
tautological — plus the fix (expected values come from an independent source of truth) and the note
that being unable to produce one is a finding about the requirement rather than licence to assert the
implementation against itself. One line added to the per-cycle checklist so it fires every loop, not
only when someone re-reads the anti-patterns. `/tdd` 82 → 98 lines.

### 2026-08-09 | complete | T3 — three micro adoptions, all stayed micro

A1 confirmed per item; none needed a section, so no split.
- **`/refactor-advisor`** gains a scoping paragraph at the head of § 1 Explore — walk `git log` for the
  files that keep reappearing, because deepening earns nothing in code that never changes. The skill
  previously had no scoping step at all: it scanned, then ranked. 60 → 62 lines.
- **`/prototype`** rule 6 changed from "delete or absorb" to **retire without losing** — commit the
  spent prototype to a throwaway branch off main and leave a pointer beside the captured answer. Same
  line count (54); the rule was rewritten, not added to. TD-012 named in place as the reason.
- **`dispatch.md`** merge-back queue gains a *resolving a hunk* paragraph: recover both intents from
  the commit messages before choosing, preserve both where they compose, never invent behaviour to
  bridge them, and always resolve rather than `--abort` — abandoning the merge strands the wave the
  fan-out existed to produce.

### 2026-08-09 | complete | T4 — archive labelled, not merged; the mitigation was wrong about the cause

Executed per the owner ruling. Both tables kept and **labelled** `(during execution)` and
`(final, at close)`, with a note on the first stating what supersedes it and why it is retained. Zero
content loss in a closed record, and TD-034's actual complaint — "no marker saying which supersedes" —
is answered directly.

The stray `## Retro` heading held **no retro content at all**: its entire body was one misplaced
Execution Log entry. Heading removed, entry appended verbatim to `archive/logs/` with a relocation
note. The archived log now carries 6 entries; the Plan carries one `## Retro`, which is the real one.

Structure re-read end to end after the move (L-009 — a section move is the structure-adjacent trap, and
this file was already suspected of one): section order intact, no fused table rows, both tables whole,
Retro complete. Plan 220 → 197 lines.

TD-034's Mitigation line said "reconcile the two pairs into one". It was **not followed**, and the row
records why: diffing first showed two honest snapshots rather than a duplication. That is L-091 firing
again — a Mitigation line is the filer's hypothesis, right about the symptom and wrong about the cause.
Second occurrence this sprint-family (TD-032 was the first), which makes it a promotion candidate at
the next close.

**Verification.** `scripts/qa-check.sh` bare: green, run after the DoD ticks and this entry (L-089).
