// MSD web validator — GTFS-Flex feed download module (L2 · P2).
//
// Client-only: the feed is generated entirely in the browser from the
// already-validated MSD document, zipped in memory (JSZip, bundled — no CDN),
// and offered as a download. Nothing is uploaded, sent, or stored.
//
// The generation runs the SAME pure engine core as the CLI: buildFlexFeed comes
// from engine/adapters/gtfs-flex, which now depends only on the pure conversion
// helpers (engine/core/convert.js, no Node builtins). The MSD→GTFS-Flex mapping
// is CI-proven (0 notices vs the canonical gtfs-validator); this module does not
// re-derive it.

import JSZip from 'jszip';
import { buildFlexFeed } from '../engine/adapters/gtfs-flex/index.js';

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Generate the GTFS-Flex feed in-memory and trigger a client-side download.
// buildFlexFeed throws when a schema-valid document still cannot be converted
// (e.g. no provider.country → no agency_timezone); the caller catches it and
// surfaces a friendly message, and nothing is downloaded.
export async function downloadGtfsFlexFeed(doc) {
  const { files } = buildFlexFeed(doc); // may throw — caller handles
  const zip = new JSZip();
  for (const [name, content] of Object.entries(files)) {
    zip.file(name, content);
  }
  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  // Sanitize the id for the download filename only — a schema-valid provider_id
  // can contain ":" or "/" (e.g. "ch:1:sboid:100342"), which breaks filenames on
  // macOS/Windows. The feed content (agency_id etc.) keeps the verbatim id.
  const providerId = (doc && doc.provider && doc.provider.provider_id) || 'feed';
  const safeId = providerId.replace(/[^A-Za-z0-9._-]/g, '_') || 'feed';
  saveBlob(blob, `${safeId}-gtfs-flex.zip`);
}
