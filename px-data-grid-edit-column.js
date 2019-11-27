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
import 'px-icon-set/px-icon.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
{
  /**
   * `<px-data-grid-edit-column>` is a helper element for the `<px-data-grid>`
   * to be used to offer either edit or cancel button. Only one of these button
   * can be shown at once.
   * @memberof Predix
   * @mixes Vaadin.GridColumnElement
   */
  class DataGridEditColumnElement extends Vaadin.GridColumnElement {
    static get template() {
      return html`
    <!-- Keep header empty -->
    <template class="header" id="defaultHeaderTemplate">
    </template>

    <template id="defaultBodyTemplate">
      <template is="dom-if" if="[[!item.hasChildren]]">
        <button class\$="[[_resolveButtonClass(item, edittedItem)]]" style\$="[[_resolveHiddenStyle(item, edittedItem)]]" on-click="_handleButtonClick" data-item="[[item]]">
          <px-icon icon="[[_resolveIcon(item, edittedItem)]]" class\$="[[_resolveIconClass(item, edittedItem)]]"></px-icon>
        </button>
      </template>
    </template>
`;
    }

    static get is() {
      return 'px-data-grid-edit-column';
    }

    static get properties() {
      return {
        cancel: Function,
        edit: Function,

        /**
         * Just to help to identify columns without data
         */
        isDataColumn: {
          type: Boolean,
          value: false,
          readOnly: true
        },

        /**
         * Width of the cells for this column.
         */
        width: {
          type: String,
          value: '30px'
        },

        /**
         * Currently editted object
         */
        edittedItem: {
          type: Object
        },

        /**
         * Is component in edit mode (if false no edit options will be offered)
         */
        editMode: {
          type: Boolean,
          value: false
        },

        /**
         * Flex grow ratio for the cell widths. When set to 0, cell width is fixed.
         */
        flexGrow: {
          type: Number,
          value: 0
        }
      };
    }

    static get observers() {
      return [
        '_updateHoverEffect(edittedItem)'
      ];
    }

    _resolveHiddenStyle(item, edittedItem) {
      if (edittedItem && edittedItem !== item) {
        return 'visibility: hidden';
      } else {
        return '';
      }
    }

    _resolveIcon(item, edittedItem) {
      if (item === edittedItem) {
        return 'px-utl:close';
      } else {
        return 'px-utl:edit';
      }
    }

    _resolveButtonClass(item, edittedItem) {
      if (item === edittedItem) {
        return 'btn btn--bare btn--icon item-edit-cancel-button action-column-button';
      } else {
        return 'btn btn--bare btn--icon action-column-button edit-button';
      }
    }

    _resolveIconClass(item, edittedItem) {
      if (item === edittedItem) {
        return 'rounded';
      } else {
        return '';
      }
    }

    _updateHoverEffect(edittedItem) {
      if (this._cells) {
        this._cells.forEach(cell => {
          if (edittedItem) {
            cell.removeAttribute('hidden-unless-hover');
          } else {
            cell.setAttribute('hidden-unless-hover', '1');
          }
        });
      }
    }

    _prepareHeaderTemplate() {
      const headerTemplate = this._prepareTemplatizer(this._findTemplate('template.header') || this.$.defaultHeaderTemplate);
      // needed to override the dataHost correctly in case internal template is used.
      headerTemplate.templatizer.dataHost = headerTemplate === this.$.defaultHeaderTemplate ? this : this.dataHost;

      return headerTemplate;
    }

    _prepareBodyTemplate() {
      const template = this._prepareTemplatizer(this._findTemplate('template:not(.header):not(.footer)') || this.$.defaultBodyTemplate);
      // needed to override the dataHost correctly in case internal template is used.
      template.templatizer.dataHost = template === this.$.defaultBodyTemplate ? this : this.dataHost;

      return template;
    }

    _stampBodyTemplate(template, cells) {
      if (!template || !this._cells) {
        return;
      }

      this._cells.forEach(cell => {
        if (cell._template !== template) {
          cell._template = template;

          cell._content.innerHTML = '';
          const inst = template.templatizer.createInstance();
          cell._content.appendChild(inst.root);
          cell._instance = inst;

          if (!this.edittedItem) {
            cell.setAttribute('hidden-unless-hover', '1');
          }

          inst.index = cell.parentElement.index; // TODO: _index
          inst.item = cell.parentElement._item;
        }
      });
    }

    /** @private */
    connectedCallback() {
      super.connectedCallback();
      if (this._grid) {
        // const _grid = this._grid;

        // TODO
      }
    }

    _handleButtonClick(e) {
      if (this.edittedItem) {
        this._handleCancel(e);
      } else {
        this._handleEdit(e);
      }
    }

    _handleEdit(e) {
      const editItem = e.target.dataItem;
      if (editItem == undefined) {
        console.warn('No item mapping on edit button');
        return;
      }

      // To prevent selections
      e.stopPropagation();
      e.details = {
        item: editItem
      };
      this.edit(e);
    }

    _handleCancel(e) {
      // To prevent selections
      e.stopPropagation();
      this.cancel(e);
    }
  }

  window.customElements.define(DataGridEditColumnElement.is, DataGridEditColumnElement);

  Predix.DataGridEditColumnElement = DataGridEditColumnElement;
}
