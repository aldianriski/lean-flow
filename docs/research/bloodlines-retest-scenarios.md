---
owner: Maintainer
last_updated: 2026-11-20
update_trigger: A swap re-key or an MDD recompute is appended by TASK-681/682, or the SPRINT-183 run set closes
status: current
id: bloodlines-retest-scenarios
tags: [tooling]
domain: knowledge
related: [graphify-rtk-retest-results, graphify-workdoo-test, rtk-trial-verdict]
---

# Bloodlines re-test — scenarios, answer keys and frozen rules

> SPRINT-183 (TASK-680). Six real past changes of the bloodlinesfamilia web repo, each a blind request plus an answer key
> built from the real diff. Parts 3 and 4 are frozen in one commit before any run; once that hash is recorded no rule is
> edited (end of Part 3). Paths in the keys are bloodlinesfamilia repo-relative paths. Keys and descriptions: Sonnet key
> worker; the leak-grep and blind-check records are added by the coordinator beside this text, never inside Parts 3-4.

| id | pool # | commit | parent | type | subject |
|---|---|---|---|---|---|
| S1 | 1 | 2263c84d22 | b7c9481ef5 | fix | emailed one-time code for a password change |
| S2 | 2 | f0f771defb | dc89bff3db | fix | one membership pick, only ACTIVE counts as verified |
| S3 | 3 | 584a2926f2 | 191166625a | fix | shared safe-next parser closes an open redirect |
| S4 | 4 | e76250d6f6 | 6c7b342b75 | fix | payable = ISSUED or DRAFT; VOID/PAID locked at the DB |
| S5 | 8 | 2161c4fadf | 990ac2e2e8 | feat | members download and update the Android app |
| S6 | 9 | b0cbadbfd0 | eebcb01ddc | refactor | share sticky bar, place search and form pieces (export also scrubs `docs/research/touring-mobile-ux.md`) |
| SPARE | 5 | 4b7d89403b | bafc2daf1f | feat | avatar, verification email, password routes (smoke only: description, no key, never scored) |

## Part 1 — Descriptions (the agent prompt, verbatim)

Each ends with the one fixed sentence quoted in Part 3. Written in a user, issue or PM voice from the real diff.

### S1
```text
A password change today needs nothing but a live session, so anyone holding a member's unlocked phone, or a browser a member left signed in, can take over the account. We want a second proof. When a member asks to change their password, the system sends a short numeric code to the email address they sign in with, and the change only goes through when they type that code. Only members who confirmed that address themselves may ask for a code, requests must be rate limited, a code must expire quickly, allow only a few wrong tries and work exactly once, and it must never be stored in readable form or sit in an outgoing-mail backlog. After a successful change every other signed-in device of that member should be signed out, and the caller should be told whether they themselves must sign in again and whether the other devices were signed out. This has to work on the website's account security screen (a two-step flow: send the code, then enter code plus new password) and for the mobile app's interface, which needs a way to request the code and a changed way to submit the new password. End your answer with a plan of the change: the files to edit or add and why, the functions involved, what else breaks, and which tests to add or update, then a fenced block that starts with the line FILES: and lists one repo-relative path per line, code files first under 'code:' and test files under 'tests:'.
```

### S2
```text
Members who belong to more than one chapter, or whose membership was suspended, see inconsistent things depending on where they look. The public page you reach by scanning a member's QR code still shows a suspended member as verified, and the member's own card, their events calendar and the mobile app's status pill disagree about which chapter they belong to, because some screens take the oldest membership and the app takes the active one first. We want one rule everywhere: the member's main membership is the active one if there is one, otherwise the most recently updated one, and "member since" shows the earliest date they ever joined any chapter. Only an active membership counts as verified, and the public QR page must show one neutral "not verified" label for everyone else, never revealing whether the person is suspended, terminated or has no membership. Chapter-specific content (events calendar, home feed, dashboard feed and gallery) should follow the main chapter only while it is active; otherwise the member gets national headquarters and public content only. Be careful that a suspended member must still see the options to rejoin or enter an invitation on their dashboard, exactly as today. Update the public API description where its wording changes. End your answer with a plan of the change: the files to edit or add and why, the functions involved, what else breaks, and which tests to add or update, then a fenced block that starts with the line FILES: and lists one repo-relative path per line, code files first under 'code:' and test files under 'tests:'.
```

