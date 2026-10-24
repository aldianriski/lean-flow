// evals/gate-remote.test.ts -- SPRINT-138 T1 (TASK-482): every exit case of scripts/gate-remote.ts
// runs through an injected, stubbed transport, beside a green control through the SAME stub.
// Expected values are literals from the task's Done-when, not recomputed from the implementation.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runGateRemote, scpArgv, sshArgv, type Reply, type Transport } from "../scripts/gate-remote.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SCRIPT = "scripts/gate-remote.ts";
const CFG = { host: "u@h", key: "/k/id", dir: "/srv/lf" };
const LOCAL = "a".repeat(40);
const REMOTE = "b".repeat(40);
const PASS_LOG = "  PASS  x\nQA-CHECK: 12 pass, 0 fail\n";
const FAIL_LOG = "  FAIL  guard-x: broken\nQA-CHECK: 11 pass, 1 fail\n";

interface Script {
  remoteHead?: Reply; // reply to `git rev-parse HEAD` on the remote
  ancestor?: number; // local `merge-base --is-ancestor` status
  haveCommit?: number; // local `cat-file -e` status
  bundle?: Reply;
  scp?: Reply;
  setup?: Reply;
  run?: Reply;
  rc?: Reply;
  log?: Reply;
}
const ok = (stdout = ""): Reply => ({ status: 0, stdout });

function stub(s: Script) {
  const calls: string[] = [];
  const timeouts: number[] = [];
  const t: Transport = {
    local(args) {
      const j = args.join(" ");
      calls.push(`local ${j}`);
      if (j === "rev-parse HEAD") return ok(`${LOCAL}\n`);
      if (j.startsWith("cat-file")) return { status: s.haveCommit ?? 0, stdout: "" };
      if (j.startsWith("merge-base")) return { status: s.ancestor ?? 0, stdout: "" };
      if (j.startsWith("bundle create")) return s.bundle ?? ok();
      throw new Error(`unexpected local ${j}`);
    },
    cleanup(path) {
      calls.push(`cleanup ${path}`);
    },
    ssh(cmd, timeoutMs) {
      calls.push(`ssh ${cmd}`);
      if (timeoutMs !== undefined) timeouts.push(timeoutMs);
      if (cmd.includes("rev-parse HEAD")) return s.remoteHead ?? ok(`${REMOTE}\n`);
      if (cmd.includes("git fetch")) return s.setup ?? ok();
      if (cmd.includes("QA_FULL=1")) return s.run ?? ok();
      if (cmd.startsWith("cat ") && cmd.endsWith(".rc")) return s.rc ?? ok("0\n");
      if (cmd.startsWith("cat ")) return s.log ?? ok(PASS_LOG);
      throw new Error(`unexpected ssh ${cmd}`);
    },
    scp(src, dest) {
      calls.push(`scp ${src} ${dest}`);
      return s.scp ?? ok();
    },
  };
  return { t, calls, timeouts };
}

function go(s: Script, pid = 4242) {
  const { t, calls, timeouts } = stub(s);
  const lines: string[] = [];
  const code = runGateRemote(CFG, t, (l) => lines.push(l), { pid });
  return { code, calls, timeouts, text: lines.join("\n") };
}

