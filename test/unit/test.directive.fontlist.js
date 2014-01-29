/* global elm, $scope */
describe('fontlist directive', function() {
  'use strict';

  var fontlist, $childScope;

  beforeEach(function() {
    fontlist = elm.find('.jdfs-provider-websafe-fonts').first();
    $childScope = fontlist.children().first().scope();
  });

  it('should exist', function() {
    expect(fontlist.length).toBe(1);
  });

  it('should have a headline', function() {
    expect(fontlist.find('h3').length).toBe(1);
  });

  it('should be the current provider', function() {
    expect($scope.current.provider).toBe('Websafe Fonts');
  });

  it('should be active', function() {
    expect($childScope.isActive()).toBe(true);
  });

  it('should become inactive when we click on the headline', function() {
    fontlist.find('h3').click();
    expect($childScope.isActive()).toBe(false);
  });

  it('should have an active class when active', function() {
    expect(fontlist.hasClass('jdfs-active')).toBe(true);
    fontlist.find('h3').click();
    expect(fontlist.hasClass('jdfs-active')).toBe(false);
  });

  it('shouldn\'t have list elements when inactive', function() {
    fontlist.find('h3').click();
    expect(fontlist.find('li').length).toBe(0);
  });

  it('should get it\'s list elements back when being reactivated', function() {
    fontlist.find('h3').click();
    fontlist.find('h3').click();
    expect(fontlist.find('li').length).toBe(5);
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
      expect(fontlist.find('button').length).toBe(5);
    });
  });

});