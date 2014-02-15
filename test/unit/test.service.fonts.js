/* global PROVIDER_WEBSAFE, $scope, $rootScope, activateGoogle,
          PROVIDER_TITLE_CLASS, createNewDirective, $googleScope */

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

    beforeEach(activateGoogle);

    it('should succeed on on all the beforeEach tests', function() {});

    it('should not call the fontService initiator twice.', function() {
      spyOn(fontsService, '_initGoogleFonts');
      $googleScope.toggle();
      $googleScope.toggle();
      expect(fontsService._initGoogleFonts).not.toHaveBeenCalled();
    });

    it('should not load google fonts twice, when we open two directives', function() {
      var d = createNewDirective();
      d.elm.find('.jdfs-provider-google-fonts ' + PROVIDER_TITLE_CLASS).scope().toggle();
    });
  });

  describe('current fonts', function() {
    it('should return an empty list when no fonts are selected', function() {
      expect(fontsService.getUsedFonts().length).toBe(0);
    });

    it('should know which fonts are active', function() {
      $scope.current.font = $scope.fonts[PROVIDER_WEBSAFE][2];
      $scope.$digest();

      expect($scope.current.font).toBeDefined();
      expect(fontsService.getUsedFonts()[0]).toBe([$scope.current.font][0]);
      expect(fontsService.getUsedFonts().length).toBe(1);
    });

    it('should keep track of used fonts for all directives', function() {
      var d = createNewDirective();

      d.scope.current.font = $scope.fonts[PROVIDER_WEBSAFE][1];
      $scope.current.font = $scope.fonts[PROVIDER_WEBSAFE][2];
      $rootScope.$digest();

      expect(fontsService.getUsedFonts().length).toBe(2);
      expect($scope.fonts[PROVIDER_WEBSAFE][1].used).toBe(1);

      d.scope.current.font = $scope.fonts[PROVIDER_WEBSAFE][2];
      d.scope.$digest();

      expect(fontsService.getUsedFonts().length).toBe(1);
      expect(fontsService.getUsedFonts()[0].used).toBe(2);
      expect($scope.fonts[PROVIDER_WEBSAFE][1].used).toBe(0);
    });
  });
});
