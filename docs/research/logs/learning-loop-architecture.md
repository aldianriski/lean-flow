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

Home of the 114 promotions whose pointer is not DUP98 (54 own + 60 fold, fold read through its head): **16 target an
adopter-visible surface** (`skills/**`, `spec/**`): 12 own (L-224 L-220 L-219 L-218 L-182 L-106 L-097 L-092 L-091 L-088 L-087
L-086) + 4 folded into L-219/L-224; 98 target a repo-private one (`.claude/CLAUDE.md`, `.claude/CONTEXT.md`, TD, ADR).
That a surface is adopter-visible says nothing about installation or exposure. (A first-match classification gave 13; see
Round 7 for the disagreement.)

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

## Round 2 — Cohort and control traces (docs/LEARNINGS.md + Retros S128–S137, 2026-10-24; revised in retry)

**Cohort selector.** A promoted entry enters when a dated sighting bullet (`- seen:` or a `…sighting` bullet) names a
sprint STRICTLY later than the entry's promote sprint (`SPRINT-N promote` in the pointer, else the `- promoted:` line).
Over the 206 promoted entries with a parseable promote sprint: 17 hit; L-198 added by hand (its `seen` line says "after
promotion"); the other 6 unparseable (L-238 L-143 L-142 L-111 L-086 L-058) show no later-dated sighting. **Cohort = 18 of
213, a lower bound**: a same-sprint sighting is excluded by the strict test (L-010: S047 "the rule was promoted, in
context, and still broken", same sprint as its promotion). SPRINT-121 T4 "fold of L-NNN" bullets are not sightings here
(Round 2b). **Counting units differ by entry and are stated per case**: a *count field* may count events, sprints or
numbered sightings, and may include pre-promotion ones.

Status vocabulary: **A**vailable (rule written where the flow reads) · **R**eached (loaded in the failing context) ·
**Ac** acted on · **E**ffective (failure stopped). *observed* = an artifact says so (cited); *unknown* = no artifact
records it. A recorded sighting is a failure unless marked "hold".

### Named cases (inspectable: every claim names its source)

**L-108** — *decision:* promoted at the SPRINT-61 promote (owner sign-off) into `.claude/CONTEXT.md` § Gates; S64 T2
widened it to `.claude/CLAUDE.md` § Behavioral Guidelines (entry bullet "Fifth and sixth sightings"). *Owner of home:*
Maintainer; read by every session (CLAUDE.md auto-loads). *Trigger → action:* a count or grep whose result is acted on at once
→ a second query that varies the selection. *Window:* S62–S136 (75 sprints). *Counting units:* **×18 = numbered
sightings, 3 of them (S59) before promotion**; after promotion **15 numbered sightings (4th–18th) in 11 sprints** (62 63 64
75 79 82 83 102 134 135 136); the S131 ×3 and S133 misses named in Retros are on neither this entry nor L-130. *A:* observed
(CLAUDE.md). *R:* observed for 5 sightings (4th "in context the whole time"; 7th "loaded in context"; 12th–14th "a session that
cited this rule twice in its own commit messages"), unknown for 10. *Ac:* the 5 observed: no. *E:* every recorded sighting
is a failure and each was caught by a disagreeing second number (entry text); how often it held is **unknown**. *Opportunities:*
**not recorded** (no census of derived numbers exists). *Update route:* bullets appended; placement widened once (S64); no
disposition re-check recorded.

**L-218** — *decision:* promoted at the SPRINT-113 promote, disposition merge, into `skills/orchestrator/references/dispatch.md`
§ Merge-back queue (post-merge line). *Trigger → action:* each merge-back → run the host gate's cross-cutting legs incl.
typecheck. *Count field 3 = events:* S109 close, S112 close (before), S137 close (after). *Window:* S114–S137 (24 sprints);
**proxy opportunities** 21 sprints whose log mentions worktree dispatch (selector: the word "worktree" in the sprint log;
merge counts unknown). *A:* observed. *R:* unknown. *Ac:* S137: no (Retro: the merge-back re-ran T2's harness, not typecheck).
*E:* 1 recorded failure in ≤21 proxy sprints; holds unknown. *Update route:* a `seen` bullet; the re-tiering (S138 T3, TASK-484)
came 25 sprints after promotion.

**L-224** — *decision:* promoted at the SPRINT-114 promote, disposition merge, `dispatch.md` § Members by reference, rule 5
(Tick). *Trigger → action:* a write to a file a sprint checker reads → re-run the gate's own checker in its own mode.
*Counting units:* **×9 = events** (count field): 2 before promotion (S113 plan lock, S113 close) + **7 after**: S125 ×3 (close,
and 2 via L-235), S126, S127, S128, S137. Of the 7, **6 are failures and 1 is a hold** (S128 T3: the immediate `--scope-change`
re-run caught it, i.e. Ac and E observed). The Retro's "ninth sighting" uses the same ×9. *Window:* S115–S137 (23 sprints);
**proxy opportunities** 59 scope-change log entries in 18 sprints (selector: `### … | scope-change` headings), failures in 4
sprints (125 126 127 137). *A:* observed. *R:* unknown. *Ac:* 1 observed yes (S128), 6 no. *E:* not effective in the 4 sprints;
effective once. *Update route:* count and pointer line edited; TASK-438 (S126) automates the tick path only, not the log-write path.

**L-229** — *decision:* promoted at the SPRINT-117 promote, disposition merge, `.claude/CONTEXT.md` § Sprint model (`Layers:`
bullet); re-dispositioned to `automate-into-check` at the SPRINT-120 promote (owner), TASK-411; later folded into L-151.
*Trigger → action:* widening a task's files → edit the Plan's `Layers:` too. *Count field 3 = sprints* (S115, S116, S118).
*After promotion:* S118, 3 runs (entry: "the promoted CONTEXT.md bullet was loaded and reached none of the three" → **R observed,
Ac no, E no**). *Windows:* S118–S120 prose only (11 scope-change entries: S118 4, S120 7); S121–S137 automated (40
entries). Own shape recorded again: **0** in the second window; the gate now FAILs the shape, so a miss shows as a red close,
not a ledger line (S127/S128/S137 reds are filed under L-224). Whether prevention or detection: **unknown**.

**L-238** — *decision:* promoted at the SPRINT-134 promote, disposition merge, `.claude/CONTEXT.md` § Sprint model. *Trigger →
action:* a coordinator write → bare `sprint(N):` subject. *Count field 2 = events* (S131, S133 closes; both before). *Window:*
plans S134–S138. *A:* observed. *R:* observed: each plan's D1 cites it (S134–S137 plans and the S138 plan). *Ac:* observed
(attribution findings 0 in the S134–S137 closes, 2 in S131–S133). *E:* no failure recorded in 4 closes; coordinator-write
count (the denominator) unknown. **Control, not cohort.**

**Other cohort entries** (promote sprint → sprints with a later sighting; counting unit = the sprints named in the entry's
own bullets): L-009 47 → 74 · L-020 47 → 74, 129 · L-045 47 → 122, 124 · L-060 47 → 94 · L-100 56 → 75, 83 · L-120 73 →
75, 84, 94 · L-130 76 → 121, 122, 124, 126 · L-144 78 → 78, 84 · L-151 81 → 102, 121, 122, 129 · L-166 87 → 122, 124,
127 · L-170 96 → 101 · L-186 96 → 124, 128, 129 · L-198 → 120 · L-219 122 → 127. R/Ac/E: L-120's 5th sighting is recorded
as "the promoted rule did NOT hold" (R unknown, Ac no); L-144's "recurred anyway" (home is `TD-066`, a measurement); the rest
unknown. Opportunities for all of these: **not recorded**.

**Control set** (promoted, no recorded later sighting, with a recorded link from rule to act):

| L | exposure (observed) | evidence the rule reached and was acted on |
|---|---|---|
| 242 | promotes at S135, S136, S137: 3 of 3 | each promote log writes "TD aging (recorded here, per L-242)"; no aging-sweep note after S133 |
| 238 | plans S134–S138 | D1 line in every plan cites it; attribution findings 0 in S134–S137, 2 in S131–S133 |
| 217 | G2 of S135, S136, S138 | Retros: "censusing a review finding before spending a retry (ADR-053 §5)"; plans declare "Review cap 2" |

Common shape of the three: the rule is written **at the step that performs the act** and the actor **writes a trace of it
into an artifact they already produce**. The cohort rules live in a reference read at session or dispatch start; the act
comes later, in another phase, with no prompt and no trace. Of the 195 non-cohort promoted entries: 97 DUP98 pointers · 58
folds (sightings counted on the head) · 40 own-pointer: for the 40, "no sighting recorded" is the only datum and is not
evidence of effect (opportunities are not recorded).


### Round 2b — Re-filed recurrences (SPRINT-121 T4 folds)

Selector: `- seen: … (SPRINT-121 T4 fold of L-NNN: SPRINT-M)` bullets on the ten family heads (L-009 L-020 L-045 L-130
L-151 L-166 L-185 L-186 L-217 L-219), M compared with the head's promote sprint. 58 folded entries; **42 were filed
after their head's promotion** (L-009 3 · L-020 5 · L-045 6 · L-130 6 · L-151 9 · L-166 7 · L-186 6); heads L-185 /
L-217 / L-219 were promoted by the fold itself, so 0 of their 11 count. Family membership is SPRINT-121 T4's own
judgement; this log re-uses it and does not re-judge it. Each of the 42 was filed as a NEW id instead of bumping the head.

### Round 2c — Retro-named recurrences vs the ledger (S128–S137)

Selector: each Retro's "Retrieval check" paragraph, every named promoted rule that recurred (a hold is not counted).
Enumeration, 16 events: S128 L-224, L-186 ×3 · S129 L-151 family, L-020 · S131 cross-check family ×3 · S133 L-130 family ·
S134 L-108 · S135 L-108 · S136 L-108, L-136 · S137 L-224, L-218. **Excluded: S128 L-224, a hold** (caught by the immediate
`--scope-change` re-run; it is on the entry as a sighting). That leaves **15 failures named**. Present as a sighting on the entry: **10** (all but
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
and no field records a red per leg; reds are read from gate entries (S137's three runs are all in its gate entry body).

**Second route for 17 of 35 (path, not subject).** For each sprint's members, the files of every `sprint(N) Tn:` commit
(`git show --name-only`): a member counts when any file is under `scripts/`, `evals/` or `test/`. Result 17 of the 32
members that have such a commit (3 members have none: S130 T3, S131 T2, S131 T3 are coordinator-run or tickless), per sprint
128 5 · 130 2 · 135 3 · 136 4 · 137 3 and 0 elsewhere. The two routes agree on 17; they are not independent of each other's
members, and "touches scripts/evals/test" is a looser class than "checker defect" (S128 T4 and T5 also change skills).
The 19 TD ids are a consistency check on the subject route, not a reproduction of the 17.

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
| 137 | 4 · 16 | 12 dispatches, no tokens | 3 / 3 | 2 | 3 | 2 |

Totals: QA_FULL runs 21 by the Cost lines, **24** by logs and commits. Per sprint the two agree except S132 (Cost 2, log 3: FAIL, PASS 304/0, post-close `epic-state`
FAIL) and S133 (Cost 1, log 3: FAIL, FAIL, PASS 293/0); S137's gate entry body lists all three (299/3, 301/1, 302/0). Red runs
10; first-run red in 7 of 10 closes (gate headings 6, commit subjects 6; S137 confirmed from its gate entry body, "Two earlier
runs were red"). Reviews 32 in 9 sprints. **Findings:** no
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
- **Pin.** The worker pin is `2.0.0` (a host record, confirmed independently by the coordinator; workdoo's env/secret files were not
  opened in this round); lean-flow is at 2.13.2. S127 and S128 Retros list "workdoo: bump its pinned lean-flow" as an owner action
  (to 2.8.0, then 2.9.0); S129 to S137 Retros do not list it. Which install F2 meant (worker pin or user-scope) is not stated.
- **Upstream path.** lean-flow task `origin:` over `docs/work/` (49 files): decomposer 32 · close-retro 10 · manual 7 ·
  no adopter value exists. TD rows whose Summary comes from workdoo: 2 (TD-253, SPRINT-127 T5 "finding F1" of a
  read-only exercise; TD-245, epic ids spanning two repos), both found by a lean-flow sprint exercising workdoo, none by
  workdoo reporting. workdoo's `docs/sprint/INDEX.md`: its member sprints "are
  rolled up in that repository by hand, because no checker in either repo can see across the boundary". The SPRINT-009 log
  rules lean-flow follow-ups "outside workdoo… workdoo gets no record".

## Round 7 — Cross-check routes (second queries; what each validates, and what it does not)

| figure | route 1 | route 2 (different selector) | what the pair validates |
|---|---|---|---|
| 225 headers: 11/213/1 | position-anchored status token | `246 max id − 21 retired ids`; pointer classes 54+60+98+1 = 213 | full population |
| 98 DUP98 pointers | pointer text as a key | `git show c52496fd:docs/LEARNINGS.md \| grep -c` = 98 (0 at `c52496fd^`) | full population |
| first-run red 7 of 10 | Retro Cost and Friction text | gate headings 6 · commit subjects 6 · S137 gate entry body ("Two earlier runs were red", 299/3 then 301/1) | 7 confirmed; S137 is no longer Retro-only |
| QA_FULL runs 21 vs 24 | Cost lines | gate entries + commit subjects | per sprint they agree except S132 (2 vs 3) and S133 (1 vs 3); Round 4 lists the entries |
| **cohort 18** | strict later-sprint test over 206 parseable entries (+L-198 by hand) | (i) Retro-named recurrences, 10 of 15: reach only the 6 entries active in S128–S137 (L-224 L-186 L-151 L-020 L-108 L-218); (ii) keyword route on "after promotion / did not hold / reached none…": 9 hits, 5 in the cohort (recall 5 of 18), 1 same-sprint boundary (L-010), 3 false positives | **partial**: the 12 entries outside S128–S137 rest on route 1 alone; 18 is a lower bound |
| 42 folds after head promotion | fold-bullet sprint > head promote sprint | the ten family heads named by SPRINT-121 T4 | same set; membership is T4's judgement |
| 17 of 35 checker members | commit subject names a check, guard, harness, parser or gate | files of each member's `sprint(N) Tn:` commits under `scripts/` `evals/` `test/`: 17 of the 32 members with such a commit | agree on 17; the path class is looser; 3 members have no `Tn:` commit |
| 19 TD ids | `(TD-NNN)` in those subjects | — | consistency only; it does not reproduce 17 |
| **16 of 114 shipped homes** | first-match classification of the pointer text (13: 9 own + 4 folded) | literal shipped path before the em dash: 12 own (L-224 L-220 L-219 L-218 L-182 L-106 L-097 L-092 L-091 L-088 L-087 L-086) + 4 folded into L-219/L-224 | **disagree by 3**: route 1 let `CLAUDE.md` mentioned inside a pointer win (L-220); route 2 reads the named path and is used: 16 (14%) |
| **35 L-ids in shipped skills** | `grep -r` over `skills/` | `git ls-files skills` (74 files) read and matched: 35 distinct ids, 71 references (SKILL.md 12, templates 12, references 47); 31 ids resolve to a ledger header, 4 resolve to none | agree on 35 |

## Round 8 — Evidence to ranking (retry; the doc carries the compact form)

Ruled order: recurrence × consequence, ties by lower operating cost. **Recurrence** = recorded events in the stated window
(not a sprint count; units differ per row). **Consequence** class: 3 = red close · 2 = wrong figure acted on or signed ·
1 = none observed (a potential escape to an adopter, class 4, is not observed for any row and is not scored).

| # | candidate | recurrence (unit · window) | source | consequence | score | operating cost (tie-break) |
|---|---|---|---|---|---|---|
| 1 | promoted-rule recurrence as an event | 15 Retro-named recurrences · S128–S137 | R2c | 3 (S129 and S137 reds name a promoted rule; S131 scope-change and re-scope) | 45 | one selector per promote; two skill edits |
| 2 | delete prose a tool carries | 10 failures of L-224 (6), L-218 (1), L-229 (3) · S115–S137 | R2 | 3 (S137 red; earlier closes) | 30 | one edit, Codex loop |
| 3 | effect test | 7 first-run reds · S128–S137 | R3, R4 | 3 (10 red runs, 5 with an owner ruling) | 21 | a Cost-line sentence, one log round per 10 sprints |
| 4 | repair pointers | 1 bulk edit · 2026-08-29 to this research (56 days; earlier detection not excluded) | R1 | 2 (the 213 is in the signed S137 promote checklist) | 2 | one M task |
| 5 | adopter route | 1 owner action dropped · S129–S137 | R6 | 1 (none observed) | 1 | a few lines |

**98 corrupted rows are not 98 recurrences.** Row 4 counts one event (one commit) however many rows it touched; the 96 count-1
entries contribute no sighting to any other row. **Priority vs execution:** the rank is by score; C4 runs before C1 because C1's
selector reads counts that C4 corrects; C3 starts at S139 and C2 waits on C3 and S138 T3.

**Reversal assessed per candidate (not "reversible by git").** C1: ships in a release to adopters; a wrong clause needs another release
and adopters who copied it keep it; sightings can accrete on entries as L-108's did, a cost paid at every promote. C2: a wrong
deletion shows as a red close at the next merge-back or scope-change; restoring prose is cheap but the red is not. C3: nothing
persistent. C4: statuses change, so the census drops from 213 and any outside citation of it breaks; originals stay in git. C5:
one wording edit and a recorded decision. None is both hard to reverse and surprising, so no ADR candidate.

**What would establish effectiveness (C2, C3, C5).** A zero-sighting count proves nothing without opportunities and exposure.
C2/C3: log the merge-backs and scope-change entries per sprint (the R2 proxies are selectors, not records), record which legs
the command ran and on which revision, and count a red as a miss only when the leg had run and passed on that revision;
exposure ≥ 10 sprints after S138 T3. C5: workdoo's worker pin shown in a run's init record, the releases it spans, and workdoo
promotes run on it, with workdoo's Retro-named recurrences against its ledger entries as in Round 6 (baseline 3 of 8, S009–S012).

**Adopter route, stated.** Submission: the README's "Report a bug" link (GitHub issues); reader: the maintainer at `/triage`
bug-intake, which files `origin: triage-bug` tasks; none of the 49 task files present carries it, so the route is unexercised
(older `done/` files are pruned). A skill-procedure failure belongs in the shipped plugin; a repo-specific failure in the
adopter's own ledger. An `origin: manual` task with the adopter named in `## Why` records storage after receipt, not submission.
The 35 repo-private L-ids (71 references) are deferred: 31 resolve only to the unshipped ledger and 4 to nothing; cleaning them is
consumer-facing skill work (unfrozen), separate from C5.
