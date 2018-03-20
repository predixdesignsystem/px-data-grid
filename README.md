# px-data-grid [![Build Status](https://travis-ci.org/predixdesignsystem/px-data-grid.svg?branch=master)](https://travis-ci.org/predixdesignsystem/px-data-grid)

## Overview

`Px-data-grid` is a Predix UI component which defines a data grid, optionally using a sub-element for advanced column settings, filtering and pagination.

## Usage

### Prerequisites

1. node.js
2. npm
3. bower
4. [webcomponents-lite.js polyfill](https://github.com/webcomponents/webcomponentsjs)

Node, npm and bower are necessary to install the component and dependencies. webcomponents.js adds support for web components and custom elements to your application.

### Getting Started

First, install the component via bower on the command line.

```
bower install https://github.com/predixdesignsystem/px-data-grid.git --save
```

Second, import the component to your application with the following tag in your head.

```html
<link rel="import" href="bower_components/px-data-grid/px-data-grid.html">
```

Finally, use the component in your application:

```html
<px-data-grid table-data="{{data}}">
</px-data-grid>
```

## Local Development

From the component's directory...

```
$ npm install
$ bower install
$ gulp sass
```

From the component's directory, to start a local server run:

```
$ gulp serve
```

The root of that server (e.g. http://localhost:8080/) will automatically open in your default browser with the API documentation page and interactive working examples.

`gulp serve` also runs `gulp watch` concurrently so that when you make a change to your source files and save them, your preview will be updated in any browsers you have opened and turned on in LiveReload.

## Running tests from the browser

http://localhost:8080/test

## Running tests from the command line

In the `px-data-grid` directory, run `wct`

## Cross browser testing via [SauceLabs](https://saucelabs.com/)

In the `px-data-grid` directory, run `wct --env=saucelabs`
