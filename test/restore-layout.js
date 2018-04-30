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
  describe('restore layout', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          done();
        });
      });
    });

    it('should revert columns back', (done) => {
      const myColumns = [
        {
          path: 'first'
        },
        {
          path: 'last'
        }
      ];

      grid.columns = myColumns;
      flushVaadinGrid(grid);
      expect(grid.columns.length).to.eq(myColumns.length);
      expect(grid.columns[0].path).to.eq('first');
      expect(grid.columns[1].path).to.eq('last');

      grid.columns[0].hidden = true;
      grid.columns[0].path = 'last';
      grid.columns[1].path = 'first';
      grid.updateColumns();

      Polymer.RenderStatus.afterNextRender(grid, () => {
        expect(grid.columns.length).to.eq(myColumns.length);
        expect(grid.columns[0].hidden).to.eq(true);
        expect(grid.columns[0].path).to.eq('last');
        expect(grid.columns[1].path).to.eq('first');
        grid.restoreLayout();

        Polymer.RenderStatus.afterNextRender(grid, () => {
          expect(grid.columns.length).to.eq(myColumns.length);
          expect(grid.columns[0].hidden).to.eq(undefined);
          expect(grid.columns[0].path).to.eq('first');
          expect(grid.columns[1].path).to.eq('last');
          done();
        });
      });
    });
  });
});
