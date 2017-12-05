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

      expect(grid._resolveCellColor(tableData[2], grid.columns[0])).to.eql('red');
      expect(grid._resolveCellColor(tableData[1], grid.columns[0])).to.eql(undefined);
    });

    it('should highlight row', () => {
      grid.highlight = [{
        type: 'row',
        color: 'yellow',
        condition: (cellData, item) => {
          return cellData === 'Saunders';
        }
      }];

      expect(grid._resolveCellColor(tableData[3], grid.columns[0])).to.eq('yellow');
      expect(grid._resolveCellColor(tableData[3], grid.columns[1])).to.eq('yellow');
      expect(grid._resolveCellColor(tableData[3], grid.columns[2])).to.eq('yellow');
      expect(grid._resolveCellColor(tableData[2], grid.columns[0])).to.eq(undefined);
      expect(grid._resolveCellColor(tableData[2], grid.columns[1])).to.eq(undefined);
      expect(grid._resolveCellColor(tableData[2], grid.columns[2])).to.eq(undefined);
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
        expect(grid._resolveCellColor(d, grid.columns[0])).to.eq('blue');
        expect(grid._resolveCellColor(d, grid.columns[1])).to.eql(undefined);
      });
    });

    it('should highlight cell with default', () => {
      grid.highlight = [{
        type: 'cell',
        condition: (cellData, column, item) => {
          return cellData === 'Alma';
        }
      }];

      expect(grid._resolveCellColor(tableData[2], grid.columns[0])).to.eql('default');
      expect(grid._resolveCellColor(tableData[2], grid.columns[1])).to.eql(undefined);
    });
  });
});
