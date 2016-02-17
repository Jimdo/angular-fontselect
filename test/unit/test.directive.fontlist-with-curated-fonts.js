/* global initGlobals, $rootScope, $, $compile, $injector */
describe('fontlist directive with curated fonts', function() {
  'use strict';

  var $fontlist, $scope;

  beforeEach(function() {
    initGlobals();

    $rootScope.meta = {};
    $fontlist = $('<jd-fontlist meta="meta"></jd-fontlist>');
    $compile($fontlist)($rootScope);
    $rootScope.$digest();

    $scope = $fontlist.isolateScope();
  });

  it('should have a hasCuratedFonts method', function() {
    expect($scope.hasCuratedFonts).toBeInstanceOf(Function);
  });

  it('should return false if no curated fonts are configured', function() {
    expect($scope.hasCuratedFonts()).toBe(false);
  });

  it('should return true if curated fonts are configured', function() {
    $injector.get('jdfsCuratedFonts').push({});
    expect($scope.hasCuratedFonts()).toBeTruthy();
  });

  it('should render no headlines if no curated fonts exists', function() {
    var headlines = $fontlist.find('.jdfs-fontlist-headline');
    expect(headlines.length).toBe(0);
  });

  it('should render headlines if curated fonts exists', function() {
    $injector.get('jdfsCuratedFonts').push({});
    $rootScope.$digest();
    var headlines = $fontlist.find('.jdfs-fontlist-headline');
    expect(headlines.length).toBe(2);
  });
});