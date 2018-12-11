v1.1.1
==========================
Bug fixes:
* Fixed `hide-column-filter` property having no effect on px-data-grid-paginated
* Added `hide-column-filter` property to component demo

v1.1.0
==========================
Enhancement:
* #813 - Added support for `icon` attribute for table and item action menus.
* #813 - The table action menu and column selector are now separated into individual dropdowns.

Bug fixes:
* #814 - Added missing bindings for i18n

v1.0.9
==========================
Bug fixes:
* #805 - item-action and item-save events should now propagate to px-data-grid/px-data-grid-paginated elements on polyfilled browsers 

v1.0.8
==========================
Bug Fixes:
* #809 - add a reference to the saved item in item-saved event

v1.0.7
==========================
Bug fixes:
* #808 - selected-items-changed event behaves consistently

v1.0.6
==========================
Enhancement:
* #803 - Clear selected items when table data changes

v1.0.5
==========================
Enhancement:
* #799 - Adding Disable for TableActions
* #799 - Add Property to show/hide column filters

v1.0.4
==========================
Bug fixes:
* #801 - Unfroze row action column

v1.0.3
==========================
Bug fixes:
* #794 - Make data-grid table actions reactive to property change

v1.0.2
==========================
Bug fixes:
* #792 - Change px-data-grid-paginated page buttons to use outline instead of
  border to make it less likely long numbers will overlay. This fix will only
  work for some numbers and will not work for numbers over 1000.

v1.0.1
==========================
* [DEMO ONLY] Remove beta banner from the top of demo pages

v1.0.0
==========================
* First general availability release of px-data-grid

v1.0.0-beta.4
==========================
* Passes `item` object to the renderer to allow the renderer to read its "row
  data" to use at render time or in passing data up to the app through events
Demo updates:
* Adds demo for px-data-grid-paginated

v1.0.0-beta.3
==========================
* Update date/time rendering and filtering functionality to correctly use
  source data timezones when displaying bits of UI to the user (#753, #759, #762)
* Expand date/time APIs available in `columns` to support complete configuration
  of date/time UI by the developer. See the docs for more info.
* Fixes bug that caused px-data-grid to throw error when column objects were
  re-mapped and a non-configurable property was set (#761)
* Fixes bug that caused the page size select dropdown in px-data-grid-paginated
  to show an ellipsis when there was enough room to show the page numbers (#758)

v1.0.0-beta.2
==========================
Demo updates:
* Fix link to Github in the demo header
* Add link to Glitch in the demo snippet

v1.0.0-beta.1
==========================
* Initial release of the px-data-grid for beta testers. This release gives teams
  the chance to try the new grid out in dev/QA environments. It's not intended
  for use in production.
* Releasing all existing features for testing and feedback. See the px-data-grid
  and px-data-grid-paginated API docs for a list of all properties and methods
  available.
