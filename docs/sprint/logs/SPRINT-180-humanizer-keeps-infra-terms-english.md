---
sprint: 180
slug: humanizer-keeps-infra-terms-english
owner: Maintainer
last_updated: 2026-11-16
status: active
update_trigger: an Execution Log entry is appended
---

# SPRINT-180 — Execution Log

> Append-only companion to [`../SPRINT-180-humanizer-keeps-infra-terms-english.md`](../SPRINT-180-humanizer-keeps-infra-terms-english.md). Uncapped by design:
> this file grows with the work done, which is exactly why it is not inside the Plan's 400-line
> budget (STANDARD §9). **Never edit a past entry** — correct it with a new one.
>
> Rendered at promote, in the same commit as `plan locked`; its first entry is the `promote` entry
> carrying the signed governance checklist.
>
> The Plan is frozen at promote. A mid-sprint pivot that shifts scope is logged here as a
> `scope-change` entry — what broke · impact · re-confirm G2 — **before** § Plan is edited.
> Its heading names every `Tn` it changes, and every path the entry names sits in one of those tasks' `Layers:` or `Cites:`.


### 2026-11-16 | promote | plan locked, 1 member: TASK-672 (1 plan step)
Owner rulings, verbatim: "Delete now (Recommended)" (the §11 prune: TASK-659, 660, 663 and 665, closed at least 3 sprints ago with no live citation, deleted in their own commit `86def8bf` before plan locked) · "Sign as shown" (the governance checklist and the sprint draft).
The coordinator ran `/lean-flow:lean-doc-generator promote`; a worker did the scan and draft, then the writes after the sign-off.
Promote governance checklist, signed by the owner by popup. Answer, verbatim: "Sign as shown".
- ☑ L-promotion: none. The handoff's L-306 and L-319 were already promoted at the SPRINT-179 promote (`57d65d5a`). Two selections agree: every `## L-` entry with count 2 or more and `promoted: no` returns none (73 of 305 entries are active, none with count 2 or more); the active entries with two dated sightings (L-314, L-304, L-272) all carry count 1, both sightings in one sprint.
- ☑ TD aging: 120 open rows (76 low, 24 minor, 13 medium, 7 trivial, none high), 119 aged three sprints or more against sprint 180; the one younger row is TD-316 (filed at 178, crosses at the SPRINT-181 promote). A row parse and a `grep -c` both give 120. Nothing escalates. Disposition: keep all open, no re-review sweep.
- ☑ TD deletion, §11: none; no row is `resolved`.
- ☑ doc-aging, §11 and §2 caps: `check-doc-caps.ts` 103 PASS, 0 FAIL, 0 WARN. CHANGELOG rotation not due (v2.24.0 and v2.23.0 inline). LEARNINGS pointer-collapse deferred to the close compaction sweep. §11 task-file prune: 4 files eligible (TASK-659, 660 of SPRINT-174; TASK-663 of SPRINT-176; TASK-665 of SPRINT-177), nothing live cites them (a scan of 929 live `.md` files and a `git grep` with the history paths excluded agree; 93 other closed files are kept because cited); approved and deleted in `86def8bf`. Not eligible by the rule's text: 8 uncited `done/` files with no `sprint:` stamp (TASK-596, 607, 608, 613, 616, 617, 621, 639). Caps at the limit: `.claude/CONTEXT.md` 150 of 150, `.claude/CLAUDE.md` 79 of 80, token budget ~12680 of 12691; TASK-672 touches none of them.
- ☑ epic rollup currency: EPIC-025 (rows for SPRINT-172 and SPRINT-173 carry their `close_commit`, header 2026-11-15) and EPIC-026 (row for SPRINT-178 carries `dfd668f7`, header 2026-11-16). None.
- ☑ epic coverage: EPIC-025 has 1 open condition, covered by `→ next slice: workdoo sprint (Sprint B)`. EPIC-026 has 3 open conditions, all marked `→ next slice: …`. 0 uncovered. TASK-672 advances none of them: no `epic:`, no override.
- ☑ roadmap coverage: none (`docs/product/roadmap.md` is absent).
- ☑ handoff ledger: none live; the latest entry for the one path is `spent`.
Sprint number: 180, the maximum in use plus one. Four selections all gave 179: `git ls-files docs/sprint`, the archive plans, the archive logs, the INDEX lines; `.claude/worktrees/` absent.
Composition: 1 member, size S, no epic, no stream. Commits: filing `2be92fcd`, prune `86def8bf`, status move `40677313`.
Baseline gate (off-host, run by the coordinator on clean HEAD `2be92fcd`, settings inline per L-324):
```
gate-remote: ran 2be92fcd8918dc38ef64c6e3592778f6fe20a1e4
bun test rc: 0
bun test: 638 pass, 0 fail (rc 0)
qa-check rc: 0
qa-check: QA-CHECK: 225 pass, 0 fail (rc 0)
exit 0
```
G1 and G2 are not yet signed; `gates_signed` is omitted from the frontmatter until both are signed and relayed verbatim.
consequence · T1 · behaviour:low · governance:low

