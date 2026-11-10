// Re-emit a recorded gate result without running its original (possibly remote) command.
import { readFileSync } from "node:fs";
console.log(readFileSync(process.argv[2]!, "utf8"));
process.exit(Number(process.argv[3]));
