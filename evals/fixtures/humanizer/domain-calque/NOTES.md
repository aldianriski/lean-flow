## Protocol

A fixed input for judging the embedded humanizer pass on Indonesian infra and migration prose (TASK-672,
SPRINT-180 T1). The fixture is synthetic: an invented organisation and invented numbers, with no client or agency
text. Like `../term-of-art/`, it is a manual model-call fixture, not a qa-check leg.

- `sample.md`: an Indonesian migration memo of about 200 words. Every seed and control is in running prose, outside
  headings, table cells, list labels and inline code.
- `facts.md`: the numbered facts, expected forms per seed, controls and added-claim criteria. Timing, scope,
  obligations and the unresolved reopening decision must survive a rewrite.
- `commit-message.txt`: the plain-text commit input, carrying seeds 1 and 4 in running prose consistent with the memo.
  Retain it before the commit-inline run; use `sample.md` as the retained inline-fallback input.

The eight seeds and their expected forms with no override:
1. "seluruh VM sudah tersapu" → "seluruh VM sudah di-scan".
2. Sentence-initial "Worker antrean berjalan di dua host lama" → "Queue worker berjalan di dua host lama".
3. "temuan tersebut sudah ditutup" → "findings tersebut sudah di-close" (closed, not fixed: the memo states no remediation).
4. "gladi dijadwalkan Rabu" → "rehearsal dijadwalkan Rabu".
5. "salin penuh arsip pukul 22.00" → "full copy arsip pukul 22.00".
6. Mid-sentence, mixed casing: "Pengisian Daftar Periksa dimulai Kamis" → "Pengisian checklist dimulai Kamis".
7. "inti data pindah ke host baru" → "core database pindah ke host baru".
8. "sensor jebakan di jaringan yang ada" → "deception sensor di jaringan yang ada".

Two kunci seeds are scored separately: "NFS menjadi kunci gelombang kedua" → "NFS menjadi dependency gelombang
kedua", and "kunci API layanan pembayaran" → "API key layanan pembayaran". The first is a critical dependency,
the second a credential phrase. Controls that must stay: berkas, salinan, gelombang, keputusan kunci, basis data,
lapisan, uji fio, pengguna and concurrent user. The one "gelombang" occurs inside the NFS seed.

The three host-context folders exercise different glossary cases. Copy the chosen context into the run's working
folder, preserving its relative path; do not name a glossary in the pass's prompt:
- `glossary-none/CONTEXT.md` has no Domain Glossary section. It proves that a glossary-less context is a silent
  no-op for overrides, global rules still apply, and the pass does not return UNAVAILABLE.
- `glossary-override/.claude/CONTEXT.md` has one entry, Dry run, rejecting both gladi and rehearsal. It proves the
  `.claude/` discovery route and the override of a catalog row: seed 4 must become "dry run dijadwalkan Rabu", a third
  form absent from both the sample and the catalog's expected form.
- `glossary-unrelated/CONTEXT.md` has exactly the template's Workspace and Member examples. Neither names a catalog
  row or one-liner word. It proves unrelated synonyms are ignored, including User → Member: "concurrent user" stays.

Discovery is relative to the project root (the repo root), or the working folder when there is no repo. The pass
reads `.claude/CONTEXT.md`, else `CONTEXT.md`, and the section whose heading starts `## Domain Glossary`. No file,
no section or an unreadable context overrides nothing; the glossary is optional, outside `embedded.md`'s UNAVAILABLE
rule. The existing term-of-art reruns below cover the absent-file case.

Commit the fixture before any run, leaving the catalogs unchanged until the baseline is complete. Record
`git hash-object evals/fixtures/humanizer/domain-calque/sample.md` for both arms; use the same frozen sample. Export
the baseline at `3e31706d` with `git archive 3e31706d skills .claude-plugin`. Before the text edits, confirm
`git diff --quiet 3e31706d <build-parent> -- skills .claude-plugin`. Export the after arm from the build commit.
Keep each export in its own folder, never the live checkout or two exports under a shared `--add-dir`.

Run one separate headless process per run, in a trusted folder outside this repo, with the same pinned model:

```bash
claude -p --setting-sources local --plugin-dir <export> --add-dir <export> --output-format stream-json --verbose --model <pinned> < /dev/null
```

Build prompts from the run's pinned export of `skills/humanizer/references/embedded.md`, resolving skill and catalog
paths to that export. Save each assembled prompt in its run folder before starting the process:
- Child path: § Child path items 1 to 7 verbatim, then format `markdown` and the full contents of `sample.md` inline
  as both text and voice sample.
- Inline fallback: § Inline fallback, § Child path item 4 and § Never touched verbatim, then format `markdown` and
  the full contents of `sample.md` inline as both text and voice sample. Use a runtime that cannot start a sub-agent.
- Commit-inline: § Inline path, § Child path item 4, § Never touched and § Commit messages and PR bodies verbatim,
  then format `plain` and the full contents of `commit-message.txt` inline as both text and voice sample.

The run matrix is fixed in advance (13 runs):
- Baseline: three child-path runs in glossary-none. At least six of eight seeds must remain unfixed in each run;
  otherwise strengthen the sample, record its new hash and repeat the baseline before editing the catalogs.
