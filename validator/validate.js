#!/usr/bin/env node
'use strict';

/**
 * MSD reference validator (v0.1.0) — thin CLI wrapper.
 *
 * Reads the root structural schema and all external code-list registry schemas
 * (Convention C2) from disk, then delegates to the pure validation core
 * (validator/core.js) shared with the Track C web validator.
 *
 * Usage:
 *   node validator/validate.js examples/ch/mybuxi-emmental.msd.json
 *
 * Exit code 0 = valid, 1 = invalid (or usage/load error).
 * Each error is printed as "<instancePath>: <message>".
 */

const fs = require('fs');
const path = require('path');
const { validateMsd, formatErrors } = require('./core');

const REPO_ROOT = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(REPO_ROOT, 'schema', 'v0.1.0', 'msd.schema.json');
const REGISTRY_DIR = path.join(REPO_ROOT, 'registry', 'v0.1.0');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadSchemaAndRegistry() {
  // Load every registry code-list schema so the root schema's $refs resolve
  // by $id at validation time (Convention C2).
  const registry = [];
  for (const entry of fs.readdirSync(REGISTRY_DIR)) {
    if (!entry.endsWith('.json')) continue;
    registry.push(readJson(path.join(REGISTRY_DIR, entry)));
  }
  const schema = readJson(SCHEMA_PATH);
  return { schema, registry };
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node validator/validate.js <msd-file.json>');
    process.exit(1);
  }

  let schema;
  let registry;
  try {
    ({ schema, registry } = loadSchemaAndRegistry());
  } catch (err) {
    console.error(`Failed to load/compile schema: ${err.message}`);
    process.exit(1);
  }

  let data;
  try {
    data = readJson(path.resolve(target));
  } catch (err) {
    console.error(`Failed to read/parse ${target}: ${err.message}`);
    process.exit(1);
  }

  let result;
  try {
    result = validateMsd(data, { schema, registry });
  } catch (err) {
    console.error(`Failed to load/compile schema: ${err.message}`);
    process.exit(1);
  }

  if (result.valid) {
    console.log(`PASS  ${target}`);
    process.exit(0);
  }

  console.log(`FAIL  ${target}`);
  for (const line of formatErrors(result.errors)) {
    console.log(`  ${line}`);
  }
  process.exit(1);
}

main();
