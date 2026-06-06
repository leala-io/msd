# MSD → GTFS-Flex adapter (Phase 2a — discovery)

Maps a validated MSD v0.1.0 document to a **GTFS-Flex** feed (the static, on-demand
profile of GTFS Schedule). Phase 2a covers service *discovery* — agency, route, service
area, operating hours, and booking. Fares are Phase 2b (`GTFS-Fares v2`), not emitted here.

Field names and conditional-requirement rules were taken from the **live** GTFS reference
at build time (`gtfs.org/documentation/schedule/reference/` and
`raw.githubusercontent.com/google/transit/master/gtfs/spec/en/reference.md`), per
CLAUDE.md §5 — not from memory. The output is gated against the canonical
MobilityData **`gtfs-validator`** (see [`../../README.md`](../../README.md)).

## Round-trip result (gate)

`examples/ch/mybuxi-emmental.msd.json` → `node engine/cli.js … --target gtfs-flex` →
**`gtfs-validator` v8.0.1: 0 notices (no ERROR, no WARNING).** Feed = 10 files:
`agency.txt, routes.txt, trips.txt, calendar.txt, stops.txt, location_groups.txt,
location_group_stops.txt, stop_times.txt, booking_rules.txt, feed_info.txt`.

## Mapping table

| MSD (v0.1.0) | GTFS-Flex | Notes |
|---|---|---|
| `provider.provider_id` | `agency.agency_id`, `routes.agency_id` | |
| `provider.name` | `agency.agency_name`, `feed_info.feed_publisher_name` | |
| `provider.url` | `agency.agency_url`, `feed_info.feed_publisher_url`/`feed_contact_url` | **Required** by GTFS; conversion aborts if absent. |
| `provider.languages[0]` | `agency.agency_lang`, `feed_info.feed_lang` | First language; falls back to `en` for `feed_lang`. |
| `provider.country` | `agency.agency_timezone` (derived) | **Assumption** — MSD has no timezone. Country→IANA map (`CH`→`Europe/Zurich`, `UG`→`Africa/Kampala`); unmapped country aborts (no silent guess). |
| `service.mode` | `routes.route_type` | `bus` → `3`. |
| `service` (+ `name`) | one `routes` row + representative `trips` row(s) | `route_id` = `service_id`; `route_long_name` = `service.name`. |
| `service.operating_hours.default[]` | `calendar.txt` (day flags) + one `trips`/`stop_times` per entry | Each default entry can carry different days/hours, so each becomes its own `service_id` (`<service_id>-oh<i>`), trip, and window. |
| `service.operating_hours.default[].start`/`end` | `stop_times.start/end_pickup_drop_off_window` | `HH:MM`→`HH:MM:SS`; a window crossing midnight uses GTFS extended hours (e.g. `05:25`→`00:00` becomes `…→24:00:00`, `…→01:30` becomes `…→25:30:00`). |
| `service.operating_hours.exceptions[]` | `calendar_dates.txt` | `closed:true`→`exception_type=2`, else `1`. (mybuxi has none.) |
| `service.service_area.type="zones"` + `zones[]` | `locations.geojson` (FeatureCollection; feature `id`=`zone_id`) + `stop_times.location_id` | Geometry passed through (Polygon/MultiPolygon). |
| `service.service_area.type="stops"` + `stops[]` | `stops.txt` + `location_groups.txt` + `location_group_stops.txt` + `stop_times.location_group_id` | An area served by a set of named stops is modelled as a **location group** (canonical flex for "pick up at any of these stops"). |
| `service.service_area` + hours | `stop_times.txt` | One trip per operating-hours entry; a single-area service emits **two** `stop_times` (pickup seq 1 + drop-off seq 2, same area) to meet the flex "≥2 stop_times per trip" rule. `pickup_type`/`drop_off_type` = `2` (arrange via agency) — `0` is forbidden with a window — paired with the booking rule. |
| `booking_rules.advance_booking.minimum_minutes` | `booking_rules.booking_type` + `prior_notice_duration_min` | Present → `booking_type=1` and `prior_notice_duration_min` (**minutes**, the GTFS unit). Absent → `booking_type=0` (real-time). |
| `booking_rules.advance_booking.maximum_days` | `booking_rules.prior_notice_start_day` (+ `prior_notice_start_time=00:00:00`) | The MSD *booking horizon* (how far ahead you may book) is GTFS `prior_notice_start_day`. **See spec deviation 1.** |
| `booking_rules` (link) | `stop_times.pickup_booking_rule_id` / `drop_off_booking_rule_id` | Single rule `br-default` linked from every flex `stop_time`. |
| `references.info_url` / `provider.url` | `booking_rules.info_url` | |
| `msd.last_updated` | `calendar.start_date` (= date), `end_date` (+1 year), `feed_info.feed_*` | **Assumption** — MSD carries no service-calendar date range. |

## Spec deviations from the blueprint mapping table (verified against upstream)

1. **`maximum_days` → `prior_notice_start_day`, not `prior_notice_last_day`.** The blueprint
   table wrote `prior_notice_last_day ← maximum_days`. Per the live GTFS spec,
   `prior_notice_last_day` is the *latest* day to book and is **Required for `booking_type=2`
   only / Forbidden otherwise**, whereas MSD `maximum_days` is the booking *horizon* — the
   *earliest* day, i.e. `prior_notice_start_day`. We map to the semantically correct field.
   *(Decision flagged to the human; moot for the mybuxi gate, where both values are null.)*
2. **Booking-rule link fields are `pickup_booking_rule_id` / `drop_off_booking_rule_id`**, not a
   single `stop_times.booking_rule_id` (the blueprint's shorthand).
3. **Stops → location group** (plus `stops.txt`), not bare `stops.txt`, so the flex window/booking
   attach to a single demand-responsive area reference.

## Lossy / not-expressible mappings

- **`service_area.constraints[].relation_restriction`** (and other `constraints[]`): GTFS-Flex has
  no representation for negative/relational service rules (e.g. "no trips from zone A to zone B").
  These are **dropped** from the feed (documented loss). mybuxi carries none.
- **Fares** (`fare_structures`, discounts, products): out of Phase 2a scope → Phase 2b (`Fares v2`).
- **`pickup_type`/`drop_off_type`=2** ("must contact agency") is a structural placeholder required by
  the window rule; the *actual* booking channel (app/web for mybuxi) lives in the linked booking rule,
  not in the enum.
- **Timezone & service-calendar dates** are assumptions (see table) because MSD v0.1.0 does not carry
  them; both are recorded as inputs the producer profile may wish to make explicit.
