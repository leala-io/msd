// web-engine-identity gate.
//
// Proves the in-browser feed engine ≡ the CLI/source engine: esbuild's bundling
// must preserve buildFlexFeed EXACTLY, so the feed a user downloads in the browser
// is byte-identical to the CLI feed that the `engine` CI job validates to 0 notices.
//
// Crucially this compares the BUNDLED engine output (post-esbuild), not source to
// source — otherwise it could not catch bundling drift (a stale inline, a dropped
// helper, a loader rewriting the output). A node-target esbuild entry inlines the
// genuine engine path (adapter → pure core/convert.js); we import it and diff its
// generated { files } against the source engine required from disk.
//
// Per-fixture handling:
//   - feed-producing fixtures (mybuxi stops path, full-valid zones path):
//     deep byte-equal the generated { files } (every filename + content) + warnings.
//   - valid-but-unconvertible fixtures (minimal-valid: no provider.country → no
//     agency_timezone): buildFlexFeed throws; the gate asserts BOTH paths throw the
//     identical conversion error message. (No download is produced in the browser.)

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
const ADAPTER = path.join(REPO, 'engine', 'adapters', 'gtfs-flex', 'index.js');

// ---- web path: bundle the adapter (node target) so esbuild genuinely inlines the
// engine (adapter + pure core/convert.js) — the same inlining the browser build does.
const bundledOut = path.join(WEB_DIR, 'dist', 'engine-bundle.mjs');
await esbuild.build({
  stdin: {
    contents: `export { buildFlexFeed } from ${JSON.stringify(ADAPTER)};`,
    resolveDir: REPO,
    loader: 'js',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: bundledOut,
  logLevel: 'silent',
});
const web = await import(pathToFileURL(bundledOut).href);

// ---- CLI/source path: the engine required straight from disk (mirrors engine/cli.js).
const source = require(ADAPTER);

// ---- targets: every valid fixture + the mybuxi example (the feed-relevant inputs).
function jsonFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => path.join(dir, f));
}
const targets = [
  ...jsonFiles(path.join(REPO, 'testFixtures', 'v0.1.0', 'valid')),
  path.join(REPO, 'examples', 'ch', 'mybuxi-emmental.msd.json'),
];

// Run buildFlexFeed; return either { ok:true, result } or { ok:false, error }.
function run(buildFlexFeed, doc) {
  try {
    return { ok: true, result: buildFlexFeed(doc) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

let failures = 0;
let produced = 0;
let unconvertible = 0;
for (const file of targets) {
  const rel = path.relative(REPO, file);
  const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
  const w = run(web.buildFlexFeed, doc);
  const c = run(source.buildFlexFeed, doc);
  try {
    assert.strictEqual(w.ok, c.ok, `convertibility differs (web ok=${w.ok}, source ok=${c.ok})`);
    if (c.ok) {
      // Feed-producing: byte-equal every generated file + warnings.
      assert.deepStrictEqual(w.result.files, c.result.files);
      assert.deepStrictEqual(w.result.warnings, c.result.warnings);
      produced += 1;
      console.log(`byte-equal     ${rel}  (${Object.keys(c.result.files).length} files)`);
    } else {
      // Valid-but-unconvertible: identical conversion error from both engines.
      assert.strictEqual(w.error, c.error);
      unconvertible += 1;
      console.log(`same-error     ${rel}  (unconvertible: ${c.error.split('\n')[0]})`);
    }
  } catch (err) {
    failures += 1;
    console.error(`DIVERGED       ${rel}`);
    console.error(`  ${err.message}`);
  }
}

if (failures > 0) {
  console.error(`\nweb-engine-identity FAILED: ${failures} fixture(s) diverged.`);
  process.exit(1);
}
console.log(
  `\nweb-engine-identity PASSED: ${produced} feed(s) byte-equal, ` +
  `${unconvertible} unconvertible with identical error (bundled engine ≡ source engine).`
);
