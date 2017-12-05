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

    describe('multi selection', () => {
      it('should add the item to selectedItems when row is clicked', (done) => {
        grid.selectable = true;
        grid.multiSelect = true;
        Polymer.RenderStatus.afterNextRender(grid, () => {
          expect(grid.selectedItems).to.eql([]);
          const rows = getRows(grid);
          let cell = getRowCells(rows[1])[0];
          cell.click();
          Polymer.RenderStatus.afterNextRender(grid, () => {
            expect(grid.selectedItems).to.eql([tableData[1]]);
            cell = getRowCells(rows[2])[0];
            cell.click();
            Polymer.RenderStatus.afterNextRender(grid, () => {
              expect(grid.selectedItems).to.eql([tableData[1], tableData[2]]);
              done();
            });
          });
        });
      });
    });

    describe('single selection', () => {
      it('should only have one item in selectedItems when rows have been clicked', (done) => {
        expect(grid.selectedItems).to.eql([]);
        grid.selectable = true;
        grid.multiSelect = false;
        Polymer.RenderStatus.afterNextRender(grid, () => {
          const rows = getRows(grid);
          let cell = getRowCells(rows[1])[1];
          cell.click();
          Polymer.RenderStatus.afterNextRender(grid, () => {
            expect(grid.selectedItems).to.eql([tableData[1]]);
            cell = getRowCells(rows[2])[1];
            cell.click();
            Polymer.RenderStatus.afterNextRender(grid, () => {
              expect(grid.selectedItems).to.eql([tableData[2]]);
              done();
            });
          });
        });
      });
    });
  });
});
