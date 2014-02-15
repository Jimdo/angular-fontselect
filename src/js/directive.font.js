/* global DIR_PARTIALS */
fontselectModule.directive('jdFont', ['jdFontselect.fonts', function(fontsService) {
  return {
    templateUrl: DIR_PARTIALS + 'font.html',
    restrict: 'E',
    replace: true,
    controller: ['$scope', function($scope) {
      fontsService.load($scope.font, $scope.providerName);
    }]
  };
}]);
