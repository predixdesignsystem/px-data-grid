/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

import { flush as flush$0 } from '@polymer/polymer/lib/utils/flush.js';
import { useShadow } from '@polymer/polymer/lib/utils/settings.js';
const tableData = [{
  'first': 'Elizabeth',
  'last': 'Wong',
  'email': 'sika@iknulber.cl',
  'timestamp': '2005-05-20 0:00:00'
}, {
  'first': 'Jeffrey',
  'last': 'Hamilton',
  'email': 'cofok@rac.be',
  'timestamp': '2005-04-20 10:30:00'
}, {
  'first': 'Alma',
  'last': 'Martin',
  'email': 'dotta@behtam.la',
  'timestamp': '2003-05-20 10:30:00'
}, {
  'first': 'Elizabeth',
  'last': 'Saunders',
  'email': 'seh@bibapu.gy',
  'timestamp': '2003-05-20 10:20:00'
}, {
  'first': 'Willie',
  'last': 'Dennis',
  'email': 'izko@dahokwej.ci',
  'timestamp': '2010-12-20 10:30:00'
}];

const itemActions = [
  {'name': 'Add Row', 'id': 'add', 'icon': 'px-utl:add'},
  {'name': 'Delete Row', 'id': 'delete', 'icon': 'px-utl:delete'}
];

const tableActions = [
  {'name': 'Export CSV', 'id': 'csv', 'icon': 'px-doc:document-pdf'}
];

function getColumnConfig() {
  return [{
    name: 'First',
    path: 'first',
    renderer: 'px-data-grid-string-renderer',
    editable: true,
    type: 'string'
  }, {
    name: 'Last',
    path: 'last',
    renderer: 'px-data-grid-string-renderer',
    editable: true,
    type: 'string'
  }, {
    name: 'Email',
    path: 'email',
    renderer: 'px-data-grid-string-renderer',
    editable: true,
    type: 'string'
  }, {
    name: 'Timestamp',
    path: 'timestamp',
    dateFormat: {
      format: 'YYYY-MM-DD HH:mm:ss',
      timezone: 'UTC'
    },
    renderer: 'px-data-grid-date-renderer',
    rendererConfig: {
      displayFormat: 'MM/DD/YYYY HH:mm:ss',
      timezone: 'America/Los_Angeles'
    },
    editable: true,
    type: 'date'
  }];
}

function generateTableData(numRows) {
  const data = [];
  for (let i = 0; i < numRows; i++) {
    data.push({
      first: 'first-' + i,
      last: 'last-' + i,
      email: 'email-' + i + '@stuff.com',
      timestamp: generateTimestamp()
    });
  }
  return data;
}

