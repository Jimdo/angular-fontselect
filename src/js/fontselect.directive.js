/* global FontselectController */
fontselectModule.directive('fontselect', [function() {
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'fontselect.html',
    replace: true,
    controller: FontselectController
  };
}]);
