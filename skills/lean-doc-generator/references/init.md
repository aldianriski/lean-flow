# Init — scaffold a fresh repo

Used by `/lean-doc-generator init`. For a **greenfield** repo with no lean-flow docs yet — the twin
of migrate. **Scope-interactive + docs-only**,
bounded by the safe-scaffold allowlist.

## Procedure

**Standing rule** — init never deletes, moves or overwrites a file that existed before it ran. Every
planned write to an existing path is skipped and listed under "skipped (pre-existing)" in the report.

1. **Detect substrate and read the stack** — read `package.json` / `pyproject.toml` / `go.mod` / etc.
   and the existing file tree to infer stack, and whether a database or auth substrate is present. If
   inaccessible, ask the user to paste the manifest + file tree. Then read a small sample of real files
   per layer (entry or routing, a data-access file, a UI component, a test, config) — never secret
   files — and hold what they show for step 2, which writes `## Stack` (architecture overview) and
   `## Conventions in use` (coding standards, written only on a repo with code, as that row is) with
   one cited file per line. Anything the sample cannot confirm goes under `Not confirmed`, never
   invented. An unknown stack gets this scan alone (step 1c may add a question set).
1b. **Read the business evidence** — code shows the stack, not the business. Before asking, find what
   the repo already says. Candidates, matched by **path or filename only** (never open files to read
   titles; code such as `*.spec.*` is excluded): the root `README` plus markdown under `docs/`
   (recursive) naming requirements · PRD · product · spec · goals · roadmap · flows · journeys · stories.
   Never open secret files (`.env*`, keys, credentials). Read every candidate's **headings first**, then
   only the sections bearing on the five topics — business goal · main flows · invariants · quality
   attributes · non-goals. A topic is **settled** only by a heading naming it or a sentence stating it
   as a decision ("the goal is…", "non-goal: …"); a tagline, feature bullet or `Not decided yet` line is not — the first two become a
   drafted option. Keep a settled fact quoted or closely paraphrased with `<path> § <heading>`, never
   summarised. A backlog or wish-list is not a non-goal. Docs that disagree → the topic is open, each
   source a drafted option (at most three). Quality attributes stay open while any row is uncovered.
   Hold the result for step 3's business round and step 5's write.
1c. **Match a question set** — Read `${CLAUDE_SKILL_DIR}/references/profiles/README.md` (the index) and each set file it
   lists, then check each set's DETECT rule; never list the folder with a shell command (a headless run is denied it).
   Any number may match, none → scan only. Then print, before step 2 writes or any popup asks:
   `Question sets loaded: <names> (detected: <evidence>)` or `No question set matches this stack; scan
   only.` For each loaded set, run its questions' marker searches over the whole tree (not only step
   1's sample); a question with a clear answer is settled and cited, the rest stay open for step 3.
