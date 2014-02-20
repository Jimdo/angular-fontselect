/* global browser, element, by */
var sandboxUrl = 'http://localhost:8765/test/e2e/';
var active;

beforeEach(function() {
  active = false;
  browser.get(sandboxUrl);
});


module.exports = {

  toggle: function() {
    if (!active) {
      element(by.css('.jdfs-toggle')).click();
    } else {
      element(by.css('body')).click();
    }

    active = !active;
  },

  getFontLabel: function(n) {
    var labels = element.all(by.css('.jdfs-fontlist label'));
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