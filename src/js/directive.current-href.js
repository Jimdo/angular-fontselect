/* global NAME_FONTSSERVICE, DIR_PARTIALS */
fontselectModule.directive('jdFontselectCurrentHref', [NAME_FONTSSERVICE, function(fontsService) {
  return {
    templateUrl: DIR_PARTIALS + 'current-href.html',
    restrict: 'A',
    replace: true,
    controller: ['$scope', function($scope) {
      $scope.urls = [];

      function update() {
        $scope.urls = fontsService.getUrls();
      }

      $scope.$on('jdfs.change', update);
      $scope.$on('jdfs.change.subsets', update);
    }]
  };
}]);
