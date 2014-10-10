/* global NAME_PREVIEW */
fontselectModule.directive('jdFont', [NAME_PREVIEW, function(preview) {
  return {
    templateUrl: 'font.html',
    restrict: 'E',
    replace: true,
    controller: ['$scope', function($scope) {
      if ($scope.active) {
        preview.load($scope.font);
      } else {
        var destroy = $scope.$watch('active', function(newActive) {
          if (newActive) {
            preview.load($scope.font);
            destroy();
          }
        });
      }
    }]
  };
}]);
