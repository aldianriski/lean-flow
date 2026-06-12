# Review scoping — the review budget

Loaded by `/orchestrator` at the Review step. Goal: catch what self-review misses **without** paying a
whole-repo scan per change. The post-change review fan-out is the single biggest token sink — each
isolated pass starts from zero context and re-scans unless you scope it.

## Scope every pass to the diff

Hand each review pass a brief, not the repo:
- the `git diff` (the actual change),
- the changed files, and
- their **direct callers / dependents** (the blast radius — one hop, not the transitive closure).

Tell the pass explicitly: *"Review the diff and its blast radius. Do not survey the rest of the repo."*
A reviewer with a bounded brief is both cheaper and sharper.

## Skip table — which passes actually fire

Don't fire every pass on every change. Decide per diff:

| Condition | Action |
|---|---|
| docs / config / trivial diff | self-review checklist only — no agent pass |
| no auth / input / secret / data-exposure surface touched | skip `/security-review` |
| behaviour unchanged (rename / pure refactor / comment) | skip `/verify` |
| files already read this session | skip `Explore` recon — context is already loaded |
| small single-file diff, tests green | fold into one `/code-review`; don't fan out |

Keep `/security-review` a **separate uncontaminated pass** — but only when there *is* a security
surface. Folding it into a general review when there's no surface just burns tokens; running it in the
same session as the code review when there *is* one contaminates the context. The skip table picks the
right one.

## When a pass does fire

- **Non-trivial diff → `/code-review`** — independent context beats self-review.
- **Real behaviour change → `/run`** to drive the app + **`/verify`** it does what the goal stated.
- **Cleanup → `/simplify`** — reuse / simplification / efficiency (pairs with `/refactor-advisor`).
- **Auth / input / secrets / data exposure → `/security-review`** as its own pass.
- **Bug suspected →** `/diagnose`.

Dispatch the mechanical passes on a cheap tier (`sonnet`) per the tier map (`.claude/CONTEXT.md`); the
*judgment* on the findings stays on the session model.

## Self-review checklist (the trivial-diff floor)

For doc-only / delete-only / trivial diffs this is enough — no agent pass:
- [ ] Does the diff do exactly what the goal stated — nothing more?
- [ ] Edge cases / error paths handled?
- [ ] No secret, debug print, or commented-out block left behind?
- [ ] Tests or a manual check confirm the behaviour?
- [ ] Adjacent files left consistent (no half-renamed symbols)?
