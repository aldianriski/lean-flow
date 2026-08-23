---
owner: Maintainer
last_updated: 2026-08-23
update_trigger: A learning confirmed at Sprint Close, or a learning promoted to a durable rule
status: current
---

# lean-flow — Learnings Ledger

Append-only record of confirmed corrections and patterns surfaced at Sprint Close. A learning that
**recurs (count ≥ 2)** is promoted into a *durable* rule and marked below. The home is not a menu pick:
apply **DOCS_Guide §10's placement test** — ask which flows can hit the failure, then place the rule
where all of them read. Reviewed at every **Sprint Promote** before planning.

<!-- Newest first. Never edit a past entry except to bump `seen` / `count` or set `promoted`. -->

<!-- Per-entry metadata (schema, ADR-009): the heading carries `[tags: <tag>] [status: active|promoted|superseded]`;
     the body keeps `seen · count · promoted · related`. Tags: process · docs · tooling · edit-safety · sprint-model.
     The by-tag index is GENERATED corpus-wide into docs/knowledge-index.md — `sh scripts/gen-index.sh`. -->

> **By-tag index** → [`docs/knowledge-index.md`](knowledge-index.md) — generated corpus-wide by
> `scripts/gen-index.sh` (LEARNINGS + ADRs + research). This file is the LEARNINGS SSOT; the index is derived.

> **Id policy — monotonic, never reused:** a pruned/promoted entry's id retires forever; the next
> new id continues from the highest id **ever issued** (currently **L-157**), not the highest visible.
> `L-001`–`L-021` above stay valid as-is — this rule starts now, not retroactively.
> **Retired ids:** `L-022`–`L-042` pruned/promoted → durable rule in `CLAUDE.md` anti-patterns ·
> skill red-flags · sprint archive. `L-016`/`L-017` were briefly reused pre-policy — the ORIGINAL
> 016/017 content is retired; today's `L-016`/`L-017` above are the current, legitimate entries.

---
## L-157 [tags: tooling] [status: active]: **When a spec calls something a two-part test, a checker that implements one half passes every day and fails in exactly the case the second half exists for — and the half that is missing is invisible, because the half that is present works.** §11's archival row states its trigger as *"every member sprint closed **and** the epic's Closed-when conditions all `[x]`"*, and its Conformance row spells out *"a genuine **two-part** test"* in those words. `check-epic-archive.sh` read `member_sprints` **zero times** across five sprints of green gates. It was wrong in both directions at once: it **demanded** an archive §11 forbids (SPRINT-080 closed EPIC-004 while SPRINT-080 itself was an open member, and the checker immediately failed the gate), and it would have **accepted** an epic archived while a member sprint ran — which is the silent case §11 names in its own text, *"never archive on member-sprint count alone"*. **What makes this hard to see in review:** the implemented half is correct, its findings are well-worded, and its fixtures are green — five of them, all passing, none exercising the absent half. The check reads as finished because everything it does, it does properly. **The diagnostic: for any rule whose spec text contains "and", write the truth table before the code and confirm a fixture exists for each row.** Two conditions have four states and this checker could only ever distinguish two. Distinct from L-058 (a gate with no must-FAIL at all) — here the must-FAIL fixtures existed and were good; the *predicate* was half-written.
- seen: Sprint-080 (T4; found by closing an epic the checker then refused to let sit)
- count: 1
- promoted: no
- related: L-058 (the guard whose failure mode is silence) · L-105 (a guard placed in time) · ADR-014

---

## L-156 [tags: tooling] [status: active]: **A control that stays silent has not proved anything until it proves it was REACHED — "no finding" and "never examined" are the same output.** SPRINT-080 shipped two controls that passed vacuously and caught both only because a sibling must-FAIL went red. `S11.BACKLOG`'s § Backlog scoping was untestable because every candidate line already sat inside the scoped section, so deleting the scope changed no verdict. `S11.WHENITRUNS`'s must-FAIL **and** its control both read a `close_commit` that had been appended past the frontmatter the reader parses — both were reading nothing, and the control's green was indistinguishable from a correct exclusion. **The fix is a shape, not more diligence: make the passing verdict report its own denominator.** §12's four rules now print *"N shape-match(es) examined and cleared on content"*, and a control that reports **0 examined** is visibly untested rather than quietly green — which is how SPRINT-080 knew its own repository could not exercise the §12 content confirmations at all and that the lookalike fixtures were doing that work. **The general form: a negative assertion needs a positive witness.** L-142 guards the moment a break is seeded; this guards the moment a control is written, where nothing is broken and nothing looks wrong.
- seen: Sprint-080 (T2 and T3; two vacuous controls in one sprint)
- count: 1
- promoted: no
- related: L-142 (a break that does not redden its case has tested nothing) · L-146 (a retained fixture decaying into a vacuous pass) · L-058

---

## L-155 [tags: process] [status: active]: **A promoted rule quoted in the comment directly above the line that breaks it is decoration, not a guard — and this sprint broke four of them while citing three by name.** `S11.LEARNINGS`'s first draft grepped an entire heading for `[status: promoted]` and reported an entry that is `[status: active]` and merely *quotes* the string — under a comment citing **L-108**, the rule against exactly that. L-144 recurred a **fourth** time, one level below its last sighting, in the engine's own driver. L-152 fired as written when growing a finding's text disarmed two retained assertions. L-009 and L-142 each fired inside a single task. **Every one was caught by a second number disagreeing or by a case going red. Not one was caught by recalling the rule** — including the ones whose text was on screen. **L-147 already says this about cost** — *"when a promoted rule keeps recurring, the placement is not the problem — the absence of a measurement is"* — and SPRINT-080 says the same about **correctness**: placement answers *where do the people who can hit this read*, and has no answer for *what if they read it and it still does not bind*. **So a promotion is not finished when the rule is written where it will be read; it is finished when something automatic changes state if the rule is broken.** The concrete test: for each promoted rule, name the check that would go red — and if there is none, the promotion is a note.
- seen: Sprint-080 (four promoted rules broken in one sprint, three of them cited in the breaking code)
- count: 1
- promoted: no
- related: L-147 (the measurement, not the placement) · L-108 · L-144 · L-152 · L-009 · L-142 · TD-071

---

## L-154 [tags: tooling] [status: active]: **A zero-padded integer is an OCTAL literal in shell arithmetic, so `$(( 079 - 075 ))` is an error rather than a subtraction — and the failure is a silent truncation, not a message.** SPRINT-079 T5 read the sprint counter from the active Plan's frontmatter (`sprint: 079`) to age tech-debt rows. The shell aborted the whole engine with *value too great for base* on **stderr**, and stdout simply stopped after the last rule it had already printed: no error line in the report, no `coverage:` line at the end, and the four §10 rules absent entirely. **The absence is what makes it dangerous** — a report that ends early looks exactly like a report on a repository with fewer rules, and the exit code is non-zero either way because findings were already printed. **I read the missing rules as "the assertions are not registered" and went looking in the wrong file**, which is L-108's shape a second time in the same session; what actually resolved it was reading stderr rather than re-reading the code. Zero-padding is this standard's own convention (`SPRINT-079`, `TD-072`, `ADR-028`), so any adopter following it hits this the moment a checker does arithmetic on an id. **The general rule: an id is a string until you prove otherwise, and the proof is stripping the padding at the boundary where it becomes a number.** Sibling of L-120 — there the status came from the wrong reporter, here the report ends and says nothing about why.
- seen: Sprint-079 (T5; the engine exited mid-report on its own repository)
- count: 1
- promoted: no
- related: L-108 (the empty result read as a fact about the corpus) · L-120 (read the verdict the thing itself prints — here it printed nothing)

---

## L-153 [tags: process] [status: active]: **Two rules that overlap are separated by the QUESTION each answers, never by merging them or by letting both fire.** SPRINT-079 T4 built `S9.PLANFROZEN` and `S9.SCOPECHANGE` from one sentence in §9 — *the Plan stays frozen; a mid-sprint shift is logged as a scope-change entry before § Plan is edited*. The first implementation had PLANFROZEN fail on any post-freeze edit, and on its first run against this repository the pair **contradicted itself**: PLANFROZEN reported FAIL on SPRINT-079's own Plan while SCOPECHANGE reported PASS, *five § Plan edits, each with its scope-change entry already in the log at that commit*. Both amendments were correct and logged; the finding was unclearable. **The fix was not to soften one or delete the other but to name what each can actually answer:** PLANFROZEN asks *does an entry exist at all*, SCOPECHANGE asks *was it written first* — and it reads the log **as of that commit** rather than today's, because reading today's would accept a justification composed after the outcome was known. An entry added late satisfies the first and fails the second, which is precisely the case §9's *before* exists to catch. **The diagnostic that works: make both rules run on real input and look for a pair that disagrees.** Two rules from one sentence will either duplicate or contradict, and a contradiction is the cheaper of the two to notice — a duplication just quietly reports everything twice.
- seen: Sprint-079 (T4; caught on the first run against this repository, by the pair disagreeing)
- count: 1
- promoted: no
- related: L-058 (a finding per check) · L-088 (an unclearable criterion) · L-007 (exercise on real input — which is what surfaced it)

---

## L-152 [tags: tooling] [status: active]: **A change to a report's LINE SHAPE silently disarms every guard that asserts a finding's ABSENCE — the guards go green because the line stopped matching, not because the defect is gone.** SPRINT-079 T6 fixed un-attributable findings by making every verdict line name its rule. The obvious form was a **prefix**, matching the dispatch loop's own shape. Three retained fixtures assert `! grep -qE '^FAIL +ownership-header'` and siblings, and a fourth matches `^FAIL  [a-z-]+: ` — **a prefix satisfies all four unconditionally**, so the fix would have manufactured four vacuous passes while looking like an improvement. **Appending the id instead breaks no pattern, positive or negative, and keeps the finding first — the order an adopter reads.** The trap generalises past this repo: a negative assertion is coupled to the *format* of the thing it negates, not just its presence, so any reformat is a silent weakening of every `! grep` in the suite. **The check that catches it: before changing an output format, grep the test corpus for negated matches against that format and re-run each one against input that MUST produce the finding.** Doing that is what turned a plausible design into the wrong one here. L-146's shape one level out — there a fixture decayed into vacuity on its own, here a *fix elsewhere* would have pushed four into it at once.
- seen: Sprint-079 (T6; caught while scoping the change, before it was written)
- count: 1
- promoted: no
- related: L-146 (a retained fixture decayed to a vacuous pass) · L-142 (a break that does not redden its case has tested nothing) · L-058

---

