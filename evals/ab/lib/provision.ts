// Trial provisioning (PREREGISTRATION Amendment 2): the environment the task authors used, built into every trial copy BEFORE the
// 45-minute clock starts, identically for both arms. Node 24 first on the path, dependencies installed from the lockfile, and for the clinic
// repo its own fresh Postgres cluster (both databases migrated). The cluster is stopped and removed after grading, also on a kill or an error.
// The repo kind is read from the trial copy (lockfiles), never from the arm, so the two arms of a repo cannot differ. A copy with neither
// lockfile (the smoke fixture) needs nothing and gets nothing.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";

/** Node 24 (the authors' toolchain; the host's own Node is older than workdoo's engines floor). */
export const NODE24_DIR = "D:\\Research\\ab-tools\\node24\\bin";
/** Shared caches on D: (C: fills on A/B work). */
export const CACHE = { npm: "D:/cache/npm", go: "D:/cache/go", gomod: "D:/cache/gomod" };

export type ExecResult = { code: number; out: string };
export type Exec = (cmd: string[], o: { cwd: string; env: Record<string, string>; timeoutMs: number }) => Promise<ExecResult>;
/** What a provisioned trial adds to the environment of the agent AND of the graders. */
export type Provisioned = {
  vars: Record<string, string>;
  /** directories put first on the path */
  pathFirst: string[];
  /** wall time provisioning took: outside the trial deadline, recorded per attempt */
  setupMs: number;
  /** idempotent; never throws */
  teardown: () => Promise<void>;
};
export type Provisioner = (dirs: { trialDir: string; root: string }) => Promise<Provisioned>;
export type ProvDeps = { exec: Exec; node24Dir: string; cache: typeof CACHE; freePort: () => Promise<number>; /** npm's own entry script, found on the host path */ npmCli: () => string | undefined };

export class ProvisionFailed extends Error {}

/** `env` with `p` applied: its variables set and its directories first on the path (whatever case the host spells PATH in). */
export function applyProvision(env: Record<string, string>, p: Pick<Provisioned, "vars" | "pathFirst">): Record<string, string> {
  const out: Record<string, string> = { ...env, ...p.vars };
  const key = Object.keys(out).find((k) => k.toLowerCase() === "path") ?? "PATH";
  out[key] = [...p.pathFirst, out[key] ?? ""].filter(Boolean).join(path.delimiter);
  return out;
}

export type Kind = "clinic" | "node" | "none";
export function kindOf(trialDir: string): Kind {
  const has = (...p: string[]) => fs.existsSync(path.join(trialDir, ...p));
  if (has("go.mod") && has("web", "package-lock.json")) return "clinic";
  return has("package-lock.json") ? "node" : "none";
}

const freePort = () =>
  new Promise<number>((resolve, reject) => {
    const s = net.createServer();
    s.once("error", reject);
    s.listen(0, "127.0.0.1", () => {
      const port = (s.address() as net.AddressInfo).port;
      s.close(() => resolve(port));
    });
  });

/** `npm` on the host path is a wrapper that runs npm on ITS OWN directory's Node (22), which workdoo's engines floor refuses: the install runs npm's script on the first Node instead. */
function hostNpmCli(): string | undefined {
  for (const dir of (process.env.PATH ?? "").split(path.delimiter)) {
    const cli = path.join(dir, "node_modules", "npm", "bin", "npm-cli.js");
    if (dir && fs.existsSync(cli)) return cli;
  }
  return undefined;
}

const realExec: Exec = async (cmd, { cwd, env, timeoutMs }) => {
  const pathKey = Object.keys(env).find((k) => k.toLowerCase() === "path") ?? "PATH";
  const bin = Bun.which(cmd[0]!, { PATH: env[pathKey] ?? "", cwd }) ?? cmd[0]!;
  const p = Bun.spawn([bin, ...cmd.slice(1)], { cwd, env, stdin: "ignore", stdout: "pipe", stderr: "pipe" });
  const timer = setTimeout(() => {
    if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(p.pid), "/T", "/F"], { stdio: "ignore" });
    p.kill();
  }, timeoutMs);
  // read as the bytes arrive and stop waiting for the pipes a moment after the process exits: pg_ctl's server child inherits them and outlives it
  const chunks: Uint8Array[] = [];
  const drain = async (s: ReadableStream<Uint8Array>) => {
    for await (const c of s) chunks.push(c);
  };
  const pipes = Promise.all([drain(p.stdout), drain(p.stderr)]).catch(() => {});
  const code = await p.exited;
  await Promise.race([pipes, Bun.sleep(1500)]);
  clearTimeout(timer);
  return { code, out: Buffer.concat(chunks).toString().trim() };
};

// a driver that dies mid-trial must not leave a cluster running: the live ones are stopped on the way out
const live = new Set<string>();
process.on("exit", () => {
  for (const data of live) {
    spawnSync("pg_ctl", ["-D", data, "-m", "immediate", "-w", "stop"], { stdio: "ignore" });
    try {
      fs.rmSync(data, { recursive: true, force: true });
    } catch {
      /* the next driver start sweeps it */
    }
  }
});

const lastLine = (s: string) => s.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? "";

