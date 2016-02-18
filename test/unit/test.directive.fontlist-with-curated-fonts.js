/* global initGlobals, $rootScope, $, $compile, $injector, CATEGORY_SANS_SERIF,
          NAME_FONTSSERVICE, FONTLIST_ENTRY_TYPE_HEADLINE */
describe('fontlist directive with curated fonts', function() {
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
      lastModified: '2014-01-28',
      provider: 'websafe'
    };
    $rootScope.text = {
      curatedFontsListHeadline: 'hf',
      allFontsListHeadline: 'ALL'
    };
    $rootScope.meta = {};
    $rootScope.current = { search: '', providers: {'websafe': true}, sort: { attr: {} } };
    $rootScope.fonts = [exampleFont];

    $fontlist = $('<jd-fontlist meta="meta" current="current" fonts="fonts" text="text"></jd-fontlist>');
    $compile($fontlist)($rootScope);
    $rootScope.$digest();

    $scope = $fontlist.isolateScope();

    $rootScope.$digest();
  });

  it('should display a font', function() {
    var fontItem = $fontlist.find('input[ng-model]');
    expect(fontItem.length).toBe(1);
  });

  describe('#getFontlistEntries', function() {
    it('should return the same array if fonts do not change', function() {
      var fakeFilteredFonts = [];
      $scope.fonts = fakeFilteredFonts;
      var fontlistEntries = $scope.getFontlistEntries();
      expect($scope.getFontlistEntries()).toBe(fontlistEntries);
    });

    it('should return different arrays if fonts change', function() {
      $scope.fonts = [exampleFont];
      var fontlistEntries = $scope.getFontlistEntries();
      var fakeFilteredFonts = [];
      $scope.fonts = fakeFilteredFonts;
      expect($scope.getFontlistEntries()).not.toBe(fontlistEntries);
    });

    it('should return curated fonts', function() {
      $scope.fonts = [];
      $injector.get('jdfsCuratedFonts').push(exampleFont);
      expect($scope.getFontlistEntries().length).toBe(3);
      expect($scope.getFontlistEntries()[1].content).toBe(exampleFont);
    });

    it('should return headlines if curated fonts', function() {
      $scope.fonts = [];
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
    $scope.fonts = [];
    $injector.get('jdfsCuratedFonts').push(exampleFont);
    $rootScope.$digest();
    expect($scope.getFontlistEntries().length).toBe(3);
    var headlines = $fontlist.find('.jdfs-fontlist-headline');
    expect(headlines.length).toBe(2);
  });
});
