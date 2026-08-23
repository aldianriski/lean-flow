---
owner: Maintainer
last_updated: 2026-08-24
update_trigger: Tech debt filed (Sprint Close), aged (Sprint Promote), or resolved
status: current
---

# lean-flow — Tech Debt Ledger

> Filed automatically by the Sprint Close Retro (`TD-NNN` rows) · aged at Sprint Promote
> (unaddressed ≥ 3 sprints → re-review; `severity: high` → auto-escalate to `TODO.md` Backlog P1) ·
> resolved → `status: resolved → TASK-NNN`; **≥ 3 sprints later the row is deleted outright** (§11).
> A row may also resolve **without** a task — `status: resolved → accepted (no task)`, the cost weighed
> and knowingly kept — which runs the same deletion clock. Acceptance is a decision and carries its
> reasoning plus a **Re-file fresh if** condition in the row; a row closed with neither is a silent drop.
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

> **Aging sweep — SPRINT-078 promote (2026-08-21).** **14 of 19 open rows** are ≥3 sprints unaddressed:
> TD-065 (3) · TD-066 (3) · TD-063 (4) · TD-062 (5) · TD-061 (6) · TD-060 (7) · TD-059 (8) ·
> TD-053 (15) · TD-052 (16) · TD-051 (17) · TD-050 (18) · TD-049 (19) · TD-047 (21) · TD-045 (22).
> **All held; none is `severity: high`, so nothing auto-escalates to Backlog P1.** Not aged (5):
> TD-064 · TD-067 · TD-068 (2 each) · TD-069 · TD-070 (1 each). Reconciled: 14 + 5 = 19 open, plus the
> two closed below = 21 rows on file.
> **The standing concern the last sweep flagged was taken, not deferred a fifth time.** TD-048 and
> TD-057 — the matcher pair, priced together in SPRINT-076's § Out — are **closed as accepted** at this
> promote, each carrying its reasoning and a *Re-file fresh if* condition (see the rows). Deletion due
> at Sprint-081 under §11's three-sprint clock.
> **Correction to the previous sweep's arithmetic:** SPRINT-077's note claimed *"13 of 19"* while
> listing **14** ids. The list was right and the count was wrong — recorded here rather than silently
> repaired, since a census that miscounts its own enumeration is the failure L-108 tracks, and this one
> survived a full sprint unread.
>
> **Close-time reconciliation — SPRINT-078 close (2026-08-23).** The sweep above is a *promote-time*
> record and is left as written; the file has moved since. **TD-065 resolved** (T1 migrated §13 into
> the engine, which is what let the register's counts close), and **TD-071** (the gate's cost scaling
> with coverage) and **TD-072** (two readers for one §3 footer shape) were filed at this close. The
> ledger now holds **23 rows — 20 open, 3 not-open** (TD-048 · TD-057 accepted at promote, TD-065
> resolved this sprint). Recorded here rather than by editing the sweep, so the next promote ages
>
> **Close-time reconciliation — SPRINT-079 close (2026-08-23).** **TD-073** and **TD-074** filed (the
> sprint-family harness's cost, and `S10.FOURBUCKETS`'s deliberately weak assertion). Three existing
> rows moved rather than being duplicated: **TD-069** gains `conformance-coverage.md` at 126/130 and
> the epic at 215/200, **TD-070** gains a *sixth* §2 parser, **TD-071** gains a fifth eval harness.
> The ledger now holds **25 rows — 22 open, 3 not-open**. Nothing was resolved this sprint.
> against a census that matches the file instead of re-deriving one that does not.
>
> **Aging sweep — SPRINT-080 promote (2026-08-23).** **16 of 22 open rows** are ≥3 sprints
> unaddressed: TD-064 (4) · TD-067 (4) · TD-068 (4) · TD-066 (5) · TD-063 (6) · TD-062 (7) ·
> TD-061 (8) · TD-060 (9) · TD-059 (10) · TD-053 (17) · TD-052 (18) · TD-051 (19) · TD-050 (20) ·
> TD-049 (21) · TD-047 (23) · TD-045 (24). **All held; none is `severity: high`, so nothing
> auto-escalates to Backlog P1.** Not aged (6): TD-069 · TD-070 · TD-071 · TD-073 · TD-074 (1 each) ·
> TD-072 (2). Reconciled: 16 + 6 = 22 open, plus the three not-open = 25 rows on file.
> **Deletion clock:** TD-048 · TD-057 · TD-065 all closed at Sprint-078, so 2 sprints — due at
> **Sprint-081**, not this promote.
>
> **Aging sweep — SPRINT-081 promote (2026-08-23).** **17 of 24 open rows** are ≥3 sprints
> unaddressed: TD-045 (25) · TD-047 (24) · TD-049 (22) · TD-050 (21) · TD-051 (20) · TD-052 (19) ·
> TD-053 (18) · TD-059 (11) · TD-060 (10) · TD-061 (9) · TD-062 (8) · TD-063 (7) · TD-066 (6) ·
> TD-064 (5) · TD-067 (5) · TD-068 (5) · TD-072 (3). **All held; none is `severity: high`, so
> nothing auto-escalates to Backlog P1** — the strongest row on file is `medium` (TD-051 · TD-052 ·
> TD-061 · TD-062). Not aged (7): TD-069 · TD-070 · TD-071 · TD-074 (2 each) · TD-075 · TD-076 ·
> TD-077 (1 each). Reconciled: 17 + 7 = 24 open, plus TD-073 not-open = **25 rows on file**.
> **TD-064 is aged and is being addressed in this sprint** (TASK-257) — the first aged row in some
> time to leave by being fixed rather than by being held.
> **Deletion clock EXECUTED:** TD-048 · TD-057 · TD-065 were all closed at Sprint-078 and are three
> sprints old at this promote, so the three rows are **deleted here** (§11 · `S11.TDDELETE`) — 174
> lines. Their substance lives in `CHANGELOG.md`, the sprint archive and git, which is the whole
> reason §11 deletes rather than tombstones. **Ids stay monotonic: 048 · 057 · 065 are not reused.**
> Next clock: TD-073 (closed Sprint-080) is due at **Sprint-083**, not before.
> **New this promote: TD-077**, filed by a pre-EPIC-005 audit rather than by a sprint close — §6's
> Base tier doc-set has no way to declare a *reasoned* exemption, which is what caps this
> repository's own conformance level at `none` alongside TD-064's sixteen headers.

