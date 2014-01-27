var _ = require('grunt').util._;

var source = [
  'src/js/module.js',
  'src/js/defaults.js',
  'src/js/googleFontCategories.js',
  'src/js/helpers.js',
  'src/js/startFrom.filter.js',
  'src/js/fuzzy.filter.js',
  'src/js/fonts.service.js',
  'src/js/fontselect.controller.js',
  'src/js/fontselect.directive.js',
  'src/js/fontlist.directive.js',
  'src/js/font.directive.js'
];
var testSource = _.clone(source);
testSource.splice(1, 0, 'tmp.apikeys.js');

var files = {
  grunt: 'Gruntfile.js',
  source: source,
  testSource: testSource,
  sourceStyle: [
    'src/less/fontselect.less'
  ],
  yepnope: 'bower_components/yepnope/yepnope.js',
  distStyle: 'dist/<%= pkg.name %>.css',
  distStyleMin: 'dist/<%= pkg.name %>.min.css',
  dist: 'dist/<%= pkg.name %>.js',
  distMin: 'dist/<%= pkg.name %>.min.js',
  dists: 'dist/*',
  apiKeys: 'tmp.apikeys.js',
  testEnv: [
    'bower_components/jquery/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js'
  ],
  package: ['package.json', 'bower.json'],
  allPartials: 'src/partials/*.html',
  allPartialsCombined: 'src/partials/all.js',
  unitTests: 'test/unit/**/*.js',
  partialsDir: 'src/partials',
  allHTML: '*.html'
};

module.exports = files;
