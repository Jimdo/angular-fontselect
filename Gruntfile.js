var API_KEY_FILENAME = 'tmp.apikeys.js';

/* custom tasks */
module.exports = function(grunt) {
  var fs = require('fs');
  var wflDir = 'bower_components/webfontloader/';
  var libsDistDir = 'dist/libs/';

  var helpers = {
    setUpApiKeyFile: function() {
      var keys = {}, hasKeys = false;

      if (process.env.JD_FONTSELECT_GOOGLE_FONTS_API_KEY) {
        keys.googleApiKey = process.env.JD_FONTSELECT_GOOGLE_FONTS_API_KEY;
        hasKeys = true;
      }

      if (hasKeys) {
        fs.writeFileSync(
          API_KEY_FILENAME,
          'angular.module("jdFontselect").constant("jdFontselectConfig", ' + JSON.stringify(keys) + ');'
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
    'angular-toolbox': {
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
          unit: ['test/unit/**/*.js'],
          e2e: [
            'test/e2e/SpecHelper.js',
            'test/e2e/test.*.js'
          ]
        },
        vendor: {
          js: {
            top: [
              'bower_components/jquery/dist/jquery.js',
              'dist/libs/webfontloader.js'
            ],
            bottom: [
              'test/default-websafe-fonts.js'
            ]
          }
        }
      },
      envFilter: function(env) {
        env.splice(
          env.indexOf('src/js/helper.module.js') + 1,
          0,
          API_KEY_FILENAME
        );

        return env;
      }
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
  require('grunt-angular-toolbox').addTasks();

  grunt.registerTask('_buildapikeys', function() {
    helpers.setUpApiKeyFile();
    helpers.ensureApiKeyFileExists();
  });

  grunt.registerTask('test:before', ['_buildapikeys']);
  grunt.registerTask('build:before', ['_buildapikeys', 'shell:buildWFL']);

  grunt.registerTask('default', ['test']);
};
