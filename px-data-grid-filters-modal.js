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
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import 'px-modal/px-modal.js';
import 'px-icon-set/px-icon.js';
import './css/px-data-grid-filters-modal-styles.js';
import './px-data-grid-filter.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
{
  /**
   * @memberof Predix
   * @extends Polymer.Element
   */
  class DataGridFiltersModalElement extends PolymerElement {
    static get template() {
      return html`
    <style include="px-data-grid-filters-modal-styles"></style>

    <px-modal id="filtersModal" header-text="[[localize('Filter Columns')]]" open-trigger="[[filtersModalTrigger]]">
      <div slot="body">
        <px-data-grid-filter id="filters" columns="[[columns]]" filters="{{filters}}" temp-filters="{{_tempFilters}}" compact-mode="[[compactMode]]" disable-all-columns-filter="[[disableAllColumnsFilter]]" string-comparators="[[stringComparators]]" number-comparators="[[numberComparators]]" localize="[[localize]]">
        </px-data-grid-filter>

        <template is="dom-if" if="[[_showSaveCheckbox(offerFilterSaving, _tempFilters, _tempFilters.*)]]" restamp="">
          <input id="saveFilterSet" type="checkbox">
          <label class="label--inline" for="saveFilterSet">[[localize('Save this filter set')]]</label>
        </template>
      </div>
      <div slot="actions" class="action-buttons">
        <template is="dom-if" if="[[_hasAnyEntity(_tempFilters, _tempFilters.*)]]">
          <button class="btn" on-click="_reset">[[localize('Reset')]]</button>
        </template>
      </div>
      <button slot="reject-trigger" class="btn action-btn" on-click="_cancel">[[localize('Cancel')]]</button>
      <button slot="accept-trigger" class="btn btn--call-to-action action-btn" on-click="_apply">[[localize('Apply')]]</button>
    </px-modal>

    <px-modal-trigger trigger="{{filtersModalTrigger}}">
      <button class="btn table-filters">
        <px-icon icon="px-utl:filter"></px-icon>
        [[localize('Table Filters')]]
      </button>
    </px-modal-trigger>
`;
    }

    static get is() {
      return 'px-data-grid-filters-modal';
    }

    static get properties() {
      return {
        columns: Array,

        filters: {
          type: Array,
          notify: true
        },

        initialFilterState: {
          type: Array,
        },

        offerFilterSaving: {
          type: Boolean,
          value: false
        },

        compactMode: {
          type: Boolean,
          value: false
        },

        disableAllColumnsFilter: {
          type: Boolean,
          value: false
        },

        stringComparators: {
          type: Array
        },

        numberComparators: {
          type: Array
        },

        _tempFilters: {
          type: Array
        },

        localize: Function
      };
    }

    ready() {
      super.ready();

      this.addEventListener('update-modal-focusable-elements', (event) => {
        this.$.filtersModal.findFocusableElements();
      });
    }

    open() {
      this.$.filtersModal.opened = true;
    }

    _apply() {
      this.$.filters.applyFilters();

      const checkbox = this.shadowRoot.querySelector('#saveFilterSet');

      if (checkbox && checkbox.checked) {
        this.dispatchEvent(
          new CustomEvent('save-filters',
            {
              bubbles: true,
              composed: true,
              detail: {
                filters: this.filters
              }
            }
          )
        );
      }

      this.$.filtersModal.opened = false;
    }

    _cancel() {
      this.$.filters.cancelChanges();
      this.$.filtersModal.opened = false;
    }

    _reset() {
      this.$.filters.resetFilters();
      this.set('filters', this.initialFilterState);
    }

    _hasAnyEntity(filters) {
      return filters.filter(filter => filter.entities && filter.entities.length > 0).length > 0;
    }

    _showSaveCheckbox(offerFilterSaving, filters) {
      return offerFilterSaving && filters && this._hasAnyEntity(filters);
    }
  }

  customElements.define(DataGridFiltersModalElement.is, DataGridFiltersModalElement);

  Predix.DataGridFiltersModalElement = DataGridFiltersModalElement;
}
