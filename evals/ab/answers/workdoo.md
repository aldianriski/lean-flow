# Workdoo: business notes

Facts about the project from its owner and its own records. "Not decided yet" means the owner has not decided it.

## Business goal
1. Workdoo is a company workspace that connects people, AI agents and controlled workflows. Tagline: "Connected work, controlled process".
2. The problem: departmental work must refer to the same projects, people and business records, or permissions, financial totals and handoffs disagree.
3. Current outcome being pursued: the TemiDev team (the owner plus 2 to 5 invited operators) uses Workdoo daily over HTTPS on the R&D VPS, with Claude and Codex specialists running server-side and nightly off-host database backups.
4. The product direction is policy-bound AI orchestration for everyday company work, delivered one useful use case at a time.
5. AI should retrieve permitted company knowledge, cite its sources, name missing facts and run routine actions through bounded server tools. Spending and access decisions need the right human. AI cannot change its own permissions or attest physical handover or final readiness.

## Main flows
1. Real manual Software delivery (the main business flow, the live loop): a work item is created, a workflow run captures a published workflow version, an output version is produced, a manual check is recorded, a proposed action is reviewed by the current named reviewer, then internal acceptance is recorded. Client acceptance, external release and money movement are never inferred.
2. Company onboarding: an owner enables onboarding and maps HR, equipment and access responsibilities to active members; a member saves an intake; an AI cited plan is generated from the published company policy, reviewed and saved. Saving performs no fulfillment.
3. Legacy fictional People and HR onboarding: an approved engagement splits into parallel mandatory dependencies (HR evidence, delivery role, equipment receipt and handover, IT access review and fulfillment, employee preparation); HR verifies all mandatory evidence, then confirms ready to start. Optional welcome work may stay open.
4. Factory configuration: four-step draft, publish an immutable workflow version, activate the exact reviewed selection. Owners can rename, pause, review-resume, archive, duplicate and delete unused drafts. Activation starts no work.
5. Specialist execution: six governed specialists prepare artifacts with Claude or Codex on an explicit request against a Work item; each attempt is durable and inspectable; humans still make every check and decision.
6. Private invitation: an owner issues a link and shares it manually; the matching signed-in recipient accepts and joins as an operator.
7. Release: CI runs, an artifact tarball is built and uploaded over SSH, the installer backs up the database, swaps the release link, restarts, and polls `/health` for up to 30 seconds; if the new version is not reported it rolls back by itself.
8. Nightly off-host encrypted database backup, with a nightly restore rehearsal.
9. Fictional supplier payment (demo only): preparation through bank reconciliation, approval gates, return for changes, one linked simulated payment.

## Invariants
1. Every company request re-checks active membership on the server; an inaccessible company or case ID gets the same "unavailable" response as a missing one. Hiding things in the frontend is only supplementary.
2. Approval, execution, fulfillment and readiness are separate duties. AI output grants no authority; saving a plan performs no execution, order, access grant, employment activation or readiness check.
3. An onboarding intake alone fulfills no employment, equipment or access responsibility.
4. One authority per migrated record: no whole-state JSON persistence, no local/server dual writes, no second copy of a record for a new screen.
5. Configuration revisions and published workflow versions are immutable. A case or run keeps the revision or version it captured; later setup changes affect only new intakes.
6. Decisions apply to the reviewed inputs; if an input changes, the affected evidence and readiness reopen.
7. The last active owner can never be removed; ownership moves only by explicit transfer. Access loss takes effect on the next request.
8. Animation, 3D scenes and station highlighting never advance business status, acceptance or agent attempts.
9. The public demo (browser-local, fictional) and the real company workspace stay separate. "Preview as" personas never authorize real API calls, and demo records are never imported as real company data.
10. A dated observation of a source repository's status (even `done`) is provenance only; it never creates acceptance in Workdoo. Imported work starts open.
11. CTO is a job title with no permissions. Team, division and job title grant no access.
12. Secrets, session cookies, signing keys and databases are never committed; `.workdoo/`, SQLite files and env files are git-ignored. The only tracked env file is `.env.example`, which lists variable names only.
13. A failed provider call stays visible as failed; it is never replaced by a simulated success, and no paid generation is retried automatically.

