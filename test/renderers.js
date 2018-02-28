document.addEventListener('WebComponentsReady', () => {
  describe('number renderer', () => {
    let grid;
    let _consoleErrorOriginal = null;
    let consoleErrors = [];

    beforeEach(done => {
      grid = fixture('px-data-grid-fixture');

      // Spy on console errors, taking over console.error so our tests don't fail.
      // `sinon.spy` won't hijack the errors which causes our tests to fail,
      // so this is a hand-rolled spy implementation.
      _consoleErrorOriginal = console.error;
      console.error = err => {
        consoleErrors.push(err);
      };

      grid.columns = [
        {
          name: 'Name',
          path: 'name'
        },
        {
          name: 'Height',
          path: 'height',
          renderer: 'px-data-grid-number-renderer',
          editable: true
        },
        {
          name: 'Weight',
          path: 'weight',
          renderer: 'px-data-grid-number-renderer',
          editable: true,
          rendererConfig: {
            displayFormat: '0,0'
          }
        },
        {
          name: 'Model',
          path: 'model',
          renderer: 'px-data-grid-number-renderer',
          editable: true
        }
      ];

      grid.tableData = [
        {
          name: 'GENERATOR 001',
          height: 60.224,
          weight: 190378.487,
          model: '1934'
        },
        {
          name: 'GENERATOR 002',
          height: -63.13,
          weight: 238712.03,
          model: '1934.29'
        },
        {
          name: 'GENERATOR 003',
          height: 59.49,
          weight: 0,
          model: '099A'
        },
        {
          name: 'GENERATOR 004',
          height: 68,
          weight: 478209.22,
          model: ''
         }
      ];


      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          window.flush(done);
        });
      });
    });

    afterEach(() => {
      // Reset console.error spy
      console.error = _consoleErrorOriginal;
      _consoleErrorOriginal = null;
      consoleErrors = [];
    });

    it('displays numbers out without changing anything when rendererConfig.displayFormat is not defined', () => {
      expect(getBodyCellText(grid, 0, 1) + '').to.equal('60.224');
      expect(getBodyCellText(grid, 1, 1) + '').to.equal('-63.13');
      expect(getBodyCellText(grid, 2, 1) + '').to.equal('59.49');
      expect(getBodyCellText(grid, 3, 1) + '').to.equal('68');
    });

    it('formats numbers when rendererConfig.displayFormat is defined', () => {
      expect(getBodyCellText(grid, 0, 2) + '').to.equal('190,378');
      expect(getBodyCellText(grid, 1, 2) + '').to.equal('238,712');
      expect(getBodyCellText(grid, 2, 2) + '').to.equal('0');
      expect(getBodyCellText(grid, 3, 2) + '').to.equal('478,209');
    });

    it('displays strings that can be parsed to numbers', () => {
      expect(getBodyCellText(grid, 0, 3) + '').to.equal('1934');
      expect(getBodyCellText(grid, 1, 3) + '').to.equal('1934.29');
    });

    it('displays strings that cannot be parsed to numbers', () => {
      expect(getBodyCellText(grid, 2, 3) + '').to.equal('099A');
    });

    it('does not coerce empty strings to `0`', () => {
      expect(getBodyCellText(grid, 3, 3) + '').to.equal('');
    });

    it('throws an error but still displays values that cannot be parsed to a number', () => {
      expect(consoleErrors.length).to.equal(1);
      expect(consoleErrors[0]).to.match(/Expected a value that could be parsed to a number/);
    });
  });
});
