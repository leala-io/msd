// esbuild build for the MSD web validator.
//
// Bundles main.js → dist/app.js as a single self-contained ESM file: the shared core
// (validator/core.js), AJV + ajv-formats, the canonical schema/registry JSON, and the
// Leaflet map library (+ its stylesheet, inlined as text and injected at runtime) are
// all inlined. No CDN, no network at validate time, no copy of the schema in web/.
//
// AJV resolves from validator/node_modules (the bare `require('ajv/dist/2020')` lives in
// validator/core.js, so Node/esbuild resolution searches validator/ upward). Run
// `npm ci` in validator/ before building.

import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['main.js'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  outfile: 'dist/app.js',
  minify: true,
  logLevel: 'info',
  // .json uses esbuild's default json loader (inlined). No copy is produced.
  // .css (Leaflet's stylesheet) is inlined as a text string and injected into a
  // <style> at runtime by map.js — keeps dist/app.js a single self-contained file.
  loader: { '.css': 'text' },
});
