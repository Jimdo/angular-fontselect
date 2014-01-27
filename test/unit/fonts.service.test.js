/* global PROVIDER_WEBSAFE, $httpBackend, elm */
describe('fontsService', function() {
  'use strict';

  var fontsService, customFont;

  customFont = {
    name: 'Foo',
    key: 'foo',
    stack: 'Foo, "Comic Sans", serif'
  };

  beforeEach(inject(function() {
    inject(function($injector) {
      fontsService = $injector.get('jdFontselect.fonts');
    });
  }));

  it('should exist', function() {
    expect(fontsService).toBeDefined();
  });

  it('should have a getAll method', function() {
    expect(fontsService.getAllFonts).toBeTypeOf('Function');
  });

  it('should have an add method', function() {
    expect(fontsService.add).toBeTypeOf('Function');
  });

  describe('add method', function() {
    it('should expand the fonts object', function() {
      fontsService.add(customFont);
      expect(fontsService._fonts['Websafe Fonts']).toContain(customFont);
    });

    it('should throw an error if we add an invalid font object', function() {
      expect(function() {
        fontsService.add({foo: 'bar'});
      }).toThrow();
    });
  });

  it('should be able to get a single font by key and provider', function() {
    expect(fontsService.getFontByKey('arial', PROVIDER_WEBSAFE).name).toBe('Arial');
  });

  it('should thow an error if we try to get a font without provider', function() {
    expect(function() {
      fontsService.getFontByKey('arial');
    }).toThrow('Provider is not set.');
  });

  it('should throw an error when the font is not available', function() {
    expect(function() {
      fontsService.getFontByKey('sdfsdf', 'fireball');
    }).toThrow('Font "sdfsdf" not found in "fireball".');
  });

  describe('google fonts', function() {
    var googleApiRx = /http(s)?:\/\/www.googleapis.com\/webfonts\/v1\/.*/;
    var $subScope;
    beforeEach(function() {
      $httpBackend.when('GET', googleApiRx).respond([]);
      $httpBackend.expectGET(googleApiRx);

      $subScope = elm.find('.jd-fontselect-provider-google-fonts h3').scope();
      $subScope.toggle();
    });

    afterEach(function() {
      $httpBackend.flush(1);
    });

    it('should not call the fontService initiator twice.', function() {
      spyOn(fontsService, '_initGoogleFonts');
      $subScope.toggle();
      $subScope.toggle();
      expect(fontsService._initGoogleFonts).not.toHaveBeenCalled();
    });
  });
});
