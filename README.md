Angular Font-Selector
=====================

[![Build Status](https://travis-ci.org/Jimdo/angular-fontselect.svg?branch=master)](https://travis-ci.org/Jimdo/angular-fontselect)
[![Coverage Status](https://img.shields.io/coveralls/Jimdo/angular-fontselect.svg)](https://coveralls.io/r/Jimdo/angular-fontselect?branch=master)

A font selection directive for AngularJS - [Try it, it's beautiful](http://jimdo.github.io/angular-fontselect/).


Breaking Changes
----------------

### `0.13`

  - Markup changes. See:
     - [c8d4453](https://github.com/Jimdo/angular-fontselect/commit/c8d4453e48aaacb1c79b367a00f7cfe2f933bdd6)
     - [7fffb26](https://github.com/Jimdo/angular-fontselect/commit/7fffb260572e935473b93a1e2ab8c81b6c89f27b)

### `0.12`

  - `jdFontselect.fonts` has been renamed to `jdFontselectFonts`
  - `jdFontlist.controller` has been renamed to `jdFontlistController`

  In order to enable usage of [ngAnnotate](https://github.com/olov/ng-annotate).


Usage
-----

#### install bower package:

	bower install angular-fontselect --save

#### add scripts and styles to your project

```html
<script type="bower_components/angular-fontselect/dist/libs/webfontloader.js"></script>
<script type="bower_components/angular-fontselect/dist/angular-fontselect.js"></script>
```

```html
<link rel="stylesheet" type="text/css" href="bower_components/angular-fontselect/dist/angular-fontselect.css">
```

or use [wiredep](https://www.google.de/search?q=wiredep+js)

#### set as dependency in your module

```js
angular.module('myModule', ['jdFontselect']);
```

#### use the directive in your views

```html
<h1>Now select a font:</h1>
<jd-fontselect />
```


Api Keys
--------

You can provide your production API Keys by setting them as a constant in your application.
Get one from the [Google Developers Console](https://developers.google.com/fonts/docs/developer_api#Auth).

```js
angular.module('myApp', ['jdFontselect']).constant('jdFontselectConfig', {
  googleApiKey: '__yourKeyHere__'
});
```


Directive Attributes
--------------------

#### Current State

	<jd-fontselect state="myStateObject" />

The State object is meant to be read only and can be used for initiation with a
certain state.

```js
// $scope.myStateObject
{
  sort: {               // Sort the list by a given font attribute
    attr: 'name',       // Can be: 'name', 'popularity', 'lastModified'
    direction: true
  },
  providers: {          // Filter the list by Font provider
    google: true,
    websafe: true
  },
  category: undefined,  // Filter. Can be: undefined (all), 'sansserif',
                        //   'serif', 'handwriting', 'display', 'other'
  font: {               // The current font object
    subsets: [ ... ],   // List of supported subsets
    variants: [ ... ],  // List of available Variants
    name: '',           // Name of the font (As displayed in the list)
    popularity: 0,      // Popularity of the font
    key: '',            // Lower-cased alpha only version of the name
    lastModified: 0,    // Timestamp
    stack: '',			// For example '"Open Sans", sans-serif'
    category: ''        // 'sansserif', 'serif', 'handwriting', 'display', 'other'
  },
  search: '',            // Current search string
  subsets: {            // Filter: Object of subsets supported by google
    latin: true
    // [ ... ]
  }
}

```

#### Current Stack

	<jd-fontselect stack="myFontStack" />

The Font stack can be used in CSS like this

	<h1 style="font-family: {{myFontStack}};">Look at this font</h1>

You can change the current font in the selection by giving
`$scope.myFontStack` a value (for example `Helvetica, Verdana, sans-serif`)

#### Current Font Name

	<jd-fontselect name="myFontName" />

Read-Only. `$scope.myFontName` now contains the current font name

#### Translate

	<jd-fontselect text="myTranslationObject" />
	<jd-fontselect rawText="{ toggleOpenLabel: 'Mach uff!', ... }" />

The `text` attribute contains a translation object, the `rawtext` object contains a
string, evaluating into a translation object.

```js
// $scope.myTranslationObject
{
  toggleOpenLabel: 'open',
  toggleCloseLabel: 'close',
  searchToggleLabel: 'Search',
  search: 'Search by Fontname',
  toggleSearchLabel: 'Choose Font',
  providerLabel: 'Providers',
  subsetLabel: 'Subsets',
  styleLabel: 'Categories',
  settingsLabel: 'Settings',
  noResultsLabel: 'No Fonts found.',
  pageLabel: 'Page: ',
  fontFabel: 'Fonts: ',
  closeButton: 'Close',
  allFontsListHeadline: 'All Fonts',
  curatedFontsListHeadline: 'Curated Fonts',
  page: {
    prev: '▲',
    next: '▼'
  },
  provider: {
    websafe: 'Websafe Fonts',
    google: 'Google Fonts'
  },
  category: {
    serif: 'Serif',
    sansserif: 'Sans Serif',
    display: 'Display',
    handwriting: 'Handwriting',
    other: 'Other'
  },
  subset: {
    cyrillic: 'Cyrillic',
    'cyrillic-ext': 'Cyrillic Extended',
    greek: 'Greek',
    'greek-ext': 'Greek Extended',
    latin: 'Latin',
    'latin-ext': 'Latin Extended',
    vietnamese: 'Vietnamese',
    devanagari: 'Devanagari',
    khmer: 'Khmer'
  },
  sort: {
    popularity: 'Popularity',
    name: 'Alphabet',
    lastModified: 'Latest'
  },
  sortdir: {
    desc: '▼',
    asc: '▲'
  }
}
```

#### On Initiation

	<jd-fontselect on-init="myInitiation($scope, $element)" />

This calls `$scope.myInitiation` with the font selection scope and element
once the selection is initiated.


#### Curated Fonts

In order to show a list of curated fonts on top the list with all fonts
configure the `jdfsCuratedFontsProvider` with an array of `${font.provider}.${font.key}`-strings.

```js
angular.module('myApp', ['jdFontselect'])
  .config(function (jdfsCuratedFontsProvider) {
    jdfsCuratedFontsProvider.setCuratedFontKeys(['websafe.timesnewroman', 'google.alef']);
  });
```

see [demo](https://github.com/Jimdo/angular-fontselect/blob/4446fbc4ed7d56cd2e8c19cadcaadfa284b37dfe/demo/app.js#L5-L7)


Contributing
------------

The [CONTRIBUTE.md](https://github.com/Jimdo/angular-fontselect/blob/master/CONTRIBUTE.md)
contains a lot of notes and tips to kickstart your development environment.


LICENSE
-------

> The MIT License
> 
> Copyright (c) 2015 Jimdo GmbH http://jimdo.com
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> 
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
