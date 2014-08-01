var files = require('../files');
var optPort = require('grunt').option('port');

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
  startsilenium: {
    command: process.cwd() + '/node_modules/protractor/bin/webdriver-manager start',
    options: {
      async: true,
      stdout: false
    }
  },
  opendemo: {
    command: 'open http://localhost:' + (optPort || process.env.DEMO_PORT || 8000) + '/demo/',
    options: {
      async: true
    }
  }
};
