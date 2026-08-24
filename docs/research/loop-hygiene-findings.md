---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Its parent loop-hygiene-prd.md is archived under §11, taking this detail file with it
status: superseded
id: loop-hygiene-findings
tags: [process, docs, tooling]
domain: governance
related: [loop-hygiene-prd, loop-hygiene-workstreams]
---

# Process Loop Engineering & Docs Hygiene — findings register (detail)

> Split verbatim out of [`loop-hygiene-prd.md`](loop-hygiene-prd.md) at SPRINT-058 T1 (§7 diet — whole
> sections moved, nothing compressed). The evidence column cites line numbers as they stood at the
> 2026-07-17 audit; they are a record of that snapshot, not live pointers.
>
> **`status: superseded` — ruled 2026-08-10 (SPRINT-061 T2).** This one was the genuinely open case,
> and the task that filed it warned against inheriting the parent's answer: a findings register makes
> no recommendation, so there is an honest argument that it has nothing to supersede and is simply a
> record that stays accurate. What settles it is reading the rows. **Row 24 is now known false** —
> it reports *"dedup pass ran once in 23 sprints; CONTEXT.md back at 127/130"*, implying accreted
> duplication, and SPRINT-060 T1 went looking for that duplication section by section and found none;
> the growth is 0.83 lines/sprint of promoted rules, which is the learning loop working (ADR-017).
> A register carrying a falsified finding cannot honestly be `current`. The remaining 28 rows have all
> been dispositioned through W0–W6.
>
> **What `superseded` means here, precisely:** the register no longer drives decisions. It stays the
> evidence trail for why the workstreams existed, which is what the RESEARCH template intends by
> *remains the WHY-trail*. Nothing is deleted and nothing moves — §11 archives only once nothing live
> cites it, and `loop-hygiene-prd.md` still points here.

## Appendix — Findings register (condensed, by severity)

| # | Sev | Area | Finding | Evidence |
|---|-----|------|---------|----------|
| 1 | high | hygiene | Tombstone format close writes ≠ format §11 deletes; 13 graveyard lines never swept | TODO.md:33-74 · DOCS_Guide.md:231 |
| 2 | high | hygiene | Stale "SPRINT-016 active" pointer survived close; close only clears § Active Sprint header | TODO.md:48 · lean-doc-generator/SKILL.md:90 |
| 3 | high | hygiene | qa-check 47/47 green while README/CLAUDE/TD drift exists — coverage gap, not neglect | scripts/qa-check.sh:67 |
| 4 | high | staleness | README footer v1.5.0 vs plugin 1.10.2 — L-015 incident recurred | README.md:347 · plugin.json:3 |
| 5 | high | staleness | gen-index.sh never refreshes its own `last_updated` (script bug) | scripts/gen-index.sh:68 |
| 6 | high | process | CLAUDE.md has no ownership frontmatter; invisible to checker | .claude/CLAUDE.md:1 · qa-check.sh:67 |
| 7 | high | process | TD-008 six sprints past the 3-sprint re-review bar, no re-review | TODO.md:86 · DOCS_Guide.md:214 |
| 8 | high | wiring | Bug-intake in CONTEXT.md unimplemented in triage | CONTEXT.md:53 · triage/SKILL.md:38-46 |
| 9 | high | gates | Close's destructive ops (delete/archive/squash) run with no approval verb | lean-doc-generator/SKILL.md:90 |
| 10 | high | integrity | L-016/L-017 ids reused after pruning — shipped citations now point at wrong learnings | tdd/SKILL.md:82 · task-decomposer/SKILL.md:89 · LEARNINGS.md:57,61 |
| 11 | high | consumer | insights points at another skill's private `templates/LEARNINGS.md.template` (unresolvable cold) | insights/SKILL.md:36 |
| 12 | high | templates | ADR + RESEARCH templates missing ADR-009 metadata all real instances carry | templates/ADR.md.template:1-9 · CONTEXT.md:112 |
| 13 | med | wiring | Promote never filters `state: ready` | lean-doc-generator/SKILL.md:88 · triage/SKILL.md:46 |
| 14 | med | wiring | Prime's Next: never routes to /triage | prime/SKILL.md:52-55 |
| 15 | med | wiring | `/fork` advertised, wired nowhere; `/simplify` one hop removed | CONTEXT.md:45 |
| 16 | med | gates | Promote has no explicit sign-off between governance review and render/commit | lean-doc-generator/SKILL.md:88 |
| 17 | med | gates/wiring | G1 ownership contradiction: decomposer "approve is the gate" vs orchestrator "G1 all modes" | task-decomposer/SKILL.md:13 · orchestrator/SKILL.md:30 |
| 18 | med | archive | TASK-040/047 trackers point at nonexistent temp-dir verdicts | TODO.md:60,69 |
| 19 | med | consumer | insights hardcodes `scripts/gen-index.sh`; prime + dispatch.md embed `docs/research/…` paths | insights/SKILL.md:39 · prime/SKILL.md:38 · dispatch.md:5 |
| 20 | med | consumer | Dangling L-024/L-037/L-042 citations in shipped orchestrator surface | orchestrator/SKILL.md:83,107 · dispatch.md:36 |
| 21 | med | templates | Template count disagrees: README 13 · CLAUDE/ARCHITECTURE 14 · disk 16; BUG unlisted in DOCS_Guide §2 | README.md:290 · ARCHITECTURE.md:29 |
| 22 | med | dup | Modes table byte-identical in CONTEXT.md and README, against ADR-007 pointer rule | CONTEXT.md:66-72 · README.md:192-198 |
| 23 | med | staleness | TODO:98 points at rotated-away CHANGELOG content; QA.md hand-written cap snapshot drifted | TODO.md:98 · docs/QA.md:24 |
| 24 | med | process | Dedup pass ran once in 23 sprints; CONTEXT.md back at 127/130 | commit ee8df02 |
| 25 | low | format | council: no `argument-hint`, bare `references/` paths; `Output`/`Output format`/`When to run` naming drift; no shared skeleton | council/SKILL.md:1-7,33 · insights/SKILL.md:41 |
| 26 | low | format | `allowed-tools` Bash scoping inconsistent, rationale unrecorded | release-patch vs tdd/diagnose frontmatter |
| 27 | low | format | flow + release-patch descriptions lack the "do not use → /X" redirect 12/14 have | flow/SKILL.md · release-patch/SKILL.md frontmatter |
| 28 | low | staleness | Orphan `docs/research/image.png`, unreferenced since SPRINT-006 | docs/research/image.png |
| 29 | low | standalone | refactor-advisor reads CONTEXT.md/ADRs with no degrade-gracefully clause | refactor-advisor/SKILL.md:34 |
