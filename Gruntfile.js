/**
 * Build instructions for grunt.
 *
 * Structure seen in [rprtr](https://github.com/mrmrs/rprtr)
 * by [aputinski](https://github.com/aputinski)
 * 
 * @param  {Object} grunt
 * @return {void}
 */
module.exports = function(grunt) {
  'use strict';

  var Helpers = require('./tasks/helpers');
  var config  = Helpers.config;
  var _       = grunt.util._;

  config = _.extend(config, Helpers.loadConfig('./tasks/options/'));

  /* Load grunt tasks from NPM packages */
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');

  /* Aditional Tasks */
  grunt.registerTask('watch:start', ['karma:watch:start', 'watch:andtest']);

  grunt.registerTask('test:beforeEach', ['jshint', 'ngtemplates', 'build:apikeys']);
  grunt.registerTask('test', ['test:beforeEach', 'karma:all', 'protractor']);
  grunt.registerTask('test:travis', ['test:beforeEach', 'karma:travis']);
  grunt.registerTask('test:unit', ['test:beforeEach', 'karma:all']);
  grunt.registerTask('test:e2e', ['test:beforeEach', 'protractor']);

  grunt.registerTask('build:less', [
    'less:dist',
    'less:distmin',
    'concat:bannerToDistStyle',
    'concat:bannerToDistStyleMin'
  ]);
  grunt.registerTask('build:apikeys', function() { Helpers.setUpApiKeyFile(); });
  grunt.registerTask('build', [
    'ngtemplates',
    'build:apikeys',
    'shell:buildWFL',
    'build:less',
    'concat:dist',
    'uglify'
  ]);

  grunt.registerTask('git:dist', ['gitcommit:dist', 'gittag:dist', 'gitpush:dist', 'gitpush:disttags']);
  grunt.registerTask('dist', ['test', 'bump', 'build', 'git:dist']);

  grunt.registerTask('default', ['test', 'build']);

  grunt.initConfig(config);
};
