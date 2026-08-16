---
sprint: 074
slug: first-spec-driven-checker
owner: Maintainer
last_updated: 2026-08-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-074 — Execution Log

> Append-only companion to [`../SPRINT-074-first-spec-driven-checker.md`](../SPRINT-074-first-spec-driven-checker.md).
> Uncapped by design: this file grows with the work done, which is exactly why it is not inside the
> Plan's 400-line budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     run-complete · close. `run-complete` is reserved for the run itself finishing (carries the
     Part 4 rollup) — a task finishing mid-run is logged as `progress`, never as `complete`. -->

### 2026-08-16 | promote | spec 0.4.0's rule ids are indistinguishable from filenames to the Layers checker

**Found at promote, by the gate, on the first run of the rendered Plan.** T2's DoD names the seven §13
rules it checks. `check-layers-completeness.sh` extracts file-shaped tokens from DoD prose with
`` `[A-Za-z0-9_./-]+\.[A-Za-z]+` `` — and `S13.TRAILERS` satisfies that pattern exactly: word characters,
a dot, letters after it. So all seven were reported as **files named in the DoD and absent from
`Layers:`**.

**This false-positive class did not exist before SPRINT-073.** Rule ids were minted at spec 0.4.0 — about
a hundred of them — and every one is shaped like `basename.ext` to any matcher that defines "file" by
punctuation. The checker is not wrong about its own contract; the corpus grew a new token shape and
nothing told it.

**Fixed by declaring them on `Cites:`, which is correct rather than expedient.** T2 *answers to* those
rules and does not touch them, and `Cites:` is defined as exactly that — "the sources this task answers
to". The alternative fixes were both worse and both were considered: adding them to `Layers:` would
declare non-files as touched, and un-backticking them in the prose would change how the Plan reads in
order to dodge a matcher. Worth stating that distinction explicitly, because TD-048's re-review this
same promote records the *opposite* case — a `Cites:` line rewritten purely to satisfy the parser, with
the more useful declaration deleted. The tell is whether the corrected declaration is **more** true or
merely more parseable. This one is more true.

**Not filed as a `TD-NNN` here** — §10 files tech debt at Sprint **Close**, and this entry is the sweep
material for that Retro. Related but distinct from **TD-048** (a declared path not matching a bare
basename in prose: under-matching a correct declaration) and from **TD-062** (a §2 cap cell's first digit
run becoming the cap): all three are one checker family deciding what a token *is* from its shape rather
than from its position, which is L-108's rule applied to three different fields. Three sightings across
two sprints is worth naming at close.

Gate after the correction: **150 pass / 0 fail**, run as its own call with its exit code read.
