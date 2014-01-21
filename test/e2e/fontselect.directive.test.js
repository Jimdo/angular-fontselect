/* global browser, element, by */
describe('fontselect directive', function() {

  var sandboxUrl = 'http://localhost:8000/test/sandbox/testbox.html';

  beforeEach(function() {
    browser.get(sandboxUrl);
  });
  
  it('should have a button', function() {
    expect(element.all(by.css('[ng-click="toggle()"]')).count()).toBe(1);
  });

  it('should be invisible before button click', function() {
    expect(element(by.className('fs-window')).isDisplayed()).toBe(false);
  });

  it('should become visible after button click', function() {
    element(by.tagName('button')).click();
    expect(element(by.className('fs-window')).isDisplayed()).toBe(true);
  });

  it('should have a list of checkboxes', function() {
    expect(element.all(by.css('li input')).count()).toBe(5);
  });

  describe('font list', function() {
    var fontradios;

    beforeEach(function() {
      element(by.tagName('button')).click();
      fontradios = element.all(by.model('data.currentFont'));
    });

    it('should have no radio checked', function() {
      expect(element.all(by.css('li input:checked')).count()).toBe(0);
    });

    it('should have one radio checked after one was clicked', function() {
      fontradios.get(3).click();
      expect(element.all(by.css('li input:checked')).count()).toBe(1);
    });

    it('should still have one radio checked after a few were clicked', function() {
      fontradios.get(1).click();
      fontradios.get(2).click();
      fontradios.get(3).click();
      expect(element.all(by.css('li input:checked')).count()).toBe(1);
    });
  });

  describe('search', function() {
    var search;

    beforeEach(function() {
      element(by.tagName('button')).click();
      search = element(by.model('search'));
    });

    it('should reduce the length of the font list on click', function() {
      expect(element.all(by.css('li')).count()).toBe(5);
      search.sendKeys('ver');
      expect(element.all(by.css('li')).count()).toBe(1);
    });
  });

  describe('categories', function() {
    var categoryradios;

    beforeEach(function() {
      element(by.tagName('button')).click();
      categoryradios = element.all(by.model('data.category'));
    });

    it('should reduce the length of the font list on click', function() {
      expect(element.all(by.css('li')).count()).toBe(5);
      categoryradios.get(1).click();
      expect(element.all(by.css('li')).count()).toBe(2);
    });
  });

});
