fontselectModule.directive('jdFontlist', [function() {
  return {
    scope: {
      id: '&fsid',
      fonts: '=',
      current: '=',
      provider: '@'
    },
    restrict: 'E',
    templateUrl: 'fontlist.html',
    replace: true,
    controller: ['$scope', '$filter', function($scope, $filter) {
      $scope.page = {
        size: 30,
        current: 0
      };
      
      $scope.setCurrentPage = function(currentPage) {
        $scope.page.current = currentPage;
      };
      $scope.getPages = function() {
        var pages = new Array($scope.numberOfPages());

        /* Display the page buttons only if we have at least two pages. */
        if (pages.length <= 1) {
          return [];
        }
        return pages;
      };

      $scope.numberOfPages = function() {
        if (!angular.isArray($scope.fonts)) {
          return 0;
        }

        var filteredFonts = $filter('filter')($scope.fonts, $scope.current.search);
        filteredFonts = $filter('filter')($scope.fonts, {category: $scope.current.category}, true);

        return Math.ceil(filteredFonts.length / $scope.page.size);
      };
    }]
  };
}]);
