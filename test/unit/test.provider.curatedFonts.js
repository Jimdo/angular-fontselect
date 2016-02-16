/* global module, initGlobals, $injector, spyOn, NAME_FONTSSERVICE, $rootScope */
describe('curated fonts provider', function() {
  'use strict';

  it('should return an empty array when no currated are given', function() {
    module('jdFontselect');
    initGlobals(false);
    var jdfsCuratedFonts = $injector.get('jdfsCuratedFonts');

    expect(jdfsCuratedFonts).toBeInstanceOf(Array);
    expect(jdfsCuratedFonts.length).toBe(0);
  });

  it('should provide the actual font object for curated font keys', function(done) {
    var fakeFonts = ['websafe.timesnewroman'];
    var fakeFontService = {
      ready: function() {},
      _fonts: [{
        name: 'Times New Roman',
        provider: 'websafe',
        key: 'timesnewroman'
      }]
    };

    module('jdFontselect', function($provide, jdfsCuratedFontsProvider) {
      jdfsCuratedFontsProvider.setCuratedFontKeys(fakeFonts);
      $provide.value(NAME_FONTSSERVICE, fakeFontService);
    });
    initGlobals(false);
    spyOn(fakeFontService, 'ready').and.returnValue( $injector.get('$q').when());
    var jdfsCuratedFonts = $injector.get('jdfsCuratedFonts');

    jdfsCuratedFonts.promise.then(function() {
      expect(jdfsCuratedFonts[0].name).toBe('Times New Roman');
      done();
    });
    $rootScope.$digest();
  });
});
