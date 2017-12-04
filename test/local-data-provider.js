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
