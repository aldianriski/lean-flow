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

## Self-review checklist (the trivial-diff floor)

For doc-only / delete-only / trivial diffs this is enough — no agent pass:
- [ ] Does the diff do exactly what the goal stated — nothing more?
- [ ] Edge cases / error paths handled?
- [ ] No secret, debug print, or commented-out block left behind?
- [ ] Tests or a manual check confirm the behaviour?
- [ ] Adjacent files left consistent (no half-renamed symbols)?
