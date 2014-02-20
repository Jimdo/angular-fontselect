/* global elm, $scope, LIST_CONTAINER_CLASS */
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

  it('should be the current provider', function() {
    expect($scope.current.provider).toBe('websafe');
  });

  it('should not have pagination by default', function() {
    expect(fontlist.find('button').length).toBe(0);
  });

  describe('pagination', function() {
    beforeEach(function() {
      $childScope.page.size = 1;
      $childScope.$digest();
    });

    it('should have pagination buttons if we reduce the amount of items per page', function() {
      expect(fontlist.find('button').length).toBe(9);
    });
  });

});