/* global PROVIDERS, STATE_DEFAULTS, NAME_FONTSSERVICE, DIR_PARTIALS, SORT_ATTRIBUTES, TEXT_DEFAULTS */
/* global KEY_ESCAPE */
var id = 1;

/** @const */
var PLEASE_INITIALIZE_STATE_FONT = '_PISF';

fontselectModule.directive('jdFontselect', [NAME_FONTSSERVICE, '$rootScope', function(fontsService, $rootScope) {
  return {
    scope: {
      current: '=?state',
      selected: '=?',
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
      $scope.selected = {};

      $scope.text = angular.extend(angular.copy(TEXT_DEFAULTS), $scope.text || {});
      if ($scope.rawText) {
        $scope.text = angular.extend($scope.text , $scope.$eval($scope.rawText) || {});
      }

      function setState(extend) {
        $scope.current = angular.extend(
          angular.copy(STATE_DEFAULTS),
          extend || {}
        );

        if (!$scope.current.sort.attr) {
          $scope.current.sort.attr = SORT_ATTRIBUTES[0];
        }

        $scope.current.subsets = fontsService.setSubsets($scope.current.subsets);
        $scope.current.providers = fontsService.setProviders($scope.current.providers);
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
          $scope.selected.name = font.name;
          $scope.selected.stack = font.stack;
        } else {
          $scope.selected = {};
        }
      };

      // Initialize

      setState($scope.current);
      if (angular.isObject($scope.current.font)) {
        $scope._setSelected($scope.current.font);
        $scope[PLEASE_INITIALIZE_STATE_FONT] = true;
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

          $rootScope.$broadcast('jdfs.change', scope.selected);
        }
      });

      scope.$watch('current.subsets', function(newSubsets, oldSubsets) {
        if (newSubsets !== oldSubsets) {
          $rootScope.$broadcast('jdfs.change.subsets', newSubsets);
        }
      }, true);

      if (scope[PLEASE_INITIALIZE_STATE_FONT]) {
        var destroy = scope.$watch('fonts', function() {
          var current = scope.current;
          try {
            var font = fontsService.getFontByKey(current.font.key, current.font.provider);
            if (font) {
              current.font = font;
              delete scope[PLEASE_INITIALIZE_STATE_FONT];
              destroy();
            }
          } catch (e) {}
        }, true);
      }
    }
  };
}]);
