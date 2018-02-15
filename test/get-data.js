document.addEventListener('WebComponentsReady', () => {
  describe('get data', () => {
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

    it('should return all data', () => {
      expect(grid.getData().length).to.eq(5);
    });

    it('should return only visible data', () => {
      grid.tableData = generateTableData(200);
      expect(grid.getData(true).length).to.eq(5);
    });

    it('should remove email from result', () => {
      grid._getColumns().filter((col) => col.path === 'email')[0].hidden = true;
      expect(grid.getData()[0].email).to.be.undefined;
    });

    it('should return filtered results', (done) => {
      grid.autoFilter = true;
      flushVaadinGrid(grid);
      const autoFilter = grid.shadowRoot.querySelector('px-auto-filter-field');
      autoFilter.addEventListener('filter-change', (event) => {
        expect(grid.getData().length).to.be.eql(2);
        done();
      });
      autoFilter.value = 'Elizabeth';
    });

    it('should return sorted data', () => {
      expect(grid.getData()[0].first).to.eq('Elizabeth');
      grid.shadowRoot.querySelector('px-data-grid-sorter').direction = 'desc';
      flushVaadinGrid(grid);
      expect(grid.getData()[0].first).to.eq('Willie');
    });

    it('should return reordered data', () => {
      grid._moveColumnToLeft(grid._getColumns()[2]);
      flushVaadinGrid(grid);
      expect(Object.keys(grid.getData()[0])[0]).to.eq('email');
    });

  });
});
