/* global browser, element, by */
describe('fontselect directive', function() {

  var sandboxUrl = 'http://localhost:8000/test/sandbox/testbox.html';

  beforeEach(function() {
    browser.get(sandboxUrl);
  });
  
  it('should have a button', function() {
    expect(element.all(by.tagName('button')).count()).toBe(1);
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

  describe('radio buttons', function() {
    var radios;

    beforeEach(function() {
      element(by.tagName('button')).click();
      radios = element.all(by.css('li input'));
    });

    it('should have no radio checked', function() {
      expect(element.all(by.css('li input:checked')).count()).toBe(0);
    });

    it('should have one radio checked after one was clicked', function() {
      radios.get(3).click();
      expect(element.all(by.css('li input:checked')).count()).toBe(1);
    });

    it('should still have one radio checked after a few were clicked', function() {
      radios.get(1).click();
      radios.get(2).click();
      radios.get(3).click();
      expect(element.all(by.css('li input:checked')).count()).toBe(1);
    });

  });

});
