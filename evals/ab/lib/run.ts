// Spawn one headless claude run under the arm's pins. The process boundary is injectable so the
// free self-tests can replay recorded output instead of calling a model.
import type { Arm } from "./arm.ts";

export type RawRun = { stdout: string; stderr: string; exitCode: number; wallMs: number };
/** `stdin`, when given, is piped to the process (the CLI reads the prompt from it when `-p` has no argument); otherwise stdin is ignored. */
export type Runner = (cmd: string[], opts: { cwd: string; env: Record<string, string>; timeoutMs: number; stdin?: string }) => Promise<RawRun>;

export const spawnRunner: Runner = async (cmd, { cwd, env, timeoutMs, stdin }) => {
  const t0 = Date.now();
  const p = Bun.spawn(cmd, { cwd, env, stdin: stdin === undefined ? "ignore" : "pipe", stdout: "pipe", stderr: "pipe" });
  if (stdin !== undefined) {
    p.stdin!.write(stdin);
    await p.stdin!.end();
  }
  const timer = setTimeout(() => p.kill(), timeoutMs);
  const [stdout, stderr] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
  const exitCode = await p.exited;
  clearTimeout(timer);
  return { stdout, stderr, exitCode, wallMs: Date.now() - t0 };
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
