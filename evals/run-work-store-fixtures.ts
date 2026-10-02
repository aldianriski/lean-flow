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
// SPRINT-106 T2 ADDITIONS, retargeted at SPRINT-111 T5 (membership / derived progress, EPIC-017
// D1 / D2, L-186). Fixture: evals/fixtures/work-store/membership/ -- three sprint files and seven
// synthetic TASK-91x files (hand counts in that fixture's README). The membership contract is
// written once, above `memberIds` below, and implemented independently by selector A and B.
//
//   membership-open-dod (reference / second selector / must-FAIL x2 / active sprints summed /
//                          status-ignoring must-FAIL)   -- figures vs hand count; wrong selection
//                          rules (sprint: stamp, listed path, ignoring status) must read differently.
//   membership-contract                                  -- comment / prose / pathless lines excluded.
//   membership-active-sprints                            -- a real `status: active` scan.
//   membership-census                                    -- both walkers reach every task file.
//   splitFrontmatter (direct CRLF unit case)             -- the function itself, not via readText.
//   membership-open-dod (CRLF copy ...)                  -- end to end on a CRLF-converted tree copy.
//   prime-skill-contract                                 -- a prime SKILL.md carries the by-id rule;
//                          `--prime-skill <path>` redirects the read (never an env var); the message
//                          names the path actually inspected.
//
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Glob } from "bun";

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

// Reads a text file with CRLF normalised to LF. A fresh Windows checkout (core.autocrlf=true)
// materialises every fixture as CRLF; a line-anchored parser that only splits on "\n" then sees
// "---\r" and "## Done when\r" and silently matches nothing (SPRINT-111 T5: membership read 0).
function readText(file: string): string {
  return readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}

