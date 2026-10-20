# Workflow pack — solution analysis

- **Name:** solution analysis · **Family:** solution-analysis
- **Source:** extracted from lean-flow's decision-research template (the `lean-doc-generator` RESEARCH template; plugin 2.12.1).
  The template has no procedure section of its own, so the steps below are derived from its sections and from the skill's
  research guidance (a decision-driving question, options, evidence, a recommendation that can feed a decision record).
- **Internal use:** the docs in `docs/research/` that follow the template's shape: 24 by one route (a recommendation heading
  plus an options or findings heading), last updated 2026-06-22 → 2026-10-20; all 24 also carry a one-line verdict. Examples:
  platform-readiness-audit (2026-08-10), gauntlet-loop-delta (2026-08-14), harness-delta (2026-08-25), guard-audit
  (2026-10-02), loopcraft-adaptation (2026-10-19), reference-rejudge (2026-10-20)

1. **`purpose`** — Answer one decision-driving question with a sourced recommendation: a short document that lists the real
   options, cites the evidence for each, and ends in a decided verdict. Not for a design that must be felt before it can be judged
   (build a throwaway prototype instead), not for a genuinely balanced, high-stakes fork (escalate it), and not for documenting
   how something works (that belongs with the thing itself).
2. **`inputs`** — The question, with what depends on it; the sources available to answer it; and a requester who owns the
   decision. No question: stop and ask for one. A question that cannot end in a recommendation: say so and route it (see
   `escalation`). What depends on the answer unknown: ask the requester, because the cost of guessing wrong sets how much
   evidence is enough. No sources: gather them in step 3, and if none can be found, stop with the options and no verdict. No
   requester at all: see `escalation`.
3. **`procedure`**
   1. Frame. Phrase the one question so it can end in a recommendation, and state in one to three sentences what depends on the
      answer and the cost of guessing wrong → the question and its stakes (decision).
   2. Options. List each real option in one line, what it is rather than how to build it, with its headline trade-off. Include
      only options that exist → the options list (decision).
   3. Findings. Gather the evidence that moves the verdict. Each finding cites its source and names the option it favours; facts
      only, never implementation detail. Bulk extraction from long sources is high-volume work → the findings list, each with a
      source (execution; mechanical-ingest for bulk extraction).
   4. Recommend. State the recommendation decided, not hedged, with a one-line why, and copy it as a one-line verdict to the
      top of the document. Fill the verdict last → the recommendation and the verdict line (decision).
   5. Decision-record test. If the choice is hard to reverse AND surprising AND a real trade-off, write a decision record and
      link it; the research then becomes that record's context. Otherwise stop here → a linked decision record, or a note that
      none is needed (decision).
   6. Open questions. List what this did not settle, each routed to a follow-up: a work item, a throwaway prototype, or a
      review by independent reviewers → the open-questions list (execution).

   Once a decision is built on the document, mark it superseded rather than editing it; a revised answer is a new document.
4. **`capabilities`** — Read the sources the question points at; search for further sources; write one document; link to another
   document; ask the requester a question.
5. **`output contract`** — One short document containing, in this order: the question, with a note of what depends on it; a
   one-line verdict at the top; the options, one line each with its trade-off; the sourced findings; the recommendation with its
   one-line why; and the open questions. Sign of done: the verdict line is present, is a decision rather than a hedge, and
   every section above is non-empty. Optionally, a linked decision record. Sign of done: it names the document as its context
   and the document links back to it.
6. **`verification`** — Before handing over, read the document against four checks. Every finding cites a source; a finding with
   none is a failure. Every option is assessed by at least one finding, or is dropped. The one-line verdict says the same thing as
   the recommendation; a mismatch is a failure. A second reader, using only the document, can trace the verdict back through
   the findings to the question; a verdict that rests on no finding is a failure.
7. **`escalation`** — If the question cannot be settled on paper, because it needs to be felt or tried, stop and build a
   throwaway prototype instead. If the options are genuinely balanced and a wrong call is expensive, hand the fork to independent
   reviewers or to the requester for a ruling. The requester owns the decision; this procedure only recommends. If nobody is
   available and the evidence does not settle it, stop with the options and the findings and write no verdict.
8. **`risk policy`** — Never give a recommendation without sources. Never pad the list with invented options to look thorough.
   Never edit a document a decision was built on; supersede it. Never include how-to detail: the document records why, not how.
