document.addEventListener('WebComponentsReady', () => {
  describe('selection', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          window.flush(done);
        });
      });
    });

    describe('multi selection', () => {
      it('should add the item to selectedItems when row is clicked', (done) => {
        grid.selectionMode = 'multi';
        Polymer.RenderStatus.afterNextRender(grid, () => {
          expect(grid.selectedItems).to.eql([]);
          const rows = getRows(grid);
          let cell = getRowCells(rows[1])[0];
          cell.click();
          Polymer.RenderStatus.afterNextRender(grid, () => {
            expect(grid.selectedItems).to.eql([tableData[1]]);
            cell = getRowCells(rows[2])[0];
            cell.click();
            Polymer.RenderStatus.afterNextRender(grid, () => {
              expect(grid.selectedItems).to.eql([tableData[1], tableData[2]]);
              done();
            });
          });
        });
      });
    });

    describe('single selection', () => {
      it('should only have one item in selectedItems when rows have been clicked', (done) => {
        expect(grid.selectedItems).to.eql([]);
        grid.selectionMode = 'single';
        Polymer.RenderStatus.afterNextRender(grid, () => {
          const rows = getRows(grid);
          let cell = getRowCells(rows[1])[1];
          cell.click();
          Polymer.RenderStatus.afterNextRender(grid, () => {
            expect(grid.selectedItems).to.eql([tableData[1]]);
            cell = getRowCells(rows[2])[1];
            cell.click();
            Polymer.RenderStatus.afterNextRender(grid, () => {
              expect(grid.selectedItems).to.eql([tableData[2]]);
              done();
            });
          });
        });
      });
    });

    describe('api selection and id property', () => {
      it('should have selection after API call', () => {
        grid.selectionMode = 'multi';
        flushVaadinGrid(grid);
        expect(grid.selectedItems).to.eql([]);
        grid.selectedItems = [tableData[0]];
        flushVaadinGrid(grid);
        expect(grid.selectedItems.length).to.eql(1);
        expect(grid.selectedItems[0]).to.eql(tableData[0]);
        grid.selectedItems = [tableData[0], tableData[2]];
        flushVaadinGrid(grid);
        expect(grid.selectedItems.length).to.eql(2);
        expect(grid.selectedItems[0]).to.eql(tableData[0]);
        expect(grid.selectedItems[1]).to.eql(tableData[2]);
      });

      it('should obey id path with selection', (done) => {
        grid.selectionMode = 'multi';
        grid.itemIdPath = 'email';
        flushVaadinGrid(grid);
        expect(grid.selectedItems).to.eql([]);

        // Just include id field into selection
        const selected = [{email: tableData[4].email}];
        grid.selectedItems = selected;
        Polymer.RenderStatus.afterNextRender(grid, () => {
          expect(grid.selectedItems.length).to.eql(1);
          const rows = getRows(grid);

          // Only last row should be selected (with correct id)
          for (let i = 0; i < tableData.length; ++i) {
            const cell = getRowCells(rows[i])[0];
            const checkbox = cell.querySelector('slot').assignedNodes()[0].querySelector('vaadin-checkbox');
            expect(checkbox.checked).to.eql(i == 4);
          }

          done();
        });
      });
    });
  });
});
