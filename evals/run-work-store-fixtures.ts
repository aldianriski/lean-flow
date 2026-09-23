// evals/run-work-store-fixtures.ts -- retained proof for the work-item store's transition
// mechanic and filename rule (SPRINT-106 T1, EPIC-017 D1 / D6). Run by Bun:
// `bun evals/run-work-store-fixtures.ts`
//
// WHY THESE ARE RETAINED. TD-012: deleting the fixtures with the prototype leaves the store
// unguarded. These stay.
//
// WHAT EACH CASE CARRIES. `compareToOriginal()` is the ONE comparison function every content
// case below calls -- the must-PASS case, its must-FAIL sibling, and the checkout case all run
// the identical logic, so the sibling cannot silently drift from what case 1 actually checks
// (outside review finding, revise round 1).
//
//   round-trip-identical   must PASS -- a real backlog/ -> todo/ -> backlog/ `git mv` round trip,
//                          each move its own commit, read back off disk and compared with
//                          compareToOriginal().
//   round-trip-follow      must PASS -- `git log --follow` on the final path shows all three
//                          commits (add, move out, move back) -- rename detection survived.
//   round-trip-mutated     must FAIL -- the discrimination sibling (L-142 family). NOT an
//                          in-memory buffer flip: a real edit is written to the file on disk
//                          and COMMITTED between the two `git mv`s, then the SAME
//                          compareToOriginal() case 1 uses is run against the final,
//                          round-tripped, on-disk file. Proves the byte-identity check can
//                          actually redden on a real corrupted pipeline, not a simulated one.
//   round-trip-checkout    must PASS -- the invariant is STORED CONTENT, not working-tree bytes
//                          (owner ruling: CLAUDE.md's hash convention, L-169 -- normalization-
//                          aware by construction). After the same clean round trip as case 1, the
//                          working file is deleted and re-materialized with a real
//                          `git checkout -- <path>` (never exercised by `git mv`, which only
//                          renames the tracked path and never re-invokes checkout smudge
//                          filters). Asserts BOTH: `git rev-parse HEAD:<path>` still equals the
//                          blob id recorded when the fixture was first committed, AND
//                          `git hash-object <checked-out file>` equals it too (hash-object
//                          re-applies the same clean filter before hashing, so host CRLF
//                          conversion on checkout does not register while a real content change
//                          would). Working-tree byte sizes are reported in the line as
//                          information only. The temp repo's core.autocrlf is set explicitly to
//                          this host's probed effective value.
//   round-trip-checkout-mutated   must FAIL -- the discrimination sibling for the case above:
//                          same flow, but with a real committed content edit between the moves
//                          (like round-trip-mutated). Proves the blob-identity comparison
//                          actually reddens on a real content change, not just always agrees.
//   filename-rule/*        must PASS or FAIL per case -- the `TASK-NNN-kebab-slug.md` rule
//                          (docs/work/README.md) against a small good/bad name list: a space, an
//                          uppercase letter, a reserved character, and a valid slug.
//
// SPRINT-106 T2 ADDITIONS (membership / derived progress, EPIC-017 D1 / D2, L-186). Fixture:
// evals/fixtures/work-store/membership/ -- a mini v2 tree, three synthetic TASK-91x files, two
// members of SPRINT-901 (different mixes of open/closed `## Done when` boxes, one with a decoy
// open box OUTSIDE `## Done when` that must not count) and one SPRINT-902 decoy carrying open
// boxes that must never be counted toward SPRINT-901. Hand count in that fixture's own README.
//
//   membership-open-dod (reference matches hand count)     -- referenceOpenDoD(), an
//                          implementation of EXACTLY the rule now stated in skills/prime/SKILL.md
//                          § Resolution, against SPRINT-901 in the fixture, asserted equal to the
//                          fixture README's hand-counted figure (3).
//   membership-open-dod (second selector agrees)           -- grepStyleOpenDoD(), an
//                          INDEPENDENTLY-implemented line-by-line state machine (not the
//                          reference's whole-body regex slice), asserted to agree with the
//                          reference figure -- the query cross-check this repo's CLAUDE.md
//                          requires before acting on a count.
//   membership-open-dod (selection-varying must-FAIL sibling -- decoy included)   -- must-FAIL
//                          sibling (L-186): a selector that ignores the `sprint:` filter entirely
//                          (so it includes TASK-912's SPRINT-902 decoy) MUST produce a DIFFERENT
//                          figure than the correctly-filtered one. Reports PASS when the two
//                          numbers correctly differ -- proving the filter is load-bearing, the
//                          same "sibling correctly reddens" convention as round-trip-mutated above.
//   prime-skill-contract (v2 membership rule text present) -- text-contract check: does
//                          skills/prime/SKILL.md actually carry the rule text naming
//                          `## Done when`, `sprint:` and the `docs/work/**/TASK-*.md` glob.

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const FIXTURE_FILE = fileURLToPath(
  new URL("fixtures/work-store/round-trip/TASK-901-round-trip-fixture.md", import.meta.url),
);
const FIXTURE_NAME = "TASK-901-round-trip-fixture.md";

