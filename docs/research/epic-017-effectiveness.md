---
owner: Maintainer
last_updated: 2026-09-23
update_trigger: TASK-386 records the "after" figures, or a re-run finds the method needs correction
status: current
id: epic-017-effectiveness
tags: [process, tooling]
domain: governance
related: [conformance-baseline]
---

# EPIC-017 effectiveness — the "before" baseline (SPRINT-106 T0)

All figures measured at commit **4136ded** (`git rev-parse --short HEAD`), before the store's first
commit (T1) and before TASK-364 changes the layout. TASK-374 · EPIC-017 Closed-when 7. Fewer lines and
fewer checkboxes are explicitly **not** the success criterion — these three measures are.

## Method (re-run unchanged by TASK-386)

**1. Completeness.** Count tasks tagged to EPIC-017 at the first decomposition commit vs. the commit
where three review rounds found no further gaps. First pass: `git show <plan_commit>:TODO.md | ...`
filtered to the EPIC-017 block (between the `<!-- ── EPIC-017 -->` marker and the next `<!-- ──` marker
or section end), extract `TASK-NNN` ids. Settled pass: `git ls-tree -r --name-only <decompose_commit>
docs/work` (or, once the store lands, `docs/work/**/TASK-*.md`), count files. Ratio = first ÷ settled.

**2. Retrieval.** 12 fixed probes (below), each "Where does X live?" with a verified answer-key path.
**Always-loaded read set for the answerer: `.claude/CLAUDE.md` and `.claude/CONTEXT.md` only** — no
other file, no search tool. Scoring: **hit** = the answer names the key path exactly, or (for a
directory-level key) names that directory; **miss** = anything else, including a plausible-but-wrong
path or "not found." Run by handing a fresh agent the 12 questions plus the two always-loaded files,
recording its 12 answers verbatim, then scoring against the key. Re-verify every key path still exists
at the "after" commit before scoring — a key that moved is a method failure, not a miss.

**3. Recurrence.** Count learning count-bumps per sprint (last 10: SPRINT-096…105) in
`docs/LEARNINGS.md`, via two independent selectors, reported separately — see § Recurrence.

## 1. Completeness (before): 9 / 26 = 0.346

- **First pass** — commit `4290781` (`plan_commit`), `git show 4290781:TODO.md`, EPIC-017 block (the
  `<!-- ── EPIC-017 -->` marker at line 203 to the blank line before `TASK-366`, which belongs to a
  different tracker — the ask-dont-tell hook, not EPIC-017): **9 tasks** — `TASK-359, 360, 361, 362,
  363, 364, 365, 369, 370`. Verified: `TASK-366/367/368` sit in the same TODO.md but tracker to a
  different origin (`close-retro`, ask-dont-tell), confirmed by reading their `tracker:` fields, not by
  position alone.
- **Settled pass** — commit `81407ad` (three review rounds later), `git ls-tree -r --name-only 81407ad
  docs/work`: **26 files**, all named `TASK-NNN-*.md` in `docs/work/{todo,backlog}/`
  (`todo/`: 359, 360, 369, 370, 374 — 5 files; `backlog/`: 361–365, 371–373, 375–387 — 21 files).
- **Ratio: 9 ÷ 26 = 0.346** — the first pass covered barely a third of what review eventually filed.
  Metric, stated generally: **tasks present after the first decomposition pass ÷ tasks present once
  review finds no further gaps.**

## 2. Retrieval (key only — do NOT answer the probes)

Always-loaded read set for the answerer: `.claude/CLAUDE.md` + `.claude/CONTEXT.md`, nothing else.

