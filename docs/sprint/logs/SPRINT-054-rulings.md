---
sprint: 054
slug: rulings
owner: Maintainer
last_updated: 2026-08-09
status: closed
update_trigger: an Execution Log entry is appended
---

# SPRINT-054 — Execution Log

> Append-only companion to [`../SPRINT-054-rulings.md`](../SPRINT-054-rulings.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-08-09 | surprise | TD-040 fired again at the SPRINT-054 preflight — second live sighting

The pre-dispatch preflight (`dispatch.md` snippet) ran bare against the Plan at declared base `83739a4`
and reported `PREFLIGHT: CLEAR`. Its parsed record for T1 stopped at `docs/product/requirements.md`:
five files declared on **indented continuation lines** — `docs/product/acceptance-criteria.md`,
`docs/development/setup.md`, `README.md`, `.claude/CLAUDE.md`, `docs/architecture/overview.md` — never
entered the check. The T1/T2 overlap on `.claude/CLAUDE.md` was therefore not examined at all.

This is TD-040 exactly, and it is now the **second** consecutive promote where the same snippet
returned a clear verdict over an overlap it could not see. Both times the result was correct only
because the overlap already carried a `Depends-on:` edge — luck, not the check, twice. A manual pass
over the full declarations confirms every overlap is owned (`CLAUDE.md` T1→T2 direct ·
`mattpocock.md` T2→T3 direct), so the wave shape stands: T1=0, T2=1, T3=2, strictly sequential.

Recorded here rather than acted on: TD-040's own mitigation line says to re-derive whether the snippet
is the surface worth fixing at all, or whether it should call the real checker. That re-derivation is
not this sprint's work. What this entry adds is evidence — the row's `count` argument is no longer
theoretical.

### 2026-08-09 | scope-change | T1 may now edit DOCS_Guide §2 — logged before § Plan is touched

**What broke.** T1's Plan says each of the six rows is either created or exempted. G2 surfaced a case
the Plan did not account for: three of the six (`SECURITY.md` · `AGENTS.md` ·
`docs/development/setup.md`) carry the create-trigger **`init (always)`** in DOCS_Guide §2, while two
others are already conditioned there on team size (`CONTRIBUTING.md` — "team ≥ 2, or on request") and
on a dependency (`acceptance-criteria.md` — "with requirements"). Exempting a row §2 marks *always*
leaves the standard asserting something our own repo contradicts — the precise defect SPRINT-053 was
built to remove, and the shape L-096 was filed about: a rule that predicts reality out of existence.

**Impact.** `skills/lean-doc-generator/references/DOCS_Guide.md` moves from T1's `Cites:` (read-only)
into its `Layers:` (may be edited). T1 stays M — an exemption that fires adds one condition clause to
one §2 row, not a rewrite — but the blast radius now includes the consumer-facing standard, so the
L-015 consumer check in T1's DoD covers §2 as well as the six docs. No other task's declarations move;
the wave shape and the overlap map are unchanged (no other task touches DOCS_Guide.md).

**Re-confirm G2.** Owner ruled both open questions at the G2 grill: **A2** — an `exempt` verdict is
recorded in `docs/architecture/overview.md` § Boundaries, which already answers "what lean-flow does
not own" and has room (79 of 150). **§2 conflict** — fixed inside T1 via this scope-change rather than
deferred to a follow-up task, because shipping the contradiction is the thing SPRINT-053 just paid to
stop. Alternative rejected: forbidding exemptions on `init (always)` rows, which would have decided
three of the six by fiat before T1's LAW 1 pass ran — pre-empting the ruling this task exists to make.

### 2026-08-09 | progress | dispatch deviation — all three tasks run inline

`dispatch.md` makes sub-agent dispatch the default for `execution`-nature work, and T2's
evidence-gathering leg (read the negation literature, cite it) is exactly that. It runs inline anyway,
on a **session-level constraint**: this session is instructed not to call the Agent tool unless the
user asks for it. Same deviation SPRINT-053 recorded, same reason, recorded again rather than left to
look like the "orchestrator never spawns" bug the default exists to prevent. All three tasks are
`class: decision` in any case, which is the tier that stays inline by the routing table; only T2's
research leg would have dispatched.

### 2026-08-09 | complete | T1 — three created, three exempted; neither of the framings the task assumed

The six split 3/3, so neither "create all six" nor a clean sweep of exemptions was right.

**Created** — `AGENTS.md` (11 lines): `.codex-plugin/` and `.kimi-plugin/` sit at repo root, so
non-Claude agents already work here and their instructions today are nothing. `docs/development/setup.md`
(73): the strongest LAW 1 case of the six, and the only one carrying *documented recurring* evidence —
the `MSYS_NO_PATHCONV` env trap that produced a red gate on correct code and survived two wrong
diagnoses (L-067 ×2 · L-081), the plugin-staleness trap (L-021 ×2, and again in this very session),
and `QA_FULL=1`. `SECURITY.md` (72): the weakest call, ruled create — zero vulnerability reports means
LAW 1's "repeated" is unmet, but 6 of 14 skills declare **unscoped `Bash`** (verified against every
`allowed-tools:` line, not assumed), `scripts/night-run.sh` runs unattended, and an MIT plugin that
installs into other people's dev environments had no reporting channel.

