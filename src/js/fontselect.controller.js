var id = 1;

var FontselectController = function($scope, fonts) {
  var self = this;

  self.fonts = fonts;
  $scope.fonts = fonts.getAll();
  $scope.id = id++;
  self.$scope = $scope;
  self.toScope();
  self.name = 'FontselectController';
  self._construct();
};

FontselectController.prototype = {
  _construct: function() {
    var self = this;
    var $scope = self.$scope;

    $scope.categories = [
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
    $scope.data = {
      currentFont: undefined,
      category: undefined
    };
    $scope.active = false;
    $scope.setCategoryFilter = _bind(self.setCategoryFilter, self);
    $scope.toggle = _bind(self.toggle, self);
  },
  /* Workaround to be able to get the instance from $scope in tests. */
  toScope: function() {},
  
  toggle: function() {
    var $scope = this.$scope;

    $scope.active = !$scope.active;
  },

  setCategoryFilter: function(category) {
    var data = this.$scope.data;

    if (data.category === category) {
      data.category = undefined;
    } else {
      data.category = category;
    }
  },

  _resetIDs: function() {
    id = 1;
  }
};

FontselectController.$inject = ['$scope', 'fontselect.fonts'];
