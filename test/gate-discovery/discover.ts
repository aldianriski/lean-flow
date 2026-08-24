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
  /** The command the discovery order produced, or null. */
  readonly command: string | null;
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
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
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
  if (script !== null) return { rung: 1, command: script, examined };
  // Other manifest kinds are recognised as rung-1 candidates even though this repo has none;
  // omitting them would make the order silently package.json-shaped.
  for (const m of MANIFESTS.slice(1)) {
    if (existsSync(join(root, m))) return { rung: 1, command: null, examined };
  }

  examined.push(2);
  for (const m of MAKEFILES) {
    if (existsSync(join(root, m))) return { rung: 2, command: null, examined };
  }

  examined.push(3);
  for (const c of CI_DIRS) {
    if (existsSync(join(root, c))) return { rung: 3, command: null, examined };
  }

  examined.push(4);
  const declared = declaredCommand(root);
  if (declared !== null) return { rung: 4, command: declared, examined };

  return { rung: null, command: null, examined };
}

/**
 * The property that actually matters, and the one nothing was checking: whatever rung answers,
 * does the command it produced still run the gate this repository declares?
 *
 * A repo that declares no gate cannot bypass one, so it is vacuously fine — reported rather than
 * silently treated as a pass.
 */
export function bypassesDeclaredGate(root: string): { bypassed: boolean; declared: string | null; discovered: string | null } {
  const declared = declaredCommand(root);
  const { command } = discoverGate(root);
  if (declared === null) return { bypassed: false, declared: null, discovered: command };
  if (command === null) return { bypassed: true, declared, discovered: null };
  return { bypassed: !command.includes(declared), declared, discovered: command };
}
