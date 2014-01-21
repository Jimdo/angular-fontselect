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
  grunt.registerTask('git:dist', ['gitcommit:dist', 'gittag:dist', 'gitpush:dist', 'gitpush:disttags']);
  
  grunt.registerTask('watch:start', ['karma:watch:start', 'watch:andtest']);

  grunt.registerTask('test', ['ngtemplates', 'jshint', 'karma:all', 'protractor']);

  grunt.registerTask('test:e2e', ['protractor']);

  grunt.registerTask('build', ['ngtemplates', 'concat', 'uglify']);

  grunt.registerTask('dist', ['test', 'bump', 'build', 'git:dist']);

  grunt.registerTask('default', ['test', 'build']);

  grunt.initConfig(config);
};
