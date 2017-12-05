document.addEventListener('WebComponentsReady', () => {
  describe('column dropdown menu', () => {
    let grid;
    let firstNameHeaderCell;
    let lastNameHeaderCell;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          firstNameHeaderCell = getHeaderCell(grid, 0);
          lastNameHeaderCell = getHeaderCell(grid, 1);

          done();
        });
      });
    });

    describe('manually passed columns', () => {
      const columns = [
        {
          name: 'first',
          header: 'First Name',
          path: 'first'
        },
        {
          name: 'last',
          header: 'Last Name',
          path: 'last'
        },
        {
          name: 'email',
          header: 'Email',
          path: 'email'
        },
        {
          header: 'Hidden column',
          hidden: true,
          path: ''
        }
      ];

      it('should change generated column to manually passed', () => {
        grid.columns = columns;
        flushVaadinGrid(grid);
        expect(grid._vaadinGrid.querySelectorAll('px-data-grid-column').length).to.be.eq(4);
      });
    });
  });
});
