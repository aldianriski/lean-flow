---
id: ADR-020
tags: [docs, process]
domain: doc-standard
status: accepted
related: [ADR-014, ADR-015, ADR-017, ADR-019]
---

# ADR-020 — The research cap moves to 130, and a spent verdict is frozen rather than capped

- **Status:** accepted (2026-08-14)
- **Deciders:** Maintainer
- **Context driver:** two standing §2 breaches that had been carried for sprints under a label neither deserved.

## Context

`docs/research/` carried two docs over its `120 soft` cap — `graph-engineering.md` (122) and
`loop-hygiene-prd.md` (139). Both had been described as *ordinary drift* in earlier task text, a phrase
L-106 was written to correct and which was then repeated while citing it. SPRINT-063 T3 sorted each
fresh, per §2's Growth rule. **Neither is drift, and they are not the same problem.**

**The corpus first, because it decides whether the number itself is wrong.** 33 docs, **median 73
lines**, ten between 100 and 120, exactly two above. A cap of 120 is therefore not systematically
mis-set — which rules out the easy answer of raising it far enough to cover both.

**`graph-engineering.md` — the number is a little wrong.** Git history is decisive: it was created at
**107** lines and moved to 122 in a single later commit that folded an adversarial pressure-test into
the existing structure — the Verdict block, Options A/B/C, a table row and Findings prose, **woven
throughout rather than appended**. So it is not an append-only series either, and ADR-014's `logs/`
split does not reach it. Every remaining route back under 120 runs through deleting the Verdict, an
Option, or table rows — which is precisely §2's stated tell: *"when that is the only route, stop and
rule the number."* The RESEARCH template mandates five sections, and a two-axis comparison doc carrying
a 15-row table lands near 120 by construction; ten of 33 docs already sit in that band.

**`loop-hygiene-prd.md` — the cap is measuring the wrong thing.** Its history is the opposite shape. It
was dieted to **118** (under cap) at SPRINT-058, then went 118 → 136 → 139 through **supersession
annotation**: the blockquote recording that it is spent, why, which decisions were built on it, and
where its one live rule was rehomed. Its substance never grew. SPRINT-060 T4's own note asserts the doc
"stays exactly where it is and inside its cap coverage" **in the same commit that added 18 of those
lines** — the annotation that marks a doc dead is what put it in breach.

That is a category §2's Growth rule did not name. §2's research row already says a spent verdict is
*"marked `status: superseded` **rather than edited**"*, and §11's only exit for it is archival once
nothing live cites it — which SPRINT-063 T2 measured as blocked: `ADR-015`, `LEARNINGS.md`,
`architecture-baselines.md` and TASK-199 all cite it. So the cap demanded the one action the standard
forbids, on a doc with no other exit, forever.

## Decision

**Two rulings, independent, in one record because they are the same question — what the research cap
is for.**

1. **`research/<slug>.md`'s cap moves from `120 soft` to `130 soft`.** Derived from the corpus: median
   73, ten docs in the 100–120 band, and the template's five mandatory sections plus a comparison table
   landing near the old ceiling by construction. 130 covers that format without licensing sprawl —
   deliberately **not** high enough to have covered `loop-hygiene-prd.md`, because that doc's breach has
   a different cause and papering over it with one number would have hidden the second finding.

2. **A `status: superseded` doc is FROZEN: §2's cap does not apply to it.** Its only legal future is
   §11 archival. The single thing that can still grow on it is the annotation recording why it is
   spent, so capping it asks for the supersession trail to be deleted. It exits via archive, never via
   a diet.

**The exemption is reported, never silent.** `check-doc-caps.sh` prints
`FROZEN (superseded): <file> (<n> lines, cap <c>)` with its exit condition named. A check that goes
quiet is the silent false negative that file exists to prevent (L-058).

**The matcher is position-anchored** — line-start `status:` inside the first 20 lines, first match
only. A substring search would match prose *about* supersession, and this corpus documents its own
formats (L-108). The retained fixture proves it: `live.md` carries the literal string
`status: superseded` in prose below its frontmatter and is still caught.

## Consequences

**Positive:** the §2 cap report goes clean without anything being trimmed, so the doc-aging line
SPRINT-062 T2 wired to a consumer stops carrying two permanent un-actionable entries. A spent verdict
can be annotated as fully as its rehoming needs without fighting a line count.

**Negative (trade-offs accepted):**

- **The exemption is a coverage reduction** (L-076). A live doc could be marked `superseded`
  prematurely and escape its cap. Mitigated by the retained must-catch fixture and by supersession
  being an author's deliberate, reviewable frontmatter change — not something that happens by accident.
- **130 will be reached again.** It buys the current format headroom, not permanent room; the next
  occupant should re-measure the corpus rather than re-argue this.
- **Two rulings in one ADR** is a mild violation of one-decision-per-record. Accepted because splitting
  them would leave each half unable to explain why the other was not the answer.

## Alternatives considered

| Option | Why rejected |
|---|---|
| Raise the research cap to ~145 to cover both | The obvious move, and it hides the finding. The corpus (median 73) gives no support for 145, and one number would have concealed that the two breaches have unrelated causes. |
| Trim `graph-engineering.md` by three lines | Every route runs through deleting the Verdict, an Option, or table rows — deleting signal, or re-wrapping prose for a green number. §2 forbids both by name. |
| Split `graph-engineering.md` to a `logs/` sibling (ADR-014's mechanism) | Correct for an append-only series; this is not one. The +15 lines are woven through five existing sections, not an appended round. |
| Trim `loop-hygiene-prd.md`'s supersession annotation | Deletes the WHY-trail the doc is retained for, and §2 forbids editing a spent verdict. The cap would be satisfied by destroying the reason the file is kept. |
| Let both keep reporting as soft breaches | A soft cap reports so a human can act. Neither had an action available — one could not be trimmed, the other could not be edited — so the report was noise that no promote review could ever clear. A matcher whose finding is never actionable is the failure SPRINT-062 T2 fixed for the doc-aging line. |
