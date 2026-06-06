#!/usr/bin/env node
'use strict';

/**
 * MSD engine CLI.
 *
 *   node engine/cli.js <msd-file> <out-dir> --target gtfs-flex
 *
 * Validates the MSD input (single authoritative path: validator/validate.js),
 * then writes the target feed into <out-dir>. Phase 2a implements
 * --target gtfs-flex; gofs/all are reserved for later phases.
 *
 * Exit 0 = feed written; 1 = usage / validation / conversion error.
 */

const fs = require('fs');
const path = require('path');
const core = require('./core/msd');
const gtfsFlex = require('./adapters/gtfs-flex');

function parseArgs(argv) {
  const positional = [];
  let target = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--target') { target = argv[++i]; }
    else if (argv[i].startsWith('--target=')) { target = argv[i].split('=')[1]; }
    else { positional.push(argv[i]); }
  }
  return { msdFile: positional[0], outDir: positional[1], target };
}

function main() {
  const { msdFile, outDir, target } = parseArgs(process.argv.slice(2));
  if (!msdFile || !outDir || !target) {
    console.error('Usage: node engine/cli.js <msd-file> <out-dir> --target gtfs-flex');
    process.exit(1);
  }
  if (target !== 'gtfs-flex') {
    console.error(`Target '${target}' not available in Phase 2a. Implemented: gtfs-flex (gofs/all reserved).`);
    process.exit(1);
  }

  let msd;
  try {
    msd = core.loadAndValidate(msdFile);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  let result;
  try {
    result = gtfsFlex.buildFlexFeed(msd);
  } catch (err) {
    console.error(`Conversion failed: ${err.message}`);
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const written = [];
  for (const [name, content] of Object.entries(result.files)) {
    fs.writeFileSync(path.join(outDir, name), content);
    written.push(name);
  }

  for (const w of result.warnings) console.error(`WARN: ${w}`);
  console.log(`Wrote GTFS-Flex feed to ${outDir} (${written.length} files): ${written.sort().join(', ')}`);
  process.exit(0);
}

main();
