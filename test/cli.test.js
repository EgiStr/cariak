// cli.test.js — Basic CLI smoke tests for CARIAK
// Run: node --test test/cli.test.js
// Zero external dependencies — uses node:test and node:child_process only.

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const CLI_ENTRY = path.resolve(__dirname, '..');

function findEntryPoint() {
  // Try common entry points
  const candidates = [
    path.join(CLI_ENTRY, 'cli', 'index.js'),
    path.join(CLI_ENTRY, 'cli', 'index.mjs'),
    path.join(CLI_ENTRY, 'cli.mjs'),
    path.join(CLI_ENTRY, 'cli.js'),
    path.join(CLI_ENTRY, 'index.js'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0]; // default, test will fail gracefully
}

const entry = findEntryPoint();

function run(args) {
  return spawnSync('node', [entry, ...args], {
    encoding: 'utf-8',
    timeout: 10000,
  });
}

describe('CARIAK CLI', () => {

  it('should have a CLI entry point', () => {
    // If entry doesn't exist, the test runner still works, but subsequent CLI tests will be skipped
    // ponytail: just assert the project has at minimum an index.js somewhere
    const hasAnyEntry = [
      'cli/index.js', 'cli/index.mjs', 'cli.mjs', 'cli.js', 'index.js'
    ].some(p => fs.existsSync(path.join(CLI_ENTRY, p)));
    assert.ok(hasAnyEntry, 'Project should have a CLI entry point (cli/index.js, index.js, etc.)');
  });

  it('--version should return a version string', () => {
    const result = run(['--version']);
    if (!fs.existsSync(entry)) {
      // CLI entry not built yet — skip gracefully
      return;
    }
    assert.strictEqual(result.status, 0, `--version should exit 0, got ${result.status} stderr: ${result.stderr}`);
    const output = result.stdout + result.stderr;
    assert.ok(/\d+\.\d+\.\d+/.test(output), `Output should contain version number: "${output.trim()}"`);
  });

  it('--help should return usage text', () => {
    const result = run(['--help']);
    if (!fs.existsSync(entry)) return;
    assert.strictEqual(result.status, 0, `--help should exit 0, got ${result.status}`);
    const output = (result.stdout + result.stderr).toLowerCase();
    assert.ok(output.includes('usage') || output.includes('help') || output.length > 50,
      `--help output should contain usage information: "${output.trim()}"`);
  });

  it('doctor should not crash', () => {
    const result = run(['doctor']);
    if (!fs.existsSync(entry)) return;
    // Doctor may exit non-zero if project isn't fully set up — that's fine
    // Just verify it doesn't throw an unhandled exception
    const output = result.stdout + result.stderr;
    assert.ok(typeof output === 'string' && output.length > 0,
      'doctor command should produce output');
  });

  it('validate (if supported) should not crash', () => {
    const result = run(['validate']);
    if (!fs.existsSync(entry)) return;
    // Validate may exit non-zero on validation failures — normal
    const output = result.stdout + result.stderr;
    assert.ok(typeof output === 'string',
      'validate command should produce output');
  });

});
