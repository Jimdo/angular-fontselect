/** @const */
var CATEGORY_WEBSAVE = 'websave';

/** @const */
var DEFAULT_WEBSAVE_FONTS = [
  {
    name: 'Arial',
    key: 'arial',
    stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif'
  },
  {
    name: 'Lucida Grande',
    key: 'lucidagrande',
    stack: '"Lucida Bright", Georgia, serif'
  },
  {
    name: 'Verdana',
    key: 'verdana',
    stack: 'Verdana, Geneva, sans-serif'
  },
  {
    name: 'Times New Roman',
    key: 'timesnewroman',
    stack: 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif'
  },
  {
    name: 'Courier New',
    key: 'couriernew',
    stack: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace'
  }
];

var FontselectController = function($scope) {
  var self = this;

  self.$scope = $scope;
  self.toScope();
  self.name = 'FontselectController';
  self._construct();
};

FontselectController.prototype = {
  _construct: function() {
    var self = this;
    var $scope = self.$scope;

    $scope.active = false;
    $scope.currentFont = 'something';
    $scope.fonts = {};
    self.populateFonts();
    $scope.toggle = _bind(self.toggle, self);
  },
  /* Workaround to be able to get the instance from $scope in tests. */
  toScope: function() {},
  
  toggle: function() {
    var $scope = this.$scope;

    $scope.active = !$scope.active;
  },

  populateFonts: function() {
    var fonts = this.$scope.fonts;

    fonts[CATEGORY_WEBSAVE] = DEFAULT_WEBSAVE_FONTS;
  }
};

FontselectController.$inject = ['$scope'];
