# Workdoo answers — provenance

Paths are relative to `D:\Research\workdoo`. Fact references are `<Section> <n>` = the nth numbered item in that section of the file named in the section heading below. Business facts are in `workdoo.md`; Stack, Conventions in use and Setup answers are in `workdoo-operator.md`.
Abbreviations: CL = `.claude/CLAUDE.md` · CX = `.claude/CONTEXT.md` · REQ = `docs/product/requirements.md` · AUTH = `docs/architecture/authentication.md` · DEP = `docs/deployment/deployment-guide.md` · ROLL = `docs/deployment/rollback-guide.md` · DEL = `docs/database/company-workspace-model/delivery.md` · EPIC = `docs/epic/EPIC-001-workdoo-live-on-vps.md` · SEC = `SECURITY.md` · INT = `docs/architecture/integrations.md` · EXEC = `docs/architecture/agent-execution-plan.md` · REAL = `docs/development/real-company.md` · SETUP = `docs/development/setup.md`.

## Fact sources

### Stack (workdoo-operator.md)
- 1: CL:L13 · CX:L13-19
- 2: SETUP:L12-13 · docs/adr/ADR-001-persisted-company-onboarding.md:L47-49
- 3: AUTH:L15-16 · CX:L17
- 4: CX:L18 · CL:L64 · docs/development/coding-standards.md:L52-53
- 5: INT:L17-19 · EXEC:L56
- 6: DEP:L10,L14-25 · EPIC:L48 (D7 Caddy) · CX:L120 (R&D VPS, `v*` tags)
- 7: package.json:L2-4 (name, version 0.4.4, private) · package-lock.json present · SETUP:L21
- 8: ADR-001:L48-49 · DEP:L98

### Conventions in use (workdoo-operator.md)
- 1: docs/development/coding-standards.md:L12-14
- 2: docs/development/coding-standards.md:L28-29
- 3: docs/development/coding-standards.md:L44-46 · CL:L44
- 4: docs/development/coding-standards.md:L47 · L23-24
- 5: SEC:L57-59 · CONTRIBUTING.md:L43 · CL:L49
- 6: CL:L16-20 · CX:L116-122 · docs/sprint/INDEX.md:L10-14 · EPIC:L7
- 7: CL:L67 · docs/DECISIONS.md:L10-14
- 8: DEP:L49 (release trigger) · EPIC:L43 (D2, D3) · git log (`sprint(004): ...`, `release: v0.4.4 ...`) · CONTRIBUTING.md:L17-18 (no hook/convention; its "no Git repository" text at L12 is stale, history has 204 commits)
- 9: SEC:L52-53
- 10: CL:L62-68 · CONTRIBUTING.md:L39-44
- 11: owner headers in every docs file, e.g. CL:L2, CX:L2 · CONTRIBUTING.md:L27-28 · CX:L119
- 12: REQ:L142 (first sentence) · CONTRIBUTING.md:L36-37 · README:L53-54 (moved from the former Quality attributes 5)

### Invariants (workdoo.md)
- 1: AUTH:L35-37, L63-64 · SEC:L33
- 2: CX:L29 · AUTH:L39 · SEC:L38 · docs/adr/ADR-003-source-bound-onboarding-proposals.md:L47
- 3: REQ:L56 · SEC:L14-15
- 4: CL:L50 · docs/product/company-workspace-roadmap.md (Outcome and authority section, "One authenticated repository per migrated domain; no whole-state JSON persistence or local/server dual writes") · docs/architecture/overview.md:L19-22
- 5: docs/adr/ADR-002-capture-onboarding-configuration.md:L28-30 · CX:L38, L73, L76
- 6: CX:L30
- 7: AUTH:L31, L54-55
- 8: CX:L46 · CL:L47 · docs/adr/ADR-003:L45-47 · DEL:L72
- 9: AUTH:L19-24, L85-86 · docs/architecture/data-flow.md:L65-68 · SEC:L16-17
- 10: DEL:L70-71, L82-84
- 11: AUTH:L59-60 · DEL:L68
- 12: SEC:L21-22 · .gitignore:L5-8,L11 · `git ls-files` returns only `.env.example` for env/key/dump patterns (checked)
- 13: INT:L28-29 · EXEC:L99 · ADR-003:L40-41

