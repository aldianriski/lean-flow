---
sprint: 056
slug: silent-passes
owner: Maintainer
last_updated: 2026-08-09
status: active
plan_commit: 1f0c012
close_commit: [sha — set at close]
update_trigger: sprint execute/close events
---

# SPRINT-056 — Silent Passes

> **Theme:** Four gates that report green over input they never actually examined. SPRINT-055 was
> about rules written where nothing reads them; this is the layer underneath — rules that *are* wired,
> whose checkers then pass what they cannot parse, cannot compare, cannot reach in time, or have
> already disarmed. Every one of them has produced a live false PASS on this repo, and every one of
> them announced it as a clean run. A gate's worst failure is the silent false-negative (L-058), and
> these are four instances of it that we have watched happen and not yet fixed.

## Scope

**In:** the dispatch preflight taught to see the declarations it currently skips · gate coverage
derived from the standard rather than hand-listed · an undeclared edit reported while it is still
cheap to fix · the sprint checks kept armed through the commit that closes the sprint.

**Out (deferred):** flattening the deliberate WIP/committed exclusion asymmetry in
`check-layers-observed.sh` — it is documented and load-bearing, T3 must not remove it · sweeping the
three `docs/research/` files currently over cap (T2 ships the *check*, not the diet; a cap moves only
by ADR after a measured diet, §7) · rewriting the dispatch preflight into a call-out to the real
checker *unless* T1's re-derivation rules that way · TD-037, re-reviewed and reaffirmed at this
promote, trigger still unfired.

## Plan

