# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/) (see `VERSIONING.md`).

## [Unreleased]

### Fixed
- examples/ch/mybuxi-emmental: source-verified corrections — operator legal entity is Verein mybuxi Emmental (platform provider documented in comments); booking channels corrected to app + email; mybuxi-Card added as discount-card product with matching eligibility credential; provider identifier corrected to a provider-scoped id (no SBOID/GO number — service is non-concessioned, per Appendix D.1 fallback guidance); stop-list source precision (335 stops, 2026-02-01 list); schema notes updated to current extensions/out-of-scope documentation.

## [0.1.1] - 2026-06-08

### Added
- GTFS-Flex adapter (`engine/`): generates a GTFS-Flex feed from an MSD file. The mybuxi example round-trips clean (0 notices) against gtfs-validator v8.0.1. The adapter reads only; it does not modify the schema, registry, or examples.
- Hosted browser validator (`web/`) at <https://leala-io.github.io/msd/>: client-only paste-and-check, nothing is uploaded. It runs the same AJV validation core as the CLI, guaranteed by a `web-identity` CI gate that checks both produce identical results across all fixtures.
- `CONFORMANCE.md`: conformance definitions (RFC 2119) for MSD files, producers, and consumers.
- `VERSIONING.md`: versioning and compatibility policy (Semantic Versioning).
- `examples/ug/kampala-taxi-sacco.msd.json`: an informal-transport example (a hypothetical Kampala minibus-taxi SACCO), validated against the v0.1.0 schema.
- `docs/coverage-gap-matrix.md`: a coverage and gap analysis mapping informal-transport features to MSD fields (expressible vs. needs-extension).
- `docs/comparison-netex.md`: a qualitative side-by-side of the same service described in MSD and in CEN-NeTEx.

### Changed
- Stabilized the `$id` URLs of the schema and registry to a dereferenceable GitHub Pages base. Resolution semantics are unchanged — the validator still resolves the registry locally by `$id`, with no network access at validation time.

### Fixed
- Hardened the CI download of gtfs-validator (`curl -fL` + retry + JAR integrity check) so a corrupt or partial download fails fast with a clear message instead of a misleading failure.

## [0.1.0] - 2026-06-04

### Added
- Initial MSD JSON Schema (`schema/v0.1.0/msd.schema.json`, JSON Schema Draft 2020-12): one root schema with `$defs`; a strict core (types, required fields, GeoJSON) and an open, extensible body (no `additionalProperties: false`).
- External, versioned code-list registry (`registry/v0.1.0/*.json`), referenced from the schema by `$ref` and identified by `$id` (convention C2).
- Reference validator (`validator/`, AJV `Ajv2020` + ajv-formats) with a CLI, registering the registry by `$id`.
- `CONVENTIONS.md`: conventions C1 (`null` / `0` / absent are distinct) and C2 (external code-list registry).
- Test fixtures (`testFixtures/v0.1.0/`): 2 valid + 6 invalid files plus a manifest mapping each invalid file to the rule it violates.
- `examples/ch/mybuxi-emmental.msd.json`: a real Swiss DRT example (mybuxi Emmental) that validates against the schema.
- Continuous integration and pre-commit running the same validation gate.
- `docs/v0.2.0-candidates.md`: documented candidate enrichments deferred to a later version.