let pass = 0;
let fail = 0;

function report(name: string, ok: boolean, detail: string) {
  if (ok) {
    console.log(`PASS  work-store-fixture: ${name} -- ${detail}`);
    pass++;
  } else {
    console.log(`FAIL  work-store-fixture: ${name} -- ${detail}`);
    fail++;
  }
}

function git(dir: string, args: string[]): string {
  return execFileSync("git", args, { cwd: dir, encoding: "utf8" });
}

// The ONE comparison every content case below runs. Reads the current on-disk bytes at
// `actualPath` and compares them to `expected`. Nothing upstream of this function is allowed to
// hand it anything other than real, on-disk, post-git-operation content -- that is what makes the
// must-FAIL sibling and the checkout case honest proofs rather than simulations.
function compareToOriginal(actualPath: string, expected: Buffer): { identical: boolean; detail: string } {
  const actual = readFileSync(actualPath);
  const identical = Buffer.compare(expected, actual) === 0;
  return {
    identical,
    detail: identical
      ? `byte-identical (${actual.length} bytes)`
      : `content DIFFERED (${actual.length} bytes on disk vs ${expected.length} bytes expected)`,
  };
}

// Probe this host's EFFECTIVE core.autocrlf (global/system config, no repo-level override) in an
// isolated throwaway repo -- never assumed, never read from this repo's own local config (which
// could itself set an override and mask what a bare `git init` elsewhere on this host would do).
function detectHostAutocrlf(): string {
  const probeDir = mkdtempSync(join(tmpdir(), "work-store-autocrlf-probe-"));
  try {
    git(probeDir, ["init", "-q"]);
    let val = "";
    try {
      val = git(probeDir, ["config", "--get", "core.autocrlf"]).trim();
    } catch {
      val = ""; // unset -- git's built-in default is "false"
    }
    return val || "false";
  } finally {
    rmSync(probeDir, { recursive: true, force: true });
  }
}

const HOST_AUTOCRLF = detectHostAutocrlf();

// The STORED object at <ref>:<relPath> -- what git actually persists, independent of whatever
// smudge/clean conversion the working tree happens to show on disk right now.
function blobAt(dir: string, ref: string, relPath: string): string {
  return git(dir, ["rev-parse", `${ref}:${relPath}`]).trim();
}

// What `git add` would compute for the working-tree file at `relPath` RIGHT NOW. Filters
// (including the core.autocrlf clean conversion) are applied by default -- only `--no-filters`
// would bypass them -- so this re-normalizes host-introduced CRLF the same way a real `git add`
// would, and only a genuine content change survives that normalization to produce a different id.
function hashObject(dir: string, relPath: string): string {
  return git(dir, ["hash-object", relPath]).trim();
}

// --- round-trip harness: a real temp git repo, real commits ------------------------------------

