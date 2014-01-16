/* global FontselectController */
describe('fontselect controller', function() {
  'use strict';

  FontselectController.prototype.toScope = function() {
    var self = this;
    self.$scope.getSelf = _bind(function() {
      return self;
    }, self);
  };

  var elm, scope, instance;

  beforeEach(module('fontselect.module'));

  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element(
      '<div>' +
        '<fontselect />' +
      '</div>');

    scope = $rootScope;
    $compile(elm)(scope);
    scope.$digest();
    instance = elm.find('.fs-main').scope().getSelf();
  }));

  it('should exist', function() {
    expect(FontselectController).toBeDefined();
  });

  it('should be able to get itself', function() {
    expect(instance.name).toBe('FontselectController');
  });

  it('should become active when trigger is executed', function() {
    expect(scope.active).toBe(false);
    elm.find('button').click();
    expect(scope.active).toBe(true);
  });

  it('should not show the font-select window when inactive', function() {
    expect(elm.find('.fs-window.ng-hide').length).toBe(1);
  });

  it('should show the font-select window when active', function() {
    elm.find('button').click();
    expect(elm.find('.fs-window.ng-hide').length).toBe(0);
  });

});
