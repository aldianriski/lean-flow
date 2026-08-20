---
owner: Maintainer
last_updated: 2026-08-20
update_trigger: Tech debt filed (Sprint Close), aged (Sprint Promote), or resolved
status: current
---

# lean-flow — Tech Debt Ledger

> Filed automatically by the Sprint Close Retro (`TD-NNN` rows) · aged at Sprint Promote
> (unaddressed ≥ 3 sprints → re-review; `severity: high` → auto-escalate to `TODO.md` Backlog P1) ·
> resolved → `status: resolved → TASK-NNN`; **≥ 3 sprints later the row is deleted outright** (§11).
> The delay is deliberate — a just-resolved debt is still context at the next promote — and the
> substance survives in `CHANGELOG.md`, the sprint archive and git, so what goes is a breadcrumb, not a
> record. **IDs stay monotonic: a deleted row never frees its id.** `severity` ∈ trivial · minor · medium · high.
>
> A row's **`Mitigation:` line is the filer's hypothesis, not a plan** — written while the cost was being
> felt, and after a few re-reads it starts to read as settled. Cite the evidence for the *problem*;
> re-derive the *fix* before a DoD is built on it (L-091 → DOCS_Guide §10). The same goes for a row's
> Summary: TD-036's was false the day it was filed.
>
> **A row naming where cost goes accuses the component that is *legible*, never the one that dominates** —
> L-091's sibling, explaining why that particular hypothesis got reached for. An enumerable list you can
> read, count and point at can have a hypothesis phrased *about* it; an unnamed, uncounted blob beside it
> cannot be accused at all, so it is never suspected. TD-046 blamed fourteen nameable eval harnesses
> (measured: ~34%) while the eleven unnamed inline sections (~66%) had never been measured by anyone —
> wrong in both directions, unchallenged for two sprints, and invisible to every re-read. **Force the
> arithmetic before the diagnosis:** subtract the suspect from the total and say out loud what the
> remainder is (L-107 ×2).

---

## Tech Debt

