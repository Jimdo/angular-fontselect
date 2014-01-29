/**
 * Some tasks we need to perform before any test-suite starts.
 */
/* jshint undef: false */

/* some globals we might need later on, set in beforeEach */
var $rootScope, $compile, $injector, $httpBackend, $scope, $q, elm;

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

    inject(['$rootScope', '$compile', '$injector', '$httpBackend', '$q', function(a, b, c, d, e) {
      /* Get or globals */
      $rootScope   = a;
      $compile     = b;
      $injector    = c;
      $httpBackend = d;
      $q           = e;

      /* Create the element for our directive */
      elm = angular.element(
        '<div>' +
          '<jd-fontselect />' +
        '</div>');

      /* Apply the directive */
      $compile(elm)($rootScope);
      $rootScope.$digest();

      /* Save a reference to the directive scope */
      $scope = elm.find('.fs-main div').scope();
    }]);
  });

  afterEach(function() {
    /* Each directive gets it's own id, we want to test only on id 1 */
    id = 1;

    /* Make sure, there are no unexpected request */
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
})();