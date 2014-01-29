angular.module('myApp', ['jdFontselect']).directive('myApp', function() {
  return {
    restrict: 'E',
    replace: false,
    template: '<jd-fontselect />',
    controller: ['$scope', 'jdFontselect.fonts', function($scope, fontsService) {
      /* do something with $scope or the fontsService (for example, add a font) */
      fontsService.add({name: 'Foo', key: 'foo', stack: 'Foo, "Comic Sans", serif'});
    }]
  };
});
angular.bootstrap(document, ['myApp']);