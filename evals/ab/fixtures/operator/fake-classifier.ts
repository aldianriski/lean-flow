// Fake `claude -p` for the classifier selftests (AB_CLASSIFIER_CLI). Reads the prompt on stdin, picks the id of the first
// AB_FAKE_CLASSIFY entry ([[substring, id], ...]) found in the POPUP part of the prompt (else NONE), and prints claude's --output-format json shape.
// AB_FAKE_CLASSIFY_RECORD, when set, gets one JSON line per call: the argv, the config dir and the prompt.
import fs from "node:fs";

const prompt = await new Response(Bun.stdin.stream()).text();
const map = JSON.parse(process.env.AB_FAKE_CLASSIFY ?? "[]") as [string, string][];
const popup = prompt.slice(prompt.indexOf("POPUP"), prompt.indexOf("CATALOG"));
const id = map.find(([t]) => popup.includes(t))?.[1] ?? "NONE";
if (process.env.AB_FAKE_CLASSIFY_RECORD) fs.appendFileSync(process.env.AB_FAKE_CLASSIFY_RECORD, JSON.stringify({ argv: process.argv.slice(2), cfg: process.env.CLAUDE_CONFIG_DIR ?? "", prompt }) + "\n");
console.log(JSON.stringify({ type: "result", subtype: "success", is_error: false, result: JSON.stringify({ id, reason: "fake" }) }));
