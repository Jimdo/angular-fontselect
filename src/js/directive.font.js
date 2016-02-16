/* global NAME_FONTSSERVICE */
fontselectModule.directive('jdFont', [NAME_FONTSSERVICE, function(fontsService) {
  return {
    scope: {
      font: '=',
      current: '='
    },
    templateUrl: 'font.html',
    restrict: 'E',
    replace: true,
    controller: ['$scope', function($scope) {
      fontsService.load($scope.font);
    }]
  };
}]);
