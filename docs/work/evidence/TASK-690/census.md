# TASK-690 — installer-cost census

Measured 2026-11-21 in the T7 worktree, baseline commit `af7508b163e8956b316e5c0514f8a083e763300b`. Only council and lean-doc-generator descriptions change in T7; all 16 bodies and the reference/template trees retain that baseline. This is task evidence (STANDARD §2), not a new runtime rule.

## Basis and limits

Every cost cell is **UTF-8 bytes / estimated tokens**. Normalize CRLF to LF, then use `ceil(bytes / 2.991)`, matching `scripts/lib/token-budget.txt` and `check-doc-caps.ts` (`normalizedByteLength`, `evaluateTokenBudget`). This is the gate’s calibrated estimate, not an API tokenizer measurement or dollar charge.

Description = the parsed YAML value, excluding the key, delimiters and quoting; folded YAML is unfolded. Body = everything immediately after the closing frontmatter delimiter and its newline, including the following blank line and final newline. No trimming. References and templates are complete normalized file contents. Aggregate estimates round once after summing bytes; they can differ from the sum of rounded cells.

“Typical references” means the direct read set for the routine route named below, counted once per full file, not all available references. Explicitly conditional pointers are excluded unless the named route selects them. Actual reads may select only a section; this is a static full-file estimate. It excludes transitive references, other skills invoked, host instructions/source files, prompts, responses, tool wrappers and repeated/subagent reads. In particular, council’s 11 model calls and flow’s dispatched skills are not priced by this table. Zero local reference bytes does not mean a zero-cost call.

Init templates use a stated case: a fresh, single-maintainer base-tier repository with code, no publishing, no DB/auth, no qualifying ADR and no higher tier selected. Its 14 templates are listed below. The complete template catalog is a separate upper bound, not the bytes every init reads; other documentation modes also read their matching templates.

Population cross-check: the Bun census walked the 16 skill directories and their reference/template trees; an independent `git ls-files -- skills` selection plus `awk` body extraction and `sed`/`wc -c` measured **16 bodies and 77 reference/template files**. Every path and byte count agreed. PowerShell independently checked the parsed descriptions, target arithmetic, and that all non-description text is unchanged. The scratch probes are deleted after the checks.

## Per-skill census

| Skill | Description before → after (B / tokens) | Body (B / tokens) | Typical references (B / tokens) | All own references (B / tokens) | Init case templates (B / tokens) | All templates (B / tokens) |
|---|---:|---:|---:|---:|---:|---:|
| ` council ` | 944 / 316 → 777 / 260 | 6,681 / 2,234 | 12,102 / 4,047 | 15,594 / 5,214 | 0 / 0 | 0 / 0 |
| ` diagnose ` | 320 / 107 → 320 / 107 | 7,008 / 2,344 | 3,055 / 1,022 | 3,055 / 1,022 | 0 / 0 | 0 / 0 |
| ` diagram ` | 335 / 113 → 335 / 113 | 3,801 / 1,271 | 4,334 / 1,450 | 4,334 / 1,450 | 0 / 0 | 0 / 0 |
| ` flow ` | 397 / 133 → 397 / 133 | 6,485 / 2,169 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| ` handoff ` | 418 / 140 → 418 / 140 | 7,166 / 2,396 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| ` humanizer ` | 379 / 127 → 379 / 127 | 8,324 / 2,784 | 39,756 / 13,292 | 62,210 / 20,800 | 0 / 0 | 0 / 0 |
| ` insights ` | 436 / 146 → 436 / 146 | 3,244 / 1,085 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| ` lean-doc-generator ` | 541 / 181 → 415 / 139 | 18,428 / 6,162 | 15,393 / 5,147 | 100,345 / 33,549 | 29,020 / 9,703 | 84,494 / 28,250 |
| ` orchestrator ` | 351 / 118 → 351 / 118 | 25,223 / 8,433 | 90,593 / 30,289 | 200,129 / 66,911 | 0 / 0 | 0 / 0 |
| ` prime ` | 327 / 110 → 327 / 110 | 10,557 / 3,530 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| ` prototype ` | 381 / 128 → 381 / 128 | 4,537 / 1,517 | 3,222 / 1,078 | 12,802 / 4,281 | 0 / 0 | 0 / 0 |
| ` refactor-advisor ` | 386 / 130 → 386 / 130 | 5,038 / 1,685 | 4,685 / 1,567 | 4,685 / 1,567 | 0 / 0 | 0 / 0 |
| ` release-patch ` | 387 / 130 → 387 / 130 | 6,210 / 2,077 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| ` task-decomposer ` | 386 / 130 → 386 / 130 | 14,273 / 4,772 | 5,279 / 1,765 | 18,083 / 6,046 | 0 / 0 | 0 / 0 |
| ` tdd ` | 403 / 135 → 403 / 135 | 5,838 / 1,952 | 2,785 / 932 | 8,907 / 2,978 | 0 / 0 | 0 / 0 |
| ` triage ` | 414 / 139 → 414 / 139 | 10,540 / 3,524 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |

