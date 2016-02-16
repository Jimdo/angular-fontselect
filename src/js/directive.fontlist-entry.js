/* global FONTLIST_ENTRY_TYPE_HEADLINE, FONTLIST_ENTRY_TYPE_FONT */
var NAME_JDFONTLIST_ENTRY = 'jdFontlistEntry';

fontselectModule.directive(NAME_JDFONTLIST_ENTRY, function() {
  return {
    scope: {
      entry: '='
    },
    restrict: 'E',
    templateUrl: 'fontlist-entry.html',
    replace: true,
    link: function($scope) {
      $scope.isHeadline = $scope.entry.type === FONTLIST_ENTRY_TYPE_HEADLINE;
      $scope.isFont = $scope.entry.type === FONTLIST_ENTRY_TYPE_FONT;
    }
  };
});
