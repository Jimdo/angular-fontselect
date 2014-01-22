var files = {
  grunt: 'Gruntfile.js',
  source: [
    'src/js/defaults.js',
    'src/js/helpers.js',
    'src/js/module.js',
    'src/js/fonts.service.js',
    'src/js/fontselect.controller.js',
    'src/js/fontselect.directive.js',
  ],
  sourceStyle: [
    'src/less/fontselect.less'
  ],
  distStyle: 'dist/<%= pkg.name %>.css',
  distStyleMin: 'dist/<%= pkg.name %>.min.css',
  dist: 'dist/<%= pkg.name %>.js',
  distMin: 'dist/<%= pkg.name %>.min.js',
  dists: 'dist/*',
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
