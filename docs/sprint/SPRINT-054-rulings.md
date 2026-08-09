---
sprint: 054
slug: rulings
owner: Maintainer
last_updated: 2026-08-09
status: closed
plan_commit: 2af73ee
close_commit:
update_trigger: sprint execute/close events
---

# SPRINT-054 — Rulings

> **Theme:** Three questions the repo has been carrying, all of them now answerable, none of them a
> capability. Six base-tier doc rows lean-flow lacks for no substrate reason and has never ruled on;
> a house-style question about ❌ prohibition that literature can close; and a gate-placement tension
> that only an owner ruling can close. What they share is the deliverable: a **recorded decision**,
> where "no change, and here is why" is a complete outcome. That is also the sprint's exposure — the
> failure mode here is manufacturing an edit to make a decision look like work.

## Scope

**In:** rule on each of the six absent base-tier docs (create or exempt, per row, with the reason) ·
close the ❌-negation question by reading the sources · close the push-right vs gate-before-work
tension by owner ruling · leave `docs/research/mattpocock.md` § Still open empty.

**Out (deferred):** the six rows that ARE substrate-gateable (coding-standards, testing-guide) — they
belong to TASK-162, which landed at SPRINT-053, and are excluded by construction. Rewriting skill
`## Red flags` sections if T2 rules "amend" — that is a follow-up TASK, not this sprint (T2 is S-sized
and the SSOT edit is the ruling). TD-037 and TD-038 stay held (D4). No `init`/`migrate` behaviour
changes fall out of T1 unless T1's ruling contradicts DOCS_Guide §6, in which case it is a
scope-change entry, not a silent extra task.

## Plan

### T1 — Rule on the six absent base-tier docs `[size: M · risk: low · class: decision · HITL]`
Layers: `CONTRIBUTING.md` · `SECURITY.md` · `AGENTS.md` · `docs/product/requirements.md` ·
    `docs/product/acceptance-criteria.md` · `docs/development/setup.md` · `README.md` ·
    `.claude/CLAUDE.md` · `docs/architecture/overview.md` ·
    `skills/lean-doc-generator/references/DOCS_Guide.md`
Depends-on: none
Cites: `skills/lean-doc-generator/templates/` · `scripts/qa-check.sh`

TASK-165, unblocked at the SPRINT-053 close. These six are the base-tier rows lean-flow does not have
and cannot blame on absent substrate — the substrate question was settled at SPRINT-053 T1 and took
`coding-standards` and `testing-guide` with it. What is left is a decision nobody has made. LAW 1 says
a doc exists only where its absence causes repeated interruptions or mistakes, so **"create all six" is
one candidate answer, not the default**, and an exemption is a real verdict — but only if it is written
down somewhere a future reader finds it. Silence is the one outcome this task forbids.

**Acceptance:** each of the six rows has a recorded disposition — a created doc, or a written exemption
naming why its absence causes no repeated mistake — and a reader can tell from the repo which of the
six lean-flow deliberately does without, and why.

**DoD:**
- [x] Confirm A1 at G2 — re-check the six against `DOCS_Guide` §6's base row, which SPRINT-053 T1 made
      authoritative; if any is in fact substrate-gated, it drops out here rather than being exempted
- [x] Per row, apply LAW 1 **explicitly**: name the repeated interruption or mistake its absence
      causes, or record that there is none. Verdict is `create` or `exempt` — never left silent
- [x] Every `create` renders from its template under `skills/lean-doc-generator/templates/` before
      writing (Step 6 is mandatory — the named cause of wrong docs)
- [x] Every `exempt` is recorded in `docs/architecture/overview.md` § Boundaries (A2, ruled at G2), not
      in this sprint file alone — a closed archive is not a lookup surface
- [x] An exemption on a row `DOCS_Guide` §2 marks `init (always)` also amends that row's create-trigger
      to state the condition — the standard and this repo do not get to disagree (2026-08-09
      scope-change; L-096)
- [x] **Consumer check (L-015)** — all six are consumer-facing; judge what lands as a consumer who
      installs the plugin sees it, not against dogfooding
- [x] `README.md` docs-map, `.claude/CLAUDE.md` § File Structure and `docs/architecture/overview.md`
      § Directory structure reflect **whatever actually landed** — and nothing that did not
- [x] `sh scripts/qa-check.sh` re-run bare immediately before the commit (L-089)

