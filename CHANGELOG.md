---
owner: Maintainer
last_updated: 2026-08-20
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.49.0 — The Conformance Engine (2026-08-20)

MINOR — SPRINT-075, **26 of 26 DoD**, EPIC-004's fourth member sprint and the largest Plan this repo
has run. v1.48.0 shipped one checker that reads the standard. This turns that shape into an **engine**
covering every section, and points it at a repository that never installed lean-flow.

**What changed for you**

- **`sh conformance.sh <repo-dir>` — a conformance report for any repository, from a clone alone.**
  One implementation, two entry points (the repo-root script and this repo's own gate). The spec it
  measures against ships beside it, so your repo does not need a copy; `--spec` overrides.
- **The spec decides what is evaluated, not the code.** Every `## §N` Conformance table is read at
  runtime through `scripts/lib/read-spec-rules.sh`. Re-mark a rule in your spec copy and the engine's
  behaviour changes with no code edit — proven in both directions.
- **Your report and our roadmap are now two different statements.** A rule the spec marks mechanical
  that this engine cannot yet answer is a **`GAP`** line — still named, every time, never silently
  skipped — but it no longer blocks your level or sets your exit code, and engine coverage is reported
  on its own axis. Before this, a four-file repo with **two** real defects was told "level: none — 41
  findings prevent Structural", because 39 of those findings were checkers we had not written.
- **Six rules are answered by the engine**, where it shipped with none: §9's `gates_signed` pair
  (migrated off its standalone script with its findings byte-identical), and the ownership-header family —
  `S1.LAW2` · `S1.LAW3` · `S3.SCHEMA` · `S3.AGENTS` — firing five published names:
  `owner-not-a-role` · `update-trigger-absent` · `ownership-header-missing` ·
  `ownership-header-field-missing` · `agents-ownership-footer-missing`.
- **`owner:` is checked against a role vocabulary you can declare.** §14 marks the rule mechanical
  "against a role vocabulary" and the standard publishes none, so the engine ships a small default and
  reads **`.conformance-roles`** (one role per line) when you provide one — a declared file *replaces*
  the default, so "only these roles" is sayable. Matching is whole-value: `Main` is not `Maintainer`.
- **ADRs are exempt from §3's ownership header, and the report says so.** §4 ships an ADR template
  whose frontmatter is knowledge metadata, not `owner:`/`last_updated:`/`update_trigger:` — so
  reporting ADRs against §3 would tell you to break the standard's own template. The exemption is
  named in the output with its file count, never applied silently.
- **Exit code contract:** non-zero **exactly when a finding about your repository was printed**. Gaps,
  judgment-required rules and implementation-directed rules never set it. You may gate CI on it;
  lean-flow still ships no workflow file and owns no pipeline (**[ADR-027]**).
- **Still no score, grade, or percentage** (§14) — counts only, on both axes. A ratio would improve
  every time the standard declined to automate something.

**Maintainer-facing**

- **Executable code here is consumer-facing now, and ADR-008 says so.** **[ADR-027]** amends it rather
  than superseding it — the hybrid decision is still live; only its maintainer-only premise is gone.
  It also rules on ADR-008's CI sentence: *lean-flow does not own your pipeline*, **not** *lean-flow
  emits nothing a pipeline can use*. EPIC-004 § Closed-when 1 and 5 both tick.
- **The migration reproduced every finding string exactly and flipped the verdict label.** An unsigned
  sprint rendered as `PASS … NOT SIGNED`, reaching `level: Attested`. The driver inferred "passed" from
  "did not fail" — a note-only assertion counted as a pass. The five fixtures all asserted finding
  *text*; a sixth now asserts the **label**. → **L-139**.
- **Two censuses disagreeing by one caught a false negative.** §3's root-README exception was
  implemented as `*/README.md`, which is not "the front-door" but every README at any depth — silently
  dropping a nested doc with no header. A too-broad exclusion fails **green**. → **L-140**.
- **The discrimination pass needed its own discrimination check.** Three seeded breaks whose `sed`
  never matched reported the suite green; a green run behind a patch that never landed is not evidence.
  The harness now reports `SEED-ERROR` on a no-op patch. 10 breaks seeded on the ownership suite, 10
  discriminated — and two of them found real defects rather than confirming the suite. → **L-141**,
  and **L-137** to count 2.
- **A fixture named after the token its own assertion greps for.** The ADR case matched
  `fixtures/ownership-header/` in the report's header line rather than a finding. L-108's documented
  sub-case, verbatim. → **L-108 ×7**.
- **A commit went through a red gate again**, one sprint after L-120 was promoted for exactly this.
  The line was `qa-check > out; echo $?` — the runner reported **`echo`'s** status while the file said
  `1 fail`. The promotion added the action form and still did not fire, because the shape was a
  redirect rather than a pipe. → **L-120 ×4**, re-promoted with the durable form: *read the gate's own
  `N pass, M fail` summary; any exit code arriving through a wrapper is evidence about the wrapper.*
- **T6 made the gate look hung.** The first implementation spawned ~2,800 awk processes (a walk per
  rule, an awk per field per doc). One cached walk and one awk per doc: 47s, verified
  behaviour-identical by counts. Not taken further — one awk over all files drops a zero-byte file
  silently, and trading a silent skip for wall-clock is the wrong trade here. → **TD-066**.
- **The Plan hit its 400-line cap mid-close.** T1/T2/T4/T5 DoD evidence moved to the uncapped Execution
  Log, which is the split ADR-014 exists for; the Plan keeps criterion, `*Verify:*` and a verdict.
- **28 ownership gaps in our own docs** — reported by our own engine, relayed not gated. → **TD-064**.
  §3 owes an explicit ADR row → **TASK-237**; the artefact triage wants re-running as coverage grows →
  **TASK-238**; the dispositions register still counts §13's five under `build` → **TD-065**.

[ADR-027]: docs/adr/ADR-027-executable-code-becomes-consumer-facing.md

---

## v1.48.0 — The First Spec-Driven Checker (2026-08-18)

MINOR — SPRINT-074, **15 of 15 DoD**, EPIC-004's third member sprint. **`spec/STANDARD.md` 0.4.0 →
0.4.1.** v1.47.0 made the standard *readable* by a tool. This is the first tool that actually reads it:
a checker for §13 whose rule set comes from the spec at runtime rather than from its author.

**What changed for you**

- **`scripts/lib/check-attestation.sh` — verify a commit's HITL attestation from a clone alone.**
  `sh check-attestation.sh <repo-dir> <commit-ish>` prints a verdict per §13 rule plus a **level**, and
  works against any repository. The spec it measures against defaults to the copy shipped beside the
  script — your repo does not need one — and `--spec` overrides it.
- **It reports a level and named findings, never a score** (§14). Five published finding names, now in
  `docs/research/conformance-dispositions.md` where the row previously deferred them:
  `attestation-trailers-incomplete` · `attestation-not-on-task-commit` · `evidence-path-unpinned` ·
  `attestation-disagrees-with-sprint` · `attestation-unsigned-claim-only`.
- **An unsigned trailer is reported as a claim, and exits 0.** Perfect trailers over an unsigned commit
  have reached **Gated**, not Attested — a level honestly reached, not a defect, so it does not fail
  your build. Reporting it as Attested is the theatre a conformance level exists to prevent (§13c), and
  the checker will not do it. Run against this repository it reproduces §13d's own worked-example
  verdict unprompted: Gated, `%G? = N`.
- **The two `implementation-directed` rules are excluded because the spec's Mark column says so**, not
  because the author remembered a skip list. Re-mark a rule in your spec copy and the checker stops
  asserting it, with no code change. A rule the spec marks mechanical that the checker cannot answer is
  reported as `rule-unimplemented`; a rule table it cannot parse is `spec-table-unreadable`. Neither
  degrades into checking nothing and exiting clean.
- **No rule in the spec carries `?` any more — 100 classified, 0 unclassified.** `S4.INDEX` is
  Structural/mechanical, `S5.DISCARDLOG` is `implementation-directed` (six now carry that mark). §14's
  counts re-derived to match. PATCH, not MINOR, on the spec: marking an already-stated rule adds no
  obligation, so nothing you satisfy today changes.
- **A mid-flight `qa-check` no longer tells you your `Layers:` are clean when a commit would disagree.**
  The uncommitted leg reports `SKIP … [WIP, unattributed]` naming what it did *not* check, instead of a
  `PASS` indistinguishable from the committed verdict. A file declared by no task still FAILs there,
  exactly as before.

**Maintainer-facing**

- **§14 has no per-rule table** — it is the legend; the tables live in each section's `Conformance.`
  block. The premise "the checker reads §14's tables" had been copied through `TODO.md`, the sprint
  header and the DoD without anyone re-opening §14. → **L-136**, which bumps **L-130** to count 2.
- **Spec-driven is a split, and saying which half is which is the point.** Rule set and marks come from
  the spec; the assertion bodies are code, because "all three required together" and "the `Evidence:`
  value's shape" are different code. Claiming both would be theatre.
- **The first live run found a real fault — in the checker.** `S13.AGREE` demanded the sprint record at
  the `Evidence:` pin, but `gates_signed:` names the sha it was signed *at*, so the field is necessarily
  written later — making every sprint's first attested commit structurally unable to comply. That is
  the uncleanable finding §14 forbids. Now reads at the pin, falls back to the attesting tree, and names
  which answered.
- **All-green on a first run proves nothing**, so the rejected design was seeded: hard-coding the rule
  list reddened **exactly** the two cases that justify the chosen one and correctly left the other
  fourteen green. → **L-137**.
- **A caveat that fires on every tree is read as furniture.** The WIP `SKIP` first counted the raw dirty
  list, so a stray excluded file earned a warning about a check that never ran; it now counts after
  exclusions. Caught by four existing fixtures going red. → **L-138**.
- **TD-037 resolved after 19 sprints and seven reaffirms.** Its cure adds *no* inference — the row's
  standing warning against inferring the in-flight task from open-DoD state is honoured in full.
  Staged-vs-unstaged was rejected because L-042 prescribes `git add -p` for shared files, so the staged
  set spans tasks by design in the only case attribution matters for.
- **The wiring, not the checker, was the near-miss.** `qa-check.sh` counted only `^PASS` and did not
  echo that checker on success, so the new `SKIP` would have rendered as "0 sprint files verified —
  nothing in scope". → **L-020 ×3**.
- **The QA gate goes red on the calendar, not the code** — `gen-index.sh --check` byte-compares a file
  whose `last_updated:` is stamped with today's date. → **TD-063**, ready to schedule, not blocked.
- **A background-task notification reported `exit code 0` over an artifact reading `1 fail`**, twice.
  A fourth reporter channel for **L-120**; the rule held, every verdict was read from the output file.

---

_Older releases (**v1.47.0** and earlier) → [`CHANGELOG-1.47.0.md`](docs/changelog/CHANGELOG-1.47.0.md) → [`CHANGELOG-1.46.0.md`](docs/changelog/CHANGELOG-1.46.0.md) → [`CHANGELOG-1.45.0.md`](docs/changelog/CHANGELOG-1.45.0.md) → [`CHANGELOG-1.44.0.md`](docs/changelog/CHANGELOG-1.44.0.md) → [`CHANGELOG-1.43.0.md`](docs/changelog/CHANGELOG-1.43.0.md) → [`CHANGELOG-1.42.0.md`](docs/changelog/CHANGELOG-1.42.0.md) → [`CHANGELOG-1.41.0.md`](docs/changelog/CHANGELOG-1.41.0.md) → [`CHANGELOG-1.40.0.md`](docs/changelog/CHANGELOG-1.40.0.md) → [`CHANGELOG-1.39.0.md`](docs/changelog/CHANGELOG-1.39.0.md) → [`CHANGELOG-1.38.0.md`](docs/changelog/CHANGELOG-1.38.0.md) → [`CHANGELOG-1.37.0.md`](docs/changelog/CHANGELOG-1.37.0.md) → [`CHANGELOG-1.36.0.md`](docs/changelog/CHANGELOG-1.36.0.md) → [`CHANGELOG-1.35.0.md`](docs/changelog/CHANGELOG-1.35.0.md) → [`CHANGELOG-1.34.0.md`](docs/changelog/CHANGELOG-1.34.0.md) → [`CHANGELOG-1.33.0.md`](docs/changelog/CHANGELOG-1.33.0.md) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
