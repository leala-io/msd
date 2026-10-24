# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/) (see `VERSIONING.md`).

## [Unreleased]

## [0.1.2] - 2026-10-24

No structural or validation change to the schema or the registry: files are still validated against `schema/v0.1.0`. Three description strings in the schema now point to the concept paper §3.3 (see *Changed*). This release publishes the documentation, examples and tooling that accumulated since 0.1.1.

### Added
- `examples/ug/kampala-boda-stage.msd.json`: a second informal-transport example — a hypothetical Kampala motorcycle-taxi (boda-boda) stage, contrasting with the minibus-taxi SACCO — validated against the v0.1.0 schema. Values are entered only where a cited source states them. `docs/coverage-gap-matrix.md` gains a *Second organisation type* section recording which findings generalise across the two types.
- Producer-flow reference documentation (schematic, non-normative): docs/design/producer-flow.md
- Web validator output preview (L2): after a PASS, a collapsed panel offers a client-side service-area map (Leaflet, no basemap by default, opt-in tiles; constraints not drawn — declared area, not net coverage) and an in-browser GTFS-Flex feed download (same pure engine core as the CLI, JSZip-bundled; valid-but-unconvertible files get a friendly message). Engine core split into a pure conversion module (engine/core/convert.js); new web-engine-identity CI gate proves the bundled engine byte-equal to the CLI engine.
- `docs/comparison-gofs.md`: a field-level comparison of MSD and GOFS; the resulting cross-walk candidates are recorded in `docs/v0.2.0-candidates.md` §E.
- `docs/coverage-gap-matrix.md`: a standing requirement-to-coverage view, page-precise corroboration of each finding from further sources, and a passenger/goods scope boundary; `docs/v0.2.0-candidates.md` gains §F (consolidated checkpoints, no new standalone candidate).
- Zenodo concept DOI (10.5281/zenodo.20598626) in the README badge and in `CITATION.cff`; it always resolves to the latest version.

### Changed
- Concept paper §3.3 documents the service-area `stops` model. The three schema description strings and the note in the mybuxi example that pointed to the former Appendix D.1 now point to §3.3 (description text only).
- Concept paper, governance document, NeTEx comparison, README and Code of Conduct reworded to be tool-neutral; use cases and roadmap generalised; a passenger/goods scope boundary added; project attribution is LeaLa.
- `VERSIONING.md` now states what practice already was: PATCH releases reuse the schema and registry folders of their MAJOR.MINOR line.
- CI moved from Node 20 (end of life) to Node 24 in all workflows; the GitHub Pages actions are pinned to their Node 24 majors. No runtime change.
- Kampala SACCO example (`examples/ug/kampala-taxi-sacco.msd.json`, `docs/coverage-gap-matrix.md`, `docs/v0.2.0-candidates.md` §D, `docs/design/producer-flow.md`): hail-and-ride boarding and per-passenger fare bargaining removed, because neither cited source states them; matrix row 3 and candidate D.4 are kept as *withdrawn* so that numbering stays stable. The vehicle label "matatu" (Kenyan usage) is replaced by "minibus taxi" (in Kampala: "taxi").

### Removed
- Concept paper: the former Appendix D (a national profile) and the remaining references to it.
- `docs/build/MSD-v0.1.0-Build-Blueprint.md`: an internal process document, not part of the standard.

### Fixed
- Concept paper: GOFS v1.0 does carry fares, advance-booking rules and operator metadata; the paper had stated otherwise. The differentiators are restated as verified (settlement, cancellation, payment and tax terms, legal entity, stop-based service areas, cross-standard references, single-file publication). No data-model change.
- Concept paper Appendix A: two overstated ratings corrected (service types, fare description), and a note scopes the table and marks its ratings as qualitative. The governance cell now states the process and maintainer count.
- Concept paper Appendix C.5: schema v0.1.0 declares `conditions` as an unconstrained object, so the mapping of its sub-keys to Transmodel is a convention, not a guarantee; a note now says so.
- `docs/coverage-gap-matrix.md`: `municipalities` is an open-schema extension in the reference example, not a declared schema field; the service-area row is reclassified as partially expressible.
- Citation pass for the Kampala examples (`docs/coverage-gap-matrix.md`, `examples/ug/`): source titles corrected — ITF (2025), *Incorporating Informal Transport in Mobility Planning*, Roundtable Report No. 199, and GIZ (2026), *National Roadmap for Paratransit Reform* (both were previously cited under wrong titles); page references checked against the PDFs (boda-boda example: GIZ p. 55 → p. 54 for the stage, destination, fleet, registration and peak-fare statements, p. 59 → p. 58 for electric motorcycles); new *Value provenance — SACCO example* section classifies each value of the SACCO example as stated by a source, derived, or illustrative. Two attributions are not supported by either source (hail-and-ride boarding; per-passenger fare bargaining) and are marked as such.
- examples/ch/mybuxi-emmental: source-verified corrections — operator legal entity is Verein mybuxi Emmental (platform provider documented in comments); booking channels corrected to app + email; mybuxi-Card added as discount-card product with matching eligibility credential; provider identifier corrected to a provider-scoped id (no SBOID/GO number — service is non-concessioned); stop-list source precision (335 stops, 2026-02-01 list); schema notes updated to current extensions/out-of-scope documentation.

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
