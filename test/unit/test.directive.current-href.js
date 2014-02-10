/* global $compile, $rootScope, $scope, PROVIDER_GOOGLE, $httpBackend, URL_GOOGLE_FONTS_CSS,
          GOOGLE_FONT_API_RGX, GOOGLE_FONTS_RESPONSE, elm, PROVIDER_TITLE_CLASS */
describe('current href directive', function() {
  var cfElm, $googleScope, $cfScope;

  function activateGoogle() {
    $httpBackend.when('GET', GOOGLE_FONT_API_RGX).respond(GOOGLE_FONTS_RESPONSE);
    $httpBackend.expectGET(GOOGLE_FONT_API_RGX);

    $googleScope = elm.find('.jdfs-provider-google-fonts ' + PROVIDER_TITLE_CLASS).scope();
    $googleScope.toggle();
    $httpBackend.flush(1);

    $scope.current.font = $scope.fonts[PROVIDER_GOOGLE][0];
    $scope.$digest();
  }
  
  beforeEach(function() {
    cfElm = angular.element(
      '<div><link rel="stylesheet/css" type="text/css" jd-fontselect-current-href class="foob" /></div>'
    );

    $compile(cfElm)($rootScope);
    $rootScope.$digest();

    $cfScope = cfElm.scope();
  });

  it('should not exist when we have no external provider', function() {
    expect(cfElm.find('.foob').length).toBe(0);
  });

  it('should become present once we select a google font', function() {
    activateGoogle();
    $scope.current.font = $scope.fonts[PROVIDER_GOOGLE][2];
    $cfScope.$digest();

    var expectedFonURL = URL_GOOGLE_FONTS_CSS + 'family=' + $scope.fonts[PROVIDER_GOOGLE][2].name;

    expect(cfElm.find('.foob').length).toBe(1);
    expect(cfElm.find('.foob').attr('href')).toBe(expectedFonURL);
  });
});
