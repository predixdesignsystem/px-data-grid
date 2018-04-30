/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
          path: 'last',
          type: 'custom'
        },
        {
          header: 'Hidden column',
          hidden: true,
          path: ''
        }
      ];

      it('should set column.id properly', () => {
        grid.columns = columns;
        flushVaadinGrid(grid);
        expect(grid.columns[0].id).to.be.eq('first[string]');
        expect(grid.columns[1].id).to.be.eq('last[custom]');
        expect(grid.columns[2].id).to.be.eq('[string]');
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