Descriptions total: **6,756 → 6,467 characters; 6,805 / 2,276 → 6,512 / 2,178**. Saving: **293 bytes, 98 estimated tokens/session (4.31%)**. This is the description-value cost only; the larger per-call bodies do not change in T7.

## Direct reference read sets

Paths in this table are relative to each skill’s `references/` directory. A whole file is counted even when the pointer names a section. “None” means no own direct reference for that route, not that cross-skill or host reads are free.

| Skill / routine route | Counted own files | Conditional / excluded reads |
|---|---|---|
| ` council ` — full decision procedure | ` advisors.md ` · ` prompts.md ` | `example.md` is a worked example, not a required read. |
| ` diagnose ` — feedback-loop selection | ` feedback-loops.md ` | The body points to the full menu in `feedback-loops.md`; humanizer on commit/PR is cross-skill. |
| ` diagram ` — new diagram and self-check | ` evidence-record.md ` | Update uses the same evidence-record file. |
| ` flow ` — attended conductor | None | Stage skill bodies/references and unattended orchestrator contract are cross-skill. |
| ` handoff ` — save a handoff | None | Humanizer embedded pass and lane rotation are cross-skill. |
| ` humanizer ` — standalone English prose | ` patterns-en.md ` · ` patterns-lf.md ` | Indonesian/mixed input also reads `patterns-id.md`; embedded caller uses `embedded.md`. |
| ` insights ` — record or bump a learning | None | No own references exist; the host learning ledger supplies context. |
| ` lean-doc-generator ` — ordinary doc write, Execution flow step 7 | ` sprint-by-reference.md ` | Init, migrate, promote, close and epic add their branch references. `spec/STANDARD.md`, humanizer and transitive `humanize-pass.md` are outside this direct set. |
| ` orchestrator ` — attended quick build with one worker and self-review | ` dispatch.md ` · ` worker-brief.md ` · ` review-scoping.md ` | G2 adds `builder-check.md`; unattended adds `night-run.md` / checks; cross-model and multi-session routes have their own references. |
| ` prime ` — routine health report | None | No own references exist; coverage and unattended pointers name other skills. |
| ` prototype ` — logic prototype | ` logic.md ` | No reference is common to all three branches: the selected logic route reads `logic.md`; UI and demo read their own file instead. |
| ` refactor-advisor ` — deepening proposal | ` deepening.md ` | `deepening.md` defines the body’s shared vocabulary. |
| ` release-patch ` — release preparation | None | Humanizer is cross-skill. |
| ` task-decomposer ` — ordinary inline intake through approved write | ` task-file.md ` | Attended delegation adds `intake-brief.md`; fog and large-feature PRD paths add their own references. Workers do not redispatch. |
| ` tdd ` — routine new behavior | ` test-standard.md ` | Only `test-standard.md` is an unqualified pointer; testability and strategy are explicitly conditional on uncertainty. |
| ` triage ` — backlog grooming | None | No own references exist at baseline; coverage and commit humanizer point to other skills. |

Init case: ` README.md.template ` · ` CONTRIBUTING.md.template ` · ` SECURITY.md.template ` · ` AGENTS.md.template ` · ` CHANGELOG.md.template ` · ` TECH-DEBT.md.template ` · ` CLAUDE.md.template ` · ` CONTEXT.md.template ` · ` product-requirements.md.template ` · ` product-acceptance-criteria.md.template ` · ` architecture-overview.md.template ` · ` development-setup.md.template ` · ` development-coding-standards.md.template ` · ` testing-guide.md.template `.

Those 14 files total **29,020 / 9,703**. All 36 catalog templates total **84,494 / 28,250**. Team ≥2/on-request code of conduct, publishing, DB/auth, higher tiers and create-lazily documents change the selected set; no single “all templates per init” charge is claimed.

