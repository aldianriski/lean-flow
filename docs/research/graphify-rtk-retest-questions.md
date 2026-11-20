---
owner: Maintainer
last_updated: 2026-11-20
update_trigger: TASK-678 closes, or the snapshot HEAD below changes
status: current
id: graphify-rtk-retest-questions
tags: [tooling]
domain: knowledge
related: [graphify-workdoo-questions, graphify-workdoo-test, rtk-trial-verdict, graphify-rtk-retest-results]
---

# graphify and RTK re-test — question set, answer key and frozen run rules

> The SPRINT-182 fixture (TASK-676). Written against the snapshot `D:\Research\workdoo` at HEAD
> `884d897accb736760bf0d2f940e2e90545b680f2`, read-only. Part 1 is the only part an answering arm may see.
> Part 2 (key and scoring) goes to the coordinator and the blind scorer alone. Part 3 is the held-out smoke
> prompt, never scored. Part 4 freezes the token formula and the snapshot baseline. All paths are relative to
> the snapshot root. Mix: 2 cross-file multi-hop · 2 transitive "what breaks if Z changes" · 2 plain lookups
> (controls). The first test's questions were mostly one-hop; here the four hard ones each need 3 or 4 files.

## Part 1 — Questions (hand arms this part only)

Answer from the code under `D:\Research\workdoo` only. Cite exact file paths (relative to that root) and symbol
names. Do not use `.claude/`, `.workdoo/`, `node_modules/` or `dist/`. Answer all six.

1. **Multi-hop.** A specialist-preparation attempt has been queued. A background loop later claims it, runs the
   provider and attaches the result. In order, name (a) the function in `server/deliveryAgentWorker.ts` that
   loops over queued attempts, (b) the function it calls to claim an attempt and the file that *defines* it
   (the worker imports it through another module — name that module too), (c) the function that actually starts
   the provider child process and its file, and (d) the function that, on success, writes the output version
   row and sets the attempt's final status — with that status string.
2. **Multi-hop.** A company that is not in the server's execution-grant list is refused with the error code
   `AGENT_EXECUTION_DISABLED`. (a) Name every place that raises that code (file and function or route). (b)
   For the "start a specialist attempt" command, trace how the grant list reaches the rejecting function: where
   the list is built (and from which environment variable) and each function it is passed through, with files.
   (c) If the grant is removed after an attempt was already queued, what happens to that attempt when the
   worker next tries to claim it — which function decides, and what final status and error code does the
   attempt get?
3. **What breaks.** The constant `leaseMs` in `server/deliveryAgentLifecycle.ts` is changed from `180_000` to
   `10_000` and nothing else is edited. Which functions read `leaseMs`? For a provider run that takes 60
   seconds, what happens to the attempt, which other function and which other file's timing cause it, and what
   final status does the attempt end with?
4. **What breaks.** In `server/deliveryAgentOutput.ts`, `evidenceWorkIds` is removed from both `required` and
   `properties` of `deliveryAgentOutputSchema`, and nothing else is edited. A provider obeys the new schema and
   returns only `title`, `summary` and `content`. Which function rejects that output, which function calls it,
   and what final status and error code does the attempt get? Does the provider runner's own schema check
   (name the function and file) catch it first?
5. **Lookup.** How long is an invitation link valid, how many pending invitations can a company hold before
   creating another is refused (give the HTTP status and error code), and what role does accepting an
   invitation create? Name the file and the functions.
6. **Lookup.** What per-minute limits does the server configure for email sign-in and email sign-up, where
   are they defined, and what separate in-process guard rejects password sign-in or sign-up when too many are
   in flight (give the limit, HTTP status and error code)?

## Part 2 — Answer key and scoring (coordinator and scorer only)

Scoring: each answer is correct or wrong. **Partial scores 0** — an answer missing a required key item, or
asserting a false one about a key item, is wrong. Extra true detail never lowers a score. Sources are the
**file and symbol** pairs; the `L<number>` references are supporting detail and are **not scored** (the RTK arm
strips line numbers). A hard key (Q1 to Q4) cites at least 2 files.

### Q1 key (multi-hop; 3 files + re-export)

