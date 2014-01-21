var files = require('../files');
var Helpers = require('../helpers');

module.exports = {
  options: {
    separator: '\n\n',
    stripBanners: true,
    banner: Helpers.getTemplate('wrap-top'),
    footer: Helpers.getTemplate('wrap-bottom'),
    process: Helpers.cleanupModules
  },
  dist: {
    src: files.source.concat(files.allPartialsCombined),
    dest: files.dist
  }
};
