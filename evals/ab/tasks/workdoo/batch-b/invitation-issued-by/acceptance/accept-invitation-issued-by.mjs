import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { DatabaseSync } from 'node:sqlite';
import { migrate, createWorkspace } from '../server/store.ts';
import * as invitations from '../server/invitations.ts';

let checks = 0;
const ok = (value, label) => { assert.ok(value, label); checks++; };
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const text = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

// Server: every invitation the owner sees names the member who issued it.
const db = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true });
db.exec('CREATE TABLE user(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT);');
migrate(db);
db.exec(`INSERT INTO user VALUES('owner','Olivia Owner','owner@issued.example'),('second','Sam Second','second@issued.example'),
  ('g1','Gwen One','g1@issued.example'),('g2','Gus Two','g2@issued.example');`);
const company = createWorkspace(db, 'owner', 'Issued Co');
const created = invitations.createInvitation(db, company.id, 'owner', { email: 'g1@issued.example' });
equal(created.invitation.issuedBy, 'Olivia Owner', 'A new invitation reports who issued it');
const listed = invitations.listInvitations(db, company.id, 'owner');
equal(listed.map(item => item.issuedBy), ['Olivia Owner'], 'The list reports the issuer');
equal(invitations.revokeInvitation(db, company.id, 'owner', created.invitation.id).invitation.issuedBy, 'Olivia Owner', 'A revoked invitation still reports its issuer');

// The issuer is the member who created it, not whoever is looking at it later.
db.prepare("INSERT INTO organization_memberships(id,organization_id,user_id,role,status,created_at) VALUES('m-second',?,?,'owner','active',?)").run(company.id, 'second', '2026-10-01T00:00:00.000Z');
invitations.createInvitation(db, company.id, 'second', { email: 'g2@issued.example' });
const both = Object.fromEntries(invitations.listInvitations(db, company.id, 'second').map(item => [item.email, item.issuedBy]));
equal(both, { 'g1@issued.example': 'Olivia Owner', 'g2@issued.example': 'Sam Second' }, 'Each invitation names its own issuer for any owner reading the list');
ok(!JSON.stringify(listed).includes('token'), 'Still no secrets in the listing');
equal(Object.keys(invitations.listInvitations(db, company.id, 'owner')[0]).sort(), ['createdAt', 'email', 'expiresAt', 'id', 'issuedBy', 'status'], 'Only the documented fields plus issuedBy');

// Contract: shared types and the published API description agree with the server.
const contracts = text('src/workspace/contracts.ts');
const invitationType = contracts.slice(contracts.indexOf('export interface WorkspaceInvitation'), contracts.indexOf('export interface InspectedInvitation'));
ok(/\bissuedBy:\s*string;/.test(invitationType), 'WorkspaceInvitation declares issuedBy');
const schema = JSON.parse(text('docs/api/openapi.yaml')).components.schemas.InvitationMetadata;
equal(schema.properties.issuedBy?.type, 'string', 'OpenAPI describes issuedBy as a string');
ok(schema.required.includes('issuedBy'), 'OpenAPI requires issuedBy');

// UI: the owner sees the issuer in the invitation list.
const panel = text('src/workspace/TeamAccess.tsx');
ok(/invitation\.issuedBy/.test(panel), 'The invitation list shows the issuer');

// UI: the expiry is shown with its time, in the way this product shows every date and time to its users.
ok(/formatDateTime\(invitation\.expiresAt\)/.test(panel), 'The invitation list shows the expiry through formatDateTime');
const temp = mkdtempSync(path.join(os.tmpdir(), 'workdoo-brand-'));
try {
  const outfile = path.join(temp, 'brand.mjs');
  await build({ entryPoints: [fileURLToPath(new URL('../src/workspace/Brand.tsx', import.meta.url))], outfile, bundle: true, platform: 'node', format: 'esm', jsx: 'automatic', loader: { '.css': 'empty', '.png': 'empty' }, logLevel: 'silent' });
  const { formatDateTime } = await import(pathToFileURL(outfile).href);
  ok(typeof formatDateTime === 'function', 'Brand exports formatDateTime');
  const readings = [];
  for (const zone of ['Asia/Jakarta', 'America/Los_Angeles', 'UTC']) {
    process.env.TZ = zone;
    readings.push([formatDateTime('2026-10-30T23:30:00.000Z'), formatDateTime('2026-01-05T00:05:00.000Z')]);
  }
  equal(readings[1], readings[0], 'The reading does not depend on the viewer time zone (Los Angeles)');
  equal(readings[2], readings[0], 'The reading does not depend on the viewer time zone (UTC)');
  const [late, early] = readings[0];
  ok(/^30 Oct 2026\b/.test(late) && late.includes('23:30'), `Day-first date with the UTC clock time: ${late}`);
  ok(/^5 Jan 2026\b/.test(early) && early.includes('00:05') && !/[AP]M/i.test(early + late), `24-hour clock, midnight hour is 00: ${early}`);
} finally { rmSync(temp, { recursive: true, force: true }); }
console.log(`invitation-issued-by acceptance: ${checks} checks passed`);
