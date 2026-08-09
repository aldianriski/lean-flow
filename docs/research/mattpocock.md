---
owner: Maintainer
last_updated: 2026-08-09
status: current
id: mattpocock-adaptation
tags: [process, tooling]
domain: governance
related: [model-purpose]
---

# Research — what, if anything, from mattpocock/skills should lean-flow adopt?

> **Question.** Of the skills in [mattpocock/skills](https://github.com/mattpocock/skills), which carry a *delta* over lean-flow's existing surface worth adopting?
> **Scan 1 (2026-07-10)** — 7 examined, 2 keepers + 1 micro. **All shipped**: Standards-vs-Spec → the review split · skill-powered dispatch → ADR-010's spawn-with-brief · wayfinder fog-mapping → `/task-decomposer --fog`. Detail in git (SPRINT-016 era).
> **Scan 2 (2026-08-09, SPRINT-047 T2)** — 5 examined, 2 keepers. **Both shipped in SPRINT-048**: `grilling`'s frontier batching (T3) · `writing-for-agents`' disclosure test + completion-criteria sharpness (T4). Detail in git.
> **Scan 3 (2026-08-09, SPRINT-050 T1)** — the `engineering/` remainder, 10 examined, **5 keepers, all micro**. § below.
> **Scan 4 (2026-08-09, SPRINT-050 T3)** — `productivity/` · `in-progress/` · `misc/`, 13 examined, **0 keepers**. The corpus is now fully mapped.

**Corpus: 35 `SKILL.md` files** — 18 `engineering/` · 7 `productivity/` · 6 `in-progress/` · 4 `misc/`.
Counted deterministically (`gh api …/git/trees/main?recursive=1`), not read off a summary: a `WebFetch`
summary of the same endpoint reported 32 while listing 35, its headline counts disagreeing with its
own lists. The previous figure recorded here (34) was wrong.

## Why this matters

lean-flow keeps being offered near-identical loops (bmad, structarmed, brainstorming — all fast
rejects, L-017). The recurring value is never the whole framework; it's the one or two techniques we
lack. Guessing wrong means importing a redundant tracker dependency (off-ethos) or missing a genuine
execution-quality upgrade.

## What the repo is

An **issue-tracker-centric** rebuild of lean-flow's loop: idea → `to-spec` → `to-tickets` →
`implement` → ship, with `triage`/`diagnosing-bugs`/`wayfinder` on-ramps. The structural difference
colouring everything: shared state lives in a **real tracker** (GitHub Issues / `.scratch/*.md`),
where lean-flow keeps it in-repo (`TODO.md` + `docs/sprint/*.md`). Scan 1 rejected that backend and
nothing since has changed the verdict.

## Delta map — every skill examined (L-017: delta over our surface, never standalone merit)

| Skill | lean-flow equivalent | Verdict |
|---|---|---|
| **scan 1 — 7** | `/orchestrator` · `/task-decomposer` · `/flow` · `init` | Rejects: `implement` · `to-tickets` · `to-spec` · `ask-matt` · `setup-matt-pocock-skills` (covered, or the tracker backend). Keepers **shipped**: `wayfinder` → `--fog` · `code-review` → the review split |
| **scan 2 — 5** | intake grill · ADR-006 · SPRINT § Owner-action · CONTEXT glossary | Rejects: `wizard` · `wait-what` (micro). Keepers **shipped**: `grilling` → frontier batching · `writing-for-agents` → disclosure test + completion criteria. `wayfinder` re-checked, no change |
| `codebase-design` | `refactor-advisor/references/deepening.md` | **Reject** — same vocabulary table, deletion test, interface-is-test-surface, one-vs-two-adapters; ours adds dependency categories, expand–contract, design-it-twice |
| `diagnosing-bugs` | `/diagnose` + `references/feedback-loops.md` | **Reject on the loop** (ours has the same 10 ways) · **Keeper K1** |
| `domain-modeling` | CONTEXT glossary (canonical + `_Avoid_:`) + ADRs | **Reject (micro)** — the active "challenge a term that conflicts with the glossary" move is one line; `CONTEXT-MAP.md` multi-context is off-shape for a single-context repo |
| `grill-with-docs` | — | **Reject** — three lines composing `/grilling` + `/domain-modeling`; no independent content, both parts already judged |
| `improve-codebase-architecture` | `/refactor-advisor` | **Reject** on the Tailwind+Mermaid CDN HTML report (no scaffold, off-ethos, terse-by-default) · **Keeper K2** |
| `prototype` | `/prototype` + `references/{logic,ui}.md` | **Keeper K3** — otherwise covered |
| `research` | `RESEARCH.md.template` (`Cite sources`, `*Source:*`) | **Reject (micro)** — "primary sources, follow every claim back to the source that owns it" is sharper than "cite sources"; one line if ever wanted |
| `resolving-merge-conflicts` | none — merge-back lives in `orchestrator/references/dispatch.md` | **Keeper K4** |
| `tdd` | `/tdd` + `references/testability.md` | **Reject** on pre-agreed seams (step 1 already confirms the public interface) and horizontal slicing (we have it) · **Keeper K5** |
| `triage` | `/triage` (ready/needs-info/blocked) + `.out-of-scope/` + HITL/AFK | **Reject** — covered; the tracker backend and the AI-disclaimer-on-tracker-comments rule are backend artefacts scan 1 already rejected |
| `handoff` | `/handoff` | **Reject** — covered *including* redaction (`SKILL.md` § and a red flag). Sharpens K1: we already hold this rule, it just never reached `/diagnose`, which is where artifacts are captured |
| `to-questionnaire` | `blocked`/`needs-info` states · SPRINT § Owner-action checklist | **Reject (micro)** — "grill the send, not the subject" is a neat framing, but our model is agent + owner; a third-party knowledge holder is an owner-action, and the questionnaire artifact is one line if ever wanted |
| `teach` | — | **Reject** — a personal-learning workspace (MISSION.md, lessons as HTML, learning records). Not a software-delivery loop; out of domain, not merely covered |
| `claude-handoff` | `/handoff` | **Reject** — identical to `handoff` except it auto-spawns `claude --bg` with the summary as prompt. A handoff is a *stopping point*; auto-launching removes the human gate, and we ship no auto-spawn |
| `loop-me` | `/task-decomposer` grill · gates | **Reject (tension noted)** — personal-workflow domain. Its **push right** principle (defer the checkpoint as far as it goes; ask once, late, fully prepared) genuinely cuts against gate-*before*-work. Not dismissed, not adopted: it needs evidence, like the negation question |
| `setup-ts-deep-modules` | `refactor-advisor` vocabulary | **Reject** — a TypeScript scaffold wiring dependency-cruiser. Language-specific + external dep + scaffold: off-ethos three ways |
| `writing-beats` · `writing-fragments` · `writing-shape` | — | **Reject** (3) — article authoring on an explore/exploit split. Out of domain; the explore→exploit shape is already ours as fog-map → decompose |
| `git-guardrails-claude-code` | **ADR-011** (no gate-enforcement hook) · `/release-patch` stops before push | **Reject** — a `PreToolUse` hook blocking `push`/`reset --hard`/`clean -f`. Our answer is procedural, and ADR-011 killed the in-core hook. **Second time an external repo has offered a hook**; a third makes it worth re-opening rather than re-rejecting (TD-032's trigger shape) |
| `migrate-to-shoehorn` | — | **Reject** — migrates TS test `as` assertions to a specific library. Language + dependency specific |
| `scaffold-exercises` | — | **Reject** — scaffolds course-exercise directories for the author's own repo (`ai-hero-cli`) |
| `setup-pre-commit` | — | **Reject** — Husky + lint-staged scaffold; we ship no scaffold, and `qa-check.sh` is the repo's own gate |

## Keepers — scan 3 (all micro; filed, never adopted in-scan)

- **K1 — redact secrets before showing captured artifacts** (`diagnosing-bugs`). `/diagnose` instructs
  capturing traces, HAR files, log dumps and replayed payloads, and says **nothing** about redaction —
  zero occurrences of redact/secret/credential across `SKILL.md` and `feedback-loops.md`. Captured
  artifacts routinely carry auth headers, and a debugging session is where they get pasted. Matt's
  rule is also the *right* mechanism, not just a warning: build loops against **env vars** so the
  credential stays in the environment rather than in what you show, and quote only the signal-carrying
  lines. → **TASK-156**.
- **K2 — scope a refactor scan by git hot-spots before scanning** (`improve-codebase-architecture`).
  `/refactor-advisor` has no scoping step at all: it scans, then ranks. Deepening only pays off where
  change is frequent, so walking `git log` for the files that keep reappearing is a YAGNI filter on
  the scan itself. → **TASK-158**.
- **K3 — retain a spent prototype on a throwaway branch instead of deleting it** (`prototype`).
  `/prototype` says "delete or absorb — never leave it rotting", which loses the artifact entirely;
  Matt commits it out of main and leaves a pointer, keeping it as a retrievable primary source at zero
  repo cost. TD-012 is our scar for exactly this (fixtures deleted with the prototype left a gate
  unguarded). → **TASK-158**.
- **K4 — recover each side's intent before resolving a merge conflict** (`resolving-merge-conflicts`).
  Read the commit messages / PRs behind each hunk, preserve both intents, never invent new behaviour,
  always resolve rather than `--abort`. Not a new skill — two lines in `dispatch.md`'s merge-back
  queue, which is where our conflicts actually arise. SPRINT-041's corrupted merge is why this is not
  theoretical. → **TASK-158**.
- **K5 — the tautological-test anti-pattern** (`tdd`). An assertion that recomputes the expected value
  the way the code does (`expect(add(a,b)).toBe(a+b)`, a hand-derived snapshot) passes **by
  construction** and can never disagree with the code. Absent from `/tdd` and `testability.md`, which
  carry implementation-coupled and horizontal-slicing but not this. Same family as L-058: a check that
  can only pass is the failure it exists to prevent. → **TASK-157**.

## Out of scope / open questions

**Closed** — every scan-1 and scan-2 keeper shipped (see the verdict block above).

**Closed at SPRINT-050 T2 — mechanism B vs C.** Skill self-fork **rejected** for execution dispatch;
ADR-010's spawn-with-brief (C) stands, and ADR-010 was deliberately not edited. The binding constraint
was never the per-run cost the question had been framed around: Claude Code **serializes concurrent
invocations of the same forked skill**, and our fan-out runs one procedure skill across N tasks at
once, so B removes the concurrency it was being considered for. Trail, evidence, revisit-if and a
dated expiry → [`.out-of-scope/skill-self-fork.md`](../../.out-of-scope/skill-self-fork.md).

**Still open**
- **Negation in anti-patterns** — `writing-for-agents` argues prohibition activates the forbidden
  behaviour, cutting against `.claude/CLAUDE.md`'s ❌ house style. Needs evidence, not preference. →
  TASK-155 (`needs-info`).
- **Push right** — `loop-me` argues for deferring a human checkpoint as far as it will go, against our
  gate-*before*-work model. Same shape as the negation question: a real tension, needs evidence.

## Not scanned

**None.** The corpus is fully mapped: 12 (scans 1–2) + 10 (scan 3, `engineering/`) + 13 (scan 4,
`productivity/` · `in-progress/` · `misc/`) = **35**. A future scan is a re-scan of changed or added
skills, not a remainder.

> **A boundary entry leaves this list by a written verdict, never by an assumption of coverage.**
> Scan 2's list silently omitted `diagnosing-bugs` · `prototype` · `tdd` · `triage` · `handoff`
> because each shares a name with a lean-flow skill. All five have now been checked and **two produced
> keepers** (K1, K5) — the assumption was not merely unverified, it was wrong. A shared name is a
> hypothesis about coverage, not a finding.
