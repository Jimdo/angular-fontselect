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
  var IGNORE_TYPING_ERRORS_AMOUNT = 1;

  return function(input, search) {
    if (!angular.isString(search) || search.length === 0) {
      return input;
    }

    return input.filter(function(font) {
      var src = search;

      if (IGNORE_TYPING_ERRORS_AMOUNT) {
        for (var i = 0; i < IGNORE_TYPING_ERRORS_AMOUNT; i++) {
          src = src.replace(new RegExp('[^' + font.name + ']', 'i'), '');
        }
      }
      return new RegExp(src.split('').join('.*'), 'i').test(font.name);
    });
  };
});