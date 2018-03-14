document.addEventListener('WebComponentsReady', () => {
  describe('row details', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-row-details-fixture');
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          window.flush(done);
        });
      });
    });

    it('should open and close row with setRowDetailsVisible(item)', (done) => {
      grid.setRowDetailsVisible(grid.tableData[0], true);

      setTimeout(() => {
        const rowDetails = getRows(grid)[0].querySelector('td:last-child');
        expect(rowDetails.hasAttribute('aria-expanded')).to.be.true;
        expect(rowDetails.hidden).to.be.false;

        grid.setRowDetailsVisible(grid.tableData[0], false);
        setTimeout(() => {
          const rowDetails = getRows(grid)[0].querySelector('td:last-child');
          expect(rowDetails.hidden).to.be.true;
          done();
        }, 100);
      }, 100);
    });

  });
});
