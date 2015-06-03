/* global element, by, protractor, browser */
var Helpers = require('./SpecHelper');

describe('fontselect directive', function() {

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

  it('should become invisible when we click the close button', function() {
    Helpers.toggle();
    element(by.css('button.jdfs-close')).click();
    expect(element(by.className('jdfs-window')).isDisplayed()).toBe(false);
  });

  it('should have a list of checkboxes', function() {
    expect(element.all(by.css('li input')).count()).toBe(Helpers.PAGE_SIZE_DEFAULT);
  });

  it('should become invisible when we click somewhere on the window', function() {
    Helpers.toggle();

    element(by.tagName('body')).click();
    expect(element(by.className('jdfs-window')).isDisplayed()).toBe(false);
  });

  describe('search', function() {
    var numberOfFonts;

    beforeEach(function() {
      Helpers.toggle();
      numberOfFonts = Helpers.getLi().count();
    });

    it('should be able to clear through helper', function() {
      Helpers.toggleBySearch();
      Helpers.searchFor('foo');
      Helpers.searchFor();
      expect(element(by.model('current.search')).getAttribute('value')).toBeFalsy();
    });

    it('should reduce the length of the results', function() {
      expect(numberOfFonts).toBe(Helpers.PAGE_SIZE_DEFAULT);
      Helpers.toggleBySearch();
      Helpers.searchFor('verdan');
      expect(Helpers.getLi().count()).toBeLessThan(numberOfFonts);
    });

    it('should also reduce the amount of available pages', function() {
      var beforeLength = Helpers.pageCount();
      Helpers.toggleBySearch();
      Helpers.searchFor('ar');
      expect(Helpers.getPaginator().count()).toBeLessThan(beforeLength);
    });
  });

  describe('categories', function() {
    it('should reduce the amount of pages on click', function() {
      Helpers.toggle();
      var numberOfPages = Helpers.pageCount();

      expect(numberOfPages).toBeGreaterThan(5);
      element.all(by.model('current.category')).get(1).click();
      expect(Helpers.pageCount()).toBeLessThan(numberOfPages);
    });
  });

  xdescribe('sorting', function() {

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
      var testLi = Helpers.getLi(0).getText();
      Helpers.getSortOption(2).click();
      expect(Helpers.getLi(0).getText()).not.toBe(testLi);
    });

    describe('reverse button', function() {

      var selector = '[ng-click="reverseSort()"]';
      var sortDirButton;

      beforeEach(function() {
        sortDirButton = element(by.css(selector));
      });

      it('should exist', function() {
        expect(browser.isElementPresent(by.css(selector))).toBe(true);
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

  describe('character sets', function() {
    var latinSelector = 'jdfs-1-subset-latin';

    beforeEach(function() {
      Helpers.toggle();
    });

    it('should have some checkboxes for character set filtering', function() {
      expect(Helpers.getSubsetCheckbox().count()).toBeGreaterThan(0);
    });

    it('should have the latin box preselected', function() {
      expect(element(by.css('#' + latinSelector)).isSelected()).toBe(true);
    });

    it('s checkboxes should be selectable', function() {
      Helpers.openSettings();
      var textCheckBox = Helpers.getSubsetCheckbox(2);
      expect(textCheckBox.isSelected()).toBe(false);
      textCheckBox.click();
      expect(textCheckBox.isSelected()).toBe(true);
      textCheckBox.click();
      expect(textCheckBox.isSelected()).toBe(false);
    });

    it('should have labels to click on', function() {
      Helpers.openSettings();
      var latinBox = element(by.css('#' + latinSelector));
      var latinLabel = element(by.css('[for="' + latinSelector + '"]'));
      latinLabel.click();
      expect(latinBox.isSelected()).toBe(false);
      latinLabel.click();
      expect(latinBox.isSelected()).toBe(true);
    });

    it('should reduce the amount of pages when we click a checkbox', function() {
      Helpers.openSettings();
      var pagesCount = Helpers.pageCount();
      Helpers.getSubsetCheckbox(2).click();
      expect(Helpers.pageCount()).not.toBe(pagesCount);
    });
  });

  describe('providers', function() {
    beforeEach(Helpers.toggle);

    it('should have multiple provider toggles', function() {
      expect(Helpers.getProviderCheckbox().count()).toBeGreaterThan(1);
    });

    it('should have all provider toggles selected', function() {
      Helpers.getProviderCheckbox().then(function(checkboxes) {
        checkboxes.forEach(function(checkbox) {
          expect(checkbox.isSelected()).toBe(true);
        });
      });
    });

    it('should reduce the amount of selected fonts when we deselect a checkbox', function() {
      var previousAmount = Helpers.currentFontAmount();

      Helpers.openSettings();
      Helpers.getProviderCheckbox(0).click();
      expect(Helpers.currentFontAmount()).toBeLessThan(previousAmount);
      Helpers.getProviderCheckbox(0).click();

      Helpers.getProviderCheckbox(1).click();
      expect(Helpers.currentFontAmount()).toBeLessThan(previousAmount);
      Helpers.getProviderCheckbox(1).click();
    });
  });

  describe('Activate button', function() {
    it('should be visible when the directive is inactive', function() {
      expect(element(by.css('.jdfs-toggle')).isDisplayed()).toBe(true);
    });

    it('should not be hidden when the directive is active', function() {
      Helpers.toggle();
      expect(element(by.css('.jdfs-toggle')).isDisplayed()).toBe(true);
    });
  });

  describe('Search Bar', function() {
    it('should not be visible when the directive is inactive', function() {
      expect(element(by.model('current.search')).isDisplayed()).toBe(false);
    });

    it('should be hidden when the directive is active by clicking on toggle.', function() {
      Helpers.toggle();
      expect(element(by.model('current.search')).isDisplayed()).toBe(false);
    });

    it('should be focused when the directive gets activated by clicking on search', function() {
      Helpers.toggleBySearch();

      browser.actions().sendKeys('foo').perform();
      expect(element(by.model('current.search')).getAttribute('value')).toBe('foo');
    });
  });

  describe('Keyboard support', function() {
    beforeEach(Helpers.toggle);

    it('should close the directive when we hit ESC', function() {
      expect(element(by.className('jdfs-window')).isDisplayed()).toBe(true);
      browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
      expect(element(by.className('jdfs-window')).isDisplayed()).toBe(false);
    });

    it('should select the first font when we hit the down arrow key', function() {
      var font = Helpers.getFontLabel(0);
      expect(font.getAttribute('class')).not.toContain('jdfs-active');
      browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
      expect(font.getAttribute('class')).toContain('jdfs-active');
    });

    it('should select the first font of the second page when we hit the right arrow key', function() {
      expect(Helpers.currentPage()).toBe(1);
      browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
      expect(Helpers.currentPage()).toBe(2);
      expect(Helpers.getFontLabel(0).getAttribute('class')).toContain('jdfs-active');
    });

    it('should deselect the current element when we play around with arrow keys', function() {
      var font1 = Helpers.getFontLabel(0);
      var font2 = Helpers.getFontLabel(1);

      browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
      expect(font1.getAttribute('class')).toContain('jdfs-active');
      expect(font2.getAttribute('class')).not.toContain('jdfs-active');

      browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
      expect(font1.getAttribute('class')).not.toContain('jdfs-active');
      expect(font2.getAttribute('class')).toContain('jdfs-active');

      browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      expect(font1.getAttribute('class')).toContain('jdfs-active');
      expect(font2.getAttribute('class')).not.toContain('jdfs-active');
    });

    it('should switch to the next page, when we hit the down arrow on the bottom of the list (and back)', function() {
      expect(Helpers.currentPage()).toBe(1);

      Helpers.getFontLabel(9).click();
      browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();
      expect(Helpers.currentPage()).toBe(2);

      browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      expect(Helpers.currentPage()).toBe(1);
    });

    it('should not change pages or selections when we try to go up/left on the first page', function() {
      var font = Helpers.getFontLabel(0);

      browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
      expect(Helpers.currentPage()).toBe(1);
      expect(font.getAttribute('class')).not.toContain('jdfs-active');

      browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      expect(Helpers.currentPage()).toBe(1);
      expect(font.getAttribute('class')).not.toContain('jdfs-active');
    });

    it('should change the page when we hit the right left arrows', function() {
      expect(Helpers.currentPage()).toBe(1);
      browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
      expect(Helpers.currentPage()).toBe(2);
      browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
      expect(Helpers.currentPage()).toBe(1);
    });

    it('should not change the page, when the search is focused and has value', function() {
      Helpers.toggleBySearch();
      browser.actions()
        .sendKeys('D')
        .sendKeys(protractor.Key.ARROW_RIGHT)
        .perform();

      expect(Helpers.currentPage()).toBe(1);
      expect(Helpers.pageCount()).toBeGreaterThan(1);
    });

    it('should change the page when we defocus the search after input', function() {
      Helpers.toggleBySearch();
      Helpers.searchFor('Fo');
      Helpers.getFontLabel(3).click();
      browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();

      expect(Helpers.currentPage()).toBe(2);
    });

    it('should not change the page, when re are on the last page and hit right', function() {
      Helpers.toggleBySearch();
      Helpers.searchFor('Foob');
      Helpers.getPaginator(1).click();

      expect(Helpers.currentPage()).toBe(2);
      expect(Helpers.pageCount()).toBe(2);

      browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();

      expect(Helpers.currentPage()).toBe(2);

      Helpers.getFontLabel().then(function(labels) {
        var label = labels[labels.length - 1];

        label.click();
        browser.actions().sendKeys(protractor.Key.ARROW_DOWN).perform();

        expect(Helpers.currentPage()).toBe(2);
        expect(label.getAttribute('class')).toContain('jdfs-active');
      });
    });
  });

  describe('footer', function() {
    beforeEach(Helpers.toggle);

    it('should have the styles tab open by default', function() {
      expect(element(by.className('jdfs-styles')).isDisplayed()).toBe(true);
    });

    it('should close the styles tab when we click the settings button', function() {
      Helpers.openSettings();
      expect(element(by.className('jdfs-styles')).isDisplayed()).toBe(false);
    });
    it('should close the settings tab when we click the styles button', function() {
      Helpers.openStyles();
      expect(element(by.className('jdfs-settings')).isDisplayed()).toBe(false);
    });
  });
});
