/* global PROVIDERS, PROVIDER_WEBSAFE */
var id = 1;

var FontselectController = function($scope, fontsService) {
  var self = this;

  self.fontsService = fontsService;
  self.$scope = $scope;
  self.name = 'FontselectController';
  self._construct();
};

FontselectController.prototype = {
  _construct: function() {
    var self = this;
    var $scope = self.$scope;

    $scope.fonts = self.fontsService.getAllFonts();
    $scope.id = id++;
    $scope.providers = PROVIDERS;
    $scope.active = false;
    $scope.categories = self.fontsService.getCategories();
    $scope.current = {
      provider: PROVIDER_WEBSAFE,
      category: undefined,
      font: undefined,
      search: undefined
    };

    $scope.setCategoryFilter = _bind(self.setCategoryFilter, self);
    $scope.toggle = _bind(self.toggle, self);
  },

  toggle: function() {
    var $scope = this.$scope;

    $scope.active = !$scope.active;
  },

  setCategoryFilter: function(category) {
    var current = this.$scope.current;

    if (current.category === category) {
      current.category = undefined;
    } else {
      current.category = category;
    }
  },

  _resetIDs: function() {
    id = 1;
  }
};

FontselectController.$inject = ['$scope', 'jdFontselect.fonts'];
