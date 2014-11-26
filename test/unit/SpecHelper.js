/**
 * Some tasks we need to perform before any test-suite starts.
 */
/* jshint undef: false, unused: false  */

/* some globals we might need later on, set in beforeEach */
var $rootScope, $compile, $injector, $httpBackend, $scope, $q, $controller, $googleScope, elm, fontsService, $timeout;

/* Request Regex for catching Google Font API calls. */
/** @const */
var GOOGLE_FONT_API_RGX = /http(s)?:\/\/www\.googleapis\.com\/webfonts\/v1\/.*/;

/** @const */
var LIST_CONTAINER_CLASS = '.jdfs-fontlistcon';

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

/** @const */
var AND_SOME_FONT_MORE = {
  name: 'Mooh',
  key: 'mooh',
  category: 'handwriting',
  stack: 'Mooh, cursive',
  popularity: 7,
  lastModified: '2014-01-31',
  subsets: ['fooSubset']
};

var DEFAULT_WEBSAFE_FONTS_BACKUP;
var directiveID = 1;

function createNewDirective(attributeStr) {
  var e, scope;

  /* Create the element for our directive */
  e = angular.element(
    '<div id="wrap-' + directiveID + '">' +
      '<jd-fontselect ' + attributeStr + '/>' +
    '</div>');

  /* Apply the directive */
  $compile(e)($rootScope);
  $rootScope.$digest();

  /* Save a reference to the directive scope */
  scope = e.find('.jdfs-main div').scope();

  directiveID++;

  return {
    elm: e,
    scope: scope
  };
}

beforeEach(function() {

  DEFAULT_WEBSAFE_FONTS_BACKUP = angular.copy(DEFAULT_WEBSAFE_FONTS);

  /* Initiate the main module */
  module('jdFontselect');

  /* jshint maxparams: 10 */
  inject(function(_$rootScope_, _$compile_, _$injector_, _$httpBackend_, _$q_, _$controller_, _$timeout_) {
  /* jshint maxparams: 3 */
    $rootScope   = _$rootScope_;
    $compile     = _$compile_;
    $injector    = _$injector_;
    $httpBackend = _$httpBackend_;
    $q           = _$q_;
    $controller  = _$controller_;
    $timeout     = _$timeout_;
  });

  fontsService = $injector.get(NAME_FONTSSERVICE);

  $httpBackend.when('GET', GOOGLE_FONT_API_RGX).respond(GOOGLE_FONTS_RESPONSE);
  $httpBackend.expectGET(GOOGLE_FONT_API_RGX);

  var d = createNewDirective();

  elm = d.elm;
  $scope = d.scope;

  $httpBackend.flush(1);
});

afterEach(function(done) {
  /* Each directive gets it's own id, we want to test only on id 1 */
  id = 1;
  directiveID = 1;
  _googleFontsInitiated = false;
  DEFAULT_WEBSAFE_FONTS = DEFAULT_WEBSAFE_FONTS_BACKUP;

  /* Since verifyNoOutstandingExpectation will do a digest we do not want
     that to collide with any digests we're doing in tests. -> timeout. */
  setTimeout(function() {
    /* Make sure, there are no unexpected request */
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    done();
  }, 0);
});
