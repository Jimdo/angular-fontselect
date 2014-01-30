/* global element, by, waitsFor */
describe('fontlist directive', function() {

  var Helpers = require('./SpecHelper');

  beforeEach(Helpers.toggle);

  it('should have multiple fontlists', function() {
    expect(element.all(by.repeater('provider in providers')).count()).toBeGreaterThan(1);
  });

  it('should have a list for default webfonts', function() {
    expect(element.all(by.css('.jdfs-provider-websafe-fonts')).count()).toBe(1);
  });

  it('should have a list for google webfonts', function() {
    expect(element.all(by.css('.jdfs-provider-google-fonts')).count()).toBe(1);
  });

  it('should have no radio checked', function() {
    expect(element.all(by.css('li input:checked')).count()).toBe(0);
  });

  it('should have one radio checked after one was clicked', function() {
    Helpers.getRadio(3).click();
    expect(element.all(by.css('li input:checked')).count()).toBe(1);
  });

  it('should still have one radio checked after a few were clicked', function() {
    Helpers.getRadio(1).click();
    Helpers.getRadio(2).click();
    Helpers.getRadio(3).click();
    expect(element.all(by.css('li input:checked')).count()).toBe(1);
  });

  it('should link radio buttons between the single font lists.', function() {
    /* Ensure our test button is not clicked, yet */
    expect(Helpers.getRadio(1).getAttribute('selected')).toBeFalsy();

    /* Click on a radio button in the first list */
    Helpers.getRadio(1).click();
    expect(Helpers.getRadio(1).getAttribute('selected')).toBeTruthy();

    Helpers.openProviderListNo(1);

    /* Click a radio button in the new list */
    Helpers.getRadio(4).click();

    Helpers.openProviderListNo(0);

    /* Expect our own button to be unchecked */
    expect(Helpers.getRadio(1).getAttribute('selected')).toBeFalsy();
  });

  it('should keep our selection even if we switch font lists', function() {
    Helpers.getRadio(1).click();
    
    expect(Helpers.getRadio(1).getAttribute('selected')).toBeTruthy();
    Helpers.openProviderListNo(1);
    Helpers.openProviderListNo(0);
    expect(Helpers.getRadio(1).getAttribute('selected')).toBeTruthy();
  });

  describe('font count', function() {
    it('should display the amount of font\'s in the header', function() {
      expect(element(by.tagName('h3')).getText()).toContain('(5)');
    });

    it('should adjust the first number when we apply filters', function() {
      Helpers.searchFor('ari');
      expect(element(by.tagName('h3')).getText()).toContain('1/5');
    });

    it('should display a placeholder when the fonts have not been loaded, yet', function() {
      expect(element.all(by.tagName('h3')).get(1).getText()).toContain('(…)');
    });
  });

  describe('pagination of google fonts', function() {

    beforeEach(function() {
      Helpers.openProviderListNo(1);
    });

    it('should have multiple page buttons', function() {
      expect(Helpers.getPaginator().count()).toBeGreaterThan(1);
    });

    it('should have the first button activated', function() {
      expect(Helpers.getPaginator(0).getAttribute('class')).toContain('active');
    });

    it('should change the displayed fonts on click', function() {
      var currentFirstVal = Helpers.getRadio(0).getAttribute('value');
      Helpers.getPaginator(1).click();
      expect(Helpers.getRadio(0).getAttribute('value')).not.toBe(currentFirstVal);
    });

    it('should keep radios selected over page changes.', function() {
      Helpers.getRadio(5).click();
      Helpers.getPaginator(1).click();
      runs(function() {
        Helpers.getPaginator(0).click();
      });
      /* Need to delay our expectation to make this less flaky. */
      runs(function() {
        expect(Helpers.getRadio(5).getAttribute('selected')).toBeTruthy();
      });
    });

    it('should be on the correct page when we close and reopen the list', function() {
      expect(Helpers.getPaginator(1).getAttribute('class')).not.toContain('active');
      Helpers.getPaginator(1).click();
      Helpers.openProviderListNo(0);
      Helpers.openProviderListNo(1);
      expect(Helpers.getPaginator(1).getAttribute('class')).toContain('active');
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
        Helpers.getRadio(6).click();

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
