var _ = require('grunt').util._;
var libsDistDir = 'dist/libs/';

var files = {
  grunt: 'Gruntfile.js',

  source: [
    'src/js/helper.module.js',
    'src/js/helper.defaults.js',
    'src/js/helper.google-font-categories.js',
    'src/js/helper.functions.js',
    'src/js/filter.start-from.js',
    'src/js/filter.fuzzy-search.js',
    'src/js/filter.stack-search.js',
    'src/js/filter.has-all-subsets.js',
    'src/js/provider.fonts.js',
    'src/js/provider.fonts-websafe.js',
    'src/js/service.fonts.js',
    'src/js/service.preview.js',
    'src/js/directive.fontselect.js',
    'src/js/directive.fontlist.js',
    'src/js/directive.font.js',
    'src/js/directive.current-href.js',
    'src/js/directive.meta.js'
  ],
  sourceStyle: [
    'src/less/fontselect.less'
  ],

  distStyle: 'dist/<%= pkg.name %>.css',
  distStyleMin: 'dist/<%= pkg.name %>.min.css',
  dist: 'dist/<%= pkg.name %>.js',
  distMin: 'dist/<%= pkg.name %>.min.js',
  dists: 'dist/*',

  partialsDir: 'src/partials',
  allHTML: '*.html',
  allPartials: 'src/partials/*.html',
  allPartialsCombined: 'test/e2e/env/all-partials.js',

  wflDir: 'bower_components/webfontloader/',
  libsDir: libsDistDir,

  unitTests: 'test/unit/**/*.js',
  e2eTests: ['test/e2e/SpecHelper.js', 'test/e2e/test.*.js'],
  apiKeys: 'tmp.apikeys.js',

  environments: {},

  demo: 'demo/*',

  package: ['package.json', 'bower.json']
};

/* Prepare environments */
var sourceWithApiKeys = _.clone(files.source);
sourceWithApiKeys.splice(1, 0, 'tmp.apikeys.js');

var baseEnvironment = [].concat(
  'bower_components/jquery/dist/jquery.js',
  'bower_components/angular/angular.js',
  libsDistDir + 'webfontloader.js',
  sourceWithApiKeys,
  files.allPartialsCombined
);

var demoEnvironment = _.clone(baseEnvironment);
var karmaEnvironment = _.clone(baseEnvironment);

karmaEnvironment.unshift('bower_components/jasmine-moar-matchers/*.js');
karmaEnvironment.push('test/default-websafe-fonts.js');
karmaEnvironment.push('bower_components/angular-mocks/angular-mocks.js');

files.environments.demo = demoEnvironment;
files.environments.karma = karmaEnvironment;

if (typeof module === 'object') {
  module.exports = files;
}
