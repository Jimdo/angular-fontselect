fontselectModule.factory('jdfsWebFont', function() {
  if (typeof window.WebFont === 'undefined') {
    throw new Error('WebFontLoader is not available.' +
      'Please include angular-fontselect/dist/libs/webfontloader.js');
  }

  return window.WebFont;
});
