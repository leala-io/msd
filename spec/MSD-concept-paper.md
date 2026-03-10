# MSD: Mobility Service Description

## A Declarative Standard for Mobility Services

**Version:** 0.1.0-draft  
**Date:** 2026-03-06  
**Author:** Thomas Teichmüller, Leap and Land  
**License:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)  
**Status:** Concept Paper — Request for Comments

---

## Abstract

MSD (Mobility Service Description) is a proposed open standard that enables any mobility service provider to describe their complete service offering — including service areas, vehicle types, fare structures, booking rules, and settlement parameters — as a single, machine-readable JSON configuration file. Unlike existing standards that require providers to operate real-time APIs, MSD is declarative: a static file that any conforming engine can interpret to discover, price, book, and settle trips across heterogeneous mobility services without bilateral integration.

MSD fills a gap that no existing standard addresses: GTFS describes timetables for scheduled services, GBFS describes shared vehicle availability, TOMP-API defines booking interfaces between operators and MaaS providers, and NeTEx models public transport networks. None of these enable a small on-demand provider — such as a community bus, bike-sharing cooperative, or parking operator — to make their full service bookable through any platform by publishing a single file. MSD proposes to do exactly that.

---

## 1. Problem Statement

### 1.1 The Integration Barrier

In multimodal mobility ecosystems, integrating a new service provider into a booking platform currently requires bilateral technical agreements. Each integration involves mapping the provider's specific data model to the platform's expectations, negotiating API contracts, implementing authentication, handling error cases, and maintaining synchronization. This process typically takes months and costs tens to hundreds of thousands of francs per integration.

For large operators (national railways, urban transit authorities), this cost is justified by transaction volume. For small and medium providers — community buses, regional bike-sharing, on-demand shuttles, parking operators, car-sharing cooperatives — it is prohibitive. The result is a mobility landscape where the largest operators dominate digital platforms while smaller, often more innovative services remain invisible to multimodal journey planners and booking engines.

This barrier is even more acute for the millions of informal transport operators worldwide — minibuses, motorcycle-taxis, shared ride services — that provide the majority of public transport in many cities across Africa, Asia, and Latin America (ITF, 2025). These services, which often arise from a bottom-up planning process to serve demand unmet by institutional public transport, currently have no standardised way to describe their offerings to journey planners, booking platforms, or public authorities.

### 1.2 The Standards Gap

The current mobility data standards landscape covers substantial ground but leaves a critical gap:

**Scheduled services** are well served: GTFS (and its European counterpart NeTEx) describe timetables, routes, stops, and increasingly fares. Over 10,000 transit operators worldwide publish GTFS feeds.

**Shared vehicle status** is covered: GBFS (General Bikeshare Feed Specification) describes real-time availability of shared bikes, scooters, and other vehicles at stations or in free-floating zones. GBFS 3.0 expanded to cover all shared mobility types.

**Booking interfaces** are defined: TOMP-API (Transport Operator to MaaS Provider API) specifies how a MaaS platform communicates with a transport operator to plan, book, and execute trips. OSDM (Open Sales and Distribution Model) standardises rail ticket distribution.

**Regulatory reporting** is addressed: MDS (Mobility Data Specification) enables cities to collect operational data from shared mobility providers for regulation and planning.

What is missing is a **declarative service description layer**: a standard that allows any provider to say, in a single machine-readable file: "This is what I offer, where I offer it, what it costs, how to book it, and how to settle payments." This file would be interpretable by any conforming engine — a MaaS platform, a journey planner, a municipal data portal, or a national mobility data infrastructure — without requiring the provider to build and maintain a real-time API.

### 1.3 Real-World Example

Consider a community bus service operating in a rural Swiss region. It covers three valleys, operates on-demand between 06:00 and 22:00, charges CHF 5 per trip within a zone and CHF 8 between zones, offers a 50% discount for holders of a Half-Fare Card, accepts passengers with wheelchairs in two of its five vehicles, and requires bookings at least 30 minutes in advance.

Today, this service cannot be discovered, priced, or booked through any national platform without a custom integration costing more than its annual IT budget. With MSD, the operator would publish a JSON file describing all these parameters. Any MSD-conforming engine could then include this service in multimodal journey plans, calculate the correct fare, and initiate a booking — all from a static file hosted on any web server, updated whenever the operator's conditions change.

---

## 2. Design Principles

MSD is guided by five core principles, derived from analysis of successful open mobility standards (GTFS, GBFS, MDS) and the specific needs of underserved mobility providers:

### 2.1 Declarative Over Imperative

MSD files describe what a service offers, not how to interact with it programmatically. The provider declares their service parameters; the consuming engine interprets them. This eliminates the need for providers to operate API servers, reducing the technical barrier to the level of publishing a JSON file on a web server — the same level required for a GTFS feed.

### 2.2 Complete Service Description

A single MSD file contains everything needed to discover, understand, price, and initiate booking of a mobility service: geographic coverage, operating hours, vehicle types and capacities, fare structures (including conditional pricing, discounts, and subscriptions), booking rules (advance notice, cancellation policies), accessibility features, and settlement parameters. No additional data source is required for basic integration.

### 2.3 Interoperability by Design

MSD is designed to complement, not replace, existing standards. An MSD file can reference GTFS feeds for scheduled components, GBFS endpoints for real-time availability, and TOMP-API endpoints for booking execution. MSD serves as the "table of contents" for a mobility service, linking to deeper data sources where they exist while remaining self-sufficient where they do not.

### 2.4 Progressive Complexity

The simplest valid MSD file describes a basic service with flat pricing. More complex services can express zone-based fares, time-dependent pricing, user category discounts, multi-leg trips, and dynamic capacity. Providers start simple and add complexity as their digital maturity grows. A bike-sharing cooperative with 20 bikes and a national railway with 10,000 daily services both use the same format, at different levels of detail.

### 2.5 Vendor Neutrality

MSD is not tied to any specific platform, routing engine, ticketing system, or national infrastructure. It is designed to work with open-source routing engines (OpenTripPlanner, MOTIS, Navitia), commercial platforms (HAFAS, Mentz EFA), national data infrastructures (Swiss NADIM, EU National Access Points), and independent MaaS providers equally. No single organisation controls which MSD files are valid or who may consume them.

---

## 3. Proposed Data Model

### 3.1 Top-Level Structure

An MSD file is a JSON document with the following top-level structure:

```json
{
  "msd_version": "0.1.0",
  "last_updated": "2026-03-06T10:00:00Z",
  "ttl": 86400,
  "provider": { },
  "services": [ ],
  "fare_structures": [ ],
  "booking_rules": { },
  "settlement": { },
  "routing_hints": { },
  "references": { }
}
```

### 3.2 Provider Information

```json
{
  "provider": {
    "provider_id": "ch-mybuxi-emmental",
    "name": "mybuxi Emmental",
    "description": "On-demand community bus service in the Emmental region",
    "url": "https://mybuxi.ch",
    "contact_email": "info@mybuxi.ch",
    "country": "CH",
    "languages": ["de", "fr"],
    "legal_entity": {
      "name": "mybuxi Genossenschaft",
      "registration_id": "CHE-123.456.789",
      "vat_id": "CHE-123.456.789 MWST"
    }
  }
}
```

### 3.3 Service Definition

Each service within a provider describes a distinct mobility offering:

```json
{
  "services": [
    {
      "service_id": "emmental-ondemand",
      "service_type": "on_demand",
      "name": "mybuxi Emmental On-Demand",
      "mode": "bus",
      "operating_hours": {
        "default": [
          { "days": ["mo","tu","we","th","fr"], "start": "06:00", "end": "22:00" },
          { "days": ["sa","su"], "start": "08:00", "end": "20:00" }
        ],
        "exceptions": [
          { "date": "2026-12-25", "closed": true },
          { "date": "2026-08-01", "start": "10:00", "end": "18:00" }
        ]
      },
      "service_area": {
        "type": "zones",
        "zones": [
          {
            "zone_id": "emmental-nord",
            "name": "Emmental Nord",
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[7.58, 46.95], [7.65, 46.95], [7.65, 47.00], [7.58, 47.00], [7.58, 46.95]]]
            }
          },
          {
            "zone_id": "emmental-sued",
            "name": "Emmental Süd",
            "geometry": {
              "type": "Polygon",
              "coordinates": [[[7.58, 46.90], [7.65, 46.90], [7.65, 46.95], [7.58, 46.95], [7.58, 46.90]]]
            }
          }
        ],
        "constraints": [
          {
            "type": "relation_restriction",
            "description": "No trips within Burgdorf town centre (address-based service only in rural areas)",
            "origin_zone": "burgdorf-zentrum",
            "destination_zone": "burgdorf-zentrum",
            "rule": "deny"
          },
          {
            "type": "service_mode_restriction",
            "description": "Stop-based service only within town centres",
            "zone": "burgdorf-zentrum",
            "pickup_type": "stop_only"
          }
        ]
      },
      "vehicles": [
        {
          "vehicle_type_id": "minibus-standard",
          "name": "Minibus",
          "capacity": {
            "seats": 8,
            "wheelchair": 0,
            "child_seats": 2,
            "stroller_spaces": 1,
            "luggage_capacity": "medium"
          },
          "propulsion": "electric",
          "count": 3
        },
        {
          "vehicle_type_id": "minibus-accessible",
          "name": "Minibus (accessible)",
          "capacity": {
            "seats": 6,
            "wheelchair": 1,
            "child_seats": 1,
            "stroller_spaces": 1,
            "luggage_capacity": "medium"
          },
          "propulsion": "electric",
          "count": 2
        }
      ],
      "safety": {
        "driver_identification": true,
        "vehicle_tracking_available": true,
        "trip_sharing_available": false,
        "emergency_button": false,
        "cctv_onboard": false,
        "lit_pickup_points": false,
        "safety_training_for_drivers": true,
        "reporting_mechanism": {
          "available": true,
          "channels": ["app", "phone"],
          "anonymous_reporting": true
        }
      },
      "accessibility": {
        "wheelchair_accessible_vehicles": true,
        "audio_announcements": false,
        "booking_assistance_available": true
      }
    }
  ]
}
```

**Vehicle capacity** includes optional fields for `child_seats` (number of installed child seats), `stroller_spaces` (spaces for prams/buggies), and `luggage_capacity` (enumeration: `none`, `small`, `medium`, `large`). These fields address documented evidence from the ITF (International Transport Forum) that travel with children and luggage — predominantly undertaken by women — is systematically underserved by existing mobility data standards. NeTEx defines corresponding fields (`PushchairCapacity`, `LuggageCapacity` in PASSENGER CAPACITY) that MSD maps to directly.

**The optional `safety` object** enables providers to declare safety-relevant features of their service. Research compiled by the ITF shows that safety is the dominant factor in transport mode choice for women — ahead of price, speed, or comfort. No existing mobility standard provides machine-readable safety declarations. The `safety` object covers driver identification, vehicle tracking, trip sharing (allowing passengers to share their live trip with trusted contacts), emergency features, CCTV, lighting at pickup points, driver training, and harassment reporting mechanisms. All fields are optional; the simplest valid MSD file has no `safety` object.

### 3.4 Service Constraints

