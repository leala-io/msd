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

## Sources

- **ITF-199** — ITF (2025), *Incorporating Informal Transport in Mobility Planning*, Roundtable Report No. 199, OECD Publishing, Paris. Page numbers below are the printed page numbers of the report.
- **GIZ** — GIZ (2026), *National Roadmap for Paratransit Reform*, Mobilize Net-Zero / Changing Transport, Kigali (authors: M. G. Monney, E. Guarino, J. Allaire, P. Salazar-Ferro, M. Gomez Jattin). Section 6 covers Uganda (pp. 53–58).
- **Oviedo / Bogotá** — reform-pattern studies of paratransit integration (Oviedo et al., 2026), used for the
  governance and pricing-variability patterns. Not page-checked in the citation pass of 2026-10-11.

Page references for ITF-199 and GIZ were checked against the PDFs on 2026-10-11. Most values in the SACCO example are
realistic-but-illustrative, not measured; *Value provenance — SACCO example* below records, value by value, which ones a
source states, which are derived from a source, and which are illustrative.

Cross-corpus corroboration (SSATP/World Bank, WRI/IDB-LATAM, ITF 2022, Grafigéo, the SSA accessibility cluster, NCHRP,
TCQSM, MLIT, and the FTA MOD Sandbox) is recorded per finding in *Corroborating sources per finding* below —
page-precise where the underlying analysis pins it, paraphrase-only for the CC-IGO-licensed WRI/IDB monograph.

## Matrix

| # | Documented feature (source) | MSD v0.1.0 field | Fit | Notes |
|---|---|---|---|---|
| 1 | Operator metadata (name, country, languages) | `provider.name`, `provider.country`, `provider.languages` | **expressible** | Core §3.2 fields carry directly. |
| 2 | Fixed-corridor service with named stages (GIZ p. 54) | `service.service_area.type:"stops"` + `stops[]` | **partially expressible** | Stages carry as named stops; **route order** and the linear corridor geometry are not modelled. |
| 3 | Hail-and-ride / board-anywhere along the line (not stated in ITF-199 or GIZ — see *Value provenance*) | — | **needs-extension** | The stops model assumes discrete boarding points; continuous on-line boarding is not representable. |
| 4 | Fill-and-go departure (depart-when-full), no timetable, no booking (ITF-199 p. 9; GIZ pp. 12, 54) | `service.service_type` (registry: `on_demand` only); `booking_rules` | **needs-extension** | No registry value for fill-and-go; `service_type` set to `on_demand` as a forced placeholder; true model carried in `service.operational_model` (pass-through). `booking_rules` assume advance booking. |
| 5 | SACCO / owner-operator cooperative governance (ITF-199 pp. 7–8; GIZ pp. 55–56) | `provider` / `provider.legal_entity` | **needs-extension** | No `organisation_type`; carried in `provider.organisation_type` (pass-through). |
| 6 | 14-seat minibus fleet (GIZ pp. 53, 55), fleet size (illustrative) | `service.vehicles[]` (`vehicle_type_id`, `capacity.seats`, `count`) | **expressible** | Nominal seating and count carry; practical overloading is not represented (only nominal seats). |
| 7 | Minibus-taxi (matatu) vehicle class | `service.mode` (registry: `bus` only) | **partially expressible** | Modelled as `bus`; the minibus-taxi distinction is not separately expressible (minor). |
| 8 | Diesel propulsion | `vehicle.propulsion` (registry: `electric` only) | **registry growth (C2)** | Adding a `diesel` value to the `propulsion` registry is routine non-breaking registry growth (Convention C2), not a structural schema extension. The optional field is omitted in the example; no value is invented. |
| 9 | Daily operating window | `service.operating_hours.default[]` | **expressible** | Day/start/end carry. Demand-driven headways are not timetabled, hence not represented. |
| 10 | Flat cash fare, distance-banded (short hop / full corridor) (GIZ p. 55: fares set by distance; amounts illustrative) | `fare_structure.rules[].price` + `conditions` | **partially expressible** | Representative fares carry as fixed `price`; banding via freeform `conditions`, without a formal stage/band model. |
| 11 | Dynamic / negotiated fares (peak, weather, demand, bargaining) (ITF-199 pp. 9, 12; Oviedo; bargaining not stated in ITF-199 or GIZ — see *Value provenance*) | `fare_rule.price` (single fixed number) | **needs-extension** | Variability carried in `fare_structure.dynamic_pricing` (pass-through); `price` cannot vary by time/weather/demand or be negotiated. |
| 12 | Cash payment to conductor (ITF-199 p. 12; GIZ pp. 7, 10) | `fare_structure.payment_methods` (`cash_in_vehicle`) | **expressible** | Registry value `cash_in_vehicle` fits. |
| 13 | SACCO revenue model (driver daily target/fee, association dues) (ITF-199 p. 12; GIZ pp. 10, 55) | `settlement` (§3.7, MaaS/platform-oriented) | **needs-extension** | The §3.7 settlement object targets platform settlement; an informal cash/daily-target model has no fitting representation. `settlement.model` omitted. |
| 14 | Safety profile (vetting, seatbelts, overloading, incident reporting) (ITF-199 p. 12; GIZ pp. 10–12) | — | **needs-extension** | Not in §3; carried in `service.safety` (pass-through, same shape as the mybuxi example). Already recorded as candidate A.5. |
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

