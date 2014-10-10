/* global $rootScope, $injector, NAME_PROVIDER_MANAGER, NAME_FONTSSERVICE, DEFAULT_WEBSAFE_FONTS */
describe('Provider Manager', function() {
  var providerManager;
  var fontService;
  var fakeProvider;
  var fakeProviderName;

  beforeEach(function() {
    providerManager = $injector.get(NAME_PROVIDER_MANAGER);
    fontService = $injector.get(NAME_FONTSSERVICE);

    fakeProviderName = 'Foo';
    fakeProvider = {
      name: fakeProviderName,
      addFonts: function(add, done) { done(); }
    };
  });

  it('should exist', function() {
    expect(providerManager).toBeDefined();
  });

  describe('.register', function() {
    it('should exist', function() {
      expect(providerManager.register).toBeInstanceOf(Function);
    });

    it('should throw an error if provider has no name', function() {
      expect(function() {
        providerManager.register({});
      }).toThrow();
    });

    it('should throw an error when the same provider is tried to be registered twice', function() {
      providerManager.register(fakeProvider);
      expect(function() {
        providerManager.register(fakeProvider);
      }).toThrow();
    });

    it('should throw an error if addFonts is not available on provider', function() {
      expect(function() {
        providerManager.register({name: 'Foo'});
      }).toThrow();
    });

    it('should call addFonts of the provider', function() {
      var fakeProvider = {
        name: 'Foo',
        addFonts: jasmine.createSpy('addFonts')
      };

      providerManager.register(fakeProvider);

      expect(fakeProvider.addFonts).toHaveBeenCalled();
    });

    describe('addFonts', function() {
      var add;
      var doneAdding;
      var promise;
      var providerName = 'myProvider';

      beforeEach(function() {
        promise = providerManager.register({
          name: providerName,
          addFonts: function(addFont, doneCb) {
            add = addFont;
            doneAdding = doneCb;
          }
        });
      });

      it('should proxy add to fontsService', function() {
        var font = DEFAULT_WEBSAFE_FONTS[0];
        spyOn(fontService, 'add');
        add(font);

        expect(fontService.add).toHaveBeenCalledWith(font, providerName);
      });

      it('should resolve registerPromise', function(done) {
        doneAdding();
        promise.then(done);
        $rootScope.$digest();
      });

      it('should reject the registerPromise', function(done) {
        var someError = new Error();
        doneAdding(someError);
        promise.catch(function(err) {
          expect(err).toBe(someError);
          done();
        });
        $rootScope.$digest();
      });
    });
  });

  describe('.get', function() {
    it('should throw if provider does not exist', function() {
      expect(function() {
        providerManager.get('foo');
      }).toThrow();
    });

    it('should get a previously added provider by name', function() {
      providerManager.register(fakeProvider);
      expect(providerManager.get(fakeProviderName)).toBe(fakeProvider);
    });
  });
});
