describe('fontsService', function() {
  'use strict';

  var fontsService, customFont; //, scope, instance;

  customFont = {
    name: 'Foo',
    key: 'foo',
    stack: 'Foo, "Comic Sans", serif'
  };

  beforeEach(module('fontselect.module'));

  beforeEach(inject(function() {
    inject(function($injector) {
      fontsService = $injector.get('fontselect.fonts');
    });
  }));

  it('should exist', function() {
    expect(fontsService).toBeDefined();
  });

  it('should have a getAll method', function() {
    expect(fontsService.getAll).toBeTypeOf('Function');
  });

  it('should have an add method', function() {
    expect(fontsService.add).toBeTypeOf('Function');
  });

  describe('add method', function() {
    it('should expand the fonts object', function() {
      fontsService.add(customFont);
      expect(fontsService._fonts.websave).toContain(customFont);
    });

    it('should throw an error if we add an invalid font object', function() {
      expect(function() {
        fontsService.add({foo: 'bar'});
      }).toThrow();
    });
  });

  // afterEach(function() {
  //   fontsService.reset();
  // });


  // it('should get created', function() {
  //   expect(rootScope.fontselectApi).toBeDefined();
  // });
  // it('should be able to receive additional fonts from external configuration.', function() {
  //   expect(elm.find('li').length).toBe(5);
  //   scope.fonts.websave.push({name: 'Foo', key: 'foo', stack: 'ASDF'});
  //   expect(elm.find('li').length).toBe(6);
  // });
});