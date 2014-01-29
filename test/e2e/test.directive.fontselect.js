/* global element, by, protractor */
describe('fontselect directive', function() {

  var Helpers = require('./SpecHelper');
  var prot;

  beforeEach(function() {
    prot = protractor.getInstance();
  });

  it('should have a button', function() {
    expect(element.all(by.css('.jdfs-toggle')).count()).toBe(1);
  });

  it('should be invisible before toggle click', function() {
    expect(element(by.className('jdfs-window')).isDisplayed()).toBe(false);
  });

  it('should become visible after toggle click', function() {
    Helpers.toggle();
    expect(element(by.className('jdfs-window')).isDisplayed()).toBe(true);
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

  describe('sorting', function() {

    beforeEach(function() {
      Helpers.toggle();
    });

    it('should have a sort by field', function() {
      expect(element.all(by.model('current.sort.attr')).count()).toBe(1);
    });

    it('should have some options', function() {
      element(by.model('current.sort.attr')).findElements(by.tagName('option')).then(function(arr) {
        expect(arr.length).toBe(3);
      });
    });

    it('should change the order of the list when we change the option', function() {
      var firstLi = Helpers.getLi(0).getText();
      Helpers.getSortOption(1).click();
      expect(firstLi).not.toBe(Helpers.getLi(0).getText());
    });

    it('should have a difference between popularity and latest', function() {
      var testLi = Helpers.getLi(1).getText();
      Helpers.getSortOption(2).click();
      expect(testLi).not.toBe(Helpers.getLi(1).getText());
    });

    describe('reverse button', function() {

      var selector = '[ng-click="reverseSort()"]';
      var sortDirButton;

      beforeEach(function() {
        sortDirButton = element(by.css(selector));
      });

      it('should exist', function() {
        expect(prot.isElementPresent(by.css(selector))).toBe(true);
      });

      it('should change it\'s label when we click on it', function() {
        var before = sortDirButton.getText();

        sortDirButton.click();
        expect(sortDirButton.getText()).not.toBe(before);
      });

      it('should reverse the order of the list when we click on it (popularity)', function() {
        var firstLi = Helpers.getLi(0).getText();
        sortDirButton.click();
        expect(firstLi).not.toBe(Helpers.getLi(0).getText());
      });

      it('should reverse the order of the list when we click on it (alphabet)', function() {
        Helpers.getSortOption(1).click();
        var firstLi = Helpers.getLi(0).getText();
        sortDirButton.click();
        expect(firstLi).not.toBe(Helpers.getLi(0).getText());
      });

      it('should reverse the order of the list when we click on it (latest)', function() {
        Helpers.getSortOption(2).click();
        var firstLi = Helpers.getLi(0).getText();
        sortDirButton.click();
        expect(firstLi).not.toBe(Helpers.getLi(0).getText());
      });
    });

  });

});
