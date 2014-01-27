/**
 * Some tasks we need to perform before any test-suite starts.
 */
/* jshint undef: false */

/* some globals we might need later on, set in beforeEach */
var $rootScope, $compile, $injector, $httpBackend, $scope, elm;

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
  /* Teach the FontselectController to reference himself on the scope */
  var originalConstruct = FontselectController.prototype._construct;
  FontselectController.prototype._construct = function() {
    var self = this;
    originalConstruct.apply(self, arguments);
    self.$scope.getSelf = function() {
      return self;
    };
  };
  
  /* Request Regex for catching Google Font API calls. */

  beforeEach(function() {
    /* Initiate the main module */
    module('jdFontselect');

    inject(['$rootScope', '$compile', '$injector', '$httpBackend', function(a, b, c, d) {
      /* Get or globals */
      $rootScope   = a;
      $compile     = b;
      $injector    = c;
      $httpBackend = d;

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
    $scope.getSelf()._resetIDs();

    /* Make sure, there are no unexpected request */
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
})();