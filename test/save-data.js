/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

document.addEventListener('WebComponentsReady', () => {
  describe('save data', () => {
    let grid;

    beforeEach(done => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;
      grid.editable = true;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => {
          // IE11
          window.flush(done);
        });
      });
    });

    it('should propagate save-item event to component root', done => {
      grid.addEventListener('item-save', () => {
        done();
      });

      const mockEditEvent = {
        target: {dataItem: tableData[0]},
        stopPropagation: sinon.spy
      };
      grid.shadowRoot.querySelector('px-data-grid-edit-column')._handleEdit(mockEditEvent);

      setTimeout(() => {
        grid.shadowRoot.querySelector('.item-edit-save-button').click();
      }, 500);
    });
  });
});
