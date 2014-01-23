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
    self._fonts[PROVIDER_WEBSAFE] = angular.copy(DEFAULT_WEBSAFE_FONTS);
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

    self._fonts[provider].push(fontObj);
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

  _createFontKey: function(name) {
    return name.toLowerCase().replace(/[^a-z]/g, '-');
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
          key: self._createFontKey(font.family),
          stack: '"' + font.family + '" sans-serif'
        }, PROVIDER_GOOGLE);
      });
    });
  }
};

fontselectModule.factory(
  'jdFontselect.fonts',
  ['$http', 'jdFontselectConfig', function($http, config) { return new FontsService($http, config); }]
);
