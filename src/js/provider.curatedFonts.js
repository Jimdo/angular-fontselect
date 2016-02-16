/* global NAME_FONTSSERVICE */
fontselectModule.provider('jdfsCuratedFonts', function jdfsCuratedFontsProvider() {
  var curatedFontKeys = [];

  this.setCuratedFontKeys = function (curatedKeys) {
    curatedFontKeys = curatedKeys;
  };

  function getCuratedFontObjects(fonts, curatedFontKeys) {
    return fonts.filter(function(font) {
      return curatedFontKeys.indexOf(font.provider + '.' + font.key) !== -1;
    });
  }

  this.$get = [NAME_FONTSSERVICE, function jdfsCuratedFontsFactory(fontService) {
    var futureCuratedFonts = [];

    futureCuratedFonts.promise = fontService.ready().then(function() {
      return angular.extend(
        futureCuratedFonts,
        getCuratedFontObjects(fontService._fonts, curatedFontKeys)
      );
    });

    return futureCuratedFonts;
  }];
});
