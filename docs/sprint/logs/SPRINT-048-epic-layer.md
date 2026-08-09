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

### 2026-08-09 | complete | T7 — PRD creation moved to the generator; a DoD premise corrected
The owner's principle is now real, not just stated: **`/lean-doc-generator` creates every core doc;
`/task-decomposer` consumes and emits tasks.** `--prd <path>` means *consume that file*, full stop; the
generator gained a `prd` verb wired to `templates/product-requirements.md.template`, which had been
orphaned with zero mentions in its owning skill.

**The DoD's "remove the duplicate template" premise was wrong — third L-088 this sprint.** Reading both
formats side by side, they are not duplicates:

| | `prd-and-slices.md` format | `product-requirements.md.template` |
|---|---|---|
| Scope | one **feature** | the **project** |
| Sections | Problem Statement · Solution · User Stories · Implementation + Testing Decisions · Out of Scope | Problem · Users · Solution scope · Functional / Non-functional requirements · Open questions |
| Lifetime | disposable intake scaffolding | durable §2 core file |

They are a **pipeline** — *feature PRD → sanitize → `requirements.md`* — which is what
`task-decomposer` already said ("the approved PRD's durable home is `docs/product/requirements.md` …
sanitize before saving"). Deleting either half would have lost a real artifact. Both kept; the
relationship is now written down in three places (generator § Creates vs consumes, the reference file's
header, CONTEXT.md) precisely because they look similar enough to be mistaken for duplication again.
What actually changed hands is the **write**, not the format.

**Verified on the consumer path, not dogfooded (L-016).** This repo has no `docs/product/` — a plugin
has no product requirements — so "exercised once on a real PRD" had no real input available. Rather
than fabricate one, the mechanism was traced end to end: (1) `--prd` states consume-only · (2) the
decomposer hands the durable write onward · (3) the generator has the verb · (4) the template is
referenced by its owner · (5) the boundary is in the SSOT · (6) both formats are labelled distinct.
All six confirmed. This is exactly L-016's case: absent substrate means verify the consumer path, and
"didn't fire here" is neither broken nor fine.

Sizes: generator 124/140, decomposer 106/140, CONTEXT.md 123/130.

### 2026-08-09 | complete | T4 — the cap gains a criterion
ADR-006 established *when* something must move out of a `SKILL.md` (the number) but never *which*
something. In practice that meant whatever was easiest to cut when a file hit the limit — which is
precisely how the generator accumulated 24 lines restating procedures already written out in its own
reference files. **Nothing was wrong under the rule as written**, which is the point: the rule was
incomplete, not violated.

Adopted (re-scan Keeper 2): **inline what every path needs; disclose what only some paths reach**, with
the two budgets it balances named explicitly — context load (tokens every turn) vs cognitive load (what
a human holds to navigate). Optimising the second at the first's expense is the common error and worth
saying out loud. Plus completion criteria as behavioural levers: write the bound you would accept as
proof, not the activity.

Both live in DOCS_Guide beside the cap rule — where an author meets them — with the ADR carrying the
reasoning. ADR-006 now has two dated amendments from this sprint (T6's number, T4's criterion); the
decided text is untouched in both.

**Negation deliberately not adopted.** The same source argues prohibition activates the forbidden
behaviour, which cuts against CLAUDE.md being built almost entirely on ❌ anti-patterns. Ours pair the
trap with a positive rule, blunting it — but that is a defence, not evidence, and settling a house-style
question on preference is the unevidenced call this repo keeps getting wrong (L-087's family). Recorded
as open in the ADR rather than quietly dropped.

### 2026-08-09 | complete | T5 — DEAD-ON-ARRIVAL false verdict fixed, without inventing a mechanism
**Reproduced, cheaply, and it did not need Claude at all.** `sh -c 'sleep 40'` — a process that is
demonstrably healthy — was declared `DEAD-ON-ARRIVAL … the prompt may have been rejected`, on a 0-byte
log, exit 1. The defect lives in the launcher's **inference**, not in Claude's output format, so no
paid headless run was required to see it.

**What was deliberately NOT established.** That `--output-format json` is what makes a *real* run
silent remains untested — that does need a paid run, and it was not spent speculatively. So the fix
was chosen precisely because it does not depend on that half: a third verdict, **`UNKNOWN` (exit 2)**,
which states what was observed rather than asserting a cause, and names the buffering format when the
fired command carries one. The `stream-json` switch was **declined** on two grounds: it depends on the
unproven mechanism, and it would trade away the `total_cost_usd` the calibration row reads off `json`.
This is L-087 applied to the very row that prompted its promotion.

**Verification, honestly split.** Healthy+silent → `UNKNOWN` exit 2, verified live. Format detection
unit-checked in isolation: `--output-format json` and `--output-format=json` match, **`stream-json`
correctly does not** — a false match there would have mislabelled the one format that *does* stream.
The DOA regression check could not be run: the harness hung on detached children across three
attempts. Verified structurally instead — `git diff` shows exactly one `die_doa` removed (the false
one), every other call site returns from *inside* the poll loop and never reaches the edited branch,
and `sh -n` parses clean. Recorded as inspection, not claimed as execution.

**A red flag I tripped, caught by the thing I was fixing.** T4 was committed through a **failing
gate** — its DoD tick named "T6", layers-completeness flagged it, and I appended the log and committed
without re-running. It surfaced only because `night-run.sh`'s pre-flight runs `qa-check` and refused to
fire. Fixed in `c412019`. Two lessons worth the Retro: the gate must be re-run after *every* edit, not
once per task; and the pre-flight caught what the author did not — an argument for the pre-flight
gate existing at all.
