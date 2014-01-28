/* jshint unused: false */

/** @const */
var PROVIDER_WEBSAFE = 'Websafe Fonts';

/** @const */
var PROVIDER_GOOGLE = 'Google Fonts';

/** @const */
var PROVIDERS = [
  PROVIDER_WEBSAFE,
  PROVIDER_GOOGLE
];

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
    name: 'Courier New',
    key: 'couriernew',
    category: 'other',
    stack: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace',
    popularity: 1,
    lastModified: '2014-01-28'
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

fontselectModule.constant('jdFontselectConfig', {
  googleApiKey: false
});
