document.addEventListener('WebComponentsReady', () => {
  describe('filterable', () => {
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

    it('should check string properly', () => {
      expect(grid._isStringMatches({pattern: 'equals', query: 'Elizabeth'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'equals', query: 'Elizabet'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'contains', query: 'th'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'contains', query: 'ea'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'starts_with', query: 'Eli'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'starts_with', query: 'Bli'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'ends_with', query: 'eth'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'ends_with', query: 'ath'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'wildcard', query: 'E*th'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: 'P*th'}, 'Elizabeth')).to.be.false;
    });

    it('should check date properly', () => {
      expect(grid._isDateMatches({dateFrom: '1994-12-03'}, '1994-12-04')).to.be.true;
      expect(grid._isDateMatches({dateFrom: '1994-12-03'}, '1994-12-02')).to.be.false;

      expect(grid._isDateMatches({dateTo: '1994-12-03'}, '1994-12-04')).to.be.false;
      expect(grid._isDateMatches({dateTo: '1994-12-03'}, '1994-12-02')).to.be.true;

      expect(grid._isDateMatches({dateFrom: '1994-12-01', dateTo: '1994-12-03'}, '1994-12-02')).to.be.true;
      expect(grid._isDateMatches({dateFrom: '1994-12-01', dateTo: '1994-12-03'}, '1994-12-04')).to.be.false;
    });

    it('should check number properly', () => {
      expect(grid._isNumberMatches({condition: 'less_than', value: 13}, 12)).to.be.true;
      expect(grid._isNumberMatches({condition: 'less_than', value: 11}, 12)).to.be.false;

      expect(grid._isNumberMatches({condition: 'greater_than', value: 11}, 12)).to.be.true;
      expect(grid._isNumberMatches({condition: 'greater_than', value: 13}, 12)).to.be.false;

      expect(grid._isNumberMatches({condition: 'equals', value: 12}, 12)).to.be.true;
      expect(grid._isNumberMatches({condition: 'equals', value: 11}, 12)).to.be.false;

      expect(grid._isNumberMatches({condition: 'not_equal', value: 13}, 12)).to.be.true;
      expect(grid._isNumberMatches({condition: 'not_equal', value: 12}, 12)).to.be.false;

      expect(grid._isNumberMatches({condition: 'equal_or_greater_than', value: 12}, 12)).to.be.true;
      expect(grid._isNumberMatches({condition: 'equal_or_greater_than', value: 13}, 12)).to.be.false;

      expect(grid._isNumberMatches({condition: 'equal_or_less_than', value: 13}, 12)).to.be.true;
      expect(grid._isNumberMatches({condition: 'equal_or_less_than', value: 11}, 12)).to.be.false;

      expect(grid._isNumberMatches({leftBound: 1, rightBound: 13}, 12)).to.be.true;
      expect(grid._isNumberMatches({leftBound: 1, rightBound: 10}, 12)).to.be.false;

      expect(grid._isNumberMatches({leftBound: '1', rightBound: '10'}, '2')).to.be.true;
      expect(grid._isNumberMatches({leftBound: '1', rightBound: '10'}, '12')).to.be.false;
    });

    it('should return all items in case of empty filters', () => {
      expect(grid._applyCustomFilter(tableData, [], [])).to.be.eql(tableData);
    });

    it('should return all items when only highlights are passed', () => {
      const filters = [
        {
          action: 'highlight',
          operationType: 'all',
          entities: [{
            active: true,
            columnId: 'first[string]',
            pattern: 'contains',
            query: 'th'
          }]
        }
      ];

      expect(grid._applyCustomFilter(tableData, grid.columns, filters).length).to.be.eq(5);
    });

    it('should show 2 items', () => {
      const filters = [
        {
          action: 'show',
          operationType: 'all',
          entities: [{
            active: true,
            columnId: 'first[string]',
            pattern: 'contains',
            query: 'th'
          }]
        }
      ];

      expect(grid._applyCustomFilter(tableData, grid.columns, filters).length).to.be.eq(2);
    });

    it('should hide 2 items', () => {
      const filters = [
        {
          action: 'hide',
          operationType: 'all',
          entities: [{
            active: true,
            columnId: 'first[string]',
            pattern: 'contains',
            query: 'th'
          }]
        }
      ];

      expect(grid._applyCustomFilter(tableData, grid.columns, filters).length).to.be.eq(3);
    });

    it('should conjugate conditions', () => {
      let filters = [
        {
          action: 'show',
          operationType: 'all',
          entities: [
            {
              active: true,
              columnId: 'first[string]',
              pattern: 'contains',
              query: 'th'
            },
            {
              active: true,
              columnId: 'last[string]',
              pattern: 'equals',
              query: 'Wong'
            }
          ]
        }
      ];

      expect(grid._applyCustomFilter(tableData, grid.columns, filters).length).to.be.eq(1);

      filters = [
        {
          action: 'hide',
          operationType: 'all',
          entities: [
            {
              active: true,
              columnId: 'first[string]',
              pattern: 'contains',
              query: 'th'
            },
            {
              active: true,
              columnId: 'last[string]',
              pattern: 'equals',
              query: 'Wong'
            }
          ]
        }
      ];

      expect(grid._applyCustomFilter(tableData, grid.columns, filters).length).to.be.eq(4);

      filters = [
        {
          action: 'hide',
          operationType: 'any',
          entities: [
            {
              active: true,
              columnId: 'first[string]',
              pattern: 'contains',
              query: 'th'
            },
            {
              active: true,
              columnId: 'last[string]',
              pattern: 'equals',
              query: 'Wong'
            }
          ]
        }
      ];

      expect(grid._applyCustomFilter(tableData, grid.columns, filters).length).to.be.eq(3);
    });

    it('should disconjugate conditions', () => {
      const filters = [
        {
          action: 'show',
          operationType: 'any',
          entities: [
            {
              active: true,
              columnId: 'first[string]',
              pattern: 'contains',
              query: 'th'
            },
            {
              active: true,
              columnId: 'first[string]',
              pattern: 'starts_with',
              query: 'A'
            }
          ]
        }
      ];

      expect(grid._applyCustomFilter(tableData, grid.columns, filters).length).to.be.eq(3);
    });

    it('should check any column and show 3 items', () => {
      const items = [{
        'first': 'Elizabeth!',
        'last': 'Wong',
        'email': 'sika@iknulber.cl'
      }, {
        'first': 'Jeffrey',
        'last': '!Hamilton',
        'email': 'cofok@rac.be'
      }, {
        'first': 'Alma',
        'last': 'Martin',
        'email': 'dot!ta@behtam.la'
      }, {
        'first': 'Elizabeth',
        'last': 'Saunders',
        'email': 'seh@bibapu.gy'
      }, {
        'first': 'Willie',
        'last': 'Dennis',
        'email': 'izko@dahokwej.ci'
      }];

      const filters = [
        {
          action: 'show',
          operationType: 'all',
          entities: [{
            active: true,
            columnId: '-any-',
            pattern: 'contains',
            query: '!'
          }]
        }
      ];

      expect(grid._applyCustomFilter(items, grid.columns, filters).length).to.be.eq(3);
    });

    it('should check any column and hide 3 items', () => {
      const items = [{
        'first': 'Elizabeth!',
        'last': 'Wong',
        'email': 'sika@iknulber.cl'
      }, {
        'first': 'Jeffrey',
        'last': '!Hamilton',
        'email': 'cofok@rac.be'
      }, {
        'first': 'Alma',
        'last': 'Martin',
        'email': 'dot!ta@behtam.la'
      }, {
        'first': 'Elizabeth',
        'last': 'Saunders',
        'email': 'seh@bibapu.gy'
      }, {
        'first': 'Willie',
        'last': 'Dennis',
        'email': 'izko@dahokwej.ci'
      }];

      const filters = [
        {
          action: 'hide',
          operationType: 'all',
          entities: [{
            active: true,
            columnId: '-any-',
            pattern: 'contains',
            query: '!'
          }]
        }
      ];

      expect(grid._applyCustomFilter(items, grid.columns, filters).length).to.be.eq(2);
    });

    it('should conjugate any column expressions properly', () => {
      const items = [{
        'first': 'Elizabeth!',
        'last': 'Wong',
        'email': 'sika@iknulber.cl'
      }, {
        'first': 'Jeffrey',
        'last': '!Hamilton',
        'email': 'cofok@rac.be'
      }, {
        'first': 'Alma',
        'last': 'Martinx',
        'email': 'dot!ta@behtam.la'
      }, {
        'first': 'Elizabeth',
        'last': 'Saunders',
        'email': 'seh@bibapu.gy'
      }, {
        'first': 'Willie',
        'last': 'Dennis',
        'email': 'izko@dahokwej.ci'
      }];

      let filters = [
        {
          action: 'show',
          operationType: 'all',
          entities: [
            {
              active: true,
              columnId: '-any-',
              pattern: 'contains',
              query: '!'
            },
            {
              active: true,
              columnId: '-any-',
              pattern: 'contains',
              query: 'x'
            }
          ]
        }
      ];

      expect(grid._applyCustomFilter(items, grid.columns, filters).length).to.be.eq(1);

      filters = [
        {
          action: 'hide',
          operationType: 'all',
          entities: [
            {
              active: true,
              columnId: '-any-',
              pattern: 'contains',
              query: '!'
            },
            {
              active: true,
              columnId: '-any-',
              pattern: 'contains',
              query: 'x'
            }
          ]
        }
      ];

      expect(grid._applyCustomFilter(items, grid.columns, filters).length).to.be.eq(4);
    });
  });
});
