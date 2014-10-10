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
var CATEGORY_SANS_SERIF = 'sansserif';

/** @const */
var CATEGORY_SERIF = 'serif';

/** @const */
var CATEGORY_HANDWRITING = 'handwriting';

/** @const */
var CATEGORY_DISPLAY = 'display';

/** @const */
var CATEGORY_OTHER = 'other';

/** @const */
var PAGE_SIZE_DEFAULT = 10;

/** @const */
var DIR_PARTIALS = 'src/partials/';

/** @const */
var NAME_CONTROLLER = '.controller';

/** @const */
var NAME_FONTSSERVICE = 'jdFontselect.fonts';

/* @const */
var NAME_PROVIDER_MANAGER = 'jdFontselectProviderManager';

/* @const */
var NAME_PREVIEW = 'jdFontselectPreview';

/** @const */
var CLOSE_EVENT = 'jdFontselectEventClose';

/** @const */
var OPEN_EVENT = 'jdFontselectEventOpen';

/** @const */
var DEFAULT_WEBSAFE_FONTS = [
  {
    name: 'Arial',
    key: 'arial',
    category: CATEGORY_SANS_SERIF,
    stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    popularity: 3,
    lastModified: '2014-01-28'
  },
  {
    name: 'Consolas',
    key: 'consolas',
    category: CATEGORY_SANS_SERIF,
    stack: 'Consolas, "Lucida Console", Monaco, monospace',
    popularity: 1,
    lastModified: '2014-02-04'
  },
  {
    name: 'Courier New',
    key: 'couriernew',
    category: CATEGORY_SERIF,
    stack: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
    popularity: 1,
    lastModified: '2014-01-28'
  },
  {
    name: 'Georgia',
    key: 'georgia',
    category: CATEGORY_SERIF,
    stack: 'Georgia, Palatino, "Palatino Linotype", Times, "Times New Roman", serif',
    popularity: 2,
    lastModified: '2014-02-04'
  },
  {
    name: 'Helvetica',
    key: 'helvetica',
    category: CATEGORY_SANS_SERIF,
    stack: 'Helvetica, "Helvetica Neue", Arial, sans-serif',
    popularity: 3,
    lastModified: '2014-02-04'
  },
  {
    name: 'Impact',
    key: 'impact',
    category: CATEGORY_DISPLAY,
    stack: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
    popularity: 3,
    lastModified: '2014-02-04'
  },
  {
    name: 'Lucida Sans',
    key: 'lucidasans',
    category: CATEGORY_SANS_SERIF,
    stack: '"Lucida Sans", "Lucida Grande", "Lucida Sans Unicode", sans-serif',
    popularity: 3,
    lastModified: '2014-02-04'
  },
  {
    name: 'Palatino',
    key: 'palatino',
    category: CATEGORY_SERIF,
    stack: 'Palatino, "Palatino Linotype", Georgia, Times, "Times New Roman", serif',
    popularity: 2,
    lastModified: '2014-02-04'
  },
  {
    name: 'Tahoma',
    key: 'tahoma',
    category: CATEGORY_SANS_SERIF,
    stack: 'Tahoma, Verdana, Geneva, sans-serif',
    popularity: 6,
    lastModified: '2014-02-04'
  },
  {
    name: 'Trebuchet',
    key: 'trebuchet',
    category: CATEGORY_SANS_SERIF,
    stack: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif',
    popularity: 6,
    lastModified: '2014-02-04'
  },
  {
    name: 'Verdana',
    key: 'verdana',
    category: CATEGORY_SANS_SERIF,
    stack: 'Verdana, Geneva, sans-serif',
    popularity: 6,
    lastModified: '2014-01-28'
  },
  {
    name: 'Times New Roman',
    key: 'timesnewroman',
    category: CATEGORY_SERIF,
    stack: 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif',
    popularity: 2,
    lastModified: '2014-01-28'
  },
  {
    name: 'Brush Script',
    key: 'brushscript',
    category: CATEGORY_HANDWRITING,
    stack: '"Brush Script MT", cursive',
    popularity: 5,
    lastModified: '2014-01-29'
  }
];

var CATEGORY_OBJECTS = {};
CATEGORY_OBJECTS[CATEGORY_SANS_SERIF] = {
  key: CATEGORY_SANS_SERIF,
  fallback: 'sans-serif'
};
CATEGORY_OBJECTS[CATEGORY_SERIF] = {
  key: CATEGORY_SERIF,
  fallback: 'serif'
};
CATEGORY_OBJECTS[CATEGORY_HANDWRITING] = {
  key: CATEGORY_HANDWRITING,
  fallback: 'cursive'
};
CATEGORY_OBJECTS[CATEGORY_DISPLAY] = {
  key: CATEGORY_DISPLAY,
  fallback: 'fantasy'
};
CATEGORY_OBJECTS[CATEGORY_OTHER] = {
  key: CATEGORY_OTHER,
  fallback: 'sans-serif'
};

/** @const */
var DEFAULT_CATEGORIES = [
  CATEGORY_OBJECTS[CATEGORY_SANS_SERIF],
  CATEGORY_OBJECTS[CATEGORY_SERIF],
  CATEGORY_OBJECTS[CATEGORY_HANDWRITING],
  CATEGORY_OBJECTS[CATEGORY_DISPLAY],
  CATEGORY_OBJECTS[CATEGORY_OTHER]
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
var VALUE_NO_FONT_STACK = false;

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
var KEY_ESCAPE = 27;

/** @const */
var KEY_ENTER = 13;

/** @const */
var KEY_UP = 38;

/** @const */
var KEY_DOWN = 40;

/** @const */
var KEY_LEFT = 37;

/** @const */
var KEY_RIGHT = 39;

/** @const */
var SCROLL_BUFFER = 30;

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
  search: '',
  subsets: {
    latin: true
  }
};

/** @const */
var TEXT_DEFAULTS = {
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

};

fontselectModule.constant('jdFontselectConfig', {
  googleApiKey: false
});
