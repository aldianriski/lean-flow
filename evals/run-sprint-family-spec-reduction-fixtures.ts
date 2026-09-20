// evals/run-sprint-family-spec-reduction-fixtures.ts -- RETAINED must-FAIL fixtures for the spec
// reduction in evals/run-sprint-family-fixtures.sh (SPRINT-103 T1).
//
// WHAT IS GUARDED. That harness hands conformance-engine.sh a spec reduced to the 43 rules its 68
// cases actually assert on (S9+S10+S11+S12), because the shipped 100-rule spec costs ~26 ms per
// rule of dispatch on every one of 68 calls -- ~199 s of a measured 319 s (qa-gate-timing.md
// Round 17). The reduction is awk-derived from the shipped spec and carries a DRIFT ANCHOR.
//
// WHY THE ANCHOR IS THE THING WORTH TESTING. If the reduction silently loses a section, every case
// for that section still runs -- and 40 of the 68 are `assert_absent`, which PASSES when a finding
// does not appear. A lost section turns those green while testing nothing: a silent false negative
// in a Tier G guard (ADR-029), the exact shape L-186 names, invisible to everything downstream.
// So the anchor gets its own must-FAIL fixtures, RETAINED (TD-012, L-058) -- deleting them with the
// prototype leaves the guard unguarded.
//
// NOTHING ON DISK IS SEEDED. The seeds vary the anchor's INPUTS (the awk program, the spec it
// reads), never a tracked file, so there is no restore step and no hash convention applies here --
// the "restored under a checked hash" bar (L-137, L-169) governs seeds that patch a tracked file,
// which these deliberately do not.
//
// BOTH THE ANCHOR AND THE AWK ARE LIFTED FROM THE HARNESS, never transcribed. Transcribing the awk
// cost two wrong runs: it contains a backtick and a backslash, and each layer between a TS literal
// and `sh` mangles one of them. Extraction cannot drift and cannot mis-escape, and it means the
// control exercises the real reduction rather than a lookalike.
//
// Run: bun evals/run-sprint-family-spec-reduction-fixtures.ts
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const HARNESS = join(REPO_ROOT, "evals/run-sprint-family-fixtures.sh");
const SPEC = join(REPO_ROOT, "spec/STANDARD.md");
const SECTIONS = "S(9|10|11|12)";

const harnessLines = (): string[] => readFileSync(HARNESS, "utf8").split(/\r?\n/);

/** POSIX sh single-quoting -- the awk program contains backticks, which a double-quoted shell
 *  string would command-substitute. */
const shq = (v: string): string => "'" + v.split("'").join("'\''") + "'";

function sentinel(tag: string): number {
  const lines = harnessLines();
  const hits = lines.map((l, i) => [l, i] as const).filter(([l]) => l.startsWith("# >>> " + tag) || l.startsWith("# <<< " + tag));
  if (hits.length !== 1) throw new Error(`expected exactly 1 ${tag} sentinel in the harness, found ${hits.length} -- the block it brackets cannot be located`);
  const hit = hits[0];
  if (hit === undefined) throw new Error(`unreachable: ${tag} sentinel count checked above`);
  return hit[1];
}

/** The reduction's awk program, lifted VERBATIM from the line after its sentinel -- never
 *  transcribed (it contains a backtick and a backslash that every quoting layer mangles) and never
 *  located by "first line starting with awk", which an added diagnostic line could hijack. */
function harnessAwk(): string {
  const line = harnessLines()[sentinel("SPEC-REDUCTION-AWK") + 1] ?? "";
  // Plain string slicing, not a regex: the suffix contains two `$` and the program contains a
  // backtick and a backslash, and every escaping layer between here and the shell mangled one of
  // them across four drafts. Nothing here is escape-sensitive.
  const PRE = "awk " + String.fromCharCode(39);
  const SUF = String.fromCharCode(39) + ' "' + String.fromCharCode(36) + 'spec_full" > "' + String.fromCharCode(36) + 'spec"';
  if (!line.startsWith(PRE) || !line.endsWith(SUF)) {
    throw new Error("line after SPEC-REDUCTION-AWK is not the reduction call -- the sentinel drifted off its target");
  }
  return line.slice(PRE.length, line.length - SUF.length);
}

/** The anchor's own bytes, bracketed by sentinels rather than by a line-count offset. */
function anchorBody(): string {
  const lines = harnessLines();
  const begin = sentinel("SPEC-REDUCTION-BEGIN");
  const end = sentinel("SPEC-REDUCTION-END");
  if (end <= begin) throw new Error("SPEC-REDUCTION sentinels are out of order");
  const awkAt = sentinel("SPEC-REDUCTION-AWK");
  // Everything after the reduction call, up to and including the closing fi.
  return lines.slice(awkAt + 2, end).join(String.fromCharCode(10));
}

