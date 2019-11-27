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

import './css/px-auto-filter-field-styles.js';
import 'px-icon-set/px-icon.js';
import '@polymer/app-localize-behavior/app-localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
{
  /**
   * Auto filtering field used by px-data-grid
   *
   * @memberof Predix
   * @extends Polymer.Element
   */
  class AutoFilterFieldElement extends PolymerElement {
    static get template() {
      return html`
    <style include="px-auto-filter-field-styles"></style>
    <div class="search__form">
      <input id="search-field" class="text-input input--small search__box" type="text" name="autofilter" value="{{value::input}}" placeholder="{{placeholder}}">
      
      <px-icon class="search__icon" icon="px-utl:search"></px-icon>
    </div>
`;
    }

    static get is() {
      return 'px-auto-filter-field';
    }

    static get properties() {
      return {

        /**
         * Placeholder text shown in field
         */
        placeholder: {
          type: String
        },

        /**
         * Timeout value in milliseconds
         */
        timeout: {
          type: Number,
          value: 400
        },

        value: {
          type: String,
          notify: true,
          observer: '_onChange'
        }
      };
    }

    _onChange() {
      this._renderDebouncer = Debouncer.debounce(
        this._renderDebouncer,
        timeOut.after(this.timeout), () => {
          this.dispatchEvent(new CustomEvent('filter-change', {
            detail: {
              value: this.value
            },
            bubbles: true
          }));
        });
    }
  }

  customElements.define(AutoFilterFieldElement.is, AutoFilterFieldElement);

  Predix.AutoFilterFieldElement = AutoFilterFieldElement;
}
