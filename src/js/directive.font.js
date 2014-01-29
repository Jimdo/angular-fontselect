fontselectModule.directive('jdFont', ['jdFontselect.fonts', function(fontsService) {
  return {
    templateUrl: 'font.html',
    restrict: 'E',
    replace: true,
    controller: ['$scope', function($scope) {
      fontsService.load($scope.font, $scope.providerName);
    }]
  };
}]);
