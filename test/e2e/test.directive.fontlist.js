/* global element, by */
describe('fontlist directive', function() {

  var Helpers = require('./SpecHelper');

  beforeEach(Helpers.toggle);

  it('should not have multiple fontlists', function() {
    expect(element.all(by.css('.jdfs-fontlist')).count()).toBe(1);
  });

  it('should have no radio checked', function() {
    expect(element.all(by.css('li input:checked')).count()).toBe(0);
  });

  it('should have one radio checked after one was clicked', function() {
    Helpers.getFontLabel(3).click();
    expect(element.all(by.css('li input:checked')).count()).toBe(1);
  });

  it('should still have one radio checked after a few were clicked', function() {
    Helpers.getFontLabel(1).click();
    Helpers.getFontLabel(2).click();
    Helpers.getFontLabel(3).click();
    expect(element.all(by.css('li input:checked')).count()).toBe(1);
  });

  describe('font count', function() {
    it('should display the amount of font\'s somewhere', function() {
      expect(element(by.css('.jdfs-fontcount')).getText()).toMatch(/[\d]+\/[\d]+/);
    });

    it('should adjust the first number when we apply filters', function() {
      var before = element(by.css('.jdfs-fontcount')).getText();
      Helpers.searchFor('ari');
      expect(element(by.css('.jdfs-fontcount')).getText()).not.toBe(before);
    });

    it('should only display the amount of total fonts, when we deactivate all filters', function() {
      element.all(by.model('current.subsets[key]')).then(function(elms) {
        elms.forEach(function(elm) {
          elm.getAttribute('selected').then(function(attr) {
            if (attr) {
              elm.click();
            }
          });
        });
      });

      expect(element(by.css('.jdfs-fontcount')).getText()).not.toMatch(/\//);
    });
  });

  describe('pagination', function() {

    it('should have multiple page buttons', function() {
      expect(Helpers.getPaginator().count()).toBeGreaterThan(1);
    });

    it('should have the first button activated', function() {
      expect(Helpers.getPaginator(0).getAttribute('class')).toContain('active');
    });

    it('should change the displayed fonts on click', function() {
      var currentFirstID = Helpers.getFontLabel(0).getAttribute('for');
      Helpers.getPaginator(1).click();
      expect(Helpers.getFontLabel(0).getAttribute('for')).not.toBe(currentFirstID);
    });

    it('should keep radios selected over page changes.', function() {
      Helpers.getFontLabel(5).click();
      Helpers.getPaginator(1).click();
      runs(function() {
        Helpers.getPaginator(0).click();
      });
      /* Need to delay our expectation to make this less flaky. */
      runs(function() {
        expect(Helpers.getFontLabel(5).getAttribute('class')).toContain('jdfs-active');
      });
    });

    it('should be on the correct page when we close and reopen the directive', function() {
      expect(Helpers.getPaginator(1).getAttribute('class')).not.toContain('jdfs-active');
      Helpers.getPaginator(1).click();
      Helpers.toggle();
      Helpers.toggle();
      expect(Helpers.getPaginator(1).getAttribute('class')).toContain('jdfs-active');
    });

    describe('with search', function() {
      it('should change the page if the current page does not exist anymore', function() {
        Helpers.getPaginator(5).click();

        Helpers.searchFor('ar');
        expect(Helpers.getLi().count()).toBeGreaterThan(0);
      });

      it('should stay on the page of our selected search when we change filters', function() {
        /* Navigate to a subpage and select a font */
        Helpers.getPaginator(5).click();
        Helpers.getFontLabel(6).click();

        function getLabel(fr) {
          return element.all(by.css('[for="' + fr + '"]'));
        }

        /* Get Data of the current font */
        Helpers.getLi(6).findElement(by.tagName('label')).getAttribute('for').then(function(forTxt) {
          Helpers.getLi(6).getText().then(function(fontName) {

            /* Start to search for our font and ensure we can sill see it. */
            Helpers.searchFor(fontName.substring(0, 1));
            expect(getLabel(forTxt).count()).toBe(1);

            Helpers.searchFor(fontName.substring(1, 2), false);
            expect(getLabel(forTxt).count()).toBe(1);

            Helpers.searchFor(fontName.substring(2, 3), false);
            expect(getLabel(forTxt).count()).toBe(1);

            Helpers.searchFor(fontName.substring(3, 4), false);
            expect(getLabel(forTxt).count()).toBe(1);

            /* reset the search */
            Helpers.searchFor();
            expect(getLabel(forTxt).count()).toBe(1);
            
            /* We should be back on the page we started */
            expect(Helpers.getPaginator(5).getAttribute('class')).toContain('active');
          });
        });
      });

    });
  });
});
