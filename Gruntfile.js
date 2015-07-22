var API_KEY_FILENAME = 'tmp.apikeys.js';

/* custom tasks */
module.exports = function(grunt) {
  var fs = require('fs');
  var wflDir = 'bower_components/webfontloader/';
  var libsDistDir = 'dist/libs/';

  var helpers = {
    setUpApiKeyFile: function() {
      var googleApiKey = {}, hasKeys = false;

      if (process.env.JD_FONTSELECT_GOOGLE_FONTS_API_KEY) {
        googleApiKey = process.env.JD_FONTSELECT_GOOGLE_FONTS_API_KEY;
        hasKeys = true;
      }

      if (hasKeys) {
        fs.writeFileSync(
          API_KEY_FILENAME,
          'window._jdFontselectGoogleApiKey = \'' + googleApiKey + '\';'
        );
      }
    },
    ensureApiKeyFileExists: function() {
      var exists = grunt.file.exists(API_KEY_FILENAME);
      if (!exists) {
        grunt.fail.fatal('We need an API key for the Google web fonts, please get one here:' +
          'https://developers.google.com/fonts/docs/developer_api#Auth'
        );
      }
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    angularToolbox: {
      moduleName: 'jdFontselect',
      files: {
        src: {
          js: [
            'src/js/helper.module.js',
            'src/js/helper.defaults.js',
            'src/js/helper.google-font-categories.js',
            'src/js/helper.functions.js',
            'src/js/!(helper)*.js'
          ]
        },
        test: {
          unit: [
            'test/default-websafe-fonts.js',
            'test/unit/**/*.+(js|coffee)'
          ],
          e2e: [
            'test/e2e/SpecHelper.js',
            'test/e2e/test.*.js'
          ]
        },
      },
    },
    shell: {
      buildWFL: {
        options: {
          failOnError: true,
          stderr: true
        },
        command: [
          'BASEDIR=`pwd`',
          'cd ' + wflDir,
          'bundle install --path=vendor/bundle',
          'bundle exec rake compile',
          'cd $BASEDIR',
          'mkdir -p ' + libsDistDir,
          'echo ' + libsDistDir + 'webfontloader.js',
          'mv ' + wflDir + 'target/webfont.js ' + libsDistDir + 'webfontloader.js'
        ].join(';')
      }
    }
  });

  grunt.loadNpmTasks('grunt-angular-toolbox');

  grunt.registerTask('_buildapikeys', function() {
    helpers.setUpApiKeyFile();
    helpers.ensureApiKeyFileExists();
  });

  grunt.registerTask('demo:before', ['_buildapikeys']);
  grunt.registerTask('test:before', ['_buildapikeys']);
  grunt.registerTask('build:before', ['_buildapikeys', 'shell:buildWFL']);

  grunt.registerTask('default', ['test']);
};
