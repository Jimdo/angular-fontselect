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
  'fontselect.module': {
    cwd: files.partialsDir,
    src: files.allHTML,
    dest: files.allPartials,
  }
};
