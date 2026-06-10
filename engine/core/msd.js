'use strict';

/**
 * MSD engine — core (Node-only load + validate).
 *
 * Loads + validates an MSD input file via the single authoritative validation
 * path (validator/validate.js). This half needs `fs` / `path` / `child_process`
 * and so is not browser-portable.
 *
 * The pure, side-effect-free conversion helpers now live in ./convert.js and are
 * re-exported here unchanged, so the engine core's public surface is identical:
 * adapters and the CLI keep importing `core.toCsv`, `core.countryToTimezone`, …
 * exactly as before. Bundling the adapter against ./convert.js (not this module)
 * keeps the browser path free of Node builtins.
 *
 * CLAUDE.md §4: AJV (validator/validate.js) is the ONLY authoritative
 * validation. The engine therefore shells out to it and aborts on invalid
 * input rather than re-implementing the gate (blueprint §3 input contract).
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const convert = require('./convert');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const VALIDATOR = path.join(REPO_ROOT, 'validator', 'validate.js');

/**
 * Load an MSD file and validate it against the v0.1.0 schema. Aborts (throws)
 * on invalid input — the engine never emits output from an invalid MSD.
 */
function loadAndValidate(msdPath) {
  const abs = path.resolve(msdPath);
  try {
    execFileSync('node', [VALIDATOR, abs], { stdio: 'pipe' });
  } catch (err) {
    const out = (err.stdout ? err.stdout.toString() : '') + (err.stderr ? err.stderr.toString() : '');
    throw new Error(`MSD input failed validation (validator/validate.js); refusing to convert:\n${out.trim()}`);
  }
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

// Re-export the pure conversion helpers unchanged (single surface for callers).
module.exports = {
  loadAndValidate,
  ...convert,
};
