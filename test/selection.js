document.addEventListener('WebComponentsReady', () => {
  describe('selection', () => {
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

    it('should add the item to selectedItems when row is clicked', (done) => {
      grid.selectable = true;
      Polymer.RenderStatus.afterNextRender(grid, () => {
        const rows = getRows(grid);
        const cell = getRowCells(rows[1])[0];
        cell.click();
        expect(grid.selectedItems).to.eql([tableData[1]]);
        done();
      });
    });
  });
});
