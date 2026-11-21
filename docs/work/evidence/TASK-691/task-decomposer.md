# TASK-691 — task-decomposer pre-trim instruction inventory

Written before editing any of the three bodies. Source: skills/task-decomposer/SKILL.md at commit 3aacd3ebed802905c3b1342d68295678b96711a1, git blob 4a2e9de38ab07adf52d5281af174c78484403e6b.

Basis: UTF-8 body immediately after closing frontmatter and its newline, including next blank and final newline; CRLF → LF, no trim (TASK-690). Frontmatter is unchanged.

Pre-trim body SHA-256: 51ad6b75c6f139df223f3a028c352716a54b071c840875b04a5b00f8a80ab58e.

Before: 14273 body bytes / 140 total file lines. After bounded retry: 13707 body bytes (target ≤ 13707) / 129 total file lines.

Post-retry body SHA-256: 01bff1f65fd28f796329a6b5e956d199483f56dc68a83bbd8970d82b3950321c. Measurements and checks are recorded in checks.md.

## Bounded edit and safety argument

- duplicate task schema: 566 → 0 bytes; saves 566.
- Bounded retry: Body L89's trailing colon becomes a period because the following fence was removed; byte-neutral.

Only the duplicate schema and following blank are deleted. Existing body L89 full-template and L74 shape/id pointers survive; references/task-file.md is unchanged. Initial state/priority, existing-file prohibition, id derivation, approval and Negative gates stay in the body.

## Complete line inventory

Before numbers are PRE-TRIM whole-file coordinates (body starts L9); body destinations are POST-TRIM whole-file coordinates. Every nonblank body line appears once, including scaffolding, tables, fences and examples: a superset of behavioral lines. Blank separators carry no behavior and are excluded. Entities only escape the exact source text for display.

Rows: 110; kept 100, moved 0, deleted 10. Kept-shortened lines map to their surviving body paragraph; no instruction moves out.

