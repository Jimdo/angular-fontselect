/* global elm, $scope, LIST_CONTAINER_CLASS, PROVIDER_WEBSAFE, PROVIDER_GOOGLE */
describe('fontlist directive', function() {
  'use strict';

  var fontlist, $childScope;

  beforeEach(function() {
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

});