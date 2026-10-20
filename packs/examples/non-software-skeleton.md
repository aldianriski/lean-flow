# Example — a non-software pack skeleton (declaration only)

> **Not a pack.** This is a skeleton that exists to show the [contract](../CONTRACT.md) does not force any one domain's words.
> Its procedure names steps without writing them out, which the contract allows only for a skeleton. Nothing here has real use.

- **Name:** supplier shortlist · **Family:** solution-analysis
- **Source:** none (skeleton) · **Internal use:** none (skeleton)

1. **`purpose`** — Produce a ranked shortlist of up to three suppliers for a stated need, with the reason for each ranking. Not
   for negotiating terms or signing anything.
2. **`inputs`** — The need, stated as requirements and a budget ceiling; the candidate suppliers; and a requester who can rank
   conflicting requirements. If the budget ceiling is missing, ask before scoring.
3. **`procedure`**
   1. Restate the need as scoring criteria with weights → a criteria table (decision).
   2. Gather each candidate's published facts against the criteria → a facts sheet per candidate (mechanical-ingest).
   3. Score each candidate and note every assumption → a scored table (execution).
   4. Rank, and write one reason per ranking → the shortlist (decision).
4. **`capabilities`** — Read the candidates' published material; write a document; ask the requester a question.
5. **`output contract`** — The criteria table with weights; one facts sheet per candidate; the scored table with assumptions
   marked; a shortlist of at most three, each with one reason a second reader can trace to the scored table.
6. **`verification`** — Re-derive each score from its facts sheet; a score that cannot be re-derived is a failure.
7. **`escalation`** — Stop and ask the requester when two weighted criteria conflict. If the requester cannot be reached, rank
   on the higher-weighted criterion and say so at the top of the shortlist.
8. **`risk policy`** — Never contact a supplier or disclose the budget ceiling. Score only from published facts, never from a
   guess presented as a fact.
