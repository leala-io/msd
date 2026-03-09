# MSD Governance Framework

**Version:** 0.1.0  
**Date:** 2026-03-06  
**Status:** Founding Document  
**License:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

---

## Purpose

This document defines how the Mobility Service Description (MSD) standard is governed. It ensures that MSD remains open, vendor-neutral, and community-driven — now and as the project grows. Anyone considering contributing to, implementing, or building upon MSD should read this document to understand the commitments that govern the project.

---

## Core Commitments

These commitments are permanent and cannot be changed by any governance body:

1. **Open Standard.** The MSD specification is published under **CC BY-SA 4.0**. Anyone may read, implement, extend, and redistribute it. No license fee, membership fee, or permission is required to use MSD.

2. **Open Source.** All reference implementations, validators, converters, and tools developed under the MSD project are published under **AGPL-3.0**. Anyone who operates a modified MSD engine as a network service must publish their modifications under the same license. This prevents proprietary capture of the shared codebase.

3. **No Single-Actor Control.** No single organisation — whether a company, government agency, standards body, or foundation — may hold veto power over specification changes. Governance decisions are made by consensus of the Steering Committee, where no member holds more than one vote.

4. **Implementation-Gated Adoption.** No specification change becomes final without at least one data producer and one data consumer implementing it. This follows the proven model of GBFS and GTFS, preventing specification bloat with untested features.

5. **Vendor Neutrality.** MSD is not tied to any specific platform, routing engine, ticketing system, or national data infrastructure. The specification must work equally well with open-source and proprietary systems, with small and large providers, and across jurisdictions.

---

## Governance Structure

### Phase 1: Founding (Current)

During the founding phase, decisions are made by the **Project Lead** (Thomas Teichmüller, Leap and Land) in consultation with early contributors and advisors. This lightweight structure is intentional: governance formality should scale with adoption, not precede it. The founding phase ends when three conditions are met: (a) the specification reaches v1.0.0, (b) at least three independent organisations actively contribute, and (c) at least two independent implementations exist.

**During this phase:**

- The Project Lead maintains the specification and reference implementations
- All changes are proposed and discussed via GitHub Issues and Pull Requests
- The Project Lead merges changes after a minimum 7-day discussion period
- Any contributor may propose changes; the Project Lead prioritises based on roadmap alignment and community input
- Advisors may be invited to provide technical and strategic guidance without formal voting rights

### Phase 2: Community Governance

Upon meeting the transition criteria, MSD transitions to a **Steering Committee** model:

- **Steering Committee**: 5-9 members representing diverse stakeholder groups (providers, platforms, public agencies, civil society, technical experts). No single organisation may hold more than two seats. Members serve two-year terms, staggered to ensure continuity.
- **Decision-making**: Consensus-seeking with fallback to supermajority vote (two-thirds). Votes require a quorum of two-thirds of members. Each member has one vote. There is no veto right.
- **Specification changes**: Follow a structured process adapted from GBFS governance — Proposal (GitHub Issue) → Discussion (minimum 14 days) → Vote (minimum 10 days, requires producer + consumer support) → Implementation Gate → Release Candidate → Stable Release.
- **Facilitator role**: A designated facilitator (individual or organisation) manages the governance process but does not vote. The facilitator role is reviewed annually.

### Phase 3: Foundation Governance

When MSD achieves significant international adoption, governance may be transferred to an established open-source or open-standards foundation (such as the Eclipse Foundation, MobilityData, Open Mobility Foundation, or Linux Foundation). The choice of foundation will be made by the Steering Committee based on alignment with MSD's core commitments — particularly the permanence of open licensing and the prevention of single-actor control. Core commitments transfer with the standard and bind any hosting foundation.

---

## Intellectual Property

### Specification

The MSD specification, including all text, schemas, and examples, is published under **CC BY-SA 4.0**. Contributors grant this license for all specification contributions. Attribution is required; derivative works must use the same or compatible license.

### Code

All code in the MSD project (validators, converters, reference engines, tools) is published under **AGPL-3.0**. Contributors certify the origin and license compatibility of their contributions through the **Developer Certificate of Origin (DCO)**, implemented via `Signed-off-by` lines in git commits. MSD uses DCO rather than a Contributor License Agreement (CLA), because DCO enforces inbound-equals-outbound licensing and prevents relicensing under proprietary terms.

### Trademarks

The name "MSD" and "Mobility Service Description" may be used freely to refer to the standard. The use of these names to claim conformance requires passing the MSD conformance validator against the declared specification version.

---

## Contributing

All contributions to MSD — specification text, code, documentation, translations, testing — are welcome from any individual or organisation.

**To contribute:**

1. Read this governance document and the MSD concept paper
2. Open a GitHub Issue describing your proposed contribution
3. Submit a Pull Request with `Signed-off-by: Your Name <your@email.com>` (DCO)
4. Engage in the discussion period
5. Respond to review feedback

**Code of conduct:** Contributors are expected to engage respectfully and constructively. Technical disagreements are resolved through evidence and implementation experience, not authority or volume. The project follows the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

---

## Amendments

This governance document may be amended by:

- **During Phase 1**: The Project Lead, with documented rationale published to the repository
- **During Phase 2**: The Steering Committee, by supermajority vote, with a minimum 30-day comment period
- **During Phase 3**: The hosting foundation's governance processes, subject to the permanent core commitments in Section "Core Commitments"

The Core Commitments (Section "Core Commitments") are permanent. Any proposed amendment that would weaken open licensing, introduce single-actor control, or remove the implementation gate is invalid regardless of the governance phase or voting outcome.

---

*This document establishes the governance framework for MSD. It is designed to be lightweight enough for a founding-phase project while containing the structural commitments needed to ensure long-term openness. It will evolve as the community grows.*

*Published: 2026-03-06 | Thomas Teichmüller | Leap and Land | CC BY-SA 4.0*
