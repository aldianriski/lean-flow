---
owner: Maintainer
last_updated: 2026-10-19
update_trigger: A scan-5 keeper ships or is rejected, or mattpocock/skills is re-scanned again
status: current
id: mattpocock-scan5
tags: [process, tooling]
domain: governance
related: [mattpocock-adaptation, brainstorming-adaptation]
---

# Research — mattpocock scan 5: what changed since 2026-08-09, and is any of it a delta?

> **Question.** Of what mattpocock/skills added or changed after scan 4, what carries a delta over lean-flow's current surface (L-017)?
> **Verdict.** No new skill. **2 micro keepers** (filed TASK-448 · TASK-449); everything else is a fast reject. One tension recorded, not adopted.

## Why this matters

Scan 4 declared the corpus fully mapped, so a later scan only re-checks what moved. The repo moved a lot:
125 commits / 147 files since `84fdeffd` (the last commit before 2026-08-09). A stale map would let a
real execution-quality fix pass unexamined, or re-litigate settled rejects.

## Corpus

**38 `SKILL.md`** — 20 `engineering/` · 7 `productivity/` · 7 `in-progress/` · 4 `misc/`. Two routes
agree: the git tree API at `main` (`truncated:false`) and a per-folder contents-API probe. The tree at
`84fdeffd` gives 35, matching scan 4. New `skills/deprecated/` holds only a README.

- **New:** `retro` · `pr` · `implement-spec` (all graduated 2026-09-24) · `in-progress/chief-of-staff`.
- **Removed:** `resolving-merge-conflicts` ("no longer needed", 09-24) — our K4 already lives in `dispatch.md`.
- **Materially changed:** `diagnosing-bugs` · `code-review` · `tdd` · `grilling` · `implement`; smaller: `to-tickets` · `wayfinder` · `handoff` · `ask-matt`.
- **Repo-wide:** `CONTEXT.md` → `GLOSSARY.md`; a top-level `SCOPE.md` (admission bar = an observed failure that fits the philosophy) and six new `.out-of-scope/` records, one of which closes the repo to new skills.

## Delta map (changed or added only)

| Item | lean-flow equivalent | Verdict |
|---|---|---|
| `retro` | Sprint-Close Retro · §10 buckets · "every hygiene rule gets a matcher" · placement test | **Reject** — covered |
| `pr` | none needed — the owner pushes; AFK-safe reversibility · review blast radius | **Reject** — our loop has no PR step |
| `implement-spec` | `orchestrator/references/dispatch.md` (worktree fleet · integration worktree · merge-back) | **Reject** — its one unmatched idea, a rolling frontier instead of wave barriers, has no measured idle cost at 2–7-task sprints (`.out-of-scope/bulk-throughput-proof.md`). Revisit only if wave idle time is measured |
| `chief-of-staff` | `/flow` · night-run · tier routing · autonomy ≠ authority | **Reject** — covered, and still in-progress upstream |
| `diagnosing-bugs` — prove a forced mutation landed | maintainer CLAUDE.md (Consequential G: `cmp` the seed vs pristine; L-187) | **Keeper K1** — absent from `/diagnose` and `/tdd`, i.e. absent on the consumer path |
| `code-review` — search the repo for its standards docs | `review-scoping.md` says documented standards "override the baseline" but never says to find them | **Keeper K2** |
| `tdd` — note what each seam catches and misses | `tdd/references/test-strategy.md` Q1–2 | **Reject (micro)** — covered |
| `grilling` — phrase questions so "yes" accepts the recommendation | AskUserQuestion options carry a `(Recommended)` first option | **Reject** — covered |
| `implement` · `wayfinder` · `handoff` · `ask-matt` edits | G1 restates the goal · L-143 id derivation · `/handoff` temp-dir resolution · re-check-the-roster rule | **Reject** — covered |
| `GLOSSARY.md` rename · em-dash purge | `CONTEXT.md` is our SSOT and more than a glossary | **Reject** — a rename would break consumers |

## Keepers (micro; filed, not adopted in-scan)

- **K1 — forced-red proof.** A red produced by mutating code or a fixture, or by reverting the fix,
  counts only once a diff/`cmp` against a pristine copy proves the change landed. Upstream evidence:
  `skills/engineering/diagnosing-bugs/SKILL.md` at `f3fc5632` (closes their issue #955). Lands in
  `/diagnose` Phase 5 (and `/tdd`'s RED step if the §10 placement test says both) → **TASK-449**.
- **K2 — the reviewer finds the standards docs.** The Standards pass is told to search the repo for
  every file that says how code should be written (CONTRIBUTING, style guides, coding standards) and
  read them. Upstream evidence: `skills/engineering/code-review/SKILL.md` at `3da8c011` (closes three
  observed-failure issues). Consumer-side gap (L-015): our own reviewer gets CLAUDE.md, adopters keep
  standards elsewhere. Lands in `orchestrator/references/review-scoping.md` → **TASK-448** (bundled
  with the superpowers keeper for the same file, `brainstorming-adaptation.md` § Re-scan).

## Out of scope / open questions

- **Tension, recorded not adopted:** upstream `.out-of-scope/native-question-tool.md` rejects
  AskUserQuestion pickers because they "push toward pre-baked multiple choice". That cuts against our
  L-002 popup rule. No change: L-002 is a promoted rule with its own sightings, and every popup here
  carries an `Other` free-text answer. Revisit if a sighting shows a popup's options narrowed an answer.
- Distribution: upstream now installs via Copilot's plugin marketplace; lean-flow ships no Copilot
  manifest. Outside the skill delta — noted only.
- The cosmetic-change filter was heuristic; `wizard` and `teach` residue was not read (out of domain).
