# TASK-691 — triage pre-trim instruction inventory

Written before editing any of the three bodies. Source: skills/triage/SKILL.md at commit 3aacd3ebed802905c3b1342d68295678b96711a1, git blob 0e95e0ebbcf94676f9e7c9858e89b6ef79203106.

Basis: UTF-8 body immediately after closing frontmatter and its newline, including next blank and final newline; CRLF → LF, no trim (TASK-690). Frontmatter is unchanged.

Pre-trim body SHA-256: 54bcc55754398e3cd43ff168c50c2b7aa973b7972049e1d44814f5ba9c37eeb9.

Before: 10540 body bytes / 132 total file lines. After bounded retry: 9498 body bytes (target ≤ 9546) / 113 total file lines.

Post-retry body SHA-256: 250031eb051427c2328aa6ccfb0d2af8b8cd6d0f7a00c4363ed66e07fb6a7924. Measurements and checks are recorded in checks.md.

## Bounded edit and safety argument

- Initial trim: conditional rejection record 1138 → 144 bytes; saved 994.
- Bounded retry: add the reference read at both branch points; remove the redundant late section.
  Body 9546 → 9498 bytes; saves 48 more, 1042 total (9.89%).

Only rejection-specific record details move verbatim into this skill's own reference. Flow 1 keeps
scan-first and now reads the reference before scanning; Flow 7 reads it before writing a record.
Applying, hard rules and absent-y proposal/park behavior remain byte-identical. The removed late
approval reminder survives in Flow 8 (L71), Applying (L87) and HITL (L101). The removed heading was
scaffolding for the same topic as references/out-of-scope.md L1; no rule is removed.

The accepted Medium finding was that the late pointer did not satisfy the frozen Negative box:
a moved instruction needs a pointer at its branch point. Exact post-retry lines (whole-file coordinates):

Flow 1 / Body L47:

> 1. **Scan `.out-of-scope/` first** — read `${CLAUDE_SKILL_DIR}/references/out-of-scope.md` before scanning; if a backlog task resembles a prior rejection, surface it and ask before keeping it.

Flow 7 / Body L67:

> 7. **Route rejects** — read `${CLAUDE_SKILL_DIR}/references/out-of-scope.md` first; for work that will not be done, write an `.out-of-scope/` entry, then move the task file `backlog/ → cancel/` — `git mv` in the git case, a plain move with no git (§ Applying). A merged duplicate goes the same way, with a `## Amended <date>` line naming the survivor.

The reference is unchanged: only its title was new in the initial trim, followed by the verbatim
moved span. This reduces entry-body bytes, not necessarily total read bytes on a rejection call.

## Complete line inventory

Before numbers are PRE-TRIM whole-file coordinates (body starts L9); body destinations are POST-RETRY whole-file coordinates. Every nonblank body line appears once, including scaffolding, tables, fences and examples: a superset of behavioral lines. Blank separators carry no behavior and are excluded. Entities only escape the exact source text for display.

Rows: 98; kept 83, moved 14, deleted 1 (redundant heading only). Flow 1/7 retain their original rules plus the branch pointers; no additional instruction moves out.

