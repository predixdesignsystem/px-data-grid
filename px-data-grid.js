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
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import 'vaadin-grid/vaadin-grid.js';
import 'vaadin-grid/vaadin-grid-sorter.js';
import 'vaadin-grid/vaadin-grid-column-group.js';
import 'vaadin-grid/vaadin-grid-tree-toggle.js';
import 'px-spinner/px-spinner.js';
import 'px-modal/px-modal.js';
import 'px-icon-set/px-icon.js';
import './px-data-grid-column.js';
import './px-auto-filter-field.js';
import './px-data-grid-theme.js';
import './px-data-grid-selection-column.js';
import './px-data-grid-toggle-details-column.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import 'px-moment-imports/px-moment-imports.js';
import './px-data-grid-string-renderer.js';
import './px-data-grid-date-renderer.js';
import './px-data-grid-number-renderer.js';
import './px-data-grid-cell-content-wrapper.js';
import './px-data-grid-filter.js';
import './px-data-grid-filters-modal.js';
import './px-data-grid-filters-preview.js';
import './px-data-grid-sorter.js';
import './px-data-grid-action-column.js';
import './px-data-grid-edit-column.js';
import { DataGridFilterableMixin } from './px-data-grid-filterable-mixin.js';
import './css/px-data-grid-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { Grid } from 'vaadin-grid/vaadin-grid-data-provider-mixin.js';
import { Base } from '@polymer/polymer/polymer-legacy.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { idlePeriod } from '@polymer/polymer/lib/utils/async.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
{
  /**
   * `<px-data-grid>` - Predix UI component which defines a data grid.
   *
   * @mixes Predix.DataGridFilterableMixin
   */
  class DataGridElement extends DataGridFilterableMixin(
    mixinBehaviors([AppLocalizeBehavior], PolymerElement)
  ) {
    static get template() {
      return html`
    <style include="px-data-grid-styles"></style>

    <template is="dom-if" if="{{_showActionBar(autoFilter, hideActionMenu, hideColumnFilter, filterable)}}">

      <div class="action-bar">
        <template is="dom-if" if="[[autoFilter]]">
          <px-auto-filter-field placeholder="[[localize('Search Table')]]" on-filter-change="_autoFilterChanged" value="{{_autoFilterValue}}">
          </px-auto-filter-field>
        </template>

        <div class="action-bar__right">
          <template is="dom-if" if="[[filterable]]">
            <px-data-grid-filters-modal filters="{{_filters}}" columns="[[columns]]" localize="[[_boundedLocalize]]" offer-filter-saving="[[offerFilterSaving]]" initial-filter-state="[[_initialFilterState]]" compact-mode="[[compactAdvancedFilterDialog]]" disable-all-columns-filter="[[disableAllColumnsFilter]]" string-comparators="[[stringComparators]]" number-comparators="[[numberComparators]]">
            </px-data-grid-filters-modal>
          </template>

          <template is="dom-if" if="[[!hideColumnFilter]]">
            <px-dropdown class="px-data-grid-column-selector" multi="" allow-outside-scroll="" display-value="[[_columnSelectorLabel]]" items="[[_columnSelectorContent]]" selected-values="[[_selectedActionItems]]" disable-clear="" hide-selected="" on-px-dropdown-click="_actionClicked">
            </px-dropdown>
          </template>

          <template is="dom-if" if="[[_actionMenuShown]]">
            <px-dropdown class="px-data-grid-action-menu" allow-outside-scroll="" display-value="[[localize('Actions')]]" items="[[_actionMenuContent]]" disable-clear="" on-px-dropdown-click="_actionClicked">
            </px-dropdown>
          </template>
        </div>

      </div>
    </template>

    <px-data-grid-filters-preview filters="[[_filters]]" columns="[[columns]]" localize="[[_boundedLocalize]]" on-trigger-filters-modal="_openAdvancedFilter">
    </px-data-grid-filters-preview>

    <vaadin-grid size="[[size]]" data-provider="[[_currentDataProvider]]" active-item="[[activeItem]]" column-reordering-allowed="[[_isColumnReorderingAllowed(columnReorderingAllowed,_groupByColumn)]]" expanded-items="[[expandedItems]]" striped\$="[[_isStriped(striped,_groupByColumn)]]" selected-items="{{selectedItems}}" multi-sort="[[multiSort]]" item-id-path="{{itemIdPath}}" page-size="{{pageSize}}" auto-height\$="[[_isAutoHeight(gridHeight)]]" loading="{{_loading}}">

      <template is="dom-if" if="[[_isSelectable(selectionMode)]]" restamp="">
        <px-data-grid-selection-column frozen="" auto-select="" hidden="[[hideSelectionColumn]]" multi-select="[[_isMultiSelect(selectionMode)]]" tree-grid="[[_groupByColumn]]" allow-sort-by-selection="[[allowSortBySelection]]">
        </px-data-grid-selection-column>
      </template>

      <template is="dom-if" if="[[_rowDetails]]" restamp="">
        <px-data-grid-toggle-details-column frozen="">
        </px-data-grid-toggle-details-column>
      </template>

      <template is="dom-repeat" items="[[columns]]" as="column" restamp="">
        <px-data-grid-column name="[[column.name]]" path="[[column.path]]" hidden="[[column.hidden]]" localize="[[_boundedLocalize]]" type="[[column.type]]" frozen="[[_undefinedToFalse(column.frozen)]]" resizable="[[_checkColumnResizable(resizable, column.resizable)]]" mapped-object="[[column]]" width="[[_getColumnWidth(column)]]" flex-grow="[[_getColumnFlexGrow(column)]]" on-column-change="_onColumnUpdate" group-by-column-allowed="[[_groupByColumnAllowed(_hasLocalDataProvider, _expandableRows)]]" is-data-column="true">
          <template class="header">
            <px-data-grid-sorter path="[[_resolveColumnPath(column)]]">[[resolveColumnHeader(column)]]</px-data-grid-sorter>
          </template>

          <template>

            <dom-if if="[[_isGroupedByColumn(column, _groupByColumn)]]">
              <template>
                <vaadin-grid-tree-toggle leaf="[[!item.hasChildren]]" expanded="{{expanded}}" level="[[level]]">
                  <template is="dom-if" if="[[item.hasChildren]]">
                    <template is="dom-if" if="[[!expanded]]">
                      <px-icon icon="px-utl:chevron-right"></px-icon>
                    </template>
                    <template is="dom-if" if="[[expanded]]">
                      <px-icon icon="px-utl:chevron"></px-icon>
                    </template>
                  </template>
                  <px-data-grid-cell-content-wrapper focus-target="" cell-color="[[_resolveCellColor(item, column, _highlightEntities.*)]]" item="{{item}}" column="[[column]]" localize="[[_boundedLocalize]]">
                  </px-data-grid-cell-content-wrapper>
                </vaadin-grid-tree-toggle>
              </template>
            </dom-if>

            <dom-if if="[[!_isGroupedByColumn(column, _groupByColumn)]]">
              <template>
                <px-data-grid-cell-content-wrapper focus-target="" cell-color="[[_resolveCellColor(item, column, _highlightEntities.*, _editingItem)]]" item="{{item}}" column="[[column]]" localize="[[_boundedLocalize]]">
                </px-data-grid-cell-content-wrapper>
              </template>
            </dom-if>
          </template>
        </px-data-grid-column>
      </template>

      <vaadin-grid-column-group>
        <template is="dom-if" if="[[_offerEditColumn(editable)]]" restamp="">
          <px-data-grid-edit-column editted-item="[[_editingItem]]" edit-mode="[[editable]]" edit="[[_boundedEditItem]]" cancel="[[_boundedCancelEdit]]">
          
        </px-data-grid-edit-column></template>

        <template is="dom-if" if="[[_offerActionColumn(editable, itemActions, _editingItem)]]" restamp="">
          <px-data-grid-action-column item-actions="[[itemActions]]" editted-item="[[_editingItem]]" edit-mode="[[editable]]" save="[[_boundedSaveItem]]">
          
        </px-data-grid-action-column></template>
      </vaadin-grid-column-group>
    </vaadin-grid>

    <px-spinner size="40" hidden\$="[[_spinnerHidden]]"></px-spinner>
`;
    }

    static get is() {
      return 'px-data-grid';
    }

    static get properties() {
      return {
        /**
         * Data for the table to display.
         *
         * Pass an array of objects. Each object will be rendered as a row
         * in the grid. The objects should share many of the same keys.
         * Each key will be used to group data into columns.
         *
         * Use the `columns` property to control which keys are displayed
         * to the user and which are not, and to control how the grid
         * handles the data for each column. By default if no `columns` are
         * defined the grid will automatically create columns from all of
         * the keys found in the first object.
         *
         * Example data:
         *
         * ```
         * [
         *   {
         *     first: 'Elizabeth',
         *     last: 'Wong',
         *     email: 'sika@iknulber.cl'
         *   },
         *   {
         *     first: 'Jeffrey',
         *     last: 'Hamilton',
         *     email: 'cofok@rac.be'
         *   },
         *   {
         *     first: 'Alma',
         *     last: 'Martin',
         *     email: 'dotta@behtam.la'
         *   }
         * ]
         * ```
         */
        tableData: {
          type: Array,
          notify: true
        },

        /**
         * Set to hide the selection checkbox for each row.
         *
         * By default, if the `selectionMode` property is set to `'single'`
         * or `'multi'` the grid shows a checkbox/radio button the user
         * can click to select or deselect a row. When this property is
         * enabled, the checkbox is hidden and the user can click directly
         * on row contents to select or deselect a row.
         */
        hideSelectionColumn: {
          type: Boolean,
          value: false
        },

        /**
         * Array of selected items. Automatically updated by the grid when
         * the user selects items. Each item will be a reference to the
         * `tableData` item that was passed to render the row.
         *
         * Add references to `tableData` items to programmatically select
         * items from your application.
         */
        selectedItems: {
          type: Array,
          value: () => [],
          notify: true
        },

        // @TODO: Improve docs for size
        /**
         * The total number of items
         */
        size: {
          type: Number,
          value: undefined
        },

        /**
         * The number of items fetched during each request to the
         * `remoteDataProvider`. See the `remoteDataProvider` property
         * for more information.
         */
        pageSize: {
          type: Number,
          value: undefined
        },

        /**
         * Set to `true` to allow the user to sort by multiple columns at
         * the same time.
         */
        multiSort: {
          type: Boolean,
          value: false
        },

        /**
         * Sets the current selection mode for the grid. Valid modes are:
         *
         *   * `'none'` - User can't select any rows
         *   * `'single'` - User can select one row at a time
         *   * `'multi'` - User can select multiple rows at the same time
         */
        selectionMode: {
          type: String,
          value: 'none',
          observer: '_selectionModeChanged'
        },

        // @TODO: Improve docs for activeItem
        /**
         * The item user has last interacted with. Turns to `null` after user deactivates
         * the item by re-interacting with the currently active item.
         */
        activeItem: {
          type: Object,
          notify: true,
          value: null
        },

        /**
         * Set to `true` to allow the user to resize columns.
         */
        resizable: {
          type: Boolean,
          value: false
        },

        /**
         * Set to allow users to edit data in the grid. You must also
         * explicitly set the `columns.editable` property to true for each
         * column the user can edit in the grid.
         *
         * When the user starts or stops editing a row the
         * `editing-item-changed` event will be fired. `event.detail.item`
         * will contain a reference to the row being edited.
         *
         * After a user finishes editing a row the `item-edited` event
         * will be fired. `event.detail` will contain information about
         * what the user changed.
         */
        editable: {
          type: Boolean,
          value: false
        },

        /**
         * Set to `true` to allow the user to re-order columns by dragging
         * and dropping them. Can't be combined with some other states like
         * group-by-value.
         */
        columnReorderingAllowed: {
          type: Boolean,
          value: false
        },

        /**
         * An array containing references to the expanded rows.
         *
         * Automatically updated by the grid in the following cases:
         *
         *   * When a `row-details` template is provided to create expandable
         *     rows the grid will add rows to this list when they are
         *     expanded by the user, and remove rows when they are collapsed
         *     by the user.
         *   * When the user groups rows by column the grid will add rows
         *     that the user expands and remove rows the user collapses.
         *
         * Set this value to references to rows to expand or collapse
         * the rows programmatically.
         */
        expandedItems: {
          type: Array,
          value: [],
          notify: true
        },

        /**
         * If set, will remove the "Any column" filter from the Advanced Filter dialog.
         */
        disableAllColumnsFilter: {
          type: Boolean,
          value: false
        },

        /**
         * Automatically set to truthy value when `<template class="row-details">`
         * is distributed in the data grid. Passing a row-details template
         * makes all rows expandable (by adding a chevron icon to the left
         * of the row).
         *
         * When the user expands the row the grid stamps out a new instance
         * of the row-details template and sets `item` in the template's
         * scope to the expanded row.
         *
         * Example of using row-details:
         *
         * ```
         * <px-data-grid table-data='[{ "name": "Elliot" }]'>
         *   <template class="row-details">
         *     <p>This user's name is [[item.name]], in case you were wondering.</p>
         *   </template>
         * </px-data-grid>
         * ```
         */
        _rowDetails: {
          type: Boolean,
          value: false
        },

        /**
         * Set to hide the action menu button displayed at the top right of
         * the grid.
         *
         * If the action menu is hidden, the user will not be able to unhide
         * any hidden columns.
         */
        hideActionMenu: {
          type: Boolean,
          value: false
        },

        /**
         * Computed property that shows the action menu if:
         * - hideActionMenu is false AND
         * - _actionMenuContent has one or more defined actions
         */
        _actionMenuShown: {
          type: Boolean,
          computed: '_showActionMenu(hideActionMenu, _actionMenuContent)'
        },

        /**
         * Defines the columns the grid should render. If no columns are
         * passed, the grid generates columns from the `tableData` passed
         * in. Columns are rendered in the same order as the array.
         *
         * ## `column` options
         *
         * The following options are available for all column types. Only
         * `name` and `path` are required, all others are optional:
         *
         *   * `{string} name` - Human-readable name displayed in the column
         *     header
         *
         *   * `{string} path` - Key used to get the column data from each
         *     of the `tableData` objects
         *
         *   * `{string} id='column.path[column.type]'` - Unique identifier
         *     of the column. By default, px-data-grid will automatically
         *     generate it from `column.path` and `column.type`. There can't
         *     be 2 columns with the same id. The value `-any-` is a
         *     reserved keyword that you cannot use for any column `id`.
         *
         *   * `{string} type=('string'|'number'|'date')` - Type of data
         *     in the column. Used in the advanced filter UI to show
         *     different filter options for each data type. Does not change
         *     the renderer or impact sorting.
         *
         *   * `{string} renderer` - The name of the web component used to
         *     render each cell in the column. There are three built-in
         *     renderers available: `'px-data-grid-string-renderer'` (the
         *     default renderer), `'px-data-grid-number-renderer'`, and
         *     `'px-data-grid-date-renderer'`. You can also create a custom
         *     renderer and use its name here. If no renderer is specified,
         *     the column cannot be edited by the user.
         *
         *   * `{object} rendererConfig` - Settings to pass to the renderer
         *     that change how data is displayed to the user. See the
         *     examples below for information on which options are available
         *     for each built-in renderer.
         *
         * The following options are available for columns of type `date`:
         *
         *   * `{array} dateRanges` - List of pre-defined date ranges that
         *     will appear in advanced filter dropdown for this column.
         *     See the examples below for examples on how to format
         *     each date range.
         *
         * The following options are available for columns of type `number`:
         *
         *   * `{number} minBound` - Defines a minimum bound of a number in
         *     the advanced filter field for this column. If both minBound
         *     and maxBound properties are defined, the advanced filter will
         *     display a slider instead of a condition dropdown.
         *
         *   * `{number} maxBound` - Defines a maximum bound of a number in
         *     the advanced filter field for this column.
         *
         *   * `{boolean} hidden=false` - Hides the column from the user
         *     when the grid is rendered. Automatically updated when the
         *     user shows/hides columns using action menu(s).
         *
         *   * `{boolean} frozen=false` - Freezes the column. When the user
         *     scrolls the grid horizontally frozen columns will not move.
         *     Automatically updated when the user freezes/unfreezes columns
         *     using action menu(s).
         *
         *   * `{boolean} required=false` - Used in renderers during editing.
         *     If the column is required, the user will not be allowed to
         *     enter a blank value.
         *
         *   * `{number} flexGrow=1` - Sets the relative size of the column
         *     compared to other columns in the grid. Equivalent to the CSS
         *     `flex-grow` property.
         *
         *
         * ## `column.dateFormat` options
         *
         * The following options can be set in the `dateFormat` for
         * columns of type `date`. All formats should be set to a valid
         * [moment.js format string](https://momentjs.com/docs/#/parsing/string-format/)
         * or to 'ISO':
         *
         *   * `{string} dateFormat.format='YYYY-MM-DD"T"HH:mm:ss.SSSS'` -
         *     Format used to read the date/timestamp data.
         *
         *   * `{string} dateFormat.timezone='UTC'` -
         *     Timezone used to read the date/timestamp data.
         *
         * Date parsing uses moment's [forgiving mode](https://momentjs.com/guides/#/parsing/forgiving-mode/), which can produce
         * silent but highly undesirable parsing errors if the date format does not match the source data.
         * If your source data is formatted differently to ISO8601, it is critical that you
         * configure the `format` property correctly.
         *
         * ## `column.rendererConfig` options
         *
         * The following options can be set in the `rendererConfig` for
         * columns of type `date`. All formats should be set to a valid
         * [moment.js format string](https://momentjs.com/docs/#/parsing/string-format/)
         * or to 'ISO':
         *
         *   * `{string} rendererConfig.displayFormat='YYYY-MM-DD HH:mm:ss'` -
         *     Format used to display the date/timestamp for the user.
         *
         *   * `{string} rendererConfig.timezone='UTC'` -
         *     Timezone used to display the date/timestamp for the user.
         *
         *   * `{string} rendererConfig.datePickerDateFormat='YYYY-MM-DD'` -
         *     Format used for the px-datetime-picker date when the user
         *     edits cells in the column.
         *
         *   * `{string} rendererConfig.datePickerTimeFormat='HH:MM:SS'` -
         *     Format used for the px-datetime-picker time when the user
         *     edits cells in the column.
         *
         *   * `{boolean} rendererConfig.hideDate=false` - Hides the date
         *     section of the px-datetime-picker when the user edits cells
         *     in the column.
         *
         *   * `{boolean} rendererConfig.hideTime=true` - Hides the time
         *     section of the px-datetime-picker when the user edits cells
         *     in the column.
         *
         * The following options can be set in the `rendererConfig` for
         * columns of type `number`:
         *
         *   * `{?string} rendererConfig.displayFormat=null` - Format used to
         *     display numbers in this column. Set to a valid
         *     [numbro.js format string](http://numbrojs.com/format.html).
         *     Set to `null` to display the number exactly as it appears
         *     in the `tableData` by coercing it to string.
         *
         *   * `{string} rendererConfig.displayCulture='en-US'` - Changes the
         *     way numbers in this column are displayed to the user by
         *     localizing to get the correct format for commas, decimals,
         *     etc. See [numbro.js languages](http://numbrojs.com/languages.html)
         *     for a list of valid options.
         *
         *   * `{boolean} rendererConfig.displayIsCurrency=false` - Set to
         *     `true` if the data in this column should be formatted as
         *     currency. Will use `rendererConfig.displayFormat` to figure
         *     out how to display the currency, or fall back to a localized
         *     default based on `rendererConfig.displayCulture`.
         *
         *   * `{string} displayZeroFormat` - Used to format numbers equal
         *     to `0` in this column. See [numbro.js docs](http://numbrojs.com/format.html)
         *     for a list of valid options.
         *
         * ## Examples
         *
         * Example format for a single column with all configurations used:
         *
         * ```javascript
         * {
         *   id: 'first[string]',
         *   name: 'First Name',
         *   path: 'first',
         *   type: 'string',
         *   renderer: 'px-data-grid-string-renderer',
         *   rendererConfig: {
         *     customInfo: 'some info',
         *     customInfo2: 42
         *   },
         *   dateRanges: [
         *     {
         *       name: 'Last 7 days',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(7, 'd').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'Fixed range',
         *       range: {
         *         dateTo: '1996-11-10',
         *         dateFrom: '1985-12-19'
         *       }
         *     }
         *   ],
         *   minBound: 1,
         *   maxBound: 10,
         *   hidden: false,
         *   frozen: false,
         *   required: false,
         *   flexGrow: 1
         * }
         * ```
         *
         * Example format for column of type `date` with custom `dateRanges`:
         *
         * ```javascript
         * {
         *   name: 'Birth date',
         *   path: 'birth_date',
         *   type: 'date',
         *   editable: true,
         *   renderer: 'px-data-grid-date-renderer',
         *   dateFormat: {
         *     format: 'YYYY-MM-DD HH:mm:ss',
         *     timezone: 'UTC'
         *   },
         *   rendererConfig: {
         *     displayFormat: 'MM/DD/YYYY HH:mm',
         *     timezone: 'America/Los_Angeles',
         *     datePickerDateFormat: 'MM/DD/YYYY',
         *     datePickerTimeFormat: 'HH:mm'
         *   },
         *   dateRanges: [
         *     {
         *       name: 'Last 7 days',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(7, 'd').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'Last 14 days',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(14, 'd').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'This month',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(31, 'd').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'Last month',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').subtract(1, 'M').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(2, 'M').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'Fixed range',
         *       range: {
         *         dateTo: '1996-11-10',
         *         dateFrom: '1985-12-19'
         *       }
         *     }
         *   ]
         * }
         * ```
         */
        columns: {
          type: Array,
          value: () => [],
          observer: '_columnsChanged'
        },

        /**
         * Copy of last columns value received, to be used with reset layout
         */
        _lastColumnsReceived: {
          type: Array,
          value: () => []
        },

        /**
         * Content of action menu
         */
        _actionMenuContent: {
          type: Array
        },

        /**
         * Content of column selector menu
         */
        _columnSelectorContent: {
          type: Array
        },

        /**
         * Label of column selector menu
         */
        _columnSelectorLabel: {
          type: String,
          computed: '_computeColumnSelectorLabel(_selectedActionItems)'
        },

        /**
         * A valid IETF language tag as a string that `app-localize-behavior`
         * will use to localize this component.
         *
         * See https://github.com/PolymerElements/app-localize-behavior for
         * API documentation and more information.
         */
        language: {
          type: String,
          value: 'en'
        },

        /**
         * Use the key for localization if value for that language is missing.
         * Should always be true for Predix components.
         */
        useKeyIfMissing: {
          type: Boolean,
          value: true
        },

        /**
         * Library object of hardcoded strings used in this application.
         * Used by `app-localize-behavior` in conjunction with `language`.
         */
        resources: {
          type: Object,
          value: () => {
            // can also load these from external file as shown here:
            // https://www.polymer-project.org/2.0/toolbox/localize
            return {
              'en': {
                'Actions': 'Actions',
                'column selected': 'column selected',
                'columns selected': 'columns selected',
                'Freeze column': 'Freeze Column',
                'Unfreeze column': 'Unfreeze Column',
                'Group by column': 'Group by Column',
                'Ungroup': 'Ungroup',
                'Hide column': 'Hide Column'
              },
              'fr': {
                'Actions': 'Actions',
                'Value is required': 'Pakollinen arvo'
              },
              'fi': {
                'Actions': 'Toiminnot',
                'Hide column': 'Piilota sarake'
              }
            };
          }
        },

        /**
         * A list of custom actions that are shown when the user taps the
         * action menu button at the top right of the grid. If the
         * `hideActionMenu` property is enabled the action menu won't be
         * shown to the user.
         *
         * Each array entry should be an object with the following properties:
         *
         *   * `{string} name` - Label shown in the action menu, should
         *     prompt the user to do something (e.g. "Export CSV")
         *   * `{string} id` - Unique identifier that will be included in the
         *     event fired when the user taps an action in the menu
         *   * `{string} icon` - Optional icon to show in the dropdown menu.
         *     Refer to px-icon-set for list of available icons.
         *
         * When the user taps an action in the menu the grid will fire the
         * `table-action` event. `event.detail.id` will be the action ID.
         *
         * Example actions:
         *
         * ```javascript
         * [
         *   {
         *     name: 'Export CSV',
         *     id: 'CSV',
         *     icon: 'px-doc:document-csv'
         *   }
         *   {
         *     name: 'Export Excel',
         *     id: 'Excel',
         *     icons: 'px-doc:document-xls'
         *   }
         * ]
         * ```
         */
        tableActions: {
          type: Array,
          value: [],
          observer: '_updateActionMenu'
        },

        /**
         * Set to `true` to allow the user to hide the column filter/selector in
         * the action menu.
         */
        hideColumnFilter: {
          type: Boolean,
          value: false
        },

        /**
         * A list of custom actions that are shown in the actions menu
         * for each data row. The action menu button appears to the right
         * of each row when the user hovers over the row.
         *
         * Each array entry should be an object with the following properties:
         *
         *   * `{string} name` - Label shown in the action menu, should
         *     prompt the user to do something (e.g. "Add Row After")
         *   * `{string} id` - Unique identifier that will be included in the
         *     event fired when the user taps an action in the menu
         *   * `{string} icon` - Optional icon to show in the dropdown menu.
         *     Refer to px-icon-set for list of available icons.
         *
         * When the user taps an action in the menu the grid will fire the
         * `item-action` event. `event.detail.id` will be the action ID and
         * `event.detail.item` will be a reference to the row the user
         * took action on (from `tableData`).
         *
         * Example actions:
         *
         * ```javascript
         * [
         *   {
         *     name: 'Add Row After',
         *     id: 'add-after',
         *     icon: 'px-nav:add-row-below'
         *   }
         *   {
         *     name: 'Delete Row',
         *     id: 'delete',
         *     icon: 'px-nav:delete-row'
         *   }
         * ]
         * ```
         */
        itemActions: {
          type: Array,
          value: []
        },

        /**
         * Function that provides items lazily. Receives arguments `params`, `callback`:
         *
         * `params.page` Requested page index
         *
         * `params.pageSize` Current page size
         *
         * `params.filters` Currently applied filters
         *
         * `params.sortOrders` Currently applied sorting orders
         *
         * `params.parentItem` When expandable table is used, and sublevel items
         * are requested, reference to parent item of the requested sublevel.
         * Otherwise `undefined`.
         *
         * `callback(items, size)` Callback function with arguments:
         *   - `items` Current page of items
         *   - `size` Total number of items.
         *
         * `<px-data-grid>` calls this function lazily, only when it needs more data
         * to be displayed.
         *
         * __Also, note that when using function data providers, the total number of items
         * needs to be set manually. The total number of items can be returned
         * in the second argument of the data provider callback:__
         *
         * ```javascript
         * pxDataGrid.dataProvider = function(params, callback) {
         *   var url = 'https://api.example/data' +
         *       '?page=' + params.page +        // the requested page index
         *       '&per_page=' + params.pageSize; // number of items on the page
         *   var xhr = new XMLHttpRequest();
         *   xhr.onload = function() {
         *     var response = JSON.parse(xhr.responseText);
         *     callback(
         *       response.employees, // requested page of items
         *       response.totalSize  // total number of items
         *     );
         *   };
         *   xhr.open('GET', url, true);
         *   xhr.send();
         * };
         * ```
         *
         * __Alternatively, you can use the `size` property to set the total number of items:__
         *
         * ```javascript
         * pxDataGrid.size = 200; // The total number of items
         * pxDataGrid.dataProvider = function(params, callback) {
         *   var url = 'https://api.example/data' +
         *       '?page=' + params.page +        // the requested page index
         *       '&per_page=' + params.pageSize; // number of items on the page
         *   var xhr = new XMLHttpRequest();
         *   xhr.onload = function() {
         *     var response = JSON.parse(xhr.responseText);
         *     callback(response.employees);
         *   };
         *   xhr.open('GET', url, true);
         *   xhr.send();
         * };
         * ```
         */
        remoteDataProvider: {
          type: Function,
          observer: '_remoteDataProviderChanged'
        },

        _currentDataProvider: {
          type: Function
        },

        /**
         * Automatically set to `true` when a row-details template is
         * found and rows are expandable.
         */
        _expandableRows: {
          type: Boolean,
          value: false
        },

        /**
         * Set to add a background color to every other row in the grid.
         * Can make it easier for users to scan across long rows. Striping
         * is disabled in group-by-column mode.
         */
        striped: {
          type: Boolean,
          value: false
        },

        /**
         * Set to show an ellipsis and truncate text for columns where the
         * text doesn't fit in the column.
         *
         * Do not enable wrap mode while ellipsis mode is enabled.
         */
        ellipsis: {
          type: Boolean,
          value: false,
          observer: '_ellipsisModeChanged'
        },

        /**
         * Shows if there is any pending request for remote data.
         */
        _loading: {
          type: Boolean,
          value: false,
          observer: '_loadingChanged'
        },

        _spinnerHidden: {
          type: Boolean,
          value: true
        },

        /**
         * Number of milliseconds to wait before showing the loading spinner
         * when requesting new data from the `remoteDataProvider`.
         */
        loadingSpinnerDebounce: {
          type: Number,
          value: 500
        },

        /**
         * Set to `true` to enable simple filtering. When enabled, a search
         * box will be shown at the top of the grid. The user can type
         * in the search box to hide rows that don't include the stringified
         * value they're looking for. The grid will search all columns and
         * treat all column types as strings for matching purposes.
         *
         * See `filterable` property for a more advanced filter option.
         */
        autoFilter: {
          type: Boolean,
          value: false
        },

        /**
         * List of rules used to highligh specific columns, rows, or cells.
         *
         * Pass an array of objects. Each object should have the following
         * properties:
         *
         *   * `{string} type` - If the highlight condition returns `true`,
         *     the type determines what the grid will highlight. Set to
         *     `'cell'` to highlight only the cell that passed the highlight
         *     rule, `'row'` to highlight the row that holds the matching
         *     cell, or `'column'` to highlight the column that holds the
         *     matching cell.
         *   * `{Function} condition` - Function that will be called by the
         *     grid for each cell. If the function returns `true`, the
         *     highlight rule will be triggered. If the function returns a
         *     falsey value, the highlight rule will not be used. The function
         *     will be passed three arguments: `cellContent` containing
         *     the text of the cell, `column` containing a reference to the
         *     `columns` object for the cell's column, and `item` as a reference
         *     to the `tableData` item used to create the cell's row.
         *   * `{string} color` - A valid CSS color (e.g. hex code or color
         *     name). If the highlight condition returns `true`, the color
         *     will be used to set the background color of the matching
         *     cell, column, or row.
         *
         * Example highlight rules:
         *
         * ```javascript
         * [
         *   {
         *     type: 'cell',
         *     condition: (cellContent, column, item) => { return cellContent == 'John Doe' },
         *   },
         *   {
         *     type: 'row',
         *     condition: (cellContent, item) => { return cellContent[0] == 'a' },
         *     color: '#a8a8a8'
         *   },
         *   {
         *     type: 'column',
         *     condition (column, item) => { return column.name == 'age' },
         *     color: 'pink'
         *   }
         * ]
         * ```
         */
        highlight: {
          type: Array,
          value: () => []
        },

        /**
         * Concatenated array from user's highlights and filter's
         */
        _highlightEntities: {
          type: Array,
          value: () => []
        },

        /**
         * When true data provider is local, when false external (remote) and
         * when undefined it defined yet.
         */
        _hasLocalDataProvider: {
          type: Boolean
        },

        /**
         * Default width for columns. Defaults to `100px` if undefined.
         *
         * Column sizes should also be configured using the
         * `defaultColumnFlexGrow` and `columns.flexGrow` properties to
         * change how each column sizes itself relative to other columns in
         * the grid.
         *
         * When column flex-grow properties are set to non-zero values,
         * this size behaves as a minimum width for the column.
         */
        defaultColumnWidth: {
          type: String,
          value: '100px'
        },

        /**
         * Default flex-grow value for columns if none is defined in
         * `columns.flexGrow`. Equivalent to the CSS flex-grow property.
         */
        defaultColumnFlexGrow: {
          type: Number,
          value: 1
        },

        _selectedActionItems: {
          type: Array,
          value: []
        },

        _groupByColumn: {
          type: Object,
          value: false
        },

        /**
         * Defines the height of grid.
         *
         *   * Set to `'auto'` if the grid should grow to fit all of its rows
         *   * Set to `'default'` or undefined to use the default height
         *   * Set to any other valid CSS height valid (e.g. `400px`) to
         *     define a static height for the grid area inside the
         *     px-data-grid. This height will not include the table action
         *     menu and other elements of the grid.
         *
         * See the `flexToSize` property for a different strategy that sizes
         * the grid based on its parent element's height.
         */
        gridHeight: {
          type: String,
          reflectToAttribute: true,
          observer: '_gridHeightChanged'
        },

        /**
         * Set to `true` to instruct the grid to fill its parent element's
         * height and width using flexbox. When enabled the px-data-grid
         * element will fill 100% of the available height of its parent.
         * To constrain the grid's height, set the CSS variable
         * `--px-data-grid-height` to a different value.
         */
        flexToSize: {
          type: Boolean,
          value: false,
          reflectToAttribute: true
        },

        /**
         * Path to a `tableData` item sub-property that serves as a unique
         * identifier for the item. Should be defined if the grid allows
         * user editing so the grid can pair new versions of each item
         * with the original data.
         *
         * Path must be unique for each item, must exist for every item,
         * and should not be changed or be user editable.
         */
        itemIdPath: {
          type: String
        },

        /**
         * Set to allow users to save filters created in the advanced filter
         * dialog. If enabled, the grid will fire `save-filters` events when
         * the user taps the save filter button.
         */
        offerFilterSaving: {
          type: Boolean,
          value: false
        },

        /**
         * Set to `true` to allow the user to sort by selected items.
         * When enabled the user can click on the selected item count
         * at the top left of the grid to sort by selection.
         */
        allowSortBySelection: {
          type: Boolean,
          value: false
        },

        /**
         * Set to `true` to instantly re-sort all rows when any changes
         * are made in multi-selection and sort-by-selection modes.
         */
        instantSortWhenSelection: {
          type: Boolean,
          value: false
        },

        /**
         * Set to `true` to render the advanced filtering UI modal in space
         * saving mode (e.g. with reuseable headers).
         */
        compactAdvancedFilterDialog: {
          type: Boolean,
          value: true
        },

        /**
         * Comparison options shown in the advanced filtering UI for columns
         * of type `string`. Valid options are:
         *
         *   * `'equals'`
         *   * `'not_equal'`
         *   * `'contains'`
         *   * `'not_contains'`
         *   * `'starts_with'`
         *   * `'ends_with'`
         *   * `'wildcard'`
         *
         * If this array is undefined or empty, all options will be shown.
         */
        stringComparators: {
          type: Array
        },

        /**
         * Comparison options shown in the advanced filtering UI for columns
         * of type `number`. Valid options are:
         *
         *   * `'less_than'`
         *   * `'equals'`
         *   * `'not_equal'`
         *   * `'equal_or_greater_than'`
         *   * `'equal_or_less_than'`
         *   * `'greater_than'`
         *
         * If this array is undefined or empty, all options will be shown.
         */
        numberComparators: {
          type: Array
        },

        /**
         * Stores item, that is currently in edit mode.
         */
        _editingItem: {
          type: Object,
          value: null,
          observer: '_editingItemObserver'
        },

        /**
         * Stores all renderer elements for item, that is currently in edit mode.
         */
        _editingRenderers: {
          type: Array,
          value: () => []
        },

        _boundedLocalize: Function,

        _autoFilterValue: {
          type: String
        }
      };
    }

    static get observers() {
      return [
        '_highlightsObserver(highlight, _filterHighlights, highlight.*, _filterHightlights.*)',
        '_localizeChanged(localize)',
        '_tableDataChanged(tableData, tableData.*, isAttached)',
        '_setColumnId(columns, columns.*)',
        '_selectedItemsChanged(selectedItems.*)'
      ];
    }

    /**
     * Forces the grid to read each of the `columns` objects and update
     * each column based on any changed configurations.
     *
     * Use this if you mutate your `columns` property in your app and
     * want the data grid to update to reflect the new configurations.
     */
    updateColumns() {
      const probs = ['hidden', 'name', 'frozen', 'width', 'flexGrow', 'path'];
      for (let i = 0; i < this.columns.length; ++i) {
        const prefix = 'columns.' + i + '.';
        probs.forEach(prob => {
          const path = prefix + prob;
          this.notifyPath(path);
        });
      }
    }

    constructor() {
      super();
      this._observer = new FlattenedNodesObserver(this, info => {
        this._checkRowDetailsTemplate(info.addedNodes);
      });
    }

    _checkRowDetailsTemplate(nodes) {
      const rowDetailsTemplate = nodes.filter(node => {
        return node.localName && node.localName === 'template' && node.className && node.className.indexOf('row-details') !== -1;
      });
      this._rowDetails = rowDetailsTemplate.length;
      if (this._rowDetails) {
        this._expandableRows = true;
        this._vaadinGrid._rowDetailsTemplate = rowDetailsTemplate[0];

        const templatizer = new Grid.Templatizer();
        templatizer._grid = this._vaadinGrid;
        templatizer.dataHost = this._vaadinGrid.dataHost;
        templatizer.template = this._vaadinGrid._rowDetailsTemplate;
        this._vaadinGrid._rowDetailsTemplate.templatizer = templatizer;
      }
    }

    ready() {
      super.ready();

      this._vaadinGrid = this.shadowRoot.querySelector('vaadin-grid');
      this._vaadinGrid._pxDataGrid = this;
      this._vaadinGrid.addEventListener('px-sorter-changed', this._onPxSorterChanged);

      // Attach scroll listener for styling
      this._boundedScrollListener = this._scrollListener.bind(this);
      this._vaadinGrid.$.outerscroller.addEventListener('scroll', this._boundedScrollListener);

      // Override selectItem method to allow easy single select handling
      this._vaadinGrid.selectItem = (item) => this._handleSelectItem(item);

      // Override getItemId to allow group by
      this._boundedGetItemId = this._gridGetItemId.bind(this);
      this._vaadinGrid.getItemId = this._boundedGetItemId;

      this.addEventListener('column-froze', (event) => this._handleColumnFreeze(event));

      this.addEventListener('column-unfroze', (event) => this._handleColumnUnfreeze(event));

      this.addEventListener('group-by-column', (event) => {
        if (this._groupByColumn) {
          this._ungroup();
        }
        this._moveColumnToLeft(event.detail.column);
        this._groupByColumn = event.detail.column;
        this._vaadinGrid.clearCache();
        this._vaadinGrid.setAttribute('tree-grid', true);
      });

      this.addEventListener('ungroup', (event) => {
        this._ungroup();
      });

      this.addEventListener('item-save', () => {
        if (this._groupByColumn) {
          this._vaadinGrid.clearCache();
        }
      });

      this._boundedCancelEdit = this._cancelEdit.bind(this);
      this._boundedSaveItem = this._saveItem.bind(this);
      this._boundedEditItem = this._setEditingItem.bind(this);

      document.addEventListener('renderer-editing-changed', (event) => {
        const renderer = event.detail.renderer;
        if (renderer._editing) {
          this._editingRenderers.push(renderer);
        } else {
          this._editingRenderers.splice(this._editingRenderers.indexOf(renderer), 1);
        }
      });

      // Safari needs a little help with showing the edit and action buttons on hover.
      if (this._vaadinGrid._safari) {
        const tbodyelement = this._vaadinGrid.$.table.querySelector('#items');
        tbodyelement.addEventListener('mouseover', this._onRowHoverEvent.bind(this));
        tbodyelement.addEventListener('mouseout', this._onRowUnhoverEvent.bind(this));
      }
    }

    _onRowHoverEvent(event) {
      let searchElement = event.target.offsetParent;
      while (searchElement) {
        if (searchElement.tagName && searchElement.tagName.toLowerCase() == 'tr') {
          searchElement.classList.add('safari-hover');
          this.lastColumnWithSafariStyleForHover = searchElement;
          break;
        }
        searchElement = searchElement.offsetParent;
      }
    }

    _onRowUnhoverEvent(event) {
      if (this.lastColumnWithSafariStyleForHover) {
        this.lastColumnWithSafariStyleForHover.classList.remove('safari-hover');
      }
    }

    _ungroup() {
      this._groupByColumn = false;
      this._vaadinGrid.clearCache();
      this._vaadinGrid.removeAttribute('tree-grid');
    }

    _resolveLastFrozenColumnIndex() {
      let lastColumnFrozen = undefined;

      const columns = this._getColumns();

      for (let i = 0; i < columns.length; ++i) {
        if (columns[i].frozen) {
          lastColumnFrozen = i;
        }
      }

      return lastColumnFrozen;
    }

    _columnSanityCheck() {
      const lastColumnFrozen = this._resolveLastFrozenColumnIndex();

      if (lastColumnFrozen !== undefined) {
        const columns = this._getColumns();
        const lastFrozenColumn = columns[lastColumnFrozen];

        if (lastColumnFrozen > 0) {
          for (let i = 0; i < lastColumnFrozen; ++i) {
            if (!columns[i].frozen) {
              columns[i].frozen = true;
              if (columns[i].mappedObject) {

                columns[i].mappedObject.frozen = true;
              }
            }
          }
        }

        columns.forEach(c => c._lastFrozenChanged(c === lastFrozenColumn));
      }
    }

    // put frozen column to the beginning (in the place of the first data column)
    _handleColumnFreeze(event) {
      const column = event.detail.column;
      this._moveColumnToLeft(column);
    }

    _moveColumnToLeft(column) {
      const columns = this._getColumns();
      const columnId = column.mappedObject ? column.mappedObject.id : undefined;

      if (columnId === undefined) {
        console.warn('Failed to resolve column ID of frozen column');
        return;
      }

      let firstDataColumnIndex = 0;
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].isDataColumn && columns[i] !== this._groupByColumn) {
          firstDataColumnIndex = i;
          break;
        }
      }

      let targetColumnIndex = 0;
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].isDataColumn) {
          const columnObj = columns[i].mappedObject;
          if (columnObj && columnObj.id === columnId) {
            targetColumnIndex = i;
            break;
          }
        }
      }

      this._vaadinGrid.insertBefore(columns[targetColumnIndex], columns[firstDataColumnIndex]);
    }

    _handleColumnUnfreeze(event) {
      const lastFrozen = this._getColumns().filter((column) => column._lastFrozen)[0];
      if (lastFrozen) {
        this._vaadinGrid.insertBefore(event.detail.column, lastFrozen.nextSibling);
      }
    }

    _doInstantSortAfterSelect() {
      return this.instantSortWhenSelection
        && this.allowSortBySelection
        && Array.from(this._vaadinGrid._sorters)
          .map(s => s.path)
          .filter(p => p === '--selection--').length > 0;
    }

    _selectedItemsChanged(selectedItems) {
      // Cause resort if ready and asked to instantly re-sort
      if (this._vaadinGrid && this._doInstantSortAfterSelect()) {
        this._vaadinGrid.clearCache();
      }
    }

    _groupByColumnAllowed(hasLocalDataProvider, expandableRows) {
      return hasLocalDataProvider && !expandableRows;
    }

    /**
     * Trick to prevent multiselection when in single select mode
     */
    _handleSelectItem(item) {
      if (!this._vaadinGrid._isSelected(item)) {
        if (!this._isMultiSelect()) {
          this._vaadinGrid.pop('selectedItems');
        }
        this._vaadinGrid.push('selectedItems', item);
      }
    }

    _getValue(column, item) {
      if (column && item) {
        return this.get(column.path, item);
      } else {
        return undefined;
      }
    }

    _getColumnWidth(column) {
      return column.width ? column.width : this.defaultColumnWidth;
    }

    _getColumnFlexGrow(column) {
      return column.flexGrow === undefined ? this.defaultColumnFlexGrow : column.flexGrow;
    }

    _resolveCellColor(item, column) {
      if (!this._highlightEntities || item === undefined) {
        return undefined;
      }

      let columnColor;
      let rowColor;
      let cellColor;

      this._highlightEntities.forEach((highlightEntity) => {
        if (highlightEntity.type === 'row') {
          if (this._isRowConditionApplied(item, highlightEntity.condition)) {
            if (highlightEntity.color) {
              rowColor = highlightEntity.color;
            } else {
              rowColor = 'default';
            }
          }
        } else if (highlightEntity.type === 'column') {
          if (this._isColumnConditionApplied(column, highlightEntity.condition)) {
            if (highlightEntity.color) {
              columnColor = highlightEntity.color;
            } else {
              columnColor = 'default';
            }
          }
        } else {
          const value = this._getValue(column, item);
          if (highlightEntity.condition(value, column, item)) {
            if (highlightEntity.color) {
              cellColor = highlightEntity.color;
            } else {
              cellColor = 'default';
            }
          }
        }
      });

      const finalColor = cellColor ? cellColor : (rowColor ? rowColor : (columnColor ? columnColor : undefined));
      return finalColor;
    }

    _isRowConditionApplied(item, condition) {
      return !!this.columns.filter(column => {
        const cellText = this.get(column.name, item);
        return condition(cellText, item);
      }).length;
    }

    _isColumnConditionApplied(column, condition) {
      const cachedItems = this._vaadinGrid._cache.items;
      const itemsArray = Object.keys(cachedItems).map(key => cachedItems[key]);

      return !!itemsArray.filter(item => {
        return condition(column, item);
      }).length;
    }

    _tableDataChanged(tableData, splices, isAttached) {
      if (!isAttached) {
        return;
      }

      if (this.selectedItems.length > 0) {
        this.selectedItems = [];
      }

      if (tableData) {
        this._currentDataProvider = (params, callback) => {
          this._localDataProvider(params, (items, size) => {
            callback(items, size);
            this._populateTableColumns(items);
          });
        };
        this._hasLocalDataProvider = true;
      }
      this._editingItem = null;
    }

    _compareValues(a, b, path, direction) {
      const column = this._getColumnByPath(path);
      // Selection is inverted to make selected smaller than not selected
      const valueA = path === '--selection--' ? !this._vaadinGrid._isSelected(a) : Base.get(path, a);
      const valueB = path === '--selection--' ? !this._vaadinGrid._isSelected(b) : Base.get(path, b);
      // need to properly compare dates if column type is date
      if (column.type === 'date') {
        const momentA = this._getMomentObj(valueA, path);
        const momentB = this._getMomentObj(valueB, path);
        const compareVal = this._compareMomentObj(momentA, momentB, direction);
        if (compareVal !== undefined) {
          return compareVal;
        }
      }
      // compare as plain value
      if (direction === 'asc') {
        return this._compare(valueA, valueB);
      } else if (direction === 'desc') {
        return this._compare(valueB, valueA);
      } else {
        return 0;
      }
    }

    _compareMomentObj(momentA, momentB, direction) {
      if (!momentA || !momentB) {
        return;
      }
      if (momentA.isBefore(momentB)) {
        return direction === 'asc' ? -1 : 1;
      }
      if (momentA.isSame(momentB)) {
        return 0;
      }
      if (momentA.isAfter(momentB)) {
        return direction === 'asc' ? 1 : -1;
      }
    }

    _getMomentObj(value, path) {
      const column = this._getColumnByPath(path);
      const dateFormat = column.dateFormat || {};
      const timezone = dateFormat.timezone || 'utc';
      const format = dateFormat.format;
      if (format) {
        if (format === 'ISO') {
          return window.Px.moment(value);
        } else {
          return window.Px.moment.tz(value, format, timezone);
        }
      }
    }

    _getColumnByPath(columnPath) {
      if (!this.columns) {
        return;
      }
      return this.columns.filter((column) => column.path === columnPath)[0];
    }

    /**
     * Do not drop item for page sizing here, or it will break things
     */
    _localDataResolver(params, items) {
      if (params.filters) {
        const autoFilters = params.filters.filter(filter => filter.value.isAutoFilter);

        if (autoFilters.length && this._vaadinGrid._checkPaths(autoFilters, 'filtering', items)) {
          items = this._applyAutoFilter(items, autoFilters);
        }

        const advancedFilters = params.filters
          .filter(filter => filter.value.isAdvancedFilter)
          .map(filter => filter.value.filter);

        if (advancedFilters && advancedFilters.length != 0) {
          items = this._applyCustomFilter(items, this.columns, advancedFilters);
        }
      }

      if (params.sortOrders && params.sortOrders.length && this._vaadinGrid._checkPaths(this._sorters, 'sorting', items)) {
        const multiSort = (a, b) => {
          return params.sortOrders.map(sort => {
            if (sort.direction === 'asc' || sort.direction === 'desc') {
              return this._compareValues(a, b, sort.path, sort.direction);
            } else {
              return 0;
            }
          }).reduce((p, n) => {
            return p ? p : n;
          }, 0);
        };

        items = items.slice(0).sort(multiSort);
      }

      // Do not apply pageSize slice here, it will break sizing

      return items;
    }

    /**
     * Overridden version of vaadin-grid getItemId, to allow grouping
     * Always use instance compare in case of hasChildren
     */
    _gridGetItemId(item) {
      if (this._groupByColumn && item && item._groupId) {
        return item._groupId;
      } else {
        return this.itemIdPath ? this._vaadinGrid.get(this.itemIdPath, item) : item;
      }
    }

    _localDataProvider(params, callback) {
      let items = (Array.isArray(this.tableData) ? this.tableData : []).slice(0);
      items = this._localDataResolver(params, items);

      if (this._groupByColumn) {
        const columnPath = this._groupByColumn.path;
        if (!params.parentItem) {
          const valuesMap = items.reduce((map, item) => {
            const value = item[columnPath];
            const groupItem = Object.assign({}, item);
            for (const i in groupItem) { // px-data-grid/issues/160
              if (i !== columnPath) {
                groupItem[i] = '';
              }
            }
            if (this._groupByColumn.mappedObject) {
              groupItem._groupId = '--group--' + this._groupByColumn.mappedObject.id + '-' + value;
            }
            groupItem.hasChildren = true;
            map.set(value, groupItem);
            return map;
          }, new Map());
          items = [];
          valuesMap.forEach((item) => items.push(item));
        } else {
          items = items.filter((item) => item[columnPath] === params.parentItem[columnPath]);
        }
      }

      const totalSize = items.length;

      const start = params.page * params.pageSize;
      const end = start + params.pageSize;
      items = items.slice(start, end);

      callback(items, totalSize);
    }

    /**
     * Will return all local items after filter (no ordering applied)
     */
    _getAllLocalItems() {
      if (this._hasLocalDataProvider) {
        const items = (Array.isArray(this.tableData) ? this.tableData : []).slice(0);
        return this._localDataResolver({
          page: 0,
          pageSize: this.tableData.length
        }, items);
      } else {
        return [];
      }
    }

    _remoteDataProviderChanged(provider) {
      this._hasLocalDataProvider = false;
      this._currentDataProvider = (params, callback) => {
        provider(params, (items, size) => {
          callback(items, size);
          this._populateTableColumns(items);
        });
      };
    }

    _resolveColumnPath(column) {
      if (typeof column.path === 'undefined') {
        console.warn(`column.path for column ${JSON.stringify(column)} should be initialized.`);
      }
      return column.path ? column.path : '';
    }

    _populateTableColumns(data) {
      if (!this.columns.length && data && data.length) {
        this.columns = [];
        for (const key in data[0]) {
          this.push('columns', {
            name: key,
            hidden: false,
            editable: true,
            renderer: 'px-data-grid-string-renderer',
            type: 'string',
            path: key,
            generated: true
          });
        }
      }

      this._updateActionMenu(this.tableActions);
      this._updateColumnSelector();
    }

    /**
     * Event handler for action menu clicks
     */
    _actionClicked(evt) {
      const item = evt.detail.detail.item;
      const key = item.key;

      if (key && typeof key == 'string') {
        // -column- is temporary work around to limitations of px-dropdown
        if (key.indexOf('-column-') === 0) {
          const columnId = key.substr('-column-'.length);
          const column = this._getColumnElementById(columnId);
          if (column) {
            column.hidden = column.hidden === undefined ? true : !column.hidden;
          } else {
            console.warn('Failed to find column with ID ' + columnId);
          }
        } else if (key.indexOf('-action-') === 0) {
          const actionId = key.substr('-action-'.length);
          this.dispatchEvent(new CustomEvent('table-action', {
            detail: {
              id: actionId
            },
            composed: true,
            bubbles: true
          }));
        } else if (key.indexOf('-internal-ungroup-') === 0) {
          this._ungroup();
        }
      }
    }

    /**
     * Function to resolve (data) columns on grid
     */
    _getColumns() {
      return this._vaadinGrid ? Array.from(this._vaadinGrid.querySelectorAll('px-data-grid-column')) : [];
    }

    /**
     * Function called when column selector menu needs to be updated
     */
    _updateColumnSelector() {
      const content = [];
      this._selectedActionItems = [];

      const defaultName = this.localize('Column #');
      let counter = 0;
      const selected = [];
      // Allow 0, as that happens if this gets called before columns are ready
      const oneVisibleColumn = this.getVisibleColumns().length == 1;

      this._getColumns().forEach((columnElement) => {
        const columnId = columnElement.mappedObject ? columnElement.mappedObject.id : undefined;
        // If this method gets called before column IDs are generated,
        // just ignore those columns.
        if (columnId === undefined) {
          return;
        }

        const index = ++counter;
        const hidden = columnElement.hidden ? columnElement.hidden : false;
        const name = columnElement.name ? columnElement.name : (defaultName + index);
        // -column- is temporary work around to limitations of px-dropdown
        const key = '-column-' + columnId;
        const groupedByThis = this._groupByColumn === columnElement;

        const item = {
          key: key,
          val: name,
          disabled: groupedByThis || (oneVisibleColumn && !hidden)
        };

        if (!hidden) {
          selected.push(key);
        }

        content.push(item);
      });

      this._columnSelectorContent = content;
      setTimeout(() => {
        this._selectedActionItems = selected;
      });
    }

    /**
     * Returns a label for the column selector, updated when column selections change.
     */
    _computeColumnSelectorLabel(selectedItems) {
      const columnsSelected = selectedItems.length;
      const selectionText = columnsSelected > 1 ? 'columns selected' : 'column selected';

      return `${columnsSelected} ${this.localize(selectionText)}`;
    }

    /**
     * Function called when action menu content needs to be updated
     */
    _updateActionMenu(tableActions) {
      const content = [];

      // Application specific options
      if (tableActions) {
        tableActions.forEach((item) => {
          content.push({
            key: '-action-' + item.id,
            val: item.name,
            selected: false,
            icon: item.icon,
            disabled: item.disabled || false,
            disableSelect: true
          });
        });
      }

      if (this._groupByColumn) {
        content.push({
          key: '-internal-ungroup-',
          val: this.localize('Clear Grouping'),
          icon: 'px-nav:reload',
          selected: false,
          disableSelect: true
        });
      }

      this._actionMenuContent = content;
    }

    _getColumnsWithName(name) {
      return this._getColumns().filter(c => c.name == name);
    }

    _getColumnById(columnId) {
      return this.columns.filter((column) => column.id === columnId)[0];
    }

    _getColumnElementById(columnId) {
      return this._getColumns()
        .filter(column => column.mappedObject && column.mappedObject.id == columnId)[0];
    }

    _scheduleColumnSanityCheck() {
      this._columnSanityCheckDebouncer = Debouncer.debounce(
        this._columnSanityCheckDebouncer,
        idlePeriod,
        () => {
          this._columnSanityCheck();
        }
      );
    }

    _onColumnUpdate(event) {
      if (event.detail.type == 'hidden') {
        this._updateColumnSelector();
      } else if (event.detail.type == 'frozen') {
        this._scheduleColumnSanityCheck();
      }
    }

    _loadingChanged(loading) {
      clearTimeout(this._spinnerHiddenTimeout);

      if (loading) {
        this._spinnerHiddenTimeout = setTimeout(() => this._spinnerHidden = false, this.loadingSpinnerDebounce);
      } else {
        this._spinnerHidden = true;
      }
    }

    /**
     * Simple method to check if action bar should be shown
     */
    _showActionBar(filterField, hideActionMenu, hideColumnFilter, filterable) {
      return filterField || !hideActionMenu || !hideColumnFilter || filterable;
    }

    /**
     * Determines whether the action menu should be shown
     */
    _showActionMenu(hide = false, tableActions = []) {
      return !hide && tableActions.length > 0;
    }

    /**
     * Helper method to check if header is defined, if not use name
     */
    resolveColumnHeader(column) {
      return column.header ? column.header : column.name;
    }

    /**
     * This to be moved to inner data-provider when we get that done. Until then
     * this will add workaround that allows to filter inmemory data given via
     * items parameter.
     */
    _applyAutoFilter(items, filters) {
      return items.filter((item, index) => {
        return filters.filter(filter => {
          const filterValueLowercase = this._vaadinGrid._normalizeEmptyValue(filter.value.query).toString().toLowerCase();
          if (item && filter.path === undefined) {
            for (const key in item) {
              const value = this._vaadinGrid._normalizeEmptyValue(Base.get(key, item));
              if (value.toString().toLowerCase().indexOf(filterValueLowercase) !== -1) {
                return false;
              }
            }
            return true;
          } else {
            const value = this._vaadinGrid._normalizeEmptyValue(Base.get(filter.path, item));
            return value.toString().toLowerCase().indexOf(filterValueLowercase) === -1;
          }
        }).length === 0;
      });
    }

    /**
     * Listener for auto filter component
     */
    _autoFilterChanged(event) {
      // Ignore if autofiltering not enabled
      if (!this.autoFilter) {
        return;
      } else {
        const filters = this._vaadinGrid._filters
          .filter(filter => !filter.value.isAutoFilter);

        filters.push({
          value: {
            query: event.detail.value,
            isAutoFilter: true
          }
        });

        this._vaadinGrid._filters = filters;
        this._vaadinGrid.clearCache();
      }
    }

    _isGroupedByColumn(column, _groupByColumn) {
      return _groupByColumn && _groupByColumn.name === column.name;
    }

    /**
     * Method forcing column order rules. To be run after any column order change
     */
    _columnOrderCleaner() {
      const columnsRow = this._getColumns();
      const leftColumns = columnsRow.filter(c => !c.isDataColumn && c.frozen);
      const rightColumns = columnsRow.filter(c => c.isDataColumn || !c.frozen);

      if (leftColumns && leftColumns.length && rightColumns && rightColumns.length) {
        const firstRight = rightColumns[0];
        leftColumns.forEach(c => {
          this._vaadinGrid.insertBefore(c, firstRight);
        });
      }
    }

    /**
     * Check if selections are allowed
     */
    _isSelectable() {
      return this.selectionMode == 'single' || this.selectionMode == 'multi';
    }

    /**
     * Check if grid is in multi selection mode
     */
    _isMultiSelect() {
      return this._isSelectable() && this.selectionMode == 'multi';
    }

    _selectionModeChanged(mode) {
      if (mode != 'none' && mode != 'single' && mode != 'multi') {
        console.warn('Invalid selection-mode value \'' + mode + '\', use \'none\', \'single\' or \'multi\'');
        return;
      }

      const selectable = mode != 'none';

      // clear selections if mode is 'none'
      if (mode === 'none' && this._vaadinGrid) {
        this._vaadinGrid.selectedItems = [];
      }

      // clear selections if mode is 'single' and there are more than 1 selected items
      if (mode === 'single' && this._vaadinGrid && this._vaadinGrid.selectedItems.length > 1) {
        this._vaadinGrid.selectedItems = [];
      }

      if (selectable) {
        setTimeout(() => {
          if (this.selectable) {
            this._columnOrderCleaner();
          }
        });
      }

      afterNextRender(this._vaadinGrid, () => this._vaadinGrid.notifyResize());
    }

    _highlightsObserver(highlight, filterHighlights) {
      this.set('_highlightEntities', highlight.concat(filterHighlights));
    }

    _gridHeightChanged(gridHeight) {
      if (!this._vaadinGrid) {
        return;
      }

      // In case of real undefined (or 'default' string, for demo cases)
      // and 'auto' the CSS height of vaadin-grid is set to undefined. Other
      // values are set as CSS height value to vaadin-grid.
      if (!this.gridHeight || this.gridHeight == 'default' || this.gridHeight == 'auto') {
        this._vaadinGrid.style.height = null;
      } else {
        this._vaadinGrid.style.height = this.gridHeight;
      }

      afterNextRender(this._vaadinGrid, () => this._vaadinGrid.notifyResize());
    }

    /**
     * Set visibility of the details container for any item's corresponding row.
     */
    setRowDetailsVisible(item, isVisible) {
      if (!item) {
        return;
      }
      const index = this._vaadinGrid.detailsOpenedItems.indexOf(item);
      if (isVisible && index < 0) {
        this._vaadinGrid.detailsOpenedItems.push(item);
        afterNextRender(this._vaadinGrid, () => this._vaadinGrid.notifyResize());
      } else if (!isVisible && index >= 0) {
        this._vaadinGrid.detailsOpenedItems.splice(index, 1);
        afterNextRender(this._vaadinGrid, () => this._vaadinGrid.notifyResize());
      }
    }

    _editingItemObserver(editingItem, oldV) {
      if (typeof oldV === 'undefined') {
        return;
      }

      this.dispatchEvent(new CustomEvent('editing-item-changed', {
        bubbles: true,
        composed: true,
        detail: {
          item: editingItem
        }
      }));
    }

    _setEditingItem(event) {
      // To prevent selections
      event.stopPropagation();
      this._editingItem = event.details.item;

      // To refresh row height after edit...
      this._vaadinGrid.notifyResize();
    }

    _cancelEdit(event) {
      this._editingRenderers.forEach((renderer) => renderer.restoreInitial());
      this._editingItem = null;
      // To refresh row height after edit...
      this._vaadinGrid.notifyResize();
    }

    _isItemEditing(item, editingItem) {
      return item === editingItem;
    }

    _isAnyItemEditing(editingItem) {
      return !!editingItem;
    }

    _saveItem() {
      if (this._editingRenderers.every((renderer) => renderer._performValidation().valid)) {
        const changedPaths = this._editingRenderers
          .filter((renderer) => renderer.applyValue())
          .map((renderer) => renderer.column.path);

        if (changedPaths.length > 0) {
          this.dispatchEvent(new CustomEvent('item-edited',
            {
              bubbles: true,
              composed: true,
              detail: {
                item: this._editingItem,
                paths: changedPaths
              }
            }
          ));
        }

        this._editingItem = null;
        // To refresh row height after edit...
        this._vaadinGrid.notifyResize();
      }
    }

    _localizeChanged(localize) {
      this._boundedLocalize = localize.bind(this);
    }

    _scrollListener(e) {
      if (e.target.scrollLeft != 0) {
        this._vaadinGrid.setAttribute('horizontal-offset', 'true');
      } else {
        this._vaadinGrid.removeAttribute('horizontal-offset');
      }
    }

    /**
     * Overridden version of _onSorterChanged in vaadin-grid-sort-mixin. Is mapped to custom event
     * px-sorter-changed emitted by px-data-grid-sorter. Only difference is to use push, not
     * unshift, when adding sort rule to _sorters. If errors in this method, update to match with
     * current version in vaadin-grid-sort-mixin, and replace unshift with push.
     */
    _onPxSorterChanged(e) {

      this._pxDataGrid._editingItem = null;

      const sorter = e.detail.sorter;

      this._removeArrayItem(this._sorters, sorter);
      sorter._order = null;

      if (this.multiSort) {
        if (sorter.direction) {
          this._sorters.push(sorter);
        }

        this._sorters.forEach((sorter, index) => sorter._order = this._sorters.length > 1 ? index : null, this);
      } else {
        this._sorters.forEach(sorter => {
          sorter._order = null;
          sorter.direction = null;
        });

        if (sorter.direction) {
          this._sorters = [sorter];
        }
      }

      e.stopPropagation();

      if (this.dataProvider &&
        // No need to clear cache if sorters didn't change
        JSON.stringify(this._previousSorters) !== JSON.stringify(this._mapSorters())) {
        this.clearCache();
      }

      this._a11yUpdateSorters();

      this._previousSorters = this._mapSorters();
    }

    /**
     * Returns a list of currently visible columns in the grid.
     *
     * @return {Array<Object>} - Array of references to `columns` objects
     */
    getVisibleColumns() {
      return this._getColumns().filter((col) => !col.hidden).sort((a, b) => a._order - b._order);
    }

    /**
     * Returns currently visible data if called with `true`.
     * Returns all cached data if called with `undefined`.
     *
     * @param {?boolean} visibleOnly
     * @return Array
     */
    getData(visibleOnly) {
      let items = [];

      if (visibleOnly) {
        items = Array.from(this._vaadinGrid.querySelectorAll('px-data-grid-cell-content-wrapper'));

        const gridRect = this._vaadinGrid.getBoundingClientRect();
        const headerRect = this._vaadinGrid
          .querySelector('px-data-grid-header-cell')
          .getBoundingClientRect();

        items = items.filter((wrapper) => {
          const wrapperRect = wrapper.getBoundingClientRect();
          return wrapperRect.top < gridRect.bottom && wrapperRect.bottom > headerRect.bottom;
        }).map((wrapper) => {
          return wrapper.item;
        }).filter((v, i, a) => {
          return a.indexOf(v) === i && v;
        });
      } else {
        const cachedItems = this._vaadinGrid._cache.items;
        Object.keys(cachedItems).forEach((key) => {
          items.push(cachedItems[key]);
        });
      }

      return items.map((item) => {
        const sortedObject = {};

        this.getVisibleColumns().forEach((col) => {
          sortedObject[col.path] = item[col.path];
        });

        return sortedObject;
      });
    }

    /**
     * Make JSON friendly version out of columns array
     */
    _cleanColumns(columns) {
      if (!columns) {
        return [];
      }
      return this._copyArray(columns);
    }

    /**
     * Columns property change observer
     */
    _columnsChanged(columns) {
      // Store cleaned version of current columns
      this._lastColumnsReceived = this._cleanColumns(columns);
      afterNextRender(this._vaadinGrid, () => this._updateColumnSelector());
    }

    _setColumnId(columns) {
      if (!columns || this._columnIdSetting) {
        return;
      }

      this._columnIdSetting = true;
      columns.forEach((column, index) => {
        if (!column.id) {
          this.set(`columns.${index}.id`, `${column.path}[${column.type || 'string'}]`);

          if (columns.filter((col) => col.id === column.id).length > 1) {
            console.warn(`Warning! There are multiple columns with '${column.path}' path ` +
              `and '${column.type || 'string'}' type, please provide column.id for those columns`);
          }
        }
      });
      this._columnIdSetting = false;
    }

    /**
     * Restore layout (columns) to state those were given
     */
    restoreLayout() {
      if (!this._lastColumnsReceived) {
        console.warn('No layout defined where to return');
        return;
      }
      // Store last columns received before clearing columns
      const revertTo = this._lastColumnsReceived;
      this._revertColumns(revertTo);
    }

    _revertColumns(revertTo) {
      // First clear all columns
      this.columns = [];

      // After empty columns has been rendered return to wanted state
      afterNextRender(this._vaadinGrid, () => this.columns = revertTo);
    }

    /**
     * Just to make sure only true or false is given (undefined converted to false).
     * In some cases undefined value breaks functionality,
     */
    _undefinedToFalse(value) {
      if (value === undefined) {
        return false;
      } else {
        return value;
      }
    }

    _copyArray(arr) {
      return JSON.parse(JSON.stringify(arr));
    }

    _isAutoHeight(gridHeight) {
      return gridHeight === 'auto';
    }

    _checkColumnResizable(gridResizable, columnResizable) {
      return gridResizable ? (columnResizable === undefined ? true : columnResizable) : false;
    }

    _isStriped(striped, groupByColumn) {
      return striped && !groupByColumn;
    }

    _ellipsisModeChanged(ellipsisMode) {
      if (ellipsisMode) {
        this.classList.add('ellipsis');
      } else {
        this.classList.remove('ellipsis');
      }
      if (this._vaadinGrid) {
        this._vaadinGrid.notifyResize();
      }
    }

    /**
     * Rewrite of _compare from vaadin-grid to allow incasesensitive compare
     */
    _compare(a, b) {
      a = this._vaadinGrid._normalizeEmptyValue(a);
      b = this._vaadinGrid._normalizeEmptyValue(b);

      // If both are string, make sure values are compared incasesensitive
      // TODO localCompare would be better option, but not sure it's
      // fully supported, and what locale to use
      if (typeof a === 'string' && typeof b === 'string') {
        a = a.toUpperCase();
        b = b.toUpperCase();
      }

      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }

    _offerEditColumn(editable) {
      return editable;
    }

    _offerActionColumn(editable, itemActions, editingItem) {

      return (editable) || (itemActions && itemActions.length > 0);
    }

    _isColumnReorderingAllowed(columnReordingAllowed, groupByColumn) {
      return columnReordingAllowed && !groupByColumn;
    }

    _openAdvancedFilter(event) {
      this.shadowRoot.querySelector('px-data-grid-filters-modal').open();
    }

    /**
     * Gets the current configurations set by the user on the data grid,
     * including a list of visible columns, a list of highlight rules,
     * a list of filters, and the current auto filter search value.
     *
     * Save the result to some persistant storage (e.g. your app database or
     * localStorage) to save the user's preferences after they configure
     * the data grid. When the user revisits the grid page, fetch the
     * saved state and call `setState()` to set the grid up with the
     * same set of preferences.
     *
     * @return {Object}
     */
    getState() {
      return {
        columns: this.getVisibleColumns(),
        highlight: this.highlight.map(entity => Object.assign({}, entity)),
        filters: this._copyArray(this._filters),
        autoFilter: this._autoFilterValue
      };
    }

    /**
     * Sets the state of the grid based on a past state created by
     * calling `getState()`.
     *
     * Configures the visible columns, highlight rules, active filters,
     * and auto-filter value.
     *
     * @param {Object} state - State object created by `getState()`
     */
    setState(state) {
      this.columns = [];

      afterNextRender(this._vaadinGrid, () => {
        this.columns = state.columns;

        this._filters = state.filters;
        this._autoFilterValue = state.autoFilter;
        this.highlight = state.highlight;
      });
    }
  }
  customElements.define(DataGridElement.is, DataGridElement);

  Predix.DataGridElement = DataGridElement;
}