### S3
```text
Security report: the sign-in page, the registration page and the page that finishes an email or social sign-in can be tricked into sending a person to another website. Each accepts a "where to go afterwards" address in the link and only checks that it starts with a single slash and not two. An attacker can craft a link whose address starts with a slash followed by a backslash and a foreign domain, or uses percent-encoded slashes, backslashes, tabs or control characters, which browsers turn into a full external address, so the victim lands on the attacker's site right after logging in. Fix this with one shared rule for "is this a safe in-app destination", used by every place that accepts such an address, including the touring section's helper that builds a login link to resume a deep link. Only genuine in-app absolute paths (a query string is fine, surrounding whitespace is trimmed) may be honoured; anything else falls back to the caller's usual default destination. End your answer with a plan of the change: the files to edit or add and why, the functions involved, what else breaks, and which tests to add or update, then a fenced block that starts with the line FILES: and lists one repo-relative path per line, code files first under 'code:' and test files under 'tests:'.
```

### S4
```text
Finance asked for a change to which invoices can be settled. An invoice can be paid, either by the payment gateway or marked as paid by hand by an admin, when it is issued or still a draft. Cancelled and already-paid invoices are locked: nobody except a super administrator or the server itself may move them. Today only issued invoices are accepted, so a draft invoice that a member pays through the gateway stays unpaid in our system after the money is taken. The rule must hold at every place that marks an invoice as paid: both admin screens (head office finance and the chapter admin area), the gateway's callback, the check that asks the gateway whether a payment went through, and the background gateway sync. It must also be enforced in the database, so that a chapter admin cannot push a cancelled invoice to paid directly or reopen a paid one. When the gateway reports success but no invoice actually changed, that has to show up in the logs instead of passing silently. While you are in there, starting a payment for an invoice must refuse anyone who is not that invoice's owner. End your answer with a plan of the change: the files to edit or add and why, the functions involved, what else breaks, and which tests to add or update, then a fenced block that starts with the line FILES: and lists one repo-relative path per line, code files first under 'code:' and test files under 'tests:'.
```

### S5
```text
Club members should be able to download the Android app from the website, and the app should be able to find out about updates. The app file is private: it must never be publicly reachable. Only members in good standing get a short-lived download link, other signed-in people are refused, and signed-out visitors are sent to log in. Add a members-only page showing the current version number and name, a download button, a checksum people can use to verify the file, the release notes ("what is new") and plain installation steps in Indonesian, since the file is installed outside the Play Store. Link that page from the member dashboard's quick menu and from the existing install guide. The mobile app needs a small authenticated endpoint that returns the latest version, the lowest version still supported, a download link, the checksum, the notes and the address of the page, and answers "not found" when nothing has been published yet. Releases are published by maintainers, so give them a command-line tool that takes the app file, version number, version name, minimum supported version and release notes, computes the checksum, uploads the file, records it as the current release, refuses a version that is not higher than the one already published, and offers a dry run that changes nothing. Update the public API description too. End your answer with a plan of the change: the files to edit or add and why, the functions involved, what else breaks, and which tests to add or update, then a fenced block that starts with the line FILES: and lists one repo-relative path per line, code files first under 'code:' and test files under 'tests:'.
```

### S6
```text
Developer request, no user-visible change. We are about to build a create-a-ride wizard for the touring section, and it needs three things that today are locked inside other screens. First, the fixed bottom bar with a status line plus a primary and a secondary action currently lives inside the ride page's own bar component: move the presentational bar into its own shared component, keep the old import working by re-exporting it. Second, the place-search box buried in the map pin picker (type a place name in Indonesia, press Enter or the search button without submitting the surrounding form, pick a result) should become a reusable component that tells its parent which result was chosen and then clears the list; the pin picker uses it again, and the conversion of a search result into a rounded map pin is shared too. Third, the map in its pick mode needs an optional taller size for a map-first step, and the session form's input styling and error box should be exported for reuse. Existing screens must behave exactly as before. End your answer with a plan of the change: the files to edit or add and why, the functions involved, what else breaks, and which tests to add or update, then a fenced block that starts with the line FILES: and lists one repo-relative path per line, code files first under 'code:' and test files under 'tests:'.
```

### SPARE (smoke only, no key)
```text
The mobile app needs the same account self-service the website has. Add API endpoints so a signed-in member can upload or replace their profile photo (it goes through the server, which validates the photo exactly like the website does and decides the storage location itself; uploads are size-capped at a few megabytes and rate limited), ask for the verification email to be sent again (at most 3 per member per 15 minutes, on web and on mobile alike), and change their password, with the website's rule that only members who verified their own email may do so. The website's existing actions should share the same logic instead of duplicating it. Errors must stay generic: never echo the sign-in link, a token or the password back in responses or logs, and a member without a profile row must still be able to ask for the verification email again. Describe the new endpoints in the public API description. End your answer with a plan of the change: the files to edit or add and why, the functions involved, what else breaks, and which tests to add or update, then a fenced block that starts with the line FILES: and lists one repo-relative path per line, code files first under 'code:' and test files under 'tests:'.
```

## Part 2 — Answer keys

