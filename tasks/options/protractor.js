module.exports = {
  options: {
    args: {
      seleniumAddress: 'http://localhost:4444/wd/hub',
      seleniumArgs: [],
      capabilities: {
        'browserName': 'chrome'
      },
      specs: ['test/e2e/*.js'],
      jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
      }
    },
    configFile: '',
    keepAlive: true,
  },
  e2e: {}
};