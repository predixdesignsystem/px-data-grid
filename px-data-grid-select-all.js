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

import './css/px-data-grid-select-all-styles.js';
import './px-data-grid-sorter.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
{
  /**
   * `<px-data-grid-select-all>` is a helper element for the `<px-data-grid>`
   * to be used to offer master select all and sorting functionality in
   * multiselect mode.
   * @memberof Predix
   * @mixes Polymer.Element
   */
  class DataGridSelectAllElement extends PolymerElement {
    static get template() {
      return html`
    <style include="px-data-grid-select-all-styles"></style>

    <vaadin-checkbox aria-label="Select All" on-checked-changed="_onSelectAllCheckedChanged" checked="[[checked]]" indeterminate="[[indeterminate]]"></vaadin-checkbox>
    <template is="dom-if" if="[[allowSortBySelection]]">
      <px-data-grid-sorter path="--selection--">
        ([[count]])
      
    </px-data-grid-sorter></template>
    <template is="dom-if" if="[[!allowSortBySelection]]">
        ([[count]])
    </template>
`;
    }

    static get is() {
      return 'px-data-grid-select-all';
    }

    static get properties() {
      return {

        /**
         * If checkbox is in indeterminate mode
         */
        indeterminate: {
          type: Boolean,
          value: false
        },

        /**
         * If checkbox is currently checked
         */
        checked: {
          type: Boolean,
          value: false
        },

        /**
         * Count of selected items
         */
        count: {
          type: Number,
          value: 0
        },

        /**
         * If user is allowed to sort by selection
         */
        allowSortBySelection: {
          type: Boolean,
          value: false
        },

        checkListener: {
          type: Function
        }
      };
    }

    _onSelectAllCheckedChanged(e) {
      if (this.checkListener) {
        this.checkListener(e);
      }
    }
  }

  customElements.define(DataGridSelectAllElement.is, DataGridSelectAllElement);

  Predix.DataGridSelectAllElement = DataGridSelectAllElement;
}