Code files = files under `src/`, `supabase/migrations/`, `scripts/` that carry behaviour. Excluded from every code list:
`docs/openapi.yaml` (documentation, changed in S1, S2, S5, SPARE), `src/types/database.types.ts` (generated, S1),
`eslint-suppressions.json` (churn, S2, SPARE), lockfiles (none changed). Note for the coordinator: the T1 pool counts exclude
migrations and scripts, so a code count here can exceed the pool table by one or two (S4 8 vs 7; S5 8 vs 5; the others match).

### S1 key — 2263c84d22 (parent b7c9481ef5)
- **Code files (7):** `src/lib/password-code.ts` (new) · `src/lib/email.ts` · `src/app/api/v1/me/password/route.ts` · `src/app/api/v1/me/password/code/route.ts` (new) · `src/app/(member)/settings/security/actions.ts` · `src/app/(member)/settings/security/page.tsx` · `supabase/migrations/20261116120000_password_change_codes.sql` (new)
- **Test files (7):** `test/unit/lib/password-code.test.ts` (new) · `test/unit/lib/email-password-code.test.ts` (new) · `test/unit/app/api/v1/me/password-code-route.test.ts` (new) · `test/unit/app/api/v1/me/password-route.test.ts` · `test/unit/app/actions/password-code-actions.test.ts` (new) · `test/unit/app/actions/avatar-verification-password-pins.test.ts` · `test/unit/lib/security/admin-client-actions.test.ts` (four new; the route test, the pins test and the admin-client scan test edited)
- **Symbols:** `requestPasswordCode`, `changePasswordWithCode`, `consumePasswordCode`, `sendPasswordCodeEmail`, `requestPasswordCodeAction`, `changePasswordAction`, `password_change_codes`, `signOutOthers`, `accessTokenOf`
- **Key points:**
  1. A new service-role-only table stores each code as a salted hash with expiry (10 min), a try counter and a consumed marker; the migration enables RLS with no policy and revokes anon/authenticated/PUBLIC. A code is single-use by compare-and-set, the try is spent before the compare (max 5), and a failed password update restores the code.
  2. A new request endpoint mails a 6-digit code only to a member who verified their email themselves, at most 3 per 15 minutes through the existing per-member attempt limiter; outcomes map to 202 / 403 EMAIL_NOT_VERIFIED / 409 no_email / 429 / 500.
  3. Contract change on the existing change-password endpoint: the body now needs `{ password, code }` (6 digits) and the answer is `{ changed, reauthRequired, othersSignedOut }`; after a change every other session is signed out using the caller's own access token (Bearer or session), so every client of that endpoint (mobile app, docs/openapi.yaml) must send the code.
  4. The code mail is sent directly (new direct-send path in the email module), never through `email_queue`, so no plaintext code sits in a table; the mail HTML escapes name and code.
  5. Web: the security settings action `changePasswordAction` changes signature from a password string to `{ password, code }` and gains a request-code action; the page becomes a two-step flow (send code, then code + password) and redirects to login when `reauthRequired`. The old changePassword pins leave the avatar/verification test and move to the new actions test, and the admin-client scan test needs two new EXCEPTIONS entries for the two actions.

### S2 key — f0f771defb (parent dc89bff3db)
- **Code files (9):** `src/lib/member-card.ts` · `src/lib/member-events-read.ts` · `src/app/m/[id]/page.tsx` · `src/app/(member)/dashboard/card/page.tsx` · `src/app/(member)/dashboard/page.tsx` · `src/app/(member)/events/page.tsx` · `src/app/api/v1/me/home/route.ts` · `src/app/api/v1/me/member-card/route.ts` · `src/components/dashboard/MemberDashboard.tsx`
- **Test files (7):** `test/unit/lib/member-card.test.ts` · `test/unit/lib/primary-membership-reachability.test.ts` (new) · `test/unit/components/member-dashboard-gating.test.ts` (new) · `test/unit/app/member-card-page.test.ts` · `test/unit/app/api/v1/me/home-route.test.ts` · `test/unit/app/api/v1/me/member-card-route.test.ts` · `test/unit/app/api/v1/me/events-routes.test.ts` (two new, five edited)
- **Symbols:** `getPrimaryMembership`, `pickPrimaryMembership`, `isVerifiedMembership`, `buildMemberCard`, `readMemberEvents`, `firstJoinedAt`, `activeMembership`
- **Key points:**
  1. One shared pick in the member-card lib: ACTIVE first, then most recently updated (`updated_at` desc, then `created_at`, then `id`), mirroring `get_my_membership()`; `getPrimaryMembership` now reads all the member's rows and returns the pick plus `firstJoinedAt` (earliest `created_at`), which becomes `memberSince`.
  2. The helper must be given the server-side admin client because a session or Bearer client sees ACTIVE rows only; so the card page, dashboard page, events page, `me/home`, `me/member-card` and `readMemberEvents` switch from the caller's client to the admin client, and the public `/m/[id]` page drops its own oldest-first query for the helper.
  3. `verified` becomes ACTIVE only (was "not TERMINATED") in `buildMemberCard` and in `/m/[id]`; the public page shows one generic "Tidak terverifikasi" label for every non-ACTIVE case and never the status.
  4. Chapter content (dashboard feed and gallery, events-page articles, `readMemberEvents` articles, `me/home` scope and `isPool`) follows the primary chapter only while it is ACTIVE, otherwise HQ and public only.
  5. Because the primary membership can now be SUSPENDED, `MemberDashboard` must gate pending state, pool prompt and invitation form on an ACTIVE membership (`activeMembership`), or a suspended member loses the rejoin path; the OpenAPI wording of `memberSince`, `verified` and `isPool` changes with it.

