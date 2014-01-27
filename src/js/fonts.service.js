/* global DEFAULT_WEBSAFE_FONTS, PROVIDER_WEBSAFE, PROVIDER_GOOGLE */

/** @const */
var REQUIRED_FONT_OBJECT_KEYS = [
  'name',
  'key',
  'stack'
];

function FontsService($http, config) {
  var self = this;

  self.config = config;
  self.$http = $http;
  self._init();

  return self;
}

FontsService.prototype = {
  _init: function() {
    var self = this;
    
    self._fonts = self._fonts || {};
    self._map = {};
    self._addDefaultFonts();
    self._getGoogleFonts();
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
        key: 'serif'
      },
      {
        name: 'Sans-serif',
        key: 'sansserif'
      },
      {
        name: 'Handwriting',
        key: 'handwriting'
      },
      {
        name: 'Other',
        key: 'other'
      }
    ];
  },

  _getGoogleFonts: function() {
    var self = this;

    if (!self.config.googleApiKey) {
      return;
    }

    self.$http({
      method: 'GET',
      url: 'https://www.googleapis.com/webfonts/v1/webfonts',
      params: {
        key: self.config.googleApiKey
      }
    }).success(function(response) {
      angular.forEach(response.items, function(font) {
        self.add({
          name: font.family,
          key: _createKey(font.family),
          stack: '"' + font.family + '" sans-serif'
        }, PROVIDER_GOOGLE);
      });
    });
  },

  _addDefaultFonts: function() {
    var self = this;

    angular.forEach(DEFAULT_WEBSAFE_FONTS, function(font) {
      self.add(font);
    });
  }
};

fontselectModule.factory(
  'jdFontselect.fonts',
  ['$http', 'jdFontselectConfig', function($http, config) { return new FontsService($http, config); }]
);