// Splits a task file's raw content into { frontmatter, body } on the first two `---` lines.
// CRLF-safe: the input is normalised, so a caller passing raw CRLF text gets the same split.
function splitFrontmatter(rawIn: string): { frontmatter: string; body: string } {
  const raw = rawIn.replace(/\r\n/g, "\n");
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

// MEMBERSHIP CONTRACT -- the ONE definition both selectors implement, each independently. It
// mirrors skills/prime/SKILL.md § Resolution, NOT the freeze checker in sprint-by-reference.md
// (which deliberately counts commented ids; prime is not that checker):
//   - active sprints = every `docs/sprint/SPRINT-*.md` whose frontmatter `status:` is `active`;
//     their open-DoD figures are summed (a closed sprint contributes nothing);
//   - a member = a LIST-ITEM line (`- ` or `* `) under `## Members`, OUTSIDE any HTML comment
//     (single- or multi-line), naming a task path whose basename is `TASK-NNN-<slug>.md`. A prose
//     line, or a list item with no such path, is not a member;
//   - the member's task file is found BY ID in ANY status folder (todo/ in_progress/ done/ cancel/
//     backlog/), never by the listed path and never by the task's `sprint:` stamp;
//   - open DoD = the `- [ ] ` lines under `## Done when` in that file.
// Selector A (reference) and selector B (grep-style) differ in: the directory walk (readdirSync vs
// Bun.Glob), the sprint walk and `status:` read, comment stripping (regex vs a char scanner), the
// member-line parse (regex vs first-token basename), the task key (filename id vs frontmatter id).
// KNOWN DIVERGENCES, NOT proven by A/B agreement here: bare-id or `.bak`-suffixed member paths (A's
// unanchored regex vs B's anchored basename) and a quoted `status: "active"` (A literal vs B
// quote-stripping); neither shape exists in the real sprint files -- see TD (filed at SPRINT-111 close).

// Selector A: the active sprint files, via readdirSync + splitFrontmatter.
function referenceSprintFiles(root: string, onlyActive: boolean): string[] {
  const dir = join(root, "docs", "sprint");
  return readdirSync(dir)
    .filter((n) => /^SPRINT-\d+.*\.md$/.test(n))
    .map((n) => join(dir, n))
    .filter(
      (f) =>
        !onlyActive ||
        splitFrontmatter(readText(f)).frontmatter.match(/^status:\s*(\S+)\s*$/m)?.[1] === "active",
    )
    .sort();
}

// Selector B: the same selection, via Bun.Glob and a line scan of the frontmatter.
function grepStyleSprintFiles(root: string, onlyActive: boolean): string[] {
  const out: string[] = [];
  for (const f of new Glob("docs/sprint/SPRINT-*.md").scanSync({ cwd: root, absolute: true })) {
    let inFm = false;
    let status = "";
    for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (t === "---") {
        if (inFm) break;
        inFm = true;
      } else if (inFm && t.startsWith("status:")) status = t.slice(7).trim().replace(/^["']|["']$/g, "");
    }
    if (!onlyActive || status === "active") out.push(f);
  }
  return out.sort();
}

// Selector A: member ids -- comments stripped by regex, then a list-item regex on the listed path.
function memberIds(sprintFile: string): string[] {
  const { body } = splitFrontmatter(readText(sprintFile));
  const section = extractSection(body.replace(/<!--[\s\S]*?-->/g, ""), "## Members");
  if (section === null) return [];
  const ids: string[] = [];
  for (const line of section.split("\n")) {
    const m = line.match(/^\s*[-*]\s+`?[^\s`]*\bTASK-(\d+)-[^\s`]*\.md/);
    if (m && !ids.includes(`TASK-${m[1]}`)) ids.push(`TASK-${m[1]}`);
  }
  return ids;
}

// Selector B: member ids -- a character scanner removes comments (several per line, spanning
// lines), then the first token of each list item is split on `/` and its basename matched.
function grepStyleMemberIds(sprintFile: string): string[] {
  const set = new Set<string>();
  let inMembers = false;
  let inComment = false;
  for (const raw of readFileSync(sprintFile, "utf8").split(/\r?\n/)) {
    let visible = "";
    for (let i = 0; i < raw.length; ) {
      if (inComment) {
        const close = raw.indexOf("-->", i);
        if (close === -1) i = raw.length;
        else {
          inComment = false;
          i = close + 3;
        }
      } else {
        const open = raw.indexOf("<!--", i);
        if (open === -1) {
          visible += raw.slice(i);
          i = raw.length;
        } else {
          visible += raw.slice(i, open);
          inComment = true;
          i = open + 4;
        }
      }
    }
    const line = visible.trim();
    if (line.startsWith("## ")) {
      inMembers = line === "## Members";
      continue;
    }
    if (!inMembers || !(line.startsWith("- ") || line.startsWith("* "))) continue;
    const token = line.slice(2).trim().split(/\s+/)[0].replace(/`/g, "");
    const m = (token.split("/").pop() ?? "").match(/^TASK-(\d+)-.+\.md$/);
    if (m) set.add(`TASK-${m[1]}`);
  }
  return [...set];
}

function openBoxesUnderDoneWhen(file: string): number {
  const { body } = splitFrontmatter(readText(file));
  const section = extractSection(body, "## Done when");
  if (section === null) return 0;
  return (section.match(/^- \[ \] /gm) ?? []).length;
}

// Selector A: iterates Members; id from the listed path; store lookup by FILENAME id.
function referenceOpenDoD(root: string, sprintFile: string): number {
  const byFilenameId = new Map<string, string>();
  for (const file of findTaskFiles(root)) {
    const id = file.replace(/\\/g, "/").split("/").pop()!.match(/^(TASK-\d+)-/)?.[1];
    if (id) byFilenameId.set(id, file);
  }
  let total = 0;
  for (const id of memberIds(sprintFile)) {
    const file = byFilenameId.get(id);
    if (file) total += openBoxesUnderDoneWhen(file);
  }
  return total;
}

// Selector B's task-file walker (Bun.Glob; distinct from A's readdirSync walker `findTaskFiles`).
// B's counting AND the census below both call THIS function, so the census sees B's real walk.
function grepStyleTaskFiles(root: string): string[] {
  return [...new Glob("docs/work/**/TASK-*.md").scanSync({ cwd: root, absolute: true })];
}

// Selector B: iterates the STORE (its own walk); id from the FRONTMATTER `id:`; kept iff
// in the Members id-set; counted by a per-line state machine.
function grepStyleOpenDoD(root: string, sprintFile: string): number {
  const inSet = new Set(grepStyleMemberIds(sprintFile));
  let total = 0;
  for (const file of grepStyleTaskFiles(root)) {
    let inFrontmatter = false;
    let frontmatterClosed = false;
    let fileId: string | undefined;
    let inDoneWhen = false;
    let fileCount = 0;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!frontmatterClosed) {
        if (trimmed === "---") {
          if (!inFrontmatter) inFrontmatter = true;
          else frontmatterClosed = true;
          continue;
        }
        if (inFrontmatter && trimmed.startsWith("id:")) fileId = trimmed.slice("id:".length).trim();
        continue;
      }
      if (trimmed.startsWith("## ")) {
        inDoneWhen = trimmed === "## Done when";
        continue;
      }
      if (inDoneWhen && trimmed.startsWith("- [ ] ")) fileCount++;
    }
    if (fileId !== undefined && inSet.has(fileId)) total += fileCount;
  }
  return total;
}

