var files = require('../files');

module.exports = {
  files: files.source.concat([files.grunt, files.tests]),
  options: {
    jshintrc: true
  }
};