The optional `constraints` array within `service_area` enables providers to express negative logic — relationships and conditions where service is restricted or prohibited. This addresses a real-world requirement identified through analysis of existing DRT routing systems (notably HAFAS's `*AT`-matrix and exclusive polygon model): many on-demand services operate in a region but with restrictions within certain sub-areas.

Typical constraint types include:

- **`relation_restriction`**: Prohibits or restricts trips between specific origin/destination zone pairs. Example: A regional on-demand service that provides door-to-door service in rural areas but may not operate intra-city trips within towns that have their own local transit.
- **`service_mode_restriction`**: Changes the pickup/dropoff mode within a zone. Example: Address-based pickup in rural zones but stop-based pickup only within town centres.
- **`exclusive_zone`**: Marks a zone as excluded from the general service area. Example: A service covers an entire district except for a military zone or airport restricted area.

Constraints are optional. The simplest valid MSD file has no constraints — zones define where the service operates, and the service operates everywhere within them. Constraints add precision for providers whose real-world operating rules require it.

### 3.5 Fare Structures

MSD fare structures support flat fares, zone-based pricing, time-based pricing, distance-based pricing, conditional discounts, subscription products, group pricing, and credential acceptance declarations.

#### 3.5.1 Basic Fare Rules

A fare structure contains `rules` for single-trip pricing based on conditions such as zone crossings, distance, time of day, or user category:

```json
{
  "fare_structures": [
    {
      "fare_id": "standard-zone",
      "service_ids": ["emmental-ondemand"],
      "currency": "CHF",
      "rules": [
        {
          "description": "Single trip within one zone — adult",
          "conditions": { "zone_crossing": 0, "user_category": "adult" },
          "price": 6.00
        },
        {
          "description": "Single trip crossing one zone boundary — adult",
          "conditions": { "zone_crossing": 1, "user_category": "adult" },
          "price": 8.00
        }
      ],
      "discounts": [
        {
          "discount_id": "half-fare",
          "name": "Swiss Half-Fare Card",
          "type": "percentage",
          "value": 50,
          "conditions": {
            "requires_credential": "ch-halbtax",
            "applicable_to": ["standard-zone"]
          }
        },
        {
          "discount_id": "child",
          "name": "Children 6-16",
          "type": "percentage",
          "value": 50,
          "conditions": {
            "age_min": 6,
            "age_max": 16
          }
        },
        {
          "discount_id": "free-child",
          "name": "Children under 6",
          "type": "free",
          "conditions": {
            "age_max": 5,
            "note": "Free when accompanied by paying adult"
          }
        }
      ],
      "payment_methods": ["invoice", "twint", "credit_card"],
      "vat_rate": 7.7,
      "vat_included": true
    }
  ]
}
```

The `user_category` field in conditions allows fare differentiation by passenger type. Providers define their own categories (e.g., `"adult"`, `"youth_under_26"`, `"senior"`) as free-text identifiers. This extends beyond the age-based discount model by allowing category-specific base prices, not just discounts on a single base price.

#### 3.5.2 Fare Eligibility

Real-world mobility services frequently operate multiple fare structures for different user groups — not as discounts on a single base fare, but as entirely separate price lists. For example, a community bus may offer reduced fares to residents of co-funding municipalities, association members, or passengers travelling to partner locations, while charging a higher "standard" fare to all others.

The optional `eligibility` object on a fare structure declares who qualifies for that fare:

```json
{
  "fare_structures": [
    {
      "fare_id": "reduced-members",
      "eligibility": {
        "requires_any_of": [
          { "type": "municipality_residence", "values": ["Affoltern i.E.", "Heimiswil"] },
          { "type": "membership", "organisation": "Verein mybuxi Emmental" },
          { "type": "partner_trip", "description": "Trip to/from a partner stop" }
        ]
      },
      "rules": [
        { "conditions": { "zone_crossing": 0, "user_category": "adult" }, "price": 6.00 }
      ]
    },
    {
      "fare_id": "standard",
      "eligibility": { "default": true },
      "rules": [
        { "conditions": { "zone_crossing": 0, "max_passengers": 6 }, "price": 25.00 }
      ]
    }
  ]
}
```

When no `eligibility` object is present, the fare structure applies to all passengers (backward compatible with the simplest valid MSD file). When multiple fare structures have eligibility conditions, the consuming engine evaluates them in order and applies the first match; the structure with `"default": true` serves as the fallback.

Eligibility types include `municipality_residence` (passenger lives in a specified area), `membership` (passenger belongs to a named organisation), `partner_trip` (trip origin or destination is a designated partner location), and `credential` (passenger holds a specific entitlement such as a subscription card). Providers may define additional eligibility types using the `x-` extension prefix.

#### 3.5.3 Group Pricing

Some services charge per trip rather than per passenger, up to a maximum group size. The optional `max_passengers` field in fare rule conditions expresses this:

```json
{
  "rules": [
    {
      "description": "Single trip up to 6 passengers — 1 zone",
      "conditions": { "zone_crossing": 0, "max_passengers": 6 },
      "price": 25.00
    }
  ]
}
```

When `max_passengers` is present, the price applies to the entire group. When absent, the price applies per individual passenger (the default). This covers the common pattern of taxi-like flat fares for small on-demand vehicles where the vehicle is booked as a unit.

#### 3.5.4 Subscription Products

Many providers offer passes and subscriptions alongside single-trip fares: day passes, multi-ride cards, monthly or annual subscriptions, in both personal (non-transferable) and transferable variants. The optional `products` array within a fare structure describes these:

```json
{
  "products": [
    {
      "product_id": "day-pass-adult",
      "name": "Day Pass",
      "type": "day_pass",
      "price": 30.00,
      "conditions": { "user_category": "adult" }
    },
    {
      "product_id": "10-ride-adult-1zone",
      "name": "10-Ride Card (1 zone)",
      "type": "multi_ride",
      "rides": 10,
      "price": 60.00,
      "conditions": { "zone_crossing": 0, "user_category": "adult" }
    },
    {
      "product_id": "monthly-personal",
      "name": "Monthly Pass (personal)",
      "type": "monthly_pass",
      "price": 120.00,
      "transferable": false,
      "conditions": { "user_category": "adult" }
    },
    {
      "product_id": "annual-transferable",
      "name": "Annual Pass (transferable)",
      "type": "annual_pass",
      "price": 1499.00,
      "transferable": true
    }
  ]
}
```

Product types include `day_pass`, `multi_ride`, `weekly_pass`, `monthly_pass`, `annual_pass`, and `custom`. The `transferable` field (default: `false`) indicates whether the product is bound to a named individual or may be used by any bearer. Products inherit the `eligibility` and `currency` of their parent fare structure.

#### 3.5.5 Credential Acceptance

Mobility services may or may not accept standard credentials such as national travelcards or regional passes. While the `discounts` array declares positive credential effects (e.g., "Halbtax gives 50% discount"), the optional `credential_acceptance` object provides an explicit declaration of which credentials are and are not accepted:

```json
{
  "credential_acceptance": {
    "ch-halbtax": true,
    "ch-ga": false,
    "ch-verbund-libero": false
  }
}
```

A value of `true` means the credential is accepted and its effect is described in the `discounts` array. A value of `false` means the credential is explicitly not accepted — the provider has made a conscious decision not to honour it. Credentials not listed are unknown (the provider has not declared a position).

This three-state model (accepted / rejected / undeclared) is important for consuming engines: a journey planner can display "Halbtax not accepted" to a passenger rather than silently omitting a discount, and a MaaS platform can filter services by credential acceptance.

### 3.6 Booking Rules

```json
{
  "booking_rules": {
    "advance_booking": {
      "minimum_minutes": 30,
      "maximum_days": 7
    },
    "cancellation": {
      "free_cancellation_minutes": 15,
      "late_cancellation_fee": 3.00
    },
    "booking_channels": [
      { "type": "app", "url": "https://mybuxi.ch/app" },
      { "type": "phone", "number": "+41 34 123 45 67", "hours": "Mo-Fr 06:00-22:00", "languages": ["de", "fr"] },
      { "type": "web", "url": "https://mybuxi.ch/booking" },
      { "type": "in_person", "location": "Emmentaler Schaukäserei", "hours": "Mo-Sa 09:00-17:00" }
    ],
    "booking_confirmation": "immediate",
    "passenger_identification": "none_required",
    "multi_stop": {
      "supported": true,
      "max_intermediate_stops": 3,
      "max_wait_time_minutes": 10,
      "passenger_change_allowed": true
    },
    "group_booking": {
      "supported": true,
      "max_group_size": 6,
      "child_accompaniment_rules": {
        "min_adult_age": 16,
        "max_children_per_adult": 4
      }
    }
  }
}
```

**Structured booking channels:** The `booking_channels` field accepts either a simple string array (backward compatible: `["app", "phone"]`) or an array of channel objects with metadata such as phone numbers, opening hours, and language availability. ITF research documents a gender-specific digital divide in transport access — telephone and in-person booking channels are not legacy features but inclusion requirements. The structured format enables journey planners to display actionable booking information rather than bare channel names.

**Multi-stop booking:** The optional `multi_stop` object declares whether the service supports trip chaining — picking up and dropping off passengers at intermediate stops within a single booking. This addresses the "Mobility of Care" pattern documented by the ITF: complex trip chains combining work, childcare, shopping, and escort trips that do not follow the commuter A-to-B model. `passenger_change_allowed` indicates whether passengers may board or alight at intermediate stops (relevant for shared rides).

**Group booking:** The optional `group_booking` object declares group size limits and child accompaniment rules. `child_accompaniment_rules` specifies the minimum adult age for accompanying children and how many children may travel per adult — rules that most on-demand and community transport services have but currently communicate only in free-text terms and conditions.

### 3.6.1 Transfer Policy

The optional `transfer_policy` object within `fare_structures` declares how multi-modal or multi-leg trips are priced when passengers transfer between services or modes:

```json
{
  "transfer_policy": {
    "free_transfers_within_minutes": 60,
    "max_transfers": 3,
    "transfer_modes": ["bus", "sharing"]
  }
}
```

Research on the "Pink Tax in Transport" (NYU, cited by ITF) documents that complex trip patterns — predominantly undertaken by women — result in systematically higher transport costs when each leg is priced independently. The `transfer_policy` enables providers to declare transfer windows and eligible modes, allowing consuming engines to calculate integrated fares across trip chains. A provider declaring `"free_transfers_within_minutes": 60` signals that a passenger who arrives by on-demand bus and continues by bike-sharing within 60 minutes pays only once.

### 3.7 Settlement Parameters

```json
{
  "settlement": {
    "model": "postpaid",
    "settlement_period": "monthly",
    "commission_structure": {
      "type": "percentage",
      "value": 5.0,
      "note": "Platform commission on ticket revenue"
    },
    "billing_contact": "billing@mybuxi.ch",
    "supported_settlement_protocols": ["invoice", "sepa"]
  }
}
```

### 3.8 References to Existing Standards

```json
{
  "references": {
    "gtfs_feed_url": null,
    "gbfs_feed_url": null,
    "tomp_api_url": null,
    "real_time_endpoint": "https://api.mybuxi.ch/v1/availability",
    "info_url": "https://mybuxi.ch/fahrplan",
    "terms_url": "https://mybuxi.ch/agb"
  }
}
```

### 3.9 Routing Hints

The optional `routing_hints` object provides metadata that helps consuming engines integrate an on-demand service into multimodal journey planning. These hints are not routing instructions — they are declarative parameters that an engine may use to calibrate how this service competes with or complements scheduled public transport.

This section addresses a real-world challenge documented in existing DRT routing systems: when on-demand services are integrated into multimodal journey planners alongside scheduled public transport, the router needs guidance on when to prefer one over the other. Without such guidance, an on-demand service that offers door-to-door convenience may systematically displace scheduled services, even when the scheduled service is faster, cheaper, or more resource-efficient.

```json
{
  "routing_hints": {
    "travel_time_factor": 1.2,
    "travel_time_source": "gis_router",
    "transfer_penalty_equivalent": 2,
    "line_service_preference": {
      "threshold_minutes": 10,
      "minimum_advantage_percent": 20,
      "description": "Only suggest this on-demand service if it is at least 20% faster than a scheduled connection within 10 minutes"
    }
  }
}
```

**Field semantics:**

- **`travel_time_factor`**: A multiplier applied to GIS-calculated travel times to account for detours due to ride-pooling, boarding time, and non-direct routing. A factor of 1.2 means "expect 20% longer than straight driving time." This mirrors the `*T`-factor concept in existing DRT routing implementations.
- **`travel_time_source`**: Whether travel time should be calculated by a GIS router (`gis_router`) or derived from provider-supplied estimates (`provider_estimate`). Some services have fixed travel times between stops that should not be overridden by a routing engine.
- **`transfer_penalty_equivalent`**: An integer expressing how many additional transfers the engine should add when comparing this service against scheduled alternatives. A value of 2 means "treat using this service as if it adds 2 transfers to the journey." This discourages the router from preferring on-demand service for trips well-served by scheduled transport.
- **`line_service_preference`**: A structured rule expressing when scheduled public transport should be preferred. This allows the provider (or a regulatory authority) to declare that on-demand service should only appear in results when it offers a meaningful advantage over existing scheduled services.

Routing hints are advisory, not mandatory. An engine may ignore them, apply them partially, or implement its own competitive balancing logic. Their purpose is to capture operational knowledge that the provider has about how their service should relate to the broader transport network — knowledge that would otherwise need to be hardcoded into each consuming engine.

---

## 4. Relationship to Existing Standards

### 4.1 Standards Landscape

| Standard | Scope | Format | MSD Relationship |
|----------|-------|--------|-----------------|
| **GTFS** | Scheduled transit timetables | CSV files | MSD references GTFS feeds; covers non-scheduled services GTFS cannot describe |
| **GBFS** | Shared vehicle availability | JSON API | MSD describes the service parameters; GBFS provides real-time status |
| **NeTEx** | European public transport data exchange | XML (CEN standard) | MSD is simpler and JSON-based; NeTEx-compatible mapping is a roadmap goal |
| **TOMP-API** | MaaS-to-operator booking API | REST API (OpenAPI) | MSD describes what TOMP-API connects to; MSD files can auto-generate TOMP operator info |
| **OSDM** | Rail ticket distribution | REST API | MSD covers non-rail services; rail references can link to OSDM endpoints |
| **MDS** | Shared mobility regulatory reporting | REST API | Different audience (cities vs. platforms); complementary data perspectives |
| **SIRI** | Real-time public transport information | XML | MSD is static description; SIRI provides real-time operational data |

### 4.2 Design Philosophy: Complement, Not Compete

MSD explicitly does not attempt to replace any existing standard. Instead, it occupies the space between them: a service description layer that enables discovery and basic integration for services that currently fall through the gaps of the existing landscape.

A provider that already publishes GTFS need not create an MSD file for their scheduled services. But if the same provider also operates an on-demand shuttle that has no GTFS representation, MSD can describe that shuttle — and link back to the GTFS feed for the scheduled services.

### 4.3 Complementary Data Ecosystems

Several initiatives have mapped informal transport networks and published them as open GTFS data: Digital Transport 4 Africa (DT4A), DigitalMatatus in Nairobi, Transport for Cairo, and Mapatón CDMX. These efforts capture routes and stops but not service descriptions: fares, vehicle types, booking rules, and operating conditions. MSD complements these mapping efforts by providing the service description layer that GTFS cannot express. An informal transport operator whose routes have been mapped by DT4A could publish an MSD file describing fares, vehicle capacities, and booking channels — completing the information needed for multimodal integration.

---

## 5. Use Cases

### 5.1 Regional Multimodal Integration (Switzerland)

A canton in Switzerland wants to enable combined journey planning across PostAuto (regional bus), mybuxi (on-demand community bus), a local bike-sharing cooperative, and two parking operators. Currently, only PostAuto is available in the SBB journey planner via HRDF/GTFS. With MSD, each smaller provider publishes a file describing their service. A regional journey planner can ingest all MSD files and offer complete multimodal routing — without any provider needing to build an API.

### 5.2 National Mobility Data Infrastructure (NADIM/MODI)

Switzerland's planned MODI (Mobilitätsdateninfrastruktur) aims to enable standardised data exchange for mobility services. MSD files could serve as the standardised format for describing mobility services within NADIM — particularly for the "last 20%" of providers too small for bilateral NOVA integration. KOMODA (the planned competence centre) would not need to define this format from scratch; it could adopt an existing, internationally developed open standard.

### 5.3 International MaaS Expansion

A ticketing provider operating across multiple countries (e.g., Fairtiq in Switzerland, Denmark, France, Austria, Germany, Czech Republic) currently integrates each regional partner's fare system bilaterally. If partners published MSD files, the ticketing provider could auto-configure fare calculation for new regions, reducing onboarding time from months to days.

### 5.4 EU National Access Point Compliance

EU Delegated Regulation 2017/1926 (MMTIS) requires Member States to make multimodal travel information accessible through National Access Points. MSD files, published alongside existing NeTEx/SIRI data, could cover demand-responsive and shared mobility services that are currently underrepresented in NAP data — helping countries meet their regulatory obligations for comprehensive multimodal information.

### 5.5 Informal Transport Integration

In cities across Africa, Asia, and Latin America, privately organised transport services — minibuses, motorcycle-taxis, shared rides — provide the majority of public transport trips. In Mexico City, including these services in accessibility calculations increases the reachable population within 30 minutes by 54%; in Bogotá by 35% (ITF, 2025). These services currently have no standardised way to describe what they offer. GTFS mapping initiatives (DigitalMatatus, DT4A, Transport for Cairo) capture routes and stops, but not service parameters: fares, booking rules, vehicle capacities, safety features, or operating conditions.

MSD enables these providers — whether individual owner-operators, cooperatives, or app-based platforms — to publish a single JSON file describing their complete service offering. A transport authority integrating informal services into a formal network (as Jakarta did with Mikrotrans feeders for the Transjakarta BRT, or Mexico City's Semovi does through its modernisation program) could use MSD files as the standardised interface for service description, fare integration, and quality benchmarking — without requiring providers to build APIs.

---

## 6. Technical Approach

### 6.1 Format

MSD uses JSON as its data format, following the precedent set by GBFS (which chose JSON for its simplicity and broad tooling support) and learning from GTFS's success with its deliberately low technical barrier (CSV files).

### 6.2 Schema Validation

MSD files are validated against a JSON Schema. The schema is published alongside the specification and versioned with semantic versioning (MAJOR.MINOR.PATCH). A reference validator will be provided as open-source software.

### 6.3 Distribution

MSD files are hosted as static files on any web server, CDN, or data portal. They can be registered in catalogues (national mobility data portals, NAPCORE, community registries) for discovery. No centralised hosting is required.

### 6.4 Versioning

The specification follows semantic versioning. MSD files declare their conformance version in the `msd_version` field. Consuming engines declare which MSD versions they support. Breaking changes increment the major version; new optional fields increment the minor version.

### 6.5 Extension Mechanism

MSD supports vendor extensions through a reserved `x-` prefix on field names. Extensions allow experimentation with new features without modifying the core specification. Successful extensions may be proposed for inclusion in future specification versions through the standard governance process.

---

## 7. Roadmap

### Phase 1: Foundation (2026 Q2-Q3)

- Publish this concept paper (establishing prior art)
- Develop JSON Schema v0.1.0 for core service description
- Build reference validator
- Create MSD files for 2-3 pilot providers (on-demand bus, bike-sharing, parking)
- Establish governance framework and GitHub repository

### Phase 2: Pilot (2026 Q3-Q4)

- Pilot region deployment (e.g., Emmental: mybuxi + bike-sharing + parking)
- Build proof-of-concept engine that interprets MSD files
- Develop automatic GTFS feed generator from MSD files
- Engage with potential technology partners (ticketing providers, routing engines)
- Submit to relevant working groups (ITS-CH, VSS, MobilityData)

### Phase 3: Community (2027)

- International governance setup (Eclipse Foundation, Open Mobility Foundation, or similar)
- First stable release (v1.0.0)
- TOMP-API adapter (auto-generate TOMP operator information from MSD files)
- NeTEx mapping documentation
- Engagement with EU NAPCORE and Swiss KOMODA/NADIM
- Community contributions from international providers
- Pilot application in informal transport contexts (in collaboration with DT4A, DigitalMatatus, or similar mapping initiatives)

---

## 8. How to Participate

MSD is developed as an open standard. All contributions are welcome:

- **Specification development**: Propose changes via GitHub Issues and Pull Requests
- **Pilot providers**: Describe your service as an MSD file; report what works and what is missing
- **Engine developers**: Build tools that consume MSD files; identify gaps in the schema
- **Standards experts**: Help align MSD with existing standards (NeTEx, TOMP-API, GBFS)
- **Policy advisors**: Connect MSD with national and European data infrastructure initiatives

Repository: `github.com/leala/msd` (to be published)  
Contact: Thomas Teichmüller — thomas@leapandland.ch  
Discussion: GitHub Discussions on the repository

---

## 9. License

This document is published under the **Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)**.

You are free to share and adapt this material for any purpose, including commercially, as long as you give appropriate credit and distribute your contributions under the same license.

All MSD reference implementations and tools are published under the **GNU Affero General Public License v3.0 (AGPL-3.0)**, ensuring that modifications to MSD engines deployed as network services remain open source.

---

## Appendix A: Comparison with Existing Approaches

| Characteristic | GTFS | GBFS | TOMP-API | NeTEx | **MSD** |
|---|---|---|---|---|---|
| **Service types** | Scheduled transit | Shared vehicles | Any (via API) | Scheduled transit | Any (declarative) |
| **Format** | CSV files | JSON endpoints | REST API (OpenAPI) | XML (CEN) | JSON file |
| **Provider requirement** | Generate CSV files | Operate API server | Operate API server | Generate XML | Publish JSON file |
| **Technical barrier** | Low | Medium | High | Very high | Very low |
| **Fare description** | Limited (Fares v2) | Pricing rules | Via booking flow | Comprehensive | Comprehensive |
| **Booking support** | No | No | Yes (full lifecycle) | No | Rules only (links to booking) |
| **Real-time data** | Via GTFS-RT | Yes (core feature) | Yes | Via SIRI | Optional reference |
| **Governance** | Community (MobilityData) | Community (MobilityData) | Working Group (NL) | CEN/TC 278 | Open (CC BY-SA + AGPL) |
| **Primary audience** | Transit agencies | Shared mobility operators | MaaS platforms | European transit | All mobility providers |

---

## Appendix B: Glossary

- **Declarative**: Describing what a service offers rather than how to interact with it programmatically
- **Engine**: Software that interprets MSD files to enable discovery, pricing, booking, or routing of mobility services
- **MaaS**: Mobility as a Service — integrated planning, booking, and payment of multimodal trips
- **NADIM**: Nationale Datenvernetzungsinfrastruktur Mobilität — Switzerland's planned national mobility data networking infrastructure
- **Provider**: An organisation offering one or more mobility services
- **Service**: A distinct mobility offering (e.g., an on-demand bus line, a bike-sharing system, a parking facility)
- **Virtualization**: The ability to sell, book, and settle trips for a service through a third-party platform without bilateral technical integration
- **Zone**: A geographic area within which a service operates or within which a specific fare applies

---

## Appendix C: Transmodel / NeTEx Entity Mapping

This appendix documents the conceptual mapping between MSD elements and their corresponding Transmodel (EN 12896) and NeTEx (CEN/TS 16614) entities. The mapping follows the conventions established by the DATA4PT GTFS-NeTEx mapping and the NeTEx liaison documents: Transmodel conceptual entities are shown in UPPER CASE, NeTEx XML implementation elements in CamelCase.

This mapping is intentionally at the conceptual level. MSD is a simplified, JSON-based declarative format; Transmodel/NeTEx is a comprehensive, XML-based exchange framework with inheritance hierarchies. The mapping documents semantic equivalence, not structural identity. A full bi-directional conversion tool is a Phase 3 roadmap item.

### C.1 Provider and Organisation

| MSD Element | MSD Path | Transmodel Entity | NeTEx Element | Notes |
|---|---|---|---|---|
| Provider | `provider` | OPERATOR / AUTHORITY | `Operator` / `Authority` | MSD collapses Transmodel's distinction between OPERATOR (runs services) and AUTHORITY (orders services). For most small providers, OPERATOR is the correct mapping. |
| Provider name | `provider.name` | OPERATOR.Name | `Operator/Name` | Direct mapping |
| Provider URL | `provider.url` | CONTACT DETAILS.Url | `Operator/ContactDetails/Url` | Transmodel separates contact details from the organisation entity |
| Contact email | `provider.contact_email` | CONTACT DETAILS.Email | `Operator/ContactDetails/Email` | Direct mapping |
| Legal entity | `provider.legal_entity` | ORGANISATION.CompanyNumber | `Operator/CompanyNumber` | MSD uses a nested object; NeTEx uses flat attributes on Organisation |
| Country | `provider.country` | LOCALE.Country | `Operator/Locale/Country` | Part of Transmodel's LOCALE concept |
| Languages | `provider.languages` | LOCALE.DefaultLanguage | `Operator/Locale/DefaultLanguage` | MSD supports multiple languages; NeTEx has DefaultLanguage + translations via `AlternativeText` |

### C.2 Service and Network

| MSD Element | MSD Path | Transmodel Entity | NeTEx Element | Notes |
|---|---|---|---|---|
| Service | `services[]` | LINE / FLEXIBLE LINE | `Line` / `FlexibleLine` | On-demand services map to FLEXIBLE LINE (EN 12896-2); scheduled services to LINE. MSD's `service_type` determines the mapping. |
| Service name | `services[].name` | LINE.Name | `Line/Name` | Direct mapping |
| Service type | `services[].service_type` | TYPE OF FLEXIBLE SERVICE | `FlexibleLine/FlexibleLineType` | MSD values (`on_demand`, `fixed_route`, `sharing`, `parking`) map to Transmodel's flexible service types: virtual line service, corridor service, fixed stop area-wide, free area-wide |
| Transport mode | `services[].mode` | VEHICLE MODE | `Line/TransportMode` + `TransportSubmode` | Transmodel distinguishes mode (bus, rail, water) from submode (communityBus, demandResponsive). MSD's flat `mode` field maps to both. |
| Operating hours | `services[].operating_hours` | OPERATING PERIOD / DAY TYPE / AVAILABILITY CONDITION | `DayType` + `OperatingPeriod` + `AvailabilityCondition` | Transmodel separates the concept of "when" into DAY TYPEs (logical: weekday, weekend), OPERATING PERIODs (calendar ranges), and AVAILABILITY CONDITIONs (combining both). MSD's simpler structure combines these into a single object. |
| Operating hours exceptions | `services[].operating_hours.exceptions` | DAY TYPE ASSIGNMENT | `DayTypeAssignment` | Maps specific calendar dates to availability. Transmodel uses PROPERTY OF DAY for classifications like "public holiday". |

### C.3 Service Area and Spatial Model

| MSD Element | MSD Path | Transmodel Entity | NeTEx Element | Notes |
|---|---|---|---|---|
| Service area | `services[].service_area` | FLEXIBLE ZONE / FLEXIBLE AREA | `FlexibleStopPlace` / `FlexibleArea` / `HailAndRideArea` | Transmodel's spatial model for flexible services uses FLEXIBLE STOP PLACE as the containing entity, with FLEXIBLE AREA or HAIL AND RIDE AREA for the geometry. |
| Zone | `services[].service_area.zones[]` | TARIFF ZONE / ZONE | `TariffZone` / `FareZone` | When zones define fare boundaries: TARIFF ZONE. When zones define operational areas: ZONE. MSD zones serve both purposes; the mapping depends on usage context. |
| Zone geometry | `services[].service_area.zones[].geometry` | ZONE.members (POINTs) / Polygon | `Zone/gml:Polygon` or `Zone/members` | Transmodel defines ZONEs as sets of POINTs; NeTEx also supports GML polygon geometry. MSD uses GeoJSON, which maps to GML with coordinate transformation. |
| Zone ID | `services[].service_area.zones[].zone_id` | ZONE.id | `TariffZone/@id` | Identifiers follow different conventions: MSD uses provider-scoped strings; NeTEx uses globally scoped IDs with CODESPACE. |
| Constraints | `services[].service_area.constraints[]` | ROUTING CONSTRAINT / FLEXIBLE ROUTE | `RoutingConstraintZone` | Transmodel's ROUTING CONSTRAINT ZONE defines areas where specific routing rules apply. MSD's `relation_restriction` maps to explicit origin/destination prohibitions; `service_mode_restriction` maps to BOOKING ARRANGEMENT constraints scoped to a ZONE. NeTEx also supports `FlexibleLine/BookWhen` and pickup/dropoff restrictions per area. |
| Routing hints | `routing_hints` | — | — | No direct Transmodel equivalent. Routing weight parameters (transfer penalties, time factors, line-service preference thresholds) are engine configuration, not transport data model entities. MSD declares these as provider-side metadata to enable interoperable engine calibration. Conceptually related to Transmodel's INTERCHANGE WEIGHTING but applied at service level rather than stop level. |

### C.4 Vehicles and Fleet

| MSD Element | MSD Path | Transmodel Entity | NeTEx Element | Notes |
|---|---|---|---|---|
| Vehicle type | `services[].vehicles[]` | VEHICLE TYPE | `VehicleType` | Direct conceptual mapping. Transmodel also has TRAIN (compound vehicle) which MSD does not model. |
| Capacity (seats) | `services[].vehicles[].capacity.seats` | PASSENGER CAPACITY.SeatingCapacity | `VehicleType/capacities/PassengerCapacity/SeatingCapacity` | Direct mapping |
| Wheelchair capacity | `services[].vehicles[].capacity.wheelchair` | PASSENGER CAPACITY.WheelchairPlaceCapacity | `VehicleType/capacities/PassengerCapacity/WheelchairPlaceCapacity` | Direct mapping |
| Propulsion | `services[].vehicles[].propulsion` | PROPULSION TYPE | `VehicleType/PropulsionType` | NeTEx v2.0 added PropulsionType with values including electric, hydrogen, diesel, etc. |
| Vehicle count | `services[].vehicles[].count` | (fleet management) | `FleetComposition` | Transmodel's fleet management is in Part 4 (Operations). MSD's simple count has no direct Transmodel equivalent at the planning level. |
| Accessibility | `services[].accessibility` | ACCESSIBILITY ASSESSMENT | `AccessibilityAssessment` | Transmodel uses a detailed assessment model with ACCESSIBILITY LIMITATION per feature. MSD uses boolean flags as simplified representation. |
| Child seats | `services[].vehicles[].capacity.child_seats` | PASSENGER CAPACITY | `PassengerCapacity` | No direct NeTEx equivalent at vehicle type level. MSD extension for care mobility. |
| Stroller spaces | `services[].vehicles[].capacity.stroller_spaces` | PASSENGER CAPACITY.PushchairCapacity | `PassengerCapacity/PushchairCapacity` | Direct mapping to NeTEx. Santiago de Chile bus fleet redesign (ITF 2019) motivated this field. |
| Luggage capacity | `services[].vehicles[].capacity.luggage_capacity` | PASSENGER CAPACITY.LuggageCapacity | `PassengerCapacity/LuggageCapacity` | Direct mapping to NeTEx. Enumeration: none, small, medium, large. |
| Safety features | `services[].safety` | — | — | No Transmodel equivalent. MSD-specific extension addressing ITF evidence that safety is the dominant factor in transport mode choice for women. Covers driver identification, vehicle tracking, CCTV, emergency features, lighting, and harassment reporting mechanisms. |

### C.5 Fare Structures

| MSD Element | MSD Path | Transmodel Entity | NeTEx Element | Notes |
|---|---|---|---|---|
| Fare structure | `fare_structures[]` | FARE STRUCTURE | `FareStructure` (abstract) | Transmodel's FARE STRUCTURE is the container concept. MSD's flat structure maps to the combination of FARE STRUCTURE ELEMENT + FARE TABLE + FARE PRICE. |
| Fare rule | `fare_structures[].rules[]` | FARE STRUCTURE ELEMENT | `FareStructureElement` | Each MSD rule corresponds to a FARE STRUCTURE ELEMENT with associated VALIDITY PARAMETERs (scoping to zones, time, etc.) and a FARE PRICE. |
| Zone crossing condition | `fare_structures[].rules[].conditions.zone_crossing` | GEOGRAPHICAL INTERVAL / TARIFF ZONE (scoping) | `GeographicalInterval` or `FareStructureElement/validityParameterAssignments` | Transmodel models zone-based fares through GEOGRAPHICAL INTERVAL (progressive fare) or SCOPING VALIDITY PARAMETER referencing TARIFF ZONEs. |
| Price | `fare_structures[].rules[].price` | FARE PRICE | `FarePrice/Amount` | Direct mapping. Transmodel also supports CELL prices within a FARE TABLE (matrix) for complex multi-dimensional pricing. |
| Currency | `fare_structures[].currency` | FARE PRICE.Currency | `FarePrice/Currency` | ISO 4217 currency code in both |
| Discount | `fare_structures[].discounts[]` | DISCOUNTING RULE / USAGE PARAMETER | `DiscountingRule` + `UserProfile` or `EntitlementRequired` | MSD discounts map to different Transmodel entities depending on type: age-based → USER PROFILE; credential-based (e.g., Halbtax) → ENTITLEMENT REQUIRED referencing an ENTITLEMENT PRODUCT. |
| User category discount | `fare_structures[].discounts[].conditions.age_min/max` | USER PROFILE | `UserProfile` with `MinimumAge` / `MaximumAge` | Transmodel's USER PROFILE is a detailed entity covering age, status (student, military), disability, etc. MSD uses simplified conditions. |
| Credential-based discount | `fare_structures[].discounts[].conditions.requires_credential` | ENTITLEMENT REQUIRED / ENTITLEMENT PRODUCT | `EntitlementRequired` referencing `EntitlementProduct` | E.g., Swiss Halbtax maps to an ENTITLEMENT PRODUCT "ch-halbtax" which is a prerequisite for applying the DISCOUNTING RULE. |
| Payment methods | `fare_structures[].payment_methods` | TYPE OF PAYMENT METHOD | `TypeOfPaymentMethod` | Transmodel defines this as an open enumeration |
| VAT | `fare_structures[].vat_rate` | FARE PRICE.VatRate | `FarePrice/VatRate` | Direct mapping (NeTEx Part 3) |
| Fare eligibility | `fare_structures[].eligibility` | VALIDITY PARAMETER / GROUP OF SALES OFFER PACKAGES | `GenericParameterAssignment` scoping a `FareStructure` | MSD's eligibility concept maps to Transmodel's scoping of fare structures to user groups, geographic conditions, or organisational membership. NeTEx uses SCOPING VALIDITY PARAMETER with references to USER PROFILE, GEOGRAPHICAL STRUCTURE FACTOR, or ENTITLEMENT REQUIRED. MSD simplifies this into a declarative eligibility object. |
| User category | `fare_structures[].rules[].conditions.user_category` | USER PROFILE | `UserProfile` | MSD user categories (e.g., `adult_26plus`, `youth_under_26`) map to NeTEx USER PROFILEs. Transmodel supports richer profiling (student, military, disability) — MSD uses free-text identifiers. |
| Group pricing | `fare_structures[].rules[].conditions.max_passengers` | GROUP TICKET / COMPANION PROFILE | `CompanionProfile` or `GroupTicket` | Transmodel models group travel through COMPANION PROFILE (who travels with whom) and GROUP TICKET (pricing for groups). MSD's `max_passengers` is a simplified expression covering the common "price per vehicle up to N passengers" pattern. |
| Subscription products | `fare_structures[].products[]` | SALES OFFER PACKAGE / PREASSIGNED FARE PRODUCT | `SalesOfferPackage` containing `PreassignedFareProduct` | Transmodel's SALES OFFER PACKAGE bundles fare products with conditions and distribution channels. MSD's `products` array is a simplified representation covering day passes, multi-ride cards, and period subscriptions. The `transferable` flag maps to NeTEx's `PersonalOrGroup` attribute. |
| Credential acceptance | `fare_structures[].credential_acceptance` | ENTITLEMENT REQUIRED (negation) | — | No direct NeTEx equivalent for explicit non-acceptance of credentials. NeTEx models which entitlements enable discounts (positive declaration) but does not standardise a mechanism to declare that a known entitlement is explicitly not honoured. MSD adds this for consumer-facing transparency. |

### C.6 Booking Rules

| MSD Element | MSD Path | Transmodel Entity | NeTEx Element | Notes |
|---|---|---|---|---|
| Booking rules | `booking_rules` | BOOKING ARRANGEMENT | `BookingArrangements` | Transmodel defines BOOKING ARRANGEMENT on FLEXIBLE LINE or SERVICE JOURNEY with attributes for minimum/maximum booking period, booking methods, etc. |
| Advance booking minimum | `booking_rules.advance_booking.minimum_minutes` | BOOKING ARRANGEMENT.MinimumBookingPeriod | `BookingArrangements/MinimumBookingPeriod` | NeTEx uses ISO 8601 duration (e.g., PT30M); MSD uses integer minutes |
| Advance booking maximum | `booking_rules.advance_booking.maximum_days` | BOOKING ARRANGEMENT.LatestBookingTime | `BookingArrangements/LatestBookingTime` | Transmodel expresses this differently: as a latest time rather than a maximum period |
| Booking channels | `booking_rules.booking_channels[]` | BOOKING METHOD | `BookingArrangements/BookingMethods` | MSD supports both simple string arrays and structured channel objects with phone numbers, hours, and languages. NeTEx enumeration: callDriver, callOffice, online, phoneAtStop, text, etc. MSD's structured format maps to BOOKING METHOD with additional CONTACT DETAILS. |
| Cancellation rules | `booking_rules.cancellation` | CANCELLING / EXCHANGING (USAGE PARAMETER) | `Cancelling` / `Exchanging` | Transmodel models cancellation as a USAGE PARAMETER with detailed conditions. MSD uses a simplified fee-based model. |
| Multi-stop booking | `booking_rules.multi_stop` | — | — | No direct Transmodel equivalent. Transmodel models SERVICE JOURNEYs with STOP POINTs but does not model on-demand multi-stop trip chaining as a booking concept. MSD-specific extension addressing the "Mobility of Care" pattern (ITF 2019). |
| Group booking | `booking_rules.group_booking` | COMPANION PROFILE | `CompanionProfile` | MSD's group booking rules (max group size, child accompaniment) map conceptually to NeTEx's COMPANION PROFILE. MSD adds explicit accompaniment rules. |
| Transfer policy | `fare_structures[].transfer_policy` | TRANSFERABILITY / INTERCHANGING | `Transferability` | Transmodel models transfer rules through INTERCHANGING (physical transfer between services) and TRANSFERABILITY (fare validity across transfers). MSD's `transfer_policy` combines both into a simplified declaration of free transfer windows and eligible modes. |

### C.7 Settlement

| MSD Element | MSD Path | Transmodel Entity | NeTEx Element | Notes |
|---|---|---|---|---|
| Settlement model | `settlement.model` | FULFILMENT METHOD | `FulfilmentMethod` | Transmodel covers fulfilment (how a ticket is delivered/consumed). Settlement (financial clearing between parties) is outside Transmodel's formal scope — it is a commercial/contractual matter. |
| Commission | `settlement.commission_structure` | — | — | No direct Transmodel equivalent. Settlement terms between platform and provider are not modelled in the public transport reference data model. This is an MSD-specific extension addressing the virtualization use case. |

### C.8 References and Metadata

| MSD Element | MSD Path | Transmodel Entity | NeTEx Element | Notes |
|---|---|---|---|---|
| MSD version | `msd_version` | VERSION | `VersionFrame/@version` | Transmodel's VERSION concept is more comprehensive, supporting delta versioning and validity conditions. |
| Last updated | `last_updated` | VERSION.Timestamp | `VersionFrame/@created` or `@changed` | Direct mapping |
| TTL | `ttl` | — | — | Cache control concept from GBFS; no Transmodel equivalent. Web infrastructure concern, not transport data model. |
| GTFS reference | `references.gtfs_feed_url` | — | `ResourceFrame/dataSources` | NeTEx can reference external data sources in a ResourceFrame |
| TOMP-API reference | `references.tomp_api_url` | — | — | No Transmodel equivalent; TOMP-API is a booking protocol, not a data model entity |

### C.9 Mapping Notes and Design Decisions

**Why MSD does not replicate Transmodel's complexity:** Transmodel is a comprehensive reference data model developed over 30 years, covering scheduling, operations, fares, driver management, and statistics across all public transport modes. Its strength is completeness and precision. MSD's design goal is the opposite: minimal viable description that enables integration for providers who cannot implement NeTEx. The mapping documents how MSD concepts relate to Transmodel concepts, enabling bi-directional tooling without requiring MSD providers to understand Transmodel.

**Where MSD extends beyond Transmodel:** Settlement parameters (commission structures, billing contacts, settlement protocols) and provider legal entity information are MSD-specific. Transmodel explicitly does not model commercial relationships between organisations — it models the transport service itself. MSD needs these elements because its use case (enabling third-party platforms to sell services) requires commercial context that Transmodel intentionally excludes.

**Where Transmodel is richer than MSD:** Virtually everywhere. Transmodel's fare model alone (EN 12896-5) includes concepts like VALIDABLE ELEMENT, ACCESS RIGHT, SALES OFFER PACKAGE, FARE CONTRACT, TRAVEL DOCUMENT, and CUSTOMER ACCOUNT that MSD does not attempt to represent. MSD describes what a service costs; Transmodel describes how fares are structured, sold, validated, and accounted. For providers needing full NeTEx compliance, MSD serves as a simplified entry point that can be enriched with NeTEx detail over time.

**Conversion tooling roadmap:** A future MSD-to-NeTEx converter would generate a NeTEx `PublicationDelivery` document containing a `ServiceFrame` (for FLEXIBLE LINE, TARIFF ZONE), a `FareFrame` (for FARE STRUCTURE ELEMENT, FARE PRICE, USER PROFILE), and a `ResourceFrame` (for OPERATOR, VEHICLE TYPE). This would enable MSD-described services to be ingested by any NeTEx-compliant system — including Swiss NADIM — without the provider needing to produce NeTEx directly. The reverse mapping (NeTEx-to-MSD) would extract a simplified service description from a comprehensive NeTEx dataset, useful for discovery and comparison purposes.

**Alignment with Swiss NeTEx-CH profile:** Switzerland's national NeTEx profile (maintained by SKI+/opentransportdata.swiss) defines specific choices within the NeTEx framework. The MSD-to-NeTEx converter should produce output conforming to the NeTEx-CH profile, ensuring compatibility with Swiss infrastructure. Key Swiss-specific considerations include the use of DiDok numbers for stop identification, the Swiss tariff numbering system, and alignment with the planned NADIM data exchange formats.

---

## Appendix D: MSD-CH — Swiss National Profile

This appendix defines MSD-CH, a national profile for the use of MSD within the Swiss public transport ecosystem. MSD-CH specifies which Swiss identification systems, credential types, and spatial reference systems MUST or SHOULD be used when publishing MSD files for services operating in Switzerland. The profile ensures compatibility with the Swiss Systemaufgabe Kundeninformation (SKI), opentransportdata.swiss, NOVA, and the planned NADIM/MODI infrastructure.

MSD-CH follows the profiling approach used in the NeTEx-CH profile (maintained by SKI+/opentransportdata.swiss): it constrains the generic MSD specification to Swiss conventions without modifying the base schema. Any valid MSD-CH file is also a valid MSD file.

### D.1 Swiss Identification Systems (SID4PT)

The Swiss Identification for Public Transport (SID4PT) initiative defines three core identification systems. MSD-CH integrates all three:

**Swiss Business Organisation ID (SBOID):** MSD-CH files MUST use the SBOID for the `provider.provider_id` field when the provider is a registered Swiss public transport organisation (Geschäftsorganisation). The SBOID follows the syntax `ch:1:sboid:<InternalID>`, where the InternalID corresponds to the GO-Nummer (Geschäftsorganisationsnummer) assigned by the DiDok-Fachstelle and maintained in the GO-Verzeichnis of the BAV.

```json
{
  "provider": {
    "provider_id": "ch:1:sboid:100342",
    "name": "mybuxi Genossenschaft",
    "swiss_profile": {
      "go_nummer": "100342",
      "sboid": "ch:1:sboid:100342",
      "tu_verzeichnis": true,
      "konzession_typ": "RPV"
    }
  }
}
```

For providers not registered in the GO-Verzeichnis (e.g., non-concessionised sharing services, parking operators), MSD-CH RECOMMENDS using the UID (Unternehmens-Identifikationsnummer) with the prefix `ch:uid:<CHE-number>` as fallback identifier.

**Swiss Location ID (SLOID):** When MSD service areas reference fixed stops or stations, MSD-CH MUST use the SLOID for stop identification. The SLOID syntax is `ch:1:sloid:<DiDok-Nummer>:<Components>`, corresponding to the CEN-IFOPT structure. The DiDok-Nummer is centrally assigned by the Fachstelle DiDok at SBB (on behalf of BAV).

```json
{
  "services": [{
    "service_area": {
      "type": "stops",
      "stops": [
        {
          "stop_id": "ch:1:sloid:3424",
          "name": "Langnau i.E., Bahnhof",
          "didok_nummer": 3424,
          "coordinates": { "lat": 46.9397, "lon": 7.7883 }
        },
        {
          "stop_id": "ch:1:sloid:3421",
          "name": "Signau, Bahnhof",
          "didok_nummer": 3421,
          "coordinates": { "lat": 46.9208, "lon": 7.7272 }
        }
      ]
    }
  }]
}
```

For locations without DiDok-Nummer (e.g., bike-sharing stations, parking facilities, flexible demand-responsive zones), MSD-CH allows provider-scoped identifiers with the prefix `ch:1:sloid:<DiDok>:<provider-component>` for components within a DiDok stop, or free GeoJSON geometries for zone-based areas.

**Swiss Line ID (SLNID):** When an MSD service corresponds to a registered public transport line, MSD-CH SHOULD reference the SLNID in the service metadata. This enables cross-referencing with HRDF/GTFS timetable data published on opentransportdata.swiss.

```json
{
  "services": [{
    "service_id": "emmental-ondemand",
    "swiss_profile": {
      "slnid": "ch:1:slnid:94-042-j26",
      "service_category": "on_demand_rpv"
    }
  }]
}
```

### D.2 Swiss Fare Credentials (Halbtax, GA, Verbundabonnemente)

Switzerland's integrated fare system relies on nationally recognised entitlements (Ausweise) that grant discounts or access rights across operators. MSD-CH defines standardised credential identifiers for the most common entitlements:

| Credential ID | Name (de) | Name (en) | Discount Type | Notes |
|---|---|---|---|---|
| `ch:halbtax` | Halbtax-Abonnement | Half-Fare Travelcard | 50% on most fares | SwissPass-based. Valid on virtually all Swiss PT operators. |
| `ch:ga` | Generalabonnement | General Abonnement (GA) | Included (no additional fare) | SwissPass-based. Free travel on participating operators. |
| `ch:ga-junior` | Junior-Karte | GA for children | Included (accompanying parent with GA) | Children 6-16 with a parent holding GA. |
| `ch:tk` | Tageskarte Gemeinde | Day Pass (municipal) | Flat daily rate | Issued by municipalities. |
| `ch:verbund:<id>` | Verbundabonnement | Regional pass | Zone-based | Regional transport association pass. `<id>` = Verbund identifier (e.g., `ch:verbund:zvv`, `ch:verbund:libero`). |
| `ch:track7` | Track 7 (Gleis 7) | Youth evening pass | Free travel after 19:00 | For holders under 25 with qualifying subscription. |

These credential IDs map to Transmodel ENTITLEMENT PRODUCT entities and NeTEx `EntitlementProduct` elements. In the NOVA system, they correspond to Sortiment-Ausweise.

Example of Halbtax and GA integration in fare structures:

```json
{
  "fare_structures": [{
    "fare_id": "emmental-standard",
    "currency": "CHF",
    "rules": [
      {
        "description": "Einzelfahrt innerhalb Zone",
        "conditions": { "zone_crossing": 0 },
        "price": 5.00
      }
    ],
    "discounts": [
      {
        "discount_id": "halbtax",
        "name": "Halbtax",
        "type": "percentage",
        "value": 50,
        "conditions": {
          "requires_credential": "ch:halbtax"
        }
      },
      {
        "discount_id": "ga-included",
        "name": "GA (im Preis inbegriffen)",
        "type": "free",
        "conditions": {
          "requires_credential": "ch:ga",
          "note": "Gilt nur für Dienste mit GA-Vereinbarung"
        }
      },
      {
        "discount_id": "verbund-libero",
        "name": "Libero-Abo (Zone gültig)",
        "type": "free",
        "conditions": {
          "requires_credential": "ch:verbund:libero",
          "valid_zones": ["emmental-nord"],
          "note": "Gilt für Inhaber eines Libero-Abos mit gültiger Zone"
        }
      }
    ]
  }]
}
```

#### Credential Acceptance Declaration

Not all Swiss mobility services accept standard PT credentials. Non-concessioned services (such as community buses not integrated into the Direkter Verkehr) may explicitly not accept Halbtax, GA, or Verbundabonnemente. MSD-CH files SHOULD declare credential acceptance status using the `credential_acceptance` object:

```json
{
  "fare_structures": [{
    "credential_acceptance": {
      "ch:halbtax": false,
      "ch:ga": false,
      "ch:verbund:libero": false
    }
  }]
}
```

This is particularly important in the Swiss context, where passengers commonly assume that Halbtax is accepted everywhere. A journey planner consuming MSD-CH files can use this declaration to display clear information about credential validity, avoiding passenger frustration at booking or boarding time.

The three-state model (accepted with discount effect in `discounts` / explicitly not accepted via `false` / undeclared by omission) ensures backward compatibility: existing MSD files without `credential_acceptance` continue to work, while Swiss providers can add explicit declarations as their digital maturity grows.

### D.3 Spatial Reference: Verkehrsnetz CH (VnCH) Compatibility

Switzerland's planned Verkehrsnetz CH (National Geodata Infrastructure for Mobility), operated by swisstopo, defines a national spatial reference system for mobility data. MSD-CH addresses VnCH compatibility while maintaining the geodata-provider-neutrality that SOSM and others have called for:

**MSD-CH uses WGS84 (EPSG:4326) as its coordinate reference system**, consistent with GeoJSON (RFC 7946), GTFS, and GBFS. This is the global default and ensures compatibility with OSM, Google Maps, Apple Maps, HERE, and all major geodata providers.

**VnCH edge references are OPTIONAL.** When a service area, stop, or route can be mapped to a VnCH edge (Kante) or node (Knoten), providers MAY include a `vnch_ref` field. This enables NADIM integration without requiring VnCH as a mandatory dependency.

```json
{
  "services": [{
    "service_area": {
      "zones": [{
        "zone_id": "emmental-nord",
        "geometry": {
          "type": "Polygon",
          "coordinates": [[[7.58, 46.95], [7.65, 46.95], [7.65, 47.00], [7.58, 47.00], [7.58, 46.95]]]
        },
        "swiss_profile": {
          "vnch_refs": ["vnch:edge:12345", "vnch:edge:12346"],
          "lv95_bbox": { "min_e": 2612000, "min_n": 1197000, "max_e": 2618000, "max_n": 1202000 }
        }
      }]
    }
  }]
}
```

This approach mirrors the design decision in the concept paper's core principles: VnCH is a valuable reference system, but not a gatekeeper. Providers using OSM, swisstopo, or any other geodata source can produce valid MSD-CH files. The `vnch_ref` field enables richer integration for those who have it, without creating a barrier for those who don't.

**LV95 coordinates** (Swiss national coordinate system, EPSG:2056) MAY be included as supplementary information via the `lv95_bbox` field for compatibility with cantonal GIS systems. The primary geometry remains WGS84/GeoJSON.

### D.4 NADIM Integration Points

MSD-CH files are designed to be publishable via the planned NADIM (Nationale Datenvernetzungsinfrastruktur Mobilität) once it becomes operational. The following integration points are pre-defined:

**Data publication:** MSD-CH files can be registered in the NADIM catalogue as a data source alongside GTFS, NeTEx, and GBFS feeds. The `provider.swiss_profile` metadata provides the organisational linkage (SBOID) needed for NADIM's data governance framework.

**Automatic NeTEx-CH generation:** The MSD-to-NeTEx converter (roadmap Phase 3) will produce NeTEx documents conforming to the NeTEx-CH profile, using SLOID for stop identification, SBOID for operator identification, and Swiss fare conventions. This allows MSD-described services to appear in any NeTEx-CH-consuming system (including OJP-based journey planners) without the provider producing NeTEx directly.

**TOMP-API-SKI profile generation:** Switzerland's SKI+ has defined a TOMP-API Swiss profile (Version 0.5, published on oev-info.ch). The MSD-to-TOMP adapter (roadmap Phase 2) will generate operator information conforming to this profile, enabling MSD-described services to be bookable via TOMP-compliant MaaS platforms operating in Switzerland.

### D.5 Profile Conformance

An MSD file conforms to the MSD-CH profile if:

1. **Provider identification** uses SBOID (for GO-registered organisations) or UID (for others)
2. **Stop references** use SLOID where DiDok-Nummern exist
3. **Credential references** for Swiss fare entitlements use the standardised `ch:` prefix identifiers
4. **Coordinates** are in WGS84 (EPSG:4326)
5. **The `swiss_profile` object** is present in provider and service metadata

Conformance is verifiable by the MSD validator with the `--profile ch` flag (to be implemented in the reference validator).

### D.6 Example: Complete MSD-CH File (mybuxi Emmental)

A complete, profile-conformant MSD-CH file for mybuxi Emmental is provided in the repository as `examples/ch/mybuxi-emmental.msd.json`. It demonstrates all Swiss-specific elements: SBOID provider identification, SLOID stop references, Halbtax/GA credential integration, VnCH-optional zone geometries, and NADIM-compatible metadata.

---

*This concept paper establishes the foundational vision for MSD. It is explicitly a starting point for community discussion, not a final specification. The data model examples are illustrative and will evolve through community input and real-world piloting.*

*Published: 2026-03-08 | Thomas Teichmüller | Leap and Land | CC BY-SA 4.0*