| # | Probe | Answer key (verified to exist at `4136ded`) |
|---|---|---|
| R1 | Where does a new TASK get written today? | `TODO.md` (§ Backlog) |
| R2 | Which file points to the currently active sprint? | `TODO.md` (§ Active Sprint) |
| R3 | Where is the full active-sprint Plan (Theme/Scope/DoD)? | `docs/sprint/SPRINT-NNN-<slug>.md` |
| R4 | Where does a sprint's Execution Log go (the uncapped sibling)? | `docs/sprint/logs/SPRINT-NNN-<slug>.md` |
| R5 | Where is technical debt (`TD-NNN`) recorded? | `TECH-DEBT.md` |
| R6 | Where is a learning (`L-NNN`) filed or count-bumped? | `docs/LEARNINGS.md` |
| R7 | Which skill owns sprint `promote` and `close`? | `skills/lean-doc-generator/SKILL.md` |
| R8 | Where are the SKILL.md / CLAUDE.md line caps defined? | `.claude/CLAUDE.md` (§ Definition of Done) |
| R9 | Where is the versioned doc-structure standard (WHY/WHERE SSOT)? | `spec/STANDARD.md` |
| R10 | Where is the directory structure / where-things-live map? | `docs/architecture/overview.md` |
| R11 | Where are ADRs filed? | `docs/adr/` (e.g. `docs/adr/ADR-001-curated-not-copied.md`) |
| R12 | Where does a rejected/out-of-scope backlog item go? | `.out-of-scope/<slug>.md` |

### Result (before)

Answered 2026-09-24 by a fresh Haiku subagent restricted to reading `.claude/CLAUDE.md` + `.claude/CONTEXT.md`; key committed first at `cb1479f`.

| # | Answer given | Hit/Miss |
|---|---|---|
| R1 | `TODO.md` | hit |
| R2 | `TODO.md` | hit |
| R3 | `docs/sprint/SPRINT-NNN-<slug>.md` | hit |
| R4 | `docs/sprint/logs/SPRINT-NNN-<slug>.md` | hit |
| R5 | `TECH-DEBT.md` | hit |
| R6 | `docs/LEARNINGS.md` | hit |
| R7 | `lean-doc-generator` (skill name = the key's directory) | hit |
| R8 | `.claude/CLAUDE.md` § Definition of Done | hit |
| R9 | `spec/STANDARD.md` | hit |
| R10 | `docs/architecture/overview.md` § Directory structure | hit |
| R11 | unknown | **miss** |
| R12 | `.out-of-scope/` | hit |

**Score: 11 / 12** — the one miss (R11, ADRs) is a location neither always-loaded file names. For TASK-386: R1/R2 keys are layout-dependent, so the after-run scores the same probes against the v2 locations (`docs/work/`).

## 3. Recurrence (before)

Two selectors over `docs/LEARNINGS.md` at `4136ded`, target sprints SPRINT-096…105.

**Selector (a) — attribution field, mechanical + one documented manual supplement.** Every active
(`status: active`) entry carries a `- seen: <date> (<context>)` line; every promoted (`status:
promoted`) entry carries a `Seen Sprint-NNN [· Sprint-MMM …]. Count N.` clause. Command:
`grep -E "^- seen:" docs/LEARNINGS.md` → take the first `[Ss]print-NNN` token per line (case-
insensitive, handles both `Sprint-096` and `SPRINT-096`, and a `post-SPRINT-101` prefix), bucket into
096–105. Separately: `grep -oE "Seen (Sprint-[0-9]{3}( · )?)+\." docs/LEARNINGS.md` for promoted
entries' base attribution list, same bucketing. **Manual supplement (3 entries):** `L-209`, `L-210`,
`L-211` are `status: active` but were filed same-day and have **no `- seen:`/`- count:` block yet** —
attributed by the `SPRINT-NNN` named in the entry's own opening sentence instead (`L-211`→105, `L-209`
→105, `L-210`→ no sprint named, excluded). **A raw substring grep for `SPRINT-096` alone returns ~104
hits** — almost all are `(§11 collapse, SPRINT-096 promote)` boilerplate stamped on ~100 unrelated
promoted entries, not sightings in SPRINT-096; this is the exact "matched by shape, not substring" trap
CLAUDE.md names, and is why the field-anchored form above is the one to trust, not a bare grep.

