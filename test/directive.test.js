describe('fontselect directive', function() {
  'use strict';

  var elm, scope;

  beforeEach(module('fontselect.module'));

  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element(
      '<div>' +
        '<fontselect />' +
      '</div>');

    scope = $rootScope;
    $compile(elm)(scope);
    scope.$digest();
  }));

  it('should add an wrapper element with fs-main class.', inject(function() {
    expect(elm.find('.fs-main').length).toBe(1);
  }));

  it('should replace the fontselect element.', function() {
    expect(elm.find('fontselect').length).toBe(0);
  });

});
