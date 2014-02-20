/* global $compile, $rootScope, $scope, PROVIDER_GOOGLE, URL_GOOGLE_FONTS_CSS,
          fontsService */
describe('current href directive', function() {
  var cfElm, $cfScope;

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
    $scope.current.font = fontsService.searchFonts({provider: PROVIDER_GOOGLE})[2];
    $cfScope.$digest();

    var expectedFonURL = URL_GOOGLE_FONTS_CSS + 'family=' + $scope.current.font.name;

    expect(cfElm.find('.foob').length).toBe(1);
    expect(cfElm.find('.foob').attr('href')).toBe(expectedFonURL);
  });
});
