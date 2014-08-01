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
    'src/js/service.fonts.js',
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
  allPartialsCombined: 'src/partials/all.js',

  wflDir: 'bower_components/webfontloader/',
  libsDir: libsDistDir,

  unitTests: 'test/unit/**/*.js',
  e2eTests: ['test/e2e/SpecHelper.js', 'test/e2e/test.*.js'],
  apiKeys: 'tmp.apikeys.js',
  testEnvKarma: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    libsDistDir + 'webfontloader.js',
    'bower_components/angular-mocks/angular-mocks.js'
  ],

  package: ['package.json', 'bower.json']
};

var apiKeysPos = files.testEnvKarma.length + 1;

/* Prepare environments */
files.testEnvKarma = files.testEnvKarma.concat(files.source);
files.testEnvKarma.splice(apiKeysPos, 0, 'tmp.apikeys.js');

files.testEnv = JSON.parse(JSON.stringify(files.testEnvKarma));
files.testEnv.unshift('bower_components/less/dist/less-1.7.4.js');
files.demoEnv = JSON.parse(JSON.stringify(files.testEnv));

files.testEnv.push('test/default-websafe-fonts.js');
files.testEnvKarma.push(files.allPartialsCombined);
files.testEnvKarma.push('test/default-websafe-fonts.js');
files.testEnvKarma.unshift('bower_components/jasmine-moar-matchers/*.js');

if (typeof module === 'object') {
  module.exports = files;
}
