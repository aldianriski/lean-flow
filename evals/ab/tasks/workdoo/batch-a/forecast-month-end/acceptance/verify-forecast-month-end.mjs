import '../server/nodeFloor.mjs';
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'workdoo-forecast-month-end-'));
const entry = `
import assert from 'node:assert/strict';
import {companySeed} from './src/company/data';
import {forecast} from './src/company/model';
let checks = 0;
const eq = (actual: unknown, expected: unknown, label: string) => { assert.deepEqual(actual, expected, label); checks++; };
const datesOf = (data: any, scenario: 'base' | 'delayed', prefix: string) => forecast(data, scenario).flatMap(week => week.records)
  .filter(line => line.id.startsWith(prefix)).map(line => [line.id, line.date]).sort();

const data: any = structuredClone(companySeed);
data.scheduled = [
  {id: 'LEASE', name: 'Office lease', amount: 5000000, date: '2026-10-31', category: 'OPEX', frequency: 'Monthly'},
  {id: 'RENT', name: 'Coworking monthly renewal', amount: 6000000, date: '2026-11-28', category: 'OPEX', frequency: 'Monthly'},
];
data.subscriptions = [
  {id: 'SUBMEND', name: 'Month-end tooling', vendorId: 'vendor-cloud', seats: 2, frequency: 'Monthly', cost: 1000000, renewal: '2026-10-31', state: 'Active', projectIds: [], steward: companySeed.subscriptions[0].steward},
  {id: 'SUBYEAR', name: 'Annual licence', vendorId: 'vendor-cloud', seats: 2, frequency: 'Annual', cost: 9000000, renewal: '2026-12-31', state: 'Active', projectIds: [], steward: companySeed.subscriptions[0].steward},
];
data.bills = [];

eq(datesOf(data, 'base', 'LEASE-'), [['LEASE-0', '2026-10-31'], ['LEASE-1', '2026-11-30'], ['LEASE-2', '2026-12-31']],
  'A recurring cost dated on the 31st falls on the last day of shorter months and never spills into the next month');
eq(datesOf(data, 'delayed', 'LEASE-'), datesOf(data, 'base', 'LEASE-'), 'The delayed scenario does not move scheduled costs');
eq(datesOf(data, 'base', 'SUBMEND-'), [['SUBMEND-2026-10-31', '2026-10-31'], ['SUBMEND-2026-11-30', '2026-11-30'], ['SUBMEND-2026-12-31', '2026-12-31']],
  'A monthly subscription renewing on the 31st follows the same month-end rule');
eq(datesOf(data, 'base', 'RENT-'), [['RENT-0', '2026-11-28'], ['RENT-1', '2026-12-28']], 'Dates before the 29th keep their day of month');
eq(datesOf(data, 'base', 'SUBYEAR-'), [['SUBYEAR-2026-12-31', '2026-12-31']], 'Annual renewals are unchanged');

// An already recorded renewal bill suppresses the forecast line for the same renewal date; it must not leave a duplicate a day later.
data.bills = [{...companySeed.bills[0], id: 'BILL-MEND', name: 'Month-end tooling November', subscriptionId: 'SUBMEND', due: '2026-11-30', state: 'Recorded', amount: 1000000}];
const covered = datesOf(data, 'base', 'SUBMEND-');
eq(covered, [['SUBMEND-2026-10-31', '2026-10-31'], ['SUBMEND-2026-12-31', '2026-12-31']], 'A recorded bill due on the last day of the month replaces the forecast renewal for that month');
console.log('Forecast month-end: ' + checks + ' checks passed.');
`;
try {
  const output = join(temp, 'checks.cjs');
  await build({ stdin: { contents: entry, resolveDir: root, sourcefile: 'forecast-month-end.ts', loader: 'ts' }, outfile: output, bundle: true, platform: 'node', format: 'cjs', loader: { '.css': 'empty' }, logLevel: 'silent' });
  execFileSync(process.execPath, [output], { stdio: 'inherit' });
} finally { rmSync(temp, { recursive: true, force: true }); }
