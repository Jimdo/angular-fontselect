angular.module('myApp', ['jdFontselect']).directive('myApp', function() {
  return {
    restrict: 'E',
    replace: false,
    template: '<h1 style="font-family: {{selected.stack}}">Angular Fontselection, by Jimdo</h1>' +
      '<jd-fontselect selected="selected"></jdFontselect>',
    controller: ['$scope', 'jdFontselect.fonts', function($scope, fontsService) {
      $scope.selected = {};
      /* do something with $scope or the fontsService (for example, add a font) */
      fontsService.add({name: 'Foo', key: 'foo', stack: 'Foo, "Comic Sans", serif'});
    }]
  };
});
angular.bootstrap(document, ['myApp']);