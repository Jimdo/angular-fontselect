/* global  PROVIDER_GOOGLE, PROVIDER_WEBSAFE, NAME_CONTROLLER */
var NAME_JDFONTLIST = 'jdFontlist';
var NAME_JDFONTLIST_CONTROLLER = NAME_JDFONTLIST + NAME_CONTROLLER;

fontselectModule.directive(NAME_JDFONTLIST, function() {
  return {
    scope: {
      id: '=fsid',
      fonts: '=',
      current: '=',
      providerName: '@provider'
    },
    restrict: 'E',
    templateUrl: 'fontlist.html',
    replace: true,
    controller: NAME_JDFONTLIST_CONTROLLER
  };
});

fontselectModule.controller(NAME_JDFONTLIST_CONTROLLER, [
  '$scope',
  '$filter',
  'jdFontselect.fonts',
  function($scope, $filter, fontsService) {
    var _filteredFonts;
    var _sortedFonts;
    var _categorizedFonts;
    var _lastPageCount = 0;
    var _activated = [PROVIDER_WEBSAFE];
    var _initiate = {};
    var _sortCache = {};

    $scope.page = {
      size: 30,
      count: 0,
      current: 0
    };

    $scope.providerKey = _createKey($scope.providerName);

    /**
     * Set the current page
     *
     * @param {Number} currentPage
     * @return {void}
     */
    $scope.setCurrentPage = function(currentPage) {
      $scope.page.current = currentPage;
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
      var pages = new Array($scope.page.count);

      _updateCurrentPage();

      /* Display the page buttons only if we have at least two pages. */
      if (pages.length <= 1) {
        return [];
      }
      return pages;
    };

    /**
     * Check if this list is active
     *
     * @return {Boolean}
     */
    $scope.isActive = function() {
      return $scope.current.provider === $scope.providerName;
    };

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
        _filteredFonts = [];
      } else {
        var direction = $scope.current.sort.attr.dir;

        /* Apply all filters if the source is new. */
        if ($scope.fonts.length !== _sortCache.sourceCache) {
          _sortCache.sourceCache = $scope.fonts.length;
          _sortCache.sortattr = null;
        }


        if (_sortCache.sortattr !== $scope.current.sort.attr.key ||
          _sortCache.sortdir !== $scope.current.sort.direction)
        {
          _sortCache.sortattr = $scope.current.sort.attr.key;
          _sortCache.sortdir = $scope.current.sort.direction;
          _sortCache.category = null;

          _sortedFonts = $filter('orderBy')(
            $scope.fonts,
            $scope.current.sort.attr.key,
            $scope.current.sort.direction ? direction : !direction
          );
        }

        if (_sortCache.category !== $scope.current.category) {
          _sortCache.category = $scope.current.category;
          _sortCache.search = null;

          _categorizedFonts = $filter('filter')(_sortedFonts, {category: $scope.current.category}, true);
        }

        /* check if the source is the same */
        if (_sortCache.search !== $scope.current.search) {
          _sortCache.search = $scope.current.search;

          _filteredFonts = $filter('fuzzySearch')(_categorizedFonts, {name: $scope.current.search});
        }

      }

      return _filteredFonts;
    };

    /**
     * Activate or deactivate the this List.
     *
     * @return {void}
     */
    $scope.toggle = function() {
      if ($scope.isActive()) {
        $scope.current.provider = undefined;
      } else {
        if (_activated.indexOf($scope.providerName) < 0) {
          _initiate[$scope.providerName]();
          _activated.push($scope.providerName);
        }
        $scope.current.provider = $scope.providerName;
      }
    };

    /**
     * Calculate the amount of pages we have.
     *
     * @return {void}
     */
    function _updatePageCount() {
      _lastPageCount = $scope.page.count;

      if (!angular.isArray($scope.fonts)) {
        return 0;
      }

      if (_filteredFonts.length) {
        $scope.page.count = Math.ceil(_filteredFonts.length / $scope.page.size);
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
      if (_lastPageCount === $scope.page.count) {
        return;
      }

      /* try to get the complete current font object */
      var currentFont = fontsService.getFontByKey($scope.current.font, $scope.providerName);
      /* check if the current font is anywhere on our current pages */
      var index = _filteredFonts.indexOf(currentFont);

      /* If we have a font selected and it's inside the filter we use */
      if (currentFont && index >= 0) {
        /* go to this page */
        $scope.page.current = Math.ceil((index + 1) / $scope.page.size) - 1;
      } else {
        /* Just go to the last page if the current does not exist */
        if ($scope.page.current > $scope.page.count) {
          $scope.page.current = $scope.page.count-1;
        }
      }
    }

    /**
     * Initiation for the google list.
     *
     * @return {void}
     */
    _initiate[PROVIDER_GOOGLE] = function() {
      fontsService._initGoogleFonts();
    };
  }
]);