## Five body targets for the coordinator’s Tracker

These are byte ceilings on the body basis above, superseding the 85% previews under G2 Amendment A4 and the owner’s “Safety wins” ruling. They are deliberately below the initial 15% reduction: each is derived from a concrete, bounded sizing specimen below, not an assumption that an uninspected branch can move safely. The body tasks may save more. T7 changes no body and claims no body-routing proof; T8–T10 still own their full inventories, before/after proofs and review.

| Skill / owner | Baseline bytes / tokens | Target bytes / tokens | Required cut | Proof routes planned |
|---|---:|---:|---:|---|
| ` task-decomposer ` — T8 / TASK-691 | 14,273 / 4,772 | **13,707 / 4,583** | 566 B (3.97%) | ordinary intake |
| ` prime ` — T8 / TASK-691 | 10,557 / 3,530 | **9,764 / 3,265** | 793 B (7.51%) | routine health report |
| ` triage ` — T8 / TASK-691 | 10,540 / 3,524 | **9,546 / 3,192** | 994 B (9.43%) | rejection/matched prior rejection |
| ` orchestrator ` — T9 / TASK-692 | 25,223 / 8,433 | **24,838 / 8,305** | 385 B (1.53%) | G2 in mvp and sprint-bulk |
| ` lean-doc-generator ` — T10 / TASK-693 | 18,428 / 6,162 | **17,680 / 5,912** | 748 B (4.06%) | promote |

Proof allowance for this bounded scope: T8 has four routes (ordinary intake, routine prime, a new rejection, a matched prior rejection), eight runs at the planning ceiling of $0.40 = $3.20 within $3.50; T9 has G2 in mvp and sprint-bulk, four runs = $1.60 within $4.00; T10 has promote, two runs = $0.80 within $4.50. These are planning envelopes, not observed spend or launch approval. The body builders must keep a route’s text in place if its proof cannot fit the actual remaining share.

### Sizing evidence

The baseline commit and exact start/end anchors below make each byte deduction reproducible. Replace the span starting at the first anchor up to, but excluding, the end anchor. Replacement strings include the displayed newlines. These are sizing specimens for later builders, not edits or substitutes for their rule inventories. Remaining instructions and approval stops stay in the body.

- **task-decomposer: Task file shape: duplicate fenced schema** — 566 → 0 bytes; saving 566. The complete schema already lives in `task-decomposer/references/task-file.md` (§ File shape). The introductory full-template pointer and following initial-state/priority rules remain; origin, authority and the other schema fields survive in that required reference.
  Start (JSON string): ```` "```\n---\nid · title" ````; end (exclusive): `` "No `status:` field" ``.
  Replacement (JSON string): ` "" `.
- **triage: Out-of-scope record (move to own reference)** — 1138 → 144 bytes; saving 994. Move this entire span verbatim to `triage/references/out-of-scope.md`, retaining its per-concept, lazy-creation, durable-reason and match-choice rules. Place the replacement at the existing section; Flow 1 still scans first and Flow 7 still routes rejects. The new reference increases conditional reference bytes: this reduces the body, not necessarily total bytes on a rejection call.
  Start (JSON string): ` "Rejected enhancements are remembered" `; end (exclusive): ` "## Hard rules" `.
  Replacement (JSON string): `` "For a rejection or a match to an earlier rejection, read `${CLAUDE_SKILL_DIR}/references/out-of-scope.md` before acting. Apply only after `y`.\n\n" ``.
- **prime: README fallback rationale** — 475 → 156 bytes; saving 319. Keeps presence reporting, the exact missing-CLAUDE-or-CONTEXT condition, and standalone stages loading their own facts.
  Start (JSON string): ` "**README is a fallback" `; end (exclusive): ` "**Resolution**" `.
  Replacement (JSON string): `` "**README fallback.** Report its presence; read it in full only when CLAUDE.md or CONTEXT.md is missing. Stages load their own facts even without `/prime`.\n\n" ``.
- **prime: Handoff-status explanation** — 639 → 420 bytes; saving 219. Keeps both sources, latest-entry selection, sprint ownership, all states and their meanings, read-only behavior, and the two transition writers. The Output format section still governs row omission and uncertain writes.
  Start (JSON string): ` "**Handoff status (read-only report" `; end (exclusive): ` "## Skill freshness" `.
  Replacement (JSON string): `` "**Handoff status (read-only).** Read the LATEST `handoff` entry in each active sprint Execution Log and root `HANDOFF-LEDGER.md`. A handoff belongs to a sprint when the session focus names its member; other handoffs go in the ledger. Report each latest `handoff-status:`: `live` (not resumed), `consumed` (resumed, open), or none outstanding. Never write it; `/handoff` and `/lean-doc-generator close` own transitions.\n\n" ``.
