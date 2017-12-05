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
          value: (item) => {
            return item.first;
          }
        },
        {
          name: 'last',
          header: 'Last Name',
          value: (item) => {
            return item.last;
          }
        },
        {
          name: 'email',
          header: 'Email',
          value: (item) => {
            return item.email;
          }
        },
        {
          header: 'Hidden column',
          hidden: true,
          value: (item) => {
            return 'hidden data';
          }
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
