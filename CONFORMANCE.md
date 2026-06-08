# Conformance

This document defines what it means to conform to the Mobility Service Description (MSD) specification. It formalizes requirements already expressed by the MSD schema and conventions; it does not add new ones.

## Notational conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in BCP 14 [RFC 2119] [RFC 8174] when, and only when, they appear in all capitals.

Terms used here:
- **MSD file** — a single JSON document describing one or more mobility services according to this specification.
- **the schema** — the versioned JSON Schema at `schema/<version>/msd.schema.json` (currently `schema/v0.1.0/msd.schema.json`, JSON Schema Draft 2020-12).
- **the registry** — the versioned external code lists at `registry/<version>/*.json`, referenced from the schema by `$ref` and identified by `$id`.

Conformance is always stated **relative to a specific MSD version**.

## Conformance targets

This specification defines conformance for three targets: **MSD files**, **producers**, and **consumers**.

### 1. MSD file

An MSD file is conformant to a given MSD version if and only if it is valid JSON and validates against that version's `msd.schema.json` with the registry resolved by `$id`. In particular:

- Fields typed against a code list MUST use a value defined in the corresponding registry list for that version (enforced by the schema via `$ref`).
- The values `null`, `0`, and an absent field are **distinct** and MUST be used as defined in `CONVENTIONS.md` (convention C1): `null` means explicitly "no value / not applicable", `0` means the quantity zero, and an absent field means "unknown / not provided".
- The schema is intentionally open (it does not set `additionalProperties: false`). A file MAY carry additional fields beyond those the schema defines; such fields MUST NOT alter the meaning of defined fields.

A file can be checked with the reference validator — `node validator/validate.js <file>` — or in the browser at <https://leala-io.github.io/msd/>. Both run the same validation (same schema, same registry resolution by `$id`); nothing is uploaded by the browser validator.

### 2. Producer

A **producer** is any tool, service, or party that emits MSD files.

- A producer MUST emit MSD files that are file-conformant (§1) for the version they target.
- A producer SHOULD make the targeted MSD version unambiguous (for example, via the file's `$schema` reference to the versioned schema URL).
- A producer MAY include additional (extension) fields and SHOULD document any it relies on.

### 3. Consumer

A **consumer** is any tool, service, or party that reads MSD files.

- A consumer MUST accept any file-conformant MSD file (§1) for a version it supports.
- A consumer MUST NOT reject a file solely because it contains additional fields the schema does not define (the open-schema contract); it MAY ignore fields it does not understand.
- A consumer MUST honour the `null` / `0` / absent distinction (C1) and MUST NOT treat `null` or an absent field as `0`.
- A consumer SHOULD treat an unrecognized code-list value as unknown rather than as an error, so that it stays forward-compatible as registry lists grow (adding registry values is non-breaking; see `VERSIONING.md`).

## Profiles

A **profile** is a named set of additional constraints layered on the base specification for a particular context.

- The **MSD-CH profile** (Swiss context) is documented in the Concept Paper, Annex D (its conformance expectations in Annex D.5).
- In v0.1.0, profiles are **documentary**: the base schema validates structure, but selecting and enforcing a profile (for example Core / MSD-CH / a context-specific minimum profile) is **not yet enforced by the reference validator**. Profile-aware validation is planned for a later version.

## References

- BCP 14 — RFC 2119 and RFC 8174 (requirement-level keywords).
- `CONVENTIONS.md` — conventions C1 (`null`/`0`/absent) and C2 (external code-list registry).
- `VERSIONING.md` — versioning and compatibility policy.
- Concept Paper, Annex D — the MSD-CH profile.
