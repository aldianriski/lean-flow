# TASK-691 — prime pre-trim instruction inventory

Written before editing any of the three bodies. Source: skills/prime/SKILL.md at commit 3aacd3ebed802905c3b1342d68295678b96711a1, git blob 440c1f94d4d8f58dcfe4b61cba1cf4fd1da160e1.

Basis: UTF-8 body immediately after closing frontmatter and its newline, including next blank and final newline; CRLF → LF, no trim (TASK-690). Frontmatter is unchanged.

Pre-trim body SHA-256: 6af16135e8919b1651c353aa6e2243b837eeb30a7dfed5aaddc6f6e125b9a85a.

Before: 10557 body bytes / 140 total file lines. Planned after: 9764 body bytes (target ≤ 9764) / 131 total file lines.

Planned body SHA-256: ce3166ec6a4d29c8c6c0b77a0e6fe8b31b441b6db7aee564ad5efed46cccf050. Actual measurements and checks are recorded in checks.md after verification.

## Bounded edit and safety argument

- README fallback: 475 → 156 bytes; saves 319.
- Handoff status: 639 → 420 bytes; saves 219.
- freshness explanation: 408 → 153 bytes; saves 255.

All instructions stay in the body. Only three census paragraphs shorten. Handoff text is wrapped by replacing spaces with newlines (same bytes), avoiding a new dense line. No reference is created. The README condition remains missing CLAUDE OR missing CONTEXT; both handoff sources, latest selection, ownership, states and transition writers remain explicit. Pinned strings, freshness comparison rows and output rules are unchanged.

## Complete line inventory

Before numbers are PRE-TRIM whole-file coordinates (body starts L9); body destinations are POST-TRIM whole-file coordinates. Every nonblank body line appears once, including scaffolding, tables, fences and examples: a superset of behavioral lines. Blank separators carry no behavior and are excluded. Entities only escape the exact source text for display.

Rows: 108; kept 108, moved 0, deleted 0. Kept-shortened lines map to their surviving body paragraph; no instruction moves out.

