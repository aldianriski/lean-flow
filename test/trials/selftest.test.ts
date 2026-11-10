import { expect, test } from "bun:test";
import { invoke, temporary } from "./helpers";

test("offline selftest uses the default OS temp root", () => {
  const p = invoke("selftest", [], { ...process.env, HTTPS_PROXY: "http://127.0.0.1:1", HTTP_PROXY: "http://127.0.0.1:1" });
  expect(p.err).toBe("");
  expect(p.code).toBe(0);
  expect(p.out).toContain("source/sentinel snapshots: identical");
  expect(p.out).toContain("trials selftest: PASS");
});

test("offline selftest exercises prep, snapshot, oracle, preflight and dry launch", () => {
  const tmp = temporary();
  try {
    const p = invoke("selftest", ["--temp-root", tmp.path], { ...process.env, HTTPS_PROXY: "http://127.0.0.1:1", HTTP_PROXY: "http://127.0.0.1:1" });
    expect(p.code).toBe(0);
    expect(p.out).toContain("source/sentinel snapshots: identical");
    expect(p.out).toContain("trials selftest: PASS");
  } finally { tmp.cleanup(); }
});