## Value provenance — SACCO example

Citation pass of 2026-10-11 against the PDFs of ITF-199 and GIZ (printed page numbers). Classes: **source** — the value is
stated on the cited page; **derived** — the value follows from a stated fact by a step named in the note; **illustrative**
— chosen for the example, no page states it; **not found** — attributed to these sources in earlier versions, but neither
states it. Oviedo et al. (2026) was not page-checked in this pass. Absences (no tracking, no panic button, no
accessibility features) are illustrative unless a page is given.

| Value in `kampala-taxi-sacco.msd.json` | Class | Source | Note |
|---|---|---|---|
| 14-seat minibus (`capacity.seats: 14`) | source | GIZ pp. 53, 55 | "14-seater minibus taxis" |
| Fixed route, waiting at stages until full | source | GIZ p. 54 | Kampala taxis |
| Fill-and-go departure | source | GIZ pp. 12, 54; ITF-199 p. 9 | |
| Hail-and-ride / board anywhere along the corridor | **not found** | — | Neither source states it; GIZ p. 11 (drivers may deviate from routes to pick up passengers) is the nearest passage and is general, not Kampala-specific. Needs a source or a weaker wording |
| Stages as named stops, two termini + two intermediate | illustrative | — | Stage count, names and coordinates are invented |
| Fleet size `count: 30` | illustrative | — | GIZ p. 54 gives 21,000 registered taxis city-wide (KCCA, 2018), not a per-SACCO size |
| Diesel propulsion; Toyota-Hiace-class vehicle | illustrative | — | GIZ p. 53: second-hand vehicles imported from Japan or Dubai; fuel type not stated |
| `wheelchair: 0`, no accessibility features | illustrative | — | Not stated |
| Operating hours 05:00–22:00 / 05:30 / 06:30 | illustrative | — | GIZ p. 10 gives driver working hours (14–16 h), not service hours |
| Languages `en`, `lg`, `sw` | illustrative | — | Not stated |
| Cash fare paid to the conductor | source | ITF-199 p. 12 (cash-based revenue); GIZ pp. 7, 10 (conductors) | |
| Fare banded by distance | derived | GIZ p. 55 | "fares … determined based on the distance travelled"; the two bands are a simplification |
| Fare amounts 1,500 / 2,000 / 3,000 / 3,500 UGX | illustrative | — | Neither source gives fare amounts |
| Fares vary by time of day and weather | source | ITF-199 p. 9 (operators "surge" prices by weather or time of day; general) | |
| Fares vary with demand | derived | GIZ p. 55 | Fares are revised periodically to balance supply and demand — revisions, not per-trip variation |
| Fares negotiated per passenger with the conductor | **not found** | — | Not stated in ITF-199 or GIZ. GIZ p. 55 describes Kampala taxi fares as standardised per stage and origin–destination and revised in steps ("ratchet effect"), which sits uneasily with per-passenger bargaining. Possibly from Oviedo (Bogotá), not checked |
| Driver remits a daily target to the owner | source | GIZ p. 55 (70,000–120,000 UGX per day, Kampala); ITF-199 p. 12 | |
| Dues / levies to the association | source | GIZ p. 10 (membership fees or daily levies; general) | |
| SACCO controls route access and stage order | derived, partly | ITF-199 pp. 7–8, 11; GIZ p. 56 | In Kampala, route decisions sit with stage-level associations (ITF-199) and stages are usually managed by committees (GIZ p. 56); GIZ p. 55 describes SACCOs mainly as financial support |
| Registered under the cooperative-societies regime | illustrative | — | Not stated |
| Safety: seatbelts often absent | source | GIZ p. 12 | |
| Safety: overloading common | source | ITF-199 p. 12; GIZ p. 10 (overcrowding) | |
| Safety: informal driver vetting | derived | GIZ p. 11 | "minimal and often unchecked requirements for licensing, training" |
| Safety: no tracking, panic button, CCTV, reporting channel | illustrative | — | Absence not stated |
| `travel_time_factor: 1.6` | illustrative | — | Marked as an estimate in the file |
| Vehicle class label "matatu" | **check** | ITF-199 p. 8; GIZ p. 34 | Both sources use "matatu" for Kenya; GIZ p. 53 calls the Kampala vehicles "minibus taxis (taxis)" |

**Open points from this pass (not changed here):** the hail-and-ride row (matrix row 3) and per-passenger bargaining
(row 11) have no page in ITF-199 or GIZ; the "matatu" label and the SACCO's role in route control are closer to the Kenyan
model than to what both sources describe for Kampala. Whether to source, re-word or drop these is a content decision,
not a citation fix.

## Second organisation type — boda-boda stage (generalisation test)