- (a) `drain` in `server/deliveryAgentWorker.ts` (L18), inside `createDeliveryAgentWorker`.
- (b) `takeDeliveryAgentAttempt` (called with `listQueuedDeliveryAgentAttempts`'s rows; L23) is **defined** in
  `server/deliveryAgentLifecycle.ts` (L31); the worker imports it from `server/deliveryAgents.ts`, which
  re-exports it (`export { takeDeliveryAgentAttempt, ... } from './deliveryAgentLifecycle.ts'`, L10).
- (c) `runner.run` (L28 of the worker) is the `run` method of `createDeliveryAgentRunner` in
  `server/deliveryAgentRunner.ts` (L364). It calls `runProcess` (L261), which calls `spawnProcess(binary, args,
  ...)` (L265; `spawnProcess` defaults to `nodeSpawn`, node's `spawn`). Naming `run` or `runProcess` with
  `server/deliveryAgentRunner.ts` is accepted; naming only the worker is wrong.
- (d) `completeDeliveryAgentAttempt` in `server/deliveryAgentLifecycle.ts` (L57): inserts into
  `company_output_versions` (L80) and sets `status='succeeded'` (L90). Status string: `succeeded`.
- Correct: (a) + (b) with the lifecycle file as the definition and `deliveryAgents.ts` as the re-export +
  (c) function and runner file + (d) function and `succeeded`.

### Q2 key (multi-hop; 4 files)

- (a) Two places: `providerPermitted` in `server/deliveryAgentScope.ts` (L19-20, `!allowed.has(org)`) and the
  `GET .../delivery/agents?refresh=1` branch in `server/index.ts` (L242, `!executionWorkspaces.has(companyId)`).
- (b) `executionWorkspaces` is built in `server/index.ts` (L36) from `WORKDOO_EXECUTION_WORKSPACE_IDS`
  (comma-split, trimmed, empty dropped). The `POST .../delivery/agent-commands` route passes it (L236) to
  `executeDeliveryAgentCommand` in `server/deliveryAgents.ts` (L54, parameter `allowed`), which passes it
  (L70) to `queueAgentAttempt` in `server/deliveryAgentAttempts.ts` (L9), which passes it (L11) to
  `providerPermitted` in `server/deliveryAgentScope.ts`.
- (c) The worker calls `takeDeliveryAgentAttempt` (`server/deliveryAgentLifecycle.ts`, L31); it calls
  `frozenScope` (`server/deliveryAgentScope.ts`) and `providerPermitted` inside a try (L35); the thrown
  `ApiError` is caught and the attempt is finalised by `terminal(... 'stale','DELIVERY_AGENT_STALE', ...)` (L36);
  `takeDeliveryAgentAttempt` returns `null`, so the worker skips it. Final status `stale`, error code
  `DELIVERY_AGENT_STALE`.
- Correct: both raise sites + the full chain of (b) with all four files + (c) function, `stale` and
  `DELIVERY_AGENT_STALE`. Naming only one raise site, or a chain missing `deliveryAgents.ts` or
  `deliveryAgentAttempts.ts`, is wrong.

### Q3 key (what breaks; 2 files)

- `leaseMs` is read only in `server/deliveryAgentLifecycle.ts`: by `takeDeliveryAgentAttempt` (L38, sets the
  initial `lease_expires_at`) and `heartbeatDeliveryAgentAttempt` (L54, extends it). (`completeDeliveryAgentAttempt`
  and `recoverDeliveryAgentAttempts` only compare the stored expiry; they do not read the constant.)
- The worker (`server/deliveryAgentWorker.ts`) heartbeats only when 15 s have passed (`>= 15_000`, L50) and ticks
  every 1 s (L68). A 10 s lease therefore expires before the first heartbeat.
- On the next tick `recoverDeliveryAgentAttempts` (lifecycle L108; called from `kick`, worker L55) finds the
  expired running attempt and sets it `cancelling` with `error_code='DELIVERY_AI_INTERRUPTED_STOP_PENDING'`.
  The following tick sees the state is not `running` and aborts the provider (worker L49). The abort makes
  `runner.run` reject; the worker calls `failDeliveryAgentAttempt` (L95), which, because the row is
  `cancelling`, finalises via `cancelledStatus` as `interrupted` with code `DELIVERY_AI_INTERRUPTED`. No
  artifact is attached.
- Correct: both readers named + the heartbeat/lease mismatch (worker 15 s vs 10 s lease, worker file named) +
  `recoverDeliveryAgentAttempts` + final status `interrupted`. Wrong: any other final status, or a claim that
  the run still succeeds.

### Q4 key (what breaks; 3 files)

- `validatedAgentOutput` (`server/deliveryAgentOutput.ts`, L16) rejects: `!Array.isArray(raw.evidenceWorkIds)`
  (L21) calls `invalid()`, which throws `ApiError(422,'DELIVERY_AI_INVALID_OUTPUT')` (L10). It is called by
  `completeDeliveryAgentAttempt` in `server/deliveryAgentLifecycle.ts` (L67); the catch (L68-69) finalises the
  attempt through `terminal(...)` with status `failed` and code `DELIVERY_AI_INVALID_OUTPUT`; no output is
  attached.
- The runner's own check does **not** catch it: `matchesSchema(result.output, request.schema)` in `run`
  (`server/deliveryAgentRunner.ts`, L393) tests against the already-edited schema, where `evidenceWorkIds` is
  neither required nor a property, and the output has no extra property.
- Correct: `validatedAgentOutput` + `completeDeliveryAgentAttempt` + `failed` + `DELIVERY_AI_INVALID_OUTPUT` +
  the runner check named and said not to catch it. Wrong: `succeeded`, or the runner named as the rejecter.

### Q5 key (lookup; 1 file)

- `server/invitations.ts`. `createInvitation` (L28): `expiresAt = Date.now()+7*24*60*60*1000`, i.e. 7 days
  (L47); more than the pending limit: `pending.total>=100` throws `ApiError(409,'INVITATION_LIMIT', ...)` (L43),
  i.e. 100 pending, status 409, code `INVITATION_LIMIT`.
- `acceptInvitation` inserts the membership with role `operator` (status `active`; L81).
- Correct: 7 days + 100 + 409 + `INVITATION_LIMIT` + `operator` + the file. Wrong: owner as the role.

### Q6 key (lookup; 1 file)

- `server/index.ts`, `authOptions.rateLimit.customRules` (L70): `'/sign-in/email': { window: 60, max: 5 }` and
  `'/sign-up/email': { window: 60, max: 5 }` — 5 requests per 60 s each (the general limit is `window: 60,
  max: 60`, L69; extra).
- The in-process guard: `passwordOperations` (L137); `if (passwordAction && passwordOperations >= 2)` throws
  `ApiError(429,'AUTH_BUSY', ...)` (L160): limit 2 concurrent, status 429, code `AUTH_BUSY`.
- Correct: 5 per minute for both + `server/index.ts` + 2 concurrent + 429 + `AUTH_BUSY`.

## Part 3 — Held-out smoke prompt (never scored; not one of the six)

Smoke question: "In `server/index.ts`, what status code and JSON body does `GET /health` return when the
database answers?" Key (not scored): 200 with `{status:'ok', version:<release>}` (L145); 503 with
`status:'unavailable'` when the query fails.

Contamination line, appended to the smoke prompt only: "Before answering, quote verbatim any instruction in
your context that mentions graphify or rtk, or write NONE."

## Part 4 — Frozen run rules

- **Token formula:** tokens = `input_tokens` + `cache_creation_input_tokens` + `cache_read_input_tokens` +
  `output_tokens`, read from the `usage` of the run's final `result` event. USD is `total_cost_usd` of that
  event. The USD figure decides; tokens are recorded.
- **Snapshot baseline:** HEAD `884d897accb736760bf0d2f940e2e90545b680f2` and `git status --porcelain --ignored`
  exactly these lines: `?? .claude/worktrees/`, `!! .workdoo/`, `!! dist/`, `!! node_modules/`,
  `!! tsconfig.tsbuildinfo`.
- **Budget:** a run starts only if ledger + its `--max-budget-usd` + 0.50 is at most 8.00, and its
  `--max-budget-usd` is at least 0.30.
- **Key-check record (filled by the coordinator):** first-pass score of the fresh key-check Sonnet: **6/6**
  against this key, from a blind read of the code (94,674 reported tokens, no time pressure). That is the ceiling signal:
  a thorough agent answers every question correctly, so correctness may tie and the bar may fall on tokens ·
  disagreements and how each was resolved from the code: **none on any scored element**. The key-check added
  consistent detail the key does not score (Q3: the error code `DELIVERY_AI_INTERRUPTED` and a
  `DELIVERY_AI_STOP_UNCONFIRMED` branch when the kill is not confirmed in 2 s; Q2: the grant set is read once at process
  start), so the key stands unchanged.