function buildRoundTripRepo(opts?: { mutateBetweenMoves?: boolean }): {
  dir: string;
  finalPath: string;
  originalContent: Buffer;
  originalBlobId: string;
} {
  const dir = mkdtempSync(join(tmpdir(), "work-store-round-trip-"));
  git(dir, ["init", "-q"]);
  // Set explicitly rather than left to inherit ambiently -- the host's own probed value, so the
  // fixture's behavior is documented and reproducible rather than a silent function of whoever's
  // global gitconfig happens to run it.
  git(dir, ["config", "core.autocrlf", HOST_AUTOCRLF]);
  git(dir, ["config", "user.email", "fixture@example.com"]);
  git(dir, ["config", "user.name", "Fixture Bot"]);

  const originalContent = readFileSync(FIXTURE_FILE);

  mkdirSync(join(dir, "backlog"), { recursive: true });
  const backlogPath = join(dir, "backlog", FIXTURE_NAME);
  writeFileSync(backlogPath, originalContent);
  git(dir, ["add", `backlog/${FIXTURE_NAME}`]);
  git(dir, ["commit", "-q", "-m", "work-store: add TASK-901 to backlog"]);
  // Recorded once, right after the FIRST commit -- this is the stored-content invariant every
  // later assertion is checked against, never re-derived from a later, possibly-smudged read.
  const originalBlobId = blobAt(dir, "HEAD", `backlog/${FIXTURE_NAME}`);

  mkdirSync(join(dir, "todo"), { recursive: true });
  git(dir, ["mv", `backlog/${FIXTURE_NAME}`, `todo/${FIXTURE_NAME}`]);
  git(dir, ["commit", "-q", "-m", "work-store: TASK-901 backlog -> todo"]);

  if (opts?.mutateBetweenMoves) {
    // A REAL on-disk edit, committed between the two moves -- not a buffer flip after the fact.
    // This is what a corrupted pipeline actually looks like: something touched the file's content
    // while it happened to be sitting in todo/.
    const todoPath = join(dir, "todo", FIXTURE_NAME);
    const content = readFileSync(todoPath);
    const mutated = Buffer.from(content);
    mutated[0] = (mutated[0]! + 1) % 256; // flip one byte, written to disk and committed
    writeFileSync(todoPath, mutated);
    git(dir, ["add", `todo/${FIXTURE_NAME}`]);
    git(dir, ["commit", "-q", "-m", "work-store: FIXTURE-ONLY corruption seeded between moves (must-FAIL sibling)"]);
  }

  git(dir, ["mv", `todo/${FIXTURE_NAME}`, `backlog/${FIXTURE_NAME}`]);
  git(dir, ["commit", "-q", "-m", "work-store: TASK-901 todo -> backlog"]);

  return { dir, finalPath: join(dir, "backlog", FIXTURE_NAME), originalContent, originalBlobId };
}

function followCommitCount(dir: string, relPath: string): number {
  const out = git(dir, ["log", "--follow", "--format=%H", "--", relPath]);
  return out.split("\n").filter((l) => l.trim().length > 0).length;
}

