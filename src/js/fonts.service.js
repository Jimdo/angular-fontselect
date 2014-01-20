/* global DEFAULT_WEBSAVE_FONTS, CATEGORY_WEBSAVE */

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
    self._fonts[CATEGORY_WEBSAVE] = angular.copy(DEFAULT_WEBSAVE_FONTS);
  },

  getAll: function() {
    return this._fonts;
  },

  add: function(fontObj, category) {
    var self = this;

    if (angular.isString(category)) {
      category = CATEGORY_WEBSAVE;
    }

    if (!self.isValidFontObject(fontObj)) {
      throw 'Invalid font object.';
    }

    self._fonts[CATEGORY_WEBSAVE].push(fontObj);
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