const sumOver = (files: string[], f: (file: string) => number) => files.reduce((n, x) => n + f(x), 0);
const base = (f: string) => f.replace(/\\/g, "/").split("/").pop()!;

// Must-FAIL counterpart 1 (the OLD rule): select by the task's frontmatter `sprint:` stamp.
function openDoDBySprintStamp(root: string, sprintId: string): number {
  let total = 0;
  for (const file of findTaskFiles(root)) {
    const { frontmatter } = splitFrontmatter(readText(file));
    if (frontmatter.match(/^sprint:\s*(.+?)\s*$/m)?.[1] !== sprintId) continue;
    total += openBoxesUnderDoneWhen(file);
  }
  return total;
}

// Must-FAIL counterpart 2 (read the LISTED PATH, not by id): a moved member is silently dropped.
function openDoDByListedPath(root: string, sprintFile: string): number {
  const { body } = splitFrontmatter(readText(sprintFile));
  const section = extractSection(body.replace(/<!--[\s\S]*?-->/g, ""), "## Members") ?? "";
  let total = 0;
  for (const line of section.split("\n")) {
    const m = line.match(/^\s*[-*]\s+`?(\S+?\.md)`?\s*$/);
    if (!m) continue;
    try {
      total += openBoxesUnderDoneWhen(join(root, m[1]));
    } catch {
      /* stale path: nothing read */
    }
  }
  return total;
}

const SPRINT_FILE = join(MEMBERSHIP_FIXTURE_ROOT, "docs", "sprint", "SPRINT-901-membership.md");
const HAND_COUNT = 6; // membership/README.md: SPRINT-901 = 2 + 1 + 1 + 2
const ACTIVE_HAND_COUNT = 8; // SPRINT-901 (6) + SPRINT-903 (2); SPRINT-902 is closed
const TASK_CENSUS = 7; // TASK-910 .. TASK-916 under docs/work/, counted by hand
const EXPECT_MEMBERS = ["TASK-910", "TASK-911", "TASK-913", "TASK-914"];
const fmt = (xs: string[]) => `[${xs.join(", ")}]`;

// Case (a): reference figure vs. the fixture README's hand count.
{
  const got = referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, SPRINT_FILE);
  const ok = got === HAND_COUNT;
  report(
    "membership-open-dod (reference matches hand count)",
    ok,
    `referenceOpenDoD(SPRINT-901 ## Members, by id) = ${got}, ${ok ? "matches" : "expected"} the fixture README's hand count of ${HAND_COUNT}`,
  );
}

// Case (b): the second selector must agree -- the query cross-check CLAUDE.md requires.
{
  const ref = referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, SPRINT_FILE);
  const second = grepStyleOpenDoD(MEMBERSHIP_FIXTURE_ROOT, SPRINT_FILE);
  const ok = ref === second;
  report(
    "membership-open-dod (second selector agrees)",
    ok,
    ok
      ? `referenceOpenDoD (iterates Members, filename id) = ${ref} and grepStyleOpenDoD (own Glob walk, frontmatter id) = ${second} agree`
      : `referenceOpenDoD = ${ref} but grepStyleOpenDoD = ${second} -- the two selectors disagree`,
  );
}

// Case (c): the membership contract. SPRINT-901's `## Members` carries a single-line comment, a
// multi-line comment, a prose line and a pathless list item that all name TASK-912; both
// selectors must exclude every one and agree on exactly the four real members.
{
  const a = memberIds(SPRINT_FILE).sort();
  const b = grepStyleMemberIds(SPRINT_FILE).sort();
  const ok = fmt(a) === fmt(EXPECT_MEMBERS) && fmt(b) === fmt(EXPECT_MEMBERS);
  report(
    "membership-contract (single-line comment, multi-line comment, prose line, pathless list item all excluded by BOTH selectors)",
    ok,
    `A = ${fmt(a)}, B = ${fmt(b)}, expected ${fmt(EXPECT_MEMBERS)}`,
  );
}

