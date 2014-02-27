/* global DEFAULT_WEBSAFE_FONTS, PROVIDER_WEBSAFE, PROVIDER_GOOGLE, REQUIRED_FONT_OBJECT_KEYS */
/* global GOOGLE_FONT_CATEGORIES, NAME_FONTSSERVICE, DEFAULT_CATEGORIES, URL_GOOGLE_FONTS_CSS */
/* global VARIANT_PRIORITY, SUBSET_PRIORITY, METHOD_GET, SUPPORT_KHMER, URL_GOOGLE_FONTS_API  */


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
    self._allSubsets = [];
    self._subsets = {};
    self._providers = {};

    self._subsetNames = {};
    self._addDefaultFonts();
  },

  getAllFonts: function() {
    return this._fonts;
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
      self._addSubsets(fontObj.subsets);
    }

    self._fonts.push(fontObj);
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
      return false;
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

  getAllSubsets: function() {
    return this._allSubsets;
  },

  getSubsetNames: function() {
    return this._subsetNames;
  },

  getSubsets: function() {
    return this._subsets;
  },

  setSubsets: function(subsets, additive) {
    return this._setSelects(this._subsets, subsets, additive);
  },

  setProviders: function(providers, additive) {
    return this._setSelects(this._providers, providers, additive);
  },

  _setSelects: function(target, srcs, additive) {
    if (angular.isUndefined(additive)) {
      additive = true;
    }

    angular.forEach(srcs, function(active, src) {
      if (active || !additive) {
        target[src] = active;
      }
    });

    return target;
  },

  load: function(font) {
    if (font.loaded) {
      return;
    }

    font.loaded = true;

    if (font.provider === PROVIDER_WEBSAFE) {
      return;
    }

    this['_load' + font.provider](font);
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

  getUsedFonts: function() {
    var self = this;

    return self.$filter('filter')(self._fonts, {used: true}, function(used) {
      return !!used;
    });
  },

  getGoogleUrl: function() {
    var self = this;
    var googleFonts = self.$filter('filter')(self.getUsedFonts(), {provider: PROVIDER_GOOGLE});
    var subsets = [];
    var url = URL_GOOGLE_FONTS_CSS;

    if (googleFonts.length) {
      var googleNames = [];

      for (var i = 0, l = googleFonts.length; i < l; i++) {
        googleNames.push(googleFonts[i].name);
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

    self.$http({
      method: METHOD_GET,
      url: URL_GOOGLE_FONTS_API,
      params: {
        sort: 'popularity',
        key: self.jdFontselectConfig.googleApiKey
      }
    }).success(function(response) {
      var amount = response.items.length;

      angular.forEach(response.items, function(font, i) {
        var category = self._getGoogleFontCat(font.family);
        if (SUPPORT_KHMER || font.subsets.length === 1 && font.subsets[0] === 'khmer') {
          return;
        }

        self.add({
          subsets: font.subsets,
          variants: font.variants,
          name: font.family,
          popularity: amount - i,
          key: _createKey(font.family),
          lastModified: font.lastModified,
          stack: '"' + font.family + '", ' + category.fallback,
          category: category.key
        }, PROVIDER_GOOGLE);
      });
    });
  },

  _addSubsets: function(subsets) {
    for (var i = 0, l = subsets.length; i < l; i++) {
      this._addSubset(subsets[i]);
    }
  },

  _addSubset: function(subset) {
    var self = this;

    if (self._allSubsets.indexOf(subset) < 0) {
      var fragments = subset.split('-');

      for (var i = 0, l = fragments.length; i < l; i++) {
        fragments[i] = fragments[i].charAt(0).toUpperCase() + fragments[i].slice(1);
      }

      self._subsetNames[subset] = fragments.join(' ');
      self._allSubsets.push(subset);
    }
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
    return categories[5];
  },

  _addDefaultFonts: function() {
    var self = this;

    angular.forEach(DEFAULT_WEBSAFE_FONTS, function(font) {
      self.add(font);
    });
  }
};


FontsService.prototype['_load' + PROVIDER_GOOGLE] = function(font) {
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
};

fontselectModule.factory(NAME_FONTSSERVICE, ['$injector', function($injector) {
  return $injector.instantiate(FontsService);
}]);
