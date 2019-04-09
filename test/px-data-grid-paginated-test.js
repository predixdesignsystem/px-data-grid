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

  describe('px-data-grid-paginated component tests', () => {

    let
      grid,
      navigation,
      pageSizeSelector;

    const
      defaultPageSize = 10,
      defaultPage = 1,
      largeTableData = generateTableData(200);

    beforeEach((done) => {
      grid = fixture('px-data-grid-paginated-fixture');
      grid.tableData = largeTableData;
      navigation = grid.shadowRoot.querySelector('px-data-grid-navigation');
      pageSizeSelector = navigation.shadowRoot.querySelector('.page-size-select');

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          done();
        });
      });
    });

    it('should display proper rows with local data', (done) => {
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(defaultPageSize);
      // test with array shorter than page size
      grid.tableData = tableData;
      Polymer.flush();
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(5);
      expect(pageSizeSelector).to.be.visible;
      done();
    });

    it('should correctly update rows based on page size', (done) => {
      // page size 2
      grid.pageSize = 2;
      Polymer.flush();
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(2);
      expect(pageSizeSelector).to.be.visible;
      // page size 4
      grid.pageSize = 4;
      Polymer.flush();
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(4);
      expect(pageSizeSelector).to.be.visible;
      // page size 0
      grid.pageSize = 0;
      Polymer.flush();
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(defaultPageSize);
      expect(pageSizeSelector).to.be.visible;
      // page size -10
      grid.pageSize = -10;
      Polymer.flush();
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(defaultPageSize);
      expect(pageSizeSelector).to.be.visible;
      done();
    });

    it('should correctly update rows based on selected page', (done) => {
      let row,
        cell,
        cellText;

      // check first row's first name
      row = getVisibleRows(grid._pxDataGrid)[0];
      cell = getRowCells(row)[0];
      cellText = getCellContent(grid._pxDataGrid, cell);
      expect(cellText).to.be.eql(largeTableData[0].first);

      // check last row's first name
      row = getVisibleRows(grid._pxDataGrid)[grid.pageSize - 1];
      cell = getRowCells(row)[0];
      cellText = getCellContent(grid._pxDataGrid, cell);
      expect(cellText).to.be.eql(largeTableData[grid.pageSize - 1].first);

      // move to page 5
      const page = 5;
      grid.page = page;
      Polymer.flush();

      // check first row's first name
      row = getVisibleRows(grid._pxDataGrid)[0];
      cell = getRowCells(row)[0];
      cellText = getCellContent(grid._pxDataGrid, cell);
      expect(cellText).to.be.eql(largeTableData[(page - 1) * grid.pageSize].first);

      // check last row's first name
      row = getVisibleRows(grid._pxDataGrid)[grid.pageSize - 1];
      cell = getRowCells(row)[0];
      cellText = getCellContent(grid._pxDataGrid, cell);
      expect(cellText).to.be.eql(largeTableData[page * grid.pageSize - 1].first);

      // move to invalid page, should set page to 1
      grid.page = -10;
      Polymer.flush();

      // check first row's first name
      row = getVisibleRows(grid._pxDataGrid)[0];
      cell = getRowCells(row)[0];
      cellText = getCellContent(grid._pxDataGrid, cell);
      expect(cellText).to.be.eql(largeTableData[0].first);

      // check last row's first name
      row = getVisibleRows(grid._pxDataGrid)[grid.pageSize - 1];
      cell = getRowCells(row)[0];
      cellText = getCellContent(grid._pxDataGrid, cell);
      expect(cellText).to.be.eql(largeTableData[grid.pageSize - 1].first);

      done();
    });

    it('should update all cells in the first column', () => {
      for (let i = 0; i < grid.getData(true).length; i++) {
        grid.tableData[i].first = 'New Name ' + i;
        grid.notifyPath('tableData.' + i + '.first');
        const cell = getRows(grid)[i].firstChild;
        expect(getCellContent(grid, cell)).to.eq('New Name ' + i);
      }
    });

    it('should hide page size selector if auto-hide enabled and not enough rows for multiple pages', (done) => {
      grid.tableData = tableData; // 5 rows
      grid.autoHidePageSizeSelect = true;
      const pageSizes = [5, 10, 20];
      grid.selectablePageSizes = pageSizes;
      Polymer.flush();
      expect(pageSizeSelector).to.not.be.visible;
      done();
    });

    it('should display page size selector if auto-hide enabled but multiple pages needed', (done) => {
      grid.tableData = tableData; // 5 rows
      grid.autoHidePageSizeSelect = true;
      const pageSizes = [2, 4, 8];
      grid.selectablePageSizes = pageSizes;
      Polymer.flush();
      expect(pageSizeSelector).to.be.visible;
      done();
    });
  });

});
