---
owner: Maintainer
last_updated: 2026-08-09
status: current
update_trigger: The revisit-if condition fires, or the expiry passes
---

# Out of scope — skill self-fork (`context: fork`) as the execution-dispatch mechanism

**Decision (SPRINT-050 T2, 2026-08-09): rejected for execution dispatch.** ADR-010's spawn-with-brief
contract (mechanism C — runtime `Skill` invocation on a dispatched `general-purpose` agent) stands
unchanged. ADR-010 was deliberately **not** edited: an unchanged ADR is the correct outcome of a
rejection.

## What was being decided

`docs/research/mattpocock.md` scan 1 identified three ways to hand a dispatched sub-agent its
procedure skill, and carried the B-vs-C question forward through two further scans with "no new
evidence either way":

- **B — skill self-fork.** A `SKILL.md` declares `context: fork` + `agent:` + `model:` in its own
  frontmatter and forks into a tiered sub-agent, with no agent definition file.
- **C — runtime invocation** *(shipped)*. `/orchestrator` dispatches a `general-purpose` agent via the
  Agent tool and hands it its procedure skill to invoke at runtime.

Both satisfy lean-flow's agent-free-core principle, so that was never the discriminator.

## Why it was rejected

The question had been framed as a **cost** trade — "is the per-run fork cost worth it?" — which is
why it survived three scans: nobody had a fork-cost measurement lying around, and taking one needs a
paid dispatch run. That framing was wrong. It is a **capability** question, and the Claude Code skills
documentation answers it outright.

1. **Same-skill forks serialize — which defeats the fan-out.** Claude Code waits for a forked skill's
   result "when you invoke a forked skill while an earlier invocation of **the same skill** is still
   running". lean-flow's parallel worktree dispatch runs *one procedure skill across N tasks at once*
   — N invocations of `/tdd`, or of `/diagnose`. Under B those queue behind each other. The whole
   reason the fan-out exists is concurrency, so B removes the benefit it was being considered for.
2. **Backgrounded forks get a narrower tool set.** A background fork runs with the reduced background-
   subagent tool set; the full set requires `background: false`, which blocks the invoking turn.
   Concurrency or full tools — not both. Our dispatched tasks edit files, run `qa-check.sh`, and
   commit, so they need the full set.
3. **B's stated advantage is already ours.** "No agent definition file" is what made B attractive
   against mechanism A. Mechanism C also ships no agent definition — it dispatches a *built-in*
   `general-purpose` agent. So B was never buying the thing it was credited with.

Two facts that do **not** support the rejection, stated so the record is not tidier than the evidence:
a forked skill **can** receive a brief — `$ARGUMENTS` / `$0` / `$name` substitute into the skill
content that becomes the prompt — so "the fork cannot be briefed" is **false**, and an earlier reading
of this file's own draft that said so was wrong. And the per-run fork cost remains **unmeasured**; it
simply stopped being the binding constraint.

## Revisit if

- Claude Code allows **concurrent invocations of the same forked skill** without serializing them,
  *and* a background fork gets the full tool set (or `background: false` stops blocking the turn) —
  at which point the cost question becomes live again and needs the measurement that was never taken.
- **Or** lean-flow's dispatch stops needing parallelism, making serialization a non-issue.

## Expiry

**Unfired by SPRINT-060 promote → auto-close as permanently rejected**, and this file becomes history
rather than a pending question. The point of a dated expiry is that the null result is itself a
verdict rather than a drift toward never (L-068). Do not re-litigate before then without new evidence
of one of the revisit-if conditions.
