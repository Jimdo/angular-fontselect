/* From: http://tech.small-improvements.com/2013/09/10/angularjs-performance-with-large-lists/ */
fontselectModule.filter('startFrom', function() {
  return function(input, start) {
    if (!angular.isArray(input)) {
      return input;
    }

    return input.slice(start);
  };
});
