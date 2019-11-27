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
/* Common imports */
/* Import peer demo pages */
/*
  NOTE: Keeping these demos here but no longer linking to them. We'll fold
  the examples in the demos into our docs or examples/ folder and delete them.
  <link rel="import" href="px-data-grid-column-demo.html">
  <link rel="import" href="px-data-grid-highlight-demo.html">
  <link rel="import" href="px-data-grid-remote-data-provider-demo.html">
  <link rel="import" href="px-data-grid-row-details-demo.html">
  <link rel="import" href="px-data-grid-custom-renderer-demo.html">
  <link rel="import" href="px-data-grid-date-and-time-demo.html">
*/
/* Demo DOM module */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import 'px-demo/css/px-demo-styles.js';

import 'px-demo/px-demo-collection.js';
import './px-data-grid-demo.js';
import './px-data-grid-paginated-demo.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
{
  class LocalElementDemo extends PolymerElement {
    static get template() {
      return html`
    <!-- Theme includes -->
    <style include="px-demo-styles" is="custom-style"></style>

    <!-- Demo list/view change entrypoint -->
    <px-demo-collection demos="{{demos}}" chosen-demo-name="[[chosenDemoName]]"></px-demo-collection>
`;
    }

    static get is() {
      return 'local-element-demo';
    }

    static get properties() {
      return {
        demos: {
          type: Array,
          value: function() {
            return [
              {
                name: 'px-data-grid',
                tagName: 'px-data-grid-demo'
              },
              {
                name: 'px-data-grid-paginated',
                tagName: 'px-data-grid-paginated-demo'
              }
            ];
          }
        },

        chosenDemoName: {
          type: String,
          value: 'px-data-grid',
        }
      };
    }
  }
  customElements.define(LocalElementDemo.is, LocalElementDemo);
}
