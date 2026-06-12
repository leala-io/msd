# Producer flow — reference data path (schematic, non-normative)

**Status: design illustration, not a product.** No app is being built. No functional input UI is part of MSD or planned as part of it. This document records, as schematic phone screens, the *reference data path* from a provider's self-description to a validated MSD file and its immediate uses.

**What is real and what is schematic:** Screens 1–7 are schematic. Screens 8–9 are **not mock-ups** — schema validation, the service-area map and GTFS-Flex feed generation run today in the hosted validator at https://leala-io.github.io/msd/, entirely in the browser, with nothing uploaded.

---

## Why this exists

MSD's design goal is a very low technical barrier: any provider can describe a service as a single JSON file — no API, no server, no integration project. These screens illustrate what that barrier looks like at its lowest: **one person, one phone, one file.** The walkthrough follows the published Kampala minibus-taxi SACCO example (`examples/ug/kampala-taxi-sacco.msd.json`) — a single linear corridor with stage terminals.

## Scenario and declared assumptions

- **Producer = an intermediary with a mandate** — for example a SACCO secretary or an association mapper describing ~30 vehicles in one file — not necessarily each driver.
- **Smartphone-based capture** follows established sector practice: smartphone mapping of informal transport by local teams (e.g., the DigitalMatatus work) predates this concept.
- **Offline-complete:** capture, save and validate work without a network. Nothing leaves the device. Map tiles load only on explicit opt-in, with a data-use note.
- **Fields shown are MSD v0.1.0 core fields**; each screen lists its schema paths. Required vs. optional follows the schema (see `CONFORMANCE.md`); the flow blocks "Next" only on schema-required fields.

## Design principles applied

One question per screen · plain-language labels with technical detail expandable · IDs auto-generated, never typed · leaving a field blank records it explicitly as *not known* (`null`), never as zero · selectable values come from the published registry, not free text · icon-led cards for categorical choices · large touch targets, short sentences, language toggle envisaged (English/Luganda in this scenario) · a persistent assurance that nothing is uploaded.

## The flow

```
 S1 Provider ──► S2 Service type ──► S3 Service area ──► S4 Vehicles
                                          │
                   stops? ── yes ──► capture stages (GPS / Plus Code)
                                          │
                         no (zones) ──► draw zone OR radius + slider
                                        (stored as GeoJSON polygon)
                                                             │
 S9 Use ◄── S8 Review + validate ◄── S7 Boarding ◄── S6 Fares ◄── S5 Hours
  │               │
  │          PASS │ FAIL ──► plain-language errors ──► jump to screen
  ▼               ▼
 map preview · GTFS-Flex zip      on-device validation — same core
 save / share file                as the hosted validator and CLI
```

---

## Screens

### 1 — Who runs this service?

```
┌────────────────────────────────┐
│ ●○○○○○○○○       MSD · Describe │
│                                │
│  Who runs this service?        │
│                                │
│  Service name                  │
│  [ Kampala Corridor MT SACCO ] │
│                                │
│  Country          [ Uganda ▾ ] │
│                                │
│  Contact email (optional)      │
│  [                           ] │
│  Don't have one? Leave blank — │
│  saved as "not known".         │
│                                │
│  More details ▸                │
│                                │
│                     [ Next → ] │
└────────────────────────────────┘
```

| UI element | Schema path | Example |
|---|---|---|
| Service name | `provider.name` | Hypothetical Kampala Corridor Minibus-Taxi SACCO |
| Country | `provider.country` | `UG` |
| Contact email | `provider.contact_email` | blank → `null` |
| More details ▸ | `provider.legal_entity.name`, `provider.languages` | Hypothetical Corridor Transport SACCO Ltd.; `["en","lg"]` |
| (auto, hidden) | `provider.provider_id`, `msd_version`, `last_updated`, `ttl` | generated |

### 2 — What kind of service?

```
┌────────────────────────────────┐
│ ○●○○○○○○○       MSD · Describe │
│                                │
│  What kind of service?         │
│                                │
│  ┌────────────┐ ┌───────────┐  │
│  │ On-demand✓ │ │ Scheduled │  │
│  │ bus        │ │ bus       │  │
│  └────────────┘ └───────────┘  │
│  ┌────────────┐ ┌───────────┐  │
│  │ Taxi       │ │ Bicycle   │  │
│  │            │ │ share     │  │
│  └────────────┘ └───────────┘  │
│                                │
│  ⓘ Cards show registry values  │
│                                │
│  [ ← ]              [ Next → ] │
└────────────────────────────────┘
```