### S3 key — 584a2926f2 (parent 191166625a)
- **Code files (7):** `src/lib/safe-next.ts` (new) · `src/lib/touring/login-redirect.ts` · `src/app/(auth)/login/actions.ts` · `src/app/(auth)/login/page.tsx` · `src/app/(auth)/register/actions.ts` · `src/app/(auth)/register/page.tsx` · `src/app/(auth)/callback/page.tsx`
- **Test files (2):** `test/unit/lib/safe-next.test.ts` (new) · `test/unit/lib/touring/reachability.test.ts`
- **Symbols:** `parseSafeNext`, `safeNextPath`, `loginAction`, `registerAction`
- **Key points:**
  1. New shared guard `parseSafeNext`: accepts only an in-app absolute path (starts with `/`, not `//`), trims whitespace, returns null when unsafe so each caller applies its own default.
  2. Root cause: the inline check `startsWith('/') && !startsWith('//')` lets `/\evil.com` through (browsers turn it into `//evil.com`); the guard rejects any backslash or control character raw or percent-decoded, a decoded `//` start (`/%2F/…`), and malformed encoding (decode throws).
  3. All five entry points that duplicated the inline check use the guard: login action and page, register action and page, auth callback page (callback falls back to `/dashboard`, the form actions to null / the role default).
  4. The touring login-redirect `safeNextPath` is reimplemented over the guard (fallback `/touring` kept), so one rule serves auth and touring and encoded backslashes are now also refused there.
  5. Tests: a new guard test table (safe paths unchanged, unsafe shapes null) and the login reachability test now loops over unsafe values and expects the role-default redirect; a deep link with a query string still resumes.

### S4 key — e76250d6f6 (parent 6c7b342b75)
- **Code files (8):** `src/app/(global-admin)/admin/accounting/actions.ts` · `src/app/(tenant-admin)/console/members/actions.ts` · `src/app/actions/payments.ts` · `src/app/api/payments/[invoiceId]/status/route.ts` · `src/app/api/webhooks/midtrans/route.ts` · `src/lib/payment-match.ts` · `src/lib/payment-sync.ts` · `supabase/migrations/20261004020000_payments_only_server_succeeds.sql` (edited in place)
- **Test files (5, one deleted):** `test/unit/app/(global-admin)/admin/accounting/mark-invoice-paid.test.ts` · `test/unit/app/(tenant-admin)/console/members/actions.test.ts` · `test/unit/app/actions/payments.test.ts` · `test/unit/app/api/payments/[invoiceId]/status/route.test.ts` · `src/components/domain/PaymentButton.test.tsx` (deleted)
- **Symbols:** `markInvoiceAsPaid`, `getMidtransSnapToken`, `warnIfFlipChangedNothing`, `syncInvoiceWithGateway`, `guard_payment_success`, `guard_invoice_status`
- **Key points:**
  1. Payable = ISSUED or DRAFT; both `markInvoiceAsPaid` actions (global accounting, tenant console) accept DRAFT too, and VOID and PAID are still refused (the global one pins its UPDATE with `.in('status', ['ISSUED','DRAFT'])`).
  2. Every gateway-driven flip to PAID (midtrans webhook, payment status route, `syncInvoiceWithGateway`) changes `.eq('status','ISSUED')` to `.in('status', ['ISSUED','DRAFT'])`; otherwise a DRAFT invoice paid at the gateway stays unpaid.
  3. New `warnIfFlipChangedNothing` in the payment-match lib: the three flip sites add `.select('id')` and log a warning when a gateway SUCCESS changed zero rows or errored (ids only, no PII).
  4. DB, in the existing migration (edited in place): the payments SUCCESS guard lets a chapter admin settle an invoice that is ISSUED or DRAFT (VOID refused), and a new `guard_invoice_status` trigger on invoices blocks any status change out of VOID or PAID for a JWT caller unless SUPERADMIN (server calls unaffected); the down-migration drops it.
  5. `getMidtransSnapToken` now refuses a caller who does not own the invoice (`invoice.user_id !== user.id` answers not found); the stray `src/components/domain/PaymentButton.test.tsx` is deleted.

