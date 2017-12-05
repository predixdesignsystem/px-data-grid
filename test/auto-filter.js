document.addEventListener('WebComponentsReady', () => {
  describe('auto filtering', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;
      grid.autoFilter = true;

      flushVaadinGrid(grid);

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          window.flush(done);
        });
      });
    });

    it('should show only 1 row after filtering', (done) => {
      const autoFilter = grid.shadowRoot.querySelector('px-auto-filter-field');
      autoFilter.addEventListener('filter-change', (event) => {
        expect(getVisibleRows(grid).length).to.be.eql(1);
        done();
      });
      autoFilter.value = 'Elizabeth';
    });

    it('should show 2 rows after filtering', (done) => {
      const autoFilter = grid.shadowRoot.querySelector('px-auto-filter-field');
      autoFilter.addEventListener('filter-change', (event) => {
        expect(getVisibleRows(grid).length).to.be.eql(2);
        done();
      });
      autoFilter.value = 'am';
    });

    it('should show all rows when filter value is empty', (done) => {
      const autoFilter = grid.shadowRoot.querySelector('px-auto-filter-field');
      // set filter with value to reduce # of visible rows
      autoFilter.value = 'am';
      // give 500ms to let rows update
      setTimeout(() => {
        // add listener and clear filter value to let all rows become visible
        autoFilter.addEventListener('filter-change', (event) => {
          expect(getVisibleRows(grid).length).to.be.eql(tableData.length);
          done();
        });
        autoFilter.value = '';
      }, autoFilter.timeout + 100);
    });
  });
});
