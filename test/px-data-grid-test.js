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

    describe('simple-grid tests', () => {
      beforeEach(() => {
        grid = fixture('simple-grid');
        grid.tableData = data;
      });

      it('should properly populate _generatedColumns', function() {
        expect(grid._generatedColumns.length).to.be.eql(3);
        expect(grid._generatedColumns[0].name).to.be.eql('first');
        expect(grid._generatedColumns[1].name).to.be.eql('last');
        expect(grid._generatedColumns[2].name).to.be.eql('email');
      });
    });
  });
}
