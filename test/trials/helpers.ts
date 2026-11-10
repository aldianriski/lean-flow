import { mkdtempSync, mkdirSync, realpathSync, rmSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

export const root = resolve(import.meta.dir, "../..");
export function temporary() {
  const parent = join(root, "test/fixtures/trials/.scratch");
  mkdirSync(parent, { recursive: true });
  const path = mkdtempSync(join(parent, "case-"));
  return { path, cleanup() {
    const rel = relative(realpathSync(parent), realpathSync(path));
    if (!rel || rel === ".." || rel.startsWith(".." + sep)) throw new Error("unsafe fixture cleanup");
    rmSync(path, { recursive: true, force: true });
  } };
}
export function invoke(script: string, args: string[], env: NodeJS.ProcessEnv = process.env) {
  const p = Bun.spawnSync([process.execPath, "--no-env-file", join(root, `scripts/trials/${script}.ts`), ...args], { cwd: root, env });
  return { code: p.exitCode, out: p.stdout.toString(), err: p.stderr.toString() };
}
