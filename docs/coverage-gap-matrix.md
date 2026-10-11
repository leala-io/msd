# MSD coverage / gap matrix — Kampala minibus-taxi (matatu) SACCO

**Status:** empirical core of the ATRC track (Track E). **Schema:** frozen v0.1.0 (no change).
**Example:** [`examples/ug/kampala-taxi-sacco.msd.json`](../examples/ug/kampala-taxi-sacco.msd.json) — **validates PASS** against
`schema/v0.1.0/msd.schema.json` with the registry resolved (AJV `Ajv2020` + `ajv-formats`).
**Second organisation type:** [`examples/ug/kampala-boda-stage.msd.json`](../examples/ug/kampala-boda-stage.msd.json) — a hypothetical motorcycle-taxi (boda-boda) stage, used as a generalisation test; see *Second organisation type* below.

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

Cross-corpus corroboration (SSATP/World Bank, WRI/IDB-LATAM, ITF 2022, Grafigéo, the SSA accessibility cluster, NCHRP,
TCQSM, MLIT, and the FTA MOD Sandbox) is recorded per finding in *Corroborating sources per finding* below —
page-precise where the underlying analysis pins it, paraphrase-only for the CC-IGO-licensed WRI/IDB monograph.

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

## Second organisation type — boda-boda stage (generalisation test)

**Example:** [`examples/ug/kampala-boda-stage.msd.json`](../examples/ug/kampala-boda-stage.msd.json) — **validates PASS**
against the frozen v0.1.0 schema. A hypothetical stage of motorcycle-taxi riders in Kampala, chosen to contrast with the
corridor SACCO above. **Stricter discipline than the SACCO example:** a value is entered only where a cited source
states it; where the sources are silent (fare amounts, passengers per motorcycle, operating hours, payment, safety,
accessibility, stage location) the field is omitted or `null`. Sources: GIZ / Changing Transport (2026), *National
Roadmap for Paratransit Reform*, Uganda section, p. 55; ITF (2025), *Incorporating Informal Transport in Mobility
Planning*, Roundtable Report 199, p. 10 (page numbers from text extraction, to be verified against the PDFs).

The question is whether the findings above hold for a second, contrasting organisation type or are SACCO-specific.

| SACCO finding (above) | Boda-boda stage | Result |
|---|---|---|
| Fill-and-go departure, no booking (row 4) | Hired on demand at the stage (GIZ p. 55); no fill-to-capacity departure rule stated | **does not recur** — SACCO-specific |
| Hail-and-ride along a corridor (row 3) | No corridor; riders serve any destination from a stage, with no perimeter restriction (GIZ p. 55) | **does not recur** in this form — replaced by a different spatial gap (row below) |
| Organisation type (row 5) | Stage-based rider collective; SACCOs used for financial support; target system; national rider union present (GIZ p. 55) | **holds** — with a different value (rider collective vs owner-operator cooperative) |
| Dynamic pricing (row 11) | "Can be expensive during evening peak hours" (GIZ p. 55); no amounts stated | **holds**, weaker evidence; no fare structure declared because `fare_rule.price` is required |
| Informal settlement (row 13) | Target system: riders remit to vehicle owners (GIZ p. 55) | **holds** |
| Safety profile (row 14) | Not stated in the cited sources | **not tested** — nothing declared |
| Minibus as `bus` (row 7, partially expressible) | A motorcycle must be declared as `bus` | **sharpens** — see first new row |

| New finding (boda-boda stage) | MSD v0.1.0 field | Fit | Notes |
|---|---|---|---|
| Motorcycle taxi as mode | `service.mode` (required; registry: `bus` only) | **needs value (C2), forced false meanwhile** | `mode` is required, so it cannot be omitted as `propulsion` was for diesel. A schema-valid file must declare `bus`. Verified both ways: `motorcycle_taxi` and an absent `mode` each fail validation. Fix class is additive registry growth (C2), but until then the file states a falsehood in a required field. |
| Stage-anchored service with unrestricted destinations | `service_area` (`stops` / `zones`) | **needs-extension** | One stop states the origin, not the open destination set; a zone would assert a boundary the source denies (GIZ p. 55). |
| Registration / licence status | — | **needs-extension** (existing licence-status candidate) | About half of Kampala's boda-bodas are registered (GIZ p. 55); motorcycle taxis sit in a regulatory grey area (ITF-199 p. 10). The SACCO example did not surface this; the boda-boda case does. No new candidate. |

