/* global module, initGlobals, $injector, NAME_FONTSSERVICE, $rootScope */
describe('curated fonts provider', function() {
  'use strict';

  it('should return an empty array when no curated fonts are given', function() {
    module('jdFontselect');
    initGlobals(false);
    var jdfsCuratedFonts = $injector.get('jdfsCuratedFonts');

    expect(jdfsCuratedFonts).toBeInstanceOf(Array);
    expect(jdfsCuratedFonts.length).toBe(0);
  });

  it('should provide the actual font object for curated font keys', function() {
    var fakeFonts = ['websafe.timesnewroman'];
    var fakeFontService = {
      getAllFonts: function(){return [{
        name: 'Times New Roman',
        provider: 'websafe',
        key: 'timesnewroman'
      }];}
    };

    module('jdFontselect', function($provide, jdfsCuratedFontsProvider) {
      jdfsCuratedFontsProvider.setCuratedFontKeys(fakeFonts);
      $provide.value(NAME_FONTSSERVICE, fakeFontService);
    });
    initGlobals(false);
    var jdfsCuratedFonts = $injector.get('jdfsCuratedFonts');

    expect(jdfsCuratedFonts[0].name).toBe('Times New Roman');

    $rootScope.$digest();
  });
});
