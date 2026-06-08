# Versioning

MSD follows [Semantic Versioning 2.0.0](https://semver.org/). A version is written `MAJOR.MINOR.PATCH`. Each released version corresponds to a versioned schema folder (`schema/<version>/`) and registry folder (`registry/<version>/`). Conformance (see `CONFORMANCE.md`) is always stated relative to a specific version.

## What each level means for MSD

**PATCH** (`x.y.Z`) — backward-compatible clarifications and fixes that do not change the structure or meaning of any defined field:
- editorial or documentation fixes;
- tooling, CI, or validator fixes;
- small, data-only code-list value additions (may also ship as MINOR — see below).

**MINOR** (`x.Y.0`) — backward-compatible additions:
- a new **optional** field;
- a new value added to a code-list registry (non-breaking because consumers must treat an unrecognized code-list value as unknown, not as an error — see `CONFORMANCE.md` §3);
- a new optional code list.

**MAJOR** (`X.0.0`) — backward-incompatible changes:
- adding, removing, or renaming a **required** field;
- removing or renaming a defined field, or changing its type or meaning;
- a structural change to a defined object;
- a change to the **semantics** of the `$id` URLs or to how the registry is resolved;
- removing a code-list value, or changing the meaning of an existing one.

## Invariants (do not change without a MAJOR bump)

These hold across all versions within a MAJOR line:
- **C1** — `null`, `0`, and an absent field are distinct (see `CONVENTIONS.md`); their meanings do not change.
- **C2** — code lists are external, versioned registry files referenced by `$id` (see `CONVENTIONS.md`); the registry resolves locally, with no network access at validation time.
- The schema is **open** (no `additionalProperties: false`): files may carry additional fields, so adding optional fields is always non-breaking.

## Compatibility summary

| Change | Level | Breaking? |
|---|---|---|
| Editorial / docs / CI / validator fix | PATCH | no |
| Add an optional field | MINOR | no |
| Add a code-list value or a new optional list | MINOR (or PATCH) | no |
| Add / remove / rename a required field | MAJOR | yes |
| Remove / rename / retype a field, or change its meaning | MAJOR | yes |
| Change `$id` semantics or registry resolution | MAJOR | yes |
| Remove or redefine a code-list value | MAJOR | yes |
