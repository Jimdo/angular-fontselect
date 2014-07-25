/* global DEFAULT_WEBSAFE_FONTS, PROVIDER_WEBSAFE, PROVIDER_GOOGLE, REQUIRED_FONT_OBJECT_KEYS */
/* global GOOGLE_FONT_CATEGORIES, NAME_FONTSSERVICE, DEFAULT_CATEGORIES, URL_GOOGLE_FONTS_CSS */
/* global VARIANT_PRIORITY, SUBSET_PRIORITY, METHOD_GET, URL_GOOGLE_FONTS_API  */
/* global STATE_DEFAULTS, CATEGORY_OTHER, CATEGORY_OBJECTS  */

var _fontsServiceDeps = ['$http', '$q', 'jdFontselectConfig', '$filter'];

var _googleFontsInitiated = false;

function FontsService() {
  var self = this;

  for (var i = 0, l = _fontsServiceDeps.length; i <l; i++) {
    self[_fontsServiceDeps[i]] = arguments[i];
  }

  self._init();

  return self;
}

FontsService.$inject = _fontsServiceDeps;

FontsService.prototype = {
  _init: function() {
    var self = this;

    self._fonts = self._fonts || [];
    self._map = {};
    self._subsets = angular.copy(STATE_DEFAULTS.subsets);
    self._providers = angular.copy(STATE_DEFAULTS.providers);
    self._imports = {};
    self._usedProviders = {};
    self._initPromises = [];
    self._asyncProviderQueue = [];
    self._fontInitiators = {};

    self.registerProvider(PROVIDER_GOOGLE, angular.bind(self, self._loadGoogleFont));
    self.registerProvider(PROVIDER_WEBSAFE, function() {});

    self._addDefaultFonts();
  },

  getAllFonts: function() {
    return this._fonts;
  },

  ready: function(callback) {
    var promise = this.$q.all(this._initPromises);
    if (angular.isFunction(callback)) {
      promise.then(callback);
    }
    return promise;
  },

  add: function(fontObj, provider) {
    var self = this;

    if (!angular.isString(provider)) {
      provider = angular.isString(fontObj.provider) ? fontObj.provider : PROVIDER_WEBSAFE;
    }

    fontObj.provider = provider;

    /* Set provider as "fall-back" in the font-stack, so we can use the stack as unique key */
    fontObj.stack += ', "' + provider + '"';

    if (!self.isValidFontObject(fontObj)) {
      throw 'Invalid font object.';
    }

    if (!angular.isObject(self._map[provider])) {
      self._map[provider] = {};
    }

    if (angular.isArray(fontObj.subsets)) {
      self.setSubsets(fontObj.subsets);
    }

    self._fonts.push(fontObj);

    return fontObj;
  },

  searchFonts: function(object) {
    var self = this;

    return self.$filter('filter')(self._fonts, object);
  },

  searchFont: function(object) {
    var self = this;

    var fonts = self.searchFonts(object);

    if (fonts.length > 0) {
      fonts = fonts[0];
    } else {
      return;
    }

    return fonts;
  },

  getFontByKey: function(key, provider) {
    var self = this;

    if (!provider) {
      throw 'Provider is not set.';
    }

    var font = self.searchFont({key: key, provider: provider});

    if (!font) {
      throw 'Font "' + key + '" not found in "' + provider + '".';
    }

    return font;
  },

  getFontByStack: function(stack, strict) {
    strict = typeof strict === 'boolean' ? strict : true;
    var fonts, self = this;

    if (strict) {
      fonts = self.searchFonts({stack: stack});
    } else {
      fonts = self.$filter('stackSearch')(self._fonts, stack);
    }

    if (!fonts.length) {
      throw new Error ('Font with stack "' + stack + '" not found.');
    }

    return fonts[0];
  },

  getFontByStackAsync: function(stack, strict) {
    strict = typeof strict === 'boolean' ? strict : true;
    var self = this;
    var d = self.$q.defer();
    var index = null;

    self.$q.all(self._asyncProviderQueue).then(function() {
      try {
        var font = self.getFontByStack(stack, strict);
        d.resolve(font);
      } catch (e) {
        if (strict) {
          d.reject(e);
          delete self._initPromises[index];
        } else {
          d.resolve();
        }
      }
    }, d.reject);

    index = self._initPromises.push(d.promise) - 1;
    return d.promise;
  },

  getFontsByStacksAsync: function(stacks, strict) {
    strict = typeof strict === 'boolean' ? strict : true;
    var self = this;
    var queue = [];

    angular.forEach(stacks, function(stack) {
      queue.push(self.getFontByStackAsync(stack, strict));
    });

    var all = self.$q.all(queue);

    if (strict) {
      return all;
    } else {
      var d = self.$q.defer();
      all.then(function(fonts) {
        var result = [];
        angular.forEach(fonts, function(font) {
          if (angular.isObject(font)) {
            result.push(font);
          }
        });
        d.resolve(result);
      });
      return d.promise;
    }
  },

  removeFont: function(font, provider) {
    var self = this;

    if (angular.isString(font) && !provider) {
      throw 'Provider is not set.';
    }

    try {
      if (angular.isString(font)) {
        font = self.getFontByKey(font, provider);
      }

      var index = self._fonts.indexOf(font);
      var retVal = 0;

      if (index >= 0) {
        retVal = self._fonts.splice(index, 1).length;
      }
      return retVal;
    } catch (e) {
      return 0;
    }
  },

  isValidFontObject: function(fontObj) {
    if (!angular.isObject(fontObj)) {
      return false;
    }

    var valid = true;

    angular.forEach(REQUIRED_FONT_OBJECT_KEYS, function(key) {
      if (angular.isUndefined(fontObj[key])) {
        valid = false;
      }
    });

    return valid;
  },

  getCategories: function() {
    return DEFAULT_CATEGORIES;
  },

  getImports: function() {
    return this._imports;
  },

  /**
   * getImportsForStacks([
   *   "'Roboto', sans-serif, 'google'",
   *   "'Own font', serif"
   * ]);
   */
  getImportsForStacks: function(fontStacks, strict) {
    var self = this;
    var d = self.$q.defer();

    if (!angular.isArray(fontStacks)) {
      d.reject(new Error('No stacks given'));
    } else {
      var fonts = [];
      self.getFontsByStacksAsync(fontStacks, strict).then(function(fontsByStack) {
        fonts = fontsByStack;
      })['finally'](function() {
        d.resolve(self.getUrlsFor(fonts));
      });
    }

    return d.promise;
  },

  getSubsets: function() {
    return this._subsets;
  },

  getProviders: function() {
    return this._providers;
  },

  getUsage: function() {
    return this._usedProviders;
  },

  setSubsets: function(subsets, options) {
    var self = this;
    return self._setSelects(
      self._subsets,
      subsets,
      self._setSelectOptions(options)
    );
  },

  setProviders: function(providers, options) {
    var self = this;
    return self._setSelects(
      self._providers,
      providers,
      self._setSelectOptions(options)
    );
  },

  setImports: function(imports, options) {
    var self = this;
    return self._setSelects(
      self._imports,
      imports,
      self._setSelectOptions(options, {update: true})
    );
  },

  setUsage: function(usage, options) {
    var self = this;
    return self._setSelects(
      self._usedProviders,
      usage,
      self._setSelectOptions(options, {update: true})
    );
  },

  registerProvider: function(name, fontInitiator) {
    var self = this;

    var provider = {};
    provider[name] = false;
    self.setProviders(provider);
    self._usedProviders[name] = false;
    self._fontInitiators[name] = fontInitiator;
  },

  _setSelectOptions: function(options, additional) {
    if (typeof options === 'boolean') {
      options = {additive: options};
    }

    if (!angular.isObject(additional)) {
      additional = {};
    }

    options = angular.extend({
      additive: true,
      update: false
    }, options, additional);

    return options;
  },

  _setSelects: function(target, srcs, options) {
    if (angular.isUndefined(srcs)) {
      return target;
    }

    if (!angular.isObject(options)) {
      options = this._setSelectOptions(options);
    }

    if (angular.isArray(srcs)) {
      var srcsObj = {};
      for (var i = 0, l = srcs.length; i < l; i++) {
        srcsObj[srcs[i]] = false;
      }
      srcs = srcsObj;
    }

    /* If we aren't additive, remove all keys that are not present in srcs */
    if (!options.additive) {
      angular.forEach(target, function(active, src) {
        if (!srcs[src]) {
          delete target[src];
        }
      });
    }

    angular.forEach(srcs, function(active, src) {
      if (options.update || angular.isUndefined(target[src])) {
        target[src] = active;
      }
    });

    return target;
  },

  updateImports: function() {
    this.setImports(this.getUrls());
  },

  load: function(font) {
    if (font.loaded) {
      return;
    }

    font.loaded = true;
    this._fontInitiators[font.provider](font);
  },

  getUrls: function() {
    var self = this;
    var googleUrl = self.getGoogleUrl();
    var urls = {};

    if (googleUrl) {
      urls[PROVIDER_GOOGLE] = googleUrl;
    }

    return urls;
  },

  getUrlsFor: function(fonts) {
    var self = this;
    var googleFonts = self.$filter('filter')(fonts, {provider: PROVIDER_GOOGLE});
    var googleUrl = self.getGoogleUrlFor(googleFonts);
    var urls = {};

    if (googleUrl) {
      urls[PROVIDER_GOOGLE] = googleUrl;
    }

    return urls;
  },

  updateUsage: function(font, wasActivated) {
    var self = this;

    if (!angular.isNumber(font.used) || font.used < 0) {
      font.used = 0;
    }
    font.used += wasActivated === false ? -1 : 1;

    self._updateProvicerUsage();
  },


  _updateProvicerUsage: function() {
    var self = this;
    var filter = self.$filter('filter');
    var usedFonts = self.getUsedFonts();

    angular.forEach(self._providers, function(active, provider) {
      self._usedProviders[provider] = !!filter(
        usedFonts,
        {provider: provider}
      ).length;
    });
  },

  getUsedFonts: function() {
    var self = this;

    return self.$filter('filter')(self._fonts, {used: true}, function(used) {
      return !!used;
    });
  },

  getGoogleUrl: function() {
    var self = this;
    var googleFonts = self.$filter('filter')(self.getUsedFonts(), {provider: PROVIDER_GOOGLE});
    return self.getGoogleUrlFor(googleFonts);
  },

  getGoogleUrlFor: function(googleFonts) {
    var self = this;
    var subsets = [];
    var url = URL_GOOGLE_FONTS_CSS;

    if (googleFonts.length) {
      var googleNames = [];
      var variant;

      for (var i = 0, l = googleFonts.length; i < l; i++) {
        variant = googleFonts[i].variants ? ':' + self._getBestVariantOf(googleFonts[i].variants) : '';
        googleNames.push(googleFonts[i].name + variant);
      }

      url += '?family=' + window.escape(googleNames.join('|'));

      angular.forEach(self._subsets, function(active, key) {
        if (active) {
          subsets.push(key);
        }
      });

      if (subsets.length) {
        url += '&subset=' + subsets.join(',');
      }

      return url;
    } else {
      return false;
    }
  },

  _remap: function(provider, from) {
    var self = this;
    var fonts = self._fonts[provider];

    if (!angular.isNumber(from)) {
      from = 0;
    }

    for (var i = from, l = fonts.length; i < l; i++) {
      self._map[provider][fonts[i].key] = i;
    }
  },

  _getBestOf: function(things, prios) {
    for (var i = 0, l = prios.length; i < l; i++) {
      var thing = prios[i];
      if (things.indexOf(thing) >= 0) {
        return thing;
      }
    }
    return things[0];
  },

  _getBestVariantOf: function(variants) {
    return this._getBestOf(variants, VARIANT_PRIORITY);
  },

  _getBestSubsetOf: function(subsets) {
    return this._getBestOf(subsets, SUBSET_PRIORITY);
  },

  _initGoogleFonts: function() {
    var self = this;

    if (!self.jdFontselectConfig.googleApiKey || _googleFontsInitiated) {
      return;
    }

    _googleFontsInitiated = true;

    var d = self.$q.defer();
    self._initPromises.push(d.promise);
    self._asyncProviderQueue.push(d.promise);

    self.$http({
      method: METHOD_GET,
      url: URL_GOOGLE_FONTS_API,
      params: {
        sort: 'popularity',
        key: self.jdFontselectConfig.googleApiKey
      }
    }).success(function(response) {
      var amount = response.items.length;
      var ready = amount - 1;
      var fonts = [];

      angular.forEach(response.items, function(font, i) {
        var category = self._getGoogleFontCat(font.family);

        fonts.push(self.add({
          subsets: font.subsets,
          variants: font.variants,
          name: font.family,
          popularity: amount - i,
          key: _createKey(font.family),
          lastModified: font.lastModified,
          stack: '"' + font.family + '", ' + category.fallback,
          category: category.key
        }, PROVIDER_GOOGLE));

        if (ready === i) {
          d.resolve(fonts);
        }
      });
    }).error(d.reject);
  },

  _getGoogleFontCat: function(font) {
    var self = this;

    var categories = self.getCategories();
    for (var i = 0, l = categories.length; i < l; i++) {
      var category = categories[i];

      if (typeof GOOGLE_FONT_CATEGORIES[category.key] === 'undefined') {
        continue;
      }

      if (GOOGLE_FONT_CATEGORIES[category.key].indexOf(font) >= 0) {
        return category;
      }
    }

    // console.error('Category not Found:', font);
    return CATEGORY_OBJECTS[CATEGORY_OTHER];
  },

  _addDefaultFonts: function() {
    var self = this;

    angular.forEach(DEFAULT_WEBSAFE_FONTS, function(font) {
      self.add(font);
    });
  },

  _loadGoogleFont: function(font) {
    var self = this;

    try {
      WebFont.load({
        google: {
          families: [font.name + ':' + self._getBestVariantOf(font.variants)],
          text: font.name,
          subsets: font.subsets,
          subset: self._getBestSubsetOf(font.subsets)
        }
      });
    } catch (e) {
      self.removeFont(font, PROVIDER_GOOGLE);
    }
  }
};

fontselectModule.factory(NAME_FONTSSERVICE, ['$injector', function($injector) {
  return $injector.instantiate(FontsService);
}]);
