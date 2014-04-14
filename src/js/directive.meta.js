/* global  DIR_PARTIALS */
var NAME_JDMETA = 'jdMeta';

fontselectModule.directive(NAME_JDMETA, function() {
  return {
    restrict: 'E',
    templateUrl: DIR_PARTIALS + 'meta.html',
    replace: true
  };
});