// Case 1: the real, unmutated round trip. Read off disk, compared with compareToOriginal().
{
  const { dir, finalPath, originalContent } = buildRoundTripRepo();
  try {
    const { identical, detail } = compareToOriginal(finalPath, originalContent);
    report(
      "round-trip-identical",
      identical,
      identical ? `backlog -> todo -> backlog returned ${detail}` : detail,
    );

    const followCount = followCommitCount(dir, `backlog/${FIXTURE_NAME}`);
    const followOk = followCount === 3;
    report(
      "round-trip-follow",
      followOk,
      followOk
        ? `git log --follow shows all 3 commits (add, move out, move back)`
        : `git log --follow shows ${followCount} commit(s), expected 3 -- rename detection lost history`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Case 2: the must-FAIL discrimination sibling. A real on-disk edit, committed between the two
// moves, then the SAME compareToOriginal() case 1 used, run against the final round-tripped file.
{
  const { dir, finalPath, originalContent } = buildRoundTripRepo({ mutateBetweenMoves: true });
  try {
    const { identical, detail } = compareToOriginal(finalPath, originalContent);
    const siblingCorrectlyReddened = identical === false;
    report(
      "round-trip-mutated (must-FAIL sibling)",
      siblingCorrectlyReddened,
      siblingCorrectlyReddened
        ? `a real on-disk edit committed between the two git mv's correctly reddened compareToOriginal() -- ${detail} -- discrimination proven on the real pipeline, not simulated`
        : `a real committed edit between moves did NOT redden compareToOriginal() (${detail}) -- the check cannot discriminate`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Case 3: the checkout case. `git mv` never re-invokes checkout smudge filters -- it only renames
// the tracked path on disk. This case forces a REAL fresh checkout of the round-tripped path
// (delete the working file, `git checkout -- <path>`), then checks the STORED-CONTENT invariant,
// not working-tree bytes (owner ruling -- CLAUDE.md's hash convention, L-169: normalization-aware
// by construction). Two independent checks, both against the blob id recorded at first commit:
//   (a) git rev-parse HEAD:<path> after the final commit -- the tracked object itself never moved.
//   (b) git hash-object <checked-out file> -- re-applies the same clean filter (the crlf
//       conversion core.autocrlf drives) before hashing, so host-introduced CRLF on checkout does
//       not register, while a genuine content change would still produce a different id.
{
  const { dir, finalPath, originalBlobId } = buildRoundTripRepo();
  try {
    const relPath = `backlog/${FIXTURE_NAME}`;
    const bytesBeforeCheckout = readFileSync(finalPath).length;
    rmSync(finalPath);
    git(dir, ["checkout", "--", relPath]);
    const bytesAfterCheckout = readFileSync(finalPath).length;

    const finalBlobId = blobAt(dir, "HEAD", relPath);
    const checkedOutHash = hashObject(dir, relPath);
    const blobIdMatches = finalBlobId === originalBlobId;
    const hashObjectMatches = checkedOutHash === originalBlobId;
    const ok = blobIdMatches && hashObjectMatches;

    report(
      `round-trip-checkout (method: blob identity via git rev-parse HEAD:<path> vs git hash-object <checked-out file>; core.autocrlf=${HOST_AUTOCRLF})`,
      ok,
      ok
        ? `stored content round-trips identically -- HEAD:<path> blob ${finalBlobId.slice(0, 12)} == original ${originalBlobId.slice(0, 12)}, and hash-object of the checked-out file (re-applying the same clean filter) also matches. Working-tree bytes: ${bytesBeforeCheckout} before the fresh checkout, ${bytesAfterCheckout} after (informational only -- core.autocrlf=${HOST_AUTOCRLF} legitimately changes on-disk line endings without changing stored content)`
        : `stored content did NOT round-trip -- HEAD:<path>=${finalBlobId.slice(0, 12)} (expected ${originalBlobId.slice(0, 12)}, match=${blobIdMatches}), hash-object=${checkedOutHash.slice(0, 12)} (match=${hashObjectMatches}). Working-tree bytes: ${bytesBeforeCheckout} before checkout, ${bytesAfterCheckout} after`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// Case 4: must-FAIL sibling for the checkout/blob-identity path above. Same flow, but with a real
// committed content edit between the two moves. Proves the blob-identity comparison actually
// discriminates a real content change surviving a fresh checkout, not just always agreeing with
// itself.
{
  const { dir, finalPath, originalBlobId } = buildRoundTripRepo({ mutateBetweenMoves: true });
  try {
    const relPath = `backlog/${FIXTURE_NAME}`;
    rmSync(finalPath);
    git(dir, ["checkout", "--", relPath]);

    const finalBlobId = blobAt(dir, "HEAD", relPath);
    const checkedOutHash = hashObject(dir, relPath);
    const blobIdDiffers = finalBlobId !== originalBlobId;
    const hashObjectDiffers = checkedOutHash !== originalBlobId;
    const siblingCorrectlyReddened = blobIdDiffers && hashObjectDiffers;

    report(
      "round-trip-checkout-mutated (must-FAIL sibling)",
      siblingCorrectlyReddened,
      siblingCorrectlyReddened
        ? `a real on-disk edit committed between the two git mv's correctly reddened BOTH blob-identity checks -- HEAD:<path>=${finalBlobId.slice(0, 12)} != original ${originalBlobId.slice(0, 12)}, hash-object=${checkedOutHash.slice(0, 12)} != original -- discrimination proven on the real pipeline, not simulated`
        : `a real committed edit between moves did NOT redden the blob-identity checks (HEAD:<path> match=${!blobIdDiffers}, hash-object match=${!hashObjectDiffers}) -- the check cannot discriminate`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// --- filename rule: TASK-NNN-kebab-slug.md, [a-z0-9-] only after the id -----------------------

const FILENAME_RULE = /^TASK-\d+-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

interface FilenameCase {
  readonly name: string;
  readonly filename: string;
  readonly expectValid: boolean;
  readonly why: string;
}

const FILENAME_CASES: FilenameCase[] = [
  {
    name: "valid-slug",
    filename: "TASK-901-round-trip-fixture.md",
    expectValid: true,
    why: "must-PASS control -- a compliant slug",
  },
  {
    name: "space",
    filename: "TASK-901 round trip fixture.md",
    expectValid: false,
    why: "a space is a live rename hazard (kerjaan's own layout, explicitly rejected)",
  },
  {
    name: "uppercase",
    filename: "TASK-901-Round-Trip-Fixture.md",
    expectValid: false,
    why: "an uppercase letter risks a case-only rename on a case-insensitive Windows checkout",
  },
  {
    name: "reserved-char",
    filename: "TASK-901-round:trip.md",
    expectValid: false,
    why: "`:` is a reserved character on Windows filesystems",
  },
];

for (const c of FILENAME_CASES) {
  const valid = FILENAME_RULE.test(c.filename);
  const ok = valid === c.expectValid;
  report(
    `filename-rule/${c.name}`,
    ok,
    ok
      ? `"${c.filename}" correctly ${c.expectValid ? "accepted" : "rejected"} (${c.why})`
      : `"${c.filename}" expected ${c.expectValid ? "accepted" : "rejected"}, got ${valid ? "accepted" : "rejected"} (${c.why})`,
  );
}

// --- SPRINT-106 T2: membership -- open DoD derived from docs/work/**/TASK-*.md by sprint: -------

const MEMBERSHIP_FIXTURE_ROOT = fileURLToPath(
  new URL("fixtures/work-store/membership", import.meta.url),
);

// Recursively collects every `TASK-*.md` file under `<root>/docs/work/`.
function findTaskFiles(root: string): string[] {
  const docsWork = join(root, "docs", "work");
  const out: string[] = [];
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && /^TASK-.*\.md$/.test(entry.name)) {
        out.push(full);
      }
    }
  }
  walk(docsWork);
  return out;
}

// Splits a task file's raw content into { frontmatter, body } on the first two `---` lines.
function splitFrontmatter(raw: string): { frontmatter: string; body: string } {
  const lines = raw.split("\n");
  if (lines[0]?.trim() !== "---") return { frontmatter: "", body: raw };
  const closeIdx = lines.indexOf("---", 1);
  if (closeIdx === -1) return { frontmatter: "", body: raw };
  return {
    frontmatter: lines.slice(1, closeIdx).join("\n"),
    body: lines.slice(closeIdx + 1).join("\n"),
  };
}

// Extracts the body text under a `## <heading>` line (anchored to the START of a line -- never a
// bare substring search, which would false-match the heading text if it is ever quoted or
// mentioned in prose elsewhere in the file, e.g. inside another section's own text) up to the next
// `## ` heading or EOF. Returns null if the heading line itself is not present.
function extractSection(body: string, heading: string): string | null {
  const headingRe = new RegExp(`^${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "m");
  const m = headingRe.exec(body);
  if (!m) return null;
  const rest = body.slice(m.index + m[0].length);
  const nextHeading = rest.search(/\n## /);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

// Reference implementation -- EXACTLY the rule stated in skills/prime/SKILL.md § Resolution:
// "on a v2 tree (`docs/work/` present), open DoD = count of `- [ ]` lines under `## Done when`
// across `docs/work/**/TASK-*.md` whose `sprint:` equals an active sprint's id; `sprint:` must
// match exactly, so a member of another sprint is never counted."
function referenceOpenDoD(root: string, sprintId: string): number {
  let total = 0;
  for (const file of findTaskFiles(root)) {
    const { frontmatter, body } = splitFrontmatter(readFileSync(file, "utf8"));
    const sprintMatch = frontmatter.match(/^sprint:\s*(.+?)\s*$/m);
    if (sprintMatch?.[1] !== sprintId) continue; // exact match only
    const section = extractSection(body, "## Done when");
    if (section === null) continue;
    const opens = section.match(/^- \[ \] /gm);
    total += opens ? opens.length : 0;
  }
  return total;
}

// Second, INDEPENDENTLY-implemented selector (T2 DoD: "a second count by a different selector
// (per-file `grep -c` summed) agrees"). Same rule, a genuinely different code path: a per-line
// state machine emulating `grep -c` restricted to the `## Done when` section, rather than the
// reference's whole-body regex slice-and-count. Avoids shelling out to a system `grep` binary
// (not reliably on PATH for a bare Bun/Windows host outside Git Bash) while still counting
// line-by-line the way `grep -c` would.
function grepStyleOpenDoD(root: string, sprintId: string): number {
  let total = 0;
  for (const file of findTaskFiles(root)) {
    const lines = readFileSync(file, "utf8").split("\n");
    let inFrontmatter = false;
    let frontmatterClosed = false;
    let fileSprint: string | undefined;
    let inDoneWhen = false;
    let fileCount = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!frontmatterClosed) {
        if (trimmed === "---") {
          if (!inFrontmatter) inFrontmatter = true;
          else frontmatterClosed = true;
          continue;
        }
        if (inFrontmatter && trimmed.startsWith("sprint:")) {
          fileSprint = trimmed.slice("sprint:".length).trim();
        }
        continue;
      }
      if (trimmed.startsWith("## ")) {
        inDoneWhen = trimmed === "## Done when";
        continue;
      }
      if (inDoneWhen && trimmed.startsWith("- [ ] ")) fileCount++;
    }
    if (fileSprint === sprintId) total += fileCount;
  }
  return total;
}

// The broken/selection-varying counterpart used only by the must-FAIL sibling below: identical to
// referenceOpenDoD's Done-when extraction, but with NO `sprint:` filter at all -- every member
// file's open boxes count, regardless of which sprint it belongs to.
function openDoDIgnoringSprintFilter(root: string): number {
  let total = 0;
  for (const file of findTaskFiles(root)) {
    const { body } = splitFrontmatter(readFileSync(file, "utf8"));
    const section = extractSection(body, "## Done when");
    if (section === null) continue;
    const opens = section.match(/^- \[ \] /gm);
    total += opens ? opens.length : 0;
  }
  return total;
}

// Case (a): reference figure vs. the fixture README's hand count.
{
  const HAND_COUNT = 3; // evals/fixtures/work-store/membership/README.md § Hand-counted expected figure
  const got = referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, "SPRINT-901");
  const ok = got === HAND_COUNT;
  report(
    "membership-open-dod (reference matches hand count)",
    ok,
    ok
      ? `referenceOpenDoD(SPRINT-901) = ${got}, matches the fixture README's hand count of ${HAND_COUNT}`
      : `referenceOpenDoD(SPRINT-901) = ${got}, expected the fixture README's hand count of ${HAND_COUNT}`,
  );
}

// Case (b): a second, independently-implemented selector must agree with case (a)'s figure --
// the query cross-check CLAUDE.md requires before acting on a count.
{
  const ref = referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, "SPRINT-901");
  const grepStyle = grepStyleOpenDoD(MEMBERSHIP_FIXTURE_ROOT, "SPRINT-901");
  const ok = ref === grepStyle;
  report(
    "membership-open-dod (second selector agrees)",
    ok,
    ok
      ? `referenceOpenDoD = ${ref} and grepStyleOpenDoD (independent line-by-line implementation) = ${grepStyle} agree`
      : `referenceOpenDoD = ${ref} but grepStyleOpenDoD = ${grepStyle} -- the two selectors disagree`,
  );
}

// Case (c): selection-varying must-FAIL sibling (L-186). A selector that ignores the `sprint:`
// filter entirely (so TASK-912's SPRINT-902 decoy is included) MUST produce a DIFFERENT figure
// than the correctly-filtered one -- reports PASS when the sibling correctly reddens (the numbers
// differ), the same "sibling correctly reddens" convention round-trip-mutated uses above.
{
  const filtered = referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, "SPRINT-901");
  const unfiltered = openDoDIgnoringSprintFilter(MEMBERSHIP_FIXTURE_ROOT);
  const selectorMatters = filtered !== unfiltered;
  report(
    "membership-open-dod (selection-varying must-FAIL sibling -- decoy included)",
    selectorMatters,
    selectorMatters
      ? `filtered (SPRINT-901 only) = ${filtered}, unfiltered (ignores sprint:, includes TASK-912's SPRINT-902 decoy) = ${unfiltered} -- correctly DIFFER, proving the sprint: filter is load-bearing`
      : `filtered = ${filtered} and unfiltered = ${unfiltered} are the SAME -- the sprint: filter has no effect, discrimination NOT proven`,
  );
}

// Case (d): contract check -- skills/prime/SKILL.md must carry the v2 membership rule text,
// naming `## Done when`, `sprint:`, and the `docs/work/**/TASK-*.md` glob.
{
  const skillPath = fileURLToPath(new URL("../skills/prime/SKILL.md", import.meta.url));
  const skillText = readFileSync(skillPath, "utf8");
  const hasDoneWhen = skillText.includes("## Done when");
  const hasSprintField = skillText.includes("sprint:");
  const hasDocsWorkGlob = skillText.includes("docs/work/**/TASK-*.md");
  const ok = hasDoneWhen && hasSprintField && hasDocsWorkGlob;
  report(
    "prime-skill-contract (v2 membership rule text present)",
    ok,
    ok
      ? `skills/prime/SKILL.md names "## Done when", "sprint:" and "docs/work/**/TASK-*.md"`
      : `skills/prime/SKILL.md missing one of: "## Done when" (${hasDoneWhen}), "sprint:" (${hasSprintField}), "docs/work/**/TASK-*.md" (${hasDocsWorkGlob})`,
  );
}

console.log(`work-store-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
