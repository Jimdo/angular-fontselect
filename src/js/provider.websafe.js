/* global NAME_PROVIDER_MANAGER, PROVIDER_WEBSAFE, DEFAULT_WEBSAFE_FONTS */
fontselectModule.run([
  NAME_PROVIDER_MANAGER,
  function(providers) {
    providers.register({
      name: PROVIDER_WEBSAFE,
      addFonts: function(add, done) {
        angular.forEach(DEFAULT_WEBSAFE_FONTS, function(font) {
          add(font);
        });

        done();
      },
      loadPreview: function() {}
    });
  }
]);
