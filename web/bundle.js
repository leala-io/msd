// MSD web validator — single-source bundle module.
//
// This is the ONE place the canonical schema + registry are pulled in. They are
// imported directly from the frozen source of truth (schema/v0.1.0, registry/v0.1.0)
// and inlined by esbuild at build time — there is NO copy of the schema in web/.
// Validation runs through the SAME shared core as the CLI (validator/core.js), so the
// browser and the CLI are one validation path, not two implementations.

import { validateMsd, formatErrors } from '../validator/core.js';

// Root structural schema (canonical, frozen).
import msdSchema from '../schema/v0.1.0/msd.schema.json';

// All v0.1.0 registry code-list schemas (canonical, frozen). Registered by their
// own $id inside the core; array order is irrelevant ($id-keyed, not positional).
import bookingChannel from '../registry/v0.1.0/booking_channel.json';
import bookingConfirmation from '../registry/v0.1.0/booking_confirmation.json';
import commissionType from '../registry/v0.1.0/commission_type.json';
import constraintType from '../registry/v0.1.0/constraint_type.json';
import discountType from '../registry/v0.1.0/discount_type.json';
import mode from '../registry/v0.1.0/mode.json';
import passengerIdentification from '../registry/v0.1.0/passenger_identification.json';
import paymentMethod from '../registry/v0.1.0/payment_method.json';
import propulsion from '../registry/v0.1.0/propulsion.json';
import serviceType from '../registry/v0.1.0/service_type.json';
import settlementModel from '../registry/v0.1.0/settlement_model.json';
import settlementPeriod from '../registry/v0.1.0/settlement_period.json';
import settlementProtocol from '../registry/v0.1.0/settlement_protocol.json';
import travelTimeSource from '../registry/v0.1.0/travel_time_source.json';

// Version-keyed map so the UI dropdown scales to future versions / profiles without
// rework. v0.1.0 is the only entry today.
const VERSIONS = {
  '0.1.0': {
    schema: msdSchema,
    registry: [
      bookingChannel,
      bookingConfirmation,
      commissionType,
      constraintType,
      discountType,
      mode,
      passengerIdentification,
      paymentMethod,
      propulsion,
      serviceType,
      settlementModel,
      settlementPeriod,
      settlementProtocol,
      travelTimeSource,
    ],
  },
};

// Validate a parsed MSD document against a given schema version, using the shared
// core with the canonical schema + registry injected. Throws on an unknown version.
function validateFor(version, doc) {
  const v = VERSIONS[version];
  if (!v) throw new Error(`Unknown schema version: ${version}`);
  return validateMsd(doc, { schema: v.schema, registry: v.registry });
}

const VERSION_IDS = Object.keys(VERSIONS);

export { validateFor, formatErrors, VERSIONS, VERSION_IDS };
