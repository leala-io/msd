// MSD web validator — browser entry (DOM wiring only).
//
// Client-only: nothing is ever uploaded, sent, or stored. The "Validate" button runs
// the shared validation core entirely in the browser on the inlined canonical schema.

import { validateFor, formatErrors, VERSION_IDS } from './bundle.js';
import { createServiceAreaMap } from './map.js';
import { downloadGtfsFlexFeed } from './feed.js';

const $ = (id) => document.getElementById(id);

const input = $('msd-input');
const versionSelect = $('version');
const fileInput = $('file-input');
const validateBtn = $('validate-btn');
const result = $('result');

// Service-area preview (progressive disclosure: appears only after a PASS,
// collapsed; "Validate" stays the primary action). The map is created lazily on
// first reveal so the Leaflet container sizes against a visible element.
const areaPanel = $('area-panel');
const areaToggle = $('area-toggle');
const areaBody = $('area-body');
const areaMapEl = $('area-map');
const areaEmpty = $('area-empty');
const basemapToggle = $('basemap-toggle');
const downloadBtn = $('download-btn');
const feedMsg = $('feed-msg');
let areaMap = null;
let lastValidDoc = null;

function clearFeedMsg() {
  feedMsg.hidden = true;
  feedMsg.textContent = '';
  feedMsg.classList.remove('error');
}

function hideAreaPanel() {
  areaPanel.hidden = true;
  areaBody.hidden = true;
  areaToggle.setAttribute('aria-expanded', 'false');
  areaToggle.textContent = 'Show service area';
  basemapToggle.checked = false;
  if (areaMap) areaMap.setBackground(false);
  clearFeedMsg();
  lastValidDoc = null;
}

function revealServiceArea() {
  areaBody.hidden = false;
  areaToggle.setAttribute('aria-expanded', 'true');
  areaToggle.textContent = 'Hide service area';
  if (!areaMap) areaMap = createServiceAreaMap(areaMapEl);
  areaMap.invalidate(); // container just became visible
  const drawn = areaMap.render(lastValidDoc);
  areaEmpty.hidden = drawn > 0;
}

areaToggle.addEventListener('click', () => {
  if (areaBody.hidden) {
    revealServiceArea();
  } else {
    areaBody.hidden = true;
    areaToggle.setAttribute('aria-expanded', 'false');
    areaToggle.textContent = 'Show service area';
  }
});

basemapToggle.addEventListener('change', () => {
  if (areaMap) areaMap.setBackground(basemapToggle.checked);
});

// Download the GTFS-Flex feed, generated in-memory from the validated doc. A
// schema-valid file can still fail conversion (e.g. no provider.country → no
// agency_timezone) — catch it and show a friendly message, with no download.
downloadBtn.addEventListener('click', async () => {
  clearFeedMsg();
  try {
    await downloadGtfsFlexFeed(lastValidDoc);
  } catch (err) {
    feedMsg.textContent =
      `This file is valid, but can't be converted to a GTFS-Flex feed: ${err.message}`;
    feedMsg.classList.add('error');
    feedMsg.hidden = false;
  }
});

// Populate the version dropdown (keyed by schema version; v0.1.0 today).
for (const v of VERSION_IDS) {
  const opt = document.createElement('option');
  opt.value = v;
  opt.textContent = `v${v}`;
  versionSelect.appendChild(opt);
}

function clearResult() {
  result.className = '';
  result.textContent = '';
  hideAreaPanel();
}

function showError(text) {
  result.className = 'fail';
  result.textContent = '';
  const banner = document.createElement('p');
  banner.className = 'banner';
  banner.textContent = text;
  result.appendChild(banner);
}

function showPass(doc) {
  result.className = 'pass';
  result.textContent = '';
  const banner = document.createElement('p');
  banner.className = 'banner';
  banner.textContent = 'PASS — valid against the MSD JSON Schema.';
  result.appendChild(banner);
  // After a PASS, offer the service-area preview — collapsed by default.
  lastValidDoc = doc;
  areaPanel.hidden = false;
}

function showFail(messages) {
  result.className = 'fail';
  result.textContent = '';
  const banner = document.createElement('p');
  banner.className = 'banner';
  banner.textContent = `FAIL — ${messages.length} schema error${messages.length === 1 ? '' : 's'}.`;
  result.appendChild(banner);
  const ul = document.createElement('ul');
  for (const line of messages) {
    const li = document.createElement('li');
    // line is exactly "<instancePath>: <message>" — byte-identical to the CLI.
    li.textContent = line;
    ul.appendChild(li);
  }
  result.appendChild(ul);
}

function runValidate() {
  clearResult();
  const text = input.value;

  // (a) JSON-syntax pre-check — malformed input stops here, before AJV.
  let doc;
  try {
    doc = JSON.parse(text);
  } catch (err) {
    showError(`Invalid JSON: ${err.message}`);
    return;
  }

  // (b) schema validation through the shared core; (c) render PASS/FAIL.
  let outcome;
  try {
    outcome = validateFor(versionSelect.value, doc);
  } catch (err) {
    showError(err.message);
    return;
  }

  if (outcome.valid) {
    showPass(doc);
  } else {
    showFail(formatErrors(outcome.errors));
  }
}

validateBtn.addEventListener('click', runValidate);

// File load → read locally → populate the textarea (visible). Nothing is transmitted.
function loadFileIntoTextarea(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    input.value = String(reader.result);
  };
  reader.readAsText(file);
}

fileInput.addEventListener('change', () => {
  loadFileIntoTextarea(fileInput.files && fileInput.files[0]);
  // Reset so re-selecting the same file fires change again.
  fileInput.value = '';
});

// Drag-and-drop onto the textarea → same local FileReader path.
['dragenter', 'dragover'].forEach((evt) =>
  input.addEventListener(evt, (e) => {
    e.preventDefault();
    input.classList.add('dragover');
  })
);
['dragleave', 'drop'].forEach((evt) =>
  input.addEventListener(evt, (e) => {
    e.preventDefault();
    input.classList.remove('dragover');
  })
);
input.addEventListener('drop', (e) => {
  const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
  loadFileIntoTextarea(file);
});