### S5 key — 2161c4fadf (parent 990ac2e2e8)
- **Code files (8):** `src/lib/app-release.ts` (new) · `src/app/api/v1/app/android-latest/route.ts` (new) · `src/app/(member)/dashboard/aplikasi/page.tsx` (new) · `src/components/dashboard/MemberDashboard.tsx` · `src/components/install/InstallGuide.tsx` · `scripts/publish-apk.mjs` (new) · `scripts/lib/publish-apk.mjs` (new) · `supabase/migrations/20261114150000_app_releases_bucket.sql` (new)
- **Test files (5):** `test/unit/lib/app-release.test.ts` (new) · `test/unit/app/api/v1/app/android-latest-route.test.ts` (new) · `test/unit/lib/aplikasi-reachability.test.ts` (new) · `test/unit/scripts/publish-apk.test.ts` (new) · `test/unit/lib/notifications-reachability.test.ts` (tile order expectation)
- **Symbols:** `latestAndroidRelease`, `signedApkUrl`, `parseAndroidRelease`, `hasStanding`, `buildRelease`, `parseArgs`, `android_release`, `app-releases`
- **Key points:**
  1. Hosting: a private `app-releases` storage bucket created by migration (100 MB, no `storage.objects` policy, service role only); the current release record lives in `site_settings` key `android_release` (versionCode, versionName, path, sha256, minSupported, notes, publishedAt), validated by `parseAndroidRelease`.
  2. Access: both the page and the endpoint check `hasStanding(loadIdentity(...))` before minting a 600 s signed URL (`signedApkUrl`); the endpoint answers 403 without standing, 404 with no release, 200 with versionCode, versionName, url, pageUrl, sha256, minSupported, notes (no-store); the page redirects signed-out visitors.
  3. Web page `/dashboard/aplikasi`: version, download button, SHA-256, notes, Indonesian install steps; linked by a new "Aplikasi" tile in `MemberDashboard` and a link card in `InstallGuide`.
  4. Wiring side effect: the dashboard quick-menu order test (notifications-reachability) must expect the new tile appended last; a new reachability test pins the links, force-dynamic, login redirect and standing-before-signing order.
  5. Publish tooling: `scripts/publish-apk.mjs` plus a lib (args, env file, sha256, `buildRelease`, `releasePath`) uploads to the bucket and upserts `site_settings`, refuses a `versionCode` not above the published one, requires `minSupported <= versionCode`, and has `--dry-run`; docs/openapi.yaml documents the endpoint.

### S6 key — b0cbadbfd0 (parent eebcb01ddc)
- **Code files (5):** `src/components/touring/sessions/StickyActionBar.tsx` (new) · `src/components/touring/sessions/RideActionBar.tsx` · `src/components/touring/map/PinControl.tsx` · `src/components/touring/map/MapCanvas.tsx` · `src/components/touring/sessions/SessionForm.tsx`
- **Test files (0):** none changed; no test file is required to change by the commit.
- **Symbols:** `RideActionBar`, `StickyActionBar`, `PlaceSearch`, `pinOf`, `MapCanvas`, `PinControl`, `SessionFormError`, `FIELD`, `LABEL`, `HINT`
- **Key points:**
  1. The presentational `RideActionBar` moves to the new `StickyActionBar.tsx` (still named `RideActionBar`); `RideActionBar.tsx` imports and re-exports it so existing importers (ride page, SOS hold button, the ride bar tests) keep working.
  2. The MapTiler place search moves out of `PinControl` into an exported `PlaceSearch` (props `mapKey`, `tone`, `idBase`, optional `label`, `onChoose`); Enter still never submits the form; choosing a result calls `onChoose` and clears the list; the 2-character minimum stays.
  3. A new exported `pinOf` rounds a search result to a 6-decimal pin and replaces the inline rounding in `PinControl`'s choose handler.
  4. `MapCanvas` pick mode gains an optional `tall` prop that changes only the map height class; default sizing is unchanged.
  5. `SessionForm` exports `FIELD`, `LABEL`, `HINT` and a new `SessionFormError`, which replaces the inline error block, so its rendering is unchanged (no behaviour change, no migration, no contract change for other call sites).

## Part 3 — Frozen rules (frozen in one commit before any run; hash recorded below)

Source: the owner-approved draft, md5 11250ace641b1a7f77502cdad6cad50c, sections "Scoring" to "Order, price, budget"
(lines 24-44) and item 5 of its "Things … that do NOT hold" list, pasted verbatim; heading levels are the only change.
The plan-format sentence appended to every description is, character for character:

> End your answer with a plan of the change: the files to edit or add and why, the functions involved, what else breaks, and which tests to add or update, then a fenced block that starts with the line FILES: and lists one repo-relative path per line, code files first under 'code:' and test files under 'tests:'.

Refinements the sprint G2 added where the draft is silent:
- The FILES instruction is that one fixed sentence, embedded verbatim in every description and quoted here.
- The block assignment seed is the first 8 hex characters of plan_commit (Part 4).
- The leak-grep allowlist is the recorded list in Part 5, at most 25 ordinary words; every allowlisted word is confirmed "not an identifier" by the blind pass.
- Minimum detectable difference recomputes are appended beside the frozen figures, never edits.

### Minimum detectable difference (frozen figures)
5. **Power (RTK's primary metric is tokens by owner ruling, so the USD floor affects only the guard).** From SPRINT-182's 4 same-recipe plain runs (tokens 296,527 / 221,618 / 316,909 / 261,590, mean 274,161, sd 41,819 = 15.3% of mean; USD 0.3171 / 0.1990 / 0.2383 / 0.2046, mean 0.2398, sd 0.0544 = 22.7% of mean) and a paired difference sd of about sqrt(2) x run sd (scenario effect cancels in the pairing, run noise does not): minimum detectable difference at 2 SE with n=6 = 2·sqrt(2)·sd/sqrt(6) = **48,300 tokens (17.6% of mean)** and **0.0628 USD (26.2% of mean)**. So a real 20% token cut is detectable; a 20% USD cut (about 0.048) is below the USD floor, which matters little because USD is only a guard. The C leg has no same-recipe data; its minimum detectable difference is estimated only after the pre-screen (see 680/681). All three figures are recomputed from the pre-screen and smoke runs (681, 682) and refrozen in the results file before the paid set.

Formula: MDD = 2·sqrt(2)·sd/sqrt(6), with sd the sample standard deviation of SPRINT-182's four plain runs.

| metric | runs | mean | sd | MDD (2·sqrt(2)·sd/sqrt(6)) | share of mean |
|---|---|---|---|---|---|
| tokens | 296,527 / 221,618 / 316,909 / 261,590 | 274,161 | 41,819 | **48,300** | 17.6% |
| USD | 0.3171 / 0.1990 / 0.2383 / 0.2046 | 0.2398 | 0.0544 | **0.0628** | 26.2% |
| C (correctness) | no same-recipe data | — | — | **not estimable before the pre-screen** | — |

Recompute rule for C: once the two pre-screen plain plans are blind-scored (TASK-681) the C noise estimate is first
available; compute the same formula on it, then again after the smoke runs (TASK-682) and after the paid set (TASK-683).
The tokens and USD figures are recomputed from the pre-screen and smoke runs by the same formula. Every recompute is
appended beside these frozen figures with its inputs; a frozen figure is never edited or replaced.

### Scoring (frozen before any run, in 680)
- **Plan format:** every arm's final answer ends with a fenced plain-text list, "FILES:" then one repo-relative path per line (code files and test files in two labelled groups). F1 is **computed by script** from that list and the key; the scorer never counts files by hand.
- File recall R = |planned ∩ changed code files| / |changed code files|; precision P = |planned ∩ changed| / |planned files|; F1_code = 2PR/(P+R). Test recall reported beside (not in C). Generated files, lockfiles, docs excluded from the key.
- **Scorer role (blind to arm, tool names redacted):** judges only (a) **equivalents**: a planned file that is not in the key but fills the same change role (rule frozen in 680: it must be edited by the same required change, e.g. a re-export, mapper or shared type the key file forces) is mapped one-to-one to a key file and counted as a match; (b) **justified extras**: a planned file the scorer shows, with a one-line reason from the parent code, is required for a valid plan, is excluded from the precision denominator; (c) key-point coverage; (d) valid alternative plans. Every reclassification is written with its reason; the script then recomputes F1 from the mapping. All 18 plans, plain included, are scored in the one 683 pass; pre-screen plans are never scored as controls.
- Key-point coverage K = covered / total (3-5 points per scenario; covered 1, partial 0.5, missed 0; main functions or symbols count as key points).
- **Correctness C = mean(F1_code, K)**, range 0-1.
- Tokens = input + cache_creation + cache_read + output from the final `result` event; USD = `total_cost_usd`.
- **Paired statistics:** d_i = m(arm, i) − m(plain, i) per scenario; d̄ = mean over the 6; s = sample sd of the 6 d_i. **Real** only if |d̄| > 2·s/√6; otherwise **tie**. **Matters** (owner bar): token effect >= 20% of plain's mean (USD is a guard, never a gain leg), or C gain >= 0.1 (graphify only for the C leg; RTK needs the token cut).
- **Minimum detectable difference per metric** is frozen in 680's committed rules from SPRINT-182's 4 plain runs (figures in item 5 above) and recomputed from the pre-screen and smoke runs; both the frozen and recomputed values are recorded.
- **graphify verdict (primary metric: tokens):** KEEP if C is not clearly lower AND mean tokens <= 1.0x plain (the owner's original token limit, required on every KEEP path including the C-gain path) AND [tokens real and <= 0.80x plain OR C gain real and >= 0.1]. DROP if C is clearly lower (real) OR tokens real and higher. Else INCONCLUSIVE.
- **RTK verdict (primary metric: tokens; USD is a guard):** KEEP if tokens are real and <= 0.80x plain AND USD is not clearly higher (not real-and-higher by the 2-SE rule) AND C is not clearly lower AND `rtk recall` returned a cut output in some run AND the **information-loss audit finds no loss in ANY cut** (audit of every cut in every RTK run, below, regardless of C). DROP if C clearly lower OR USD real and higher OR tokens real and higher OR the audit finds a loss. Else INCONCLUSIVE.
- **RTK information-loss audit:** for every rewritten command in every RTK run, the coordinator re-runs the same command in an unmodified copy of that export (one export at a time) and byte-compares it with what `rtk recall` returns; every line the cut dropped is checked against the key's files, symbols and key points and against the plan; any dropped line bearing on a key file, symbol or key point is a loss, whether or not C fell.
- **Ceiling rule (R4):** plain mean C >= 0.9 over the six voids only a correctness GAIN (the +0.1 leg), because plain then has 0.1 or less of headroom, exactly the minimum gain the owner bar asks; 0.9 is also about 1.5 scoring steps below a perfect 1.0 (a key point is worth 0.1-0.17 of K, so K steps are 0.1-0.17 and C steps 0.05-0.085). A void gain leg does NOT void "C clearly lower" (that still means DROP), and **no KEEP is ever issued on cost alone when the correctness leg is void**: the best outcome is INCONCLUSIVE ("cost-promising, correctness leg void"). 
- **Pre-screen passes on only the 2 hardest scenarios (R4):** the pre-screen applies to the 2 hardest-looking scenarios only. If plain scores < 0.9 on at least one of them the test proceeds; the four unscreened scenarios are noted as unscreened and the ceiling rule above is applied on the actual 683 plain mean. If plain scores >= 0.9 on both, swaps (up to 2) are tried; if still >= 0.9 on every screened scenario the test STOPS.
- **Futility look after 3 blocks (owner):** after blocks 1-3 (3 paired differences per tool), for each tool and its primary metric (tokens for both graphify and RTK; and C for graphify), take the best case: the 3 remaining differences all equal the best of the 3 observed (an optimistic extrapolation, not a mathematical bound; the coordinator says so when asking the owner). If even then the final mean difference would not reach the adoption effect (20% of plain's mean, or +0.1 C), or would not be real by the 2-SE rule, that tool's remaining runs are not launched and the coordinator **asks the owner** (continue, stop, or re-scope); if both tools are futile, all remaining launches stop and the owner is asked.

### Order, price, budget (cap 32.00 USD)
18 runs in 6 scenario blocks; each block runs all three arms on the SAME parent export recipe (a fresh export per run, one on disk at a time). Block order = the six permutations of (P,G,R), once each: PGR, PRG, GPR, GRP, RPG, RGP (each arm in each position twice). Scenario-to-block assignment frozen in 680 (seeded shuffle recorded). The actual execution order is recorded, with each run's first-turn cache state.
Price assumption: 0.7-1.1 USD per planning run (SPRINT-182 plain: 0.22-0.32 on a 22x smaller repo); the pre-screen and smoke prices replace it with measured numbers.
Budget lines (USD): 679 <= 2.50 · 680 <= 2.50 · 681 <= 5.00 (probe, 2 pre-screen plain runs, scorer, and the funded swap step: each swap = re-key + description + blind check + one more pre-screen run, up to 2; if the cap is reached before a needed swap the task stops and asks) · 682 <= 1.50 (arm builds + 3 smoke runs on a spare scenario) · scorer for 18 plans with adjudication <= 2.00 · hold-back 1.50 · runs in 683 <= 17.00 (18 paid runs, all fresh, avg 0.94; the pre-screen runs are paid in 681). Sum 2.5+2.5+5.0+1.5+2.0+1.5+17.0 = 32.0. Per-run `--max-budget-usd` = min(1.50, remaining − 1.50).
Price gate (682): max smoke price x 18 x 1.25 + scorer + hold-back <= remaining: if it fits, 683 proceeds without asking; if not, the task ends `blocked` and asks the owner (options: 5 scenarios x 3 arms, more budget, stop); never shrinks silently.

## Part 4 — Block order and assignment (frozen)

Block order, one per permutation of (P = plain, G = graphify, R = RTK): **PGR, PRG, GPR, GRP, RPG, RGP** (each arm in each position twice).

Assignment method (deterministic, reproducible): seed = `4b8f3b40` (first 8 hex of plan_commit). For each scenario id
S1..S6 compute `sha256(seed + ":" + id)` over the UTF-8 string (e.g. `4b8f3b40:S1`); sort the six digests ascending as
hex strings; the first scenario takes block 1, the second block 2, and so on.

| scenario | sha256("4b8f3b40:<id>") | rank |
|---|---|---|
| S1 | 4e63e7e9b8f910f17d68f2bbd95c5ff56a86d19b304cf653d90f86441fa07dcf | 3 |
| S2 | f72a167859552850a4c36a853693fd7840a506cd5cce5074b6029c590a166f4a | 6 |
| S3 | b4d33952c8c4553b9fca80a258f36d4d54180fa9943d72d3b12b70c8a2d26ef8 | 4 |
| S4 | 031006e4ceeb6c333f9c819343354bd2cb5080b6feb8a1b86df38793cc7cb99b | 1 |
| S5 | ec749ce94275eebf673c6c4734af971f410fb12f5e837fb6e4af96a66b8b4e5a | 5 |
| S6 | 3c2f4ce64e761d4789260994a9045a7be8598bfbb04c871fbb9bc2900e03c0fc | 2 |

| block | order | scenario |
|---|---|---|
| 1 | PGR | S4 |
| 2 | PRG | S6 |
| 3 | GPR | S1 |
| 4 | GRP | S3 |
| 5 | RPG | S5 |
| 6 | RGP | S2 |

A swap in TASK-681 replaces the scenario inside its block; the block order and the other assignments do not change.

### Freeze record
Commit hash of the freeze: the commit that adds this file (subject `sprint(183) T2: freeze …`); the hash is recorded in graphify-rtk-retest-results.md § Bloodlines and in the SPRINT-183 Log, never edited here, so this file stays byte-identical after the freeze. Any scoring, adoption or
noise rule changed after that hash is recorded voids the run set and needs the owner; no rule is edited silently.

## Part 5 — Leak-grep allowlist (final: confirmed by the blind pass 2026-11-20)

Ordinary domain words that may collide with a key identifier or path segment (whole-word, case-sensitive, 4+ characters).
Each must be confirmed "not an identifier" by the blind pass before the allowlist is recorded as final.

15 words (cap 25). Collisions found by a self-run of the leak-grep over the six keys (every key path segment, file name and
symbol of 4+ characters, whole-word, case-sensitive); the coordinator's script run is the record.

| word | collides with | why it is an ordinary word, not an identifier |
|---|---|---|
| admin | path segment `admin` / `(global-admin)` (S4) | the role in plain speech ("chapter admin") |
| card | segment `card` (S2) | the member's digital card, a product noun |
| code | segment `code` (S1) | a short numeric code, and the fixed FILES sentence's own "code files" / `code:` label |
| dashboard | segment `dashboard` (S2, S5) | the member's home screen |
| email | file `email.ts`, segment stem (S1) | the address or message, plain speech |
| events | segment `events` (S2) | the club's events calendar |
| home | segment `home` (S2) | the home feed |
| install | segment `install` (S5) | installing an app |
| login | segment `login` (S3) | signing in |
| member | segment stem `member-card`, `(member)` (S1, S2, S5) | the club's own word for a user |
| page | file stem `page.tsx` (S2, S3, S5) | a web page |
| password | stem `password-code`, segment `password` (S1) | the user's secret, plain speech |
| security | segment `security` (S1) | "account security" in plain speech |
| test | segment `test` (every key with test files) | the fixed FILES sentence's own "test files" |
| touring | segment `touring` (S3, S6) | the club's product area (motorcycle touring) |
| verified | the card field `verified` (S2) | the user-facing state the bug report is about ("shows a suspended member as verified"); added by the coordinator after the leak-grep run |

Coordinator's leak-grep (2026-11-20): first run FAIL with 2 hits outside the list — `verified` (S2, allowlisted above as the
bug's own domain word) and `label` (S6, the new prop's name: the description's "take its own accessible label" clause was
removed, and the matching "gains an optional `label` prop" detail was dropped from S6 key point 1 so the key never scores
what the request no longer asks for).

Reviewed here only by the key worker; each word must be confirmed "not an identifier" by the blind pass before it is final.
Words deliberately avoided instead of allowlisted: `status`, `next`, `tall`, `accounting`, `console`, `payments`, `release`.