| Before line | Disposition | Surviving line / reference / branch pointer | Exact pre-trim source line |
|---|---|---|---|
| L10 | kept | Body L10; unchanged | <code># Task Decomposer</code> |
| L12 | kept | Body L12; unchanged | <code>Translate any form of human intent into fully-formed `TASK-NNN` task files. The approved output</code> |
| L13 | kept | Body L13; unchanged | <code>serves as the scope gate — `/orchestrator` G1 then runs as a fast-path confirm (scope unchanged?),</code> |
| L14 | kept | Body L14; unchanged | <code>not a re-grill.</code> |
| L15 | kept | Body L15; unchanged | <code>**Worker route** — attended intake with Agent + resumable subagents: before source reads, follow `${CLAUDE_SKILL_DIR}/references/intake-brief.md`. Otherwise (including unattended), read inline as below. Workers follow the procedure inline without redispatching intake.</code> |
| L16 | kept | Body L16; unchanged | <code>`TODO.md` present and no `docs/work/` → v1 · both present → mixed · only `docs/work/` → v2 (existence only, never content).</code> |
| L17 | kept | Body L17; unchanged | <code>On v1 or mixed, name it and refuse to write — point to `/lean-doc-generator migrate`, the only 2.x path for a v1 tree.</code> |
| L19 | kept | Body L19; unchanged | <code>## Input types</code> |
| L21 | kept | Body L21; unchanged | <code>&#124; Input &#124; Detection &#124;</code> |
| L22 | kept | Body L22; unchanged | <code>&#124;---&#124;---&#124;</code> |
| L23 | kept | Body L23; unchanged | <code>&#124; Freeform — `"add Google OAuth login"` &#124; no URL, no `--` flag &#124;</code> |
| L24 | kept | Body L24; unchanged | <code>&#124; Ticket — `JIRA-123` or a Linear/GitHub URL &#124; matches `[A-Z]+-[0-9]+` or a URL &#124;</code> |
| L25 | kept | Body L25; unchanged | <code>&#124; PRD — `--prd docs/feature.md` &#124; `--prd` flag + path &#124;</code> |
| L26 | kept | Body L26; unchanged | <code>&#124; Epic — `--epic "Payments"` or `--epic EPIC-003` &#124; `--epic` flag + name or id &#124;</code> |
| L27 | kept | Body L27; unchanged | <code>&#124; Roadmap row — `--roadmap P2a` &#124; `--roadmap` flag + a row id &#124;</code> |
| L29 | kept | Body L29; unchanged | <code>For a ticket, fetch the description first (ask the user to paste if credentials are missing — never block on env vars).</code> |
| L30 | kept | Body L30; unchanged | <code>**For an epic**, resolve the flag to `docs/epic/EPIC-NNN-&lt;slug&gt;.md` (match on id, else slug, else the</code> |
| L31 | kept | Body L31; unchanged | <code>`INDEX.md` row) and **read it before grilling**. **Check `docs/epic/archive/` before concluding it does</code> |
| L32 | kept | Body L32; unchanged | <code>not exist** — a closed epic is archived there (§11) and resolving only the live directory would report</code> |
| L33 | kept | Body L33; unchanged | <code>a finished epic as never-created, sending the owner to `/lean-doc-generator epic` to re-open work that</code> |
| L34 | kept | Body L34; unchanged | <code>is already done. A match in `archive/` is a *closed* epic: say so, and note that new work toward that</code> |
| L35 | kept | Body L35; unchanged | <code>outcome opens a **new** epic rather than reopening this one — its Outcome, Scope-Out and Open questions are already-settled</code> |
| L36 | kept | Body L36; unchanged | <code>context, so re-asking them is the interview a resolved epic exists to prevent. Decompose only the slice</code> |
| L37 | kept | Body L37; unchanged | <code>the owner names, never the whole epic at once: an epic spans sprints by definition, and a Plan holds</code> |
| L38 | kept | Body L38; unchanged | <code>~12 tasks. No epic doc for that name → it is not an epic yet; say so and offer `/lean-doc-generator epic`</code> |
| L39 | kept | Body L39; unchanged | <code>(nameable outcome) or `--fog` (not yet nameable). **Never create the epic here** — creation is the</code> |
| L40 | kept | Body L40; unchanged | <code>generator's job; this skill consumes.</code> |
| L42 | kept | Body L42; unchanged | <code>**For a roadmap row**, resolve `docs/product/roadmap.md` (legacy `docs/roadmap.md`) and find the Delivery-sequence row whose</code> |
| L43 | kept | Body L43; unchanged | <code>first-cell leading token equals the id (exact, case-sensitive). Its Usable outcome, Depends on and Acceptance evidence are</code> |
| L44 | kept | Body L44; unchanged | <code>already-settled context — read them, don't re-interview them. Decompose **only that row**, never the roadmap; set `epic:` only</code> |
| L45 | kept | Body L45; unchanged | <code>if its `Covered by` names an active epic. End by telling the owner what to put in the row's `Covered by` cell (the new `TASK-NNN`</code> |
| L46 | kept | Body L46; unchanged | <code>ids): the decomposer never edits the roadmap — the coverage mark is the owner's or promote's. No roadmap, or no such</code> |
| L47 | kept | Body L47; unchanged | <code>row → say so and offer `/lean-doc-generator roadmap` (create) or plain decomposition.</code> |
| L49 | kept | Body L49; unchanged | <code>## Procedure</code> |
| L51 | kept | Body L51; unchanged | <code>Before the grill or PRD synthesis, the worker (inline on fallback) reads `.claude/CONTEXT.md` (else `CONTEXT.md`) in full and relevant map sections in `docs/architecture/overview.md` (else `docs/ARCHITECTURE.md` or `ARCHITECTURE.md`); adapt host paths. Missing file/section → report, use tier defaults below and derive facts from input/code.</code> |
| L53 | kept | Body L53; unchanged | <code>1. **Clarify — the grill** *(freeform / ticket only)* — ambiguity is cheapest to kill at intake. Decisions form a dependency tree; work it in **rounds by frontier**. The frontier is every decision whose prerequisites are already settled — ask **all of it at once** as one **AskUserQuestion popup** (each option with a recommended answer), then recompute the frontier from the answers. **The discriminator is dependency, not count:** batching *dependent* questions is what produces vague answers, because the user must guess at inputs they have not given yet; batching *independent* ones costs nothing and saves a round-trip. Stop when the frontier is empty — every branch visited, nothing silently assumed. **Finding *facts* is your job, never the user's:** an unresolved fact is a prerequisite in the tree, not a question — resolve it yourself (for mature / unfamiliar code, **recon via the `Explore` agent** — existing impl + tests + deps → a tight brief in its own context, a cheap-tier `sonnet` pass whose brief says: never open `.env`, `.env.*`, key or credential files, or anything the host's ignore rules mark secret, even when told read-only; report and ask, or read a non-secret record; the grill itself stays on the session model. Tier map → `CONTEXT.md`). Only the branch *downstream* of an open exploration waits; the rest of the frontier proceeds. Moves:</code> |
| L54 | kept | Body L54; unchanged | <code>   - **Challenge the glossary** — a term conflicts with `CONTEXT.md`? Surface it: "your glossary says X, you seem to mean Y — which?"</code> |
| L55 | kept | Body L55; unchanged | <code>   - **Sharpen fuzzy language** — replace an overloaded word ("account", "user") with a precise canonical term; feed a newly-pinned term straight to `/lean-doc-generator` (glossary), don't batch.</code> |
| L56 | kept | Body L56; unchanged | <code>   - **Invent edge-case scenarios** — concrete cases that force the boundaries between concepts to be made explicit.</code> |
| L57 | kept | Body L57; unchanged | <code>   - **Cross-reference code** — a claim contradicts the code? Surface the contradiction.</code> |
| L58 | kept | Body L58; unchanged | <code>   - **A design that must be *felt*, or a high-stakes fork** — don't resolve it here: record it on the task (`assumes:`) so G2 routes to `/prototype` / `/council`.</code> |
| L60 | kept | Body L60; unchanged | <code>   Stop when the goal is unambiguous. **Synthesize from context instead of re-interviewing ONLY when step 2's registry comes back with zero open assumptions** (a design discussion just happened and nothing is open); otherwise grill the open ones.</code> |
| L61 | kept | Body L61; unchanged | <code>2. **Assumption registry** — list every assumption that affects behavior (auth model, data shape, third-party limits). Confirm the risky ones explicitly.</code> |
| L62 | kept | Body L62; unchanged | <code>3. **Decompose into tracer-bullet vertical slices** — each task is a thin path through *every* layer end-to-end (schema → API → UI → tests), independently demoable. Prefer many thin slices over few thick ones; record `depends-on` (or `none`). Set `class:` by nature — ambiguity/consequence → `decision` · implement/research → `execution` · bulk mechanical reads/extraction → `mechanical-ingest`; it's an advisory default the dispatcher may override (ADR-010). Horizontal layers ("write all the models", "all the tests") are NOT valid tasks.</code> |
| L63 | kept | Body L63; unchanged | <code>4. **Risk score** — per task, rate impact × likelihood (low / med / high); note the blast radius (files / layers touched).</code> |
| L64 | kept | Body L64; unchanged | <code>   **Build order** — among slices with no unmet dependency, list first the one that removes the most uncertainty.</code> |
| L65 | kept | Body L65; unchanged | <code>   When `docs/product/requirements.md` § First milestone states a **Proof goal** (not a `[…]` placeholder), that is the slice that proves it, or the ready slice that unblocks it when that slice still waits on a dependency; the breakdown cites the proof goal.</code> |
| L66 | kept | Body L66; unchanged | <code>   When the file, the section or the value is missing, the breakdown says so and ranks the ready slices by the likelihood scored here, highest first. The order is a proposal: `/triage` and promote own final priority.</code> |
| L67 | kept | Body L67; unchanged | <code>5. **Classify HITL / AFK** — `HITL` = a human must review the output before proceeding; `AFK` = autonomous completion is safe (acceptance is mechanically checkable · no irreversible side effects · no product/UX judgment call · spec is durable). Default to `HITL` when uncertain. **For `AFK` tasks, spec durably** — an AFK task may sit in the backlog for weeks before an agent picks it up: write behavioral contracts (name the types / interfaces / config shapes to change) + testable acceptance + explicit out-of-scope; **never reference file paths or line numbers** — they go stale.</code> |
| L68 | kept | Body L68; unchanged | <code>6. **Validate** — every task has an observable acceptance criterion ("done when …"); no two tasks share identical criteria (merge or differentiate). For multi-slice breakdowns, run the **breakdown quiz** (reference) — confirm granularity, dependencies, merge/split, HITL/AFK — before Write.</code> |
| L69 | kept | Body L69; unchanged | <code>   **Negative scenario** — a feature/bug task, or a debt task that changes observable behaviour, needs a `Negative:` box: what must</code> |
| L70 | kept | Body L70; unchanged | <code>   not happen, or a failure path and its observable result; docs/config/spike tasks name one when it applies, else write `Negative: n/a: &lt;reason&gt;` (never a silent exemption; shape → `references/task-file.md`).</code> |
| L71 | kept | Body L71; unchanged | <code>   A draft that needs this box and names no scenario is not written on that `approve`: show each drafted box as the exact `- [ ] Negative: …` line it will be written as, write nothing, and wait for a fresh `approve`, then write those lines unchanged; the earlier one never covered a box added after it.</code> |
| L72 | kept | Body L72; unchanged | <code>   A draft someone reviews before `approve` runs that review under `orchestrator/references/review-scoping.md` § Draft reviews (at most two rounds).</code> |
| L73 | kept | Body L73; unchanged | <code>7. **Write** — after the layout check above (v1/mixed stops here) and only after the human types `approve`, write **one file per task** to `docs/work/backlog/TASK-NNN-&lt;slug&gt;.md`, blockers first.</code> |
| L74 | kept | Body L74; unchanged | <code>   Id = max in use across all six status folders + 1; shape + id rule → `${CLAUDE_SKILL_DIR}/references/task-file.md`. Touch no other file. Sprint formation happens later via `/lean-doc-generator promote`.</code> |
| L76 | kept | Body L76; unchanged | <code>## Fog-map mode (foggy work too big to plan up front)</code> |
| L78 | kept | Body L78; unchanged | <code>When the work is too large/foggy to slice — you can't write acceptance criteria because the *decisions</code> |
| L79 | kept | Body L79; unchanged | <code>aren't known* — don't force premature `TASK-NNN`. Run a **pre-decomposition fog-map** (`--fog`, or offer</code> |
| L80 | kept | Body L80; unchanged | <code>it when the grill reveals the frontier is unknowable): a living map — **Destination · Decisions-so-far ·</code> |
| L81 | kept | Body L81; unchanged | <code>Not-yet-specified (fog) · Out-of-scope** — of **decision-tickets** that resolve *decisions, not</code> |
| L82 | kept | Body L82; unchanged | <code>deliverables* (Research·AFK / Prototype·HITL / Grilling·HITL / Task). Each ticket **routes to an existing</code> |
| L83 | kept | Body L83; unchanged | <code>skill** (research-spike/`Explore` · `/prototype` · the intake grill · normal decompose) and **graduates</code> |
| L84 | kept | Body L84; unchanged | <code>into `TASK-NNN`** once resolved. Loop until no decision is uncertain, then decompose the now-clear work</code> |
| L85 | kept | Body L85; unchanged | <code>normally. Full artifact + loop → `${CLAUDE_SKILL_DIR}/references/fog-map.md`.</code> |
| L87 | kept | Body L87; unchanged | <code>## Task file shape</code> |
| L89 | kept | Body L89; trailing colon changed to period; instruction unchanged | <code>One task = one file, `docs/work/backlog/TASK-NNN-&lt;slug&gt;.md` (full template → `references/task-file.md`):</code> |
| L91 | deleted | duplicate of references/task-file.md § File shape L36 opening fence; surviving full-template pointer Body L89 and Write step L74 | <code>```</code> |
| L92 | deleted | duplicate of references/task-file.md § File shape L37 frontmatter delimiter; surviving full-template pointer Body L89 and Write step L74 | <code>---</code> |
| L93 | deleted | duplicate of references/task-file.md § File shape L38–45, L47–48 id, title, epic, priority, size, risk, autonomy, tier, authority; surviving full-template pointer Body L89 and Write step L74 | <code>id · title · epic · priority · size · risk · autonomy (HITL&#124;AFK) · tier · authority</code> |
| L94 | deleted | duplicate of references/task-file.md § File shape L46 class and dispatcher override; surviving full-template pointer Body L89 and Write step L74 | <code>class:      decision &#124; execution &#124; mechanical-ingest   (advisory default — dispatch may override, ADR-010)</code> |
| L95 | deleted | duplicate of references/task-file.md § File shape L49 origin and G1 fast-path; surviving full-template pointer Body L89 and Write step L74 | <code>origin:     decomposer   (always — these entries met the grill above; that is what earns G1's fast-path)</code> |
| L96 | deleted | duplicate of references/task-file.md § File shape L50 and L87–88 state, readiness never a folder; surviving full-template pointer Body L89 and Write step L74 | <code>state:      ready &#124; needs-info &#124; blocked               (readiness — a field, never a folder)</code> |
| L97 | deleted | duplicate of references/task-file.md § File shape L51 dependency list or empty; surviving full-template pointer Body L89 and Write step L74 | <code>depends-on: [TASK-NNN, …] or []</code> |
| L98 | deleted | duplicate of references/task-file.md § File shape L53 closing frontmatter delimiter; surviving full-template pointer Body L89 and Write step L74 | <code>---</code> |
| L99 | deleted | duplicate of references/task-file.md § File shape L61–79 Done when / observable box, Touches, Assumes / open questions, Tracker; surviving full-template pointer Body L89 and Write step L74 | <code>## Done when (observable outcome) · ## Touches · ## Assumes (key assumptions · open questions) · ## Tracker</code> |
| L100 | deleted | duplicate of references/task-file.md § File shape L80 closing fence; surviving full-template pointer Body L89 and Write step L74 | <code>```</code> |
| L102 | kept | Body L91; unchanged | <code>No `status:` field — the folder is the status. Set the initial `state:` (`ready` if the done-when is</code> |
| L103 | kept | Body L92; unchanged | <code>concrete, else `needs-info` with its open questions under `## Assumes`) and an initial `priority:`</code> |
| L104 | kept | Body L93; unchanged | <code>(P2 unless the grill settled one). Re-prioritising, re-stating, sequencing and pruning later is</code> |
| L105 | kept | Body L94; unchanged | <code>`/triage`'s job — never edit an existing task file here.</code> |
| L107 | kept | Body L96; unchanged | <code>**`--prd &lt;path&gt;` = CONSUME that file.** It never means "write one" — creation of core docs belongs to</code> |
| L108 | kept | Body L97; unchanged | <code>`/lean-doc-generator`. Read the PRD, then decompose it; do not re-interview what it already settles.</code> |
| L110 | kept | Body L99; unchanged | <code>**Large features with no PRD yet**: synthesize a **working feature PRD** (Problem · Solution ·</code> |
| L111 | kept | Body L100; unchanged | <code>exhaustive User Stories · Implementation + Testing Decisions · Out-of-scope · seams) and get approval,</code> |
| L112 | kept | Body L101; unchanged | <code>then decompose against it. That artifact is *intake scaffolding*, not a §2 core file — format + seams +</code> |
| L113 | kept | Body L102; unchanged | <code>the breakdown quiz → `${CLAUDE_SKILL_DIR}/references/prd-and-slices.md` (`${CLAUDE_SKILL_DIR}` resolves to this</code> |
| L114 | kept | Body L103; unchanged | <code>skill's install directory at load time). Its approved residue belongs in the durable, project-scoped</code> |
| L115 | kept | Body L104; unchanged | <code>`docs/product/requirements.md` (+ `acceptance-criteria.md`) — **hand that write to</code> |
| L116 | kept | Body L105; unchanged | <code>`/lean-doc-generator prd`**, sanitized, never the raw conversation and never written from here. Task</code> |
| L117 | kept | Body L106; unchanged | <code>output stays local (`docs/work/backlog/` files) — no external issue tracker. **End of life:** the working PRD is</code> |
| L118 | kept | Body L107; unchanged | <code>temp-dir scaffolding with no durable file of its own — once sliced and its residue sanitized into</code> |
| L119 | kept | Body L108; unchanged | <code>`requirements.md`, it is gone, and §11 has no row for it because retention acts on committed files</code> |
| L120 | kept | Body L109; unchanged | <code>(STANDARD §2 temp-dir note). Same shape as a `BUG-&lt;slug&gt;.md` report.</code> |
| L122 | kept | Body L111; unchanged | <code>## Hard rules</code> |
| L124 | kept | Body L113; unchanged | <code>- Never write a task file before the human types `approve`.</code> |
| L125 | kept | Body L114; unchanged | <code>- After `approve`: new files in `docs/work/backlog/` only — never into a sprint's folders (`todo/` · `in_progress/` · `review/`) or a closed one, never over an existing file.</code> |
| L126 | kept | Body L115; unchanged | <code>- Never guess or reuse an id — derive it (`references/task-file.md`); an id sitting in `done/` or `cancel/` is still taken.</code> |
| L127 | kept | Body L116; unchanged | <code>- Identical acceptance criteria on two tasks → merge or differentiate first.</code> |
| L128 | kept | Body L117; unchanged | <code>- A task with no observable acceptance criterion fails validation — rewrite it.</code> |
| L129 | kept | Body L118; unchanged | <code>- A question that BLOCKS scope/design is asked here (with its frontier round) or recorded as an explicit `needs-info`/`blocked` with its unblock condition — never parked as a silent `assumes:` or a passive doc note that stalls dev.</code> |
| L131 | kept | Body L120; unchanged | <code>## Red flags</code> |
| L133 | kept | Body L122; unchanged | <code>&#124; Rationalization &#124; What it actually means &#124;</code> |
| L134 | kept | Body L123; unchanged | <code>&#124;---&#124;---&#124;</code> |
| L135 | kept | Body L124; unchanged | <code>&#124; "I'll guess the acceptance criteria" &#124; "works correctly" fails validation — write the observable outcome &#124;</code> |
| L136 | kept | Body L125; unchanged | <code>&#124; "Skip the assumption registry, it's small" &#124; unconfirmed auth assumptions are the top source of regressions &#124;</code> |
| L137 | kept | Body L126; unchanged | <code>&#124; "I'll ask all four now, batching is allowed" &#124; only if they are **independent**. A question whose answer depends on another still-open one makes the user guess — that is what produces vague answers, not the count. Serialise dependents; batch the frontier &#124;</code> |
| L138 | kept | Body L127; unchanged | <code>&#124; "These two are related, I'll merge them" &#124; related ≠ same concern — verify the criteria are truly identical &#124;</code> |
| L139 | kept | Body L128; unchanged | <code>&#124; "I'll slice it by layer" &#124; horizontal layers aren't demoable — slice vertically &#124;</code> |
| L140 | kept | Body L129; unchanged | <code>&#124; "A multiple-choice question pins the term" &#124; an MCQ captures a *preference*, not a *definition* — pin a domain term with a concrete example, then confirm (promoted rule) &#124;</code> |

## Route R1 — ordinary freeform intake (deleted duplicate schema)

Cwds: D:/Research/s184-evals/t8/intake-before and intake-after. Both contain exactly the three files
below and six empty directories docs/work/{backlog,todo,in_progress,review,done,cancel}/.
No TODO.md, sprint, PRD, epic, roadmap, git metadata, local settings or secret files.

.claude/CONTEXT.md:

~~~markdown
# Greeting library
One exported TypeScript function, greet(name: string): string, in src/greet.ts.
No network, persistence, UI, authentication or external dependencies. There are no project-specific model tiers.
~~~

README.md:

~~~markdown
# Greeting library
Call greet(name) to produce a greeting. The name currently passes through unchanged.
~~~

src/greet.ts:

~~~typescript
export function greet(name: string): string {
  return 'Hello, ' + name + '!';
}
~~~

Exact prompt:

> Use /lean-flow:task-decomposer for this small freeform feature: greet(name: string) should trim leading and trailing whitespace before returning Hello, <trimmed name>!. An empty or whitespace-only name must throw Error with message Name is required. Preserve internal whitespace, case, and Unicode. Already-trimmed nonempty names must keep their exact output. The TypeScript string signature stays unchanged; no UI, network, persistence, or unrelated changes. Draft one task and show its complete proposed task-file contents in your response for review. Do not implement the feature. I have not approved task-file writes.

Compare: v2 detection; context/code read; assumption registry and validation including an exact proposed
Negative box; one vertical slice with full schema, origin: decomposer, readiness and initial priority;
approve gate stops before writes. Derive TASK-001 from all six empty status folders, never a remembered id.
Record task-file.md reads that recover the removed duplicate; no schema field may disappear.
This run stops at approval and does not claim an approved-write proof. All other input branches remain unchanged.

## Coordinator proof protocol — not run by the builder

A4 requires one pre-trim and one merged run of each route, identical prompt and cwd contents.
T8 has four routes / eight runs; $0.40/run plans $3.20 within $3.50. These are ceilings, not spend
or launch approval. Coordinator records actual total_cost_usd in spend.md and stops before exceeding
the remaining share. No claude process was launched by the builder.

Before plugin: export commit 3aacd3ebed802905c3b1342d68295678b96711a1, paths skills and .claude-plugin only,
to D:/Research/s184-evals/t8/pre-plugin. After plugin: D:/Project/lean-flow after T8 merges.
Use two fresh identical cwd copies per route. Never point triage at the live backlog.
Keep transcripts outside the cwd, then retain proof evidence under this task's evidence directory.

In each before cwd, use the exact prompt below as the final argument:

~~~text
claude -p --plugin-dir D:/Research/s184-evals/t8/pre-plugin --add-dir <cwd> --setting-sources project,local --strict-mcp-config --output-format stream-json --verbose --model sonnet --max-budget-usd 0.40 <prompt>
~~~

In its identical after cwd, use the same command and prompt with --plugin-dir D:/Project/lean-flow.
Paths and prompt are single arguments, quoted for the launch shell. Launch approval stays with the coordinator.
Capture system/init plugin paths, reference Read calls, gates/stops, output fields, cwd hashes before/after
and actual spend. Compare behavior, not wording. An early budget stop or missing evidence is unproven.
The setup below is a recipe for the coordinator; the builder creates none of these external files.

