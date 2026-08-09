---
sprint: 048
slug: epic-layer
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-048 — Execution Log

> Append-only companion to [`../SPRINT-048-epic-layer.md`](../SPRINT-048-epic-layer.md). Uncapped by
> design: this file grows with the work done, which is exactly why it is not inside the Plan's
> 400-line budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
>
> *First sprint born in the split format. SPRINT-047 kept its log inline by design (its D2).*

### 2026-08-09 | G2 | batch gates run; two Plan defects found before any work started
**A5 is false.** The Plan asserts "T1–T5 are mutually disjoint except T2→T1; no shared file across
tasks." Deriving the map from the Plan's own `Layers:` lines gives **four shared files and one declared
edge**: `.claude/CONTEXT.md` (T1·T2·T3) · `.claude/CLAUDE.md` (T1·T3) · `DOCS_Guide.md` (T1·T4) ·
`task-decomposer/SKILL.md` (T2·T3). Three unowned pairs — T1↔T3, T1↔T4, T2↔T3 — each of which the
pre-dispatch preflight would HALT on. **Impact:** none material, because inline execution is strictly
sequential and single-owner, so no concurrent edit is possible; the defect is that the Plan claimed a
property it does not have, and would have blocked a parallel run. Ownership resolved by ordering
rather than by splitting tasks.

**A4's confirmation method was unreachable.** A4 asks that T3's new grill rule be used for T1/T2's own
grilling, but shared-file ordering naturally places T3 third. Fixed by running **T3 first** — it has no
dependencies, and sequencing resolves its shared files at either end. T3's own grill necessarily runs
under the old rule; recorded rather than papered over.

**Owner-approved execution order:** T3 → T1 → T2 → T4 → T5 *(superseded later this entry — see below)*.

### 2026-08-09 | scope-change | PRD/epic entry point split; cap raised; T6 + T7 added
**What broke.** A1 (which skill creates an epic) could not be answered without settling a prior
inconsistency the owner spotted: **`/lean-doc-generator` would create epics while `/task-decomposer`
creates PRDs.** Investigating found the state worse than "two entry points":

- **`--prd` means two things.** `task-decomposer/SKILL.md:22` documents it as an *input* (a path to an
  existing PRD); `:70-73` has the same flag **synthesize** a PRD and write `docs/product/requirements.md`.
- **Two PRD templates exist** — `task-decomposer/references/prd-and-slices.md § PRD template` and
  `lean-doc-generator/templates/product-requirements.md.template`.
- **The latter is orphaned**: `lean-doc-generator/SKILL.md` contains zero occurrences of "PRD". The
  skill that owns doc generation does not know its own product template exists.

Adding epic creation on top would have made this a third pattern.

**Decision (owner).** `/lean-doc-generator` owns creation of **all** core docs, PRD included;
`/task-decomposer` consumes them and emits tasks. That is the single principle; the intake-vs-lifecycle
split was offered as an alternative reading and rejected.

**Cap raised to 140, repo-wide — and the duplication reclaimed too.** I argued against raising it: the
cap is repo-wide across 14 skills, ADR-006 exists precisely to answer "this SKILL.md is full" with
"move artifacts to `references/`", DOCS_Guide carries an explicit red flag against raising a cap to fit
content, and ~15 lines were recoverable here from Migrate (14) and Init (10), whose full procedures
already live in `references/migration-map.md` and `references/init.md`. **The owner's call is to do
both** — reclaim the duplication *and* lift the cap — on the grounds that the generator legitimately
does more than the other skills and the extra headroom is worth having. Recorded with the argument
attached so the reasoning is inspectable later; this amends ADR-006.

**Impact on the Plan.** Two tasks added:
- **T6** — raise the SKILL cap to 140 (ADR-006 amendment · `qa-check.sh` lint · CLAUDE.md DoD) **and**
  compress Migrate/Init to dispatch entries. Kept separate from T7 because it is a repo-wide policy
  change touching the gate, and deserves its own review.
