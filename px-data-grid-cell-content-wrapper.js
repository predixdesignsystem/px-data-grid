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

import { MutableData } from '@polymer/polymer/lib/mixins/mutable-data.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
{
  /**
   * A `<px-data-grid-cell-content-wrapper>` is used to wrap user
   * or generated content in order to fire proper events and observe renderers.
   *
   * @memberof Predix
   * @extends Polymer.Element
   */
  class DataGridCellContentWrapperElement extends MutableData(PolymerElement) {
    static get template() {
      return html`

`;
    }

    static get is() {
      return 'px-data-grid-cell-content-wrapper';
    }

    static get properties() {
      return {
        item: {
          type: Object,
          notify: true
        },
        column: {
          type: Object
        },
        /**
         * Color of cell, if 'default' will use default highlight color
         */
        cellColor: {
          type: String,
          observer: '_cellColorChanged'
        },

        _itemWas: {
          type: Object,
          value: undefined
        },

        localize: Function,

        _valueElement: Element
      };
    }

    static get observers() {
      return [
        '_render(column.renderer, column.path, column.editable, item,  localize, item.*)'
      ];
    }

    constructor() {
      super();

      this._boundValueChangedListener = this._valueChangedListener.bind(this);
    }

    ready() {
      super.ready();

      this.addEventListener('mouseover', this._fireCellHoverEvent);
      this.addEventListener('mouseout', this._fireCellUnhoverEvent);
      document.addEventListener('editing-item-changed', (event) => {
        if (!this._valueElement) {
          return;
        }

        if (event.detail.item === this.item && this.column.editable) {
          this._valueElement._editing = true;
        } else if (this._valueElement._editing && event.detail.item !== this.item) {
          this._valueElement._editing = false;
        }
      });
    }

    focus() {
      const input = this._valueElement.shadowRoot.querySelector('#editingTemplateInput');
      if (input && input.focus) {
        input.focus();
      }
    }

    _fireCellHoverEvent(event) {
      this.dispatchEvent(
        new CustomEvent('cell-hover', {
          bubbles: true,
          composed: true,
          detail: {
            item: this.item,
            column: this.column,
            cellContent: this.get(this.column.path, this.item)
          }
        })
      );
    }

    _fireCellUnhoverEvent(event) {
      this.dispatchEvent(
        new CustomEvent('cell-unhover', {
          bubbles: true,
          composed: true,
          detail: {
            item: this.item,
            column: this.column,
            cellContent: this.get(this.column.path, this.item)
          }
        })
      );
    }

    _valueChangedListener(event) {
      if (!this.column || !this.column.path) {
        return;
      }

      this.set('item.' + this.column.path, event.detail.value);
    }

    _cellColorChanged(color) {
      if (color) {
        if (color === 'default') {
          this.style.backgroundColor = '#FFE070';
        } else {
          this.style.backgroundColor = color;
        }
      } else {
        this.style.backgroundColor = null;
      }
    }

    _render(renderer, path, editable, item, localize) {
      if (path === undefined || item === undefined) {
        return;
      }

      const newItem = this._itemWas && item !== this._itemWas;
      this._itemWas = item;

      if ((!this._valueElement || newItem) && renderer) {
        this._valueElement = document.createElement(renderer);
        this._valueElement.addEventListener('value-changed', this._boundValueChangedListener);
        this._valueElement.column = this.column;
        this.shadowRoot.textContent = '';
        this.shadowRoot.appendChild(this._valueElement);
      }

      let value;
      if (path) {
        value = this.get(path, item);

        if (value === undefined) {
          value = '';
        }
      } else {
        value = item;
      }

      if (renderer) {
        this._valueElement.initialValue = value;
        this._valueElement.editable = editable;
        this._valueElement.localize = localize;
        this._valueElement.item = item;
      } else {
        this.shadowRoot.textContent = value;
      }
    }
  }

  customElements.define(DataGridCellContentWrapperElement.is, DataGridCellContentWrapperElement);

  Predix.DataGridCellContentWrapperElement = DataGridCellContentWrapperElement;
}
