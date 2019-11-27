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

import './px-data-grid-filter-section.js';
import 'px-icon-set/px-icon.js';
import './css/px-data-grid-filter-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
{
  /**
   * @memberof Predix
   * @extends Polymer.Element
   */
  class DataGridFilterElement extends PolymerElement {
    static get template() {
      return html`
    <style include="px-data-grid-filter-styles"></style>

    <template is="dom-repeat" items="{{tempFilters}}" as="section">
      <px-data-grid-filter-section section="{{section}}" columns="[[columns]]" compact-mode="[[compactMode]]" disable-all-columns-filter="[[disableAllColumnsFilter]]" string-comparators="[[stringComparators]]" number-comparators="[[numberComparators]]" localize="[[localize]]">
      </px-data-grid-filter-section>
    </template>

    <!--
    <button class="btn btn--bare--primary" on-click="_addGroup">
      <px-icon style="--iron-icon-height:16px" icon="px-utl:add"></px-icon> Add filter section
    </button>
    -->
`;
    }

    static get is() {
      return 'px-data-grid-filter';
    }

    static get properties() {
      return {
        columns: {
          type: Array
        },

        filters: {
          type: Array,
          notify: true
        },

        tempFilters: {
          type: Array,
          notify: true
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

        localize: Function
      };
    }

    static get observers() {
      return [
        '_filtersObserver(filters, filters.*)'
      ];
    }

    _addGroup() {
      this.push('filters', {entities: [], action: 'show', operationType: 'all'});
    }

    _filtersObserver(filters) {
      if (!filters) {
        return;
      }

      this._restoreTempFilters();
    }

    applyFilters() {
      this.set('filters', this.tempFilters);
    }

    cancelChanges() {
      this._restoreTempFilters();
    }

    resetFilters() {
      this.set('filters', [{entities: [], action: 'show', operationType: 'all'}]);
    }

    _restoreTempFilters() {
      this.set('tempFilters', JSON.parse(JSON.stringify(this.filters)));
    }
  }

  customElements.define(DataGridFilterElement.is, DataGridFilterElement);

  Predix.DataGridFilterElement = DataGridFilterElement;
}
