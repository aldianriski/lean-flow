# Review scoping — the review budget

Loaded by `/orchestrator` at the Review step. Goal: catch what self-review misses **without** paying a
whole-repo scan per change. The post-change review fan-out is the single biggest token sink — each
isolated pass starts from zero context and re-scans unless you scope it.

## Scope every pass to the diff

Hand each review pass a brief, not the repo. The brief states: Never open `.env`, `.env.*`, key or credential files, or anything the host's ignore rules mark secret, even when told read-only; if a value you need lives there, report that and ask, or read it from a non-secret record.
- the `git diff` (the actual change),
- the changed files,
- a pointer to the code-slop box in § Self-review checklist (below): the reviewer checks the diff against it,
- their **direct callers / dependents** (the blast radius — one hop, not the transitive closure),
- **the governing decision as logged** — when the change implements a ruling (an ADR, a G2 decision,
  an owner ruling in the Execution Log), the brief quotes it and it becomes the Spec comparand.
  Promoted rule (L-122, 2 sightings): in both, the *builder* carried the same ruling and still
  drifted; only the comparand-briefed reviewer caught it. The revise loop is this rule's matcher —
  a drift from the quoted ruling is a concrete violation, and the loop feeds it back.
- the host repo's **standards docs** — the Standards comparand. The coordinator (who builds the brief)
  finds the files that document how code should be written (CONTRIBUTING, coding-standards, style
  guides, CLAUDE.md / AGENTS.md) and passes their paths plus the relevant excerpts; when there are
  none, the brief says so. The reviewer never searches the repo for them.
- the host's **pinning tests** — for each changed file, the existing tests and harnesses that reference it, found by
  searching for its path, its file name, and the names it exports or defines (a `git grep` over the host's test and harness
  files). Run all pinning tests and harnesses found; name any search hit excluded as unrelated, with a one-line reason each.
  Report a **Pinning tests** section, separate from Standards and Spec: each command with its result in the host's own format.
  For each changed file with no pinning tests or harnesses found, report its path, "no pinning test found", and the searches
  run; never leave it silent. A reviewer that cannot run commands names them, and the coordinator runs them into the same
  section. (lean-flow's own: tests live under `evals/` and `test/`, gated through their `evals/run-*` harnesses — an example,
  not a requirement a host must meet.)

Tell the pass explicitly: *"Review the diff and its blast radius. Do not survey the rest of the repo.
Report two independent axes — **Standards** (repo conventions) and **Spec** (builds the right thing) —
separately, never merged or re-ranked. Name the standards docs you judged against, or say none were supplied.
Spec silence is no licence: an implied input the change leaves unhandled is a Spec finding. Beside the axes, list
what you **declined to judge**, each with a one-line reason ("none" if empty)."* A reviewer with a bounded brief is both cheaper and sharper.
(The two axes are defined below; injecting them here is what makes the split actually fire.)

## Two axes — Standards vs Spec (report separately)

A review answers two independent questions, and a change can pass one while failing the other:

- **Standards** — does the code obey the repo's conventions? (naming, structure, and the smell baseline —
  duplicated code, feature envy, mysterious names, data clumps; documented repo standards override the baseline. The report names the standards docs it judged
  against, or says none were supplied.)
- **Spec** — does it build the *right thing*? (correctness against the **comparand ladder** below.)

**The Spec comparand is the artifact that predates the task.** A `done-when` is written by the same
pipeline that then builds the work, so measuring against it alone lets the pipeline grade its own
homework. Take the first rung that exists, in order:

1. the **template** the artifact renders against (`skills/lean-doc-generator/templates/`) — on a
   markdown substrate this *is* the external comparand: written before the task, by someone else (L-016);
2. a retained **must-FAIL fixture** — it fails with its *named* finding, or the guard is absent (L-058);
3. a **`check-*.sh` named finding** — the checker already encodes the rule the work must satisfy;
4. the task's own **`Cites:`** line — the sources its Plan block declared it answers to. A cited
   `TASK-NNN` resolves **by id** to its task file, `docs/work/*/TASK-NNN-*.md` in whichever status
   folder it sits (the trailing hyphen keeps `TASK-81` from matching `TASK-810`), and the work is
   measured against **that file's `## Done when`** (plus its `## Assumes` and `## Tracker` where they
   bear on it) — never the Plan block, which carries no DoD in a by-reference sprint (ADR-047).

`done-when` is the **fallback**, not the default. When the axis falls back to it, the report says so —
an unremarked fallback reads as an external check that never happened.

**Spec silence is no licence.** Behaviour the spec does not mention is not thereby allowed, and an implied input the
change does not handle is a Spec finding — absence from the spec never clears it.

