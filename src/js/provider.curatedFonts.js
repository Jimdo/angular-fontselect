fontselectModule.provider('jdfsCuratedFonts', function jdfsCuratedFontsProvider() {
  var curatedFontKeys = [];

  this.setCuratedFontKeys = function (curatedKeys) {
    curatedFontKeys = curatedKeys;
  };

  this.$get = function jdfsCuratedFontsFactory() {
    return curatedFontKeys;
  };
});
