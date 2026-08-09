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
| `implement` | `/orchestrator` — richer (G1/G2, 3 modes, routing) | Reject (scan 1) |
| `to-tickets` | `/task-decomposer` | Reject (scan 1) — expand–contract kept |
| `to-spec` | `/task-decomposer` PRD + `/lean-doc-generator` | Reject (scan 1) |
| `ask-matt` | CONTEXT roster + `/flow` | Reject (scan 1) |
| `setup-matt-pocock-skills` | we ship no scaffold; `init` covers greenfield | Reject (scan 1) |
| `wayfinder` | `/task-decomposer --fog` | Keeper (scan 1, shipped) · re-checked scan 2, no change |
| `code-review` | dispatched `/code-review` | Keeper (scan 1, shipped) |
| `grill-me` → `grilling` | intake grill + G2 residual grill | Keeper (scan 2, shipped) |
| `writing-for-agents` | ADR-006 · DOCS_Guide HOW-filter | Keeper (scan 2, shipped ×2) |
| `wizard` | SPRINT § Owner-action + night-run park rule | Reject (scan 2) |
| `wait-what` | CONTEXT glossary · Concise reporting | Reject (scan 2, micro) |
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

**Still open**
- **Mechanism B vs C** — is skill self-fork (`context: fork`) worth the per-run cost over runtime
  invocation? Open since scan 1, unchanged through two re-scans. → SPRINT-050 T2.
- **Negation in anti-patterns** — `writing-for-agents` argues prohibition activates the forbidden
  behaviour, cutting against `.claude/CLAUDE.md`'s ❌ house style. Needs evidence, not preference. →
  TASK-155 (`needs-info`).

## Not scanned

**13 remain** — `productivity/`: `handoff` · `teach` · `to-questionnaire` · the 6 `in-progress/` · the
4 `misc/`. Scheduled as SPRINT-050 T3. Reconciliation: 12 scanned (scans 1–2) + 10 (scan 3) + 13
pending = 35.

> **A boundary entry leaves this list by a written verdict, never by an assumption of coverage.**
> Scan 2's list silently omitted `diagnosing-bugs` · `prototype` · `tdd` · `triage` · `handoff`,
> apparently because each shares a name with a lean-flow skill. Four of those five were scanned above
> and **two produced keepers** (K1, K5) — so the same-name assumption was not merely unverified, it was
> wrong. A shared name is a hypothesis about coverage, not a finding.
