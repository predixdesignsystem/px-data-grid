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
  describe('remote data provider', () => {
    let grid;
    let timeoutSpy;

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          done();
        });
      });
    });

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


    it('should ask correct amount of items', (done) => {
      grid.size = 100;
      grid.pageSize = 100;
      // Not sure why, but provider gets called twice
      let doneCalled = false;
      grid.remoteDataProvider = (params, callback) => {
        if (!doneCalled) {
          expect(params.pageSize).to.be.equal(100);
          const response = [];
          for (let i = 0; i < params.pageSize; ++i) {
            response.push({
              id: params.page * params.pageSize + i,
              name: 'foobar'
            });
          }
          callback(response, 100);
          doneCalled = true;
          done();
        }
      };
    });
  });
});
