var files = require('../files');

module.exports = {
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
  'jdFontselect': {
    src: files.allPartials,
    dest: files.allPartialsCombined,
  }
};