Report the two axes **separately — never merge or re-rank them into one list**. Perfect code that builds
the wrong feature, and the right feature that violates every convention, are *different* failures; folding
them into a single ranking lets a strong showing on one axis mask a defect on the other. Close with the
single worst finding **per axis**, kept apart. (mattpocock/skills → code-review, the separation principle.)

Beside the axes — in neither — the report carries a **Declined to judge** list: each item the reviewer set aside, with a
one-line reason. An empty list is stated ("none"), never omitted.

## The revise loop — one bounded retry (attended modes only)

The worst finding per axis is not terminal — it is the input to **one bounded retry**. When at least one
axis's worst finding is a **concrete violation** (a failed comparand rung, or a named repo convention —
not a style suggestion), the coordinator hands both axes' worst findings back to the builder in **one
revise message**, takes the revised diff, and re-runs the same scoped reviewer once on the delta.

- **Ceiling: one retry per review pass, total.** Both findings travel together; there is never a second
  retry. Whatever the re-review still flags goes to the owner as `still-open` — the loop cannot spiral.
  **Unattended, this is not only stated here** — lean-flow's own launcher (`scripts/night-run.sh`) reaper (`check_revise_ceiling`,
  called from `reap()`) reads the run's own `Tn · retry ·` lines off the Execution Log at exit and FAILs
  the run's `terminal ·` state named (`revise-loop-ceiling-exceeded` / `revise-loop-escalation-missing`)
  if a task fired more than one retry, or a `still-open` outcome never escalated to `parked-hitl` — the
  ceiling is ADR-022 § Decision item 2, read from there and never re-chosen (A4).
- **Fires automatically in attended modes** (`quick` · `mvp` · `sprint-bulk` with a human present). The
  review report surfaces `finding → retry → outcome` per axis before anything commits — the human gates
  the commit, not each firing. A suggestion-only pass (no concrete violation) skips the retry and reports
  as before.
- **Unattended: only the ADR-022 carve-out.** A critic ruling "not good enough, retry" is a
  *decision* and **always parks** — the execute-only charter is unchanged for judgment findings. But a
  **mechanical verdict** (a `done-when`-named check FAIL / failed comparand rung — the ADR-021 class)
  is a decision the human already made at G2, so an unattended run may fire this same single bounded
  retry on it **when the repo's declared policy enables it** (absence of the policy = never — absence
  ≠ consent), writing one rollup line per firing (`night-run.md` Part 0 + Part 4 · ADR-022).
