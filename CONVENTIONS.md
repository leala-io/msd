# MSD Conventions

This document records the cross-cutting conventions that the MSD schema and tooling assume.
They are normative for producers and consumers but, where noted, are **interpretive** rather than
schema-enforced.

---

## Convention C1 — null vs. zero (Issue #19)

> An **omitted** optional field means *"not specified."* A literal `0`, `false`, or empty array `[]`
> carries its **literal** meaning (*genuinely zero / none / empty*). Where a field is structurally
> present but its value is genuinely unknown, `null` MAY be used and means *"unknown."* Consumers
> **MUST NOT** infer `0` or `false` from an absent or `null` field.
>
> *Example:* in `capacity`, `"wheelchair": 0` means the vehicle explicitly has no wheelchair space; an
> **absent** `wheelchair` key means wheelchair capacity is **unknown** — not zero. Producers SHOULD omit
> optional fields they cannot fill rather than setting them to `0`.

C1 is reflected in field `description`s where ambiguity is likely (capacity, counts, fees, durations) and
in nullable typing of optional scalars (`["integer", "null"]`, etc.). It is **not** enforced via schema
beyond types; C1 is interpretive guidance for producers and consumers.

---

## Convention C2 — external code lists (Issue #21)

> All enumerated value sets live in an **external versioned registry**, not inline in the structural
> schema. Each code list is a standalone JSON Schema file under `registry/v0.1.0/<name>.json` of the form
> `{ "$schema": "...", "$id": "...", "enum": [ ... ] }`. The structural schema references them via `$ref`.
> AJV resolves these at validation time. **Adding a permitted value is a registry change — non-breaking,
> no structural-schema edit.** The structural schema defines only structure, types, required-ness and
> `$ref`s — **never** inline `enum` lists.

Code lists live under [`registry/v0.1.0/`](registry/v0.1.0/). v0.1.0 populates each minimally, only from
values attested in Concept Paper §3 and the mybuxi example. New values are deferred registry additions.

> Note on structural discriminators: `service_area.type` (`zones` | `stops`) and `geometry.type`
> (`Polygon` | `MultiPolygon`) are fixed structural discriminators, not extensible code lists, and are
> therefore constrained inline rather than via the registry.