- **prime: Skill-freshness narrative** — 408 → 153 bytes; saving 255. Shortens only explanatory prose; the four-row comparison table, live-checkout handling, version-only limit and never-block rule remain.
  Start (JSON string): ` "A live session keeps whatever" `; end (exclusive): ` "Compare that version" `.
  Replacement (JSON string): `` "A live session retains its starting plugin copy. The invocation's base directory (`…/<plugin>/<version>/skills/prime`) exposes its installed version.\n\n" ``.
- **orchestrator: G2 Reachability incident narrative** — 447 → 62 bytes; saving 385. Removes the incident example and narrative, leaving the four checking questions, no-target-no-verification rule, not-valid-proof rule, judgment tick and scratch-probe constraints in the same G2 checklist.
  Start (JSON string): ` "*A check that never examines" `; end (exclusive): ` "**A method whose scope" `.
  Replacement (JSON string): ` "*A check that never examines the target is not verification.* " `.
- **lean-doc-generator: Promote size-check timing rationale** — 220 → 77 bytes; saving 143. Retains the timing: promote freezes before G1; a later split costs a scope-change. The explicit pre-render size check is outside the replaced span.
  Start (JSON string): `` "G1 already splits an `L`" ``; end (exclusive): ` "At pull time it costs nothing → " `.
  Replacement (JSON string): ` "The Plan freezes at promote, before G1; splitting then costs a scope-change. " `.
- **lean-doc-generator: Promote attestation rationale** — 191 → 59 bytes; saving 132. Keeps sprint-file sign-off as the only unattended source. The exact gates_signed field and the absent-means-not-approved / never-infer-approval rules remain outside this span.
  Start (JSON string): ` "an unattended run reads the sprint file" `; end (exclusive): ` "Omit the field until" `.
  Replacement (JSON string): ` "an unattended run reads only the sprint file for sign-off. " `.
- **lean-doc-generator: Doc-aging incident narrative** — 306 → 0 bytes; saving 306. Deletes only the SPRINT-062/L-106 incident narrative. The distinct §11-retention and §2-caps sources, required scan and no-copied-cap rule remain.
  Start (JSON string): ` "This is the failure that made the line worth fixing" `; end (exclusive): ` "\n**Epic rollup currency" `.
  Replacement (JSON string): ` "" `.
- **lean-doc-generator: Epic-rollup incident rationale** — 212 → 45 bytes; saving 167. Keeps presence-versus-currency explanation. All three epic drift classes and the separate-source rule remain before the replaced span.
  Start (JSON string): ` "All three are invisible to a schema check" `; end (exclusive): ` "\nResolve each" `.
  Replacement (JSON string): ` "A schema check proves presence, not currency." `.

Baseline body SHA-256 pins (normalized body only):

| Skill | SHA-256 |
|---|---|
| ` task-decomposer ` | ` 51ad6b75c6f139df223f3a028c352716a54b071c840875b04a5b00f8a80ab58e ` |
| ` prime ` | ` 6af16135e8919b1651c353aa6e2243b837eeb30a7dfed5aaddc6f6e125b9a85a ` |
| ` triage ` | ` 54bcc55754398e3cd43ff168c50c2b7aa973b7972049e1d44814f5ba9c37eeb9 ` |
| ` orchestrator ` | ` 4bc642458f6cd80198ceb4ae435b6438030760e636093cacc074da8f50421ad9 ` |
| ` lean-doc-generator ` | ` 467f6b22f775b4189ddc6b6e79d2f4509c3b3004b0a6599befe3569e06ac7532 ` |

## Description routing inventory: before and after

Only two parsed values exceed 450 characters before the edit. Council: **937 → 774** (owner accepted about 780); lean-doc-generator: **539 → 413**. The next longest remains insights at 432. Before trimming, council has 937 parsed characters (939 with its YAML quotes) and 944 UTF-8 bytes; lean-doc-generator has 539 characters and 541 UTF-8 bytes. These units must not be mixed.

The council groups below retain their labels and conditions verbatim. Every phrase and the complete exclusion clause is mechanically identical; equivalence of the shorter purpose is a reviewer judgment.