| UI element | Schema path | Example |
|---|---|---|
| Card selection | `services[0].service_type` | `on_demand` (the example's value); card set generated from the published registry, not invented |
| (paired) | `services[0].mode` | `bus` |
| (auto, editable under "More details") | `services[0].name` | prefilled from the provider name |

### 3 — Where do you operate?

```
┌────────────────────────────────┐
│ ○○●○○○○○○       MSD · Describe │
│                                │
│  How is your area defined?     │
│  (•) Stages / fixed stops      │
│  ( ) Zone drawn on a map       │
│      draw, or radius + slider  │
│                                │
│  Your stages          4 added  │
│  • Central Taxi Stage   term.  │
│  • Mid-corridor Stage 1 GPS ✓  │
│  • Mid-corridor Stage 2 GPS ✓  │
│  • Suburban Stage       term.  │
│                                │
│  [ + Add stage — "I'm here" ]  │
│  [ + Enter a Plus Code       ] │
│                                │
│  ⓘ Stages are illustrative;    │
│    hail-and-ride between them  │
│    is not expressible here.    │
│                                │
│  [ ← ]              [ Next → ] │
└────────────────────────────────┘
```

| UI element | Schema path | Example |
|---|---|---|
| Area type | `services[0].service_area.type` | `stops` |
| Stage entry | `…service_area.stops[]` → `stop_id`, `name`, `stage_role`, `coordinates` | linear corridor: 2 termini + 2 intermediate; id provider-scoped |
| "I'm here" | `coordinates` via device GPS | capture in place — no tiles needed |
| Plus Code | `coordinates` via Open Location Code | fallback without a GPS fix |
| Zone branch (not chosen here) | `…service_area.zones[]` (GeoJSON) | draw on map, or radius-around-a-point slider; circles are stored as plain GeoJSON polygons (no new schema type); tiles opt-in only |

### 4 — What do you drive?

```
┌────────────────────────────────┐
│ ○○○●○○○○○       MSD · Describe │
│                                │
│  What do you drive?            │
│                                │
│  Vehicle type                  │
│  [ Minibus taxi (matatu)   ▾ ] │
│                                │
│  Seats              [ 14    ]  │
│  How many vehicles? [ 30    ]  │
│     Not sure? Leave blank.     │
│                                │
│  Fuel (optional)               │
│  ( ) Electric   (•) Not listed │
│   diesel isn't in the list —   │
│   leaving it unset is correct  │
│                                │
│  Wheelchair access?            │
│  ( ) Yes        (•) No         │
│                                │
│  [ ← ]              [ Next → ] │
└────────────────────────────────┘
```

| UI element | Schema path | Example |
|---|---|---|
| Vehicle type | `services[0].vehicles[0].name` / `vehicle_type_id` | Minibus taxi (matatu) |
| Seats | `…vehicles[0].capacity.seats` | 14 |
| Count | `…vehicles[0].count` | 30; blank → `null` |
| Fuel | `…vehicles[0].propulsion` | omitted — registry holds only `electric`; the file leaves it unset rather than asserting an inapplicable value |
| Wheelchair | `services[0].accessibility.wheelchair_accessible_vehicles` | `false` |

### 5 — When do you run?

```
┌────────────────────────────────┐
│ ○○○○●○○○○       MSD · Describe │
│                                │
│  When do you run?              │
│                                │
│  Days                          │
│  [Mo][Tu][We][Th][Fr][Sa][Su]  │
│   all selected                 │
│                                │
│  First departure    [ 05:30 ]  │
│  Last departure     [ 22:00 ]  │
│                                │
│  Different on some days?       │
│  [ + Add a day rule ]          │
│                                │
│  Closed on specific dates?     │
│  [ + Add a date ]              │
│  ⓘ v0.1.0: exceptions are      │
│    single dates                │
│                                │
│  [ ← ]              [ Next → ] │
└────────────────────────────────┘
```

| UI element | Schema path | Example |
|---|---|---|
| Days + times | `services[0].operating_hours.default[]` → `{days, start, end}` | mo–fr 05:00–22:00 · sa 05:30–22:00 · su 06:30–21:00 (three bands) |
| Day rule | additional `default[]` entry | e.g., later start on Sundays |
| Date exception | `…operating_hours.exceptions[]` → `{date, start, end}` | concrete dates (v0.1.0 shape) |

### 6 — What does it cost?

```
┌────────────────────────────────┐
│ ○○○○○●○○○       MSD · Describe │
│                                │
│  What does it cost?            │
│                                │
│  Currency           [ UGX ▾ ]  │
│                                │
│  Typical fare (short hop)      │
│  [   1,500  ] UGX  off-peak    │
│                                │
│  Different by route or time?   │
│  [ + Add a fare rule ]         │
│                                │
│  How do riders pay?            │
│  [✓] Cash                      │
│   mobile money isn't a listed  │
│   value — leave it unticked    │
│                                │
│  [ ← ]              [ Next → ] │
└────────────────────────────────┘
```

| UI element | Schema path | Example |
|---|---|---|
| Currency | `fare_structures[0].currency` | `UGX` |
| Typical fare | `…fare_structures[0].rules[0]` → `{description, conditions, price}` | 1,500 (short hop, off-peak) |
| Fare rule | additional `rules[]` entry with `conditions` | route- or zone-dependent |
| Payment | `fare_structures[0].payment_methods[]` | `cash_in_vehicle` only; mobile money is not a registry value, so it is not asserted |

### 7 — How do riders board?

```
┌────────────────────────────────┐
│ ○○○○○○●○○       MSD · Describe │
│                                │
│  How do riders board?          │
│                                │
│  Do riders book in advance?    │
│  ( ) Yes        (•) No         │
│                                │
│  Booking channels (if any)     │
│  [ ] Phone  [ ] App  [ ] Email │
│   walk-up / hail-and-ride has  │
│   no listed channel — leave    │
│   all unticked (fill-and-go)   │
│                                │
│  ID required to ride?          │
│  (•) None                      │
│                                │
│  [ ← ]              [ Next → ] │
└────────────────────────────────┘
```

| UI element | Schema path | Example |
|---|---|---|
| Advance booking | `booking_rules.advance_booking.{minimum_minutes, maximum_days}` | "No" → both `null` |
| Channels | `booking_rules.booking_channels[]` | omitted — walk-up/hail-and-ride has no registry value; the empty field is itself the fill-and-go signal |
| Passenger ID | `booking_rules.passenger_identification` | `none_required` |

### 8 — Check and validate

```
┌────────────────────────────────┐
│ ○○○○○○○●○       MSD · Describe │
│                                │
│  Check your description        │
│                                │
│  Provider   ✓   Area  ✓ (3)    │
│  Vehicles   ✓   Hours ✓        │
│  Fares      ✓   Boarding ✓     │
│                                │
│  🔒 Checked on this phone —    │
│     nothing is uploaded.       │
│                                │
│        [  VALIDATE  ]          │
│                                │
│  ── after tap ──────────────── │
│  ✅ PASS — valid MSD v0.1.0    │
│                                │
│  (failure example)             │
│  ✗ First departure needs a     │
│    time like 05:30  [Fix → 5]  │
│    ▸ technical detail          │
│      /services/0/operating_    │
│      hours/default/0/start:    │
│      must match pattern        │
└────────────────────────────────┘
```

Validation is conceptually the same pure core (`validateMsd(doc, { schema, registry })`) used by the CLI, CI and the hosted validator — one validation path, identical error format (`instancePath: message`); the plain-language line and the jump link are additions, not a replacement.

### 9 — Use your file

```
┌────────────────────────────────┐
│ ○○○○○○○○●       MSD · Describe │
│                                │
│  Use your file                 │
│                                │
│  ┌──────────────────────────┐  │
│  │      ·         ·         │  │
│  │   ·      (stage dots,    │  │
│  │           no basemap)    │  │
│  └──────────────────────────┘  │
│  ( ) Show OpenStreetMap        │
│      background — uses data    │
│                                │
│  [ ⬇  Save MSD file (.json) ]  │
│  [ ⬇  GTFS-Flex feed (.zip) ]  │
│  [ ↗  Share…               ]   │
│                                │
│  Your file. You decide when —  │
│  and with whom — to share it.  │
│                                │
│  [ ← ]              [ Done ]   │
└────────────────────────────────┘
```

Both outputs already exist: the service-area map (no basemap by default, OpenStreetMap on explicit opt-in) and the in-browser GTFS-Flex feed download are deployed in the hosted validator today. Sharing is a separate, deliberate act — the flow produces a file, not a registry entry and not an upload.

---

## What these screens deliberately do not show

- **Expressiveness gaps.** Several characteristics of informal operations are documented as not yet expressible in v0.1.0; they are intentionally *not* drawn here. See `docs/coverage-gap-matrix.md` and `docs/v0.2.0-candidates.md` for the documented findings and candidates.
- **Verification.** Validation checks schema conformance, not truth. A low production barrier does not lower the need for consumers — including authorities — to plausibility-check declared data.
- **Usability evidence.** This is a design illustration; no user study has been conducted.

## Provenance and method (brief)

Grounded in widely used practice: the Principles for Digital Development; the mobile-money interaction idiom (short steps, amount-centred, review-then-confirm); the "one thing per page" form pattern; WCAG-level touch and contrast baselines; offline-first operation; Open Location Code for addressing without street names; and the established sector practice of smartphone-based informal-transport mapping by local teams. Field shapes follow the published example files in this repository.

---

*Reference producer flow — schematic, non-normative. Part of the MSD documentation.*
