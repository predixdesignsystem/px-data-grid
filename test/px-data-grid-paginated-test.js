document.addEventListener('WebComponentsReady', function() {
  runTests();
});

function runTests() {

  describe('px-data-grid-paginated component tests', () => {

    let
      grid,
      navigation;

    const
      defaultPageSize = 10,
      defaultPage = 1,
      largeTableData = generateTableData(200);

    beforeEach((done) => {
      grid = fixture('px-data-grid-paginated-fixture');
      grid.tableData = largeTableData;
      navigation = grid.shadowRoot.querySelector('px-data-grid-navigation');

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
      done();
    });

    it('should correctly update rows based on page size', (done) => {
      // page size 2
      grid.pageSize = 2;
      Polymer.flush();
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(2);
      // page size 4
      grid.pageSize = 4;
      Polymer.flush();
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(4);
      // page size 0
      grid.pageSize = 0;
      Polymer.flush();
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(defaultPageSize);
      // page size -10
      grid.pageSize = -10;
      Polymer.flush();
      expect(getVisibleRows(grid._pxDataGrid).length).to.be.eql(defaultPageSize);
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

  });

}
