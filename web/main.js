// MSD web validator — browser entry (DOM wiring only).
//
// Client-only: nothing is ever uploaded, sent, or stored. The "Validate" button runs
// the shared validation core entirely in the browser on the inlined canonical schema.

import { validateFor, formatErrors, VERSION_IDS } from './bundle.js';

const $ = (id) => document.getElementById(id);

const input = $('msd-input');
const versionSelect = $('version');
const fileInput = $('file-input');
const validateBtn = $('validate-btn');
const result = $('result');

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
}

function showError(text) {
  result.className = 'fail';
  result.textContent = '';
  const banner = document.createElement('p');
  banner.className = 'banner';
  banner.textContent = text;
  result.appendChild(banner);
}

function showPass() {
  result.className = 'pass';
  result.textContent = '';
  const banner = document.createElement('p');
  banner.className = 'banner';
  banner.textContent = 'PASS — valid against the MSD JSON Schema.';
  result.appendChild(banner);
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
    showPass();
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
