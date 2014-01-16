describe('fontselect directive', function() {
  'use strict';

  var elm, scope, hiddeninput;

  beforeEach(module('fontselect.module'));

  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element(
      '<div>' +
        '<fontselect />' +
      '</div>');

    scope = $rootScope;
    $compile(elm)(scope);
    scope.$digest();
    hiddeninput = elm.find('input[type="hidden"]');
  }));

  it('should add an wrapper element with fs-main class.', inject(function() {
    expect(elm.find('.fs-main').length).toBe(1);
  }));

  it('should replace the fontselect element.', function() {
    expect(elm.find('fontselect').length).toBe(0);
  });

  it('should have a fonts object on scope', function() {
    expect(elm.scope().fonts).toBeTypeOf('Object');
  });

  it('should have a button', function() {
    expect(elm.find('button').length).toBe(1);
  });

  it('should have a hidden input element', function() {
    expect(hiddeninput.length).toBe(1);
  });

  it('\'s hidden input should have the active font as a value', function() {
    expect(hiddeninput.val()).toBe('something');
  });

  it('should provide a list with some fonts', function() {
    expect(elm.find('li').length).toBeGreaterThan(4);
  });
});
