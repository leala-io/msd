# MSD and NeTEx: the same service, two layers

*A factual side-by-side of how one real demand-responsive service — mybuxi (Emmental, Switzerland) — is represented in MSD and in CEN-NeTEx. This is not a competition between standards; it shows that the two operate at different layers and complement each other.*

## Why this document exists

mybuxi is a small, zone-based demand-responsive service. The same service can be described as an MSD file and modelled in NeTEx. Comparing the two on one concrete case makes the relationship between the standards tangible: NeTEx is a comprehensive European exchange model; MSD is a lightweight, provider-authored description. An MSD file is not an alternative to NeTEx — it is a low-barrier on-ramp that can feed NeTEx-based systems.

## The two representations

| | MSD | NeTEx |
|---|---|---|
| Artifact | `examples/ch/mybuxi-emmental.msd.json` — one declarative JSON file, authored by the provider | mybuxi appears inside the **national on-demand NeTEx export** *Angebotsplan NeTEx für On-Demand-Verkehre* (`netex_tt_odv`) on opentransportdata.swiss, produced centrally for **all** Swiss demand-responsive services; an illustrative single-service example also exists in the CEN-NeTEx Alternative-Modes set (see footnote 1)¹ |
| Standard basis | MSD v0.1.0 JSON Schema (Draft 2020-12) | CEN/TS 16614 series, based on Transmodel V6.2; **Part 5** (Alternative Modes / flexible & demand-responsive services). Current production version: the **February 2026 CEN revision** of Parts 1/2/3/5; new-modes work continues in the `v2.1-wip` branch |
| Validation | One open-source reference validator (AJV) | The full NeTEx XSD (`NeTEx_publication.xsd`) plus XML tooling |
| Authoring | The provider edits one JSON file | Modelled in the NeTEx/Transmodel data model, typically with NeTEx expertise |

¹ **Two NeTEx representations of mybuxi.**
   **(1) Production (primary reference).** mybuxi is part of the national on-demand NeTEx export *(Beta) Angebotsplan NeTEx für On-Demand-Verkehre* (`netex_tt_odv`), published by Geschäftsstelle SKI on opentransportdata.swiss and refreshed roughly twice a week, covering all Swiss demand-responsive services (file prefix `GE16614_01_DIVA_odv_ALL_prod_…`, i.e. CEN/TS 16614 / NeTEx). Dataset: `https://data.opentransportdata.swiss/dataset/netex_tt_odv`.
   **(2) Illustrative.** A single-service mybuxi DRT example also exists among the CEN-NeTEx Alternative-Modes examples (`examples/functions/newModes/`), associated with the ongoing new-modes work.

## The layer relationship

NeTEx is the **system / integration layer**: a rich, authoritative model that authorities and information systems maintain to exchange complex public-transport data (network, timetable, fares, accessibility). MSD is the **provider / description layer**: what a provider publishes about itself.

The useful distinction is not "which is better" but **who acts**. The production case makes this concrete: in NeTEx, mybuxi is one entry inside a national on-demand export that a central data office produces and refreshes for the whole country — *the provider is described*. In MSD, the provider publishes its own single file — *the provider describes itself*. The two are complementary: an MSD file can be transformed into NeTEx (an MSD→NeTEx converter is on the MSD roadmap), so MSD lowers the entry barrier for providers whose service would otherwise depend entirely on central modelling, and the result can still flow into NeTEx-based systems.

NeTEx itself supports demand-responsive and flexible transport — flexibility can be applied to the line, route, and stop structure (areas, corridors, hail-and-ride) and to scheduling, with booking arrangements and contact details. The comparison below is therefore about the **entry barrier and authoring model**, not about whether NeTEx *can* represent the service (it can).

## Field overlap (concept level)

Mapping the overlapping concepts. This maps concepts, not the internal element usage of any specific example file.

