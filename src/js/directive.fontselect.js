/* global PROVIDERS, STATE_DEFAULTS, NAME_FONTSSERVICE, DIR_PARTIALS, SORT_ATTRIBUTES, TEXT_DEFAULTS */
/* global KEY_ESCAPE, VALUE_NO_FONT_STACK */
var id = 1;

/** @const */
var PLEASE_SET_FONT_BY_STACK = '_PSFBS';

fontselectModule.directive('jdFontselect', [NAME_FONTSSERVICE, function(fontsService) {
  return {
    scope: {
      current: '=?state',
      stack: '=?',
      name: '=?',
      rawText: '@?text',
      text: '=?textObj',
      onInit: '&?'
    },
    restrict: 'E',
    templateUrl: DIR_PARTIALS + 'fontselect.html',
    replace: true,
    controller: ['$scope', '$element', '$timeout', function($scope, $element, $timeout) {
      $scope.fonts = fontsService.getAllFonts();
      $scope.id = id++;
      $scope.providers = angular.copy(PROVIDERS);
      $scope.active = false;
      $scope.categories = fontsService.getCategories();
      $scope.subsets = fontsService.getSubsetNames();
      $scope.sortAttrs = SORT_ATTRIBUTES;
      $scope.name = '';
      if (angular.isUndefined($scope.stack)) {
        $scope.stack = VALUE_NO_FONT_STACK;
      }

      $scope.text = angular.extend(angular.copy(TEXT_DEFAULTS), $scope.text || {});
      if ($scope.rawText) {
        $scope.text = angular.extend($scope.text , $scope.$eval($scope.rawText) || {});
      }

      function setState(extend) {
        var globalSubsets, globalProviders;
        $scope.current = angular.extend(
          angular.copy(STATE_DEFAULTS),
          extend || {}
        );

        if (!$scope.current.sort.attr) {
          $scope.current.sort.attr = SORT_ATTRIBUTES[0];
        }

        if (angular.isObject($scope.current.font)) {
          $scope.stack = $scope.current.font.stack;
          $scope.name = $scope.current.font.name;
        }

        globalSubsets = fontsService.getSubsets();
        $scope.current.subsets = _objLength(globalSubsets) ?
          globalSubsets : fontsService.setSubsets($scope.current.subsets);

        globalProviders = fontsService.getProviders();
        $scope.current.providers = _objLength(globalProviders) ?
          globalProviders : fontsService.setProviders($scope.current.providers);
      }

      function isDescendant(parent, child) {
        var node = child;
        while (node !== null) {
          if (node === parent) {
            return true;
          }
          node = node.parentNode;
        }
        return false;
      }

      function close() {
        $scope.toggle();
        $scope.$digest();
      }

      $scope.reverseSort = function() {
        var sort = $scope.current.sort;

        sort.direction = !sort.direction;
      };

      $scope.toggle = function() {
        $scope.active = !$scope.active;

        if ($scope.active) {
          $scope.setFocus();
        }
      };

      $scope.toName = _createName;

      $scope.setFocus = function() {
        $timeout(function() {
          $element[0].querySelector('.jdfs-search').focus();
        });
      };

      document.addEventListener('click', function(event) {
        if ($scope.active && !isDescendant($element[0], event.target)) {
          close();
        }
      });

      document.addEventListener('keyup', function(event) {
        if ($scope.active && event.keyCode === KEY_ESCAPE) {
          close();
        }
      });

      $scope.setCategoryFilter = function(category) {
        var current = $scope.current;

        if (current.category === category) {
          current.category = undefined;
        } else {
          current.category = category;
        }
      };

      $scope.reset = function() {
        setState();
      };

      $scope._setSelected = function(font) {
        if (angular.isObject(font)) {
          $scope.name = font.name;
          $scope.stack = font.stack;
        } else {
          $scope.name = '';
          $scope.stack = VALUE_NO_FONT_STACK;
        }
      };

      /* INITIALIZE */
      if (angular.isObject($scope.current)) {
        setState($scope.current);
      }

      if ($scope.stack.length) {
        $scope[PLEASE_SET_FONT_BY_STACK] = $scope.stack;
      }

      $scope.onInit({$scope: $scope, $element: $element});
    }],

    link: function(scope) {

      scope.$watch('current.font', function(newFont, oldFont) {
        if (!angular.isObject(scope.current)) {
          scope.reset();
        }

        if (oldFont !== newFont) {
          if (angular.isObject(scope.current.font)) {
            newFont = scope.current.font;
          }

          if (angular.isObject(oldFont) && oldFont.used) {
            oldFont.used--;
          }
          if (angular.isObject(newFont)) {
            if (!newFont.used) {
              newFont.used = 1;
            } else {
              newFont.used++;
            }
          }

          scope._setSelected(newFont);
          fontsService.updateImports();
        }
      });

      scope.$watch('current.subsets', function(newSubsets, oldSubsets) {
        if (newSubsets !== oldSubsets) {
          fontsService.updateImports();
        }
      }, true);

      scope.$watch('stack', function(newStack, oldStack) {
        var font;

        if (newStack === oldStack || (scope.current.font && newStack === scope.current.font.stack)) {
          return;
        }

        if (newStack && newStack.length) {
          font = fontsService.getFontByStack(newStack);
        }

        if (font) {
          scope.current.font = font;
        } else {
          scope.reset();
        }
      });

      if (scope[PLEASE_SET_FONT_BY_STACK]) {
        var destroy = scope.$watch('fonts', function() {
          var current = scope.current;
          try {
            var font = fontsService.getFontByStack(scope[PLEASE_SET_FONT_BY_STACK]);
            if (font) {
              current.font = font;
              delete scope[PLEASE_SET_FONT_BY_STACK];
              destroy();
            }
          } catch (e) {}
        }, true);
      }
    }
  };
}]);
