---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: Sprint completed and changes reflected in docs
status: current
---

# lean-flow — Changelog

<!-- Prepend new sprints — newest first. Append-only; never edit past blocks. -->

---

## v1.34.0 — Make Room (2026-08-10)

MINOR — SPRINT-060, **4 of 5 units**. Three tasks were written to confirm something and ended up
overturning it. The sprint's real output is four corrected beliefs, two of which had been sitting in
the ledger for sprints.

**What changed for you:**

- **`CONTEXT.md`'s cap moves 130 → 150** (ADR-017). The task was written to delete duplicated prose —
  TD-006 and L-008 have both described the file as "accreting its satellites' prose" for sprints.
  Diffed section by section, **there was none**: every section touching a satellite's territory already
  ends in a pointer, and the duplication runs the *other* way (README summarises CONTEXT and defers to
  it as SSOT). What actually drives growth is **0.83 lines per sprint of promoted rules** — the
  learning loop depositing durable rules where multi-flow ones belong. The file was at its cap because
  the mechanism works. Kept **hard** on purpose: the forcing function is what produced the measurement.
- **A soft cap can no longer be grandfathered.** ADR-015 ruled the grandfather list records hard-cap
  breaches only, and its own Consequences admitted "nothing enforces rule 2 yet". It does now, with a
  named finding and two fixtures differing in exactly one variable. Failing the rule deliberately does
  *not* suppress the soft-cap report the rule points at.
- **`loop-hygiene-prd.md` is `superseded`.** It had read `current` since July — not because anyone
  judged it current, but because nobody had looked. Nothing moves: §11 archives a superseded doc only
  once nothing live cites it, and five live surfaces cite this one. The corpus just stopped saying
  something untrue about itself.

**For maintainers — the gate's cost is not where two sprints of work assumed it was.** Sections 1–11
were measured **directly** for the first time (two samples, instrumented copy, shipped script untouched
and verifiably byte-identical). The 66/34 split is confirmed at 61–64%. But the split was never the
interesting number: **section 4 alone — knowledge metadata, ADR-009 — is 45–49% of the entire gate**,
75–76 s, larger than all fifteen eval harnesses combined, while seventeen other sections sum to ~14%.
It is also the gate's most *stable* component while the harness half swings 16%. TD-046 is resolved by
this measurement and `TD-050` files the real cost centre, with an explicit warning not to reach for the
obvious narrowing. Gate total re-taken: 130 s @ 131 checks → 154–169 s @ 136.

**Housekeeping:** `L-111` filed (a task's acceptance can depend on a decision no gate has taken yet) and
**`L-107` bumped to count 2** — it recurred inside the sprint that promoted it, one level down. Both it
and `L-108` (count 3) are now promotion-eligible, which the cap raise finally makes possible. `TD-050`
filed, `TD-046` resolved. Three follow-ups (`TASK-188` carried, `189`, `190`). CHANGELOG rotated.
Gate 134 → 135 checks, doc-caps fixtures 7 → 9.

**T5 did not land, and says so.** Exercising the night-run reaper on a genuinely partial Plan needed a
run that stops mid-Plan; the run mode was ruled interactive at G2 — after the Plan froze — which
foreclosed the only vehicle it had. Carried forward with its acceptance explicitly unmet rather than
ticked against its DoD's escape clause. That tension is now `L-111`.

---

## v1.33.0 — Prove the Run Finished (2026-08-10)

MINOR — SPRINT-059. The night-run protocol could tell you a run failed. It could not tell you a run
**stopped early** — and that is the failure that reports `success`.

**What changed for you:**

- **A night run now reports how much of the Plan it finished, at every exit.** The rollup used to
  speak only for non-green tasks, so a run that ended mid-Plan without hitting a blocker wrote nothing
  at all and the morning reader saw a clean page. It now opens with `run · N of M DoD ticked`,
  unconditionally. Measured on a consumer's host before the fix: **4 of 7 units landed, every commit
  correct, tree clean, exit `success`, three tasks never begun and not one line about them.**
- **`unattempted` is a state.** It had no name, which is why those three tasks went *unreported*
  rather than misreported — they were not blocked, parked, denied or stalled. They never began.
- **The rollup is written by the launcher, not asked of the run** (ADR-016). This is the part worth
  reading twice: asking was *tried and measured*. A run whose trigger requested a rollup, a
  calibration row and a park re-check completed every unit of work and wrote **none of the three**. An
  instruction about the work holds; an instruction about bookkeeping does not, because a step that
  happens after the work and that no gate depends on is the first thing an agent drops. So
  `scripts/night-run.sh` emits it from the wrapper that already captures the exit code. Trade named,
  not hidden: this reaches only consumers who use the launcher, and the documented format still has
  to stand alone for everyone else.
- **A recorded run missing its rollup now FAILs the gate**, with two separately-named findings. The
  reaper emits; the checker refuses to let a missing one pass. That pairing is what makes it *gated*
  rather than merely requested.
- **A park the run itself unblocks gets revisited.** The protocol assumed a park outlives the run. It
  can also name a condition the same run satisfies two tasks later — observed: a field parked for the
  renderer, **three** subsequent tasks owned that renderer, none went back. Unattended runs only; an
  interactive run halts at the first blocker with a human present.
- **Two consumer calibration rows**, the table's first `inline` rows and its first from a host that is
  not ours. Read them loosely — different shape, different repo. The figure that transfers: **zero
  denials across 318 turns** after **$1.77** of probing, against a predecessor run that lost ~40% of
  its turns to denials.

**For maintainers — everything found this sprint was found by running something, never by reading it.**
The reaper silently dropped a task, because a whole-file grep matched a worked example in the log's own
prose. The park assertion's first draft **could only ever exit 0** (its loop was behind a pipe, so
`fail=1` died in a subshell) and, once fixed, still **passed the violation** because it searched for the
word "revisit" and the fixture's slug was `unrevisited`. The end-to-end night run reported a wall-clock
of `2 min` for a measured 163 s — correct arithmetic, 40% low, always in the same direction. Three of
the four are one pattern: a substring standing in for a structural claim, failing *green*.

