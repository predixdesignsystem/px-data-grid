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
  describe('row actions', () => {
    let grid;

    beforeEach(done => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;
      grid.itemActions = itemActions;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => {
          // IE11
          window.flush(done);
        });
      });
    });

    it('should propagate item-action event to component root', done => {
      grid.addEventListener('item-action', actionEvent => {
        expect(actionEvent.detail.item).to.be.eql(tableData[0]);
        done();
      });

      const mockClick = {
        target: {
          dataItem: tableData[0]
        },
        detail: {
          detail: {
            item: {
              key: '-action-' + itemActions[0].id
            }
          }
        }
      };
      grid.shadowRoot.querySelector('px-data-grid-action-column')._dropdownItemClick(mockClick);
    });
  });
});