| Council group | Before | After |
|---|---|---|
| MANDATORY TRIGGERS | ` council this ` | ` council this ` |
| MANDATORY TRIGGERS | ` run the council ` | ` run the council ` |
| MANDATORY TRIGGERS | ` war room this ` | ` war room this ` |
| MANDATORY TRIGGERS | ` pressure-test this ` | ` pressure-test this ` |
| MANDATORY TRIGGERS | ` stress-test this ` | ` stress-test this ` |
| MANDATORY TRIGGERS | ` debate this ` | ` debate this ` |
| STRONG TRIGGERS (with a real decision/tradeoff) | ` should I X or Y ` | ` should I X or Y ` |
| STRONG TRIGGERS (with a real decision/tradeoff) | ` which option ` | ` which option ` |
| STRONG TRIGGERS (with a real decision/tradeoff) | ` what would you do ` | ` what would you do ` |
| STRONG TRIGGERS (with a real decision/tradeoff) | ` is this the right move ` | ` is this the right move ` |
| STRONG TRIGGERS (with a real decision/tradeoff) | ` validate this ` | ` validate this ` |
| STRONG TRIGGERS (with a real decision/tradeoff) | ` get multiple perspectives ` | ` get multiple perspectives ` |
| STRONG TRIGGERS (with a real decision/tradeoff) | ` I can't decide ` | ` I can't decide ` |
| STRONG TRIGGERS (with a real decision/tradeoff) | ` I'm torn between ` | ` I'm torn between ` |
| Exclusion | Do NOT trigger on simple yes/no questions, factual lookups, or casual 'should I' without a meaningful tradeoff. | Do NOT trigger on simple yes/no questions, factual lookups, or casual 'should I' without a meaningful tradeoff. |

Council purpose retains opt-in use, high stakes / hard-to-reverse / ambiguity, ADR (STANDARD §4) or G2, five independent advisors, anonymous peer review, the verdict filename, subagents, approximately 11 calls and the expensive-mistake restriction. Only wording and the non-routing Karpathy attribution are removed; attribution still appears in the body.

| lean-doc-generator routing clause | Before | After |
|---|---|---|
| Trigger / boundary | creating, updating, or reviewing technical documentation, ADRs, sprint files, or AI-context files | creating, updating, or reviewing technical documentation, ADRs, sprint files, or AI-context files |
| Trigger / boundary | running the sprint lifecycle (promote / execute / close) | running the sprint lifecycle (promote / execute / close) |
| Trigger / boundary | **migrating existing docs** (dev-flow / adlc-flow / any layout) into the lean-flow standard | **migrating existing docs** (dev-flow / adlc-flow / any layout) into the lean-flow standard |
| Trigger / boundary | Follows the LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW. | Follows the LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW. |
| Exclusion | Do not use to document HOW something works; redirect to code comments instead. | Do not use to document HOW something works; redirect to code comments instead. |

The sole lean-doc-generator deletion is: “Bundles its own templates and cites the versioned standard at `spec/STANDARD.md`, so generated docs match a canonical format.” No trigger or exclusion changes; the body still names the bundled templates and standard.

### Pinned description values

**council — before**

Run a high-stakes, hard-to-reverse, or ambiguous decision through a council of 5 AI advisors who independently analyze it, peer-review each other anonymously, and synthesize a final verdict to a lean verdict-<slug>.md. The opt-in decision aid for genuinely hard forks — the pressure-test before an ADR (STANDARD §4) or a G2 design call. Based on Karpathy's LLM Council. Uses sub-agents (≈11 model calls/run) — reserve for decisions where being wrong is expensive, NOT every choice. MANDATORY TRIGGERS: 'council this', 'run the council', 'war room this', 'pressure-test this', 'stress-test this', 'debate this'. STRONG TRIGGERS (with a real decision/tradeoff): 'should I X or Y', 'which option', 'what would you do', 'is this the right move', 'validate this', 'get multiple perspectives', 'I can't decide', 'I'm torn between'. Do NOT trigger on simple yes/no questions, factual lookups, or casual 'should I' without a meaningful tradeoff.

**council — after**