- **T7** — move PRD creation into `/lean-doc-generator`: add the `prd` verb, wire the orphaned
  template, reduce `task-decomposer` to consumer, disambiguate `--prd`, and keep only the slicing half
  of `prd-and-slices.md`. Depends on T6 for headroom.

Splitting rather than folding into T1/T2 keeps what was signed off intact, and avoids an L-sized task.

**G2 re-confirmed** with the new overlap map. ADR-006 is now shared by T4 and T6;
`lean-doc-generator/SKILL.md` by T2, T6, T7. **Revised order: T3 → T6 → T1 → T2 → T7 → T4 → T5** —
T6 moves early so the headroom exists before T1/T2/T7 edit the generator, and T4's ADR-006 amendment
lands after T6's. Seven tasks against ~12 capacity.

### 2026-08-09 | complete | T3 — frontier batching replaces one-question-at-a-time
Six occurrences across the four declared touchpoints, all now agreeing: `task-decomposer/SKILL.md`
(the grill procedure · the blocking-question rule · the red-flag row), `orchestrator/SKILL.md` (the
residual grill), `.claude/CLAUDE.md` (Behavioral Guidelines · the parked-question anti-pattern), and
`.claude/CONTEXT.md` (the Grill line). `grep` for the old wording returns nothing.

The red-flag row was **inverted rather than deleted** — it used to read "four questions at once is
faster → one at a time forces precision", and now reads "batching is allowed *only if they are
independent*". Keeping the row matters: the old failure mode (stacking dependent questions) is still a
real error, and deleting the flag would have read as blanket permission to batch.

`.claude/CLAUDE.md` was **80/80 before and after** — both edits same-line, as A3 required. The
Behavioral Guidelines sentence absorbed the new rule by dropping a parenthetical citation
(`SPRINT-015 T3 scoped it to skills; this globalizes it`) that L-002 already covers.

Worth recording: **T3's own grill ran under the old rule**, necessarily — it is the task that changes
it. Everything after this point exercises the new one, which is what A4 exists to check.

### 2026-08-09 | complete | T6 — cap 110 → 140, after a measured 7-line reclaim
**The reclaim stands on its own.** Migrate (13 lines) and Init (9) compressed to dispatch entries:
`lean-doc-generator/SKILL.md` **110 → 103**, verified green against the *old* 110 cap before the number
moved. Every detail dropped was confirmed present in `references/migration-map.md` / `references/init.md`
first — plan vocabulary, out-of-scope filter, idempotent re-run, headless park — so this is reclaim,
not content loss. **My G2 estimate of ~15 lines was optimistic; the measured figure is 7.**

**The cap is stated in seven places, not the four T6 declared.** `.claude/CLAUDE.md` ×2 (Lean
principle · DoD), `DOCS_Guide` ×2 (§7 row · growth rule), `council/SKILL.md`, `qa-check.sh`, `README.md`.
Only `council` was caught by the gate — the observed-layers check **unions Layers across all tasks**, so
declarations belonging to later tasks masked T6's edits to DOCS_Guide and README. Under sequential
execution that is harmless; under a parallel run it is exactly the unowned overlap the check exists to
prevent, and it would have passed. Worth folding into TD-032's family at close.

**A contradiction found and reconciled rather than left.** `DOCS_Guide` §7 read "Mega doc → split;
**never raise the limit**", and the growth rule repeated it. Raising the cap while that stood would
have recreated this ADR's own founding problem — *"a rule with silent exceptions rots into
suggestion"*. Reconciled by narrowing both to "never raise the limit **to fit content** — a cap moves
only by ADR, diet first", naming the two instances.

