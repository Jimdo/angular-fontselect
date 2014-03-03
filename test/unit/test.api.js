/* global $rootScope, DEFAULT_WEBSAFE_FONTS, PROVIDER_GOOGLE, STATE_DEFAULTS,
          createNewDirective, fontsService, NAME_FONTSSERVICE, PROVIDERS */
describe('api', function() {
  var elm, $scope;
  function setupWithState(defaults) {

    if (!angular.isObject(defaults)) {
      defaults = {};
    }

    $rootScope.state = defaults;

    var d = createNewDirective('state="state" stack="stack" name="name"');
    $scope = d.scope;
    elm = d.elm;
  }

  function useGoogleFont() {
    $scope.current.font = fontsService.searchFont({provider: PROVIDER_GOOGLE});
    $scope.$digest();
  }

  it('should expand api data into current', function() {
    setupWithState({foo: 'bar'});
    
    expect($scope.current.foo).toBe('bar');
  });

  it('should bind the current state to an external model', function() {
    setupWithState();

    expect($rootScope.state.font).not.toBeDefined();
    $scope.current.font = 'foo';
    expect($rootScope.state.font).toBe('foo');
  });

  it('should call an init method when passed', function() {
    $rootScope.initFS = jasmine.createSpy('external initiation');

    createNewDirective('on-init="initFS()"');
    expect($rootScope.initFS).toHaveBeenCalled();
  });

  it('should pass the element and scope into external init callback', function() {
    $rootScope.initFS = function($element, $scope) {
      expect($element.length).toBe(1);
      expect($scope.id).toBe(2);
    };

    createNewDirective('on-init="initFS($element, $scope)"');
  });

  describe('basic out', function() {
    beforeEach(function() {
      setupWithState();
      $scope.current.font = DEFAULT_WEBSAFE_FONTS[0];
      $scope.$digest();
    });

    it('should provide the font stack of our currently selected font', function() {
      expect($rootScope.stack).toBe('Arial, "Helvetica Neue", Helvetica, sans-serif, "websafe"');
    });

    it('should provide the name of the current font', function() {
      expect($rootScope.name).toBe('Arial');
    });

    describe('google fonts', function() {

      beforeEach(useGoogleFont);

      it('should have the first google font selected', function() {
        expect($rootScope.name).toBe('Open Sans');
        expect($rootScope.stack).toBe('"Open Sans", sans-serif, "google"');
      });
    });

    describe('font service', function() {

      it('should have a blank list of urls when only one webfont ist selected', function() {
        expect(fontsService.getUrls()).toEqual({});
      });

      describe('google', function() {

        it('should provide an url of the selected google font from the fontsService', function() {
          useGoogleFont();

          expect(fontsService.getUrls()).toEqual({
            google: 'http://fonts.googleapis.com/css?family=Open%20Sans&subset=latin'
          });
        });
      });
    });
  });

  describe('basic in', function() {

    describe('current and selected', function() {
      beforeEach(function() {
        setupWithState();

        expect($scope.name).toBe('');
        expect($scope.stack).toBe('');
        $scope.current.font = DEFAULT_WEBSAFE_FONTS[0];
        $scope.$digest();
      });

      it('should set name and stack when we init with state', function() {
        expect($scope.name).not.toBe('');
        expect($scope.stack).not.toBe('');
      });

      it('should not fail when setting current to something invalid', function() {
        $scope.current = false;
      });

      it('should call the reset method when the state gets invalid', function() {
        spyOn($scope, 'reset').andCallThrough();
        $scope.current = false;
        $scope.$digest();
        expect($scope.reset).toHaveBeenCalled();
      });

      it('should reset to defaults, when the state is set to false', function() {
        $scope.current = false;
        $scope.$digest();
        expect($scope.current.provider).toBe(STATE_DEFAULTS.provider);
      });

      it('should unset the currently selected font name on reset', function() {
        expect($rootScope.name).not.toBe('');
        $scope.reset();
        $scope.$digest();
        expect($rootScope.name).toBe('');
      });

      it('should unset the currently selected font stack on reset', function() {
        expect($rootScope.stack).not.toBe('');
        $scope.reset();
        $scope.$digest();
        expect($rootScope.stack).toBe('');
      });
    });

    describe('stack', function() {
      it('should find the font for our init stack and initiate with it.', function() {
        expect($rootScope.name).not.toBeDefined();
        $rootScope.stack = DEFAULT_WEBSAFE_FONTS[1].stack;
        setupWithState();
        expect($rootScope.name).toBe(DEFAULT_WEBSAFE_FONTS[1].name);
        expect($rootScope.state.font).toBe(DEFAULT_WEBSAFE_FONTS[1]);
      });

      it('should also trigger reset method when stack gets false', function() {
        setupWithState();
        spyOn($scope, 'reset').andCallThrough();
        $rootScope.stack = false;
        $scope.$digest();
        expect($scope.reset).toHaveBeenCalled();
      });

      it('should change the current font if we change the stack', function() {
        setupWithState();
        $rootScope.stack = DEFAULT_WEBSAFE_FONTS[2].stack;
        $rootScope.$digest();
        expect($rootScope.state.font).toBe(DEFAULT_WEBSAFE_FONTS[2]);
      });
    });

    describe('state', function() {
      it('should set a passed state to selected.', function() {
        var state = {font: DEFAULT_WEBSAFE_FONTS[1]};
        setupWithState(state);

        expect($rootScope.name).toBe(DEFAULT_WEBSAFE_FONTS[1].name);
      });

      it('should replace our preselected font with the original from list', function() {
        var currentFont = angular.copy(DEFAULT_WEBSAFE_FONTS[1]);
        setupWithState({ font: currentFont });

        delete $rootScope.state.font.$$hashKey;
        delete $rootScope.state.font.used;

        expect($rootScope.state.font).not.toBe(currentFont);
        expect($rootScope.state.font).toEqual(currentFont);
      });

      it('should leave "outdated" preselected fonts as they are.', function() {
        var currentFont = angular.copy(DEFAULT_WEBSAFE_FONTS[1]);
        currentFont.stack = 'some outdated font stack.';
        setupWithState({ font: currentFont });

        expect($rootScope.state.font).toBe(currentFont);
      });

      it('should be able to find the used font even though it was preselected', function() {
        var font = angular.copy(DEFAULT_WEBSAFE_FONTS[1]);
        var fontsService;
        inject(function($injector) {
          fontsService = $injector.get(NAME_FONTSSERVICE);
        });
        expect(fontsService.getUsedFonts().length).toBe(0);

        setupWithState({ font: font });

        expect(fontsService.getUsedFonts()[0].name).toEqual(font.name);
      });
    });

    describe('set globals on fontsService', function() {
      beforeEach(setupWithState);

      it('should have a getSubsets method', function() {
        expect(fontsService.getSubsets).toBeInstanceOf(Function);
      });

      it('should have a getProviders method', function() {
        expect(fontsService.getProviders).toBeInstanceOf(Function);
      });

      it('should set subsets globally with setSubsets method', function() {
        expect($scope.current.subsets.fooSubset).toBeUndefined();
        fontsService.setSubsets({fooSubset: true});
        expect($scope.current.subsets.fooSubset).toBe(true);
      });

      it('should set providers globally with setProviders method', function() {
        expect($scope.current.subsets.fooProvider).toBeUndefined();
        fontsService.setSubsets({fooProvider: true});
        expect($scope.current.subsets.fooProvider).toBe(true);
      });
    });

    describe('get globals from fontsService', function() {
      var providers, subsets;
      beforeEach(function() {
        providers = {};
        subsets = {};

        fontsService._providers = providers;
        fontsService._subsets = subsets;
      });

      it('should not get any providers from fontsService before we have initiated anything', function() {
        expect(fontsService.getProviders()).toEqual({});
      });

      it('should not get any subsets from fontsService before we have initiated anything', function() {
        expect(fontsService.getSubsets()).toEqual({});
      });

      it('should set default providers to fontService when we initiate a new font selection', function() {
        createNewDirective();
        expect(providers).toEqual(PROVIDERS);
      });

      it('should set default subsets to fontService when we initiate a new font selection', function() {
        createNewDirective();
        expect(subsets).toEqual(STATE_DEFAULTS.subsets);
      });

      it ('should not expand the default providers once they are initiated', function() {
        var fakeProviders = {foo: 'fara'};
        fontsService.setProviders(fakeProviders);
        createNewDirective();
        expect(providers).toEqual(fakeProviders);
      });

      it ('should not expand the default subsets once they are initiated', function() {
        var fakeSubsets = {lorem: 'dolor'};
        fontsService.setSubsets(fakeSubsets);
        createNewDirective();
        expect(subsets).toEqual(fakeSubsets);
      });
    });
  });

});
