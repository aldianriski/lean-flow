---
owner: Maintainer
last_updated: 2026-08-23
update_trigger: The standard's content changes (bump per spec/CHANGELOG.md)
version: 0.7.0
status: current
---

# LEAN DOCUMENTATION STANDARD — Reference

> WHY and WHERE only. Never HOW. This guide is the authority lean-doc-generator loads before
> generating anything. Where a template exists, the **template** is the canonical format — not the
> inline examples here.

---

## §1 — The 4 Laws

| Law | Name | Rule |
|---|---|---|
| LAW 1 | Minimal by Default | No doc created unless its absence causes repeated interruptions or mistakes |
| LAW 2 | Owned, Not Shared | Every doc has exactly one owner *role*; shared = no ownership |
| LAW 3 | Lifecycle-Bound | Every doc has defined create / update / archive triggers |
| LAW 4 | Signal-Dense | Every line carries info not already in code; repeating code = delete |

**Conformance.** Each rule carries the level it belongs to and whether it is checkable. `mechanical` =
a tool can decide it · `judgment-only` = **not checkable in principle**, the standard choosing a human ·
`split` = mechanical on one half, judged on the other · `implementation-directed` = **constrains a tool,
not your repo — never evaluate it against a repository.** Ids are stable across versions; a finding
names one. Legend and the full model → §14.

| Rule | Level | Mark |
|---|---|---|
| `S1.LAW1` | Structural | judgment-only — a counterfactual; nothing observable separates a needed doc from an unneeded one |
| `S1.LAW2` | Structural | mechanical — one `owner:` field, value in a role vocabulary |
| `S1.LAW3` | Structural | split — `update_trigger:` *present* is mechanical; whether it is the *right* trigger is not |
| `S1.LAW4` | Structural | judgment-only — the §5 filter in law form |

---

## §2 — Core Files (TemiDev repo-structure standard — ADR-012)

Every row carries its **full lifecycle contract** (LAW 3): *create* ← the event that brings it into
existence · *update* ← the event that refreshes it (mirrored in its ownership header's
`update_trigger`) · *archive* ← its retention leg (§11; `—` = lives as long as the repo). Tier
gating → §6.

**Root files:**

| File | Reader | Cap | Create ← | Update ← | Archive |
|---|---|---|---|---|---|
| `README.md` | Anyone | no hard cap¹ | init (always) | project scope changes | — |
| `CONTRIBUTING.md` | Contributor | ~100 | init (team ≥ 2, or on request) | branching / commit / review / DoD convention changes | — |
| `CODE_OF_CONDUCT.md` | Anyone | ~120 | init (team ≥ 2, or on request — same gate as CONTRIBUTING; a single-maintainer repo has not met the condition and is not deviating) | the enforcement contact or the policy changes | — |
| `SECURITY.md` | Anyone | ~80 | init (always) | auth model · secret policy · vulnerability-reporting change | — |
| `CHANGELOG.md` | Reviewer | append-only | first release or sprint close (always-core — ADR-012 deviation) | sprint close · release | rotate at new MINOR → `docs/changelog/` (§11) |
| `LICENSE` | Anyone | — | init (license chosen; private → proprietary notice) | license change (rare) | — |
| `AGENTS.md` | AI tools | 12 (ADR-015) | init (lean loop — an AI assistant reads this repo) — **thin pointer to `.claude/CLAUDE.md`, never duplicated instructions** | pointer targets move | — |
| `.env.example` | Dev | — | init **safe-scaffold** (write-if-absent; names only, never values) | a new env var is introduced | — |
| `.gitignore` | git | — | init **safe-scaffold** (write-if-absent; from the §12 boundary rule) | a new generated-artifact class appears | — |
| `TODO.md` | Dev / AI | 320 soft (ADR-019) | init (lean loop — work is tracked in-repo, not in an external issue tracker) | backlog change · sprint promote/close | §11 prune |
| `TECH-DEBT.md` | Dev / AI | open rows only | first TD filed | close files TD · promote ages · debt resolved | §11 delete (3 sprints after resolved) |

**`spec/` — the standard itself, where a repo publishes one:**

| File | Reader | Cap | Create ← | Update ← | Archive |
|---|---|---|---|---|---|
| `spec/STANDARD.md` | Adopter / tool | **no numeric cap** — ruled, see below | the standard is extracted for independent versioning (ADR-023) | a rule is added, amended or reclassified — bump per `spec/CHANGELOG.md` | — |
| `spec/CHANGELOG.md` | Adopter | append-only | with `STANDARD.md` | every version bump | — |

**Why `STANDARD.md` carries no number (ADR-026), stated here so the absence is a ruling and not an
oversight.** Note the `Cap` cell holds **no digits at all**, deliberately: a cap check reads the first
digit run in that cell as the number, so writing `no numeric cap (ADR-026)` would have been parsed as a
cap of **26** and reported a breach on every run. Cite an ADR in the prose, never in a machine-read cell.
Every other row's cap has a working escape: cap-hit → split into a tree (Growth rule below). That escape
is **unavailable to this file**, three ways. Adopters pin it **by path**, so splitting into section files
is a breaking change for every consumer. A cap check that derives its file set from this table expands
a path into a **non-recursive** glob, so splitting into a subdirectory would move the spec *out of the
checker's reach* — the remedy silently un-governing the file the cap was meant to govern. And §14's rule
ids are cross-section, so a split fragments the rule source a tool must read as one document. A cap whose
only escape is unusable can be met **only by squeezing**, which the Growth rule forbids in as many words.
This is the *"cap was never reachable"* case that rule already names: the standard mandates content the
number never budgeted for, and growth here is the standard gaining rules, which is the file doing its
job. **The governor is §14's rule table, not a line count** — if this file bloats, it will be prose
around the rules, and the rule count is what shows it.

**AI context (`.claude/`):**

| File | Reader | Cap | Create ← | Update ← | Archive |
|---|---|---|---|---|---|
| `CLAUDE.md` | AI assistant | 80 | init (lean loop — an AI assistant reads this repo) | project shape / workflow / anti-patterns change | — |
| `CONTEXT.md` | AI assistant | 150 (ADR-017) | init (lean loop — an AI assistant reads this repo) | vocabulary / patterns / conventions change | — |

**Loop rows vs repository-universal rows, stated here so the split is a ruling and not an oversight
(the ADR-026 pattern).** Four rows above — `AGENTS.md`, `TODO.md`, `.claude/CLAUDE.md`,
`.claude/CONTEXT.md` — are the **lean loop's own surface**, not obligations of every repository. Their
`Create ←` cells therefore name their substrate (*an AI assistant reads this repo* · *work is tracked
in-repo*) instead of saying `always`, exactly as §6 gates its substrate-conditional rows: **skipped,
not owed, when the substrate is absent**. A repository that tracks work in GitHub Issues already has a
backlog and does not owe `TODO.md`; one with no AI assistant does not owe an assistant's context files.

**The distinction is machine-readable by construction, not by annotation.** A checker's required set is
derived from the `Create ←` cell itself — the word `always` is the discriminator — so a row moving
between the two populations changes what every tool reports **with no code edit**, and no tool carries
a list of loop files it must be taught to update. That is the same mechanism `--spec` already proves
for §14's Mark column. It is also why the fix for this belongs here rather than in a checker: a checker
that narrows a rule the standard states is deciding a question the standard owns.

**Measured, not assumed.** Against a four-file JS library that never installed lean-flow, `S2.F-FILE`
raised 8 `core-file-missing` findings, **4 of them these rows** — findings the repository's owner could
not act on. Post-ruling the same run raises 4, all actionable. These rows stay fully governed for a
repo that *does* run the loop: their caps are unaffected (a cap is read from the `Cap` cell, not the
`Create ←` cell), and their presence is owed via §6's tier gate once the substrate is detected.

**`docs/` tree** (tier column per §6; legacy lean paths in parentheses stay matched second):

