/* global NAME_PROVIDER_MANAGER, NAME_FONTSSERVICE */
fontselectModule.service(NAME_PROVIDER_MANAGER, [
  NAME_FONTSSERVICE,
  '$q',
  function(fonts, $q) {
    var providers = {};

    this.register = function(provider) {
      var d = $q.defer();

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

      function add(font) {
        fonts.add(font, provider.name);
      }

      function done(err) {
        if (err) {
          d.reject(err);
        }

        d.resolve();
      }

      provider.addFonts(add, done);

      return d.promise;
    };

    this.get = function(name) {
      if (!providers[name]) {
        throw new Error('tried to get unknown provider' + name);
      }

      return providers[name];
    };
  }
]);