**Reading.** Three of the SACCO findings generalise (organisation type, pricing variability, informal settlement), two
do not (fill-and-go, corridor hail-and-ride — they are properties of the minibus-taxi form, not of informal transport as
such), and the second type adds one sharper limitation: a required field that cannot be filled truthfully. The extension
agenda is therefore partly type-specific; it is not one list that fits all informal services. All findings remain gated
candidates; the schema is not changed.

## Requirement-class → MSD coverage (standing view)

A standing view of how the recurring service-requirement classes documented across the rural / informal-transport
corpus map onto MSD v0.1.0 coverage, independent of any single example. Drawn from the eight rural-mobility barriers in
Milne et al. 2026 (Fig. 5, p. 55), cross-checked against the NCHRP rural-checklist mapping, and framed by the ITF (2022)
finding that no standard or framework yet exists for rural service-data formats (p. 40) and its recommendation to set
such standards and support small operators with machine-readable data (p. 45).

| Requirement class | Representative source | MSD v0.1.0 | Character |
|---|---|---|---|
| Scheduling / operating times | Milne B01; ITF-199 | `operating_hours` | expressible |
| Routes & stops / service area | Milne B02 | `service_area` (`stops` — normative; `municipalities` is an example-file extension, **not present in schema v0.1.0**) | partially — stops expressible, municipality-based areas not normative |
| Connecting-service visibility | Milne B03 | `service_area` + `references` | partially — gap made visible, not closed |
| Service information / discoverability | Milne B06 | the MSD file itself (upstream substrate) | core addressee — but `declare ≠ last-mile UX` |
| Vehicle suitability / accessibility | Milne B07; SSA / TCQSM | `vehicles[].capacity` | partially — low-floor / boarding flag gated |
| Bike carriage | Milne B08 | — | gated coverage checkpoint |
| Unsafe active travel / road infrastructure | Milne B04 | — | out of scope — infrastructure, not a service attribute |
| Standard / framework for service data | ITF 2022, pp. 40, 45 | MSD as the declarative layer | the gap MSD addresses (`declare`) |

Reading: the description layer addresses the information / discoverability and service-shape classes directly, makes
connection gaps visible, and is explicitly *not* the solution to road-infrastructure or last-mile-UX classes.
`declare ≠ compute / enforce / regulate / measure` throughout.

## Corroborating sources per finding

The needs-extension findings above are corroborated across the wider informal- / paratransit-transport corpus. This
records the cross-corpus evidence per finding (source-level, page-precise where the underlying analysis pins it); it
adds **no new candidate and changes no status** — every finding remains a gated v0.2.0 candidate in
[`v0.2.0-candidates.md`](v0.2.0-candidates.md) §D / §F. Citations route through tier-1 primary sources (Kumar et al.
2021 SSATP; Tun et al. 2020 WRI) rather than secondary summaries. The WRI/IDB monograph (Tun et al. 2020) is
CC-IGO BY-NC-ND 3.0 IGO — paraphrase and page-cite only, no figure/table reproduction.

