# MSD engine

Reads a validated MSD v0.1.0 document and emits feeds in other mobility formats. The engine
is **additive** and **read-only** with respect to the frozen baseline: it never writes to
`schema/`, `registry/`, `validator/`, `examples/`, or the Concept Paper (CLAUDE.md §2, blueprint §3).

```
engine/
  core/                 # MSD load + validate (single path: validator/validate.js) + conversion utils
  adapters/
    gtfs-flex/          # Phase 2a — MSD → GTFS-Flex (discovery); gate: gtfs-validator v7+
  scripts/
    check-gtfs-report.js  # fail on any ERROR notice in a gtfs-validator report
  cli.js                # node engine/cli.js <msd-file> <out-dir> --target gtfs-flex
```

Phases (blueprint §3): **2a** GTFS-Flex discovery *(this commit)* · 2b Fares v2 · 2c GOFS. Each
phase is separately gated and never blocks an earlier one.

## Input contract

The engine runs `validator/validate.js` on the input first and **aborts on invalid input** —
AJV is the only authoritative validation (CLAUDE.md §4). No output is produced from an invalid MSD.

## Usage

```sh
node engine/cli.js examples/ch/mybuxi-emmental.msd.json engine/out/mybuxi-gtfs-flex --target gtfs-flex
```

`--target gtfs-flex` is implemented in Phase 2a; `gofs`/`all` are reserved for later phases.

## Gate — `gtfs-validator` v7+ (no structural fallback)

The generated feed must pass the canonical MobilityData `gtfs-validator` (full Flex validation).
The validator jar is **not committed** (downloaded at build/CI time into `engine/.tools/`, which is
git-ignored). Latest release: <https://github.com/MobilityData/gtfs-validator/releases>.

```sh
# one-time: fetch the CLI jar (any v7+; v8.0.1 used in development)
curl -sL -o engine/.tools/gtfs-validator-cli.jar \
  https://github.com/MobilityData/gtfs-validator/releases/download/v8.0.1/gtfs-validator-8.0.1-cli.jar

# generate + validate + gate
node engine/cli.js examples/ch/mybuxi-emmental.msd.json engine/out/mybuxi-gtfs-flex --target gtfs-flex
java -jar engine/.tools/gtfs-validator-cli.jar \
  -i engine/out/mybuxi-gtfs-flex -o engine/out/validation-mybuxi --country_code ch -svu
node engine/scripts/check-gtfs-report.js engine/out/validation-mybuxi/report.json
```

**Current result:** mybuxi → `gtfs-validator` v8.0.1 → **0 notices (GATE PASS)**. mybuxi is the
first consumer of an MSD file → Implementation Gate scharf.

Mapping details, spec deviations, and documented lossy mappings:
[`adapters/gtfs-flex/README.md`](adapters/gtfs-flex/README.md).
