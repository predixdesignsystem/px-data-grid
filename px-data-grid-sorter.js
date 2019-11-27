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

import './px-data-grid-theme.js';
import 'px-icon-set/px-icon.js';
import './css/px-data-grid-sorter-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ThemableMixin } from 'vaadin-themable-mixin/vaadin-themable-mixin.js';
{
  /**
   *
   */
  class GridSorterElement extends ThemableMixin(PolymerElement) {
    static get template() {
      return html`
    <style include="px-data-grid-sorter-styles"></style>

    <div part="content">
      <slot></slot>
    </div>
    <div part="indicators"><px-icon id="order-icon" class="order-icon" icon="[[_getDirectionIcon(direction)]]" hidden="[[!_isOrdered(_order, direction)]]"></px-icon>[[_getDisplayOrder(_order)]]</div>
`;
    }

    static get is() {
      return 'px-data-grid-sorter';
    }

    static get properties() {
      return {
        /**
        * JS Path of the property in the item used for sorting the data.
        */
        path: String,

        /**
        * How to sort the data.
        * Possible values are `asc` to use an ascending algorithm, `desc` to sort the data in
        * descending direction, or `null` for not sorting the data.
        */
        direction: {
          type: String,
          reflectToAttribute: true,
          notify: true,
          value: null
        },

        _order: {
          type: Number,
          value: null
        },

        _isConnected: {
          type: Boolean,
          value: false
        }
      };
    }

    static get observers() {
      return [
        '_pathOrDirectionChanged(path, direction, _isConnected)',
        '_directionOrOrderChanged(direction, _order)'
      ];
    }

    ready() {
      super.ready();
      this.addEventListener('click', this._onClick.bind(this));
    }

    connectedCallback() {
      super.connectedCallback();
      this._isConnected = true;
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this._isConnected = false;
    }

    _pathOrDirectionChanged(path, direction, isConnected) {
      if (path === undefined || direction === undefined || isConnected === undefined) {
        return;
      }

      if (isConnected) {
        // Fire custom event that is handled differently than default sorter-changed
        this.dispatchEvent(new CustomEvent('px-sorter-changed', {
          bubbles: true,
          composed: true,
          detail: {
            sorter: this
          }
        }));
      }
    }

    _getDisplayOrder(order) {
      return order === null ? '' : order + 1;
    }

    _getDirectionIcon(direction) {
      if (direction === 'desc') {
        return 'px-nav:down';
      } else if (direction === 'asc') {
        return 'px-nav:up';
      } else {
        return 'px-nav:unconfirmed';
      }
    }

    _isOrdered() {
      return this.direction !== null;
    }

    _onClick(e) {
      const activeElement = this.getRootNode().activeElement;
      if (this !== activeElement && this.contains(activeElement)) {
        // Some focusable content inside the sorter was clicked, do nothing.
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (this.direction === 'asc') {
        this.direction = 'desc';
      } else if (this.direction === 'desc') {
        this.direction = null;
      } else {
        this.direction = 'asc';
      }
    }

    _directionOrOrderChanged(direction, order) {
      if (direction === undefined || order === undefined) {
        return;
      }

      // Safari has an issue with repainting shadow root element styles when a host attribute changes.
      // Need this workaround (toggle any inline css property on and off) until the issue gets fixed.
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari && this.root) {
        this.root.querySelectorAll('*').forEach(function(el) {
          el.style['-webkit-backface-visibility'] = 'visible';
          el.style['-webkit-backface-visibility'] = '';
        });
      }
    }
  }

  customElements.define(GridSorterElement.is, GridSorterElement);

  Predix.GridSorterElement = GridSorterElement;
}
