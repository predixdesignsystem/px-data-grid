document.addEventListener('WebComponentsReady', () => {
  describe('generated columns', () => {
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

    it('should properly populate columns', () => {
      expect(grid.columns.length).to.be.eql(3);
      expect(grid.columns[0].name).to.be.eql('first');
      expect(grid.columns[1].name).to.be.eql('last');
      expect(grid.columns[2].name).to.be.eql('email');
    });

  });
});
