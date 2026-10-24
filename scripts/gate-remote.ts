// scripts/gate-remote.ts -- SPRINT-138 T1 (TASK-482): run the full gate on a remote runner.
//   LF_GATE_HOST=user@host LF_GATE_KEY=/path/key LF_GATE_DIR=/remote/clone \
//     bun --no-env-file scripts/gate-remote.ts
//
// Thin wrapper: ship HEAD as a git bundle (incremental from the remote's HEAD when it is an ancestor),
// check it out detached, run `QA_FULL=1 sh scripts/qa-check.sh` in ONE blocking ssh call, read the
// remote rc and log back, and judge with scripts/qa-verdict.ts (the one definition of a valid verdict).
//
// Exit codes: 0 = rc 0 AND a valid passing verdict. 2 = refused before any spawn (flag / variable).
// 5 = transport or remote-setup failure (never a gate result). Otherwise the remote rc, or 1 when the
// rc is 0 but the verdict is missing / failing / contradicts it.
//
// Bun auto-loads the repo-root dotenv file unless launched with --no-env-file, so this refuses to run
// without it, and it never opens that file itself.
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { judgeOutput } from "./qa-verdict.ts";

export interface Reply {
  status: number;
  stdout: string;
  stderr?: string;
  timedOut?: boolean;
}
export interface Transport {
  local(args: string[]): Reply;
  ssh(cmd: string, timeoutMs?: number): Reply;
  /** `dest` is the bare remote path; the host prefix is the transport's concern. */
  scp(src: string, dest: string): Reply;
  cleanup(path: string): void;
}
export interface Cfg {
  host: string;
  key: string;
  dir: string;
}

const AUTH = [
  "-o", "IdentitiesOnly=yes", "-o", "BatchMode=yes",
  "-o", "ConnectTimeout=20", "-o", "ServerAliveInterval=15", "-o", "ServerAliveCountMax=4",
];
// `--` keeps a host (or path) that starts with `-` from being read as an option.
export const sshArgv = (c: Cfg, cmd: string) => ["-i", c.key, ...AUTH, "--", c.host, cmd];
export const scpArgv = (c: Cfg, src: string, dest: string) => ["-i", c.key, ...AUTH, "--", src, `${c.host}:${dest}`];

const RUN_TIMEOUT_MS = 900_000;

