// .mjs on purpose: the repo-root typecheck includes evals/**/*.ts, and this must fail at run time, not there.
const { mul } = await import("../src/add.ts");
if (typeof mul !== "function" || mul(3, 4) !== 12 || mul(0, 9) !== 0) process.exit(1);
