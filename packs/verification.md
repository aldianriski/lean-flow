# Workflow pack — verification

- **Name:** verification · **Family:** verification
- **Source:** extracted from lean-flow's `/orchestrator` review procedure and its close-time system verify
  (procedure v0.2.0, plugin 2.13.0)
- **Internal use:** 111 scoped-review runs in 28 of lean-flow's own sprints (SPRINT-082 · 086 · 087 · 088 · 089 · 090 · 091 ·
  096 · 099 · 100 · 101 · 103 · 104 · 109 · 110 · 114 · 116 · 117 · 118 · 119 · 120 · 121 · 123 · 129 · 130 · 131 · 132 ·
  133), and 13 close-time whole-check runs in 7 (SPRINT-067 · 068 · 082 · 090 · 131 · 132 · 133), counted from the archived
  execution logs.

1. **`purpose`** — Confirm that a finished change builds the right thing and obeys the project's rules, with review depth set by
   consequence, and confirm once, after everything is integrated, that the project's own whole check passes. Not for finding the
   cause of a defect, for deciding what to build, or for reviewing the whole project when only one change is in question.
2. **`inputs`** — The change (the actual difference); the files it touches and their direct callers and dependents, one hop and
   no further; the requester's acceptance criteria for the work item; the project's standards documents (contributing guide,
   style rules, agent-instruction files). Optional: a ruling the change implements, a template it must match, a failing example
   or a check finding that predates the work. No difference available: stop and ask for it. Callers or dependents not traceable:
   review the changed files alone and say so in the report. No acceptance criteria for the work item: ask the requester for them
   before reviewing; until then the Spec axis is reported as not judged, never as passed. No standards documents: say so in the
   brief, and the reviewer judges against a general good-practice baseline. Nothing earlier than the acceptance criteria exists:
   compare against them and say so. No build-manifest, runner, CI or declared check: see `verification`. No requester: see
   `escalation`.
3. **`procedure`**
   1. Classify the change on two dimensions and record the classification before choosing anything → one record line,
      `behaviour:low|material · governance:low|high`, written even when the lowest depth is chosen (decision). Behaviour
      impact: the running system does something different (behaviour change, permissions, input validation, data writes,
      interface contract, integration, deployment, security surface, money or business calculation). Governance impact: the
      change alters a rule, contract or decision that other work is measured against. When unclear, it is material.
   2. Choose depth by consequence, never by file type → the chosen depth (decision). Low on both: the maker's self-review
      checklist only. Governance impact at any size, or a small or medium material change: one independent reviewer. Large or
      high-risk (broad blast radius, core abstraction): a fuller multi-reviewer pass. A security surface gets its own separate
      pass.
   3. Brief the reviewer: the difference, the changed files, their direct callers, the earliest artifact for the Spec axis, the
      standards documents. Tell it to ignore the rest of the project → the brief (execution).
   4. Review on two axes, reported separately and never merged or re-ranked → findings per axis (execution).
      **Spec**: compared against the earliest artifact that predates the work, taking the first that exists: a ruling the
      change implements, quoted into the brief; a template the artifact must match; a retained failing example that must
      pass; a named finding from a check; the acceptance criteria of the cited work item. The acceptance criteria of the work
      itself are the fallback, and the report says when it fell back. Silence in the spec is no licence: an implied input the
      change leaves unhandled is a finding. **Standards**: the project's rules, naming the documents judged against, or saying
      none were supplied. Each finding gives severity, location and a concrete fix. The report ends with the worst finding per
      axis and a "declined to judge" list (each item with a reason; "none" if empty).
   5. Adversarial floor: a pass with zero findings is re-run once, told "a flaw exists in this change; find it". If the change
      touches tests, also list the untested branches and boundary cases → an accepted clean pass or new findings (execution).
   6. Revise loop: if the worst finding on either axis is a concrete violation (a failed comparison, or a named project
      convention, not a style suggestion), send both axes' worst findings to the maker in one revise message, take the revised
      change, and re-review once on the delta → `finding → retry → fixed | still-open` per axis, each outcome naming its
      evidence (a test, a check, an example, a review or the requester's ruling) (execution).
   7. Whole check, once, after every change is integrated and any temporary working copies are removed. Discover the project's
      check in this order and stop at the first hit: a script in the build manifest named test, check or verify; a task-runner
      target of those names; the test step of a CI configuration; a declared check file at the project root (first non-blank,
      non-comment line is the command). Run it and read what it printed → the check's own verdict line (mechanical-ingest).
   8. Rule on the outcome → pass recorded, or the blocked close with its named finding (decision).
4. **`capabilities`** — Read project files and the change; write the classification line and the review record where the
   project keeps its work records; run the project's check command and read its output; dispatch an independent reviewer with
   only the brief; hand findings back to the maker and receive the revised change; ask the requester a question.
5. **`output contract`** — The classification line for each work item. A review report per item: depth chosen, both axes
   reported separately, the comparand used (or the stated fallback), the worst finding per axis, the declined-to-judge list, and
   the revise outcome. One review record per item when the loop closes, naming depth and both classifications. For the whole
   check: its command, the verdict line it printed, and, on a failure, the named finding and the requester's recorded ruling.
6. **`verification`** — The review is checked by its report: each finding has a severity, location and fix, and both axes are
   present. The whole check runs once, after integration, never per item. Gate on the check's own printed verdict line, never a
   wrapper's or a pipeline's exit status, since formatting or a failed redirect can report on the wrong thing. No check found
   on any of the four sources: record that, then route by risk. Low or non-behavioural: continue to close. Material: do not
   close silently; ask the requester for a recorded ruling on closing unproven. A declared check file that cannot be read is
   itself a finding and counts as no check found. A failure blocks closing until the requester rules (override, or fix and rerun).
7. **`escalation`** — Whatever the second review still flags goes to the requester as still-open, never a second retry. A
   failed whole check, and a material change with no check, go to the requester for a recorded ruling. With no person available,
   judgment findings are reported, not retried: only a failed mechanical check (a check the work item named) may trigger the one
   retry, and only where the project has declared that policy. A failed whole check, or a material change with no check, then
   leaves the close unfinished and parked until someone rules.
8. **`risk policy`** — Never choose depth from file type or size alone: a one-line rule change can outweigh fifty lines of
   ordinary code. Never review the whole project. Never merge the two axes into one ranking. Never accept a zero-finding pass
   unrepeated. Never run the whole check before integration finishes. Never treat a missing check as a pass, or default an
   unclear change to low. Never let the same context that made a change be its only reviewer above the lowest depth.
