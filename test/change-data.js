document.addEventListener('WebComponentsReady', () => {
  describe('change data', () => {
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

    it('should update all cells in the first column', () => {
      for (let i = 0; i < grid.getData(true).length; i++) {
        grid.tableData[i].first = 'New Name ' + i;
        grid.notifyPath('tableData.' + i + '.first');
        const cell = getRows(grid)[i].firstChild;
        expect(getCellContent(grid, cell)).to.eq('New Name ' + i);
      }
    });

  });
});
