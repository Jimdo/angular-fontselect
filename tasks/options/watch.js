var files = require('../files');

module.exports = {
  andtest: {
    files: files.source.concat([files.grunt, files.tests]),
    tasks: ['ngtemplates', 'jshint', 'karma:watch:run', 'build']
  }
};
