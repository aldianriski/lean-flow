---
owner: Maintainer
last_updated: 2026-10-26
status: current
update_trigger: rotated out of the root CHANGELOG at a new MINOR (STANDARD §11)
---

# lean-flow — Changelog v2.15.x (rotated)

> Rotated verbatim from the root `CHANGELOG.md` at the **v2.17.0 release** (2026-10-26). §11 keeps the
> current and previous minor inline (2.17.x and 2.16.x), so cutting v2.17.0 pushed v2.15.x out.

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

