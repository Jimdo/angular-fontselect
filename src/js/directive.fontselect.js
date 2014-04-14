/* global STATE_DEFAULTS, NAME_FONTSSERVICE, DIR_PARTIALS, SORT_ATTRIBUTES, TEXT_DEFAULTS */
/* global KEY_ESCAPE, VALUE_NO_FONT_STACK */
var id = 1;

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
      $scope.stylesActive = true;
      $scope.settingsActive = false;
      $scope.active = false;
      $scope.searching = false;
      $scope.categories = fontsService.getCategories();
      $scope.sortAttrs = SORT_ATTRIBUTES;
      $scope.name = '';
      $scope.meta = {};
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

        if (!$scope.active) {
          $scope.searching = false;
        }
      };

      $scope.toggleSearch = function() {
        $scope.active = true;

        $scope.searching = !$scope.searching;

        if ($scope.searching) {
          $scope.setFocus();
        }
      };

      $scope.tryUnfocusSearch = function() {
        if ($scope.searching && $scope.current.search.length === 0) {
          $scope.searching = false;
        }
      };

      $scope.resetSearch = function() {
        $scope.current.search = '';
        if ($scope.searching) {
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

      $scope.toggleSettings = function() {
        $scope.settingsActive = true;
        $scope.stylesActive = false;
      };

      $scope.toggleStyles = function() {
        $scope.stylesActive = true;
        $scope.settingsActive = false;
      };

      /* INITIALIZE */
      if (angular.isObject($scope.current)) {
        setState($scope.current);
      }

      if ($scope.stack.length) {
        try {
          var font = fontsService.getFontByStack($scope.stack);
          /* Since we're setting the font now before watchers are initiated, we need to update usage by ourself. */
          fontsService.updateUsage(font);
          setState({font: font});
        } catch (e) {
          fontsService.getFontByStackAsync($scope.stack).then(function(font) {
            setState({font: font});
          });
        }
      }

      $scope.onInit({$scope: $scope, $element: $element});
    }],

    link: function(scope) {
      scope.$watch('current.font', function(newFont, oldFont) {
        if (!angular.isObject(scope.current)) {
          scope.reset();
        }

        if (oldFont !== newFont) {
          scope.tryUnfocusSearch();

          if (angular.isObject(scope.current.font)) {
            newFont = scope.current.font;
          }

          if (angular.isObject(oldFont) && oldFont.used) {
            fontsService.updateUsage(oldFont, false);
          }
          if (angular.isObject(newFont)) {
            fontsService.updateUsage(newFont);
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
    }
  };
}]);