1d. **Detect existing docs** — after 1c, before step 2 writes anything. Existing docs = a `CLAUDE.md` or
   `CONTEXT.md` at the root or under `.claude/` · an `AGENTS.md` · a `docs/` tree holding at least one
   markdown file at any depth. If any is found, list them in a message, then ask in its OWN popup, before the tier
   popup: "This repo already has docs — run `/lean-doc-generator migrate` instead (recommended), or
   continue init writing only absent files?" **migrate** → init writes nothing and skips its steps 2–6 entirely;
   continue in the same session into `migration-map.md` § Procedure, starting at step 1. Pass step 1's
   stack/conventions scan, 1b's business evidence and 1c's question sets + marker results as already-gathered
   inputs, not to be re-scanned. Migrate still makes its own per-file plan and obtains its own approval;
   suggestions on this path appear only in its post-approval profile rounds. No second command is needed.
   **continue** → write only absent files; never fill or append sections
   inside an existing file (that is migrate's job); a root `CLAUDE.md` or `CONTEXT.md` counts as the
   repo's AI context, so its `.claude/` twin is not written beside it. Skip a step 3 popup round whose
   target file exists (First milestone and business round: `requirements.md`; conventions round:
   `coding-standards.md`) and name the skipped files in the listing message. Headless: no popup
   (probe as step 3 does); the park record also lists the existing docs and the migrate offer.
2. **Scaffold the base tier** — the mandatory minimum (table below), each via the
   template-load protocol (STANDARD §2: **Read** `${CLAUDE_SKILL_DIR}/templates/<X>.md.template`
   before writing — never free-generate; real content prompts, never empty shells). Most rows are
   unconditional; four carry a **substrate condition** and are skipped when that substrate is absent,
   exactly as step 3's conditional rows fire only on detection. Gate per substrate, never on a repo
   label: "docs-only" is not a condition — a docs repo that publishes an artifact still deploys, and
   its deployment guides are correct. A skipped row is **reported, not silent** (step 5's file list
   names it and the condition that skipped it), so an absent doc reads as a decision rather than a miss.
3. **Offer higher tiers via an AskUserQuestion popup** — default the selection from the substrate
   detection in step 1, let the user confirm/override:
   - **Suggested option** (all rounds below) — attended only: for each unresolved prompt being asked
     (First milestone ×3, each open business topic or conventions question, Standards), draft one
     best-practice starting point fitted to the scanned stack and evidence: `Suggested: <answer> — <one-line why>`.
     Evidence-settled prompts are never asked or replaced. Offer the cleared suggestion in that prompt's
     same frontier round beside evidence options and *not decided yet*, with *I'll describe it* available.
     **Slots:** at most four listed options; with 0–2 evidence options, reserve one for the suggestion
     and one for *not decided yet*. With three evidence options, keep all three and offer no suggestion.
     Use a free slot for *I'll describe it*, else name the popup's built-in free-text path as *I'll describe it*;
     a description is the owner's answer, and an empty response leaves the topic undecided.
     Fixed choices (boundary `none` · `simulated` · `live`) instead mark one existing choice `Suggested`
     with its why, adding no option; proof goal and stopping condition get drafted suggestions.
     Dropping a fixed-choice suggestion removes its label and why, never the existing choice itself.
     **Reviewer pass:** if any suggestions were drafted, self-check, then batch them in one independent
     review before the round's popup. Use a fresh same-provider sub-agent at the host's `execution` tier;
     use Codex via
     `orchestrator/references/cross-model-route.md` only when the host CONTEXT declares `draft-review`
     or the owner requests that case in session (another declared case does not enable it).
     Follow `orchestrator/references/review-scoping.md` § Draft reviews; brief the prompts, evidence shown,
     suggestions and whys. Altitude: judge these proposed answers against the evidence, not later design;
     reject contradictions. Require per suggestion `keep` · `change <new text>` · `reject`, each with a reason,
     plus what the reviewer read/judged and what it could not read/check (both coverage statements).
     `reject` → drop, absent from the popup. `change` → re-review once with the same reviewer; offer only
     on `keep`, else drop. Bound each call to 300 s; at most one batch call per round plus one re-review
     per changed suggestion. Unavailable reviewer, timeout, failure or missing verdict/coverage → no
     suggestions this round, use today's options; no provider fallback or extra call to recover suggestions.
     Headless: draft no suggestions and run no reviewer; park as below. A suggestion is never an answer
     until the owner accepts it; rejected or unaccepted suggestions are never written.
   - **First milestone** (same popup round — independent of the tier choice) — three questions for
     `requirements.md` § First milestone: proof goal · stopping condition · integration boundary
     (`none` · `simulated` · `live`, with its allowed side effects). Each offers *not decided yet*, which
     leaves that field `[CUSTOMIZE]`; boundary `none` writes side effects `none`. Apply **Suggested option**;
     init generates nothing but this one reviewed suggestion per applicable prompt, never the owner's answer.
     The section is written only from this round's answers; headless, it parks with the rest (below) and
     nothing is written.
   - **Business round** (its own popup, after the tier + First milestone popup) — a message just before
     it shows the settled facts with sources init will write (if every topic is settled and no popup
     is needed, init still reports them in a message before writing). Ask ONLY open topics
     (for quality attributes, only the uncovered rows) in one frontier round: a *frontier round* asks
     together every question whose prerequisites are settled; only a question depending on an earlier
     answer waits. The topics are independent, so split only at the 4-questions-per-popup limit. Options
     follow **Suggested option**, with drafted options quoted from evidence (at most three; recommended
     when one source) — init generates nothing but this one reviewed suggestion. *I'll describe it*
     triggers one free-text follow-up if text was not already supplied; no text → *not decided yet*.
   - **Conventions round** (its own popup, after the business round; only when a set is loaded and
     questions remain open) — a message first lists the marker-settled conventions with their sources
     (as the business round does). Then one frontier round of the still-open questions, split at the
     4-questions limit; a topic shared by two loaded sets is asked once. Options follow **Suggested option**,
     with at most three observed options from the code as drafted choices; init generates nothing but
     this one reviewed suggestion. The same *I'll describe it* free-text path applies.
   - **Standards question** — ask once, only when init writes coding-standards (the repo has code).
     It rides in the conventions popup when that round fires, else in its own popup. Apply **Suggested option**:
     "Does this repo adopt named standards (e.g. SOLID, clean architecture, a Mermaid diagram for
     each main flow)?" Keep `none` (default) and the free-text path; never infer adoption from code.
     A suggestion may name a standard, never its `checks:`. `none` writes no section; *not decided yet*
     leaves adoption open. Format the owner's answer into `## Standards adopted` entries and show them
     back before writing, cited by step 5's rule.
     For a standard named without checks, ask for its checks once more; if still absent, write
     `checks: not decided yet (owner, init)`. Never invent checks. Headless: parks with step 3 below.
   - **Substrate-conditional rows** fire automatically when detected (confirmed, not asked):
     `database/erd.md` + `database/schema.md` + `database/migration-guide.md` (DB exists) ·
     `architecture/authentication.md` (auth exists). Templates → table below.
   - **Backend/integration tier** (API or external integrations detected) — scaffolds
     `architecture/data-flow.md` · `architecture/integrations.md` · `docs/api/` (below) ·
     `architecture/authentication.md` if not already fired by the DB/auth substrate check above.
   - **Medium/complex tier** (multi-dev, sustained, or architecturally forked) — `docs/adr/` +
     `DECISIONS.md` (create-lazily — STANDARD §2 rule: never pre-created empty; scaffold
     `DECISIONS.md` only once the first qualifying decision (§4) exists, and write the ADR
     itself alongside it, not before) · `docs/flows/` (offer, via the same popup, creating the
     FIRST flow doc from `flows.md.template` for the project's main business flow — e.g. the
     primary user journey the app exists to support; skip if the user has no flow in mind yet).
   - Scaffold only what's chosen. Full tier table → STANDARD §6.
   - **Headless (the popup cannot be answered)** — detect it, don't assume it: probe the channel
     (`ToolSearch select:AskUserQuestion` → *no matching deferred tools* means unregistered; `dontAsk`
     auto-denies any prompting call). An interactive run asks the popup normally — that stays correct.
     Once verified headless, the tier choice can be neither asked nor assumed, and nothing is written —
     doc-evidenced business facts included. Record the park before halting:
     write the detected substrate, the question sets loaded (or none), the tiers you would have offered, any existing docs found with the migrate offer, and the unblock condition
     ("owner picks the tiers"; with existing docs, "owner picks migrate or continue, then the tiers") into a `/handoff` doc — there is no sprint file at this entry point.
     Base-tier scaffolding waits with it: it is additive, but it is downstream of a choice nobody made
     (night-run.md Part 0). Declining in prose alone leaves no artifact that init ran.

   | Doc | Fires on | Template |
   |---|---|---|
   | `docs/database/erd.md` | DB exists | `database-erd.md.template` |
   | `docs/database/schema.md` | DB exists | `database-schema.md.template` |
   | `docs/database/migration-guide.md` | DB exists | `database-migration-guide.md.template` |
   | `docs/architecture/data-flow.md` | backend/integration tier | `architecture-data-flow.md.template` |
   | `docs/architecture/authentication.md` | auth exists | `architecture-authentication.md.template` |
   | `docs/architecture/integrations.md` | backend/integration tier | `architecture-integrations.md.template` |
   | `docs/adr/ADR-NNN-<slug>.md` + `DECISIONS.md` | medium/complex tier, first qualifying decision | `ADR.md.template` + `DECISIONS.md.template` |
   | `docs/flows/<slug>.md` | medium/complex tier, offered for the main flow | `flows.md.template` |

   **`docs/api/` placement rule** — `api/openapi.yaml` is project-generated; init **never**
   generates its content (no template). When an API is detected, init creates `docs/api/` and
   (write-if-absent) `docs/api/README.md`, a 3-liner: *"Commit the OpenAPI source (`openapi.yaml`)
   here; generated HTML docs need not be committed."* — carrying a `<sub>` footer ownership line
   (§3 pointer-file exception, like AGENTS.md; a doc without an owner is an orphan, §7).
