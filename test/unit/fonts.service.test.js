/* global PROVIDER_WEBSAFE, GOOGLE_FONTS_RESPONSE, $httpBackend, elm, $q,
          _webFontLoaderDeferred, _webFontLoaderInitiated, _webFontLoaderPromise */
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

  describe('get method', function() {
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
  });

  describe('remove method', function() {
    it('should be able to remove a font from the global list', function() {
      var all = fontsService.getAllFonts()[PROVIDER_WEBSAFE];
      var beforeLength = all.length;

      var index  = fontsService.removeFont(all[0], PROVIDER_WEBSAFE);
      expect(all.length).toBe(beforeLength - 1);
      expect(index).toBeGreaterThan(0);
    });

    it('should throw an error if we forget the provider', function() {
      expect(function() {
        fontsService.removeFont('arial');
      }).toThrow('Provider is not set.');
    });

    it('should fail silently with return 0 when the font can\'t be found', function() {
      expect(fontsService.removeFont('xyz', PROVIDER_WEBSAFE)).toBe(0);
    });

    it('should also remove the font from the internal map', function() {
      fontsService.removeFont('verdana', PROVIDER_WEBSAFE);
      expect(fontsService._map[PROVIDER_WEBSAFE].verdana).not.toBeDefined();
    });

    it('should find fonts by key after we removed some', function() {
      fontsService.removeFont('verdana', PROVIDER_WEBSAFE);
      expect(fontsService.getFontByKey('timesnewroman', PROVIDER_WEBSAFE).name).toBe('Times New Roman');
    });
  });

  describe('getBestOf', function() {
    var testPrios = ['foo', 'bar', 'baz'];
    var testPrios2 = ['a', 'b', 'c'];
    var testThings = ['baz', 'drrt', 'foo', 'fob'];
    var testThings2 = ['baz', 'bar', 'fox', 'fob'];

    it('should return the first match between prios and things', function() {
      expect(fontsService._getBestOf(testThings, testPrios)).toBe('foo');
      expect(fontsService._getBestOf(testThings2, testPrios)).toBe('bar');
    });

    it('should return the first thing if no prio key is available', function() {
      expect(fontsService._getBestOf(testThings, testPrios2)).toBe('baz');
    });
  });

  describe('google fonts', function() {
    var googleApiRx = /http(s)?:\/\/www.googleapis.com\/webfonts\/v1\/.*/;
    var $subScope;
    beforeEach(function() {
      $httpBackend.when('GET', googleApiRx).respond(GOOGLE_FONTS_RESPONSE);
      $httpBackend.expectGET(googleApiRx);
      spyOn(window, 'yepnope');

      $subScope = elm.find('.jd-fontselect-provider-google-fonts h3').scope();
      $subScope.toggle();
      $httpBackend.flush(1);
    });

    afterEach(function() {
      expect(yepnope).toHaveBeenCalled();
      expect(yepnope.calls[0].args[0].test).toBe(false);
      /* jshint -W020 */
      _webFontLoaderInitiated = false;
      /* jshint +W020 */
    });

    it('should not call the fontService initiator twice.', function() {
      spyOn(fontsService, '_initGoogleFonts');
      $subScope.toggle();
      $subScope.toggle();
      expect(fontsService._initGoogleFonts).not.toHaveBeenCalled();
    });

    it('should load the fonts with webFontLoader when we resolve the promise', function() {
      var spy = jasmine.createSpyObj('WebFont', ['load']);

      $q.all([_webFontLoaderPromise]).then(function() {
        expect(spy.load.callCount).toBe(4);
      });

      _webFontLoaderDeferred.resolve(spy);
    });
  });
});