## L-151 [tags: process] [status: active]: **A disposition recorded outside the artifact the tool reads is not a disposition — it reads to every consumer as an unmade decision.** SPRINT-079 T1 found eleven rules that a research register had classified `scope-out` with sound reasons, in two clean classes, for six sprints. The engine dispatches on `spec/STANDARD.md`'s Mark column, so it could not see any of it: **all eleven reported as `rule-unimplemented` on every run**, including runs against repositories that never installed the plugin — *checks the standard owes you and has not written yet*. The classification was right, the file was wrong. **The fix was to move the decision into the artifact the tool reads** (two new marks in §14), after which the same eleven report as named exclusions and the checkable denominator drops from 62 to 51. **The general shape: a decision has a reader, and recording it anywhere that reader cannot reach leaves the system behaving exactly as if the decision had never been taken.** Three instances now share it — a sign-off in a launching transcript instead of the sprint frontmatter (L-099), a collapse ruling in a commit message instead of the entry it governs (this sprint's promote re-flagged it), and a rule disposition in `docs/research/` instead of the spec. **The question that catches it at authoring time: who or what reads this decision to act on it, and can they reach where I am about to write it?**
- seen: Sprint-079 (T1; six sprints of every adopter's report naming eleven false gaps)
- count: 1
- promoted: no
- related: L-099 (a sign-off where the run cannot read it) · L-020 (shipped is not wired) · L-058 (named, never silently skipped)

---
## L-150 [tags: process] [status: active]: **An expensive verification loop does not just cost its runtime — it deforms the work around it, and the detour costs more than the check.** `qa-check.sh` reached ~11 minutes this sprint. To avoid one cycle, SPRINT-078 committed T2 and T3 as a single `sprint(078) T2+T3` commit; `check-layers-observed.sh` attributes a commit to **exactly one** task and correctly reported it as attributable to none. Un-picking that — reconstructing the post-T2 state of six files from snapshots, hand-reverting the T3 doc edits, re-deriving the register to 29+22+11=62 rather than editing it to that — cost roughly **twice** the cycle it saved, plus two further full gate runs. **The cheap path existed the entire time and went unused.** Every leg of that 11-minute gate is a standalone script: `check-layers-observed.sh` answers the exact question in **4 seconds**. The aggregate gate was treated as the only way to verify anything, so the unit of verification became the slowest thing available, and the response to a slow unit was to batch — which is what made the failure expensive rather than cheap. **Two rules follow.** Iterate against the *specific* check and run the aggregate once, at the end; and when a verification step gets slow enough that you start routing around it, treat the routing itself as the signal — the batching impulse is a measurement of the check's cost, arriving before anyone thinks to time it.
- seen: Sprint-078 (T2+T3 batched into one commit; ~11 min saved, ~25 min spent splitting it back)
- count: 1
- promoted: no
- related: L-147 (nothing measures the assertion that made the gate slow) · TD-071 (the standing row for the gate's cost) · L-120 (read the verdict the gate prints — which is what the standalone leg gives you in 4s)

---

## L-149 [tags: process] [status: active]: **A commit message's last paragraph is trailer territory, so any `Token: value` line there is a machine-readable CLAIM, not a note about the work.** SPRINT-078 T1 shipped the §13 attestation family into the conformance engine and wired its verdict lines into `qa-check.sh`'s tally. Its own commit message closed with a status line reading `Gate: 164 pass, 0 fail.` — which git parses as a **trailer**. §13a requires `Gate:`, `Gate-Signed-By:` and `Evidence:` *together*, precisely because a `Gate:` alone asserts that a gate applied and declines to say who approved it, which is weaker than saying nothing. So the commit claimed an attestation it could not support, and the very check it was shipping caught it on the next gate run: `attestation-trailers-incomplete: missing Gate-Signed-By: Evidence:`. **The catch is the evidence, not the embarrassment.** Those five rules had fixture coverage since SPRINT-074 and had never fired on this repository — `conformance.sh` could not reach them, and the gate's attestation leg had only ever seen clean commits. The first thing the migration did was fail a live commit. Had T1 migrated the assertions and skipped the gate wiring — the half most easily waved through as "just a migration" — this would have passed. **Fixed by amending rather than fixing forward**: §13 reads HEAD, so a later commit turns the gate green while leaving a false attestation in history, which is the theatre §13 exists to prevent; green-because-we-moved-past-it is not fixed. **The general shape: a repository that adds a rule about its own commit metadata has made its commit messages executable, and the habit of ending with a summary line is now a source of assertions.**
- seen: Sprint-078 (T1's own commit, caught by T1's own check on the next gate run)
- count: 1
- promoted: no
- related: L-058 (the named-finding bar this accidentally satisfied on real input) · L-103 (assert the output, not the status)

---

## L-148 [tags: sprint-model] [status: active]: **A declaration is only as good as its consumer's parser, and a declaration the parser cannot read fails GREEN — invisibly, until the first file changes.** SPRINT-078's three `Layers:` lines were promoted without backticks. `check-layers-observed.sh` reads declared tokens with `grep -oE '` + "`" + `[^` + "`" + `]+` + "`" + `'` — **backtick-quoted only** — so the union of declared tokens was **empty**, and every file the sprint touched, *including the five the Plan explicitly named*, reported as `changed but undeclared`. SPRINT-077's lines are backticked; the correct shape was one directory away in the archive. **The timing is the whole lesson.** Between promote and the first edit there is nothing to compare, so a declaration guarding zero files is indistinguishable from one guarding everything: the check passes, the sprint file looks complete, and the defect is latent by construction. It surfaced only once T1 changed eight files at once — at which point it reads as eight failures rather than one malformed line. **Two rules follow.** A field a checker consumes should be rendered at promote in the form that checker reads, not in a form a human finds equivalent; and a reader that derives an **empty** set from a non-empty source must say so as a named finding rather than returning the empty set — which is L-058 applied to a checker's own input, one level in from where `read-spec-rules.sh` already applies it to the spec.
- seen: Sprint-078 (promote; surfaced at T1's first gate run as eight false "undeclared" findings)
- count: 1
- promoted: no
- related: L-058 (a reader returning nothing checks nothing) · L-100 · L-110 (both about `Layers:` drifting in content; this one is about it being unparseable) · L-108 (matched by shape, not substring — the sibling failure, in the other direction)

---

## L-147 [tags: tooling] [status: active]: **A rule promoted into prose next to the code it governs still does not fire — because nothing MEASURES the thing it protects, so the regression is invisible until a downstream check times out.** L-144 was promoted after two sightings of the same shape (a per-row process spawn blowing up a checker's wall clock). Its rule is written as a comment *directly above* the code SPRINT-078 T2 then violated, the engine's stated cost model is *"walk once, then filter"*, and the author had read that file closely enough to extend it — and the third sighting happened anyway: resolving each §2 row's tier rank from a `while read` loop took the engine **13s → 18s** on a four-file repository, which across ~60 gate invocations pushed `qa-check.sh` from ~5 minutes to over ten and killed two runs. **What is missing is not another sentence.** L-144's own text names the diagnostic that works — *time each rule family in isolation against a tiny input* — but a diagnostic is a technique someone must think to run, and nobody runs it while adding an assertion that looks obviously cheap. There is no check that times a new assertion against the previous engine, so the cost lands with **no signal at the point of authorship** and surfaces as a timeout several tasks downstream, where it reads as "the gate got slow" rather than "T2 did this". **The general shape: when a promoted rule keeps recurring, the placement is not the problem — the absence of a measurement is.** A rule can only fire on someone who is already looking; a check fires on everyone. Placement (§10) answers *where do the people who can hit this read*; it has no answer for *what if they read it and it still does not bind*. That case needs a number, produced automatically, that changes when the rule is broken.
- seen: Sprint-078 (T2, 13s → 18s; gate past its ten-minute ceiling, two runs killed)
- count: 1
- promoted: no
- related: L-144 (the walk-once rule this failed to enforce — now count 3, promoted, and still recurring) · TD-071 (the gate's cost scaling, filed this sprint)

---

## L-146 [tags: tooling] [status: active]: **A retained must-FAIL fixture can decay into a vacuous pass without anyone touching it — when the value it hard-codes stops meaning what it meant, the seed removes nothing and the guard confirms nothing.** SPRINT-077 T1 reclassified `TODO.md` in `spec/STANDARD.md` §2 from unconditional to substrate-conditional. `evals/run-s2-placement-fixtures.sh` built a conformant repo from the spec's *derived* unconditional set, then removed a **hard-coded** `TODO.md` to prove `core-file-missing` fires. After the reclassification `build_conformant` no longer created that file, so `rm -f` deleted nothing — and the seed's own guard, `[ -e "$miss/TODO.md" ] && fail`, **passed because the file had never existed**. The case ran, asserted, and proved nothing. It surfaced only because the engine then reported no finding and the *assertion* failed loudly; had the assertion been a shape a missing file could still satisfy, this would have been a silent false-negative in a gate, which is L-058's worst case arriving by decay rather than by authoring. **L-142's promoted rule does not reach this and that is the point:** it guards the moment a break is *seeded* — parse, targeted, reddens-while-a-sibling-stays-green — and this seed was authored correctly and passed all three when written. The decay happened later, in a different file, in a commit whose author had no reason to look at a fixture harness. **Two rules follow.** First, a fixture that depends on a value the spec owns must **derive** it, never restate it — the victim here is now `printf '%s\n' "$REQ" | head -1`, so a reclassification moves the fixture with the spec instead of past it. Second, an existence guard must assert the **transition**, not the end state: `[ -f X ] || fail` *before* removing, as well as `[ -e X ] && fail` after — "it is gone" is satisfied by "it was never there", and only the pair distinguishes them. **The general shape: a guard that checks a postcondition a no-op also satisfies is not a guard**, and retained fixtures are exactly where that goes unnoticed, because nothing re-verifies them on the schedule the things they watch actually change.
- seen: Sprint-077 (T1, `run-s2-placement-fixtures.sh` seeding a file its own builder had stopped creating)
- count: 1
- promoted: no
- related: L-142 (the authoring-time sibling — this is its decay-time counterpart) · L-058 · L-137 · TD-012


## L-145 [tags: tooling] [status: active]: **A green gate whose PASS COUNT moved is a changed gate — zero failures is not the same as nothing changed.** SPRINT-076 T4's final run read `QA-CHECK: 162 pass, 0 fail` where the previous read `163 pass, 0 fail`. Both are green and both are honest; the difference is a check that stopped reporting `PASS` and started reporting something else. Diffing the two pass **lists** found it in seconds: `cap docs/epic/EPIC-004-conformance.md (190 <= 200)` had vanished, because that task's own edit took the file to 201 lines and the check had moved to `OVER-CAP (soft)` — a report line, correctly not a failure. Nothing was wrong; the point is that **nothing in the verdict said anything had changed**, and a soft-cap breach is exactly the class of finding that accumulates quietly for sprints (see L-106, where a cap check printed three soft breaches on every run while the governance review reported clean). **The count is the cheap second number a gate already gives you for free.** A run that adds coverage should raise it; a run that changes nothing should hold it; any other movement is a question. This is L-108's cross-check applied to the gate itself rather than to a query inside it, and it costs one `comm` between two saved outputs.
- seen: Sprint-076 (T4, 163→162 with 0 fail throughout; the epic crossing its 200 soft cap)
- count: 1
- promoted: no
- related: L-120 (read the verdict the gate prints, not the exit code it returns) · L-106 (a soft breach reported on every run that no review consumed) · L-108 (the disagreeing second number)

---

## L-144 [tags: tooling] [status: promoted]: **When a check is slow, the dominant term is usually the number of PROCESSES it starts, not the amount of work it does — so the fix is to walk once and decide in one pass.** SPRINT-076 T3 added a rule that ran a full `find` per spec row whose canonical path was absent. Against a **four-file** fixture directory every one of ~31 rows is absent, so a single engine run walked the tree 31 times: **29 seconds, against ~1 second before**. The gate invokes the engine ~50 times across its harnesses, so it went from ~4 minutes to over ten and two runs were killed before printing a tally. Caching the walk fixed only half of it (29s → 18s) because the per-row test still spent a subshell plus two greps — **~124 process spawns to examine four files**. Rewriting it as one `awk` pass over (rows × cached file list), with existence tested as *membership in the list* rather than a `stat` per row, took it to 9.6s. **The diagnostic that mattered was timing each rule family in isolation against a tiny input**: `S1` 808ms · `S3` 912ms · `S4` 1,396ms · **`S2` 11,253ms**. One family held 55% of the cost, and a tiny input is what makes that visible — on a large repo the real work masks the overhead. Second sighting of the identical shape (SPRINT-075's ownership family spawned ~2,800 awk processes and was fixed the same way), which is what makes it a rule rather than an anecdote.
- seen: Sprint-075 (ownership family, ~2,800 awk processes) · Sprint-076 (T3/T5, a `find` per spec row; gate stopped finishing) · Sprint-078 (T2, tier rank resolved per row in a shell loop; 13s → 18s, gate past ten minutes — the THIRD sighting, and the first AFTER promotion)
- count: 3
- promoted: yes → TECH-DEBT.md TD-066 — **and it recurred anyway (Sprint-078).** The rule is prose beside the code it governs; what is missing is a measurement, not a placement → L-147
- **§11 collapse deliberately NOT applied — ruled at SPRINT-079's promote, recorded so the next promote does not re-flag it.** §11 collapses a promoted entry to a pointer because the durable rule is the record. That holds only while the rule *works*; this one has a third sighting **after** promotion, and the body is the evidence L-147 cites for *"when a promoted rule keeps recurring, the placement is not the problem — the absence of a measurement is."* Collapsing strands that. **Re-collapse when** a measurement guards the engine's cost (TD-071's subject) — at that point the recurrence has a durable home and the body is a breadcrumb again. Note for `S11.LEARNINGS` (TASK-250): this entry is a live, real-input instance of `promoted-learning-not-collapsed` in our own tree, so G2 rules whether the check reads an exception marker or whether the reference implementation carries one named finding on purpose (L-007).
- related: TD-066 (the standing row for this engine's cost) · L-108 (measure, then act on the number) · L-147 (why a promoted rule keeps recurring: nothing measures it)

---

## L-143 [tags: process] [status: promoted]: → promoted: .claude/CLAUDE.md § Behavioral Guidelines + CONTEXT.md § Gates

---

## L-142 [tags: tooling] [status: promoted]: → promoted: .claude/CLAUDE.md § Anti-Patterns (the must-FAIL bullet)

---

## L-141 [tags: tooling] [status: active]: **A tool's own coverage gaps must not enter the verdict it renders on someone else — otherwise the report is about the tool, wearing the subject's name.** SPRINT-075 T3 ran the conformance engine against `acme-widget`, a four-file repo built from nothing. It returned **58 FAIL lines** under `level: none -- Structural not yet reached. 41 finding(s) prevent it`. The repository had **two** defects. The other 56 were `rule-unimplemented` — rules the spec states and the engine has not been taught yet — and they were being reported as FAIL, counted into the level arithmetic, and folded into the exit code. Three things follow, and each is worse than the last: the headline number was 20× the truth; the *level* was not a property of the tree at all, since it would rise when **we** shipped a checker and fall when the spec gained a rule; and the epic's headline claim — *an adopter gets a named answer* — was being satisfied by a report that was 96% our roadmap. The fix is not to hide the gaps (that is L-058's silent skip, and it was never the alternative): a gap gets its **own verdict class**, is named on every report exactly as before, and is reported on a **separate coverage axis** that says what the engine can and cannot see. The level then answers only for what was actually checked. **The general shape: when a tool reports on a subject, every line it emits is a claim about one of two things — the subject, or itself — and a report that does not separate them lets the tool's incompleteness masquerade as the subject's non-compliance.** This is not caught by review, because each individual line was true and correctly worded; it is caught by running the tool on something you know the answer for and noticing the answer is wrong. Distinct from L-058 (a guard that never fires) and L-138 (a caveat that fires too readily): here the guard fires correctly and is *attributed* to the wrong party.
- seen: Sprint-075 (T3, 56 engine gaps counted against a stranger's 2 real findings)
- count: 1
- promoted: no
- related: L-058 (why the gaps are still named, every time) · L-138 (signal-to-noise of a warning) · L-015 · L-016 (verify on the consumer path, not on our own dogfooding) · ADR-027 (whose exit-code sentence this overturned the same day)

---

## L-140 [tags: tooling] [status: active]: **An exclusion is dangerous when it matches more than its reason covers — and that failure is green, so nothing in the diff shows it.** SPRINT-075 T6 implemented §3's stated exception for the repo-root README (the front-door carries a footer line instead of a YAML header) as the glob `*/README.md`. The reason was right; the glob was wider than the reason. It excluded **every** README at any depth, silently dropping `docs/strategy/adlc/README.md` — a nested doc with no ownership header, which the rule existed to report. The fixture suite was 10-for-10 green, the report read clean, and code review shows nothing wrong: the line implements the sentence above it. What caught it was an **independent census of the same tree disagreeing by exactly one** — 14 findings from the checker against 15 from a hand-rolled count. **The tell is that an exclusion list's usual failure mode is inverted.** The entry you *forget* to exclude produces a false positive: loud, annoying, fixed within the hour. The entry that matches too broadly produces a false negative: silent, permanent, and indistinguishable from correct behaviour in every artifact a reviewer looks at. So when writing an exclusion, state its reason in words first, then ask whether the pattern can match anything the reason does not cover — and scope it to the narrowest expression of that reason (`README.md` at the root, not `*/README.md`). **Retain the over-matched case as a fixture** rather than treating it as a fixed bug; it is the only thing standing between the next refactor and the same silence.
- seen: Sprint-075 (T6, `*/README.md` swallowing a nested doc; caught by a 14-vs-15 census disagreement)
- count: 1
- promoted: no
- related: L-058 (the guard whose failure mode is silence) · L-108 (match by shape, and the cross-check that catches it) · L-137 (the seeded break that turned this into a retained case)

---

## L-139 [tags: tooling] [status: active]: **Reproducing a message verbatim is evidence about the message, never about the verdict it carries — a migration that string-compares its findings cannot see a flipped label.** SPRINT-075 T4 moved §9's `gates_signed` rules off a standalone checker into the engine. The published contract was the finding *names*, so correctness was proven the obvious way: restore the deleted checker from git, run both against all five fixture cases, `diff` per case — **IDENTICAL ×5**. It was, and the migration was still wrong. A sprint with **no `gates_signed:` field** was rendering as `PASS … NOT SIGNED (no gates_signed: field)` and reaching `level: Attested` — the precise failure §9 exists to forbid, since §9 states the rule as *"field absent ⇒ NOT SIGNED, never approval"*. Root cause sat in the driver, not the assertion: it inferred **passed** from **did not fail**, collapsing three outcomes into two, so an assertion that legitimately emits only a note was counted as a pass. All five fixtures asserted finding **text**; none asserted the verdict **label**. **The string-compare that proved the migration correct is precisely the check that cannot see what the migration broke** — it was comparing the half of the line that was right. **The rule: when a line carries both a payload and a verdict, they are two contracts, and a migration needs a case per contract.** A sixth fixture was *added, not swapped in* (`absent-is-not-labelled-a-pass`), asserting the label and the level line rather than the text. Generalises past migrations: any refactor verified by comparing output against a preserved reference inherits the reference's blind spots, so ask what the comparison *does not* cover before trusting an identical diff.
- seen: Sprint-075 (T4, five green fixtures over an unsigned sprint rendered `PASS`)
- count: 1
- promoted: no
- related: L-103 (assert on output, not on status — this is its sibling one level in: assert on *which part* of the output) · L-099 (why `gates_signed:` exists at all) · L-058 · TD-012

---

## L-138 [tags: tooling] [status: active]: **A caveat that fires on nearly every input is read as furniture — scope a warning to the cases where the weaker rule was actually applied.** SPRINT-074 T3 replaced the uncommitted-WIP leg's bare `PASS` with a named `SKIP` saying what it had *not* checked. The first version counted the raw dirty list, so any tree holding a single *excluded* uncommitted file — an agent worktree, close-time bookkeeping — collected a caveat about a weaker check that had never run on anything. Four existing exclusion fixtures went red and said so. The count now runs **after** exclusions, so the SKIP appears exactly when the union rule was actually applied to a file. The general shape: a warning's value is its *signal-to-noise*, and a warning attached to the trigger's raw population rather than to the population it actually affected trends toward always-on, at which point readers learn to skip the line — which is the same silent-pass the warning was introduced to remove, now wearing a caveat. **When adding a caveat, ask what fraction of ordinary runs will carry it; if the answer is "most", it is scoped to the wrong set.** Distinct from L-058 (a check that never fires) — this is a check that fires *too* readily and is therefore stopped being read.
- seen: Sprint-074 (T3, the WIP SKIP counting the raw dirty list before exclusions)
- count: 1
- promoted: no
- related: L-058 (the opposite failure — a guard that never fires) · L-103 (asserting on output rather than status) · TD-037 (the row this cure closed)

---

## L-137 [tags: tooling] [status: promoted]: a fixture suite that passes on its first run has not been shown to discriminate — seed the design you rejected and confirm exactly the discriminating cases fail.
- **L-137 → promoted: `.claude/CLAUDE.md` § Anti-Patterns (the spec-only/must-FAIL bullet)** — the durable rule is the record now (§11 collapse, SPRINT-076 promote). Body: git. Seen Sprint-074 · Sprint-075 (**count 2**). Placed there rather than in a skill red-flag because the failure reaches every flow that writes a fixture or a checker — `/tdd`, `/diagnose`, `/orchestrator`'s review pass and close-time harness work — and no single skill file is read by all four. The count-2 sighting added the half the first one lacked: **verify the seeded break actually landed.** Three patches whose `sed` never matched reported the suite green, and a green run behind a patch that never applied is not evidence; a timeout also left a seeded break in a shipped file, caught only by a checked hash on restore. Matcher: the seeding pass itself, which now emits `SEED-ERROR` instead of a pass when the patch is a no-op.
---

## L-136 [tags: process] [status: promoted]: a structural claim about another document is a query result too — re-open the document before freezing a Plan against what it supposedly contains.
- **L-136 → promoted: `.claude/CLAUDE.md` § Behavioral Guidelines, the cross-check clause** (§11 collapse, SPRINT-076 promote; promoted at SPRINT-075 promote as L-130's second grain). Body: git. Seen Sprint-074 (**count 1** — promoted below the count-2 bar deliberately, because it and L-130 are one failure and splitting them across two homes would reproduce the gap that let it through). The premise *"the checker reads §14's tables"* was copied through `TODO.md`, a sprint header and a DoD; §14 is the legend and holds no per-rule table. Fired again at SPRINT-075, twice, and both times the cross-check caught it: an ADR's "12 checkers" (really 11) and a "nine rules are checked" claim already written into four artifacts (really six).
---

## L-135 [tags: process] [status: active]: **A category you expected to be large that comes out empty is itself the finding — and only counting reveals it, because an uncounted expectation reads as satisfied.** SPRINT-073 T3 dispositioned every mechanically-checkable rule as `build` or `scope-out`, with `scope-out` carrying three reasons. Reason (c) — *mechanical in principle, but the check is not worth its false-positive rate* — was the one I expected to absorb the bulk: §12's content categories (contracts, financials, PII, meeting notes) all have obvious filename heuristics and equally obvious false-positive problems, and a first draft listed nine rules under it. Counted, reason (c) contains **zero** checkable rules. Every candidate was already marked **`judgment-only`** in the classification and had therefore never been in the checkable set at all — they needed no disposition, because a rule nobody can check mechanically is not uncovered work. The draft's nine would have been **double-counted as scoped-out work**, inflating the "decided" column with rules that were never open, and the error is invisible from inside: a bucket with plausible members in it looks finished whether or not those members belong. What makes this general is the asymmetry — an over-full bucket announces itself when the totals fail to reconcile, while an *expectation* that a bucket will be full is never checked against anything, so the members get written in from memory and the bucket is declared done. The rule: **when partitioning a set, count each partition against the set rather than filling it from expectation — and treat an empty partition as a result to explain, not an error to correct.** Sibling to the cross-check family, applied to set membership rather than to a query: here the disagreeing second number was `comm` of the checkable set against the union of the partitions.
- seen: Sprint-073 (T3, `scope-out` reason (c) — nine expected, zero actual)
- count: 1
- promoted: no
- related: L-134 (the same sprint's other counting failure, one level up) · L-105 · L-108 (the cross-check family) · L-133 (a census whose unit was wrong)

---

## L-134 [tags: process] [status: active]: **A derived artifact whose total cannot be reproduced from its own parts is not carrying a rounding error — the derivation is the defect, and freezing it turns the number into a denominator.** SPRINT-072 froze `conformance-baseline.md` as the artifact EPIC-004's engine would be designed against. SPRINT-073 T1's first act was the re-derivation its own DoD demanded, and the baseline did not reconcile **with itself**: § Coverage by section stated **96** rules, its `rules` column summed to **99**, and its four bucket columns summed to **98** — three figures in one table, computed mechanically rather than by eye. Tracing to the four source inventories moved the disagreement rather than settling it: one said *"Rules identified: 39"* above a list summing to 40, another wrote *"§4 5"* beside its own six-row §4 table, and reading §4 in the spec found a seventh rule none of them listed. The stated 96 was not *wrong* so much as **unreproducible** — it could be reached, but only by a path nobody had written down. What makes this worth a rule beyond ordinary arithmetic hygiene is what a frozen total becomes: 96 was simultaneously the epic's completeness test, the next task's disposition denominator, and the figure a future conformance report would quote. Every consumer inherits it, none re-derives it, and the error compounds silently at each hop — the fix was not to recount but to make the **spec** authoritative and let the derived inventory be the thing that is wrong. The rule: **before freezing an artifact others will build on, reconcile its totals against its own parts and publish the reconciliation** — a total that agrees with nothing but itself is a claim, and the moment it is frozen it stops being checkable by the people who most need it to be true. Distinct from L-130 (a figure entering a frozen artifact needs a second query at authoring time): this is the *inverse* case — the figure was measured, the measurement was internally inconsistent, and freezing is what made the inconsistency load-bearing.
- seen: Sprint-073 (T1, the baseline's 96 vs 99 vs 98 — halted the task and forced an owner ruling)
- count: 1
- promoted: no
- related: L-130 (authoring-time sibling) · L-097 (remembered vs measured) · L-088 (a criterion that went stale) · L-135

---

## L-133 [tags: process] [status: active]: **A census by line shape over a structured document is wrong in both directions at once, and the two errors hide each other.** SPRINT-072's promote counted the spec's normative surface by matching three line shapes — table rows, bold-lead statements, bold bullets — and got **156 gross candidates**, recorded as an upper bound in A1. It was not an upper bound; it was wrong twice. **Too high:** a §2 table row is not a rule, it is a *parameter set* — one row carries `File` and `Cap` (Structural/mechanical), `Create ←` and `Update ←` (Gated/judgment-only), `Reader` (data) and `Tier` (judgment), so §2's 37 rows resolve into **6 rule families**, not 37 rules. **Too low:** three line shapes were invisible to every pattern — `- [ ]` checklist items (8), numbered items (6), and fenced blocks, the sharpest being §3, whose *entire* normative content is a ```yaml schema counted by nothing, so §3 registered as "2 candidates" when both were mere exceptions to the rule the census never saw. Corrected gross census: **170**. The dangerous property is that the errors are opposite-signed: a total inflated by row-splitting and deflated by invisible shapes lands somewhere plausible, and plausibility is the only signal a single count offers. Neither error was found by re-counting the same way; each was found by *reading the section* and noticing a constraint with no candidate behind it. Distinct from L-108 (anchor a matcher by shape, not substring — about false positives from prose) and from L-130 (a figure entering a frozen artifact needs a second query): both assume the unit being counted is the right unit. The rule: **before counting instances of a thing in a structured document, state what one instance *is* and find one the pattern cannot see.** A census whose unit is a line is measuring the document's typography, not its content.
- seen: Sprint-072 (A1's 156 vs the corrected 170, and 37 rows vs 6 families — three re-derivations, three corrections)
- count: 1
- promoted: no
- related: L-130 (the figure-in-a-frozen-artifact rule this slips past) · L-108 · L-105 (the cross-check family) · L-097

---

## L-132 [tags: tooling] [status: active]: **The tidy remedy for a gate finding can resolve the *report* by leaving the checker's reach — probe any structural remedy against the checker before adopting it.** SPRINT-072's G2 predicted a soft-cap breach: four tasks all declared `docs/research/conformance-inventory.md`, and ~156 classified rules rendered as a table will not fit §2's 130-line soft cap. §6's cap-hit rule says split into a tree, so `docs/research/conformance-inventory/` is the reflex — obviously correct, sanctioned by the standard's own text. It was probed rather than assumed: a throwaway file at `docs/research/_captest/probe.md` produced **zero** rows from `check-doc-caps.sh`, because the checker expands §2's `research/<slug>.md` into a **non-recursive** glob. The remedy would have "resolved" the breach by moving the artifact somewhere the cap check cannot see, in the sprint whose entire subject is checker coverage. What makes this generalisable is that the reflex was not sloppy — it was the standard's prescribed response, applied to a checker that implements a *different* section's glob, and no rule connects the two. A remedy is judged by what the checker says about the result, never by whether it follows the prescription. The rule: when a finding is answered by moving, renaming or restructuring an artifact, **re-run the checker against the proposed shape before committing to it** — a probe costs one throwaway file, and the failure it prevents is a green gate bought by hiding, which is the silent false negative L-058 exists to prevent. Corollary: a checker that derives its file set from a spec table inherits that table's glob semantics, and nothing warns you which sections' rules those semantics honour. → **TD-061** (the `docs/research/` subdirectory hole itself).
- seen: Sprint-072 (G2, the conformance-inventory split — probed before adopting)
- count: 1
- promoted: no
- related: L-058 (the false-negative bar) · L-131 (the sibling failure — the *other* wrong answer to the same cap breach) · L-126 (one declaration, two consumers, different matching semantics)

---

## L-131 [tags: process] [status: active]: **A cap breach answered with an edit is a squeeze, and the second trim toward the limit is the tell — because each trim is individually indistinguishable from editing.** SPRINT-072 T2's artifact came out at 140 lines against a 130 soft cap. I trimmed it. Then trimmed it again. Then compressed a correct-but-verbose reconciliation into a shorter one. `spec/STANDARD.md` §2's growth rule says, in as many words, *cap-hit → split, never squeeze*, and §7 lists squeezing as a named anti-pattern — **and T2's job was classifying §7**. The rule was not merely loaded in context; it was the text on screen being read for another purpose. It fired on the third trim, and from noticing the *shape of the sequence* rather than from recalling the rule. That is the mechanism worth keeping: no individual trim is a violation, and nothing observes a sequence. Each edit passes every test an editor applies to itself — it is shorter, it is still correct, it reads better — so the guard never engages, while the cumulative effect is exactly the one the rule forbids, and the information deleted is unrecoverable in a way an over-cap file is not. The correction was to do what the standard says: split §12 out to its own top-level file (125 + 29, both PASS, zero OVER-CAP repo-wide), at the top level so the checker still sees it (L-132 is why that qualifier matters). The rule: **the moment you edit a file *for length*, stop and ask whether it splits** — and treat a second length-motivated edit on the same file as a decision already made wrongly. Distinct from an ordinary tightening pass: the tell is not that the text got shorter, it is that the *cap* is the reason.
- seen: Sprint-072 (T2, three trims before recognition — while classifying the section that names the anti-pattern)
- count: 1
- promoted: no
- related: L-132 (the other wrong answer to the same breach) · L-121 (a rule violated by the phase that owns it) · ADR-015 (a soft cap reports and cannot be grandfathered — the pressure that makes trimming feel reasonable)

---

## L-130 [tags: process] [status: promoted]: a value written into a frozen artifact is a query result — an assumption, a DoD or an acceptance threshold earns the same cross-check as a live search, once when written and again at execution.
- **L-130 → promoted: `.claude/CLAUDE.md` § Behavioral Guidelines, the cross-check clause** (§11 collapse, SPRINT-076 promote; promoted at SPRINT-075 promote). Body: git. Seen Sprint-071 · Sprint-074 (**count 2**). Both grains are named in the durable rule: a **figure** (`~121` sites frozen into an assumption where the real count was 39, making the DoD unsatisfiable the moment it froze) and a **structural claim about another document** (L-136's grain). The clause exists because *authoring* feels like planning rather than querying, so the guard does not fire on its own.
---

## L-129 [tags: docs] [status: active]: **A cross-reference is an assertion about content you do not own, and it reads as correct until someone opens the target.** SPRINT-070 added `spec/STANDARD.md` §13 and, describing how the attestation trailer relates to the existing sprint-level record, wrote that `gates_signed:` lives "in the sprint file — **§9**". §9's frontmatter list read `status · plan_commit · close_commit`. The field was never defined there, or anywhere else in the spec — both of its occurrences were inside §13 itself, one of them being the dangling pointer. It survived authoring, review, a green gate and a full sprint, and was found only when SPRINT-071 T3 audited the spec **as a reader with no `skills/` access**: every other reading path finds `gates_signed:` documented in `lean-doc-generator/SKILL.md` or `night-run.md` and never notices the spec is silent. The mechanism is that a reference is written from the *source* side, where the author knows what they mean, and its correctness lives entirely on the *target* side, which nobody opens because the reference reads fluently. This is L-020's shape (shipping a capability without wiring it) applied to prose, and L-057's (the report is not the artifact) applied to a pointer: the citation is not the content. The rule: **when you write a reference to a section, file or field, open the target and confirm it contains what the reference claims — at the moment you write it, not at review.** A `see §N` is a claim, and an unverified claim about your own document is the one nobody thinks to doubt. → **TD-060** (nothing mechanically checks that a spec-internal cross-reference resolves).
- seen: Sprint-071 (§13 → §9 for `gates_signed:`, dangling one full sprint through a green gate)
- count: 1
- promoted: no
- related: L-020 (shipped-not-wired) · L-057 (the report is not the artifact) · L-016 (verify on the consumer path) · TD-060

---

## L-128 [tags: tooling] [status: active]: **A subagent worktree that finishes without changes is deleted with its branch the moment it returns — anything you want to know about it must be captured from inside it, while it lives.** SPRINT-070 T2's DoD required a real dispatched worktree with its base recorded, and the plan was the obvious one: spawn the agent, read its report, then run the new worktree-base guard against the worktree. By the time the report arrived there was nothing to point the guard at — `git worktree list` showed only the main checkout and the agent's branch ref no longer resolved. Clean worktrees are swept automatically on return, branch included. The perverse part is the selection effect: a **read-only measurement agent leaves no changes by construction**, so the very dispatches you run *in order to observe something* are the ones guaranteed to be gone before you can observe it, while a messy build survives long enough to inspect. The task was rescued only because the brief happened to ask the agent to run `git rev-parse HEAD` itself. The rule: put the measurement in the agent's brief and run any post-hoc check while the agent is still live; never plan to inspect a worktree after its report. This is L-057's family (the report is not the artifact) with the sign flipped — here the artifact is destroyed by design, so the report is the only thing that ever existed, and treating it as second-best evidence loses the observation entirely. Encoded in `dispatch.md` § Worktree dispatch protocol.
- seen: Sprint-070 (T2's DoD-2 demonstration; worktree and branch both gone at report time)
- count: 1
- promoted: no
- related: L-057 (the report is not the artifact — this is its inverse) · TD-054 (the defect being demonstrated) · L-043 (worktree state-op safety)

---

## L-127 [tags: process] [status: active]: **An aging re-review that only re-asks its question will re-park it forever — search the repo's own answered record before parking anything for want of evidence.** TD-054 was filed at SPRINT-063 asking *why* a dispatched worktree branched from a stale sha, and forbade writing the guard until the cause was understood (L-091). It was re-reviewed three times across six sprints, and each review restated the question, noted the vehicle was absent, and re-parked it. The answer was in the repository the entire time, in two places: **L-046** (SPRINT-026, `status: active`) states the mechanism verbatim — agent worktrees fork from the remote default branch unless `worktree.baseRef` is `"head"` — and `dispatch.md`'s own base-ref caveat repeats it, **inside the very file the eventual fix was promoted to edit**. Six sprints of a "held, mechanism unknown" row, one `grep baseRef` from closure. The cost was not the delay: SPRINT-069 paid a merge conflict, a task forced inline, and union-verification on every merge, all attributed to an unknown cause that was documented 37 sprints earlier. L-094 already says to name the *class of fact* that would close a deferred question; it does not say to check whether that fact is already written down, and a question whose class is "a documented behaviour" is closed by **reading**, not by waiting. The rule: an aging re-review's first action is a search of the ledger and the docs the row itself cites — a row may only be re-parked after that search comes back empty, and the search is recorded in the re-review so the next reviewer does not repeat it. Distinct from a retrieval failure mid-task: here the rule was never loaded because nobody looked, rather than loaded and not fired.
- seen: Sprint-070 (TD-054 closed by reading L-046; three prior re-reviews re-asked instead)
- count: 1
- promoted: no
- related: L-094 (name the class of fact — this is its missing second half) · L-091 (no guard before the cause) · L-046 (the answer that was already there) · L-021 (the same mechanism's stale-copy sibling)

---

## L-126 [tags: tooling] [status: active]: **One declaration, two consumers, different matching semantics — it passes the gate that runs first and fails the ones that run last.** SPRINT-069 T3 declared directory-glob `Layers:` (`docs/` · `skills/` · `evals/` · `scripts/lib/`) deliberately, because a citation sweep's file set is re-derived at execution and a path list written at promote goes stale. The **pre-dispatch preflight** reads those globs correctly and computed a sound ownership map from them — it resolves `docs/` against `docs/adr/` and reports `shared-file-owned-transitive`. The **two Layers checkers** match by explicit path or token identity and cannot: `evals/` does not satisfy a DoD naming `run-doc-caps-fixtures.sh`, and a glob never satisfies attribution for a specific changed file. So the same declaration is valid to the gate that runs *before* dispatch and invalid to the two that run *after* it, and nothing on either side says so. The tell is a task needing repeated `Layers:` corrections while its declaration was never wrong in the ordinary sense — four on T3 in one sprint, each one a checker discovering a different unlisted path. Distinct from L-100 (a `Layers:` is a live declaration, expected to be corrected as implementation invents files): here the *files were known*, and the correction was forced by a matcher's semantics rather than by discovery. The rule: when one field feeds more than one checker, the field's contract is the **intersection** of what all of them accept — and if that intersection is undocumented, the author discovers it one FAIL at a time. → **TD-057**.
- seen: Sprint-069 (×4 on one task: `AGENTS.md` · `scripts/qa-check.sh` · three root files by attribution · a basename token)
- count: 1
- promoted: no
- related: L-100 (the discovery case this is NOT) · TD-048 (its token-spelling half) · L-108 (match by shape, not substring)

---

## L-125 [tags: edit-safety] [status: active]: **A self-describing corpus is unsafe to edit by token — some of its sentences are assertions about the past that stay true only if left alone.** SPRINT-069 T3 swept 86 sites renaming the standard's pre-extraction document name, with the sweepable set correctly filtered for everything the repo *freezes* by rule (append-only ADRs, past LEARNINGS entries, `superseded` research, TD rows, the frozen Plan and its Log). Two files still came out false. `docs/research/platform-readiness-audit.md` is `status: current` and freely editable, and its F3 finding *records the pre-move state* — the sweep turned it into `skills/lean-doc-generator/references/STANDARD.md — 450 lines`, a path that has never existed at any point in this repo's history. `docs/research/logs/qa-gate-timing.md` is append-only by its §2 row, a class the filter simply missed. **Neither was caught by the reconciliation**, which was green before and after and would have stayed green: totals reconcile whether a replacement is true or false. Reading the diff caught them. The rule: a sweep's exclusion filter needs a **"describes history"** axis alongside its "frozen by rule" axis — a live, editable, currently-correct document can still contain sentences whose truth depends on the old token, and those are invisible to any count. L-108 says a *matcher* over a self-describing corpus must be anchored by shape because the corpus contains prose about its own formats; this is the same property one level up, applied to *editing*: the corpus also contains prose about its own history. Every mechanical rewrite over a documentation corpus is therefore reviewed by diff, never by totals.
- seen: Sprint-069 (×2 within the sprint — a live audit's historical finding, an append-only measurement log)
- count: 1
- promoted: no
- related: L-108 (the matcher-side sibling) · L-009 (re-read the structure after a structure-adjacent edit) · L-118 (a reconciling count proves coverage, never correctness)

---

## L-124 [tags: process] [status: active]: **A contract rename's census enumerates producers, not only asserters and docs.** TD-055's ruling scoped the `complete` → `run-complete` rename to the checker, its fixtures, and the template — the shape's *asserter* and its *documentation* — and the event's live **writer** (`scripts/night-run.sh:120`, ADR-016's launcher wrapper) sat outside all three. The ruling, the builder's in-boundary pass, and the coordinator's pre-dispatch grep (which covered `skills/` and the procedure docs, never `scripts/`) all missed it; the builder's boundary-respecting *flag* caught it, and merging without the fix would have left the rollup gate silently dark on every real completed run — the L-058 false-negative wearing a rename. Same sprint, same shape at smaller scale: the sprint's own Execution Log, instantiated from the template *before* the rename landed, carried the pre-rename taxonomy until review caught it. The rule: renaming a machine-read token starts from a repo-wide census of **who writes it, who reads it, who documents it, and what was instantiated from any of those** — L-123 names birth ("shape and checker born together"); this is its rename corollary, and the missing party is usually the writer.
- seen: Sprint-068 (×2 within the sprint — the live writer and the instantiated-from-template log)
- count: 1
- promoted: no
- related: L-123 (birth-time sibling) · L-108 (anchor the census greps to the delimited field) · L-058 (what the miss would have cost)

---

## L-123 [tags: process] [status: active]: **A machine-asserted shape and its checker are born together, or not at all.** SPRINT-067's two revise firings were mirror images of one defect. T1 shipped a checker asserting `^owner-ruling:` against a format **no procedure documented** — an undocumented assertion, a false-positive trap on correct behaviour the day the checker is wired in. T2 shipped prose referencing a "per-criterion analogue" shape **no checker asserts** — an unasserted definition, a contract with no control (TD-052's trap). One rule covers both directions: when text defines a grep-able shape, the same change names the checker that asserts it; when a checker asserts a shape, the same change names the procedure that documents it. Either half alone is a defect, and both halves were caught by the revise loop's comparand-briefed reviewers before commit.
- seen: Sprint-067 (×2 within the sprint — one per direction, one per task)
- count: 1
- promoted: no
- related: L-058 (the named-finding bar) · TD-052 (procedural gates without controls) · L-122 (how both were caught)

---

## L-122 [tags: process] [status: promoted]: brief every dispatched pass with the governing decision as logged — the ruling text is the Spec comparand when one exists.
- **L-122 → promoted: review-scoping.md § Scope every pass** — the durable rule is the record now (§11 collapse, SPRINT-068 promote). Body: git; seen Sprint-066 + Sprint-067 (count 2 — both sightings were dispatched builders drifting from rulings they *carried*, caught only by comparand-briefed reviewers). Matcher: the revise loop — a drift from the quoted ruling is a concrete violation it feeds back.

---

## L-121 [tags: sprint-model] [status: active]: **A DoD box that performs a later phase's work is untickable by construction — and two mutually exclusive branches written as two boxes double-count in every tally.** SPRINT-065 T2's box 3 ("if all four conditions end `[x]`: epic archived → `docs/epic/archive/`") delegated close-phase work to a task: §11 archives an epic only when **every member sprint has closed**, and the sprint running T2 was itself a member — so no execution of the task, however correct, could ever tick the box. Box 4 was its else-branch, so exactly one of the pair could ever fire while `/prime` and the DoD tally counted both as open work. Surfaced as a `scope-change`, owner-ruled: re-word box 3 to "delegated to `/lean-doc-generator close`", record box 4 antecedent-false, tick both. The promote-time tell: does any box's tick depend on an event that happens **after this sprint's own work**? If yes, it belongs to that event's phase (close · the epic · the next sprint), not in the Plan — and a branch pair belongs as one box with the branch stated, never two.
- seen: Sprint-065
- count: 1
- promoted: no
- related: L-105 (a guard placed in time, not only in text) · L-088 (rule the stale premise, never absorb it) · DOCS_Guide §11 (the member-sprint rule the box contradicted)

---

## L-120 [tags: tooling] [status: promoted]: one command per call — when a check gates an action they are two tool calls, because a single call makes the check advisory by construction.
- **L-120 → promoted: `.claude/CLAUDE.md` § Anti-Patterns edit-safety (c)** — the durable rule is the record now (§11 collapse, SPRINT-073 close). Body: git. Seen Sprint-064 + Sprint-073 (**count 2**). Both sightings were a gate and a commit in one shell line, and the second is the instructive one: (c) *already* contained the sentence "a gate piped into a formatter returns the formatter status", loaded and correct, and it did not fire — because writing a pipeline feels like formatting output, not like gating an action. The promotion therefore adds the **action** form (two calls, read the exit code) rather than restating the caution. Matcher: the gate itself — a commit made on a red gate is a concrete violation the next run surfaces. **Sprint-074 (×3) — a new reporter channel, not a new rule:** a *background-task completion notification* reported `exit code 0` for a run whose artifact read `QA-CHECK: 154 pass, 1 fail / QA_EXIT=1`, twice in one sprint. The status belonged to the wrapper (`cmd > log; echo EXIT=$? >> log`), whose final `echo` always succeeds. The promoted rule held — every verdict this sprint was read from the output file — so this is recorded as coverage of a fourth channel (pipeline · redirect · commit · **harness notification**) rather than a fresh entry.
- **Fifth sighting, SPRINT-075 T4 — and this time the promoted rule did NOT hold.** The four earlier sightings were a pipeline, a redirect-and-echo wrapper twice, and a commit; in every one the verdict was still read from the artifact. Here it was not: `sh scripts/qa-check.sh > /tmp/qa.out 2>&1; echo "EXIT=$?"` was run, the harness reported **exit code 0** — `echo`'s status, since it is the last command in the chain — and **T4 was committed on it**. The file said `158 pass, 1 fail`, and a later run said `156 pass, 3 fail`, both sitting unread the whole time. The promoted rule names the shape as `gate | tail && commit` and prescribes two tool calls; the shape here was a **redirect**, which reads as "capturing output" rather than "gating an action", so the rule was loaded, correct, and did not reach the moment — the same way its own second sighting did not. **The durable form is therefore not about calls at all, it is about what you read:** the gate produces a summary line (`QA-CHECK: N pass, M fail`) and **M is the verdict**; any exit code arriving through a wrapper is evidence about the wrapper. Re-promoted with that wording in `CLAUDE.md` § Anti-Patterns edit-safety (c). Fifth channel: pipeline · redirect · commit · harness notification · **redirect-plus-echo run interactively**. seen Sprint-064 · Sprint-073 · Sprint-074 · Sprint-075, count 5.
---

## L-119 [tags: process] [status: active]: **A guard can be correctly worded, correctly placed, and structurally unreachable — check what its qualifier is *derived from*, not whether it reads well.** `dispatch.md` already carried the rule SPRINT-064 T3 was promoted to write: *"[a worktree agent] never touches a file the overlap map marks shared — those stay coordinator-owned."* Correct sentence, right file, right audience. It had never fired for the Execution Log, and could not: the overlap map is **derived from each task's `Layers:`**, and sprint infrastructure is written by every task and declared by none, so the map cannot mark it *by construction*. The qualifier "what the map marks shared" silently scoped the protection to files that could be enumerated, while the class needing protection was defined by *not* being enumerable. Reviewing the sentence finds nothing wrong, because nothing is wrong with the sentence. The tell is a rule whose condition is computed from a source that structurally excludes the case — so when writing or reviewing a guard, ask **what populates its condition**, and whether the thing being guarded can ever appear in that population. Distinct from L-099 (a rule written where its reader cannot read it: here the reader read it fine) and from L-105 (a rule evaluated at the wrong moment: here the moment was right). The fix was to split the qualifier into what the map marks *and* a named class it cannot — the same correction L-108's placement needed one level up, which is why both landed in one sprint.
- seen: Sprint-064
- count: 1
- promoted: no
- related: L-099 (a rule its reader cannot read) · L-105 (correct rule, wrong moment) · L-108 (matched by shape, not substring) · L-113 (an enumeration that omits the triggering flow)

---

## L-118 [tags: tooling] [status: active]: **A negative control proves a query fires on the rows it *reaches* — never that it reached them all.** SPRINT-064 T1 audited `docs/LEARNINGS.md` for promoted entries missing their pointer bullet. The query returned zero, and it had been *controlled*: seeding a broken pointer into a scratch copy produced `DETECTED: L-108`, so the query demonstrably fired. It was still wrong. Its inner `while((getline nl)>0)` consumed the next `## L-` header while walking an entry's bullets, so the outer pattern never matched it — the scan examined **20 of 31** entries and, by chance, all twenty were clean. The control passed for the same reason the audit failed: L-108 happened to be one of the twenty reached. **A control establishes sensitivity, not coverage**, and those are different properties — a truncated input set defeats the second while leaving the first intact. What caught it was an *inverse* query whose result had to reconcile: 20 with-pointer + 0 without ≠ 31 total. So the sufficient check is a second query over the same population whose answer must sum, not a seeded positive. Sibling of L-058 (a gate exercised on input that must FAIL) at the next level of rigour: L-058 asks whether the check can fail at all; this asks whether it ran on everything it claimed to.
- seen: Sprint-064
- count: 1
- promoted: no
- related: L-058 (exercise a gate on input that must FAIL) · L-108 (matched by shape, not substring) · L-113 (a broken scan caught only by contradiction) · L-116 (a checker reading state the commit does not contain)

---

## L-117 [tags: docs] [status: active]: **Content that reads as duplication may be carrying a machine-checked contract — find what reads a block before deleting it.** SPRINT-063 T1 ran a diet pass on `CLAUDE.md` and correctly identified `## File Structure` as a hand-maintained codemap duplicating `docs/architecture/overview.md`, which `CONTEXT.md` § Orientation forbids by name. The block was cut, its one unique element (five per-skill `references/` one-liners) moved to `overview.md` first so no signal was lost, and the result looked clean: 80 → 61 lines, all eight sections intact, nothing that a human reader would miss. The gate then failed three times — `skills`, `tmpl-core`, `tmpl-total`: the deleted tree had carried the only copies of three count claims that `check-count-claims.sh` verifies against disk in `CLAUDE.md` specifically. The claims existed in `overview.md` too, but the checker asserts them **per file**, deliberately: its own header records that a claim living in one surface and not another is how "30 templates" survived in `README.md` while the other two surfaces had moved on. The lesson is not "be careful when deleting" — the diet pass was correct and the duplication was real. It is that **a block can be duplication for a reader and a sole source for a checker at the same time**, and those two facts are established by different means: reading the content tells you the first, and only grepping for the block's *consumers* tells you the second. Before removing content that duplicates another surface, search for what reads it — a checker, a fixture, a skill procedure, a generated index. Sibling of L-020 (shipped ≠ wired) inverted: that one catches a capability nothing calls, this catches content something calls being removed as though nothing did.
- seen: Sprint-063
- count: 1
- promoted: no
- related: L-058 (the check that caught it — a gate's worth is the failure it names) · L-020 (wiring, the inverse direction) · L-015 (consumer-facing surface) · ADR-006 (what a cap counts)

---

## L-116 [tags: tooling] [status: active]: **A checker that derives its rule from the working tree cannot see an incomplete commit — the gate goes green describing a state the commit does not contain.** SPRINT-063 T3 raised the research cap to 130 in `DOCS_Guide.md` §2 and taught `check-doc-caps.sh` to exempt frozen verdicts. The commit staged `docs/ scripts/ evals/` by directory glob and silently excluded `skills/`, where `DOCS_Guide.md` lives. `qa-check.sh` then reported **154 pass, 0 fail** — correctly, because `check-doc-caps.sh` *derives* its coverage by parsing §2's table from the file on disk, and on disk the cap was 130. The gate was reading the uncommitted change and grading the working tree, while the commit it was nominally validating carried a 120 cap that would have put `graph-engineering.md` back in breach. This is L-057's family (a command's self-report is evidence about the reporter) with a specific and non-obvious mechanism: **the more a checker derives from the repo's own documents rather than hard-coding rules, the less it can distinguish committed state from working state** — and derivation is otherwise the thing that makes these checkers good (TD-041 exists because hand-listed coverage drifted). Two habits, cheap: read `git diff --cached --name-only` before committing rather than trusting the glob that produced it, and treat a green gate as a statement about the working tree unless the gate was run against a clean tree. Caught here only because the staged-file list was printed and read.
- seen: Sprint-063
- count: 1
- promoted: no
- related: L-057 (self-report is evidence about the reporter) · L-059 · TD-041 (why coverage is derived at all) · `CLAUDE.md` § Anti-Patterns edit-safety (a) — where the staging-discipline rule lives now, its own entry having been retired

---

## L-115 [tags: process] [status: active]: **A task's `assumes:` can carry both a premise and the evidence that already refuted it — the citation list is the first place to look for the refutation, not a warrant for the premise.** TASK-196 was filed with an `assumes:` block naming two things: that `ADR-017` had already raised `CONTEXT.md`'s cap once, so a second raise needs a different argument; and that `L-008`/`TD-006` "name the actual mechanism (CONTEXT accreting duplication of its satellites)", to be tested before any number moved. Both sentences are in the same block, and the second is false *because of* the first: ADR-017 **is** the record of the diet pass that falsified L-008/TD-006, stating outright that "TD-006's premise is now known to be false", and `TD-006` had since been deleted from the ledger entirely. The task was carrying its own refutation as a citation. Nothing about it read as wrong — a task that cites an ADR looks better-grounded than one that does not, and the citation is what makes the premise feel checked. The same sprint produced a second instance: TASK-199's `assumes:` had to warn against inheriting "ordinary drift" from TASK-192, a phrase TASK-192 used **while citing L-106, the learning written to correct exactly that phrase**. Distinct from L-114 (discharge a factual `assumes:` before sizing), which says *when* to check; this says *where to look first* — open the cited artifact and ask what it concluded, before treating the sentence beside it as established. A citation is a pointer to evidence, never a summary of it, and the two diverge silently as the cited record is updated.
- seen: Sprint-063
- count: 1
- promoted: no
- related: L-114 (discharge facts before sizing — the *when*) · L-091 (re-derive a stated cure) · L-106 (the learning TASK-192 cited while repeating its error) · L-113 (a rule in context that still does not fire)

---

## L-114 [tags: process] [status: active]: **An `assumes:` that is a *fact* is resolved before the task is sized, not after — a fact can invalidate the task, and a task sized on an unresolved fact is sized on a guess.** SPRINT-062 T3 was promoted at `size: M` on the premise that "91 LEARNINGS entries carry zero `promoted: yes`" had two live readings, one of them a governance defect whose evidence pruning would destroy. That premise was checkable in about two minutes: §11's collapse rewrites `promoted: yes` into `[status: promoted]` plus a pointer, so the string cannot survive a successful promotion and the count could never have been anything but zero. Resolved at G2, the task dropped M → S and four of its five DoD lines became no-ops — they had been written against a branch that did not exist. Nothing was lost because the check ran *before* execution; had it run during, the same discovery arrives as a mid-sprint `scope-change` against a frozen Plan, with work already done against the wrong premise. The discriminator is not confidence but **kind**: an assumption about a preference or a priority is the owner's to settle and belongs in a popup, while an assumption about what the code, corpus or checker actually does is the agent's job and is usually minutes of reading (Behavioral Guidelines: finding facts is your job, never the user's). The trap is that both wear the same `assumes:` syntax, so a factual premise reads as settled scope and rides through promote unchallenged. At intake and at promote, sort each `assumes:` into fact-or-judgement first, and discharge every fact before the size is written down. Sibling of L-091 (re-derive a stated cure before building on it) one step earlier in the pipeline — L-091 guards the *fix*, this guards the *premise*.
- seen: Sprint-062
- count: 1
- promoted: no
- related: L-091 (re-derive the cure; this guards the premise) · L-088 (a DoD whose criterion went stale) · L-094 (naming the class of fact that would close a deferred question) · TASK-194

---

## L-113 [tags: process] [status: promoted]: a rule can be correctly placed, currently in context, and still not fire — the enumeration of triggering flows omits the moment it is being *exercised*.
- **L-113 → promoted: `.claude/CLAUDE.md` § Behavioral Guidelines ("Cross-check a query before acting on it")** — the durable rule is the record now (§11 collapse, SPRINT-065 promote). Body: git. **Promoted by action rather than by re-placement:** SPRINT-064 T2 acted on this diagnosis directly, sorting all eleven L-108 sightings by the flow that was running — **8 of 11 were ad-hoc verification queries inside a governance pass**, the flow the original enumeration omitted, exactly as this entry predicted. The corrective it produced is what carries the rule now: a verification query whose result will be acted on immediately gets a **second query that must agree**. Deliberately *not* placed in `CONTEXT.md` § Gates beside L-108 — § Gates was loaded during all eight of those failures, so the file was never the defect, and repeating the placement would have repeated the miss. The wider claim survives the collapse: when placing any rule, enumerate the flows that **check** the guarded thing, not only those that author it. seen Sprint-062 · Sprint-064, count 2.
- related: L-108 (the rule that did not fire; count 6) · L-099 (a rule its reader cannot read) · L-105 (correct rule, wrong moment) · L-118 (a control proves sensitivity, never coverage) · L-119 (a guard gated on a qualifier that cannot reach it)

---

## L-112 [tags: process] [status: active]: **A split asked to locate a cost centre can answer that there isn't one — an evenly distributed cost closes the search instead of failing the measurement.** TD-050 recorded section 4 of the QA gate at 45–49% of the whole run and asked for it to be split across its three jobs, on the reasonable expectation that a component that large has a dominant part inside it. Measured (SPRINT-061 T3): it does not. Index freshness ~36%, the LEARNINGS loop ~30%, the corpus loop ~30%, setup ~2% — three comparable thirds. Deleting the *largest* outright would buy ~19% of the gate, and that largest slice is the whole-corpus index read that TD-050 itself names as the thing not to cheapen and ADR-009 wired deliberately: the cheapest target and the most protected one turned out to be the same object. The instinct on reading a flat distribution is that the measurement was too coarse and should be split again, which is how a search for a cure becomes unfalsifiable — each round blames the next level down. The discipline is to name, before measuring, what a *negative* result would look like and to accept it when it arrives: here it means no cheap lever exists, and any real cure is structural (cache the digest, or accept that whole-corpus integrity costs proportional to the corpus) rather than a narrowing of what is checked. Distinct from L-107, which is about *which* component gets blamed when costs are uneven; this is what to conclude when they are not. Related to L-102 in shape — running it live told us the rule was not running, running this told us the cure does not exist.
- seen: Sprint-061
- count: 1
- promoted: no
- related: L-107 (its sibling — the legible component gets blamed when costs ARE uneven) · L-091 (a `Mitigation:` is a hypothesis; this retires one) · L-097 (a number nobody re-measured) · TD-050 · TD-046

---

## L-111 [tags: sprint-model] [status: promoted]: → promoted: .claude/CONTEXT.md § Gates (the criterion-reachability paragraph, beside L-105)

---

## L-110 [tags: sprint-model] [status: active]: **A `Layers:` declaration goes stale in one predictable direction — a *fix* lands in whichever task's gate run exposed it, not in the task that owns the file.** L-100 established that `Layers:` is a live declaration corrected by the work rather than a prediction to defend. SPRINT-059 corrected it **three times in five tasks**, and all three were the same shape rather than three different misses: T2's declaration named `ADR-016-<slug>.md` before the slug existed; T3's gate run surfaced an invented tag vocabulary *in T2's ADR* and fixing it made T3 the toucher; T4's work exposed a `grep -c` bug *in T2's script* and fixing it made T4 the toucher. Only the first is a prediction problem. The other two are structural: a defect is discovered by whichever task's verification pass runs over it, and the fix is committed by that task — so file ownership at promote and file ownership at commit diverge for reasons no amount of care at promote could anticipate. This matters because the natural reaction to an attribution FAIL is to argue the file "really belongs" to the earlier task and amend there, which manufactures a cross-task commit to preserve a declaration. Declare it where the work happened; the declaration is the record of what was touched, not a claim about who should have touched it. Distinct from L-100 (which says corrections are expected) by naming *which* corrections are unavoidable.
- seen: Sprint-059
- count: 1
- promoted: no
- related: L-100 (the parent rule — a live declaration, not a frozen prediction) · `check-layers-observed.sh`

---

## L-109 [tags: tooling] [status: active]: **A checker whose loop is fed by a pipe can only ever pass — `fail=1` is set in a subshell and discarded — and it reports confidently while doing so.** POSIX `cmd | while read ...; do fail=1; done` runs the loop body in a subshell, so every flag it sets dies with it and the script exits on the value it started at. SPRINT-059's `assert-park-revisit.sh` shipped its first draft this way: the assertion printed its FAIL line, then exited 0. A harness reading the exit status would have called it green forever, and the FAIL text scrolling past is exactly the kind of output nobody re-reads once the status is good. The fix is mechanical — feed the loop by redirect (`done < file`), which does not fork — but the *detection* is not: this is invisible to review, invisible to a passing test suite, and invisible to the check's own output. Only pointing the checker at a known violation and looking at `$?` finds it, which is what a must-FAIL fixture is for (L-058). Worth stating as its own rule rather than as an instance of L-058, because it is a language trap with a one-token cause: whenever a shell check accumulates state in a loop, look at what feeds that loop before believing any result it reports.
- seen: Sprint-059
- count: 1
- promoted: no
- related: L-058 (a gate exercised on input that must FAIL) · L-057 (a command's self-report is evidence about the reporter) · TD-012 (retain the fixtures)

---

## L-108 [tags: tooling] [status: promoted]: a contract is a line in a known shape, never a word appearing somewhere — a substring standing in for a structural claim fails *green*, and the corpus it searches contains its own documentation.
- **L-108 → promoted: `.claude/CONTEXT.md` § Gates ("A guard is matched by shape, not by substring")** — the durable rule is the record now (§11 collapse, SPRINT-061 promote). Body: git; three sightings in SPRINT-059, two of them **green**, which is the whole danger — a rollup-state grep over `CONTEXT.md` matching `in-stalled` inside "installed"; the night-run reaper reading an earlier Execution Log entry that *documented* the rollup format as this run's own output, silently dropping T5; a park assertion whose must-FAIL fixture passed because the fixture's slug was `unrevisited`. Placed by §10's test: the flows that can hit it are checker authoring and the reaper (`/orchestrator`), close-time log sweeps (`/lean-doc-generator`), fixture naming and symptom greps (`/tdd` · `/diagnose`) — four skills, so no skill red-flag reaches them all, while `CLAUDE.md` sits at 80/80. § Gates already carries L-105, whose spatial sibling this is. seen Sprint-059, count 3.
- **Fourth sighting, Sprint-062 T3 — and the promoted rule was in context the whole time.** Three more false results on `docs/LEARNINGS.md` in one session, each failing green: (a) `grep -c "promoted: yes"` returning 0 and reading as a governance defect, when §11's collapse *consumes* that exact string — the query could not have returned anything else on a healthy corpus; (b) an `awk` scan whose escaping was silently broken, reporting 29 of 30 entries as missing a pointer, caught only because it contradicted a count taken minutes earlier; (c) a fixed-string search for `**L-NNN → promoted:` naming L-058 as the one gap, when L-058 was correctly collapsed and merely lacked the bold wrapper the other 29 use. The rule reached none of them. **The placement enumeration is what missed:** it names checker authoring · the reaper · close-time log sweeps · fixture naming and symptom greps, and every failure here was an **ad-hoc verification grep run during a governance/gate pass** — a flow not on that list, and the one where a wrong answer is acted on immediately. A rule placed where its *category* is discussed still misses the moment the category is being exercised. seen Sprint-059 · Sprint-062, count 4.
- **Fifth and sixth sightings, Sprint-063 · Sprint-064 — and the placement was widened, not repeated.** Five more instances: `check-ephemeral-intake.sh`'s `^evals/fixtures/` exclusion — correctly position-anchored — defeated by a worktree copy of the repo nested *inside* the repo; `grep "status: resolved"` matching the TECH-DEBT ledger's own header documenting that format; a `[status: promoted]` regex matching **L-114**, which is `active` and merely quotes the string while explaining §11's collapse; an `awk` whose broken escaping returned empty, caught only because blank output was implausible; and **a new failure mode** — an audit query whose inner `while((getline))` consumed the next `## L-` header, so it examined 20 of 31 entries and reported the corpus clean. That last one is not a substring standing in for a structure (L-108) nor a broken escape (L-113's second case) but **a correct matcher over a silently truncated input set**, and its negative control had already *passed*: a control proves the query fires on rows it reaches, never that it reached them all. Sorted by flow across all eleven instances: **8 ad-hoc verification queries inside a governance/gate pass**, 2 checker/fixture authoring, 1 automated checker at runtime. Every instance that was caught was caught by a **disagreeing second number**, never by recalling the rule — which is why SPRINT-064 T2 promoted an *action* rather than another caution, and placed it in `.claude/CLAUDE.md` § Behavioral Guidelines (every flow reads it) instead of § Gates, which was already loaded during all eight governance-pass failures. seen Sprint-059 · Sprint-062 · Sprint-063 · Sprint-064, count 6.
- **Seventh sighting, SPRINT-075 promote — a verbatim repeat of the fifth, and the strongest evidence yet that placement is not the lever.** The TD-aging scan counted `grep -c 'status: resolved'` over `TECH-DEBT.md` and got **3**, against 14 open and 16 total. Same file, same string, same cause as the fifth sighting already recorded above: line 13 is the ledger's own **legend** defining that status value. The rule was promoted, correctly placed in `CONTEXT.md` § Gates, and *loaded in context* — and it did not fire. What caught it was `14 + 3 ≠ 16`, a second number that could have agreed and did not. This is the third distinct recurrence on this one file, so the value is no longer in re-stating the rule: it is in the **cross-check being an action**, which is why CLAUDE.md carries it as one. A rule that fails to fire seven times is not under-written, it is unreachable by recall.
- related: L-058 (must-FAIL fixtures — what caught two of the three) · L-091 (re-derive before building on a stated cure) · L-109 (its sibling trap in the same assertion) · L-105 (the temporal sibling it now sits beside) · L-099 (a rule its reader does not read — the fourth sighting's shape) · L-113 (the placement diagnosis this widening acts on) · L-130 · L-136 (the authoring-time sibling promoted alongside this sighting)

- **Eighth sighting, SPRINT-075 T6 — the documented sub-case, committed by the person who had just re-read it.** A fixture asserted that an ADR raised no ownership finding via `grep -q 'ownership-header'` over the engine's output, and it failed on a correct run: the engine prints the repo path in its header line, and the fixture directory is `evals/fixtures/**ownership-header**/`. The assertion matched the *path*, not a finding. L-108's own promoted text names this exact case — *never name a fixture after a token its own assertion greps for* — and the fixture had been named minutes earlier in the same session. Fixed by anchoring to the finding's position (`^FAIL  ownership-header`) rather than its substring. Consistent with the seventh sighting's conclusion: recall is not the lever. What differs here is that the failure was **loud** (a green run reported as a failure) rather than green — the first sighting in this family to fail safe, and it failed safe only by accident of which side of the assertion the stray match landed on. seen Sprint-059 · Sprint-062 · Sprint-063 · Sprint-064 · Sprint-075, count 8.
- **Ninth and tenth sightings, SPRINT-079 — both while diagnosing a checker, both in one session, and the promoted rule reached neither.** (a) `S4.INDEX` was written up as *silently passing when the index is missing*. It does not — it reports `decisions-index-missing-adr` correctly. The grep was by **rule id**, and that line carried none, so an empty result about the QUERY was recorded as a fact about the ENGINE, into two durable artifacts, before anything disagreed with it. (b) Hours later the four §10 rules were absent from a report and read as *not registered*; the engine had aborted mid-run on an octal literal (→ L-154), which **stderr said plainly and stdout did not**. What resolved (a) was reading the code and (b) reading stderr — in neither case did a second query come first, which is the promoted rule's whole instruction. **The pattern across all ten: the rule fires for searches over a CORPUS and stays silent for searches over a TOOL'S OUTPUT**, where an empty result feels like an observation rather than a query. The corrective that worked twice here is narrower than the rule and worth keeping: *when a search over output returns nothing, check the channel before the conclusion* — a missing line and a missing run look identical. **Also the sprint that mis-tallied this very entry**: the bump was first written as "fifth and sixth" from the first `count` line read, while the ledger recorded eight — L-143's failure, on the tally of the rule about not trusting one query. seen Sprint-059 · Sprint-062 · Sprint-063 · Sprint-064 · Sprint-075 ×2 · Sprint-079 ×2, count 10.
---

## L-107 [tags: process] [status: promoted]: a hypothesis about where cost goes names the component that is *legible*, not the one that dominates — the enumerable list gets blamed and the undifferentiated blob beside it is never suspected.
- **L-107 → promoted: root `TECH-DEBT.md` header block, beside L-091** — the durable rule is the record now (§11 collapse, SPRINT-061 promote). Body: git; TD-046 recorded the gate at ~126s and blamed the eval harnesses on a suspicion that proved to be two of fourteen costing ~10s, both deliberate zero-coverage guards whose live input is the entire point. Measured (SPRINT-058 T2): harnesses ~34%, the unnamed inline sections ~66% and never measured by anyone; SPRINT-060 T3 measured them and filed TD-050. What made the harnesses the suspect is **shape**, not evidence — a named list you can count and point at can have a hypothesis phrased about it, an unnameable blob cannot be accused. Placed by §10's test: both sightings arose while filing and acting on a debt row, and the header is what every flow that files (close), ages (promote) or acts on a row reads — the honest enumeration, rather than the wider "any cost attribution" that would also claim `/diagnose`, where it has never yet been seen. seen Sprint-058/060, count 2 — **third sighting Sprint-061**, inside the sprint that promoted it: TD-050's proposed split named *freshness vs dangling refs vs completeness*, which is how section 4's own header names itself, while the boundaries the code actually has are its four loops. The legible decomposition was the section's title all along.
- related: L-091 (its parent — a `Mitigation:` is the filer's guess) · L-097 (a number in a criterion is remembered, not measured) · L-102 (run it live to find out what is true) · TD-046 · TD-050

---

## L-106 [tags: docs] [status: promoted]: A figure a checker reads is exact — and a breach that resists every honest fix means the number is wrong, not the file.
- **L-106 → promoted: `DOCS_Guide.md` §2 Growth rule** — the durable rule is the record now (§11 collapse, SPRINT-062 T1). Body: git; three sightings — `AGENTS.md` 11 vs `~10` (the cap never budgeted for the two-line ownership footer §3 mandates) · `graph-engineering.md` 122 vs `120 soft` (no movable section; the only route to green was re-wrapping prose) · `qa-gate-timing.md` 223 vs `120 soft`, an append-only measurement series, alongside `TODO.md` 206 vs `~150` where the standard's own § Task entry shape needs ~120 lines at eight tasks. Placed by §10's test: the flows that can author or trip a cap are §2 cap-authoring, checker-authoring, and ruling a breach at promote — no single skill red-flag reaches all three, and all three arrive at the Growth rule paragraph, which is the standard's own instruction for what to do at a cap, while `CLAUDE.md` sits at 80/80. Resolved by splitting per §6 on ADR-014's precedent rather than by moving a number. seen Sprint-058/061/062, count 3.
- related: ADR-015 (the ruling this produced) · ADR-014 (the split precedent applied) · L-097 (its sibling — a stated figure that rots, where this one was imprecise at birth) · L-099 (a rule its reader cannot read) · L-088 (the criterion met by re-reading it) · L-107 (blaming the component that is legible) · TASK-179 · TASK-193 · TASK-196

---

## L-105 [tags: process] [status: promoted]: a correct rule evaluated at the wrong moment is the defect that survives review — reviewers check what a rule says, not when it runs.
- **L-105 → promoted: `.claude/CONTEXT.md` § Gates** — the durable rule is the record now (§11 collapse, SPRINT-058 promote). Body: git; three instances across SPRINT-056/057, each individually correct and each repeatedly reviewed — (a) the sprint checks gated on `status: active`, so writing `status: closed` disarmed them inside the very commit making the largest edit to the file (72→68, then 94→87, both "0 fail"); (b) night-run pre-flight required G1/G2 "already signed off" without requiring the sign-off to exist in the artifact the run reads, so every task parked having done zero work; (c) G1 splits a `size: L` but runs after `promote` froze the Plan, so the split costs a `scope-change` where at pull time it costs nothing. Placed by §10's test: the three flows that hit it are `promote` (c), `/orchestrator` night-run pre-flight (b) and close/checker-authoring (a) — three different skills, so no skill red-flag reaches them all, while `CLAUDE.md` sits at 80/80 and the honest enumeration is "flows that author or review a guard", not all of them. § Gates is where guard discipline already lives and all three read it. seen Sprint-056/057, count 2.
- related: L-099 (its spatial sibling — a rule nothing reads) · L-058 (the silent false negative it produces) · L-103 (an exit code distinguishes neither) · TD-042 · L-089 (the gate re-run *after* the last edit — the same axis, one level down)

---

## L-104 [tags: process] [status: active]: **A design question parked as "not yet designed" is often already answered in the implementation's own comments — read what the code says about itself before designing anything new.** TD-044 recorded an open fork and explicitly refused to guess at it: "the real question is whether exclusion should key on the *file* or on the *phase that touched it*, and that has not been designed." SPRINT-056 T3 was promoted to design it. The design step took one read of the function being changed. Every reason on the WIP exclusion list was already written inline — `TODO.md`: "backlog bookkeeping, **written at close**"; `TECH-DEBT.md`: "TD marking **moved to close**"; `CHANGELOG.md`: "release bookkeeping, **written at close**" — three statements about a *phase*, sitting beside genuinely structural ones ("GENERATED, never hand-authored", "undeclarable by construction") that hold in every phase. The list was one list with two kinds of reason, implemented uniformly on the file. That *is* the answer to "file or phase", and it had been sitting in the source the whole time, written by whoever added each exclusion. What made it invisible is that the comments justify entries *individually* — each one reads as obviously correct on its own — and the pattern only appears when you read them as a set and ask what kind of claim each is making. Cheap habit with a good hit rate: before designing a fork the debt row calls undesigned, read the existing implementation's comments **as a group** and ask whether they are all the same kind of statement. A row that says "not yet derived" is a statement about the filer's evidence at filing time, never a finding that the answer is absent.
- seen: Sprint-056
- count: 1
- promoted: no
- related: L-098 (a summary is a hypothesis — this is its code-comment form) · L-091 (a Mitigation is a hypothesis) · L-102 (run it live to find out what is true) · TD-044

---

## L-103 [tags: tooling] [status: active]: **A live run shows what a checker reports; only a fixture shows what it fails to report — and an exit code distinguishes neither.** L-102 established that a new checker's first run belongs against the live repo, because that run surveys how far the rule had already drifted. SPRINT-056 confirmed that three times over and then found its sharp limit: **the live run cannot see an omission**, because what is missing from a report is invisible in it. Three instances in one sprint, each caught only by a fixture and each exiting **0**. (a) `check-doc-caps.sh` emitted `prefix<TAB>path<TAB>cap` and read it with `IFS=<tab>`; the root-files table has an *empty* prefix and POSIX `read` strips leading whitespace-IFS fields, so every root row shifted by one and vanished — `SECURITY.md`, `AGENTS.md`, `TODO.md` silently uncovered while the output looked comprehensive and healthy. (b) The pre-fix dispatch preflight, run over the parity fixture, printed `PREFLIGHT: CLEAR` at exit 0 while reporting **neither** of the two overlaps the tasks genuinely shared — same exit code as the fixed parser, empty verdict. (c) `check-manifest-lockstep.sh`'s first live run found *zero* manifests, because every one lives in a dot directory and a shell glob does not match a leading dot; shipped, it would have exited 0 forever. The consequence for fixture design is concrete and was nearly missed here: **assert on output content, never on exit status**, because all three of these are indistinguishable from success by status alone, and the obvious fixture (`expect exit 0`) would have blessed every one. The pairing to keep: live run for *drift*, fixture for *omission*, content assertions for both.
- seen: Sprint-056
- count: 1
- promoted: no
- related: L-102 (its direct parent — the live run is for drift, this is its blind spot) · L-058 (the silent false-negative) · L-060 · CLAUDE.md Edit-safety trap (c) · L-078 (a green result from a setup that never ran) · L-075 (a fixture that never held the violation)

---

## L-102 [tags: tooling] [status: active]: **Point a new checker at the live repo before fixing anything it might find — the first run is discovery, and a check that has only ever run on correct input has not been tested.** SPRINT-055 shipped five checkers; **four failed on real, pre-existing repo state on their first run**: the epic-archive check on EPIC-001 (closed, fully ticked, unarchived for five sprints), the task-origin check on all seven Backlog entries (unstamped), the count-claims check on six drifted claims across three surfaces, and — in the other direction — the research check correctly reporting *nothing to do*, because the one superseded doc was still cited. The order matters and is easy to get backwards: writing the checker, fixing the repo, then running it green proves only that the checker agrees with the state you just created. Running it first turns the guard into a survey of how far the rule had already drifted, which is information you cannot get any other way and which is gone the moment you fix the repo. Distinct from L-058, which is about *fixtures* (a gate must be exercised on input that must FAIL); this is about the **live repo as the first input**, before any fixture exists. The two compose: the live run tells you the rule was not running, the fixtures tell you the check cannot silently stop.
- seen: Sprint-055
- count: 1
- promoted: no
- related: L-058 (a gate needs a must-FAIL fixture) · L-016 (verify on the consumer path when the repo cannot dogfood) · L-007 (exercise once on real input) · L-099

---

## L-101 [tags: process] [status: active]: **A must-FAIL fixture over an undefined rule is not hard to write — it is impossible, and the impossibility is the finding.** SPRINT-055 T4's DoD asked for "a must-FAIL fixture: a BUG file left undisposed after routing". No such fixture could be written, because DOCS_Guide §2 described the report's *content* as "routed away at `/triage`" and said nothing about the *file* — it was listed with no directory prefix while every sibling row carried one, so "undisposed" named no state a checker could test. Committed? Deleted? Archived? Unanswered. The moment the rule was ruled (temp-dir intake scaffolding, never committed) the fixture became trivial: a **committed** `BUG-*.md` IS the failure. The lesson is diagnostic rather than procedural — when a fixture for a stated rule resists being written, the usual cause is not fixture difficulty but that the rule does not actually say anything checkable, and the right move is to stop and define it rather than to invent a proxy that tests something adjacent. A proxy would have passed review and guarded nothing, which is L-058's silent false-negative arriving by a different road.
- seen: Sprint-055
- count: 1
- promoted: no
- related: L-058 (the false-negative this prevents) · L-099 (a rule the checker cannot read) · TASK-169

---

## L-100 [tags: process] [status: promoted]: a `Layers:` declaration is live, corrected per task — it cannot name the files implementation invents, so a mid-sprint edit is expected cost, not a planning failure to justify.
- **L-100 → promoted: `.claude/CONTEXT.md` § Sprint model** — the durable rule is the record now (§11 collapse, SPRINT-056 promote). Body: git; six corrections across five tasks in SPRINT-055, every one a file discovered by attempting the task, all caught by leg 15 (`check-layers-observed.sh`) — the friction was the correction loop, not misses — plus SPRINT-042 T3 defeating leg 14 the day it shipped (TD-022). Placed by §10's test: the two flows that can hit it are `promote` (authors the declaration) and `/orchestrator` execute (discovers the undeclared file), and both read the sprint-model SSOT — a skill red-flag would fire in one and stay silent in the other, while `CLAUDE.md` is at 80/80 and the honest enumeration falls short of "all flows". seen Sprint-042/055, count 2.
- related: TD-022 (the checker that exists because of this) · L-074 (two docs by one author at one moment are one source) · L-071 (omission looks identical to absence)

- **Fourth sighting, SPRINT-075 — four more corrections, and one of a new kind.** T1 declared `scripts/qa-check.sh` at execution, T2 declared `conformance.sh`, T5 declared the epic file and the generated index, T3 declared four files including the engine it was only supposed to touch "if the run exposes a defect" (it did). All expected, all logged. The new kind is **T4's**: its `Layers:` said *"the engine"*, which reads correctly to a human and matches nothing — `check-layers-observed.sh` compares **paths**, so a layer named in prose is an undeclared layer, and the gate reported the file as changed-but-never-declared. The correction is not "declare more", it is **declare in the form the checker reads**: a `Layers:` entry is a path, and a description of a file is a comment about a path, not a declaration of one. seen Sprint-055 · Sprint-042 · Sprint-074 · Sprint-075, count 4.
---

## L-099 [tags: process] [status: active]: **A rule written where its checker does not read it is not a rule — it is a comment that looks like one.** SPRINT-055 existed because five separate rules had been written and were not running: DOCS_Guide §11's epic-archive row had never once executed (EPIC-001 sat closed and fully ticked in `docs/epic/` for five sprints while every gate reported green), `close`'s compaction sweep pointed at a research archive target §11 never defined, §2 described a BUG report's content but not its file, G1 fast-pathed "decomposer-approved" tasks with no field recording whether any task had met the grill, and README's template count was guarded on two surfaces but not the third it had drifted on. The sprint then **demonstrated the rule on itself before the first task started**: its own § Decisions D1 said "strictly sequential T1→T7", the pre-dispatch preflight reads `Depends-on:`, and the preflight HALTed on two shared files with no edge — the ownership decision had been signed at G2 and written where nothing reads it. The discriminator is mechanical and worth applying at authoring time: name the reader. If the answer is "a human who happens to look", the rule is documentation, and documentation is fine — but it will not fire, and calling it a gate is the error. Where a rule is meant to bind, it goes in the field the checker parses, and the prose becomes the explanation rather than the mechanism.
- seen: Sprint-055
- count: 1
- promoted: no
- related: L-020 (shipping ≠ wiring) · L-058 (a gate that cannot fail) · L-102 (run it live to find out it was not running) · TD-041 · TD-043

---

## L-098 [tags: process] [status: active]: **A summary of an external source is a hypothesis about it; when a decision turns on the source, re-read the source.** SPRINT-054 T3 was promoted to settle a "real tension" this repo had carried since scan 3: `loop-me`'s *push right* (defer the checkpoint as far as it will go) against our gate-before-work model. Every artifact describing that tension — the research doc's delta-map row, the Backlog task, the sprint's own Plan prose — restated our one-line summary of the skill. Fetching the skill itself (via `gh api`; the raw URL 404s, it lives under `skills/in-progress/`) dissolved the tension in one read: `loop-me` defines a **Checkpoint** as a *runtime* verify-or-decide point inside an already-specified workflow, and the skill **is itself a grilling session** whose DoD is "done when an implementer agent could build it without asking a single question". Its model is grill-exhaustively-up-front plus push-the-runtime-checkpoint-right — the same shape as ours. The recorded tension had compared his runtime checkpoints against our design gates: not a disagreement, a category mismatch. Note what would have happened otherwise: the ruling was a judgement call, so arguing from the summary would have produced a confident, well-reasoned verdict about a position nobody holds. The cost of re-reading was one API call. Distinct from L-017 (map the delta against *our* surface before judging) and from this doc's own "a shared name is a hypothesis about coverage" note — both are about the first scan; this is about every decision **after** it, where the summary has become the only thing anyone reads.
- seen: Sprint-054
- count: 1
- promoted: no
- related: L-017 (delta over standalone merit) · L-097 (a criterion's numbers rot the same way) · L-096 (falsify a rule against a case whose answer you know) · `docs/research/mattpocock.md`

---

## L-097 [tags: process] [status: promoted]: a number written into a criterion is remembered, not measured — nothing re-measures it, so the criterion rots while its prose stays confident.
- **L-097 → promoted: `spec/STANDARD.md` §10 § A number inside a criterion is remembered, not measured** — the durable rule is the record now (§11 collapse, SPRINT-056 promote). Body: git; TD-038 held twice on a count dead since the sprint it was filed in (stated 117, actually 124 four commits later, 159 by close) · SPRINT-054 T2's DoD guarding against a breach that had already happened · T4's clauses unsatisfiable at authoring · SPRINT-055 T3's "25 research files" measured at 27. Placed beside L-091, its mitigation-level sibling, which the same filing-and-consuming flows (`close`, `promote`) read; the §10 rule names the decompose/triage surfaces explicitly so a figure written into a Backlog entry is covered without a second copy. seen Sprint-054/055, count 2.
- **It fired again in the promote that promoted it (SPRINT-056).** TD-041 names `docs/research/mattpocock.md` as *the* drifted case — but that file was fixed at SPRINT-054 T4 (110) and three *other* research docs are over the 120 cap today: `loop-hygiene-prd.md` 214, `graphify-daily-value.md` 157, `graph-engineering.md` 122. The row's stated instance decayed into the one case that no longer applies, which is the failure it describes, in the row that exists because of it.
- related: L-091 (a Mitigation is a hypothesis — this is its facts-level sibling) · L-088 (a DoD invalidated by execution) · L-058 (a check that cannot fail) · TD-041 (the missing cap check) · L-098 · L-099 (its structural sibling: a rule nothing reads, vs a number nothing re-measures)

---

## L-096 [tags: process] [status: active]: **A rule that predicts what should exist is falsifiable in one step — run it against a case whose answer you already know, and the sharpest such case is your own repo.** SPRINT-053 T1 set out to stop `init` scaffolding docs for absent substrate, and shipped into the sprint with the rule stated as "a docs-only repo should get no testing guide, coding standards or deployment guides". Every word of that reads as obviously right. Running it against lean-flow — a docs-only repo — showed it predicting our own two deployment guides out of existence, which are correct and load-bearing: we publish a plugin, and those docs own the push/deploy steps `/release-patch` deliberately stops short of. The rule was not slightly off, it was keyed on the wrong axis: "docs-only" bundles *has code* and *publishes an artifact* into one label when they vary independently, and a markdown plugin is exactly the case that separates them. The corrected rule then reproduced our real doc set on both axes, which is what promoted it from plausible to tested. The general move is cheap and underused: whenever a rule's output is a **prediction about what should exist**, you already own a labelled test case — the repo in front of you — and a wrong rule announces itself by predicting reality out of existence. This is the falsification step, distinct from L-016's question of *where* to verify; L-016 says use the consumer path when the substrate is absent, this says the strongest input is the case whose correct answer is already sitting on disk.
- seen: Sprint-053
- count: 1
- promoted: no
- related: L-016 (verify on the consumer path) · L-088 (a frozen premise invalidated by execution — the vehicle here) · L-015 (the consumer-facing surface check) · L-090 (a fixture proves a change only against the prior state)

---

## L-095 [tags: tooling] [status: active]: **A red skill-freshness row is repairable in-session — diff the installed skill against repo HEAD and you have the delta, without a reinstall or a restart.** `/prime` reported `1.25.2 base-dir != 1.27.1 repo → STALE` and, correctly, refused to block on it. L-021 establishes *reading* that row; it says nothing about what to do once it is red, and the two obvious moves are both bad — reinstall (restarts the session, loses the loaded context) or proceed and hope (Sprint-039 ran a whole sprint on 1.18.0 procedures). There is a cheap third: the repo is right there, so `git log -S'"version": "<installed>"' -- .claude-plugin/plugin.json` finds the release commit and `git diff <that>..HEAD -- skills/` prints exactly what the running copy is missing. Here it was 17 files, of which the one being executed had **two** changes — the frontier-round grill rule and the L-088 stale-DoD red flag, which the sprint then leaned on directly. Total cost: two commands, no restart. The general point is that a stale *procedure* is a diff, not a mystery, whenever the source is checked out beside it — which is exactly the maintainer's situation and never the consumer's, so this is a maintainer-path repair and the freshness row stays a report for everyone else.
- seen: Sprint-052
- count: 1
- promoted: no
- related: L-021 (read the base-dir version, never `/plugin`'s report) · L-060 (inspect the artifact rather than the report) · `skills/prime/SKILL.md` § Skill freshness

---

## L-094 [tags: process] [status: promoted]: before deferring a question for want of evidence, name the class of fact that would close it — only a measurement accumulates, so a documented behaviour or a judgement call parked behind "a measurable signal" waits forever.
- **L-094 → promoted: `.claude/CONTEXT.md` § Continuous learning governance** — the durable rule is the record now (§11 collapse, SPRINT-053 T4). Body: git; the skill-self-fork question closed by one documentation read after three scans of "no new evidence either way" (Sprint-050) · TASK-155 and TASK-159 parked as `needs-info` behind an unarrivable signal, unblocked in one pass by naming the class (Sprint-052). Placed by §10's test: the five flows that can hit it — `/triage` setting `needs-info` · `promote` re-reviewing aged TD · `close` routing a follow-up · a research scan writing "no new evidence" · `.out-of-scope/` revisit-ifs — are all **governance** moments spanning two skills plus a doc practice, so no skill red-flag reaches them and the governance SSOT does. Not "every flow": `/tdd` and `/diagnose` cannot hit it, so `CLAUDE.md` stayed at 80/80 with no displacement. seen Sprint-050/052, count 2.
- related: L-068 (the complement — a deferral also needs a written kill-switch; still `count: 1`, so it stays a ledger line rather than riding along) · L-087 (test the mechanism, don't infer it) · L-017 (delta over existing surface) · `.out-of-scope/skill-self-fork.md`

---

## L-093 [tags: docs] [status: active]: **An entry leaves an explicit boundary list by a written verdict, never by an assumed coverage — and a shared name is a hypothesis, not a finding.** A research doc's § Not scanned list was created precisely so a gap would be "a recorded boundary rather than an implied all-clear". It then quietly shed five entries — `diagnosing-bugs` · `prototype` · `tdd` · `triage` · `handoff` — every one of which shares a name with a lean-flow skill, so each *looked* obviously covered. The list granted the implied all-clear it existed to prevent, inside the mechanism built to stop it. SPRINT-050 checked all five at a cost of one line each and **two produced keepers**: `/diagnose` had no redaction rule despite instructing the capture of HAR files and traces, and `/tdd` was missing the tautological-test anti-pattern. So the assumption was not merely unverified — it was wrong, and it had been hiding the two most substantive findings of the scan. The general shape: a boundary list's value is entirely in its being *complete*, and the entries most likely to be dropped from one are the entries that look most obviously fine, because that is what makes dropping them feel safe. The rule is mechanical — nothing leaves the list without a sentence saying what covers it, and "we have one with the same name" is not that sentence, since L-017's whole point is that the delta lives in behaviour, not in the label.
- seen: Sprint-050
- count: 1
- promoted: no
- related: L-017 (delta over standalone merit) · L-058 (a gate's silent false-negative) · L-016 (verify on the consumer path rather than assuming) · `docs/research/mattpocock.md`

---

## L-092 [tags: process] [status: promoted]: a promoted learning fires only inside the skill it was filed into — place it by asking which flows can hit the failure, never by picking from the three-home menu.
- **L-092 → promoted: `spec/STANDARD.md` §10 § Placement test** — the durable rule is the record now (§11 collapse, SPRINT-052 T1). Body: git; L-087 filed into `/diagnose` then failing during a `promote` · a redaction rule living in `/handoff` and never reaching `/diagnose`. Placed by its own criterion: the failure occurs only while *choosing a home for a promoted rule*, and every flow that does so reads §10 — so a single home is correct here, and it is not the trap the learning names (that trap is a home outside the failing flow, not a home in one file). The same enumeration found the menu duplicated on two further surfaces — `.claude/CONTEXT.md` § Continuous learning governance and this ledger's own header — both rewritten to point at the test rather than restate the menu, since a stale second copy reproduces the failure. seen Sprint-049/051, count 2. **It then fired against its own promotion, one release later**: a post-release wiring audit found three further copies — `lean-doc-generator/SKILL.md`'s governance line (the sentence a promoting agent actually executes, as opposed to the reference it loads) and two in `templates/LEARNINGS.md.template`, the header every consumer's ledger is generated from. The G2 enumeration had searched the dogfooded copies and never `templates/`, so the fix shipped complete for the maintainer and two-thirds complete for the consumer — L-015 and L-020 intersecting, both already law. Closed inside the unpushed v1.27.2.

---

## L-091 [tags: process] [status: promoted]: a tech-debt row's `Mitigation:` line is a hypothesis written under pressure, not a plan — cite the evidence for the problem, re-derive the fix.
- **L-091 → promoted: `spec/STANDARD.md` §10 § A `Mitigation:` line is a hypothesis** — the durable rule is the record now (§11 collapse, SPRINT-052 T1). Body: git; TD-032 (a narrowing that would have fixed none of the false positives, replayed across 11 revisions of the SPRINT-048 Plan) · TD-034 (a "reconcile the duplicates" cure that would have destroyed one of two honest snapshots inside a closed archive). Placed by L-092's test: the flows that hit it are *close* (filing a Mitigation) and *promote* (carrying one into a DoD), and both read §10 — a `/diagnose`-only home would have fired in neither. `/triage` reads the row rather than §10, so a pointer line lands in `TECH-DEBT.md`'s header under T2, which owns that file. seen Sprint-049/051, count 2. It then fired a third time inside the sprint that promoted it: TD-036's Summary was already false when filed (T2).

---

## L-090 [tags: tooling] [status: active]: **A gate's new must-FAIL fixture proves nothing until it is run against the code from *before* the fix.** SPRINT-049 T1 replaced the observed check's all-task union with per-task attribution, closing TD-035 — a task editing a file only a sibling declared. The fixture failed on the new checker, which is necessary and not sufficient: a fixture can fail for a reason unrelated to the change, or test a path the old code never reached, and either way "this case used to pass" stays unverified. So the same fixture repo was driven twice, `git show HEAD:scripts/lib/check-layers-observed.sh` versus the working copy: **old → `PASS`, exit 0 · new → `FAIL … T1:bar.txt`, exit 1.** That two-line result is the whole claim. L-058 establishes that a gate needs a must-FAIL fixture per check; this sharpens *when* that fixture becomes evidence — a red result on new code is a test of the new code, while the red-on-new/green-on-old **pair** is a test of the change. Cheap to do (one `git show` into a temp file) and the only thing that distinguishes a closed hole from a fixture that was always going to be red.
- seen: Sprint-049
- count: 1
- promoted: no
- related: L-058 (a gate's must-FAIL bar) · L-007 (exercised once on real input) · TD-012 (retain the fixtures) · TD-035

---

## L-089 [tags: tooling] [status: active]: **A gate is only as good as the last time you ran it — and the edit most likely to go unverified is the one you make *after* it passes.** SPRINT-048 committed a red gate: T4's work was green, then its DoD checkboxes were ticked, then the log was appended, then it was committed — and the tick had introduced a `layers-completeness` FAIL. Nothing in that sequence felt like a code change; ticking boxes and writing a log entry read as clerical bookkeeping, which is exactly why the gate was not re-run. It surfaced only because `night-run.sh`'s pre-flight refuses to fire on a red gate and reported it while an unrelated task was being reproduced — the tooling caught what the author did not, two tasks later. This is the same family as L-057/L-059 (a verdict about the wrong thing) with the axis rotated: not *which command* the status came from, but *when* it was taken. The practical rule: **re-run the gate immediately before `git commit`, after the final edit, not after the last edit that felt substantive** — and treat DoD-ticking and log-appending as edits, because they are.
- seen: Sprint-048
- count: 1
- promoted: no
- related: L-057 · L-059 (status from the wrong command) · L-060 (inspect the artifact) · L-088

---

## L-088 [tags: sprint-model] [status: promoted]: a DoD frozen at promote carries numbers and premises execution can invalidate — amend it through a `scope-change` and an owner ruling, never a quiet reinterpretation.
- **L-088 → promoted: `skills/orchestrator/SKILL.md` § Red flags** — the durable rule is the record now (§11 collapse, SPRINT-049 T2). Body: git. Placed beside the scope-change red flag and explicitly distinguished from it: that one covers a *pivot*, this one a criterion that went stale while the scope held. seen Sprint-047/048 (×3), count 2. It then fired a fourth time in the sprint that promoted it — SPRINT-049 T1's own DoD carried TD-032's narrowing mitigation, falsified by replaying the check across 11 revisions of the SPRINT-048 Plan, and was ruled rather than reinterpreted.

---

## L-087 [tags: process] [status: promoted]: a symptom is observed, the mechanism welded to it is inferred — treat the symptom as data and the mechanism as the first thing to test.
- **L-087 → promoted: `skills/diagnose/SKILL.md` § Red flags** — the durable rule is the record now (§11 collapse, SPRINT-048 promote). Body: git; TD-024 (three mechanisms, two wrong) · TD-027 (falsified by a 26-turn probe). seen Sprint-044/045/046, count 3.
- **Promotion was overdue**: it reached count 3 and sat unpromoted, because the SPRINT-047 promote scan matched `count` and `promoted:` on the same line while this ledger puts them on separate ones. The scan, not the rule, was the failure.
- related: L-078 (a green result from a broken setup) · L-085 (hand the verification forward) · L-060 (inspect the artifact, not the report) · TD-024 · TD-027

---

## L-086 [tags: tooling] [status: promoted]: a permission rule can be present, correct, and completely inert — presence is not effect, so verify a rule *matched* and never that it exists.
- **L-086 → promoted: `skills/orchestrator/references/night-run.md` Part 1** — the durable rule is the
  record now (§11 collapse, SPRINT-057 T1). Body: git; the three original mechanisms (workspace trust ·
  rule form · command shape) plus the consumer's independent recurrence (2026-08-09, a field report from outside this repo). Placed by
  §10's test: the flows that can hit it are night-run pre-flight (building an allowlist) and any
  headless run consuming one, and both read Part 1 — a `CONTEXT.md` rule would reach flows that cannot
  act on it, and `CLAUDE.md` is at 80/80. What actually lands there is the **method**, not the
  measurements: a probe carrying a deliberate must-deny action, because without one "every call
  succeeded" and "the allowlist was ignored entirely" are the same output. seen Sprint-046 + consumer
  field report, count 2.
- related: L-077 (the matcher reads the literal invocation) · L-084 (superseded by this) · L-083 (a precondition that silently stopped holding) · L-103 (the same principle one level up, at the checker layer) · TD-028 · `docs/research/headless-permission-surface.md`

---

## L-085 [tags: process] [status: active]: **An agent that *cannot* verify should hand the verification forward as a named command, not quietly accept review as proof.** SPRINT-045's unattended run could not execute either task's fixture harness — five `denied-tool` findings blocked it — so it had a choice between three things: claim the tasks verified on the strength of a careful diff review, drop the question silently, or say what it could not do. It said so: *"That is strong but not equivalent to an end-to-end run"*, and wrote an **owner verification item** naming the exact command and the exact precondition (`run this with MSYS_NO_PATHCONV cleared before treating TD-025 as closed`). At close that item took one command and passed, converting an unverifiable claim into a verified one at near-zero cost. What makes this worth keeping is the asymmetry: review-as-verification is *usually* right, which is exactly why accepting it silently is dangerous — the times it is wrong are indistinguishable from the times it is not, unless someone recorded that the real check never ran. The durable form: when a verification step is blocked, the deliverable is not the reviewed artifact, it is the artifact **plus the named command the next person must run**. A gap that is written down is a five-minute task; the same gap unwritten is a false green.
- seen: Sprint-045
- count: 1
- promoted: no
- related: L-078 (a green result from a broken setup) · L-058 (a guard needs a must-FAIL leg) · L-060 (inspect the artifact, not the report) · TD-025

---

## L-084 [tags: tooling] [status: superseded]: **A permission surface can narrow *mid-session* — so allowlist derivation, a static exercise done once at pre-flight, cannot fully protect a long run.** SPRINT-045's run had `awk … > file` and `sh <path>` denied *after* those exact command forms had already succeeded earlier in the same session; they were how its own wave-start preflight had been extracted and executed minutes before. The dispatched T1 agent independently reported the same shape inside its own sandbox — every `sh` and `awk -f <file>` invocation denied regardless of allowlist match, while inline `awk '…'` kept working. Two observers, one run, same signature. This is materially different from the form-failure story (L-077: the matcher reads the literal invocation), and it partly undercuts the fix built on it: a perfectly derived, perfectly formed allowlist still degrades if the surface itself changes under the run. Consequence for the unattended contract — pre-flight can no longer be treated as *sufficient* for a long run, only necessary; a run that suddenly cannot execute a command it ran an hour ago is not misconfigured, and diagnosing it as a rule gap sends the next person to the wrong file. **Reproduce before theorising** (TD-024's lesson, applied here in advance): nobody has yet established whether the trigger is elapsed time, turn count, or a budget.
- seen: Sprint-045
- count: 1
- promoted: no — **SUPERSEDED by L-086** (SPRINT-046 T1 falsified the degradation hypothesis; the discriminator is the redirect, an instance of L-077). Retained rather than deleted: the observation was real and the wrong inference is the instructive part.
- related: L-077 (form failures — the *static* half of the same surface) · L-072 (the terminal step is the shared choke point) · TD-027 · TD-028

---

## L-083 [tags: tooling] [status: active]: **A check that watches for a side effect is only as valid as the output format that produces it — verifying it under one format does not verify it under another.** SPRINT-044's launcher defines `ALIVE` as "process up **and** observable progress", deliberately, because a live PID can mean a rejected prompt. It was verified against the default output format and worked. SPRINT-045 fired the same launcher with `--output-format json`, which **buffers everything until exit** — so no progress can appear by construction, and a healthy run that went on to land both units was reported `DEAD-ON-ARRIVAL`. The check's logic was never wrong; its precondition silently stopped holding. Two things follow. The narrow one: `night-run.md` Part 3 already names `stream-json` as the format whose lines signal liveness, and I reached past that for `json` because it is what exposes `total_cost_usd` — a **retrieval miss against our own doc**, and the two needs genuinely pull opposite ways. The general one: when a guard infers state from an observable, the *shape of the observable* is part of its contract. Ask what makes the signal appear, and whether every supported invocation still produces it — otherwise the guard keeps returning confident verdicts about a channel that has gone silent for reasons unrelated to the thing being watched.
- seen: Sprint-045
- count: 1
- promoted: no
- related: L-065 (a check whose comment asserts more than its code tests) · L-076 (demonstrate what a narrowed gate no longer catches) · L-081 (a precondition changed by the environment) · TD-029

---

## L-082 [tags: process] [status: active]: **When a guard flags its own file, the one fix never available is exempting it.** SPRINT-044's observed-layers check FAILed on a generated index nobody declares — a genuine gap, fixed by adding it to the checker's exclusion list with a stated reason. Editing the checker then made *it* undeclared, and the check FAILed again naming its own source file. The obvious move was another exclusion line; it would have taken ten seconds and turned the guard into one that cannot see changes to itself. Rejected: the checker is hand-authored source, exactly the category the check exists to watch, and the only thing the second exclusion would have bought is one convenient commit. The discriminator is cheap and worth applying every time an exclusion is tempting: **would I add this exclusion if the change were someone else's?** For the generated index, yes — it is derived, and no author could ever have declared it. For the checker, obviously not. An exclusion list stays honest exactly as long as each entry answers that question the same way regardless of who is asking.
- seen: Sprint-044
- count: 1
- promoted: no
- related: L-058 (a gate's worst failure is the silent false-negative — this is how one gets created deliberately) · L-076 (narrowing coverage carries an extra proof obligation) · TD-022

---

## L-081 [tags: tooling] [status: active]: **An environment workaround is inherited — it applies to every child process, so it can cause a second bug far from where it was set, in a component that never heard of it.** `MSYS_NO_PATHCONV=1` is exported on Git-Bash hosts so a leading-slash prompt isn't rewritten into a Windows path before reaching `claude.exe` (L-067). Because it is *exported*, it also reached the QA gate and every fixture harness the gate spawns, where it disabled path translation and broke `git -C` on a POSIX path. Symptom: `72 pass, 1 fail` from inside the launcher against `73 pass, 0 fail` standalone, repeatably — and the failing message, `could not resolve live HEAD`, was the exact string a tech-debt row had been carrying for two sprints under two different wrong diagnoses. What made it near-invisible is the distance: the variable is set at the *trigger*, the failure appears in an *unrelated gate two layers down*, and nothing in either place mentions the other. Two rules: **scope an env workaround to the single invocation that needs it** rather than exporting it, and when a check behaves differently in two contexts, **diff the environments before diffing the code** — the answer was never in the harness.
- seen: Sprint-044
- count: 1
- promoted: no
- related: L-067 (its first occurrence — same variable, narrower blast radius) · L-078 (a green result from a broken setup) · TD-024 (the row it root-caused)

---

## L-080 [tags: process] [status: active]: **A `Depends-on` edge orders the work, not the reading — a later task can contradict the change it was sequenced behind.** SPRINT-044's T3 depended on T2 precisely so it would land after T2 moved the allowlist from a CLI string into settings permissions. It landed after, and still shipped a launcher that hard-required `--allowedTools` — rejecting the exact invocation T2 had just made canonical. The dependency did its job perfectly; nothing about it makes the second implementer *read* the first's change, and a dispatched agent starts from the brief plus the repo, not from the sibling task's diff. Generalisation: an edge guarantees ordering, never context transfer. When task B depends on task A because A **changes a contract B consumes** — as opposed to merely touching the same file — B's brief has to state the new contract explicitly. Cheap tell at planning time: if you can describe the edge as "B must not contradict A", the edge alone will not achieve it.
- seen: Sprint-044
- count: 1
- promoted: no
- related: L-020 (shipping ≠ wiring — this is its sequencing form) · L-071 (a declaration cannot carry what its author did not know) · dispatch.md § Hand the sub-agent its procedure skill

---

## L-079 [tags: process] [status: active]: **Making a command satisfy a permission matcher can remove what was anchoring it — command *safety* and command *anchoring* are different properties, and fixing one can silently break the other.** SPRINT-043 found that `dontAsk` denies a permitted command when it is wrapped in `cd X && … 2>&1` (L-077), so the run's natural correction was to issue everything bare. That stripped the `cd` prefix which — unnoticed — had been the only thing pinning each command to the main tree. The shell's cwd persists across calls, an earlier verification had left it inside an agent worktree, and the next three "bare, therefore safe" commands ran there: the integration worktree was created nested inside an agent worktree, and `git merge --ff-only` advanced an agent's branch instead of `main`. Nothing was lost, and nothing detected it either — it surfaced only by reading the command's actual output and noticing a sha (`Updating c94a8c0..`) that had no business appearing. The durable form: when you change *how* a command is issued to satisfy one constraint, re-ask what the old form was silently providing. Anchor explicitly instead (`git -C <abs-path>`), so the property survives the rewrite rather than riding on a prefix.
- seen: Sprint-043
- count: 1
- promoted: no
- related: L-077 (the constraint that forced the rewrite — same run) · L-060 (caught by inspecting the output, not the status) · TD-023

---

## L-078 [tags: tooling] [status: active]: **A fixture harness that builds its own environment can fail to build it and still report green — the setup failure routes every case into a *different* check that passes its assertion for the wrong reason.** SPRINT-043 T1 shipped a harness whose fixtures create throwaway git repos via `mktemp -d` + `git init`. On this Windows/MSYS host `git -C` cannot resolve the `/d/tmp/...` path `mktemp -d` returns, so every setup commit silently failed, every fixture sprint kept its placeholder `plan_commit:`, and cases written to exercise a real git diff instead tripped the checker's *`plan_commit not recorded`* branch. Some assertions still matched, so the harness printed all-green while never once running the check it existed to guard. This is L-058's worst case reached from a new direction — not a missing must-FAIL fixture, but a present one that never got to fail — and it is invisible to exit codes, which is why it survived the implementing agent's own verification and was caught only by an independent pre-merge review. The general rule: a harness that constructs its fixtures must assert the **construction** succeeded, not just that the assertions matched. A green test whose setup failed is not a weaker signal than no test — it is a worse one, because it is trusted.
- seen: Sprint-043
- count: 1
- promoted: no
- related: L-058 (must-FAIL fixtures — this is the "fixture never ran" case) · L-075 (its mirror: validate the fixture holds the violation) · L-060 (the artifact, not the report) · TD-024

---

## L-077 [tags: process] [status: active]: **An allowlist derivation answers *which* commands the run may issue, never *in what form* — and a permission matcher reads the literal invocation, so a correctly-derived list still denies the landing path.** SPRINT-042 T1 fixed night-run allowlists by deriving them from four sources instead of one, closing the gap that stranded SPRINT-041's merge-back on a denial. SPRINT-043 tested that fix and it held: `git worktree add` · `merge --no-ff` · `worktree remove` · `prune` were all authorized and both units landed. But the same command was *denied* when issued as `cd X && git worktree add … 2>&1 && echo …` and *permitted* issued bare — character-for-character the same operation, matched differently. So a run can derive its allowlist perfectly from all four sources and still lose the shared landing path, which is the exact failure the four-source rule exists to prevent, reached by a different route. Two rules now point the same way for unrelated reasons: L-057 says never pipe a gate because a pipeline's status is its last command's; this says never chain a permitted command because the matcher stops recognizing it. One command per invocation, anchored with `git -C <abs-path>` rather than a `cd` prefix (L-079).
- seen: Sprint-043
- count: 1
- promoted: no
- related: L-072 (scope the terminal step hardest — same choke point) · L-057 (never pipe a gate — converging rule) · L-079 (what the fix for this broke) · TD-023 · night-run.md Part 1

---

## L-076 [tags: process] [status: active]: **When a gate's coverage is deliberately narrowed, demonstrate the newly-uncovered case passing silently — otherwise the trade is described rather than measured.** SPRINT-042 T4 moved three slow harnesses behind an opt-in flag, cutting the always-on gate 84s → 57s. The DoD asked to prove the *retained* checks still fail correctly, and they do; but the decision-relevant fact is the other half — what a bare run now misses. Breaking a selftest's subject leaves the bare gate at a clean **70 pass, 0 fail**, and only `QA_FULL=1` catches it. That number is what makes the trade legible: a reviewer can weigh "33% faster" against "this specific class is now invisible by default" instead of against an adjective. The general move: a change that *removes* coverage carries an extra proof obligation its additive sibling does not — the must-FAIL fixture shows what the gate still catches, and a **must-not-catch demonstration** shows what it no longer does. Skipping the second is how a narrowing ships as a pure win and is remembered as one, right up until the uncovered case fires.
- seen: Sprint-042
- count: 1
- promoted: no
- related: L-058 (a gate's worst failure is the silent false-negative — this is its coverage-reduction case) · L-065 (a check's comment as a claim to be tested) · TD-016

---

## L-075 [tags: process] [status: active]: **A negative test that fails to fail is indistinguishable from a broken fixture — validate that the fixture holds the violation before concluding the guard missed it.** Verifying SPRINT-042 T3, an adversarial case appeared to expose a false negative: a file named in a DoD line, absent from `Layers:`, went unreported. The guard was fine. My `sed` had targeted `- [x]` while that DoD was still unticked, so the injection silently never landed and the checker correctly passed a clean file — a green result from an empty test, which looks exactly like a green result from a blind test. Caught only by grepping the scratch file for the string I thought I had injected, one step before filing a defect against working code. The symmetry is the lesson: L-058 says do not trust a guard you have not seen fail, and this is its mirror — do not trust a *failure to fail* you have not seen the input for. Both reduce to the same discipline as CLAUDE.md's trap (c): inspect the artifact, not the report about it. A test's artifact is its fixture, and mine was never inspected until it had already produced a conclusion.
- seen: Sprint-042
- count: 1
- promoted: no
- related: L-058 (must-FAIL fixtures) · L-065 (construct the violation adversarially — the pass that produced this fixture) · L-045 · CLAUDE.md Edit-safety trap (c)

---

## L-074 [tags: process] [status: active]: **A second source derived from *authored* text closes the forgetting gap, not the inventing gap — only an *observed* source closes both.** SPRINT-042 T3 fixed TD-020 by cross-checking a sprint Plan's hand-written `Layers:` against the files named in each task's own DoD prose, negative-tested against SPRINT-041's real recorded miss. It works, and it was defeated on the day it shipped: T3 created a new implementation file, that file is absent from T3's own `Layers:`, and the check passes the Plan regardless — because a DoD written at promote cannot name a file invented during implementation. Both sources are *predictions* by the same author at the same moment, so they share a failure mode no amount of cross-checking between them removes. The distinguishing question for any "add a second source" fix: are the two sources independent in **origin**, or only in **location**? Two documents written by one person at one time are one source in two places. The escape is an observation — here, the actual touched-file set at commit time, which reads what happened instead of what was foreseen.
- seen: Sprint-042
- count: 1
- promoted: no
- related: L-071 (its direct parent — consistency vs completeness) · L-066 (derived-from-disk beats hand-maintained) · TD-020 · TD-022

---

## L-073 [tags: process] [status: active]: **State an autonomous run's own cost at pre-flight, separately from the cost of verifying its tasks.** SPRINT-041 was framed at promote as "zero API cost" — true of the *tasks*, whose acceptance needed no paid behavioural fixtures, and false of the *run*, which spent **$6.60** on two ~25-line changes (coordinator plus two worktree agents, 15 turns) doing work a live session would have done for a fraction of it. The two budgets are unrelated and were conflated in a single reassuring phrase, which is what let the number arrive as a surprise afterwards rather than as an input to the decision to fire. Two consequences: fan-out cost scales with **branch-count × substrate-size** (every branch re-pays the full CLAUDE.md + tool context before doing any work — ADR-010's addendum, now with a measured figure attached), so parallel dispatch is a poor trade on small surgical tasks however disjoint they are; and this is the **first real calibration datum** for what an unattended run costs per unit of work — one point, so treat any extrapolation to a full-night window as an estimate, not a budget.
- seen: Sprint-041
- count: 1
- promoted: no
- related: ADR-010 (dispatch doctrine + the fan-out cost addendum) · L-072 (same run) · night-run.md Part 1 (pre-flight — where the run's own cost belongs)

---

## L-072 [tags: process] [status: promoted]: the terminal step is the choke point every unit shares — scope its permissions harder than the per-task ones.
- **L-072 → promoted: `.claude/CONTEXT.md` § Gates, Unattended block ("Scope the terminal step hardest")** — the durable rule is the record now (§11 collapse, SPRINT-042 close). Body: SPRINT-041 + git history. Shipped as SPRINT-042 T1.

---

## L-071 [tags: process] [status: active]: **A mechanical check over a hand-written declaration validates that declaration's consistency, never its completeness.** SPRINT-041's dispatch preflight ran its shared-file single-owner check and reported CLEAR; both tasks then edited `TECH-DEBT.md` concurrently in separate worktrees, because neither task's `Layers:` listed it — even though each task's DoD explicitly required marking its own TD resolved. The check's logic is sound and was negative-tested; the *input* was an author's memory at promote time, and the guard inherited its blind spot silently. They merged clean only because the hunks sat ~19 lines apart. The distinguishing property: a gate that reads a manifest cannot detect an **omission** from that manifest, because omission looks identical to absence — so the only fix is a second, independently-derived source to diff against (here: the touched-file set implied by each task's own DoD prose). Ask of any declaration-driven gate: *what would a forgotten entry look like?* If the answer is "a pass", the gate is guarding the honest case only.
- seen: Sprint-041
- count: 1
- promoted: no
- related: L-058 (a gate's worst failure is the silent false-negative) · L-065 (a check whose comment asserts more than its code tests) · L-066 (a hardcoded sibling list goes stale mid-wave — same family: derived-from-disk beats hand-maintained) · TD-020

---

## L-070 [tags: tooling] [status: active]: In a session holding **two shells** (PowerShell primary, Bash also available), the *tool* decides the syntax — and a here-string that is valid in one is inert text in the other. `git commit -m @'…'@` sent through the Bash tool stored a commit whose subject was a lone `@`, at **exit 0**: git received the literal `@` as the message's first line, so `git log --oneline` read `@ docs(triage): …`. Nothing failed; only the artifact was wrong. Fix that removes the class rather than the instance: **write any multi-line message to a file and pass `-F <file>`** — no quoting dialect, no shell-boundary transformation to get wrong. Caught because the commit's stored text was inspected (`git log --format=%B | cat -A`) rather than the command's exit code, which is CLAUDE.md's trap (c) working as intended.
- seen: Sprint-040
- count: 1
- promoted: no
- related: L-067 (MSYS path translation — same family: a shell boundary that succeeds loudly and produces the wrong artifact quietly) · L-045 · L-060 · CLAUDE.md Edit-safety trap (c)

---

## L-069 [tags: process] [status: active]: **A behavioural rule ships with its trigger, or it does not ship.** SPRINT-040 T2 wired "write a park record when headless" into `migrate`/`init` and it did not fire — twice, for two different reasons, each visible only on a real run. First attempt: the rule went into the § Sprint lifecycle paragraph, which a `migrate` run never reads (it routes `## Migrate` → `references/migration-map.md`) — L-020's shape, committed *while fixing a TD of that class*. Second attempt: correctly placed in `## Migrate`/`## Init`, it stated **what to do when headless** but never **how the run knows it is** — and since waiting in prose is correct when a human is watching, the clause was unreachable by construction. What made both entry points comply immediately was the **detection cue**: probe `ToolSearch select:AskUserQuestion`. That also explains the SPRINT-039 result nobody had explained — `promote` and `/triage` complied while `migrate`/`init` didn't, because their text *names the observable*, which prompts the probe. Generalisation: a conditional instruction needs its condition's **observable** shipped beside it; without one the branch is dead text that reads as complete. Cost of establishing this: 4 real headless runs, $2.10 — inspection passed both defects.
- seen: Sprint-040
- count: 1
- promoted: no
- related: L-020 (wire a capability into every triggering job — this is its sharper form: wiring the *trigger*, not just the location) · L-007 (spec-only debt) · L-016 (verify on the consumer path) · TD-017

---

## L-068 [tags: process] [status: active]: A **deferral with a written kill-switch** closes itself without re-litigation — and that is the whole value. ADR-013 deferred the checkpointed run-state file behind a named promotion trigger plus a dated expiry ("unfired by SPRINT-040 promote → auto-close as rejected"). At SPRINT-040 triage the decision took no debate: the trigger provably never fired (SPRINT-039 T1's five real headless fixtures all completed or parked with a readable trail), so the pre-agreed answer applied and TASK-120 routed to `.out-of-scope/` in one step. Contrast the default shape — an open `blocked` task with no expiry, which is re-argued at every promote and drifts toward "never" without anyone deciding it. The pattern to reuse: when deferring, write **what would have to happen** and **by when**, so the null result is itself a verdict rather than an absence of one.
- seen: Sprint-040
- count: 1
- promoted: no
- related: ADR-013 (graduation contract) · `.out-of-scope/checkpointed-run-state.md` · `.out-of-scope/run-event-log.md` (sibling option, rejected outright)

---

## L-067 [tags: tooling] [status: promoted]: `MSYS_NO_PATHCONV=1` disables path translation for every argument — and is inherited by every child.
- **L-067 → promoted: `.claude/CLAUDE.md` Edit-safety trap (d)** — the durable rule is the record now (§11 collapse, SPRINT-045 promote). Body: git + L-081, which carries the second occurrence and the TD-024 root cause.

---

## L-066 [tags: process] [status: active]: In a parallel wave, a task that hardcodes a list of its siblings' artifacts is stale the moment a concurrent task adds one — and **neither agent can see it**. SPRINT-039 W2: T3 wired a 5-entry list of zero-API eval harnesses into `qa-check`; T2, running concurrently, landed a 6th. T3's list was correct when written and wrong when merged, leaving a harness that exists but is never reached — TD-013's exact shape, recreated the same day TD-013 was resolved. Only the coordinator's post-merge interaction check could catch it, because per-branch review sees one side. Fix the class, not the instance: have the list **check itself against disk** and FAIL on anything neither included nor *explicitly* excluded-with-a-reason. Note the rejected alternative — globbing everything would auto-enroll a future *paid* harness into an always-on gate, which is worse than the gap.
- seen: Sprint-039
- count: 1
- promoted: no
- related: L-047 (a derived view regenerated mid-wave is stale on arrival — same wave-timing class) · L-020 · TD-013

---

## L-065 [tags: tooling] [status: active]: A check whose **comment asserts more than its code tests** is a false-negative already written — and the must-FAIL leg that would expose it is the one exercising the **named** violation, not an adjacent one. SPRINT-039 T1's `originals-untouched` said "still present, **untouched**" but tested only `[ -f ]` existence; its must-FAIL leg tested *deletion*, so *mutation* was never probed. An unauthorized content edit folded via `git commit --amend` (commit count 1, tree clean) produced a full **exit-0 all-PASS**, and the neighbouring commit-count check did not backstop it. Found only by an adversarial reviewer who constructed the violation rather than reading the code. Two rules: when a check cannot inspect its subject (missing baseline, unverifiable remote), that is a **named FAIL**, never a pass; and read every gate's comment as a *claim to be tested*, since the gap between what it promises and what it executes is invisible to a green run.
- seen: Sprint-039
- count: 1
- promoted: no
- related: L-058 (must-FAIL fixture per check — this is its sharp edge) · L-062 (review a subagent's reasoning) · L-056 (the author cannot see their own class)

---

## L-064 [tags: process] [status: active]: The unattended contract's refusal was about **destructiveness**, not about the gate. SPRINT-038 twice failed to induce a violating run and recorded the ambiguity as L-061; SPRINT-039 T2 isolated the variable by swapping the gated action from a file deletion to a **pure judgement/approval call with no data loss**, reusing the identical weakening mechanism. The model **self-approved** — resolved the open question, wrote the file, committed, ticked the DoD, no park record — and then, *within the same run*, correctly **parked** a later genuinely lossy step. The split therefore holds **inside one run**, which is far stronger than any number of separate refusals. Consequences: the eval suite has now caught a real violation (labelled strength raised, still short of "catches every future violation"), and a HITL gate guarding a **non-destructive** step should not be assumed self-enforcing by model priors — that is exactly where the written contract has to carry the weight. Method note: the answer only counts because *both* outcomes were pre-declared as successes and forcing a violation was banned up front.
- seen: Sprint-039
- count: 1
- promoted: no
- related: L-061 (**narrowed by this, not repeated** — a `count` bump would have erased the correction) · L-053 (isolate the variable) · L-052

---

## L-063 [tags: docs] [status: active]: In a repo that **documents a standard**, a repo-wide path rename cannot be a find/replace — every occurrence is either a link to our own file (rewrite) or a description of the standard itself (must NOT change). Migrating `docs/CHANGELOG.md` → root would have rewritten the migration map's own **source column** (it maps *from* the legacy path, so that path must stay named), DOCS_Guide's "still matched, second" note, `release-patch`'s legacy-detection fallback, and `prime`'s legacy read-order row — i.e. corrupted the very standard consumers rely on to migrate. Append-only files (ADRs) add a third class: their stale link is stale *by design*. Classify every occurrence before touching one, and **assert the prohibited paths were untouched afterwards** (`git diff --name-only`) rather than trusting intent.
- seen: Sprint-038
- count: 1
- promoted: no
- related: L-015 (consumer-leak class) · ADR-012

---

## L-062 [tags: process] [status: active]: "Retain the fixtures" needs a **three-way** split, or it gets argued away: the fixture **input** (deterministic, retain), the **assertions** over a finished run's artifacts (deterministic, retain), and the **run itself** (nondeterministic + costly, correctly on-demand). SPRINT-038 T2a declared behavioural fixtures unretainable *as a class* by conflating all three, and checked in nothing; T2b then followed that precedent and also checked in nothing — one task after the retention rule was promoted into CLAUDE.md. Salvage cost nothing (the scratch repos were intact) and the retained assertion script immediately caught a silent false-negative. **Mechanism worth naming: a framing one subagent asserts, and the coordinator commits without challenge, becomes binding on the next subagent.** Review a subagent's *reasoning*, not just its diff.
- seen: Sprint-038
- count: 1
- promoted: no
- related: L-058 · TD-012 · L-007

---

## L-061 [tags: process] [status: active]: A safety contract written as **prose in a doc** cannot be negative-tested by weakening that doc — the model's own priors hold the line independently of what the procedure says. Two attempts to induce a real violating run (Part 0's park protocol inverted, loaded via `--plugin-dir`, all "this is a fixture" tells removed) both failed: the model declined to self-approve the destructive step *even though the loaded procedure explicitly authorised it*, citing its own priors rather than the doc. Two consequences: (a) a behavioural eval suite over such a contract can validate its **observable artifacts** but cannot prove it catches a violation — say so rather than implying regression-gate strength; (b) the doc may be getting credit for behaviour that would happen anyway, so "the agent honoured our contract unprompted" is **weak evidence** the contract caused it. The contract still earns its place by fixing *which* artifact gets written and where — that part is real and testable.
- seen: Sprint-038
- count: 1
- promoted: no
- related: L-016 (verify on the consumer path) · L-057 · ADR-013 · **L-064 (SPRINT-039 T2 narrowed this: the refusal was about destructiveness, not the gate — read L-064 before citing this entry)**

---

## L-060 [tags: tooling] [status: promoted]: match the quoting form to the tool actually executing — and when a command's job is to *record* text, inspect the stored text, not the exit code.
- **L-060 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; promoted as part of the 5-entry cluster (L-045 · L-049 · L-057 · L-059 · L-060, 4 sprints).

---

## L-059 [tags: tooling] [status: promoted]: a non-zero status with no report behind it is not a verdict — the failure can be the plumbing rather than the gate.
- **L-059 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; a failed redirect reported EXIT=1 while qa-check never ran. Part of the 5-entry cluster (4 sprints).

---

## L-058 [tags: tooling] [status: promoted]: A gate's worst failure is the silent false-negative — only a must-FAIL fixture per check exposes it, and the fixtures must be retained.
- **L-058 → promoted: `.claude/CLAUDE.md` anti-patterns** — the durable rule is the record now (§11 collapse; folded into the spec-only-debt bullet, whose "exercised once on real input" bar it completes for gates). Body: git. seen Sprint-036 · Sprint-037, count 2. *(Form normalised SPRINT-062 T3 — this entry was the only one of thirty promoted entries written without the bold pointer wrapper, and it defeated a uniform match across the corpus.)*
- related: L-007 · L-057 · L-059 · TD-012 (the retention leg, still open)

---

## L-057 [tags: tooling] [status: promoted]: a gate piped into a formatter stops gating — POSIX pipeline status is the last command's, so run the gate bare or gate on its captured status.
- **L-057 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; part of the 5-entry cluster (4 sprints). See L-045 for why `count` never fired on this pair.

---

## L-056 [tags: process] [status: active]: A defect *class* fixed in one file recurs in text newly written the same sprint — and the author cannot see it. SPRINT-035 T3 resolved TD-010 (repo-local path leaked into shipped skill text, the L-015 class); two tasks later T5 wrote a fresh instance of the same class into the shipped SPRINT template (`qa-check.sh` cited as an authoritative enforcer consumers don't have). Only the fresh-context reviewer caught it. Fixing an instance doesn't inoculate the sprint against the class: when writing NEW shipped text, grep for the class just fixed, and keep the isolated review pass even in the sprint that is busy fixing that very class.
- seen: Sprint-035
- count: 1
- promoted: no
- related: L-015 (the class) · L-006 (fresh-context review as the catch mechanism) · L-009

---

## L-055 [tags: tooling] [status: active]: Agent-tool worktrees branch from the SESSION-START commit, not current main — every mid-session commit before dispatch diverges the fleet's base. SPRINT-035 wave 1: four parallel worktree agents all branched from pre-promote HEAD; merges became cherry-picks, and one agent reported "TASK entries missing" because its tree predated the promote commit — undetected until merge-back. Treat the branch point as *declared state, verified at spawn*, never assumed: tell the agent what base it should see, have it verify, halt on mismatch (→ TASK-118 / ADR-013's `base_ref` condition; the same check must re-run at every wave boundary, since HEAD moves as waves land).
- seen: Sprint-035
- count: 1
- promoted: no
- related: L-044 (worktree mechanics) · L-020 (wire the check at the entry point, not inside) · ADR-013

---

## L-054 [tags: process] [status: active]: A guard that runs *inside* the process it protects cannot stop the decision to start that process. `sprint-bulk` step 0 asked exactly the right question — "is there a promoted sprint?" — but it executes inside the spawned headless run, where there is no ask channel: it can halt, never prevent or ask. So "run a night run for `<un-promoted intent>`" spawned first and discovered the problem second, in the one context that cannot report it. The entry-side check has to live in the session doing the spawning. Generalization: when a rule protects a boundary crossing, ask which *side* of the boundary the check runs on — a correct check on the wrong side reads as coverage and provides none. Corollary on L-020: the promoted wiring-check enumerates a capability's trigger points and downstream consumers, which is why this passed review — the *entry path into* the capability was never read as one of its trigger points.
- seen: Sprint-034
- count: 1
- promoted: no
- related: L-020 (shipped ≠ wired — this is its entry-side blind spot) · L-016 (the consumer path is where it surfaced) · L-007

---

## L-053 [tags: process] [status: active]: A new rule's value can sit *after* the decision it appears to be about — and a control that shares an independent stop-reason proves nothing. SPRINT-033 encoded "never self-approve a HITL step unattended", then tested it: a pre-contract control (worktree at the prior release) refused the unapprovable step in near-identical terms to the post-contract HEAD. The refusal instinct was already there; what only HEAD produced was the *protocol* after refusing — park record, `parked-hitl` rollup line, continue disjoint work, clean halt. The first comparison was also confounded (an open DoD gave both arms a second reason to stop) and had to be re-scoped to isolate the variable. Before claiming a change caused a behaviour: isolate the variable, and check whether the real gap is the decision or what follows it.
- seen: Sprint-033
- count: 1
- promoted: no
- related: L-007 (exercising on real input is what exposed it) · L-052 (same sprint, same test pass)

---

## L-052 [tags: process] [status: active]: A spec's inaccurate mechanism becomes agent reasoning verbatim — so platform facts get *run*, not inferred. SPRINT-033's contract stated that under `--permission-mode dontAsk` a gate `AskUserQuestion` "comes back denied, not answered" (inferred from the permission-mode docs). A real headless run showed the tool is **not registered in a headless session at all** — no ask channel to deny — and the session is flagged non-interactive; the observed pressure is therefore an agent that *cannot* ask reasoning the answer out and proceeding. A later run then quoted the wrong mechanism straight back out of the spec. Any platform behaviour a rule depends on is verified by executing it once; documentation-derived mechanism is a hypothesis until then.
- seen: Sprint-033
- count: 1
- promoted: no
- related: L-007 (spec-only debt — the same "exercise it once" discipline) · L-053 (same test pass)

---

## L-051 [tags: docs] [status: active]: A placement-standard row without a full explicit path invites a mis-scaffold — DOCS_Guide §2 listed the ADR index as bare "`DECISIONS.md`" (no `docs/` prefix), and the T7 three-tier exercise scaffolded it at fixture root before catching the ambiguity by cross-inference from README.md.template's docs-map link (SPRINT-032). A generation standard is executed literally by cold-context agents: every §2-class row states its full path from repo root; disambiguation-by-sibling-inference is a trap. Fixed same-sprint (row now says "both under `docs/`").
- seen: Sprint-032
- count: 1
- promoted: no
- related: L-001 (the original no-placement-defined gap — same failure class at standard scale) · L-007 (exercising on real input is what surfaced it)

---

## L-050 [tags: docs] [status: active]: A shipped template carried a repo-local task ID — `SPRINT.md.template`'s Retro line and DOCS_Guide §10 both pointed at lean-flow's own `TASK-040`, surviving multiple L-015 consumer-leak sweeps because those sweeps grep for repo-specific PATHS (`scripts/…`, `docs/knowledge-index.md`), not repo-local IDs (SPRINT-031: found only when the referenced task was archived and the pointer dangled). Consumer-leak sweeps must also match ID namespaces (`TASK-`/`TD-`/`L-`/`ADR-` + repo names) inside `skills/**/templates/` + `references/`.
- seen: Sprint-031
- count: 1
- promoted: no
- related: L-015 (consumer-leak class — promoted) · L-048 (same shape for version strings: the sweep only finds what its pattern names)

---

## L-049 [tags: process] [status: promoted]: in a fan-out the per-unit output FILE is the success signal — a killed subagent can report failure over valid work already on disk.
- **L-049 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c), fan-out leg** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; part of the 5-entry cluster (4 sprints). Related surface: dispatch.md § Merge-back queue · night-run.md per-task commit checkpoint.

---

## L-048 [tags: tooling] [status: active]: release-patch bumps only the manifest cascade — a version string echoed OUTSIDE the manifests (README footer `v1.14.1`) shipped stale in the same release commit; qa-check's footer↔manifest lint caught it one step later (SPRINT-030 batch: v1.14.2 released, footer fixed in a trailing commit). Version echoes live outside the skill's step-5 stale-doc clear (which only sees `last_updated:` frontmatter) — at release, grep the OLD version string repo-wide before emitting the push gate.
- seen: Sprint-030
- count: 1
- promoted: no
- related: L-013 (a check is only real if it runs — qa-check ran and caught it, but post-release)

---

## L-047 [tags: process] [status: active]: A derived view regenerated mid-wave is stale on arrival — `gen-index.sh` ran while two parallel agents were still writing their research docs, so the very next `qa-check` FAILed "knowledge index STALE" (SPRINT-028: the coordinator regenerated after T1's notification but before T2/T3 landed). The coordinator owns not just the regen but its *timing*: regenerate derived views (index, graph view, any generated artifact) only after the whole wave settles, immediately before the gate that checks them.
- seen: Sprint-028
- count: 1
- promoted: no
- related: L-013 (a check is only real if read) · TASK-040 guardrail (ii) (read-time staleness must fail LOUD — it did, working as designed)

---

## L-046 [tags: tooling] [status: active]: Agent worktrees fork from the REMOTE default branch, not local HEAD (unless `worktree.baseRef: "head"`) — a wave dispatched over unpushed local commits hands every agent a tree missing them (SPRINT-026: both agents lacked the very research docs they were briefed on; both correctly fell back to `git show main:<path>`). Brief the read-fallback explicitly, or set baseRef; the three-way merge reconciles the stale base as long as agents touch only their own files. Encoded in dispatch.md § Worktree dispatch protocol (base-ref caveat).
- seen: Sprint-026
- count: 1
- promoted: no
- related: L-044 · L-043 · dispatch.md base-ref caveat

---

## L-045 [tags: process] [status: promoted]: a piped quality gate masks its exit code — and at close, check whether a "new" learning is an existing entry's second sighting, or `count` never reaches its trigger.
- **L-045 → promoted: `.claude/CLAUDE.md` Edit-safety trap (c)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; first of the class, recurred ten sprints later as L-057, which is how the promotion miss was itself found.

---

## L-044 [tags: tooling] [status: promoted]: leave a worktree directory before removing it, and retry from a fresh shell — the Windows handle-lock caveat.
- **L-044 → promoted: dispatch.md § Merge-back queue** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; seen Sprint-025 + Sprint-026.

---

## L-043 [tags: edit-safety] [status: active]: Parallel-dispatched subagents must NEVER run tree-wide git state ops (`stash` / `checkout` / `restore` / `reset`) — one agent's `git stash` mid-wave swept a sibling task's uncommitted edits into the stash (SPRINT-024 W1: T8's work looked destroyed for two turns; restored on `pop` — pure luck the window didn't interleave with a write). Fixture-test lints via scratchpad copies or inject-and-immediately-revert with an editing tool; compare baselines via `git show REF:file`, never by mutating the shared tree. Ban stated verbatim in every parallel-wave dispatch brief from W2 on.
- seen: Sprint-024
- count: 1
- promoted: no
- related: L-010 (repo source vs cache) · the retired per-hunk-staging rule (now a CLAUDE.md anti-pattern)

---

## L-021 [tags: tooling] [status: promoted]: a live session keeps the skill version it started with — read the base-dir version in each invocation header, never `/plugin`'s report.
- **L-021 → promoted: `.claude/CLAUDE.md` install-cache anti-pattern** (folded into L-010's bullet: *running* from the cache is the sibling of *editing* it) — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-023 read it as a code gap, Sprint-039 ran a whole sprint stale and survived only by reading references from the repo. Related: TD-015 (nothing guards the interactive path).

---

## L-020 [tags: process] [status: promoted]: shipping ≠ wiring — a new capability must fire end-to-end through every job that triggers or chains it.
- **L-020 → promoted: CLAUDE.md anti-pattern + DoD wiring check** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; seen Sprint-022 + Sprint-024 + **Sprint-074 (×3)**: T3 changed a checker's verdict token from `PASS` to a named `SKIP`, and `qa-check.sh`'s leg both **counted only `^PASS`** and **did not echo that checker's output on success** — so the new verdict would have been tallied as nothing and printed nowhere, rendering as *"0 sprint files verified — nothing in scope"*. A cure that reaches no reader is not shipped; caught before commit because the wiring was checked rather than assumed.

---

## L-019 [tags: process] [status: active]: Same-provider model tiers don't decorrelate *factual* errors — cross-tier ≠ cross-provider. Probe (TASK-065, SPRINT-021 T2): one factual claim with knowable ground truth run across Haiku/Sonnet/Opus/Fable — the base dispatch tier (Sonnet) was already correct, so Opus/Fable *confirmed* rather than corrected, and Haiku honestly abstained (no hallucination). No divergence → no shared crack exposed to decorrelate. Pattern: model-diversity that shares a training lineage buys confirmation, not error-correction; genuine factual decorrelation needs a *cross-provider* model — the exact dependency that gates the multi-model backend (TASK-047). A cheap probe can only fail to find a crack, never prove absence (N=1, can't manufacture a shared-blind-spot case).
- seen: Sprint-021
- count: 1
- promoted: no
- related: L-018 (framing diverges, factual untestable on a judgment fork) · L-014 (fact-verify) · TASK-047

---

## L-018 [tags: process] [status: active]: A single-model `/council` diverges on *framing* but not (testably) on shared *factual* priors — so "5 personas = theater" is false for framing. Measured (TASK-048, SPRINT-020 T4): on a judgment fork the 5 personas surfaced 5 *distinct* decision dimensions (First Principles strongest 3/5; the lone build-lens flagged biggest blind-spot 5/5) — genuine framing divergence, matching council-improvements finding #4 (single-model reduces framing blind spots). But a judgment fork has no external-facts surface, so it CANNOT test shared knowledge/factual gaps — the real ceiling. Pattern: measure council divergence on the axis you actually doubt; framing divergence is demonstrable and real, the shared-factual-priors crack needs a FACTUAL decision to expose (→ TASK-065).
- seen: Sprint-020
- count: 1
- promoted: no
- related: L-014 (adversarial fact-verify catches shared-prior misattribution) · council-improvements.md finding #4

---

## L-017 [tags: process] [status: promoted]: an adoption scan judges the DELTA over the existing surface, not a tool's standalone merit — map each candidate to what we already have first; only the remainder is a keeper.
- **L-017 → promoted: CLAUDE.md anti-pattern (adoption = delta over existing surface)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-014 (bmad → 5 keepers) + Sprint-016 (structarmed → 0 · brainstorming → ~90% owned).

---

## L-016 [tags: process] [status: promoted]: when the repo lacks a feature's substrate and cannot dogfood it, verify on the consumer path — "didn't fire here" means neither broken nor fine.
- **L-016 → promoted: CLAUDE.md anti-pattern (L-015 extension)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; seen Sprint-015 + Sprint-020.

---

## L-015 [tags: process] [status: promoted]: evaluate every change against the CONSUMER who installs the plugin, not only our own dogfooding — no leaked repo-specific path, and README/CHANGELOG reflect user-visible changes.
- **L-015 → promoted: CLAUDE.md anti-pattern + DoD item ("consumer-facing surface checked")** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; SPRINT-013 leaked gen-index refs into generic skills, SPRINT-014 extended the leak and shipped a stale README.

---

## L-014 [tags: process] [status: active]: Adversarial fact-verify catches misattribution that reasoning-review — and author judgment — miss. SPRINT-014 T3's new `/council` fact-verify pass found `arXiv:2604.03173` is a REAL paper whose *cited figures* were fabricated; the sprint author had earlier dismissed the ID itself as fake — wrong on both counts. A reasoning-only critique cannot catch a claim whose source EXISTS but doesn't say what's claimed; only fetching the primary source does. Pattern: when a decision/doc rests on external citations, verify the source *says the thing*, not merely that a source exists.
- seen: Sprint-014
- count: 1
- promoted: no
- related: L-007 (exercise on real input) · L-006 (fresh eyes catch author-blind gaps)

---

## L-013 [tags: tooling] [status: active]: Convention isn't enforcement — a field/rule called "required" is only required if a check enforces it. SPRINT-013 T1's `[tags][status]` schema was "required" only via template + skill prose until an assume-guilty self-review flagged it; a `qa-check.sh` metadata-completeness lint made it real (a missing/typo'd tag now FAILs, instead of silently dropping from the generated index). Pattern: back any "required" field with a lint, or it silently rots.
- seen: Sprint-013
- count: 1
- promoted: no
- related: L-007 (spec/convention isn't trusted until exercised on real input)

---

## L-012 [tags: docs] [status: active]: References-first under a SKILL cap — when a skill is near its ≤110 cap, add behaviour via `references/` (uncounted, ADR-006) or reword existing lines in place, rather than append a section. SPRINT-012 landed 5 behaviours with `orchestrator/SKILL.md` held at 109/110; a naive "append per task" would have busted the cap. Pattern: at G2, choose the landing spot (references vs body) before editing a near-cap skill.
- seen: Sprint-012
- count: 1
- promoted: no
- related: L-008 (SSOT dedup near cap) · ADR-006 (references uncounted)

---

## L-011 [tags: tooling] [status: active]: A committed shell script must be pinned to LF (`*.sh eol=lf` in `.gitattributes`). On a Windows checkout with `autocrlf`, git rewrites the file to CRLF and the `#!/usr/bin/env sh` shebang gains a trailing `\r` — the interpreter becomes `sh\r` and the script fails to run. Caught only by git's "LF will be replaced by CRLF" warning, not by any test. Pattern: when a markdown/config repo gains its first executable script, add the `eol=lf` attribute in the same change.
- seen: Sprint-008
- count: 1
- promoted: no
- related: L-005 (edit-mechanism discipline — text round-trips corrupt files)

---

## L-010 [tags: tooling] [status: promoted]: when editing an installed plugin the target is the repo source (`skills/…`), never the install cache — a cache Read does not satisfy read-before-edit.
- **L-010 → promoted: CLAUDE.md install-cache anti-pattern** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; seen Sprint-007 + Sprint-009 + **Sprint-047 (count 3)**. L-021 carries the *running*-from-cache sibling.
- Sprint-047's sighting is a **retrieval miss, not a knowledge gap**: the rule was promoted, in context, and still broken — `SPRINT.md.template` was edited in the cache before being caught and redone against the source. A promoted rule that keeps getting broken needs a different intervention than another promotion.

---

## L-009 [tags: edit-safety] [status: promoted]: structure-adjacent edits — table rows, list entries — silently fuse or corrupt neighbours; re-read the whole structure afterwards.
- **L-009 → promoted: CLAUDE.md Edit-safety trap (b)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-007 + Sprint-028 + a third at 029 promote (a TODO.md heading fused into a neighbouring task block) + **Sprint-074 (×4)**: an append to TD-037 landed mid-paragraph and split a sentence in the row's SPRINT-073 re-review, while the inserted lines themselves read perfectly. Caught by re-reading the whole row — which is what the rule instructs — then repaired and re-verified structurally (15 rows before and after, diff `+25/−1`, no reordering). The rule fired correctly; the note is that it fires *after* the damage by design, so the re-read is not optional.

---

## L-008 [tags: docs] [status: promoted]: an SSOT doc accretes duplication of its satellites until it nears its cap — run a periodic dedup pass at promote.
- **L-008 → promoted: CLAUDE.md anti-pattern + TD-006** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-006 + Sprint-008, when CONTEXT.md hit 129/130.

---

## L-007 [tags: process] [status: promoted]: a new behaviour's final DoD must be exercised once on real input — the spec-only-debt trap.
- **L-007 → promoted: CLAUDE.md anti-pattern** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-003 (TD-001) + Sprint-004 (T3/T5). L-058 completes it for gates with the must-FAIL fixture bar.

---

## L-006 [tags: process] [status: promoted]: cold-context review surfaces author-blind spec gaps the author cannot see — 7 in one fresh-install run.
- **L-006 → promoted: orchestrator § Review (the fresh-context Review pass)** — the durable rule is the record now (§11 collapse, SPRINT-047 promote). Body: git; Sprint-003 + Sprint-007. It is what caught L-009's fused table rows.

---

## L-005 [tags: edit-safety] [status: active]: PowerShell `Get-Content`→`Set-Content` round-trips corrupt UTF-8 markdown (em-dashes → mojibake) — edit files with the Write/Edit tools, never shell text pipelines
- seen: Sprint-002
- count: 1
- promoted: no

---

## L-004 [tags: sprint-model] [status: active]: Append-only-forever ledgers contradict LAW 3 — no archive trigger exists anywhere, so TODO.md / CHANGELOG.md bloat in a long agentic loop → fix: TASK-012 (§11 Retention)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-003 [tags: sprint-model] [status: active]: The sprint model assumes a single work stream — one Active Sprint pointer + the "one sprint at a time" rule make two parallel streams in one repo collide on TODO/ledgers → fix: TASK-011 (stream concept)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-002 [tags: process] [status: active]: The detailed grill never fires on the conducted path — task-decomposer's "don't re-interview" escape hatch + sprint-bulk's batch-G2 collapse it to one pass, and G2 is too late anyway (tasks already written) → fix: TASK-010 (grill at intake)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no

---

## L-001 [tags: docs] [status: active]: DOCS_Guide §2 defines no placement — generated docs pile up at the host-repo root, and the standard contradicts lean-flow's own repo (docs/ARCHITECTURE, docs/CHANGELOG) → fix: TASK-009 (placement column + prime/migrate alignment)
- seen: Sprint-001 (dogfood)
- count: 1
- promoted: no
