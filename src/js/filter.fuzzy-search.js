/**
 * Fuzzy search filter for angular.
 * Remove all entries from list that do not contain the
 * characters of our search (in the right sequence)
 *
 * Allow a configurable amount of typos (default: 1)
 *
 * @author Tim Sebastian <tim.sebastian@jimdo.com>
 * @author Hannes Diercks <hannes.diercks@jimdo.com>
 */
fontselectModule.filter('fuzzySearch', function() {
  /** @const */
  var DEFAULTS = {
    teAmount: 0,
    tePercent: 0.3
  };

  return function(inputs, search, options) {
    if (!angular.isArray(inputs) || angular.isUndefined(search)) {
      return inputs;
    }

    var strict = true;
    var searches = [];

    options = angular.extend(DEFAULTS, options);

    function getRegex(str) {
      return new RegExp(str.replace(/./g, function(i) {return '([^' + i + ']*?(?:' + i + '))?'; }),'i');
    }

    var filter = function(input, matcher, length) {
      var matches = (input.match(matcher)||[]).filter(function(match, i) { return i !== 0 && match; });

      var errorAmountIsOk = (matches.length + options.teAmount) >= length;
      var errorPercentageIsOk = matches.length / length >= 1 - options.tePercent;

      return errorAmountIsOk || errorPercentageIsOk;
    };

    if (angular.isString(search)) {
      var rgx = getRegex(search);

      strict = false;

      angular.forEach(inputs[0], function(val, key) {
        if (key.substring(0, 1) === '$') {
          return;
        }
        searches.push({
          key: key,
          search: rgx,
          length: search.length
        });
      });
    } else if (angular.isObject(search)) {
      var valid = false;
      angular.forEach(search, function(s, k) {
        if (angular.isUndefined(s)) {
          return;
        }
        valid = true;
        searches.push({
          key: k,
          search: getRegex(s),
          length: s.length
        });
      });

      if (!valid) {
        return inputs;
      }
    }

    inputs = inputs.filter(function(input) {
      for (var i = 0, l = searches.length; i < l; i++) {
        var src = searches[i],
            searchVal = input[src.key] || '',
            ok = filter(searchVal, src.search, src.length);

        if (strict && !ok) {
          return false;
        } else if(ok) {
          return true;
        }
      }

      return false;
    });

    return inputs;
  };
});