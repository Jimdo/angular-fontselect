/* global initGlobals, $compile, $rootScope, $,
          CATEGORY_SANS_SERIF, FONTLIST_ENTRY_TYPE_FONT,
          FONTLIST_ENTRY_TYPE_HEADLINE */
describe('font list entry', function() {
  'use strict';

  var $fontlistEntry, exampleFont;

  beforeEach(function() {
    initGlobals();

    exampleFont = {
      name: 'Arial',
      key: 'arial',
      category: CATEGORY_SANS_SERIF,
      stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      popularity: 3,
      lastModified: '2014-01-28'
    };

    $fontlistEntry = $('<jd-fontlist-entry entry="entry"></jd-fontlist-entry>');
    $compile($fontlistEntry)($rootScope);
  });

  it('should render a font if the entrys type is font', function() {
    $rootScope.entry = {
      type: FONTLIST_ENTRY_TYPE_FONT,
      content: exampleFont
    };
    $rootScope.$digest();
    var fonts = $fontlistEntry.find('input[ng-model]');
    expect(fonts.length).toBe(1);
  });

  it('should render a headline if the entrys type is headline', function() {
    var testHeadline = 'Foo Bar';
    $rootScope.entry = {
      type: FONTLIST_ENTRY_TYPE_HEADLINE,
      content: testHeadline
    };
    $rootScope.$digest();
    var headline = $fontlistEntry.find('.jdfs-fontlist-headline');
    expect(headline.length).toBe(1);
    expect(headline.text()).toBe(testHeadline);
  });
});
