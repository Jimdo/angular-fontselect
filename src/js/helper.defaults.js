/* jshint unused: false */

/** @const */
var PROVIDER_WEBSAFE = 'websafe';

/** @const */
var PROVIDER_GOOGLE = 'google';

/** @const */
var PROVIDERS = {};
PROVIDERS[PROVIDER_WEBSAFE] = true;
PROVIDERS[PROVIDER_GOOGLE] = true;

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
var DIRECTION_NEXT = 'next';

/** @const */
var DIRECTION_PREVIOUS = 'prev';

/** @const */
var REQUIRED_FONT_OBJECT_KEYS = [
  'name',
  'key',
  'stack'
];

/** @const */
var SUPPORT_KHMER = false;

/** @const */
var METHOD_GET = 'get';

/** @const */
var URL_GOOGLE_FONTS_API = 'https://www.googleapis.com/webfonts/v1/webfonts';

/** @const */
var URL_GOOGLE_FONTS_CSS = 'http://fonts.googleapis.com/css';

/** @const */
var SUBSET_CYRILLIC = 'cyrillic';

/** @const */
var SUBSET_CYRILLIC_EXT = 'cyrillic-ext';

/** @const */
var SUBSET_GREEK = 'greek';

/** @const */
var SUBSET_GREEK_EXT = 'greek-ext';

/** @const */
var SUBSET_LATIN = 'latin';

/** @const */
var SUBSET_LATIN_EXT = 'latin-ext';

/** @const */
var SUBSET_VIETNAMESE = 'vietnamese';

/** @const */
var SUBSET_PRIORITY = [
  SUBSET_LATIN,
  SUBSET_LATIN_EXT,
  SUBSET_GREEK,
  SUBSET_GREEK_EXT,
  SUBSET_CYRILLIC,
  SUBSET_CYRILLIC_EXT,
  SUBSET_VIETNAMESE
];

/** @const */
var VARIANTS_REGULAR = ['regular', '400', '300', '500'];

/** @const */
var VARIANTS_LIGHT = ['light', '100', '200'];

/** @const */
var VARIANTS_BOLD = ['bold', '600', '700', '800', '900'];

/** @const */
var VARIANTS_ITALIC = ['italic', '400italic', '300italic', '500italic'];

/** @const */
var VARIANTS_LIGHT_ITALIC = ['lightitalic', '100italic', '200italic'];

/** @const */
var VARIANTS_BOLD_ITALIC = ['bolditalic', '600italic', '700italic', '800italic', '900italic'];

/** @const */
var VARIANT_PRIORITY = VARIANTS_REGULAR.concat(
  VARIANTS_LIGHT,
  VARIANTS_BOLD,
  VARIANTS_ITALIC,
  VARIANTS_LIGHT_ITALIC,
  VARIANTS_BOLD_ITALIC
);

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
  providers: PROVIDERS,
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
  providerLabel: 'Providers',
  subsetLabel: 'Subsets',
  styleLabel: 'Font Styles',
  pageLabel: 'Page: ',
  fontFabel: 'Fonts: ',
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
