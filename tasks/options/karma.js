var files = require('../files');
var browsers = process.env.KARMA_BROWSERS;
var reporters = process.env.KARMA_REPORTERS;

module.exports = {
  options: {
    browsers: (browsers || 'Chrome').split(','),
    reporters: (reporters || 'progress').split(','),
    preprocessors: {
      '**/*.coffee': ['coffee']
    },
    frameworks: [
      'jasmine'
    ],
    singleRun: true,
    files: files.testEnvKarma.concat([files.unitTests])
  },
  all: {
    options: {
      browsers: (browsers || 'Chrome,Firefox,PhantomJS').split(',')
    }
  },
  watch: {
    options: {
      background: true,
      singleRun: false,
      autoWatch: false
    }
  }
};
