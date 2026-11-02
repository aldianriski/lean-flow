---
owner: Maintainer
last_updated: 2026-08-09
update_trigger: A closed tension is reopened by new evidence, or the parent mattpocock.md records a new one
status: current
id: mattpocock-tensions
tags: [process, docs]
domain: governance
related: [mattpocock-adaptation]
---

# Research — the two mattpocock tensions, closed (detail)

> Split out of [`mattpocock.md`](mattpocock.md) at SPRINT-054 T4. Both tensions were carried from
> scan 3 as "needs evidence, not preference"; both are now closed — one by reading, one by ruling.
> The parent keeps a one-line pointer to each verdict; the evidence lives here. Moved verbatim.

**Closed at SPRINT-054 T2 (TASK-155) — negation in anti-patterns: no change warranted.** The claim is
real but narrower than `writing-for-agents` states, and our ❌ rows already sit on its safe side. In
order of weight: the popular write-up runs **no experiment** — it rests on Ironic Process Theory, a
*human* result, plus forum anecdotes, and says so
([16x](https://eval.16x.engineer/blog/the-pink-elephant-negative-instructions-llms-effectiveness-analysis)).
**NeQA**, the benchmark usually invoked, measures *negation comprehension in question answering*, not
instruction-following under prohibition — a different construct — and its own finding is that the task
shows "inverse scaling, U-shaped scaling, or positive scaling", shifting in that order with more
powerful prompting methods or model families; the alarming version is its weakest-prompt corner
([Zhang et al., ACL 2023 Findings](https://arxiv.org/abs/2305.17311)). Anthropic's guidance — "Tell
Claude what to do instead of what not to do", worked as "Do not use markdown" → "smoothly flowing prose
paragraphs" — targets a **bare** prohibition that leaves no positive target
([prompting best practices](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct)).
The decisive datum is on that same page: its own production prompt samples are built *from*
prohibitions — "DO NOT use ordered lists … unless: a) … b) …" · "NEVER output a series of overly short
bullet points" · "Don't add features … beyond what was asked" · "Don't add error handling … for
scenarios that can't happen. … Only validate at system boundaries." Each is **scoped and paired with a
positive rule**, which is the shape our rows already use — checked row by row across `.claude/CLAUDE.md`
§ Anti-Patterns rather than assumed (A3 confirmed). So the invariant worth protecting is the
**pairing**, not the ❌ glyph. Recorded as a null result and nothing was edited to prove the question
was answered — that is this sprint's named failure mode (SPRINT-054 D1).

**Closed at SPRINT-054 T3 (TASK-159) — push right vs gate-before-work: no change; the tension was
category-mismatched.** Read at the source rather than through this doc's summary,
[`loop-me`](https://github.com/mattpocock/skills/blob/main/skills/in-progress/loop-me/SKILL.md) defines
a **Checkpoint** as "a human-in-the-loop point where the user is asked to *verify or decide*" inside a
running workflow, and push right as "defer the checkpoint as far as it will go … asked once, late, with
everything prepared". But the skill **is itself a grilling session**, and its own DoD is "done when an
implementer agent could build it without asking a single question. Grill until then." Its model is
therefore *grill exhaustively up front, push the **runtime** checkpoint right* — and what this doc
recorded as a tension compared our **design gates** against his **runtime checkpoints**, two different
objects. A4 confirmed, though not for the reason it guessed. Both principles are already in our loop on
the correct halves: the intake grill + G1/G2 are his grilling; `/code-review` · `/verify` · close ·
`release-patch`'s single stop-before-push are his push right. Gate count already scales by size —
`quick` runs G1 only, a decomposer-approved task collapses G1 to one confirm — which is the "ask once"
half. `.claude/CONTEXT.md` § Gates and `skills/orchestrator/SKILL.md` were deliberately left untouched;
the ruling is that placement is right, not that it was never examined. One micro surfaced on re-read
and rejected: **Brief** ("a decision-ready summary … a link down to the asset itself, never the raw
output") is covered by our recommend-an-answer popups plus terse-by-default reporting.
