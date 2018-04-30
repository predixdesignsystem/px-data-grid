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
      expect(getHeaderCell(grid, 0)).to.equal(firstNameHeaderCell);
      expect(getHeaderCell(grid, 1)).to.equal(lastNameHeaderCell);

      let visibleColumns = grid.getVisibleColumns();
      expect(visibleColumns.length).to.be.equal(4);
      expect(visibleColumns[0].name).to.be.equal('first');
      expect(visibleColumns[1].name).to.be.equal('last');
      expect(visibleColumns[2].name).to.be.equal('email');
      expect(visibleColumns[3].name).to.be.equal('timestamp');

      getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
      flushVaadinGrid(grid);

      visibleColumns = grid.getVisibleColumns();
      expect(visibleColumns.length).to.be.equal(4);
      expect(visibleColumns[0].name).to.be.equal('last');
      expect(visibleColumns[1].name).to.be.equal('first');
      expect(visibleColumns[2].name).to.be.equal('email');
      expect(visibleColumns[3].name).to.be.equal('timestamp');
    });

    it('should move the second frozen column to the left side of the grid, before the first frozen', () => {
      expect(getHeaderCell(grid, 0)).to.equal(firstNameHeaderCell);
      expect(getHeaderCell(grid, 1)).to.equal(lastNameHeaderCell);

      let visibleColumns = grid.getVisibleColumns();
      expect(visibleColumns.length).to.be.equal(4);
      expect(visibleColumns[0].name).to.be.equal('first');
      expect(visibleColumns[1].name).to.be.equal('last');
      expect(visibleColumns[2].name).to.be.equal('email');
      expect(visibleColumns[3].name).to.be.equal('timestamp');

      getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
      flushVaadinGrid(grid);
      getHeaderCellContent(firstNameHeaderCell)._freezeColumn();
      flushVaadinGrid(grid);

      visibleColumns = grid.getVisibleColumns();
      expect(visibleColumns.length).to.be.equal(4);
      expect(visibleColumns[0].name).to.be.equal('first');
      expect(visibleColumns[1].name).to.be.equal('last');
      expect(visibleColumns[2].name).to.be.equal('email');
      expect(visibleColumns[3].name).to.be.equal('timestamp');
    });

    it('should not move the frozen column before selection column', () => {
      // Make selectable and check that columns are after selection column
      grid.selectionMode = 'multi';
      grid.hideSelectionColumn = false;
      flushVaadinGrid(grid);
      expect(getHeaderCell(grid, 0)).to.not.equal(firstNameHeaderCell);
      const selectionColumn = getHeaderCell(grid, 0);

      // Free second data column, and check it's first after selection column
      getHeaderCellContent(lastNameHeaderCell)._freezeColumn();
      flushVaadinGrid(grid);
      expect(getHeaderCell(grid, 0)).to.be.equal(selectionColumn);

      // Make unselectable, and check position of data columns
      grid.selectionMode = 'none';
      flushVaadinGrid(grid);
      expect(getHeaderCell(grid, 0)).to.not.equal(selectionColumn);
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

    it('should properly generate hierarchical data after grouping by column', (done) => {
      getHeaderCellContent(firstNameHeaderCell)._groupByColumn();
      Polymer.RenderStatus.afterNextRender(grid, () => {
        expect(grid._vaadinGrid.hasAttribute('tree-grid')).to.be.true;
        expect(getVisibleRows(grid).length).to.equal(4);
        expect(grid._vaadinGrid._cache.items[0].hasChildren).to.be.true;
        done();
      });
    });

    it('should properly expand group', (done) => {
      getHeaderCellContent(firstNameHeaderCell)._groupByColumn();
      Polymer.RenderStatus.afterNextRender(grid, () => {
        const firstCell = getRows(grid)[0].firstChild;
        expect(getCellContent(grid, firstCell)).to.equal('Elizabeth');
        const treeToggle = getCell(grid, firstCell).querySelector('vaadin-grid-tree-toggle');
        treeToggle.expanded = true;
        Polymer.RenderStatus.afterNextRender(grid, () => {
          expect(grid._vaadinGrid.expandedItems[0].first).to.equal('Elizabeth');
          expect(getVisibleRows(grid).length).to.equal(6);
          done();
        });
      });
    });
  });

  describe('column dropdown menu: group by column', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          done();
        });
      });
    });

    it('shows the "Group by column" menu option when table data is added later', (done) => {
      grid.columns = [
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

      Polymer.RenderStatus.afterNextRender(grid, () => {
        grid.tableData = tableData;

        Polymer.RenderStatus.afterNextRender(grid, () => {
          const firstNameHeaderCell = getHeaderCell(grid, 0);
          const columnDropdownMenu = getHeaderCellContent(firstNameHeaderCell).shadowRoot.querySelector('px-dropdown');
          expect(columnDropdownMenu.items.length).to.equal(3);
          expect(columnDropdownMenu.items[2].val).to.equal('Group by Column');
          done();
        });
      });
    });
  });
});
