/* jshint unused: false */

/** @const */
var PROVIDER_WEBSAFE = 'websafe';

/** @const */
var PROVIDER_GOOGLE = 'google';

/** @const */
var PROVIDERS = [
  PROVIDER_WEBSAFE,
  PROVIDER_GOOGLE
];

/** @const */
var DIR_PARTIALS = 'src/partials/';

/** @const */
var NAME_CONTROLLER = '.controller';

/** @const */
var NAME_FONTSSERVICE = 'jdFontselect.fonts';

/** @const */
var DEFAULT_WEBSAFE_FONTS = [
  {
    name: 'Arial',
    key: 'arial',
    category: 'sansserif',
    stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    popularity: 3,
    lastModified: '2014-01-28'
  },
  {
    name: 'Consolas',
    key: 'consolas',
    category: 'sans-serif',
    stack: 'Consolas, "Lucida Console", Monaco, monospace',
    popularity: 1,
    lastModified: '2014-02-04'
  },
  {
    name: 'Courier New',
    key: 'couriernew',
    category: 'serif',
    stack: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
    popularity: 1,
    lastModified: '2014-01-28'
  },
  {
    name: 'Georgia',
    key: 'georgia',
    category: 'serif',
    stack: 'Georgia, Palatino, "Palatino Linotype", Times, "Times New Roman", serif',
    popularity: 2,
    lastModified: '2014-02-04'
  },
  {
    name: 'Helvetica',
    key: 'helvetica',
    category: 'sansserif',
    stack: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
    popularity: 3,
    lastModified: '2014-02-04'
  },
  {
    name: 'Impact',
    key: 'impact',
    category: 'display',
    stack: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
    popularity: 3,
    lastModified: '2014-02-04'
  },
  {
    name: 'Lucida Sans',
    key: 'lucidasans',
    category: 'sansserif',
    stack: '"Lucida Sans", "Lucida Grande", "Lucida Sans Unicode", sans-serif',
    popularity: 3,
    lastModified: '2014-02-04'
  },
  {
    name: 'Palatino',
    key: 'palatino',
    category: 'serif',
    stack: 'Palatino, "Palatino Linotype", Georgia, Times, "Times New Roman", serif',
    popularity: 2,
    lastModified: '2014-02-04'
  },
  {
    name: 'Tahoma',
    key: 'tahoma',
    category: 'sansserif',
    stack: 'Tahoma, Verdana, Geneva, sans-serif',
    popularity: 6,
    lastModified: '2014-02-04'
  },
  {
    name: 'Trebuchet',
    key: 'trebuchet',
    category: 'sansserif',
    stack: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
    popularity: 6,
    lastModified: '2014-02-04'
  },
  {
    name: 'Verdana',
    key: 'verdana',
    category: 'sansserif',
    stack: 'Verdana, Geneva, sans-serif',
    popularity: 6,
    lastModified: '2014-01-28'
  },
  {
    name: 'Times New Roman',
    key: 'timesnewroman',
    category: 'serif',
    stack: 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif',
    popularity: 2,
    lastModified: '2014-01-28'
  },
  {
    name: 'Brush Script',
    key: 'brushscript',
    category: 'handwriting',
    stack: '"Brush Script MT", cursive',
    popularity: 5,
    lastModified: '2014-01-29'
  }
];

/** @const */
var DEFAULT_CATEGORIES = [
  {
    key: 'serif',
    fallback: 'serif'
  },
  {
    key: 'sansserif',
    fallback: 'sans-serif'
  },
  {
    key: 'handwriting',
    fallback: 'cursive'
  },
  {
    key: 'display',
    fallback: 'cursive'
  },
  {
    key: 'other',
    fallback: 'sans-serif'
  }
];

/** @const */
var SORT_ATTRIBUTES = [
  {
    key: 'name',
    dir: false
  },
  {
    key: 'popularity',
    dir: true
  },
  {
    key: 'lastModified',
    dir: true
  }
];

/** @const */
var STATE_DEFAULTS = {
  sort: {
    attr: undefined,
    direction: true
  },
  provider: PROVIDER_WEBSAFE,
  category: undefined,
  font: undefined,
  search: undefined,
  subsets: {
    latin: true
  }
};

/** @const */
var TEXT_DEFAULTS = {
  button: 'Choose Font',
  search: 'Search by Fontname',
  page: {
    prev: '◄',
    next: '►'
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
    vietnamese: 'Vietnamese'
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

};

fontselectModule.constant('jdFontselectConfig', {
  googleApiKey: false
});
