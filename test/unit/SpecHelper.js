/**
 * Some tasks we need to perform before any test-suite starts.
 */
/* jshint undef: false, unused: false  */

/* some globals we might need later on, set in initGlobals */
var basicGlobals = [
  '$rootScope',
  '$compile',
  '$injector',
  '$httpBackend',
  '$q',
  '$controller',
  '$timeout'
];

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

beforeEach(function() {
  DEFAULT_WEBSAFE_FONTS_BACKUP = angular.copy(DEFAULT_WEBSAFE_FONTS);
});

/**
 * Initiate the angular module we want to test on and initiate
 * global angular modules required for testing (like $rootScope etc.)
 *
 * @param {bool} [withModule]  disable automatic module initiation
 *                             (by default, the module is initiated
 *                             automatically for you)
 * @paran {array} [additional] array of strings for additional modules
 *                             to be exposed on the window, can also be the first
 *                             parameter if withModule should be true
 */
function initGlobals(withModule, additional) {
  if (angular.isArray(withModule)) {
    additional = withModule;
    withModule = true;
  }

  if (!angular.isArray(additional)) {
    additional = [];
  }

  if (withModule !== false) {
    /* Initiate the main module */
    module('jdFontselect', function($provide) {
      var webFont = {
        load: function() {}
      };

      $provide.value('jdfsWebFont', {
        getFontLoader: function() {
          return webFont;
        }
      });
    });
  }

  inject(function($injector) {
    basicGlobals.concat(additional).forEach(function(global) {
      initGlobals.cleanup.push({name: global, value: window[global]});
      window[global] = $injector.get(global);
    });
  });
}
initGlobals.cleanup = [];

function createDirective(attributeStr, flush) {
  if (!$compile) {
    throw new Error('globals were not initiated');
  }

  var r = {};
  var googleActive = false;

  angular.forEach($injector.get(NAME_FONTSSERVICE).getProviders(), function(active, provider) {
    if (provider === PROVIDER_GOOGLE && active) {
      googleActive = true;
    }
  });

  if (googleActive) {
    $httpBackend.when('GET', GOOGLE_FONT_API_RGX).respond(GOOGLE_FONTS_RESPONSE);
    $httpBackend.expectGET(GOOGLE_FONT_API_RGX);
  }

  /* Create the element for our directive */
  r.elm = angular.element(
    '<div id="wrap-' + directiveID + '">' +
      '<jd-fontselect ' + attributeStr + '/>' +
    '</div>');

  /* Apply the directive */
  $compile(r.elm)($rootScope);
  $rootScope.$digest();

  /* Save a reference to the directive scope */
  r.scope = r.elm.children().isolateScope() || r.elm.children().scope();

  if (googleActive && flush !== false) {
    $httpBackend.flush(1);
  }

  directiveID++;

  return r;
}

afterEach(function(done) {
  /* Each directive gets it's own id, we want to test only on id 1 */
  id = 1;
  directiveID = 1;
  _googleFontsInitiated = false;
  DEFAULT_WEBSAFE_FONTS = DEFAULT_WEBSAFE_FONTS_BACKUP;

  if (window.$httpBackend) {
    /* Make sure, there are no unexpected request!
       Since verifyNoOutstandingExpectation will do a digest we do not want
       that to collide with any digests we're doing in tests. -> timeout. */
    setTimeout(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      done();
    }, 0);
  } else {
    done();
  }
});

/* Clean-up globals initiated by initGlobals */
afterEach(function() {
  initGlobals.cleanup.forEach(function(global) {
    if (angular.isUndefined(global.value)) {
      delete window[global.name];
    } else {
      window[global.name] = global.value;
    }
  });
  initGlobals.cleanup = [];
});
