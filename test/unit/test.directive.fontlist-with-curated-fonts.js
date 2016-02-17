/* global initGlobals, $rootScope, $, $compile, $injector, CATEGORY_SANS_SERIF,
          NAME_FONTSSERVICE, FONTLIST_ENTRY_TYPE_HEADLINE */
fdescribe('fontlist directive with curated fonts', function() {
  'use strict';

  var $fontlist, $scope, exampleFont;

  beforeEach(function() {
    initGlobals();

    spyOn($injector.get(NAME_FONTSSERVICE), 'load');

    exampleFont = {
      name: 'Arial',
      key: 'arial',
      category: CATEGORY_SANS_SERIF,
      stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      popularity: 3,
      lastModified: '2014-01-28'
    };
    $rootScope.text = {
      curatedFontsListHeadline: 'hf',
      allFontsListHeadline: 'ALL'
    };
    $rootScope.meta = {};
    $rootScope.current = { search: '', providers: [], sort: { attr: {} } };
    $fontlist = $('<jd-fontlist meta="meta" current="current" text="text"></jd-fontlist>');
    $compile($fontlist)($rootScope);
    $rootScope.$digest();

    $scope = $fontlist.isolateScope();

    spyOn($scope, 'getFilteredFonts').and.returnValue([exampleFont]);
    $rootScope.$digest();
  });

  it('should display a font', function() {
    var fontItem = $fontlist.find('input[ng-model]');
    expect(fontItem.length).toBe(1);
  });

  describe('#getFontlistEntries', function() {
    it('should return the same array if getFilteredFonts does not change', function() {
      var fakeFilteredFonts = [];
      $scope.getFilteredFonts.and.returnValue(fakeFilteredFonts);
      var fontlistEntries = $scope.getFontlistEntries();
      expect($scope.getFontlistEntries()).toBe(fontlistEntries);
    });

    it('should return different arrays if getFilteredFonts changes', function() {
      var fakeFilteredFonts = [];
      $scope.getFilteredFonts.and.returnValue([]);
      var fontlistEntries = $scope.getFontlistEntries();
      $scope.getFilteredFonts.and.returnValue(fakeFilteredFonts);
      expect($scope.getFontlistEntries()).not.toBe(fontlistEntries);
    });

    it('should return curated fonts', function() {
      $scope.getFilteredFonts.and.returnValue([]);
      $injector.get('jdfsCuratedFonts').push(exampleFont);
      expect($scope.getFontlistEntries().length).toBe(3);
      expect($scope.getFontlistEntries()[1].content).toBe(exampleFont);
    });

    it('should return headlines if curated fonts', function() {
      $scope.getFilteredFonts.and.returnValue([]);
      $injector.get('jdfsCuratedFonts').push(exampleFont);
      expect($scope.getFontlistEntries()[0].type)
        .toBe(FONTLIST_ENTRY_TYPE_HEADLINE);
    });
  });

  it('should render no headlines if no curated fonts exists', function() {
    var headlines = $fontlist.find('.jdfs-fontlist-headline');
    expect(headlines.length).toBe(0);
  });

  it('should render headlines if curated fonts exists', function() {
    $scope.getFilteredFonts.and.returnValue([]);
    $injector.get('jdfsCuratedFonts').push(exampleFont);
    $rootScope.$digest();
    var headlines = $fontlist.find('.jdfs-fontlist-headline');
    expect(headlines.length).toBe(2);
  });
});
