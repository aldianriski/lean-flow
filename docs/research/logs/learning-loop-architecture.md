---
owner: Maintainer
last_updated: 2026-10-24
update_trigger: a measurement round is appended, or a figure here is re-derived and disagrees
status: active
id: learning-loop-architecture-log
tags: [process, tooling]
domain: governance
related: [learning-loop-architecture]
---

# Learning-loop architecture — Measurement Log

Appendix to [`../learning-loop-architecture.md`](../learning-loop-architecture.md). Append-only: one round per
measurement. Every figure carries its selector. Measured at base `cf275631` (SPRINT-138 in flight); the pre-change
boundary is SPRINT-138's `plan_commit` `ade5c5c3`. Nothing here is estimated: a gap is stated as a gap.

## Round 1 — Inventory of every `## L-NNN` header (docs/LEARNINGS.md, 2026-10-24)

**Selector.** A header counts when it matches `^## L-NNN [tags: …] [status: active|promoted|superseded]` with the
status token in position. A substring match on `status: active` on a header line returns 13, not 11, because the
promoted headers of L-155 and L-127 quote that string inside their own title (a promoted entry counted as active);
counting by the token in position avoids the double count.
**Reconciliation.** 225 headers = 11 active + 213 promoted + 1 superseded (L-084); the list under Round 1 below has
225 rows. `L-001`–`L-246` has 21 retired ids (L-022–L-042), so 246 − 21 = 225.

**Pointer class** (derived from the `→ promoted:` line, see the doc § Findings F6):

| class | n | meaning |
|---|---|---|
| own | 54 | the pointer names a home that belongs to this entry |
| fold | 60 | `merged into L-NNN` (SPRINT-121 T4 families A–I and later folds); the head's home is the home |
| DUP98 | 98 | the pointer is the L-170 cross-check text pasted onto the entry (96 of them record count 1) |
| header-only | 1 | L-144: promoted to `TECH-DEBT.md` TD-066, no pointer line |
| active / superseded | 11 / 1 | not promoted |

Disposition (`disposition:` anywhere in the entry): 68 promoted entries carry one (ids L-160 and above: the
SPRINT-121 T4 folds and every promotion since); 145 carry none, all ≤ L-186 and promoted before TASK-384
(SPRINT-112) made it mandatory. Kinds in use: merge 64 (60 folds + L-182/L-218/L-224/L-238) · move-to-reference 2
(L-217, L-219) · replace 1 (L-242) · retain 1 (L-220) · automate-into-check 0 as a first disposition (1 as a re-check
line, L-229).

Home of the 114 promotions whose pointer is not DUP98 (54 own + 60 fold, fold read through its head): 13 land on an
adopter-visible surface (`skills/**`, `spec/**`: 9 own + 4 folded into L-219/L-224), 101 on a repo-private one
(`.claude/CLAUDE.md` 35 own + folds of L-009/L-020/L-045/L-130/L-166/L-186/L-217, `.claude/CONTEXT.md`, TD).

### Inventory (225 rows; `home` = where the rule says it lives; `count` = max `count N` in the entry, case-insensitive)