#### Dispatch-trial record (carried verbatim from the coordinator's record)
# Dispatch trial — per-dispatch record (carry into the trial sprint's Log at promote)

Fields (CONTEXT dispatch-trial): role · cell (model+effort) · reported tokens · retries · findings · who ruled them real

| # | Date | Role | Cell | Reported tokens | Retries | Findings | Ruled real by | Fired? |
|---|---|---|---|---|---|---|---|---|
| 1 | 2026-11-16 | intake worker (humanizer calque, round 1) | sonnet · medium | 89,804 (baseline 86.5k → +3.8%; 20% bar not met, under 1.25× cap) | 0 | 0 misses: coverage claims spot-checked (terms-of-art L121, Keep list L138 pindai/unggah, 0 of 6 sampled pairs present) | coordinator | yes (session coordinator read dispatch.md) |
| 2 | 2026-11-16 | intake worker (resume, round 2 → draft) | sonnet · medium | 94,817 cumulative (round delta ≈5.0k) | 0 | 1 miss caught by coordinator review in round 1 output: coverage map omitted the KBBI coinage table (patterns-id L92-119) → counts against the cell | coordinator |
| 3 | 2026-11-16 | intake draft check (strongest tier, blind pair 1 of 2; draft ~10 KB, S task) | fable · high | 103,369 | 0 | 2H 3M 4L. Coordinator verified against repo: H1 real (embedded.md item 3 passes text/voice/format only; item 7 UNAVAILABLE would drop the pass), H2 real (uji fio L58, lapisan L29 in catalog's own after-examples), M1 real (L136 note already exists), M2 real (no v2.24.0 tag); M3, L1-L4 plausible, not yet checked | coordinator | yes |
| 4 | 2026-11-16 | intake draft check (blind pair 2 of 2, comparator) | codex exec · default | 102,781 | 0 | 1H 1M 2L. H1 (kunci boxes contradict: L56 → "dependency" vs L68 control unchanged) real, MISSED by Fable. M (wiring) = Fable H1, shallower. L3 = Fable L1. L4 (tier rationale: L-007 binds all tiers, ADR-029:68) real, minor | coordinator | yes |

Pair 1 verdict (intake draft check): Fable unique real = H2, M1, M2 (+M3 plausible) → cell condition "≥1 real finding the pair missed" MET. Cost 103,369 / 102,781 = 1.006× (cap 2×). Codex unique real = kunci contradiction. Strongest-tier dispatches used: 1 of 6.

| 5 | 2026-11-16 | intake worker (resume, revision 2) | sonnet · medium | 110,830 cumulative (round delta ≈16.0k); intake cell total 110.8k vs baseline 86.5k = 1.28× → OVER the 1.25× cap (note: baseline intake had 3 resumes; this one had 3 too, incl. a 13-finding revision) | 0 | revision answered 13 of 13 findings (coordinator checked the change list) | coordinator | yes |
| 6 | 2026-11-16 | intake draft check round 2 (blind pair 1 of 2) | fable · high | 112,524 | 0 | 0 blocking, 11 G2 notes (N1 di-test unreachable · N2 lapisan · N3 kunci leftover grep vs control · N4 glossary _Avoid_ scope unbounded (consumer) · N5 unconditional CONTEXT read cost · N6 count unexercised · N7-N11 low) | coordinator (pending verify) | yes |
| 7 | 2026-11-16 | intake draft check round 2 (blind pair 2 of 2) | codex exec · default | 102,973 | 0 | 0 blocking, 3 notes: kunci contextual leftover (= Fable N3) · counts unobservable in embedded (= Fable N6) · "no glossary behaves exactly as before" contradicts the global change — real, MISSED by Fable | coordinator | yes |

Pair 2 verdict: Fable unique real = N1 (di-test unreachable, evident in draft L88 vs L55-56), N4 (glossary _Avoid_ scope; coordinator verified CONTEXT.md.template L30-36), N2, N5 → condition MET. Cost 112,524 / 102,973 = 1.09× (cap 2×). Codex unique real = Negative-box contradiction.
Intake draft check cell: 2 samples, both met → eligible for keep at TASK-671 (n=2 minimum). Strongest-tier used: 2 of 6.
Coordinator folded 4 in-draft contradictions (N1, N3, N4, Codex #3) as one-clause fixes into TASK-672-draft-final.md; rest → Assumes as G2 notes. No third review round.

| 8 | 2026-11-16 | intake worker (resume, write after approve) | sonnet · medium | 125,493 cumulative (write delta ≈14.7k); intake cell final 125.5k vs baseline 86.5k = 1.45× (vs baseline's final resume 96k = 1.31×) → over the 1.25× cap either way; note 5 resumes here (2 grill rounds + 2 review revisions folded into one + write) vs baseline's 3 | 0 | 0 misses: 10/10 boxes match the approved draft; only template reshaping | coordinator | yes |

Intake committed 2be92fcd (round count 2 recorded in the message).

Coordinator self-check findings (logged before either reviewer, not shown to them): (a) DoD box 1 carries "rule wording TBD in build" — a passive placeholder in a frozen artifact (CLAUDE.md anti-pattern); reword as "drafted at build, settled at G2". (b) none else.

| 9 | 2026-11-16 | promote worker (scan and draft) | sonnet · medium | 195,905 (baseline 151k → 1.30×, over the 1.25× cap) | 0 | L-306/L-319 stale flag in the handoff (already promoted at `57d65d5a`); 4 §11 prune candidates the SPRINT-179 promote did not report; a stray `=2` file the worker created and removed (a worker slip, not a finding) | coordinator: stale flag real, 4 prune candidates real (owner approved deletion) | yes |
| 10 | 2026-11-16 | promote worker (resume, writes after sign-off) | sonnet · medium | filled by the coordinator at report time | | | | |

Strongest-tier used: 2 of 6.
Coordinator note: baseline off-host gate run by the coordinator, not the worker: LF_GATE_* is not in the worker environment (L-324); the brief said so this time.

### 2026-11-16 | progress | dispatch-trial: row 10 tokens, promote cell total

Row 10 (promote worker, resume, writes after sign-off) reported 210,964 tokens cumulative, so the resume itself took about 15.1k. Retries 0. Findings 0: the coordinator re-ran `promote-check` on its own (`promote-check: PASS -- 4 pass, 0 fail`), and `git status` was clean after b190c6e1.
Promote cell total: 211.0k against the 151k baseline, which is 1.40×, over the 1.25× cap. Strongest-tier used: 2 of 6.

### 2026-11-16 | gate | G1 passed for T1 (TASK-672), fast-path

origin: decomposer, so G1 is one confirm. Owner, verbatim: "Unchanged (Recommended)". The same popup also took three G2 intent rulings, verbatim:
- verb uji: "Compounds only (Recommended)"
- lapis: "'lapis' only (Recommended)"
- bare kunci: "Owner phrase only (Recommended)"
The G2 design draft is in the coordinator's scratchpad until sign-off.
Coordinator's own G2 check, logged before any reviewer saw the design (trial pair for the G2 design check cell):
- (a) 15 candidate rows plus 3 compound rows gives 18 rows, against Q2's "12-15" and box 1's "about 12 to 15". Move the compounds into the one-liner.
- (b) The design does not pin the model for the headless runs. Baseline and after must run on the same model.
- (c) The inline-fallback wiring run is the only non-child proof. The commit-inline path is not run; it reads the same catalog, so the proof holds by construction only.

### 2026-11-16 | progress | T1 G2: builder check and the G2 design check (dispatch trial)

builder-check · T1 · 4 contradictions · 5 questions · coordinator settled all of them in design revision 2: 15 table rows; `lapis` became a scoped row, so it is not in the one-liner (box 2); "inti data" is a seed; override at `.claude/CONTEXT.md`; "Queue worker" casing; one bounded eval retry.
Dispatch-trial rows:

| # | Date | Role | Cell | Reported tokens | Retries | Findings | Ruled real by | Fired? |
|---|---|---|---|---|---|---|---|---|
| 11 | 2026-11-16 | builder-check reader (T1) | sonnet · low | 66,026 (baseline 62k → 1.06×; 20% bar not met, under the 1.25× cap) | 0 | 4C 5Q. C2 (`lapis` in the one-liner contradicts frozen box 2) was real and missed by the coordinator. The rest were real or factual and settled. | coordinator | yes |
| 12 | 2026-11-16 | G2 design check (T1; no same-unit comparator; counts toward the cap) | fable · high | 141,419 | 0 | 1H 9M 9L. Confirmed the coordinator's (a), (b) and (c). Unique and real: H1 (the override proof could not tell "followed the glossary" from "missed the seed"; fixed with a third form, "dry run", plus a Read-call validity rule), M3 (the Keep-list note needed explicit precedence or the controls are at risk), M4 (the unrelated control was vacuous), M7 (Translate target), M8 (seeds unnamed; the di-fix affix was unreachable), M9 (run validity). M1 and M5 overlapped the builder check. | coordinator | yes |

G2 design check pair verdict: the cell condition holds, since Fable produced real findings the coordinator's own check missed (H1, M3, M4, M7, M8, M9). No same-unit token comparator exists, so the count cap applies instead. Strongest-tier used: 3 of 6.

### 2026-11-16 | gate | G2 signed for T1 (TASK-672), design revision 2

Owner, verbatim: "Sign G2 (Recommended)". The question covered design revision 2, including about 13 runs and 5-6 USD, plus the three wording rulings: unggah applies to the noun unggahan only, discovery uses the project root or the working folder, and UNAVAILABLE is cited by name.
gates_signed: G1,G2 @ 374b0fca, set in the sprint frontmatter in this commit. The three rulings are also appended to the member file under `## G2 rulings`.

Approved design (the G2 record, verbatim; its quoted Done when is omitted here because the member file holds it):

> # G2 design — SPRINT-180 T1 (TASK-672), revision 2 (after builder check + G2 design check)
> 
> Repo: D:\Project\lean-flow · HEAD faa8af3d · plan_commit 4579e335 · member file
> `docs/work/todo/TASK-672-indonesian-infra-text-uses-english-term-not-calque.md` (frozen DoD quoted at the end).
> `git diff 3e31706d HEAD -- skills .claude-plugin` is empty (checked 2026-11-16).
> 
> ## Owner rulings at G1 (verbatim answers)
> - G1: "Unchanged (Recommended)".
> - Verb uji: "Compounds only (Recommended)".
> - Lapis: "'lapis' only (Recommended)".
> - Bare kunci: "Owner phrase only (Recommended)".
> 
> ## Approach (and WHY)
> Fixture first and committed (frozen sample), baseline runs on the unchanged catalogs (the pin: the fixture must fail
> there), then the text edits, then after-runs on the build commit, the term-of-art re-run, a blind judge plus a mechanical
> second query. WHY: the claim is model behaviour (tier X); only runs prove it, and a baseline run before the edit keeps
> "fails on the baseline" honest. Rejected: edit first and export an old commit later (wrong-export risk, the TASK-525
> discard); a new glossary file or caller edits (owner Q1 + intake review: one route, no caller edits).
> Builder: Codex in a worktree for the text and fixture files (owner rule: Codex default builder); coordinator reviews,
> commits as `sprint(180) T1: …`. Runs: a test-runner worker (trial cell mechanical-ingest · low) launches them; the
> coordinator reads every per-run transcript file itself (never the runner's summary). Judge: a fresh reader (execution).
> 
> ## Business facts touched
> - "Curated, not copied" (requirements § Business goal): only the delta over the existing surface (L-017); the owner's
>   pair list is the only source.
> - Consumer side (CLAUDE.md DoD, L-015): shipped text names no lean-flow or bnpt path; discovery uses the shipped
>   CONTEXT.md convention; a missing glossary is a no-op.
> 
> ## Files (all inside T1's Layers)
> `skills/humanizer/references/patterns-id.md` — § B Term policy only:
> 1. L123-124: widen the scope and the tell from "a spec name" to "an English term practitioners say in infra and process
>    text" (sizing, infrastructure, specs, test plans, runbooks, migration plans). Existing 5 rows kept.
> 2. Table, exactly 15 rows (box 1 "about 12 to 15"; Q2): 14 candidates — gladi→rehearsal, sinkron akhir→final sync,
>    salin penuh→full copy, pembekuan kode→code freeze, terminasi TLS→TLS termination, reboot tertunda→pending reboot,
>    sensor jebakan→deception sensor, kontainer→container, daftar periksa→checklist, zona waktu→timezone, worker
>    antrean→queue worker, tutup temuan→fix findings, temuan kritis→critical findings, inti data→core database — plus one
>    `lapis` row scoped to infra terms: "lapis (lapis 2, lapis keamanan) → layer (layer 2, security layer); `lapisan` stays
>    Indonesian". (`riwayat` moves to the one-liner as ambiguous: riwayat login, riwayat insiden.)
> 3. One-liner (English in infra or process text, Indonesian in general text): jendela, cabang, gerbang, rahasia, konsumen,
>    bersihkan, tanda tangan, unggahan, dikeraskan (→ di-hardening, owner pair), sapuan/tersapu/pemindaian, berdiri
>    sendiri, riwayat (only for repo history → git history), and the compounds pengujian→testing, daftar uji→test case,
>    penguji UAT→UAT tester. No bare `uji`, no bare `lapis` (box 2).
> 4. One audience-judgment sentence: kept words gelombang, layanan pendukung, keputusan kunci, berkas, salinan; `lapisan`
>    and bare `uji` (incl. "uji fio") stay Indonesian.
> 5. One kunci rule: "kunci API" → API key; "kunci" meaning a critical dependency → dependency; "keputusan kunci" kept;
>    a bare credential "kunci" left alone; a key-factor sense never becomes "API key".
> 6. One cross-reference line under the KBBI table: domain calques → § Domain terms of art.
> 7. L136 note amended in place, additive (one note): a domain row or a listed one-liner word wins even where a Keep-list
>    word would translate it (this keeps "pengguna simultan → concurrent user" working); every other Keep-list word stays
>    Indonesian in infra text too — explicitly naming that `basis data` stays (box 3). In infra text pemindaian → scan and
>    the noun unggahan → file upload.
> 8. L140-142: "stays Indonesian" → "stays Indonesian in general text; the infra noun unggahan → file upload follows
>    § Domain terms of art". Verb unggah/mengunggah untouched.
> 9. New subsection "Host glossary (optional)": applies when the text, or a Translate target, is Indonesian or mixed.
>    Discovery: the project root (the repo root), or the working folder when there is no repo; read `.claude/CONTEXT.md`,
>    else `CONTEXT.md`; the section whose heading starts `## Domain Glossary`. An entry acts only where it names a row or a
>    one-liner word of § Domain terms of art; there it wins and its `_Avoid_` forms are the rejected forms. Every other
>    entry is ignored. No file, no section, or unreadable → nothing overridden, pass continues; a missing glossary is not
>    something the pass needs, so `embedded.md`'s UNAVAILABLE rule (cited by name) does not apply.
> 
> `skills/humanizer/SKILL.md` — step 6, two lines max (120 → ≤122): after a domain-term swap, search the draft
> case-insensitively, whole word, for each rejected form swapped, in its rejected sense; controls, kept phrases and
> never-touched zones (code, headings or table cells the mode keeps) are not leftovers; fix any found; repeat on the final
> in step 7. No fifth reported count — "four tells" (L59, L66, L70) and README unchanged on that point.
> 
> `README.md` L204 — one clause: Indonesian infra calques and an optional host-glossary override.
> `CHANGELOG.md` `[Unreleased]` — one line.
> 
> `evals/fixtures/humanizer/domain-calque/`:
> - `sample.md` — synthetic Indonesian infra memo (~200 words, invented org, no bnpt text). Every seed sits in running
>   prose (no heading, table cell or inline code). The 8 seeds and expected forms:
>   1. "seluruh VM sudah tersapu" → "sudah di-scan"
>   2. sentence-initial "Worker antrean berjalan di …" → "Queue worker berjalan di …"
>   3. "temuan tersebut sudah ditutup" → "findings tersebut sudah di-fix"
>   4. "gladi dijadwalkan Rabu" → "rehearsal dijadwalkan Rabu"
>   5. "sinkron akhir pukul 22.00" → "final sync pukul 22.00"
>   6. mixed casing "Pembekuan Kode berlaku sejak …" (mid-paragraph) → "Code freeze berlaku sejak …"
>   7. "inti data pindah ke host baru" → "core database pindah ke host baru"
>   8. "terminasi TLS di load balancer" → "TLS termination di load balancer"
>   kunci seeds (scored separately): "NFS menjadi kunci gelombang kedua" → "NFS menjadi dependency gelombang kedua";
>   "kunci API layanan pembayaran" → "API key layanan pembayaran".
>   Controls (must stay): berkas, salinan, gelombang, "keputusan kunci", "basis data", "lapisan", "uji fio", "pengguna",
>   and the English "concurrent user" (the unrelated glossary's `_Avoid_: User` target).
> - `facts.md` — facts, the expected form per seed, the controls, what counts as added.
> - `glossary-none/CONTEXT.md` — a CONTEXT.md with no § Domain Glossary (lean-flow's own state).
> - `glossary-override/.claude/CONTEXT.md` — § Domain Glossary with "**Dry run**: … _Avoid_: gladi, rehearsal" (a third
>   form neither the catalog nor the sample produces; exercises the `.claude/` leg).
> - `glossary-unrelated/CONTEXT.md` — § Domain Glossary with "**Member**: … _Avoid_: User, Seat" (the template's own
>   example; must not turn "concurrent user" into "concurrent member").
> - `NOTES.md` — protocol and the recorded runs (written by the coordinator after the runs, committed under T1).
> 
> Coordinator-owned (not design files): the member file's ticks and move, the sprint Log.
> 
> ## Micro-tasks and checks
> - M1 Fixture files (Codex), committed before any run; record `sample.md`'s `git hash-object` for both arms.
> - M2 Baseline: export `3e31706d` (`git archive 3e31706d skills .claude-plugin`, own folder); confirm
>   `git diff --quiet 3e31706d <build parent> -- skills .claude-plugin`. 3 runs in glossary-none. Pin: ≥6 of 8 seeds left
>   unfixed in each of 3 runs; else strengthen the sample (new hash recorded) and re-run before M3.
> - M3 Text edits (Codex; one bounded builder retry after review).
> - M4 After-runs on an export of the build commit (own folder):
>   - 3 child-path runs in glossary-none (global rules apply with no glossary);
>   - 1 child-path run in glossary-override (expect "dry run" for seed 4);
>   - 1 inline-fallback run in glossary-override (`embedded.md` § Inline fallback; expect "dry run"; valid only with no
>     Agent dispatch and the fallback status line);
>   - 1 commit-inline run in glossary-override (`embedded.md` § Inline path, format `plain`, an Indonesian commit message
>     carrying seeds 1 and 4; expect "di-scan" and "dry run") — the task Assumes' commit-inline wiring proof;
>   - 1 child-path run in glossary-unrelated (expect the glossary-none result on every scored field; "concurrent user" kept);
>   - 3 term-of-art re-runs in a folder with no CONTEXT.md (absent-file case).
>   13 runs in total (with M2). Box 4's Translate and standalone paths are judgment ticks (same catalog read; not run).
> - Run validity (every run): same `--model <pinned>` on every run, read back from each transcript's init line; the run's
>   Read calls hit its own export and read `patterns-id.md` with no offset; a glossary run is valid only if its transcript
>   holds a Read tool call on that folder's CONTEXT.md (anchored on the tool call, not a text grep). An invalid run is
>   discarded and re-run, and the discard is recorded.
> - M5 Judge: a fresh reader, labels shuffled, reports the observed form per seed and per control for each final (status
>   lines stripped first); the coordinator maps arms afterwards. Second query: a mechanical whole-word grep of each final
>   for the 8 rejected forms and the controls (first-use italics tolerated). Judge and grep must agree; a disagreement is
>   read by the coordinator and recorded.
> - Eval miss: one bounded catalog retry (M3 again), then 3 fresh after-runs on the new commit; still failing → owner.
> 
> Run protocol otherwise per `term-of-art/NOTES.md`: one headless `claude -p --setting-sources local --plugin-dir <export>
> --add-dir <export> --output-format stream-json --verbose --model <pinned>` process per run, trusted folder outside the
> repo, each export in its own folder, judged from each transcript's final result.
> 
> ## Verification per Done-when box (EXISTS · RUNS · REACHES · PROVES)
> 1. Widened rule — judgment tick on the text; PROVED by M4's 3 glossary-none runs (8 of 8, both kunci).
> 2. After-examples — mechanical: `git diff` shows no edit at patterns-id L29/L58, patterns-lf L71/L75; the controls
>    "lapisan" and "uji fio" in every M4 final PROVE the rule leaves them.
> 3. Keep-list note — `git diff` of L136-142 (one note, additive); "basis data" control in every final.
> 4. Glossary route — `git diff --stat` shows no `embedded.md` or caller edit (mechanical); PROVED for child, inline
>    fallback and commit-inline by the override runs ("dry run" + the Read-call validity rule), and for "ignored entries"
>    by the unrelated run; Translate and standalone: judgment tick, said so.
> 5. Step-6 rule — grep SKILL.md; `wc -l` ≤ 122; PROVED by zero leftovers in M4 finals (grep + judge).
> 6. Fixture — files exist (mechanical); contents match this record (coordinator reads them against facts.md).
> 7. Baseline and pass — M2/M4/M5 records: judge table + grep, per run.
> 8. Term-of-art re-run — 3 runs judged against `term-of-art/facts.md`.
> 9. README/CHANGELOG — grep (mechanical).
> 10. Negative — controls in every final; glossary-none runs (global rules still apply); unrelated run; baseline failure.
> Gate: off-host QA_FULL at close.
> 
> ## G2 rulings this design records against frozen wording (sign-off covers them; logged in the member file)
> - Box 3 "the domain rule wins for `pindai` and `unggah`" is applied to the noun unggahan only (the box's next sentence
>   names only unggahan→file upload; the verb unggah stays, protecting the "mengunduh"/upload controls).
> - Box 4 "at the repo root" → "the project root (the repo root), or the working folder when there is no repo" (the
>   fixture runs in a non-repo trusted folder).
> - Box 4 "outside `embedded.md` item 7" → cited by name (the UNAVAILABLE rule), so a renumbering cannot strand it.
> 
> ## Authority, risk, ADR, cost
> J1, HITL, risk low, tier X, size S. No ADR. No auth/input/secrets surface.
> Cost: 13 headless runs + 1 judge + 1 Codex build; ~0.4 USD per run by `behavioral-eval-feasibility` → about 5-6 USD.
> 

### 2026-11-16 | progress | T1: fixture, baseline pin and text build

- worker · T1 M1 · codex exec · gpt-6.1-sol · worktree D:\Project\lean-flow-worktrees\s180-t1. The fixture landed as 520ac6d1 (sample hash c843bd27). Codex reported 61,882 tokens. The coordinator re-counted seeds and controls (each appears once) and found no leaked expected forms.
- worker · T1 M3 · codex exec · gpt-6.1-sol · same worktree. The text edits landed as 5a50d0b3 (Codex reported 74,035 tokens). The coordinator fix 90081415 covers 3 findings from the coordinator's own diff read: the owner's pairs for tanda tangan → sign and bersihkan → cleanup, and the glossary entry now acts through its `_Avoid_` forms. Without that, the override fixture could not fire.
- Run model pinned to `--model sonnet` (claude-sonnet-5-5) for every run, because the child path inherits the session model (`embedded.md` § Child path). Runs execute in trusted `D:\Research\s180-evals`.
- The first baseline round was discarded unjudged. All 3 runs returned UNAVAILABLE: the headless Skill call was denied and the catalogs were never read.
- A retry passing `--allowedTools` to the child was denied by the auto-mode classifier as undermining oversight, and was not worked around. Owner ruling, verbatim: "Name skill path (Recommended)". With no permission change, the prompt names the export's humanizer folder as an input, so the child takes item 1's own fallback, reading SKILL.md from there. Every arm uses this route.
- Baseline round 2 (sample c843bd27) was valid, but run 2 fixed code freeze, final sync and TLS termination through the existing infra rule. That left 5 of 8 unfixed, short of the pin. The sample was strengthened under the DoD's escape (17dc37ee, hash b2e4ef38): seeds 5, 6 and 8 became salin penuh, Daftar Periksa and sensor jebakan.
- Baseline round 3 (sample b2e4ef38, export 3e31706d, identical to HEAD for skills and .claude-plugin before M3). All 3 runs valid (sonnet; every Read on export-base; patterns-id.md read with no offset). Mechanical grep: 8 of 8 seeds unfixed in 3 of 3, both kunci seeds unfixed, so the **pin holds**. Run 2 reworded the controls "keputusan kunci" and "lapisan". Cost $0.18, $0.18 and $0.19. The blind judge scores these finals with the after-runs.

| # | Date | Role | Cell | Reported tokens | Retries | Findings | Ruled real by | Fired? |
|---|---|---|---|---|---|---|---|---|
| 13 | 2026-11-16 | test runner (baseline runs) | haiku · low | 58,082 cumulative over 4 rounds (round 1 51,433; round 2 53,247 denied; round 3 55,757; round 4 58,082); baseline 51.5k; first round 1.00×, total 1.13× | 3 (harness rounds, not runner errors) | 0 misses: each verdict line matched the coordinator's own transcript read; no false "ready" | coordinator | yes |
