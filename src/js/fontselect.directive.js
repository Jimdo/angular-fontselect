/* global FontselectController */
fontselectModule.directive('jdFontselect', [function() {
  return {
    scope: {},
    restrict: 'E',
    templateUrl: 'fontselect.html',
    replace: true,
    controller: FontselectController
  };
}]);
