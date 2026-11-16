---
id: TASK-672
title: "Indonesian infra text uses the English term where a plain Indonesian word was translated word for word"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
depends-on: []
sprint: SPRINT-180
---

# TASK-672 — Indonesian infra text uses the English term where a plain Indonesian word was translated word for word

## Why
The bnpt-68 owner rejected an Indonesian leadership deck twice even though it passed the existing rules. English infra
terms had been translated word for word (tersapu for scanned, tutup temuan for fix findings, gladi for rehearsal).
`patterns-id.md` L123 already covers spec names, column headers, capacity terms and test names in sizing, infrastructure,
specs and test plans; it leaves out ordinary infra and process words (gate, branch, window, secret, container). 0 of the 31
reported pairs appear in the skill today. ADR-053 does not apply (no new guard, checker, gate leg or ledger) — unfrozen
skill work. Consumer evidence applies. Delta judged over the existing surface (L-017).

## Done when
- [ ] **Widen the rule in the one existing home, `patterns-id.md` § Domain terms of art.** L124's tell "a word-by-word
  translation of a spec name" becomes "a word-by-word translation of an English term practitioners say in infra and process
  text". Wording drafted at build, settled at G2.
  - A table of about 12 to 15 low-ambiguity pairs (candidates in Assumes).
  - One line for the ambiguous generic words: English in infra text, Indonesian in general text.
  - The audience-judgment sentence naming the kept words (gelombang, layanan pendukung, keputusan kunci, berkas, salinan).
  - One `kunci` rule with a single expectation everywhere: the phrase "kunci API" becomes "API key" (the owner's pair);
    "kunci" meaning a critical dependency becomes "dependency"; "keputusan kunci" is kept unchanged; a key-factor sense is
    never rewritten as "API key". The fixture control and the rule say the same thing.
  - One cross-reference line under the KBBI table: "domain calques → § Domain terms of art".
- [ ] **Keep every existing after-example true.** The rule is scoped so existing examples stay: `uji fio` (`patterns-id.md`
  L58, `patterns-lf.md` L71 and L75) and `lapisan` (L29). Bare `uji` and `lapis` are not in the one-liner; `uji` is swapped
  only inside the named compounds, `lapis` only inside "N layer" phrases. Scoping choice is a G2 call (see Assumes).
- [ ] **Amend the existing Keep-list note in place.** The note at `patterns-id.md` L136 is amended once, no second note. In
  infra text the domain rule wins for `pindai` and `unggah`. L140-142's unconditional "stays Indonesian" is reconciled to "in
  general text; the infra pair unggahan→file upload follows § Domain terms of art". `basis data` has no owner pair, so it
  stays unchanged everywhere; the rule applies only to the phrase "inti data" (→ core database). The infra "basis data"
  fixture element is dropped; a plain "basis data" appears only as a control.
- [ ] **One host-glossary route.**
  - The rule lives only in `patterns-id.md` § Term policy, a short new subsection.
  - Every path that reads the catalogs gets it with no per-caller edit and no `embedded.md` change: child path, inline
    commit path, inline fallback, standalone use and Translate mode (EN→ID reads the ID catalog in full).
  - Discovery, stated generically: the pass reads the host's `.claude/CONTEXT.md`, else `CONTEXT.md`, at the repo root,
    § Domain Glossary (the shipped `lean-doc-generator/templates/CONTEXT.md.template` convention). A glossary entry acts
    only where it names a catalog row or one-liner word; there it wins, and its `_Avoid_` forms are the rejected forms.
    Every other entry (a domain synonym such as User → Member) is ignored by the pass.
  - Nothing is "named by the user" in embedded mode.
  - An absent, unreadable or glossary-less `CONTEXT.md` is a silent no-op; the subsection says this is outside
    `embedded.md` item 7 and never returns UNAVAILABLE. A glossary is optional, not "needed".
- [ ] **Bulk-swap rule where step 6 reads it.** `SKILL.md` step 6 gains 1 to 2 lines: after a term swap, grep the final
  text case-insensitively for each rejected form that was swapped, in its rejected sense; controls and kept phrases
  ("keputusan kunci") are not leftovers. Observable in every mode: zero leftovers in the final text. `SKILL.md` stays near
  122 lines, under the cap.
- [ ] **Fixture.** New retained synthetic fixture under `evals/fixtures/humanizer/` (no bnpt text):
  - Exactly 8 seeded calques (the two `kunci` seeds below are scored separately) not in the existing 5 rows (so L123-124 cannot fix them for free), including "tersapu", a
    sentence-initial capitalised "Worker antrean", and a multi-word calque with a casing mismatch.
  - Controls that must stay unchanged: berkas, salinan, gelombang, "keputusan kunci", a bare "basis data".
  - One "kunci" seeded as a critical dependency (expected "dependency") and one "kunci API" (expected "API key").
  - A fact list retained alongside it.
  - A host glossary file for one override run (it rejects one catalog row), and one unrelated glossary (domain synonyms
    only) for one control run.
- [ ] **Baseline and pass criteria, fixed in advance.**
  - Baseline is commit `3e31706d` (HEAD now; derive at write time), exported with `git archive <sha> skills
    .claude-plugin`. There is no version tag.
  - Baseline passes the sample when at least 6 of the 8 seeds are left unfixed in each of 3 runs; otherwise the sample is
    strengthened before the fix is judged (TASK-525's escape).
  - After the change, 3 of 3 runs fix 8 of 8 seeds with the right affix form (di-scan, di-fix), get both `kunci` seeds
    right, keep every control and fact, add nothing, and leave zero leftovers in the final text. A fresh blind judge
    scores all runs.
  - The override run uses a host glossary that rejects one row; the pass follows it through the same route (reading
    `CONTEXT.md`). The unrelated-glossary control run changes nothing beyond the no-glossary result.
  - Runs follow the `term-of-art/NOTES.md` protocol: trusted folder, pinned export, one export per folder.
- [ ] **Existing fixture re-run.** `evals/fixtures/humanizer/term-of-art/` re-run 3 of 3 after the change still passes: 5 of
  5 terms of art in English, none of the general words (pengguna, berkas, cadangan, mengunduh, laporan) anglicized, 15 of 15
  facts kept, nothing added.
- [ ] **README and CHANGELOG.** README `/humanizer` row (~L204): a clause for the domain-calque rule and the optional host
  glossary override. CHANGELOG `[Unreleased]`: one line. No manifest bump (release-patch owns that).
- [ ] Negative: General words are not anglicized (the controls above). With no host glossary, only the override is a
  no-op: the new global rules still apply, and the pass never returns UNAVAILABLE for a missing glossary. A glossary entry
  that names no catalog row changes nothing. The fixture fails on the baseline.

## Touches
`skills/humanizer/references/patterns-id.md` · `skills/humanizer/SKILL.md` (step 6) · `README.md` (row ~L204) ·
`evals/fixtures/humanizer/<new>/` · `CHANGELOG.md`. No `embedded.md` edit (no item renumbering; NOTES citing item numbers
stay valid). No caller edited (re-derived: 12 files mention the humanizer; embedded callers are lean-doc-generator SKILL.md,
humanize-pass.md, sprint-by-reference.md, release-patch, handoff, diagnose, orchestrator SKILL.md + dispatch.md, triage,
prototype).

## Tier X rationale
No gate, engine rule or conformance script → not G. L-007 binds every tier, so it does not exclude P; X follows the
TASK-525 precedent for an Indonesian-catalog change and default-up (ADR-029). Codex draft review applies, max 2 rounds.

## Assumes
- Candidate rows (final cut at G2): gladi→rehearsal, sinkron akhir→final sync, salin penuh→full copy, pembekuan kode→code
  freeze, terminasi TLS→TLS termination, reboot tertunda→pending reboot, sensor jebakan→deception sensor,
  kontainer→container, daftar periksa→checklist, zona waktu→timezone, worker antrean→queue worker, tutup temuan→fix
  findings, temuan kritis→critical findings, riwayat→git history, inti data→core database.
- One-liner: jendela, cabang, gerbang, rahasia, konsumen, bersihkan, tanda tangan, unggahan, dikeraskan,
  sapuan/tersapu/pemindaian, berdiri sendiri, kunci API. `uji` and `lapis` only as compounds.
- G2 call on existing after-examples: keep them and scope the rule as drafted (default), or change `uji fio`/`lapisan` to
  English (extends Touches to `patterns-lf.md` and `patterns-id.md` L29, L58).
- Exact seeded "kunci" sentences confirmed at G2.
- Glossary override scope: a glossary row wins only for terms it lists; `_Avoid_` names rejected forms; no glossary
  section → nothing overridden.
- Wiring check: the build runs the override case through the child path and the commit inline path in the fixture and
  shows the glossary reached both.
- Dispatch-trial may sample this sprint; S-size keeps strongest-tier review samples small; trial design out of scope.
- Fixture is synthetic (owner's pair list is the only source; no bnpt deck text).
- Size S; becomes M only if the term-of-art re-run forces edits to existing rows or examples (builder flags at G2).
- Draft review: 2 rounds (blind Fable + Codex each); round 2 had no blocking finding. G2 notes from round 2, for G2 to rule:
  - `lapisan` (patterns-id.md L29 "di tiga lapisan") is itself an N-layer phrase: state the criterion that keeps it
    (form `lapis` not `lapisan`, or text kind), or change L28-29 and grow Touches.
  - `di-test` was dropped from the affix list because bare/verb `uji` is out of scope; G2 may bring verb `uji` in, with a
    reason `uji fio` still stays.
  - The `CONTEXT.md` read should be conditioned (Indonesian or mixed text, ideally a catalog-term hit) so English passes
    pay no extra read.
  - Before/after swap counts are only visible in standalone mode (embedded returns final text only): one standalone run
    shows them, or the count is dropped. SKILL.md L66, L70 and README L204 say "four tells"; a fifth count touches them.
  - Glossary paths not yet exercised: a `CONTEXT.md` with no glossary section (lean-flow's own state), and the commit-inline
    wiring proof — make the wiring check a box with a criterion and a run count.
  - "At the repo root" → relative to the working/project folder, since the fixture runs in a non-repo trusted folder; cite
    `embedded.md`'s UNAVAILABLE rule by name, not "item 7".
  - `unggah` scope: limit to the owner's form (unggahan → file upload) so the "mengunduh" control is not pressured.
  - Baseline = the parent of the change commit (or `plan_commit`), catalogs byte-identical to it, not "HEAD now".
  - A bare "kunci" meaning a credential (not "kunci API") may be an SSH or encryption key, not an API key: G2 rules its
    form, or keeps only the owner's phrase.
  - Drop the "12 files mention the humanizer" figure (selectors disagree: 12 / 13 / 15); the 10-caller list is correct.

## Risk / blast radius
Low. Reference text read by one utility skill; main risk is over-anglicizing general Indonesian, addressed by the controls,
the term-of-art re-run and the Negative box.

## Tracker
Owner intake request 2026-11-16 (bnpt-68 session /humanizer feature request; owner ruled "file it via intake later") ·
owner rulings Q1 "Global + optional host", Q2 "~12-15 distinct + 1 line", Q3 "Domain rule wins in infra" · L-017 (delta
over the existing surface) · TASK-525 (precedent) · ADR-053 (unfrozen skill work).