// Case (d): selection-varying must-FAIL siblings (L-186).
{
  const byId = referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, SPRINT_FILE);
  const stamp = openDoDBySprintStamp(MEMBERSHIP_FIXTURE_ROOT, "SPRINT-901");
  const ok = byId !== stamp;
  report(
    "membership-open-dod (must-FAIL sibling -- old sprint: stamp rule counts the unlisted decoy)",
    ok,
    `by id = ${byId}, by sprint: stamp = ${stamp} (includes TASK-912, stamped SPRINT-901 but not a member) -- ${ok ? "correctly DIFFER" : "SAME, the decoy is not discriminating"}`,
  );
}
{
  const byId = referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, SPRINT_FILE);
  const listed = openDoDByListedPath(MEMBERSHIP_FIXTURE_ROOT, SPRINT_FILE);
  const ok = byId !== listed;
  report(
    "membership-open-dod (must-FAIL sibling -- listed path goes stale after a folder move)",
    ok,
    `by id = ${byId}, by listed path = ${listed} (TASK-911 is listed under todo/ but sits in in_progress/) -- ${ok ? "correctly DIFFER" : "SAME, the stale member is not discriminating"}`,
  );
}

// Case (e): sprint selection is a real `status: active` scan, in both selectors: SPRINT-901 and
// SPRINT-903 are active (summed), SPRINT-902 is closed (its five open boxes must not count).
{
  const aFiles = referenceSprintFiles(MEMBERSHIP_FIXTURE_ROOT, true).map(base);
  const bFiles = grepStyleSprintFiles(MEMBERSHIP_FIXTURE_ROOT, true).map(base);
  const want = ["SPRINT-901-membership.md", "SPRINT-903-membership-active.md"];
  const ok = fmt(aFiles) === fmt(want) && fmt(bFiles) === fmt(want);
  report(
    "membership-active-sprints (status: active scan; closed sprint excluded, two active both selected, by BOTH selectors)",
    ok,
    `A = ${fmt(aFiles)}, B = ${fmt(bFiles)}, expected ${fmt(want)}`,
  );
}
{
  const aTotal = sumOver(referenceSprintFiles(MEMBERSHIP_FIXTURE_ROOT, true), (f) =>
    referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, f),
  );
  const bTotal = sumOver(grepStyleSprintFiles(MEMBERSHIP_FIXTURE_ROOT, true), (f) =>
    grepStyleOpenDoD(MEMBERSHIP_FIXTURE_ROOT, f),
  );
  const ok = aTotal === ACTIVE_HAND_COUNT && bTotal === ACTIVE_HAND_COUNT;
  report(
    "membership-open-dod (active sprints summed: 901 + 903, closed 902 excluded)",
    ok,
    `A = ${aTotal}, B = ${bTotal}, expected ${ACTIVE_HAND_COUNT} (6 + 2)`,
  );
}
{
  const active = sumOver(referenceSprintFiles(MEMBERSHIP_FIXTURE_ROOT, true), (f) =>
    referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, f),
  );
  const all = sumOver(referenceSprintFiles(MEMBERSHIP_FIXTURE_ROOT, false), (f) =>
    referenceOpenDoD(MEMBERSHIP_FIXTURE_ROOT, f),
  );
  const ok = active !== all;
  report(
    "membership-open-dod (must-FAIL sibling -- ignoring status: also sums the closed sprint)",
    ok,
    `active only = ${active}, every sprint file = ${all} -- ${ok ? "correctly DIFFER" : "SAME, the status filter is not discriminating"}`,
  );
}

// Case (f): census. A (findTaskFiles) and B (grepStyleTaskFiles) -- their REAL walkers -- must reach every task file (todo/ in_progress/ done/ cancel/),
// counted by hand (TASK_CENSUS) -- a walker that skips a status folder cannot hide in both.
{
  const rel = (f: string) => f.replace(/\\/g, "/").split("/docs/work/")[1];
  const a = findTaskFiles(MEMBERSHIP_FIXTURE_ROOT).map(rel).sort();
  const b = grepStyleTaskFiles(MEMBERSHIP_FIXTURE_ROOT).map(rel).sort();
  const ok = a.length === TASK_CENSUS && fmt(a) === fmt(b);
  report(
    "membership-census (both walkers reach every task file in every status folder)",
    ok,
    `A walked ${a.length}, B walked ${b.length}, hand census ${TASK_CENSUS}${ok ? "" : `; A-only/B-only differ: A=${fmt(a)} B=${fmt(b)}`}`,
  );
}

