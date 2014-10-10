/* global NAME_PROVIDER_MANAGER, NAME_PREVIEW */
fontselectModule.service(NAME_PREVIEW, [
  NAME_PROVIDER_MANAGER,
  function(providers) {
    var previewed = [];

    this.load = function(font) {
      if (previewed.indexOf(font)) {
        return;
      }
      providers.get(font.provider).loadPreview(font);
    };
  }
]);
