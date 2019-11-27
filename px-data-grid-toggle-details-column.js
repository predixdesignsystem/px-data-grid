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
import '@polymer/polymer/polymer-legacy.js';

import 'vaadin-grid/vaadin-grid-column.js';
import 'vaadin-checkbox/vaadin-checkbox.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
{
  /**
   * `<px-data-grid-toggle-details-column>` is a helper element for the `<px-data-grid>`
   * to be used to toggle row expansion (row details) column behavior.
   * @memberof Predix
   * @mixes Vaadin.GridColumnElement
   */
  class DataGridToggleDetailsColumnElement extends Vaadin.GridColumnElement {
    static get template() {
      return html`
    <template class="header">
      <!-- empty header -->
    </template>

    <template id="defaultBodyTemplate">
      <template is="dom-if" if="[[!item.hasChildren]]">
        <div class="toggle-details" on-click="_onToggleClick">
          <px-icon icon="[[_getChevronIcon(detailsOpened)]]"></px-icon>
        </div>
      </template>
    </template>
`;
    }

    static get is() {
      return 'px-data-grid-toggle-details-column';
    }

    static get properties() {
      return {
        /**
         * Width of the cells for this column.
         */
        width: {
          type: String,
          value: '30px'
        },

        /**
         * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
         */
        flexGrow: {
          type: Number,
          value: 0
        },

        /**
         * Identify column as non-data column
         */
        isDataColumn: {
          type: Boolean,
          value: false,
          readOnly: true
        },

        /**
        * @private
        */
        template: Object,

        _indeterminate: Boolean,

      };
    }

    _prepareBodyTemplate() {
      const template = this._prepareTemplatizer(this._findTemplate('template:not(.header):not(.footer)') || this.$.defaultBodyTemplate);
      // needed to override the dataHost correctly in case internal template is used.
      template.templatizer.dataHost = template === this.$.defaultBodyTemplate ? this : this.dataHost;

      return template;
    }

    _onToggleClick(e) {
      e.stopPropagation();
      e.model.detailsOpened = !e.model.detailsOpened;
      // tell vaadin grid of a resize so the height gets recalculated
      if (e.model.detailsOpened && e.model.parentModel && e.model.parentModel._gridValue) {
        const vaadinGrid = e.model.parentModel._gridValue;
        afterNextRender(vaadinGrid, () => vaadinGrid.notifyResize());
      }
    }

    _getChevronIcon(detailsOpened) {
      return detailsOpened ? 'px-utl:chevron' : 'px-utl:chevron-right';
    }
  }

  customElements.define(DataGridToggleDetailsColumnElement.is, DataGridToggleDetailsColumnElement);

  Predix.DataGridToggleDetailsColumnElement = DataGridToggleDetailsColumnElement;
}
