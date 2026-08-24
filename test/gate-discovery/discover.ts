// The four-rung gate-discovery order, as `dispatch.md` § System verify defines it, implemented so
// it can be asserted instead of walked by hand.
//
// Why this exists (SPRINT-083 T2): rung 4 (`.gate-command`) is explicitly LAST, because "anything
// discoverable wins over it". This repository had no manifest, so rung 4 answered. Adding a root
// `package.json` created the first rung-1 hit in its history and silently outranked the
// declaration. That is safe here only because the manifest's test script invokes the real gate --
// and nothing was checking that. Now something is.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type Rung = 1 | 2 | 3 | 4;

export interface Discovery {
  /** Which rung answered, or null when every rung missed (`no-gate-discovered`). */
  readonly rung: Rung | null;
  /** The command the discovery order produced, or null when it could not be extracted. */
  readonly command: string | null;
  /**
   * Whether this implementation can extract a command for the rung that answered.
   *
   * dispatch.md's spec says rungs 2 and 3 read the actual Makefile/justfile target and the CI test
   * step. This implementation does NOT: it detects the rung and reports `extractable: false`.
   * Stated as a limitation rather than left as a bare `null`, because a null that means "no gate"
   * and a null that means "I could not read the gate" are different facts, and conflating them is
   * how a guard reports safety it never established. Consumers must treat it as conservative:
   * unknown is bypassed, never safe. Latent here — this repo has no Makefile, justfile or CI dir.
   */
  readonly extractable: boolean;
  /** Rungs examined, so a pass can report its own denominator rather than assert into the void (L-156). */
  readonly examined: readonly Rung[];
}

const MANIFESTS = ["package.json", "pyproject.toml", "Cargo.toml", "go.mod"] as const;
const MAKEFILES = ["Makefile", "makefile", "justfile", "Justfile"] as const;
const CI_DIRS = [".github/workflows", ".circleci", ".gitlab-ci.yml"] as const;

/** First non-blank, non-comment line of a `.gate-command` file — the shape that file documents. */
function declaredCommand(root: string): string | null {
  const p = join(root, ".gate-command");
  if (!existsSync(p)) return null;
  let text: string;
  try {
    text = readFileSync(p, "utf8");
  } catch {
    // A real I/O failure (permissions, a directory in its place) is `gate-declaration-unreadable`,
    // not "no declaration". Both resolve to null here, but throwing would abort the whole discovery
    // walk — a guard that crashes reports nothing, which is worse than reporting a miss.
    return null;
  }
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (t !== "" && !t.startsWith("#")) return t;
  }
  // Present but declaring nothing readable: `gate-declaration-unreadable`. NOT a discovered gate —
  // a declaration nobody can read is worse than none, because it looks like an answer (ADR-031).
  return null;
}

function manifestScript(root: string): string | null {
  const p = join(root, "package.json");
  if (!existsSync(p)) return null;
  try {
    const pkg = JSON.parse(readFileSync(p, "utf8")) as { scripts?: Record<string, string> };
    for (const name of ["test", "check", "verify"]) {
      const cmd = pkg.scripts?.[name];
      if (typeof cmd === "string" && cmd.trim() !== "") return cmd;
    }
  } catch {
    return null;
  }
  return null;
}

export function discoverGate(root: string): Discovery {
  const examined: Rung[] = [];

  examined.push(1);
  const script = manifestScript(root);
  if (script !== null) return { rung: 1, command: script, extractable: true, examined };
  // Other manifest kinds are recognised as rung-1 candidates even though this repo has none;
  // omitting them would make the order silently package.json-shaped.
  for (const m of MANIFESTS.slice(1)) {
    if (existsSync(join(root, m))) return { rung: 1, command: null, extractable: false, examined };
  }

  examined.push(2);
  for (const m of MAKEFILES) {
    if (existsSync(join(root, m))) return { rung: 2, command: null, extractable: false, examined };
  }

  examined.push(3);
  for (const c of CI_DIRS) {
    if (existsSync(join(root, c))) return { rung: 3, command: null, extractable: false, examined };
  }

  examined.push(4);
  const declared = declaredCommand(root);
  if (declared !== null) return { rung: 4, command: declared, extractable: true, examined };

  return { rung: null, command: null, extractable: true, examined };
}

/**
 * Does `command` actually EXECUTE `declared`, as opposed to merely mentioning it?
 *
 * A substring test cannot tell those apart, and that is not a hypothetical: independent review of
 * SPRINT-083 T2 broke the first version of this function with
 *   echo 'not running sh scripts/qa-check.sh, just printing' && exit 0
 * which contains the declared command as literal text inside an `echo` argument and never runs it.
 * `includes()` reported "not bypassed" — a false PASS in the guard whose whole job is to stop a
 * false PASS. That is L-108's substring trap (match by SHAPE, not substring) inside a guard written
 * during a session that twice cited it.
 *
 * Shape, not substring: strip quoted spans so text inside them can never look like a command, split
 * on shell separators, and require some resulting segment to BEGIN with the declared command.
 */
export function invokes(command: string, declared: string): boolean {
  // Replace quoted spans with a placeholder that cannot start a command. Done before splitting, so
  // a separator inside quotes cannot manufacture a segment that begins with the declared string.
  const unquoted = command.replace(/'[^']*'/g, " Q ").replace(/"[^"]*"/g, " Q ");
  return unquoted
    .split(/&&|\|\||;|\||\n/)
    .map((seg) => seg.trim())
    .some((seg) => seg === declared || seg.startsWith(`${declared} `));
}

export function bypassesDeclaredGate(root: string): {
  bypassed: boolean;
  declared: string | null;
  discovered: string | null;
} {
  const declared = declaredCommand(root);
  const { command } = discoverGate(root);
  if (declared === null) return { bypassed: false, declared: null, discovered: command };
  // A rung answered but its command could not be extracted (rungs 2/3, non-package.json manifests).
  // Conservative on purpose: unknown is treated as bypassed, never as safe.
  if (command === null) return { bypassed: true, declared, discovered: null };
  return { bypassed: !invokes(command, declared), declared, discovered: command };
}