**A precedent I should have found before arguing.** **ADR-007 already did this**: "Diet first (dedup),
then raise the cap to 130" for `CONTEXT.md`, cited inline in §2's row. Reclaim-then-raise is therefore
established practice here, not a new loosening — which materially strengthens the owner's call and
weakens the objection I raised at G2. Recorded because the objection is in the log above and should
not stand unqualified.

The ADR-006 amendment carries all of it: the argument against, the ADR-007 precedent, the measured
diet, and the accepted consequence (13 other skills may now grow to 140 with no gate objection;
trigger for revisiting is a second skill crossing ~120 without a comparable scope story).

### 2026-08-09 | complete | T1 — EPIC layer, proven on a real epic
`EPIC.md.template` created and then **used** to render `EPIC-001 — Parallel Worktree Fleet`,
retro-fitted from the SPRINT-025/026 archives and `fog-fleet-orchestration.md`. Not a placeholder
(L-007): every row cites a real sprint, a real close_commit, and a real decision.

**The retro-fit justified the layer better than an argument could.** EPIC-001's status was previously
recoverable only by reading two sprint archives and three research docs — and
`docs/research/agents-md-adoption.md` still gates a decision on "*if/when the fleet epic graduates a
non-Claude consumer*", pointing at something that had no file. Now it points somewhere.

**Rendered as `closed`, deliberately.** The stated outcome shipped at SPRINT-026 and has been exercised
since (SPRINT-039 ran parallel waves; 041/043/045 followed). The Claude-only boundary is a **scope
edge, not unfinished work** — recorded so a future non-Claude consumer opens a *new* epic rather than
reopening this one, since nothing in the delivered mechanism would change.

**§11 tightened beyond the DoD's wording.** The DoD asked for "archive when every member sprint has
closed". Written that way, an epic whose last sprint closed with exit conditions still unmet would be
archived as done — hiding the gap. The shipped rule requires **every member sprint closed AND all
Closed-when conditions `[x]`**, with the reason stated inline.

Template count 31 → 32 (34 on disk incl. the 2 non-core), all three linted claims moved together.
`docs/epic/INDEX.md` created lazily, as `docs/sprint/INDEX.md` is.

### 2026-08-09 | complete | T2 — epic wired into decompose → promote → close, and fired
All three trigger points now know the epic exists (L-020): `--epic` resolves and consumes,
`promote` stamps `epic:` + appends the member row, `close` completes that row. SSOT and README
updated.

**Fired end-to-end on real artifacts, not described.** EPIC-001 is `closed`, so there was no live epic
to promote a new sprint against. Instead the chain was exercised against its actual member sprints:
SPRINT-025 and SPRINT-026 stamped `epic: EPIC-001`, and **both round-trips verified** — sprint →
frontmatter → epic file resolves for both, and epic → § Member sprints → sprint file resolves for
both. `--epic EPIC-001` resolves by id, with an INDEX row behind it. Retro-fitted rather than live,
and said so rather than claiming a promote that did not happen.

**One thing the DoD did not ask for, added anyway.** T2's DoD covers consumption but not creation.
Writing the decomposer's "no epic doc → offer `/lean-doc-generator epic`" routing left that pointer
dangling, since no such verb existed — a half-wire of exactly the kind L-020 is about. The `epic` verb
and its admission test (not nameable → fog · fits one sprint → a sprint · else an epic) are now in the
generator.

**L-088 recurred inside its own sprint.** T2's DoD required edits to `lean-doc-generator/SKILL.md` to
stay **line-neutral** — a constraint that existed only because the file was at 110/110. T6 dissolved it
two tasks earlier; the file is now 114/140. The DoD item was frozen against a world that no longer
existed by the time it was executed. Ticked as dissolved rather than silently reinterpreted, which is
the behaviour L-088 asks for. That the pattern fired twice in one sprint, on a learning filed *last*
sprint, is worth carrying to the Retro.

Sizes after: generator 114/140 (over the old 110 — T6's raise was load-bearing, not speculative),
decomposer 101/140, CONTEXT.md 121/130.