describe("exit cases through a stubbed transport", () => {
  test("green control: rc 0 + passing verdict exits 0, prints verdict and rc", () => {
    const r = go({});
    expect(r.code).toBe(0);
    expect(r.text).toContain("QA-CHECK: 12 pass, 0 fail");
    expect(r.text).toContain("remote rc: 0");
  });

  test("incremental bundle from a remote commit that is an ancestor; checkout detached, clean without -x", () => {
    const r = go({});
    expect(r.calls.some((c) => c.includes(`bundle create`) && c.includes(`${REMOTE}..HEAD`))).toBe(true);
    const setup = r.calls.find((c) => c.includes("git fetch"))!;
    expect(setup).toContain(`git checkout -q --detach ${LOCAL}`);
    expect(setup).toContain("git clean -fdq");
    expect(setup).not.toContain("-x");
    expect(r.calls.find((c) => c.includes("QA_FULL=1"))).toContain("sh scripts/qa-check.sh");
  });

  test("full bundle when the remote has no commit (rev-parse fails)", () => {
    const r = go({ remoteHead: { status: 128, stdout: "" } });
    expect(r.code).toBe(0);
    const b = r.calls.find((c) => c.includes("bundle create"))!;
    expect(b).not.toContain("..");
    expect(b.endsWith(" HEAD")).toBe(true);
  });

  test("full bundle when the remote head is not an ancestor of local HEAD", () => {
    const r = go({ ancestor: 1 });
    expect(r.calls.find((c) => c.includes("bundle create"))).not.toContain("..");
  });

  test("full bundle when the remote head is unknown locally", () => {
    const r = go({ haveCommit: 1 });
    expect(r.calls.find((c) => c.includes("bundle create"))).not.toContain("..");
  });

  test("non-zero remote rc is preserved and FAIL lines are printed", () => {
    const r = go({ rc: ok("1\n"), log: ok(FAIL_LOG) });
    expect(r.code).toBe(1);
    expect(r.text).toContain("FAIL  guard-x: broken");
    expect(r.text).toContain("remote rc: 1");
  });

  test("a distinctive non-zero rc (7) is preserved exactly", () => {
    expect(go({ rc: ok("7\n"), log: ok(FAIL_LOG) }).code).toBe(7);
  });

  test("missing verdict line is non-zero and names 'no verdict line'", () => {
    const r = go({ log: ok("  PASS  x\n") });
    expect(r.code).not.toBe(0);
    expect(r.text).toContain("no verdict line");
  });

  test("rc 0 with a failing verdict: 'verdict contradicts exit code'", () => {
    const r = go({ log: ok(FAIL_LOG) });
    expect(r.code).not.toBe(0);
    expect(r.text).toContain("verdict contradicts exit code");
  });

  test("rc != 0 with a passing verdict: 'verdict contradicts exit code', rc kept", () => {
    const r = go({ rc: ok("3\n") });
    expect(r.code).toBe(3);
    expect(r.text).toContain("verdict contradicts exit code");
  });

  test("a TRUNCATED run is not a pass even at rc 0", () => {
    const log =
      "QA-CHECK: TRUNCATED at harness-x after 700s against a 600s budget -- 3 item(s) UNRUN\nQA-CHECK: 5 pass, 1 fail\n";
    const r = go({ log: ok(log) });
    expect(r.code).not.toBe(0);
    expect(r.text).toContain("TRUNCATED at harness-x after 700s against a 600s budget");
    expect(r.text).toContain("3 check(s) NEVER RAN");
  });

  test("missing log is non-zero and names 'no log'", () => {
    const r = go({ log: { status: 1, stdout: "" } });
    expect(r.code).not.toBe(0);
    expect(r.text).toContain("no log");
  });

  test("ssh 255 on the run step is transport: exit 5 naming the step, never a gate code", () => {
    const r = go({ run: { status: 255, stdout: "" } });
    expect(r.code).toBe(5);
    expect(r.text).toContain("transport failure at step 'ssh run'");
  });

  test("ssh 255 asking for the remote head is exit 5", () => {
    const r = go({ remoteHead: { status: 255, stdout: "" } });
    expect(r.code).toBe(5);
    expect(r.text).toContain("step 'ssh remote head'");
  });

  test("scp failure is exit 5 naming scp", () => {
    const r = go({ scp: { status: 1, stdout: "" } });
    expect(r.code).toBe(5);
    expect(r.text).toContain("step 'scp bundle'");
  });

  test("remote setup failure is exit 5 naming 'remote setup' and never reaches the gate", () => {
    const r = go({ setup: { status: 1, stdout: "" } });
    expect(r.code).toBe(5);
    expect(r.text).toContain("remote setup");
    expect(r.calls.some((c) => c.includes("QA_FULL=1"))).toBe(false);
  });

  test("bundle creation failure is exit 5", () => {
    const r = go({ bundle: { status: 1, stdout: "" } });
    expect(r.code).toBe(5);
    expect(r.text).toContain("step 'local bundle'");
  });

  test("garbage rc file is exit 5 naming step 'read rc'", () => {
    const r = go({ rc: ok("garbage") });
    expect(r.code).toBe(5);
    expect(r.text).toContain("step 'read rc'");
  });

  test("empty rc file is exit 5 naming step 'read rc'", () => {
    const r = go({ rc: ok("") });
    expect(r.code).toBe(5);
    expect(r.text).toContain("step 'read rc'");
  });

  test("missing rc file (cat non-zero) is exit 5 naming step 'read rc'", () => {
    const r = go({ rc: { status: 1, stdout: "" } });
    expect(r.code).toBe(5);
    expect(r.text).toContain("step 'read rc'");
  });

  test("whitespace around the rc is tolerated", () => {
    expect(go({ rc: ok(" 0 \n") }).code).toBe(0);
  });

  test("ssh 255 reading the rc is exit 5 naming step 'ssh read rc'", () => {
    const r = go({ rc: { status: 255, stdout: "" } });
    expect(r.code).toBe(5);
    expect(r.text).toContain("step 'ssh read rc'");
  });

  test("ssh 255 reading the log is exit 5 naming step 'ssh read log'", () => {
    const r = go({ log: { status: 255, stdout: "" } });
    expect(r.code).toBe(5);
    expect(r.text).toContain("step 'ssh read log'");
  });

  test("a remote rc >= 256 is clamped to 255, never 0", () => {
    expect(go({ rc: ok("256\n"), log: ok(FAIL_LOG) }).code).toBe(255);
    expect(go({ rc: ok("512\n"), log: ok(FAIL_LOG) }).code).toBe(255);
  });

  test("it prints the sha it ran", () => {
    expect(go({}).text).toContain(`ran ${LOCAL}`);
  });

  test("stderr (last 5 lines, trimmed) of a failed step is printed", () => {
    const err = ["l1", "l2", "l3", "l4", "l5", "l6", "fatal: bad object  "].join("\n") + "\n\n";
    const cases: Script[] = [
      { setup: { status: 1, stdout: "", stderr: err } },
      { scp: { status: 1, stdout: "", stderr: err } },
      { run: { status: 255, stdout: "", stderr: err } },
    ];
    for (const c of cases) {
      const r = go(c);
      expect(r.text).toContain("fatal: bad object");
      expect(r.text).toContain("l3");
      expect(r.text).not.toContain("l2");
    }
  });

  test("per-run paths: two runs use distinct remote and local bundle paths; local bundle removed after scp", () => {
    const a = go({}, 1);
    const b = go({}, 2);
    const paths = (c: string[]) => c.join("\n").match(/lf-gate[^ ';]*/g) ?? [];
    const pa = new Set(paths(a.calls));
    const pb = new Set(paths(b.calls));
    expect(pa.size).toBeGreaterThan(0);
    for (const p of pa) expect(pb.has(p)).toBe(false);
    expect(a.calls.join("\n")).not.toContain("/tmp/lf-gate.bundle");
    const iScp = a.calls.findIndex((c) => c.startsWith("scp "));
    const iClean = a.calls.findIndex((c) => c.startsWith("cleanup "));
    expect(iScp).toBeGreaterThan(-1);
    expect(iClean).toBeGreaterThan(iScp);
  });

  test("scp gets the bare remote path (no host prefix)", () => {
    const c = go({}).calls.find((x) => x.startsWith("scp "))!;
    expect(c).toMatch(/ \/tmp\/lf-gate-[^ ]*\.bundle$/);
  });

  test("the gate-run ssh carries a 900 s timeout; a timeout is exit 5 naming step 'ssh run'", () => {
    expect(go({}).timeouts).toContain(900_000);
    const r = go({ run: { status: 255, stdout: "", timedOut: true } });
    expect(r.code).toBe(5);
    expect(r.text).toContain("step 'ssh run'");
    expect(r.text).toContain("timed out");
  });

  test("ssh and scp always carry key auth, timeouts, and '--' before the host", () => {
    for (const a of [sshArgv(CFG, "x"), scpArgv(CFG, "s", "d")]) {
      const j = a.join(" ");
      expect(j).toContain("-i /k/id");
      expect(j).toContain("-o IdentitiesOnly=yes");
      expect(j).toContain("-o BatchMode=yes");
      expect(j).toContain("-o ConnectTimeout=20");
      expect(j).toContain("-o ServerAliveInterval=15");
      expect(j).toContain("-o ServerAliveCountMax=4");
      expect(a.indexOf("--")).toBeGreaterThan(-1);
    }
    const ssh = sshArgv({ ...CFG, host: "-oProxyCommand=x" }, "cmd");
    expect(ssh.indexOf("--")).toBeLessThan(ssh.indexOf("-oProxyCommand=x"));
    expect(scpArgv(CFG, "s", "/d")).toContain("u@h:/d");
  });
});

describe("launch refusals as real child processes", () => {
  const env = { ...process.env, LF_GATE_HOST: "u@h", LF_GATE_KEY: "/k", LF_GATE_DIR: "/d" };
  const run = (args: string[], e: Record<string, string | undefined>) =>
    spawnSync("bun", [...args, SCRIPT], { cwd: ROOT, encoding: "utf8", env: e as NodeJS.ProcessEnv });

  test("without --no-env-file it refuses (exit 2) even with every variable set", () => {
    const r = run([], env);
    expect(r.status).toBe(2);
    expect(`${r.stdout}${r.stderr}`).toContain("--no-env-file");
  });

  test("refusal precedes variable reads: no variables set, still the flag message", () => {
    const e = { ...env, LF_GATE_HOST: undefined, LF_GATE_KEY: undefined, LF_GATE_DIR: undefined };
    const r = run([], e);
    expect(r.status).toBe(2);
    expect(`${r.stdout}${r.stderr}`).toContain("--no-env-file");
    expect(`${r.stdout}${r.stderr}`).not.toContain("is not set");
  });

  for (const name of ["LF_GATE_HOST", "LF_GATE_KEY", "LF_GATE_DIR"]) {
    test(`with the flag, unset ${name} is refused by name (exit 2) before any spawn`, () => {
      const r = run(["--no-env-file"], { ...env, [name]: undefined });
      expect(r.status).toBe(2);
      expect(`${r.stdout}${r.stderr}`).toContain(`gate-remote: ${name} is not set`);
    });
  }
});

describe("static", () => {
  test("the source never opens .env", () => {
    const src = readFileSync(`${ROOT}scripts/gate-remote.ts`, "utf8");
    const code = src.split("\n").filter((l) => !l.trim().startsWith("//")).join("\n");
    expect(/readFileSync|readFile|openSync|Bun\.file|createReadStream/.test(code)).toBe(false);
    // a string literal naming the dotenv file (".env", "x/.env", ".env.local"); process.env is not one
    expect(/["'`\/]\.env\b/.test(code)).toBe(false);
  });
});
