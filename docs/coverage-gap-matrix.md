# MSD coverage / gap matrix — Kampala minibus-taxi (matatu) SACCO

**Status:** empirical core of the ATRC track (Track E). **Schema:** frozen v0.1.0 (no change).
**Example:** [`examples/ug/kampala-taxi-sacco.msd.json`](../examples/ug/kampala-taxi-sacco.msd.json) — **validates PASS** against
`schema/v0.1.0/msd.schema.json` with the registry resolved (AJV `Ajv2020` + `ajv-formats`).

This matrix takes the operational features documented for informal / paratransit minibus services and maps each to the
MSD v0.1.0 field that carries it, then classifies the fit as **expressible**, **partially expressible**,
**needs-extension**, or **registry growth (C2)** (a value the versioned registry can add without a schema change).
The example is hypothetical: a generic ~30-vehicle, single-corridor minibus-taxi SACCO, not a real
named operator. No live data was fetched and no external GTFS feed was used as a value source. Where a feature is
**needs-extension**, the limitation is the finding — the schema is not patched. Gaps are recorded in
[`v0.2.0-candidates.md`](v0.2.0-candidates.md).

## Sources (source-level; exact citations to be tightened)

- **ITF-199** — ITF/OECD Roundtable Report 199, *Informal Public Transport in the Developing World* (operational
  characteristics of minibus/paratransit: fill-and-go departure, hail-and-ride, cash fares, SACCO/association
  governance, safety profile).
- **GIZ** — GIZ Sustainable Urban Transport guidance on minibus / paratransit reform (governance formalisation, safety
  and service-quality standards as reform targets).
- **Oviedo / Bogotá** — reform-pattern studies of paratransit integration (e.g. D. Oviedo et al.), used for the
  governance and pricing-variability patterns.

Attribution is to the general informal-transport literature and the general standards landscape (JSON Schema, SemVer).
Values in the example are realistic-but-illustrative, not measured.

## Matrix

| # | Documented feature (source) | MSD v0.1.0 field | Fit | Notes |
|---|---|---|---|---|
| 1 | Operator metadata (name, country, languages) | `provider.name`, `provider.country`, `provider.languages` | **expressible** | Core §3.2 fields carry directly. |
| 2 | Fixed-corridor service with named stages (ITF-199) | `service.service_area.type:"stops"` + `stops[]` | **partially expressible** | Stages carry as named stops; **route order** and the linear corridor geometry are not modelled. |
| 3 | Hail-and-ride / board-anywhere along the line (ITF-199) | — | **needs-extension** | The stops model assumes discrete boarding points; continuous on-line boarding is not representable. |
| 4 | Fill-and-go departure (depart-when-full), no timetable, no booking (ITF-199) | `service.service_type` (registry: `on_demand` only); `booking_rules` | **needs-extension** | No registry value for fill-and-go; `service_type` set to `on_demand` as a forced placeholder; true model carried in `service.operational_model` (pass-through). `booking_rules` assume advance booking. |
| 5 | SACCO / owner-operator cooperative governance (ITF-199, GIZ) | `provider` / `provider.legal_entity` | **needs-extension** | No `organisation_type`; carried in `provider.organisation_type` (pass-through). |
| 6 | 14-seat minibus fleet, fleet size | `service.vehicles[]` (`vehicle_type_id`, `capacity.seats`, `count`) | **expressible** | Nominal seating and count carry; practical overloading is not represented (only nominal seats). |
| 7 | Minibus-taxi (matatu) vehicle class | `service.mode` (registry: `bus` only) | **partially expressible** | Modelled as `bus`; the minibus-taxi distinction is not separately expressible (minor). |
| 8 | Diesel propulsion | `vehicle.propulsion` (registry: `electric` only) | **registry growth (C2)** | Adding a `diesel` value to the `propulsion` registry is routine non-breaking registry growth (Convention C2), not a structural schema extension. The optional field is omitted in the example; no value is invented. |
| 9 | Daily operating window | `service.operating_hours.default[]` | **expressible** | Day/start/end carry. Demand-driven headways are not timetabled, hence not represented. |
| 10 | Flat cash fare, distance-banded (short hop / full corridor) (ITF-199) | `fare_structure.rules[].price` + `conditions` | **partially expressible** | Representative fares carry as fixed `price`; banding via freeform `conditions`, without a formal stage/band model. |
| 11 | Dynamic / negotiated fares (peak, weather, demand, bargaining) (ITF-199, Oviedo) | `fare_rule.price` (single fixed number) | **needs-extension** | Variability carried in `fare_structure.dynamic_pricing` (pass-through); `price` cannot vary by time/weather/demand or be negotiated. |
| 12 | Cash payment to conductor | `fare_structure.payment_methods` (`cash_in_vehicle`) | **expressible** | Registry value `cash_in_vehicle` fits. |
| 13 | SACCO revenue model (driver daily target/fee, association dues) (ITF-199) | `settlement` (§3.7, MaaS/platform-oriented) | **needs-extension** | The §3.7 settlement object targets platform settlement; an informal cash/daily-target model has no fitting representation. `settlement.model` omitted. |
| 14 | Safety profile (vetting, seatbelts, overloading, incident reporting) (ITF-199, GIZ) | — | **needs-extension** | Not in §3; carried in `service.safety` (pass-through, same shape as the mybuxi example). Already recorded as candidate A.5. |
| 15 | Accessibility | `service.accessibility` | **expressible** | Boolean flags carry (all false here). |

## Summary

- **Expressible:** operator metadata, fleet (nominal), operating window, cash payment, accessibility.
- **Partially expressible:** corridor/stage structure (no route order), vehicle class (bus only), distance-banded fares
  (no formal band model).
- **Needs-extension (the finding):** **fill-and-go / hail-and-ride / no-booking** departure model, **organisation_type**
  (SACCO governance), **dynamic / negotiated pricing**, **safety profile**, and informal **settlement** model.
- **Registry growth (C2, non-breaking):** **diesel propulsion** — adding a value to the `propulsion` registry is routine
  additive registry growth, not a structural schema extension.

These needs-extension items are recorded in [`v0.2.0-candidates.md`](v0.2.0-candidates.md) §D. They are **candidates for a
future Concept Paper revision and v0.2.0 schema**, not defects to patch in v0.1.0.

## Related issues

The needs-extension findings relate to the open coverage issues **#4, #5, #6, #14** (informal-transport / international
coverage). Exact issue-to-gap mapping to be tightened.
