---
owner: Maintainer
last_updated: 2026-10-24
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

> **Older than the two minors below** → [`docs/changelog/`](docs/changelog/) — rotated verbatim at
> each new MINOR and reachable only from here (STANDARD §11).

---

## v2.16.0 — anti-slop where the work happens: a code-slop check, a UI review floor, honest prototypes and a sharper `/humanizer` (2026-10-25)

**MINOR** — ships SPRINT-140 (Anti-Slop Where the Work Happens). No new skill; the roster stays at 15. Builders, reviewers and
`/tdd` now check for code slop. A rendered-UI change gets a review floor, which hands over to anti-slop's Delivery Gate when that
skill is installed. `/prototype` variants stop inventing data and the DESIGN template gains an owner-supplied direction.
`/humanizer` adds five patterns, an audit mode and before → after counts. Installing the release is enough; no upgrade step. The
standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-140 — Anti-Slop Where the Work Happens (2026-10-25)

**Consumer-facing** (shipped procedure; every repo that installs lean-flow gets these):

- **The G2 builder check now carries two rules for whoever writes the design.** The design quotes a frozen Done-when
  verbatim instead of paraphrasing it, and when G2 rules between `Layers:` candidates declared in advance, the same G2 log
  entry records the scope-change that drops the losing tokens.
- **Builders, reviewers and `/tdd` refactors now check for code slop.** The check uses the code-slop box in the self-review checklist.
  A comment pass changes comments only and never touches code.
- **`/humanizer` catches five more patterns.** They are human verbs on abstractions, filler phrases, synonym cycling, empty
  "from X to Y" ranges and clusters of scare quotes. They live in a lean-flow-owned file, so the vendored English catalog stays untouched.
- **`/humanizer` can list its findings first, numbered and strongest first, and change only the ones you pick.** It runs
  only when you ask for an audit. Everything you do not pick stays exactly as written.
- **`/humanizer` now counts the dashes, bold labels and curly quotes before and after a rewrite and reports both numbers.**
  If your writing sample uses them, it keeps them at about your rate instead of driving them to zero.
- **A change to rendered UI now gets a review floor.** The reviewer clicks every changed control, checks the empty, loading and error states,
  keyboard reach, the narrowest supported width and computed contrast, and records each result. When an `antislop` or `anti-slop` skill is
  available in the session and loads successfully, its Delivery Gate runs instead; otherwise the floor applies.
- **`/prototype` UI variants now use real data or a visible `[REAL DATA]` placeholder instead of invented numbers and people.**
  Stock dashboard and landing-page shells alone do not establish structurally distinct variants.
- **The optional DESIGN template gains a Direction block that the owner fills in.** It holds personality, mood, audience and an optional
  energy, rhythm and motion dial. The agent fills it only from the owner's answers or their own file and otherwise leaves it as `[CUSTOMIZE]`.

**Maintainer-side**:

- The consumer-side durable rules now say a "without the plugin" proof runs as a separate headless process and is judged
  from its own `system/init` event, never from a sub-agent (L-241).
- `.claude/CLAUDE.md` is now rule plus pointer (2,432 → 1,715 words); the stories moved to `docs/LEARNINGS.md` § Durable rules,
  and the always-loaded token budget is ratcheted from 16,087 to 12,691.

---

## v2.15.0 — `/humanizer`: AI-sounding prose rewritten to read human, in English and Indonesian, on every writing job (2026-10-25)

**MINOR** — ships SPRINT-139 (Humanize Every Writing Job): one new skill, `/humanizer` (roster 14 → 15), wired into
`/lean-doc-generator`, `/release-patch`, `/handoff` and every commit and PR message the skills compose. Installing the release
is enough; no upgrade step. The standard is unchanged (spec 0.18.1). Restart the session after installing.

### SPRINT-139 — Humanize Every Writing Job (2026-10-25)

**Consumer-facing** (shipped procedure; every repo that installs lean-flow gets these):
- **Every sub-agent brief now names secret files as off-limits.** The orchestrator's builder, worktree and reviewer briefs, the builder-check reader prompt, the task-decomposer `Explore` recon brief and the council's sub-agent prompts say: never open `.env`, `.env.*`, key or credential files, or anything the host's ignore rules mark secret, even when told read-only; report and ask, or read a non-secret record. Two SPRINT-138 agents briefed "read-only" had opened `.env` files (L-247).
- **New `/humanizer` skill rewrites AI-sounding prose so it reads human, without changing what it says.** Give it pasted text (you get the draft, the patterns still left, and the final) or name a prose file (only the final text is written; code, commands, paths, YAML and link targets stay untouched). It ships a 26-pattern English catalog vendored verbatim from blader/humanizer 3.1.0 (MIT, commit 8c307f3) and is standalone: `/flow` does not run it. The skill count is now 15.
- **`/humanizer` now cleans Indonesian and mixed Indonesian-English text.** A new `references/patterns-id.md` adds the Indonesian forms of the English tells ("Tidak hanya X, tetapi juga Y", "Mari kita selami", "Semoga membantu!"), Indonesian-only tells (stacked formal connectors, "Adapun"), a term table that keeps the English word where the KBBI coinage is uncommon (galat → error, peladen → server), and a first-use italics rule for rendered Markdown. The skill reads it in full whenever the text is Indonesian.
- **`/humanizer` can translate between English and Indonesian, on explicit request only.** Name a target language ("translate to English", "terjemahkan ke bahasa Indonesia") and it translates the meaning, then cleans the result in that language under its catalog; English to Indonesian also applies the term table and first-use italics. Without that request it never translates. Code, paths, YAML and link targets stay unchanged.
- **`/lean-doc-generator` now runs generated doc prose through `/humanizer` on every write.** The pass runs in a child sub-agent that reads the pattern catalogs in full, with the template (or the doc being edited) as the voice sample, so your house style (`—`, `→`, bold labels) survives. Where a runtime cannot start a sub-agent it runs inline and says so; if the pass fails or humanizer is not installed, the original text is written with a one-line notice and nothing is blocked. The contract is in the humanizer skill's `references/embedded.md`, reusable by your own skills.
- **`/release-patch` and `/handoff` now pass their prose through `/humanizer`.** The CHANGELOG entry `/release-patch` prepends (including in changelog-only mode) and the handoff document are cleaned in a child sub-agent before the hard stop or the save. Version strings and lines, headings, paths, commands, ids and status fields are never changed, the entry keeps its existing shape, and `/release-patch` still never pushes. If the pass fails, the original text is written with a one-line notice.
- **Commit messages and PR bodies written by the skills now pass through `/humanizer`.** The orchestrator (quick, mvp, sprint-bulk and its builders), `/lean-doc-generator`, `/diagnose`, `/prototype` and `/triage` clean the free prose of a commit message as plain text and a PR body as rendered Markdown. The `type(scope):` prefix, trailers, ids, shas and paths stay verbatim, fixed-template commits (status moves) skip the pass, and a failed pass commits the original message with a one-line notice.

---
