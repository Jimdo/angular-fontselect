
var FontselectController = function($scope, fonts) {
  var self = this;

  self.fonts = fonts;
  $scope.fonts = fonts.getAll();
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
    $scope.toggle = _bind(self.toggle, self);
  },
  /* Workaround to be able to get the instance from $scope in tests. */
  toScope: function() {},
  
  toggle: function() {
    var $scope = this.$scope;

    $scope.active = !$scope.active;
  }
};

FontselectController.$inject = ['$scope', 'fontselect.fonts'];