const sh = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`;

function spawnReply(cmd: string, args: string[], timeoutMs?: number): Reply {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: timeoutMs });
  const timedOut = (r.error as NodeJS.ErrnoException | undefined)?.code === "ETIMEDOUT";
  return { status: r.status ?? 255, stdout: r.stdout ?? "", stderr: r.stderr ?? r.error?.message ?? "", timedOut };
}

export function realTransport(c: Cfg): Transport {
  return {
    local: (args) => spawnReply("git", args),
    ssh: (cmd, timeoutMs) => spawnReply("ssh", sshArgv(c, cmd), timeoutMs),
    scp: (src, dest) => spawnReply("scp", scpArgv(c, src, dest)),
    cleanup: (path) => rmSync(path, { force: true }),
  };
}

export function runGateRemote(c: Cfg, t: Transport, say: (line: string) => void, opts: { pid?: number } = {}): number {
  const dir = sh(c.dir);
  // The last few lines of a failed step's stderr: without them a failure leaves no cause behind.
  const tail = (r?: Reply) => {
    const lines = (r?.stderr ?? "").split("\n").map((l) => l.trim()).filter((l) => l !== "").slice(-5);
    for (const l of lines) say(`  stderr: ${l}`);
  };
  const step = (name: string, why: string, r?: Reply) => {
    say(`gate-remote: transport failure at step '${name}' (${why}) -- not a gate result`);
    tail(r);
    return 5;
  };

  const sha = t.local(["rev-parse", "HEAD"]).stdout.trim();
  if (!/^[0-9a-f]{40}$/.test(sha)) return step("local rev-parse", "no HEAD");
  say(`gate-remote: ran ${sha}`);

  const uniq = `${sha.slice(0, 8)}-${opts.pid ?? process.pid}`;
  const RBUNDLE = `/tmp/lf-gate-${uniq}.bundle`;
  const RLOG = `/tmp/lf-gate-${uniq}.log`;
  const RRC = `/tmp/lf-gate-${uniq}.rc`;

  const rh = t.ssh(`git -C ${dir} rev-parse HEAD`);
  if (rh.status === 255) return step("ssh remote head", "ssh exit 255", rh);
  const remote = rh.status === 0 ? rh.stdout.trim() : "";
  const incremental =
    /^[0-9a-f]{40}$/.test(remote) &&
    t.local(["cat-file", "-e", `${remote}^{commit}`]).status === 0 &&
    t.local(["merge-base", "--is-ancestor", remote, "HEAD"]).status === 0;

  const fetch = remote !== sha;
  if (fetch) {
    const bundle = join(tmpdir(), `lf-gate-${uniq}.bundle`);
    const range = incremental ? `${remote}..HEAD` : "HEAD";
    const b = t.local(["bundle", "create", "-q", bundle, range]);
    if (b.status !== 0) return step("local bundle", range, b);
    const sc = t.scp(bundle, RBUNDLE);
    t.cleanup(bundle);
    if (sc.status !== 0) return step("scp bundle", "scp failed", sc);
  }

  const setup =
    `cd ${dir} && ` +
    (fetch ? `git fetch -q ${RBUNDLE} HEAD && ` : "") +
    `git checkout -q --detach ${sha} && git clean -fdq`;
  const su = t.ssh(setup);
  if (su.status !== 0) {
    say("gate-remote: remote setup failed (fetch / checkout / clean) -- the gate was not run; not a gate result");
    tail(su);
    return 5;
  }

  const run = t.ssh(`rm -f ${RLOG} ${RRC}; cd ${dir} && QA_FULL=1 sh scripts/qa-check.sh > ${RLOG} 2>&1; echo $? > ${RRC}`, RUN_TIMEOUT_MS);
  if (run.timedOut) return step("ssh run", `timed out after ${RUN_TIMEOUT_MS / 1000}s`, run);
  if (run.status === 255) return step("ssh run", "ssh exit 255", run);

  const rcR = t.ssh(`cat ${RRC}`);
  if (rcR.status === 255) return step("ssh read rc", "ssh exit 255", rcR);
  if (rcR.status !== 0 || !/^\d+$/.test(rcR.stdout.trim())) {
    return step("read rc", "rc file missing or not a number", rcR);
  }
  const rc = Number(rcR.stdout.trim());

  const logR = t.ssh(`cat ${RLOG}`);
  if (logR.status === 255) return step("ssh read log", "ssh exit 255", logR);

  say(`remote rc: ${rc}`);
  const preserved = rc === 0 ? 1 : Math.min(rc, 255); // an rc >= 256 must never wrap to 0
  if (logR.status !== 0) {
    say("gate-remote: no log -- the remote log file is missing or unreadable");
    return preserved;
  }
  const log = logR.stdout;
  for (const l of log.split("\n")) if (/^\s*FAIL/.test(l)) say(l);
  const verdictLine = log.split("\n").find((l) => /^QA-CHECK: \d+ pass, \d+ fail$/.test(l));
  const v = judgeOutput(log);
  if (verdictLine === undefined && !v.truncated) {
    say("gate-remote: no verdict line in the remote log");
    return preserved;
  }
  if (verdictLine !== undefined) say(verdictLine);
  if (rc === 0 && v.ok) return 0;
  // a remote rc above 255 cannot be a real exit status; it falls through to the preserved branch
  if (rc !== 0 && v.ok) {
    say(`gate-remote: verdict contradicts exit code (rc ${rc}, passing verdict)`);
  } else if (rc === 0) {
    say(`gate-remote: verdict contradicts exit code (rc 0, ${v.reason})`);
  } else {
    say(`gate-remote: ${v.reason}`);
  }
  return preserved;
}

if (import.meta.main) {
  if (!process.execArgv.includes("--no-env-file")) {
    console.error("gate-remote: refusing to run -- launch as `bun --no-env-file scripts/gate-remote.ts` (Bun would otherwise auto-load the repo dotenv file)");
    process.exit(2);
  }
  const need = (n: string): string => {
    const v = process.env[n];
    if (v === undefined || v === "") {
      console.error(`gate-remote: ${n} is not set`);
      process.exit(2);
    }
    return v;
  };
  const cfg: Cfg = { host: need("LF_GATE_HOST"), key: need("LF_GATE_KEY"), dir: need("LF_GATE_DIR") };
  process.exit(runGateRemote(cfg, realTransport(cfg), (l) => console.log(l)));
}
