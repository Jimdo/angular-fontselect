/* global element, by */
describe('fontselect directive', function() {

  var Helpers = require('./SpecHelper');

  it('should have a button', function() {
    expect(element.all(by.css('.jd-fontselect-toggle')).count()).toBe(1);
  });

  it('should be invisible before toggle click', function() {
    expect(element(by.className('fs-window')).isDisplayed()).toBe(false);
  });

  it('should become visible after toggle click', function() {
    Helpers.toggle();
    expect(element(by.className('fs-window')).isDisplayed()).toBe(true);
  });

  it('should have a list of checkboxes', function() {
    expect(element.all(by.css('li input')).count()).toBe(5);
  });

  describe('search', function() {
    var numberOfFonts;

    beforeEach(function() {
      Helpers.toggle();
      numberOfFonts = Helpers.getLi().count();
    });

    it('should be able to clear through helper', function() {
      Helpers.searchFor('foo');
      Helpers.searchFor();
      expect(element(by.model('current.search')).getAttribute('value')).toBeFalsy();
    });

    it('should reduce the length of the results', function() {
      expect(numberOfFonts).toBe(5);
      Helpers.searchFor('ver');
      expect(Helpers.getLi().count()).toBeLessThan(numberOfFonts);
    });

    it('should also reduce the amount of available pages', function() {
      Helpers.openProviderListNo(1);

      var beforeLength = Helpers.getPaginator().count();
      Helpers.searchFor('ar');
      expect(Helpers.getPaginator().count()).toBeLessThan(beforeLength);
    });
  });

  describe('categories', function() {
    var categoryradios, numberOfFonts;

    beforeEach(function() {
      numberOfFonts = Helpers.getLi().count();
      Helpers.toggle();
      categoryradios = element.all(by.model('current.category'));
    });

    it('should reduce the length of the font list on click', function() {
      expect(numberOfFonts).toBe(5);
      categoryradios.get(1).click();
      expect(Helpers.getLi().count()).toBeLessThan(numberOfFonts);
    });
  });

});