4. **Safe-scaffold allowlist** — the only non-doc files init writes. See below.
5. **Write** — target the canonical placement **STANDARD §2** defines (the standard is read first,
   per the generator's § Bundled + cited assets);
   enforce the line cap and the ownership header (§3) on every file touched.
   **Citation rule** — every fact init writes into `requirements.md` ends with its source:
   `(from <path> § <heading>)` for a doc, `(owner, init)` for the owner's own answer (edited, described or unsuggested choice),
   `(owner, init; suggested)` for an accepted suggestion, `(owner, init; drafted from <path> § <heading>)`
   for an accepted evidence option (Source column for quality rows). The same owner citations apply to
   First milestone, conventions and Standards adopted; `checks:` come only from the owner and cite
   `(owner, init)`, never `suggested`. An undecided business topic is written as the line
   `Not decided yet (owner, init)` in place of the template placeholder; its heading keeps `[CUSTOMIZE]`
   as the open flag until the topic is decided (a First milestone
   field keeps its placeholder: step 3 leaves it `[CUSTOMIZE]`). A set answer is one line in `## Conventions in use`
   ending `(owner, init)`, `(owner, init; suggested)` or `(owner, init; drafted from <file>)`;
   *not decided yet* goes under `Not confirmed`. Main flows: name each flow with its source; add the
   `→ docs/flows/<slug>.md` pointer only when that flow doc exists or init writes it.
6. **Verify** — `/prime` reads cleanly (no missing-file errors on required reads); every scaffolded
   file's ownership header + placement match STANDARD §2/§3; every Stack and Conventions-in-use line
   cites a repo file it was seen in, or the owner's answer; every `requirements.md` fact cites a doc
   § heading or the owner's answer (an accepted `(owner, init; suggested)` counts as the owner's answer
   in both checks); report the full file list, including safe-scaffold writes and any skips.

