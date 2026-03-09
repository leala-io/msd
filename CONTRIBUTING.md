# Contributing to MSD

Thank you for your interest in contributing to the Mobility Service Description (MSD) standard. MSD is developed openly and welcomes contributions from individuals and organisations of all sizes.

This document explains how to contribute and what to expect during the process.

## What You Can Contribute

**Specification feedback** — Open a GitHub Issue describing what works, what is missing, or what is unclear in the concept paper or data model. This is the most valuable contribution during the founding phase.

**Pilot MSD files** — Describe a real mobility service as an MSD file and share it in the `examples/` directory. Report what the schema could express and what it could not.

**Code** — Build validators, converters, engines, or tools that produce or consume MSD files. All code contributions are licensed under AGPL-3.0.

**Documentation** — Improve explanations, add translations, fix typos, or write tutorials.

**Standards alignment** — Help map MSD to existing standards (GTFS, GBFS, NeTEx, TOMP-API) or identify gaps.

## How to Contribute

### 1. Open an Issue

Before starting work, open a GitHub Issue describing what you want to change or add. This allows the community to discuss the proposal before you invest effort. For small fixes (typos, broken links), you can skip this step and go directly to a Pull Request.

### 2. Fork and Branch

Fork the repository to your own GitHub account, then create a branch for your contribution. Use a descriptive branch name like `add-parking-service-type` or `fix-fare-schema-example`.

### 3. Make Your Changes

Edit or add files in your branch. Follow the existing style and structure of the repository.

### 4. Sign Off Your Commits (DCO)

MSD uses the [Developer Certificate of Origin (DCO)](DCO) instead of a Contributor License Agreement. This means every commit must include a `Signed-off-by` line certifying that you have the right to submit the contribution under the project's licenses.

Add the sign-off line to your commit message:

```
Signed-off-by: Your Name <your@email.com>
```

If you use the Git command line, add the `-s` flag:

```
git commit -s -m "Add parking service type to schema"
```

If you use the GitHub web interface to edit files, add the `Signed-off-by` line manually at the end of the commit message.

The DCO sign-off is required for all contributions — specification text, code, documentation, and examples. Commits without a sign-off will not be merged.

### 5. Submit a Pull Request

Push your branch to your fork and open a Pull Request (PR) against the `main` branch of `leala/msd`. In the PR description, reference the related Issue (if any) and explain what your change does.

### 6. Discussion Period

All Pull Requests are subject to a minimum discussion period before they can be merged:

- **Phase 1 (current — founding phase):** Minimum **7 days** for specification changes. Code fixes and documentation improvements may be merged sooner at the Project Lead's discretion.
- **Phase 2 (community governance):** Minimum **14 days** for specification changes, with a subsequent 10-day vote requiring both producer and consumer support.

During the discussion period, anyone may comment on the PR. The contributor is expected to respond to feedback and revise the PR if needed.

### 7. Merge

The Project Lead reviews and merges Pull Requests after the discussion period, considering community feedback and alignment with the project roadmap. Not all PRs will be merged — a PR may be closed with an explanation if it does not align with the project direction.

## Licensing

Contributions are licensed as follows:

| Contribution type | License | File |
|---|---|---|
| Specification text, schemas, examples | CC BY-SA 4.0 | [LICENSE-SPEC](LICENSE-SPEC) |
| Code (validators, converters, tools) | AGPL-3.0 | [LICENSE-CODE](LICENSE-CODE) |

By submitting a contribution with a DCO sign-off, you certify that you have the right to submit it under the applicable license. The DCO ensures that the inbound license equals the outbound license — no contributor grants broader rights than the project's published licenses.

## Code of Conduct

All contributors are expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Technical disagreements are resolved through evidence and implementation experience, not authority or volume.

## Questions?

If you are unsure whether your contribution fits, or you need help getting started, open a GitHub Issue with the label `question`. There are no bad questions during the founding phase.

---

*This document follows the governance framework defined in [MSD Governance](spec/MSD-governance.md).*