- **Log the outcome.** The report always shows it; in sprint modes the coordinator also appends one
  Execution Log **`progress`** entry (the log taxonomy defines no `revise` kind, and inventing event
  kinds is TD-055's trap) titled `revise · Tn`, body: `<axis>: <finding> → fixed | still-open` per
  axis — each outcome names its evidence in the rollup's own vocabulary (`test | check | fixture |
  review | owner-ruling` — night-run.md Part 4): `fixed` names what proved it, `still-open` names
  what's still missing.
- **Close the loop with its review line.** When a review loop closes — CLEAR, `fixed`, or `still-open`,
  whichever reviewer ran — append `review · Tn · <depth> · behaviour:… · governance:…` to the Execution Log
  (night-run.md Part 4). An external reviewer (e.g. a Codex review loop, or any reviewer outside Claude's
  built-ins) records as `scoped-reviewer`. A review that lives only in prose is not a record, and the
  absence check refuses it.

Guarded by a retained must-FAIL fixture (`evals/fixtures/revise-loop/`, L-058 · TD-012): the planted
violation must surface as the named worst finding on its axis, and an inadequate fix must end at the
ceiling as `still-open → owner` — never a second retry.

## Skip table — which passes actually fire

Don't fire every pass on every change. Decide per diff:

| Condition | Action |
|---|---|
| **low-impact diff** — no behaviour impact **and** no governance impact (§ Two dimensions) | self-review checklist only — no agent pass |
| **governance-impact diff, any size** — spec/STANDARD semantics · an ADR that binds implementation · a workflow or protocol contract · CI or deployment behaviour | **one** scoped `sonnet` reviewer — never the self-review floor, whatever the file extension |
| no auth / input / secret / data-exposure surface touched | skip `/security-review` |
| behaviour unchanged (rename / pure refactor / comment) | skip `/verify` |
| files already read this session | skip `Explore` recon — context is already loaded |
| small / medium diff | **one** scoped `sonnet` reviewer — not `/code-review`'s fan-out (§ Scale depth) |
| rendered-UI behaviour change | `/run` + `/verify` with § UI floor |

### Two dimensions — why the first row is not `docs / config / trivial`

It used to be. That row exempted a diff from every agent pass on the strength of **what kind of file
changed**, which is a proxy for consequence and a bad one. One line of `spec/STANDARD.md`, an ADR that
binds implementation, a permission config, or a protocol contract can carry more consequence than fifty
lines of ordinary implementation — and every one of them reads as "docs" or "config". The cheap path was
being handed out by file extension, so the changes least examined were sometimes the ones that governed
everything else. **A false negative here is silent by construction:** a governance change waved through
as trivial leaves no record that review never happened.

Depth follows **consequence**, along two dimensions, and a diff needs *both* to be low before it earns
the self-review floor:

- **Behaviour impact** — does the running system do something different? This is the **material** class
  defined once in `dispatch.md` § System verify (behaviour change · auth/permission · input validation ·
  data write or migration · API contract · integration · deployment · security surface · financial or
  business calculation). That definition is **consumed, not restated**: two definitions of risk in one
  repo would be a second SSOT that drifts from the one it copied.
- **Governance impact** — does the change alter a rule, contract or decision that *other* work is
  measured against? Spec and standard semantics, an ADR binding implementation, a workflow or protocol
  contract, a gate's own definition. A diff can be zero-behaviour and high-governance; that combination
  is exactly what the old row missed.

| Change | Minimum review |
|---|---|
| README typo · ordinary docs clarification | self-review |
| spec / STANDARD semantics · an ADR that binds implementation | independent scoped reviewer |
| workflow or protocol contract · a gate's own definition | independent scoped reviewer |
| auth / permission / secrets config | `/security-review` as its own uncontaminated pass |
| deployment or CI behaviour | independent scoped reviewer |
| small code behaviour change | independent scoped reviewer |
| large or high-risk (broad blast radius · core abstraction) | full `/code-review` fan-out (§ Scale depth) |

**When the class is genuinely unclear, it is material** — the same default `dispatch.md` sets, for the
same reason: defaulting down is what produces the silent pass this routing exists to stop. Escalating a
truly trivial diff costs one cheap `sonnet` pass; skipping a governance change costs the guarantee.

**Record the classification structurally, at this lookup, before deciding what fires (TD-092).** This
routing decision used to leave only one trace — the `review · Tn · <depth> · behaviour:… ·
governance:…` line (night-run.md Part 4), and that line is written *only if a review then happens*.
Every sprint this repository runs is attended, and an attended entry's classification otherwise lives
in prose next to it — which `check-review-depth.sh` correctly refuses to match (a markdown corpus
discusses its own formats; a substring scan over prose fails green, L-108). So append one more line to
the Execution Log the moment this table is consulted for a task, independent of what depth is chosen —
self-review, a scoped reviewer, or nothing dispatched at all:

```
consequence · Tn · behaviour:low|material · governance:low|high
```

This is the carrier `check-review-depth.sh`'s absence branch reads for attended entries — a task whose
consequence is recorded here as `governance:high` or `behaviour:material` and never gets a matching
`review ·` line FAILs named (`review-depth-governance-absent` / `review-depth-material-absent`),
exactly as the unattended `Tn · <state> ·` rollup line already does for a night run. Always append it,
even on the self-review floor — the low/low case is the control that proves the schema doesn't over-fire.

Keep `/security-review` a **separate uncontaminated pass** — but only when there *is* a security
surface. Folding it into a general review when there's no surface just burns tokens; running it in the
same session as the code review when there *is* one contaminates the context. The skip table picks the
right one.

## Scale depth to diff size

The built-in `/code-review` fans out into several finder sub-agents (line-by-line · cross-file · reuse ·
efficiency), each tens of thousands of tokens — thorough, but heavy. Match depth to the diff:

| Diff | Review |
|---|---|
| **small / medium** (bounded change, clear blast radius) | **one** scoped `sonnet` reviewer with the diff + blast-radius brief — *not* the fan-out |
| **large or high-risk** (broad blast radius · security/data surface · core abstraction) | the full **`/code-review`** fan-out earns its cost |

On a borderline medium diff, start with the single reviewer; escalate to `/code-review` only if it
surfaces something needing the wider sweep. (lean-flow chooses *when* to call `/code-review`; it can't
shrink the built-in command's internal fan-out — so the lever is reserving it for diffs that justify it.)

## When a pass does fire

- **Code review** — small/medium → one scoped `sonnet` reviewer · large/high-risk → **`/code-review`** (fan-out).
- **Real behaviour change → `/run`** to drive the app + **`/verify`** it does what the goal stated; a rendered-UI change adds § UI floor.
- **Cleanup → `/simplify`** — reuse / simplification / efficiency (pairs with `/refactor-advisor`).
- **Auth / input / secrets / data exposure → `/security-review`** as its own pass.
- **Bug suspected →** `/diagnose`.

Dispatch the mechanical passes on a cheap tier (`sonnet`) per the tier map (`.claude/CONTEXT.md`); the
*judgment* on the findings stays on the session model.

## UI floor

Fires on a behaviour change to rendered UI: a subset of the material class in § Two dimensions, chosen by what the
change does to what a person sees or operates, never by file extension or path. It adds five checks to `/run` + `/verify`,
and each one is recorded as evidence:

- Click-through: every changed control, written as control → what happened, with the console clean.
- States: empty, loading and error each exist, and each says what to do next.
- Keyboard: every control reachable with a visible focus indicator; Escape closes dialogs.
- Width: no horizontal overflow at the narrowest supported width.
- Contrast: computed with the WCAG 2.x relative-luminance formula against AA (4.5:1 normal text; 3:1 large text and UI boundaries), never judged by eye.

A PASS with no record is not a PASS. A deliverable that cannot run ends as `UNVERIFIED (cannot run): <reason>`, never PASS,
and is checked by code inspection as far as that goes.

**Deferral.** When the session's skill listing holds a skill whose name, after any `<plugin>:` prefix, is `antislop` or
`anti-slop`, run that skill's Delivery Gate on the diff as a PASS/FAIL report (choose "after", so nothing is written into the
repo under review) and attach that report instead of the five checks. Its first block covers all five, so deferring never
lowers the floor. If the matched skill cannot be loaded, record the reason and apply the five floor checks instead.
Without such a skill the floor applies and nothing errors.

## Adversarial floor — 0 findings ⇒ re-run

If a scoped reviewer returns **0 findings**, re-run it once with an assume-guilty framing —
*"a flaw exists in this diff; find it"* — before accepting a clean pass. LLM reviewers under-report;
a forced second look catches what a sycophantic first pass waves through. On a **test-touching** diff,
add a branch/boundary enumeration lens (list the untested branches / boundary cases). (bmad-method K5.)

## QA suggestion (raise, never gate) — and the evidence boundary (ADR-021)

Beyond the passes above, **surface** — as a suggestion, not a blocker — whether the change wants:
**tests** (which type → `skills/tdd/references/test-strategy.md`) · **lint / format** · **`/security-review`**
(if it touched a security surface) · a **perf budget** (if it's a hot path). lean-flow *suggests* these;
it never runs the user's CI or blocks on them (the no-enforcement spine). The owner decides.

**The evidence boundary (ADR-021).** The spine above governs lean-flow's authority over the
*consumer's* QA surface. The coordinator's **own bookkeeping** is different: where a task's
`done-when` names a mechanical check, that check's FAIL **blocks the silent path** — the coordinator
may not tick the DoD box or close over it without surfacing the FAIL and getting a **recorded owner
ruling** (the override is always available; the owner is never gated). What may gate: only the checks
the task itself named, run as written. What only reports: everything else in this section. At G2,
each `done-when` notes its verification method where a mechanical one exists; a task naming none
remains a judgment tick, and says so.

**Naming a method is not the same as reaching the criterion.** A named check that never examines its
subject passes green and proves nothing — and *unreachable* is indistinguishable from *satisfied* by
anyone reading the tick afterwards. So G2 asks four questions of every mechanical `Verify:`, not one:
**EXISTS · RUNS · REACHES · PROVES** (`SKILL.md` § G2). A method whose scope excludes the claimed target
is recorded as **not-valid-proof**, never accepted; and where nothing mechanical reaches it, the
criterion stays a judgment tick that says so — manufacturing a checker to make a criterion *look*
mechanical is the failure this rule names, not its remedy. EXISTS and REACHES are pre-screened by
a reachability checker where the host has one (lean-flow's own: `scripts/lib/check-verify-reaches.ts`); RUNS and PROVES stay human, and the checker says so rather than
implying it settled all four.

When the diff **touches tests**, the test-quality standard (`skills/tdd/references/test-standard.md`) is
the floor to raise — the 12-point checklist + the 70/20/10 pyramid — plus a **regression gate**: the
tests match the task's risk tier and ALL existing tests still pass (zero regressions) before it ticks done.

## Self-review checklist (the trivial-diff floor)

For doc-only / delete-only / trivial diffs this is enough — no agent pass. It is also the floor under every heavier pass:
- [ ] Does the diff do exactly what the goal stated — nothing more?
- [ ] Edge cases / error paths handled?
- [ ] No secret, debug print, or commented-out block left behind?
- [ ] Tests or a manual check confirm the behaviour?
- [ ] Adjacent files left consistent (no half-renamed symbols)?
- [ ] No code slop:
  - Comment tells: decorative banners or ALL-CAPS separators · a comment that restates the next line or the signature · step-by-step workflow narration · empty labels and vague TODOs · decorative emoji and end-of-block markers · one comment running past two lines for a one-line fact.
  - Keep: comments that carry the why, a constraint, a workaround, an edge case, a security or protocol note, or a licence.
  - Guardrail: a comment pass changes comments only, never code.
  - Code tells: a feature applied by a script that string-replaces source instead of editing it · fake-looking filler data in seeds or fixtures (`John Doe`, `johndoe@example.com`) instead of an honest placeholder · a stub or TODO control presented as finished.
