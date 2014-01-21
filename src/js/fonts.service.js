/* global DEFAULT_WEBSAFE_FONTS, CATEGORY_WEBSAFE */

/** @const */
var REQUIRED_FONT_OBJECT_KEYS = [
  'name',
  'key',
  'stack'
];

function FontsService($scope) {
  var self = this;

  self.$scope = $scope;
  self._init();

  return self;
}

FontsService.prototype = {
  _init: function() {
    var self = this;
    
    self._fonts = self._fonts || {};
    self._fonts[CATEGORY_WEBSAFE] = angular.copy(DEFAULT_WEBSAFE_FONTS);
  },

  getAll: function() {
    return this._fonts;
  },

  add: function(fontObj, category) {
    var self = this;

    if (angular.isString(category)) {
      category = CATEGORY_WEBSAFE;
    }

    if (!self.isValidFontObject(fontObj)) {
      throw 'Invalid font object.';
    }

    self._fonts[CATEGORY_WEBSAFE].push(fontObj);
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
  }
};

fontselectModule.factory(
  'fontselect.fonts',
  ['$rootScope', function($rootScope) { return new FontsService($rootScope); }]
);