// Case (g): splitFrontmatter itself, directly (every selector feeds it readText() output, which is
// already LF, so only a direct call can notice its own CRLF handling go missing).
{
  const r = splitFrontmatter("---\r\nid: TASK-910\r\n---\r\nbody");
  const ok = r.frontmatter === "id: TASK-910" && r.body === "body";
  report(
    "splitFrontmatter (direct CRLF unit case)",
    ok,
    `frontmatter = ${JSON.stringify(r.frontmatter)}, body = ${JSON.stringify(r.body)}, expected "id: TASK-910" and "body"`,
  );
}

// Case (h): CRLF. The same selectors over a CRLF-converted temp copy of the fixture tree must give
// the same figures (a fresh Windows checkout materialises the fixtures as CRLF).
{
  const tmp = mkdtempSync(join(tmpdir(), "membership-crlf-"));
  try {
    const copyCrlf = (src: string, dst: string) => {
      mkdirSync(dst, { recursive: true });
      for (const entry of readdirSync(src, { withFileTypes: true })) {
        if (entry.isDirectory()) copyCrlf(join(src, entry.name), join(dst, entry.name));
        else {
          const text = readFileSync(join(src, entry.name), "utf8").replace(/\r\n/g, "\n");
          writeFileSync(join(dst, entry.name), text.replace(/\n/g, "\r\n"));
        }
      }
    };
    copyCrlf(MEMBERSHIP_FIXTURE_ROOT, tmp);
    const crlfSprint = join(tmp, "docs", "sprint", "SPRINT-901-membership.md");
    const sample = readFileSync(crlfSprint, "utf8");
    const ref = referenceOpenDoD(tmp, crlfSprint);
    const second = grepStyleOpenDoD(tmp, crlfSprint);
    const aActive = sumOver(referenceSprintFiles(tmp, true), (f) => referenceOpenDoD(tmp, f));
    const bActive = sumOver(grepStyleSprintFiles(tmp, true), (f) => grepStyleOpenDoD(tmp, f));
    // The stamp rule reads FRONTMATTER (splitFrontmatter); its LF figure is 10, a parse failure reads 0.
    const stamp = openDoDBySprintStamp(tmp, "SPRINT-901");
    const ok =
      sample.includes("\r\n") &&
      ref === HAND_COUNT &&
      second === HAND_COUNT &&
      aActive === ACTIVE_HAND_COUNT &&
      bActive === ACTIVE_HAND_COUNT &&
      stamp === 10;
    report(
      "membership-open-dod (CRLF copy of the fixture tree gives the same figures)",
      ok,
      `CRLF copy (really CRLF: ${sample.includes("\r\n")}): A = ${ref}, B = ${second} (expected ${HAND_COUNT}); active A = ${aActive}, B = ${bActive} (expected ${ACTIVE_HAND_COUNT}); frontmatter parse (sprint: stamp) = ${stamp} (expected 10)`,
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// Case (i): contract check -- a prime SKILL.md must carry the by-id rule text. Anchors (present at
// 4501cbf, specific to the by-id rule): the `## Members` list as the membership source, the
// "**by id**" lookup, the `docs/work/**/TASK-NNN-*.md` glob. The file read is the repo's prime
// SKILL.md unless `--prime-skill <path>` is passed on THIS command line (the seeded-break proof
// uses it). Deliberately NOT an environment variable: an inherited env var would silently
// redirect the gate (L-067). The message always names the path actually inspected.
{
  const argAt = process.argv.indexOf("--prime-skill");
  const argPath = argAt === -1 ? undefined : process.argv[argAt + 1];
  const skillPath =
    argPath ?? fileURLToPath(new URL("../skills/prime/SKILL.md", import.meta.url));
  const ANCHORS = ["## Members", "**by id**", "docs/work/**/TASK-NNN-*.md"];
  let skillText = "";
  let readErr = "";
  try {
    skillText = readText(skillPath);
  } catch (err) {
    readErr = ` (could not read: ${(err as Error).message})`;
  }
  const missing = ANCHORS.filter((a) => !skillText.includes(a));
  const ok = missing.length === 0 && readErr === "";
  report(
    "prime-skill-contract (v2 by-id membership rule text present)",
    ok,
    ok
      ? `${skillPath} names ${ANCHORS.map((a) => `"${a}"`).join(", ")}`
      : `${skillPath} missing: ${missing.map((a) => `"${a}"`).join(", ")}${readErr}`,
  );
}

console.log(`work-store-fixtures: ${pass} pass, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
