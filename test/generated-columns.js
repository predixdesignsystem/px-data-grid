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
  describe('generated columns', () => {
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

    it('should properly populate columns', () => {
      expect(grid.columns.length).to.be.eql(4);
      expect(grid.columns[0].name).to.be.eql('first');
      expect(grid.columns[1].name).to.be.eql('last');
      expect(grid.columns[2].name).to.be.eql('email');
      expect(grid.columns[3].name).to.be.eql('timestamp');
    });

    it('should set proper column.id', () => {
      expect(grid.columns.length).to.be.eql(4);
      expect(grid.columns[0].id).to.be.eql('first[string]');
      expect(grid.columns[1].id).to.be.eql('last[string]');
      expect(grid.columns[2].id).to.be.eql('email[string]');
      expect(grid.columns[3].id).to.be.eql('timestamp[string]');
    });

  });
});
