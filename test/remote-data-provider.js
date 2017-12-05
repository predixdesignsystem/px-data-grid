document.addEventListener('WebComponentsReady', () => {
  describe('remote data provider', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          done();
        });
      });
    });

    describe('spinner', () => {
      let timeoutSpy;

      function createTimeoutSpy() {
        timeoutSpy = sinon.spy(window, 'setTimeout');

        grid.remoteDataProvider = () => {};

        const call = timeoutSpy.getCalls().filter(call => call.returnValue === grid._spinnerHiddenTimeout)[0];
        return call.args;
      }

      it('should set _spinnerHiddenTimeout when assigning remoteDataProvider', () => {
        grid.remoteDataProvider = (params, callback) => {};
        expect(grid._spinnerHiddenTimeout).to.be.ok;
      });

      it('should hide spinner unless 500ms have passed', () => {
        grid.remoteDataProvider = (params, callback) => {};
        expect(grid.shadowRoot.querySelector('px-spinner').hasAttribute('hidden')).to.be.true;
      });

      it('should have proper timeout', () => {
        grid.loadingSpinnerDebounce = 1000;
        const timeout = createTimeoutSpy()[1];

        expect(timeout).to.equal(1000);
        timeoutSpy.restore();
      });

      it('should show spinner after 500ms when data is loading', () => {
        const timeoutCallback = createTimeoutSpy()[0];

        timeoutCallback();
        expect(grid.shadowRoot.querySelector('px-spinner').hasAttribute('hidden')).to.be.false;
        timeoutSpy.restore();
      });
    });
  });
});
