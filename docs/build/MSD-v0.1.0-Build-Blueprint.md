# MSD v0.1.0 — Build Blueprint (hand-off to Claude Code)

**Date:** 2026-06-04
**Repo:** `github.com/leala-io/msd`
**Purpose:** Execution-ready specification for the MSD v0.1.0 technical foundation — JSON Schema + reference validator + CI + mybuxi validation. Hand this file to Claude Code working inside the repo.

> **All scope decisions below are LOCKED.** Do not re-open them, do not add beyond the stated scope. The data model is authoritative in the Concept Paper §3 (in the repo); this blueprint enumerates the v0.1.0 subset and adds the two conventions and the build setup. Where field semantics are unclear, defer to Concept Paper §3 — do not invent.

---

## 0. Locked decisions

- JSON Schema **Draft 2020-12**. Validator: **AJV** via the `Ajv2020` export. Formats via `ajv-formats`.
- Schema in **version folders**, separate from the prose spec (GBFS pattern). Adapted: an MSD file is **one** JSON document, so use a single root schema with `$defs` — not one file per endpoint.
- Controlled vocabularies are **external** to the structural schema (Convention C2).
- `null` vs `0` semantics are **explicit** (Convention C1).
- Data model = **Concept Paper §3** (sections 3.1–3.9), minus the frozen enrichments listed in §8.
- The **mybuxi example is the acceptance gate** — validated locally, with no dependency on external feedback.

---

## 0.1 Prerequisites (before running Claude Code)

1. **The repo's Concept Paper must be the current version.** The data model in §1 is derived from the *current* project Concept Paper — **not** the `2026-03-10` version still in the repo. Before this build, the current Concept Paper is committed to the repo manually (see runbook). Claude Code treats the Concept Paper as **read-only upstream source of truth** and never edits it.
2. **Single source of truth.** Where field semantics are unclear, defer to the Concept Paper. Where the Concept Paper is **silent or ambiguous, STOP and ask the human** — do not improvise. Any resolved decision is recorded back into the Concept Paper, never only into the schema.
3. **Guardrails present.** `CLAUDE.md` (repo root) and `.claude/settings.json` are in the repo before the build (durable rules + permissions).

---

## 1. v0.1.0 scope — objects (from Concept Paper §3)

### Root document
| Field | Type | Req. | Notes |
|---|---|---|---|
| `msd_version` | string (semver) | ✓ | e.g. `"0.1.0"` |
| `last_updated` | string (date-time) | ✓ | |
| `ttl` | integer (seconds) | – | |
| `provider` | object | ✓ | §3.2 |
| `services` | array<service> | ✓ | `minItems: 1`, §3.3 |
| `fare_structures` | array<fare_structure> | – | §3.5 |
| `booking_rules` | object | – | §3.6 |
| `settlement` | object | – | §3.7 |
| `routing_hints` | object | – | §3.9 |
| `references` | object | – | §3.8 |

### provider (§3.2)
`provider_id`✓, `name`✓, `description`, `url`(uri), `contact_email`(email), `country`(ISO 3166-1 alpha-2), `languages`(array, BCP-47), `legal_entity`{`name`, `registration_id`, `vat_id`}

### service (§3.3) — items of `services`
`service_id`✓, `service_type`✓(code list), `name`✓, `mode`✓(code list), `operating_hours`{`default`:array<{`days`[],`start`,`end`}>, `exceptions`:array<{`date`,`closed`?|`start`,`end`}>}, `service_area`✓, `vehicles`(array), `accessibility`{`wheelchair_accessible_vehicles`:bool, `audio_announcements`:bool, `booking_assistance_available`:bool}

- **service_area** (✓): `type`✓(`"zones"`), `zones`✓:array<{`zone_id`✓, `name`, `geometry`✓(GeoJSON Polygon/MultiPolygon)}>, `constraints`:array<constraint> (optional, §3.4)
- **vehicles** items: `vehicle_type_id`✓, `name`, `capacity`{`seats`, `wheelchair`}, `propulsion`(code list), `count`(integer)
- **constraint** items (§3.4): `type`✓(code list: `relation_restriction`|`service_mode_restriction`|`exclusive_zone`), `description`, plus type-specific fields (`origin_zone`,`destination_zone`,`rule` | `zone`,`pickup_type`)

### fare_structure (§3.5) — items of `fare_structures`
`fare_id`✓, `service_ids`✓(array<string>), `currency`✓(ISO 4217), `rules`✓:array<{`description`,`conditions`{…},`price`:number}>, `discounts`:array<{`discount_id`✓,`name`,`type`(code list: `percentage`|`free`|`fixed`),`value`:number,`conditions`{`requires_credential`?,`age_min`?,`age_max`?,`applicable_to`?,…}}>, `payment_methods`(array, code list), `vat_rate`(number), `vat_included`(bool)

