fontselectModule.provider('jdfsCuratedFonts', function jdfsCuratedFontsProvider() {
  var curatedList = [];

  this.setCuratedFonts = function (curated) {
    curatedList = curated;
  };

  this.$get = function jdfsCuratedFontsFactory() {
    return curatedList;
  };
});