## Base-tier mandatory minimum

**Condition** blank = always scaffolded. A named condition is checked against step 1's detection and
the row is skipped when absent — same mechanism as step 3's substrate-conditional rows, applied one
tier down. The two substrates that gate a base row:

- **has code** — a language manifest (`package.json` · `pyproject.toml` · `go.mod` · `Cargo.toml` …)
  or source files outside `docs/`. A pure docs, content or config repo has neither.
- **publishes an artifact** — the repo ships something a consumer installs or runs: a package
  manifest with a version, a plugin/extension manifest, a Dockerfile, a deploy config. Independent of
  *has code* — a markdown plugin publishes without holding a line of application code.

| File | Condition | Template |
|---|---|---|
| `README.md` | | `README.md.template` |
| `CONTRIBUTING.md` | | `CONTRIBUTING.md.template` |
| `CODE_OF_CONDUCT.md` | team ≥ 2, or on request | `CODE_OF_CONDUCT.md.template` — **the enforcement contact is load-bearing**: a code of conduct nobody can report to is decoration, so if the user cannot name a real monitored address, do not scaffold the file |
| `SECURITY.md` | | `SECURITY.md.template` |
| `AGENTS.md` | | `AGENTS.md.template` |
| `CHANGELOG.md` | | `CHANGELOG.md.template` |
| `LICENSE` | | safe-scaffold (below) — no markdown template |
| `docs/work/` | | the work-item store (`backlog/ todo/ in_progress/ review/ done/ cancel/`; `evidence/TASK-NNN/` only when a first bug or task needs evidence, ADR-056) — **create-lazily**, never pre-created empty: `/task-decomposer` writes the first task file into `backlog/`; no template, no `TODO.md` |
| `TECH-DEBT.md` | | `TECH-DEBT.md.template` |
| `.claude/CLAUDE.md` | | `CLAUDE.md.template` |
| `.claude/CONTEXT.md` | | `CONTEXT.md.template` |
| `docs/product/requirements.md` | | `product-requirements.md.template` |
| `docs/product/acceptance-criteria.md` | | `product-acceptance-criteria.md.template` |
| `docs/architecture/overview.md` | | `architecture-overview.md.template` |
| `docs/development/setup.md` | | `development-setup.md.template` |
| `docs/development/coding-standards.md` | **has code** | `development-coding-standards.md.template` |
| `docs/testing/testing-guide.md` | **has code** | `testing-guide.md.template` |
| `docs/deployment/deployment-guide.md` | **publishes an artifact** | `deployment-guide.md.template` |
| `docs/deployment/rollback-guide.md` | **publishes an artifact** | `deployment-rollback.md.template` |

