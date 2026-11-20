---
owner: Maintainer
last_updated: 2026-11-20
update_trigger: TASK-673 closes, or the snapshot HEAD below changes
status: current
id: graphify-workdoo-questions
tags: [tooling]
domain: knowledge
related: [TASK-673]
---

# graphify vs Explore on a workdoo snapshot — question set and answer key

> The TASK-673 fixture. Written before any arm ran, against the snapshot `D:\Research\workdoo` at HEAD
> `884d897accb736760bf0d2f940e2e90545b680f2`. Part 1 is the only part an answering arm may see; Part 2 (key
> and scoring) goes to the coordinator and scorer alone. All paths are relative to the snapshot root.
> Mix: 2 where · 2 calls/depends · 2 what-breaks. Partial scores 0 for the pass bar.

## Part 1 — Questions (hand arms this part only)

Answer from the code under `D:\Research\workdoo` only. Cite exact file paths (relative to that root) and
symbol names. Answer all six.

1. **Where.** The server rejects a specialist-preparation request when the frozen task plus prior artifact is
   too large to send. In which file and function is that check made, what is the limit, and what HTTP status
   and error code does it return?
2. **Where.** Where is the password-hashing algorithm used for email sign-in defined (name the algorithm and
   its cost parameters), and where is it plugged into the authentication framework?
3. **Calls.** Which functions call `providerBoundScopeHash`? Give each caller's name and file.
4. **Calls.** Which functions call `frozenScope`? Give each caller's name and file.
5. **Breaks.** The `prefix` constant in `server/password.ts` is edited (for example to
   `'scrypt$v1$65536$8$3'`) with no data migration. What happens to existing users, and which function
   causes it?
6. **Breaks.** The value of `track.frontZ` in the `factoryLayout` object (`src/scene/factoryLayout.ts`) is
   changed. Which source files read that field directly and so change behaviour?

## Part 2 — Answer key and scoring (coordinator and scorer only)

Each key was read from the code at HEAD above. Score each answer correct / partial / wrong; only correct
counts for the pass bar. Extra true detail never lowers a score; a false claim about a key item does.

### Q1 key

- File `server/deliveryAgentScope.ts`, function `taskScope`: throws when
  `Buffer.byteLength(JSON.stringify(frozen),'utf8') > 16000`.
- `new ApiError(422, 'AGENT_INPUT_TOO_LARGE', ...)` — status 422, code `AGENT_INPUT_TOO_LARGE`.
- Mentioning the backstop `CHECK(... <=16000)` on `input_json` in `server/deliveryAgentSchema.ts` is extra, not
  required.
- Correct: file + function `taskScope` + 16000 bytes + 422 + `AGENT_INPUT_TOO_LARGE` (the numeric 422 and the
  code may come from one quote). Partial: file and function right but limit, status or code missing or wrong.
  Wrong: another file as the place of the check, or no file.

### Q2 key

- `server/password.ts`: scrypt (`node:crypto`), parameters `N=32768 (2^15), r=8, p=3`, 64-byte key, 16-byte
  random salt, `NFKC`-normalised input; functions `hashPassword` and `verifyPassword`.
- Wired in `server/index.ts` in `authOptions` (`BetterAuthOptions`):
  `emailAndPassword: { ..., password: {hash:hashPassword, verify:verifyPassword} }` (line 67).
- Correct: scrypt + N/r/p (N 32768 or 2^15 accepted; r=8; p=3) + `server/password.ts` + `server/index.ts`
  emailAndPassword config. Partial: only one of the two locations, or algorithm without parameters. Wrong: a
  different algorithm or file (for example a third-party library default).

### Q3 key

Exactly two callers, no others anywhere in `server/`, `src/`, `scripts/`:

- `queueAgentAttempt` in `server/deliveryAgentAttempts.ts`.
- `frozenScope` in `server/deliveryAgentScope.ts`.

Correct: both, each with its file. Partial: one of the two. Wrong: a caller not in this list or a missed
file with a wrong claim. Listing the definition site (`providerBoundScopeHash` itself) is not a caller; do not
penalise it unless claimed as one.

### Q4 key

Exactly three callers, all in `server/deliveryAgentLifecycle.ts`:

- `takeDeliveryAgentAttempt`
- `heartbeatDeliveryAgentAttempt`
- `completeDeliveryAgentAttempt`

Correct: all three with the file. Partial: one or two, or all three without the file. Wrong: a caller outside
`server/deliveryAgentLifecycle.ts`, or a wrong function. (`frozenScope` is defined in
`server/deliveryAgentScope.ts`; its own file does not call it.)

### Q5 key

- `verifyPassword` in `server/password.ts` rejects: it requires `parts.slice(0,5).join('$') === prefix`, so every
  stored hash made with the old prefix returns `false`.
- Effect: existing users with email-and-password accounts can no longer sign in (until a reset or migration);
  `hashPassword` would write the new prefix, so new sign-ups and later password changes work.
- Wiring is only `server/index.ts` (`emailAndPassword.password.verify`); no other source file imports
  `server/password.ts`.
- Correct: existing hashes fail verification in `verifyPassword` (named or clearly the prefix check) and
  existing users cannot sign in. Partial: right effect with no cause named, or cause named with no user
  impact. Wrong: claims existing hashes keep working, or that new sign-ups also fail.

### Q6 key

Direct readers of `factoryLayout.track.frontZ`, exactly three files:

- `src/scene/TransportLine.tsx`
- `src/scene/runwayGeometry.ts`
- `src/scene/transferGeometry.ts` (in `poolDock` and the path-length maths at lines 38, 39, 43, 51)

Files that use other `factoryLayout` fields but not `frontZ` (for example `Environment.tsx`,
`FactoryScene.tsx`, `cameraFraming.ts`, `stationHandling.ts`) are not direct readers. Indirect effects through
`transferGeometry.ts` exports are extra, if labelled as indirect.

Correct: all three files named and no non-reader presented as a direct reader. Partial: two of three, or all
three plus a non-reader claimed as direct. Wrong: one or none of the three.
