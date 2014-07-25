/**
 * Get fonts by matching stacks.
 *
 * @author Tim Sebastian <tim.sebastian@jimdo.com>
 * @author Hannes Diercks <hannes.diercks@jimdo.com>
 */
fontselectModule.filter('stackSearch', function() {
  var listCache = {};

  function createInputId(input) {
    return '' + input.length + input[0].key + input[input.length - 1].key;
  }

  function stackSearchFilter(input, inputStack) {
    var inputId, list, normalizedInputStack;
    if (!angular.isArray(input) || !input.length) {
      return input;
    }

    inputStack = inputStack.toLowerCase();

    normalizedInputStack = stackSearchFilter.normalizeStack(inputStack);

    inputId = createInputId(input);
    if (listCache[inputId]) {
      list = listCache[inputId];
    } else {
      list = listCache[inputId] = stackSearchFilter.createWeightedFontList(input);
    }

    for (var i = 0, l = normalizedInputStack.length; i < l; i++) {
      if (list[normalizedInputStack[i]]) {
        return list[normalizedInputStack[i]].fonts;
      }
    }

    return [];
  }

  stackSearchFilter.normalizeStack = function(stack) {
    var normalizedStack = [];
    angular.forEach(stack.split(','), function(token) {
      normalizedStack.push(token.replace(/^[ '"]*|[ '"]*$/g, ''));
    });
    return normalizedStack;
  };

  stackSearchFilter.createWeightedFontList = function(input) {
    var list = {};

    input.forEach(function(fontObj) {
      var normalizedStack = stackSearchFilter.normalizeStack(fontObj.stack.toLowerCase());
      normalizedStack.forEach(function(stackfont, index){
        if (!list[stackfont] || list[stackfont].pos > index) {
          list[stackfont] = {
            fonts: [fontObj],
            pos: index
          };
        } else if(list[stackfont].pos === index) {
          list[stackfont].fonts.push(fontObj);
        }
      });
    });

    return list;
  };

  return stackSearchFilter;
});