### booking_rules (§3.6)
`advance_booking`{`minimum_minutes`:int,`maximum_days`:int}, `cancellation`{`free_cancellation_minutes`:int,`late_cancellation_fee`:number}, `booking_channels`(array, code list), `booking_confirmation`(code list), `passenger_identification`(code list)

### settlement (§3.7)
`model`(code list), `settlement_period`(code list), `commission_structure`{`type`(code list),`value`:number,`note`}, `billing_contact`(email), `supported_settlement_protocols`(array, code list)

### routing_hints (§3.9)
`travel_time_factor`(number), `travel_time_source`(code list: `gis_router`|`provider_estimate`), `transfer_penalty_equivalent`(integer), `line_service_preference`{`threshold_minutes`:int,`minimum_advantage_percent`:number,`description`}

### references (§3.8)
`gtfs_feed_url`, `gbfs_feed_url`, `tomp_api_url`, `real_time_endpoint`, `info_url`, `terms_url` — each string(uri) or `null`

---

## 2. Convention C1 — null vs. zero (Issue #19)

> An **omitted** optional field means *"not specified."* A literal `0`, `false`, or empty array `[]` carries its **literal** meaning (*genuinely zero / none / empty*). Where a field is structurally present but its value is genuinely unknown, `null` MAY be used and means *"unknown."* Consumers **MUST NOT** infer `0` or `false` from an absent or `null` field.
>
> *Example:* in `capacity`, `"wheelchair": 0` means the vehicle explicitly has no wheelchair space; an **absent** `wheelchair` key means wheelchair capacity is **unknown** — not zero. Producers SHOULD omit optional fields they cannot fill rather than setting them to `0`.

Reflect C1 in field `description`s where ambiguity is likely (capacity, counts, fees, durations). Do not enforce via schema beyond types; C1 is interpretive guidance for producers and consumers, documented in `CONVENTIONS.md`.

---

## 3. Convention C2 — external code lists (Issue #21)

> All enumerated value sets live in an **external versioned registry**, not inline in the structural schema. Each code list is a standalone JSON Schema file under `registry/v0.1.0/<name>.json` of the form `{ "$schema": "...", "$id": "...", "enum": [ ... ] }`. The structural schema references them via `$ref`. AJV resolves these at validation time. **Adding a permitted value is a registry change — non-breaking, no structural-schema edit.** The structural schema defines only structure, types, required-ness and `$ref`s — **never** inline `enum` lists.

**Code lists to create** (`registry/v0.1.0/`): `service_type`, `mode`, `propulsion`, `constraint_type`, `discount_type`, `payment_method`, `booking_channel`, `booking_confirmation`, `passenger_identification`, `settlement_model`, `settlement_period`, `commission_type`, `travel_time_source`, `settlement_protocol`.

Populate each **minimally**, only from values present in Concept Paper §3 and the mybuxi example (e.g. `service_type` → `["on_demand"]`; `propulsion` → `["electric", …only what appears]`). Do not pre-fill speculative values — new values are deferred registry additions (see Freeze, §8).

---

## 4. Repository structure

```
msd/
├── schema/
│   └── v0.1.0/
│       └── msd.schema.json          # root schema, Draft 2020-12, $defs + $ref to registry
├── registry/
│   └── v0.1.0/
│       ├── service_type.json        # { "$id": "...", "enum": [...] }
│       ├── mode.json
│       ├── propulsion.json
│       ├── constraint_type.json
│       ├── discount_type.json
│       ├── payment_method.json
│       ├── booking_channel.json
│       ├── booking_confirmation.json
│       ├── passenger_identification.json
│       ├── settlement_model.json
│       ├── settlement_period.json
│       ├── commission_type.json
│       ├── travel_time_source.json
│       └── settlement_protocol.json
├── examples/
│   └── ch/
│       └── mybuxi-emmental.msd.json  # exists; must validate against v0.1.0
├── testFixtures/
│   └── v0.1.0/
│       ├── valid/
│       │   ├── minimal-valid.msd.json
│       │   └── full-valid.msd.json
│       ├── invalid/
│       │   ├── missing-required-provider.msd.json
│       │   ├── empty-services.msd.json
│       │   ├── bad-service_type.msd.json
│       │   ├── price-as-string.msd.json
│       │   ├── bad-geometry.msd.json
│       │   └── bad-currency.msd.json
│       └── fixtures.manifest.json    # maps each invalid file → rule it violates
├── validator/
│   ├── package.json
│   └── validate.js
├── CONVENTIONS.md                    # C1 + C2 verbatim
├── .pre-commit-config.yaml
└── .github/workflows/validate.yml
```

