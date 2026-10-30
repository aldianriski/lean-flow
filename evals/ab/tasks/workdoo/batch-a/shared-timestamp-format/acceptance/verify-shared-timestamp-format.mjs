import '../server/nodeFloor.mjs';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'workdoo-shared-timestamp-'));
let checks = 0;
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const entry = `
import {formatTimestamp} from './src/workspace/formatTimestamp';
const samples = ['2026-10-30T23:30:00.000Z', '2026-10-31T00:05:00.000Z', '2026-11-03T09:07:00Z', 'not a date', ''];
console.log(JSON.stringify(samples.map(sample => formatTimestamp(sample))));
`;
try {
  const output = join(temp, 'format.cjs');
  await build({ stdin: { contents: entry, resolveDir: root, sourcefile: 'format-timestamp.ts', loader: 'ts' }, outfile: output, bundle: true, platform: 'node', format: 'cjs', logLevel: 'silent' });
  const run = zone => JSON.parse(execFileSync(process.execPath, [output], { env: { ...process.env, TZ: zone }, encoding: 'utf8' }));
  const jakarta = run('Asia/Jakarta'), losAngeles = run('America/Los_Angeles'), utc = run('UTC');
  equal(jakarta, utc, 'Every viewer sees the same text for the same instant, whatever their time zone (UTC+7 vs UTC)');
  equal(losAngeles, utc, 'Every viewer sees the same text for the same instant, whatever their time zone (UTC-7 vs UTC)');
  const [late, midnight, singleDigit, invalid, empty] = utc;
  assert.match(late, /^30 Oct 2026,? 23:30(?: UTC)?$/, 'Day, abbreviated month, year, then a 24-hour clock'); checks++;
  assert.match(midnight, /^31 Oct 2026,? 00:05(?: UTC)?$/, 'Midnight reads 00:05, never 24:05 or 12:05 AM'); checks++;
  assert.match(singleDigit, /^3 Nov 2026,? 09:07(?: UTC)?$/, 'The day is not zero-padded and the hour is'); checks++;
  equal([invalid, empty], ['not a date', ''], 'Unparseable input is shown as it was received');

  const views = ['src/workspace/PeopleAccess.tsx', 'src/workspace/FactoryHistoryView.tsx', 'src/workspace/FactoryPublicationActions.tsx', 'src/workspace/FactoryWorkspace.tsx'];
  for (const view of views) {
    const source = readFileSync(join(root, view), 'utf8');
    equal([view, /formatTimestamp/.test(source), /toLocale(?:Date|Time)?String/.test(source)], [view, true, false], `${view} uses the shared formatter and no browser-local formatting`);
  }
  console.log(`Shared timestamp format: ${checks} checks passed.`);
} finally { rmSync(temp, { recursive: true, force: true }); }