Why only these four: the rest describe the *project*, not its substrate. Every repo has a reason to
exist (`product/`), a shape (`architecture/`), a way in (`README` · `setup`), and a security contact —
a docs repo included. Coding standards and a testing guide describe code that may not exist, and
deployment describes a release that may never happen; those are the ones that become ceremony.

Missing template for a base-tier row → WARN and fall back to STANDARD §2's inline description
(template-load protocol step 2); never hard-stop.

## Safe-scaffold allowlist (the only non-doc files init writes)

Exactly three, **write-if-absent only** — an existing file is never overwritten, only skipped +
reported:

| File | Content rule |
|---|---|
| `.env.example` | Variable **names only**, detected from the codebase (env-var reads, config loaders) — **never values**. |
| `.gitignore` | STANDARD **§12c** classes (build output, dependency dirs, editor/OS cruft, local env files) as the standard baseline, plus stack-detected additions on top (e.g. a Python repo adds `__pycache__/`, a Node repo adds `node_modules/`). |
| `LICENSE` | User chooses a license; a private repo gets a proprietary notice instead. |

Every write (or skip-because-exists) is listed in the init report. `settings.json` and every other
non-doc file stay **banned** from init — no exceptions.

## Verify

- `/prime` reads the new docs cleanly.
- Every file carries its STANDARD §3 ownership header (or the README/AGENTS footer-line
  exception) with `owner` a role, never a person.
- Placement matches STANDARD §2 exactly — root vs `.claude/` vs the `docs/` tree.
- Every Stack and Conventions-in-use line cites a repo file it was seen in, or the owner's answer (including an accepted `(owner, init; suggested)`).
- Every fact in `requirements.md` cites a doc `§ heading` or the owner's answer (including an accepted `(owner, init; suggested)`); no unaccepted suggestion is written.
- A loaded set's questions were asked only where the scan and the marker search left them open.
- Report: files written · files skipped (pre-existing) · any WARN (missing template).
