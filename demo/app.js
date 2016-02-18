angular.module('jdFontselect.app', ['jdFontselect']).run(function($rootScope) {
  $rootScope.header = '"Underdog", fantasy, "google"';
  $rootScope.content = '"Open Sans", sans-serif, "google"';
  $rootScope.footer = '"Mate", serif, "google"';
}).config(["jdfsCuratedFontsProvider", function (jdfsCuratedFontsProvider) {
  jdfsCuratedFontsProvider.setCuratedFontKeys(['websafe.timesnewroman', 'google.alef']);
}])
angular.bootstrap(document, ['jdFontselect.app']);
