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
