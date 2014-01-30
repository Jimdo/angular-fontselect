/**
 * Some tasks we need to perform before any test-suite starts.
 */
/* jshint undef: false */

/* some globals we might need later on, set in beforeEach */
var $rootScope, $compile, $injector, $httpBackend, $scope, $q, $controller, elm;

/* Mock the default font set. */
DEFAULT_WEBSAFE_FONTS = [
  {
    name: 'Arial',
    key: 'arial',
    category: 'sans-serif',
    stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif'
  },
  {
    name: 'Courier New',
    key: 'couriernew',
    category: 'other',
    stack: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace'
  },
  {
    name: 'Verdana',
    key: 'verdana',
    category: 'sans-serif',
    stack: 'Verdana, Geneva, sans-serif'
  },
  {
    name: 'Times New Roman',
    key: 'timesnewroman',
    category: 'serif',
    stack: 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif'
  },
  {
    name: 'Brush Script',
    key: 'brushscript',
    category: 'handwriting',
    stack: '"Brush Script MT", cursive'
  }
];


(function() {
  
  beforeEach(function() {
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

    /* Make sure, there are no unexpected request */
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
})();