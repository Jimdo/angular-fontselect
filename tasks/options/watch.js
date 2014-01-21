var files = require('../files');

module.exports = {
  andtest: {
    files: files.source.concat([files.allPartials, files.grunt, files.unitTests]),
    tasks: ['ngtemplates', 'jshint', 'karma:watch:run', 'build']
  }
};
