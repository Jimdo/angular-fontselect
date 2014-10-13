/* global NAME_FONTS, REQUIRED_FONT_OBJECT_KEYS */
fontselectModule.provider(NAME_FONTS, [
  function FontsProvider() {
    var providers = {};
    var fonts = [];

    function isValidFontObject(fontObj) {
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
    }

    function loadPreviewFactory(font, provider) {
      var loaded = false;
      return function loadPreview() {
        if (loaded) {
          return;
        }
        loaded = true;

        return provider.loadPreview(font);
      };
    }

    this.register = function(provider) {
      if (!provider || !provider.name) {
        throw new Error('tried to register provider without name');
      }

      if (!angular.isUndefined(providers[provider.name])) {
        throw new Error('provider "' + provider.name + '" already registered');
      }

      if (!angular.isFunction(provider.addFonts)) {
        throw new Error('provider "' + provider.name + '" lacks a addFonts method');
      }

      if (!angular.isFunction(provider.loadPreview)) {
        throw new Error('provider "' + provider.name + '" lacks a loadPreview method');
      }

      providers[provider.name] = provider;
    };

    this.$get = ['$q', '$log', function($q, $log) {
      var fontsD = $q.defer();
      var providerInitQueue = [];

      angular.forEach(providers, function(provider) {
        var providerFonts = [];
        var d = $q.defer();

        providerInitQueue.push(d.promise);

        function add(font) {
          if (!isValidFontObject(font)) {
            throw new Error('Invalid font object.', font);
          }

          font.provider = provider.name;
          /* Set provider as "fall-back" in the font-stack, so we can use the stack as unique key */
          font.stack += ', "' + provider.name + '"';
          font.loadPreview = loadPreviewFactory(font, provider);

          providerFonts.push(font);
        }

        function done(err) {
          if (err) {
            $log.warn('ignoring fonts of Provider "', provider.name, '":', err);
          } else {
            fonts = fonts.concat(providerFonts);
          }
          d.resolve();
        }

        provider.addFonts(add, done);
      });

      $q.all(providerInitQueue).then(function() {
        fontsD.resolve(fonts);
      }, function() {
        fontsD.reject();
      });

      return fontsD.promise;
    }];
  }
]);
