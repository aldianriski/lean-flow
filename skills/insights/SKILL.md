---
name: insights
description: Use to capture a friction, surprise, or insight as a learning the MOMENT you hit it — mid-work, in quick-mode, or any time a Sprint-Close Retro is too far off. Appends an L-NNN candidate to docs/LEARNINGS.md, or bumps a matching entry's count (which feeds the count≥2 promotion). Complements the Sprint-Close Retro; does not replace it. Do not use for durable project state (a commit / sprint record) or to end a session (/handoff).
argument-hint: "[the friction / insight, in a sentence]"
allowed-tools: Read, Write, Edit, Glob, Grep
user-invocable: true
version: "0.1.0"
---

# insights

Anytime learning capture. The Sprint-Close Retro batches learnings at a sprint boundary — but a
friction noticed mid-work (or in `quick`-mode work that never closes a sprint) dilutes or vanishes by
then. `/insights` captures it the moment it's felt, into the **same** `docs/LEARNINGS.md` ledger the
Retro feeds, so the §10 promotion machinery (`count ≥ 2` → durable rule) still sees it.

## When to invoke

- A friction, surprise, or "I'll remember this" moment lands mid-task — capture it before it fades.
- Standalone / `quick`-mode work surfaced a lesson but won't reach a Sprint-Close Retro.
- You spot a recurrence of something already in the ledger — bump it toward promotion.
- A **retrieval miss** — you couldn't find, or you contradicted, a prior `L-NNN`/ADR — file it; it's the observed signal that knowledge retrieval is degrading (feeds the TASK-040 decision).

Not for: durable project state (→ a commit / sprint record) · ending a session (→ `/handoff`) · the
full sprint retro (→ `/lean-doc-generator close`).

## Procedure

1. **Phrase the learning** — one line: *what* was got wrong or confirmed **and** the fix. Vague
   venting isn't a learning; if there's no transferable fix, don't file it.
2. **Scan for a match** — read `docs/LEARNINGS.md`; look for an existing entry on the **same concept**
   (not just a keyword hit). Note the next free `L-NNN` (max + 1) in case it's new.
3. **Recurrence → bump, don't duplicate** — a concept-match means it recurred: add the current sprint
   or date to its `seen`, increment `count`, and surface it: *"L-NNN now count N — promotable at the
   next promote (≥ 2)."* Bumping is the promotion signal; it beats a second near-duplicate entry.
4. **New → draft the entry** — per `templates/LEARNINGS.md.template`: the one-line learning · `seen:`
   (sprint or date) · `count: 1` · `promoted: no` · optional `related:` cross-links. Newest first.
5. **Confirm, then write** — show the draft (or the bump) and get a `y` — it is a durable, append-only
   ledger write. Then append/edit `docs/LEARNINGS.md` and bump its `last_updated`.

## Output

```
=== INSIGHT ===
[action]  new L-010   |   bumped L-006 → count 2
[entry]   <one-line learning + the fix>
[promote] <"count N ≥ 2 → flag at next promote"   |   "count 1 — context for now">
===============
```

## Red flags

❌ **Filing venting with no transferable fix** — a learning names the fix, not just the pain.
❌ **A second near-duplicate entry** — a concept-match → bump `count` (that *is* the promotion signal), never duplicate.
❌ **Writing the ledger without a confirm** — it's durable + append-only; draft → `y` → write.
❌ **Using it for sprint state or a session handoff** — that's a commit / sprint record / `/handoff`.
❌ **Editing a past entry beyond `seen` / `count` / `promoted` / `related`** — the ledger is append-only (DOCS_Guide §11).
