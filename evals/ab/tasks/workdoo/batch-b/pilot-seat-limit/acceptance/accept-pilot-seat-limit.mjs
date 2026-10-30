import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { migrate, createWorkspace } from '../server/store.ts';
import * as invitations from '../server/invitations.ts';

let checks = 0;
const ok = (value, label) => { assert.ok(value, label); checks++; };
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const full = (action, label) => {
  assert.throws(action, error => error.status === 409 && typeof error.code === 'string' && !['INVITATION_PENDING', 'ALREADY_MEMBER', 'MEMBERSHIP_DISABLED'].includes(error.code) && error.message.length > 10, label);
  checks++;
};
const tokenOf = path => path.split('#invite=')[1];

const db = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true });
db.exec('CREATE TABLE user(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT);');
migrate(db);
for (const id of ['owner', 'op1', 'op2', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8'])
  db.prepare('INSERT INTO user VALUES(?,?,?)').run(id, `Person ${id}`, `${id}@seats.example`);
const company = createWorkspace(db, 'owner', 'Seats Co');
const invite = n => invitations.createInvitation(db, company.id, 'owner', { email: `g${n}@seats.example` });
const pendingCount = () => db.prepare("SELECT count(*) AS n FROM organization_invitations WHERE organization_id=? AND status='pending'").get(company.id).n;
const addOperator = (id, status = 'active') => db.prepare("INSERT INTO organization_memberships(id,organization_id,user_id,role,status,created_at) VALUES(?,?,?,'operator',?,?)")
  .run(`m-${id}`, company.id, id, status, '2026-10-01T00:00:00.000Z');

// Two active operators already on the team; owners never count against the operator seats.
addOperator('op1');
addOperator('op2');
const g1 = invite(1);
const g2 = invite(2);
const g3 = invite(3);
equal(pendingCount(), 3, 'Two operators plus three pending invitations fill every operator seat');
const before = db.prepare('SELECT count(*) AS n FROM organization_invitations').get().n;
full(() => invite(4), 'A sixth operator seat is refused');
equal(db.prepare('SELECT count(*) AS n FROM organization_invitations').get().n, before, 'A refused invitation leaves no record');
full(() => invite(5), 'Still refused while the team is full');

// Accepting turns a pending seat into an active one: the total does not change.
invitations.acceptInvitation(db, 'g1', tokenOf(g1.invitePath));
full(() => invite(4), 'An accepted invitation keeps its seat');

// Revoked, expired and disabled people free their seats; every freed seat can be reused once.
invitations.revokeInvitation(db, company.id, 'owner', g2.invitation.id);
const g4 = invite(4);
equal(g4.invitation.status, 'pending', 'A revoked invitation frees a seat');
full(() => invite(5), 'The freed seat is taken again');
db.prepare('UPDATE organization_invitations SET expires_at=? WHERE id=?').run('2020-01-01T00:00:00.000Z', g3.invitation.id);
const g5 = invite(5);
equal(g5.invitation.status, 'pending', 'An expired invitation frees a seat');
full(() => invite(6), 'Full again');
db.prepare("UPDATE organization_memberships SET status='disabled' WHERE id='m-op2'").run();
const g6 = invite(6);
equal(g6.invitation.status, 'pending', 'A disabled operator frees a seat');
full(() => invite(7), 'Full once more');

// Other rules are unchanged by the limit.
db.prepare("UPDATE organization_memberships SET status='disabled' WHERE id='m-op1'").run();
ok(invite(7).invitation.id, 'Seats are counted on the live data, not remembered');
console.log(`pilot-seat-limit acceptance: ${checks} checks passed`);