**Selector (b) — git log, commits whose subject names the sprint and whose diff touches a `count:`
line.** Command: `git log --format='%H|%s' -- docs/LEARNINGS.md | grep -E "^[0-9a-f]+\|sprint\(0?(9[6-
9]|10[0-5])\)"`, then per commit `git show <hash> -- docs/LEARNINGS.md | grep -cE "^\+.*- count:
[0-9]+"` (added count-lines; `^-.*- count:` for removed/modified). 15 commits matched across the 10
sprints.

| Sprint | (a) seen-field | (b) count-line adds | Agree? |
|---|---|---|---|
| SPRINT-096 | 1 | 1 | yes |
| SPRINT-097 | 2 | 2 | yes |
| SPRINT-098 | 4 | 4 | yes |
| SPRINT-099 | 2 | 2 | yes |
| SPRINT-100 | 2 | 2 | yes |
| SPRINT-101 | 4 | 2 | **no** |
| SPRINT-102 | 1 | 2 | **no** |
| SPRINT-103 | 3 | 3 | yes |
| SPRINT-104 | 1 | 1 | yes |
| SPRINT-105 | 2 | 0 | **no** |
| **Total** | **22** | **19** | |

**Where they disagree, and why — not forced to agree:**

- **SPRINT-105 (2 vs 0):** `L-209`/`L-210`/`L-211` were filed at SPRINT-105 close/T3 but have no `-
  count:` line yet (confirmed by reading their commits' diffs directly — the header line lands, no
  metadata block follows). Selector (b) is structurally blind to an entry that hasn't received its
  count field; selector (a)'s manual supplement catches 2 of the 3 from body prose (the third, `L-210`,
  names no sprint at all and is excluded from both). This is a real gap in the source file, not a
  selector bug — worth flagging for a hygiene pass, not resolving here.
- **SPRINT-101 (4 vs 2):** selector (a) counts `L-170`, a *promoted* entry whose base attribution line
  reads `Seen Sprint-087 · Sprint-091 · Sprint-101. Count 3.` — a real SPRINT-101 sighting. Promoted
  entries use inline `Count N` prose, never a `- count:` field, so selector (b)'s literal `count:` grep
  cannot see it structurally, by design of the file's own two formats (active vs. promoted).
- **SPRINT-102 (1 vs 2):** selector (b) found a second commit (`sprint(102): plan locked …`) that added
  a `- count:` line to `docs/LEARNINGS.md`; selector (a)'s `- seen:` field for that entry does not name
  SPRINT-102. The commit-subject attribution answers "which sprint's commit touched the file," not
  "which sprint the learning is about" — those can diverge when an edit lands inside another sprint's
  commit range. Not investigated further here (out of T0's scope; flag for TASK-386 if it recurs).

**Headline figure: selector (a), 22.** It reads the field the file itself uses to declare "which
sprint" (`- seen:` / `Seen Sprint-…`), which is closer to the file's own claim than a commit-subject
proxy that can pick up unrelated edits landing in the same commit. Selector (b) is retained as the
cross-check specifically because it is *differently wrong* — a commit-boundary artifact rather than a
prose-attribution artifact — and the two disagreements above are exactly where that difference shows.

## Execution Log entry (for the coordinator to append)

```
### T0 · progress · 2026-09-23
Froze the "before" baseline in `docs/research/epic-017-effectiveness.md` at `4136ded`. Completeness
9/26 = 0.346 (4290781 vs 81407ad, EPIC-017 block only). Retrieval: 12 probes + answer keys written,
Result table left empty for the coordinator to score. Recurrence: selector (a)=22, (b)=19, headline
22 (seen-field); disagreed at SPRINT-101/102/105, each explained, not forced to agree.
```