| Before line | Disposition | Surviving line / reference / branch pointer | Exact pre-trim source line |
|---|---|---|---|
| L10 | kept | Body L10; unchanged | <code># prime</code> |
| L12 | kept | Body L12; unchanged | <code>Ordered presence/status check + next step. One-shot session priming. Read-only — never writes.</code> |
| L14 | kept | Body L14; unchanged | <code>## When to invoke</code> |
| L16 | kept | Body L16; unchanged | <code>- First action of a fresh session, before any code-touching work.</code> |
| L17 | kept | Body L17; unchanged | <code>- After `/clear` to reload context without restarting.</code> |
| L18 | kept | Body L18; unchanged | <code>- When the session feels stale and you want to confirm what state you are operating against.</code> |
| L20 | kept | Body L20; unchanged | <code>## Check order</code> |
| L22 | kept | Body L22; unchanged | <code>Check each slot in order; read only as specified below. `[OK]` means found; slots 1, 2 and 4 are also loaded. All are optional —</code> |
| L23 | kept | Body L23; unchanged | <code>absence is reported, never fatal. Canonical placement (STANDARD §2) is listed first; legacy</code> |
| L24 | kept | Body L24; unchanged | <code>locations second. Adapt the globs to the host project's layout.</code> |
| L26 | kept | Body L26; unchanged | <code>&#124; # &#124; Path (first match wins) &#124; Purpose &#124;</code> |
| L27 | kept | Body L27; unchanged | <code>&#124;---&#124;---&#124;---&#124;</code> |
| L28 | kept | Body L28; unchanged | <code>&#124; 1 &#124; `.claude/CLAUDE.md`, `CLAUDE.md` &#124; Read project instructions unless already loaded by the host &#124;</code> |
| L29 | kept | Body L29; unchanged | <code>&#124; 2 &#124; `.claude/CONTEXT.md`, `CONTEXT.md` &#124; Read in full: vocabulary · gates · sprint rules · modes, which every stage obeys (if the project uses one) &#124;</code> |
| L30 | kept | Body L30; unchanged | <code>&#124; 3 &#124; `README.md` — *presence-check by default* &#124; Front-door (humans); overlaps 1·2·6 → **full read deferred** (note below) &#124;</code> |
| L31 | kept | Body L31; unchanged | <code>&#124; 4 &#124; MEMORY index (harness-resolved; fallback: `memory/MEMORY.md`, `.claude/memory/MEMORY.md`) &#124; Read the index for sprint state, feedback, references &#124;</code> |
| L32 | kept | Body L32; unchanged | <code>&#124; 5 &#124; `docs/work/`, `TECH-DEBT.md`, `docs/sprint/SPRINT-*.md` &#124; Work-item store (incl. `type:`) + debt ledger — frontmatter + open `- [ ]` items only &#124;</code> |
| L33 | kept | Body L33; unchanged | <code>&#124; 6 &#124; `docs/architecture/overview.md`, `docs/ARCHITECTURE.md`, `ARCHITECTURE.md` &#124; Presence + narrow `## Stack` heading search only; defer the module map &#124;</code> |
| L34 | kept | Body L34; unchanged | <code>&#124; 7 &#124; active `docs/epic/EPIC-*.md` (not `archive/`) § Closed when · `docs/product/roadmap.md` (or `docs/roadmap.md`) Delivery-sequence rows &#124; Coverage count (below) &#124;</code> |
| L36 | kept | Body L36 README fallback paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>**README is a fallback (token discipline).** It is the human front-door and overlaps CLAUDE.md (1) +</code> |
| L37 | kept | Body L36 README fallback paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>CONTEXT.md (2) + ARCHITECTURE.md (6). Stat its presence for the health line, but **read its full</code> |
| L38 | kept | Body L36 README fallback paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>content only when CLAUDE.md *or* CONTEXT.md is MISSING** (then it is the best available overview).</code> |
| L39 | kept | Body L36 README fallback paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>Why: when both instruction/context files exist, this health report needs no additional overview;</code> |
| L40 | kept | Body L36 README fallback paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>stages read the facts they need themselves, even when invoked without `/prime`.</code> |
| L42 | kept | Body L38; unchanged | <code>**Resolution** (v2 store): backlog = `docs/work/backlog/`. Active sprint = each `docs/sprint/SPRINT-NNN-&lt;slug&gt;.md`</code> |
| L43 | kept | Body L39; unchanged | <code>with `status: active` (a multi-stream repo has one per stream) — read only its frontmatter + `## Members`. Open bugs = `type: bug` items outside `done/`·`cancel/`, oldest = lowest id.</code> |
| L44 | kept | Body L40; unchanged | <code>Open DoD = count of `- [ ]` lines under `## Done when` in each member's task file — found **by id**</code> |
| L45 | kept | Body L41; unchanged | <code>(`docs/work/**/TASK-NNN-*.md`), never by the listed path, which goes stale once a member moves folder — summed per active</code> |
| L46 | kept | Body L42; unchanged | <code>sprint (report per stream when more than one, e.g. `Tasks: 5 open (main: 3 · payments: 2)`); no active</code> |
| L47 | kept | Body L43; unchanged | <code>sprint → fall back to the backlog.</code> |
| L48 | kept | Body L44; unchanged | <code>`TODO.md` present and no `docs/work/` → v1 · both present → mixed · only `docs/work/` → v2 (existence only, never content).</code> |
| L49 | kept | Body L45; unchanged | <code>**On v1 or mixed** — prime reports the `Layout:` row `v1 layout → run /lean-doc-generator migrate`, skips the task count, and continues; it never aborts.</code> |
| L50 | kept | Body L46; unchanged | <code>**Coverage (read-only count):** an open `- [ ]` § Closed-when item of a `status: active` epic, and a roadmap row with `Status: active`,</code> |
| L51 | kept | Body L47; unchanged | <code>is **covered** when its mark names `next slice:`, an open task (outside `done/` · `cancel/`), or (rows) an active `EPIC-NNN`; else</code> |
| L52 | kept | Body L48; unchanged | <code>**uncovered**. Count both; `proposed` epics and `planned`/`done` rows exempt. Procedure → `lean-doc-generator/references/epic-coverage.md`.</code> |
| L53 | kept | Body L49; unchanged | <code>**Resuming from a `/handoff`?** Also read the handoff doc at the temp path it printed. When its **Uncertain writes** item names one, the `Handoff:` row adds `· uncertain write: &lt;target&gt; → reconcile first` (the row is emitted for this even when no repo-side `handoff` entry exists) and `Next:` leads with reading that target back before any retry (a timeout is not a failure); `none` adds nothing.</code> |
| L55 | kept | Body L51 Handoff status paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>**Handoff status (read-only report, SPRINT-094 T2)** — an active sprint's Execution Log and root</code> |
| L56 | kept | Body L51 Handoff status paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>`HANDOFF-LEDGER.md` may each carry a `handoff` entry: a handoff is the sprint's own when the session's focus</code> |
| L57 | kept | Body L51 Handoff status paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>names a member task of that sprint; any other is a side handoff, in the ledger. Report the LATEST such entry's</code> |
| L58 | kept | Body L51 Handoff status paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>`handoff-status:` from each — `live` (not yet resumed), `consumed` (resumed, still open), or none outstanding.</code> |
| L59 | kept | Body L51 Handoff status paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>Never write it (`/handoff`'s and `/lean-doc-generator close`'s job, not this one's) — priming only surfaces what</code> |
| L60 | kept | Body L51 Handoff status paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>a reader would otherwise have to open the temp file, or have been in the session, to know.</code> |
| L62 | kept | Body L56; unchanged | <code>## Skill freshness — a report, not a gate</code> |
| L64 | kept | Body L58 freshness explanation paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>A live session keeps whatever installed copy of a plugin it started with, so a skill edited but not</code> |
| L65 | kept | Body L58 freshness explanation paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>reinstalled keeps running its **old** procedure — no error, and a diff that reads as if the change was</code> |
| L66 | kept | Body L58 freshness explanation paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>simply ignored. The fact is never hidden: every skill invocation prints its own base directory, and</code> |
| L67 | kept | Body L58 freshness explanation paragraph; shortened in place, still loaded (narrative expressed by that same paragraph) | <code>that path carries the installed version (`…/&lt;plugin&gt;/&lt;version&gt;/skills/prime`). It just goes unread.</code> |
| L69 | kept | Body L60; unchanged | <code>Compare that version against the host repo's plugin manifest (`.claude-plugin/plugin.json`, first</code> |
| L70 | kept | Body L61; unchanged | <code>match; a project that vendors its own plugin may place it elsewhere — adapt the glob):</code> |
| L72 | kept | Body L63; unchanged | <code>&#124; Condition &#124; Row &#124;</code> |
| L73 | kept | Body L64; unchanged | <code>&#124;---&#124;---&#124;</code> |
| L74 | kept | Body L65; unchanged | <code>&#124; base dir has no `&lt;version&gt;/` segment (ends `…/skills/prime` — `--plugin-dir &lt;repo&gt;`, a live checkout) &#124; `&lt;v&gt; live checkout → fresh` — read `&lt;base-dir&gt;/../../.claude-plugin/plugin.json`; no separate installed copy exists, so it cannot be stale &#124;</code> |
| L75 | kept | Body L66; unchanged | <code>&#124; versions equal &#124; `&lt;v&gt; base-dir == &lt;v&gt; repo → fresh` &#124;</code> |
| L76 | kept | Body L67; unchanged | <code>&#124; versions differ &#124; `&lt;installed&gt; base-dir != &lt;repo&gt; repo → STALE, reinstall before trusting any procedure` &#124;</code> |
| L77 | kept | Body L68; unchanged | <code>&#124; no manifest — the ordinary consumer, who never checked the plugin out &#124; `n/a (no local plugin repo)` &#124;</code> |
| L79 | kept | Body L70; unchanged | <code>**Never block on it.** Priming is read-only and reports; whether a stale procedure is acceptable is the</code> |
| L80 | kept | Body L71; unchanged | <code>session's call. One row covers every skill (one version-scoped root). Out of scope: a skill edited</code> |
| L81 | kept | Body L72; unchanged | <code>*without* a version bump still reads `fresh` — only the version string is compared.</code> |
| L83 | kept | Body L74; unchanged | <code>## Steps</code> |
| L85 | kept | Body L76; unchanged | <code>1. Check each slot in order; track found/missing. Read slot 2 in full. Never full-read the architecture map for priming; use Grep for the slot-6 `^## Stack\b` heading check.</code> |
| L86 | kept | Body L77; unchanged | <code>2. From the active task list, count open `- [ ]` tasks — skipped on v1/mixed (§ Resolution layout check).</code> |
| L87 | kept | Body L78; unchanged | <code>3. Compare the base-dir version against the plugin manifest — or, with no version segment, the live-checkout row (above).</code> |
| L88 | kept | Body L79; unchanged | <code>4. Read the LATEST `handoff` entry (§ Handoff status) — report only, never write.</code> |
| L89 | kept | Body L80; unchanged | <code>5. Emit the health report (below) — health check ONLY, no inline file summaries. Its first line — the banner itself — carries the **verdict** (ready · stale · blocked, why in one clause) and the next step, so the reader has both before reading a row.</code> |
| L90 | kept | Body L81; unchanged | <code>6. Emit one `Next:` line:</code> |
| L91 | kept | Body L82; unchanged | <code>   - open tasks exist → `/orchestrator` to continue — and when those tasks sit in an **active</code> |
| L92 | kept | Body L83; unchanged | <code>     sprint** with ≥1 open member `autonomy: AFK` at authority `J0`/`J1`, name `/orchestrator</code> |
| L93 | kept | Body L84; unchanged | <code>     sprint-bulk unattended` too (a night run executing the promoted Plan). An all-HITL/J2 sprint gets</code> |
| L94 | kept | Body L85; unchanged | <code>     `/orchestrator` alone: an unattended run would park every J2 task and end at AUTHORITY_BOUNDARY</code> |
| L95 | kept | Body L86; unchanged | <code>     having done nothing. **Naming it is the whole job:** priming never launches anything; the mode is</code> |
| L96 | kept | Body L87; unchanged | <code>     declared at the trigger, and the run is gated by its own pre-flight (`orchestrator/references/night-run.md`)</code> |
| L97 | kept | Body L88; unchanged | <code>   - no open tasks but the backlog has `state: ready` tasks → `/lean-doc-generator` to promote / close</code> |
| L98 | kept | Body L89; unchanged | <code>   - backlog exists but nothing is `state: ready` (blocked/needs-info/ungroomed) → `/triage` to groom</code> |
| L99 | kept | Body L90; unchanged | <code>   - uncovered epic conditions or roadmap rows &gt; 0 → also name `/triage` (it lists them)</code> |
| L100 | kept | Body L91; unchanged | <code>   - **unprofiled** (slots already checked, never a new file: none of slots 1·2·6 exists → `/lean-doc-generator init`; else the heading search finds no `## Stack` in slot 6, or no slot-6 file → `migrate`) → with work tracked, also name that command;</code> |
| L101 | kept | Body L92; unchanged | <code>     with nothing tracked, it is the `Next:` instead of `/task-decomposer`. Name it, never run it; on a v1/mixed layout skip this bullet and the next (the `Layout:` row's migrate is the `Next:`)</code> |
| L102 | kept | Body L93; unchanged | <code>   - nothing tracked yet, profiled → `/task-decomposer "&lt;intent&gt;"`</code> |
| L104 | kept | Body L95; unchanged | <code>## Output format</code> |
| L106 | kept | Body L97; unchanged | <code>```</code> |
| L107 | kept | Body L98; unchanged | <code>=== PRIME HEALTH: ready — sources found; continue the active sprint with /orchestrator ===</code> |
| L108 | kept | Body L99; unchanged | <code>[OK]      CLAUDE.md</code> |
| L109 | kept | Body L100; unchanged | <code>[OK]      CONTEXT.md</code> |
| L110 | kept | Body L101; unchanged | <code>[OK]      README.md</code> |
| L111 | kept | Body L102; unchanged | <code>[MISSING] MEMORY index</code> |
| L112 | kept | Body L103; unchanged | <code>[OK]      docs/work/</code> |
| L113 | kept | Body L104; unchanged | <code>[OK]      ARCHITECTURE.md</code> |
| L114 | kept | Body L105; unchanged | <code>Skills:   1.22.0 base-dir == 1.22.0 repo → fresh</code> |
| L115 | kept | Body L106; unchanged | <code>Tasks:    3 open · bugs: 1 open (oldest TASK-NNN)</code> |
| L116 | kept | Body L107; unchanged | <code>Coverage: 2 uncovered (EPIC-015 ×1 · roadmap P2a) → /triage</code> |
| L117 | kept | Body L108; unchanged | <code>Handoff:  live -- docs/sprint/logs/SPRINT-NNN-&lt;slug&gt;.md (not yet resumed)</code> |
| L118 | kept | Body L109; unchanged | <code>Next:     /orchestrator — continue the 3 open tasks (or `sprint-bulk unattended` for a night run — only if an open AFK J0/J1 member exists)</code> |
| L119 | kept | Body L110; unchanged | <code>```</code> |
| L121 | kept | Body L112; unchanged | <code>The `Handoff:` row is omitted only when no `handoff` entry exists anywhere reachable (neither an active</code> |
| L122 | kept | Body L113; unchanged | <code>sprint's Log nor a `HANDOFF-LEDGER.md` carries one) — otherwise report it, including `none outstanding`, so its</code> |
| L123 | kept | Body L114; unchanged | <code>absence is never mistaken for "nothing was ever taken."</code> |
| L125 | kept | Body L116; unchanged | <code>The `Coverage:` row is omitted only when there is neither an active epic nor a roadmap; otherwise it reports the count, `0 uncovered` included. Prime never edits either.</code> |
| L127 | kept | Body L118; unchanged | <code>The `Skills:` row is omitted only when it would be meaningless — no manifest **and** no version in the</code> |
| L128 | kept | Body L119; unchanged | <code>base dir; otherwise report it, including `n/a`, so its absence is never mistaken for a pass.</code> |
| L130 | kept | Body L121; unchanged | <code>## Red flags</code> |
| L132 | kept | Body L123; unchanged | <code>❌ **Reading files outside the declared slots** (beyond a referenced handoff, the plugin manifest the</code> |
| L133 | kept | Body L124; unchanged | <code>   freshness row compares against, and the Execution Log / `HANDOFF-LEDGER.md` the Handoff row reads, and the active epics' § Closed when / the roadmap the Coverage row reads)</code> |
| L134 | kept | Body L125; unchanged | <code>   — adds noise; not this skill's job.</code> |
| L135 | kept | Body L126; unchanged | <code>❌ **Aborting on a missing file** — everything is optional; `[MISSING]` is the correct response.</code> |
| L136 | kept | Body L127; unchanged | <code>❌ **Treating presence as loaded context** — emit the health check only; each downstream stage reads its own required sources, including when invoked without `/prime`.</code> |
| L137 | kept | Body L128; unchanged | <code>❌ **Reading a full sprint file** — frontmatter + active section is enough for priming.</code> |
| L138 | kept | Body L129; unchanged | <code>❌ **Running mid-task** — this is for session priming; mid-task use signals context drift.</code> |
| L139 | kept | Body L130; unchanged | <code>❌ **Writing a `handoff-status:` transition** — priming only reports the latest one; `/handoff` and</code> |
| L140 | kept | Body L131; unchanged | <code>   `/lean-doc-generator close` are the only writers.</code> |

## Route R2 — routine prime health report (shortened explanations)

Cwds: D:/Research/s184-evals/t8/prime-before and prime-after. Populate both from the SAME pre-trim
commit 3aacd3ebed802905c3b1342d68295678b96711a1, not the live moving tree. Export exactly these tracked paths:

~~~text
.claude/CLAUDE.md
.claude/CONTEXT.md
README.md
HANDOFF-LEDGER.md
.claude-plugin/plugin.json
TECH-DEBT.md
docs/work/
docs/sprint/
docs/epic/
docs/product/roadmap.md
docs/architecture/overview.md
~~~

Preserve the files and directory structure; no other files, git metadata, local settings or secrets.
This is the repo's real work/context snapshot. No source content changes between arms. The real ledger's
latest entry is spent: report none outstanding rather than the earlier live entry. No resumed temp handoff
is supplied, so the external handoff-path in that ledger is not a request to open it.

Exact prompt:

> Use /lean-flow:prime to start a fresh session in this read-only snapshot of lean-flow. Give the routine health report and next step. Do not change files or launch work.

Compare: presence slots in order; CLAUDE/CONTEXT loaded; README presence only while both exist;
architecture only a narrow Stack search; membership resolved by id and same open-DoD count;
latest handoff status from each available source; Skills live-checkout row, Coverage, one Next line;
no writes, launch or fatal missing-file gate. Both plugin arms have no version directory and the same
manifest version. No text moves into a reference. Freshness table, optional-file behavior, README
fallback condition, Handoff row omission and all hard rules stay in the body.
This routine route is the census proof for the bounded prose edits; it does not exhaust every optional
input, cached-version condition or possible handoff state.

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

