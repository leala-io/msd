#!/usr/bin/env node
'use strict';

/**
 * Gate check: read a gtfs-validator report.json and fail (exit 1) if it
 * contains any ERROR-severity notice. WARNING/INFO are printed but do not fail.
 *
 * Usage: node engine/scripts/check-gtfs-report.js <path/to/report.json>
 */

const fs = require('fs');

const reportPath = process.argv[2];
if (!reportPath) {
  console.error('Usage: node engine/scripts/check-gtfs-report.js <report.json>');
  process.exit(2);
}

let report;
try {
  report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
} catch (err) {
  console.error(`Cannot read validator report ${reportPath}: ${err.message}`);
  process.exit(2);
}

const notices = report.notices || [];
const counts = { ERROR: 0, WARNING: 0, INFO: 0 };
for (const n of notices) {
  const sev = n.severity || 'INFO';
  counts[sev] = (counts[sev] || 0) + (n.totalNotices || 0);
}

const version = (report.summary && (report.summary.validatorVersion || report.summary.version)) || 'unknown';
console.log(`gtfs-validator ${version} — ERROR:${counts.ERROR} WARNING:${counts.WARNING} INFO:${counts.INFO}`);
for (const n of notices) {
  console.log(`  [${n.severity}] ${n.code} x${n.totalNotices}`);
}

if (counts.ERROR > 0) {
  console.error(`GATE FAIL: ${counts.ERROR} ERROR notice(s).`);
  process.exit(1);
}
console.log('GATE PASS: no ERROR notices.');
process.exit(0);