const GOOD = harnessAwk();
{
  // A captured program that merely CONTAINS the sections pattern is not proof it is the reduction --
  // a comment mentioning it would satisfy a substring check. Run it and count what it produces.
  //
  // PER-SECTION, NOT TOTAL. A total-only check proves quantity, not identity: an outside reviewer
  // crafted `S(1|5|6|10|11|12)` which reduces to exactly 43 rows (4+2+4+10+11+12) while dropping
  // §9 entirely and admitting §1/§5/§6, and the total-only probe passed it silently. Counting each
  // required section separately, plus the total to catch leakage, closes that: there is no
  // substitution that keeps all four section counts AND the total and is not the reduction.
  const probe = mkdtempSync(join(tmpdir(), "sfsr-probe-"));
  const out = join(probe, "probe.md");
  execFileSync("sh", ["-c", "awk " + shq(GOOD) + " " + shq(SPEC) + " > " + shq(out)]);
  const countRules = (text: string, re: RegExp): number =>
    text.split(String.fromCharCode(10)).filter((l) => re.test(l)).length; // anchored at ^, so a trailing CR on this CRLF checkout is irrelevant
  const produced = readFileSync(out, "utf8");
  const shipped = readFileSync(SPEC, "utf8");
  const sectionRe = (n: string): RegExp => new RegExp("^[|] `S" + n + "[.]");
  rmSync(probe, { recursive: true, force: true });

  let want = 0;
  for (const n of ["9", "10", "11", "12"]) {
    const got = countRules(produced, sectionRe(n));
    const exp = countRules(shipped, sectionRe(n));
    if (got !== exp) {
      throw new Error(`captured awk produced ${got} §${n} rule rows, shipped spec has ${exp} -- it is not the reduction program`);
    }
    want += exp;
  }
  const total = countRules(produced, new RegExp("^[|] `S[0-9]+[.]"));
  if (total !== want) {
    throw new Error(`captured awk produced ${total} rule rows but only ${want} belong to §9/§10/§11/§12 -- it admits sections the reduction excludes`);
  }
}
const BODY = anchorBody();

function specWithoutSection(section: string): string {
  const dir = mkdtempSync(join(tmpdir(), "sfsr-spec-"));
  const out = join(dir, "spec-seeded.md");
  const kept = readFileSync(SPEC, "utf8").split(/\r?\n/).filter((l) => !l.startsWith("| `" + section + ".")).join("\n");
  writeFileSync(out, kept);
  return out;
}

interface Case {
  readonly name: string;
  readonly awk: string;
  readonly spec: string;
  /** null = control, must stay green; otherwise the finding substring that must appear. */
  readonly expect: string | null;
}

const cases: Case[] = [
  { name: "control-unmodified-reduction", awk: GOOD, spec: SPEC, expect: null },
  { name: "seed-awk-narrowed-to-s9-s10", awk: GOOD.replace(SECTIONS, "S(9|10)"), spec: SPEC, expect: "the reduction drifted from the spec it is derived from" },
  { name: "seed-s2-leaks-through", awk: GOOD.replace(SECTIONS, "S(9|10|11|12|2)"), spec: SPEC, expect: "another section leaked through the reduction" },
  { name: "seed-spec-lost-all-s11-rows", awk: GOOD, spec: specWithoutSection("S11"), expect: "the spec moved under this harness" },
];

let failed = 0;
for (const c of cases) {
  if (c.expect !== null && c.awk === GOOD && c.spec === SPEC) {
    console.log(`FAIL fixture(${c.name}): seed is identical to the control -- it tests nothing (L-142)`);
    failed = 1;
    continue;
  }
  const work = mkdtempSync(join(tmpdir(), "sfsr-run-"));
  const script = [
    "set -u",
    "fail=0",
    "spec_full=" + shq(c.spec),
    "work=" + shq(work),
    'spec="$work/spec-reduced.md"',
    "awk " + shq(c.awk) + ' "$spec_full" > "$spec"',
    BODY,
    'echo "__FAIL=$fail"',
  ].join("\n");
  const scriptPath = join(work, "case.sh");
  writeFileSync(scriptPath, script);

  let out = "";
  try {
    out = execFileSync("sh", [scriptPath], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string };
    out = String(err.stdout ?? "") + String(err.stderr ?? "");
  }
  const rc = /__FAIL=(\d+)/.exec(out)?.[1] ?? "?";
  const finding = out.split("\n").find((l) => l.startsWith("FAIL harness")) ?? "";

  if (c.expect === null) {
    if (rc === "0" && finding === "") console.log(`PASS fixture(${c.name}): control stayed green`);
    else { console.log(`FAIL fixture(${c.name}): control reddened -- ${finding || "fail=" + rc}`); failed = 1; }
  } else if (rc === "1" && finding.includes(c.expect)) {
    console.log(`PASS fixture(${c.name}): reddened with its named finding`);
  } else {
    console.log(`FAIL fixture(${c.name}): expected a finding containing ${JSON.stringify(c.expect)}, got fail=${rc} ${JSON.stringify(finding)}`);
    failed = 1;
  }
  rmSync(work, { recursive: true, force: true });
}

console.log(failed === 0
  ? "PASS harness: spec-reduction anchor discriminates (three drift modes redden with distinct named findings; the control stays green)"
  : "FAIL harness: spec-reduction anchor did not discriminate");
process.exit(failed);
