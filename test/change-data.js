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
  describe('change data', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;
      grid.selectedItems = [tableData[1], tableData[2]];

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          done();
        });
      });
    });

    it.only('should update all cells in the first column', () => {
      expect(grid.selectedItems.length).to.eq(2);
      for (let i = 0; i < grid.getData(true).length; i++) {
        grid.tableData[i].first = 'New Name ' + i;
        grid.notifyPath('tableData.' + i + '.first');
        const cell = getRows(grid)[i].firstChild;
        expect(getCellContent(grid, cell)).to.eq('New Name ' + i);
      }
      expect(grid.selectedItems.length).to.eq(0);
    });
  });
});
