var app = angular.module('e2eApp', ['jdFontselect']);
app.controller('e2ehelper', function($scope) {
  $scope.second = false;

  var events = [];
  $scope.onOpenA = function() {
    events.push('openA');
  };

  $scope.onOpenB = function() {
    events.push('openB');
  };

  $scope.onCloseA = function() {
    events.push('closeA');
  };

  $scope.onCloseB = function() {
    events.push('closeB');
  };

  $scope.events = function() {
    return events.join(',');
  };
});

angular.bootstrap(document, ['e2eApp']);
