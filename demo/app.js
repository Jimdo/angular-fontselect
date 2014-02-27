angular.module('jdFontselect.app', ['jdFontselect']).run(function($rootScope) {
  $rootScope.header = '"Underdog", cursive, "google"';
  $rootScope.content = '"Open Sans", sans-serif, "google"';
  $rootScope.footer = '"Mate", serif, "google"';
});
angular.bootstrap(document, ['jdFontselect.app']);
