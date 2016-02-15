/* global module, initGlobals, $injector */
describe('curated fonts provider', function() {
  'use strict';

  it('should return an empty array', function() {
    module('jdFontselect');
    initGlobals(false);
    var jdfsCuratedFonts = $injector.get('jdfsCuratedFonts');

    expect(jdfsCuratedFonts).toBeInstanceOf(Array);
    expect(jdfsCuratedFonts.length).toBe(0);
  });

  it('should provide a list of curated fonts', function() {
    var fakeFontKeys = ['foo'];

    module('jdFontselect', function(jdfsCuratedFontsProvider) {
      jdfsCuratedFontsProvider.setCuratedFontKeys(fakeFontKeys);
    });
    initGlobals(false);
    var jdfsCuratedFonts = $injector.get('jdfsCuratedFonts');

    expect(jdfsCuratedFonts).toBe(fakeFontKeys);
  });
});
