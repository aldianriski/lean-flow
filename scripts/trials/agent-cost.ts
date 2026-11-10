// Caller supplies: one stream-json file or directory of transcripts; prices below are fitted USD per million tokens.
import { readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { args, cli, readStream, required } from "./lib";

const prices = {
  opus: { read: 0.2, write: 8.12, out: 20.45, inp: 8.12 },
  sonnet: { read: 0.07, write: 2.51, out: 13.23, inp: 2.51 },
};
export function cost(file: string) {
  const seen = new Map<string, { model: string; usage: Record<string, number> }>();
  for (const r of readStream(file)) {
    const m = r.message;
    if (r.type === "assistant" && m?.id && m.usage) seen.set(m.id, { model: m.model, usage: m.usage });
  }
  let usd = 0;
  for (const [id, { model, usage: u }] of seen) {
    // An API-error turn is a <synthetic> message with zero usage: nothing was billed, so skip it.
    if (model === "<synthetic>" && Object.values(u).every(v => typeof v !== "number" || v === 0)) { seen.delete(id); continue; }
    const family = Object.keys(prices).find(k => model?.includes(k)) as keyof typeof prices | undefined;
    if (!family) throw new Error(`no fitted price for model ${model}`);
    const p = prices[family];
    usd += ((u.cache_read_input_tokens ?? 0) * p.read + (u.cache_creation_input_tokens ?? 0) * p.write +
      (u.output_tokens ?? 0) * p.out + (u.input_tokens ?? 0) * p.inp) / 1e6;
  }
  return { turns: seen.size, usd };
}
const usage = "usage: bun --no-env-file scripts/trials/agent-cost.ts (--file JSONL | --runs-dir DIR)";
if (import.meta.main) cli(usage, () => {
  const a = args(usage);
  if (!!a["--file"] === !!a["--runs-dir"]) throw new Error(usage);
  const files = a["--file"] ? [required(a, "--file")] : readdirSync(required(a, "--runs-dir"))
    .filter(f => f.endsWith(".jsonl")).sort().map(f => join(required(a, "--runs-dir"), f));
  if (!files.length) throw new Error("no transcripts");
  let total = 0;
  for (const file of files) {
    const c = cost(file); total += c.usd;
    console.log(`${basename(file)} turns ${c.turns} USD ${c.usd.toFixed(6)}`);
  }
  console.log(`total USD ${total.toFixed(6)}`);
});
