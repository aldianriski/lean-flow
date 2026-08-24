// Clean Architecture fitness checking: the inward-dependency rule made mechanical.
//
// V3 §2.1/§8 state the allowed direction — contracts ← domain ← application ← adapters ← apps/cli.
// A convention loses to a deadline; a test does not. This is EPIC-014 D4: "the dependency direction
// is mechanically tested, not remembered."
//
// Match by SHAPE, not substring (L-108). Comments and string literals are stripped before imports
// are read, so a commented-out or merely-mentioned import cannot register as a real edge. SPRINT-083
// T2 shipped a guard that skipped that step and gave a false PASS on text inside an `echo`; the same
// mistake here would report a clean architecture over a violated one.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export type Layer = "app" | "adapters" | "contracts" | "domain" | "test" | "unassigned";

export interface Edge {
  readonly from: string;
  readonly fromLayer: Layer;
  readonly specifier: string;
  readonly toLayer: Layer;
}

export interface Violation {
  /** Named finding — a fixture must fail with ITS finding, never a generic one (CLAUDE.md · L-058). */
  readonly finding: string;
  readonly from: string;
  readonly specifier: string;
}

export interface Report {
  readonly violations: readonly Violation[];
  /** Denominator: a clean report must say what it examined, or a vacuous pass is invisible (L-156). */
  readonly filesExamined: number;
  readonly edgesExamined: number;
}

/** Path → layer. Deliberately explicit: an unrecognised path is `unassigned`, never silently "domain". */
export function layerOf(rel: string): Layer {
  const p = rel.split(sep).join("/");
  // A colocated test file is NOT domain code. V3 §16 asks for exactly this layout -- a feature owns
  // `evaluate-rule.ts` beside `evaluate-rule.test.ts` -- and a test legitimately reaches across
  // layers to reach its subject and its runner. Found by T4: `packages/standard/src/model.test.ts`
  // importing `bun:test` was reported as `domain-imports-infrastructure`, a false positive on the
  // layout the Standard's own reference architecture prescribes. The exemption is by FILENAME, so a
  // production file in the same directory is still fully checked (fixture: `test-file-exemption/`).
  if (p.endsWith(".test.ts") || p.endsWith(".spec.ts")) return "test";
  if (p.startsWith("apps/")) return "app";
  if (p.startsWith("test/")) return "test";
  if (p.startsWith("packages/contracts/")) return "contracts";
  if (/^packages\/[^/]+\/src\/adapters\//.test(p)) return "adapters";
  if (p.startsWith("packages/")) return "domain";
  return "unassigned";
}

/** Where an import specifier points. Relative specifiers resolve against the importer's layer. */
function targetLayer(spec: string, fromLayer: Layer): Layer {
  if (spec.startsWith("apps/") || spec.includes("/apps/")) return "app";
  if (spec.includes("packages/contracts/")) return "contracts";
  if (spec.includes("/adapters/")) return "adapters";
  if (spec.startsWith("packages/") || spec.includes("/packages/")) return "domain";
  return fromLayer;
}

/** Infrastructure a domain module must not reach for directly (V3 §2.1 D · §18). */
export function isInfrastructure(spec: string): boolean {
  return spec.startsWith("node:") || spec.startsWith("bun:") ||
    ["fs", "path", "child_process", "os", "net", "http", "https"].includes(spec);
}

export interface Scan {
  readonly skeleton: string;
  readonly strings: readonly string[];
}

/** Marker delimiter for a redacted string — a character no source file contains. */
const MARK_L = "@@STR";
const MARK_R = "@@";

/**
 * Split source into code, comments and string literals in ONE pass, replacing every string with an
 * opaque marker. Import scanning then runs over a skeleton in which no string CONTENT survives, so
 * prose can never look like code and code can never be mistaken for prose.
 *
 * Three defects found by independent review of the first implementation drove this shape, and all
 * three were false readings of text:
 *   - `require()` was invisible, so a genuine cross-layer dependency read as clean (false negative)
 *   - a multi-line import wider than a fixed 200-character regex window vanished (false negative)
 *   - a backtick literal whose embedded line began with `import … from "…"` counted as a real edge
 *     (false positive) — a landmine for exactly the docstrings this repo writes
 *
 * Patching the regexes a third time was the wrong move: the text needed tokenising, not matching.
 */
export function scan(src: string): Scan {
  let skeleton = "";
  const strings: string[] = [];
  let i = 0;
  while (i < src.length) {
    const two = src.slice(i, i + 2);
    if (two === "//") {
      while (i < src.length && src[i] !== "\n") i++;
    } else if (two === "/*") {
      i += 2;
      while (i < src.length && src.slice(i, i + 2) !== "*/") i++;
      i += 2;
    } else if (src[i] === '"' || src[i] === "'" || src[i] === "`") {
      const q = src[i];
      i++;
      let body = "";
      while (i < src.length && src[i] !== q) {
        if (src[i] === "\\") {
          body += src[i];
          i++;
        }
        if (i < src.length) {
          body += src[i];
          i++;
        }
      }
      i++;
      skeleton += MARK_L + String(strings.length) + MARK_R;
      strings.push(body);
    } else {
      skeleton += src[i];
      i++;
    }
  }
  return { skeleton, strings };
}

/** The code with comments removed and every string reduced to an opaque marker. */
export function stripNonCode(src: string): string {
  return scan(src).skeleton;
}

const MARK = "@@STR(\\d+)@@";

// No length cap anywhere: a wrapped multi-line import must not be able to outrun the matcher.
const IMPORT_RE = new RegExp("(?:^|[;{}\\n])\\s*(?:import|export)\\b[^;]*?\\bfrom\\s*" + MARK, "g");
const BARE_IMPORT_RE = new RegExp("(?:^|[;{}\\n])\\s*import\\s*" + MARK, "g");
const DYNAMIC_RE = new RegExp("\\bimport\\s*\\(\\s*" + MARK, "g");
/** CommonJS. Invisible to the first implementation, so a real violation read as clean. */
const REQUIRE_RE = new RegExp("\\brequire\\s*\\(\\s*" + MARK, "g");

export function importsOf(src: string): string[] {
  const { skeleton, strings } = scan(src);
  const found: string[] = [];
  for (const re of [IMPORT_RE, BARE_IMPORT_RE, DYNAMIC_RE, REQUIRE_RE]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(skeleton)) !== null) {
      const v = strings[Number(m[1])];
      if (v !== undefined) found.push(v);
    }
  }
  return found;
}

