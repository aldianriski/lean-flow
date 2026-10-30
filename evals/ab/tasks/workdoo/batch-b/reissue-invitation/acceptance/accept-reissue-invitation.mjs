import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { migrate, createWorkspace } from '../server/store.ts';
import * as invitations from '../server/invitations.ts';

let checks = 0;
const ok = (value, label) => { assert.ok(value, label); checks++; };
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const denied = (action, status, code, label) => { assert.throws(action, error => error.status === status && error.code === code, label); checks++; };
const tokenOf = path => path.split('#invite=')[1];

const db = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true });
db.exec('CREATE TABLE user(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT);');
migrate(db);
db.exec(`INSERT INTO user VALUES('owner','Olivia Owner','owner@reissue.example'),('op','Omar Operator','op@reissue.example'),
  ('guest','Gwen Guest','guest@reissue.example'),('guest2','Gus Guest','guest2@reissue.example'),('guest3','Gia Guest','guest3@reissue.example'),
  ('guest4','Gil Guest','guest4@reissue.example'),('foreign','Fay Foreign','foreign@reissue.example');`);
const company = createWorkspace(db, 'owner', 'Reissue Co');
const other = createWorkspace(db, 'foreign', 'Other Co');
db.prepare("INSERT INTO organization_memberships(id,organization_id,user_id,role,status,created_at) VALUES('m-op',?,?,'operator','active',?)").run(company.id, 'op', '2026-10-01T00:00:00.000Z');
const events = () => db.prepare('SELECT event_type,summary FROM organization_access_events WHERE organization_id=? ORDER BY created_at,rowid').all(company.id);

// Pending invitation: reissue replaces the link.
const first = invitations.createInvitation(db, company.id, 'owner', { email: 'guest@reissue.example' });
const oldToken = tokenOf(first.invitePath);
const before = Date.now();
const second = invitations.reissueInvitation(db, company.id, 'owner', first.invitation.id);
ok(second.invitation.id !== first.invitation.id, 'The reissued invitation is a new record');
equal([second.invitation.email, second.invitation.status], ['guest@reissue.example', 'pending'], 'Same email, pending again');
ok(/^\/workspace#invite=[A-Za-z0-9_-]{43}$/.test(second.invitePath), 'A private link in the same shape as a new invitation');
ok(tokenOf(second.invitePath) !== oldToken, 'A different secret');
const lifetime = Date.parse(second.invitation.expiresAt) - before;
ok(Math.abs(lifetime - 7 * 24 * 3600 * 1000) < 120_000, 'The fresh link gets the full invitation lifetime');
denied(() => invitations.inspectInvitation(db, 'guest', oldToken), 404, 'INVITATION_UNAVAILABLE', 'The superseded link no longer works');
equal(invitations.inspectInvitation(db, 'guest', tokenOf(second.invitePath)).invitation.status, 'pending', 'The new link works for the matching account');
const listed = invitations.listInvitations(db, company.id, 'owner');
equal(listed.filter(item => item.email === 'guest@reissue.example').map(item => item.status).sort(), ['pending', 'revoked'], 'The old record is revoked and exactly one is pending');
ok(!JSON.stringify(listed).includes(tokenOf(second.invitePath)), 'Listings never carry the secret');
equal(events().map(row => row.event_type).slice(-2), ['invitation.revoked', 'invitation.created'], 'Both changes are recorded in the access history, revocation first');
ok(events().every(row => !row.summary.includes(tokenOf(second.invitePath)) && !row.summary.includes(oldToken)), 'History never records link secrets');

// Authority and scope.
denied(() => invitations.reissueInvitation(db, company.id, 'op', second.invitation.id), 403, 'INVITATION_DENIED', 'Operators cannot reissue');
denied(() => invitations.reissueInvitation(db, other.id, 'foreign', second.invitation.id), 404, 'NOT_FOUND', 'Another company owner cannot reach it');
denied(() => invitations.reissueInvitation(db, company.id, 'foreign', second.invitation.id), 404, 'NOT_FOUND', 'A non-member gets the same unavailable answer');
denied(() => invitations.reissueInvitation(db, company.id, 'owner', '00000000-0000-4000-8000-000000000000'), 404, 'NOT_FOUND', 'An unknown invitation is unavailable');

// Expired and revoked invitations can be reissued.
const e = invitations.createInvitation(db, company.id, 'owner', { email: 'guest2@reissue.example' });
db.prepare('UPDATE organization_invitations SET expires_at=? WHERE id=?').run('2020-01-01T00:00:00.000Z', e.invitation.id);
denied(() => invitations.inspectInvitation(db, 'guest2', tokenOf(e.invitePath)), 404, 'INVITATION_UNAVAILABLE', 'An expired link is unavailable');
const e2 = invitations.reissueInvitation(db, company.id, 'owner', e.invitation.id);
equal(invitations.inspectInvitation(db, 'guest2', tokenOf(e2.invitePath)).invitation.status, 'pending', 'An expired invitation can be reissued');
const r = invitations.createInvitation(db, company.id, 'owner', { email: 'guest3@reissue.example' });
invitations.revokeInvitation(db, company.id, 'owner', r.invitation.id);
const r2 = invitations.reissueInvitation(db, company.id, 'owner', r.invitation.id);
equal(r2.invitation.status, 'pending', 'A revoked invitation can be reissued');
equal(invitations.listInvitations(db, company.id, 'owner').filter(item => item.email === 'guest3@reissue.example' && item.status === 'pending').length, 1, 'Still one pending per email');

// Accepted invitations are final.
const a = invitations.createInvitation(db, company.id, 'owner', { email: 'guest4@reissue.example' });
invitations.acceptInvitation(db, 'guest4', tokenOf(a.invitePath));
const total = db.prepare('SELECT count(*) AS n FROM organization_invitations').get().n;
denied(() => invitations.reissueInvitation(db, company.id, 'owner', a.invitation.id), 409, 'INVITATION_ACCEPTED', 'An accepted invitation cannot be reissued');
equal(db.prepare('SELECT count(*) AS n FROM organization_invitations').get().n, total, 'No record is created for an accepted invitation');

// A failed reissue leaves the original untouched.
db.prepare("INSERT INTO user VALUES('late','Lee Late','late@reissue.example')").run();
const l = invitations.createInvitation(db, company.id, 'owner', { email: 'late@reissue.example' });
db.prepare("INSERT INTO organization_memberships(id,organization_id,user_id,role,status,created_at) VALUES('m-late',?,?,'operator','active',?)").run(company.id, 'late', '2026-10-02T00:00:00.000Z');
denied(() => invitations.reissueInvitation(db, company.id, 'owner', l.invitation.id), 409, 'ALREADY_MEMBER', 'A current member cannot be re-invited');
equal(db.prepare('SELECT status FROM organization_invitations WHERE id=?').get(l.invitation.id).status, 'pending', 'The failed reissue did not revoke the original');
console.log(`reissue-invitation acceptance: ${checks} checks passed`);
