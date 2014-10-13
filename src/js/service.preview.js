/* global NAME_PREVIEW */
fontselectModule.service(NAME_PREVIEW, [
  function() {
    this.load = function(font) {
      font.loadPreview();
    };
  }
]);
