// Fake claude CLI for the setup-operator selftests. argv: <scenario.json> <record.jsonl>. Reads stream-json on stdin and, once the user
// message arrives, replays the scenario: {emit: object} writes a stdout line, {closeStdout: true} closes stdout but stays alive, {await: id} waits for the control_response with that request_id.
// Every stdin line is appended to the record, so a check can see exactly what the operator answered (and that it answered nothing more).
import fs from "node:fs";

const [scenarioFile, recordFile] = process.argv.slice(2) as [string, string];
const steps = JSON.parse(fs.readFileSync(scenarioFile, "utf8")) as ({ emit: unknown } | { await: string } | { closeStdout: true })[];
const waiters = new Map<string, () => void>();
const seen = new Set<string>();
let started = false;
const dec = new TextDecoder();
let buf = "";

async function play() {
  for (const s of steps) {
    if ("closeStdout" in s) {
      fs.closeSync(1); // stdout closed, process stays alive: the operator must not hang
      setInterval(() => {}, 1000);
      return;
    }
    if ("emit" in s) process.stdout.write(JSON.stringify(s.emit) + "\n");
    else if (!seen.has(s.await)) await new Promise<void>((r) => waiters.set(s.await, r));
  }
  process.exit(0);
}

for await (const chunk of process.stdin) {
  buf += dec.decode(chunk, { stream: true });
  let i: number;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i);
    buf = buf.slice(i + 1);
    if (!line.trim()) continue;
    fs.appendFileSync(recordFile, line + "\n");
    const m = JSON.parse(line);
    if (m.type === "control_response") {
      const id = m.response?.request_id as string;
      seen.add(id);
      waiters.get(id)?.();
    }
    if (m.type === "user" && !started) {
      started = true;
      void play();
    }
  }
}
