var files = require('../files');
var optPort = require('grunt').option('port');
var path = require('path');
var base = process.cwd();

module.exports = {
  buildWFL: {
    options: {
      failOnError: true,
      stderr: true
    },
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
  },
  opendemo: {
    command: 'sleep 1; open http://localhost:' + (optPort || process.env.DEMO_PORT || 8000) + '/'
  },
  deleteCoverages: {
    command: [
      'rm -rf',
      path.join(base, '.tmp/coverage')
    ].join(' ')
  }
};