**Exempted**, recorded in `docs/architecture/overview.md` § Boundaries with a reason and a revisit
trigger each — `CONTRIBUTING.md` (§2's own "team ≥ 2, or on request" never fired: single maintainer,
no request) · `docs/product/requirements.md` (CONTEXT.md already carries what the product *is* and
CLAUDE.md what it must *satisfy*; a third copy is a second SSOT) · `docs/product/acceptance-criteria.md`
(dependent — §2 trigger is "with requirements").

**A framing correction the task itself needed.** TASK-165 argued from LAW 1 that "create all six is a
candidate answer, not the default". DOCS_Guide's own LAW 1 reinterpretation (ADR-012) says the reverse
for this tier — the mandatory minimum *is* scaffolded at init, so create is the default and an
exemption needs a positive reason. Both bars were applied; the 3/3 split holds under either, which is
why the ruling did not need the contradiction resolved first. Worth noting that a task's stated
premise was wrong about the standard it was reasoning from.

**One DoD line met by not acting, stated rather than assumed** (L-088): `.claude/CLAUDE.md` §
File Structure was left untouched. Its map is selective by construction — it already omits `TODO.md`,
`TECH-DEBT.md`, `CHANGELOG.md`, `docs/`, `scripts/` and `evals/` — so it never claimed to list root
docs and reflects what landed without an edit. The file is also at exactly 80 of its 80 cap, where §7
allows a raise only by ADR after a measured diet; forcing two root filenames in would have meant
displacing an anti-pattern to satisfy a checklist line. `README.md` and `overview.md`, which *do* carry
exhaustive maps, were both updated.

**Pre-existing, not touched, mentioned instead:** `README.md`'s repo-layout block claims "30 canonical
doc templates … = 32 total" while the real count is 32 core + 2 non-core = 34, and it omits
`.codex-plugin/`. `qa-check.sh` verifies that count in `.claude/CLAUDE.md` and
`docs/architecture/overview.md` but not in the README, which is why it has drifted unnoticed. Outside
T1's scope — routed to the Retro's follow-up bucket.

QA gate re-run bare immediately before the commit: 71 pass, 0 fail.

### 2026-08-09 | scope-change | T2's cap DoD rests on a stale number — the breach predates this sprint

**What broke.** T2's fifth DoD line reads "*if the edit pushes `mattpocock.md` past its 120 soft cap,
apply TD-038's named remedy*". It assumes the file is under the cap and that this task's edit would be
what crosses it. Measured at execution: the file was **124 lines before T2 touched it** and is **143
after**. The premise was false when the Plan froze.

Traced with `git show <sha>:<path> | wc -l` rather than inferred: 114 at `5fa44de` (SPRINT-050 T1) →
117 at `4793504` (T3) → **124 at `bab405f` (SPRINT-050 T2)**. TD-038 was filed *during Sprint-050*
recording 117 and stating the next re-scan would "breach on contact"; the breach then happened four
commits later in that same sprint, and the row still says 117 today. Nothing caught it because
`qa-check.sh` cap-checks `skills/*/SKILL.md`, `.claude/*` and `docs/sprint/SPRINT-*.md` — not
`docs/research/`. A soft cap with no check behind it is a comment.

