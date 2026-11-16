## Protocol

A fixed input for judging the embedded humanizer pass on Indonesian infra and migration prose (TASK-672,
SPRINT-180 T1). The fixture is synthetic: an invented organisation and invented numbers, with no client or agency
text. Like `../term-of-art/`, it is a manual model-call fixture, not a qa-check leg.

- `sample.md`: an Indonesian migration memo of about 200 words. Every seed and control is in running prose, outside
  headings, table cells, list labels and inline code.
- `facts.md`: the numbered facts, expected forms per seed, controls and added-claim criteria. Timing, scope,
  obligations and the unresolved reopening decision must survive a rewrite.

The eight seeds and their expected forms with no override:
1. "seluruh VM sudah tersapu" → "seluruh VM sudah di-scan".
2. Sentence-initial "Worker antrean berjalan di dua host lama" → "Queue worker berjalan di dua host lama".
3. "temuan tersebut sudah ditutup" → "findings tersebut sudah di-fix".
4. "gladi dijadwalkan Rabu" → "rehearsal dijadwalkan Rabu".
5. "sinkron akhir pukul 22.00" → "final sync pukul 22.00".
6. Mid-paragraph "Pembekuan Kode berlaku sejak Kamis pukul 17.00" → "Code freeze berlaku sejak Kamis pukul 17.00".
7. "inti data pindah ke host baru" → "core database pindah ke host baru".
8. "terminasi TLS di load balancer" → "TLS termination di load balancer".

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

For a document, use `embedded.md` § Child path verbatim, then format `markdown`, the text itself as the voice sample,
and `sample.md` inline as the text. The run matrix is fixed in advance (13 runs):
- Baseline: three child-path runs in glossary-none. At least six of eight seeds must remain unfixed in each run;
  otherwise strengthen the sample, record its new hash and repeat the baseline before editing the catalogs.
- After: three child-path runs in glossary-none. Each must fix eight of eight seeds, including `di-scan` and `di-fix`,
  get both kunci seeds right, keep every control and fact, add nothing and leave zero rejected-form leftovers.
- After: one child-path run in glossary-override, expecting dry run for seed 4.
- After: one glossary-override run through `embedded.md` § Inline fallback, expecting dry run. It is valid only with
  no Agent dispatch and the fallback status line.
- After: one glossary-override run through `embedded.md` § Inline path for a commit message, format `plain`, with an
  Indonesian message carrying seeds 1 and 4. Expect `di-scan` and dry run; this is the commit-inline wiring proof.
- After: one child-path run in glossary-unrelated. Every scored field must match the glossary-none result;
  concurrent user stays unchanged.
- After: three `../term-of-art/` runs in a folder with no CONTEXT.md at either discovery path, judged against its own
  `facts.md`: five of five terms of art in English, general words kept Indonesian, fifteen facts kept, nothing added.

For every run, read the model back from the transcript's init line and confirm the same pin. Its Read calls must hit
its own export and read `patterns-id.md` with no offset. Any run with a supplied context is valid only if its
transcript contains a Read tool call on that folder's CONTEXT.md, including `.claude/` for the override; anchor this
check on the tool call, not a text grep. Discard invalid runs, record the reason and rerun them.

Judge each run from its own transcript's final result. Strip status lines, shuffle labels and give the finals to a
fresh reader who did not write the brief. The judge reports the observed form per seed and per control, facts kept
and anything added; the coordinator maps the arms afterwards. A second query mechanically searches each final
case-insensitively, whole word, for the eight rejected forms and every control; first-use italics are tolerated. The
judge and search must agree; the coordinator reads and records any disagreement.

Translate and standalone share the catalog route but are judgment ticks, not additional runs in this matrix. On an
eval miss, allow one bounded catalog retry, then three fresh after-runs on the new commit; a further failure goes to
the owner. Recorded evidence belongs below, including the sample hash, commit and model pins, per-run transcripts,
discarded runs, judge results and mechanical searches.

## Recorded runs

none yet
