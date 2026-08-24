---
owner: Maintainer
last_updated: 2026-07-02
update_trigger: A new BMAD-METHOD release changes the scan, or a rejected row becomes a keeper against lean-flow's current surface
status: current
id: bmad-adaptation
tags: [process]
domain: governance
related: []
---

# BMAD-METHOD — adaptation scan (TASK-039)

Full scan of [bmad-code-org/bmad-method](https://github.com/bmad-code-org/bmad-method) (v6) —
`src/core-skills/` + `src/bmm-skills/` (phases 1-analysis → 4-implementation) + `docs/reference`.
Goal: extract only what fits lean-flow's **lean · curated · agent-free · human-gated** ethos; reject
the rest. bmad v6 is itself now a *skills* library (Claude-Code-style), so it is directly comparable —
but it is a heavy 12+-agent framework (party-mode, TEA module, config cascades), philosophically the
opposite of lean-flow. Default posture: **skeptical / reject unless clearly a lean win.**

## Verdict summary

**5 keepers** (all ADAPT — distilled to lean form, no wholesale import); everything else REJECT as
duplicate-of-existing or too heavy. No new agents, no new config subsystems, no external deps adopted.

## Keepers (ADAPT → candidate work)

| # | bmad source | Idea (slimmed) | Where it lands |
|---|---|---|---|
| K1 | `bmad-index-docs` | Generate the corpus index **from write-time frontmatter**, not by re-summarizing every file each run (deterministic, cheap) | **confirms TASK-036** design — invert bmad's mechanism |
| K2 | TEA / risk-based testing | A **risk tier (P0–P3) per testable task → pyramid depth** (P0-P1 → E2E+unit · P2 → unit/integ · P3 → unit or skip) | **enriches TASK-037** — task-decomposer "Testing Decisions" |
| K3 | `bmad-dev-story` DoD | A **regression gate** at Review — "tests match the task's risk tier + ALL existing tests pass, zero regressions" | **enriches TASK-037** — orchestrator Review `qa:` hint |
| K4 | `bmad-correct-course` | Lightweight **mid-sprint scope-change** convention — log what broke / impact / re-confirm G2, before editing the plan | **TASK-042** (new) — orchestrator Execution Log convention |
| K5 | `bmad-review-adversarial-general` + `edge-case-hunter` | **Anti-sycophancy Review**: if a scoped reviewer returns 0 findings, re-run once with an assume-guilty framing; optional branch/boundary enumeration lens | **TASK-043** (new) — orchestrator Review / `/tdd` |

Also noted: bmad's explicit **halt contract** (`status: blocked` + `blocking_condition`) for its
autonomous loop — already the intent of lean-flow's `sprint-bulk` first-blocker halt + TASK-035
(surface blockers, never park); fold the "explicit reason + unblock condition" wording into TASK-035
rather than a new task.

## Rejected (with reason)

| bmad mechanism | Reject reason |
|---|---|
| `bmad-shard-doc` | External npm CLI dep; lean-flow prevents oversized docs structurally (caps + dedup pass) |
| `bmad-document-project` (config cascade, resumable scan-state JSON, multi-level scans) | The stateful multi-agent-orchestration pattern lean-flow's agent-free/≤110-line ethos rejects |
| `bmad-generate-project-context` | Duplicates CLAUDE.md's role |
| Test Architect (TEA) module — 9 workflows, "Murat" persona | 12-agent enterprise module; agent-free violation |
| `bmad-qa-generate-e2e-tests` checklist | Redundant with TASK-037's own 12-point checklist |
| `bmad-code-review` (Blind/Edge/Acceptance sub-agents + triage) | Duplicates the built-in `/code-review` lean-flow already dispatches |
| `bmad-sprint-planning` · `-status` · `-status.yaml` | lean-flow's TODO.md + SPRINT-NNN.md + task `state` + `/triage` cover this more leanly; a separate status file is extra surface |
| `bmad-retrospective` (13-step facilitated) | lean-flow's sprint-close Retro + 4-bucket routing is leaner |
| `bmad-create-story` (git+arch scan + live web research per story) | Heavy/agent-like; `touches`/`assumes`/Execution Log already carry context |
| `bmad-forge-idea` · `bmad-advanced-elicitation` | Duplicate the grill + /council with more machinery (memlog, HTML seals, CSV menus) |
| `bmad-party-mode` | Roleplay roundtable; /council's structured independent-analysis→peer-review→verdict is stronger + leaner |
| `bmad-brainstorming` | Novel (divergent ideation) but out of lean-flow's execution scope; script + HTML + 100-idea floor is anti-lean |
| `bmad-quick-dev` / `bmad-dev-auto` as **separate skills** | Duplicate orchestrator's quick/mvp/sprint-bulk modes |
| `bmad-architecture` reviewer-gate (multi-subagent) | Judgment-by-committee; against agent-free + human-gated |
| `customize.toml` (layered base/team/user config) | A config-resolution subsystem — the "just in case" heaviness the curation bar rejects |
| Headless PRD mode (`assumptions[]`/`open_questions[]`, halt on ambiguity) | Already covered by task-decomposer's assumption registry + AFK durable-spec rule |

## Out of scope / open questions

- K2/K3 (risk-based testing) overlap TASK-037; fold in rather than a separate task.
- Deferred whether the K5 anti-sycophancy re-run belongs in orchestrator Review only or also `/tdd`
  (decide at G2 for TASK-043).
- Not evaluated: bmad's web-bundle export (ChatGPT/Gemini) — irrelevant to a Claude Code plugin.
