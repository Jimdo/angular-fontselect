module.exports = {
  e2e: {
    options: {
      args: {
        seleniumAddress: 'http://localhost:4444/wd/hub',
        capabilities: {
          'browserName': 'chrome'
        },
        specs: ['test/e2e/*.js'],
        jasmineNodeOpts: {
          showColors: true,
          defaultTimeoutInterval: 30000
        }
      }
    },
    configFile: '',
    keepAlive: true,
  }
};