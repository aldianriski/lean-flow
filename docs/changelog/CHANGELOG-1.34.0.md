---
owner: Maintainer
last_updated: 2026-08-10
update_trigger: a MINOR version rotates out of the root CHANGELOG
status: current
---

# lean-flow — Changelog v1.34.0

> Rotated out of the root `CHANGELOG.md` when **v1.36.0** landed (§11: keep current + previous minor
> inline). Older releases → [`CHANGELOG-1.33.0.md`](CHANGELOG-1.33.0.md).

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

