fontselectModule.filter('hasAllSubsets', function() {
  return function(input, subsets) {
    if (!angular.isArray(input)) {
      return input;
    }

    function hasAllSubsets(font) {
      var allOK = true;

      angular.forEach(subsets, function(active, key) {
        if (!active || !allOK) {
          return;
        }

        if (font.subsets.indexOf(key) < 0) {
          allOK = false;
        }
      });

      return allOK;
    }

    return input.filter(function(font) {
      if (angular.isUndefined(font.subsets)) {
        // TODO: ERROR
        // console.error('Font ' + font.name + ' is missing subset information.');
        return true;
      }

      return angular.isObject(font) && hasAllSubsets(font);
    });
  };
});