### Business goal (workdoo.md)
- 1: README:L1-6 · REQ:L87
- 2: REQ:L12
- 3: EPIC:L13-15 (release-tag and rollback wording dropped; kept in operator Setup answers 2-3)
- 4: REQ:L14, L94
- 5: REQ:L98-101

### Main flows (workdoo.md)
- 1: DEL:L70-73 · REQ:L64 (R18) · owner interview 2026-10-30 (Q1: this is the main business flow)
- 2: REQ:L56-59 (R10, R11, R13) · docs/architecture/data-flow.md:L59-63 · ADR-003:L24-47
- 3: docs/flows/onboarding.md:L10-12, L19-42, L46-49, L51-53
- 4: README:L71-74 · docs/preview/ lifecycle report referenced there
- 5: REAL:L28-35 · INT:L18-19 · REQ:L65
- 6: REQ:L58 (R12) · AUTH:L48-51 · server/invitations.ts:L47
- 7: DEP:L49-59 (the `v*` tag trigger is in operator Conventions 8)
- 8: ROLL:L35-38
- 9: REQ:L51 (R5)

### Quality attributes (workdoo.md)
- 1: REQ:L138
- 2: REQ:L139 · SEC:L63-64, L72-73
- 3: REQ:L140
- 4: REQ:L141 · docs/development/coding-standards.md:L23-24
- 5: TECH-DEBT.md:L24, L30 (390/900 and 1280/1440/1920 px checks) · REQ:L142 · CONTRIBUTING.md:L36-37 · README:L53-54
- 6: AUTH:L77-79 · server/index.ts:L68 · DEP:L31-32 · SETUP:L83-85
- 7: DEP:L55 · ROLL:L23, L37-38 · owner interview 2026-10-30 (Q8: keep the 30-day window, no other retention defined yet)
- 8: SEC:L36-37 · DEP:L41-45
- 9: REQ:L63 (R17 bounded queries) · DEL:L87-88 · server/deliveryAgentOutput.ts:L6

### Non-goals (workdoo.md)
- 1: EPIC:L29-30 ("later epic" reworded to "later stage") · SEC:L72-73
- 2: REQ:L40-43 (note: its "production deployment", "external integrations" and "AI/tool execution" items are superseded by EPIC-001 and R19; only the other items are kept)
- 3: REQ:L119-131
- 4: EXEC:L100 · INT:L33-35
- 5: SEC:L64, L73

### Business rules and facts the code does not show (workdoo.md, section "Business rules and facts the code does not show")
- 1: AUTH:L28-33, L53
- 2: SEC:L39-40
- 3: AUTH:L48-51 · server/invitations.ts:L47 · SEC:L41-42 · REQ:L58
- 4: AUTH:L57-59 · DEL:L65-67
- 5: docs/adr/ADR-002:L32, L36-38 · docs/adr/ADR-002:L47-48
- 6: SEC:L39-40 · AUTH:L44-46
- 7: ADR-003:L26-29, L36-38, L57-58 · docs/architecture/data-flow.md:L59-62
- 8: INT:L28-29 · SETUP:L90, L96
- 9: INT:L18-19
- 10: SETUP:L94 · REAL:L37-42 · INT:L19
- 11: REAL:L44-46 · server/deliveryAgentLifecycle.ts:L110-113
- 12: docs/architecture/data-flow.md:L65-67 · DEL:L82-84
- 13: ROLL:L10-11, L28-33, L48 · DEP:L94
- 14: owner interview 2026-10-30 (Q5: users see UTC, as today) · server/invitations.ts:L47 (`toISOString`) · src/company/model.ts:L11 (`timeZone:'UTC'`, en-GB) · src/ui/OverviewPage.tsx:L10 · src/workspace/Brand.tsx:L12
- 15: owner interview 2026-10-30 (Q6: real company currency IDR) · src/company/supplierPayments.ts:L62 (`id-ID`, "IDR") · docs/product/company-workspace-roadmap.md (audit table row on implicit-currency amounts and `receipt-${invoiceId}`)
- 16: CX:L103-107, L109-110 · docs/flows/onboarding.md:L17
- 17: SEC:L57-59, L63-65

