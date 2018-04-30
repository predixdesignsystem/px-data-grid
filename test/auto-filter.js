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
  describe('auto filtering', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;
      grid.autoFilter = true;

      flushVaadinGrid(grid);

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          window.flush(done);
        });
      });
    });

    it('should show only 1 row after filtering', (done) => {
      const autoFilter = grid.shadowRoot.querySelector('px-auto-filter-field');
      autoFilter.addEventListener('filter-change', (event) => {
        expect(getVisibleRows(grid).length).to.be.eql(2);
        done();
      });
      autoFilter.value = 'Elizabeth';
    });

    it('should show 2 rows after filtering', (done) => {
      const autoFilter = grid.shadowRoot.querySelector('px-auto-filter-field');
      autoFilter.addEventListener('filter-change', (event) => {
        expect(getVisibleRows(grid).length).to.be.eql(2);
        done();
      });
      autoFilter.value = 'am';
    });

    it('should show all rows when filter value is empty', (done) => {
      const autoFilter = grid.shadowRoot.querySelector('px-auto-filter-field');
      // set filter with value to reduce # of visible rows
      autoFilter.value = 'am';
      // give 500ms to let rows update
      setTimeout(() => {
        // add listener and clear filter value to let all rows become visible
        autoFilter.addEventListener('filter-change', (event) => {
          expect(getVisibleRows(grid).length).to.be.eql(tableData.length);
          done();
        });
        autoFilter.value = '';
      }, autoFilter.timeout + 100);
    });
  });
});
