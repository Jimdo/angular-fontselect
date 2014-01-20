describe('fontselect directive', function() {
  'use strict';

  var elm, scope, hiddeninput, fontsService;

  beforeEach(module('fontselect.module'));

  beforeEach(inject(function($rootScope, $compile, $injector) {
    elm = angular.element(
      '<div>' +
        '<fontselect />' +
      '</div>');

    scope = $rootScope;
    $compile(elm)(scope);
    scope.$digest();
    hiddeninput = elm.find('input[type="hidden"]');
    fontsService = $injector.get('fontselect.fonts');
  }));

  it('should add an wrapper element with fs-main class.', inject(function() {
    expect(elm.find('.fs-main').length).toBe(1);
  }));

  it('should replace the fontselect element.', function() {
    expect(elm.find('fontselect').length).toBe(0);
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
    expect(elm.find('li').length).toBe(5);
  });

  it('should expend if we add a new font via the fonts service', function() {
    var length = elm.find('li').length;
    fontsService.add({name: 'Drrrt', key: 'drt', stack: 'Bar, sans-serif'});
    scope.$digest();
    expect(elm.find('li').length).toBe(length + 1);
  });

});