### Setup answers (workdoo-operator.md)
- 1: docs/architecture/integrations.md exists (L13-19) · docs/architecture/data-flow.md · docs/api/openapi.yaml · docs/adr/ADR-001..003 · docs/epic/EPIC-001 · docs/database/ · docs/deployment/ — the repo already carries these tiers; tier choice inferred from that, not stated by the owner
- 2: EPIC:L13-15 · owner interview 2026-10-30 (Q4: the EPIC-001 outcome is the first milestone)
- 3: EPIC:L56-64 · owner interview 2026-10-30 (Q4: its Closed-when list) (state of the checkboxes as of its last_updated 2026-10-26; docs/work/done/TASK-074 exists, so the backup item may be stale)
- 4: INT:L17-19 · CX:L42 · README:L8-12 · DEL:L73 · ROLL:L37-38 · DEP:L49-59. The "allowed side effects" wording is assembled from those lines; it is not an owner statement of a first milestone (see interview Q4)
- 5: owner interview 2026-10-30 (Q1: real manual Software delivery); docs/flows/onboarding.md exists (legacy onboarding flow doc)
- 6: owner interview 2026-10-30 (Q2: defer code of conduct until a monitored address exists) · docs/work/backlog/TASK-061-configure-monitored-security-contact.md:L18-21, L34 · EPIC:L13 (owner plus 2-5 operators) · git log author count (one author, 204 commits)
- 7: owner interview 2026-10-30 (Q3: keep unconfigured for now) · SEC:L69-70 · TASK-061:L25, L34
- 8: LICENSE:L1-5 · README:L110
- 9: README:L11-12, L36, L112-113 (docs/preview as evidence) · owner interview 2026-10-30 (Q7: docs/design, docs/bugs, docs/changelog/CHANGELOG-pre-0.2.md and docs/archive stay in place)
- 10: docs/work/ (done/ todo/ backlog/ cancel/ in_progress/) · docs/sprint/INDEX.md · root listing (no TODO.md)
- 11: owner interview 2026-10-30 (Q9: retired docs archived only, never hard-deleted)

## Coverage table

Procedure refs: `init` = `skills/lean-doc-generator/references/init.md`, `mig` = `.../migration-map.md`, both at commit 102e8b76. Locations: `WD` = `workdoo.md`, `OP` = `workdoo-operator.md`.