| Finding | Corroborating sources (page-precise where pinned) |
|---|---|
| Fill-and-go / no-booking departure | ITF-199; GIZ (fill-and-go as the standard, not exceptional, mode); SSATP/Kumar 2021 (p. 105); WRI/IDB/Tun 2020 (unscheduled departures, "war of the penny"; pp. 14, 38, 41) |
| Hail-and-ride / board-anywhere | ITF-199; Grafigéo (*garages de clandos* line organisation, ch. 2) |
| Organisation type (SACCO / cooperative / route-owner) | GIZ (SACCOs, GIEs, TOCs); SSATP/Kumar 2021 (unions/associations, EIGs; pp. 38 f., 90 f., 106 f.) incl. Cars-Rapides Dakar (Kumar & Diou 2010, EIG + ticketing); Grafigéo (rickshaw syndicates, *courtiers de fret*; ch. 2/5/6); Oviedo/Bogotá (route owners, exclusive territories) |
| Dynamic / negotiated pricing | ITF-199; GIZ ("ratchet effect"); SSATP/Kumar 2021 (p. 62); Oviedo/Bogotá; Grafigéo (broker-mediated *boutres* fares, ch. 6 — weak) |
| Informal settlement (daily target/fee, dues) | ITF-199; GIZ (daily-target model); SSATP/Kumar 2021 (pp. 62 f.) |
| Safety profile | ITF-199; GIZ (safety as a primary reform target); SSATP/Kumar 2021 (pp. 62 f.) |

Two further dimensions appear in the corpus but are **not** opened as new rows here (consistent with the freeze): a
**semiformal / licence-status** signal (Grafigéo ch. 2/4/5 — *entre-deux*, unlicensed *clandos*, VTC *flou juridique*;
SSATP/Kumar 2021 p. 27), which the hypothetical *licensed* SACCO example does not surface, and **multi-purpose
(passenger + freight)** use (SSATP/Kumar 2021 p. 26), a long-term scope item — see the goods scope-boundary note below.

## Cross-corpus coverage evidence (measurement & discovery layers)

Two cross-corpus observations corroborate *why* the description layer is the missing piece, without adding coverage
gaps to the matrix:

- **Measurement layer (SSA accessibility cluster).** Objective accessibility computed with standard routing engines
  (e.g. OpenRouteService / OSM) underestimates user-reported travel time by 50–133 % across activity types in informal
  SSA contexts (Dumedah et al. 2024), because such engines omit access, waiting and egress time — three components a
  service description can supply (`declare ≠ compute`: MSD feeds an engine, it does not route). A 2025 systematic
  review of 48 African accessibility studies confirms operational data for unscheduled, route-less informal services
  are largely non-existent or uncapturable (Asuah & Acheampong 2025); Kampala is among the GTFS/DT4A-mapped cities
  where stops and routes exist but service depth does not — the direct bridge to the example above. This is a scope
  demarcation, not a schema candidate.
- **Discovery layer (FTA MOD Sandbox — VTrans 0150 / TriMet 0170).** Two independent US federal evaluations document
  the same boundary: GTFS-Flex + OpenTripPlanner provide discovery (a flexible service can be *shown*) but not
  transaction (it cannot be *booked* through the planner) — the transactional service description stays external. This
  is a Category-A confirmation of the declare (MSD) → discover (GTFS-Flex export) → transact (external) positioning,
  not a coverage gap; recorded here as cross-corpus context (US pillar).

## Scope boundary — goods / freight (not a coverage gap)

**Goods / freight carriage** — *out of scope (deliberate boundary), not a coverage gap.* Conceptually anchored in the
rural-MaaS service class (people-and-goods); absent as a lived data service across data models, pilots, and informal
practice. Re-entry path documented in the candidate pool ([`v0.2.0-candidates.md`](v0.2.0-candidates.md) §F); gated.
Sources: Eckhardt 2018/2020; EU MaaS-Alliance 2017; Milne et al. 2026; MLIT Guidelines; ITF (2022) (regulatory-status
axis); ITF *Mix and MaaS* No. 113 (goods distribution framed outside MaaS data architecture); ITF urban-freight
cluster No. 131/109/195 (freight = separate domain with its own data stack); EN 17860 Part 6 / IEC 63281-1
(mixed-purpose handled at the vehicle-standard level).

## Related issues

The needs-extension findings are tracked as **planned coverage candidates** in
[`v0.2.0-candidates.md`](v0.2.0-candidates.md) §D / §F, **not** as live GitHub issues. The live tracker currently holds
only the L2 epic **#6** (output preview) and its closed spike **#5** — neither is a coverage issue. The
informal-transport coverage issues are deliberately parked pending the post-ATRC issue-curation window; live issue
links (with an explicit plan→live mapping) will be added here once they are filed.