function walk(dir: string, acc: string[]): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const e of entries) {
    if (e === "node_modules" || e === ".git" || e === "fixtures") continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, acc);
    else if (e.endsWith(".ts") && !e.endsWith(".d.ts")) acc.push(full);
  }
  return acc;
}

/** A forbidden edge, with the finding name it reports. Adding a rule is a new entry, not a new branch (OCP). */
export interface Rule {
  readonly finding: string;
  readonly from: Layer;
  readonly forbids: (spec: string, toLayer: Layer) => boolean;
}

export const RULES: readonly Rule[] = [
  { finding: "domain-imports-app", from: "domain", forbids: (_s, to) => to === "app" },
  { finding: "domain-imports-infrastructure", from: "domain", forbids: (s) => isInfrastructure(s) },
  { finding: "contracts-imports-adapter", from: "contracts", forbids: (_s, to) => to === "adapters" },
  { finding: "contracts-imports-app", from: "contracts", forbids: (_s, to) => to === "app" },
  { finding: "adapter-imports-app", from: "adapters", forbids: (_s, to) => to === "app" },
];

export function checkLayers(root: string, roots: readonly string[] = ["apps", "packages"]): Report {
  const violations: Violation[] = [];
  let filesExamined = 0;
  let edgesExamined = 0;

  for (const r of roots) {
    for (const file of walk(join(root, r), [])) {
      filesExamined++;
      const rel = relative(root, file);
      const fromLayer = layerOf(rel);
      for (const spec of importsOf(readFileSync(file, "utf8"))) {
        edgesExamined++;
        const toLayer = targetLayer(spec, fromLayer);
        for (const rule of RULES) {
          if (rule.from === fromLayer && rule.forbids(spec, toLayer)) {
            violations.push({ finding: rule.finding, from: rel.split(sep).join("/"), specifier: spec });
          }
        }
      }
    }
  }
  return { violations, filesExamined, edgesExamined };
}
