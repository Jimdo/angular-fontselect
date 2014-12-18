/* global STATE_DEFAULTS, NAME_FONTSSERVICE, SORT_ATTRIBUTES, TEXT_DEFAULTS */
/* global KEY_ESCAPE, VALUE_NO_FONT_STACK, CLOSE_EVENT, OPEN_EVENT */
/* jshint maxparams: 5 */
var id = 1;

fontselectModule.directive('jdFontselect', [NAME_FONTSSERVICE, function(fontsService) {
  return {
    scope: {
      current: '=?state',
      stack: '=?',
      name: '=?',
      rawText: '@?text',
      text: '=?textObj',
      onInit: '&?',
      onOpen: '&?',
      onClose: '&?',
      onChange: '&?',
      idSuffix: '@?'
    },
    restrict: 'E',
    templateUrl: 'fontselect.html',
    replace: true,

    controller: [
      '$scope',
      '$element',
      '$timeout',
      '$document',
      '$rootScope',
      function(
        $scope,
        $element,
        $timeout,
        $document,
        $rootScope
    ) {
      $scope.fonts = fontsService.getAllFonts();
      $scope.id = id++;
      $scope.suffixedId = $scope.idSuffix ? $scope.idSuffix : $scope.id;
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

      function outsideClickHandler(event) {
        if ($scope.active && !_isDescendant($element[0], event.target)) {
          $scope.toggle();
          $rootScope.$digest();
        }
      }

      function escapeKeyHandler(event) {
        if ($scope.active && event.keyCode === KEY_ESCAPE) {
          $scope.toggle();
          $rootScope.$digest();
        }
      }

      function open() {
        $document.on('click', outsideClickHandler);
        $document.on('keyup', escapeKeyHandler);

        $scope.$broadcast(OPEN_EVENT);
        $scope.onOpen();
      }

      function close() {
        $document.off('keyup', escapeKeyHandler);
        $document.off('click', outsideClickHandler);

        $scope.$broadcast(CLOSE_EVENT);
        $scope.onClose();
      }

      $scope.reverseSort = function() {
        var sort = $scope.current.sort;

        sort.direction = !sort.direction;
      };

      $scope.toggle = function() {
        $scope.active = !$scope.active;

        if (!$scope.active) {
          $scope.searching = false;
          close();
        } else {
          $timeout(open);
        }
      };

      $scope.toggleSearch = function() {
        if (!$scope.active) {
          $scope.toggle();
        }

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

      $scope.$on('$destroy', close);

      /* Initiate! */
      fontsService._initGoogleFonts();

      if (angular.isObject($scope.current)) {
        setState($scope.current);
      }

      if ($scope.stack.length) {
        try {
          var font = fontsService.getFontByStack($scope.stack);
          /* Since we're setting the font now before watchers are initiated, we need to update usage by ourself. */
          fontsService.updateUsage(font);
          fontsService.load(font);
          setState({font: font});
        } catch (e) {
          fontsService.getFontByStackAsync($scope.stack, false).then(function(font) {
            if (angular.isObject(font)) {
              setState({font: font});
            }
          });
        }
      }

      $scope.onInit({$scope: $scope});

      $scope.$watch('current.font', function(newFont, oldFont) {
        if (!angular.isObject($scope.current)) {
          $scope.reset();
        }

        if (oldFont !== newFont) {
          $scope.tryUnfocusSearch();

          if (angular.isObject($scope.current.font)) {
            newFont = $scope.current.font;
          }

          if (angular.isObject(oldFont) && oldFont.used) {
            fontsService.updateUsage(oldFont, false);
          }
          if (angular.isObject(newFont)) {
            fontsService.updateUsage(newFont);
            fontsService.load(newFont);
          }

          $scope._setSelected(newFont);
          fontsService.updateImports();
          $scope.onChange({font: newFont});
        }
      });

      $scope.$watch('current.subsets', function(newSubsets, oldSubsets) {
        if (newSubsets !== oldSubsets) {
          fontsService.updateImports();
        }
      }, true);

      $scope.$watch('stack', function(newStack, oldStack) {
        var font;

        if (newStack === oldStack || ($scope.current.font && newStack === $scope.current.font.stack)) {
          return;
        }

        try {
          if (newStack && newStack.length) {
            font = fontsService.getFontByStack(newStack, false);
          }

          if (font) {
            $scope.current.font = font;
          } else {
            $scope.reset();
          }
        } catch (e) {
          $scope.reset();
        }
      });
    }]
  };
}]);