| MSD (v0.1.0) | NeTEx construct |
|---|---|
| `provider` | `Operator` / `Authority` (ORGANISATION) |
| `service_area.zones[]` (GeoJSON) | `FlexibleStopPlace` with `FlexibleArea` (Part 5) |
| `service_area.type = stops` | `ScheduledStopPoint` / `StopPlace` |
| `services[]` (on-demand) | `FlexibleLine` (`FlexibleLineType`) + `FlexibleServiceProperties` |
| `service_area.constraints` (e.g. relation restriction) | service/area restrictions (the focus of the ongoing new-modes work) |
| `operating_hours` | `ServiceCalendar` / availability conditions |
| `booking_rules` | `BookingArrangement` (`BookWhen`, `BookingMethods`, `BookingContact`, `MinimumBookingPeriod` / `LatestBookingTime`) |
| `fare_structures` | `FareStructure` / `FareProduct` (Part 3) |
| `vehicles[]`, accessibility | `Vehicle` / accessibility assessment |

## Implementation effort

The point is the **entry barrier**, stated neutrally:

- **MSD:** one self-contained JSON file, authored and validated by the provider with a single open-source validator — no XML toolchain, no Transmodel modelling expertise.
- **NeTEx:** the same service modelled with Part 5 constructs, validated against the full NeTEx XSD and grounded in the Transmodel V6.2 conceptual model; authoring typically requires NeTEx/Transmodel expertise and XML tooling.

This is a difference in **barrier to entry, not in ceiling**. NeTEx's comprehensiveness is a strength for system-level integration across Europe; MSD's single-file simplicity is a strength for provider self-description, especially for small or informal providers below the threshold of NeTEx tooling.

**Quantified contrast (measured 2026-06-04).**

> mybuxi as MSD is **one self-authored JSON file — 579 lines, 23 KB**. In NeTEx, the same service is published as part of the national on-demand export *(Beta) Angebotsplan NeTEx für On-Demand-Verkehre* — a centrally produced, twice-weekly dataset of **5.2 MB / 109,404 lines** covering **all five** Swiss demand-responsive operators. mybuxi is one of those five, explicitly referenced on roughly **1,854 lines** — already about **three times** the size of its entire self-authored MSD file.

- Measured against `GE16614_01_DIVA_odv_ALL_prod_20260604091554.xml` (`netex_tt_odv`, see footnote 1): `wc -l` → 109,404; `grep -o "<Operator " | wc -l` → 5; `grep -ic "mybuxi"` → 1,854 (lines that explicitly name mybuxi — a lower bound on its footprint, not a full fragment extraction). MSD side: `wc -l examples/ch/mybuxi-emmental.msd.json` → 579.
- This reflects the **entry barrier and authoring model**, not NeTEx's ceiling: 579 lines a provider writes and validates itself, versus being one operator inside a 109,404-line central artifact the provider does not author.
- Context (not a per-service figure): Switzerland's full NeTEx *timetable* export (scheduled public transport, separate from on-demand) reaches several gigabytes, split across eight frame files (TimetableFrame, ServiceFrame, SiteFrame, ResourceFrame, ServiceCalendarFrame, CommonFrame, AccessibilityFrame, FareFrame).

## What each is for

- **NeTEx** — authoritative, comprehensive EU exchange standard; rich for integration, fares, accessibility, and scheduling at the system level.
- **MSD** — low-barrier, provider-authored service description; a complementary on-ramp that is transformable to NeTEx (and to GTFS-Flex and GOFS).

## References

- NeTEx-CEN repository; CEN/TS 16614-5 (Part 5, Alternative Modes); Transmodel V6.2. NeTEx Parts 1/2/3/5 — February 2026 CEN revision.
- *(Beta) Angebotsplan NeTEx für On-Demand-Verkehre* (`netex_tt_odv`), Geschäftsstelle SKI, opentransportdata.swiss — production NeTEx export for Swiss demand-responsive services. Cookbook: opentransportdata.swiss → NeTEx → On-Demand Services. Swiss NeTEx realisation guide: *NeTEx Core-Realisation Guide TP Suisse* (oev-info.ch).
- mybuxi (Emmental, Switzerland).
- MSD v0.1.0 JSON Schema + reference validator; `examples/ch/mybuxi-emmental.msd.json`.

---

*This document is descriptive and neutral. MSD positions itself as complementary to NeTEx, not as a replacement.*
