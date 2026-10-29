// Spawn one headless claude run under the arm's pins. The process boundary is injectable so the
// free self-tests can replay recorded output instead of calling a model.
import type { Arm } from "./arm.ts";

export type RawRun = { stdout: string; stderr: string; exitCode: number; wallMs: number };
export type Runner = (cmd: string[], opts: { cwd: string; env: Record<string, string>; timeoutMs: number }) => Promise<RawRun>;

export const spawnRunner: Runner = async (cmd, { cwd, env, timeoutMs }) => {
  const t0 = Date.now();
  const p = Bun.spawn(cmd, { cwd, env, stdin: "ignore", stdout: "pipe", stderr: "pipe" });
  const timer = setTimeout(() => p.kill(), timeoutMs);
  const [stdout, stderr] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
  const exitCode = await p.exited;
  clearTimeout(timer);
  return { stdout, stderr, exitCode, wallMs: Date.now() - t0 };
};

/** `extra` carries per-call flags: --session-id / --resume for the two protocol phases, --tools "" for the judge. */
export function buildCommand(arm: Arm, prompt: string, extra: string[] = []): string[] {
  const cmd = ["claude", "-p", prompt, "--model", arm.sessionModel, "--effort", arm.effort, "--permission-mode", arm.permissionMode, "--output-format", "stream-json", "--verbose"];
  if (arm.plugin) cmd.push("--plugin-dir", arm.plugin.path); // the very path pin.ts hashed
  cmd.push(...extra);
  return cmd;
}
