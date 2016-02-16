/* global NAME_FONTSSERVICE */
fontselectModule.directive('jdFont', [NAME_FONTSSERVICE, function(fontsService) {
  return {
    scope: {
      font: '=',
      active: '='
    },
    templateUrl: 'font.html',
    restrict: 'E',
    replace: true,
    controller: ['$scope', function($scope) {
      if ($scope.active) {
        fontsService.load($scope.font);
      } else {
        var destroy = $scope.$watch('active', function(newActive) {
          if (newActive) {
            fontsService.load($scope.font);
            destroy();
          }
        });
      }
    }]
  };
}]);