| # | Question | Source line in procedure | Status | Location |
|---|---|---|---|---|
| A1 | Backend/integration tier applies? | init:L31-33 | answered | OP: Setup answers 1 |
| A2 | Medium/complex tier applies? | init:L34-36 | answered | OP: Setup answers 1 |
| A3 | Create the main business-flow doc; which flow? | init:L37-39 | answered: real manual Software delivery (owner interview 2026-10-30) | OP: Setup answers 5; WD: Main flows 1 |
| A4 | First milestone: proof goal | init:L22-25 | answered (owner interview 2026-10-30) | OP: Setup answers 2 |
| A5 | First milestone: stopping condition | init:L22-25 | answered (owner interview 2026-10-30) | OP: Setup answers 3 |
| A6 | First milestone: integration boundary none/simulated/live + side effects | init:L23-25 | answered | OP: Setup answers 4 |
| A7 | Team size at least 2 (code of conduct applies)? | init:L90 | not decided yet | OP: Setup answers 6 |
| A8 | Code-of-conduct enforcement contact | init:L90 | answered: defer until a monitored address exists (owner interview 2026-10-30) | OP: Setup answers 6 |
| A9 | License or private notice | init:L94, L126 | answered | OP: Setup answers 8; Stack 7 |
| A10 | Database / auth substrate (fires conditional docs, confirmed not asked) | init:L28-30 | answered | OP: Stack 1, 3, 8; Setup answers 1 |
| A11 | Base-tier conditions: has code, publishes an artifact | init:L80-84, L103-106 | answered | OP: Stack 6, 7 |
| A12 | migrate: where an unrecognized doc belongs | mig:L144 | answered: `docs/preview/` and the other four stay in place (owner interview 2026-10-30) | OP: Setup answers 9 |
| A13 | migrate: approve the per-file plan | mig:L25-28 | not decided yet (made when a plan exists) | none |
| A14 | migrate: approve a hard-delete of a retired doc | mig:L74-75 | answered: archive only, never hard-delete (owner interview 2026-10-30) | OP: Setup answers 11 |
| A15 | migrate: approve each consolidate/retire item | mig:L68-78 | not decided yet (made per item when proposed) | none |
| A16 | migrate: conflict choice apply/keep/edit | mig:L265-271 | not decided yet (arises only on a conflict) | none |
| A17 | migrate: committed secrets found, rotation owner-action | mig:L18-24 | answered (none found) | WD: Invariants 12 |
| A18 | migrate: TODO.md / v1 task fields (priority, state, origin, class, tier, authority, prose disposition) | mig:L193-199, L231-239, L286-291 | answered, not applicable | OP: Setup answers 10 |
| B1 | Stack | profile topic | answered | OP: Stack 1-8 |
| B2 | Conventions in use | profile topic | answered | OP: Conventions in use 1-12 |
| B3 | Invariants | profile topic | answered | WD: Invariants 1-13 |
| B4 | Business goal | profile topic | answered | WD: Business goal 1-5 |
| B5 | Main flows | profile topic | answered | WD: Main flows 1-9 |
| B6 | Quality attributes | profile topic | answered | WD: Quality attributes 1-9 |
| B7 | Non-goals | profile topic | answered | WD: Non-goals 1-5 |
| C1 | Who may do what | business facts | answered | WD: Business rules 1, 2, 4, 6 |
| C2 | Limits and expiries | business facts | answered | WD: Business rules 3; Quality attributes 6, 7, 9 |
| C3 | Time zone | business facts | answered: users see UTC, as today (owner interview 2026-10-30) | WD: Business rules 14 |
| C4 | Currency | business facts | answered: real company currency IDR (owner interview 2026-10-30) | WD: Business rules 15 |
| C5 | Edge cases | business facts | answered | WD: Business rules 5, 7, 8, 11, 12, 13; Invariants 13 |
| C6 | Retention for real company data | business facts | answered: 30-day off-host backup window, no other retention defined yet (owner interview 2026-10-30) | WD: Quality attributes 7; Business rules 17 |
| C7 | Vulnerability-reporting contact | business facts | answered: keep unconfigured for now (owner interview 2026-10-30) | OP: Setup answers 7 |

Counts: facts written 87 (plus operator Conventions 12 and Setup answers 11, both sourced above) · questions covered 32 (A18, B7, C7) · answered 28 · not decided yet 4 (A7, A13, A15, A16).

## Owner interview

Held 2026-10-30. Each item was an open question in the earlier draft; the owner's answer is now written into the file shown. All nine are recorded as "owner interview 2026-10-30" in the fact sources above.

1. Q1 main business flow: real manual Software delivery. In WD (Main flows 1) and OP (Setup answers 5).
2. Q2 code of conduct: defer until a monitored address exists. In OP (Setup answers 6).
3. Q3 security contact: keep unconfigured for now. In OP (Setup answers 7).
4. Q4 first milestone: the EPIC-001 outcome (live daily use on the VPS) and its Closed-when list. In OP (Setup answers 2, 3).
5. Q5 time zone users see: UTC, as today. In WD (Business rules 14).
6. Q6 real company currency: IDR. In WD (Business rules 15).
7. Q7 `docs/design`, `docs/bugs`, `docs/changelog/CHANGELOG-pre-0.2.md`, `docs/archive`: stay in place. In OP (Setup answers 9).
8. Q8 retention: keep the 30-day off-host backup window, no other retention defined yet. In WD (Quality attributes 7).
9. Q9 retired docs: archived only, never hard-deleted. In OP (Setup answers 11).
