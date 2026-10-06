---
sprint: 117
slug: reports-lead
owner: Maintainer
last_updated: 2026-10-06
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-117 — Execution Log

> Append-only companion to [`../SPRINT-117-reports-lead.md`](../SPRINT-117-reports-lead.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9 · ADR-014). **Never edit a past entry** — correct it with a new one.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.

### 2026-10-06 | promote | plan locked, governance signed, one member: skill reports lead with the conclusion
The owner picked TASK-321 over a 2.1.0 release, TASK-404's profile, and stopping. Size check at pull: M, no split. The member moved
backlog → todo in its own commit (`c09b037`) and was stamped in `12361ed`. The owner signed the checklist:
- **L-promotion:** L-229 (count 2), promoted by merge into `.claude/CONTEXT.md` § Sprint model's `Layers:` bullet (`9ce5663`). Census by a
  second selector: it is the only `promoted: no` row with count ≥ 2.
- **TD aging:** 112 of 116 open rows aged against sprint 117 (created ≤ 114). Second route: 116 − 4 filed at 115/116 = 112. One `high` row
  (TD-168, bold-safe selector), owned by TASK-404.
- **doc-aging:** §11: TD-211 (resolved at SPRINT-114) deleted (`9ce5663`); 145 rows, 116 open. §2: 0 OVER-CAP; 4 recorded `retain`/frozen
  dispositions. CONTEXT.md sits at 150/150 lines after the merge; token budget ~13,518 ≤ 16,087.
- **epic rollup currency:** EPIC-015 and EPIC-016 current; EPIC-014 archived at SPRINT-116.
- **handoff ledger:** none.
promote-check: `PASS -- 4 pass, 0 fail`.

### 2026-10-06 | progress | G1 + G2 signed (owner) @ 8ab8d54; A1 confirmed
- **G1** (full checklist; `origin: manual`): done when the three skills' boundary reports open with the verdict and end with exactly one
  `Next:` line, with no SKILL.md over its cap. Size M. Out: the other 11 skills, length caps, night-run Part 4's machine-read lines.
- **G2:** one shape rule applied in place. prime gets a `Verdict:` first row; orchestrator gets one "Report shape" line covering gate verdicts,
  task completions, the sprint-bulk exit and confirmation popups; lean-doc-generator's step 8 is rewritten with no line added. No eval asserts
  prime's header (`git grep 'PRIME HEALTH'`: only the SKILL.md itself).
- **A1 confirmed (owner):** shape, not length; no cap added.
- Built inline (three small doc edits; a dispatch would cost more than the edit), then a Codex review (shipped skills), then cold runs for the owner (J2).

### 2026-10-06 | progress | T1 built inline (`118973e`): the three skills' boundary reports lead with the verdict
- prime: step 5 says the report's first row is the verdict; the Output format block gains a `Verdict:` row first (`Next:` stays last).
- orchestrator: one **Report shape** paragraph under § Review: gate verdicts, task completions, the sprint-bulk exit and confirmation popups.
- lean-doc-generator: step 8 rewritten in place; popups lead with their decision the same way.
- Caps: prime 132 · orchestrator 137 · lean-doc-generator 138 (all ≤ 140); prose-density `30 pass, 0 fail`.
- **Coordinator fix (`ab2ce79`):** the promote-time L-229 merge had made CONTEXT.md line 108 490 chars (prose-density FAIL, found by this run);
  rewritten at 340 chars with the same rule. CONTEXT stays at 150/150 lines, so splitting it was not an option.
consequence · T1 · behaviour:low · governance:high

### 2026-10-06 | progress | T1 reviewed and judged: Codex R1 (2: 1 adopted, 1 declined with reason) · R2 (1, adopted) · two cold runs · owner PASS (J2)
- **Codex R1** (`118973e`): adopted, the sprint-bulk exit keeps `run · N of M DoD ticked` as its first line (that header is its verdict;
  nothing goes above it). Declined, prime's generic example "ready — required context is current": the frozen done-when requires the
  first line to say what to do next, so a verdict naming the next step is the requirement, not duplication. R2 agreed and asked step 5
  to say so (`a7ebb7f` → `df487d8`).
- **Cold run 1** (fresh agent, repo SKILL.md text only, since the installed 2.0.0 copy is stale): every report's opening line said what
  happened; the orchestrator and close reports put the next step only on the last line, and prime's verdict sat below an empty banner.
  That is a done-when miss review had not caught → `df487d8`: one opening line carries both verdict and next step, and prime's banner *is*
  the verdict.
- **Cold run 2** on `df487d8`: all three literal first lines carry verdict + next step; each ends with exactly one `Next:` line. The close
  report's "what to do" half was the weakest (vague, then repeated by `Next:`).
- **Owner ruling (J2): PASS.** Side-finding for close: prime's `Next:` rule names `sprint-bulk unattended` for any active sprint, even when
  every open task is HITL/J2, where a night run would only park → **close-retro TD candidate**.