- **TD-064** severity: minor | status: open | created: Sprint-075
  - Summary: **28 of this repo's own docs fail the ownership-header rules the engine now checks** — 15
    carry no frontmatter at all (`docs/qa/` ×3, `docs/strategy/adlc/` ×12) and 13 research docs declare
    every field except `update_trigger:`. §3 makes the header mandatory on every doc and §1 LAW 3
    requires the trigger, so these are real, named findings against the reference implementation.
  - Evidence: `sh conformance.sh .` — 15 `ownership-header-missing`, 13
    `ownership-header-field-missing`, 28 `update-trigger-absent` (the last is the union: a doc with no
    header also has no trigger). Reconciled against an independent census of the same tree, which is
    how a 14-vs-15 disagreement exposed a checker bug rather than a doc gap (→ L-140).
  - Impact: low today, rising. `qa-check.sh` **relays** engine findings rather than counting them
    (SPRINT-075 T2's ruling), so nothing is red and no gate is being ignored. The cost is that the
    repo which publishes the standard does not satisfy this part of it, which is the gap an adopter
    notices first — and it grows every time a doc lands without a header.
  - Mitigation (hypothesis, not a plan — the filer's, written at close): add the four-field header to
    the 15, and `update_trigger:` to the 13. Cheap and mechanical for `docs/qa/` and `docs/research/`.
    **`docs/strategy/adlc/` is the judgement call**: EPIC-004 § Scope explicitly puts every ADLC
    platform concept out of scope, and 12 of the 15 headerless docs live there — so the honest options
    are *add headers to docs we have deliberately parked* or *decide that tree is not governed by §3
    and say so where §3 can be read*. Re-derive before building a DoD on either.
  - Sibling, not a duplicate: **TD-065**. Both are "the conformance corpus disagrees with itself", but
    that row is a register miscount and this one is a real doc gap; a cure for either moves neither.

- **TD-065** severity: trivial | status: open | created: Sprint-075
  - Summary: **`docs/research/conformance-dispositions.md` still counts §13's five rules under
    `build`**, though SPRINT-074 shipped `check-attestation.sh` covering them. § Covered today never
    gained that row, so the register understates coverage by five.
  - Evidence: § Covered today lists 12 rules / 5 checkers after SPRINT-075 T4 and T6; §13's
    `S13.TRAILERS` · `S13.OWNCOMMIT` · `S13.EVIDENCESHA` · `S13.AGREE` · `S13.UNSIGNEDCLAIM` appear in
    neither that table nor the engine's registry, while `check-attestation.sh` demonstrably answers
    them. EPIC-004's § Closed-when 2 already records the same fact from the other side ("the `build`
    remainder is 38 of 43, not 42").
  - Impact: trivial in isolation — nothing reads these counts mechanically — but the register is the
    thing a later sprint will price coverage work from, and it is wrong by five in the optimistic
    direction. Named in the file itself at SPRINT-075 T6 rather than fixed in passing, because the
    correction moves numbers three of its sections depend on.
  - Mitigation (hypothesis, not a plan): one reconciliation pass over the register — add §13's row to
    § Covered today, drop those five from `build`, re-derive `covered + build + scope-out = 63` by
    counting rule ids in each table rather than editing the headers. Do it as its own change, not as a
    rider on a coverage task, so the arithmetic is reviewable.

- **TD-066** severity: minor | status: open | created: Sprint-075
  - Summary: **the conformance engine takes ~47s on this repository, and the cost is process spawn.**
    The §1/§3 assertions read 236 docs; the implementation is one cached tree walk plus one `awk` per
    doc, which is already a ~12× improvement over the first version (~2,800 processes, a walk per rule
    and an `awk` per field per doc, which made `qa-check.sh` look hung rather than slow).
  - Evidence: `time sh scripts/lib/conformance-engine.sh .` → `real 46.9s · user 7.3s · sys 18.9s`.
    The user/sys split is the finding: this is `fork`/`exec` overhead on Windows, not computation, and
    the same work costs a few seconds where process creation is cheap. Behaviour was verified unchanged
    across the optimisation by counts (15 / 13 / 28 before and after).
  - Impact: it is a real tax on `qa-check.sh`, which an adopter never runs but this repo runs at every
    gate — and the engine leg is now the slowest single leg. It gets worse linearly as coverage grows:
    every family added walks the same doc set again unless it reuses the cache.
  - Mitigation (hypothesis, not a plan — and one deliberately *rejected* variant is recorded with it):
    the obvious next step is one `awk` over every file at once (~1 process instead of 236). **That was
    rejected on purpose**: it needs a cross-file state machine and silently drops a zero-byte file,
    because `awk` never reaches `FNR==1` for one — and a doc missing from the scan is a doc no rule
    reports on, which is the silent skip this engine exists to prevent (L-058). If it is taken, it
    needs a row-count reconciliation (rows emitted == files walked) as a named finding, not a comment.
    The reasoning is written into `conformance-engine.sh` so the next person meets the argument before
    the temptation.

- **TD-063** severity: minor | status: open | created: Sprint-074
  - Summary: **`gen-index.sh --check` decides staleness with a byte compare that includes a field
    guaranteed to drift.** The check is `cmp -s "$tmp" "$OUT"` — a freshly generated index against the
    committed one — and the generator stamps `last_updated:` with **today's** date. So the gate reports
    `knowledge index STALE` on any day after the index was last regenerated, whatever the corpus did.
  - Evidence: three runs of effectively one tree. SPRINT-074's promote recorded **150 pass / 0 fail**;
    T1 the next day recorded **150 pass / 1 fail** with the only difference being the date; T2 the day
    after that recorded **154 pass / 1 fail**, and regenerating changed **one line**
    (`last_updated: 2026-08-17` → `2026-08-18`) with the index body byte-identical both times. Neither
    T1 nor T2 touched any ADR-009 metadata, which is what the index is derived from.
  - Impact: a gate reporting **red on correct code** — the failure mode that costs most downstream,
    because it teaches the reader to re-run the generator reflexively and move on. The day it goes red
    for a real reason (a metadata-carrying doc genuinely edited and not regenerated) it will read
    exactly the same. It also sits squarely on `S10.MATCHER`'s territory: a check deciding a property
    from a comparison that includes a field unrelated to that property.
  - Mitigation (hypothesis, not a plan — the filer's, written while the cost was being felt): compare
    the generated **body** with the stamped field excluded, or stamp `last_updated:` from the newest
    mtime across the corpus the index is derived from rather than from `date`. Either is a checker
    change; which one is a judgement call about whether the stamp should track *the corpus* or *the
    regeneration event*.
  - **Sibling, not a duplicate: TD-050.** Both live in `qa-check.sh`'s knowledge-metadata
    section and both concern index freshness, so a ledger search reaches one from the other.
    They are different debts: TD-050 is the gate's **runtime cost centre** (freshness is ~36%
    of section 4), this row is a **false red** on correct code. A cure that stops byte-comparing
    the stamped field would move both, which is an argument for pricing them together and not
    for merging them.
  - **Not blocked on evidence, and must not be parked as if it were** (L-094): the class of fact that
    settles this is a **documented behaviour** (read `gen-index.sh`) plus a **judgement call** (which
    of the two cures), neither of which accumulates by waiting. The reason it is not fixed here is
    scheduling, not uncertainty — SPRINT-074 D4's reasoning applies (T3 already changed one
    `Layers:`-adjacent matcher, and two matcher changes in one sprint make either regression hard to
    attribute). **Ready to schedule; no unblock condition.**

- **TD-062** severity: medium | status: open | created: Sprint-073
  - Summary: **`check-doc-caps.sh` takes the first digit run anywhere in a §2 `Cap` cell as the cap
    number, so any incidental digits become the limit.** Line 69 is
    `if (match(cap, /[0-9]+/)) capn = substr(cap, RSTART, RLENGTH)`. Found live at SPRINT-073 T2: a cell
    written `no numeric cap (ADR-026)` produced `FAIL cap spec/STANDARD.md (943 > 026)` — the spec was
    momentarily capped at **26** lines by its own ADR citation. The existing non-numeric cells survive
    only because none happens to contain an ASCII digit (`append-only`, `open rows only`, `—`, and
    `no hard cap¹`, whose superscript is not `[0-9]`).
  - Impact: **wrong in the dangerous direction, and silently.** A stray digit produces a *smaller* cap
    than intended, so the failure mode is a permanent FAIL on a correct file — loud, and it was caught
    in one run. But the same parse admits the quiet inverse: a cell reading `120 (was 100)` yields
    **120**, and a footnote marker `2` before the number would yield **2**. There is no validation that
    the extracted integer is the whole cell, so the checker cannot distinguish "this cell states a cap"
    from "this cell contains a digit". Every §2 cap the repo enforces rests on that parse.
  - Mitigation (**not yet derived**, L-091): "anchor the pattern to the whole cell" is the obvious move
    and is probably most of it. Price at least: whether a cell must be *either* a bare integer *or* a
    known non-numeric keyword, with **anything else reported as a named finding** rather than parsed
    optimistically — silence is what made this reachable · whether `soft` / `hard` qualifiers stay
    parseable alongside the integer (`320 soft`, `400 hard` are live and must keep working) · and
    whether the same first-digit-run habit appears in the other §2-derived readers, which is a survey,
    not an assumption. Note the interaction: EPIC-004's engine must parse §2's table anyway, so this
    may be subsumed rather than fixed in place.
  - Tracker: SPRINT-073 T2 Execution Log · `scripts/lib/check-doc-caps.sh:69` · **ADR-026** (the ruling
    that surfaced it) · L-057 (found only because the DoD required *running* the checker) · L-108
    (a matcher anchored by shape, not by substring — the same lesson one level down)

- **TD-061** severity: medium | status: open | created: Sprint-072
  - Summary: **`check-doc-caps.sh` expands §2's `research/<slug>.md` into a non-recursive glob, so any
    file under a `docs/research/` subdirectory is uncapped and unreported.** Probed live at SPRINT-072's
    G2: a file placed at `docs/research/_captest/probe.md` produced **zero** rows from the checker —
    not `OVER-CAP`, not `PASS`, no row at all. Nothing depends on this today because no such
    subdirectory exists, which is precisely why it would be discovered at the worst moment.
  - Impact: this is a **silent false negative in a cap gate**, the failure class L-058 exists to
    prevent, and it is reachable by following the standard's own advice — §6's cap-hit rule says split
    into a tree, and a tree under `docs/research/` is the natural reading. So the documented remedy for
    one finding creates a blind spot for another, and the resulting gate is green. SPRINT-072 avoided
    it only by probing before adopting (L-132). The blast radius is bounded to `docs/research/` today;
    whether other §2 rows with a `<slug>` component share the semantics is **not established** and is
    part of pricing this.
  - Mitigation (**not yet derived**, L-091): "make the glob recursive" is the obvious move and is
    probably not the whole answer. Price at least: whether a `<slug>` path component in §2 is *meant*
    to admit subdirectories at all, or whether the real defect is that §2 does not say (a checker
    change would then encode a rule the standard never stated — L-123's shape) · whether other §2 rows
    are exposed the same way, which is a survey, not an assumption · and whether a file matched by no
    §2 row should report as an explicit **uncovered** row rather than as silence, since silence is what
    made this invisible. Note the interaction: EPIC-004's engine has to resolve §2's path patterns
    anyway, so this may be subsumed rather than fixed in place.
  - Tracker: SPRINT-072 G2 Execution Log (the probe) · `docs/research/conformance-baseline.md`
    § Findings recorded for later sprints · **L-132** · L-058 · ADR-015 (soft caps report, and cannot
    be grandfathered)
  - **Re-reviewed 2026-08-18 (SPRINT-075 promote, 3 sprints open) — held, trigger unfired.** SPRINT-074
    added no `docs/research/` subdirectory, so the non-recursive glob was never asked a question it
    could get wrong. It did reach `conformance-dispositions.md` correctly, reporting it over the soft
    cap at 163 — evidence the glob works on the flat case, and none either way on the nested one.

- **TD-060** severity: minor | status: open | created: Sprint-071
  - Summary: **nothing checks that a cross-reference inside `spec/STANDARD.md` resolves.** §13 referred
    to `gates_signed:` as living in "§9" while §9 never defined it — a dangling internal pointer that
    survived authoring, review, a full sprint and a green gate, and was found only by a human reading
    the spec as an adopter with no `skills/` access (SPRINT-071 T3). The same exposure applies to every
    `§N` reference in the file, of which there are many, and to references *into* `spec/` from
    `skills/` — 25 name-citations (`STANDARD §N`) whose targets nothing verifies either.
  - Impact: bounded but badly placed. The spec is the artifact an adopter *pins*, so a dangling
    reference is shipped to every consumer and is exactly the kind of defect that erodes trust in a
    standard faster than a missing feature would — it reads as evidence the document was not checked.
    The gap is also self-concealing: a reference reads fluently from the source side, so review does
    not catch it, and the corpus is self-describing enough that grepping for `§9` finds the *pointer*
    and reports success (L-108's shape again).
  - Mitigation (**not yet derived**, L-091): the obvious move is "a checker that resolves every `§N`
    against the section headings present in the file", which is probably most of it and is not
    obviously the whole thing. Price at least: whether the check covers **references into `spec/` from
    `skills/`** as well as spec-internal ones (the 25 name-citations are the larger surface, and they
    cross a file boundary) · whether it verifies only that the section *exists* or that it *contains
    the referenced subject*, which is the failure that actually occurred and is far harder to assert ·
    and whether this belongs in `qa-check.sh` or is subsumed by EPIC-004's engine, since a conformance
    tool reading the spec has to resolve its cross-references anyway.
  - Tracker: SPRINT-071 T3 · **L-129** · ADR-023 (`spec/` is the SSOT an adopter pins) · vehicle absent
  - **Re-reviewed 2026-08-16 (SPRINT-074 promote, 3 sprints open) — held, but the exposure has grown by
    a whole class and the row is re-scoped rather than merely re-parked.** Ledger search first (L-127):
    nothing new checks `§N` resolution, and no vehicle exists. **What changed is the surface.**
    SPRINT-073 T1 added §14 and 13 per-section Conformance tables, introducing a second kind of
    internal reference: **rule ids** (`S13.NOINFER`, `S2.F-CAP`). §14 cites ids, §7's table cites ids in
    its `Restates` column, and §2's new prose cites §14. These are **worse than a dangling section
    pointer in one specific way — they are machine-read.** A conformance finding *names a rule id*, so an
    id that does not resolve produces a finding an adopter cannot trace to any rule, and the spec is the
    artifact they pin. The original row's argument (a reference reads fluently from the source side, so
    review never catches it) applies unchanged and now covers ~100 more references. **Unblock condition
    updated:** any check must resolve **both** `§N` and `S<n>.<KEY>`, and EPIC-004's engine has to
    resolve the ids anyway to name findings — so this is a strong candidate for subsumption rather than
    a standalone checker. Not vehicled into SPRINT-074, which builds the §13 checker.

- **TD-059** severity: minor | status: open | created: Sprint-070
  - Summary: **the worktree-base guard's must-FAIL fixtures are opt-in, so the always-on gate never
    runs them.** `evals/run-worktree-base-fixtures.sh` covers all six of the guard's named findings
    plus a PASS control, and it sits in `eval_harnesses_optin` (behind `QA_FULL=1`) rather than the
    always-on set — correctly, by `qa-check.sh`'s declared rule that cheap-and-git-free stays
    always-on while git-repo-building stays opt-in (SPRINT-043 T1 / TD-016). Costed, not assumed:
    ~1.5s for 3 repos + 2 worktrees on this host.
  - Impact: the rule is right in general and expensive here specifically. The leg this guard covers —
    a dispatched worktree silently branching from `origin/main` — went **six sprints** undetected and
    cost SPRINT-069 a merge conflict, a task forced inline, and union-verification on every merge. A
    guard for a defect with that history sitting behind a flag is the shape L-058 warns about one
    level up: not a silent false negative in the check, but a check nobody runs. Bounded by the fact
    that the guard itself is always-on in `dispatch.md` for a coordinator who follows the protocol;
    it is the *regression* cover that is flagged off.
  - Mitigation (**not yet derived**, L-091): do not reach for "just move it to always-on" — that
    trades a known 1.5s against a rule two sprints old, and the rule exists because throwaway-repo
    harnesses were measurably the slow ones. The question to price first is whether the guard can be
    given a **git-free leg** at all: cases 1–3 (`unresolved` · `missing` · `unreadable`) and the PASS
    control need no history and could be split always-on, leaving only `stale` and `divergent` behind
    the flag. That would put the cheap majority of the coverage on every run. Whether a split harness
    is worth two files is the real trade-off, and it is undecided.
  - Tracker: SPRINT-070 T2 · `evals/run-worktree-base-fixtures.sh` header · TD-054 (the defect) ·
    TD-016 (the cost boundary the rule encodes)
  - **Re-reviewed 2026-08-16 (SPRINT-073 promote, 3 sprints open) — first aging re-review; held,
    trigger unchanged.** Ledger search before any decision (L-127): `qa-check.sh`'s
    `eval_harnesses_optin` list, the harness header, and TD-016 all agree the opt-in placement is the
    **declared rule** rather than an oversight, and nothing since SPRINT-070 has re-priced that rule.
    The row's own open question — whether cases 1–3 plus the PASS control split into a git-free
    always-on leg — is still undecided and still unvehicled. SPRINT-073 is spec-annotation work and
    touches no harness, so it is not a vehicle either. Search recorded so the next reviewer does not
    repeat it.

- **TD-057** severity: minor | status: open | created: Sprint-069
  - Summary: **`Layers:` feeds three checkers that match it three different ways, and nothing states
    the contract.** The **pre-dispatch preflight** resolves directory globs — it reads T3's `docs/`
    against T1's `docs/adr/` and correctly reports `shared-file-owned-transitive`.
    **`check-layers-completeness.sh`** matches DoD/Acceptance prose by **token spelling** (TD-048's
    subject): `evals/` does not satisfy a DoD naming `run-doc-caps-fixtures.sh`, nor does
    `scripts/qa-check.sh` satisfy prose saying `qa-check.sh`. **`check-layers-observed.sh`** matches
    **actual changed paths per attributed task**: a glob never satisfies attribution for a specific
    file, and a file declared by a *sibling* task does not count.
  - Impact: SPRINT-069 T3 needed **four** `Layers:` corrections in one sprint — `AGENTS.md`,
    `scripts/qa-check.sh`, three root files caught by attribution, and one basename token — while its
    declaration was never wrong in the ordinary sense. Its globs were chosen deliberately, because a
    citation sweep's file set is re-derived at execution and a path list written at promote goes
    stale. So the author satisfies the gate that runs *before* dispatch and then discovers the other
    two contracts one FAIL at a time, mid-sprint, against a frozen Plan. Distinct from L-100
    (declarations corrected as implementation *invents* files): here the files were known, and the
    correction was forced by matcher semantics. Cost so far: four cycles in one sprint, zero bad
    artifacts — every finding was correct.
  - Mitigation (**not yet derived**, L-091): do **not** reach for "make the two checkers glob-aware"
    as the obvious fix — `check-layers-observed.sh`'s per-task attribution is deliberate (TD-035: a
    file declared by ANY task once satisfied the check for ALL tasks, which is what corrupted
    SPRINT-041's merge), and widening it back toward globs risks reintroducing exactly that. The open
    question is whether the contract should be **documented** (state the intersection all three
    accept, so an author writes to the strictest), **narrowed** (ban globs in `Layers:`, which
    collides with the re-derived-set case this row is about), or **unified** (one matcher all three
    share). Establish first which of the three consumers is the one that should move.
  - Tracker: SPRINT-069 Execution Log (the four corrections) · TD-048 (its token-spelling half) ·
    TD-035 (why per-task attribution is deliberate) · L-126
  - **Re-reviewed 2026-08-16 (SPRINT-072 promote, 3 sprints open) — first aging re-review; held, and
    the vehicle is now visible.** No new sighting this cycle: SPRINT-071 produced no `Layers:`
    correction at all, and SPRINT-070's single one was a genuine miss rather than a matcher
    disagreement. What changed is downstream — **EPIC-004's spec-driven engine has to read `Layers:`
    as a rule source**, and an engine cannot resolve a declaration whose contract is the undocumented
    *intersection* of three matchers. That makes this row a likely prerequisite of the engine sprint
    rather than an independent cleanup. Deliberately **not** pulled into SPRINT-072, which is
    inventory-and-baseline only and changes no checker architecture. **Unblock condition:** unchanged
    in substance, with a named successor — the engine sprint's G2 either consumes this contract or
    states why it does not need to.
  - **Re-reviewed 2026-08-18 (SPRINT-075 promote) — EVIDENCE OBSERVED, and the row is stronger for it.**
    SPRINT-074 produced three sightings of `Layers:` being matched differently by different readers in
    one sprint: `check-layers-completeness.sh` flagged a `Cites:`/`Layers:` contradiction (correct), then
    flagged `T1` appearing in a DoD as an undeclared **dependency** when the token named a *fixture's*
    task inside a constructed SPRINT-915 (a false positive of the same family), while
    `check-layers-observed.sh` read the same declaration against git and agreed with neither. All three
    were resolved by editing the *declaration* to suit each matcher, which is precisely the behaviour
    this row predicts. Not promoted to a vehicle here — TD-048's matcher work is still deliberately
    unscheduled and the two should be priced together, not raced.

- **TD-053** severity: minor | status: open | created: Sprint-063
  - Summary: **worktree-isolated dispatch places a full repo copy at `.claude/worktrees/<id>/`, inside
    the repo, and `find`-based checkers walk into it.** `check-ephemeral-intake.sh` excludes fixture
    trees with `grep -v '^evals/fixtures/'` — correctly position-anchored per L-108 — but the nested
    copy defeats the `^` anchor, so `.claude/worktrees/<id>/evals/fixtures/…` is not excluded. The gate
    reported a retained must-FAIL fixture as a live violation for as long as the worktree existed.
    Separately, `.claude/worktrees/` is **not in `.gitignore`**, so a plain `git add -A` would commit a
    second copy of the whole repo.
  - Impact: bounded and transient — it clears when the worktree is removed — but it fires on exactly
    the workflow `dispatch.md` prescribes for disjoint parallel tasks, so it lands on anyone following
    the documented path. The false positive is loud rather than silent, which is the better failure;
    the `.gitignore` gap is the sharper one, since a stray `git add -A` is recoverable but ugly.
  - Mitigation (**not yet derived**, L-091): do not reach for "add `.gitignore`" as the whole fix — it
    addresses the second leg only. `check-ephemeral-intake.sh` uses `find`, not `git ls-files`, so
    ignoring the path does not stop the walk. Whether the cure belongs in each `find`-based checker, in
    a shared exclusion, or in placing worktrees outside the repo entirely is a question about all of
    them at once — which is EPIC-004's engine question, so this row may be absorbed there rather than
    fixed alone.
  - Tracker: SPRINT-063 Retro · L-108 (the anchor that was right and still defeated) · EPIC-004 D1
  - **Re-reviewed 2026-08-15 (SPRINT-066 promote, 3 sprints open) — first aging re-review; held,
    vehicle absent.** Same absence as TD-054: no worktree dispatch since filing, so neither leg (the
    `find`-walk false positive, the `.gitignore` gap) has fired again. The cure question stays routed
    to EPIC-004's engine per the row's own reasoning. One adjacency noted rather than acted on:
    **TASK-208** (system-verify at merge-back, filed 2026-08-15) will touch the same merge-back
    protocol — whoever builds it reads this row first, since a full-gate pass run while a worktree
    still exists would hit exactly this false positive. **Unblock condition:** unchanged — the next
    worktree dispatch, or EPIC-004 D1 landing.
  - **Re-reviewed 2026-08-16 (SPRINT-069 promote, 3 sprints since last) — the two legs now separate,
    and only one of them is still waiting on anything.** SPRINT-068's worktree dispatch was the vehicle
    both legs were held for, and they came out of it in different states. **Leg 1 (the `find` walk) is
    untested, not clean:** no full gate run is recorded while a worktree existed, so its silence is
    absence of evidence and nothing else — read as "did not fire" it would be exactly the false-negative
    L-058 warns about. It stays routed to EPIC-004 D1 as the row's own reasoning directs. **Leg 2 (the
    `.gitignore` gap) is confirmed live and is not waiting on the engine question at all:**
    `.claude/worktrees/` is still absent from `.gitignore`, and SPRINT-068's close ran `git add -A`,
    which was safe only because the worktrees had already been removed — the mitigation text above
    rules out `.gitignore` as *the whole fix*, which is not an argument against it as the fix for the
    leg it actually covers. Split out to **TASK-213** so a one-line cure stops waiting on a question it
    does not depend on. **Unblock condition:** leg 1 only — EPIC-004 D1, or a gate run observed against
    a live worktree.
  - **Leg 2 resolved 2026-08-16 (SPRINT-069 T5) → TASK-213.** `.claude/worktrees/` is in `.gitignore`,
    verified against a real dispatched worktree rather than a `mkdir`'d stand-in: before, `git status
    --short` showed `?? .claude/worktrees/` while T4's worktree was live, meaning a plain `git add -A`
    at that moment would have staged a full second copy of the repo; after, only the `.gitignore`
    edit itself. **Leg 1 stays open.**
  - **LEG 1 FIRED LIVE, twice, 2026-08-16 — the unblock condition is met with a positive observation.**
    The full gate, run to verify T1 while T4's worktree existed, reported
    `FAIL ephemeral-intake: .claude/worktrees/agent-<id>/evals/fixtures/ephemeral-intake/committed-bug/
    docs/BUG-stale-pointer.md is a committed BUG report` — a retained must-FAIL fixture inside the
    worktree, reported as a live violation, exactly as this row predicts (the nested copy defeats
    `grep -v '^evals/fixtures/'`'s `^` anchor). **A detail the row did not anticipate: it scales with
    concurrent agents** — with two worktrees live the gate emitted two such FAILs, one per worktree,
    so a wider fan-out produces proportionally more false positives. Both cleared on worktree removal.
    Note the timing: the SPRINT-069 promote re-review had recorded leg 1 as *"untested, not clean —
    no full gate run is recorded while a worktree existed"*, and the condition was met the same day by
    ordinary work rather than a scheduled experiment. **Unblock condition:** unchanged in substance —
    the cure still belongs to EPIC-004 D1's engine question per this row's own mitigation text, which
    warns against a one-checker fix to a family-shaped defect (L-091). What is now settled is that the
    defect is real and observed, not hypothetical.
  - **Re-reviewed 2026-08-16 (SPRINT-072 promote, 3 sprints since last) — held; leg 1's unblock
    condition names this epic by name and the epic is now open.** The row's own text routes leg 1
    (the `find`-walk that descends into `.claude/worktrees/<id>/` and defeats the `^`-anchored fixture
    exclusion) to **"EPIC-004 D1, or a gate run observed against a live worktree"**. EPIC-004 is now
    the active epic, so this is no longer waiting on an absent vehicle — but SPRINT-072 is inventory
    and baseline only and touches no checker, so the wait continues one more sprint by design rather
    than by neglect. Recorded because "held" three times running otherwise reads as a stalled row when
    it is in fact a correctly-sequenced one. **Unblock condition:** unchanged — and it should be read
    by the engine sprint's G2, since a conformance engine that walks a consumer's tree inherits
    exactly this false-positive class the moment a worktree exists anywhere under it.
  - **Re-reviewed 2026-08-18 (SPRINT-075 promote) — held, trigger unfired.** SPRINT-074 dispatched no
    worktrees (both tasks ran inline, coordinator-only), so no repo copy was placed inside the repo and
    the exclusion path was never exercised. Age is not the trigger; recorded rather than skipped.

- **TD-052** severity: medium | status: open | created: Sprint-062
  - Summary: **Nothing in `evals/` exercises skill *prose*, so a governance rule that lives as
    procedure text ships without the must-FAIL fixture L-058 requires.** SPRINT-062 T2 changed the
    promote doc-aging line to read two sources (§11 retention **+** every §2 cap breach). The change
    was exercised on live failing input — the two research docs with no §11 row surfaced where the
    scan previously read clean — but that is a one-time before/after, not a retained control. Every
    existing harness targets a `scripts/lib/check-*.sh` with a parseable output contract; a checklist
    emitted by a skill has neither an entry point nor an output to assert against.
  - Impact: the exact failure T2 fixed can silently return. A future edit that re-narrows the
    doc-aging line — or an agent that reads the enumeration as the source rather than the routing hint
    it is now labelled — restores a matcher with no consumer, and nothing goes red. This is the
    silent false negative L-058 exists to prevent, in the one category the eval suite cannot reach.
    It generalises beyond this line: **every gate in lean-flow that is procedure rather than script**
    (G1, G2, the promote governance checklist, close's §11 propose→approve) is unguarded the same way.
  - Mitigation (hypothesis, re-derive before building — L-091): a prose-assertion harness that greps
    a SKILL.md for a required clause is the obvious move and is probably **wrong twice over** — it
    would be a substring standing in for a structural claim (L-108, which this very sprint broke three
    times), and it would assert that text *exists* rather than that the procedure *fires*. The honest
    question is whether a procedural gate can be fixtured at all, or whether the category needs a
    different control entirely — a review-time checklist, or accepting the gap and naming it.
  - Tracker: SPRINT-062 T2 · L-058 · L-108 · TD-012 (the fixture-retention leg, still open)
  - **Re-reviewed 2026-08-14 (SPRINT-065 promote, 3 sprints open) — first aging re-review; held, and
    the row got *more* expensive rather than staler.** SPRINT-064 hit this gap twice in one sprint:
    T3's coordinator-owned rule shipped with a traced walkthrough because skill prose has no harness to
    fixture it, and **TD-055** was filed for a second procedural contract with the same missing control
    (`complete` as a reserved run-level event, documented in a checker and not at the point of
    authoring). Two instances in one sprint is the first evidence that this category recurs rather than
    sitting quietly. **The row's own mitigation still stands unbuilt and should stay that way** — its
    text already argues a prose-grep harness would be wrong twice over (a substring standing in for a
    structural claim, asserting text *exists* rather than that a procedure *fires*), and SPRINT-064 T2
    strengthened that: the rule everyone could quote was loaded for all eleven of its sightings and
    reached none, so asserting presence proves nothing about firing. **Unblock condition, stated so the
    next pass is not another hold:** act when a *third* procedural gate is filed with no control, or
    when EPIC-004's spec-driven engine gives procedural rules a machine-readable form to assert against
    — whichever lands first. Do not build a prose-grep harness in the meantime.
  - **Sighting note 2026-08-15 (SPRINT-066 close) — the third-gate trigger did NOT fire; read the
    condition carefully before counting.** ADR-021 and ADR-022 are two more procedural gates and
    neither ships a fixture — but both **name their control at authoring time**: ADR-021 names G2's
    new checklist line as its matcher, and ADR-022 explicitly assigns its must-FAIL leg to
    TASK-208/209's build. "Filed with **no** control" is the trigger, and a control scheduled by name
    is not absent. Recorded so these two are not silently absorbed into the count. Separately,
    SPRINT-066 produced the first *mechanical* control ever applied to a procedural rule — the Spec
    axis briefed with the ruling as comparand caught stale wiring in-session (L-122) — which is a
    candidate shape for this row's eventual cure.
  - **Re-reviewed 2026-08-15 (SPRINT-068 promote, 3 sprints since last re-review) — held, and the
    candidate cure matured into a promoted rule.** SPRINT-067 added two more catches: the revise
    loop's comparand-briefed reviewers found a checker asserting an undocumented format and prose
    referencing an unasserted shape (→ L-123, this row's territory exactly). **L-122 is now promoted**
    (review-scoping.md § Scope every pass): comparand-briefed review + the revise loop is the working
    *procedural* control for prose rules — not the machine-checkable one this row ultimately wants,
    but no longer "no control at all". The third-uncontrolled-gate count stands at zero (ADR-021/022
    both named controls at authoring; L-123 now makes that mandatory). **Unblock condition:**
    unchanged — EPIC-004's spec-driven engine for the machine-checkable half; the procedural half is
    now served.
  - **Re-reviewed 2026-08-16 (SPRINT-071 promote, 3 sprints since last) — held, and SPRINT-070 added
    a fresh instance rather than evidence for a cure.** `spec/STANDARD.md` §13 shipped as a governance
    rule expressed entirely as prose — an adopter's obligation with no machine-checkable control — so
    the row's territory grew by one section in the very sprint that specified the conformance format.
    That is worth recording precisely because it looks like progress: §13 *is* checkable in principle
    (ADR-024 says Attested is checkable from git history alone), but nothing in `evals/` checks that a
    skill or spec section states the rule correctly, which is this row's actual subject. **Unblock
    condition:** unchanged — EPIC-004's engine. Deliberately not vehicled into SPRINT-071: that sprint
    removes rule *duplication* between skills and spec, which changes where a prose rule lives without
    making any of it mechanically asserted.
  - **Re-reviewed 2026-08-16 (SPRINT-073 promote, 3 sprints since last) — held, trigger unchanged.**
    Ledger search before any decision (L-127): `evals/` still contains no harness whose subject is
    skill *prose*, and the two nearest things (`run-system-verify-fixtures.sh` and `qa-check.sh`'s
    headless park-record cue checks) assert a checker's output or a grep-able cue, never a procedure's
    behaviour — so the gap is unchanged in kind, not merely unaddressed. Unblock condition unchanged:
    EPIC-004's engine. SPRINT-073 edits `spec/STANDARD.md`, not skill prose, so it neither vehicles
    this row nor widens it.

- **TD-051** severity: medium | status: open | created: Sprint-061
  - Summary: **`check-layers-observed.sh` (gate leg 15) never sees a close commit, because the close
    commit is also the archival commit.** Line 225 skips any sprint file under `*/archive/*`, and its
    comment states the precondition that makes that safe: *"A closed sprint leaves `docs/sprint/` in
    §11's retention commit, which is separate from and later than the close commit, so the close
    commit itself stays covered."* That precondition is false. `/lean-doc-generator close` performs
    §11 archival and the squash-commit as one step, and the last three closes all did — verified by
    `git show --name-status` on `afd693d` (SPRINT-060), `0b4e06a` (SPRINT-059) and this sprint's
    `2f90504`, each carrying the `R` rename into `archive/` inside the close commit itself.
  - Impact: the blind spot lands on the **largest and least task-like commit of every sprint** — the
    one touching four manifests, README, CHANGELOG, TODO, LEARNINGS, the sprint file and, when a close
    uncovers a defect, real code. SPRINT-061's close changed `scripts/lib/check-layers-observed.sh`
    and `evals/run-layers-observed-fixtures.sh`, and leg 15 reported `skip (missing)` rather than
    checking them. Found only because that change was to leg 15 itself, so its verification was being
    attempted deliberately; a close that touches code for any other reason would pass unremarked. This
    is L-105's shape (a correct rule evaluated at the wrong moment) sitting on top of L-099's (a
    precondition written where nothing enforces it) — and the skip is **silent**, so nothing in the
    gate's output distinguishes "checked and clean" from "never looked".
  - Mitigation (**not yet derived**, L-091): at least three candidates with real trade-offs, and the
    obvious one is not obviously right. (a) Split archival out of the close commit, restoring the
    stated precondition — cheapest to reason about, but it makes every close two commits and §11
    deliberately groups the sprint and its log *"as one record"*. (b) Teach the checker to resolve a
    sprint that moved into `archive/` **within the commit being checked** — most faithful, and the
    most parsing. (c) Make the skip loud rather than silent, so a close at least reports that leg 15
    did not run — smallest, fixes the invisibility without fixing the coverage. **Do not reach for (a)
    on the grounds that it restores the comment's assumption**: the assumption was written before the
    close procedure grouped these steps, so the comment may simply be out of date rather than a
    requirement. Establish first whether any close commit has ever carried an undeclared file that
    mattered — this may be a real hole that has never been fallen into.
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 3 sprints open) — first aging re-review; held, and
    SPRINT-063's close is a fresh instance rather than a hypothetical.** Close commit `3998e23` carried
    the archival rename plus four manifests, README, CHANGELOG, TODO, TECH-DEBT, LEARNINGS and two epic
    files — precisely the "largest and least task-like commit of every sprint" this row names — and leg
    15 did not check it. Two corrections to the row's framing, from evidence: **(a)** the blind spot is
    close-*specific*; a task commit that omitted a file was caught the same sprint by a different route
    (the working-tree derivation described in L-116), so leg 15 is not the only guard on that failure.
    **(b)** Nothing has yet been shown to actually slip through it — the cost so far is invisibility,
    not missed coverage. That shifts the balance among the row's three candidates toward **(c) make the
    skip loud**, which is the cheapest and addresses the demonstrated failure rather than the feared one.
    Still not derived. **Unblock condition:** one close commit carrying an undeclared file that mattered.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 3 sprints since last) — held, trigger unchanged.**
    Two more closes since (SPRINT-065 `c723b76`, SPRINT-066 `029f698`), both carrying the archival
    rename + manifests + ledgers, both invisible to leg 15, and no evidence either carried an
    undeclared file that mattered — the blind spot's cost remains invisibility, not missed coverage.
    Balance still favours candidate (c) make-the-skip-loud when the trigger fires. Adjacent note:
    SPRINT-067 T1 (TASK-208) adds a system-verify pass at merge-back, which narrows what a close
    commit could silently carry — evidence for holding, not for acting.
  - **Observation 2026-08-16 (SPRINT-068's close, recorded at SPRINT-069 promote — not a due
    re-review; this row's aging clock still runs from SPRINT-067). The trigger came closer than any
    prior instance, and on the same two files as SPRINT-061's.** Close commit `9fef02d` carried real
    code — `scripts/lib/check-layers-observed.sh` and `evals/run-layers-observed-fixtures.sh`, changed
    at close because the close itself surfaced a defect in leg 15's exclusion list — and neither file
    is named in any task's `Layers:`, because both were invented after the Plan froze. Leg 15 printed
    `skip (missing): docs/sprint/SPRINT-*.md` and did not check them, exactly as this row predicts.
    Whether that counts as "an undeclared file that **mattered**" is the judgement the unblock
    condition turns on, and the honest answer is **not quite**: the two files were covered by a fixture
    leg and a strip-the-row guard proof run before the commit, so the coverage leg 15 would have
    supplied was supplied by other means. The cost was again invisibility, not missed coverage — the
    third close in a row to say so, now with the strongest instance yet behind it. **Balance:
    candidate (c), make the skip loud, is what the evidence keeps pointing at** — a close that touches
    code should at minimum be told leg 15 did not look. Still held, still not derived, but a fourth
    instance of "invisibility only" should be read as the trigger being wrong rather than never met.

  - **Re-reviewed 2026-08-16 (SPRINT-070 promote, 3 sprints since last) — held; fifth consecutive
    "invisibility only", and one thing genuinely improved.** SPRINT-069's close commit carried **no
    code at all** — archival move, manifests, ledgers and the Retro — so leg 15's blind spot cost
    nothing this time, and the row's cost column stays at invisibility rather than missed coverage.
    Separately, the fix SPRINT-068's close shipped for its own bookkeeping (`docs/changelog/*` joining
    the close-time exclusion list) met its first real rotation here and behaved: `CHANGELOG-1.41.0.md`
    rotated out without a red leg, where every prior MINOR close went red on that file. Balance is
    unchanged and still favours candidate (c), make-the-skip-loud. **Unblock condition:** unchanged —
    one close commit carrying an undeclared file that mattered.
  - **Re-reviewed 2026-08-16 (SPRINT-073 promote, 3 sprints since last) — held, and the trigger was
    re-verified rather than assumed.** Ledger search before any decision (L-127): the row's claim is
    that a close commit *is* the archival commit, so `check-layers-observed.sh`'s `*/archive/*` skip
    hides it. **SPRINT-072's close did exactly that** — `87954f2` moved the sprint and its log into
    `docs/sprint/archive/` in the same commit that closed the sprint, making this the fourth
    consecutive close to confirm the precondition in the checker's own comment is false. Recorded as a
    fresh observation rather than a restatement. Still unvehicled: SPRINT-073 changes no checker.
- **TD-050** severity: minor | status: open | created: Sprint-060
  - Summary: **section 4 of `scripts/qa-check.sh` (knowledge metadata — index freshness, dangling refs,
    frontmatter completeness, ADR-009) is 45–49% of the entire gate on its own** — 75–76 s of a
    154–169 s run, larger than all fifteen eval harnesses combined. Measured directly, two samples,
    SPRINT-060 T3 (`docs/research/qa-gate-timing.md`). The other seventeen sections sum to ~14%.
  - Impact: this is the gate's real cost centre and it has never been examined. It is also its most
    *stable* component (<2% between samples) while the harness half swings 16%, so it is the part a
    cure would actually move. Everything previously proposed — TD-046's `QA_FULL=1` idea — was aimed at
    a third of the runtime that has now been cleared twice.
  - Mitigation (**not yet derived**, L-091): do **not** reach for the obvious narrowing. At least the
    index-freshness half is a genuine whole-corpus read and that is precisely what ADR-009 wired it for;
    cheapening it risks the L-058 family (a check that stops seeing what it was built to see). The first
    honest step is to split section 4's own cost between its three jobs — freshness vs dangling refs vs
    completeness — because "section 4 is expensive" is itself an undifferentiated blob, and treating it
    as one is the exact error L-107 describes, now at count 2 partly because of this measurement.
  - **Split measured 2026-08-10 (SPRINT-061 T3) — done, and it corrects this row twice.** Table →
    [`docs/research/qa-gate-timing.md`](docs/research/qa-gate-timing.md) § Third measurement.
    **(a) The "three jobs" above are not separable.** Freshness is one subprocess and is; but dangling
    refs and completeness are computed *together* inside the same two loops (4a over LEARNINGS ids, 4b
    over corpus files), each pass producing both verdicts from a shared `allids`. This row also omits
    the corpus/id-universe setup they both depend on. Measured by **loop** instead — the boundary the
    code actually has. **(b) There is no cost centre inside section 4 to find.** It is three comparable
    thirds: freshness ~36%, 4a ~30%, 4b ~30%, setup ~2%. Deleting the *largest* outright would buy ~19%
    of the gate — and that largest slice is the index-freshness whole-corpus read this row already
    names as the thing not to cheapen. The cheapest target and the most protected one are the same
    object. Section 4 has meanwhile grown 45–49% → **51.5%** of the run on a corpus five entries larger,
    which is it scaling as designed rather than degrading.
    **Ruling: the row stays open on its behavioural concern** (a gate slow enough to be skipped stops
    running — TD-046's residual, inherited here). What is now closed is the expectation that splitting
    further reveals a target: it does not, and any real cure is structural (cache the index digest
    between runs, or accept that whole-corpus integrity costs proportional to the corpus), never a
    narrowing of what is checked. Do not re-derive a narrowing from this row — it has been measured
    twice and the answer did not change.
  - **Re-reviewed 2026-08-14 (SPRINT-063 promote, 3 sprints open) — held, trigger unchanged.** First
    aging re-review for this row. Nothing re-derived: the two measurements above already retired the
    narrowing cure, and L-091 binds against re-deriving it from the same row. The behavioural concern
    (a gate slow enough to be skipped stops running) is what stays open, and it waits on a *structural*
    cure — an index digest cached between runs, or accepting that whole-corpus integrity costs
    proportional to the corpus. Neither is this sprint's work: SPRINT-063 is EPIC-002 subtraction, and
    shrinking the corpus is the one lever that moves this row without touching the gate at all.
  - **Re-reviewed 2026-08-15 (SPRINT-066 promote, 3 sprints since last) — held, trigger unchanged.**
    The behavioural concern has produced no evidence: the gate ran at the SPRINT-065 close (138 pass,
    ~same shape) and was not skipped under exactly the conditions the row worries about. The
    structural cure remains un-derived and nothing this sprint touches it — SPRINT-066 is two
    rulings, no corpus or gate work. **Unblock condition:** unchanged — a run demonstrably skipped
    for cost, or a structural cure (cached index digest) being derived on its own merits.
  - **Re-reviewed 2026-08-16 (SPRINT-069 promote, 3 sprints since last) — held, trigger unchanged.**
    Still no run skipped for cost: SPRINT-068 ran the gate four times across its close (twice bare,
    twice under `QA_FULL=1`) with no reluctance recorded, and one of those runs was a deliberate
    re-run to verify a revert — the opposite of the avoidance this row worries about. The structural
    cure stays un-derived and nothing in the promoted work touches it. Noted for the next re-review:
    the corpus grew again this sprint (L-124, ADR-023), so section 4's share is expected to have moved
    up rather than down — which the row already frames as scaling as designed, not degrading, and is
    **not** grounds to re-derive the narrowing L-091 binds against. **Unblock condition:** unchanged.
  - **Re-reviewed 2026-08-16 (SPRINT-072 promote, 3 sprints since last) — held, trigger unchanged, and
    one observation added rather than a re-argument.** SPRINT-071 ran the knowledge-metadata section
    twice (ADR-025 and the §9 additions each turned the index stale and each was caught by
    `gen-index.sh`), so the narrowed section is still firing on real work — which is evidence *for*
    the narrowing, not against it. Nothing this cycle demonstrably skipped a check it should have run.
    **Unblock condition:** unchanged. Noted for the reader: EPIC-004 will produce a second, consumer-
    facing reader of the same metadata, and if that engine needs checks this section narrowed away,
    that is the demonstration this row has been waiting for — it is not one yet.
  - **Re-reviewed 2026-08-18 (SPRINT-075 promote) — held, and the cost is now felt rather than measured.**
    SPRINT-074 ran the full gate **five times** across two tasks at ~3.5 min each, and its Retro logged
    the consequence in as many words: *"a five-minute feedback loop on a two-line change ... discourages
    the run-the-gate-alone discipline it exists to serve."* That is this row's cost showing up as a
    behavioural pressure on a rule the repo cares about (L-120), not merely as seconds. Still held: the
    split at SPRINT-061 showed there is **no cost centre inside section 4 to remove** — three comparable
    thirds — so there is still no cure that does not cheapen a whole-corpus read ADR-009 wired
    deliberately. See **TD-063**, filed at SPRINT-074 close against the same subsystem for a different
    defect; price the two together.

- **TD-049** severity: minor | status: open | created: Sprint-059
  - Summary: the night-run reaper (`scripts/night-run.sh`) parses the sprint file's DoD boxes and
    `### Tn` headings itself, duplicating logic `scripts/lib/check-*.sh` already owns. A third parser
    of the same format now exists (the dispatch-preflight snippet is the second — TD-045).
  - Impact: bounded, and the duplication is deliberate rather than accidental — ADR-016 names it as an
    accepted trade. The launcher is dependency-free POSIX sh a consumer reads in one sitting, and
    pointing it at `scripts/lib/` would ship a maintainer-only path into a consumer-facing reference
    (L-015). Unlike TD-045, this one has **no parity fixture**: nothing would catch the reaper's parser
    drifting from the checkers' if the sprint format changed.
  - Mitigation (**not yet derived**, L-091): the obvious move is a parity fixture like TD-045's, driving
    one sprint file through both parsers. Whether that earns its keep depends on how the format actually
    changes — the sprint schema has been stable for many sprints, so this may be a guard against a
    drift that never happens. Re-derive before building: confirm a real divergence risk first, and note
    that TD-045's parity fixture has never fired, which its own row reads as the design holding.
  - **Re-reviewed 2026-08-14 (SPRINT-063 promote, 4 sprints open) — held, trigger unchanged.** First
    aging re-review; the row has been open four sprints without one, which the scan caught and this
    line closes. The divergence risk this guards is still unrealised — the sprint schema has not moved
    since the row was filed — so the parity fixture stays unbuilt on TD-045's own evidence rather than
    on a fresh judgement. **Unblock condition, stated so the next re-review is not another hold:**
    build it the first time the sprint format actually changes, or when TD-045's fixture fires once.
    Until one of those, a re-review that reaffirms is a decision, not a skipped line.
  - **Re-reviewed 2026-08-15 (SPRINT-066 promote, 3 sprints since last) — held, and one near-trigger
    ruled out explicitly.** SPRINT-065 T1 *documented* `Cites:` in `SPRINT.md.template` — a
    definition of a field already in live use, not a schema change: every parser (the reaper, the
    preflight snippet, `check-layers-completeness.sh`) already read or deliberately ignored `Cites:`
    before the edit, so nothing any of the three parses moved. TD-045's parity fixture has still
    never fired (QA green at the v1.39.0 close). **Unblock condition:** unchanged — a real format
    change the parsers read, or the parity fixture firing once.
  - **Re-reviewed 2026-08-16 (SPRINT-069 promote, 3 sprints since last) — held, and this time the
    near-trigger was much nearer.** SPRINT-068 T3 renamed a machine-read token in the Execution Log
    format (`complete` → `run-complete`) and `scripts/night-run.sh` — this row's subject — had to be
    edited for it, as a mid-sprint scope-change, because the ruling's census named the checker, the
    fixtures and the template but not the event's **writer** (→ L-124). So a format the launcher both
    writes and reads did move, and the launcher was very nearly left behind. It is still **not** this
    row's trigger: what moved is the log's event vocabulary, not the DoD-box / `### Tn` grammar the
    duplicated parser here actually reads, and no parser diverged — the miss was caught before merge.
    But the row's standing argument has been "the sprint format has been stable for many sprints", and
    that sentence is now weaker than it was: the format moved, and what caught the omission was a
    builder's file-boundary flag, not any parity check. TD-045's fixture has still never fired.
    **Unblock condition:** unchanged in substance, sharpened in wording — a change to the **DoD/`Tn`
    grammar** the three parsers read (the log's event taxonomy is a different format and does not
    count), or TD-045's parity fixture firing once.
  - **Re-reviewed 2026-08-16 (SPRINT-072 promote, 3 sprints since last) — held, and its trigger is now
    plausibly imminent for the first time.** The row waits on **a change to the DoD/`Tn` format**,
    which has been a hypothetical for eight sprints. EPIC-004's engine must read DoD boxes and `Tn`
    blocks *structurally*, as a rule source rather than as prose — and spec §9 gained the `*Verify:*`
    clause definition at SPRINT-071, which is the first time that format has been specified anywhere
    a checker could bind to. If the engine formalises the DoD grammar, this reaper's hand-rolled parse
    is exactly the second consumer that diverges silently. **Unblock condition:** unchanged in
    substance — but the engine sprint's G2 should check this row before it defines any DoD grammar,
    rather than discovering the reaper afterwards (L-124's shape: a rename's census enumerates
    *writers* and *readers*, and the reaper is a reader nobody lists).
  - **Re-reviewed 2026-08-18 (SPRINT-075 promote) — held, trigger unfired.** No unattended run occurred
    in SPRINT-074, so the reaper parsed nothing and the parity question went unasked. Its vehicle
    (TASK-188) remains `state: blocked` by design: the trigger is opportunistic and scheduling a run to
    manufacture one is what L-111 forbids.

- **TD-048** severity: trivial | status: open | created: Sprint-058
  - Summary: `check-layers-completeness.sh` matches a `Layers:`/`Cites:` declaration against DoD prose
    **by token spelling, not by path identity**. A DoD that names a script by basename
    (``a bare `qa-check.sh` run``) is not satisfied by a declaration of `scripts/qa-check.sh`, so
    SPRINT-058 T2 had to declare the same file twice — `scripts/qa-check.sh` **and** bare
    `qa-check.sh` — on one `Cites:` line, and the same for `templates/RESEARCH.md.template` against
    its full `skills/lean-doc-generator/templates/…` path.
  - Impact: cosmetic today, and the checker's direction of error is the safe one — it over-reports,
    which costs a glance, where the miss would cost a silent false PASS (the sibling checker states
    that trade explicitly). The concern is behavioural and small: the fix a task author reaches for
    is to paste the second spelling, which trains the habit of satisfying the parser rather than
    declaring the file. A `Layers:` line carrying two spellings of one path also reads as two files
    to a human skimming the Plan, which is the surface the overlap map is drawn from.
  - Mitigation (**not yet derived**, L-091): the obvious move is basename-aware matching — treat a
    bare `x.sh` in prose as satisfied by any declared token ending `/x.sh`. **Re-derive before
    building**: that widening could mask a genuine overlap between two same-named files in different
    directories, which is precisely the case the overlap map exists to catch, and this repo has
    several (`evals/run-*-fixtures.sh` vs `scripts/lib/check-*.sh` share no basenames today, but
    nothing prevents it). Cheaper alternative worth pricing first: leave the parser alone and let the
    DoD prose carry full paths, which is better writing anyway. Do not act on one sighting (TD-031's
    pattern).
  - **Re-reviewed 2026-08-10 (SPRINT-061 promote, 3 sprints open) — held, trigger unchanged.** The
    row's own trigger is a *second* sighting; SPRINT-059 and SPRINT-060 produced none, so age is the
    only thing that has moved and the row already says age is not the trigger. Recorded here rather
    than in the sprint's § Scope Out, per the rule SPRINT-058 found failing its own next instance.
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 6 sprints open) — held, trigger unchanged.** SPRINT-063
    exercised `Layers:`/`Cites:` four times across T1 and T3, and every finding was correct — including a
    genuine catch (`docs/architecture/overview.md` · `docs/DECISIONS.md` · `DOCS_Guide.md` undeclared in
    T1's Layers). No false positive from basename matching appeared in four opportunities: weak evidence
    in the row's favour, and recorded as weak rather than dressed up. **Unblock condition:** a false
    positive that costs a real edit — not a theoretical one, and not another sprint of quiet.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 3 sprints since last) — held, and the checker banked
    another genuine catch.** SPRINT-066's promote render was caught declaring a file in `Layers:` while
    escaping it in `Cites:` — a correct finding that cost a real fix, the opposite direction from the
    false positive this row waits on. Zero FPs across SPRINT-065/066's `Layers:`/`Cites:` exercises
    (several per sprint, including two mid-task amendments). **Unblock condition:** unchanged.
  - **Three sightings in one sprint, 2026-08-16 (SPRINT-069) — all three still correct findings, and
    that is the point.** (a) At promote: a DoD spelling `qa-check.sh` bare was not satisfied by a
    `Cites:` of `scripts/qa-check.sh`. (b) At G2: same shape again on the same file. (c) At
    system-verify: a DoD naming `run-doc-caps-fixtures.sh` by basename was not satisfied by a
    `Layers:` of `evals/`. Each cost one gate cycle and a re-word; none was a false positive, so this
    row's trivial severity holds. What the cluster adds is **frequency data**: the mismatch is not
    rare, it fires whenever prose and declaration are written at different moments by different
    hands, and it is now the token-spelling half of the wider convention problem filed as **TD-057**.
    **Unblock condition:** unchanged — a genuine false positive, or TD-057's resolution subsuming it.
  - **Re-reviewed 2026-08-16 (SPRINT-071 promote, 4 sprints since last) — held, trigger still has not
    fired.** SPRINT-070 produced exactly one `Layers:` correction (`scripts/qa-check.sh` on T2), and
    checked rather than assumed: it was a **genuine miss**, not a false positive — the file really was
    edited and really was undeclared, so the checker was right and the declaration was wrong. That is
    the fourth consecutive sprint where the checker's catches were all true positives, which continues
    to argue in the row's favour rather than against it. Noted for the next reviewer so the streak is
    not mistaken for evidence of a defect: **a checker that keeps being right is not accumulating a
    case for its own removal.** **Unblock condition:** unchanged — a genuine false positive, or
    TD-057's resolution subsuming it. Longest-open aged row at 4 sprints; if TD-057 is not addressed
    by SPRINT-074's promote, re-review this one on its own merits rather than deferring to it again.
  - **Re-reviewed 2026-08-16 (SPRINT-074 promote, 3 sprints since last) — THE TRIGGER FIRED, and it
    fired as the stronger of the two conditions.** Ledger search first (L-127): TD-057 is unaddressed,
    so the previous note's instruction applies — judge this row on its own merits. Doing so, the
    unblock condition *"a genuine false positive"* is **met**, at SPRINT-073 T2. The `Cites:` line
    declared `` `scripts/lib/check-doc-caps.sh` `` and the gate still emitted *"DoD/Acceptance implies
    `check-doc-caps.sh`, absent from Layers"*, because the DoD prose used the bare basename. **The file
    was declared. The checker did not recognise the declaration.** That is not over-reporting an
    undeclared file; it is failing to match a correct one, which is the false positive four sprints of
    true-positive catches had not produced.
    **And the predicted behavioural cost landed with it.** The row warned that *"the fix a task author
    reaches for is to paste the second spelling, which trains the habit of satisfying the parser rather
    than declaring the file."* The author reached for exactly that — the `Cites:` line was rewritten to
    the bare basename to make the gate pass, and the full path (the more useful declaration for a human
    reading the Plan) was **removed**. The prediction is now observed, not hypothesised.
    **Still `severity: trivial` and deliberately not auto-escalated** — only `high` escalates, and the
    cost remains a glance plus a habit. **Not vehicled into SPRINT-074**, which pulls TASK-218 for the
    adjacent `check-layers-observed.sh` WIP path; mixing two matcher changes in one sprint would make
    either regression hard to attribute. **Its own Mitigation still binds the successor:** do not simply
    widen to basename-aware matching — that could mask a genuine overlap between two same-named files in
    different directories, which is the case the overlap map exists to catch. Price the cheaper
    alternative first (require full paths in DoD prose, which is better writing anyway).

- **TD-047** severity: minor | status: open | created: Sprint-057
  - Summary: `night-run.md` is **414 lines** and carries five Parts plus a pre-flight checklist that
    now runs to a dozen items, several of them multi-paragraph. It has no cap: DOCS_Guide §2 does not
    cover `skills/**/references/`, and ADR-006 explicitly leaves reference files uncounted so that
    depth can live outside a `SKILL.md`.
  - Impact: none mechanical — the exemption is deliberate and correct. The concern is that the
    pre-flight checklist is now the doc's centre of gravity and is read *under time pressure, the
    evening before a run*, which is the worst possible reading condition for a twelve-item list where
    four items are load-bearing and the rest are context. SPRINT-057 added two items and lengthened
    two more without removing anything. Recorded now because the trend is only visible across
    sprints, and because the failure mode is a skipped item rather than a broken one — invisible to
    every check in the repo.
  - Mitigation (**not yet derived**, L-091): the obvious move is a split, as `night-run-checks.md`
    already did once. **Re-derive before doing it**: that split is precisely what let the probe
    mechanism sit deferred and unfiled for four sprints (SPRINT-057 T1), so splitting again without a
    mechanism that fires is how the next item gets lost. A cheaper alternative worth pricing first:
    order the checklist so the four total-loss items come first and say so, leaving the rest as
    context that can be skimmed. Do not act on the line count alone — measure which items a real
    pre-flight actually skips.
  - **Re-reviewed 2026-08-10 (SPRINT-061 promote, 4 sprints open) — held, trigger unchanged.** The
    trigger is a measurement of *which pre-flight items get skipped*, and no night run has been
    launched since SPRINT-057 — SPRINT-060's run mode was ruled interactive at G2 (L-111), so the
    checklist has not been read under the conditions this row is about. Nothing to measure yet is a
    different state from measured-and-fine; the row waits on a run, not on a sprint count.
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 7 sprints open) — held, trigger unchanged.** SPRINT-063
    ruled two caps (ADR-019, ADR-020) without this file's exemption ever coming into question: it is a
    skill reference, uncounted by ADR-006, so the cap conversation those ADRs opened does not reach it.
    The concern stays navigational, not mechanical. **Unblock condition:** a reader or a run demonstrably
    failing to find a Part it needed — never line count alone, which is what ADR-006 already settled.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 3 sprints since last) — held, and the file grew
    again.** SPRINT-066 added two boundary-table rows to Part 0 and a retry-line paragraph to Part 4
    (ADR-022), and SPRINT-067 T1/T2 will add the system-verify verdict and evidence lines to Part 4 —
    all load-bearing, none skippable, which is this row's trend continuing rather than its trigger
    firing. Still no night run since SPRINT-057, so the read-under-pressure condition remains
    unmeasured. **Unblock condition:** unchanged — and the next actual night-run pre-flight should
    note which items it skims, which is one line of observation for free.

  - **Re-reviewed 2026-08-16 (SPRINT-070 promote, 3 sprints since last) — held, trigger unfired and
    unfireable so far.** The trigger is a measurement of *which pre-flight items a real run skips*, and
    no unattended run has been launched since SPRINT-057 — SPRINT-069 was attended end to end, its
    dispatch decisions taken at an interactive G2. Nothing to measure is still a different state from
    measured-and-fine, and the row waits on a run, not a sprint count. Adjacent and worth recording:
    SPRINT-069's dispatch produced TD-054's mechanism, which will change what the pre-flight checklist
    *should* say (a base-ref assertion), so acting on length before TASK-217 lands would edit a
    checklist that is about to gain an item. **Unblock condition:** unchanged — a real run, or a reader
    demonstrably skipping an item.
  - **Re-reviewed 2026-08-16 (SPRINT-073 promote, 3 sprints since last) — held, but the block is
    discharged and the row is now merely unscheduled.** Ledger search before any decision (L-127):
    this row deferred to whatever would change what the pre-flight checklist *should say*, naming a
    base-ref assertion — and **TD-054's cure shipped at SPRINT-070 T2**, with `dispatch.md` gaining
    the worktree-base guard. So the stated dependency no longer holds. It is still not vehicled, and
    SPRINT-073 (spec annotation, all HITL, no night run) is the wrong sprint for it. Recorded
    explicitly so the next reviewer starts from *"unblocked but unscheduled"* rather than re-deriving
    a block that has already lifted.
- **TD-045** severity: minor | status: open | created: Sprint-056
  - Summary: the dispatch preflight in `dispatch.md` still re-implements the `Layers:`/`Depends-on:`
    parser that `check-layers-completeness.sh` owns. SPRINT-056 T1 fixed the two drifts (TD-040,
    TD-043) and added a parity fixture, but did **not** remove the duplication.
  - Impact: bounded and deliberately so. G2 ruled against removing it — `dispatch.md` publishes the
    snippet as an *"Optional snippet, dependency-free POSIX sh, runnable verbatim"*, and pointing it
    at `scripts/lib/` would both break that published contract and ship a maintainer-only `scripts/…`
    path inside a consumer-facing reference (L-015). So the duplication is now *guarded* by
    `evals/fixtures/dispatch-preflight/parser-parity/`, which drives one input through both parsers
    and fails if either stops seeing a declaration the other still reads. Two drifts happened before
    that guard existed; a third would now be caught rather than shipped.
  - Mitigation (**not yet derived**, L-091): if a third drift appears, the thing to revisit is the
    **published contract**, not the parser — either the snippet stops claiming to be dependency-free,
    or the shared parser is vendored into the fenced block by a generator. Do not re-open this on age
    alone: the guard is the point, and a parity fixture that has never fired is evidence the design
    is holding, not evidence it is unused.
  - **Re-reviewed 2026-08-10 (SPRINT-061 promote, 5 sprints open) — held, trigger unchanged.** No
    third drift has appeared and the parity fixture has still never fired, which this row already
    reads as the design holding. Age is explicitly not the trigger here. Noted alongside: TD-049
    records the *same* duplication without a parity fixture, so if either is ever acted on it is
    that one, not this.
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 8 sprints open) — held, and SPRINT-063 T4 narrowed what
    would resolve it.** EPIC-002 **D3** ruled that the 11 checkers stand alone until EPIC-003's spec gives
    them a common rule representation; this row's duplicate parser is a member of exactly that question,
    so it now **inherits D3's unblock condition** instead of carrying its own. No third drift has appeared.
    Do not re-derive a consolidation from this row before that spec exists — that is the work D3 declined.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 3 sprints since last) — held on the inherited
    condition.** EPIC-003 has not started (still `proposed`; TASK-198 is its opening ruling), so the
    spec this row waits on does not exist yet. No third drift; the parity fixture has still never
    fired across two more sprints of preflight runs. Nothing to re-derive.

  - **Re-reviewed 2026-08-16 (SPRINT-070 promote, 3 sprints since last) — held, and the inherited
    condition advanced for the first time.** EPIC-002 D3 parked this row until EPIC-003's spec gives
    the checkers a common rule representation. EPIC-003 is now **active** and the spec exists:
    `spec/STANDARD.md` v0.1.0, extracted at SPRINT-069 T2. The condition is **not** met — what was
    extracted is the doc standard moved verbatim, and a machine-readable rule representation is
    EPIC-004's engine, still unbuilt — but "the spec does not exist" has stopped being the reason.
    Restate the condition accordingly: this row now waits on **EPIC-004's rule representation**, not on
    EPIC-003 starting. No third drift; the parity fixture has still never fired, which this row reads
    as the design holding rather than as neglect.
  - Family note: **TD-057** (filed SPRINT-069) is the same question one level out — one `Layers:` field
    read by three matchers with three different semantics. If a consolidation is ever derived, these
    two and TD-049 are one piece of work, not three. **Unblock condition:** EPIC-004's rule
    representation, or a third drift.
  - **Re-reviewed 2026-08-16 (SPRINT-073 promote, 3 sprints since last) — held, trigger unchanged.**
    Ledger search before any decision (L-127): the duplication is *guarded* by the parity fixture, and
    the G2 ruling behind it — `dispatch.md` publishes a dependency-free snippet, and pointing it at
    `scripts/lib/` would leak a maintainer-only path into a consumer-facing reference (L-015) — is
    unchanged and still correct. Neither side has moved since SPRINT-070. No vehicle in SPRINT-073.
- **TD-037** severity: minor | status: resolved → SPRINT-074 T3 | created: Sprint-049
  - Summary: attribution needs a commit to read, so **uncommitted work in progress is still tested
    against the all-task union** — the exact weakness TD-035 was filed about, surviving on the one
    path where nothing can be attributed.
  - Impact: bounded and arguably acceptable. The collision TD-035 describes happens between
    *committed* worktree branches at merge-back, and the coordinator's post-merge gate run sees
    everything committed — that path is now per-task. What stays uncovered is a single session's
    mid-flight edits, where "which task is this?" has no mechanical answer because the work has not
    been committed yet. Filed as its own row rather than left inside TD-035's resolution note, because
    that note is deleted three sprints after resolution (§11) and the residual would go with it.
  - Mitigation (not yet done): possibly none warranted — "unattributable because uncommitted" may
    simply be the honest boundary of a history-reading check. If it is ever worth closing, the lever
    is the sprint's own open-DoD state (exactly one task is usually in flight), which is a guess
    rather than a derivation and should be treated as one. **Do not narrow this by adding a rule that
    infers the current task** without evidence that a real miss occurred — that is TD-031's pattern
    starting over.
  - **Re-reviewed 2026-08-09 (SPRINT-052 promote, 3 sprints open) — deferral reaffirmed, deliberately.**
    The row's own trigger is *evidence of a real miss on the uncommitted path*, and none has appeared:
    every miss the redesign has caught since (SPRINT-050 T2's undeclared out-of-scope trail) came
    through the **committed** leg, which is the one attribution now covers. Acting now would mean
    inferring the in-flight task from open-DoD state — a guess this row already names as a guess — and
    guarding it would need its own negative test built against a failure nobody has observed. That is
    TD-031's pattern exactly: narrowing a working guard under no pressure. Held, with the trigger
    unchanged; a re-review that reaffirms is a decision, not a skipped line.
  - **Re-reviewed 2026-08-09 (SPRINT-055 promote, 6 sprints open) — deferral reaffirmed again.** The
    trigger is still unfired: no miss on the uncommitted path has been observed since. Age is not the
    trigger and was never proposed as one, so the ruling is unchanged. Recorded rather than performed
    silently, per the line above.
  - **Re-scoped 2026-08-10 (SPRINT-058 promote, 9 sprints open) — held, on a corrected basis.** Two
    things were wrong with the record, neither of them the ruling. **(a) The reaffirm above is too
    broadly worded and reads as falsified.** A miss on the uncommitted path *was* observed —
    SPRINT-055 T6 edited `TODO.md` as task work, the gate ran green while it sat uncommitted, and the
    finding surfaced attributed to a task already pushed. That miss is TD-044's, not this row's: it
    was the exclusion list holding a **close-time** reason during **execution**, an error of *phase
    keying*. This row's claim is narrower and untouched by it — that WIP is tested against the
    **all-task union** rather than per-task, because attribution needs a commit to read. Re-derived
    from the source rather than from the row (L-104): `check-layers-observed.sh` now carries the
    phase split and states in the same comment block that `is_excluded_committed` is deliberately
    untouched and that the split "guesses nothing of the kind" this row warns against. So TD-044's
    fix moved a different axis, and the union-attribution trigger remains genuinely unfired.
    **(b) SPRINT-057's promote re-reviewed and reaffirmed this row and never wrote it here** — the
    record lives only in that sprint's § Scope *Out* line. The rule directly above ("recorded rather
    than performed silently") failed its own next instance, which is L-105's shape: a rule that is
    correct and simply did not run at the moment it applied. **Ruling: held, trigger unchanged and
    now stated precisely** — evidence of a miss attributable to the *union*, not to any miss on the
    uncommitted path. Age remains not a trigger.
  - **Re-reviewed 2026-08-10 (SPRINT-061 promote, 12 sprints open) — held, trigger unchanged.** The
    precisely-stated trigger from SPRINT-058 remains unfired: no miss attributable to the *all-task
    union* has been observed in SPRINT-059 or SPRINT-060. Fourth consecutive reaffirm, recorded
    rather than performed silently. This row is now the ledger's clearest case that a re-review which
    reaffirms is a decision — worth leaving as the worked example next time age is mistaken for evidence.
  - **Re-reviewed 2026-08-14 (SPRINT-064 promote, 15 sprints open) — held, and this sprint finally gave it
    a live sighting.** SPRINT-063's uncommitted close work (`docs/changelog/CHANGELOG-1.35.0.md`) was
    reported by leg 15's path-2 union check as "changed but undeclared in any task's `Layers:`" — correct
    by the letter of the check and useless in substance, since close-time work belongs to no task by
    construction. It cleared the instant the COORD close commit landed. That is exactly the
    "unattributable because uncommitted" shape this row describes, and its cost was a moment's confusion:
    evidence **for** the row's own guess that no cure is warranted. **Unblock condition:** act only if a
    path-2 report ever masks a real per-task collision, rather than merely inconveniencing a close.
  - **Re-reviewed 2026-08-15 (SPRINT-067 promote, 18 sprints open) — held, trigger unchanged.** No
    union-attributable miss in SPRINT-065/066; both ran sequential single-owner tasks where the union
    and the task coincide, so the window this row describes barely opened. Sixth consecutive reaffirm,
    recorded rather than performed silently — still the ledger's worked example that a re-review which
    reaffirms is a decision.
  - **Re-reviewed 2026-08-16 (SPRINT-070 promote, 3 sprints since last) — THE TRIGGER FIRED. This row
    is now actionable, not deferred.** Its bar has always been *evidence of a real miss on the
    uncommitted path*, deliberately reaffirmed four times for want of one. SPRINT-069 T3 produced it:
    the sweep changed `.claude/CONTEXT.md`, `README.md` and `SECURITY.md`, all three declared by **T2**
    and none by T3. `check-layers-observed.sh` ran mid-work and reported **151 pass / 0 fail** — the
    union path accepting a sibling's declaration on T3's behalf, which is this row's defect stated
    exactly. The identical check then FAILed the moment the work had a commit to attribute, naming all
    three files against T3. Uncommitted: clean. Committed: three findings. Same tree, same checker.
  - **What the evidence does and does not license.** It does not show damage: the committed leg caught
    it minutes later, which is the boundary this row already called "arguably acceptable". What it
    changes is that the masking is now **observed rather than reasoned about**, and it was observed on
    the ordinary path — a coordinator running the gate to check its own WIP, which is how the gate is
    used between commits all day. The row's standing warning survives intact and binds the cure:
    **do not close this by inferring the in-flight task from open-DoD state.** That inference was a
    guess when the row was filed and is still a guess; one observation of masking is not evidence that
    a guess would have guessed right. Candidate directions worth pricing before any is chosen —
    report the WIP leg as a named SKIP rather than a PASS (the TD-051 candidate-(c) shape, cheapest and
    honest about what it did not check) · attribute WIP by staged-vs-unstaged rather than by task ·
    accept the boundary and document it where a coordinator reads it.
  - **Vehicle: TASK-218** (filed at the SPRINT-070 promote). **Unblock condition: met** — superseded by
    the vehicle. What remains open is which cure, not whether one is warranted.
  - **Re-reviewed 2026-08-16 (SPRINT-073 promote, 3 sprints since last) — held on a vehicle that is
    ready and unscheduled, which is a different state from waiting on evidence.** Ledger search before
    any decision (L-127): **TASK-218** is `state: ready`, P1, and already carries this row's standing
    warning against inferring the in-flight task from open-DoD state. It was **not** pulled into
    SPRINT-073: that sprint annotates `spec/STANDARD.md` and touches no checker, so including this
    would mix two unrelated themes in one frozen Plan. Recorded rather than re-parked — the next
    reviewer's question is *when to schedule it*, not *what would unblock it*.
  - **RESOLVED 2026-08-18 (SPRINT-074 T3, via TASK-218) — the cure is the named SKIP, and the
    two legs are still allowed to disagree.** Chosen from the three candidates this row itself
    listed, none pre-selected, owner-ruled at the gate. The WIP leg no longer emits a bare `PASS`:
    a tree with real uncommitted work now reports `SKIP … [WIP, unattributed]`, naming how many
    files were union-checked, that per-task attribution needs a commit, and that the committed run
    applies a stricter rule and **may FAIL where this leg does not**. The point is not to make the
    legs agree — they cannot, since one has a commit to read and one does not — but to stop them
    disagreeing *silently*, which is what SPRINT-069 T3 actually cost.
  - **What was rejected, and why it is worth keeping written down.** *Staged-vs-unstaged*
    attribution infers intent rather than deriving it, and it breaks precisely where it is needed:
    L-042 prescribes `git add -p` for a shared file, so the staged set spans tasks **by design**
    in the only case attribution matters for. *Document-the-boundary-only* leaves the output a
    bare PASS, and the output is what a coordinator reads. The row's standing warning was honoured
    in full — **nothing infers the in-flight task from open-DoD state**; the cure adds no
    inference at all, it removes an overstatement.
  - **Nothing was weakened.** A file declared by *no* task still FAILs from the WIP leg exactly as
    before. And the SKIP counts files **after** exclusions, so a tree whose only uncommitted files
    are excluded ones (an agent worktree, close-time bookkeeping) still earns a plain PASS — a
    caveat that fired on every tree would be read as furniture and stop being read at all.
  - **Guarded by a fixture that drives ONE tree through BOTH paths** (`case 7` in
    `evals/run-layers-observed-fixtures.sh`): the same edit reports the named SKIP while
    uncommitted and FAILs `T1:bar.txt` once committed, plus an explicit assertion that leg A emits
    **no** `PASS` line. Verified as a real regression guard, not decoration — run against the
    pre-change checker, all three leg-A assertions fail. Retained (TD-012).