export function makeProvisioner(over: Partial<ProvDeps> = {}): Provisioner {
  const d: ProvDeps = { exec: realExec, node24Dir: NODE24_DIR, cache: CACHE, freePort, npmCli: hostNpmCli, ...over };
  return async ({ trialDir, root }) => {
    const t0 = Date.now();
    const kind = kindOf(trialDir);
    if (kind === "none") return { vars: {}, pathFirst: [], setupMs: 0, teardown: async () => {} };
    const vars: Record<string, string> = { npm_config_cache: d.cache.npm, GOCACHE: d.cache.go, GOMODCACHE: d.cache.gomod };
    const tools = (v: Record<string, string>) => applyProvision(Object.fromEntries(Object.entries(process.env).filter(([, x]) => x !== undefined)) as Record<string, string>, { vars: v, pathFirst: [d.node24Dir] });
    const run = async (step: string, cmd: string[], cwd: string, v: Record<string, string>, timeoutMs: number): Promise<string> => {
      const r = await d.exec(cmd, { cwd, env: tools(v), timeoutMs });
      if (r.code !== 0) throw new ProvisionFailed(`${step}: exit ${r.code}: ${lastLine(r.out)}`);
      return r.out;
    };
    const data = path.join(root, "pgdata");
    let started = false;
    const stopDb = async () => {
      if (started) await d.exec(["pg_ctl", "-D", data, "-m", "immediate", "-w", "stop"], { cwd: root, env: tools({}), timeoutMs: 60_000 }).catch(() => undefined);
      started = false;
      live.delete(data);
      for (let i = 0; i < 5 && fs.existsSync(data); i++) {
        try {
          fs.rmSync(data, { recursive: true, force: true });
        } catch {
          await Bun.sleep(500);
        }
      }
    };
    try {
      const node = await run("node", ["node", "--version"], trialDir, vars, 30_000);
      if (!/^v24\./.test(lastLine(node))) throw new ProvisionFailed(`node: expected Node 24 first on the path, got ${lastLine(node)} (${d.node24Dir})`);
      const cli = d.npmCli();
      if (!cli) throw new ProvisionFailed("npm: npm-cli.js not found next to npm on the path");
      const ci = ["node", cli, "ci", "--prefer-offline", "--no-audit", "--no-fund"];
      if (kind === "node") {
        await run("npm ci", ci, trialDir, vars, 600_000);
        return { vars, pathFirst: [d.node24Dir], setupMs: Date.now() - t0, teardown: async () => {} };
      }
      await run("npm ci (web)", ci, path.join(trialDir, "web"), vars, 600_000);
      await run("initdb", ["initdb", "-D", data, "-U", "postgres", "--auth=trust", "-E", "UTF8"], root, vars, 120_000);
      const port = await d.freePort();
      live.add(data);
      started = true;
      await run("pg_ctl start", ["pg_ctl", "-D", data, "-o", `-p ${port} -c listen_addresses=127.0.0.1`, "-l", path.join(data, "server.log"), "-w", "start"], root, vars, 120_000);
      await run("create databases", ["psql", "-h", "127.0.0.1", "-p", String(port), "-U", "postgres", "-c", "create database clinic", "-c", "create database clinic_test"], root, vars, 60_000);
      const url = (db: string) => `postgres://postgres@127.0.0.1:${port}/${db}`;
      for (const db of ["clinic", "clinic_test"]) await run(`migrate ${db}`, ["go", "run", "./cmd/migrate"], trialDir, { ...vars, DATABASE_URL: url(db) }, 300_000);
      // the test database is the one `go test` and the web gateway test use (DATABASE_URL); the PG* variables let `psql -d clinic` reach the other
      const all = { ...vars, DATABASE_URL: url("clinic_test"), PGHOST: "127.0.0.1", PGPORT: String(port), PGUSER: "postgres" };
      return { vars: all, pathFirst: [d.node24Dir], setupMs: Date.now() - t0, teardown: stopDb };
    } catch (e) {
      await stopDb();
      throw e instanceof ProvisionFailed ? e : new ProvisionFailed((e as Error).message);
    }
  };
}

export const provisionTrial: Provisioner = makeProvisioner();

/** The attempt's setup, with a failure turned into data: `failed` is the reason (the trial then logs `provision-failed: <reason>` as infra and spawns nothing). */
export type Setup = { prov: Provisioned | undefined; failed: string | undefined; setupMs: number };
export async function setupTrial(provision: Provisioner, dirs: { trialDir: string; root: string }): Promise<Setup> {
  const t0 = Date.now();
  try {
    const prov = await provision(dirs);
    return { prov, failed: undefined, setupMs: prov.setupMs || Date.now() - t0 };
  } catch (e) {
    return { prov: undefined, failed: (e as Error).message.replace(/\s+/g, " ").slice(0, 300), setupMs: Date.now() - t0 };
  }
}
/** the exit word of a provisioning failure, and the one infra kind it is classed as (PREREGISTRATION section 10: a sandbox that failed before the agent's first action) */
export const PROVISION_EXIT = "provision-failed";
export const PROVISION_CLASS = "infra:sandbox-before-action" as const;
/** the graders' environment: the host's plus the provisioning, identical for both arms */
export const graderEnv = (prov: Provisioned | undefined): Record<string, string> | undefined => (prov ? applyProvision(Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== undefined)) as Record<string, string>, prov) : undefined);