Opt-in council for high-stakes, hard-to-reverse or ambiguous decisions before an ADR (STANDARD §4) or G2: 5 AI advisors independently analyze, anonymously peer-review and synthesize a lean verdict-<slug>.md. Uses sub-agents (≈11 model calls/run); reserve for decisions where being wrong is expensive, NOT every choice. MANDATORY TRIGGERS: 'council this', 'run the council', 'war room this', 'pressure-test this', 'stress-test this', 'debate this'. STRONG TRIGGERS (with a real decision/tradeoff): 'should I X or Y', 'which option', 'what would you do', 'is this the right move', 'validate this', 'get multiple perspectives', 'I can't decide', 'I'm torn between'. Do NOT trigger on simple yes/no questions, factual lookups, or casual 'should I' without a meaningful tradeoff.

**lean-doc-generator — before**

Use when creating, updating, or reviewing technical documentation, ADRs, sprint files, or AI-context files; running the sprint lifecycle (promote / execute / close); or **migrating existing docs** (dev-flow / adlc-flow / any layout) into the lean-flow standard. Follows the LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW. Bundles its own templates and cites the versioned standard at `spec/STANDARD.md`, so generated docs match a canonical format. Do not use to document HOW something works; redirect to code comments instead.

**lean-doc-generator — after**

Use when creating, updating, or reviewing technical documentation, ADRs, sprint files, or AI-context files; running the sprint lifecycle (promote / execute / close); or **migrating existing docs** (dev-flow / adlc-flow / any layout) into the lean-flow standard. Follows the LEAN DOCUMENTATION STANDARD — WHY and WHERE only, never HOW. Do not use to document HOW something works; redirect to code comments instead.

## Check evidence and coordinator boundary

All applicable local checks completed with exit 0:

| Check | Printed verdict / evidence |
|---|---|
| Exact skill-frontmatter loop from qa-check leg 3 (scratch shell) | `FRONTMATTER: 16 skills green (qa-check leg 3)`; all 16 individual `PASS frontmatter` lines |
| `bun --no-env-file scripts/lib/check-doc-caps.ts` | `PASS cap skills/council/SKILL.md (74 <= 140)`; `PASS cap skills/lean-doc-generator/SKILL.md (140 <= 140)`; `PASS doc-caps: token-budget ~12634 tokens <= budget 12691` |
| `bun --no-env-file evals/run-layout-fixtures.ts` | `layout-fixtures: 41 pass, 0 fail` (includes both runtime manifest skill-resolution checks) |
| `sh evals/run-skill-freshness-fixtures.sh` | `SKILL-FRESHNESS FIXTURES: all green` (3 fixtures, including both expected BLOCK cases) |
| `sh scripts/lib/check-manifest-lockstep.sh .` | Four `PASS manifest lockstep` lines: marketplace, Claude, Codex and Kimi all 2.26.0 |
| `sh evals/run-manifest-lockstep-fixtures.sh` | `MANIFEST-LOCKSTEP FIXTURES: all green` (4 fixtures, including live repo) |
| Independent census audit | `PASS census cross-check: 16 bodies and descriptions, 77 reference/template files; tracked-path awk/sed/wc agrees with Bun directory census` |
| Routing and scope audit | `PASS routing inventory: all 14 council triggers + complete Do-NOT clause verbatim; lean-doc-generator changes only the non-routing assets sentence`; `PASS description scope: council 937 -> 774 chars; lean-doc-generator 539 -> 413 chars; all 16 bodies and remaining frontmatter unchanged` |
| Added-path audit | `PASS consumer paths: no scripts/, evals/, docs/ or drive path added to descriptions` |
| Rendered-evidence audit | `PASS rendered census: 16 complete numeric rows, 5 byte/token targets and body SHA-256 pins, no trailing whitespace` |
| `git diff --check` | Exit 0, no findings |

The standalone scratch `.ps1` audit was refused by the host execution policy; one retry ran the read-only assertions as inline PowerShell commands and passed. The Bun census emitted parent-directory EPERM/config diagnostics (including one override retry); the separate tracked-path/wc audit above independently confirms all resulting counts. No required repository check was blocked.

T7 evidence supplies Done-when box 1’s census and target values; the coordinator copies targets into the task Tracker. Box 2 and box 5 have mechanical evidence plus the builder’s read-through, pending independent Claude review. Box 3 is **unrun**: the coordinator launches the four owner-approved routing runs after merge-back and writes `spend.md`; builder routing spend is $0.00 of $1.50. Box 4’s relevant local legs pass; the integrated/off-host `qa-check` remains the coordinator’s gate. No full-gate result is claimed.

The routing runs establish behavior for their four prompts only, not exhaustive trigger-space coverage. No sprint, log, task file or approved design record was edited.
