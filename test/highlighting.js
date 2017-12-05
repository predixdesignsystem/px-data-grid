document.addEventListener('WebComponentsReady', () => {
  describe('highlight', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;

      flushVaadinGrid(grid);

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          window.flush(done);
        });
      });
    });

    it('should highlight cell', () => {
      grid.highlight = [{
        type: 'cell',
        color: 'red',
        condition: (cellData, column, item) => {
          return cellData === 'Alma';
        }
      }];

      expect(grid._getCellStyle(tableData[2], grid.columns[0])).to.eql('background: red');
    });

    it('should highlight row', () => {
      grid.highlight = [{
        type: 'row',
        color: 'yellow',
        condition: (cellData, item) => {
          return cellData === 'Saunders';
        }
      }];

      expect(grid._getCellStyle(tableData[3], grid.columns[0])).to.eq('background: yellow');
      expect(grid._getCellStyle(tableData[3], grid.columns[1])).to.eq('background: yellow');
      expect(grid._getCellStyle(tableData[3], grid.columns[2])).to.eq('background: yellow');
    });

    it('should highlight column', () => {
      grid.highlight = [{
        type: 'column',
        color: 'blue',
        condition: (column, item) => {
          return column.name === 'first';
        }
      }];

      tableData.forEach((d) => {
        expect(grid._getCellStyle(d, grid.columns[0])).to.eq('background: blue');
      });
    });
  });
});
