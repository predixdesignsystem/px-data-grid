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
import { get } from '@polymer/polymer/lib/utils/path.js';

/**
 * Mixin, that provides advanced filter functionality for px-data-grid.
 *
 * @polymerMixin
 */
export const DataGridFilterableMixin = superClass => class DataGridFilterableMixin extends superClass {
  static get properties() {
    return {
      /**
       * Set to enable advanced filtering. When enabled, a filter
       * button will be shown at the top of the grid. When the user clicks
       * on the filter button, a modal will be shown and the user can
       * filter visible items using different UI patterns.
       *
       * Columns should have the right `columns.type` set to ensure the
       * advanced filtering works as expected. See the `columns` property
       * for more information on setting the type, and for more advanced
       * filtering options that can be customized for `number` and `date`
       * type columns.
       */
      filterable: {
        type: Boolean,
        value: false
      },

      _filters: {
        type: Array
      },

      _initialFilterState: {
        type: Array,
        value: () => [{entities: [], action: 'show', operationType: 'all'}]
      },

      /**
       * Array of highlights from px-data-grid-filter component.
       */
      _filterHighlights: {
        type: Array,
        value: () => []
      }
    };
  }

  static get observers() {
    return [
      '_filtersObserver(_filters, _filters.*)'
    ];
  }

  ready() {
    super.ready();

    this.set('_filters', this._initialFilterState);

    this.addEventListener('remove-filter', (event) => {
      const entity = event.detail.entity;
      const section = event.detail.section;
      const sectionIndex = this._filters.indexOf(section);
      this.splice(`_filters.${sectionIndex}.entities`, section.entities.indexOf(entity), 1);
    });

    this.addEventListener('clear-filters', (event) => {
      this.set('_filters', [
        {
          action: 'show',
          operationType: 'all',
          entities: []
        }
      ]);
    });
  }

  _escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  }

  _isStringMatches(filter, value) {
    let regex;

    switch (filter.pattern) {
      case 'not_equal':
      case 'equals':
        regex = new RegExp(`^${this._escapeRegExp(filter.query)}$`, 'i');
        break;
      case 'not_contains':
      case 'contains':
        regex = new RegExp(`${this._escapeRegExp(filter.query)}`, 'i');
        break;
      case 'starts_with':
        regex = new RegExp(`^${this._escapeRegExp(filter.query)}`, 'i');
        break;
      case 'ends_with':
        regex = new RegExp(`${this._escapeRegExp(filter.query)}$`, 'i');
        break;
      case 'wildcard':
        if (!filter.query || filter.query === '*') {
          regex = new RegExp('.*', 'i');
        } else {
          regex = new RegExp(`^${filter.query.split('*').map(this._escapeRegExp).join('.*')}$`, 'i');
        }
        break;
    }

    // Flip bool if we're using a negation filter (`not_*`)
    return regex.test(value) !== (filter.pattern.indexOf('not_') === 0);
  }

  _isDateMatches(filter, value) {
    let result = true;
    const comparingDate = window.Px.moment.utc(value);
    if (!comparingDate) {
      result = false;
    }
    if (filter.dateFrom) {
      const dateFrom = window.Px.moment.utc(filter.dateFrom);
      result = result && dateFrom < comparingDate;
    }
    if (filter.dateTo) {
      const dateTo = window.Px.moment.utc(filter.dateTo);
      result = result && dateTo > comparingDate;
    }
    return result;
  }

  _isNumberMatches(filter, value) {
    let result = false;
    const comparingNumber = Number(value);

    if (filter.leftBound !== undefined && filter.rightBound !== undefined) {
      const leftBound = Number(filter.leftBound);
      const rightBound = Number(filter.rightBound);

      result = leftBound < comparingNumber && comparingNumber < rightBound;
    } else {
      const filterValue = Number(filter.value);

      switch (filter.condition) {
        case 'equals':
          result = comparingNumber === filterValue;
          break;
        case 'not_equal':
          result = comparingNumber !== filterValue;
          break;
        case 'equal_or_greater_than':
          result = comparingNumber >= filterValue;
          break;
        case 'equal_or_less_than':
          result = comparingNumber <= filterValue;
          break;
        case 'greater_than':
          result = comparingNumber > filterValue;
          break;
        case 'less_than':
          result = comparingNumber < filterValue;
          break;
      }
    }

    return result;
  }

  _matchesFilter(item, column, entity) {
    const filteringValue = get(item, column.path);

    if (column.type === 'date') {
      return this._isDateMatches(entity, filteringValue);
    } else if (column.type === 'number') {
      return this._isNumberMatches(entity, filteringValue);
    } else {
      return this._isStringMatches(entity, filteringValue);
    }
  }

  _applyCustomFilter(items, columns, filters) {
    const appliableFilters = filters
      .filter((section) => ['show', 'hide'].indexOf(section.action) !== -1)
      .filter((section) => section.entities.filter((entity) => entity.active).length > 0);

    const filteredItems = items.filter((item) => {
      if (appliableFilters.length === 0) {
        return true;
      }

      const isAnySectionApplied = appliableFilters
        .some((section) => {
          const activeEntities = section.entities.filter((entity) => entity.active);

          let operation;

          if ((section.operationType === 'any' && section.action === 'show') ||
            (section.operationType === 'all' && section.action === 'hide')) {
            operation = 'some';
          } else {
            operation = 'every';
          }

          return activeEntities[operation]((entity) => {
            let result;

            if (entity.columnId === '-any-') {
              result = columns.some((column) => {
                const matches = this._matchesFilter(item, {
                  type: 'string',
                  path: column.path
                }, entity);

                return matches;
              });
            } else {
              const column = this._getColumnById(entity.columnId);

              result = this._matchesFilter(item, column, entity);
            }

            return ((section.action === 'show' && result) || (section.action === 'hide' && !result));
          });
        });

      return isAnySectionApplied;
    });

    return filteredItems;
  }

  _constructHighilightCondition(appliableFilters, columns) {
    return (cellContent, item) => {
      return appliableFilters.some((section) => {
        const activeEntities = section.entities.filter((entity) => entity.active);

        return activeEntities[section.operationType === 'any' ? 'some' : 'every']((entity) => {
          if (entity.columnId === '-any-') {
            return columns.some((column) => {
              const matches = this._matchesFilter(item, {
                type: 'string',
                path: column.path
              }, entity);

              return matches;
            });
          } else {
            const column = this._getColumnById(entity.columnId);

            return this._matchesFilter(item, column, entity);
          }
        });
      });
    };
  }

  _filtersObserver(filters) {
    if (!this._vaadinGrid) {
      return;
    }

    const appliableFilterHighlights = filters
      .filter((section) => section.action === 'highlight' && section.entities.filter((entity) => entity.active).length > 0);

    const appliableFilters = filters
      .filter((section) => section.action !== 'highlight' && section.entities.filter((entity) => entity.active).length > 0);

    if (appliableFilterHighlights.length > 0) {

      this.set('_filterHighlights', [
        {
          type: 'row',
          condition: this._constructHighilightCondition(appliableFilterHighlights, this.columns)
        }
      ]);
    } else {
      this.set('_filterHighlights', []);
    }

    const gridFilters = this._vaadinGrid._filters
      .filter(filter => !filter.value.isAdvancedFilter);

    appliableFilters.map((filter) => {
      return {
        value: {
          isAdvancedFilter: true,
          filter: filter
        }
      };
    }).forEach((filter) => {
      gridFilters.push(filter);
    });

    this._vaadinGrid._filters = gridFilters;
    this._vaadinGrid.clearCache();
  }

  /**
   * This method allows to pass filters and save them as default filter state.
   * This means that after clicking "Reset" in filters modal filters will return to this state.
   * Format of input parameter for column.type === 'string':
   * ```
   * [{
   *   action: 'show',
   *   operationType: 'all',
   *   entities: [
   *     {
   *        columnId: 'first[string]',
   *        active: true,
   *        pattern: 'equals',
   *        query: 'Wong'
   *     }
   *   ]
   * }]
   * ```
   * Pattern can be one of `['equals', 'not_equal', 'contains', 'not_contains', 'starts_with', 'ends_with', 'wildcard']`.
   *
   * Format for column.type === 'date':
   * ```
   * [{
   *   action: 'show',
   *   operationType: 'all',
   *   entities: [
   *     {
   *        columnId: 'birth_date[date]',
   *        active: true,
   *        dateFrom: '1994-11-12',
   *        dateTo: '1994-11-12'
   *     }
   *   ]
   * }]
   * ```
   *
   * Format for column.type === 'number':
   * ```
   * [{
   *   action: 'show',
   *   operationType: 'all',
   *   entities: [
   *     {
   *        columnId: 'age[number]',
   *        active: true,
   *        condition: 'equals',
   *        value: 1
   *     }
   *   ]
   * }]
   * ```
   *
   * Condition can be one of `['equals', 'not_equal', 'greater_than', 'less_than', 'equals_or_greater_than', 'equals_or_less_than']`.
   * Also, `leftBound` and `rightBound` properties can be used instead of `condition` and `value` in order to filter by number range.
   *
   * Format:
   * ```
   * [{
   *   action: 'show',
   *   operationType: 'all',
   *   entities: [
   *     {
   *        columnId: 'age[number]',
   *        active: true,
   *        leftBound: 1,
   *        rightBound: 2
   *     }
   *   ]
   * }]
   * ```
   */
  applyFilters(filters) {
    this.set('_initialFilterState', filters);
    this.set('_filters', filters);
  }

};
