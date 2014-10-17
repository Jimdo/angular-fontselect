var NAME_JDMETA = 'jdMeta';

fontselectModule.directive(NAME_JDMETA, function() {
  return {
    restrict: 'E',
    templateUrl: 'meta.html',
    replace: true
  };
});