| id | status | tag | home | pointer | disposition | count |
|---|---|---|---|---|---|---|
| L-246 | active | tooling | - | - | - | 1 |
| L-245 | active | sprint-model | - | - | - | 1 |
| L-244 | active | process | - | - | - | 1 |
| L-243 | active | process | - | - | - | 1 |
| L-242 | promoted | process | TD | own | replace | 3 |
| L-241 | active | process | - | - | - | 1 |
| L-240 | active | process | - | - | - | 1 |
| L-239 | active | process | - | - | - | 1 |
| L-238 | promoted | edit-safety | CONTEXT | own | merge | 2 |
| L-237 | active | process | - | - | - | 1 |
| L-236 | active | edit-safety | - | - | - | 1 |
| L-235 | promoted | process | fold L-224 | fold | merge | 2 |
| L-234 | active | sprint-model | - | - | - | 1 |
| L-233 | promoted | process | fold L-020 | fold | merge | 1 |
| L-232 | promoted | process | fold L-045 | fold | merge | 1 |
| L-231 | promoted | process | fold L-166 | fold | merge | 1 |
| L-230 | promoted | process | fold L-130 | fold | merge | 1 |
| L-229 | promoted | process | fold L-151 | fold | merge | 3 |
| L-228 | promoted | process | fold L-045 | fold | merge | 1 |
| L-227 | promoted | process | fold L-045 | fold | merge | 1 |
| L-226 | promoted | tooling | fold L-166 | fold | merge | 1 |
| L-225 | promoted | process | fold L-151 | fold | merge | 1 |
| L-224 | promoted | tooling | skill-ref | own | merge | 9 |
| L-223 | promoted | process | fold L-151 | fold | merge | 1 |
| L-222 | promoted | process | fold L-020 | fold | merge | 1 |
| L-221 | promoted | tooling | fold L-166 | fold | merge | 1 |
| L-220 | promoted | process | CLAUDE | own | retain | 2 |
| L-219 | promoted | edit-safety | skill-ref | own | move-to-reference | 6 |
| L-218 | promoted | process | skill-ref | own | merge | 3 |
| L-217 | promoted | process | CLAUDE | own | move-to-reference | 4 |
| L-216 | promoted | edit-safety | fold L-219 | fold | merge | 1 |
| L-215 | promoted | tooling | fold L-219 | fold | merge | 1 |
| L-214 | promoted | tooling | fold L-186 | fold | merge | 1 |
| L-213 | promoted | process | fold L-020 | fold | merge | 1 |
| L-212 | promoted | tooling | fold L-166 | fold | merge | 1 |
| L-211 | promoted | tooling | fold L-009 | fold | merge | 1 |
| L-209 | promoted | process | fold L-151 | fold | merge | 1 |
| L-210 | active | docs | - | - | - | 1 |
| L-206 | promoted | tooling | fold L-130 | fold | merge | 1 |
| L-207 | promoted | tooling | fold L-186 | fold | merge | 1 |
| L-208 | promoted | tooling | fold L-166 | fold | merge | 1 |
| L-205 | promoted | process | fold L-151 | fold | merge | 1 |
| L-204 | promoted | process | fold L-130 | fold | merge | 1 |
| L-202 | promoted | process | fold L-186 | fold | merge | 1 |
| L-203 | promoted | process | fold L-186 | fold | merge | 1 |
| L-201 | promoted | process | fold L-130 | fold | merge | 1 |
| L-200 | promoted | tooling | fold L-045 | fold | merge | 1 |
| L-199 | promoted | tooling | fold L-186 | fold | merge | 1 |
| L-198 | promoted | process | fold L-130 | fold | merge | 4 |
| L-197 | promoted | tooling | fold L-151 | fold | merge | 1 |
| L-196 | promoted | process | fold L-020 | fold | merge | 1 |
| L-195 | promoted | edit-safety | fold L-130 | fold | merge | 1 |
| L-194 | promoted | process | fold L-186 | fold | merge | 1 |
| L-193 | promoted | process | fold L-217 | fold | merge | 1 |
| L-192 | promoted | process | fold L-151 | fold | merge | 1 |
| L-191 | promoted | tooling | fold L-186 | fold | merge | 1 |
| L-190 | promoted | process | fold L-217 | fold | merge | 1 |
| L-189 | promoted | tooling | fold L-186 | fold | merge | 1 |
| L-184 | promoted | tooling | fold L-045 | fold | merge | 1 |
| L-185 | promoted | process | fold L-111 | fold | merge | 8 |
| L-186 | promoted | tooling | CLAUDE | own | - | 3 |
| L-187 | promoted | tooling | fold L-186 | fold | merge | 1 |
| L-188 | promoted | process | fold L-217 | fold | merge | 1 |
| L-169 | promoted | tooling | CLAUDE | own | - | 2 |
| L-183 | promoted | tooling | fold L-020 | fold | merge | 1 |
| L-182 | promoted | tooling | skill-ref | own | merge | 3 |
| L-181 | promoted | tooling | fold L-166 | fold | merge | 1 |
| L-180 | promoted | process | fold L-151 | fold | merge | 1 |
| L-179 | promoted | process | fold L-185 | fold | merge | 1 |
| L-178 | promoted | tooling | fold L-045 | fold | merge | 1 |
| L-177 | promoted | edit-safety | fold L-151 | fold | merge | 1 |
| L-176 | promoted | edit-safety | fold L-151 | fold | merge | 1 |
| L-175 | promoted | process | fold L-185 | fold | merge | 1 |
| L-174 | promoted | tooling | fold L-166 | fold | merge | 1 |
| L-173 | promoted | process | fold L-185 | fold | merge | 1 |
| L-172 | promoted | process | CLAUDE | own | - | 2 |
| L-171 | promoted | edit-safety | fold L-219 | fold | merge | 1 |
| L-170 | promoted | tooling | CLAUDE | DUP98 | - | 3 |
| L-168 | promoted | edit-safety | CLAUDE | DUP98 | - | 1 |
| L-167 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-166 | promoted | tooling | CLAUDE | own | - | 4 |
| L-165 | promoted | tooling | CLAUDE | own | - | 6 |
| L-164 | promoted | tooling | fold L-186 | fold | merge | 1 |
| L-163 | promoted | edit-safety | fold L-009 | fold | merge | 1 |
| L-162 | promoted | process | fold L-185 | fold | merge | 1 |
| L-161 | promoted | process | fold L-009 | fold | merge | 1 |
| L-160 | promoted | process | fold L-185 | fold | merge | 1 |
| L-159 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-158 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-157 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-156 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-155 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-154 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-153 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-152 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-151 | promoted | process | CONTEXT | own | - | 3 |
| L-150 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-149 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-148 | promoted | sprint-model | CLAUDE | DUP98 | - | 1 |
| L-147 | promoted | tooling | CLAUDE | DUP98 | - | 3 |
| L-146 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-145 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-144 | promoted | tooling | other | header-only | - | 5 |
| L-143 | promoted | process | CLAUDE | own | - | - |
| L-142 | promoted | tooling | CLAUDE | own | - | - |
| L-141 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-140 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-139 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-138 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-137 | promoted | tooling | CLAUDE | own | - | 2 |
| L-136 | promoted | process | CLAUDE | own | - | 1 |
| L-135 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-134 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-133 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-132 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-131 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-130 | promoted | process | CLAUDE | own | - | 4 |
| L-129 | promoted | docs | CLAUDE | DUP98 | - | 1 |
| L-128 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-127 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-126 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-125 | promoted | edit-safety | CLAUDE | DUP98 | - | 1 |
| L-124 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-123 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-122 | promoted | process | other | own | - | 2 |
| L-121 | promoted | sprint-model | CLAUDE | DUP98 | - | 1 |
| L-120 | promoted | tooling | CLAUDE | own | - | 7 |
| L-119 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-118 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-117 | promoted | docs | CLAUDE | DUP98 | - | 1 |
| L-116 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-115 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-114 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-113 | promoted | process | CLAUDE | own | - | 6 |
| L-112 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-111 | promoted | sprint-model | CONTEXT | own | - | - |
| L-110 | promoted | sprint-model | CLAUDE | DUP98 | - | 1 |
| L-109 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-108 | promoted | tooling | CLAUDE | own | - | 15 |
| L-107 | promoted | process | TD | own | - | 2 |
| L-106 | promoted | docs | CLAUDE | own | - | 3 |
| L-105 | promoted | process | CLAUDE | own | - | 2 |
| L-104 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-103 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-102 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-101 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-100 | promoted | process | CLAUDE | own | - | 4 |
| L-099 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-098 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-097 | promoted | process | spec | own | - | 2 |
| L-096 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-095 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-094 | promoted | process | CLAUDE | own | - | 2 |
| L-093 | promoted | docs | CLAUDE | DUP98 | - | 1 |
| L-092 | promoted | process | CONTEXT | own | - | 2 |
| L-091 | promoted | process | spec | own | - | 2 |
| L-090 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-089 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-088 | promoted | sprint-model | SKILL | own | - | 2 |
| L-087 | promoted | process | SKILL | own | - | 3 |
| L-086 | promoted | tooling | skill-ref | own | - | 2 |
| L-085 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-084 | superseded | tooling | - | - | - | 1 |
| L-083 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-082 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-081 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-080 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-079 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-078 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-077 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-076 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-075 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-074 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-073 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-072 | promoted | process | CONTEXT | own | - | - |
| L-071 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-070 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-069 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-068 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-067 | promoted | tooling | CLAUDE | own | - | - |
| L-066 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-065 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-064 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-063 | promoted | docs | CLAUDE | DUP98 | - | 1 |
| L-062 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-061 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-060 | promoted | tooling | CLAUDE | own | - | - |
| L-059 | promoted | tooling | CLAUDE | own | - | - |
| L-058 | promoted | tooling | CLAUDE | own | - | 2 |
| L-057 | promoted | tooling | CLAUDE | own | - | - |
| L-056 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-055 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-054 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-053 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-052 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-051 | promoted | docs | CLAUDE | DUP98 | - | 1 |
| L-050 | promoted | docs | CLAUDE | DUP98 | - | 1 |
| L-049 | promoted | process | CLAUDE | own | - | - |
| L-048 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-047 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-046 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-045 | promoted | process | CLAUDE | own | - | - |
| L-044 | promoted | tooling | other | own | - | - |
| L-043 | promoted | edit-safety | CLAUDE | DUP98 | - | 1 |
| L-021 | promoted | tooling | CLAUDE | own | - | - |
| L-020 | promoted | process | CLAUDE | own | - | - |
| L-019 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-018 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-017 | promoted | process | CLAUDE | own | - | - |
| L-016 | promoted | process | CLAUDE | own | - | - |
| L-015 | promoted | process | CLAUDE | own | - | - |
| L-014 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-013 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-012 | promoted | docs | CLAUDE | DUP98 | - | 1 |
| L-011 | promoted | tooling | CLAUDE | DUP98 | - | 1 |
| L-010 | promoted | tooling | CLAUDE | own | - | 3 |
| L-009 | promoted | edit-safety | CLAUDE | own | - | - |
| L-008 | promoted | docs | CLAUDE | own | - | - |
| L-007 | promoted | process | CLAUDE | own | - | - |
| L-006 | promoted | process | other | own | - | - |
| L-005 | promoted | edit-safety | CLAUDE | DUP98 | - | 1 |
| L-004 | promoted | sprint-model | CLAUDE | DUP98 | - | 1 |
| L-003 | promoted | sprint-model | CLAUDE | DUP98 | - | 1 |
| L-002 | promoted | process | CLAUDE | DUP98 | - | 1 |
| L-001 | promoted | docs | CLAUDE | DUP98 | - | 1 |