**Housekeeping:** three learnings filed (`L-108` substring-vs-contract, 3 sightings · `L-109` the pipe
that swallows a failure · `L-110` how a `Layers:` declaration goes stale), one debt row (`TD-049`), one
follow-up (`TASK-188`). Five resolved TD rows deleted at promote (§11), ledger 281 → 160. Gate 131 →
141 checks, with 6 retained fixtures added. Run cost: $1.59 across two verification runs.

---

_Older releases (**v1.32.0** and earlier) → [`CHANGELOG-1.32.0.md`](docs/changelog/CHANGELOG-1.32.0.md) → [`CHANGELOG-1.31.0.md`](docs/changelog/CHANGELOG-1.31.0.md) → [`CHANGELOG-1.30.0.md`](docs/changelog/CHANGELOG-1.30.0.md) → [`CHANGELOG-1.29.0.md`](docs/changelog/CHANGELOG-1.29.0.md) → [`CHANGELOG-1.27.3.md`](docs/changelog/CHANGELOG-1.27.3.md) → [`CHANGELOG-1.26.0.md`](docs/changelog/CHANGELOG-1.26.0.md) → [`CHANGELOG-1.25.2.md`](docs/changelog/CHANGELOG-1.25.2.md) → [`CHANGELOG-1.24.0.md`](docs/changelog/CHANGELOG-1.24.0.md) → [`CHANGELOG-1.23.0.md`](docs/changelog/CHANGELOG-1.23.0.md) → [`CHANGELOG-1.22.0.md`](docs/changelog/CHANGELOG-1.22.0.md) → [`CHANGELOG-1.21.0.md`](docs/changelog/CHANGELOG-1.21.0.md) → [`CHANGELOG-1.20.0.md`](docs/changelog/CHANGELOG-1.20.0.md) → [`CHANGELOG-1.19.0.md`](docs/changelog/CHANGELOG-1.19.0.md) → [`CHANGELOG-1.16.1.md`](docs/changelog/CHANGELOG-1.16.1.md) → [`CHANGELOG-1.14.2.md`](docs/changelog/CHANGELOG-1.14.2.md) → [`CHANGELOG-1.13.0.md`](docs/changelog/CHANGELOG-1.13.0.md) → [`CHANGELOG-1.12.0.md`](docs/changelog/CHANGELOG-1.12.0.md) → [`CHANGELOG-1.9.0.md`](docs/changelog/CHANGELOG-1.9.0.md) → [`CHANGELOG-1.7.1.md`](docs/changelog/CHANGELOG-1.7.1.md)._