**Example:** [`examples/ug/kampala-boda-stage.msd.json`](../examples/ug/kampala-boda-stage.msd.json) — **validates PASS**
against the frozen v0.1.0 schema. A hypothetical stage of motorcycle-taxi riders in Kampala, chosen to contrast with the
corridor SACCO above. **Stricter discipline than the SACCO example:** a value is entered only where a cited source
states it; where the sources are silent (fare amounts, passengers per motorcycle, operating hours, payment, safety,
accessibility, stage location) the field is omitted or `null`. Sources: GIZ (2026), *National
Roadmap for Paratransit Reform*, Uganda section, pp. 54–55 and 58; ITF (2025), *Incorporating Informal Transport in
Mobility Planning*, Roundtable Report No. 199, p. 10 (page numbers checked against the PDFs on 2026-10-11).

The question is whether the findings above hold for a second, contrasting organisation type or are SACCO-specific.

| SACCO finding (above) | Boda-boda stage | Result |
|---|---|---|
| Fill-and-go departure, no booking (row 4) | Hired on demand at the stage (GIZ p. 54); no fill-to-capacity departure rule stated | **does not recur** — SACCO-specific |
| Hail-and-ride along a corridor (row 3) | No corridor; riders serve any destination from a stage, with no perimeter restriction (GIZ p. 54) | **does not recur** in this form — replaced by a different spatial gap (row below) |
| Organisation type (row 5) | Stage-based rider collective; SACCOs used for financial support; target system; national rider union present (GIZ pp. 54–55) | **holds** — with a different value (rider collective vs owner-operator cooperative) |
| Dynamic pricing (row 11) | "Can be expensive during evening peak hours" (GIZ p. 54); no amounts stated | **holds**, weaker evidence; no fare structure declared because `fare_rule.price` is required |
| Informal settlement (row 13) | Target system: riders remit to vehicle owners (GIZ p. 55) | **holds** |
| Safety profile (row 14) | Not stated in the cited sources | **not tested** — nothing declared |
| Minibus as `bus` (row 7, partially expressible) | A motorcycle must be declared as `bus` | **sharpens** — see first new row |

| New finding (boda-boda stage) | MSD v0.1.0 field | Fit | Notes |
|---|---|---|---|
| Motorcycle taxi as mode | `service.mode` (required; registry: `bus` only) | **needs value (C2), forced false meanwhile** | `mode` is required, so it cannot be omitted as `propulsion` was for diesel. A schema-valid file must declare `bus`. Verified both ways: `motorcycle_taxi` and an absent `mode` each fail validation. Fix class is additive registry growth (C2), but until then the file states a falsehood in a required field. |
| Stage-anchored service with unrestricted destinations | `service_area` (`stops` / `zones`) | **needs-extension** | One stop states the origin, not the open destination set; a zone would assert a boundary the source denies (GIZ p. 54). |
| Registration / licence status | — | **needs-extension** (existing licence-status candidate) | An estimated half of Kampala's boda-bodas are registered (GIZ p. 54, ministry estimate); motorcycle taxis sit in a regulatory grey area (ITF-199 p. 10). The SACCO example did not surface this; the boda-boda case does. No new candidate. |

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
| Fill-and-go / no-booking departure | ITF-199 (p. 9); GIZ (fill-and-go as the standard, not exceptional, mode; pp. 12, 54); SSATP/Kumar 2021 (p. 105); WRI/IDB/Tun 2020 (unscheduled departures, "war of the penny"; pp. 14, 38, 41) |
| Hail-and-ride / board-anywhere | Grafigéo (*garages de clandos* line organisation, ch. 2). Not stated in ITF-199 or GIZ (checked 2026-10-11); the nearest GIZ passage is route deviation to pick up passengers (p. 11) |
| Organisation type (SACCO / cooperative / route-owner) | ITF-199 (Kampala stage-level associations, Nairobi SACCOs; pp. 7–8, 11); GIZ (SACCOs, GIEs, TOCs; Kenya p. 34, Uganda pp. 55–56); SSATP/Kumar 2021 (unions/associations, EIGs; pp. 38 f., 90 f., 106 f.) incl. Cars-Rapides Dakar (Kumar & Diou 2010, EIG + ticketing); Grafigéo (rickshaw syndicates, *courtiers de fret*; ch. 2/5/6); Oviedo/Bogotá (route owners, exclusive territories) |
| Dynamic / negotiated pricing | ITF-199 (surge by weather or time of day; pp. 9, 12); GIZ ("ratchet effect"; p. 55); SSATP/Kumar 2021 (p. 62); Oviedo/Bogotá; Grafigéo (broker-mediated *boutres* fares, ch. 6 — weak) |
| Informal settlement (daily target/fee, dues) | ITF-199 (p. 12); GIZ (daily-target model; pp. 10, 55); SSATP/Kumar 2021 (pp. 62 f.) |
| Safety profile | ITF-199 (p. 12); GIZ (safety as a primary reform target; pp. 10–12); SSATP/Kumar 2021 (pp. 62 f.) |

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
