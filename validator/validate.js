#!/usr/bin/env node
'use strict';

/**
 * MSD reference validator (v0.1.0).
 *
 * Loads the root structural schema and all external code-list registry schemas
 * (Convention C2), compiles with AJV Draft 2020-12, and validates a target MSD
 * file passed as a CLI argument.
 *
 * Usage:
 *   node validator/validate.js examples/ch/mybuxi-emmental.msd.json
 *
 * Exit code 0 = valid, 1 = invalid (or usage/load error).
 * Each error is printed as "<instancePath>: <message>".
 */

const fs = require('fs');
const path = require('path');
const Ajv2020 = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const REPO_ROOT = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(REPO_ROOT, 'schema', 'v0.1.0', 'msd.schema.json');
const REGISTRY_DIR = path.join(REPO_ROOT, 'registry', 'v0.1.0');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function buildValidator() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  // Register every registry code-list schema by its $id so the root schema's
  // $refs resolve at validation time (Convention C2).
  for (const entry of fs.readdirSync(REGISTRY_DIR)) {
    if (!entry.endsWith('.json')) continue;
    ajv.addSchema(readJson(path.join(REGISTRY_DIR, entry)));
  }

  const rootSchema = readJson(SCHEMA_PATH);
  return ajv.compile(rootSchema);
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: node validator/validate.js <msd-file.json>');
    process.exit(1);
  }

  let validate;
  try {
    validate = buildValidator();
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

  const ok = validate(data);
  if (ok) {
    console.log(`PASS  ${target}`);
    process.exit(0);
  }

  console.log(`FAIL  ${target}`);
  for (const e of validate.errors) {
    const where = e.instancePath || '(root)';
    console.log(`  ${where}: ${e.message}`);
  }
  process.exit(1);
}

main();
