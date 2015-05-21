/* global initGlobals, $injector */
describe('webfont factory', function() {
  beforeEach(function() {
    module('jdFontselect');
    initGlobals(false);
  });

  it('should provide the WebFont global', function() {
    window.WebFont = {};
    expect($injector.get('jdfsWebFont')).toBe(window.WebFont);
    delete window.WebFont;
  });

  it('should throw when WebFont is not available', function() {
    expect(function() {
      $injector.get('jdfsWebFont');
    }).toThrow();
  });
});
