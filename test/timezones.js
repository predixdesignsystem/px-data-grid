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
  describe('timezones', () => {
    let grid;
    let firstNameHeaderCell;
    let lastNameHeaderCell;
    let timestampHeaderCell;


    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.columns = getColumnConfig();
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          firstNameHeaderCell = getHeaderCell(grid, 0);
          lastNameHeaderCell = getHeaderCell(grid, 1);
          timestampHeaderCell = getHeaderCell(grid, 3);
          window.flush(done);
        });
      });
    });

    it('should convert to defined timezone', () => {
      // format: YYYY-MM-DD HH:mm:ss -> MM/DD/YYYY HH:mm:ss
      // timezone: UTC -> PST
      expect(getBodyCellTextAsString(grid, 0, 3)).to.equal('05/19/2005 17:00:00'); // -7 (daylights savings)
      expect(getBodyCellTextAsString(grid, 4, 3)).to.equal('12/20/2010 02:30:00'); // -8
    });

    it('should sort by timestamp ASC', () => {
      const sorter = getHeaderCellContent(timestampHeaderCell).querySelector('px-data-grid-sorter');
      sorter.click();
      expect(getBodyCellContent(grid, 0, 0)).to.equal('Elizabeth');
      expect(getBodyCellContent(grid, 1, 0)).to.equal('Alma');
      expect(getBodyCellContent(grid, 2, 0)).to.equal('Jeffrey');
      expect(getBodyCellContent(grid, 3, 0)).to.equal('Elizabeth');
      expect(getBodyCellContent(grid, 4, 0)).to.equal('Willie');
    });

    it('should sort by timestamp DESC', () => {
      const sorter = getHeaderCellContent(timestampHeaderCell).querySelector('px-data-grid-sorter');
      sorter.click();
      sorter.click();
      expect(getBodyCellContent(grid, 0, 0)).to.equal('Willie');
      expect(getBodyCellContent(grid, 1, 0)).to.equal('Elizabeth');
      expect(getBodyCellContent(grid, 2, 0)).to.equal('Jeffrey');
      expect(getBodyCellContent(grid, 3, 0)).to.equal('Alma');
      expect(getBodyCellContent(grid, 4, 0)).to.equal('Elizabeth');
    });
  });
});
