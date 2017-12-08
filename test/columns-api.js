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
      const columnsA = [
        {
          name: 'first',
          header: 'First Name',
          path: 'first'
        },
        {
          header: 'Hidden column',
          hidden: true,
          path: ''
        }
      ];

      const columnsB = [
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

      it('should change generated no columns to manually passed', () => {

        // Check that no columns as no data, then set first columns
        let currentColumns = grid._vaadinGrid.querySelectorAll('px-data-grid-column');
        expect(currentColumns.length).to.be.eq(0);
        grid.columns = columnsA;
        flushVaadinGrid(grid);

        // Verify columns set correctly and set new columns
        currentColumns = grid._vaadinGrid.querySelectorAll('px-data-grid-column');
        expect(currentColumns.length).to.be.eq(2);
        expect(currentColumns[0].name).to.be.eq('first');
        grid.columns = columnsB;
        flushVaadinGrid(grid);

        // Verify columns set correct and then modify columns and update
        currentColumns = grid._vaadinGrid.querySelectorAll('px-data-grid-column');
        expect(currentColumns.length).to.be.eq(3);
        expect(currentColumns[0].name).to.be.eq('last');
      });
    });

    it('should be handle column data update with updateColumns', () => {
      const columnsA = [
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

      // Should not have columns at the start
      let currentColumns = grid._vaadinGrid.querySelectorAll('px-data-grid-column');
      expect(currentColumns.length).to.be.eq(0);
      grid.columns = columnsA;
      flushVaadinGrid(grid);

      // Modfy data and call updateColumns
      currentColumns = grid._vaadinGrid.querySelectorAll('px-data-grid-column');
      expect(currentColumns.length).to.be.eq(columnsA.length);
      expect(currentColumns[0].name).to.be.eq(columnsA[0].name);
      expect(currentColumns[1].name).to.be.eq(columnsA[1].name);
      const modifiedColumns = grid.columns.slice();
      modifiedColumns[0].hidden = true;
      modifiedColumns[0].name = 'Modified';
      grid.columns = modifiedColumns;
      grid.updateColumns();
      flushVaadinGrid(grid);

      // Finally verify column modifications
      currentColumns = grid._vaadinGrid.querySelectorAll('px-data-grid-column');
      expect(currentColumns.length).to.be.eq(3);
      expect(currentColumns[0].name).to.be.eq('Modified');
      expect(currentColumns[0].hidden).to.be.eq(true);
    });
  });
});
