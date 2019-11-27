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

### Styling
The following custom properties are available for styling of the string-renderer content.

Custom property | Description
'--px-data-grid-cell-string-column-overflow' | controls the overflow behavior, visible, hidden
'--px-data-grid-cell-string-column-white-space' | controls how white-spaces are handled, normal, nowrap
'--px-data-grid-cell-string-column-word-wrap' | controls how word-wrapping is handled normal, break-word
'--px-data-grid-cell-string-column-text-overflow' | controls how text-overflow is handled, clip, ellipsis
'--px-data-grid-cell-string-column-editor-align-items | control editor alignment when in edit mode, center, flex-end, flex-start'

Examples:
Make string-renderer columns wrap the content:
--px-data-grid-cell-string-column-overflow: hidden;
--px-data-grid-cell-string-column-word-wrap: break-word;

Make string-renderer columns use ellipsis overflow:
--px-data-grid-cell-string-column-text-overflow: ellipsis;
--px-data-grid-cell-string-column-white-space: nowrap;
--px-data-grid-cell-string-column-overflow: hidden;

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import 'px-tooltip/px-tooltip.js';
import { DataGridRendererMixin } from './px-data-grid-renderer-mixin.js';
import './px-data-grid-theme.js';
import './css/px-data-grid-string-renderer-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
{
  /**
   * A `<px-data-grid-string-renderer>` is standard renderer for string cell content.
   * This element shows how to implement custom renderer in order to display uncommon data.
   * Each renderer that is needed for displaying content should have element with id="value",
   * which is rendered in non-editable state of the cell.
   * You may also provide element with id="editingTemplate", which will display when the cell is editing.
   *
   * @memberof Predix
   * @extends Polymer.Element
   * @mixes Predix.DataGridRendererMixin
   */
  class DataGridStringRenderer extends DataGridRendererMixin(PolymerElement) {
    static get template() {
      return html`
    <style include="px-data-grid-string-renderer-styles"></style>
    <template is="dom-if" if="[[!_editing]]">[[value]]</template>
    <template is="dom-if" if="[[_editing]]" restamp="">
      <div class="input-container">
        <input id="editingTemplateInput" class\$="{{getClasses(validationResult)}}" type="text" value="{{value::change}}">
        <px-tooltip for="editingTemplateInput" orientation="top" tooltip-message="[[validationResult.message]]" opened="[[_showValidationError]]" ignore-target-events="">
      </px-tooltip></div>
    </template>
`;
    }

    static get is() {
      return 'px-data-grid-string-renderer';
    }

    validate() {
      return {
        valid: !this.column.required || this.value.length > 0,
        message: this.localize('Value is required')
      };
    }

    getClasses(result) {
      return !result || result.valid ? 'text-input' : 'text-input validation-error';
    }
  }

  customElements.define(DataGridStringRenderer.is, DataGridStringRenderer);

  Predix.DataGridStringRenderer = DataGridStringRenderer;
}
