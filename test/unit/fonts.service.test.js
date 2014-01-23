describe('fontsService', function() {
  'use strict';

  var fontsService, customFont;

  customFont = {
    name: 'Foo',
    key: 'foo',
    stack: 'Foo, "Comic Sans", serif'
  };

  beforeEach(module('jdFontselect'));

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
});