### T2 — Close the ❌-negation question by reading `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/mattpocock.md` · `.claude/CLAUDE.md`
Depends-on: T1
Cites: `TECH-DEBT.md` · T4

TASK-155. `writing-for-agents` claims prohibition activates the forbidden behaviour, which cuts against
the ❌ house style every anti-pattern row uses. L-094's test names this a **documented-behaviour**
question: prompting literature on negation exists and is read, not measured — which is why it sat in
`needs-info` waiting for a signal that was never going to arrive. The honest null result ("no change
warranted") is a real outcome and is recorded as one, not treated as a failure to find something.

**Acceptance:** the question is closed in `docs/research/mattpocock.md` with a verdict backed by cited
sources rather than preference, and § Still open no longer carries it.

**DoD:**
- [x] Sources on negation / prohibition in instruction-following read and **cited** — a verdict with no
      citation is the preference this task exists to avoid
- [x] Verdict tested against our actual style, not the general claim: confirm A3 by reading
      `.claude/CLAUDE.md` § Anti-Patterns — every ❌ row pairs the trap with a positive rule — and rule
      on whether that pairing neutralises the effect
- [x] The verdict lands in `docs/research/mattpocock.md`; its § Still open row is removed (closed, not
      re-parked)
- [x] If the verdict is "amend", the amendment lands in `.claude/CLAUDE.md` only — §10's placement test
      puts a repo-wide style rule where every flow reads it — and skill `## Red flags` rewrites are
      filed as a follow-up `TASK-NNN` rather than swept into an S-sized task. That file sits at **80 of
      its 80 cap**, so an amendment there displaces something — a ruling, not an append
- [x] If the edit pushes `mattpocock.md` past its 120 soft cap, apply **TD-038's** named remedy (split
      per-scan files behind an index), never a squeeze — and log it as a scope-change first
      → **discharged as routed, not applied.** The premise was stale: the file was **124 before T2**
      (breached at `bab405f`, SPRINT-050 T2 — the sprint that filed TD-038 recording 117) and is 143
      after. Scope-change logged, nothing squeezed, remedy owner-ruled to **T4**

### T3 — Rule on push-right vs gate-before-work `[size: S · risk: low · class: decision · HITL]`
Layers: `docs/research/mattpocock.md` · `.claude/CONTEXT.md` · `skills/orchestrator/SKILL.md`
Depends-on: T2

TASK-159. `loop-me` argues for deferring a human checkpoint as far as it will go — ask once, late,
fully prepared — against our G1/G2 model, which gates before work starts. L-094 names this a
**judgement call**: it is settled by argument about our own gate placement, and no instrument for it
exists or will, so "unblock when a measurable signal appears" parks it forever. The likely answer is
in the task's own `assumes:` — the two may not be opposed at all — but that is the first thing the
argument has to test, not assume.

**Acceptance:** the tension is closed in `docs/research/mattpocock.md` with a ruling that states where
each of G1 and G2 sits and why, and `.claude/CONTEXT.md` § Gates either changes or is confirmed
unchanged **with the reason recorded** — an unchanged gate with no recorded reason is the question
re-parked.

**DoD:**
- [x] Ruled as a judgement call — an outcome of "wait for evidence" is explicitly unavailable (L-094)
- [x] The ruling separates approving *direction* (G1/G2, before wasted work) from deferring
      *verification* (push-right, until work is presentable) and says whether they conflict at all —
      A4 tested, not assumed; "both, at different points" is a legitimate verdict
- [x] Verdict in `docs/research/mattpocock.md`; § Still open is now empty
- [x] If gate placement changes, `.claude/CONTEXT.md` § Gates is the SSOT edit and
      `skills/orchestrator/SKILL.md` follows **in the same commit** (L-020 — a rule on one surface is
      half-shipped). `CONTEXT.md` sits at 124 of its 130 cap (ADR-007): any addition fits or displaces,
      never raises the cap
- [x] If nothing changes, both files are left untouched and the reason is in the verdict

### T4 — Split `mattpocock.md` per TD-038's remedy `[size: S · risk: low · class: execution · HITL]`
Layers: `docs/research/mattpocock.md` · `docs/research/mattpocock-scan3-keepers.md` ·
    `docs/research/mattpocock-tensions.md` · `TECH-DEBT.md`
Depends-on: T3
Cites: `TODO.md` · `scripts/qa-check.sh` · T2

