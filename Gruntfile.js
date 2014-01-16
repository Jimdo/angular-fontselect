/*global module, require */

/**
 * Build instructions for grunt.
 * @param  {Object} grunt
 * @return {void}
 */
module.exports = function(grunt) {
  'use strict';

  var source = [
    'src/js/helpers.js',
    'src/js/module.js',
    'src/js/fontselect.controller.js',
    'src/js/fontselect.directive.js',
  ];

  var packageFiles = ['package.json', 'bower.json'];

  var testfiles = ['test/**/*.js'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /*
     * TEST
     */
    karma: {
      options: {
        frameworks: [
          'jasmine'
        ],
        files: [
          'bower_components/jquery/jquery.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-mocks/angular-mocks.js',
        ].concat(source).concat(['<%= ngtemplates["fontselect.module"].dest %>']).concat(testfiles)
      },
      all: {
        options: {
          browsers: ['PhantomJS', 'Chrome', 'Firefox'],
          singleRun: true
        }
      },
      headless: {
        options: {
          browsers: ['PhantomJS'],
          singleRun: true
        }
      },
      watch: {
        options: {
          browsers: ['Chrome'],
          background: true
        }
      }
    },

    /*
     * LINT
     */
    jshint: {
      files: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true
      }
    },

    /*
     * WATCH
     */
    watch: {
      andtest: {
        files: ['<%= jshint.files %>', 'src/partials/**/*.html'].concat(testfiles),
        tasks: ['ngtemplates', 'jshint', 'karma:watch:run']
      }
    },

    /*
     * PREPARE PARTIALS
     */
    ngtemplates: {
      options: {
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      },
      'fontselect.module': {
        cwd: 'src/partials',
        src: '*.html',
        dest: 'src/partials/all.js',
      }
    },

    /*
     * CONCAT, WRAP AND ADD BANNERS
     */
    concat: {
      options: {
        separator: '\n\n',
        stripBanners: true,
        banner: [
          '/*!',
          ' * <%= pkg.name %> v<%= pkg.version %>',
          ' * <%= pkg.homepage %>',
          ' *',
          ' * <%= pkg.description %>',
          ' *',
          ' * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author %>',
          ' * Released under the <%= pkg.license %> license',
          ' */',
          '(function(angular) {',
          '  \'use strict\';',
          ''
        ].join(grunt.util.linefeed),
        footer: ['', '})(angular);', ''].join(grunt.util.linefeed),
        process: function (src, filepath) {
          /* Normalize line-feeds */
          src = grunt.util.normalizelf(src);

          /* Remove jshint comments */
          src = src.replace(/[\s]*\/\* (jshint|global).*\n/g, '');

          /* Trim */
          src = src.replace(/^\s+|\s+$/g, '');

          /* Indent */
          src = src.split(grunt.util.linefeed).map(function(line) {
            return '  ' + line;
          }).join(grunt.util.linefeed);

          return '  // ' + filepath + grunt.util.linefeed + src;
        }
      },
      dist: {
        src: source.concat(['<%= ngtemplates["fontselect.module"].dest %>']),
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    /*
     * MINIFY
     */
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    /*
     * BUMP VERSION
     */
    bump: {
      options: {
        files: packageFiles,
        updateConfigs: ['pkg'],
        commit: false,
        createTag: false,
        push: false
      }
    },

    /*
     * GIT STUFF
     */
    gitcommit: {
      dist: {
        options: {
          message: 'Release v<%= pkg.version %>',
        },
        files: {
          src: ['dist/*'].concat(packageFiles)
        }
      }
    },
    gittag: {
      dist: {
        options: {
          tag: 'v<%= pkg.version %>',
          message: 'Version <%= pkg.version %>'
        }
      }
    },
    gitpush: {
      dist: {
        options: {
          remote: 'origin',
        }
      },
      disttags: {
        options: {
          remote: 'origin',
          tags: true
        }
      }
    }
  });

  /* Load grunt tasks from NPM packages */
  require('load-grunt-tasks')(grunt);

  /* Aditional Tasks */
  grunt.registerTask('git:dist', ['gitcommit:dist', 'gittag:dist', 'gitpush:dist', 'gitpush:disttags']);
  
  grunt.registerTask('watch:start', ['karma:watch:start', 'watch:andtest']);

  grunt.registerTask('test', ['ngtemplates', 'jshint', 'karma:all']);

  grunt.registerTask('build', ['concat', 'uglify']);

  grunt.registerTask('dist', ['test', 'bump', 'build', 'git:dist']);

  grunt.registerTask('default', ['test', 'build']);

};