## Round 2 — Cohort and control traces (docs/LEARNINGS.md + Retros S128–S137, 2026-10-24)

**Cohort selector.** A promoted entry enters when a dated sighting bullet (`- seen:` or a `…sighting` bullet) names a
sprint later than the entry's own promote sprint (`SPRINT-N promote` in the pointer, else `- promoted:` line). Run over
the 206 promoted entries with a parseable promote sprint: 17 hit; L-198 added by hand (its `seen` line says "after
promotion"; promote sprint not parseable); the other 6 unparseable (L-238 L-143 L-142 L-111 L-086 L-058) read by eye:
none has a later sighting. **Cohort = 18 of 213.** SPRINT-121 T4 "fold of L-NNN: SPRINT-M" bullets were excluded as
sightings (they re-date older entries) and counted separately in Round 2b.

Ladder per entry: **A**vailable (written where the flow reads) · **R**eached (loaded in the context that hit the
failure) · **Ac**ted on · **E**ffective (the failure stopped). `?` = no artifact records it; it is never read as yes.

| L | promoted (sprint · home · disposition) | act it governs → required action | A | R | Ac | E | sightings after promotion | update route used |
|---|---|---|---|---|---|---|---|---|
| 108 | S61 · CONTEXT § Gates; widened S64 to CLAUDE § Behavioral Guidelines · none | any count/grep acted on at once → a second query that varies the SELECTION | yes | entry says "in context the whole time" at the 4th, 7th, 12th–14th; ? for the rest | no (18 of 18) | no | 15 (4th–18th) in 11 sprints: 62 63 64 75 79 82 83 102 134 135 136 | bullets appended; placement widened once (S64); rule text lengthened in place; no re-check |
| 218 | S113 · dispatch.md § Merge-back queue · merge | each merge-back → run the cross-cutting legs incl. typecheck | yes | ? | no (S137: harness only) | no | 1 (S137), after 2 before | seen bullet; S138 T3 builds the command 25 sprints later |
| 224 | S114 · dispatch.md rule 5 (Tick) · merge | any write a sprint checker reads → re-run the gate's own checker in its mode | yes | ? | S128 yes (caught by the re-run); S125 ×3, 126, 127, 137 no | no | 7 events in 5 sprints (125 126 127 128 137); 6 failures + 1 hold | count line + pointer line edited; TASK-438 (S126) automates the tick path only |
| 229 | S117 · CONTEXT § Sprint model Layers bullet · merge | widening a task's files → edit the Plan's `Layers:` too | yes | "loaded and reached none of the three" (entry) | no (S118 ×3) | after S120's `automate-into-check` (TASK-411): own shape 0 recorded over 40 scope-change entries; the gate now fails it late | 3 (S118) | the one disposition re-check in the ledger (S120); then folded into L-151 |
| 238 | S134 · CONTEXT § Sprint model · merge | a coordinator write → bare `sprint(N):` subject | yes | yes: each plan's D1 cites it (S134–S138) | yes | yes in 4 sprints | **0** (sightings S131, S133 are before promotion) | none needed: **control, not cohort** |

Other cohort entries (promote sprint → sprints with a later sighting): L-009 47 → 74 · L-020 47 → 74, 129 · L-045 47 → 122,
124 · L-060 47 → 94 · L-100 56 → 75, 83 · L-120 73 → 75, 84, 94 · L-130 76 → 121, 122, 124, 126 · L-144 78 → 78, 84 ·
L-151 81 → 102, 121, 122, 129 · L-166 87 → 122, 124, 127 · L-170 96 → 101 · L-186 96 → 124, 128, 129 · L-198 → 120 ·
L-219 122 → 127. L-120's 5th sighting is recorded as "the promoted rule did NOT hold"; L-144's is "and it recurred
anyway" (its home is `TD-066`, i.e. a measurement, not a rule).

**Control set** (promoted, no later sighting, with a recorded link from rule to act):

| L | exposure | evidence the rule reached the act |
|---|---|---|
| 242 | promotes at S135, S136, S137 (3 of 3) | each promote log writes "TD aging (recorded here, per L-242)"; no aging-sweep note after S133 |
| 238 | plans S134–S138 | D1 line in every plan cites it; `layers observed` attribution findings 0 in S134–S137, 2 in S131–S133 |
| 217 | G2 of S135, S136, S138 | Retros: "censusing a review finding before spending a retry (ADR-053 §5)"; plans declare "Review cap 2" |

Common shape of the three: the rule is written **at the step that performs the act** and the actor **writes a trace
of it into the artifact** they are already producing. The cohort rules live in a reference read at session or dispatch
start, and the act comes later in another phase, with no prompt and no trace. The rest of the promoted corpus (195
non-cohort) is 97 DUP98 pointers · 58 folds (their sightings counted on the head) · 40 own-pointer entries: for the 40,
"no sighting recorded" is the only datum and is not evidence that the placement works (opportunities are not recorded).

### Round 2b — Re-filed recurrences (SPRINT-121 T4 folds)

Selector: `- seen: … (SPRINT-121 T4 fold of L-NNN: SPRINT-M)` bullets on the ten family heads (L-009 L-020 L-045 L-130
L-151 L-166 L-185 L-186 L-217 L-219), M compared with the head's promote sprint. 58 folded entries; **42 were filed
after their head's promotion** (L-009 3 · L-020 5 · L-045 6 · L-130 6 · L-151 9 · L-166 7 · L-186 6); heads L-185 /
L-217 / L-219 were promoted by the fold itself, so 0 of their 11 count. Family membership is SPRINT-121 T4's own
judgement; this log re-uses it and does not re-judge it. Each of the 42 was filed as a NEW id instead of bumping the head.

### Round 2c — Retro-named recurrences vs the ledger (S128–S137)

Selector: each Retro's "Retrieval check" paragraph, every named promoted rule that recurred (a "held" is not counted):
S128 L-224, L-186 ×3 · S129 L-151 family, L-020 · S131 cross-check family ×3 · S133 L-130 family · S134 L-108 ·
S135 L-108 · S136 L-108, L-136 · S137 L-224, L-218 = **15 named**. Present as a sighting on the entry: **10** (all but
S131 ×3, S133 ×1, S136 L-136: L-108 and L-130 carry no S131/S133 mention; L-136 still reads "Seen Sprint-074, count 1").
The ledger undercounts what the Retros name by 5 of 15.

## Round 3 — Extraction (a): catches by checker vs TD rows vs fix commits

**Selector.** "Expensive checker" = a leg of the full gate (`QA_FULL=1`, 111–125 s on the VPS, killed locally under
memory pressure in S129) or a checker the coordinator re-runs after a write. A catch = a system-verify red or a named
finding in a Retro/log for S128–S137. TD rows from `TECH-DEBT.md` (open) and `(TD-NNN)` in `sprint(N) Tn:` subjects
(resolved). A TD id filed in S128–S137 is `TD-255…TD-267` (13 rows; S129, S130, S134 filed none).

| S | red run: leg → cause (class) | L involved | TD row | fix commit |
|---|---|---|---|---|
| 129 | review-depth 300/4 → four reviews logged as prose (bookkeeping) | L-151 family (L-225) | none | `9f668645` |
| 131 | attribution ×2 → commit subjects of coordinator writes (bookkeeping) | L-238 new | none | `91502a86` (10 messages rewritten) |
| 132 | layers-token-matches-nothing → unpruned candidate token (bookkeeping); post-close `epic-state` | L-240 new | TD-261 (epic-state) | `defcde49` |
| 133 | layers observed 292/1 → done-move under a task subject (bookkeeping); rerun: scope-change layers 292/1 → backticked prose read as a path (checker false positive) | L-238 ×2 | TD-262 (§11 wording) · TD-263 (the false positive; fixed S135 T3 `c3019f02`) | `ecffd65c` · `cb070c56` |
| 134 | review-depth-governance-absent 297/1 → owed T3 review skipped (process skip; the review then found a real contradiction) | L-243 new | none | `e862bd50` |
| 135 | prose-density → a 636-char park note by the coordinator (bookkeeping) | none | none | `dd559921` |
| 137 | run 1 environmental (`git clean -x` removed dev deps); run 2 typecheck TS2345 ×2 in T2's tests (content) + scope-change Cites (bookkeeping) | L-218 ×3 · L-224 ×9 | TD-267 (filed, `pre-T1` key) | `e98a7e34` |

Counts: 10 red runs in 7 sprints (S129, 131, 132, 133 ×2, 134, 135, 137 ×2 = 10). Class of the 7 first-red closes:
bookkeeping 5 (S129 131 132 133 135) · process skip 1 (S134) · mixed environment + content + bookkeeping 1 (S137).
**Content defects found by the gate: 1** (S137 typecheck). Checker-side work: **17 of 35 members** touched checker
or harness code (S128 5 · S130 2 · S135 3 · S136 4 · S137 3; selector: member subject `sprint(N) Tn:` naming a
check, guard, harness, parser or gate) and **19 distinct TD rows** were resolved by them (TD-131 205 177 138 154 167
232 233 244 262 263 130 148 062 191 172 163 165 099). Of the 13 TD rows filed in the window, 11 name a defect or proof gap
in a checker, guard, harness or reaper (selector: the row's Summary; the two that do not are TD-260, a rule stated twice,
and TD-262, §11 wording). All 13 are severity low. Gap: the TD ledger records no per-leg catch count,
and the logs record a red only when the coordinator wrote a gate entry (S137's two reds are in the Retro alone).

## Round 4 — Extraction (b): ceremony and review cost, S128–S137 (pre-change baseline, boundary `ade5c5c3`)

**Selector.** Retro `**Cost**` paragraph + the sprint log (`### … | gate`, `review ·`, `scope-change` headings) + the
commit subjects `system verify FAIL`. 10 of 10 Retros carry a Cost line (the ≥8 bar is met). The lines are **not
comparable**: only 6 give any token figure, and what is counted differs.

| S | members · DoD | Cost line gives | QA_FULL runs Cost / log | red | structured reviews | scope-changes |
|---|---|---|---|---|---|---|
| 128 | 5 · 22 | sub-agents ≈1.5M tokens (≈300k/member), Codex 10 rounds | 5 / 5 | 0 | 0 (shape starts S129) | 5 |
| 129 | 4 · 14 | builders ≈260k, Codex 5 rounds | 2 / 2 | 1 | 4 | 0 |
| 130 | 3 · 10 | builders 140k + recon 68k, Codex 5 rounds | 1 / 1 | 0 | 3 | 0 |
| 131 | 4 · 14 | ≈10.2M summed, 7.73M of it T2's raw inline arms (an experiment) | 2 / 2 | 1 | 5 | 1 |
| 132 | 3 · 11 | ≈550k + $0.33, Codex 10 runs | 2 / **3** | 2 | 6 | 3 |
| 133 | 1 · 2 | ≈114k (builder check 60k, review 54k) | 1 / **3** | 2 | 1 | 2 |
| 134 | 3 · 10 | 13 agents, no tokens | 2 / 2 | 1 | 3 | 0 |
| 135 | 4 · 14 | 13 agents, no tokens | 2 / 2 | 1 | 4 | 1 |
| 136 | 4 · 14 | 12 agents, no tokens | 1 / 1 | 0 | 3 | 1 |
| 137 | 4 · 16 | 12 dispatches, no tokens | 3 / 1 logged | 2 | 3 | 2 |

Totals: QA_FULL runs 21 by the Cost lines, **24** by logs and commits (S132 +1, S133 +2, S137 reds unlogged); red runs
10; first-run red in 7 of 10 closes (log: 6, commits: 6, Retro adds S137). Reviews 32 in 9 sprints. **Findings:** no
sprint reports tokens on a common scope, so a cost-per-sprint series cannot be built from the Cost lines; the only
quantities comparable across all 10 are members, DoD, QA_FULL runs, reds and reviews. The Cost line undercounts runs in
2 of 10 Retros. SPRINT-138's own Theme says "at least 5 of the last 8 sprints" were red: S130–S137 gives 6 of 8.

## Round 5 — Extraction (c): consumer-visible change and release per sprint

**Selector.** `git diff --name-only <plan_commit>..<release or close commit> -- skills spec README.md .claude-plugin
.codex-plugin .kimi-plugin`, the end being the later of the close and the release commit (releases at S133–S136
landed after the close). Second selector (population varied): the same range over `packs/`, because the owner's path
list cannot see the tree ADR-055 added. CHANGELOG release lines cross-read.

| S | release | skills/spec files | packs/ files | note |
|---|---|---|---|---|
| 128 | 2.9.0 MINOR | 2 | 0 | orchestrator |
| 129 | 2.10.0 MINOR | 4 | 0 | diagnose · tdd · orchestrator |
| 130 | none | 0 | 0 | evals/test only |
| 131 | 2.11.0 MINOR | 3 | 0 | orchestrator |
| 132 | 2.12.0 MINOR | 1 | 3 | tdd + CONTRACT.md, skeleton, first pack |
| 133 | 2.12.1 PATCH | 1 | 0 | tdd (release commit has no `sprint(133)` prefix) |
| 134 | 2.13.0 MINOR | 0 | 2 | two packs |
| 135 | 2.13.1 PATCH | 3 | 0 | night-run.md, STANDARD.md, spec CHANGELOG |
| 136 | 2.13.2 PATCH | **0** | 0 | manifests + README + CHANGELOG only; "fixes only" were checker/eval fixes |
| 137 | none | 0 | 0 | eval/checker fixes, no bump |

8 releases in 10 sprints (2.8.0 → 2.13.2); **19** adopter-visible skill/spec/pack files in total; 3 sprints shipped
none (S130, S136 with a bump, S137). The 2.13.2 PATCH carried no adopter-visible file.

## Round 6 — Consumer side: workdoo (read-only; `D:/Project/workdoo`, HEAD `8b80648`, 2026-10-10)

- **Ledger.** 29 entries: 16 promoted, 13 active (L-001…L-029); same header shape as lean-flow's; promoted entries
  collapsed to pointer lines; homes are workdoo's own `.claude/CLAUDE.md` and `docs/testing/testing-guide.md`. 3 entries
  cite a lean-flow id (`L-106`, `L-088`, and `tracker: lean-flow L-165`).
- **Retro-named recurrences vs ledger** (selector as Round 2c; 4 Retros S009–S012): S010 names L-008 ×2, L-014 ×4,
  L-011 once; S011 names L-003 (recorded, count 3), L-009; S012 names L-014 ×2 and L-012 (recorded). Ledger `seen`
  ends at S008 for L-008, L-011, L-014 and at S009 for L-009: **5 of 8 named recurrences are not in the ledger**.
- **Gate verdicts.** `verify:linux` runs per Cost line: S010 25 (4 red or no verdict) · S011 about 25 (9) · S012 about 32
  (5): 82 runs, 18 red or no verdict (22%); real defects 3 (S011 T6 fixture; S012 T9 lint, D2-walk timeout); the rest
  flakes (TD-049) or environment. lean-flow: 24 runs, 10 red (42%), 1 content defect.
- **Retro "Retrieval check"** is present in 7 of 12 archived Retros (S001 S004 S005 S009 S010 S011 S012); S009–S012 state
  promoted rules that held ("L-002 held on every task") or recurred; S009: "recurred and was not consulted".
- **Pin.** `LEANFLOW_PLUGIN_VERSION_PIN=2.0.0` in workdoo's `.env` (VPS copy `lean-flow-2.0.0`); lean-flow is at 2.13.2.
  S127 and S128 Retros list "workdoo: bump its pinned lean-flow" as an owner action (to 2.8.0, then 2.9.0); S129 to S137
  Retros do not list it. Which install (worker pin or user-scope) F2 meant is not stated; not resolvable from the repos.
- **Upstream path.** lean-flow task `origin:` over `docs/work/` (49 files): decomposer 32 · close-retro 10 · manual 7 ·
  no adopter value exists. TD rows whose Summary comes from workdoo: 2 (TD-253, SPRINT-127 T5 "finding F1" of a
  read-only exercise; TD-245, epic ids spanning two repos), both found by a lean-flow sprint exercising workdoo, none by
  workdoo reporting. workdoo's `docs/sprint/INDEX.md`: its member sprints "are
  rolled up in that repository by hand, because no checker in either repo can see across the boundary". The SPRINT-009 log
  rules lean-flow follow-ups "outside workdoo… workdoo gets no record".

## Round 7 — Cross-check routes (second queries, run before each figure entered the doc)

| figure | route 1 | route 2 (different selector) | agree |
|---|---|---|---|
| 225 headers: 11/213/1 | position-anchored status token | `246 max id − 21 retired ids`; sum of pointer classes 54+60+98+1 = 213 | yes |
| 98 DUP98 pointers | pointer text key, first 160 chars | `git show c52496fd:docs/LEARNINGS.md \| grep -c` = 98 (0 before) | yes |
| first-run red 7 of 10 | Retro Cost/Friction text | log gate headings 6 · commit subjects 6 | 6 vs 7 (S137 Retro-only) |
| QA_FULL runs | Cost lines 21 | log gate entries + commit subjects 24 | no: S132, S133 undercounted |
| cohort 18 | parsed promote sprint vs sprint in sighting bullets | Retros' named recurrences (Round 2c) hit the same entries for S128–S137 | yes (10 of 15) |
| 42 folds after head promotion | fold-bullet sprint > head promote sprint | head ids by SPRINT-121 T4 families | same set |
| 17 of 35 members | commit subjects | 19 TD ids named in those subjects | consistent |
