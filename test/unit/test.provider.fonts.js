/* global NAME_FONTS_PROVIDER, NAME_FONTS */
ddescribe('Fonts Provider', function() {
  var fontsProvider;
  var fakeSubProvider;
  var fakeSubProviderName;
  var $injector;
  var $rootScope;
  var $log;
  var fakeFont;
  var fakeFont2;

  beforeEach(function() {
    module('jdFontselect', [NAME_FONTS_PROVIDER, function(_fontsProvider_) {
      fontsProvider = _fontsProvider_;
    }]);

    inject(function(_$injector_, _$rootScope_, _$log_) {
      $injector = _$injector_;
      $rootScope = _$rootScope_;
      $log = _$log_;
    });
    // fontsProvider = $injector.get(NAME_FONTS_PROVIDER);
    // fontService = $injector.get(NAME_FONTSSERVICE);

    fakeSubProviderName = 'Foo';
    fakeSubProvider = {
      name: fakeSubProviderName,
      addFonts: function(add, done) { done(); },
      loadPreview: function() {}
    };

    fakeFont = {
      name: 'Foo',
      key: 'foo',
      stack: 'foo, sans-serif'
    };

    fakeFont2 = {
      name: 'Bar',
      key: 'bar',
      stack: 'bar, serif'
    };
  });

  it('should exist', function() {
    expect(fontsProvider).toBeDefined();
  });

  describe('.register', function() {
    it('should exist', function() {
      expect(fontsProvider.register).toBeInstanceOf(Function);
    });

    it('should throw an error if provider has no name', function() {
      expect(function() {
        fontsProvider.register({});
      }).toThrow();
    });

    it('should throw an error when the same provider is tried to be registered twice', function() {
      fontsProvider.register(fakeSubProvider);
      expect(function() {
        fontsProvider.register(fakeSubProvider);
      }).toThrow();
    });

    it('should throw an error if addFonts is not available on provider', function() {
      expect(function() {
        fontsProvider.register({name: 'Foo'});
      }).toThrow();
    });
  });

  describe('.$get', function() {
    it('should call addFonts of the provider', function() {
      spyOn(fakeSubProvider, 'addFonts');

      fontsProvider.register(fakeSubProvider);

      $injector.get(NAME_FONTS);

      expect(fakeSubProvider.addFonts).toHaveBeenCalled();
    });

    it('should build a font array', function(done) {
      spyOn(fakeSubProvider, 'addFonts').and.callFake(function(add, done) {
        add(fakeFont);
        done();
      });

      fontsProvider.register(fakeSubProvider);

      $injector.get(NAME_FONTS).then(function(fonts) {
        expect(fonts.length).toBe(1);
        expect(fonts[0]).toBe(fakeFont);
        done();
      });

      $rootScope.$digest();
    });

    it('should warn in console when provider had an error', function(done) {
      var error = new Error('fail');
      spyOn($log, 'warn');

      spyOn(fakeSubProvider, 'addFonts').and.callFake(function(add, done) {
        done(error);
      });

      fontsProvider.register(fakeSubProvider);

      $injector.get(NAME_FONTS).then(function() {
        expect($log.warn).toHaveBeenCalled();
        done();
      });
      $rootScope.$digest();
    });

    it('should throw errors if added font is invalid', function(done) {
      var error;
      delete fakeFont.stack;

      spyOn(fakeSubProvider, 'addFonts').and.callFake(function(add, done) {
        try {
          add(fakeFont);
        } catch(e) {
          error = e;
        }
        done();
      });

      fontsProvider.register(fakeSubProvider);

      $injector.get(NAME_FONTS).then(function() {
        expect(error).toBeInstanceOf(Error);
        done();
      });
      $rootScope.$digest();
    });

    it('should keep fonts of one provider when another one fails', function(done) {
      var fakeSubProvider2 = angular.copy(fakeSubProvider);
      fakeSubProvider2.name = 'Bar';

      spyOn(fakeSubProvider, 'addFonts').and.callFake(function(add, done) {
        add(fakeFont2);
        done();
      });
      spyOn(fakeSubProvider2, 'addFonts').and.callFake(function(add, done) {
        done(new Error('WRONG!'));
      });

      fontsProvider.register(fakeSubProvider);
      fontsProvider.register(fakeSubProvider2);

      $injector.get(NAME_FONTS).then(function(fonts) {
        expect(fonts.length).toBe(1);
        expect(fonts[0]).toBe(fakeFont2);
        done();
      });

      $rootScope.$digest();
    });
  });
});