## Quality attributes
1. Consistency: original stable IDs and one underlying transaction survive linked navigation and retries.
2. Security: pilot APIs enforce authenticated company membership; nothing is declared production-ready or compliant.
3. Persistence: normalized relations and short transactions; data survives restart.
4. Accessibility: labelled controls, keyboard navigation, focus handling and mobile layouts; WebGL failure must leave Flow and the Work list available.
5. Layouts work on desktop and mobile (widths around 390, 900 and 1280 to 1920 px).
6. Sessions last one day. Production needs HTTPS, secure cookies and a 32-character-or-longer signing secret.
7. Releases keep the newest five folders. Backups are kept 30 days off-host; no other retention is defined yet.
8. Rate limits use the real client address only behind the same-host proxy with a loopback bind.
9. List and search queries are bounded; output content is bounded (64 KiB for stored outputs; agent output content up to 8192 characters, summary up to 800).

## Non-goals
1. Not in scope now: repository sync and repository tools for the daily loop (a later stage), Finance and HR execution, a custom domain, multiple replicas or a database change, email verification, SSO, account recovery.
2. Not in scope now: live payment execution, external task connectors, general legacy import, active scheduling, email delivery.
3. Nine queued departmental workflows (IT and Security, Sales, Client Delivery, Marketing, Customer Success, Legal, Strategy, Finance invoicing, People recruitment) are not started until the owner requests the next one.
4. Hosted per-tenant credentials, streaming agent sessions, arbitrary prompt/skill editors and repository tools for specialists are future capabilities.
5. No production readiness or compliance certification is claimed.

## Business rules and facts the code does not show
1. Real roles are only `owner` and `operator`. Owners read and create intakes, publish company setup and policy, plan, manage invitations, access and the optional organization. Operators read active members and the organization, read and create intakes, and generate and save plans; they cannot publish setup or policy, manage access, or approve.
2. Only owners publish setup or policy, and only owners issue or revoke invitations.
3. An invitation link expires after 7 days, admits operators only, is revocable, and needs the matching signed-in account. Acceptance cannot upgrade or reactivate a membership. If the issuer is disabled or demoted, pending invitations are revoked. Treat links as secrets.
4. Manual delivery: owners write, operators read. A decision additionally requires the current named reviewer. If an owner or reviewer becomes unavailable, an owner must reassign explicitly; role changes never rewrite history.
5. Pausing onboarding blocks new intakes only; earlier work and successful retries stay available. Cases created before configuration existed stay explicitly unmapped; nothing is backfilled.
6. Responsibility assignment grants no administrative, financial or access-approval capability. The intake creator is initially available for all three preparation responsibilities.
7. Company policy is plain text in immutable revisions. The AI sees only limited intake fields plus the policy, never names, emails or membership IDs. Output is accepted only if citations are exact quotes from permitted sources, tasks are bounded and the dependency graph has no cycle. Literal quotes do not prove meaning, so human review stays explicit.
8. A failed AI attempt is retried only by an explicit owner command after inspecting it; there is no automatic retry for any provider. Default model for both planner and Claude specialists is `sonnet`.
9. Provider failures are typed: not configured, unavailable, authentication required, rate limited, timeout, invalid output; Codex adds isolation required and stop unconfirmed.
10. Specialists run only for companies whose exact IDs are in the server's execution grant list (empty means disabled). Codex runs only after native isolation is verified (Linux bubblewrap: scratch-only reads, no writes, no network, env file hidden).
11. If a worker's lease expires, a stop is requested and the execution slot stays held; elapsed time never allows a retry. An operator must confirm the process ended.
12. Source import: eight reviewed TemiDev source references are staged with original ID, status and hash, and start open. Re-importing records a new observation only if the hash differs from the latest; an older dated batch committed later records nothing.
13. Rollback is two separate decisions: code rollback is a link swap to a retained release; data restore only when the schema is incompatible, and lost writes need the owner's explicit decision. A failed release folder stays for diagnosis; the next attempt needs a new version number. Never reseed the database to hide an upgrade failure.
14. Timestamps are stored as UTC ISO-8601 strings; users see dates and times in UTC (en-GB style), as today.
15. The real company's currency is IDR. The demo also uses Indonesian rupiah (IDR) amounts with implicit currency. For real finance, amounts must carry an explicit currency and exact minor units, and partial settlements are independent receipts; this is not built yet.
16. A planned hire contributes no active person or capacity. Equipment receipt is separate from supplier payment. A payment confirmation creates or reuses exactly one cash transaction. Approval is not reconciliation.
17. Never log credentials, cookies, tokens, full employee records or banking details. Real employee data needs authorized hosting, retention, backup, incident and privacy arrangements first.
