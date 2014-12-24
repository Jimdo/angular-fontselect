var Helpers = require('./SpecHelper');

describe('api', function() {

  describe('events', function() {
    it('should be possible to use the open callback', function() {
      Helpers.toggle();
      expect(Helpers.getEvents()).toBe('openA');
    });

    it('should be possible to use the close callback', function() {
      Helpers.toggle();
      Helpers.toggle();
      expect(Helpers.getEvents()).toBe('openA,closeA');
    });

    it('should be the correct order when using multiple font selections', function() {
      Helpers.toggleSecondFontSelection();
      Helpers.toggleSpecific(1);
      Helpers.toggleSpecific(2);
      expect(Helpers.getEvents()).toBe('openA,closeA,openB');
    });
  });
});
