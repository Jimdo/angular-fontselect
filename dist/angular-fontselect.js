/*!
 * angular-fontselect v0.0.1
 * https://github.com/Jimdo/angular-fontselect
 *
 * A fontselect directive for AngularJS
 *
 * Copyright 2014, Jimdo, Hannes Diercks <hannes.diercks@jimdo.com>
 * Released under the MIT license
 */
(function(angular, undefined) {
  'use strict';

  // src/js/defaults.js
  /** @const */
  var CATEGORY_WEBSAFE = 'websafe';
  
  /** @const */
  var DEFAULT_WEBSAFE_FONTS = [
    {
      name: 'Arial',
      key: 'arial',
      stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif'
    },
    {
      name: 'Lucida Grande',
      key: 'lucidagrande',
      stack: '"Lucida Bright", Georgia, serif'
    },
    {
      name: 'Verdana',
      key: 'verdana',
      stack: 'Verdana, Geneva, sans-serif'
    },
    {
      name: 'Times New Roman',
      key: 'timesnewroman',
      stack: 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif'
    },
    {
      name: 'Courier New',
      key: 'couriernew',
      stack: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace'
    }
  ];

  // src/js/helpers.js
  function _bind(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  }

  // src/js/module.js
  var fontselectModule = angular.module('fontselect.module', []);

  // src/js/fonts.service.js
  /** @const */
  var REQUIRED_FONT_OBJECT_KEYS = [
    'name',
    'key',
    'stack'
  ];
  
  function FontsService($scope) {
    var self = this;
  
    self.$scope = $scope;
    self._init();
  
    return self;
  }
  
  FontsService.prototype = {
    _init: function() {
      var self = this;
      
      self._fonts = self._fonts || {};
      self._fonts[CATEGORY_WEBSAFE] = angular.copy(DEFAULT_WEBSAFE_FONTS);
    },
  
    getAll: function() {
      return this._fonts;
    },
  
    add: function(fontObj, category) {
      var self = this;
  
      if (angular.isString(category)) {
        category = CATEGORY_WEBSAFE;
      }
  
      if (!self.isValidFontObject(fontObj)) {
        throw 'Invalid font object.';
      }
  
      self._fonts[CATEGORY_WEBSAFE].push(fontObj);
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
    }
  };
  
  fontselectModule.factory(
    'fontselect.fonts',
    ['$rootScope', function($rootScope) { return new FontsService($rootScope); }]
  );

  // src/js/fontselect.controller.js
  var id = 1;
  
  var FontselectController = function($scope, fonts) {
    var self = this;
  
    self.fonts = fonts;
    $scope.fonts = fonts.getAll();
    $scope.id = id++;
    self.$scope = $scope;
    self.toScope();
    self.name = 'FontselectController';
    self._construct();
  };
  
  FontselectController.prototype = {
    _construct: function() {
      var self = this;
      var $scope = self.$scope;
  
      $scope.data = {
        currentFont: undefined,
      };
      $scope.active = false;
      $scope.toggle = _bind(self.toggle, self);
    },
    /* Workaround to be able to get the instance from $scope in tests. */
    toScope: function() {},
    
    toggle: function() {
      var $scope = this.$scope;
  
      $scope.active = !$scope.active;
    },
  
    _resetIDs: function() {
      id = 1;
    }
  };
  
  FontselectController.$inject = ['$scope', 'fontselect.fonts'];

  // src/js/fontselect.directive.js
  fontselectModule.directive('fontselect', [function() {
    return {
      scope: {},
      restrict: 'E',
      templateUrl: 'fontselect.html',
      replace: true,
      controller: FontselectController
    };
  }]);

  // src/partials/all.js
  angular.module('fontselect.module').run(['$templateCache', function($templateCache) {
    'use strict';
  
    $templateCache.put('fontselect.html',
      "<div class=fs-main id=fontselect-{{id}}><button ng-click=toggle()>Toggle</button><input type=hidden value={{data.currentFont}}><div class=fs-window ng-show=active><ul><li ng-repeat=\"font in fonts.websafe\"><input type=radio ng-model=data.currentFont value={{font.key}} id=fs-{{id}}-font-{{font.key}}><label for=fs-{{id}}-font-{{font.key}}>{{font.name}}</label></li></ul></div></div>"
    );
  
  }]);
})(angular);
