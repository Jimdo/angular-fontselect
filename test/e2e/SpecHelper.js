/* global browser, element, by */
var sandboxUrl = 'http://localhost:8000/test/e2e/index.html';

beforeEach(function() {
  browser.get(sandboxUrl);
});

module.exports = {

  /** @const */
  PROVIDER_TITLE_CLASS: '.jdfs-provider-title',

  toggle: function() {
    element(by.css('.jdfs-toggle')).click();
  },

  openProviderListNo: function(n) {
    element.all(by.repeater('provider in providers')).get(n)
      .findElement(by.css(this.PROVIDER_TITLE_CLASS)).click();
  },

  getFontLabel: function(n) {
    var labels = element.all(by.css('.jdfs-provider label'));
    if(typeof n === 'number') {
      return labels.get(n);
    }
    return labels;
  },

  getPaginator: function(n) {
    var paginators = element.all(by.repeater('i in getPages() track by $index'));
    if(typeof n === 'number') {
      return paginators.get(n);
    }
    return paginators;
  },

  getLi: function(n) {
    var li = element.all(by.css('li'));
    if(typeof n === 'number') {
      return li.get(n);
    }
    return li;
  },

  getSortOption: function(n) {
    var sorters = element.all(by.tagName('option'));
    if(typeof n === 'number') {
      return sorters.get(n);
    }
    return sorters;
  },

  getSubsetCheckbox: function(n) {
    var checkboxes = element.all(by.model('current.subsets[key]'));
    if(typeof n === 'number') {
      return checkboxes.get(n);
    }
    return checkboxes;
  },

  searchFor: function(string, reset) {
    var search = element(by.model('current.search'));
    if (reset !== false) {
      search.clear();
    }

    if (typeof string !== 'string') {
      string = '';
    }

    search.sendKeys(string);
  }
};