### T1 — Stop the dispatch preflight silently passing what it cannot parse `[size: M · risk: med · class: decision · HITL]`
Layers: `skills/orchestrator/references/dispatch.md` · `scripts/lib/check-layers-completeness.sh` · `scripts/qa-check.sh` · `evals/run-dispatch-preflight-fixtures.sh` · `evals/fixtures/dispatch-preflight/`
Cites: `TECH-DEBT.md` TD-040 · TD-043 — read as the evidence for the problem, marked resolved at close
Depends-on: none
The preflight snippet embedded in `dispatch.md` re-implements a parser that
`check-layers-completeness.sh` already has correct, and has drifted from it twice: it matches only
lines beginning `Layers:` (so a wrapped declaration's continuation is invisible) and extracts only
dot-bearing tokens (so a directory token ending in `/` is invisible). Both produced a live
`PREFLIGHT: CLEAR` over a real shared-file overlap, at the SPRINT-053 and SPRINT-054 promotes; both
were harmless only because the overlap happened to carry a `Depends-on:` edge anyway — luck, not the
check. **Re-derive before patching:** TD-040's own mitigation asks whether the snippet should *call*
the real checker rather than be patched a second time, and patching twice is how the drift happened.

**Acceptance:** the preflight reports the same shared-file ownership verdict as the full checker on
(a) a wrapped/indented `Layers:` declaration and (b) a directory token ending in `/`.

**DoD:**
- [ ] Re-derive the shape first (TD-040's open question): patch the snippet, or have it call
      `check-layers-completeness.sh`. Record the ruling and its reason before writing code — the
      snippet ships inside a consumer-facing reference, which is what makes duplication expensive
- [ ] Wrapped/indented `Layers:` continuation lines are read by the preflight
- [ ] A directory token ending in `/` participates in the overlap comparison (prefix-aware), or is
      rejected outright in a multi-task Plan — whichever the ruling above chose
- [ ] Two must-FAIL fixtures, one per check, each currently reporting CLEAR on a real overlap and
      afterwards HALTing with its named finding (L-058)
- [ ] Both fixtures verified red-on-new **and** green-on-old against the pre-fix snippet (L-090)
- [ ] Fixtures retained and wired into `qa-check.sh`, not deleted with the prototype (TD-012)

### T2 — Derive gate coverage from the standard instead of hand-listing it `[size: M · risk: med · class: decision · HITL]`
Layers: `scripts/qa-check.sh` · `scripts/lib/check-doc-caps.sh` · `scripts/lib/check-manifest-lockstep.sh` · `skills/lean-doc-generator/references/DOCS_Guide.md` · `evals/run-doc-caps-fixtures.sh` · `evals/fixtures/doc-caps/`
Cites: `README.md` · `plugin.json` · `.claude-plugin/plugin.json` · `.claude-plugin/marketplace.json` · `.codex-plugin/plugin.json` · `.kimi-plugin/plugin.json` · `mattpocock.md` · `loop-hygiene-prd.md` · `graphify-daily-value.md` · `graph-engineering.md` · T4 (SPRINT-054's, not this sprint's) — read as the surfaces compared and the evidence cited, not edited here
Depends-on: T1 (shared `scripts/qa-check.sh` — T1 owns it first)
Two halves of one concern: coverage hand-listed instead of derived. `qa-check.sh` cap-checks four
globs it names by hand, so every §2 row with a stated cap and no matching glob is a comment — that is
how `docs/research/` drifted unwatched. And leg 6 compares the README *footer* against
`plugin.json`, so of the **four** manifests carrying the version (`.claude-plugin/plugin.json`,
`.claude-plugin/marketplace.json`, `.codex-plugin/plugin.json`, `.kimi-plugin/plugin.json`) no two are
ever compared to each other — which is how `.codex-plugin` and `.kimi-plugin` drifted five releases
behind before v1.28.0 caught it by hand. **Re-derived at this promote:** TD-041 names
`mattpocock.md` as the drifted case, but that file was fixed at SPRINT-054 T4 (110 lines); three
*other* research docs are over the 120 cap today — `loop-hygiene-prd.md` 214, `graphify-daily-value.md`
157, `graph-engineering.md` 122. The row's example decayed into the one case that no longer applies.

**Acceptance:** a §2 row that states a cap is cap-checked without anyone adding a glob by hand, and
all four version manifests are compared to each other rather than one being compared to the README.

**DoD:**
- [ ] Re-derive whether the two halves are separable. If G2 rules that caps derive from §2 but
      manifests cannot, split before implementing rather than forcing one mechanism over both
- [ ] Cap coverage is derived from the §2 table, not hand-listed in the script
- [ ] All four manifests are compared to each other; the README footer check stays as-is
- [ ] A must-FAIL fixture per half: a doc over its stated §2 cap, and one manifest out of lockstep
      with its siblings — each failing with its named finding (L-058)
- [ ] Both fixtures verified red-on-new **and** green-on-old (L-090)
- [ ] The three research docs currently over cap are **reported, not fixed** — a cap moves only by
      ADR after a measured diet (§7), and the diet is not this sprint. File what the new check finds
- [ ] Fixtures retained and wired into `qa-check.sh` (TD-012)

### T3 — Make an undeclared edit fail while it can still be fixed cheaply `[size: M · risk: low · class: decision · HITL]`
Layers: `scripts/lib/check-layers-observed.sh` · `docs/QA.md` · `scripts/qa-check.sh` · `evals/run-layers-observed-fixtures.sh` · `evals/fixtures/layers-observed/`
Cites: `TECH-DEBT.md` TD-044 · TD-031 · TD-035 · TD-037 · `TODO.md` · T6 · T7 (SPRINT-055's, not this sprint's) — read as the lineage and the recorded case, not edited here
Depends-on: T2 (shared `scripts/qa-check.sh` — the fixture-wiring chain)
The observed-layers checker runs two paths with two exclusion lists — `is_excluded()` for uncommitted
WIP and `is_excluded_committed()` for history — and the asymmetry is **deliberate and documented**:
a commit can be attributed to a task and uncommitted work cannot, so the committed path is
intentionally stricter. This task must not flatten it. The defect is timing, not scoping: a violation
stays invisible through the whole task and then surfaces attributed to a task already finished and
pushed, where the only remedies are amending closed history or correcting a frozen Plan. Observed in
SPRINT-055 T6, which edited `TODO.md` as task work; the gate ran green while the edit sat uncommitted
and the finding landed during T7.

**Acceptance:** an undeclared edit to a file the WIP path excludes is reported **before** its task
commits, demonstrated on the recorded case (a task editing `TODO.md` as task work rather than close
bookkeeping).

**DoD:**
- [ ] Re-derive the open design question, which is unanswered on purpose: should exclusion key on the
      *file* or on the *phase that touched it*? Record the ruling before writing code
- [ ] The deliberate WIP/committed asymmetry survives — `docs/QA.md` still documents it and still
      explains why, and the committed path is not loosened to match the WIP path
- [ ] Do not narrow or widen either list on this single observation (TD-031's pattern) — if the
      ruling is that no change is warranted yet, that is a valid outcome; say so and close the row
- [ ] A must-FAIL fixture holds the behaviour: the recorded case reported pre-commit with its named
      finding (L-058), verified red-on-new and green-on-old (L-090)
- [ ] Fixture retained and wired into `qa-check.sh` (TD-012)

### T4 — Keep the sprint checks armed through the commit that closes the sprint `[size: M · risk: med · class: decision · HITL]`
Layers: `scripts/qa-check.sh` · `scripts/lib/check-layers-observed.sh` · `docs/QA.md` · `evals/run-sprint-close-fixtures.sh` · `evals/fixtures/sprint-close/`
Cites: `skills/lean-doc-generator/SKILL.md` (the close row) · `docs/sprint/archive/SPRINT-055-wiring-the-standard.md` — read as the close sequence being guarded
Depends-on: T3 (shared `scripts/qa-check.sh` · `docs/QA.md` · `check-layers-observed.sh` — T3 is last in the chain before this)
The sprint checks gate on `[ "$st" = "active" ] || continue`, so writing `status: closed` disarms them
in the same commit that makes the largest edit to the file — the Retro, the four-bucket routing and
`close_commit` all land unguarded. Two live instances: **72 → 68 pass** at SPRINT-054's close and
**94 → 87 pass** at SPRINT-055's, both reported `0 fail`. Worse, the two layers legs do not go quiet;
they print `PASS … (0 block-check(s) verified)`, which in a green run is indistinguishable from real
coverage. Scoping a closed sprint out of validation is itself defensible — history need not be
re-validated forever. The defect is the **timing** and the **reporting**, not the scoping.

**Acceptance:** the commit that writes a Retro and flips `status: closed` is validated against the
sprint schema and caps before the flip is honoured, and a check that verified zero inputs reports as a
skip rather than a PASS.

**DoD:**
- [ ] Re-derive the split first: TD-042 says the *reporting* half may be the whole fix. Rule whether
      the ordering half (validate the close commit before honouring the flip) is worth its cost, and
      split the task if G2 finds the two halves separable
- [ ] A zero-verified check reports as a skip, not a PASS (`note` already exists for this and is used
      elsewhere in the script)
- [ ] If the ordering half is ruled in: the close commit is schema- and cap-validated before
      `status: closed` is honoured
- [ ] A must-FAIL fixture presents a close commit carrying a schema violation and the gate goes red
      with its named finding (L-058), verified red-on-new and green-on-old (L-090)
- [ ] Fixture retained and wired into `qa-check.sh` (TD-012)

## Owner-action checklist

- [ ] Reinstall the plugin before executing — this session primed at `1.28.0 base-dir != 1.29.0 repo`.
      Every task here edits a checker whose procedure a stale skill copy would describe wrongly
      (L-021; the in-session repair is `git diff <release-commit>..HEAD -- skills/`, L-095)

## Decisions (pre-locked)

- **D1** — The shared-file ownership map is written into `Depends-on:` edges, not into this section as
  prose. Every task wires its retained fixture into `scripts/qa-check.sh` (TD-012), so that file is
  shared by all four and the chain is strictly sequential: **T1 → T2 → T3 → T4**. No task may run in
  parallel with another this sprint. SPRINT-055 signed "strictly sequential" at G2, wrote it only in
  its § Decisions, and its own preflight HALTed because nothing reads prose (L-099). This Plan was
  first written claiming T3 could run parallel — the gate rejected it, because T3's own DoD wires a
  fixture into the file T2 owns. The map is what the checker parses, not what the author intended.
- **D2** — No bare directory tokens (`evals/`, `scripts/lib/`) in any `Layers:` line this sprint.
  TD-043 establishes that the preflight cannot see them, and T1 is the task fixing exactly that
  parser; declaring a token the gate is blind to, in the sprint repairing that blindness, would put
  the Plan outside its own check. Concrete paths and per-concern fixture subdirectories only.
- **D3** — Every task carries a **re-derive** step as its first DoD line. All four trackers say the
  filed mitigation is a hypothesis, not a plan (L-091), and three of the four rows name an open
  design question. None of them is cleared to implement straight from the row.

## Assumptions

- **A1** — T1's ruling may replace the snippet with a call to `check-layers-completeness.sh`, which
  would change T1's `Layers:` mid-sprint. *Confirm: the T1 re-derive step; declare the correction in
  the Execution Log and continue — a `Layers:` line is live, not a prediction to defend (L-100).*
- **A2** — T2's two halves are one concern. *Confirm: the T2 re-derive step; split if G2 finds caps
  and manifests need different mechanisms.*
- **A3** — T4 may reduce to the reporting half alone. *Confirm: the T4 re-derive step against
  TD-042's own note that reporting may be the whole fix.*
- **A4** — T3 may correctly conclude that no code change is warranted yet. *Confirm: the T3 re-derive
  step; TD-031's pattern is narrowing a working guard under no pressure, and a reaffirmed deferral is
  a decision, not a skipped task.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-056-silent-passes.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here.

## Files Changed

<!-- Filled during execution; feeds CHANGELOG at close. -->

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|

## Retro

<!-- Written at close. Route the buckets to durable homes (DOCS_Guide §10):
     shipped → CHANGELOG.md (root) · tech debt → TD-NNN · follow-ups → TASK-NNN · learnings → docs/LEARNINGS.md.
     After close, the file moves → docs/sprint/archive/ + a one-line entry in docs/sprint/INDEX.md (§11). -->
