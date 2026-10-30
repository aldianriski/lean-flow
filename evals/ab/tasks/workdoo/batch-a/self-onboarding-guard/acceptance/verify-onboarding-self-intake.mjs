import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { PrivateClient, privateWorkspaceHarness } from './lib/private-workspace-harness.mjs';

const harness = await privateWorkspaceHarness('workdoo-self-intake-');
let checks = 0;
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const tokenOf = invitation => new URLSearchParams(new URL(invitation.invitePath, harness.origin).hash.slice(1)).get('invite');
try {
  await harness.start();
  const owner = new PrivateClient(harness.origin);
  await owner.signUp('Avery Admin', 'avery@self.example');
  const blakeClient = new PrivateClient(harness.origin);
  await blakeClient.signUp('Blake Operator', 'blake@self.example');
  const caseyClient = new PrivateClient(harness.origin);
  await caseyClient.signUp('Casey Operator', 'casey@self.example');
  const base = `/api/workspaces/${(await owner.request('POST', '/api/workspaces', { name: 'Self Intake Co' })).data.workspace.id}`;
  for (const [client, email] of [[blakeClient, 'blake@self.example'], [caseyClient, 'casey@self.example']]) {
    const invitation = (await owner.request('POST', `${base}/invitations`, { email })).data;
    equal((await client.request('POST', '/api/invitations/accept', { token: tokenOf(invitation) })).status, 200, `${email} joins as an operator`);
  }
  const roster = (await owner.request('GET', `${base}/people`)).data.members;
  const idOf = name => roster.find(member => member.name.startsWith(name)).id;
  const [avery, blake, casey] = [idOf('Avery'), idOf('Blake'), idOf('Casey')];

  const intake = (email, overrides = {}) => ({ person: { fullName: 'New Joiner', email }, roleTitle: 'Delivery engineer', startDate: '2030-11-01',
    managerMembershipId: avery, location: 'Jakarta', equipmentNeeds: 'Laptop', accessNeeds: 'Project workspace', ...overrides });
  const submit = (client, body, key = randomUUID()) => client.request('POST', `${base}/onboarding`, body, { 'idempotency-key': key });
  const total = async () => (await owner.request('GET', `${base}/onboarding`)).data.total;
  const configure = (revision, access) => owner.request('PUT', `${base}/onboarding/configuration`,
    { expectedRevision: revision, enabled: true, responsibilities: { hr: avery, equipment: avery, access } });

  // Avery created the company, so Avery holds the manager seat and all three responsibilities.
  for (const email of ['avery@self.example', 'AVERY@Self.Example']) {
    const refused = await submit(owner, intake(email));
    equal([refused.status, refused.data.error?.code], [422, 'SELF_ONBOARDING'], `A joiner cannot be onboarded by their own account (${email})`);
  }
  equal(await total(), 0, 'A refused intake creates no case');
  equal((await submit(owner, intake(null))).status, 201, 'An intake without an email cannot match anyone');
  equal((await submit(owner, intake('dana@elsewhere.example'))).status, 201, 'An unrelated joiner is unaffected');
  const caseyKey = randomUUID();
  const caseyIntake = intake('casey@self.example');
  const accepted = await submit(owner, caseyIntake, caseyKey);
  equal(accepted.status, 201, 'A member who holds no onboarding duty can still be onboarded');
  equal(await total(), 3, 'Only the accepted intakes became cases');

  // The chosen onboarding owner is checked, not only the three responsibilities.
  const asManager = await submit(blakeClient, intake('blake@self.example', { managerMembershipId: blake }));
  equal([asManager.status, asManager.data.error?.code], [422, 'SELF_ONBOARDING'], 'The selected onboarding owner cannot be the joiner');
  // Each responsibility owner counts.
  equal((await configure(1, blake)).status, 200, 'The access responsibility moves to Blake');
  const asAccessOwner = await submit(owner, intake('blake@self.example'));
  equal([asAccessOwner.status, asAccessOwner.data.error?.code], [422, 'SELF_ONBOARDING'], 'A current responsibility owner cannot be onboarded by their own duty');
  equal(await total(), 3, 'Refusals still create nothing');
  equal((await configure(2, casey)).status, 200, 'The access responsibility moves to Casey');
  const freed = await submit(owner, intake('blake@self.example'));
  equal(freed.status, 201, 'The rule follows the current owners, so Blake can now be onboarded');

  // A retry of an intake accepted earlier stays available after the duties change.
  const replay = await submit(owner, caseyIntake, caseyKey);
  equal([replay.status, replay.data.case.id], [200, accepted.data.case.id], 'A successful retry still replays its recorded case');
  console.log(`Self-onboarding guard: ${checks} checks passed.`);
} finally { await harness.close(); }