| File | Tier | Reader | Cap | Create ← | Update ← |
|---|---|---|---|---|---|
| `product/requirements.md` | base | Dev / PM | 150 soft | init, or first sanitized PRD lands — **skipped on an existing repo whose AI-context files already ARE the spec** (`CONTEXT.md` carries the behaviour, `CLAUDE.md` the principles + DoD): a third copy is a second SSOT. Greenfield `init` is unaffected — nothing owns the content yet | a requirement is approved / changed (via PR) |
| `product/acceptance-criteria.md` | base | Dev / QA | 120 soft | with requirements | acceptance criteria change |
| `architecture/overview.md` *(was `docs/ARCHITECTURE.md`)* | base | Tech lead | 150 | init (always) | major structural change |
| `architecture/data-flow.md` | backend, or overview cap-split | Dev | 120 | a non-trivial data path exists | that flow changes |
| `architecture/authentication.md` | auth exists | Dev | 120 | auth is introduced | authn/authz architecture changes |
| `architecture/integrations.md` | backend/integration | Dev | 120 | first external integration | an integration is added / changed |
| `architecture/service-registry.md` | multi-service | Dev / ops | 120 | a second deployable service ships | a service is added · retired · renamed |
| `architecture/service-dependencies.md` | multi-service | Dev / ops | 120 | with service-registry | a cross-service call path is added / removed |
| `adr/ADR-NNN-<slug>.md` + `DECISIONS.md` index (both under `docs/`) | medium+ | Team | per file, append-only | a qualifying decision (§4) | new ADR → index row |
| `database/erd.md` (Mermaid) | DB exists | Dev | 120 | the schema's first entities land | a migration changes entities / relations |
| `database/schema.md` | DB exists | Dev | 150 | with erd | a migration lands |
| `database/migration-guide.md` | DB exists | Dev | 100 | first migration | migration / seed process changes |
| `api/openapi.yaml` | API exists | API consumer | — (spec is project-generated; **placement rule only, no template**) | first endpoint ships | an endpoint / contract changes |
| `development/setup.md` *(was `docs/SETUP.md`)* | base | New dev / CI | 100 | init (always) | setup process changes |
| `development/coding-standards.md` | base | Dev | 120 | init | a convention is adopted / changed (mirror what config enforces — `.editorconfig` etc. — don't duplicate it) |
| `testing/testing-guide.md` | base | Dev | 100 | a test harness exists | strategy · harness · coverage rule changes |
| `deployment/deployment-guide.md` *(was `docs/DEPLOY.md`)* | base | Dev / ops | 100 | a deploy target exists | deploy flow · environment matrix changes |
| `deployment/rollback-guide.md` | base | Dev / ops | 80 | with deployment-guide | rollback process changes |
| `flows/<slug>.md` (Mermaid) | medium+ | Dev | 100 each | a flow needs shared understanding | that flow changes |
| `epic/EPIC-NNN-<slug>.md` + `epic/INDEX.md` (created lazily) | lean loop | Team / AI | 200 soft | a **multi-sprint** outcome is named — one sprint's worth of work is a sprint, and an unnameable destination is fog (`--fog`) until it isn't | a member sprint closes, or a decision changes the outcome |
| `sprint/SPRINT-NNN-<slug>.md` | lean loop | AI mid-sprint | 400 hard | promote | DoD ticks · Files Changed · Retro during sprint (Plan frozen at promote) → §11 archive |
| `sprint/logs/SPRINT-NNN-<slug>.md` | lean loop | AI mid-sprint | append-only | lazily, at the first Execution Log entry | every Execution Log entry → §11 archive with its sprint. **Must live in the `logs/` subdirectory**: the sprint-file checks glob `docs/sprint/SPRINT-*.md`, which is non-recursive, so a sibling here is excluded for free while a same-directory `-log.md` suffix would be capped at 400 and schema-checked as a Plan (ADR-014) |
| `LEARNINGS.md` | lean loop | Team / AI | append-only | first confirmed learning | close confirms · promote collapses (§11) |
| `research/<slug>.md` | as needed | Team / AI | 130 soft (ADR-020) | a decision-driving question | question revisited · verdict changes; a verdict a decision has been built on is marked `status: superseded` rather than edited → §11 archive once nothing live cites it. **`status: superseded` ⇒ FROZEN, and the cap does not apply** (ADR-020): the only content that can still legally grow on a spent verdict is the annotation recording *why* it is spent, so a cap here measures the supersession trail and asks you to delete it. It exits via §11 archive, never via a diet |
| `research/logs/<slug>.md` | as needed | Team / AI | append-only | a research question accretes a **second measurement round** — created lazily, never pre-created (**placement rule only, no template**: it is the decision doc's appendix — carry the same frontmatter with `id: <slug>-log` and `status: active`, then append one `## Round N — <question> (<source>, <date>)` section per measurement) | every round appended → §11 archive with its decision doc. **Must live in the `logs/` subdirectory**: the cap check derives its glob from this table's File cell and `docs/research/*.md` is non-recursive, so a sibling here is excluded for free while a same-directory `-log.md` suffix would be capped at 120 and schema-checked as a decision doc (the ADR-014 mechanism, applied to research — SPRINT-062 T1). **Never a `related:` id** — the index globs `docs/research/*.md` non-recursively too, so naming it would dangle the corpus-ref check; link it from the body |
| `BUG-<slug>.md` | ephemeral | Anyone | lean | a defect is reported — **written to the OS temp dir, never committed** (see the temp-dir note below) | routed away at `/triage`; the file is intake scaffolding, so once its content lands in a `TASK-NNN` / `TD-NNN` / `/diagnose` run there is nothing to retain and no §11 row to reach |

Templates resolve under `${CLAUDE_SKILL_DIR}/templates/`; tree docs use a flattened name
(`architecture-overview.md.template` · `database-erd.md.template` · …).

**Placement is canonical.** Root keeps the daily working files + the TemiDev root set above;
AI-context lives in `.claude/`; everything else lives under the `docs/` tree. Generation targets
these paths; `/prime` searches them first (**legacy locations — `docs/ARCHITECTURE.md` ·
`docs/SETUP.md` · `docs/DEPLOY.md` · `docs/CHANGELOG.md` — still matched, second**); `migrate`
relocates a legacy layout (`git mv` + inbound-link fixes — content untouched).

**Growth rule (cap-hit → split, never squeeze).** A core file at its cap **splits into its canonical
tree**: `architecture/overview.md` spawns `data-flow.md` / `authentication.md` / `integrations.md`
(overview keeps the map + links); `development/setup.md` can spawn per-platform pages;
`deployment-guide.md` spawns the environment matrix. Move whole sections; never compress signal away
to stay under a cap, and never raise the cap to fit content (§7 — a cap moves only by ADR, diet first).

**A figure a checker reads is exact — and a breach that resists every honest fix means the number is
wrong, not the file** (L-106, promoted SPRINT-062 T1; three sightings). Writing a cap as `~10` or
`120 soft` buys the appearance of judgement and defers the decision onto whoever next trips it: the
check compares `actual <= cap` as integers, and `soft` changes only whether a breach FAILs or merely
reports, never the arithmetic. So before trimming anything, sort the breach into one of two kinds —
they need opposite actions, and the report cannot tell them apart:

- **Drift** — removable content accreted past a cap that was always reachable. Trim, or split per the
  growth rule above.
- **The cap was never reachable.** Either the standard *mandates* content the number never budgeted
  for (`AGENTS.md` at 11 against `~10`: nine lines plus the two-line ownership footer §3 requires), or
  the doc's growth is an **append-only series** whose rounds are the whole point (`qa-gate-timing.md`
  at 223 against `120 soft`: three measurement rounds). Neither can be trimmed without deleting what
  the file exists to say. Fix the *number* — restate it exactly by ADR — or split the series into a
  `logs/` sibling so the cap lands on the decision and never on the series (ADR-014's mechanism; the
  `research/logs/` row above is its first application outside `docs/sprint/`).

The tell is that every route back under the cap runs through deleting signal or re-wrapping prose —
same words, fewer physical lines, number green, document unchanged. When that is the only route, stop
and rule the number. Approximate a figure a human reads; state a real one wherever a checker can reach it.
Ledgers (§11) compress; **knowledge docs split**.

**LAW 1, reinterpreted (ADR-012).** The mandatory minimum above is scaffolded at **init** — with
real content prompts, never empty shells; beyond the minimum, create-lazily still governs (no doc
until its absence causes repeated interruptions). Minimal stays the floor *per doc* (LAW 4), not a
ceiling on the doc *set*.

**Temp-dir artifacts** (council verdicts, handoff docs, **`BUG-<slug>.md` reports**, and the
**working feature PRD** `/task-decomposer` synthesizes) are never referenced from durable docs — copy
to `docs/research/` (verdicts) before citing. They are intake or hand-off scaffolding: their substance
moves into a durable artifact (a `TASK-NNN` · `TD-NNN` · a regression test · `docs/product/requirements.md`)
and the scaffolding itself is simply gone. **This is why §11 has no row for either** — retention acts on
committed files, and neither is ever committed. Absence there is the rule, not a gap in it.

¹ **README is the full front-door** — the complete overview of the repo. Don't truncate it to hit a
line count; deep detail belongs in `CLAUDE.md` (project shape) and `CONTEXT.md` (vocabulary) and
`architecture/overview.md` (structure), which the README links to. Keep it signal-dense (LAW 4), not short.
The bundled template models a human-showcase front-door (hero · why · quick start · features ·
docs map) — adapt freely, structure is a suggestion; only invariants are the anti-SSOT rule and the footer ownership line.

**Template-as-canonical-format rule**: when a template exists for a doc type, the template IS the
canonical format — NOT this guide's inline examples. Consult the template before generating to
verify section ordering, frontmatter shape, and placeholder tokens. Templates use bracket
placeholders (`[Project Name]`, `[CUSTOMIZE]`, `[role — not personal name]`). If template and this
guide diverge → **template wins**; note the divergence so the user can reconcile.

**Template-load protocol** (mandatory — this is the step that, when skipped, causes free-generation):

1. **Read** `${CLAUDE_SKILL_DIR}/templates/<X>.md.template` BEFORE writing the doc. Verify (a) frontmatter field order, (b) section order, (c) placeholder tokens preserved or replaced consistently.
2. **Missing template** → WARN: `"Template <X> not found — proceeding with §2 inline format as fallback; raised as a friction note."` Do NOT hard-stop; degraded output beats no output.
3. **Divergence** → template wins. Surface a one-line note (e.g. `"Section order corrected per architecture-overview.md.template"`). Never silently rewrite — the user must see the divergence.

Before creating any new file → ask "can this live in a code comment?" If yes → code.

**Create lazily.** Only create a doc when you have something concrete to write — an empty scaffold is
not a doc. Don't pre-create `DECISIONS.md` / `docs/adr/` / a glossary until the first real entry exists.

**DESIGN.md — optional, frontend-only, outside the core set.**
`docs/DESIGN.md` (or the repo's design dir) · template `templates/DESIGN.md.template`.
Create trigger: a frontend/UI project wants a shared design-system / token contract.
WHY/WHERE carve-out: exempt from the "never document HOW" golden rule because it is a **spec/contract
artifact** — it defines agreed tokens and components (as SPRINT captures WHAT/WHEN). It carries its
own design-token frontmatter instead of the §3 ownership header. Never auto-create; never add to the
core doc generation loop; never listed in the §2 table.

**SKILL.md cap (ADR-006).** A skill's `SKILL.md` stays ≤ ~140 lines of **procedure + scaffolding**;
**executable artifacts** (prompt templates, persona/advisor definitions, schemas) live in the skill's
own `references/` and **don't count** toward the cap. "Executable artifact" must not stretch to cover
ordinary prose — police it honestly.

**The disclosure test — what belongs inline vs in `references/`.** The cap is a size limit, not a
criterion; it tells you *when* to move something, never *which* something. The test is branching:
**inline what EVERY path needs; disclose what only SOME paths reach.** A step every invocation
executes belongs in `SKILL.md` even when it is long; a table consulted only on one branch belongs in
`references/` even when it is short. Push too little down and the top bloats until the procedure is
buried; push too much and the agent cannot act without a second read. Two budgets are in tension and
they are not the same: **context load** (tokens spent every turn — steep) versus **cognitive load**
(what a human must hold to navigate — acceptable where judgment lives).

**Completion criteria are a behavioural lever, not decoration.** A step's stopping condition changes
how thoroughly it is executed. Vague bounds — "understanding reached", "reviewed", "produce output" —
invite stopping at the first plausible moment. Demanding ones — "every rule applied", "each fixture
FAILs with its named finding", "all four touchpoints agree" — drive exhaustiveness without ever
saying "be thorough". Applies to DoD lines, `**Acceptance:**` lines, and any skill step whose
completion is a judgement call: **write the bound you would accept as proof, not the activity**.

**SKILL.md skeleton (canonical structure).** Frontmatter: exactly 6 fields, in order — `name` ·
`description` (trigger surface: what it does + a `Do not use for X → /Y` redirect where a confusable
sibling exists) · `argument-hint` (may be `""`) · `allowed-tools` · `user-invocable` · `version`.
**Bash scoping**: scope `Bash` to subcommands where the set is enumerable (the `release-patch`
pattern — `Bash(git diff *)` etc.); leave `Bash` unscoped only where arbitrary commands are inherent
to the job (test runners / build tools — `tdd` · `diagnose` · `prototype` · `orchestrator`), and that
rationale is the documented default, not silence. **Section order**: `## When to invoke` (optional;
canonical name — never "When to run") → one procedure section (name free — Steps/Flow/Procedure/
Workflow/Phases) → `## Output format` (required only for deterministic-output skills; canonical
name — never bare "Output") → `## Hard rules` (optional) → `## Red flags` (required, ❌-bullets).
**References**: internal pointers use `${CLAUDE_SKILL_DIR}/references/...`; a skill never points into
ANOTHER skill's `references/`/`templates/`. **Caps**: `SKILL.md` ≤ ~140 lines procedure+scaffolding
(ADR-006); `references/` uncapped.

**Conformance.** **A row in the tables above is a parameter set, not a rule.** Its cells span three
levels and both marks — `Cap` is mechanical, `Create ←` is a lifecycle *event* no tool observes — so
§2's rules are the **six column families**, and the 37 rows are their **data**. A checker that hard-codes
one rule per row hard-codes 37 near-duplicates and drifts on the 38th; read the families, parameterised
by the rows.

| Rule | Level | Mark |
|---|---|---|
| `S2.F-FILE` | Structural | mechanical — the file exists at its canonical path (`File` cell) |
| `S2.F-CAP` | Structural | mechanical — `wc -l` vs the `Cap` cell |
| `S2.F-CREATE` | Gated | judgment-only — a create *trigger* is an event; no tool observes that it happened |
| `S2.F-UPDATE` | Gated | judgment-only — same shape as `S2.F-CREATE` |
| `S2.F-TIER` | Gated | split — tier *satisfaction* is mechanical (reduces to `S2.F-FILE`); tier *detection* is judged (§6) |
| `S2.F-ARCHIVE` | Structural | restated — the `Archive` cell delegates to §11's ledger |
| `S2.R-PLACEMENT` | Structural | mechanical — canonical placement; legacy paths matched second |
| `S2.R-GROWTH` | Structural | judgment-only — *cap-hit → split, never squeeze*; which sections move is judged |
| `S2.R-CAPEXACT` | Structural | standard-directed — a cap a checker reads is an integer, not `~10` |
| `S2.R-LAW1INIT` | Structural | judgment-only — the mandatory minimum is scaffolded at init; beyond it, create-lazily |
| `S2.R-TEMPDIR` | Structural | mechanical — temp-dir artifacts are never referenced from durable docs |
| `S2.R-README` | Structural | mechanical *on the invariants* — the anti-SSOT rule and the footer ownership line |
| `S2.R-TPLCANON` | Gated | judgment-only — where a template exists, the template is the canonical format |
| `S2.R-TPLLOAD` | Gated | judgment-only — read the template before generating; divergence → template wins, surfaced |
| `S2.R-CODEFIRST` | Gated | judgment-only — before any new file, ask whether it can live in a code comment |
| `S2.R-LAZY` | Gated | judgment-only — create only when there is something concrete to write |
| `S2.R-DESIGN` | Structural | standard-directed — `DESIGN.md` is non-core and never listed in the §2 table |
| `S2.R-SKILLCAP` | Structural | standard-directed — governs `SKILL.md`, a plugin artifact rather than a repository concept |
| `S2.R-DISCLOSE` | Structural | judgment-only — inline what every path needs, disclose what only some reach |
| `S2.R-COMPLETION` | Gated | judgment-only — write the bound you would accept as proof, not the activity |
| `S2.R-SKELETON` | Structural | standard-directed — 6 frontmatter fields in order; canonical section order |

**21 rules** — 6 families + 15 standalone. `Reader` is **data**, not a rule: it names an audience and no
repository can violate it. *(One more than the SPRINT-072 inventory's 20: `S2.R-PLACEMENT` carries the
**legacy-path second-match** rule, which `S2.F-FILE` does not — a repo on a legacy layout satisfies one
and not the other, so they are separable.)*

---

## §3 — Ownership header (mandatory on every doc)

```yaml
---
owner: [role, not a person name]
last_updated: YYYY-MM-DD
update_trigger: [specific event that triggers an update]
status: current | needs-review | stale
---
```

Flag if: `status: stale`, `status: needs-review`, `last_updated` > 60 days, or no header present.

**README exception** — the README is the front-door; a top YAML block renders as an ugly metadata
table. So the README carries its ownership as a small **footer line** instead
(`<sub>Doc owner: … · last updated: … · status: …</sub>`), and leads with the project hero. The
ownership is still tracked — just at the foot, not the top.

**AGENTS.md exception** — same rationale, extended: `AGENTS.md` is a ~10-line thin pointer file, and
a 6-line YAML block would defeat that budget — so it too carries ownership as a footer `<sub>` line
instead of a top header (`AGENTS.md.template`).

**ADR exception** — an ADR carries the **ADR-009 knowledge metadata** block (`id` · `tags` · `domain` ·
`status` · `related`) that §4's template ships, *instead of* the four fields above. The two blocks
answer different questions — §3's is a lifecycle contract, §4's is a retrieval key — and an ADR is
**append-only** once decided, so `last_updated` and `update_trigger` describe a lifecycle it does not
have. Written down here because it was being enforced in code before it was stated: a checker
reporting ADRs against §3 tells an adopter to break the standard's own template.

**Exploratory-tree exception** — a tree the repository **declares exploratory** is *input to*
decisions, not governed documentation, and §3 does not reach it. Declare it in the tree's own index
or `README.md` frontmatter:

```yaml
governed: false   # exploratory input — §3 and LAW 3 do not apply to this tree
```

The declaration covers the tree and everything beneath it, including the declaring file. It is a
**declaration, not a path**: a repository keeps strategy notes, spikes and research scratch wherever
it keeps them, and a standard that fixed the directory name would exempt only repositories that
happened to choose ours. Two properties make this safe to state rather than merely tolerate — it is
**opt-in** (silence means governed, so nothing is exempted by accident) and it is **visible** (the
declaration sits in the tree it exempts, where a reader looking at those docs will see it). What it
does *not* license is parking a governed doc set behind the flag to silence a finding; that is
`S1.LAW1`'s judgement, not a mechanical one.

**Conformance.** §3's normative content is the **fenced schema block** above, which no line-shape
census sees — it is one rule, not zero.

| Rule | Level | Mark |
|---|---|---|
| `S3.SCHEMA` | Structural | mechanical — the four fields present on every doc; the *Flag if* conditions read from the same block |
| `S3.README` | Structural | restated — `S2.R-README` asserts the footer `<sub>` shape; §3 states the rule, §2 carries the check |
| `S3.AGENTS` | Structural | mechanical — `AGENTS.md` likewise |

**3 rules.** §3 is the most mechanical section in the standard: every rule is a field read.

---

## §4 — ADR format + when to offer one

ADRs are **rare but thorough.** Offer one only when ALL THREE hold — else skip (you'd just reverse it,
or nobody will wonder why):

1. **Hard to reverse** — changing your mind later carries meaningful cost.
2. **Surprising without context** — a future reader looks at the code and wonders "why this way?"
3. **A real trade-off** — genuine alternatives existed; you picked one for reasons.

When one qualifies, write it **in full** against `templates/ADR.md.template` — **one file per ADR** at
`docs/adr/ADR-NNN-<slug>.md`, append-only (never edit a decided ADR — mark it `deprecated` or
`superseded by ADR-NNN`). `DECISIONS.md` is a thin **index** linking them. Worked example →
`references/ADR-example.md`.

Required sections: **Status** (`proposed | accepted | deprecated | superseded`) · **Deciders** (roles) ·
**Context** (WHY — include a *measured blast radius* where scope drives the call, so it isn't a guess) ·
**Decision** (stated, not hedged) · **Consequences** (**at least one Negative** — no decision is
cost-free) · **Alternatives considered** (with the reason each was rejected). Never invent a decision —
record only what the user confirmed. WHY only, never HOW.

For a genuinely high-stakes call, **pressure-test it before recording** — run `/council` (5 advisors +
peer review → `verdict-<slug>.md`), then fold its recommendation + alternatives into the ADR.

**Qualifies**: architectural shape · integration patterns · tech choices with lock-in · boundary/scope
decisions (the explicit no's matter) · deliberate deviations · constraints invisible in code.
**Does not**: easy-to-reverse choices · the obvious path · single-module detail.

**Conformance.**

| Rule | Level | Mark |
|---|---|---|
| `S4.BAR` | Gated | judgment-only — offer an ADR only when hard-to-reverse **and** surprising **and** a real trade-off |
| `S4.ONEFILE` | Structural | mechanical — one file per ADR at `docs/adr/ADR-NNN-<slug>.md` |
| `S4.APPEND` | Gated | mechanical *via git history* — a decided ADR is never edited; mark `deprecated`/`superseded` |
| `S4.INDEX` | Structural | mechanical — `DECISIONS.md` exists and carries a row for every `docs/adr/ADR-NNN-<slug>.md`; a thin index, not a second copy of the decisions |
| `S4.SECTIONS` | Structural | mechanical — Status · Deciders · Context · Decision · Consequences · Alternatives all present |
| `S4.NEGATIVE` | Structural | mechanical — Consequences carries **at least one Negative** |
| `S4.NOINVENT` | Gated | judgment-only — record only what was confirmed; never invent a decision |

**7 rules.** Two statements in this section are deliberately **not** rules:
*"WHY only, never HOW"* restates `S5.FILTER` (the same ground on which §7 and §8 are ruled projections),
and the `/council` pressure-test line is advice for a high-stakes call, not an obligation. **`Qualifies`
/ `Does not` are data** — they calibrate `S4.BAR`'s judgement, they are not separate rules.

---

## §5 — HOW filter

| KEEP (WHY / WHERE) | DISCARD (HOW → belongs in code) |
|---|---|
| System purpose, scope boundaries | Implementation details, algorithm steps |
| Component names, responsibilities | Step-by-step code flow, function logic |
| Architectural decisions + trade-offs | Internal library behavior |
| External dependencies, setup commands | What each function does internally |

Discard log: `"Skipped: '[detail]' explains HOW → add as a comment in [file]."`

**Conformance.**

| Rule | Level | Mark |
|---|---|---|
| `S5.FILTER` | Structural | judgment-only — no HOW content; every line passes the KEEP/DISCARD filter |
| `S5.DISCARDLOG` | — | **implementation-directed** — the discard-log string is a *generator's* output format. It binds what a tool emits when it drops a HOW line, not what a repository contains, so an adopter's repo offers nothing to evaluate it against |

**2 rules, 1 `implementation-directed`.** The four KEEP/DISCARD rows are **data** calibrating
`S5.FILTER`, not rules.

---

## §6 — Tiered scale model (gates the §2 tier column; detected from manifest/stack at init, confirmed by popup)

| Tier | Trigger | Doc set |
|---|---|---|
| **Base** | every dev repo | the TemiDev mandatory minimum: root set (§2) · `product/{requirements,acceptance-criteria}` · `architecture/overview` · `development/setup` — plus **substrate-conditional** rows that are skipped, not owed, when the substrate is absent: `development/coding-standards` + `testing/testing-guide` (**has code**) · `deployment/{deployment,rollback}-guide` (**publishes an artifact**) · `database/` (DB) · `authentication` (auth). Gate per substrate, never on a repo label — a docs repo that publishes still deploys |
| **Backend / integration** | repo exposes an API or external integrations | + `api/openapi.yaml` (placement rule) · `architecture/integrations.md` |
| **Medium / complex** | multi-dev, sustained, or architecturally forked | + `adr/` + `DECISIONS.md` · `flows/` (CHANGELOG is already always-core — ADR-012) |
| **Multi-service** | several deployable services / repos | + `architecture/service-registry.md` · `architecture/service-dependencies.md` — per-service repos each carry their own Base+ set; the umbrella repo owns the cross-cutting pair. **The "global decisions index" this row used to name as a third doc is Medium's `DECISIONS.md` at umbrella scope, not a new file** — tier doc sets are exact-rank increments, so naming it here owed it twice (SPRINT-079 T2) |

A repo **moves up a tier by event, not by ceremony** — the trigger appearing (first API, second dev,
second service) is the create-event for that tier's docs. Moving down never deletes: docs stay until
their §11 leg retires them.

**Conformance.** Every tier row is one rule with two halves: **detection** ("multi-dev, sustained, or
architecturally forked") is judged, while **satisfaction** (given the tier, is its doc set present?) is
mechanical and reduces to `S2.F-FILE`. Four tiers, four splits.

| Rule | Level | Mark |
|---|---|---|
| `S6.BASE` | Structural | split — detection judged; the substrate-conditional rows are **skipped, not owed**, when the substrate is absent |
| `S6.BACKEND` | Structural | split — same shape |
| `S6.MEDIUM` | Structural | split — same shape |
| `S6.MULTISVC` | Structural | split — same shape |

**4 rules.** *Moves up by event, not ceremony* is **rationale** for how detection behaves, not a
separate obligation.

---

## §7 — Anti-patterns

| Anti-pattern | Response |
|---|---|
| HOW documentation | Redirect to a code comment |
| Orphan doc (no header) | Add header before touching file |
| Person ownership ("Alice") | Reassign to a role |
| Mega doc (over line limit) | Split per §2; never raise the limit **to fit content**. A cap moves only by ADR, and only after a diet pass has been measured first — the precedent is ADR-007 then ADR-017 (`CONTEXT.md` → 130 → 150) and ADR-006 as amended (`SKILL.md` → 140); **a second raise on one file is a signal that file is doing too many jobs, not a routine renewal**. Raising it silently is what the rule forbids; an ADR that records the argument is the escape hatch, cited inline in §2 |
| Sprint file > 400 lines | Block — split the sprint |
| Stale doc used as source | Run the staleness scan first |
| File outside the core set | Redirect to code or an existing core file |
| Ledger past a §11 retention trigger | Compress / rotate / archive at the next promote |

**Conformance.** **§7 is a view, not a rule source** — seven of its nine restate §2/§3/§5/§11 as
prohibitions. An engine ingesting it as fresh rules double-counts them under a second name. The
`= <id>` column says which rule each one *is*.

| Rule | Level | Mark | Restates |
|---|---|---|---|
| `S7.HOW` | Structural | judgment-only | `S5.FILTER` |
| `S7.ORPHAN` | Structural | restated | `S3.SCHEMA` |
| `S7.PERSON` | Structural | restated — the role-vocabulary question belongs to `S1.LAW2`; asserting it here states one constraint twice | `S1.LAW2` |
| `S7.MEGA` | Structural | mechanical | `S2.F-CAP` |
| `S7.SPRINT400` | Structural | mechanical — hard cap | `S9.TWOFILES` |
| `S7.STALE` | Gated | judgment-only | — *(new here)* |
| `S7.OUTSIDE` | Structural | restated — set membership vs §2 | `S2.F-FILE` |
| `S7.LEDGER` | Structural | restated | §11 |
| `S7.CAPRAISE` | Gated | judgment-only — a cap moves only by ADR, and only after a measured diet | — *(new here)* |

**9 rules, 2 of them new.** The `Response` column is **data** — the remedy, not the obligation.

---

## §8 — Pre-delivery checklist

- [ ] Template was read before generating (template-load protocol §2)
- [ ] Ownership header present and complete
- [ ] No HOW content (every line passes the §5 filter)
- [ ] Under the line limit for this file type
- [ ] No person names as owners
- [ ] `status` field set correctly
- [ ] All referenced files exist

**Conformance. §8 is a projection and introduces no rules at all.** All seven items restate rules
stated elsewhere — template-load `S2.R-TPLLOAD` · header `S3.SCHEMA` · HOW `S5.FILTER` · line limit
`S2.F-CAP` · person owners `S1.LAW2` · `status` `S3.SCHEMA` · referenced files exist `S2.R-PLACEMENT`.

**0 rules.** Evaluate this section and you count seven constraints twice under a second name — which is
independently why a conformance **percentage** would mislead: the denominator inflates on the standard's
own cross-references. Checklist items are for a human at delivery time; a tool reads the originals.

---

## §9 — Sprint file (`templates/SPRINT.md.template`)

The active sprint is **two files** — a capped Plan and an uncapped log (ADR-014):

| File | Cap | Holds |
|---|---|---|
| `docs/sprint/SPRINT-NNN-<slug>.md` | **400 hard** | frontmatter (`status` · `plan_commit` · `close_commit`) · Theme · Scope (In/Out) · Plan (Tn + size·risk + Acceptance + **DoD checkboxes** — what `/orchestrator sprint-bulk` loops and `/prime` counts) · Owner-action checklist · Decisions→ADR · Assumptions · Files Changed · **Retro** (routed per §10) |
| `docs/sprint/logs/SPRINT-NNN-<slug>.md` | **append-only, uncapped** | the **Execution Log** only — created lazily at the first entry |

`TODO.md` holds the Backlog **pool**. **Why they are separate:** the Log grows with the work done, so
sharing one 400-line budget means the more a run accomplishes the closer the file gets to breaching —
which caps how many tasks a Plan may hold, and therefore how much an unattended run can consume before
it clean-halts. Measured before the split: six consecutive sprints ran 232–368 lines holding only 2–6
tasks, one of them reaching 368 lines on **two** tasks. The Plan was never what filled the file.

The Plan stays frozen at promote; a mid-sprint scope shift is logged as a `scope-change` entry in the
log file (what broke · impact · re-confirm G2) **before** § Plan is edited.

**Gate sign-off is a frontmatter field, and its absence is a negative answer.**

```
gates_signed: <GATE>[,<GATE>...] @ <sha>      e.g.  gates_signed: G1,G2 @ 1f0c012
```

It records which gates a human approved and the commit they approved against. Three properties carry
the weight:

- **Omit it until the gates are actually signed.** A missing `gates_signed:` means **NOT SIGNED** and
  must never be read as approval. An unfilled template placeholder is absence, not a value.
- **It lives in the sprint file, not in the approving session.** A sign-off recorded only in a
  transcript is invisible to anything that reads the repo — including an autonomous run, which reads
  the sprint file and nothing else.
- **A malformed record is worse than none**, because it looks like evidence. A reader that cannot
  parse it should say so rather than fall back to either answer.

**A DoD criterion names how it was verified.** Where a mechanical check exists for a criterion, the
criterion names it — conventionally an italic `*Verify: …*` clause on the same line:

```
- [ ] <the criterion> — *Verify: <the check that proves it>*
```

A criterion naming no check is a **judgment tick** and says so. This is what makes the level's
"criteria name how they were verified" property readable: a tool can tell a mechanically-verified
criterion from a judged one without inferring it from the wording. The named check's FAIL blocks a
*silent* tick — a tick past it is recorded as an owner ruling, never left implicit.

**Conformance.** Each rule names **the artifact a tool actually reads** — "the sprint file" is not an
answer; the field or the git object is.

| Rule | Level | Mark | Artifact read |
|---|---|---|---|
| `S9.TWOFILES` | Structural | mechanical | both paths exist; `wc -l` on the Plan (400 **hard**) |
| `S9.LOGDIR` | Structural | mechanical | path shape — load-bearing, the sprint glob is non-recursive |
| `S9.GATESWELLFORMED` | Gated | mechanical | the `gates_signed:` frontmatter field |
| `S9.GATESABSENT` | Gated | mechanical | field absent ⇒ **NOT SIGNED**, never approval |
| `S9.GATESINFILE` | Gated | restated | the same field — a session transcript is unreadable to any tool, which is the point |
| `S9.GATESMALFORMED` | — | **implementation-directed** | constrains the *reader*: report it, never default either way |
| `S9.PLANFROZEN` | Gated | split | mechanical via git (did § Plan change after `plan_commit`?); whether a change was legitimate is not |
| `S9.SCOPECHANGE` | Gated | split | the two commits' order is mechanical; "was this a scope shift?" is not |
| `S9.VERIFYCLAUSE` | Gated | mechanical | the `*Verify: …*` clause's presence on the criterion line |
| `S9.JUDGMENTTICK` | Gated | judgment-only | — |

**10 rules**, one of them `implementation-directed`.

---

## §10 — Continuous learning governance

Every iteration feeds the next. At **Sprint Close**, first **sweep the full session** — the Execution
Log AND any tech-debt / follow-up surfaced mid-run but never written down — then the Retro sorts work
into four buckets, each **routed to a durable home** (don't leave them in the sprint file):

| Bucket | Routes to |
|---|---|
| Shipped | `CHANGELOG.md` (root) |
| Tech debt | `TD-NNN` row in root `TECH-DEBT.md` (`severity` + `created: Sprint-NNN`) |
| Follow-ups | `TASK-NNN` entry in `TODO.md` § Backlog (re-enters the loop) |
| Learnings | `L-NNN` entry in `docs/LEARNINGS.md` |

**Retrieval-miss check** (at close) — also ask: *did we fail to find, or contradict, a prior
`L-NNN`/ADR this sprint?* A yes is a fileable friction (→ Learnings bucket) **and** the observed signal
for investing in a derived knowledge-graph view — track the miss rather than guessing on corpus size.

**Promotion rule** — a learning that recurs (**count ≥ 2** — a second sprint hits the same friction)
is promoted from a ledger line into a *durable* rule. Mark `promoted: yes → <where>` on the entry.
One-offs stay ledger lines — they're context, not law. Don't promote on a single occurrence; don't let
a 2nd occurrence pass unpromoted.

**Placement test — the three homes are not interchangeable.** Ask **which flows can hit this failure**,
then place the rule where *all* of them read. A `skills/<x>/SKILL.md` red-flag is scoped to that skill's
flow — correct only when the failure is confined to it. A `CONTEXT.md` rule reaches every flow that reads
the SSOT. A `CLAUDE.md` anti-pattern reaches every flow in the repo, and is the answer when the honest
enumeration is "all of them" (it is capped, so landing there displaces something — a ruling, not an
append). Picking off the menu instead of enumerating is how a rule ends up firing in exactly one flow and
staying silent in the rest: L-087 was filed into `/diagnose` and then failed to fire during a `promote`;
a redaction rule lived in `/handoff` and never reached `/diagnose`, the skill that instructs capturing HAR
files. Where the rule already appears on more than one surface, **rewrite the duplicates to point at the
one home** — a stale second copy reproduces the failure it was promoted to stop. This is L-020
(shipped ≠ wired) applied to rules rather than capabilities: a promotion earns the same wiring check a
capability gets (L-092).

**Every hygiene rule gets a matcher.** The placement test decides *where* a rule fires; this decides
**whether it fires at all**. A hygiene rule earns either a lint in the project's quality gate or a named
checklist line in a close/promote sweep — a rule with neither is aspirational, and is deleted or wired
rather than left looking enforced. What it prevents is not a wrong rule but an **absent rule that reads
as present**, which is the shape every recurring miss in this class shares: a dedup pass nothing swept,
a consumer-surface check nothing verified, a wiring check nothing ran, a retention convention nothing
matched. So name the matcher in the same change that writes the rule, or say plainly that the line is
documentation — documentation is a legitimate answer, and calling it a gate is the error. This is
L-099's authoring-time twin: L-099 catches a rule written where its checker cannot read it, this one
catches a rule with no checker at all. *Applied to itself:* its matcher is the Promote review's
L-promotion line below, which is where a durable rule gets written and can therefore be asked for one.

**A `Mitigation:` line is a hypothesis, not a plan.** A `TD-NNN` row's proposed cure is the filer's best
guess, written at the moment the cost was being felt; by the time it reaches a Plan, repeated re-reading
has made it read as settled. Cite the evidence for the *problem*, re-derive the *fix* — at **close** (when
filing one) and at **promote** (before a DoD is built on one). Two rows have now been right about the
symptom and wrong about the cause, and in one case the proposed cure would have destroyed evidence
(L-091).

**A number inside a criterion is remembered, not measured.** Its facts-level sibling. A figure written
into a DoD, a `TD-NNN` Summary or a Backlog `assumes:` line looks like evidence and reads as settled,
but it was measured once — at authoring — and nothing re-measures it, so the criterion rots while its
prose stays confident. A stated figure with no check behind it is a comment: that is how a research doc
absorbed 39 lines over its cap across four sprints while an open row cited a count that had been wrong
since the sprint it was filed in, and how a DoD shipped clauses that were unsatisfiable when written.
**Re-derive a stated figure before acting on it** — at **promote** when a DoD is built on one, at the
**TD re-review** when a row is held on one, and at **decompose/triage** when one is written into or
groomed in a Backlog entry. One command is the whole cost (L-097).

**Tech-debt aging** — at **Sprint Promote**: any `TD-NNN` unaddressed ≥ 3 sprints triggers a
re-review prompt; `severity: high` auto-escalates to Backlog P1. Rows are never deleted — resolved
debt is marked `status: resolved → TASK-NNN` for the audit trail.

**Promote review (the governance checkpoint)** — before planning a sprint, run the L-promotion scan, TD
aging, and doc-aging triggers, then **emit the result as an explicit checklist** rather than silent
prose — `☐ L-promotion (count≥2, promoted:no): <findings|none>` · `☐ TD aging (≥3 sprints unaddressed):
<findings|none>` · `☐ doc-aging — §11 retention + §2 cap breaches: <findings|none>`. **Explicit owner
sign-off on the checklist is required before rendering the sprint file or committing `plan locked`.**
This is what stops learning and debt from rotting — and stops the review itself from being skipped unnoticed.

**Doc-aging has two sources, and §11 is only one of them.** §11's ledger is a *retention* table — what
gets archived, pruned or collapsed. **Caps are §2's**, and the two are not the same question. The
doc-aging line therefore reports **both**: every §11 retention trigger that fired, *and* every §2 cap
breach, sourced from the project's own cap check where it has one and otherwise measured directly
against §2's table. **Never restate a §2 cap inside this checklist**: a copied figure is a second SSOT
that drifts silently from the row it copied, and enumerating triggers by hand is what lets an entire
category go unreported (a cap check printed three soft breaches on every run for sprints while this
review reported doc-aging clean — the report had a matcher and no consumer; SPRINT-062 T2 · L-106).
The `TODO.md` whole-file row in §11's table is a **cap wearing a retention row's clothes** — it is listed
there for its prune action, and it is the reason exactly one of §2's caps used to reach this checklist
while the rest did not.

**Conformance. §10 is the hardest section in the standard to check** — 4 mechanical of 10. Not because
it is unimplemented, but because *"was the placement test applied well?"* and *"was the checkpoint
honestly run?"* are unobservable in principle. **Gated, not Attested, is the difficult level.**

| Rule | Level | Mark | Artifact read |
|---|---|---|---|
| `S10.FOURBUCKETS` | Gated | mechanical | the four target files gained entries in the close commit |
| `S10.RETRIEVALMISS` | Gated | judgment-only | — |
| `S10.PROMOTION` | Gated | mechanical | the `count:` and `promoted:` fields (count ≥ 2) |
| `S10.PLACEMENT` | Gated | judgment-only | — |
| `S10.MATCHER` | — | **implementation-directed** | binds the standard's own gate, not an adopter |
| `S10.MITIGATION` | Gated | judgment-only | — a `Mitigation:` line is a hypothesis, not a plan |
| `S10.NUMBERINCRITERION` | Gated | judgment-only | — |
| `S10.REDERIVE` | Gated | judgment-only | — re-derive a stated figure before acting on it |
| `S10.TDAGING` | Gated | mechanical | `created:` / last re-review vs the sprint counter |
| `S10.PROMOTEREVIEW` | Gated | split | the checklist's presence in the record is mechanical; that it was *honestly* run is not |

**10 rules**, one `implementation-directed`. *"Doc-aging has two sources"* is **data** about where the
doc-aging line reads from, not a separate obligation — it is why this table has 10 rows where the
SPRINT-072 inventory counted 11.

---

## §11 — Retention (LAW 3's archive leg)

The single-file ledgers grow forever in an agentic loop. Compression keeps them lean without losing
history: **git is the full audit trail — archives, collapses and deletions move or shrink blocks, never rewrite
them**. Append-only is preserved *inside* each archive file.

| Ledger | Trigger | Action |
|---|---|---|
| `TODO.md` Backlog entries (shipped/promoted) | sprint close | **remove outright** (propose→approve) — no shipped-in-SPRINT breadcrumb comments left in TODO.md; history's durable homes are root `CHANGELOG.md` + `docs/sprint/archive/` |
| `TECH-DEBT.md` | `resolved` ≥ 3 sprints ago | **delete the row.** The substance already lives in `CHANGELOG.md`, the sprint archive and git, so a permanent in-file pointer is a breadcrumb rather than a record — and a ledger that only ever grows stops being read. **Ids stay monotonic: deleting a row never frees its id for reuse.** The 3-sprint delay is deliberate — a just-resolved debt is still context at the next promote |
| `TODO.md` whole file | over its §2 cap at promote | flag in the governance review; prune with the user |
| `CHANGELOG.md` (root) | a new MINOR version lands | keep current + previous minor inline; older blocks move verbatim → `docs/changelog/CHANGELOG-<version>.md` + one link line |
| `docs/LEARNINGS.md` | an entry reaches `promoted: yes` | collapse it to a pointer line — `L-NNN → promoted: <where>`; the durable rule is the record now. **Ids are monotonic, never reused** — pruning removes the body, never frees the id; the next new id = highest-ever + 1. **The collapse consumes the trigger it fires on:** a promoted entry ends up as `[status: promoted]` + the pointer, so `promoted: yes` is *never* the stored form and grepping for it returns zero on a perfectly healthy corpus. Count promotion state by `[status: promoted]` (position-anchored, per L-108); a zero here is evidence about the query, not about the corpus (SPRINT-062 T3) |
| `docs/sprint/SPRINT-NNN-<slug>.md` | sprint closed | move → `docs/sprint/archive/`; add to `docs/sprint/INDEX.md` (created lazily) one line: `- SPRINT-NNN — <theme> — closed YYYY-MM-DD · <close_commit>` |
| `docs/epic/EPIC-NNN-<slug>.md` | **every** member sprint closed **and** the epic's Closed-when conditions all `[x]` | move → `docs/epic/archive/`; keep its `INDEX.md` row (the row is the durable pointer, the file is the detail). **Never archive on member-sprint count alone** — an epic whose last sprint closed with exit conditions unmet is unfinished, not done, and archiving it hides that |
| `docs/research/<slug>.md` | `status: superseded` **and** nothing live still cites it | move → `docs/research/archive/`; it stays in the generated `knowledge-index.md`, marked `(archived)`. **Supersession alone is not enough** — a spent verdict is usually the WHY-trail for whatever replaced it, so while any live surface still points at it the doc stays put (closed history — `docs/sprint/archive/`, `docs/changelog/` — and the generated index never count as citers). A doc that never reaches `superseded` is never archived: the state is set by the author when a decision is built on it, per the RESEARCH template |
| `docs/sprint/logs/SPRINT-NNN-<slug>.md` | sprint closed | move → `docs/sprint/archive/logs/` **with its Plan**, same commit — the pair is one record and splitting them across an archive boundary strands the evidence the Retro cites. No INDEX row of its own; the Plan's row covers both. Never compacted: the log is the append-only audit trail the Retro was written from |

**When it runs** — close-time triggers (Backlog removal · sprint archive) execute during `close`;
scan-based triggers (TD deletion · rotation · LEARNINGS collapse · the `TODO.md` prune) run at
**Promote** as **doc-aging**, alongside tech-debt aging in the governance review. Always propose →
approve → apply; never compress silently.

**Doc-aging is not bounded by this table.** The rows above are retention triggers; the promote review's
doc-aging line also carries **every §2 cap breach**, which this table does not enumerate and must not
try to (§10 Promote review). A breach and a retention trigger need different actions — a cap breach is
ruled (trim · split · restate the number, per §2's Growth rule), not archived.

**Conformance.** The nine ledger rows share one shape — **trigger → action**, where the action is a move
or a deletion. All nine are **mechanical on the action** (is the file under `archive/`? is the row
gone?) and **split** wherever the trigger is itself judged.

| Rule | Level | Mark | Note |
|---|---|---|---|
| `S11.BACKLOG` | Gated | split | removal is mechanical; "shipped/promoted" is judged. Propose→approve |
| `S11.TDDELETE` | Structural | mechanical | `resolved` ≥ 3 sprints ⇒ the row is gone; ids stay monotonic |
| `S11.TODOCAP` | Structural | mechanical | over its §2 cap at promote |
| `S11.CHANGELOG` | Structural | mechanical | current + previous minor inline; older → `docs/changelog/` + a link line |
| `S11.LEARNINGS` | Structural | mechanical | count by `[status: promoted]`, position-anchored — `promoted: yes` is never the stored form |
| `S11.SPRINT` | Structural | mechanical | moved → `docs/sprint/archive/` + one INDEX line |
| `S11.EPIC` | Structural | mechanical | a genuine **two-part** test: every member sprint closed **and** all Closed-when `[x]` |
| `S11.RESEARCH` | Structural | mechanical | `superseded` **and** nothing live cites it — the citation half is a corpus scan, not a field read |
| `S11.LOGPAIR` | Structural | mechanical | the log archives **with its Plan, same commit** |
| `S11.WHENITRUNS` | Gated | split | close-time triggers execute at **close**, scan-based ones at **promote**; the phase is mechanical from commit history, whether the right trigger fired is not |
| `S11.APPROVE` | Gated | judgment-only | always propose → approve, never silent; no artifact records that approval was *sought* |

**11 rules.** *"Doc-aging is not bounded by this table"* is **rationale** — it explains the boundary
against §2, and deleting it changes no repository's conformance. *"Git is the full audit trail"* is
likewise rationale for why compression is safe. It is why this table has 11 rows where the SPRINT-072
inventory counted 12.

---

## §12 — The Git boundary (what belongs in the repo, what never does)

Placement (§2) says *where in the repo*; this section says *whether the repo at all*. A doc/file
clears the boundary on content, not format — a well-formatted secret is still a secret.

**a. The decision rule.** Commit it when it:

| Commit when it… | Keep it out when it is… |
|---|---|
| must change together with code | commercial / legal / HR / financial / client-management material |
| is required to understand the code | confidential or personal data |
| is needed to run / test / deploy / maintain | a large editable design source |
| benefits from version history + code review | temporary, or reproducible by a command |
| contains no secrets / personal / commercial data | capable of exposing production infrastructure or credentials |

**b. Never-commit table** — category → examples → proper home instead:

| Category | Examples | Proper home |
|---|---|---|
| Secrets & credentials | `.env`, `*.pem`, `id_rsa`, `service-account.json`, API keys, tokens | secret manager |
| Client contracts / NDAs / legal | signed agreements, legal correspondence | controlled document storage |
| Pricing / financial | proposals, invoices, salaries | document storage |
| Personal & customer data | real records, PII, medical, payment, production DB exports | production systems only — sanitized fixtures in-repo, e.g. `{"name":"Example User","email":"user@example.test"}` |
| Raw production logs | app/server logs pulled from prod | logging / monitoring platform |
| Database backups | `backup.sql`, `production-dump.sql` | backup storage (small FAKE seed files are fine in-repo) |
| Original design sources | large Figma exports, `.ai` / `.psd`, video mockups | design tool / asset storage — only assets the app actually uses go in `public/` or `src/assets/` |
| Meeting notes | raw notes from any meeting | convert outcomes into requirements / ADRs / issues; never commit the raw notes |
| Draft proposals / pitch decks | unshipped commercial drafts | document storage |

**c. Generated/temporary excludes.** The standard `.gitignore` classes: `node_modules/`, `dist/`,
`build/`, `coverage/`, `.cache/`, `*.log`, `.DS_Store`, `Thumbs.db`, IDE dirs (`.idea/` + personal
`.vscode/settings.json` — shared `.vscode/extensions.json` MAY be committed). Rule: **anything
reproducible by a command stays out**; the only exceptions are artifacts a deployment/distribution
process actually requires.

**d. The clean separation:**

- **Git** = source + technical truth
- **PM tool** = tasks / progress
- **Document storage** = contracts / BRD / commercial
- **Design tool** = UI/UX sources
- **Secret manager** = credentials

Even a private repo is treated as potentially exposed.

**Wiring.** `init`'s `.gitignore` safe-scaffold derives its content from **§12c** (write-if-absent);
`migrate`'s adoption scan checks the tree against **§12b** (report-only — never auto-remediates).

**Conformance.** The never-commit categories split cleanly on whether the category has a **file shape**:
a `.pem` is a pattern, a meeting note is a judgement about content.

| Rule | Level | Mark |
|---|---|---|
| `S12.BOUNDARY` | Structural | judgment-only — the commit-when / keep-out decision rule (§12a) |
| `S12.SECRETS` | Structural | mechanical — `.env`, `*.pem`, `id_rsa`, `service-account.json`, key/token patterns |
| `S12.LEGAL` | Structural | judgment-only — contracts, NDAs, legal correspondence |
| `S12.FINANCIAL` | Structural | judgment-only — proposals, invoices, salaries |
| `S12.PERSONAL` | Structural | judgment-only — real records, PII, medical, payment, prod exports |
| `S12.PRODLOGS` | Structural | judgment-only — raw logs pulled from production |
| `S12.BACKUPS` | Structural | mechanical — `backup.sql`, `production-dump.sql` and kin |
| `S12.DESIGNSRC` | Structural | mechanical — large `.ai` / `.psd` / video sources by extension and size |
| `S12.MEETINGNOTES` | Structural | judgment-only — convert outcomes into requirements / ADRs / issues |
| `S12.DRAFTS` | Structural | judgment-only — unshipped commercial drafts |
| `S12.GENERATED` | Structural | mechanical — anything reproducible by a command stays out (§12c classes) |
| `S12.WIRING` | — | **implementation-directed** — binds `init` and `migrate`, not a repository |

**12 rules**, one `implementation-directed`. §12d (the clean separation) is **data** — a routing map,
not an obligation; *"even a private repo is treated as potentially exposed"* is **rationale**.

---

## §13 — HITL attestation (git-native)

The **Attested** conformance level requires that human approval be provable to a third party *from a
clone alone*. §13 defines the format that carries it. It is a contract, not a procedure: it says what
must be true of a commit, never how a tool produces or reads one. The reader that matters is someone
with your repository and nothing else — no access to your planning tool, your CI, or you.

**a. What carries the attestation.** Three git trailers on the **task's own commit** — the commit that
implements the work, not a separate approval commit and not the merge:

| Trailer | Value | Meaning |
|---|---|---|
| `Gate-Signed-By:` | `Name <email>` | the **human** who approved the gate. One line per approver; repeat the trailer for more than one. |
| `Gate:` | gate identifiers, comma-separated (e.g. `G1,G2`) | which gates that approval covers. |
| `Evidence:` | a repo-relative path, **`@ <sha>` strongly recommended** | where the approval is recorded in the repo, so the claim can be read in full rather than taken on faith. |

**Qualify `Evidence:` with a sha.** A trailer is written into immutable history and cannot be amended
later, but the *path* it names is not immutable — planning records get archived, renamed and
reorganised, and a bare path silently stops resolving. `@ <sha>` pins the pointer to a commit where
the file demonstrably existed, so `git show <sha>:<path>` keeps working no matter what the tree looks
like afterwards. This is not hypothetical: the worked example below cites a sprint file that was moved
to an archive directory during the very close that wrote it. At its stated sha it still resolves; had
it been written bare, it would already be dead.

All three are required together. A commit carrying `Gate:` without `Gate-Signed-By:` asserts that a
gate applied and declines to say who approved it, which is weaker than saying nothing.

**b. Relation to the sprint-level record.** A conformant repo already records gate sign-off once per
sprint (`gates_signed: <GATES> @ <sha>` in the sprint file — §9). The trailer does not replace that
record and does not move approval to a per-task cadence: it **carries the sprint-level fact onto the
commits it covers**, so a reader with a clone can reach it without knowing your sprint file exists or
how to parse it. The two must agree; the sprint file stays the place the approval is *recorded*, and
`Evidence:` is the pointer back to it.

What this buys is **verifiability, not approval frequency.** An implementation that batches G1/G2 once
per sprint and one that signs every task can both be conformant here; what §13 forbids is a repo that
claims per-commit approval it never obtained. State the cadence honestly in `Evidence:` and the claim
stays true at either granularity.

**c. The claim-vs-proof boundary — this is the load-bearing paragraph.**

**An unsigned trailer is an assertion by whoever wrote the commit, and nothing more.** Trailers are
plain text in the commit message. Anyone who can write a commit can write any `Gate-Signed-By:` line
they like, naming anyone. Nothing in git checks it. A verifier reading an unsigned trailer may
conclude *"this repository states that this person approved these gates, and points at where it says
so"* — and may **not** conclude that the named person approved anything.

**Signing is what converts the claim into proof.** When the commit carries a valid signature
(`git log --format=%G?` → `G`), the trailer's contents are covered by that signature, and a verifier
with the signer's public key can conclude the *signer* attested to this text. Note precisely what
that does and does not establish: it binds the **signer** to the claim, so `Gate-Signed-By:` is proof
only when the signer and the named approver are the same party, or when the signer is an authority
you already trust to make the statement.

Consequently **Attested is not reachable by trailers alone.** An implementation that emits perfect
trailers over unsigned commits has reached Gated and has made its records easier to read; it has not
reached Attested, and reporting otherwise is exactly the theatre a conformance level exists to
prevent. Do not soften this in an implementation's own documentation: the honest statement is that
the format is in place and the signing is not.

**d. Worked example — a real commit, shown in the weaker state.**

Taken from this specification's own reference implementation, so the example is checkable rather than
illustrative. Commit `97eca0b` was produced under a sprint whose gates were signed and recorded as
`gates_signed: G1,G2 @ cac204b`. Its conformant trailer block would read:

```
sprint(70) T2: cure the worktree base pin at its cause, and guard it

<body>

Gate-Signed-By: Aldian Rizki <aldian.mar@gmail.com>
Gate: G1,G2
Evidence: docs/sprint/SPRINT-070-attested.md @ cac204b
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```

**What a verifier may conclude from it, and what it may not.** Re-derived at the time of writing
rather than assumed: `git log -1 --format=%G?  97eca0b` → **`N`** — no signature. Across the whole
repository, `git log --format=%G? | sort | uniq -c` → **673 of 673 commits `N`**. So for this example
a verifier may conclude only that the repository *states* these gates were approved by that person
and points at `docs/sprint/SPRINT-070-attested.md` for the record. It may **not** conclude that the
named human approved anything, because nothing here is signed. Reaching Attested on this repository
requires commit signing, which it does not yet do.

This example is deliberately the unsigned case. Illustrating §13 with a signed commit that does not
exist would demonstrate the format by misrepresenting the implementation — and a standard whose own
worked example overstates its author's conformance has taught the wrong lesson before its first
adopter has read a second page.

**e. Author identity is not the attestation.** Do not infer the approver from the commit's `author`
or `committer`. Both vary by setup: an agent may commit under its own identity, or under a human's
git config with the agent recorded as `Co-Authored-By:` (the case above). Neither arrangement says
anything about who approved a gate. That is what `Gate-Signed-By:` is for, and why it is a separate
field rather than something a verifier derives.

**Conformance. Attested is the *most* mechanical level in this standard** — 5 of 7 — because a trailer
is a literal string on a literal object. That inverts the usual intuition; the hard level to check is
**Gated** (§10 is 4 of 10). But two of §13's rules are `implementation-directed`, and they are the
semantically load-bearing ones: they constrain **what a tool may infer**, not what a repository must
contain. An engine that ingested them as repo rules would either drop the claim-vs-proof boundary this
section exists to state, or emit findings **no adopter can ever clear**.

| Rule | Level | Mark | Artifact read |
|---|---|---|---|
| `S13.TRAILERS` | Attested | mechanical | `git log --format=%(trailers)` — all three required **together** |
| `S13.OWNCOMMIT` | Attested | mechanical | which commit carries them — the task's own, not a separate approval commit and not the merge |
| `S13.EVIDENCESHA` | Attested | mechanical | the `Evidence:` value's shape (`@ <sha>`) |
| `S13.AGREE` | Attested | mechanical | the trailer and the sprint-level `gates_signed:` compared |
| `S13.UNSIGNEDCLAIM` | Attested | mechanical *on the fact* | `%G?` — an unsigned trailer is a claim, not proof |
| `S13.NOINFER` | — | **implementation-directed** | a verifier **may not** conclude approval from an unsigned trailer |
| `S13.NOTAUTHOR` | — | **implementation-directed** | author/committer identity is **not** the attestation |

**7 rules**, two `implementation-directed`. **§13 is entirely unchecked today** — no attestation
checker exists in the reference implementation, which its own conformance report states plainly rather
than rounding up.

---

## §14 — Conformance model (how to read the annotations)

Every `## §N` above ends with a **Conformance.** block: a table of that section's rules, each carrying a
stable **id**, its **level**, and its **mark**. This section defines what those mean. It adds no rules of
its own — it is the legend, and evaluating it against a repository is a category error.

**Levels** (ADR-024) — what class of evidence answers the question:

| Level | Evidence | Reads |
|---|---|---|
| **Structural** | the file tree | paths, presence, line counts, frontmatter fields |
| **Gated** | planning records | sprint frontmatter, ledger rows, commit order |
| **Attested** | git history | trailers, signatures, the objects themselves |

**Marks** — whether a tool can decide it, and the distinction that matters most:

| Mark | Meaning | Is it work? |
|---|---|---|
| `mechanical` | a tool can decide it from the named artifact | a check either exists or is a gap |
| `judgment-only` | **not checkable in principle** — the standard is choosing a human | **no. This is not debt** |
| `split` | mechanical on one half, judged on the other | only the mechanical half is |
| `implementation-directed` | constrains a **tool's behaviour or inference**, not a repository | **no — and never evaluate it against an adopter** |
| `restated` | states a constraint **another rule already carries** — the covering rule is named beside it | **no. It is checked, under the other id** |
| `standard-directed` | constrains **this document**, or the plugin that ships it, rather than any repository | **no — and never evaluate it against an adopter** |

**`judgment-only` and "mechanical but unchecked" are not the same thing, and collapsing them is the
error this model exists to prevent.** A rule marked `judgment-only` will never have a checker, because
no tool can decide whether the placement test was applied *well*. A rule marked `mechanical` with no
checker behind it is a **gap someone can close**. Only the second is work. Report them as separate
counts.

**Which is why a conformance percentage is forbidden.** A ratio averages a deliberate judgment-only
boundary together with a real gap, so **the number goes up when the standard declines to automate
something** — exactly backwards. §8 makes it worse still: it restates seven rules under a second name,
inflating any denominator that ingests it. A conformant report states a **level**, the **named findings
preventing the next level**, and the **judgment-required items**. Never a score, a grade, or a
percentage.

**`implementation-directed` is not a courtesy category.** **Six rules carry it** —
`S5.DISCARDLOG` · `S9.GATESMALFORMED` · `S10.MATCHER` · `S12.WIRING` · `S13.NOINFER` ·
`S13.NOTAUTHOR`. Two sit in §13 and they are the
load-bearing ones: *a verifier may not conclude approval from an unsigned trailer* and *author identity
is not the attestation* are rules about **what a tool may infer**. A conformance engine that ingests
them as repository rules must either drop them — losing the entire claim-vs-proof boundary §13 exists to
state — or emit findings **no adopter can ever clear**.

**`restated` and `standard-directed` exist because a rule can be neither checkable against an adopter
nor a matter of judgment.** Both were added at spec 0.6.0, and both name a state the model previously
had no word for — so eleven rules sat outside every category, and a conformance engine reading only the
`mechanical` mark reported all eleven as *unchecked gaps someone can close*. They are not.

**`restated` — seven rules, each naming the rule that carries its constraint.** `S7.ORPHAN` →
`S3.SCHEMA` · `S7.PERSON` → `S1.LAW2` · `S7.OUTSIDE` → `S2.F-FILE` · `S7.LEDGER` → §11 ·
`S2.F-ARCHIVE` → §11's ledger · `S9.GATESINFILE` → the same field as `S9.GATESWELLFORMED` ·
`S3.README` → `S2.R-README`. **This is §8's problem at rule scale, and it gets §8's answer.** §8
contributes **0** to the counts below precisely because it restates seven constraints under a second
name and any denominator ingesting it double-counts them; these seven do the same thing one level
down, across sections rather than within one. The constraint *is* checked — under the other id — so a
`restated` rule is neither a gap nor judgment: it is **covered elsewhere**, and a report says which.

**`standard-directed` — four rules that govern this document, not a repository.** `S2.R-CAPEXACT` (a
cap cell is an integer) and `S2.R-DESIGN` (`DESIGN.md` is absent from the §2 table) both read **§2's
own table**, which an adopter does not have. `S2.R-SKILLCAP` and `S2.R-SKELETON` govern `SKILL.md`, a
plugin artifact rather than a general repository concept — an adopter with no skills would collect
findings for files they were never expected to have. This is the same failure `implementation-directed`
prevents, **one category out**: these *are* repository rules, just not *an arbitrary repository's*.

**What this changes, stated plainly rather than buried.** Eleven rules leave the *checkable* set, so it
goes **62 → 51**. That makes §10's coverage arithmetic — and any exit condition resting on it — easier
to satisfy, which is a real cost and the reason this is an ADR rather than a tidy-up. It is accepted
because the alternative is worse in the direction that matters: a report that tells an adopter the
standard owes them eleven checks it has decided never to write. **Classification is unchanged at 100** —
nothing was reclassified out of the standard, only out of the set a tool evaluates against a tree.

**Reading a rule id.** `S<section>.<key>` — `S13.TRAILERS` is §13's three-trailer rule. Ids are stable
across spec versions and are what a finding names, so a report stays comparable as the standard evolves.
An id is retired, never reused.

**A `?` mark means unclassified, and is a real state.** It marks a rule this specification states and
whose classification has not yet been ruled. It is not a silent skip and it is not a pass — a tool
reporting on a `?` rule says so. **No rule carries `?` at this version**; the mark stays defined because
a rule added to a later version arrives unruled, and the honest state for it is this one.

**Counts, re-derived from this document.** **100 classified rules and 0 unclassified**, 100 candidates
across §1–§13:

| § | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | total |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| classified | 4 | 21 | 3 | 7 | 2 | 4 | 9 | **0** | 10 | 10 | 11 | 12 | 7 | **100** |
| unclassified | | | | 0 | 0 | | | | | | | | | **0** |

§8 contributes **0** — it is a projection of rules stated elsewhere, and an engine ingesting it
double-counts seven constraints under a second name.

These counts are derived from the tables above and are the figure to cite. They supersede the
`96 / 39 / 45 / 6` figures in the reference implementation's SPRINT-072 baseline, which stated 96 while
its own rows summed to 99 and its own columns to 98. **The spec is the rule source; a derived inventory
that disagrees with it is the thing that is wrong.**
