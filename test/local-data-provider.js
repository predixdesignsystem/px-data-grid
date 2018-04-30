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
  describe('local data provider', () => {
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

    it('should call _localDataProvider when tableData is assigned', (done) => {
      const spy = sinon.spy(grid, '_localDataProvider');
      grid.tableData = [];
      setTimeout(() => {
        expect(spy.called).to.be.true;
        done();
      });
    });

    it('cell values in DOM should match that of the local data source', () => {
      getRows(grid).forEach((row, rowIndex) => {
        getRowCells(row).forEach((cell, cellIndex) => {
          // compare value we find in DOM and value in our data object
          const dataRow = tableData[rowIndex];
          const expectedVal = dataRow[Object.keys(dataRow)[cellIndex]];
          const domVal = getCellContent(grid, cell);
          expect(domVal).to.be.eql(expectedVal);
        });
      });
    });
  });
});
