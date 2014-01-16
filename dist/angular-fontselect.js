/*!
 * angular-fontselect v0.0.1
 * https://github.com/Jimdo/angular-fontselect
 *
 * A fontselect directive for AngularJS
 *
 * Copyright 2014, Jimdo, Hannes Diercks <hannes.diercks@jimdo.com>
 * Released under the MIT license
 */
(function(angular) {
  'use strict';
  // src/js/helpers.js
  function _bind(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  }

  // src/js/module.js
  angular.module('fontselect.module', []);

  // src/js/fontselect.controller.js
  /** @const */
  var CATEGORY_WEBSAVE = 'websave';
  
  /** @const */
  var DEFAULT_WEBSAVE_FONTS = [
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
  
  var FontselectController = function($scope) {
    var self = this;
  
    self.$scope = $scope;
    self.toScope();
    self.name = 'FontselectController';
    self._construct();
  };
  
  FontselectController.prototype = {
    _construct: function() {
      var self = this;
      var $scope = self.$scope;
  
      $scope.active = false;
      $scope.currentFont = 'something';
      $scope.fonts = {};
      self.populateFonts();
      $scope.toggle = _bind(self.toggle, self);
    },
    /* Workaround to be able to get the instance from $scope in tests. */
    toScope: function() {},
    
    toggle: function() {
      var $scope = this.$scope;
  
      $scope.active = !$scope.active;
    },
  
    populateFonts: function() {
      var fonts = this.$scope.fonts;
  
      fonts[CATEGORY_WEBSAVE] = DEFAULT_WEBSAVE_FONTS;
    }
  };
  
  FontselectController.$inject = ['$scope'];

  // src/js/fontselect.directive.js
  angular.module('fontselect.module').directive('fontselect', [function() {
    return {
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
      "<div class=fs-main><button ng-click=toggle()>Toggle</button><input type=hidden value={{currentFont}}><div class=fs-window ng-show=active><ul><li ng-repeat=\"font in fonts.websave\">{{font.name}}</li></ul></div></div>"
    );
  
  }]);
})(angular);
