# MSD: Mobility Service Description

**A declarative open standard for describing mobility services**

[![Try it: hosted validator](https://img.shields.io/badge/Try%20it-hosted%20validator-brightgreen.svg)](https://leala-io.github.io/msd/)
[![CI](https://github.com/leala-io/msd/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/leala-io/msd/actions/workflows/validate.yml)
[![Spec License: CC BY-SA 4.0](https://img.shields.io/badge/Spec-CC%20BY--SA%204.0-blue.svg)](LICENSE-SPEC)
[![Code License: AGPL-3.0](https://img.shields.io/badge/Code-AGPL--3.0-blue.svg)](LICENSE-CODE)
[![Status: v0.1.1-draft](https://img.shields.io/badge/Status-v0.1.1--draft-orange.svg)](CHANGELOG.md)

---

MSD enables any mobility service provider to describe their complete offering — service areas, vehicle types, fare structures, booking rules, and settlement parameters — as a single, machine-readable JSON file.

**No API required. No bilateral integration. Publish a file, become discoverable.**

## The Problem

Integrating a small mobility provider (community bus, bike-sharing, on-demand shuttle) into a booking platform takes months and costs tens of thousands. Large operators dominate digital platforms; smaller services remain invisible.

Existing standards cover parts of the landscape — GTFS for timetables, GBFS for shared vehicles, TOMP-API for booking — but none allow a provider to describe their full service in a single, self-contained file that any engine can interpret.

## The Solution

MSD is a static JSON file that contains everything needed to discover, understand, price, and initiate booking of a mobility service. Think of it as **the GBFS for on-demand and multimodal services**.

```json
{
  "msd_version": "0.1.0",
  "provider": {
    "provider_id": "ch-mybuxi-emmental",
    "name": "mybuxi Emmental"
  },
  "services": [{ "service_type": "on_demand", "mode": "bus" }],
  "fare_structures": [{ "currency": "CHF", "rules": [{ "price": 5.00 }] }],
  "booking_rules": { "advance_booking": { "minimum_minutes": 30 } }
}
```

## Validate

Try it in your browser — paste an MSD file into the **[hosted validator](https://leala-io.github.io/msd/)**. It runs entirely client-side; your file is never uploaded.

Prefer the command line? Validate locally against the reference implementation:

```bash
node validator/validate.js examples/ch/mybuxi-emmental.msd.json
```

The hosted and CLI validators share one validation core, so they always agree. Both check **schema conformance** for the selected MSD version — not business or semantic validity.

## Documentation

| Document | Description |
|----------|-------------|
| [Concept Paper](spec/MSD-concept-paper.md) | Full technical vision, data model, and use cases |
| [Governance Framework](spec/MSD-governance.md) | How MSD is governed: commitments, process, licensing |
| [Conventions](CONVENTIONS.md) | C1 (null vs zero) and C2 (external code-list registry) |
| [JSON Schema](schema/v0.1.0/msd.schema.json) | The v0.1.0 schema (JSON Schema Draft 2020-12) that files are validated against |
| [Reference validator](validator/) | AJV-based CLI; the same validation core as the hosted validator |
| [Examples](examples/) | Validated MSD files (e.g. `examples/ch/mybuxi-emmental.msd.json`) |
| [MSD ↔ NeTEx comparison](docs/comparison-netex.md) | How MSD's provider layer relates to the NeTEx system layer |
| [Coverage & gap matrix](docs/coverage-gap-matrix.md) | What v0.1.0 expresses vs. recorded v0.2.0 candidates |
| [MSD → GTFS-Flex engine](engine/adapters/gtfs-flex/) | Generates a GTFS-Flex discovery feed from an MSD file |

## Status

MSD is in its **founding phase** (v0.1.0-draft) — the specification is published as a Request for Comments. The foundation is in place and working: the v0.1.0 JSON Schema, a reference validator (CLI + [hosted](https://leala-io.github.io/msd/)), and validated examples. The producer-to-consumer path is exercised end-to-end — a validated [mybuxi example](examples/ch/mybuxi-emmental.msd.json) is read by an [MSD → GTFS-Flex engine](engine/adapters/gtfs-flex/) that emits a standard discovery feed.

We are actively seeking:

- **Technical reviewers** — Does the data model cover your use case?
- **Pilot providers** — Describe your service as an MSD file
- **Engine developers** — Build tools that consume MSD files
- **Standards experts** — Help align with GTFS, GBFS, NeTEx, TOMP-API

## Contributing

All contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get involved.

Contributions to the specification are licensed under [CC BY-SA 4.0](LICENSE-SPEC).  
Contributions to code are licensed under [AGPL-3.0](LICENSE-CODE).  
All contributions require a [Developer Certificate of Origin](DCO) sign-off.

## License

- **Specification** (text, schemas, examples): [CC BY-SA 4.0](LICENSE-SPEC)
- **Code** (validators, converters, tools): [AGPL-3.0](LICENSE-CODE)

## Contact

MSD is initiated by [Leap and Land](https://leapandland.ch) and governed as an open community project under [LeaLa](https://leala.io).

Maintainer: Thomas Teichmüller — thomas@leala.io
