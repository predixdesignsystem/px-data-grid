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
  describe('table actions and column selector', () => {
    let grid;
    let getActionDropdown;
    let getColumnSelector;
    let getActionBar;

    beforeEach(done => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = tableData;
      grid.tableActions = tableActions;

      getActionDropdown = () => {
        return grid.shadowRoot.querySelector('px-dropdown.px-data-grid-action-menu');
      };

      getColumnSelector = () => {
        return grid.shadowRoot.querySelector('px-dropdown.px-data-grid-column-selector');
      };

      getActionBar = () => {
        return grid.shadowRoot.querySelector('div.action-bar');
      };

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => {
          // IE11
          window.flush(done);
        });
      });
    });

    it('should show actions menu if tableActions defined', done => {
      flush(() => {
        expect(getActionDropdown()).to.be.visible;
        done();
      });
    });

    it('should hide actions menu if no tableActions defined', done => {
      grid.tableActions = [];
      flush(() => {
        expect(getActionDropdown()).to.not.be.visible;
        done();
      });
    });

    it('should hide actions menu if hideActionMenu flag set', done => {
      grid.hideActionMenu = true;
      flush(() => {
        expect(getActionDropdown()).to.not.be.visible;
        done();
      });
    });

    it('should show actions menu if hideActionMenu flag unset', done => {
      flush(() => {
        expect(getActionDropdown()).to.be.visible;
        done();
      });
    });

    it('should hide column selector if hideColumnFilter flag set', done => {
      grid.hideColumnFilter = true;
      flush(() => {
        expect(getColumnSelector()).to.not.be.visible;
        done();
      });
    });

    it('should show column selector if hideColumnFilter flag unset', done => {
      flush(() => {
        expect(getColumnSelector()).to.be.visible;
        done();
      });
    });

    it('should show action bar when both column selector and table actions visible', done => {
      flush(() => {
        expect(getActionBar()).to.be.visible;
        done();
      });
    });

    it('should show action bar when column selector is visible and table actions hidden', done => {
      grid.hideActionMenu = true;
      flush(() => {
        expect(getActionBar()).to.be.visible;
        done();
      });
    });

    it('should show action bar when column selector is hidden and table actions visible', done => {
      grid.hideColumnFilter = true;
      flush(() => {
        expect(getActionBar()).to.be.visible;
        done();
      });
    });

    it('should hide action bar when both column selector and table actions hidden', done => {
      grid.hideColumnFilter = true;
      grid.hideActionMenu = true;
      flush(() => {
        expect(getActionBar()).to.not.be.visible;
        done();
      });
    });

    it('action menu should update if tableActions reassigned', done => {
      // Should be 1 (from fixture)
      expect(getActionDropdown().items.length).to.equal(1);

      // Add an additional action item, should be 2
      grid.tableActions = grid.tableActions.concat({name: 'Upload file', id: 'upload', icon: 'px-utl:upload'});
      expect(getActionDropdown().items.length).to.equal(2);
      done();
    });
  });
});
