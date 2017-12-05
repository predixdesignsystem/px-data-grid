document.addEventListener('WebComponentsReady', () => {
  describe('column dropdown menu', () => {
    let grid;
    let firstNameHeaderCell;
    let lastNameHeaderCell;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          firstNameHeaderCell = getHeaderCell(grid, 0);
          lastNameHeaderCell = getHeaderCell(grid, 1);

          done();
        });
      });
    });

    it('should move the first frozen column to the left side of the grid', () => {
      getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
      expect(getHeaderCell(grid, 0)).to.equal(lastNameHeaderCell);
      expect(getHeaderCell(grid, 1)).to.equal(firstNameHeaderCell);
    });

    it('should move the second frozen column to the left side of the grid, before the first frozen', () => {
      getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
      getHeaderCellContent(firstNameHeaderCell)._freezeColumn();
      expect(getHeaderCell(grid, 0)).to.equal(firstNameHeaderCell);
      expect(getHeaderCell(grid, 1)).to.equal(lastNameHeaderCell);
    });

    // TODO: @limonte investigate why 2 tests below don't work
    // it('should move the first unfrozen column right after last frozen', () => {
    //   getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
    //   getHeaderCellContent(firstNameHeaderCell)._freezeColumn();
    //   getHeaderCellContent(firstNameHeaderCell)._unfreezeColumn();
    //   expect(getHeaderCell(grid, 0)).to.equal(lastNameHeaderCell);
    //   expect(getHeaderCell(grid, 1)).to.equal(firstNameHeaderCell);
    // });

    // it('should not change columns order after unfrozing the only one frozen column', () => {
    //   getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
    //   getHeaderCellContent(firstNameHeaderCell)._freezeColumn();
    //   getHeaderCellContent(firstNameHeaderCell)._unfreezeColumn();
    //   getHeaderCellContent(lastNameHeaderCell)._unfreezeColumn();
    //   expect(getHeaderCell(grid, 0)).to.equal(lastNameHeaderCell);
    //   expect(getHeaderCell(grid, 1)).to.equal(firstNameHeaderCell);
    // });

    it('should hide the column', () => {
      getHeaderCellContent(firstNameHeaderCell)._hideColumn();
      expect(firstNameHeaderCell.hasAttribute('hidden')).to.be.true;
    });
  });
});
