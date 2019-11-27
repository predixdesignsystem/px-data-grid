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

import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import 'vaadin-grid/vaadin-grid-column.js';
import 'px-icon-set/px-icon.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
{
  /**
   * `<px-data-grid-action-column>` is a helper element for the `<px-data-grid>`
   * to be used to offer action dropdown or apply button
   * @memberof Predix
   * @mixes Vaadin.GridColumnElement
   */
  class DataGridActionColumnElement extends GestureEventListeners(Vaadin.GridColumnElement) {
    static get template() {
      return html`
    <template class="header" id="defaultHeaderTemplate">
    </template>

    <template id="defaultBodyTemplate">

      <!-- vaadin-grid needs button at start to handle keyboard navigation, this hidden element will
           catch the keyboard events and re-direct those correctly -->
      <button class="hidden-keyboard-focus-handler" on-click="_figureOutWhichOneToClick" style="display: none;">
      </button>

      <template is="dom-if" if="[[_showSaveButton(item, editMode, edittedItem)]]" restamp="">
        <button class="btn btn--bare btn--icon item-edit-save-button action-column-button" on-click="_handleSave" data-item="[[item]]">
          <px-icon icon="px-utl:check" class="rounded">Save</px-icon>
        </button>
      </template>
      <template is="dom-if" if="[[_showActionDropdown(item, editMode, edittedItem)]]" restamp="">
        <px-dropdown allow-outside-scroll="" button-style="icon" icon="px-nav:menu" items="[[_convertActions(itemActions)]]" disable-clear="" data-item="[[item]]" class="item-action-dropdown" tabindex="0" on-px-dropdown-click="_dropdownItemClick" on-click="_dropdownClick" on-tap="_dropdownClick" hoist="">
          <px-icon slot="trigger" icon="px-nav:menu"></px-icon>
        </px-dropdown>
      </template>
    </template>
`;
    }

    static get is() {
      return 'px-data-grid-action-column';
    }

    static get properties() {
      return {
        save: Function,

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
        },

        /**
         * Item actions offered to end user.
         */
        itemActions: {
          type: Array,
          value: []
        }
      };
    }

    static get observers() {
      return [
        '_toggleEditClassName(edittedItem)'
      ];
    }

    _toggleEditClassName(edittedItem) {
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

    _handleSave(e) {
      // To prevent selections
      e.stopPropagation();
      this.save(e);

      /**
       * @event item-save
       *
       * Fired when the current edited item is saved by the user.
       * `evt.detail` contains a reference to the updated `tableData` item
       *
       */
      this._gridValue.dispatchEvent(new CustomEvent('item-save', {
        bubbles: true,
        composed: true,
        detail: e.model.item
      }));
    }

    _figureOutWhichOneToClick(e) {
      const item = e.model.item;
      if (this.edittedItem == item) {
        this._handleSave(e);
      } else {
        const dropdown = e.target.parentElement.querySelector('px-dropdown');
        if (dropdown) {
          dropdown.toggle();
        } else {
          return;
        }
      }
      e.preventDefault();
      e.stopPropagation();
    }

    _showSaveButton(item, editMode, edittedItem) {
      return editMode && item && item === edittedItem;
    }

    _showActionDropdown(item, editMode, edittedItem) {
      return !this._showSaveButton(item, editMode, edittedItem)
        && item && item._groupId === undefined
        && this.itemActions && this.itemActions.length > 0;
    }

    _convertActions(actions) {
      const dropdownItems = [];
      if (actions) {
        for (let i = 0; i < actions.length; ++i) {
          const input = actions[i];
          dropdownItems.push({
            key: '-action-' + input.id,
            val: input.name,
            icon: input.icon,
            selected: false,
            disableSelect: true
          });
        }
      }
      return dropdownItems;
    }

    _dropdownItemClick(e) {
      const actionItem = e.target.dataItem;

      if (actionItem === undefined) {
        console.warn('No item mapping for actions');
        return;
      }

      const clickedItem = e.detail.detail.item;
      if (clickedItem && clickedItem.key && typeof clickedItem.key == 'string') {

        if (clickedItem.key.indexOf('-action-') === 0) {

          const actionId = clickedItem.key.substr('-action-'.length);

          // Dispatch event from vaadin-grid el (_gridValue) to workaround shady DOM issue where composed events don't always propogate
          this._gridValue.dispatchEvent(new CustomEvent('item-action', {
            bubbles: true,
            composed: true,
            detail: {
              item: actionItem,
              action: actionId
            }
          }));
        } else {
          console.warn('Unknown action: ' + clickedItem.key);
        }
      } else {
        console.warn('Unknown action');
      }
    }

    _dropdownClick(e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  window.customElements.define(DataGridActionColumnElement.is, DataGridActionColumnElement);

  Predix.DataGridEActionColumnElement = DataGridActionColumnElement;
}
