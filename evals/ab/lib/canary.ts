// Leak-detecting canaries: five distinct pieces of user configuration, planted into a throwaway `.claude`-shaped dir
// and observed in a finished run. Planted as the selected config they MUST show (the probe can see a leak);
// planted in the ambient temp home while a clean config is selected they must NOT.
import fs from "node:fs";
import path from "node:path";
import type { Isolation } from "./isolate.ts";
import type { Stream } from "./parse.ts";

export const TOKENS = { instruction: "CANARY-INSTR-5521", memory: "CANARY-MEM-8847", env: "CANARY-ENV-9034" };
export const CANARY_PROMPT =
  'Reply with exactly one line of JSON and nothing else: {"instruction":<the token starting CANARY-INSTR found in your instructions, or "NONE">,"memory":<the token starting CANARY-MEM found in your memory, or "NONE">}. Do not use any tool.';

export type Observed = { instruction: boolean; memory: boolean; env: boolean; plugin: boolean; hook: boolean };

const slug = (p: string) => p.replace(/[^A-Za-z0-9]/g, "-");
const fwd = (p: string) => p.split(path.sep).join("/");

/** Where the env+hook canary writes: outside the trial dir and outside any `.claude` dir. */
export const markerFile = (iso: Isolation) => path.join(iso.root, "marker.txt");

/** Plant all five canaries in `claudeDir` (the selected config dir, or `<home>/.claude` for the ambient case). */
export function plantCanaries(claudeDir: string, iso: Isolation): void {
  fs.mkdirSync(claudeDir, { recursive: true });
  fs.writeFileSync(path.join(claudeDir, "CLAUDE.md"), `# Canary instruction\nThe canary instruction token is ${TOKENS.instruction}.\n`);
  const mem = path.join(claudeDir, "projects", slug(iso.trialDir), "memory");
  fs.mkdirSync(mem, { recursive: true });
  fs.writeFileSync(path.join(mem, "MEMORY.md"), `# Memory Index\n\n- The canary memory token is ${TOKENS.memory}.\n`);

  // a plugin registered through the registry files the real config uses: marketplace + installed + enabled
  const mp = path.join(claudeDir, "plugins", "marketplaces", "canary-mp");
  const plug = path.join(mp, "canary");
  fs.mkdirSync(path.join(plug, ".claude-plugin"), { recursive: true });
  fs.mkdirSync(path.join(plug, "skills", "canary-skill"), { recursive: true });
  fs.mkdirSync(path.join(mp, ".claude-plugin"), { recursive: true });
  fs.writeFileSync(path.join(plug, ".claude-plugin", "plugin.json"), JSON.stringify({ name: "canary", version: "1.0.0", description: "canary" }));
  fs.writeFileSync(path.join(plug, "skills", "canary-skill", "SKILL.md"), "---\nname: canary-skill\ndescription: canary skill\n---\nCanary.\n");
  fs.writeFileSync(path.join(mp, ".claude-plugin", "marketplace.json"), JSON.stringify({ name: "canary-mp", owner: { name: "canary" }, plugins: [{ name: "canary", source: "./canary" }] }));
  const when = "2026-01-01T00:00:00.000Z";
  fs.writeFileSync(path.join(claudeDir, "plugins", "known_marketplaces.json"), JSON.stringify({ "canary-mp": { source: { source: "directory", path: mp }, installLocation: mp, lastUpdated: when } }));
  fs.writeFileSync(path.join(claudeDir, "plugins", "installed_plugins.json"), JSON.stringify({ version: 2, plugins: { "canary@canary-mp": [{ scope: "user", installPath: plug, version: "1.0.0", installedAt: when, lastUpdated: when }] } }));

  // settings: an env var, and a hook that writes it to a marker file (env + hook observable without the model)
  const settings = {
    enabledPlugins: { "canary@canary-mp": true },
    env: { AB_CANARY_ENV: TOKENS.env },
    hooks: { SessionStart: [{ hooks: [{ type: "command", command: `echo "$AB_CANARY_ENV" > "${fwd(markerFile(iso))}"` }] }] },
  };
  fs.writeFileSync(path.join(claudeDir, "settings.json"), JSON.stringify(settings, null, 2));
}

/** Which canaries a finished run shows. */
export function observeCanaries(stream: Stream, iso: Isolation): Observed {
  const reply = String(stream.result?.result ?? "");
  const marker = fs.existsSync(markerFile(iso)) ? fs.readFileSync(markerFile(iso), "utf8") : "";
  return {
    instruction: reply.includes(TOKENS.instruction),
    memory: reply.includes(TOKENS.memory),
    env: marker.includes(TOKENS.env),
    plugin: (stream.init?.plugins ?? []).some((p) => p.name === "canary") && (stream.init?.skills ?? []).some((s) => s.includes("canary-skill")),
    hook: stream.hooksStarted.length > 0,
  };
}
