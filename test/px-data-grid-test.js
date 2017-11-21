const data = [{
  'first': 'Elizabeth',
  'last': 'Wong',
  'email': 'sika@iknulber.cl'
}, {
  'first': 'Jeffrey',
  'last': 'Hamilton',
  'email': 'cofok@rac.be'
}, {
  'first': 'Alma',
  'last': 'Martin',
  'email': 'dotta@behtam.la'
}, {
  'first': 'Carl',
  'last': 'Saunders',
  'email': 'seh@bibapu.gy'
}, {
  'first': 'Willie',
  'last': 'Dennis',
  'email': 'izko@dahokwej.ci'
}];


document.addEventListener('WebComponentsReady', function() {
  runTests();
});


function runTests() {

  describe('Unit Tests for px-data-grid', () => {
    let grid;
    let timeoutSpy;

    describe('simple-grid tests', () => {
      function createTimeoutSpy() {
        timeoutSpy = sinon.spy(window, 'setTimeout');

        grid.remoteDataProvider = () => {};

        const call = timeoutSpy.getCalls().filter(call => call.returnValue === grid._spinnerHiddenTimeout)[0];
        return call.args;
      }

      beforeEach(() => {
        grid = fixture('simple-grid');
        grid.tableData = data;
      });

      it('should properly populate _generatedColumns', () => {
        expect(grid._generatedColumns.length).to.be.eql(3);
        expect(grid._generatedColumns[0].name).to.be.eql('first');
        expect(grid._generatedColumns[1].name).to.be.eql('last');
        expect(grid._generatedColumns[2].name).to.be.eql('email');
      });

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

    describe('grid-with-columns tests', () => {
      beforeEach((done) => {
        grid = fixture('grid-with-columns');
        grid.tableData = data;
        Polymer.RenderStatus.afterNextRender(grid, () => {
          setTimeout(() => { // IE11
            done();
          });
        });
      });

      it('should set _generatedColumns to empty array', () => {
        expect(grid._generatedColumns.length).to.be.eql(0);
      });
    });
  });
}
