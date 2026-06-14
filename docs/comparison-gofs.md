# MSD and GOFS: two lightweight descriptions of on-demand service

*A factual side-by-side of how MSD (v0.1.0) and the General On-Demand Feed
Specification (GOFS) describe the same kind of service — purely on-demand,
zone-to-zone transport. This is not a competition between standards; it maps the
two field families onto each other and notes where they converge, diverge, and
complement one another. Every GOFS claim cites a file under the GOFS `schema/`
directory.*

## Why this document exists

GOFS and MSD occupy adjacent ground: both are lightweight, JSON-based ways to
describe on-demand mobility, and both deliberately borrow from the GTFS/GBFS
family (`README.md` describes GOFS as a lightweight format "much like" GTFS and
GBFS, intended "to have as much common ground as possible" with them). Mapping
MSD's top-level objects onto the GOFS schema files makes the relationship
concrete: where the two already agree on a field name, where a rename would
align them, and where the structures genuinely differ.

## Scope

This maps the seven MSD top-level objects a provider authors — `provider`,
`services[].service_area`, `services[].vehicles[]`, `services[].operating_hours`,
`fare_structures`, `booking_rules`, and `service_area.constraints` — onto the
GOFS schema files. It maps concepts and field names, not the internal usage of
any specific feed.

## Field mapping

**Reading the classification column.** *identical-naming* — the field name
matches byte-for-byte. *nameable-near* — the concepts correspond and a rename
would align them. *structurally-different* — the same real-world information is
modelled with a different shape or organisation. *out-of-scope-realtime* — a GOFS
realtime feed type with no static MSD counterpart.

| MSD top-level object | MSD key fields | Closest GOFS file | Closest GOFS field(s) | Classification |
|---|---|---|---|---|
| `provider` | `provider_id`, `name`, `description`, `url`, `contact_email`, `country`, `languages`, `legal_entity` | `schema/system_information.json` (+ `schema/service_brands.json`) | `name` (**identical**), `url` (**identical**), `operator`, `email` / `feed_contact_email`, `language`; brand identity in `service_brands.json` `brand_name` | nameable-near |
| `services[].service_area` | `type` (zones/stops), `zones[]` (`zone_id`, `name`, `geometry`), `stops[]`, `constraints[]` | `schema/zones.json` | GeoJSON `FeatureCollection`, per-feature `zone_id` (**identical**), `geometry` (both GeoJSON) | structurally-different |
| `services[].vehicles[]` | `vehicle_type_id`, `name`, `capacity.seats`, `capacity.wheelchair`, `propulsion`, `count` | `schema/vehicle_types.json` | `vehicle_type_id` (**identical**), `max_capacity`, `wheelchair_boarding` | nameable-near |
| `services[].operating_hours` | `default[]` (`days`, `start`, `end`), `exceptions[]` (`date`, `closed`, `start`, `end`) | `schema/calendars.json` (+ `schema/operating_rules.json`) | `days`, `start_date` / `end_date`, `excepted_dates`; time-of-day in `operating_rules.json` `start_pickup_window` / `end_pickup_window` | structurally-different |
| `fare_structures[]` | `fare_id`, `service_ids`, `currency`, `rules[]`, `discounts[]`, `payment_methods`, `vat_rate`, `vat_included` | `schema/operating_rules.json` (reference only) | `fare_id` reference field — see caveat below | structurally-different |
| `booking_rules` | `advance_booking.{minimum_minutes, maximum_days}`, `cancellation.{free_cancellation_minutes, late_cancellation_fee}`, `booking_channels`, `booking_confirmation`, `passenger_identification` | `schema/booking_rules.json` (file name **identical**) | `prior_notice_duration_min` / `_max`, `prior_notice_start_day` / `prior_notice_last_day`, `booking_type`, `phone_number` / `booking_url` / `info_url` | structurally-different |
| `service_area.constraints[]` | `type`, `description`, `origin_zone`, `destination_zone`, `rule`, `zone`, `pickup_type` | `schema/operating_rules.json` | `from_zone_id` / `to_zone_id` (positive OD permissions) | structurally-different |

