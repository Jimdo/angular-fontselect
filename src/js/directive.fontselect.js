/* global PROVIDERS, PROVIDER_WEBSAFE */
var id = 1;

fontselectModule.directive('jdFontselect', [function() {
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'fontselect.html',
    replace: true,
    controller: ['$scope', 'jdFontselect.fonts', function($scope, fontsService) {
      $scope.fonts = fontsService.getAllFonts();
      $scope.id = id++;
      $scope.providers = PROVIDERS;
      $scope.active = false;
      $scope.categories = fontsService.getCategories();
      $scope.subsets = fontsService.getSubsetNames();
      $scope.searchAttrs = [
        {
          name: 'Popularity',
          key: 'popularity',
          dir: true
        },
        {
          name: 'Alphabet',
          key: 'name',
          dir: false
        },
        {
          name: 'Latest',
          key: 'lastModified',
          dir: true
        }
      ];

      $scope.current = {
        sort: {
          attr: $scope.searchAttrs[0],
          direction: true
        },
        provider: PROVIDER_WEBSAFE,
        category: undefined,
        font: undefined,
        search: undefined,
        subsets: {
          latin: true
        }
      };

      $scope.reverseSort = function() {
        var sort = $scope.current.sort;

        sort.direction = !sort.direction;
      };

      $scope.toggle = function() {
        $scope.active = !$scope.active;
      };

      $scope.setCategoryFilter = function(category) {
        var current = $scope.current;

        if (current.category === category) {
          current.category = undefined;
        } else {
          current.category = category;
        }
      };
    }]
  };
}]);
