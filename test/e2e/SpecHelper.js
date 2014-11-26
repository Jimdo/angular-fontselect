/* global browser, element, by, protractor */
var sandboxUrl = 'http://localhost:8765/';
var active, prot, searching;

beforeEach(function() {
  searching = false;
  active = false;
  prot = protractor.getInstance();
  browser.get(sandboxUrl);
});


var SpecHelper = {

  /** @const */
  PAGE_SIZE_DEFAULT: 10,

  /** @const */
  CURRENT_PAGE_CONTAINER_CLASS: '.jdfs-page-current',

  /** @const */
  MAX_PAGE_CONTAINER_CLASS: '.jdfs-page-count',

  /** @const */
  FONTCOUNT_CONTAINER_CLASS: '.jdfs-fontcount',

  toggleSpecific: function(n) {
    element(by.css('.fs-' + n + ' .jdfs-toggle')).click();
  },

  toggle: function() {
    if (!active) {
      element(by.css('.jdfs-toggle')).click();
    } else {
      element(by.css('body')).click();
      searching = false;
    }

    active = !active;
  },

  toggleSecondFontSelection: function() {
    element(by.model('second')).click();
  },

  toggleBySearch: function() {
    if (!searching) {
      element(by.css('.jdfs-toggle-search')).click();
    } else if (searching) {
      element(by.css('.jdfs-reset-search')).click();
    }

    searching = !searching;
  },

  getFontLabel: function(n) {
    var labels = element.all(by.css('.jdfs-fontlist label'));
    if(typeof n === 'number') {
      return labels.get(n);
    }
    return labels;
  },

  getPaginator: function(n) {
    var paginators = element.all(by.css('.jdfs-fontpagination'));
    if(typeof n === 'number') {
      return paginators.get(n);
    }
    return paginators;
  },

  currentPage: function() {
    var d = protractor.promise.defer();

    element(by.css(this.CURRENT_PAGE_CONTAINER_CLASS)).getText().then(function(text) {
      d.fulfill(parseInt(text));
    });

    return d.promise;
  },

  pageCount: function() {
    var d = protractor.promise.defer();

    element(by.css(this.MAX_PAGE_CONTAINER_CLASS)).getText().then(function(text) {
      d.fulfill(parseInt(text));
    });

    return d.promise;
  },

  totalFonts: function() {
    var d = protractor.promise.defer();

    element(by.css(this.FONTCOUNT_CONTAINER_CLASS)).getText().then(function(text) {
      d.fulfill(parseInt(text.split('/')[1]));
    });

    return d.promise;
  },

  currentFontAmount: function() {
    var d = protractor.promise.defer();

    element(by.css(this.FONTCOUNT_CONTAINER_CLASS)).getText().then(function(text) {
      d.fulfill(parseInt(text.split('/')[0].replace(/[^\d]*/g, '')));
    });

    return d.promise;
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

  getProviderCheckbox: function(n) {
    var checkboxes = element.all(by.model('current.providers[provider]'));
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
  },

  openStyles: function() {
    element(by.css('.jdfs-styles-label')).click();
  },

  openSettings: function() {
    element(by.css('.jdfs-settings-label')).click();
  },

  getEvents: function() {
    return element(by.css('#events')).getText();
  }
};

module.exports = SpecHelper;