**Caveat on `fare_structures` (factual observation).** GOFS publishes no fares
schema among its files. `fares` appears only as a feed *name* in the
auto-discovery enumeration (`schema/gofs.json`), and the only fare element in the
schemas is a `fare_id` *reference* key on each operating rule
(`schema/operating_rules.json`). The GOFS `README.md` states the specification
"is a work in progress, there are currently important missing functionalities
like accurate pricing." MSD's `fare_structures` therefore has no field-level GOFS
counterpart to map against — only a reference key.

## Naming convergence at the sub-field level

Several MSD fields are byte-identical to their GOFS counterparts. The zone
identifier is `zone_id` in both (`schema/zones.json`); the vehicle-type
identifier is `vehicle_type_id` in both (`schema/vehicle_types.json`); the
service/system display name is `name` and the service URL is `url` in both MSD
`provider` and GOFS `schema/system_information.json`. Both standards represent
zone geometry as GeoJSON (`schema/zones.json` carries a GeoJSON
`FeatureCollection`; MSD carries GeoJSON `Polygon`/`MultiPolygon` per zone), and
both express recurring days with the same three-letter weekday abbreviations
(`schema/calendars.json` `days`). This shared GTFS/GBFS lineage means the
identifier and naming surface already overlaps without translation.

## Structural divergences at the family level

The divergences are structural rather than lexical. MSD groups a service area
under a typed container (`type: zones | stops`) with geometry inlined per zone
object; GOFS expresses zones as a flat GeoJSON `FeatureCollection`
(`schema/zones.json`) and has no stops model. MSD bundles day-recurrence and
time-of-day into a single `operating_hours.default[]` band, whereas GOFS splits
these across two files — day and date recurrence in `schema/calendars.json`
(`days`, `start_date`, `end_date`, `excepted_dates`) and time-of-day windows in
`schema/operating_rules.json` (`start_pickup_window`, `end_pickup_window`). MSD's
`booking_rules` and GOFS `schema/booking_rules.json` share a file name but differ
internally: GOFS keys booking on zone pairs and a `booking_type` code with
`prior_notice_*` fields and no cancellation concept, while MSD models advance
booking, cancellation, channels, confirmation, and identification. Most
notably, MSD `constraints` express *negative/restrictive* logic, while GOFS
`schema/operating_rules.json` expresses *positive* origin–destination permissions
(`from_zone_id` → `to_zone_id`): the two encode service-area relations in
opposite polarity.

## Complementarity

Both MSD and GOFS are primarily static, declarative descriptions of an on-demand
offering: GOFS's core files are static — zones (`schema/zones.json`), calendars
(`schema/calendars.json`), and vehicle types (`schema/vehicle_types.json`). The
scope difference is that GOFS additionally offers an *optional* realtime layer —
the `wait_times` / `wait_time` and `realtime_booking` feed types
(`schema/gofs.json`) — which MSD deliberately leaves out of scope. (The
`last_updated` and `ttl` fields present on every GOFS file — for example
`schema/system_information.json` — are a feed-delivery detail of how GOFS files
are served and cached, not in themselves a realtime mechanism.) A second scope
difference is that GOFS publishes no fares schema among its files, as noted in
the caveat above. GOFS is also explicitly unfinished: its `README.md` records
that it "is a work in progress, there are currently important missing
functionalities like accurate pricing, travel time estimations, etc." The
mapping above is therefore a snapshot of overlapping concepts at this stage, not
a fixed correspondence; the shared GTFS/GBFS lineage makes a field-level
cross-walk between MSD and GOFS tractable where the scopes coincide.

---

*This document is descriptive and neutral. It maps field families and does not
assess either standard as better or worse.*
