import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import { PassThrough } from 'node:stream';
import { authenticationFailure } from '../server/providerFailure.ts';
import { createAgentRunner } from '../server/agentRunner.ts';

let checks = 0;
const ok = (value, label) => { assert.ok(value, label); checks++; };
const equal = (actual, expected, label) => { assert.deepEqual(actual, expected, label); checks++; };

// One shared classifier, with the behaviour both runners had.
for (const text of ['Not logged in · Please run /login', 'Error: authentication failed', 'Authentication required', 'Unauthorized', 'request was unauthorised',
  'Invalid API key provided', 'invalid_api_key', 'OAuth token has expired', 'oauth session is invalid', 'please log in again', 'Please sign-in to continue', 'login required', 'HTTP 401 from upstream'])
  equal(authenticationFailure(text), true, `Authentication failure: ${text}`);
for (const text of ['rate limit exceeded', 'usage limit reached', 'network unreachable', 'schema rejected by the provider', 'processed 4010 items', 'ECONNRESET', ''])
  equal(authenticationFailure(text), false, `Not an authentication failure: ${JSON.stringify(text)}`);

// No second copy of the classifier remains in either runner.
const planner = readFileSync(new URL('../server/agentRunner.ts', import.meta.url), 'utf8');
const delivery = readFileSync(new URL('../server/deliveryAgentRunner.ts', import.meta.url), 'utf8');
const shared = readFileSync(new URL('../server/providerFailure.ts', import.meta.url), 'utf8');
ok(/not logged in/i.test(shared), 'The classifier lives in the shared module');
ok(!/unauthori\[sz\]ed/.test(planner) && !/unauthori\[sz\]ed/.test(delivery), 'Neither runner keeps its own copy of the classifier pattern');
ok(/providerFailure(?:\.ts)?['"]/.test(planner) && /providerFailure(?:\.ts)?['"]/.test(delivery), 'Both runners import the shared module');

// The planner runner still maps the failure to its own typed error.
function fakeSpawn(stdout, stderr, exitCode) {
  return () => {
    const child = new EventEmitter();
    child.stdin = new PassThrough(); child.stdout = new PassThrough(); child.stderr = new PassThrough();
    child.kill = () => true;
    child.stdin.on('finish', () => setImmediate(() => { child.stdout.end(stdout); child.stderr.end(stderr); child.emit('close', exitCode, null); }));
    return child;
  };
}
const environment = { WORKDOO_AI_ENGINE: 'claude-cli', WORKDOO_CLAUDE_BIN: process.execPath };
const failureCode = async (stdout, stderr, exitCode) => {
  const runner = createAgentRunner(environment, fakeSpawn(stdout, stderr, exitCode));
  try { await runner.run('prompt', { type: 'object' }); return 'no failure'; } catch (error) { return error.code; } finally { runner.close(); }
};
equal(await failureCode('', 'Not logged in · Please run /login', 1), 'AI_AUTH_REQUIRED', 'A signed-out CLI is reported as authentication required');
equal(await failureCode('', 'segmentation fault', 1), 'AI_UNAVAILABLE', 'Other non-zero exits stay unavailable');
equal(await failureCode('not json, authentication required', '', 0), 'AI_AUTH_REQUIRED', 'Unparseable output that is an authentication problem is still authentication required');
equal(await failureCode('plain garbage', '', 0), 'AI_INVALID_OUTPUT', 'Other unparseable output stays invalid');
console.log(`shared-auth-failure acceptance: ${checks} checks passed`);