**Impact.** T2's DoD line cannot be ticked as written — its conditional never applies, because the
condition was already true before the task started. Ticking it would be reading the words to fit what
was built (L-088), and the honest reading is that the criterion is stale, not met. Nothing about T2's
verdict changes; only the disposition of that one line. TD-038's own text is also now wrong on its face
("117 against its 120 soft cap", "the doc is *correct* at 117"), and its stated reason for holding —
that acting early would restructure a correct doc against a **hypothetical** breach (TD-031's shape) —
no longer holds, because the breach is actual and measured.

**Re-confirm G2.** Ruling requested from the owner rather than taken: the remedy TD-038 names (split
per-scan files behind an index) is real work outside T2's Plan, and T3 still has to write into the same
file, so splitting mid-wave would restructure a document that is about to change again.

**Owner ruling (2026-08-09).** Split *after* T3, inside this sprint. Rationale accepted: T3 writes into
the same file, so splitting now would restructure a document about to change again, and deferring to a
follow-up leaves a measured, known breach sitting in the repo behind a check that cannot see it. The
Plan therefore gains a **T4** — the only structural addition this sprint makes — and T2's fifth DoD
line is discharged as *routed*, not as *applied*: the scope-change was logged, nothing was squeezed,
and the remedy now has an owner and a home. `mattpocock.md` moves from T2/T3's `Layers:` into T4's as
its owner for the restructure; the wave gains rank 3 and stays strictly sequential.

### 2026-08-09 | complete | T2 + T3 — two closures, and the second one was mis-stated, not merely open

**T2 (TASK-155) — no change warranted.** The negation claim survives contact only in a narrow form,
and our rows already sit on its safe side. Weakest link first: the popular write-up runs no experiment
and says so, resting on Ironic Process Theory (a human result) plus forum anecdotes. NeQA — the
benchmark usually invoked — measures negation comprehension in *question answering*, a different
construct from instruction-following under prohibition, and its own result is that the task shows
inverse, U-shaped **or positive** scaling depending on prompting method and model family. Anthropic's
"tell Claude what to do instead of what not to do" targets a **bare** prohibition; the same page's
production prompt samples are themselves built from scoped, paired prohibitions. A3 confirmed by
reading every ❌ row, not assumed. Nothing was edited: the invariant is the pairing, not the glyph.

**T3 (TASK-159) — no change, and the tension was category-mismatched.** Fetched `loop-me` at source
(`gh api` — the raw URL 404s; the skill lives under `skills/in-progress/`) instead of reasoning from
this repo's one-line summary of it, which is what made the difference. Push right governs a
**Checkpoint**, which `loop-me` defines as a runtime "verify or decide" point inside an already-specified
workflow. The skill *is itself a grilling session*, and its DoD is "done when an implementer agent could
build it without asking a single question." So the source's own model is grill-exhaustively-up-front
plus push-the-runtime-checkpoint-right — and our doc had been comparing his runtime checkpoints against
our design gates. A4 was right that the two are not opposed, and wrong about why. Both principles are
already in our loop on the correct halves, and gate count already scales by size. `CONTEXT.md` § Gates
and `orchestrator/SKILL.md` untouched by ruling, not by omission.

**Two null results in a row is worth naming, not hiding.** D1 predicted the exposure and both tasks
landed there. They are not the same kind of nothing, though: T2 is a genuine null (the claim is real,
we already comply), while T3 is a **reclassification** — the recorded question was not the question, so
"no change" is a positive finding about the doc rather than an absence of one. The check on both is
that each was tested against a source rather than against the summary already in the repo, and in T3's
case the summary is exactly what was wrong.

**Micro examined and rejected on the T3 re-read:** `loop-me`'s **Brief** ("a decision-ready summary …
a link down to the asset itself, never the raw output"). Mapped against our surface first (L-017):
covered by recommend-an-answer popups plus terse-by-default reporting. Not filed as a task.

### 2026-08-09 | complete | T4 — split done; the debt row had been wrong about itself for four sprints

Parent **159 → 110**, under the 120 soft cap with headroom. Scan 3's keeper detail →
`mattpocock-scan3-keepers.md` (44); the two closed-tension verdicts and their evidence →
`mattpocock-tensions.md` (55). Sections were **moved verbatim**, never compressed (§7: knowledge docs
split, ledgers compress). The parent keeps the question, corpus, scan-verdict block, the full delta map
— the one-glance "everything examined, verdict each" table the L-017 discipline depends on — and a
one-line pointer to each verdict.

**The DoD as promoted was unsatisfiable, which is a sharper failure than stale.** It said the parent
keeps the delta map *and* the closed verdicts, with only keeper detail moving. Measured, that lands at
**130** — over the cap the same task's Acceptance demanded. Both clauses could not hold at once, so the
owner ruled which one gives: verdicts move, delta map stays. Recorded here rather than resolved by
quietly reinterpreting whichever clause was inconvenient (L-088).

**TD-038 resolved, and its own history is the finding.** Traced by `git show <sha>:<path> | wc -l`
rather than trusted: 114 (`5fa44de`) → 117 (`4793504`) → **124 (`bab405f`)** → 143 (T2) → 159 (T3).
`bab405f` is SPRINT-050 T2 — **four commits after this row was filed in that same sprint recording
117**. So the row's premise ("none today… the doc is *correct* at 117"), its trigger ("the next re-scan
breaches on contact") and the SPRINT-053 re-review that held on those grounds were all reasoning from
a number that had already stopped being true. That is the **third consecutive TD row falsified at
execution** — TD-036's Summary, TD-034's cause, now TD-038's premise — which is L-091 one level above
the Mitigation lines it was promoted about. Worth the Retro's attention: the pattern is not "mitigations
are guesses", it is "a filed row's *facts* rot and nothing re-measures them".

**Root cause of the silent drift, deliberately not fixed here:** `qa-check.sh` cap-checks
`skills/*/SKILL.md`, `.claude/*` and `docs/sprint/SPRINT-*.md`, but **not `docs/research/`**. A soft cap
with no check behind it is a comment, which is why a 120-line limit absorbed 39 extra lines across four
sprints unnoticed. The owner ruled a split, not a gate change, and a new gate check needs its own
must-FAIL fixture (L-058) — so this is routed to the Retro rather than swept in. Splitting without it
means the same drift can start again tomorrow, and that is the honest caveat on this task.

**Inbound references.** `TECH-DEBT.md` corrected. `ADR-006`'s "Keeper 2" cites scan **2**, still in the
parent's verdict block — resolves. `TODO.md`'s two `tracker:` lines for TASK-155/159 point at
`mattpocock.md § Still open`, which still exists and now correctly says "nothing": the entries
themselves are removed at close, so re-pointing them at the new file to delete them an hour later would
be churn. Stated rather than silently skipped. Pre-existing and untouched: `ADR-010` cites a
"§ Skill-powered tier dispatch" heading that has not existed in this doc since scan 1's detail moved to
git — a dangling anchor this task did not create.

Knowledge index regenerated (`sh scripts/gen-index.sh`) — two new corpus docs. QA gate re-run bare:
72 pass, 0 fail. Layers caught the two new files before the commit, as designed.

### 2026-08-09 | close | Retro written, four buckets routed, and a third gate gap found at the close itself

23/23 Plan DoD. Buckets: **Shipped** → T1's three new docs + the DOCS_Guide §2 amendment, held for a
**MINOR by hand** (not fixes-only, so `/release-patch` is the wrong tool). **Tech debt** → TD-041
(no cap check over `docs/research/`), TD-042 (below), TD-038 resolved, TD-040 second sighting recorded.
**Follow-ups** → TASK-166 (README repo-layout counts). **Learnings** → L-097 · L-098.

**Retrieval miss, recorded as one.** TASK-165 was authored arguing from LAW 1 that "create all six is
not the default", without retrieving ADR-012's LAW 1 reinterpretation, which says the reverse for the
base tier. Cost nothing — the 3/3 split holds under either bar — but the task was written against a
rule the repo had already amended, and nothing surfaced it until execution. That is the tracked signal
for a derived knowledge-graph view.

**TD-042, found by the close itself.** Setting `status: closed` took the QA run from 72 pass to
**68 pass, 0 fail**. The four missing checks are the per-task schema checks and the two layers checks,
which gate on `[ "$st" = "active" ] || continue`. Two things wrong, and they are separable: the
**ordering** — status flips and the Retro/bucket/close_commit edits land in one commit, so the file's
final content is never validated — and the **reporting**, because the layers checks do not fall silent,
they print `PASS … (0 block-check(s) verified)`. A pass over an empty set reads exactly like a pass over
a full one. Verified by reading the script rather than inferred from the count drop.

Third gate gap this sprint (TD-040 blind to wrapped declarations · TD-041 no cap check on research docs
· TD-042 checks disarmed at close), all the same shape: **silence read as compliance**. Whether that
convergence is worth a rule of its own is a promote-time question for the next sprint, not a call to
make while writing the Retro that noticed it — L-058 already covers "a gate needs a must-FAIL fixture",
and three instances is the point at which the pattern is worth *examining*, not the point at which a
fourth rule is added on top.
