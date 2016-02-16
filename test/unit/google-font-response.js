/* jshint unused: false */

/** @const */
var SAMPLE_URL = 'http://example.org';

/** @const */
var GOOGLE_FONTS_RESPONSE = {
  items: [
    {
      kind: 'webfonts#webfont',
      family: 'Open Sans',
      variants: ['300', '300italic', 'regular', 'italic', '600', '600italic', '700', '700italic', '800', '800italic'],
      subsets: ['latin-ext', 'latin', 'greek', 'vietnamese', 'cyrillic-ext', 'cyrillic', 'greek-ext'],
      version: 'v7',
      lastModified: '2014-01-07',
      files: {
        '300': SAMPLE_URL,
        '600': SAMPLE_URL,
        '700': SAMPLE_URL,
        '800': SAMPLE_URL,
        '300italic': SAMPLE_URL,
        'regular': SAMPLE_URL,
        'italic': SAMPLE_URL,
        '600italic': SAMPLE_URL,
        '700italic': SAMPLE_URL,
        '800italic': SAMPLE_URL
      }
    },
    {
      kind: 'webfonts#webfont',
      family: 'Roboto',
      variants: ['100', '100italic', '300', '300italic', 'regular',
        'italic', '500', '500italic', '700', '700italic', '900', '900italic'
      ],
      subsets: ['latin-ext', 'latin', 'greek', 'vietnamese', 'cyrillic-ext', 'cyrillic', 'greek-ext'],
      version: 'v10',
      lastModified: '2014-01-07',
      files: {
        '100': SAMPLE_URL,
        '300': SAMPLE_URL,
        '500': SAMPLE_URL,
        '700': SAMPLE_URL,
        '900': SAMPLE_URL,
        '100italic': SAMPLE_URL,
        '300italic': SAMPLE_URL,
        'regular': SAMPLE_URL,
        'italic': SAMPLE_URL,
        '500italic': SAMPLE_URL,
        '700italic': SAMPLE_URL,
        '900italic': SAMPLE_URL
      }
    },
    {
      kind: 'webfonts#webfont',
      family: 'Oswald',
      variants: ['300','regular','700'],
      subsets: ['latin-ext','latin'],
      version: 'v8',
      lastModified: '2014-01-07',
      files: {
        '300': SAMPLE_URL,
        '700': SAMPLE_URL,
        'regular': SAMPLE_URL
      }
    },
    {
      kind: 'webfonts#webfont',
      family: 'Droid Sans',
      variants: ['regular','700'],
      subsets: ['latin'],
      version: 'v4',
      lastModified: '2014-01-07',
      files: {
        '700': SAMPLE_URL,
        'regular': SAMPLE_URL
      }
    }
  ]
};
