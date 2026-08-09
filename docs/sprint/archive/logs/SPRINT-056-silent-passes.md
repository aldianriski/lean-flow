---
sprint: 056
slug: silent-passes
owner: Maintainer
last_updated: 2026-08-09
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-056 — Execution Log

> Append-only companion to [`../SPRINT-056-silent-passes.md`](../SPRINT-056-silent-passes.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (DOCS_Guide §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

<!-- Newest entries at the BOTTOM: this reads as a chronology, unlike CHANGELOG.md which is
     newest-first. Event is one of: promote · progress · surprise · scope-change · park · blocker ·
     complete · close. -->

### 2026-08-09 | promote | Plan locked at 1f0c012; ownership corrected by the gate before it was signed
The first draft of § Decisions D1 claimed T3 could run parallel with T1/T2.
`check-layers-completeness.sh` rejected the Plan: T3's own DoD wires a retained fixture into
`scripts/qa-check.sh`, which T2 declares. All four tasks do. D1 was rewritten to a strictly sequential
T1→T2→T3→T4 chain and T3 gained `scripts/qa-check.sh` in `Layers:` plus `Depends-on: T2`. Recorded
because this is L-099 caught by the mechanism rather than by a person — the ownership decision was
wrong in prose and the checker reads declarations, not intent.

### 2026-08-09 | progress | G2 signed — four design forks ruled, each against evidence rather than the filed hypothesis
All four `assumes:` (A1–A4) were unconfirmed and blocked G2, so each was re-derived before sign-off.
Every one of the four resolved *against* the mitigation its TD row proposed, which is L-091 behaving
exactly as promoted.

- **A1 / T1 — patch the snippet; do NOT call `check-layers-completeness.sh`.** TD-040's mitigation
  asked whether the snippet should call the real checker instead of being patched twice. Refuted on
  two independent grounds: `dispatch.md` states the snippet is an *"Optional snippet, dependency-free
  POSIX sh, runnable verbatim"*, so a `scripts/lib/` dependency breaks its own published contract;
  and it would ship a maintainer-only `scripts/…` path inside a consumer-facing skill reference,
  which is the L-015 leak the DoD checklist names explicitly. Third fact that settles it: the checker
  computes none of what the preflight needs — no overlap, no cycle, no wave rank. Only the *parser*
  is common. **Ruling:** patch the snippet, and close the duplication with an `evals/` parity fixture
  that drives one input through both parsers and asserts the same verdict — a check rather than a
  comment (TD-043's own complaint about itself), maintainer-side, leaving the snippet dependency-free.
- **A2 / T2 — separable; split.** See the `scope-change` entry below.
- **A4 / T3 — key the WIP exclusion on phase, via open-DoD state.** The question TD-044 left open
  ("file or phase?") is already answered inside the checker's own comments: every reason on the WIP
  list is *phase-based* ("backlog bookkeeping, written at close", "written AFTER the Plan freezes"),
  while every reason on the committed list is *structural* ("circular", "undeclarable by
  construction", "GENERATED"). So the WIP list is de facto phase-keyed and file-implemented, which is
  precisely how a task whose real work IS editing `TODO.md` passes. **Ruling:** a close-bookkeeping
  file is excluded only while the sprint has zero open DoD; during execution those edits are task work
  and must be declared. Touches the WIP list only, so the deliberate asymmetry survives (T3's hard
  constraint). Distinct from TD-037's warning: that forbids inferring *which task* is in flight; this
  infers only *which phase*, from state the checker already reads. It widens reporting, the safe
  direction — the sibling checker documents that it "fails toward over-reporting by design".
- **A3 / T4 — key the skip on archived location, not on `status`.** A third option TD-042 never
  considered. `close` writes `status: closed` in one commit and the §11 retention pass *moves* the
  file to `docs/sprint/archive/` in a **separate, later** commit. Skipping on location therefore
  leaves the close commit fully validated (the file is still in `docs/sprint/`) while archived history
  stays out of scope — which was always the defensible half of the design. **Ruling:** location-keyed
  skip plus the reporting fix (zero-verified → `note`, not `ok`). The ordering problem is dissolved
  rather than solved, so none of the reconstruct-pre-flip-content machinery TD-042 implies is needed.

### 2026-08-09 | scope-change | T2 split into T2 (caps) + a new T5 (manifest lockstep)
**What broke.** T2 was promoted as one task on the premise that its two halves are one concern —
"coverage hand-listed instead of derived". G2's re-derivation found them separable on mechanism,
evidence and verification: T2 parses a cap out of a markdown table, T5 compares four JSON files to
each other; they share only a slogan. T2's own DoD authorised exactly this ("If G2 rules that caps
derive from §2 but manifests cannot, split before implementing").

**The finding that forced it.** DOCS_Guide §2 does **not** carry every cap `qa-check.sh` enforces —
`skills/*/SKILL.md` at 140 comes from ADR-006 and `docs/sprint/SPRINT-*.md` at 400 from §9/ADR-014.
Deriving the list *only* from §2 would silently drop three checks that run today: a coverage
**reduction** shipped as a coverage increase, which is L-076's exact shape. Merged into one task that
obligation would have been carried by a DoD line about manifests.

**Impact.** T2 narrows to §2-derived cap coverage, and additionally retains the three non-§2 caps as
an explicit allowlist stating each entry's source ADR (L-082: an exclusion earns its place by a
written reason, not by convenience). T5 — manifest lockstep — is appended with `Depends-on: T4`,
last in the `scripts/qa-check.sh` ownership chain, which stays strictly sequential T1→T2→T3→T4→T5.
No task is added to the sprint's *substance*; one task's two halves became two tasks.

**Re-confirm G2.** Owner signed the split, the ownership chain extension and the retained-allowlist
requirement in the same round as A1–A4. G1 scope is unchanged — the sprint still delivers exactly what
§ Scope names.

### 2026-08-09 | complete | T1 — preflight parser patched; the parity fixture caught the old parser reporting nothing at exit 0
Both defects fixed in the `dispatch.md` snippet: `Layers:`/`Depends-on:` now carry an open-declaration
state so **indented continuations** are collected (a `Cites:` continuation deliberately is not — those
tokens are cited, not touched), and the token pattern gained a directory arm
(`[A-Za-z0-9_.-][A-Za-z0-9_./-]*/`) with a prefix-aware `overlaps()` in the awk comparison. A collision
by prefix now names **both** tokens (`evals/fixtures/ ~ evals/fixtures/dispatch-preflight/sprint.md`)
rather than a file neither task declared.

**L-090 pair, both fixtures, measured rather than asserted:**

| fixture | old snippet | new snippet |
|---|---|---|
| `wrapped-layers-unowned` | exit 0 · `PREFLIGHT: CLEAR` | exit 1 · `FAIL shared-file-unowned: shared.md` |
| `directory-token-unowned` | exit 0 · `PREFLIGHT: CLEAR` | exit 1 · `FAIL shared-file-unowned: evals/fixtures/ ~ …` |

**The parity fixture produced the sprint's sharpest result so far.** Driven through the *pre-fix*
snippet it exits **0** and prints `PREFLIGHT: CLEAR` — while reporting **neither** of the two overlaps
the two tasks genuinely share. Same exit code as the fixed parser, empty verdict. An
exit-code-only assertion would have called that a pass, so the parity case asserts on output content
and names the two overlap lines it must see. This is CLAUDE.md trap (c) reproduced in a controlled
setting: a status is evidence about the reporter, never about the artifact (L-060) — and it is worth
recording that the *fixtures for this very task* would have been fooled had they been written the
obvious way.

Regression: the five pre-existing preflight fixtures still pass unchanged, and the live SPRINT-056
Plan still reports `PREFLIGHT: CLEAR` under the new parser. Suite now 10 cases, all green.
Gate: 89 pass, 0 fail.

**Not done, deliberately:** the snippet still duplicates the full checker's parser. G2 ruled against
removing the duplication (the snippet is published dependency-free and runnable-verbatim; a
`scripts/lib/` dependency would be an L-015 leak into a consumer-facing reference), so the duplication
is now *guarded* by the parity case rather than removed. If a third drift appears, the ruling to
revisit is that contract, not the parser.

### 2026-08-09 | surprise | T2 — the DoD's "three non-§2 caps" is wrong; §2 carries all but one
Measured while writing the parser, not assumed. §2's `docs/` table contains
`| sprint/SPRINT-NNN-<slug>.md | lean loop | AI mid-sprint | 400 hard | …`, and the `.claude/` table
carries `CLAUDE.md` 80 and `CONTEXT.md` 130. So of the four globs `qa-check.sh` hand-listed, **three
are §2 rows** and exactly **one** is not: `skills/*/SKILL.md` at 140 (ADR-006), which is a plugin
component budget rather than a documentation row.

The G2 ruling that produced that DoD line said "three live checks would be dropped". That figure was
asserted at the gate and never measured — L-097 firing inside the sprint that promoted L-097, on the
task whose subject is caps. The DoD line is also internally inconsistent: it says "three" and then
lists two. **Correction applied:** the allowlist retains one entry, `skills/*/SKILL.md`, naming
ADR-006 as its authority. The DoD's *intent* — non-§2 caps survive derivation with a written reason —
is unchanged and satisfied; only the count was wrong. Flagged here rather than silently reinterpreted
(L-088), and it wants an owner confirmation at close.

### 2026-08-09 | surprise | T2 — the new check found a FOURTH live breach, and a false negative in itself
**L-102 exactly: the first run is discovery.** Pointed at the live repo before anything was fixed, the
derived check reported the three known research breaches (`loop-hygiene-prd.md` 214,
`graphify-daily-value.md` 157, `graph-engineering.md` 122) **and one nobody had recorded**:
`AGENTS.md` at 11 against its ~10 cap. Coverage went from 4 hand-listed globs over 17 files to 47 cap
checks over 30+ files.

**And the fixtures caught a false negative in the checker itself.** The first version emitted
`prefix<TAB>path<TAB>cap` and read it with `IFS=<tab>`. The root-files table has an **empty** prefix,
and POSIX `read` strips leading whitespace-IFS fields — so every root row shifted by one and was
dropped. `SECURITY.md`, `AGENTS.md` and `TODO.md` were silently uncovered while the live output looked
entirely healthy, because what is missing from a report is invisible in it. Switched to `|`. The
over-cap fixture is what exposed it; the live run alone never would have. That is a gate with a silent
false negative, written *for the sprint about silent false negatives*, caught only because the task's
own DoD demanded a must-FAIL fixture (L-058).

### 2026-08-09 | complete | T2 — cap coverage derived from §2; four pre-existing breaches made visible, not fixed
`scripts/lib/check-doc-caps.sh` parses §2's three tables (first integer of the Cap cell; first
backtick token of the File cell; `NNN`/`<slug>` → globs) and cap-checks every row that states a
number. A row that states a cap but yields no path is a **named FAIL, never a skip** — a derivation
that silently drops what it cannot parse is hand-listing again with the hand-list hidden inside a
parser, and that case has its own fixture.

**The grandfather clause.** Turning coverage on over a never-covered repo surfaced four breaches, and
the DoD forbids fixing the research docs (§7: a diet moves only by ADR). A silent exclusion list would
have reproduced the original defect, so each entry lives in
`scripts/lib/doc-caps-grandfathered.txt` with its count at adoption and **prints on every run**. The
clause still bites: grew past the recorded count → FAIL; over cap but held → reported and named; back
under cap → PASS *and told to delete its own row*. Both directions have fixtures, including the
must-NOT-catch half that makes the trade legible rather than described (L-076).

**Red-on-new / green-on-old, demonstrated on real input rather than a fixture:** the four breaches
existed in this repo before this task and were reported by nothing; they are reported by every run
now. That is the same evidence L-090 asks for, taken from the live repo.

Gate: **120 pass, 0 fail** (89 → 120; +31 checks). Timing measured rather than assumed — the gate was
already **115s at T1**, and is **120s** now, so this task cost ~5s, not the regression it first looked
like. The checker itself went 6s after a cheap containment test replaced two awk spawns per file.

`scripts/lib/doc-caps-grandfathered.txt` was created during implementation and is absent from T2's
frozen `Layers:` — declared mid-sprint per L-100, which this sprint promoted into CONTEXT.md § Sprint
model. Logged, declared, continued.

### 2026-08-09 | complete | T3 — the WIP exclusion list split by kind; the answer was already inside the checker's own comments
The open question TD-044 recorded ("key on the file, or on the phase that touched it?") did not need
a design; it needed someone to read the reasons already written next to each entry. `TODO.md` says
"backlog bookkeeping, **written at close**", `TECH-DEBT.md` "TD marking **moved to close**",
`CHANGELOG.md` "release bookkeeping, **written at close**" — three statements about a *phase*, all
implemented as statements about a *file*. Alongside them sit genuinely structural entries
("GENERATED, never hand-authored", "undeclarable by construction", "created AFTER the Plan freezes")
which are true in every phase. One list, two kinds of reason, uniform implementation — so a
close-time reason silently held during execution, which is the whole of TD-044.

Now: `is_excluded_closetime()` (TODO · TECH-DEBT · CHANGELOG · LEARNINGS) applies **only when the
sprint has zero open DoD**; everything else is structural and applies always. The committed path is
untouched — its stricter list is deliberate and answers attribution by role (T3's hard constraint).
Phase is read, never *which task* is in flight, so TD-037's warning is respected rather than dodged.

**L-090 pair, run against the real recorded case rather than a constructed one.** An uncommitted
`TODO.md` edit while SPRINT-056 has open DoD — SPRINT-055 T6's exact shape:

| | verdict |
|---|---|
| checker at HEAD (pre-T3) | exit 0 · `PASS … (all changed files declared)` |
| checker after T3 | exit 1 · `FAIL … changed but undeclared in any task's Layers:: TODO.md` |

**An existing fixture had to change, and that is the finding worth keeping.** Case 4
(`coordinator-exclusion-safe`) edited `TECH-DEBT.md` under a Plan with an **open** DoD and asserted a
clean run — it encoded the defect as the expected behaviour. Run against the new checker it went red
immediately, which is the correct signal and not a regression. It is now two cases: the same repo
mid-execution (**must FAIL**, close-time file edited as task work) and with its DoD ticked (**must
PASS**, genuinely at close). The second half is not optional — without it this change reads as "stop
excluding close-bookkeeping files", which would flag every real close and be reverted inside a sprint.
`docs/sprint/INDEX.md` stays excluded in both, proving the structural half survived the split.

`docs/QA.md` rewritten to document the two *kinds* rather than the two paths. Gate: 120 pass, 0 fail;
layers-observed suite all green.

### 2026-08-09 | complete | T4 — the ordering problem dissolved instead of solved
TD-042 framed the fix as "validate the close commit *before* the status flip is honoured", which
implies machinery to reconstruct pre-flip content. Re-deriving at G2 found a third option the row
never considered: `close` writes `status: closed` in one commit, and §11's retention pass **moves**
the file to `docs/sprint/archive/` in a **separate, later** commit. So keying the skip on *location*
leaves the close commit fully covered — the file is still in `docs/sprint/` when it lands — while
archived history stays out of scope, which was always the defensible half of the design. No
reconstruction needed; the ordering problem stops existing.

Applied at all three sites that gated on `status = active`: `check-layers-completeness.sh`,
`check-layers-observed.sh`, and `qa-check.sh`'s task-schema leg. Each now skips on `*/archive/*`.

**Reporting half (the other TD-042 defect):** both layers legs printed
`PASS layers … (0 … verified)` when nothing was in scope — a green line over an empty input set,
which is the L-058 family at its purest and is indistinguishable from real coverage. Zero verified
now renders `SKIP (… nothing in scope)` via `note`, so it cannot be counted as a pass. The only
reason the original 7-check drop was ever noticed was someone comparing pass *counts* between two
runs; that is not a control.

**L-090 pair, on a closed sprint carrying a real schema violation:**

| | verdict |
|---|---|
| checker at HEAD (status-keyed) | exit 0, **zero output lines** — skipped on sight of `status: closed` |
| checker after T4 (location-keyed) | exit 1 · `FAIL … T1 Layers completeness: DoD/Acceptance implies undeclared.md` |

Note the old behaviour precisely: not a wrong verdict, *no verdict at all*, at exit 0. Three fixtures
retained — the closed-but-not-archived case (must FAIL), the archived case (must be skipped, the
must-NOT-catch half that shows where the boundary now sits, L-076), and a direct assertion that a
zero-scope run emits no PASS line.

Gate: **121 pass, 0 fail.**

### 2026-08-09 | complete | T5 — manifest lockstep gets a check; the glob missed every manifest on its first run
Four manifests carry the version and leg 6 compared the README *footer* against one of them, so no
two manifests were ever compared to each other. `.codex-plugin/` and `.kimi-plugin/` drifted **five
releases** behind before v1.28.0 caught it by hand. The lockstep rule has been a DoD line in
`.claude/CLAUDE.md` the whole time — it just never had a check behind it, which is this sprint's
theme stated in one sentence.

The manifest set is **derived from the `*-plugin/` directories on disk**, never hand-listed: a
hardcoded sibling list goes stale the moment a fifth manifest lands, and neither author nor reviewer
can see it (L-066). Leg 6 is **kept, not replaced** — it compares a different pair and still catches
a drift this cannot see; swapping it out would be a narrowing dressed as a widening (L-076).

**L-102 again, third time this sprint.** The checker's first live run reported
`no manifests found` — every manifest here lives in a **dot** directory (`.claude-plugin`,
`.codex-plugin`, `.kimi-plugin`) and a shell glob does not match a leading dot. Had that shipped, the
checker would have found zero files and exited 0 on every run: a green line meaning nothing, which is
the precise defect T4 fixed one task earlier. Case 4 now asserts the live repo yields ≥2 manifests, so
the glob itself is guarded rather than assumed.

Four fixtures: the real v1.28.0 drift reproduced (1.23.0 siblings against 1.28.0), a manifest with no
parseable version (**FAIL, never a skip** — a file the checker cannot read is not a file that passes,
L-065), a single manifest (**FAIL** — lockstep over one file compared nothing), and the live-repo
case. All four manifests are currently at 1.29.0.
