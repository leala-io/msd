// MSD web validator — service-area map module (L2 · P1).
//
// Client-side Leaflet rendering of an already-validated MSD document's
// `service_area`. Pure preview: it reads the doc, it never validates, maps, or
// mutates anything — so it touches none of the validation core (web-identity is
// unaffected). Nothing about the file leaves the browser; no network request is
// made unless the user opts into a background map.
//
// Scope (P1): draw only the declared positive geometry —
//   service_area.type === "stops"  → the stop points (vector circle markers),
//   service_area.type === "zones"  → the zone polygons (GeoJSON already in the file).
// service_area.constraints (e.g. exclusive_zone carve-outs) are intentionally NOT
// rendered: drawing only the positive zones/stops avoids overstating coverage.
// The map shows the declared service area, not a coverage verdict.

import L from 'leaflet';
import leafletCss from 'leaflet/dist/leaflet.css';

// Leaflet's stylesheet is inlined by esbuild (loader: text) and injected once, so
// the bundle stays a single self-contained file with no extra asset request.
let cssInjected = false;
function ensureCss() {
  if (cssInjected) return;
  const style = document.createElement('style');
  style.textContent = leafletCss;
  document.head.appendChild(style);
  cssInjected = true;
}

// Opt-in background map: a privacy-respecting community raster source (no API key,
// no tracking cookie). The tile request is made ONLY when the user enables it.
// Provider terms/attribution confirmed at build time (OpenStreetMap tile usage
// policy): attribution "© OpenStreetMap contributors" required; standard tile URL.
const BASEMAP_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const BASEMAP_ATTRIBUTION = '© OpenStreetMap contributors';

const ZONE_STYLE = { color: '#1f4fd8', weight: 2, fillColor: '#1f4fd8', fillOpacity: 0.12 };
const STOP_STYLE = { radius: 7, color: '#1f4fd8', weight: 2, fillColor: '#1f4fd8', fillOpacity: 0.7 };

// Create a service-area map bound to a container element. Returns a small handle
// the UI drives (render / setBackground / invalidate). The map is encapsulated
// here so the library can later be swapped without touching the rest of web/.
export function createServiceAreaMap(containerEl) {
  ensureCss();
  // No tile layer by default: geometry renders on Leaflet's neutral background.
  const map = L.map(containerEl, { zoomControl: true, attributionControl: true });
  // A safe initial view; replaced by fitBounds once geometry is drawn.
  map.setView([46.8, 8.2], 7);

  let tileLayer = null;
  let geometryLayer = null;

  // Draw the positive service_area geometry of every service in the doc, then fit
  // the view to its combined bounds. Returns the number of features drawn.
  function render(doc) {
    if (geometryLayer) {
      geometryLayer.remove();
      geometryLayer = null;
    }
    const group = L.featureGroup();
    let drawn = 0;

    for (const service of (doc && doc.services) || []) {
      const area = service.service_area || {};
      if (area.type === 'stops') {
        for (const stop of area.stops || []) {
          const c = stop.coordinates || {};
          if (c.lat == null || c.lon == null) continue;
          const marker = L.circleMarker([c.lat, c.lon], STOP_STYLE);
          const label = stop.name || stop.stop_id;
          if (label) marker.bindTooltip(String(label));
          marker.addTo(group);
          drawn += 1;
        }
      } else if (area.type === 'zones') {
        for (const zone of area.zones || []) {
          if (!zone.geometry) continue;
          // zone.geometry is a GeoJSON geometry (Polygon); L.geoJSON reads [lon,lat].
          const layer = L.geoJSON(zone.geometry, { style: ZONE_STYLE });
          const label = zone.name || zone.zone_id;
          if (label) layer.bindTooltip(String(label));
          layer.addTo(group);
          drawn += 1;
        }
      }
      // service_area.constraints are intentionally not drawn (see file header).
    }

    if (drawn > 0) {
      group.addTo(map);
      geometryLayer = group;
      map.fitBounds(group.getBounds(), { padding: [24, 24] });
    }
    return drawn;
  }

  // Add or remove the opt-in background tile layer. Enabling it makes the first
  // (and only) outbound network request in this module.
  function setBackground(on) {
    if (on && !tileLayer) {
      tileLayer = L.tileLayer(BASEMAP_URL, { maxZoom: 19, attribution: BASEMAP_ATTRIBUTION });
      tileLayer.addTo(map);
    } else if (!on && tileLayer) {
      tileLayer.remove();
      tileLayer = null;
    }
  }

  // Leaflet must recompute size after its container becomes visible.
  function invalidate() {
    map.invalidateSize();
  }

  return { render, setBackground, invalidate };
}
