/* global DEFAULT_WEBSAFE_FONTS, PROVIDER_WEBSAFE, PROVIDER_GOOGLE, GOOGLE_FONT_CATEGORIES */

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
var URL_WEBFONTLOADER = '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js';

var _webFontLoaderInitiated = false;

var _webFontLoaderDeferred, _webFontLoaderPromise;


function FontsService($http, $q, config) {
  var self = this;

  self.config = config;
  self.$http = $http;
  self.$q = $q;

  _webFontLoaderDeferred = $q.defer();
  _webFontLoaderPromise = _webFontLoaderDeferred.promise;
  
  self._init();

  return self;
}

FontsService.prototype = {
  _init: function() {
    var self = this;
    
    self._fonts = self._fonts || {};
    self._map = {};
    self._addDefaultFonts();
  },

  getAllFonts: function() {
    return this._fonts;
  },

  add: function(fontObj, provider) {
    var self = this;

    if (!angular.isString(provider)) {
      provider = PROVIDER_WEBSAFE;
    }

    if (!self.isValidFontObject(fontObj)) {
      throw 'Invalid font object.';
    }

    if (!angular.isArray(self._fonts[provider])) {
      self._fonts[provider] = [];
    }

    if (!angular.isObject(self._map[provider])) {
      self._map[provider] = {};
    }

    var index = self._fonts[provider].push(fontObj)-1;

    self._map[provider][fontObj.key] = index;
  },

  getFontByKey: function(key, provider) {
    var self = this;
    
    if (!angular.isString(provider)) {
      throw 'Provider is not set.';
    }

    try {
      return self._fonts[provider][self._map[provider][key]];
    } catch (e) {
      throw 'Font "' + key + '" not found in "' + provider + '".';
    }
  },

  isValidFontObject: function(fontObj) {
    if (!angular.isObject(fontObj)) {
      return false;
    }

    var valid = true;

    angular.forEach(REQUIRED_FONT_OBJECT_KEYS, function(key) {
      if (angular.isUndefined(fontObj[key])) {
        valid = false;
      }
    });

    return valid;
  },

  getCategories: function() {
    return [
      {
        name: 'Serif',
        key: 'serif',
        fallback: 'serif'
      },
      {
        name: 'Sans Serif',
        key: 'sansserif',
        fallback: 'sans-serif'
      },
      {
        name: 'Handwriting',
        key: 'handwriting',
        fallback: 'cursive'
        
      },
      {
        name: 'Display',
        key: 'display',
        fallback: 'cursive'
      },
      {
        name: 'Other',
        key: 'other',
        fallback: 'sans-serif'
      }
    ];
  },

  load: function(font, provider) {
    if (font.loaded) {
      return;
    }

    font.loaded = true;

    if (provider === PROVIDER_WEBSAFE) {
      return;
    }

    this['load' + provider](font);
  },

  _initWebFontLoader: function() {
    if (_webFontLoaderInitiated) {
      return;
    }

    _webFontLoaderInitiated = true;

    yepnope({
      test: typeof WebFont !== 'undefined',
      nope: URL_WEBFONTLOADER,
      complete: function() {
        _webFontLoaderDeferred.resolve(WebFont);
      }
    });
  },

  _initGoogleFonts: function() {
    var self = this;

    if (!self.config.googleApiKey) {
      return;
    }

    self._initWebFontLoader();

    self.$http({
      method: METHOD_GET,
      url: URL_GOOGLE_FONTS_API,
      params: {
        key: self.config.googleApiKey
      }
    }).success(function(response) {
      angular.forEach(response.items, function(font) {
        var category = self._getGoogleFontCat(font.family);

        self.add({
          name: font.family,
          key: _createKey(font.family),
          stack: '"' + font.family + '" ' + category.fallback,
          category: category.key
        }, PROVIDER_GOOGLE);
      });
    });
  },

  _getGoogleFontCat: function(font) {
    var self = this;

    var categories = self.getCategories();
    for (var i = 0, l = categories.length; i < l; i++) {
      var category = categories[i];

      if (typeof GOOGLE_FONT_CATEGORIES[category.name] === 'undefined') {
        continue;
      }

      if (GOOGLE_FONT_CATEGORIES[category.name].indexOf(font) >= 0) {
        return category;
      }
    }

    // console.error('Category not Found:', font);
    return categories[5];
  },

  _addDefaultFonts: function() {
    var self = this;

    angular.forEach(DEFAULT_WEBSAFE_FONTS, function(font) {
      self.add(font);
    });
  }
};

FontsService.prototype['load' + PROVIDER_GOOGLE] = function(font) {
  _webFontLoaderPromise.then(function(WebFont) {
    WebFont.load({
      google: {
        families: [font.name],
        text: font.name,
      }
    });
  });
};

fontselectModule.factory(
  'jdFontselect.fonts',
  ['$http', '$q', 'jdFontselectConfig', function($http, $q, config) { return new FontsService($http, $q, config); }]
);
