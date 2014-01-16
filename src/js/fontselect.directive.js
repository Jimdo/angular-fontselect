/* global FontselectController */
angular.module('fontselect.module').directive('fontselect', [function() {
  return {
    restrict: 'E',
    templateUrl: 'fontselect.html',
    replace: true,
    controller: FontselectController
  };
}]);
