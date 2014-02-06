/* global $compile, $rootScope, DEFAULT_WEBSAFE_FONTS, PROVIDER_GOOGLE, $httpBackend,
          GOOGLE_FONT_API_RGX, GOOGLE_FONTS_RESPONSE */
describe('api', function() {
  var elm, $scope;
  function setupWithState(defaults) {

    if (!angular.isObject(defaults)) {
      defaults = {};
    }

    $rootScope.state = defaults;
    $rootScope.selected = {};

    /* Create the element for our directive */
    elm = angular.element(
      '<div>' +
        '<jd-fontselect state="state" selected="selected"/>' +
      '</div>');

    /* Apply the directive */
    $compile(elm)($rootScope);
    $rootScope.$digest();

    /* Save a reference to the directive scope */
    $scope = elm.find('.jdfs-main div').scope();
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
      
      var $subScope;

      beforeEach(function() {
        $httpBackend.when('GET', GOOGLE_FONT_API_RGX).respond(GOOGLE_FONTS_RESPONSE);
        $httpBackend.expectGET(GOOGLE_FONT_API_RGX);

        $subScope = elm.find('.jdfs-provider-google-fonts h3').scope();
        $subScope.toggle();
        $httpBackend.flush(1);

        $scope.current.font = $scope.fonts[PROVIDER_GOOGLE][0];
        $scope.$digest();
      });

      it('should switch to google fonts', function() {
        expect($rootScope.state.provider).toBe(PROVIDER_GOOGLE);
      });

      it('should have the first google font selected', function() {
        expect($rootScope.selected.name).toBe('Open Sans');
        expect($rootScope.selected.stack).toBe('"Open Sans", sans-serif');
      });

      xit('should be able to get multiple font styles (bold, regular, italic ...)', function() {
        expect('implement here').toBe(true);
      });
    });
  });
});