function generateTimestamp() {
  let month,
    day,
    hour,
    minute,
    second;
  // generate date
  const year = Math.floor(Math.random() * 120) + 1900 + '';
  month = Math.floor(Math.random() * 12) + '';
  month = month.length < 2 ? '0' + month : month;
  day = Math.floor(Math.random() * 31) + '';
  day = day.length < 2 ? '0' + day : day;
  // generate time
  hour = Math.floor(Math.random() * 24) + '';
  hour = hour.length < 2 ? '0' + hour : hour;
  minute = Math.floor(Math.random() * 60) + '';
  minute = minute.length < 2 ? '0' + minute : minute;
  second = Math.floor(Math.random() * 60) + '';
  second = second.length < 2 ? '0' + second : second;
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

function getRows(grid) {
  const vaadinGrid = grid._vaadinGrid || grid._pxDataGrid._vaadinGrid;
  return vaadinGrid.$.items.querySelectorAll('tr');
}

function getRowsPaginatedGrid(grid) {
  return grid._pxDataGrid._vaadinGrid.$.items.querySelectorAll('tr');
}

function getVisibleRows(grid) {
  // the following querySelector fails on safari for some reason
  // return grid._vaadinGrid.$.items.querySelectorAll('tr:not([hidden]');
  const rows = getRows(grid);
  const visibleRows = Array.prototype.filter.call(rows, (row) => {
    return row.getAttribute('hidden') !== ''
        && row.getAttribute('hidden') !== true;
  });
  return visibleRows;
}

function getRowCells(row) {
  return Array.prototype.slice.call(dom(row).querySelectorAll('[part~="cell"]'));
}

function flushVaadinGrid(grid) {
  const vaadinGrid = grid.shadowRoot.querySelector('vaadin-grid');
  flush$0();
  vaadinGrid._observer.flush();
  flush$0();
  if (vaadinGrid._debounceScrolling) {
    vaadinGrid._debounceScrolling.flush();
  }
  if (vaadinGrid._debounceScrollPeriod) {
    vaadinGrid._debounceScrollPeriod.flush();
  }
  if (vaadinGrid._debouncerLoad) {
    vaadinGrid._debouncerLoad.flush();
  }
}

function getCell(grid, cell) {
  grid = grid._pxDataGrid || grid;
  const slot = cell.querySelector('slot');
  const slotName = slot.getAttribute('name');
  return grid.shadowRoot.querySelector('[slot="' + slotName + '"]');
}

function getCellContent(grid, _cell) {
  const cell = getCell(grid, _cell);
  const wrapper = cell.querySelector('px-data-grid-cell-content-wrapper');
  return wrapper.shadowRoot.firstElementChild.value;
}

function getBodyCellContent(grid, row, col) {
  const rows = getRows(grid);
  const cells = getRowCells(rows[row]);
  const cell = cells[col];
  return cell
    .querySelector('slot')
    .assignedNodes()[0]
    .querySelector('px-data-grid-cell-content-wrapper')
    .shadowRoot
    .firstElementChild
    .value;
}

/**
 * Gets the `innerText` of a cell renderer. Useful for testing simple renderers
 * that print out some formatted text.
 *
 * Compare with `getBodyCellContent()`, which gets the actual `value`
 * property for a renderer, which is the data passed to it that may
 * or may not be transformed to display to the user.
 */
function getBodyCellText(grid, row, col) {
  const rows = getRows(grid);
  const cells = getRowCells(rows[row]);
  const cell = cells[col];
  const renderer = cell
    .querySelector('slot')
    .assignedNodes()[0]
    .querySelector('px-data-grid-cell-content-wrapper')
    .shadowRoot
    .firstElementChild;
  return getShadowRootShallowInnerText(renderer);
}

function getBodyCellTextAsString(grid, row, cell) {
  const value = getBodyCellText(grid, row, cell);
  return (value + '').trim();
}

/**
 * Goal: Get the visible, rendered text in a given custom element's shadow root
 *
 * Naive approach: Just call `elem.innerText`
 *
 * The problem: In polyfilled browsers we can use `elem.innerText` to get the
 * rendered text, but in browsers with real shadow roots we cannot. The
 * innerText property returns an empty string because no children are
 * distributed in the custom element's light DOM.
 *
 * This function normalizes the difference and tries to return just what is
 * visible to the user within a given custom element's shadow root. It is
 * not recursive so it can only get text content that is not hidden another
 * level deep in a different shadow DOM.
 *
 * Thanks to https://github.com/duckinator/innerText-polyfill/blob/master/innertext.js
 * for the right direction on solving this problem.
 */
function getShadowRootShallowInnerText(elem) {
  const hasNativeShadow = useShadow;
  if (!hasNativeShadow) {
    return elem.innerText;
  }
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.selectAllChildren(elem.shadowRoot);
  const text = selection.toString();
  selection.removeAllRanges();
  return text;
}

function getHeaderCell(grid, index) {
  return grid._vaadinGrid.$.header.querySelectorAll('tr:nth-child(2) [part~="cell"]')[index];
}

function getHeaderCellContent(cell) {
  return cell ? cell.querySelector('slot').assignedNodes()[0].querySelector('px-data-grid-header-cell') : null;
}

/**
 * Add a custom chai property that allows us to detect whether a given element is visible.
 * Visible is defined as having a display property that isn't none or null.
 */
const getDisplayProp = el => window.getComputedStyle(el).display || 'none';
const isElement = el => el instanceof HTMLElement;
const isVisible = el => getDisplayProp(el) !== 'none';

chai.Assertion.addProperty('visible', function() {
  const el = this._obj;
  this.assert(
    isElement(el) && isVisible(el),
    'expected #{this} to be visible',
    'expected #{this} not to be visible'
  );
});
