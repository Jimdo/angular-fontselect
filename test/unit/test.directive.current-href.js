/* global $compile, $rootScope, $scope, PROVIDER_GOOGLE, URL_GOOGLE_FONTS_CSS,
          fontsService, SUBSET_LATIN_EXT */
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

  function getLinkTags() {
    return cfElm.find('.foob');
  }

  function getHref() {
    return getLinkTags().attr('href');
  }

  describe('google fonts', function() {
    beforeEach(function() {
      $scope.current.font = fontsService.searchFonts({provider: PROVIDER_GOOGLE})[2];
      $cfScope.$digest();
    });

    it('should become present once we select a google font', function() {
      var expectedFonURL = URL_GOOGLE_FONTS_CSS + '?family=' + $scope.current.font.name;

      expect(getLinkTags().length).toBe(1);
      expect(getHref()).toContain(expectedFonURL);
    });

    it('should add the subset selection to the url', function() {
      $scope.current.subsets[SUBSET_LATIN_EXT] = true;
      $cfScope.$digest();

      expect(getHref()).toContain(SUBSET_LATIN_EXT);
    });
  });
});
