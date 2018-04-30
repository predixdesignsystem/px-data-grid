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
  describe('sorting', () => {
    let grid;
    let firstNameHeaderCell;
    let lastNameHeaderCell;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          firstNameHeaderCell = getHeaderCell(grid, 0);
          lastNameHeaderCell = getHeaderCell(grid, 1);

          done();
        });
      });
    });

    it('should sort by first name ASC', () => {
      const sorter = getHeaderCellContent(firstNameHeaderCell).querySelector('px-data-grid-sorter');
      sorter.click();
      expect(getBodyCellContent(grid, 0, 0)).to.equal('Alma');
      expect(getBodyCellContent(grid, 1, 0)).to.equal('Elizabeth');
      expect(getBodyCellContent(grid, 2, 0)).to.equal('Elizabeth');
      expect(getBodyCellContent(grid, 3, 0)).to.equal('Jeffrey');
      expect(getBodyCellContent(grid, 4, 0)).to.equal('Willie');
    });

    it('should sort by first name DESC', () => {
      const sorter = getHeaderCellContent(firstNameHeaderCell).querySelector('px-data-grid-sorter');
      sorter.click();
      sorter.click();
      expect(getBodyCellContent(grid, 0, 0)).to.equal('Willie');
      expect(getBodyCellContent(grid, 1, 0)).to.equal('Jeffrey');
      expect(getBodyCellContent(grid, 2, 0)).to.equal('Elizabeth');
      expect(getBodyCellContent(grid, 3, 0)).to.equal('Elizabeth');
      expect(getBodyCellContent(grid, 4, 0)).to.equal('Alma');
    });

    it('should reset sorting by first name', () => {
      const sorter = getHeaderCellContent(firstNameHeaderCell).querySelector('px-data-grid-sorter');
      sorter.click();
      sorter.click();
      sorter.click();
      expect(getBodyCellContent(grid, 0, 0)).to.equal('Elizabeth');
      expect(getBodyCellContent(grid, 1, 0)).to.equal('Jeffrey');
      expect(getBodyCellContent(grid, 2, 0)).to.equal('Alma');
      expect(getBodyCellContent(grid, 3, 0)).to.equal('Elizabeth');
      expect(getBodyCellContent(grid, 4, 0)).to.equal('Willie');
    });
  });
});
