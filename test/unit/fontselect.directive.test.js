/* global FontselectController, DEFAULT_WEBSAFE_FONTS */
/* jshint -W020 */
describe('fontselect directive', function() {
  'use strict';

  FontselectController.prototype.toScope = function() {
    var self = this;
    self.$scope.getSelf = _bind(function() {
      return self;
    }, self);
  };

  /* Overwrite the default font list for tests. */
  DEFAULT_WEBSAFE_FONTS = [
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

  var elm, rootScope, scope, hiddeninput, fontsService, instance;

  beforeEach(module('fontselect.module'));

  beforeEach(inject(function($rootScope, $compile, $injector) {
    elm = angular.element(
      '<div>' +
        '<fontselect />' +
      '</div>');

    rootScope = $rootScope;
    $compile(elm)(rootScope);
    rootScope.$digest();
    scope = elm.find('.fs-main div').scope();
    hiddeninput = elm.find('input[type="hidden"]');
    fontsService = $injector.get('fontselect.fonts');
    instance = scope.getSelf();
  }));

  afterEach(function() {
    scope.getSelf()._resetIDs();
  });


  it('s controller should exist', function() {
    expect(FontselectController).toBeDefined();
  });

  it('should be able to get itself', function() {
    expect(instance).toBeInstanceOf(FontselectController);
  });

  it('should add an wrapper element with fs-main class.', inject(function() {
    expect(elm.find('.fs-main').length).toBe(1);
  }));

  it('should replace the fontselect element.', function() {
    expect(elm.find('fontselect').length).toBe(0);
  });

  it('should have a button', function() {
    expect(elm.find('button').length).toBe(1);
  });

  it('should become active when button is clicked', function() {
    expect(scope.active).toBe(false);
    elm.find('button').click();
    expect(scope.active).toBe(true);
  });

  it('should have a hidden input element', function() {
    expect(hiddeninput.length).toBe(1);
  });

  it('should have no current font on initiation.', function() {
    expect(scope.currentFont).not.toBeDefined();
  });

  it('\'s hidden input should have the active font as a value', function() {
    expect(hiddeninput.val()).toBe('');
  });

  it('should provide a list with some fonts', function() {
    expect(elm.find('li').length).toBe(5);
  });

  it('should not show the font-select window when inactive', function() {
    expect(elm.find('.fs-window.ng-hide').length).toBe(1);
  });

  it('should show the font-select window when active', function() {
    elm.find('button').click();
    expect(elm.find('.fs-window.ng-hide').length).toBe(0);
  });

  it('should expend if we add a new font via the fonts service', function() {
    var length = elm.find('li').length;
    fontsService.add({name: 'Drrrt', key: 'drt', stack: 'Bar, sans-serif'});
    scope.$digest();
    expect(elm.find('li').length).toBe(length + 1);
  });

  it('should have an id', function() {
    expect(elm.find('.fs-main').attr('id')).toBe('fontselect-1');
  });

  it('should increase the id for every instance', function() {
    var elm2 = angular.element(
      '<div>' +
        '<fontselect />' +
      '</div>');

    inject(function($rootScope, $compile) {
      $compile(elm2)(rootScope);
      rootScope.$digest();
    });

    expect(elm2.find('.fs-main').attr('id')).toBe('fontselect-2');
  });

  describe('font list', function() {
    it('should have radio buttons inside the list items', function() {
      expect(elm.find('li input[type="radio"]').length).toBe(5);
    });

    it('should have labels for the radio buttons', function() {
      expect(elm.find('li label').length).toBe(5);
    });

    it('should link the labels to the radio buttons', function() {
      expect(elm.find('input[type="radio"]').attr('id'))
        .toBe(elm.find('label').attr('for'));
    });
  });

});