- **TD-077** severity: minor | status: open | created: Sprint-080
  - Summary: **§6's Base tier doc-set has no way to declare a *reasoned* exemption, so a repository
    that ruled a doc unnecessary reports an unclearable finding forever.** `S6.BASE` owes every dev
    repo `docs/product/requirements.md` and `docs/product/acceptance-criteria.md`. This repository
    ruled both **exempt with stated reasons** at SPRINT-054 T1 and recorded the ruling in
    `docs/architecture/overview.md` § *Base-tier docs this repo deliberately does not have*. The
    engine cannot read that file, so the ruling behaves exactly as if it had never been taken —
    **L-151's shape a fifth time**, and the same one ADR-028 fixed for the eleven `scope-out` rules
    by moving the disposition into the artifact the tool reads.
  - Evidence: `sh conformance.sh .` → two `tier-doc-set-incomplete` findings and
    `level: none -- Structural not yet reached. 3 finding(s) at Structural prevent it`. The other two
    Structural rules are TD-064's sixteen headers, which are writable; **these two are not clearable
    by writing anything**, because the ruling is that the docs should not exist.
  - Impact: **consumer-facing, not only ours** (L-015). §2's `CONTRIBUTING.md` / `CODE_OF_CONDUCT.md`
    exemptions work because the *standard's own* condition (team ≥ 2, or on request) never fires, and
    the engine skips them correctly. A **local** reasoned exemption has no such mechanism: any adopter
    whose requirements live in an AI-context file, a ticket tracker or a product wiki collects two
    permanent findings and a capped level with no declaration available to them. `.conformance-tier`
    was created at SPRINT-078 for precisely this class — a judged property the engine cannot infer —
    and is the standing precedent.
  - Options (a ruling, not yet a build): **(a)** extend the `.conformance-tier` declaration pattern to
    per-doc exemptions carrying a reason string, named on every report so the exemption is never
    silent (L-058); **(b)** amend §6 to make the Base rows condition-gated the way §2's team-gated
    rows already are. Both are spec changes, and **ADR-grade if either adds a declaration file or a §2
    row**. Until one is taken, this repository's own conformance level is capped by a decision it
    already made and recorded.

