/* global NAME_FONTSSERVICE */

fontselectModule.directive('jdFontselectCurrentHref', [NAME_FONTSSERVICE, function(fontsService) {
  return {
    templateUrl: 'current-href.html',
    restrict: 'A',
    replace: true,
    controller: ['$scope', function($scope) {
      $scope.urls = [];
      $scope.$on('jdfs.change', function() {
        $scope.urls = fontsService.getUrls();
      });
    }]
  };
}]);