> Note: one root schema with `$defs` (provider, service, constraint, vehicle, fare_structure, discount, booking_rules, settlement, routing_hints, references). Per-file object split is a v0.2.0 refactor option, not now.

---

## 5. Reference validator (`validator/`)

- Node project. Dependencies: `ajv` (use the `Ajv2020` export for Draft 2020-12) and `ajv-formats` (date-time, email, uri).
- `validate.js`: load `schema/v0.1.0/msd.schema.json`, register all `registry/v0.1.0/*.json` schemas (so `$ref`s resolve), compile, validate a target file path passed as CLI arg, print each error as `<instancePath>: <message>`, exit non-zero on any failure.
- Usage: `node validator/validate.js examples/ch/mybuxi-emmental.msd.json`

---

## 6. CI & pre-commit

- `.pre-commit-config.yaml`: `check-jsonschema` hook validating `examples/**` and `testFixtures/v0.1.0/valid/**` against `schema/v0.1.0/msd.schema.json`.
- `.github/workflows/validate.yml` (on push + PR):
  1. meta-validate `msd.schema.json` against the Draft 2020-12 meta-schema,
  2. run `validate.js` over every `examples/**` and `testFixtures/v0.1.0/valid/**` — all must PASS,
  3. run `validate.js` over every `testFixtures/v0.1.0/invalid/**` — all must FAIL (job passes only if each invalid file is rejected).

---

## 7. Test fixtures

- `valid/minimal-valid.msd.json`: only required fields (msd_version, last_updated, provider{provider_id,name}, one service with service_id/service_type/name/mode/service_area+one zone).
- `valid/full-valid.msd.json`: exercises every optional object (fares, discounts incl. `requires_credential: ch-halbtax`, booking_rules, settlement, routing_hints, constraints, references).
- `invalid/*`: one violation each; `fixtures.manifest.json` records `{file, violates}` so failures are self-documenting and double as regression tests.

---

## 8. Freeze — explicit non-goals (do NOT build)

- **Frozen schema content** (v0.2.0+): #4 `semi_flexible`/`fill_and_go` service types, #5 `organisation_type`/`fleet_ownership`, #6 `dynamic_pricing`, #10 `routing_hints.network_dependency`, #18 aggregate-collapse, #20 strict-completeness profile, plus `external_pois` and `virtual_stops`.
- **No web UI.**
- **No GOFS / GTFS-Flex converter** (separate, July-optional).
- **Do not expand code lists** beyond §3 + mybuxi values.
- **Only permitted expansion:** a minimal field addition *iff* mybuxi validation fails because the §3 model genuinely cannot express a real mybuxi attribute — add only the minimal field and document it. Otherwise, fix the example, not the schema.

---

## 9. Build sequence (for Claude Code)

1. Scaffold folders (§4).
2. Write `registry/v0.1.0/*.json` code lists (minimal, §3).
3. Write `schema/v0.1.0/msd.schema.json` — Draft 2020-12; `$defs` per object; `$ref` to registry for all enums; required set per §1; apply C1 in descriptions; **no inline enums**.
4. Write `CONVENTIONS.md` (C1 + C2 verbatim); link it from README.
5. Build `validator/` (AJV `Ajv2020` CLI, §5).
6. Write test fixtures + `fixtures.manifest.json` (§7).
7. Wire pre-commit + GitHub Actions (§6).
8. Run validator on `examples/ch/mybuxi-emmental.msd.json` → must PASS. On failure: fix the example if malformed; only if §3 genuinely cannot express a real attribute, add the minimal field and document (§8). Never add frozen fields.
9. Verify acceptance criteria (§10); tag `v0.1.0`.

---

## 10. Acceptance criteria

- [ ] `msd.schema.json` validates against the Draft 2020-12 meta-schema.
- [ ] All registry `$ref`s resolve; the structural schema contains **no inline `enum`**.
- [ ] `examples/ch/mybuxi-emmental.msd.json` validates **PASS**.
- [ ] Every `valid/*` PASSES; every `invalid/*` FAILS with a clear, path-located error.
- [ ] CI green on push; pre-commit blocks invalid commits.
- [ ] `CONVENTIONS.md` documents C1 (null vs zero) and C2 (external registry).
- [ ] No frozen field, no web UI, no converter present.
