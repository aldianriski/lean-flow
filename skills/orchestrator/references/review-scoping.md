# Review scoping — the review budget

Loaded by `/orchestrator` at the Review step. Goal: catch what self-review misses **without** paying a
whole-repo scan per change. The post-change review fan-out is the single biggest token sink — each
isolated pass starts from zero context and re-scans unless you scope it.

## Scope every pass to the diff

Hand each review pass a brief, not the repo:
- the `git diff` (the actual change),
- the changed files,
- their **direct callers / dependents** (the blast radius — one hop, not the transitive closure), and
- **the governing decision as logged** — when the change implements a ruling (an ADR, a G2 decision,
  an owner ruling in the Execution Log), the brief quotes it and it becomes the Spec comparand.
  Promoted rule (L-122, 2 sightings): in both, the *builder* carried the same ruling and still
  drifted; only the comparand-briefed reviewer caught it. The revise loop is this rule's matcher —
  a drift from the quoted ruling is a concrete violation, and the loop feeds it back.

Tell the pass explicitly: *"Review the diff and its blast radius. Do not survey the rest of the repo.
Report two independent axes — **Standards** (repo conventions) and **Spec** (builds the right thing) —
separately, never merged or re-ranked."* A reviewer with a bounded brief is both cheaper and sharper.
(The two axes are defined below; injecting them here is what makes the split actually fire.)

## Two axes — Standards vs Spec (report separately)

A review answers two independent questions, and a change can pass one while failing the other:

- **Standards** — does the code obey the repo's conventions? (naming, structure, and the smell baseline —
  duplicated code, feature envy, mysterious names, data clumps; documented repo standards override the baseline.)
- **Spec** — does it build the *right thing*? (correctness against the **comparand ladder** below.)

**The Spec comparand is the artifact that predates the task.** A `done-when` is written by the same
pipeline that then builds the work, so measuring against it alone lets the pipeline grade its own
homework. Take the first rung that exists, in order:

1. the **template** the artifact renders against (`skills/lean-doc-generator/templates/`) — on a
   markdown substrate this *is* the external comparand: written before the task, by someone else (L-016);
2. a retained **must-FAIL fixture** — it fails with its *named* finding, or the guard is absent (L-058);
3. a **`check-*.sh` named finding** — the checker already encodes the rule the work must satisfy;
4. the task's own **`Cites:`** line — the sources its Plan block declared it answers to.

`done-when` is the **fallback**, not the default. When the axis falls back to it, the report says so —
an unremarked fallback reads as an external check that never happened.

Report the two axes **separately — never merge or re-rank them into one list**. Perfect code that builds
the wrong feature, and the right feature that violates every convention, are *different* failures; folding
them into a single ranking lets a strong showing on one axis mask a defect on the other. Close with the
single worst finding **per axis**, kept apart. (mattpocock/skills → code-review, the separation principle.)

## The revise loop — one bounded retry (attended modes only)

The worst finding per axis is not terminal — it is the input to **one bounded retry**. When at least one
axis's worst finding is a **concrete violation** (a failed comparand rung, or a named repo convention —
not a style suggestion), the coordinator hands both axes' worst findings back to the builder in **one
revise message**, takes the revised diff, and re-runs the same scoped reviewer once on the delta.

- **Ceiling: one retry per review pass, total.** Both findings travel together; there is never a second
  retry. Whatever the re-review still flags goes to the owner as `still-open` — the loop cannot spiral.
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
- **Real behaviour change → `/run`** to drive the app + **`/verify`** it does what the goal stated.
- **Cleanup → `/simplify`** — reuse / simplification / efficiency (pairs with `/refactor-advisor`).
- **Auth / input / secrets / data exposure → `/security-review`** as its own pass.
- **Bug suspected →** `/diagnose`.

Dispatch the mechanical passes on a cheap tier (`sonnet`) per the tier map (`.claude/CONTEXT.md`); the
*judgment* on the findings stays on the session model.

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
`scripts/lib/check-verify-reaches.sh`; RUNS and PROVES stay human, and the checker says so rather than
implying it settled all four.

When the diff **touches tests**, the test-quality standard (`skills/tdd/references/test-standard.md`) is
the floor to raise — the 12-point checklist + the 70/20/10 pyramid — plus a **regression gate**: the
tests match the task's risk tier and ALL existing tests still pass (zero regressions) before it ticks done.

## Self-review checklist (the trivial-diff floor)

For doc-only / delete-only / trivial diffs this is enough — no agent pass:
- [ ] Does the diff do exactly what the goal stated — nothing more?
- [ ] Edge cases / error paths handled?
- [ ] No secret, debug print, or commented-out block left behind?
- [ ] Tests or a manual check confirm the behaviour?
- [ ] Adjacent files left consistent (no half-renamed symbols)?
