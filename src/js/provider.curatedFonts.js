fontselectModule.provider('jdfsCuratedFonts', function jdfsCuratedFontsProvider() {
  var curatedFonts = [];

  this.setCuratedFonts = function (curated) {
    curatedFonts = curated;
  };

  this.$get = function jdfsCuratedFontsFactory() {
    return curatedFonts;
  };
});
