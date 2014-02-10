/**
 * Some tasks we need to perform before any test-suite starts.
 */
/* jshint undef: false, unused: false  */

/* some globals we might need later on, set in beforeEach */
var $rootScope, $compile, $injector, $httpBackend, $scope, $q, $controller, elm;

/* Request Regex for catching Google Font API calls. */
/** @const */
var GOOGLE_FONT_API_RGX = /http(s)?:\/\/www\.googleapis\.com\/webfonts\/v1\/.*/;

/** @const */
var PROVIDER_TITLE_CLASS = '.jdfs-provider-title';

/** @const */
var ANOTHER_FONT = {
  name: 'Drrrt',
  key: 'drt',
  category: 'display',
  stack: 'Drrrt, cursive',
  popularity: 10,
  lastModified: '2014-01-30',
  subsets: [SUBSET_LATIN, SUBSET_GREEK]
};

var AND_SOME_FONT_MORE = {
  name: 'Mooh',
  key: 'mooh',
  category: 'handwriting',
  stack: 'Mooh, cursive',
  popularity: 7,
  lastModified: '2014-01-31',
  subsets: [SUBSET_VIETNAMESE]
};

var DEFAULT_WEBSAFE_FONTS_BACKUP;

beforeEach(function() {

  DEFAULT_WEBSAFE_FONTS_BACKUP = angular.copy(DEFAULT_WEBSAFE_FONTS);

  /* Initiate the main module */
  module('jdFontselect');

  /* jshint maxparams: 10 */
  inject(function(_$rootScope_, _$compile_, _$injector_, _$httpBackend_, _$q_, _$controller_) {
  /* jshint maxparams: 3 */
    $rootScope   = _$rootScope_;
    $compile     = _$compile_;
    $injector    = _$injector_;
    $httpBackend = _$httpBackend_;
    $q           = _$q_;
    $controller  = _$controller_;
  });

  /* Create the element for our directive */
  elm = angular.element(
    '<div>' +
      '<jd-fontselect />' +
    '</div>');

  /* Apply the directive */
  $compile(elm)($rootScope);
  $rootScope.$digest();

  /* Save a reference to the directive scope */
  $scope = elm.find('.jdfs-main div').scope();
});

afterEach(function() {
  /* Each directive gets it's own id, we want to test only on id 1 */
  id = 1;
  DEFAULT_WEBSAFE_FONTS = DEFAULT_WEBSAFE_FONTS_BACKUP;
  _webFontLoaderInitiated = false;
  /* Make sure, there are no unexpected request */
  $httpBackend.verifyNoOutstandingExpectation();
  $httpBackend.verifyNoOutstandingRequest();
});
