// scripts/gate-remote.ts -- SPRINT-138 T1 (TASK-482): run the full gate on a remote runner.
//   LF_GATE_HOST=user@host LF_GATE_KEY=/path/key LF_GATE_DIR=/remote/clone \
//     bun --no-env-file scripts/gate-remote.ts
//
// Thin wrapper: ship HEAD as a git bundle (incremental from the remote's HEAD when it is an ancestor),
// check it out detached, run both stages of the declared gate (`QA_FULL=1 sh scripts/qa-check.sh`, then
// `bun test`) in ONE blocking ssh call, each to its own log + rc file, read them back, and judge qa-check
// with scripts/qa-verdict.ts and bun test by its own summary. Both stages always run.
//
// Exit codes: 0 = rc 0 AND a valid passing verdict. 2 = refused before any spawn (flag / variable).
// 5 = transport or remote-setup failure (never a gate result). Otherwise the qa-check rc, or 1 when the
// rc is 0 but the verdict is missing / failing / contradicts it, or when only the bun test stage fails.
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

/** LF_GATE_DIR must be a POSIX absolute path on the remote; Git Bash on Windows rewrites `/x` to `C:/Program Files/Git/x`. */
export function dirProblem(dir: string): string | null {
  if (/^[A-Za-z]:[\\/]/.test(dir)) {
    return (
      `LF_GATE_DIR='${dir}' is a drive-letter path -- Git Bash on Windows rewrote the POSIX value before Bun saw it. ` +
      `Set MSYS_NO_PATHCONV=1 for this call, or pass //home/... (double leading slash)`
    );
  }
  return dir.startsWith("/") ? null : `LF_GATE_DIR='${dir}' must be an absolute POSIX path (start with /)`;
}

const RUN_TIMEOUT_MS = 900_000;

/** The remote stages, in order. `declared` is the segment text each carries in package.json's `test` script. */
export const STAGES = [
  { name: "qa-check", cmd: "QA_FULL=1 sh scripts/qa-check.sh", declared: "bun scripts/qa-verdict.ts sh scripts/qa-check.sh" },
  { name: "bun test", cmd: "bun test", declared: "bun test" },
] as const;
const SLUGS = ["qa", "bun"] as const;

/** True when the script's `&&`-chained segments equal the stages' declared text, in order. Pure: the caller reads package.json. */
export function stagesMatchScript(script: string, stages: readonly { declared: string }[]): boolean {
  const segs = script.split("&&").map((x) => x.trim());
  return segs.length === stages.length && segs.every((x, i) => x === stages[i].declared);
}

/** Judge a `bun test` log by its summary: present, `0 fail`, and at least one test run. */
export function judgeBun(log: string): { ok: boolean; pass: number; fail: number; ran: number; reason: string } {
  const num = (re: RegExp) => {
    const m = re.exec(log);
    return m === null ? null : Number(m[1]);
  };
  const pass = num(/^\s*(\d+) pass$/m);
  const fail = num(/^\s*(\d+) fail$/m);
  const ran = num(/^Ran (\d+) tests? across/m);
  if (pass === null || fail === null || ran === null) return { ok: false, pass: 0, fail: 0, ran: 0, reason: "no bun test summary" };
  if (fail > 0) return { ok: false, pass, fail, ran, reason: `${fail} fail` };
  if (ran < 1) return { ok: false, pass, fail, ran, reason: "no tests ran" };
  return { ok: true, pass, fail, ran, reason: "" };
}

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
  const R = (slug: string, ext: string) => `/tmp/lf-gate-${uniq}.${slug}.${ext}`;

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

  // Both stages in ONE ssh call, joined by `;` so bun test runs whatever qa-check returned. If `cd` fails
  // no rc file is written, and the run ends at `read qa rc` (exit 5), never as a gate result.
  const [qa, bun] = STAGES;
  const files = STAGES.flatMap((st, i) => [R(SLUGS[i], "log"), R(SLUGS[i], "rc")]);
  const stageCmd = (cmd: string, slug: string) => `${cmd} > ${R(slug, "log")} 2>&1; echo $? > ${R(slug, "rc")}`;
  const run = t.ssh(
    `rm -f ${files.join(" ")}; cd ${dir} && { ${stageCmd(qa.cmd, "qa")}; ${stageCmd(bun.cmd, "bun")}; }`,
    RUN_TIMEOUT_MS,
  );
  if (run.timedOut) return step("ssh run", `timed out after ${RUN_TIMEOUT_MS / 1000}s`, run);
  if (run.status === 255) return step("ssh run", "ssh exit 255", run);

  const rcs: number[] = [];
  for (const slug of SLUGS) {
    const r = t.ssh(`cat ${R(slug, "rc")}`);
    if (r.status === 255) return step(`ssh read ${slug} rc`, "ssh exit 255", r);
    if (r.status !== 0 || !/^\d+$/.test(r.stdout.trim())) {
      return step(`read ${slug} rc`, "rc file missing or not a number", r);
    }
    rcs.push(Number(r.stdout.trim()));
  }
  const logs: Reply[] = [];
  for (const slug of SLUGS) {
    const r = t.ssh(`cat ${R(slug, "log")}`);
    if (r.status === 255) return step(`ssh read ${slug} log`, "ssh exit 255", r);
    logs.push(r);
  }

  // bun test: judged from its own log; printed whenever its log was read.
  const bunRc = rcs[1];
  const b = logs[1].status === 0 ? judgeBun(logs[1].stdout) : { ok: false, pass: 0, fail: 0, ran: 0, reason: "no bun test log" };
  const bunOk = bunRc === 0 && b.ok;
  if (logs[1].status === 0 && b.reason !== "no bun test summary") say(`bun test: ${b.pass} pass, ${b.fail} fail (rc ${bunRc})`);
  if (!bunOk) say(`gate-remote: bun test stage failed (${bunRc !== 0 ? `rc ${bunRc}` : b.reason})`);

  // qa-check: judged from the qa log alone, never the bun log.
  const qaCode = judgeQa(rcs[0], logs[0], say);
  if (qaCode !== 0) return qaCode;
  return bunOk ? 0 : 1;
}

function judgeQa(rc: number, logR: Reply, say: (line: string) => void): number {
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
  if (verdictLine !== undefined) {
    say(verdictLine);
    say(`qa-check: ${verdictLine} (rc ${rc})`);
  }
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
  const problem = dirProblem(cfg.dir);
  if (problem !== null) {
    console.error(`gate-remote: ${problem}`);
    process.exit(2);
  }
  process.exit(runGateRemote(cfg, realTransport(cfg), (l) => console.log(l)));
}
