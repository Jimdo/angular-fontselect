/* global LIST_CONTAINER_CLASS, PROVIDER_WEBSAFE, PROVIDER_GOOGLE, initGlobals */
/* global CATEGORY_SERIF, createDirective, $rootScope */
describe('fontlist directive', function() {
  'use strict';

  var fontlist, $childScope, $scope, elm;

  beforeEach(function() {
    initGlobals();
    var d = createDirective();
    $scope = d.scope;
    elm = d.elm;
    $scope.toggle();
    $rootScope.$digest();

    fontlist = elm.find(LIST_CONTAINER_CLASS);
    $childScope = fontlist.children().first().scope();
  });

  it('should exist', function() {
    expect(fontlist.length).toBe(1);
  });

  it('should have providers set', function() {
    expect($scope.current.providers[PROVIDER_WEBSAFE]).toBe(true);
    expect($scope.current.providers[PROVIDER_GOOGLE]).toBe(true);
  });

  it('should have two pagination buttons', function() {
    expect(fontlist.find('button').length).toBe(2);
  });

  describe('pagination', function() {
    var prev, next;
    beforeEach(function() {
      $childScope.page.size = 1;
      $childScope.$digest();

      prev = fontlist.find('button').first();
      next = fontlist.find('button').last();
    });

    it('should have multiple pages', function() {
      expect($childScope.page.count).toBeGreaterThan(1);
    });

    it('should have the prev button disabled', function() {
      expect(prev.attr('disabled')).toBe('disabled');
    });

    it('should change the current page when we click da next button', function() {
      expect($childScope.page.current).toBe(0);
      next.click();
      $scope.$digest();
      expect($childScope.page.current).toBe(1);
    });

    it('should enable the prev button when we click ne next button', function() {
      next.click();
      $scope.$digest();
      expect(prev.attr('disabled')).not.toBe('disabled');
    });

    it('should deactivate the next button, when we are on the end of the list', function() {
      $childScope.page.current = $childScope.page.count - 1;
      $childScope.$digest();

      expect(next.attr('disabled')).toBe('disabled');
    });

  });

  describe('search', function() {
    it('should reduce a list of fonts to those matching our search input', function() {
      var amountOfFonts = $childScope.getFontlistEntries().length;
      $scope.current.search = 'arl';
      expect($childScope.getFontlistEntries().length).toBeLessThan(amountOfFonts);
    });

    it('should sort results by relevance*', function() {
      /* *We're doing this by checking the amount of unmatched chars in the font name */
      $scope.current.search = 'rana';
      expect($childScope.getFontlistEntries()[0].content.name).toBe('Verdana');
    });

    it('should prioritize matches that start with the same char as the search', function() {
      $scope.current.search = 'dana';
      expect($childScope.getFontlistEntries()[0].content.name).toBe('Droid Sans');
    });

    it('should reset to first page when searching', function() {
      $childScope.page.size = 1;
      $childScope.page.current = 8;
      $scope.current.search = 'a';
      $scope.$digest();
      expect($childScope.page.current).toBe(0);
    });

    it('should reset other filters when searching', function() {
      $scope.setCategoryFilter(CATEGORY_SERIF);
      $scope.current.search = 'a';
      $scope.$digest();
      expect($scope.current.category).toBeUndefined();
    });
  });

});
