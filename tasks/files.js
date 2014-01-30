var files = {
  grunt: 'Gruntfile.js',
  yepnope: 'bower_components/yepnope/yepnope.js',

  source: [
    'src/js/helper.module.js',
    'src/js/helper.defaults.js',
    'src/js/helper.google-font-categories.js',
    'src/js/helper.functions.js',
    'src/js/filter.start-from.js',
    'src/js/filter.fuzzy-search.js',
    'src/js/filter.has-all-subsets.js',
    'src/js/service.fonts.js',
    'src/js/directive.fontselect.js',
    'src/js/directive.fontlist.js',
    'src/js/directive.font.js'
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

  unitTests: 'test/unit/**/*.js',
  e2eTests: ['test/e2e/SpecHelper.js', 'test/e2e/test.*.js'],
  apiKeys: 'tmp.apikeys.js',
  testEnvKarma: [
    'bower_components/yepnope/yepnope.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js'
  ],

  package: ['package.json', 'bower.json']
};

var apiKeysPos = files.testEnvKarma.length + 1;

files.testEnvKarma = files.testEnvKarma.concat(files.source);
files.testEnvKarma.splice(apiKeysPos, 0, 'tmp.apikeys.js');
files.testEnvKarma.push(files.allPartialsCombined);

files.testEnv = JSON.parse(JSON.stringify(files.testEnvKarma));
files.testEnv.splice(0, 0, 'bower_components/less/dist/less-1.6.1.js');

files.testEnvKarma.splice(0, 0, 'bower_components/jquery/jquery.js');
if (typeof module === 'object') {
  module.exports = files;
}
