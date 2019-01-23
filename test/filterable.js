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
    let originalTz;

    beforeEach(done => {
      grid = fixture('px-data-grid-fixture');
      grid.columns = getColumnConfig();
      grid.tableData = tableData;

      flushVaadinGrid(grid);

      // Store detected timezone, then force UTC to keep testing results consistent
      originalTz = window.moment.tz.guess();
      window.moment.tz.setDefault('UTC');

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => {
          // IE11
          window.flush(done);
        });
      });
    });

    afterEach(() => {
      // Restore originally detected timezone
      window.moment.tz.setDefault(originalTz);
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

    it('should fallback to default date format and timezone when evaluating grid filter', done => {
      const columnConfig = getColumnConfig();
      columnConfig[3] = {
        name: 'Timestamp',
        path: 'timestamp',
        renderer: 'px-data-grid-date-renderer',
        type: 'date'
      };
      grid.columns = columnConfig;

      flush(() => {
        // Apply filter with ISO8601 formatted dates
        grid.applyFilters([
          {
            action: 'show',
            entities: [
              {
                columnId: 'timestamp[date]',
                active: true,
                pattern: 'equals',
                dateFrom: '2010-01-01',
                dateTo: '2019-01-22'
              }
            ]
          }
        ]);
        Polymer.RenderStatus.afterNextRender(grid, () => {
          const filtersPreview = grid.shadowRoot.querySelector('px-data-grid-filters-preview');
          const chips = filtersPreview.shadowRoot.querySelectorAll('px-chip');

          // Check that filter was applied with the dates correctly parsed
          expect(chips.length).to.equal(1);
          expect(chips[0].content.trim().replace(/\s+/g, ' ')).to.equal('2010/01/01 - 2019/01/22');
          done();
        });
      });
    });

    it('should respect configured source date format and timezone when evaluating grid filter', done => {
      const columnConfig = getColumnConfig();
      columnConfig[3] = {
        name: 'Timestamp',
        path: 'timestamp',
        renderer: 'px-data-grid-date-renderer',
        type: 'date',
        // Set a non-standard source format and TZ.
        dateFormat: {
          format: 'DD/MM/YYYY',
          timezone: 'Australia/Melbourne'
        }
      };
      grid.columns = columnConfig;

      flush(() => {
        // Apply filter with DD/MM/YYYY dates, matching the column configured date format.
        grid.applyFilters([
          {
            action: 'show',
            entities: [
              {
                columnId: 'timestamp[date]',
                active: true,
                pattern: 'equals',
                dateFrom: '02/03/2004',
                dateTo: '04/05/2005'
              }
            ]
          }
        ]);
        Polymer.RenderStatus.afterNextRender(grid, () => {
          const filtersPreview = grid.shadowRoot.querySelector('px-data-grid-filters-preview');
          const chips = filtersPreview.shadowRoot.querySelectorAll('px-chip');

          // Check that filter was applied with the dates correctly parsed
          expect(chips.length).to.equal(1);
          /*
           * Because the source timezone is Melbourne (+11:00) and the output timezone is UTC (+0:00),
           * the dates reported should appear to be offset by -1 day.
           */
          expect(chips[0].content.trim().replace(/\s+/g, ' ')).to.equal('2004/03/01 - 2005/05/03');
          done();
        });
      });
    });

    it('should respect configured output date format and timezone when evaluating grid filter', done => {
      const columnConfig = getColumnConfig();
      columnConfig[3] = {
        name: 'Timestamp',
        path: 'timestamp',
        renderer: 'px-data-grid-date-renderer',
        type: 'date',
        dateFormat: {
          format: 'DD/MM/YYYY HH:mm'
        },
        rendererConfig: {
          displayFormat: 'YYYY/MM/DD HH:mm:ss',
          timezone: 'Pacific/Honolulu'
        }
      };
      grid.columns = columnConfig;

      flush(() => {
        // Apply filter with ISO8601 formatted dates
        grid.applyFilters([
          {
            action: 'show',
            entities: [
              {
                columnId: 'timestamp[date]',
                active: true,
                pattern: 'equals',
                dateFrom: '24/12/2018 02:01:00',
                dateTo: '26/12/2018 04:02:00'
              }
            ]
          }
        ]);
        Polymer.RenderStatus.afterNextRender(grid, () => {
          const filtersPreview = grid.shadowRoot.querySelector('px-data-grid-filters-preview');
          const chips = filtersPreview.shadowRoot.querySelectorAll('px-chip');
          const tooltip = filtersPreview.shadowRoot.querySelector('px-tooltip');

          // Check that filter was applied with the dates correctly parsed
          expect(chips.length).to.equal(1);
          /*
           * Because the source timezone is UTC (+0:00) and the output timezone is Hawaii Time (-10:00),
           * the dates reported should appear to be offset by -1 day.
           */
          expect(chips[0].content.trim().replace(/\s+/g, ' ')).to.equal('2018/12/23 - 2018/12/25');
          // Check the tooltip for the full formatted datetime
          const dates = tooltip.tooltipMessage
            .replace(/\s+/g, ' ')
            .replace('Date Range / ', '')
            .split('-');
          expect(dates[0].trim()).to.equal('2018/12/23 16:01:00');
          expect(dates[1].trim()).to.equal('2018/12/25 18:02:00');

          done();
        });
      });
    });
  });
});