| Before line | Disposition | Surviving line / reference / branch pointer | Exact pre-trim source line |
|---|---|---|---|
| L10 | kept | Body L10; unchanged | <code># triage</code> |
| L12 | kept | Body L12; unchanged | <code>Groom the existing backlog: re-rank, flag, state, and route. **Backlog only** — the task files in</code> |
| L13 | kept | Body L13; unchanged | <code>`docs/work/backlog/`; never touches a sprint's members (`todo/` · `in_progress/` · `review/`), which</code> |
| L14 | kept | Body L14; unchanged | <code>are locked. Re-prioritisation and state changes are **HITL**: propose with reasons, get a</code> |
| L15 | kept | Body L15; unchanged | <code>`y`, then apply.</code> |
| L17 | kept | Body L17; unchanged | <code>Pipeline: `/task-decomposer` (intake) → **`/triage`** (groom + re-prioritise) → `/lean-doc-generator promote` (form sprint) → `/orchestrator` (build).</code> |
| L19 | kept | Body L19; unchanged | <code>`TODO.md` present and no `docs/work/` → v1 · both present → mixed · only `docs/work/` → v2 (existence only, never content).</code> |
| L20 | kept | Body L20; unchanged | <code>On v1 or mixed, name it and refuse to groom — point to `/lean-doc-generator migrate`, the only 2.x path for a v1 tree.</code> |
| L22 | kept | Body L22; unchanged | <code>## When to invoke</code> |
| L24 | kept | Body L24; unchanged | <code>- The backlog has grown and priorities have drifted from reality.</code> |
| L25 | kept | Body L25; unchanged | <code>- Before a Sprint Promote, to surface what is genuinely ready.</code> |
| L26 | kept | Body L26; unchanged | <code>- A specific task needs a state or priority decision.</code> |
| L27 | kept | Body L27; unchanged | <code>- A reported bug needs intake routing (it becomes a `type: bug` work item).</code> |
| L29 | kept | Body L29; unchanged | <code>## Task states (light)</code> |
| L31 | kept | Body L31; unchanged | <code>A backlog task file carries `state:` in its frontmatter — orthogonal to the `autonomy:` `HITL`/`AFK`</code> |
| L32 | kept | Body L32; unchanged | <code>label (which says *who* acts, not *whether it's ready*) and to the folder (which says *status*).</code> |
| L33 | kept | Body L33; unchanged | <code>**Readiness is never a folder**: a `blocked` or `needs-info` task stays in `backlog/`, and no state</code> |
| L34 | kept | Body L34; unchanged | <code>change is ever a `git mv`.</code> |
| L36 | kept | Body L36; unchanged | <code>&#124; state &#124; meaning &#124;</code> |
| L37 | kept | Body L37; unchanged | <code>&#124;---&#124;---&#124;</code> |
| L38 | kept | Body L38; unchanged | <code>&#124; `ready` &#124; fully specified, has a done-when — promotable &#124;</code> |
| L39 | kept | Body L39; unchanged | <code>&#124; `needs-info` &#124; missing detail or an unanswered question — not promotable yet &#124;</code> |
| L40 | kept | Body L40; unchanged | <code>&#124; `blocked` &#124; waiting on a dependency or another task (`depends-on`) &#124;</code> |
| L42 | kept | Body L42; unchanged | <code>Rejected work is not a state — it leaves the backlog (see `.out-of-scope/`). Default when unset:</code> |
| L43 | kept | Body L43; unchanged | <code>`ready` if it has a done-when, else `needs-info`.</code> |
| L45 | kept | Body L45; unchanged | <code>## Flow</code> |
| L47 | kept | Body L47; reference read added before scanning; original rule unchanged | <code>1. **Scan `.out-of-scope/` first** — if a backlog task resembles a prior rejection, surface it and ask before keeping it.</code> |
| L48 | kept | Body L48; unchanged | <code>2. **Load** — after the layout check above (v1/mixed stops here): read every `docs/work/backlog/TASK-*.md` — frontmatter + `## Done when` + `## Assumes` (+ root `TECH-DEBT.md`). Read other folders only to resolve a `depends-on:` id or an active epic's `→ TASK-…` coverage mark; never groom them.</code> |
| L49 | kept | Body L49; unchanged | <code>   **Also read every `status: active` epic** (`docs/epic/EPIC-*.md`, not `archive/`; none → skip) — read-only, to run</code> |
| L50 | kept | Body L50; unchanged | <code>   the coverage check (STANDARD § 2, *Epic coverage*): each open `- [ ]` § Closed-when item must **end** with</code> |
| L51 | kept | Body L51; unchanged | <code>   `→ TASK-NNN[, TASK-MMM]` (≥1 id with a file in `backlog/` · `todo/` · `in_progress/` · `review/`) or</code> |
| L52 | kept | Body L52; unchanged | <code>   `→ next slice: &lt;name&gt;`. Unmarked, or every named id in `done/` · `cancel/` · missing = **uncovered**.</code> |
| L53 | kept | Body L53; unchanged | <code>   `proposed` epics are exempt; `[x]` items need nothing. **Roadmap rows too:** each `Status: active` row of `docs/product/roadmap.md`</code> |
| L54 | kept | Body L54; unchanged | <code>   (or `docs/roadmap.md`) — same verdicts, plus an `EPIC-NNN` mark must name an active epic (`references/epic-coverage.md` of `/lean-doc-generator`, § Source B).</code> |
| L55 | kept | Body L55; unchanged | <code>3. **Bug intake** — a reported bug (or a bug-flavored backlog entry) becomes a **`type: bug` work item** (ADR-056), routed, not ranked like a feature:</code> |
| L56 | kept | Body L56; unchanged | <code>   - write it to `backlog/` with **`origin: triage-bug`** and the bug template's intake sections (symptom · repro · expected · actual · evidence), its evidence redacted into `docs/work/evidence/TASK-NNN/` — same id rule as `/task-decomposer` (max over `docs/work/*/TASK-*.md`, all six folders, + 1)</code> |
| L57 | kept | Body L57; unchanged | <code>   - known cause + trivial fix → `state: ready` only when the report or the code names what must keep working after the fix, and Done-when has a `Negative:` box citing it (the regression its test pins); otherwise `needs-info` with that missing scenario as a `- **open:**` line under `## Assumes` and no box · unknown cause / needs investigation → `- **next:** /diagnose` under `## Assumes`</code> |
| L58 | kept | Body L58; unchanged | <code>   - systemic / architectural → file as `TD-NNN` in root `TECH-DEBT.md` (it becomes a `type: debt` item only when scheduled)</code> |
| L59 | kept | Body L59; unchanged | <code>   - **stamp `origin:` on every task you file here** — a bug converted at triage never met the intake</code> |
| L60 | kept | Body L60; unchanged | <code>     grill, and the stamp is what stops G1 fast-pathing it on the strength of looking well-formed</code> |
| L61 | kept | Body L61; unchanged | <code>   - **the item is the record** — carry every load-bearing detail (repro steps especially) into it; a temp</code> |
| L62 | kept | Body L62; unchanged | <code>     `BUG-&lt;slug&gt;.md`, if one was written, is never committed (STANDARD §2) and nothing points back at it.</code> |
| L63 | kept | Body L63; unchanged | <code>4. **Re-rank** — re-evaluate each task's `priority:` (P0–P3, by impact × urgency); propose moves with a one-line reason each. Sequence is then **derived** (§ Order), never hand-set.</code> |
| L64 | kept | Body L64; unchanged | <code>5. **Flag** — surface **stale** (no movement / superseded), **duplicate** (same concern → merge or differentiate), **conflict** (acceptance criteria that contradict another task).</code> |
| L65 | kept | Body L65; unchanged | <code>6. **State** — set `state:` `ready` / `needs-info` / `blocked`; for `needs-info` list the specific questions as `- **open:**` lines under `## Assumes`; for `blocked` name the blocker in `depends-on:` (a task) or a `- **blocked-by:**` line (anything else).</code> |
| L66 | kept | Body L66; unchanged | <code>   A bug does not move to `ready` without that cited `Negative:` box (step 3); until it has one it is `needs-info` with that `open:` line. A bug already `ready` is not demoted for lacking one.</code> |
| L67 | kept | Body L67; reference read added before writing; original rule unchanged | <code>7. **Route rejects** — for work that will not be done, write an `.out-of-scope/` entry, then move the task file `backlog/ → cancel/` — `git mv` in the git case, a plain move with no git (§ Applying). A merged duplicate goes the same way, with a `## Amended &lt;date&gt;` line naming the survivor.</code> |
| L68 | kept | Body L68; unchanged | <code>8. **Output** — the groomed backlog in derived order + a **ready-to-promote shortlist** (that order, `ready` only) + **uncovered epic conditions and roadmap rows**, one line each:</code> |
| L69 | kept | Body L69; unchanged | <code>   `EPIC-NNN · "&lt;condition, ~60 chars&gt;" · uncovered (unmarked &#124; stale: TASK-NNN done/cancelled &#124; missing: TASK-NNN)`; a row: `roadmap · P2a · "&lt;outcome, ~60 chars&gt;" · uncovered (… &#124; stale: EPIC-NNN not active)`.</code> |
| L70 | kept | Body L70; unchanged | <code>   Close a gap by proposing a task (`/task-decomposer --epic`) or a `→ next slice:` mark — triage never edits the epic or roadmap.</code> |
| L71 | kept | Body L71; unchanged | <code>   Apply changes only after human `y`.</code> |
| L73 | kept | Body L73; unchanged | <code>## Order (derived, never stored)</code> |
| L75 | kept | Body L75; unchanged | <code>Folders cannot sequence, and there is **no order file** — a stored order is a second copy that</code> |
| L76 | kept | Body L76; unchanged | <code>drifts from `priority:`. The backlog's order is computed each time:</code> |
| L78 | kept | Body L78; unchanged | <code>1. **`priority:`** — P0 before P3.</code> |
| L79 | kept | Body L79; unchanged | <code>2. **Topological over `depends-on:`** — a task never precedes a blocker still in the backlog. A</code> |
| L80 | kept | Body L80; unchanged | <code>   lower-priority blocker is pulled forward: it sorts at the highest priority of anything waiting on</code> |
| L81 | kept | Body L81; unchanged | <code>   it, directly or transitively (its own `priority:` is not rewritten). A dependency in</code> |
| L82 | kept | Body L82; unchanged | <code>   `done/` or `cancel/` is satisfied; one in `todo/`–`review/` is in flight (the task stays `blocked`).</code> |
| L83 | kept | Body L83; unchanged | <code>3. **Task id** — numeric, as the final tie-break (`TASK-99` before `TASK-100`).</code> |
| L85 | kept | Body L85; unchanged | <code>A `depends-on` cycle is a finding — report its ids; never break it silently.</code> |
| L87 | kept | Body L87; unchanged | <code>## Applying (after `y`)</code> |
| L89 | kept | Body L89; unchanged | <code>- **Priority / state** — edit those two lines in place, and add or remove only the `open:` /</code> |
| L90 | kept | Body L90; unchanged | <code>  `blocked-by:` lines under `## Assumes`; every other line stays byte-identical (`authority:` ·</code> |
| L91 | kept | Body L91; unchanged | <code>  `origin:` · existing assumptions · the done-when are not triage's to rewrite).</code> |
| L92 | kept | Body L92; unchanged | <code>- **Cancel** — `git mv docs/work/backlog/&lt;file&gt; docs/work/cancel/` in its **own commit** (no git: a plain</code> |
| L93 | kept | Body L93; unchanged | <code>  move); any content edit (the `## Amended` note) lands in a separate commit before it (with no git: it is made before the move). A status change</code> |
| L94 | kept | Body L94; unchanged | <code>  never shares a commit with a content edit. Its commit messages pass through `/humanizer` embedded mode, format `plain`, unless the entire message is a fixed template (→ the humanizer skill's `references/embedded.md` § Commit messages and PR bodies).</code> |
| L96 | deleted | Redundant heading; same topic survives in references/out-of-scope.md L1; branch pointers at Body L47/L67 | <code>## `.out-of-scope/` knowledge base</code> |
| L98 | moved | references/out-of-scope.md L3; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>Rejected enhancements are remembered, not forgotten — so they are not re-litigated next quarter.</code> |
| L99 | moved | references/out-of-scope.md L4; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>Create lazily (only on the first rejection). **One file per *concept*, not per task** — repeat</code> |
| L100 | moved | references/out-of-scope.md L5; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>requests for the same thing accumulate under one file's `prior-requests` list.</code> |
| L102 | moved | references/out-of-scope.md L7; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>```</code> |
| L103 | moved | references/out-of-scope.md L8; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>.out-of-scope/&lt;concept-slug&gt;.md</code> |
| L104 | moved | references/out-of-scope.md L9; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code># &lt;Concept name&gt;</code> |
| L105 | moved | references/out-of-scope.md L10; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>- date: YYYY-MM-DD</code> |
| L106 | moved | references/out-of-scope.md L11; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>- decision: out of scope</code> |
| L107 | moved | references/out-of-scope.md L12; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>- reason: &lt;durable why — project scope/philosophy · technical constraint · strategic choice&gt;</code> |
| L108 | moved | references/out-of-scope.md L13; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>- revisit-if: &lt;the condition that would change the answer, or "—"&gt;</code> |
| L109 | moved | references/out-of-scope.md L14; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>- prior-requests: TASK-012, TASK-031, …</code> |
| L110 | moved | references/out-of-scope.md L15; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>```</code> |
| L112 | moved | references/out-of-scope.md L17; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>- **Durable reason, not a deferral** — "we're too busy right now" is a deferral, not a rejection; don't file it. The reason must still hold next year.</code> |
| L113 | moved | references/out-of-scope.md L18; Body L47/L67 branch pointers (quoted above): Flow 1 before scanning; Flow 7 before writing | <code>- **Match by concept, not keyword** — "night theme" matches `dark-mode.md`. On a match, surface it: *"resembles `.out-of-scope/&lt;x&gt;.md`, rejected because … — still true?"* → **confirm** (append to `prior-requests`, move the task to `cancel/` — `git mv`, or a plain move with no git) · **reconsider** (delete the file, task proceeds) · **disagree** (related but distinct, task proceeds).</code> |
| L115 | kept | Body L96; unchanged | <code>## Hard rules</code> |
| L117 | kept | Body L98; unchanged | <code>- **Backlog only** — never re-order, re-state or move a file in `todo/` · `in_progress/` · `review/` (a sprint in flight is locked). Active epics and the roadmap are read, never written.</code> |
| L118 | kept | Body L99; unchanged | <code>- **Readiness is a field** — `state:` changes are frontmatter edits; the only move triage makes is `backlog/ → cancel/`.</code> |
| L119 | kept | Body L100; unchanged | <code>- **No order file** — order is derived (§ Order); never write a sequence anywhere.</code> |
| L120 | kept | Body L101; unchanged | <code>- **HITL** — propose re-ranks, state changes, merges, and rejections; apply only after `y`. **Unattended** (headless): the `y` can never arrive — there is no ask channel at all (`AskUserQuestion` unregistered; `dontAsk` auto-denies). Emit the proposal and **park** it (`night-run.md` Part 0); a missing `y` is a no, never a yes.</code> |
| L121 | kept | Body L102; unchanged | <code>- **Never silently delete** — a removed task is moved to `cancel/` (`git mv`, or a plain move with no git; never `rm`), with an `.out-of-scope/` entry or a merge note. No task vanishes without a trail.</code> |
| L122 | kept | Body L103; unchanged | <code>- **Don't re-decompose** — triage grooms existing tasks; new tasks come from `/task-decomposer`.</code> |
| L124 | kept | Body L105; unchanged | <code>## Red flags</code> |
| L126 | kept | Body L107; unchanged | <code>❌ **Re-prioritising the Active Sprint** — a sprint is locked; grooming is a Backlog activity.</code> |
| L127 | kept | Body L108; unchanged | <code>❌ **Moving a file to say it is blocked** — readiness is `state:`; a folder is status only.</code> |
| L128 | kept | Body L109; unchanged | <code>❌ **Hand-ordering the backlog** — a written order drifts from `priority:`; derive it.</code> |
| L129 | kept | Body L110; unchanged | <code>❌ **Deleting a task with no trail** — route to `.out-of-scope/` or merge with a note.</code> |
| L130 | kept | Body L111; unchanged | <code>❌ **Promoting a `needs-info` / `blocked` task** — only `ready` work is promotable.</code> |
| L131 | kept | Body L112; unchanged | <code>❌ **Re-ranking without a reason** — every priority move carries a one-line justification.</code> |
| L132 | kept | Body L113; unchanged | <code>❌ **Ignoring `.out-of-scope/`** — re-litigates settled rejections; always scan it first.</code> |

## Routes R3 and R4 — new rejection / matched prior rejection (moved procedure)

Cwds: D:/Research/s184-evals/t8/reject-before, reject-after, match-before and match-after.
All four start as copies of the actual docs/work/backlog/ at commit 3aacd3ebed802905c3b1342d68295678b96711a1:

~~~text
TASK-402-measure-epic-017-completeness-at-the-next-real-epic-decomposition.md
TASK-489-decide-workdoo-s-lean-flow-pin.md
TASK-507-cross-os-ci-matrix.md
TASK-523-behaviour-test-cases-for-stage-skill-boundaries.md
TASK-668-re-measure-lane-token-cost-on-the-next-real-multi-lane-run.md
~~~

Preserve these under docs/work/backlog/. Also copy docs/work/README.md from the same commit and create
empty docs/work/{todo,in_progress,review,done,cancel}/. There is no git metadata, TODO.md, TECH-DEBT.md,
epic, roadmap or host instruction file. Missing optional sources are reported, not invented.
No local settings or secrets. Each arm starts fresh, not from the other run's output.

### R3 — new rejection

No .out-of-scope/ directory initially. Exact prompt:

> Use /lean-flow:triage on TASK-507 in this disposable copy of the backlog. For this proposal, the project's durable scope is hosted CI on Linux only; Windows remains a local maintainer check and hosted macOS/Windows jobs are outside the supported product. Revisit only if the owner explicitly expands the supported CI platforms. Propose rejecting TASK-507 on that scope boundary and show the candidate rejection record and resulting backlog action in the report. This is not a temporary capacity deferral. I have not supplied y; do not apply changes.

Compare: scan prior rejections first; read real task; durable reason and revisit condition;
lazy .out-of-scope/<concept-slug>.md proposal, one record per concept, prior-requests includes TASK-507;
proposed backlog to cancel move rather than deletion; proposal/park at absent y; cwd unchanged.
AFTER must Read skills/triage/references/out-of-scope.md before proposing the record.

### R4 — matched prior rejection

Same starting files, plus .out-of-scope/hosted-platform-matrix.md containing exactly:

~~~markdown
# Hosted platform matrix
- date: 2026-11-20
- decision: out of scope
- reason: Hosted CI supports Linux only; Windows is a local maintainer check and other hosted platforms are outside the product scope.
- revisit-if: The owner explicitly expands supported hosted CI platforms.
- prior-requests: TASK-031
~~~

Exact prompt:

> Use /lean-flow:triage to review whether TASK-507 should remain in this disposable backlog, taking the existing out-of-scope decisions into account. Explain the available choices and their effects before making changes. I have not supplied y or decided whether the earlier rejection still applies.

Compare: concept match despite different filename/title; surface earlier reason and ask whether still true.
Confirm means append TASK-507 to the same prior-requests list and move to cancel; reconsider removes the
concept record and proceeds; disagree retains the record and proceeds separately. No choice is silently
made; proposal/park at absent y; all files unchanged. AFTER must Read the new reference before describing
these effects. These are the two moved branches, not approval to add paid follow-up/application routes.
The original Flow 7 move/merge text remains intact after its new pointer; Applying and hard rules remain byte-identical in the body.

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