- **TD-076** severity: minor | status: open | created: Sprint-080
  - Summary: **Controls across the existing check families report only silence, so a control that is
    never REACHED is indistinguishable from one that correctly excluded something.** SPRINT-080
    shipped two vacuous controls and caught both only because a sibling must-FAIL went red; §12's
    four rules were then written to print their own denominator (*"N shape-match(es) examined and
    cleared on content"*), and the older families were not retrofitted.
  - Evidence: `S11.BACKLOG`'s § Backlog scoping could not be exercised by its control at all — every
    candidate line already sat inside the scoped section, so deleting the scope changed no verdict,
    and the seeded break stayed green. `S11.WHENITRUNS`'s must-FAIL *and* its control both read a
    `close_commit` written past the frontmatter `_fm_real` parses: both were reading nothing, in
    opposite directions, in the same run.
  - Impact: every `assert_absent`-style control in `run-sprint-family-fixtures.sh`,
    `run-conformance-engine-fixtures.sh` and the standalone harnesses is currently trusted on its
    silence. The failure is **green**, so nothing in a diff or a report shows it — L-058's shape one
    level in, arriving at the control rather than at the check.
  - Mitigation *(hypothesis, not a plan)*: give each rule's PASS line a denominator, as §12's four
    now do, and have `assert_absent` optionally require it to be non-zero. Cheaper alternative: a
    one-off audit that seeds a break per control and lists the ones that stay green — which is the
    measurement L-155 argues every promoted rule needs anyway.
  - **Revisit-if** a third vacuous control is found, or when L-155/L-156 reach `count: 2` at a
    promote review.

- **TD-075** severity: minor | status: open | created: Sprint-080
  - Summary: **Ten of `run-sprint-family-fixtures.sh`'s cases need no git at all, and are parked
    behind `QA_FULL=1` alongside the ones that do — so guards for rules that run on every default
    gate are quieter than the rules they guard.** Split off TD-073, which is resolved: this is the
    half of it that survived the cost fix, and TD-073's own *Re-file fresh if* clause named this row
    in advance — *"only the opt-in parking remains, and it is a different row."*
  - Evidence: TD-016's rule is *cheap-and-git-free always-on, git-repo-building opt-in*, and it is
    applied per FILE, so one git-using case in a family parks the whole file. The git-free cases here
    are the caps, the log directory, the verify clause, and the §10 promotion/aging reads — plus the
    four §11 ledger-retention cases added at SPRINT-080 T1, which read `TECH-DEBT.md`, `TODO.md` and
    `docs/LEARNINGS.md` from the tree and touch no history at all.
  - Impact: `S9.VERIFYCLAUSE` is the worked example and it is not hypothetical. It shipped with a
    defect that fired on **every** unticked Plan (SPRINT-080 T0), and its guards sat behind an opt-in
    flag while the rule itself ran on every gate. The defect surfaced from a manual baseline run at
    G2, not from the suite that existed to catch it.
  - Mitigation *(hypothesis, not a plan)*: the obvious move is a git-free sibling file, and it was
    refused at SPRINT-079 T4/T5 on the grounds that one family belongs in one file. That reason still
    holds and the refusal may still be right. **What changed is the price:** at 3m20s for 38 cases the
    whole harness may now simply be cheap enough to run always-on, which would dissolve the split
    rather than resolve it. Measure before choosing.
  - **Revisit-if** the harness is proposed for the always-on set, or a second family-with-history is
    added and inherits the same parking.

- **TD-074** severity: minor | status: open | created: Sprint-079
  - Summary: **`S10.FOURBUCKETS` asserts only that a close reached *none* of the four durable homes,
    which is the weakest claim §10's rule admits.** §10 routes each Retro bucket to a home
    (`CHANGELOG.md` · `TECH-DEBT.md` · `TODO.md` · `docs/LEARNINGS.md`), and the honest check is *every
    bucket that HAD content was routed*. That needs the Retro parsed to know which buckets had content,
    so the shipped check reports which homes the close commit touched and fails only when it touched
    none.
  - Evidence: the rule fires on a close that routed nothing at all and stays silent on a close that
    routed to one home — both proven by retained fixtures (`s10-retro-bucket-unrouted` and its
    control). A close that routed Shipped but silently dropped three filed learnings passes today.
  - Impact: low, and deliberately chosen over the alternative. Demanding all four would fail a
    correct close — a sprint that incurred no debt files no `TD-NNN` — which is the false-positive
    class §2's create-lazily rows raise, and a false positive here is a false negative about the
    contract. The weak check is right until the Retro is parseable; it is filed because *weak by
    ruling* and *weak by oversight* read identically in six months.
  - Mitigation *(hypothesis, not a plan — re-derive before building on it, L-091)*: the Retro's four
    bucket headings are fixed by the SPRINT template, so "this bucket has content" may be readable
    without natural-language parsing. If so the check strengthens from *reached none* to *reached
    every home whose bucket is non-empty*, with the empty-bucket case still silent.
  - **Re-file fresh if** the Retro's bucket structure changes shape, which would make the parse either
    trivial or impossible and settle this either way.

- **TD-073** severity: minor | status: resolved → SPRINT-080 (no task — fixed under the trip-wire D4 set) | created: Sprint-079 | closed: Sprint-080
  - Summary: **`evals/run-sprint-family-fixtures.sh` is the most expensive harness in the set (~5 min
    for 23 cases), and the cost is not the git repos — it is that every case runs the whole engine
    against the SHIPPED spec, ~15s each.** `run-attestation-fixtures.sh` takes the other side of the
    same trade, handing the engine a reduced spec to stay at ~2s. Both choices are defensible and only
    one of them is priced.
  - Evidence: measured at SPRINT-079's close, and it is what took the full gate past its previous
    ceiling — the close run printed `169 pass, 1 fail` after roughly 13 minutes with this harness
    opt-in and therefore **not even running**. Under `QA_FULL=1` it adds ~5 min on top.
  - Impact: two costs, and the second is the one that matters. (a) The gate gets slower, which is
    TD-071's subject and this feeds it. (b) TD-016's rule — *cheap-and-git-free always-on,
    git-repo-building opt-in* — is correct and puts the whole file behind `QA_FULL`, so **ten of the
    23 cases that need no git at all** (the caps, the log directory, the verify clause, the promotion
    and aging reads) are parked alongside the 13 that do. Those ten guard rules that run on every
    default gate, so the guards are quieter than the things they guard.
  - Mitigation *(hypothesis, not a plan)*: two independent moves, and they are not alternatives —
    split the family so the git-free cases rejoin the always-on set, and/or reduce the spec each case
    is run against. The split was refused at T4/T5 on the grounds that one family belongs in one file;
    that is a real reason and it may simply lose to (b) above.
  - **RESOLVED at SPRINT-080, and the summary above was wrong about the cause — kept as written,
    because being wrong is the instructive part.** Neither mitigation was needed. The shipped spec was
    never dominating: the whole runtime was the DRIVER'S OWN BOOKKEEPING. Two lines ran per rule,
    `fn="assert_$(printf '%s' "$id" | tr '.-' '__')"` and `pid=$(printf '%-20s' "$id")` — two command
    substitutions plus an external `tr`, on all 100 rules. Timed in isolation on this host against a
    tiny input, exactly as L-144 prescribes: **100 × the first = 9,176ms · 100 × the second = 1,909ms
    · a whole engine run = 10,859ms.** The bookkeeping *was* the engine. The spec reader is 150ms for
    all 100 rules, and the assertions are noise beside it.
  - **Fix:** both rewritten with parameter expansion only, no subshell and no external binary.
    Equivalence proven over all 100 ids before the swap — both transforms, zero mismatches, including
    the 21 hyphen-bearing ids that produced a silent false negative the last time this mangling
    changed. Engine output verified **byte-identical** on two repositories (116 and 144 report lines):
    a speedup that moves a verdict is a regression, not an optimisation.
  - **Measured result:** the harness runs **9m24s → 3m20s** for the same 38 cases, all green — 65%
    faster, and the trip-wire D4 set is cleared with room for T2 and T3. Per-run engine cost on a
    fixture-sized repo roughly halves; this repository's own report is ~24% faster.
  - **What did NOT get resolved, and is now its own row:** impact (b) above — the ten git-free cases
    still parked behind `QA_FULL`. This row's own *Re-file fresh if* clause called that shot: *"at
    which point only the opt-in parking remains, and it is a different row."* → **TD-075**.
    dominating — at which point only the opt-in parking remains, and it is a different row.

- **TD-064** severity: minor | status: open | created: Sprint-075 | updated: Sprint-076
  - Summary: **~~28~~ 16 of this repo's own docs fail the ownership-header rules the engine checks** —
    ~~15 carry no frontmatter at all (`docs/qa/` ×3, `docs/strategy/adlc/` ×12)~~ **3 carry none
    (`docs/qa/`)** and 13 research docs declare every field except `update_trigger:`. §3 makes the
    header mandatory on every doc and §1 LAW 3 requires the trigger, so these are real, named findings
    against the reference implementation.
  - **HALVED at SPRINT-076 T5, by ruling rather than by writing 12 headers.** The mitigation below
    named two honest options for `docs/strategy/adlc/` — add headers to docs we have deliberately
    parked, or *decide that tree is not governed by §3 and say so where §3 can be read*. The second
    was taken: spec **0.4.2** states an **exploratory-tree exception**, and the tree declares
    `governed: false` in its own README frontmatter. Findings dropped **56 → 32** (12
    `ownership-header-missing` + 12 `update-trigger-absent`), and the exemption is **named on every
    report** rather than applied silently. The exception is a **declaration, not a path** — hard-coding
    `docs/strategy/` would have exempted only repositories that chose our directory names (L-015).
  - Evidence: `sh conformance.sh .` — **3** `ownership-header-missing` (all `docs/qa/`), **13**
    `ownership-header-field-missing` (all `docs/research/`), **16** `update-trigger-absent` (the union:
    3 + 13). The three numbers reconcile against each other, which is the check that has caught every
    miscount in this corpus (L-108).
  - Impact: low today, rising, and now **smaller and sharper**. `qa-check.sh` **relays** engine
    findings rather than counting them (SPRINT-075 T2's ruling), so nothing is red and no gate is being
    ignored. What remains is not a judgement call: the 3 `docs/qa/` files and the 13 research docs are
    ordinary governed docs that simply lack fields, and **this row deliberately stays open for them**
    rather than being closed on the strength of the half that was ruled away.
  - Mitigation (hypothesis, not a plan — the filer's, written at close): ~~add the four-field header to
    the 15~~ **add it to the 3 remaining**, and `update_trigger:` to the 13. Cheap and mechanical for
    both. ~~`docs/strategy/adlc/` is the judgement call~~ **— settled at SPRINT-076 T5, see above.**
    Re-derive before building a DoD on either number.
  - Sibling, not a duplicate: **TD-065**. Both are "the conformance corpus disagrees with itself", but
    that row is a register miscount and this one is a real doc gap; a cure for either moves neither.

- **TD-067** severity: minor | status: open | created: Sprint-076
  - Summary: **`S9.GATESWELLFORMED` accepts any `G<digits>` token while its own message promises
    "want G1 / G2".** The test is `case "$gates" in *[!G0-9,]*)`, which rejects characters *outside*
    `[G0-9,]` and therefore passes `G7`, `G99` and `G0`. A sprint file carrying
    `gates_signed: G7 @ <sha>` is reported as **signed**.
  - Evidence: found by SPRINT-076 T1's fixture audit while writing the missing must-FAIL case for the
    `unrecognised gate token` branch — the first fixture used `G1,G7`, expecting rejection, and the
    check passed it. `docs/research/fixture-coverage-audit.md` § NOT guarded.
  - Impact: low in practice, and precisely the shape that makes it worth a row. Nothing generates a
    `G7`, so no live sprint is mis-reported today; but the gate exists to catch a *hand-edited or
    machine-mangled* value, which is exactly where an out-of-range gate number would appear, and the
    finding text tells a reader the check is stricter than it is. **The retained fixture now guards the
    branch that exists** (`X2`, genuinely rejected), so tightening the test will not silently pass.
  - Mitigation (hypothesis, not a plan): match the token list against the gates the standard actually
    defines rather than a character class — and re-point the fixture at `G7` once it does, since that
    is the case a reader expects the finding to be about. **Do it as its own change**: it alters what a
    conformant report says about an existing adopter's file, which is a behaviour change and not
    fixture work. Deliberately not folded into T1, whose declared Layers is the audit record.
  - Sibling: **TD-064** (real doc gaps in this repo). Unrelated cause; both are "the reference
    implementation disagrees with the standard it publishes".

- **TD-068** severity: minor | status: open | created: Sprint-076
  - Summary: **an off-vocabulary tag drops a doc out of the generated knowledge index, silently.**
    `scripts/gen-index.sh` renders a section only for names in a **fixed** vocabulary
    (`TAGS="process docs tooling edit-safety sprint-model"` ·
    `DOMAINS="skills doc-standard governance knowledge sprint-model"`). A doc whose frontmatter carries
    anything else is parsed, entered into the internal entries table, and then **rendered nowhere** —
    no warning, no exit code, nothing in the diff.
  - Evidence: SPRINT-076 T1 wrote `docs/research/fixture-coverage-audit.md` with
    `tags: [conformance, testing, governance]` · `domain: quality` — all plausible, none in the
    vocabulary. `qa-check.sh` flagged `knowledge index STALE`, regenerating produced a **one-line diff
    (`last_updated`)**, and the doc appeared in no section. Retagging `[tooling, process]` / `governance`
    made it appear three times.
  - Impact: low per occurrence, and the shape is what earns the row: **the staleness check cannot see
    it.** That check compares the file against a fresh regeneration, and a doc missing from *both* is
    consistent — so the gate is green precisely when the index is wrong. ADR-009 makes this index the
    retrieval path for ADRs, research and learnings; a doc that is absent from it is findable only by
    someone who already knows the path, which is the failure the index exists to prevent.
  - Mitigation (hypothesis, not a plan — the filer's, written at close): have `gen-index.sh` **warn on
    an unrecognised tag or domain** and exit non-zero, so an author learns at write-time rather than
    never; and publish the vocabulary where a frontmatter author will look — §7's glossary in
    `.claude/CONTEXT.md` is the natural home, since it is already the place canonical terms are fixed.
    Both halves matter: warning alone tells you *something* is wrong, publishing alone still lets a
    typo through.
  - Sibling: **TD-067** (the gate-token check being looser than its message). Unrelated cause; both are
    "a tool's report and its behaviour disagree, and the disagreement is silent".

- **TD-069** severity: minor | status: open | created: Sprint-077 | updated: Sprint-079
  - **SPRINT-079: the register half stayed fixed and a new file joined the watch.** The split held —
    `conformance-dispositions.md` is **120 / 130** after §9's and §10's rows migrated out — but its
    sibling `conformance-coverage.md` is **126 / 130** and gains a line per rule covered, so it
    breaches as the remaining 12 `build` rules land. The epic is **215 / 200**, one line further on
    from this sprint's member row, exactly as this row forecast.
  - **HALF RESOLVED at SPRINT-079's promote — the register was split, the epic was ruled deferred.**
    `conformance-dispositions.md` **230 → 128**: §§ Covered today + Artefacts moved verbatim to a new
    sibling `docs/research/conformance-coverage.md` (**124**), along the line the register's own title
    draws — it answers *what gets built and what is scoped out*, the sibling answers *what is covered
    now*. Split, not squeezed: both halves were verified byte-identical to the pristine copy with
    `cmp`, so nothing was cut to fit. This is the split SPRINT-078's close specified and deferred
    "so a closing sprint does not edit a task it did not own"; TASK-238's `touches:` now names the
    moved section. `evals/run-foreign-repo-fixtures.sh` was the one live citer and is repointed.
    **What stays open is the epic half.** `EPIC-004-conformance.md` is **214 / 200** (one more line
    from this promote's member row, exactly as this row forecast) and was ruled **deferred** rather
    than trimmed — it exits via §11 archive once § Closed-when 2 ticks, the same reasoning that
    leaves `loop-hygiene-prd.md` in place. **Re-file the register half fresh if** `conformance-coverage.md`
    breaches: it lands at 124/130 and gains roughly a line per rule covered, so §6's tree split is
    due inside two sprints. Recorded at SPRINT-079 promote (D3/D4 of that Plan).
  - Summary: **two governed docs exceed their §2 soft cap by growing the way they are meant to, and
    §2's Growth rule forbids the obvious fix.** *Cap-hit → split into a tree, never squeeze.*
    `docs/research/conformance-dispositions.md` is **230 / 130** (206 when filed) — a partition of all 62 checkable
    rules, so cutting 76 lines makes the register *incomplete*, not concise.
    `docs/epic/EPIC-004-conformance.md` is **213 / 200** (201 when filed, 212 at SPRINT-077) and gains **at least one line per member
    sprint**, so it will breach again at every promote from here. **SPRINT-077 showed the growth is not only per-sprint rows**: recording an exit-condition amendment with its prior wording (L-088's required form) added 11 lines by itself, so option (c) — moving § Member sprints to `epic/INDEX.md` — does not on its own cure this file.
  - Evidence: reported by `check-doc-caps.sh` on **every run since at least SPRINT-075**, when
    TD-059's re-review recorded the register at **163**. It has tracked coverage since — 173 at
    SPRINT-076 promote, 206 after T3's § Artefacts. Nothing consumed the report for four sprints. **Re-measured at SPRINT-077 close: register unchanged at 206 (T1's § Artefacts rewrite carried three result states in the space that held one), epic 201 → 212.**
    **That is L-106's shape verbatim** (a soft breach printed every run while the governance review
    read doc-aging clean), which is why it is a row now rather than a fifth silent sighting.
  - Impact: low today, and the reason to file it is that **the cap has stopped carrying information
    here**. A number a document has exceeded for four sprints with no decision attached trains readers
    to skip the line — so the next *genuine* breach arrives in a report they have learned to ignore.
    The honest admission from this promote: the first attempt at doc-aging **shaved lines off both
    files to get under**, which is precisely the squeeze the Growth rule prohibits, and it was
    abandoned mid-pass once the epic came back to 201 on the next member row.
  - Mitigation (hypothesis, not a plan — the filer's): **the choice is a real trade-off, so this is
    ADR-grade rather than an edit.** *(a) Split* — move the register's § Artefacts (~32 lines) and
    § Divergences (~20) into their own research docs. Cheap, still lands ~154, and separates a
    partition from its exceptions, which are most useful read together. *(b) Raise the caps by ADR* —
    the precedent this repo has already set three times for exactly this situation: **ADR-019**
    (`TODO.md` → 320), **ADR-020** (research → 130), **ADR-026** (`STANDARD.md` → no numeric cap, on
    the reasoning that the growth *is* the file doing its job). Both files here grow when the standard
    or the epic does, which is (b)'s whole argument. *(c) Split the epic's § Member sprints into
    `epic/INDEX.md`*, which already exists lazily for this purpose and would take the per-sprint line
    out of the capped file. **Decide before the next coverage sprint** — each one adds rows to both.
  - Sibling: **TD-059**, whose re-review first recorded the register's breach, but whose subject is
    the non-recursive cap glob rather than these files. Curing either moves neither.
  - **SPRINT-078 close (2026-08-23): both figures moved again, in the predicted direction.**
    `conformance-dispositions.md` **206 → 230 / 130** (the tier family's `.conformance-tier` note and
    the corrected counting recipe) and `EPIC-004-conformance.md` **212 → 213 / 200** (one member row,
    exactly the "at least one line per sprint" this row forecast). The forecast holding is itself the
    evidence: this is not a breach that a tidy-up fixes, it is a file doing its job.
  - **The register's own split is now specified but still unspent.** SPRINT-078's § Scope named it —
    move § Artefacts to its own file — and flagged the blocker: **TASK-238 cites that section**, so it
    cannot move silently. Offered at this close and **deferred by the owner** to keep a closing sprint
    from editing a task it did not own. Unchanged otherwise: *split, never squeeze* (L-131), and
    cutting 100 lines from a partition of all 62 rules makes it incomplete rather than concise.
  - Severity held at `minor`: nothing is wrong, nothing is lost, and both files are read by humans who
    are not stopped by the length. What the row is actually tracking is that **the decision keeps being
    deferrable** — five sprints now. It is worth one promote's attention before a sixth.
- **TD-071** severity: minor | status: open | created: Sprint-078 | updated: Sprint-079
  - **SPRINT-079 added a fifth eval harness** (`run-sprint-family-fixtures.sh`), and it is the most
    expensive in the set at ~5 min — see **TD-073**, which prices it and names why. It is opt-in, so
    the default gate does not pay it today; the close run still took ~13 minutes without it.
  - Summary: **`qa-check.sh`'s cost scales with the coverage EPIC-004 exists to add.** The gate reaches
    **78 engine invocation sites** across its harnesses, and **16 of them hand the engine the full
    `spec/STANDARD.md`** — dispatching all 62 rules against a fixture directory that cares about two or
    three. Every rule the epic covers therefore multiplies across those sixteen. The gate ran ~5
    minutes before this sprint and ~11.5 minutes after it (696s · 707s measured), and two runs were
    killed at a ten-minute ceiling mid-sprint.
  - Evidence: counted statically, then confirmed against wall clock. `run-conformance-engine-fixtures.sh`
    30 invocations (16 full spec, 11 reduced) · `run-ownership-header-fixtures.sh` 15 (all reduced) ·
    `run-adr-family-fixtures.sh` 13 (all reduced) · `run-attestation-fixtures.sh` 13 (all reduced since
    SPRINT-078 T1) · `run-gates-signed-fixtures.sh` 8 (all reduced) · others 9. Four harnesses already
    solve this with an awk-derived per-family reduced spec; the pattern is established and simply has
    not been applied to the largest one.
  - Impact: the direction is what makes it debt rather than a fact. A gate that gets slower in
    proportion to coverage penalises the epic's own goal, and an 11-minute pre-commit check gets routed
    around — SPRINT-078 batched two tasks into one commit to avoid one cycle and paid roughly twice
    that un-picking the result (L-150). The routing is the cost, not the runtime.
  - Mitigation (hypothesis, not a plan): reduce the ~14 family cases in
    `run-conformance-engine-fixtures.sh` to per-family specs — two of the sixteen genuinely need the
    full sweep (`rule-unimplemented-is-named` and `gap-is-labelled-gap-and-does-not-set-exit` are
    *about* it) — and consider a `QA_FAST=1` tier so the pre-commit gate is not the same cost as the
    pre-close one. Deliberately not done inside SPRINT-078: it touches cases that sprint did not write,
    and changing them while adding coverage makes "slow suite" and "changed suite" indistinguishable.
  - Sibling: **TD-066** is this engine's standing cost row and **L-144** its promoted rule (now count 3).
    Distinct subject: TD-066/L-144 are about a *single run* being slow; this is about the *number* of
    runs and the breadth each one sweeps. Fixing either moves the other, neither cures it. Related:
    **L-147** (nothing measures a new assertion's cost) · **L-150** (the routing-around).

- **TD-072** severity: trivial | status: open | created: Sprint-078
  - Summary: **The §3 ownership footer is now read two ways, and only one of them is spec-derived.**
    SPRINT-078 T3's `assert_S2_R_README` parses the required field labels out of §3's own `<sub>`
    example at runtime, so re-wording §3 moves the check with it (fixture-proven). The older sibling
    `assert_S3_AGENTS` still matches a **hard-coded** pattern,
    `^<sub>.*[Dd]oc owner:.*status:.*</sub>` — the same footer, a different and frozen idea of its
    shape.
  - Evidence: both live in `scripts/lib/conformance-engine.sh`. A second, smaller instance of the same
    family: `_att_fmv_stdin` (T1) and `_s9_gates_fmv` are the same frontmatter parse over different
    sources — a git blob versus a file path — and the near-duplicate was written deliberately rather
    than refactored, because T1's ruling (D2) made that task a *move* and a shared reader would have
    been a *change*.
  - Impact: trivial today — the two footer readers agree on the current §3 wording. The exposure is
    that they cannot disagree *loudly*: re-word §3 and `S2.R-README` follows while `S3.AGENTS`
    silently keeps checking the old shape, which is a spec/checker divergence of exactly the kind
    `S3.README`'s scope-out was arranged to prevent.
  - Mitigation (hypothesis, not a plan): give both rules one spec-derived footer reader; fold the two
    frontmatter parses into one that takes its source as an argument. Both are small and neither
    belongs on a coverage task.

- **TD-070** severity: minor | status: open | created: Sprint-077 | updated: Sprint-079
  - **SPRINT-079 T4 added the SIXTH parser** — `_s2_cap_for` in the engine, reading §2's Cap cell
    so the sprint file's 400 is not hard-coded in a checker (L-097). Adding it rather than writing
    the figure was the lesser cost, and it is recorded rather than slipped in: this row's case for a
    shared `read-spec-files.sh` is now stronger by exactly one caller.
  - Summary: **§2's file tables have FIVE independent parsers (three at filing, five since SPRINT-078), each hard-coding the same column
    offset, and nothing states the contract they share.** `scripts/lib/conformance-engine.sh`
    (`_s2_rows`, `cre = (pfx=="docs/") ? c[6] : c[5]`), `scripts/lib/check-doc-caps.sh`
    (`cap = (pfx=="docs/") ? c[5] : c[4]`) and `evals/run-s2-placement-fixtures.sh`
    (`cre = (pfx=="docs/") ? c[6] : c[5]`) each re-derive §2's rows from scratch. The offset exists
    only because the `docs/` tree carries a `Tier` column the root and `.claude/` tables do not.
  - Evidence: surfaced at SPRINT-077 **G1 recon**, not by a check — the count was verified two ways
    (`grep -ln '§2' scripts/`, then reading each parser). The engine's own comment has named the
    problem since SPRINT-076 T3 (*"this is the SECOND §2 table parser in the repo … extracting a
    shared `read-spec-files.sh` beside `read-spec-rules.sh` is the right shape"*) and deferred it as
    out of that task's Layers. It is now three, and the third is a **fixture harness that re-derives
    the required set exactly as the engine does** — so it would break identically rather than catch
    the break, with only `n_req >= 5` between it and a silent wipeout the `docs/` rows alone satisfy.
  - Impact: **the failure mode is a silent false negative in a gate, and SPRINT-077 came within one
    design choice of it.** T1's obvious implementation — giving the root/`.claude/` tables the `Tier`
    column — shifts every column by one. `check-doc-caps.sh` would then read `lean loop` as the Cap
    cell, find no integer, and **drop every root and `.claude/` row from cap checking while reporting
    PASS** (L-058). The shipped design avoided this by needing no column at all, which is luck about
    this change, not a property of the next one. Any future §2 column edit re-arms it.
  - Mitigation (hypothesis, not a plan — the filer's): extract `scripts/lib/read-spec-files.sh`
    beside the existing `read-spec-rules.sh`, emitting `always|path|legacy|cap` per row, and have all
    three call it. The precedent is already set and working: `read-spec-rules.sh` did exactly this
    for §14's rule tables. The harness is the interesting case — it re-derives *deliberately*, to
    prove the engine is not hard-coding, so it should keep an independent derivation but gain a case
    asserting the two agree on the full row set rather than on `n_req >= 5`.
  - Sibling: **TD-057** is the same *shape* one level over (`Layers:` feeding three checkers that
    match it three different ways, contract unstated) but a different subject; curing either moves
    neither. **TD-048** likewise. Related: **L-146**, the fixture that decayed to vacuous in this
    same family.
  - **Grew to FIVE at SPRINT-078 (T2).** The tier family needed §2's Tier column, which no existing
    parser emitted, so it added `_s2_tier_rows` to `scripts/lib/conformance-engine.sh` — a *fourth*
    parser, in the same file as the first — and `base_tier_set` to
    `evals/run-conformance-engine-fixtures.sh`, a *fifth*. Both re-derive the same rows with the same
    hard-coded `c[6]`-vs-`c[5]` offset this row describes.
  - The fifth one **immediately proved the row's point**, and cheaply: `base_tier_set` expanded §6's
    `deployment/{deployment,rollback}-guide` with a `sed` that split on the comma alone, yielding
    `deployment/deployment` and `rollback-guide`. That silently un-subtracted a substrate-conditional
    row and put it back in the owed set. It surfaced only because the harness's answer disagreed with
    the engine's `skipped not owed` line — two independent derivations of one table, caught by the
    disagreement rather than by review (L-108). A shared reader would have had one expansion to get
    right, and the fixture's independence — which is genuinely worth keeping, per the mitigation above
    — should be independence of the *assertion*, not of the parse.
  - Severity held at `minor` rather than escalated: nothing here is wrong today, and the extraction
    still wants its own task rather than a rider on a coverage sprint. But the count is now five and
    the growth is not slowing — each new rule family that needs a §2 column adds one.
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
  - **L-144 → promoted here (SPRINT-077 promote).** The durable rule this row now carries, beyond its
    own numbers: **when a check is slow, the dominant term is usually the number of PROCESSES it
    starts, not the work it does — so walk once and decide in one pass.** Second sighting confirmed it
    at SPRINT-076 T3/T5, where a rule running a `find` per spec row took a **four-file** directory from
    ~1s to **29s**, and the gate from ~4 minutes to over ten with two runs killed before printing a
    tally. Caching the walk fixed only half (29s → 18s) because the per-row test still spent a subshell
    plus two greps — ~124 spawns to examine four files; one `awk` pass over (rows × cached list), with
    existence tested as *membership* rather than a `stat` per row, reached 9.6s. **The diagnostic that
    mattered: time each rule family in isolation against a TINY input** (`S1` 808ms · `S3` 912ms ·
    `S4` 1,396ms · **`S2` 11,253ms** — one family held 55% of the cost). A large repo masks the
    overhead behind real work; a four-file directory does not. Placed on this row rather than in
    `CLAUDE.md` by §10's test: the only flows that can hit it are ones writing checkers in this repo,
    and they read here.
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
