var files = require('../files');

module.exports = {
  options: {
    failOnError: true,
    stderr: true
  },
  buildWFL: {
    command: [
      'BASEDIR=`pwd`',
      'cd ' + files.wflDir,
      'bundle install --path=vendor/bundle',
      'bundle exec rake compile',
      'cd $BASEDIR',
      'mkdir -p ' + files.libsDir,
      'echo ' + files.libsDir + 'webfontloader.js',
      'mv ' + files.wflDir + 'target/webfont.js ' + files.libsDir + 'webfontloader.js'
    ].join(';')
  }
};
