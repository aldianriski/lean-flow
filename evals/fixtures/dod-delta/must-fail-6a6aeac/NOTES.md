# must-fail-6a6aeac

The real motivating artifact (SPRINT-101 T3), extracted verbatim via git, never hand-written:

    git show 6a6aeac^:docs/sprint/SPRINT-094-guards-for-what-nothing-reads.md > old.md
    git show 6a6aeac:docs/sprint/SPRINT-094-guards-for-what-nothing-reads.md > new.md
    git show -s --format=%s 6a6aeac > subject.txt

Subject: `sprint(094) T1: widen the epic checker with rollup currency, 5 of 6 DoD`.

Ground truth (read from the real diff, not asserted): the commit ticks all 5 of T1's own 6 DoD
items -- an internally consistent claim for T1 alone -- and ALSO ticks one "Seeded-break
discrimination proof" item under T2's DoD block and one under T3's DoD block, neither of which the
subject names. `check-dod-delta.ts` must report exactly those 2 foreign ticks as
`unattributed-tick` findings and FAIL. This is retained per TD-012 -- never deleted with the
prototype that built it.
