/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/* Common demo imports */
/* Imports for this component */
/* Demo DOM module */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import 'px-demo/px-demo-header.js';

import 'px-demo/px-demo-api-viewer.js';
import 'px-demo/px-demo-footer.js';
import 'px-demo/px-demo-configs.js';
import 'px-demo/px-demo-props.js';
import 'px-demo/px-demo-interactive.js';
import 'px-demo/px-demo-component-snippet.js';
import 'px-demo/px-demo-code-editor.js';
import 'px-demo/css/px-demo-styles.js';
import '../px-data-grid.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
{
  /* *************************************************************************
   * DEMO DATA
   */

  const demoTableDataNamesSmall = [
    {
      first: 'Elizabeth',
      last: 'Wong',
      email: 'sika@iknulber.cl',
      born: '1995-04-12 17:00',
      age: 23
    },
    {
      first: 'Jeffrey',
      last: 'Wong',
      email: 'cofok@rac.be',
      born: '1985-04-12',
      age: 32
    },
    {
      first: 'Alma',
      last: 'Martin',
      email: 'dotta@behtam.la',
      born: '1973-04-12',
      age: 44
    },
    {
      first: 'Carl',
      last: 'Saunders',
      email: 'seh@bibapu.gy',
      born: '2002-04-12',
      age: 12
    },
    {
      first: 'Willie',
      last: 'Dennis',
      email: 'izko@dahokwej.ci',
      born: '1930-04-12',
      age: 88
    }
  ];

  const demoTableDataNamesLarge = [
    {
      first: 'Elizabeth',
      last: 'Wong',
      full: 'Elizabeth Wong',
      email: 'sika@iknulber.cl',
      born: '1985-04-12',
      age: 32,
      appointment: '2009-05-05 01:10'
    },
    {
      first: 'Jeffrey',
      last: 'Hamilton',
      email: 'cofok@rac.be',
      born: '1995-04-12',
      age: 23,
      appointment: '2011-03-04 01:10'
    },
    {
      first: 'Alma',
      last: 'Martin',
      email: 'dotta@behtam.la',
      born: '1975-04-12',
      age: 42,
      appointment: '2010-03-04 02:20'
    },
    {
      first: 'Carl',
      last: 'Saunders',
      email: 'seh@bibapu.gy',
      born: '2002-04-12',
      age: 12,
      appointment: '2010-03-04 03:30'
    },
    {
      first: 'Willie',
      last: 'Dennis',
      email: 'izko@dahokwej.ci',
      born: '1973-04-12',
      age: 44,
      appointment: '2010-03-04 04:40'
    },
    {
      first: 'Angel',
      last: 'Lewis',
      email: 'ma@et.nz',
      born: '1932-04-12',
      age: 89,
      appointment: '2010-03-04 05:50'
    },
    {
      first: 'Jessie',
      last: 'Sherman',
      email: 'hunocnas@mosuraj.gi',
      born: '1990-04-12',
      age: 27,
      appointment: '2010-03-04 06:00'
    },
    {
      first: 'Eric',
      last: 'Brewer',
      email: 'tu@coajoul.de',
      born: '1930-04-12',
      age: 88,
      appointment: '2010-03-04 07:00'
    },
    {
      first: 'Cory',
      last: 'Ramos',
      email: 'kilamja@oviafbek.ss',
      born: '2006-04-12',
      age: 9,
      appointment: '2010-03-04 08:00'
    },
    {
      first: 'Bertie',
      last: 'Ross',
      email: 'ifuvu@getvi.my',
      born: '1990-04-12',
      age: 27,
      appointment: '2010-03-04 09:00'
    },
    {
      first: 'Oscar',
      last: 'Estrada',
      email: 'minu@kerireg.gp',
      born: '2002-04-12',
      age: 15,
      appointment: '2010-03-04 10:00'
    },
    {
      first: 'Estelle',
      last: 'Patton',
      email: 'hudliami@lijihen.fi',
      born: '2006-04-12',
      age: 11,
      appointment: '2010-03-04 11:00'
    },
    {
      first: 'Sallie',
      last: 'George',
      email: 'wo@zof.bf',
      born: '1985-04-12',
      age: 33,
      appointment: '2010-03-04 12:00'
    },
    {
      first: 'Harriett',
      last: 'Wheeler',
      email: 'woguw@cibevo.pt',
      born: '1968-04-12',
      age: 52,
      appointment: '2010-03-04 13:00'
    },
    {
      first: 'Bryan',
      last: 'Houston',
      email: 'tekkubom@gaahu.ge',
      born: '1940-04-12',
      age: 77,
      appointment: '2010-03-04 14:00'
    },
    {
      first: 'Leon',
      last: 'Craig',
      email: 'wo@gurozo.gs',
      born: '2015-04-12',
      age: 2,
      appointment: '2010-03-04 15:00'
    },
    {
      first: 'Mable',
      last: 'Taylor',
      email: 'um@fegnocka.pg',
      born: '2006-04-12',
      age: 11,
      appointment: '2010-03-04 16:00'
    },
    {
      first: 'Ida',
      last: 'Hansen',
      email: 'lufahu@gewlaskoc.kh',
      born: '1973-04-12',
      age: 44,
      appointment: '2010-03-04 17:00'
    },
    {
      first: 'Adele',
      last: 'Thornton',
      email: 'gugugo@nevigi.th',
      born: '1973-04-12',
      age: 41,
      appointment: '2010-03-04 18:00'
    },
    {
      first: 'Jerry',
      last: 'Kelley',
      email: 'solef@zoose.as',
      born: '1950-04-12',
      age: 67,
      appointment: '2010-03-04 19:00'
    },
    {
      first: 'Clara',
      last: 'Delgado',
      email: 'fivticnuf@upkib.rw',
      born: '1951-04-12',
      age: 66,
      appointment: '2010-03-04 20:00'
    },
    {
      first: 'Joseph',
      last: 'Stevenson',
      email: 'be@viijo.lk',
      born: '1995-04-12',
      age: 22,
      appointment: '2010-03-04 21:00'
    },
    {
      first: 'Ellen',
      last: 'Perry',
      email: 'ce@jewo.sv',
      born: '1996-04-12',
      age: 23,
      appointment: '2010-03-04 22:00'
    },
    {
      first: 'Ronnie',
      last: 'Cummings',
      email: 'iro@wi.vn',
      born: '2000-04-12',
      age: 17,
      appointment: '2010-03-04 23:00'
    },
    {
      first: 'Olive',
      last: 'Santos',
      email: 'vo@nees.cn',
      born: '1918-04-12',
      age: 99,
      appointment: '2010-03-05 00:00'
    },
    {
      first: 'Rena',
      last: 'Tucker',
      email: 'uharoc@lohpol.gl',
      born: '1915-04-12',
      age: 102,
      appointment: '2010-03-05 01:00'
    },
    {
      first: 'Nell',
      last: 'Hicks',
      email: 'felaf@vo.sb',
      born: '1940-04-12',
      age: 76,
      appointment: '2010-03-05 02:00'
    },
    {
      first: 'Jesus',
      last: 'Hawkins',
      email: 'wahgab@mu.mk',
      born: '1983-04-12',
      age: 34,
      appointment: '2010-03-05 03:00'
    },
    {
      first: 'Duane',
      last: 'Harris',
      email: 'kellanjob@daava.ph',
      born: '1996-04-12',
      age: 23,
      appointment: '2010-03-05 04:00'
    },
    {
      first: 'Jonathan',
      last: 'Holmes',
      email: 'jir@bikuf.dj',
      born: '1969-04-12',
      age: 49,
      appointment: '2010-03-05 05:00'
    },
    {
      first: 'Christine',
      last: 'Collier',
      email: 'bocago@jerla.ba',
      born: '1970-04-12',
      age: 48,
      appointment: '2010-03-05 06:00'
    },
    {
      first: 'Brandon',
      last: 'Thompson',
      email: 'regoh@ji.kn',
      born: '1973-04-12',
      age: 43,
      appointment: '2010-03-05 07:00'
    },
    {
      first: 'Anne',
      last: 'Dunn',
      email: 'samhof@are.sc',
      born: '1976-04-12',
      age: 41,
      appointment: '2010-03-05 08:00'
    },
    {
      first: 'Viola',
      last: 'Sherman',
      email: 'wep@kezori.lt',
      born: '1973-04-12',
      age: 44,
      appointment: '2010-03-05 09:00'
    },
    {
      first: 'Kathryn',
      last: 'Harper',
      email: 'keotoci@je.mr',
      born: '1941-04-12',
      age: 77,
      appointment: '2010-03-05 10:00'
    },
    {
      first: 'Calvin',
      last: 'Bates',
      email: 'bomeg@lip.bw',
      born: '1979-04-12',
      age: 38,
      appointment: '2010-03-05 11:00'
    },
    {
      first: 'Maggie',
      last: 'Collins',
      email: 'zonefto@ihihij.ke',
      born: '1982-04-12',
      age: 35,
      appointment: '2010-03-05 12:00'
    },
    {
      first: 'Zachary',
      last: 'Mitchell',
      email: 'wamez@cilvahbod.mk',
      born: '1993-04-12',
      age: 26,
      appointment: '2010-03-05 13:00'
    },
    {
      first: 'Raymond',
      last: 'Kelley',
      email: 'wuz@napujos.tt',
      born: '1995-04-12',
      age: 21,
      appointment: '2010-03-05 14:00'
    },
    {
      first: 'Augusta',
      last: 'Torres',
      email: 'bum@ne.lt',
      born: '1967-04-12',
      age: 54,
      appointment: '2010-03-05 15:00'
    },
    {
      first: 'Charlie',
      last: 'Lindsey',
      email: 'ruhlu@tuobujen.ao',
      born: '2002-04-12',
      age: 15,
      appointment: '2010-03-05 16:00'
    },
    {
      first: 'Jeremy',
      last: 'Swanson',
      email: 'ed@ted.km',
      born: '1997-04-12',
      age: 21,
      appointment: '2010-03-05 17:00'
    },
    {
      first: 'Joel',
      last: 'Gonzalez',
      email: 'ej@pot.bz',
      born: '1999-04-12',
      age: 18,
      appointment: '2010-03-05 18:00'
    },
    {
      first: 'Lillie',
      last: 'Hawkins',
      email: 'uguiv@mudbuve.pa',
      born: '1975-04-12',
      age: 43,
      appointment: '2010-03-05 19:00'
    },
    {
      first: 'Joel',
      last: 'Watts',
      email: 'naafe@oli.bb',
      born: '2017-04-12',
      age: 1,
      appointment: '2010-03-05 20:00'
    },
    {
      first: 'Isabella',
      last: 'Sandoval',
      email: 'asobu@wedef.af',
      born: '2016-04-12',
      age: 3,
      appointment: '2010-03-05 21:00'
    },
    {
      first: 'Roy',
      last: 'Lyons',
      email: 'rasaogu@tadiri.tc',
      born: '1924-04-12',
      age: 88,
      appointment: '2010-03-05 22:00'
    }
  ];

  /* Basic column definition for names demo data, editable fields with strings */
  const demoColumnsSimple = [
    {
      name: 'First Name',
      path: 'first',
      renderer: 'px-data-grid-string-renderer',
      editable: true
    },
    {
      name: 'Last Name',
      path: 'last',
      renderer: 'px-data-grid-string-renderer',
      editable: true
    },
    {
      name: 'Email',
      path: 'email'
    }
  ];

  /* Extended column defintion to show more columns with additional types */
  const demoColumnsMoreTypes = [
    ...demoColumnsSimple,
    {
      name: 'Age',
      path: 'age',
      renderer: 'px-data-grid-number-renderer',
      editable: true,
      type: 'number'
    },
    {
      name: 'Birth Date',
      path: 'born',
      dateFormat: {
        format: 'YYYY-MM-DD'
      },
      renderer: 'px-data-grid-date-renderer',
      rendererConfig: {
        hideTime: true,
        displayFormat: 'YYYY/MM/DD'
      },
      editable: true,
      type: 'date'
    },
    {
      name: 'Appointment',
      path: 'appointment',
      dateFormat: {
        format: 'YYYY-MM-DD HH:mm',
        timezone: 'UTC'
      },
      filterByTime: true,
      renderer: 'px-data-grid-date-renderer',
      rendererConfig: {
        hideTime: false,
        displayFormat: 'MM/DD/YYYY HH:mm',
        timezone: 'America/Los_Angeles',
        datePickerDateFormat: 'MM/DD/YYYY',
        datePickerTimeFormat: 'HH:mm'
      },
      editable: true,
      type: 'date'
    }
  ];


  /* Highlight rules for the "Highlight rules" config */
  const demoHighlight = [
    {
      type: 'cell',
      color: 'lightgreen',
      condition: (cellContent, column, item) => {
        return cellContent == 'Dennis';
      }
    },
    {
      type: 'column',
      color: 'lightskyblue',
      condition: (column, item) => {
        return column.path == 'last';
      }
    },
    {
      type: 'row',
      color: 'lightsalmon',
      condition: (cellContent, item) => {
        return item && (item.last == 'Dennis' || item.first == 'Carl');
      }
    }
  ];

  /* *************************************************************************
   * DEMO PROPS
   */

  const tableData = {
    type: Object,
    inputType: 'code:JSON',
    defaultValue: demoTableDataNamesSmall
  };

  const columns = {
    type: Object,
    inputType: 'code:JSON',
    defaultValue: demoColumnsSimple
  };

  const striped = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const multiSort = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const editable = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const resizable = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const filterable = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false,
    // @TODO: Fix px-demo to allow a prop to be hidden for default config,
    // this is required to hide a property on first page load.
    _visibleForConfig: false
  };

  const disableAllColumnsFilter = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false,
    _visibleForConfig: false
  };

  const autoFilter = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const columnReorderingAllowed = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const hideSelectionColumn = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const allowSortBySelection = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const selectionMode = {
    type: String,
    inputType: 'dropdown',
    inputChoices: ['none', 'single', 'multi'],
    defaultValue: 'none',
    // @TODO: Figure out why px-demo initially sets selectionMode to something
    // other than 'none'. Setting the value here will only take effect when
    // the demo is initialized, and is overridden later.
    value: 'none'
  };

  const hideActionMenu = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const hideColumnFilter = {
    type: Boolean,
    inputType: 'toggle',
    defaultValue: false
  };

  const tableActions = {
    type: Object,
    inputType: 'code:JSON',
    defaultValue: [
      {
        name: 'Export CSV',
        icon: 'px-doc:document-pdf',
        id: 'CSV'
      }
    ]
  };

  const itemActions = {
    type: Object,
    inputType: 'code:JSON',
    defaultValue: [
      {
        name: 'Add Row',
        icon: 'px-utl:add',
        id: 'add'
      },
      {
        name: 'Delete Row',
        icon: 'px-utl:delete',
        id: 'delete'
      }
    ]
  };

  const highlight = {
    type: Array,
    inputType: 'code:EvaluatedJavaScript',
    defaultValue: [],
    // @TODO: Figure out why px-demo initially sets highlight to something
    // other than the default value. Setting the value here will only
    // take effect when the demo is initialized, and is overridden later.
    value: [],
    // @TODO: Fix px-demo to allow a prop to be hidden for default config,
    // this is required to hide a property on first page load.
    _visibleForConfig: false
  };

  // @TODO: Decide if these configs should be added to additional demo config
  // tabs to show more features.
  //
  // const gridHeight = {
  //   type: String,
  //   defaultValue: 'default',
  //   inputType: 'dropdown',
  //   inputChoices: ['default', 'auto', '300px', '600px', '900px']
  // };
  //
  // const offerFilterSaving = {
  //   type: Boolean,
  //   inputType: 'toggle',
  //   defaultValue: false
  // };
  //
  // const language = {
  //   type: String,
  //   inputType: 'dropdown',
  //   inputChoices: ['en', 'fr', 'fi'],
  //   defaultValue: 'en'
  // };
  //
  // const compactAdvancedFilterDialog = {
  //   type: Boolean,
  //   inputType: 'toggle',
  //   defaultValue: false
  // };

  const gridProps = {
    tableData,
    columns,
    striped,
    multiSort,
    resizable,
    editable,
    filterable,
    disableAllColumnsFilter,
    autoFilter,
    columnReorderingAllowed,
    hideSelectionColumn,
    allowSortBySelection,
    selectionMode,
    hideActionMenu,
    hideColumnFilter,
    tableActions,
    itemActions,
    highlight
  };

  /* *************************************************************************
   * DEMO CONFIGS
   */

  const defaultConfig = {
    configName: 'Default',
    configReset: true,
    configHideProps: ['highlight, filterable, disableAllColumnsFilter']
  };

  const moreDataConfig = {
    configName: 'More data',
    configReset: true,
    tableData: demoTableDataNamesLarge,
    configHideProps: ['highlight, filterable, disableAllColumnsFilter']
  };

  const highlightConfig = {
    configName: 'Highlight rules',
    configReset: true,
    tableData: demoTableDataNamesSmall,
    highlight: demoHighlight,
    configHideProps: ['filterable, disableAllColumnsFilter']
  };

  const moreColumnTypesConfig = {
    configName: 'More column types',
    configReset: true,
    tableData: demoTableDataNamesLarge,
    columns: demoColumnsMoreTypes,
    configHideProps: ['highlight, filterable, disableAllColumnsFilter']
  };

  const advancedFilterConfig = {
    configName: 'Advanced filters',
    configReset: true,
    tableData: demoTableDataNamesLarge,
    columns: demoColumnsMoreTypes,
    filterable: true,
    configHideProps: ['highlight']
  };

  const gridConfigs = [
    defaultConfig,
    moreDataConfig,
    highlightConfig,
    moreColumnTypesConfig,
    advancedFilterConfig
  ];

  /* *************************************************************************
   * DEMO COMPONENT
   */

  Polymer({
    _template: html`
    <custom-style>
      <style include="px-demo-styles" is="custom-style"></style>
    </custom-style>

    <!-- Header -->
    <px-demo-header module-name="px-data-grid" description="The data grid displays tabular data with rich interactions to help users find, manage, and update important information. The px-data-grid component replaces the legacy px-data-table component and offers a wide range of new behaviors. The grid is a complete rewrite with a new API and more features that targets Polymer 2+ runtime." github-org="predixdesignsystem" mobile="" desktop="" tablet="">
    </px-demo-header>

    <!-- Interactive -->
    <px-demo-interactive>
      <!-- Configs -->
      <px-demo-configs slot="px-demo-configs" configs="[[configs]]" props="{{props}}" chosen-config="{{chosenConfig}}"></px-demo-configs>

      <!-- Props -->
      <px-demo-props slot="px-demo-props" props="{{props}}" config="[[chosenConfig]]"></px-demo-props>

      <!-- Code Editor -->
      <px-demo-code-editor slot="px-demo-code-editor" props="{{props}}" config="[[chosenConfig]]"></px-demo-code-editor>

      <!-- Component ---------------------------------------------------------->
      <px-demo-component slot="px-demo-component">
        <px-data-grid columns="{{props.columns.value}}" table-data="{{props.tableData.value}}" striped="{{props.striped.value}}" multi-sort="{{props.multiSort.value}}" resizable="{{props.resizable.value}}" editable="{{props.editable.value}}" filterable="{{props.filterable.value}}" auto-filter="{{props.autoFilter.value}}" column-reordering-allowed="{{props.columnReorderingAllowed.value}}" disable-all-columns-filter="{{props.disableAllColumnsFilter.value}}" hide-selection-column="{{props.hideSelectionColumn.value}}" selection-mode="{{props.selectionMode.value}}" allow-sort-by-selection="{{props.allowSortBySelection.value}}" hide-action-menu="{{props.hideActionMenu.value}}" hide-column-filter="{{props.hideColumnFilter.value}}" table-actions="{{props.tableActions.value}}" item-actions="{{props.itemActions.value}}" highlight="{{props.highlight.value}}" item-id-path="email" selected-items="{{selectedItems}}" on-table-action="handleTableAction">
        </px-data-grid>
      </px-demo-component>
      <!-- END Component ------------------------------------------------------>

      <px-demo-component-snippet slot="px-demo-component-snippet" element-properties="{{props}}" element-name="px-data-grid" codepen-link="https://glitch.com/edit/#!/px-data-grid-demo?path=README.md:29:215" suppress-property-values="[&quot;tableData&quot;]">
      </px-demo-component-snippet>
    </px-demo-interactive>

    <!-- API Viewer -->
    <px-demo-api-viewer source="px-data-grid" api-source-file-path="px-data-grid/px-data-grid-api.json">
    </px-demo-api-viewer>

    <!-- Footer -->
    <px-demo-footer></px-demo-footer>
`,

    is: 'px-data-grid-demo',

    properties: {
      props: {
        type: Object,
        value: () => gridProps
      },
      configs: {
        type: Array,
        value: () => gridConfigs
      }
    },

    /**
     * Called when the user selects an action from the table action menu.
     */
    handleTableAction(e) {
      if (e.detail.id === 'CSV') {
        this.exportToCsv();
      }
    },

    /**
     * Exports the grid data to a CSV. Demonstrates how an app would implement
     * this functionality.
     */
    exportToCsv() {
      const grid = this.shadowRoot ? this.shadowRoot.querySelector('px-data-grid') : this.querySelector('px-data-grid');
      const data = grid.getData();
      const columns = grid.getVisibleColumns();

      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += columns.map((column) => grid.resolveColumnHeader(column)).join(',') + '\r\n';
      data.forEach((item) => {
        csvContent += Object.keys(item).map((key) => item[key]).join(',') + '\r\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'table_data.csv');
      document.body.appendChild(link);

      link.click();
    }
  });
}
