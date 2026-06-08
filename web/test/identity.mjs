// W2 identity gate.
//
// Proves the single validation path is structural, not disciplinary: for every fixture,
// the SHARED CORE produces identical output whether schema+registry come from disk (the
// CLI path) or are inlined by esbuild (the web path).
//
// Compares { valid, messages: formatErrors(errors) } ONLY — never the CLI's 2-space
// printed indent (that indent is CLI presentation, added in validate.js, not in the core).

import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // web/test
const WEB_DIR = path.resolve(__dirname, '..'); // web
const REPO = path.resolve(WEB_DIR, '..'); // repo root

// ---- web path: bundle bundle.js (node target) so schema+registry are inlined by esbuild.
const inlinedOut = path.join(WEB_DIR, 'dist', 'identity-bundle.mjs');
await esbuild.build({
  entryPoints: [path.join(WEB_DIR, 'bundle.js')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: inlinedOut,
  logLevel: 'silent',
});
const web = await import(pathToFileURL(inlinedOut).href);

// ---- CLI path: shared core + schema/registry read from disk (mirrors validate.js).
const core = require(path.join(REPO, 'validator', 'core.js'));
const diskSchema = JSON.parse(
  fs.readFileSync(path.join(REPO, 'schema', 'v0.1.0', 'msd.schema.json'), 'utf8')
);
const registryDir = path.join(REPO, 'registry', 'v0.1.0');
const diskRegistry = fs
  .readdirSync(registryDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(registryDir, f), 'utf8')));

// ---- collect every fixture + the mybuxi example.
function jsonFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => path.join(dir, f));
}
const targets = [
  ...jsonFiles(path.join(REPO, 'testFixtures', 'v0.1.0', 'valid')),
  ...jsonFiles(path.join(REPO, 'testFixtures', 'v0.1.0', 'invalid')),
  path.join(REPO, 'examples', 'ch', 'mybuxi-emmental.msd.json'),
];

function shapeCli(doc) {
  const r = core.validateMsd(doc, { schema: diskSchema, registry: diskRegistry });
  return { valid: r.valid, messages: core.formatErrors(r.errors) };
}
function shapeWeb(doc) {
  const r = web.validateFor('0.1.0', doc);
  return { valid: r.valid, messages: web.formatErrors(r.errors) };
}

let failures = 0;
for (const file of targets) {
  const rel = path.relative(REPO, file);
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  try {
    assert.deepStrictEqual(shapeWeb(doc), shapeCli(doc));
    console.log(`identical  ${rel}`);
  } catch (err) {
    failures += 1;
    console.error(`DIVERGED   ${rel}`);
    console.error(`  CLI: ${JSON.stringify(shapeCli(doc))}`);
    console.error(`  web: ${JSON.stringify(shapeWeb(doc))}`);
  }
}

if (failures > 0) {
  console.error(`\nIdentity gate FAILED: ${failures} fixture(s) diverged.`);
  process.exit(1);
}
console.log(`\nIdentity gate PASSED: ${targets.length} fixtures identical (CLI ≡ web).`);
