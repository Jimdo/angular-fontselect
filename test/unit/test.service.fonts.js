/* global PROVIDER_WEBSAFE, $scope, $rootScope, createNewDirective, fontsService */

describe('fontsService', function() {
  'use strict';

  var customFont = {
    name: 'Foo',
    key: 'foo',
    stack: 'Foo, "Comic Sans", serif'
  };

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
      expect(fontsService._fonts).toContain(customFont);
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
      var all = fontsService.getAllFonts();
      var beforeLength = all.length;

      var index  = fontsService.removeFont(all[0]);
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
      expect(fontsService.searchFont({key: 'timesnewroman', provider: PROVIDER_WEBSAFE}).name)
        .toBe('Times New Roman');
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
    it('should not load google fonts twice, when we open two directives', function() {
      createNewDirective();
    });
  });

  describe('current fonts', function() {
    it('should return an empty list when no fonts are selected', function() {
      expect(fontsService.getUsedFonts().length).toBe(0);
    });

    it('should know which fonts are active', function() {
      $scope.current.font = $scope.fonts[2];
      $scope.$digest();

      expect($scope.current.font).toBeDefined();
      expect(fontsService.getUsedFonts()[0]).toBe([$scope.current.font][0]);
      expect(fontsService.getUsedFonts().length).toBe(1);
    });

    it('should keep track of used fonts for all directives', function() {
      var d = createNewDirective();

      d.scope.current.font = $scope.fonts[1];
      $scope.current.font = $scope.fonts[2];
      $rootScope.$digest();

      expect(fontsService.getUsedFonts().length).toBe(2);
      expect($scope.fonts[1].used).toBe(1);

      d.scope.current.font = $scope.fonts[2];
      d.scope.$digest();

      expect(fontsService.getUsedFonts().length).toBe(1);
      expect(fontsService.getUsedFonts()[0].used).toBe(2);
      expect($scope.fonts[1].used).toBe(0);
    });
  });

  describe('subsets', function() {
    it('should use one global subset object for all directives', function() {
      var d = createNewDirective();
      expect($scope.current.subsets).toBe(d.scope.current.subsets);

      $scope.current.subsets.foo = 'fara';
      expect(d.scope.current.subsets.foo).toBe('fara');
    });
  });

  describe('providers', function() {
    it('should use one global provider object for all directives', function() {
      var d = createNewDirective();
      expect($scope.current.providers).toBe(d.scope.current.providers);

      $scope.current.providers.foo = 'fara';
      expect(d.scope.current.providers.foo).toBe('fara');
    });
  });

  describe('_setSelects method', function() {
    var fixture, input;

    beforeEach(function() {
      input = {bar: true};
      fixture = {foo: true};
    });

    it('should add new keys to global object', function() {
      fontsService._setSelects(fixture, input);
      expect(fixture.bar).toBe(true);
    });

    it('should return the master object', function() {
      expect(fontsService._setSelects(fixture, input)).toBe(fixture);
    });

    it('should do nothing for non-objects', function() {
      expect(fontsService._setSelects(fixture, '')).toBe(fixture);
    });

    it('should delete keys from original in non-additive mode', function() {
      fontsService._setSelects(fixture, input, false);
      expect(fixture.foo).toBeUndefined();
    });

    it('should still use the master object on non-additive mode', function() {
      expect(fixture).not.toEqual(input);

      var returnedObj = fontsService._setSelects(fixture, input, false);
      expect(returnedObj).toBe(fixture);
      expect(returnedObj).not.toBe(input);
      expect(returnedObj).toEqual(input);
    });
  });

  describe('ready method', function() {
    it('should exist', function() {
      expect(fontsService.ready).toBeInstanceOf(Function);
    });

    it('should return a promise', function() {
      expect(fontsService.ready()).toBeInstanceOf(Object);
      expect(fontsService.ready().then).toBeInstanceOf(Function);
    });

    it('should have an internal promise for the google api request', function() {
      expect(fontsService._initPromises.length).toBe(1);
    });

    it('should have been resolved since we have google fonts now.', function() {
      var spy = jasmine.createSpy('fontsService ready');
      fontsService.ready().then(spy);
      fontsService.ready().finally(function() {
        expect(spy).toHaveBeenCalled();
      });
    });

    it('should also handle callbacks passed as parameter.', function() {
      var spy = jasmine.createSpy('fontsService ready');
      fontsService.ready(spy);
      fontsService.ready().finally(function() {
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
