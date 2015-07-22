/* global NAME_CONTROLLER, DIRECTION_NEXT, DIRECTION_PREVIOUS, KEY_DOWN */
/* global KEY_UP, KEY_RIGHT, KEY_LEFT, PAGE_SIZE_DEFAULT, SCROLL_BUFFER, CLOSE_EVENT */
/* global OPEN_EVENT, NAME_FONTSSERVICE */
var NAME_JDFONTLIST = 'jdFontlist';
var NAME_JDFONTLIST_CONTROLLER = NAME_JDFONTLIST + NAME_CONTROLLER;

fontselectModule.directive(NAME_JDFONTLIST, function() {
  return {
    scope: {
      id: '=fsid',
      fonts: '=',
      meta: '=',
      current: '=',
      text: '=',
      active: '='
    },
    restrict: 'E',
    templateUrl: 'fontlist.html',
    replace: true,
    controller: NAME_JDFONTLIST_CONTROLLER
  };
});

fontselectModule.controller(NAME_JDFONTLIST_CONTROLLER, [
  '$scope',
  '$rootScope',
  '$filter',
  NAME_FONTSSERVICE,
  '$element',
  '$document',
  /* jshint maxparams: 6 */
  function($scope, $rootScope, $filter, fontsService, $element, $document) {
  /* jshint maxparams: 3 */
    var _filteredFonts = [];
    var _sortedFonts = [];
    var _searchedFonts = [];
    var _categorizedFonts = [];
    var _fontsInSubsets = [];
    var _fontsInProviders = [];
    var _lastPageCount = 0;
    var _sortCache = {};
    var _scrollBuffer = 0;
    var _forceNextFilters = false;


    var page = $scope.page = $scope.meta.page = {
      size: PAGE_SIZE_DEFAULT,
      count: 0,
      current: 0,
      currentAbs: 0
    };
    var fontmeta = $scope.meta.fonts = {
      total: 0,
      current: 0
    };

    function isOnCurrentPage(index) {
      var currentMinIndex = page.current * page.size;

      return index >= currentMinIndex && index < currentMinIndex + page.size;
    }

    $scope.keyfocus = function(direction, amount) {
      var index = _filteredFonts.indexOf($scope.current.font);
      var pageoffset = page.size * page.current;
      var onPage = isOnCurrentPage(index);

      if (angular.isUndefined(amount)) {
        amount = 1;
      }

      index += (direction === DIRECTION_PREVIOUS ? -amount : amount);

      if (!onPage && _filteredFonts[index + pageoffset]) {
        index += pageoffset;
      }

      if (_filteredFonts[index]) {
        $scope.current.font = _filteredFonts[index];

        page.currentAbs = page.current = Math.floor(index / page.size);

        $rootScope.$digest();
      }
    };

    function keyDownHandler(event) {
      if (!$scope.active) {
        return;
      }

      function prevent() {
        event.preventDefault();
        return false;
      }

      var key = event.keyCode;

      if (key === KEY_DOWN) {
        $scope.keyfocus(DIRECTION_NEXT);
        return prevent();
      } else if (key === KEY_UP) {
        $scope.keyfocus(DIRECTION_PREVIOUS);
        return prevent();
      }

      if (document.activeElement.tagName === 'INPUT' && document.activeElement.value) {
        return;
      }

      var amount = page.size;
      if (key === KEY_RIGHT) {
        if (!$scope.current.font) {
          amount++;
        }
        $scope.keyfocus(DIRECTION_NEXT, amount);
        return prevent();
      } else if (key === KEY_LEFT) {
        $scope.keyfocus(DIRECTION_PREVIOUS, page.size);
        return prevent();
      }
    }

    var wheelHandler = function(event) {
      if (!event.target) {
        return;
      }

      if (_isDescendant($element[0], event.target)) {
        event.preventDefault();
        event.stopPropagation();

        var subpage = 1 / page.size;
        var delta = event.wheelDeltaY || event.wheelDelta ||
          event.deltaY * -1 || event.detail * -1;
        var absDelta = Math.abs(delta);

        /* For touch-pads etc., we buffer small movements */
        if (absDelta > 1 && absDelta < SCROLL_BUFFER) {
          _scrollBuffer += delta;
          if (Math.abs(_scrollBuffer) < SCROLL_BUFFER) {
            return;
          }
          _scrollBuffer = 0;
        }

        if ($scope.paginate(delta > 0 ? -subpage : subpage) !== false) {
          $scope.$digest();
        }
      }
    };

    $scope.$on(OPEN_EVENT, function() {
      $document.on('keydown', keyDownHandler);
      $document.on('wheel', wheelHandler);
      $document.on('mousewheel', wheelHandler);
      $document.on('DOMMouseScroll', wheelHandler);
    });

    $scope.$on(CLOSE_EVENT, function() {
      $document.off('keydown', keyDownHandler);
      $document.off('wheel', wheelHandler);
      $document.off('mousewheel', wheelHandler);
      $document.off('DOMMouseScroll', wheelHandler);
    });

    /**
     * Set the current page
     *
     * @param {Number} currentPage
     * @return {void}
     */
    $scope.setCurrentPage = function(currentPage) {
      page.currentAbs = page.current = currentPage;
    };

    /**
     * Go to the next or previous page.
     *
     * @param  {String} direction 'next' or 'prev'
     * @return {void}
     */
    $scope.paginate = function(amount) {
      var direction = amount;
      if (angular.isNumber(amount)) {
        if (amount === 0) {
          return false;
        }
        direction = amount < 0 ? DIRECTION_PREVIOUS : DIRECTION_NEXT;
      } else {
        amount = _getAmountFromDirection(direction);
      }

      if (!$scope.paginationButtonActive(direction)) {
        return false;
      }

      if (page.current + amount < 0) {
        page.currentAbs = page.current = 0;
      } else {
        page.current += amount;
        page.currentAbs = Math.floor(page.current);
      }

      return page.current;
    };

    /**
     * Check if the pagination button is active
     *
     * @param  {String} direction 'next' or 'prev'
     * @return {Boolean}
     */
    $scope.paginationButtonActive = function(direction) {
      _updatePageCount();
      _updateCurrentPage();

      return (
        (direction === DIRECTION_NEXT && (page.current + 1) * page.size < _filteredFonts.length) ||
        (direction === DIRECTION_PREVIOUS && page.current > 0)
      );
    };

    /**
     * Get an array with the length similar to the
     * amount of pages we have. (So we can use it in a repeater)
     *
     * Also update the current page and the current amount of pages.
     *
     * @return {Array}
     */
    $scope.getPages = function() {
      _updatePageCount();
      var pages = new Array(page.count);

      _updateCurrentPage();

      /* Display the page buttons only if we have at least two pages. */
      if (pages.length <= 1) {
        return [];
      }
      return pages;
    };

    /**
     * Apply the current provider filter to the given font list
     * @param {Array} fonts
     * @return {Array}
     */
    function _filterProviders(fonts) {
      var providersString = JSON.stringify($scope.current.providers);
      if (_forceNextFilters || _sortCache.providers !== providersString) {
        _sortCache.providers = providersString;
        _forceNextFilters = true;

        _fontsInProviders = fonts.filter(function(font) {
          return $scope.current.providers[font.provider];
        });
      }

      return _fontsInProviders;
    }

    /**
     * Apply current subset filters to given font list
     * @param  {Array} fonts
     * @return {Array}
     */
    function _filterSubsets(fonts) {
      var subSetString = JSON.stringify($scope.current.subsets);
      if (_forceNextFilters || _sortCache.subsets !== subSetString) {
        _sortCache.subsets = subSetString;
        _forceNextFilters = true;

        _fontsInSubsets = $filter('hasAllSubsets')(
          fonts,
          $scope.current.subsets
        );
      }

      return _fontsInSubsets;
    }

    /**
     * Apply current sort to given font list
     * @param  {Array} fonts
     * @return {Array}
     */
    function _filterSort(fonts) {
      var attrDirection = $scope.current.sort.attr.dir;
      var direction = $scope.current.sort.direction;

      if (_forceNextFilters ||
        _sortCache.sortattr !== $scope.current.sort.attr.key ||
        _sortCache.sortdir !== direction)
      {
        _sortCache.sortattr = $scope.current.sort.attr.key;
        _sortCache.sortdir = direction;
        _forceNextFilters = true;

        _sortedFonts = $filter('orderBy')(
          fonts,
          $scope.current.sort.attr.key,
          $scope.current.sort.direction ? attrDirection : !attrDirection
        );
      }

      return _sortedFonts;
    }

    /**
     * Apply current category filters to given font list.
     * @param  {Array} fonts
     * @return {Array}
     */
    function _filterCategory(fonts) {
      var category = $scope.current.category;
      if (_forceNextFilters || _sortCache.category !== category) {
        _sortCache.category = category;
        _forceNextFilters = true;

        if (angular.isUndefined(category)) {
          _categorizedFonts = fonts;
        } else {
          _categorizedFonts = $filter('filter')(fonts, {category: category}, true);
        }
      }

      return _categorizedFonts;
    }

    /**
     * Apply current search to given font list.
     * @param  {Array} fonts
     * @return {Array}
     */
    function _filterSearch(fonts) {
      var search = $scope.current.search || '';
      var searchTermChanged = _sortCache.search !== search;
      if (_forceNextFilters || searchTermChanged) {
        _sortCache.search = search;
        _forceNextFilters = true;

        /* Unset category filter so every font is visible. */
        if (searchTermChanged) {
          $scope.current.category = undefined;
        }

        if (search.length) {
          _searchedFonts = _priorize(
            $filter('fuzzySearch')(fonts, {name: search}),
            search.toLowerCase()
          );
        } else {
          _searchedFonts = fonts;
        }
      }

      return _searchedFonts;
    }

    /**
     * Apply the current filters to our internal font object.
     *
     * Ensure we only apply filters when the filter parameters
     * or the source have changed.
     *
     * @return {Array}
     */
    $scope.getFilteredFonts = function() {
      if (!angular.isArray($scope.fonts)) {
        return [];
      }

      var fonts = $scope.fonts;
      _forceNextFilters = _sortCache.fontAmount !== fonts.length;
      _sortCache.fontAmount = fonts.length;

      var queue = [
        _filterProviders,
        _filterSubsets,
        _filterSort,
        _filterSearch,
        _filterCategory
      ];

      for (var i = 0, l = queue.length; i < l; i++) {
        fonts = queue[i](fonts);
      }

      _filteredFonts = fonts;

      fontmeta.total = $scope.fonts.length;
      fontmeta.current = _filteredFonts.length;

      return _filteredFonts;
    };

    /**
     * Convert 'prev' and 'last' to -1 and 1
     * @param  {Number|String} direction
     * @return {Number}
     */
    function _getAmountFromDirection(direction) {
      if (angular.isNumber(direction)) {
        return direction;
      }
      return (direction === DIRECTION_PREVIOUS ? -1 : 1);
    }

    /**
     * Sort a list of fonts by matching them against a given search
     * @param  {Array} fonts
     * @param  {String} search
     * @return {Array}
     */
    function _priorize(fonts, search) {
      if (fonts.length > 1) {
        var rgx = new RegExp('[' + search + ']+');

        fonts.sort(function(a, b) {
          var nameA = a.name.toLowerCase();
          var nameB = b.name.toLowerCase();
          var firstCharA = nameA[0];
          var firstCharB = nameB[0];

          /* Prioritize by first character... */
          if (firstCharA !== firstCharB) {
            if (firstCharA === search[0]) {
              return -1;
            } else if (firstCharB === search[0]) {
              return 1;
            }
          }

          /* Prioritize by amount of matches. */
          return (nameA.replace(rgx, '').length < nameB.replace(rgx, '').length) ? -1 : 1;
        });
      }

      return fonts;
    }

    /**
     * Calculate the amount of pages we have.
     *
     * @return {void}
     */
    function _updatePageCount() {
      _lastPageCount = page.count;

      if (!angular.isArray($scope.fonts)) {
        return 0;
      }

      if (_filteredFonts.length) {
        page.count = Math.ceil(_filteredFonts.length / page.size);
      }
    }

    /**
     * Whenever the amount of pages is changing:
     * Make sure we're not staying on a page that does not exist.
     * And if we have a font selected, try to stay on the page of
     * that font.
     *
     * @return {void}
     */
    function _updateCurrentPage() {
      /* do nothing if the amount of pages hasn't change */
      if (_lastPageCount === page.count) {
        return;
      }

      $scope.setCurrentPage(0);
    }
  }
]);