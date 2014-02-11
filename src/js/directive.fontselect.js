/* global PROVIDERS, PROVIDER_WEBSAFE, NAME_FONTSSERVICE */
var id = 1;

fontselectModule.directive('jdFontselect', [NAME_FONTSSERVICE, '$rootScope', function(fontsService, $rootScope) {
  return {
    scope: {
      current: '=?state',
      selected: '=?'
    },
    restrict: 'E',
    templateUrl: 'fontselect.html',
    replace: true,
    controller: ['$scope', function($scope) {
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

      $scope.selected = $scope.selected || {};

      $scope.current = angular.extend({
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
      }, $scope.current || {});

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
    }],
    link: function(scope) {

      scope.$watch('current.font', function(newFont, oldFont) {
        if (oldFont !== newFont && angular.isObject(scope.current.font)) {
          newFont = scope.current.font;

          if (angular.isObject(oldFont) && oldFont.used) {
            oldFont.used--;
          }
          if (!angular.isObject(newFont) || !newFont.used) {
            newFont.used = 1;
          } else {
            newFont.used++;
          }

          scope.selected.name = newFont.name;
          scope.selected.stack = newFont.stack;
          $rootScope.$broadcast('jdfs.change', scope.selected);
        }
      });
    }
  };
}]);
