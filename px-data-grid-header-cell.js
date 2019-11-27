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

import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import 'px-dropdown/px-dropdown.js';
import 'px-icon-set/px-icon.js';
import './css/px-data-grid-header-cell-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
{
  class DataGridHeaderCellElement extends GestureEventListeners(PolymerElement) {
    static get template() {
      return html`
    <style include="px-data-grid-header-cell-styles"></style>
    <px-dropdown allow-outside-scroll="" button-style="icon" icon="px-nav:menu" items="{{_dropdownItems}}" opened="{{dropdownOpened}}" hidden\$="[[_dropdownHidden]]" on-px-dropdown-click="_dropdownItemClick" on-click="_dropdownClick" on-tap="_dropdownClick" hoist="">
      <px-icon slot="trigger" icon="px-nav:menu"></px-icon>
    </px-dropdown>
    <slot></slot>
`;
    }

    static get is() {
      return 'px-data-grid-header-cell';
    }

    static get properties() {
      return {
        /**
         * If true, opens nested dropdown.
         */
        dropdownOpened: {
          type: Boolean,
          observer: '_dropdownOpenedChanged'
        },

        groupByColumnAllowed: {
          type: Boolean,
          value: true
        },

        _dropdownHidden: {
          type: Boolean,
          value: true
        },

        _mouseover: {
          type: Boolean,
          value: false
        },

        _column: {
          type: Object
        },

        _dropdownItems: {
          type: Array
        },

        localize: Function
      };
    }

    static get observers() {
      return [
        '_setDropdownItems(localize, _column.*, groupByColumnAllowed)'
      ];
    }

    ready() {
      super.ready();

      this.addEventListener('mouseenter', () => {
        this._dropdownHidden = false;
        this._mouseover = true;
      });

      this.addEventListener('mouseleave', () => {
        this._mouseover = false;
        if (!this.dropdownOpened) {
          this._dropdownHidden = true;
        }
      });

      this.addEventListener('click', (e) => {
        this.querySelector('px-data-grid-sorter').click();
      });
    }

    _freezeColumn() {
      this._column.frozen = true;

      this.dispatchEvent(new CustomEvent('column-froze', {
        bubbles: true,
        composed: true,
        detail: {
          column: this._column
        }
      }));
    }

    _unfreezeColumn() {
      this._column.frozen = false;

      this.dispatchEvent(new CustomEvent('column-unfroze', {
        bubbles: true,
        composed: true,
        detail: {
          column: this._column
        }
      }));
    }

    _hideColumn() {
      this._column.hidden = true;
    }

    _groupByColumn() {
      this._column.grouped = true;

      this.dispatchEvent(new CustomEvent('group-by-column', {
        bubbles: true,
        composed: true,
        detail: {
          column: this._column
        }
      }));
    }

    _ungroup() {
      this._column.grouped = false;

      this.dispatchEvent(new CustomEvent('ungroup', {
        bubbles: true,
        composed: true,
        detail: {
          column: this._column
        }
      }));
    }

    _setDropdownItems() {
      if (this._column) {

        // First construct all items, only then apply to dropdownItems
        // px-dropdown has issues noticing changes inside array
        const newItems = [];

        if (this._column.frozen) {
          newItems.push(
            {
              key: {
                action: () => this._unfreezeColumn()
              },
              val: this.localize('Unfreeze column'),
              disableSelect: true
            }
          );
        } else {
          newItems.push(
            {
              key: {
                action: () => this._freezeColumn()
              },
              val: this.localize('Freeze column'),
              disableSelect: true
            }
          );
        }

        if (this._canBeHidden()) {
          newItems.push(
            {
              key: {
                action: () => this._hideColumn()
              },
              val: this.localize('Hide column'),
              disableSelect: true
            }
          );
        }

        if (this.groupByColumnAllowed) {
          if (this._column.grouped) {
            newItems.push(
              {
                key: {
                  action: () => this._ungroup()
                },
                val: this.localize('Ungroup'),
                disableSelect: true
              }
            );
          } else {
            newItems.push(
              {
                key: {
                  action: () => this._groupByColumn()
                },
                val: this.localize('Group by column'),
                disableSelect: true
              }
            );
          }
        }

        this._dropdownItems = newItems;
      }
    }

    _dropdownOpenedChanged(dropdownOpened) {
      if (!dropdownOpened && !this._mouseover) {
        this._dropdownHidden = true;
      }

      // This hack is needed because each column has its own stacking context
      // and when the drop-down of the pinned column opens,
      // it is overlapped by the next pinned column.
      const rowStyle = this.parentElement.assignedSlot.parentElement.style;
      if (dropdownOpened) {
        rowStyle.zIndex = '3';
      } else {
        rowStyle.zIndex = '';
      }

      // Just make sure menu is up to date
      if (dropdownOpened) {
        this._setDropdownItems();
      }
    }

    _dropdownItemClick(e) {
      const item = e.detail.detail.item;

      if (item && item.key) {
        item.key.action();
      }
    }

    _dropdownClick(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    _canBeHidden() {
      if (this._column && this._column._grid && this._column._grid._pxDataGrid) {
        const pxDataGrid = this._column._grid._pxDataGrid;
        const groupedByThis = pxDataGrid._groupByColumn == this._column;
        return !groupedByThis && pxDataGrid.getVisibleColumns().length > 1;
      } else {
        console.warn('Failed to resolve if column can be hidden');
        return true;
      }
    }
  }

  customElements.define(DataGridHeaderCellElement.is, DataGridHeaderCellElement);

  Predix.DataGridHeaderCellElement = DataGridHeaderCellElement;
}
