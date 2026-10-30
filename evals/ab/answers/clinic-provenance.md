# Clinic answers: provenance

spec = `D:\Research\clinic-ab-spec\spec.md`. code = `D:\Research\clinic-ab\`. Procedure = lean-flow commit 102e8b76, `skills/lean-doc-generator/references/` (init.md, migration-map.md).

## Fact sources (file, section: fact -> source)
clinic.md = business facts; clinic-operator.md = Stack, Conventions, setup answers.

| # | File, section | Fact | Source |
|---|---|---|---|
| 1 | clinic-operator.md, Stack | Go API, PostgreSQL, Vue 3 | code README.md:L3; spec.md:L13-L16 |
| 2 | clinic-operator.md, Stack | chi, pgx | code go.mod |
| 3 | clinic-operator.md, Stack | Vite, Vitest, TypeScript | code web/package.json |
| 4 | clinic-operator.md, Stack | RFC 3339 instants, zone applied on server | spec.md:L55 |
| 5 | clinic-operator.md, Stack | doctors, patients, appointments in DB | spec.md:L16, L27-L30 |
| 6 | clinic-operator.md, Conventions in use | Fault envelope, single declaration, UI verbatim, 204 no body | spec.md:L37, L65-L69 |
| 7 | clinic-operator.md, Conventions in use | Verdicts, not errors | spec.md:L39, L73-L78 |
| 8 | clinic-operator.md, Conventions in use | Store verbs | spec.md:L82-L86 |
| 9 | clinic-operator.md, Conventions in use | Gateway composables | spec.md:L90-L93 |
| 10 | clinic.md, Invariants | No double booking, rule + unique constraint | spec.md:L27 |
| 11 | clinic.md, Invariants | Working hours [start,end) | spec.md:L28 |
| 12 | clinic.md, Invariants | DOB and phone required | spec.md:L29 |
| 13 | clinic.md, Invariants | Daily cap, default 8, > 0, serialised | spec.md:L30 |
| 14 | clinic.md, Invariants | 24h window, exactly 24h allowed | spec.md:L31 |
| 15 | clinic.md, Business goal | Goal statement | spec.md:L7 |
| 16 | clinic.md, Main flows | Book flow, rule order, 201 | spec.md:L11-L17 |
| 17 | clinic.md, Main flows | Cancel flow, 404, 204 | spec.md:L19-L23 |
| 18 | clinic.md, Quality attributes | Stable fault codes | spec.md:L37 |
| 19 | clinic.md, Quality attributes | Race safety, cap under concurrency | spec.md:L38 |
| 20 | clinic.md, Quality attributes | Pure rules | spec.md:L39 |
| 21 | clinic.md, Quality attributes | Tests on real DB/API, fail not skip | spec.md:L40 |
| 22 | clinic.md, Quality attributes | One envelope for all refusals | spec.md:L41 |
| 23 | clinic.md, Non-goals | No auth | spec.md:L45 |
| 24 | clinic.md, Non-goals | No rescheduling | spec.md:L46 |
| 25 | clinic.md, Non-goals | No payments | spec.md:L47 |
| 26 | clinic.md, Non-goals | No notifications | spec.md:L48 |
| 27 | clinic.md, Non-goals | No multi-clinic, no per-doctor zones | spec.md:L49 |
| 28 | clinic.md, Business rules and facts the code does not show | Asia/Jakarta, UTC+7, no DST, wall-clock | spec.md:L55; code internal/clinic/zone.go |
| 29 | clinic.md, Business rules and facts the code does not show | 24h window is clinic policy; appointment kept on refusal | spec.md:L31, L56 |
| 30 | clinic.md, Business rules and facts the code does not show | Cap per doctor, default 8, changeable in DB | spec.md:L57 |
| 31 | clinic.md, Business rules and facts the code does not show | Complete record = DOB and phone | spec.md:L58 |
| 32 | clinic.md, Business rules and facts the code does not show | Cancel deletes; slot and cap place freed | spec.md:L59, L30, L31 |
| 33 | clinic.md, Business rules and facts the code does not show | Slot uniqueness per doctor | spec.md:L27 (test TestSlotTakenIsPerDoctor) |
| 34 | clinic.md, Business rules and facts the code does not show | Fault code and status list | spec.md:L27-L31, L33 |
| 35 | clinic-operator.md, Setup answers | HTTP API + DB, no auth, no integrations | spec.md:L16, L45-L48; code cmd/api, db/migrations |
| 36 | clinic-operator.md, Setup answers | Everything else "not decided yet" | spec silent; init.md:L25-L26 (never invent an answer) |

Facts written (across clinic.md and clinic-operator.md): 35 sourced facts, plus 1 silence marker (row 36).

## Coverage table
| Question | Procedure source | Status | Location |
|---|---|---|---|
| Stack detection | init.md:L9-L11 | answered | clinic-operator.md: Stack |
| Backend/integration tier applies | init.md:L31-L33 | answered (API present) | clinic-operator.md: Setup answers |
| Medium/complex tier applies | init.md:L34-L40 | not decided yet | clinic-operator.md: Setup answers |
| First milestone: proof goal | init.md:L22-L26 | not decided yet | clinic-operator.md: Setup answers |
| First milestone: stopping condition | init.md:L22-L26 | not decided yet | clinic-operator.md: Setup answers |
| First milestone: integration boundary none/simulated/live | init.md:L23-L25 | not decided yet (no external services stated) | clinic-operator.md: Setup answers |
| Allowed side effects | init.md:L24-L26 | not decided yet | clinic-operator.md: Setup answers |
| Create main business-flow doc, and which flow | init.md:L36-L40 | not decided yet (Book and Cancel exist) | clinic-operator.md: Setup answers |
| CoC enforcement contact (team >= 2) | init.md:L90 | not decided yet | clinic-operator.md: Setup answers |
| License or private notice | init.md:L94, L125 | not decided yet | clinic-operator.md: Setup answers |
| Security contact | init.md:L91 | not decided yet | clinic-operator.md: Setup answers |
| Owner role / deployment target / release process | init.md:L87-L104 (templates) | not decided yet | clinic-operator.md: Setup answers |
| Migrate: where an unrecognized doc belongs | migration-map.md:L144 | not decided yet | clinic-operator.md: Setup answers |
| Migrate: per-file plan approval (keep/relocate/retire...) | migration-map.md:L26-L27 | not decided yet (repo holds only README.md; spec is outside it) | clinic-operator.md: Setup answers |
| B: stack | brief | answered | clinic-operator.md: Stack |
| B: conventions in use | brief | answered | clinic-operator.md: Conventions in use |
| B: invariants | brief | answered | clinic.md: Invariants |
| B: business goal | brief | answered | clinic.md: Business goal |
| B: main flows | brief | answered | clinic.md: Main flows |
| B: quality attributes | brief | answered | clinic.md: Quality attributes |
| B: non-goals | brief | answered | clinic.md: Non-goals |
| C: time zone | brief | answered | clinic.md: Business rules and facts the code does not show |
| C: cancellation window policy | brief | answered | clinic.md: Business rules and facts the code does not show |
| C: cap default and scope | brief | answered | clinic.md: Business rules and facts the code does not show |
| C: patient record completeness | brief | answered | clinic.md: Business rules and facts the code does not show |
| C: cancel deletes, frees slot | brief | answered | clinic.md: Business rules and facts the code does not show |
| C: who may do what | brief | answered (no auth; staff book and cancel, spec.md:L7, L45) | clinic.md: Business rules and facts the code does not show, Non-goals, Business goal |
| C: fault codes and statuses | brief | answered | clinic.md: Business rules and facts the code does not show |

Counts: questions covered 28 · answered 15 · not decided yet 13. Init/migrate line numbers are from the 102e8b76 files as printed by `git show`.
