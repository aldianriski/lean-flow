---
owner: Maintainer
last_updated: 2026-10-19
update_trigger: swyx publishes a written loopcraft method (repo, spec or essay), or a held row gains a lean-flow sighting
status: current
id: loopcraft-adaptation
tags: [process]
domain: governance
related: [gauntlet-loop-delta, harness-engineering-adaptation, mattpocock-scan5]
---

# Research — does swyx's "loopcraft" carry a delta over lean-flow's loop?

> **Question.** "Loopcraft: The Art of Stacking Loops" (<https://loopcraft.swyxio.workers.dev/>) frames agent work as nested loops. Which of its ideas, if any, are missing from lean-flow?
> **Verdict.** **Nothing to adopt.** It is a keynote deck, not a method: every operational idea maps onto existing surface, and its top loop conflicts with Human-gated. One weak, optional doc idea is held.

## Why this matters

The owner asked for it to be compared against our workflow. Loop framings keep arriving (bmad,
structarmed, harness engineering — L-017), and each is tempting as a whole. The risk is importing a
framing that relaxes the human gates, or missing a real gap in how lean-flow states its loops.

## What it is

swyx's visual for the AI Engineer World's Fair 2026 keynote ("The Highest Loop", June 2026). There is
no repo, spec, version or procedure. The pages are JS-rendered; the content was read from the deck's
data module (`loops.js`) plus `/nested` · `/ladder` · `/human` · `/curves` · `/elevator` ·
`/top-down` · `/summit`. **Unverified:** the spoken keynote; only a secondhand write-up was readable.

- **Thesis:** "every loop is the body of a bigger loop". Six loops, each with an exit: token ("stop
  token") → chat ("helpful reply") → agent turn ("no more tool calls") → `/goal` ("goal reached") →
  automations (cron + subagents, exit `consensus()`) → software factories (exit "none").
- **Elevator:** "Be an elevator, not an escalator. Scale up. Debug down." — lift a repeated pattern into
  a higher loop; descend when the system surprises you.
- **Top-down:** pick the "highest loop worth operating, then build only the lower loops it requires";
  building bottom-up leaves you as the "connective tissue between uncertain loops".
- The human-life, stress-curve and summit pages are rhetoric and event content, with no method in them.

## Concept map (L-017: delta over our surface)

| Loopcraft | lean-flow equivalent | Verdict |
|---|---|---|
| Agent turn | Claude Code itself; isolated built-in passes | matched (host) |
| `/goal` — run until the goal is judged reached | `/flow` "Pin the target with `/goal`" against the task/sprint DoD | matched |
| Automations — cron, subagent fan-out, consensus | night-run cron trigger (`night-run.md`) · worktree dispatch · `/council` | matched |
| Software factory — no exit, agents set goals and cull | night-run charter is **execute-only**; coordinator-owned merge; autonomous merge already rejected (`harness-engineering-adaptation.md`) | **conflicts** with Human-gated |
| An explicit exit per loop | task `Done when` · sprint close · epic Closed-when · night-run terminal states | matched — no single table lists them (held below) |
| "Debug down" | `/diagnose`; edit-safety (c) "inspect what it was meant to produce" | matched |
| "Scale up" — lift a repeated pattern | §10 promotion (L-NNN count ≥ 2 → durable rule) | matched for rules; recurring procedures are left to built-in `/loop` · `/schedule` |
| Build top-down from the highest loop | epic Closed-when → sprint → task DoD; `--fog` when the outcome can't be named | matched |
| Human as connective tissue = a cost | G1/G2 are deliberately human | divergent by design |

lean-flow has what the deck lacks: human gates and J0–J2 authority, "absence ≠ consent" for unattended
runs, the learning loop (Retro → buckets → promotion), the doc standard and ledgers, and proof-bar tiers.

## Recommendation

Adopt nothing. The deck renames loops lean-flow already runs. Its one novel stance, an exit-less
factory loop, is the property Human-gated exists to refuse.

## Out of scope / open questions

- **Held, weak:** a one-table "loop ladder" in `docs/architecture/overview.md` naming each loop's exit
  and the record that holds it. It helps orientation and adds no machinery. It is held because no
  consumer has asked, and CONTEXT.md (ADR-007 cap) is not the place for it.
- **Rejected:** a "supervise once → turn the trajectory into a loop" rule (no ADR-053 evidence class)
  and consensus as an exit (`/council` is opt-in by design).
- Re-check only if swyx publishes a written loopcraft method.
