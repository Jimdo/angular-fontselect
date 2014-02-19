/* global $rootScope, DEFAULT_WEBSAFE_FONTS, PROVIDER_GOOGLE, STATE_DEFAULTS,
          createNewDirective, activateGoogle, $googleScope, $httpBackend,
          NAME_FONTSSERVICE */
describe('api', function() {
  var elm, $scope;
  function setupWithState(defaults) {

    if (!angular.isObject(defaults)) {
      defaults = {};
    }

    $rootScope.state = defaults;
    $rootScope.selected = {};

    var d = createNewDirective('state="state" selected="selected"');
    $scope = d.scope;
    elm = d.elm;
  }

  function useGoogleFont() {
    activateGoogle(elm);

    $scope.current.font = $scope.fonts[PROVIDER_GOOGLE][0];
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

  describe('basic out', function() {
    beforeEach(function() {
      setupWithState();
      $scope.current.font = DEFAULT_WEBSAFE_FONTS[0];
      $scope.$digest();
    });

    it('should provide the font stack of our currently selected font', function() {
      expect($rootScope.selected.stack).toBe('Arial, "Helvetica Neue", Helvetica, sans-serif');
    });

    it('should provide the name of the current font', function() {
      expect($rootScope.selected.name).toBe('Arial');
    });

    describe('google fonts', function() {
      beforeEach(useGoogleFont);

      it('should switch to google fonts', function() {
        expect($rootScope.state.provider).toBe(PROVIDER_GOOGLE);
      });

      it('should have the first google font selected', function() {
        expect($rootScope.selected.name).toBe('Open Sans');
        expect($rootScope.selected.stack).toBe('"Open Sans", sans-serif');
      });

      it('should call the change event on change', function() {
        var spy = jasmine.createSpy('jdfs.change event');
        var font = $scope.fonts[PROVIDER_GOOGLE][2];
        $googleScope.$on('jdfs.change', spy);

        $scope.current.font = font;
        $scope.$digest();

        expect(spy).toHaveBeenCalled();
        expect(spy.mostRecentCall.args[1]).toEqual({name: font.name, stack: font.stack});
      });

    });

    describe('font service', function() {
      var fontsService;

      beforeEach(function() {
        inject(function($injector) {
          fontsService = $injector.get('jdFontselect.fonts');
        });
      });

      it('should have a blank list of urls when only one webfont ist selected', function() {
        expect(fontsService.getUrls()).toEqual({});
      });

      describe('google', function() {

        it('should provide an url of the selected google font from the fontsService', function() {
          useGoogleFont();

          expect(fontsService.getUrls()).toEqual({
            google: 'http://fonts.googleapis.com/css?family=Open%20Sans'
          });
        });
      });
    });
  });

  describe('basic in', function() {

    describe('current and selected', function() {
      beforeEach(function() {
        setupWithState();
        $scope.current.font = DEFAULT_WEBSAFE_FONTS[0];
        $scope.$digest();
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

      it('should unset the currently selected font on reset', function() {
        expect($rootScope.selected.name).toBeDefined();
        $scope.reset();
        $scope.$digest();
        expect($rootScope.selected.name).not.toBeDefined();
      });
    });

    describe('state', function() {
      it('should set a passed state to selected.', function() {
        var state = {font: DEFAULT_WEBSAFE_FONTS[1]};
        setupWithState(state);

        expect($rootScope.selected.name).toBe(DEFAULT_WEBSAFE_FONTS[1].name);
      });

      it('should have the google font category active, when state provider is google', function() {
        var state = {provider: PROVIDER_GOOGLE};
        setupWithState(state);
        $httpBackend.flush();

        expect(elm.find('.jdfs-provider-google').attr('class')).toContain('jdfs-active');
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
        currentFont.name = 'Foobar Font';
        currentFont.key = 'foobarfont';
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
  });
});