- After: three child-path runs in glossary-none. Each must fix eight of eight seeds, including `di-scan` and `di-close`,
  get both kunci seeds right, keep every control and fact, add nothing and leave zero rejected-form leftovers.
- After: one child-path run in glossary-override, expecting dry run for seed 4.
- After: one glossary-override run through `embedded.md` § Inline fallback, expecting dry run. It is valid only with
  no Agent dispatch and the fallback status line.
- After: one glossary-override run through `embedded.md` § Inline path for a commit message, format `plain`, with an
  Indonesian message from `commit-message.txt` carrying seeds 1 and 4. Expect `di-scan` and dry run; this is the
  commit-inline wiring proof.
- After: one child-path run in glossary-unrelated. Every scored field must match the glossary-none result;
  concurrent user stays unchanged.
- After: three `../term-of-art/` runs in a folder with no CONTEXT.md at either discovery path, judged against its own
  `facts.md`: five of five terms of art in English, general words kept Indonesian, fifteen facts kept, nothing added.

For every run, read the model back from the transcript's init line and confirm the same pin. Its Read calls must hit
its own export and read `patterns-id.md` with no offset. An after-arm run with a CONTEXT.md at either discovery path
(glossary-none, glossary-override and glossary-unrelated) is valid only if its transcript contains a Read tool call
on that folder's CONTEXT.md, including `.claude/` for the override; anchor this check on the tool call, not a text grep.
Baseline runs are valid without a CONTEXT.md Read because the baseline catalog has no glossary rule. Discard invalid
runs, record the reason and rerun them.

Judge each run from its own transcript's final result. Strip status lines, shuffle labels and give the finals to a
fresh reader who did not write the brief. The judge reports the observed form per seed and per control, facts kept
and anything added; the coordinator maps the arms afterwards. A second query mechanically searches each final
case-insensitively, whole word, for the eight rejected forms, both kunci rejected forms and their expected forms, and
every control. Keputusan kunci is a kept phrase, not a leftover. In override runs, also search for rehearsal (must be
absent) and dry run (must be present). First-use italics are tolerated; casing is not scored, and sentence-initial
capitalisation is acceptable. The judge and search must agree; the coordinator reads and records any disagreement.

Translate and standalone share the catalog route but are judgment ticks, not additional runs in this matrix. On an
eval miss, allow one bounded catalog retry, then three fresh after-runs on the new commit; a further failure goes to
the owner. Recorded evidence belongs below, including the sample hash, commit and model pins, per-run transcripts,
discarded runs, judge results and mechanical searches.

## Recorded runs

SPRINT-180 T1, 2026-11-16. Model pinned to `--model sonnet` (claude-sonnet-5-5) on every run, read back from each init
line. Runs in `D:\Research\s180-evals` (trusted, no git repo, so discovery uses the working folder). The prompt names
the export's humanizer folder as an input: the headless Skill call is denied, so the child takes item 1's own
fallback and reads `SKILL.md` from there (owner ruling; `--allowedTools` on the child was refused by the permission
classifier and not worked around).

- Baseline at `3e31706d` (catalogs identical to `plan_commit`). The first sample (`c843bd27`) let run 2 fix three
  seeds through the existing infra rule (5 of 8 unfixed), so the sample was strengthened (`b2e4ef38`: seeds 5, 6, 8
  became salin penuh, Daftar Periksa, sensor jebakan). Three runs on `b2e4ef38`: 8 of 8 seeds and both kunci seeds
  unfixed in 3 of 3 (grep and judge agree). One run dropped two controls and added a heading.
- After at `2767637f` (round 1): the global rule fixed 8 of 8 and both kunci seeds in every sample run, but only 1 of
  7 runs with a CONTEXT.md read it. One bounded catalog retry, `d28b0a6f`, moved the glossary step to the top of
  `patterns-id.md`.
- After at `d28b0a6f`, ten runs, all valid:
  - glossary-none, three child runs: CONTEXT.md read; 8 of 8 seeds with the right affix forms (di-scan, di-fix), both
    kunci seeds (dependency, API key), 9 of 9 controls, 19 of 19 facts, nothing added, zero leftovers.
  - glossary-override, child: CONTEXT.md read, "dry run". Inline fallback: glossary read with a shell `cat` on that
    path, "dry run", fallback status line present, no Agent dispatch. Commit inline: catalogs read, CONTEXT.md never
    read, "di-scan" but "rehearsal" (the override missed; owner accepted the gap, TD-317).
  - glossary-unrelated, child: CONTEXT.md read; every scored field matches glossary-none; "concurrent user" kept.
  - term-of-art, three runs (no CONTEXT.md): 5 of 5 terms in English, the five general words Indonesian, 15 of 15
    facts by the coordinator; the judge read one run as 14 of 15 (fact 8 "fault tolerance dua drive", which this
    sheet's own fact 8 accepts, and fact 14 recast as a request, the TASK-526 form). The stricter reading is kept here.
- A fresh judge scored all thirteen finals blind (labels shuffled, status lines and a harness Co-Authored-By trailer
  stripped). It agreed with the mechanical whole-word search on every seed and control.
