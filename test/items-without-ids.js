document.addEventListener('WebComponentsReady', () => {
  describe('Data items without IDs', () => {
    let grid;

    const simpleData = [
      {
        name: 'Foo',
        number: 1
      },
      {
        name: 'Bar',
        number: 2
      },
      {
        name: 'Lorem',
        number: 3
      },
      {
        name: 'Ipsum',
        number: 4
      },
      {
        name: 'Last',
        number: 5
      }
    ];

    beforeEach((done) => {
      grid = fixture('px-data-grid-fixture');
      grid.tableData = simpleData;

      flushVaadinGrid(grid);

      Polymer.RenderStatus.afterNextRender(grid, () => {
        setTimeout(() => { // IE11
          window.flush(done);
        });
      });
    });

    // This test will make sure all items are selected, it might break
    // If items are cloned, as without item-id-path the instances are
    // used as identifiers.
    it('Select all must work without item-id-path', () => {
      grid.selectionMode = 'multi';
      flushVaadinGrid(grid);

      const selectAllCell = grid._vaadinGrid.$.header.querySelectorAll('tr:nth-child(2) [part~="header-cell"]')[0];
      const selectAllContent = selectAllCell.querySelector('slot').assignedNodes()[0];
      const selectAllElement = selectAllContent.querySelectorAll('px-data-grid-select-all')[0];
      const selectAllCheckBox = selectAllElement.shadowRoot.querySelectorAll('vaadin-checkbox')[0];
      selectAllCheckBox.click();

      flushVaadinGrid(grid);

      const rows = getRows(grid);

      for (let row = 0; row < rows.length; ++row) {
        const cells = getRowCells(rows[row]);
        const content = cells[0].querySelector('slot').assignedNodes()[0];
        const checkBox = content.querySelectorAll('vaadin-checkbox')[0];
        expect(checkBox.checked).to.be.eql(true);
      }
    });
  });
});
