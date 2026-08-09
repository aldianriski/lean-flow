---
sprint: 054
slug: rulings
owner: Maintainer
last_updated: 2026-08-09
status: active
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
