/* global NAME_CONTROLLER, DIRECTION_NEXT, DIRECTION_PREVIOUS, KEY_DOWN */
/* global KEY_UP, KEY_RIGHT, KEY_LEFT, PAGE_SIZE_DEFAULT, SCROLL_BUFFER, CLOSE_EVENT */
/* global OPEN_EVENT, NAME_FONTSSERVICE, FONTLIST_ENTRY_TYPE_FONT, WeakMap */
/* global FONTLIST_ENTRY_TYPE_HEADLINE, FONTLIST_ENTRY_TYPE_TEXT */
var NAME_JDFONTLIST = 'jdFontlist';
var NAME_JDFONTLIST_CONTROLLER = NAME_JDFONTLIST + NAME_CONTROLLER;

fontselectModule.directive(NAME_JDFONTLIST, function() {
  return {
    scope: {
      id: '=fsid',
      fonts: '=',
      meta: '=',
      current: '=',
      text: '='
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
  'jdfsCuratedFonts',
  /* jshint maxparams: 7 */
  function($scope, $rootScope, $filter, fontsService, $element, $document, jdfsCuratedFonts) {
  /* jshint maxparams: 3 */
    var _fontlistEntries = [];
    var _lastPageCount = 0;
    var _scrollBuffer = 0;

    var ALL_FONTS_FILTER_STATE = {
      forceNext: false,
      fontsInProviders: [],
      fontsInSubsets: [],
      sortedFonts: [],
      categorizedFonts: [],
      searchedFonts: [],
      sortCache: { search: $scope.current.search }
    };

    var CURATED_FONTS_FILTER_STATE = angular.copy(ALL_FONTS_FILTER_STATE);

    var defaultPage = {
      size: PAGE_SIZE_DEFAULT,
      count: 0,
      current:  0,
      currentAbs: 0
    };

    var page = $scope.page = $scope.meta.page = angular.extend({}, defaultPage, $scope.meta.page);

    var fontmeta = $scope.meta.fonts = {
      total: 0,
      current: 0
    };

    function isOnCurrentPage(index) {
      var currentMinIndex = page.current * page.size;

      return index >= currentMinIndex && index < currentMinIndex + page.size;
    }

    $scope.keyfocus = function(direction, amount) {
      var index = _fontlistEntries.indexOf($scope.current.font);
      var pageoffset = page.size * page.current;
      var onPage = isOnCurrentPage(index);

      if (angular.isUndefined(amount)) {
        amount = 1;
      }

      index += (direction === DIRECTION_PREVIOUS ? -amount : amount);

      if (!onPage && _fontlistEntries[index + pageoffset]) {
        index += pageoffset;
      }

      if (_fontlistEntries[index]) {
        $scope.current.font = _fontlistEntries[index];

        page.currentAbs = page.current = Math.floor(index / page.size);

        $rootScope.$digest();
      }
    };

    function keyDownHandler(event) {
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

    function getDeltaFromEvent(event) {
      var delta = event.wheelDeltaY || event.wheelDelta ||
        event.deltaY * -1 || event.detail * -1;

      if (!isFinite(delta) &&
        !angular.isUndefined(event.originalEvent)) {
        delta = getDeltaFromEvent(event.originalEvent);
      }

      return delta;
    }

    var wheelHandler = function(event) {
      if (!event.target) {
        return;
      }

      if (_isDescendant($element[0], event.target)) {
        event.preventDefault();
        event.stopPropagation();

        var subpage = 1 / page.size;
        var delta = getDeltaFromEvent(event);
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
    $scope.paginate = function(amount, $event) {
      if ($event && $event.preventDefault) {
        $event.preventDefault();
      }

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
        (direction === DIRECTION_NEXT && (page.current + 1) * page.size < _fontlistEntries.length) ||
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
    function _filterProviders(fonts, filterState) {
      var providersString = JSON.stringify($scope.current.providers);
      if (filterState.forceNext || filterState.sortCache.providers !== providersString) {
        filterState.sortCache.providers = providersString;
        filterState.forceNext = true;

        filterState.fontsInProviders = fonts.filter(function(font) {
          return $scope.current.providers[font.provider];
        });
      }

      return filterState.fontsInProviders;
    }



    /**
     * Apply current subset filters to given font list
     * @param  {Array} fonts
     * @return {Array}
     */
    function _filterSubsets(fonts, filterState) {
      var subSetString = JSON.stringify($scope.current.subsets);
      if (filterState.forceNext || filterState.sortCache.subsets !== subSetString) {
        filterState.sortCache.subsets = subSetString;
        filterState.forceNext = true;

        filterState.fontsInSubsets = $filter('hasAllSubsets')(
          fonts,
          $scope.current.subsets
        );
      }

      return filterState.fontsInSubsets;
    }

    /**
     * Apply current sort to given font list
     * @param  {Array} fonts
     * @return {Array}
     */
    function _filterSort(fonts, filterState) {
      var attrDirection = $scope.current.sort.attr.dir;
      var direction = $scope.current.sort.direction;

      if (filterState.forceNext ||
        filterState.sortCache.sortattr !== $scope.current.sort.attr.key ||
        filterState.sortCache.sortdir !== direction)
      {
        filterState.sortCache.sortattr = $scope.current.sort.attr.key;
        filterState.sortCache.sortdir = direction;
        filterState.forceNext = true;

        filterState.sortedFonts = $filter('orderBy')(
          fonts,
          $scope.current.sort.attr.key,
          $scope.current.sort.direction ? attrDirection : !attrDirection
        );
      }

      return filterState.sortedFonts;
    }

    /**
     * Apply current category filters to given font list.
     * @param  {Array} fonts
     * @return {Array}
     */
    function _filterCategory(fonts, filterState) {
      var category = $scope.current.category;
      if (filterState.forceNext || filterState.sortCache.category !== category) {
        filterState.sortCache.category = category;
        filterState.forceNext = true;

        if (angular.isUndefined(category)) {
          filterState.categorizedFonts = fonts;
        } else {
          filterState.categorizedFonts = $filter('filter')(fonts, {category: category}, true);
        }
      }

      return filterState.categorizedFonts;
    }

    /**
     * Apply current search to given font list.
     * @param  {Array} fonts
     * @return {Array}
     */
    function _filterSearch(fonts, filterState) {
      var search = $scope.current.search || '';
      var searchTermChanged = filterState.sortCache.search !== search;
      if (filterState.forceNext || searchTermChanged) {
        filterState.sortCache.search = search;
        filterState.forceNext = true;

        /* Unset category filter so every font is visible. */
        if (searchTermChanged) {
          $scope.current.category = undefined;
        }

        if (search.length) {
          filterState.searchedFonts = _priorize(
            $filter('fuzzySearch')(fonts, {name: search}),
            search.toLowerCase()
          );
        } else {
          filterState.searchedFonts = fonts;
        }
      }

      return filterState.searchedFonts;
    }

    var EMPTY_FILTERED_FONTS = [];

    function filterFontList(fonts, filterState) {
      filterState.forceNext = filterState.sortCache.fontAmount !== fonts.length;
      filterState.sortCache.fontAmount = fonts.length;

      var queue = [
        _filterProviders,
        _filterSubsets,
        _filterSort,
        _filterSearch,
        _filterCategory
      ];

      var filteredList = fonts;
      for (var i = 0, l = queue.length; i < l; i++) {
        filteredList = queue[i](filteredList, filterState);
      }

      return filteredList;
    }

    function convertFontToFontlistEntry(font) {
      return {
        type: FONTLIST_ENTRY_TYPE_FONT,
        content: font
      };
    }

    function createHeadlineEntry(content) {
      return {
        type: FONTLIST_ENTRY_TYPE_HEADLINE,
        content: content
      };
    }

    function createTextEntry(content) {
      return {
        type: FONTLIST_ENTRY_TYPE_TEXT,
        content: content
      };
    }

    var entryMap = new WeakMap();

    $scope.getFontlistEntries = function() {
      var filteredFonts = filterFontList($scope.fonts || EMPTY_FILTERED_FONTS, ALL_FONTS_FILTER_STATE);
      if (!entryMap.has(filteredFonts)) {

        var fontlistEntries = [];
        if (filteredFonts.length === 0) {
          fontlistEntries.push(createTextEntry($scope.text.noResultsLabel));
        } else {
          fontlistEntries = filteredFonts.map(convertFontToFontlistEntry);

          if (jdfsCuratedFonts.length !== 0) {
            fontlistEntries = [createHeadlineEntry($scope.text.curatedFontsListHeadline)]
              .concat(jdfsCuratedFonts.map(convertFontToFontlistEntry))
              .concat([createHeadlineEntry($scope.text.allFontsListHeadline)])
              .concat(fontlistEntries);
          }
        }

        fontmeta.total = $scope.fonts.length;
        fontmeta.current = filteredFonts.length;

        _fontlistEntries = fontlistEntries;
        entryMap.set(filteredFonts, fontlistEntries);
      }

      return entryMap.get(filteredFonts);
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

      if (_fontlistEntries.length) {
        page.count = Math.ceil(_fontlistEntries.length / page.size);
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
