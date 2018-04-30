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
  describe('row details', () => {
    let grid;

    beforeEach((done) => {
      grid = fixture('px-data-grid-row-details-fixture');
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          window.flush(done);
        });
      });
    });

    it('should open and close row with setRowDetailsVisible(item)', (done) => {
      grid.setRowDetailsVisible(grid.tableData[0], true);

      setTimeout(() => {
        const rowDetails = getRows(grid)[0].querySelector('td:last-child');
        expect(rowDetails.hasAttribute('aria-expanded')).to.be.true;
        expect(rowDetails.hidden).to.be.false;

        grid.setRowDetailsVisible(grid.tableData[0], false);
        setTimeout(() => {
          const rowDetails = getRows(grid)[0].querySelector('td:last-child');
          expect(rowDetails.hidden).to.be.true;
          done();
        }, 200);
      }, 200);
    });

  });
});
