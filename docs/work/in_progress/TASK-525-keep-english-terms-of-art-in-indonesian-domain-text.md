---
id: TASK-525
title: "Keep English terms of art in Indonesian domain text, and scope the Keep Indonesian list to general vocabulary"
priority: P2
size: S
risk: low
autonomy: HITL
class: execution
tier: X
authority: J1
origin: decomposer
state: ready
sprint: SPRINT-145
depends-on: []
---

# TASK-525 — Keep English terms of art in Indonesian domain text

## Why
A real writing job (a formal Indonesian hardware-request memo on server and storage sizing) needed three owner
corrections after the humanizer pass. The pass wrote plain Indonesian for infra terms of art ("pengguna aktif
bersamaan", "serah terima", "penalti tulis", "ruang kosong", "toleransi drive rusak"), which the owner called
non-standard. These are ordinary Indonesian words, not KBBI coinages, so the term policy's "Keep the English term" table
cannot catch them, and the "Keep Indonesian" list pushed the pass toward over-translating. Owner rulings at intake: a
rule plus the five rows as examples, in a subsection of its own. The fixture was to be a sanitized excerpt of the memo,
but the pre-correction text is gone (the reporting session was cleared), so the owner ruled a synthetic sample instead.

## Done when
- [x] `patterns-id.md` § Term policy gains a "Domain terms of art" subsection: in domain or technical text, a spec ✓ 86dbebd6: Domain terms of art subsection, frozen wording + five rows; Codex R1 CLEAR
      name, column header or capacity term that is an English term of art stays English even when a plain Indonesian
      phrase exists; the tell is a word-by-word translation of a spec name. The five rows (concurrent · acceptance test ·
      write penalty · free space · fault tolerance) are its examples, each with the Indonesian form it replaces.
- [x] "Keep Indonesian (common and natural)" states it covers general vocabulary, not domain terms of art. ✓ 86dbebd6: Keep Indonesian scoped to general vocabulary
- [x] A synthetic memo-shaped sample, built from the four reported corrections with no client text, is retained under ✓ term-of-art fixture (synthetic, 15 facts incl. 3 open items); 2.17.0 baseline 0/3 pass, blind judge
      `evals/fixtures/humanizer/` with its expected terms and a fact list that already counts each open item of its
      to-do list as a fact; the 2.17.0 baseline shows the failure on it (L-255).
- [x] Three embedded runs on the fixture after the change keep every term of art in English, translate none of the ✓ after @86dbebd6: 3/3 pass (5/5 terms, 15/15 facts, no additions), blind fresh judge; contaminated run re-run
      general vocabulary back, and keep every fact, judged by a reader that did not write the brief (L-252, L-259).
- [x] CHANGELOG `[Unreleased]` line. ✓ 86dbebd6: CHANGELOG [Unreleased] SPRINT-145 bullet

## Touches
`skills/humanizer/references/patterns-id.md` · `evals/fixtures/humanizer/<new fixture>/` · CHANGELOG.md

## Assumes
- Resolved (2026-10-26): the BNPT session could not supply the pre-correction memo text (its context was cleared), so
  the owner ruled a synthetic sample built from the four reported corrections; no client text enters the repo.
- The term-of-art rule applies to domain or technical text (sizing, infra, specs); general prose keeps the "Keep
  Indonesian" words, and the existing KBBI table is unchanged.
- Per L-255 the 2.17.0 baseline must reproduce the owner's corrections on the sample, or the sample is strengthened
  before the fix is judged.

## Tracker
Peer session feedback from a BNPT memo, items 1 and 2 (2026-10-26); intake draft Codex-reviewed, R2 CLEAR.
