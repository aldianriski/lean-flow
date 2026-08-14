# Review scoping — the review budget

Loaded by `/orchestrator` at the Review step. Goal: catch what self-review misses **without** paying a
whole-repo scan per change. The post-change review fan-out is the single biggest token sink — each
isolated pass starts from zero context and re-scans unless you scope it.

## Scope every pass to the diff

Hand each review pass a brief, not the repo:
- the `git diff` (the actual change),
- the changed files, and
- their **direct callers / dependents** (the blast radius — one hop, not the transitive closure).

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

## Skip table — which passes actually fire

Don't fire every pass on every change. Decide per diff:

| Condition | Action |
|---|---|
| docs / config / trivial diff | self-review checklist only — no agent pass |
| no auth / input / secret / data-exposure surface touched | skip `/security-review` |
| behaviour unchanged (rename / pure refactor / comment) | skip `/verify` |
| files already read this session | skip `Explore` recon — context is already loaded |
| small / medium diff | **one** scoped `sonnet` reviewer — not `/code-review`'s fan-out (§ Scale depth) |

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

## QA suggestion (raise, never gate)

Beyond the passes above, **surface** — as a suggestion, not a blocker — whether the change wants:
**tests** (which type → `skills/tdd/references/test-strategy.md`) · **lint / format** · **`/security-review`**
(if it touched a security surface) · a **perf budget** (if it's a hot path). lean-flow *suggests* these;
it never runs the user's CI or blocks on them (the no-enforcement spine). The owner decides.

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
