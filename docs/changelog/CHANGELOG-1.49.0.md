---
owner: Maintainer
last_updated: 2026-08-21
update_trigger: Never — a rotated archive of a shipped version is frozen
status: current
---

# lean-flow — Changelog v1.49.0 (rotated)

> Rotated out of root `CHANGELOG.md` at **SPRINT-077 close**, under STANDARD §11's
> keep-current-plus-previous rule. Frozen: never edited, only linked.

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

_Older releases (**v1.48.0** and earlier) → [`CHANGELOG-1.48.0.md`](CHANGELOG-1.48.0.md)._
