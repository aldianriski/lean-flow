// Spawn one headless claude run under the arm's pins. The process boundary is injectable so the
// free self-tests can replay recorded output instead of calling a model.
import type { Arm } from "./arm.ts";

/** The whole-trial wall-clock limit (pre-registration Amendment 1): 45 minutes, identical for A0 and A1; A1's phases share it. */
export const TRIAL_TIMEOUT_MS = 45 * 60 * 1000;
/** `timedOut`: the runner killed the process at its deadline (a killed run has no result event). */
export type RawRun = { stdout: string; stderr: string; exitCode: number; wallMs: number; timedOut?: boolean };
/** `stdin`, when given, is piped to the process (the CLI reads the prompt from it when `-p` has no argument); otherwise stdin is ignored. */
export type Runner = (cmd: string[], opts: { cwd: string; env: Record<string, string>; timeoutMs: number; stdin?: string }) => Promise<RawRun>;

/** Kill the whole process tree: a grandchild that inherited the pipes would otherwise outlive the deadline (win32: taskkill /T, elsewhere: the process group). */
function killTree(p: { pid: number; kill: () => void }): void {
  try {
    if (process.platform === "win32") Bun.spawnSync(["taskkill", "/PID", String(p.pid), "/T", "/F"], { stdout: "ignore", stderr: "ignore" });
    else process.kill(-p.pid, "SIGKILL");
  } catch {
    /* already gone */
  }
  p.kill();
}
const KILL_GRACE_MS = 2_000;

export const spawnRunner: Runner = async (cmd, { cwd, env, timeoutMs, stdin }) => {
  const t0 = Date.now();
  const p = Bun.spawn(cmd, { cwd, env, stdin: stdin === undefined ? "ignore" : "pipe", stdout: "pipe", stderr: "pipe", ...(process.platform === "win32" ? {} : { detached: true }) });
  if (stdin !== undefined) {
    p.stdin!.write(stdin);
    await p.stdin!.end();
  }
  // read the pipes into buffers as they arrive, so output survives a pipe that never closes
  const collect = (s: ReadableStream<Uint8Array>) => {
    const chunks: Uint8Array[] = [];
    const done = (async () => {
      for await (const c of s) chunks.push(c);
    })().catch(() => {});
    return { done, text: () => Buffer.concat(chunks).toString() };
  };
  const out = collect(p.stdout);
  const err = collect(p.stderr);
  let timedOut = false;
  let giveUp!: () => void;
  const grace = new Promise<void>((r) => (giveUp = r));
  const timer = setTimeout(() => {
    timedOut = true;
    killTree(p);
    setTimeout(giveUp, KILL_GRACE_MS); // after the kill, stop waiting for pipes a survivor might still hold
  }, timeoutMs);
  await Promise.race([Promise.all([out.done, err.done, p.exited]), grace]);
  clearTimeout(timer);
  return { stdout: out.text(), stderr: err.text(), exitCode: p.exitCode ?? (timedOut ? 143 : -1), wallMs: Date.now() - t0, ...(timedOut ? { timedOut } : {}) };
};

/** `extra` carries per-call flags: --session-id / --resume for the two protocol phases, --tools "" for the judge. */
export function buildCommand(arm: Arm, prompt: string, extra: string[] = [], o: { promptViaStdin?: boolean } = {}): string[] {
  // a long prompt must not ride in argv (Windows caps a command line near 32 KB): `-p` with no argument reads stdin
  const cmd = ["claude", "-p", ...(o.promptViaStdin ? [] : [prompt]), "--model", arm.sessionModel, ...(arm.effort === "default" ? [] : ["--effort", arm.effort]), "--permission-mode", arm.permissionMode];
  if (arm.allowedTools.length > 0) cmd.push("--allowedTools", ...arm.allowedTools);
  cmd.push("--output-format", "stream-json", "--verbose");
  if (arm.plugin) cmd.push("--plugin-dir", arm.plugin.path); // the very path pin.ts hashed
  cmd.push(...extra);
  return cmd;
}
