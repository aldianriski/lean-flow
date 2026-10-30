import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { PrivateClient, privateWorkspaceHarness } from './lib/private-workspace-harness.mjs';

const harness = await privateWorkspaceHarness('workdoo-activity-type-');
let checks = 0;
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };
const tokenOf = invitation => new URLSearchParams(new URL(invitation.invitePath, harness.origin).hash.slice(1)).get('invite');
try {
  await harness.start();
  const owner = new PrivateClient(harness.origin);
  await owner.signUp('Avery Activity', 'avery@activity.example');
  const operator = new PrivateClient(harness.origin);
  await operator.signUp('Blake Operator', 'blake@activity.example');
  const outsider = new PrivateClient(harness.origin);
  await outsider.signUp('Casey Outside', 'casey@activity.example');
  const base = `/api/workspaces/${(await owner.request('POST', '/api/workspaces', { name: 'Activity Filter Co' })).data.workspace.id}`;

  // Seed a mixed feed: 2 invitation.created, 1 invitation.accepted, 1 invitation.revoked,
  // 1 division.created, 1 team.created, 1 team.member_added, 1 member.updated.
  const blakeInvite = (await owner.request('POST', `${base}/invitations`, { email: 'blake@activity.example' })).data;
  equal((await operator.request('POST', '/api/invitations/accept', { token: tokenOf(blakeInvite) })).status, 200, 'The operator joins');
  const caseyInvite = (await owner.request('POST', `${base}/invitations`, { email: 'casey@activity.example' })).data;
  equal((await owner.request('POST', `${base}/invitations/${caseyInvite.invitation.id}/revoke`, {})).status, 200, 'A pending invitation is revoked');
  const organize = body => owner.request('POST', `${base}/organization/commands`, { commandId: randomUUID(), ...body });
  const division = await organize({ type: 'save_group', kind: 'division', expectedRevision: 0, name: 'Delivery' });
  equal(division.status, 200, 'A division is created');
  const team = await organize({ type: 'save_group', kind: 'team', expectedRevision: 0, name: 'Platform', divisionId: division.data.command.result.groupId });
  equal(team.status, 200, 'A team is created');
  const roster = (await owner.request('GET', `${base}/people`)).data.members;
  const blake = roster.find(member => member.role === 'operator');
  const teamId = team.data.command.result.groupId;
  equal((await organize({ type: 'set_group_member', kind: 'team', groupId: teamId, expectedRevision: 1, membershipId: blake.id, member: true })).status, 200, 'A member joins the team');
  equal((await operator.request('GET', `${base}/access/activity?type=invitation.created`)).status, 403, 'Operators still cannot read the feed');
  equal((await owner.request('POST', `${base}/access/commands`, { commandId: randomUUID(), type: 'change_access', membershipId: blake.id, expectedRevision: 1, role: 'operator', status: 'disabled' })).status, 200, 'Access is removed');

  const feed = query => owner.request('GET', `${base}/access/activity${query}`);
  const all = await feed('?pageSize=100');
  equal(all.data.total, 8, 'Unfiltered history keeps every access and group event');
  const counts = {};
  for (const event of all.data.events) counts[event.type] = (counts[event.type] ?? 0) + 1;
  equal(counts, { 'invitation.created': 2, 'invitation.accepted': 1, 'invitation.revoked': 1, 'division.created': 1, 'team.created': 1, 'team.member_added': 1, 'member.updated': 1 }, 'The seeded feed is a known mix of event types');

  const created = await feed('?type=invitation.created');
  equal([created.status, created.data.total], [200, 2], 'An access event type narrows the feed and its total');
  equal(created.data.events.every(event => event.type === 'invitation.created'), true, 'Only the requested type is returned');
  const group = await feed('?type=team.member_added');
  equal([group.status, group.data.total, group.data.events.map(event => event.type)], [200, 1, ['team.member_added']], 'Group event types filter the same feed');
  equal((await feed('?type=invitation.created&search=casey')).data.total, 1, 'The type filter composes with search');
  equal((await feed(`?type=invitation.created&membershipId=${blake.id}`)).data.total, 0, 'The type filter composes with the member filter');
  const paged = await feed('?type=invitation.created&pageSize=1&page=2');
  equal([paged.data.total, paged.data.events.length, paged.data.page], [2, 1, 2], 'Totals and pages describe the filtered feed');
  const absent = await feed('?type=division.updated');
  equal([absent.status, absent.data.total, absent.data.events], [200, 0, []], 'A supported type with no events is an empty result, not an error');
  for (const bad of ['invitation.deleted', 'DIVISION.CREATED', 'member', 'team.created%20OR%201%3D1']) {
    const rejected = await feed(`?type=${bad}`);
    equal([rejected.status, rejected.data.error?.code], [422, 'INVALID_QUERY'], `An unsupported type (${bad}) is rejected like other bad queries`);
  }
  equal((await outsider.request('GET', `${base}/access/activity?type=invitation.created`)).status, 404, 'Company scope still applies');

  const document = JSON.parse(readFileSync(new URL('../docs/api/openapi.yaml', import.meta.url), 'utf8'));
  const parameters = document.paths['/api/workspaces/{workspaceId}/access/activity'].get.parameters;
  equal(parameters.some(parameter => parameter.name === 'type' && parameter.in === 'query'), true, 'The API reference documents the new query parameter');
  console.log(`Access activity type filter: ${checks} checks passed.`);
} finally { await harness.close(); }
