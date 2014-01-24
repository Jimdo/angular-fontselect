/* global browser, element, by */
/* jshint unused: false */
var sandboxUrl = 'http://localhost:8000/test/e2e/index.html';

beforeEach(function() {
  browser.get(sandboxUrl);
});

module.exports = {

  toggle: function() {
    element(by.css('.jd-fontselect-toggle')).click();
  },

  openProviderListNo: function(n) {
    element.all(by.repeater('provider in providers')).get(n)
      .findElement(by.tagName('h3')).click();
  },

  getRadio: function(n) {
    var radios = element.all(by.model('current.font'));
    if(typeof n === 'number') {
      return radios.get(n);
    }
    return radios;
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