**Added mid-sprint by owner ruling** (2026-08-09 scope-change) — not promoted with the Plan. T2
measured the file at **143 against its 120 soft cap**, already breached at 124 before this sprint
started, at `bab405f` — the SPRINT-050 commit four steps after TD-038 was filed recording 117. TD-038
held on the grounds that the breach was *hypothetical* and the doc *correct at 117*; both are now
false, which retires the reason for holding. Runs last because T2 and T3 both write into this file, and
restructuring a document that is about to change again is how a split gets done twice.

**Acceptance:** `mattpocock.md` is back under its 120 soft cap with **no signal removed** — per-scan
detail lives behind an index, every inbound reference still resolves, and TD-038 is closed against
measured numbers rather than the stale ones it still carries.

**DoD:**
- [x] Split by **moving whole sections**, never compressing (§7 growth rule — knowledge docs split,
      ledgers compress). The parent keeps the question, the scan-verdict block, the delta map and the
      closed/open verdicts; per-scan keeper detail is what moves
- [x] Every inbound reference resolves after the move — `TODO.md` trackers, `TECH-DEBT.md`, and the
      sprint files that cite this doc
- [x] Line delta measured and reported for parent **and** children, not estimated
- [x] TD-038 marked `status: resolved → SPRINT-054 T4`, and its stale text corrected to the measured
      history (114 → 117 → 124 → 143) — a row whose summary is false is TD-036's shape repeating
- [x] `sh scripts/qa-check.sh` re-run **bare** immediately before the commit (L-089)

<!-- Deliberately NOT in this task: teaching qa-check.sh to cap-check docs/research/. That gap is why
     the breach went unseen for four sprints, and it is a real finding — but the owner ruled a split,
     not a gate change, and a new gate check needs its own must-FAIL fixture (L-058). → Retro follow-up. -->

## Owner-action checklist
- [ ] **Reinstall the plugin before the next session** — this promote ran on 1.25.2 skills against a
      1.27.3 repo (`/prime` freshness row said STALE). The repo source was read directly to avoid
      L-021, but that is a workaround, not a fix.

## Decisions (pre-locked)

- **D1** — Every task here is `class: decision` and each may legitimately end in **no change**. A
  recorded null result is a completed task. Manufacturing an edit to make the sprint look productive
  is the specific failure this sprint is exposed to, and is named so the Retro can check for it.
- **D2** — **Overlap-ownership map.** `.claude/CLAUDE.md` is reachable by T1 (File Structure line, if
  docs land) and T2 (house-style amendment, if the verdict says amend); `docs/research/mattpocock.md`
  by T2 and T3. Resolution: **serialize T1 → T2 → T3, no parallel build.** Each stages its own hunks
  on a shared file (`git add -p` + verify `git diff --cached`), never a plain `git add` over another
  task's WIP (L-042 · L-037). Declared by hand because **TD-040** makes the dispatch preflight snippet
  blind to the indented continuation lines these `Layers:` blocks use — the check cannot be relied on
  to surface this overlap.
- **D3** — TD-034's row is deleted at this promote (§11: resolved at SPRINT-051, three sprints past).
  Id 034 stays retired and is never reused; the substance survives in `CHANGELOG.md`, the SPRINT-051
  archive and git.
