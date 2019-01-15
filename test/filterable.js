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
  describe('filterable', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.columns = getColumnConfig();
      grid.tableData = tableData;

      flushVaadinGrid(grid);

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          window.flush(done);
        });
      });
    });

    it('should show chips properly', (done) => {
      grid.applyFilters([{
        action: 'show',
        entities: [{
          columnId: 'timestamp[date]',
          active: true,
          pattern: 'equals',
          dateFrom: '2010-10-10 11:11',
          dateTo: '2011-11-11 19:11'
        }]
      }]);
      Polymer.RenderStatus.afterNextRender(grid, () => {
        const filtersPreview = grid.shadowRoot.querySelector('px-data-grid-filters-preview');
        const chips = filtersPreview.shadowRoot.querySelectorAll('px-chip');
        expect(chips.length).to.equal(1);
        expect(chips[0].content.trim().replace(/\s+/g, ' ')).to.equal('2010/10/10 - 2011/11/11');
        done();
      });
    });

    it('should check string properly', () => {
      expect(grid._isStringMatches({pattern: 'equals', query: 'Elizabeth'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'equals', query: 'Elizabet'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'not_equal', query: 'Elizabeth'}, 'Elizabet')).to.be.true;
      expect(grid._isStringMatches({pattern: 'not_equal', query: 'Elizabeth'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'contains', query: 'th'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'contains', query: 'ea'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'not_contains', query: 'th'}, 'Elizabeth')).to.be.false;
      expect(grid._isStringMatches({pattern: 'not_contains', query: 'ea'}, 'Elizabeth')).to.be.true;

      expect(grid._isStringMatches({pattern: 'starts_with', query: 'Eli'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'starts_with', query: 'Bli'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'ends_with', query: 'eth'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'ends_with', query: 'ath'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'wildcard', query: '*'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: 'E*'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: 'E*th'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '*th'}, 'Elizabeth')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: 'a*'}, 'Elizabeth')).to.be.false;
      expect(grid._isStringMatches({pattern: 'wildcard', query: 'be*'}, 'Elizabeth')).to.be.false;
      expect(grid._isStringMatches({pattern: 'wildcard', query: 'Be*'}, 'Elizabeth')).to.be.false;
      expect(grid._isStringMatches({pattern: 'wildcard', query: 'P*th'}, 'Elizabeth')).to.be.false;

      expect(grid._isStringMatches({pattern: 'wildcard', query: '+*'}, '+foo+')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '+*+'}, '+foo+')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '*foo*'}, '+foo+')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '*foo*'}, 'foo')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '*foo*'}, '+')).to.be.false;

      expect(grid._isStringMatches({pattern: 'wildcard', query: '/*'}, '/test')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '{*'}, '{test')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '*}'}, 'test}')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '(*)'}, '(test)')).to.be.true;

      expect(grid._isStringMatches({pattern: 'wildcard', query: '*/'}, '/test')).to.be.false;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '*{'}, '{test')).to.be.false;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '}*'}, 'test}')).to.be.false;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '*()*'}, '(test)')).to.be.false;

      expect(grid._isStringMatches({pattern: 'wildcard', query: '+*'}, '+foo+')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '+*+'}, '+foo+')).to.be.true;
      expect(grid._isStringMatches({pattern: 'wildcard', query: '*foo*'}, '+foo+')).to.be.true;
    });

    it('should check date properly', () => {
      expect(grid._isDateMatches({dateFrom: '1994-12-03'}, '1994-12-04')).to.be.true;
      expect(grid._isDateMatches({dateFrom: '1994-12-03'}, '1994-12-02')).to.be.false;

      expect(grid._isDateMatches({dateTo: '1994-12-03'}, '1994-12-04')).to.be.false;
      expect(grid._isDateMatches({dateTo: '1994-12-03'}, '1994-12-02')).to.be.true;

      expect(grid._isDateMatches({dateFrom: '1994-12-01', dateTo: '1994-12-03'}, '1994-12-02')).to.be.true;
      expect(grid._isDateMatches({dateFrom: '1994-12-01', dateTo: '1994-12-03'}, '1994-12-04')).to.be.false;

      expect(grid._isDateMatches({dateFrom: '2018-02-23T11:00:45Z', dateTo: '2018-02-23T15:35:00Z'}, '2018-02-23 11:16:49')).to.be.true;
      expect(grid._isDateMatches({dateFrom: '2018-02-23T11:00:45Z', dateTo: '2018-02-23T15:35:00Z'}, '2018-02-23 10:37:18')).to.be.false;
      expect(grid._isDateMatches({dateFrom: '2018-02-23T11:00:45Z', dateTo: '2018-02-23T15:35:00Z'}, '2018-02-23 15:37:18')).to.be.false;
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

    it('should show "Any Column" column in filter modal by default', done => {
      grid.filterable = true;

      flush(() => {
        const filterModal = grid.root.querySelector('px-data-grid-filters-modal');
        const modal = filterModal.root.querySelector('px-modal');
        const modalTrigger = filterModal.root.querySelector('px-modal-trigger');
        // Open modal
        modalTrigger.click();

        flush(() => {
          const filterSection = modal.querySelector('px-data-grid-filter').root.querySelector('px-data-grid-filter-section');
          const addFilterBtn = filterSection.root.querySelector('.add-filter');

          // Add a filter
          addFilterBtn.click();

          flush(() => {
            const columnDropdown = filterSection.root
              .querySelector('px-data-grid-filter-entity')
              .root.querySelector('px-dropdown#column-dropdown');
            const firstItem = columnDropdown.items[0]['key'];

            expect(firstItem).to.equal('-any-');
            done();
          });
        });
      });
    });

    it('should hide "Any Column" column in filter modal if disable-all-columns-filter prop set', done => {
      grid.filterable = true;
      grid.disableAllColumnsFilter = true;

      flush(() => {
        const filterModal = grid.root.querySelector('px-data-grid-filters-modal');
        const modal = filterModal.root.querySelector('px-modal');
        const modalTrigger = filterModal.root.querySelector('px-modal-trigger');
        // Open modal
        modalTrigger.click();

        flush(() => {
          const filterSection = modal.querySelector('px-data-grid-filter').root.querySelector('px-data-grid-filter-section');
          const addFilterBtn = filterSection.root.querySelector('.add-filter');

          // Add a filter
          addFilterBtn.click();

          flush(() => {
            const columnDropdown = filterSection.root
              .querySelector('px-data-grid-filter-entity')
              .root.querySelector('px-dropdown#column-dropdown');
            const firstItem = columnDropdown.items[0]['key'];
            const firstColumn = grid.columns[0].id;

            expect(firstItem).to.equal(firstColumn);
            done();
          });
        });
      });
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