- **D4** — TD-037 and TD-038 held. Both were re-reviewed within the last two promotes with their
  triggers unchanged (TD-038 fires at the next `mattpocock.md` re-scan — T2 is an edit, not a re-scan;
  TD-037's next re-review falls at SPRINT-055). Re-reviewing again now would be ceremony.
- **D5** — No `epic:` stamp. EPIC-001 closed 2026-08-09 and nothing here advances a multi-sprint
  outcome; these are three independent rulings, not a destination.

## Assumptions

- **A1** — The six rows are genuinely not substrate-gateable; checked at the SPRINT-053 G2 against all
  18 base rows. *Confirm: T1's first DoD line, re-checked against `DOCS_Guide` §6's base row — the
  SPRINT-053 change is what made that row the authority.*
- **A2** — ~~The home for an `exempt` verdict is undecided.~~ **CONFIRMED at G2, 2026-08-09** —
  `docs/architecture/overview.md` § Boundaries, which already answers "what lean-flow does not own" and
  has room (79 of 150). `.claude/CLAUDE.md` was rejected: at 80 of 80 it would displace an anti-pattern.
- **A3** — Our ❌ rows already pair each trap with a positive rule, which the research doc notes blunts
  the negation effect. *Confirm: T2's read of `.claude/CLAUDE.md` § Anti-Patterns against the sources.*
- **A4** — Gates and push-right are not actually opposed — ours approve direction, push-right defers
  verification. *Confirm: T3's ruling, where it is the proposition under test, not a premise.*

## Execution Log

> **Lives in its own file** — `docs/sprint/logs/SPRINT-054-rulings.md`, rendered from
> `templates/sprint-log.md.template` and created lazily at the first entry. Append there, never here
> (DOCS_Guide §9 · ADR-014).

## Files Changed

| File | Task | Change (WHY) | Risk | Test |
|------|------|--------------|------|------|
| `AGENTS.md` | T1 | created — `.codex-plugin/` + `.kimi-plugin/` exist, so non-Claude agents work here with no instructions at all | Low | 11 lines vs ~10 cap; footer ownership per §3 |
| `SECURITY.md` | T1 | created — MIT plugin installed into others' dev environments; 6 of 14 skills declare unscoped `Bash` and no reporting channel existed | Low | 72 ≤ 80 cap; tool-grant table verified against `allowed-tools:` in all 14 skills |
| `docs/development/setup.md` | T1 | created — three documented recurring frictions (L-067/L-081 env trap · L-021 staleness · `QA_FULL`) are exactly LAW 1's bar | Low | 73 ≤ 100 cap; commands run as written |
| `docs/architecture/overview.md` | T1 | § Boundaries gains the three exemptions with reason + revisit trigger (A2 home); dir map gains `development/`, `AGENTS.md`, `SECURITY.md`, `LICENSE` | Low | 92 ≤ 150 cap; qa-check ownership + structure re-read (L-009) |
| `skills/lean-doc-generator/references/DOCS_Guide.md` | T1 | §2 `product/requirements.md` create-trigger states the second-SSOT condition — consumer-facing, authorised by the 2026-08-09 scope-change | Med | greenfield `init` explicitly unaffected; no repo-specific path in the clause (L-015) |
| `README.md` | T1 | repo-layout block reflects what landed | Low | structure re-read after the edit (L-009) |
| `docs/research/mattpocock.md` | T2 | negation question closed with a cited verdict — null result; § Still open drops to one row | Low | 4 sources read incl. 2 primary; 124 → 143 lines, cap breach routed to T4 |
| `.claude/CLAUDE.md` | T2 | **not changed** — verdict was "no change warranted"; recorded so the untouched file reads as a decision | — | A3 confirmed row-by-row against § Anti-Patterns |
| `docs/research/mattpocock.md` | T3 | push-right tension closed as category-mismatched; § Still open now empty | Low | source fetched via `gh api`, not read off this doc's summary; 143 → 159 lines |
| `.claude/CONTEXT.md` · `skills/orchestrator/SKILL.md` | T3 | **not changed** — gate placement ruled correct; recorded so the absence reads as a ruling | — | A4 tested against the source's own structure |
| `docs/research/mattpocock.md` | T4 | split per §7 — 159 → **110**, back under the 120 soft cap; keeps question, corpus, delta map, verdict pointers | Low | sections moved verbatim, nothing compressed |
| `docs/research/mattpocock-scan3-keepers.md` | T4 | new — scan 3's K1–K5 detail behind the index | Low | 44 lines; corpus metadata lint green |
| `docs/research/mattpocock-tensions.md` | T4 | new — the two closed tensions with their sources and evidence | Low | 55 lines; corpus metadata lint green |
| `TECH-DEBT.md` | T4 | TD-038 resolved, and its stale premise corrected against the measured history (114→117→124→143→159) | Low | each figure from `git show <sha>:<path>`, not estimated |
| `docs/knowledge-index.md` | T4 | regenerated — two new metadata-carrying docs | Low | `sh scripts/gen-index.sh`; "knowledge index current" check green |

## Retro

Four tasks, 23/23 DoD, three scope-changes, one task added mid-sprint. Two of the three promoted
rulings ended in **no change**, which D1 named as this sprint's exposure before it started — and the
check that they are honest is that each was tested against a *source* rather than against the summary
of it already in the repo. In T3 that summary was itself the error.

**Buckets routed** (DOCS_Guide §10):
- **Shipped** → T1 only, consumer-facing: `AGENTS.md`, `SECURITY.md`, `docs/development/setup.md`, and
  the `DOCS_Guide` §2 amendment. T2/T3 changed nothing by ruling; T4 is repo-internal restructuring.
  Held for the release step — **this is not fixes-only, so it wants a MINOR by hand**, not
  `/release-patch`.
- **Tech debt** → **TD-041** (`qa-check.sh` cap-checks `skills/`, `.claude/` and `docs/sprint/` but not
  `docs/research/` — the reason a 120-line cap absorbed 39 lines unnoticed). **TD-038 resolved** by T4.
  **TD-040** gained its second live sighting, recorded on the row.
- **Follow-ups** → **TASK-166** (README repo-layout: stale template count 30/32 vs a real 34, and
  `.codex-plugin/` missing — found in T1, deliberately not swept in).
- **Learnings** → **L-097** (a number inside a criterion is remembered, not measured, and rots
  silently) · **L-098** (a summary of an external source is a hypothesis; re-read the source when a
  decision turns on it).

**Retrieval check** — **yes, one, and it shaped the sprint's biggest task.** TASK-165 argued from LAW 1
that "create all six is a candidate answer, not the default", without retrieving **ADR-012's LAW 1
reinterpretation**, which says the opposite for the base tier: the mandatory minimum *is* scaffolded at
init, so create is the default and an exemption needs a positive reason. Both bars were applied at
execution and the 3/3 split holds under either, so the contradiction cost nothing here — but the task
was authored against a rule the repo had already amended, and nothing surfaced that until the work
started. A retrieval miss on our own ADR set, which is the tracked signal for a derived
knowledge-graph view.

**Cost** — one interactive session, **coordinator-inline, zero sub-agents dispatched**. `dispatch.md`
makes dispatch the default for `execution`-nature work and T2's research leg qualified; it ran inline
on a session-level constraint (this session was instructed not to call the Agent tool unless asked).
Same deviation SPRINT-053 recorded, and now the second consecutive sprint where the dispatch default
did not fire for a reason outside the loop's control — worth noting before the series is read as
evidence about the default itself. Token cost: **not available** — no per-session accounting was
captured, stated rather than omitted (the series is what lets a later promote size a batch).

**Worked**
- **Naming the failure mode in the Plan (D1) before it could happen.** Two tasks ended in "no change",
  and having written down that a null result is a completed task made recording them straightforward
  instead of a temptation to manufacture an edit. Cheap to do, and it was load-bearing twice.
- **Measuring instead of trusting a stated figure**, every time it came up: line counts via
  `git show <sha>:<path> | wc -l`, the unscoped-`Bash` count against all 14 `allowed-tools:` lines,
  the corpus source via `gh api`. Every one of those disagreed with what was written down.
- **The gate caught three real things before they shipped**: T2's undeclared `T4` reference, T4's two
  undeclared new files, and — in the same message — TD-039's fix naming the `Cites:` escape on its
  first real trip. Also the self-review catch of a fabricated-looking repo slug (`aldianrizki` vs the
  real `aldianriski`) in a doc that had just been created.

**Friction**
- **Ran the whole sprint on stale skills** — 1.25.2 installed against a 1.27.3 repo. Survived only by
  reading every procedure from the repo source instead of the invocation's own base dir, which is
  reaching *past* the stale procedure rather than following it. Third occurrence of L-021 (Sprint-023,
  Sprint-039, now). The `/prime` freshness row did its job and reported it; the gap is that nothing
  between the report and the work stops a session from proceeding on it.
- **Two DoD lines could not be met as written**, in different ways: T2's had a stale premise, T4's was
  self-contradictory at authoring. Both cost a scope-change and an owner ruling mid-wave. → L-097.
- **The preflight reported CLEAR over an overlap it structurally cannot see**, for the second promote
  running. Both times a human reading the parsed record caught it, which is not a control (TD-040).
- **Closing the sprint disarmed four of its own checks, silently** — found at this close by noticing
  the run went 72 pass → 68 pass, 0 fail. `qa-check.sh` gates the sprint checks on `status = active`,
  so the status flip and the largest edit to the file land in one unguarded commit, and the two layers
  checks then print PASS with *zero* verified rather than reporting a skip (TD-042). Third gate gap
  this sprint, all the same shape: silence read as compliance.

**Pattern candidate** (surfaced → `docs/LEARNINGS.md`)
- **L-097** — a number written into a criterion is remembered, not measured; three instances this
  sprint (TD-038's premise, T2's DoD, T4's DoD), and the third consecutive TD row falsified at
  execution. Aggravated wherever a stated cap has no check behind it.
- **L-098** — re-read the source when a decision turns on it; the repo's own summary is a hypothesis.
  T3's entire recorded tension dissolved on one `gh api` call.
