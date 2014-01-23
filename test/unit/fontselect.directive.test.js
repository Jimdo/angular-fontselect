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
      category: 'sans-serif',
      stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif'
    },
    {
      name: 'Courier New',
      key: 'couriernew',
      category: 'other',
      stack: '"Courier New", Courier, "Lucida Sans Typewriter", "Lucida Typewriter", monospace'
    },
    {
      name: 'Verdana',
      key: 'verdana',
      category: 'sans-serif',
      stack: 'Verdana, Geneva, sans-serif'
    },
    {
      name: 'Times New Roman',
      key: 'timesnewroman',
      category: 'serif',
      stack: 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif'
    },
    {
      name: 'Brush Script',
      key: 'brushscript',
      category: 'handwriting',
      stack: '"Brush Script MT", cursive'
    }
  ];

  var elm, rootScope, scope, hiddeninput, fontsService, instance;

  beforeEach(module('jdFontselect'));

  beforeEach(inject(function($rootScope, $compile, $injector) {
    elm = angular.element(
      '<div>' +
        '<jd-fontselect />' +
      '</div>');

    rootScope = $rootScope;

    $compile(elm)(rootScope);
    rootScope.$digest();

    scope = elm.find('.fs-main div').scope();
    hiddeninput = elm.find('input[type="hidden"]');
    fontsService = $injector.get('jdFontselect.fonts');
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

  it('should have a toggle button', function() {
    expect(elm.find('button[ng-click="toggle()"]').length).toBe(1);
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
        '<jd-fontselect />' +
      '</div>');

    inject(function($rootScope, $compile) {
      $compile(elm2)(rootScope);
      rootScope.$digest();
    });

    expect(elm2.find('.fs-main').attr('id')).toBe('fontselect-2');
  });

  describe('font list', function() {

    function normalizeFontStack(stack) {
      stack = stack.replace(/"/g, '\'').split(',');
      angular.forEach(stack, function(font, i) {
        stack[i] = font.replace(/^\s+|\s+$/g, '');
      });

      return stack.join(',');
    }

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

    it('should be able to provide a preview of the font', function() {
      expect(normalizeFontStack(elm.find('li label').eq(0).css('font-family')))
        .toBe(normalizeFontStack(DEFAULT_WEBSAFE_FONTS[0].stack));
    });

  });

  describe('search', function() {
    it('should have a search input field', function() {
      expect(elm.find('input[name="fs-1-search"]').length).toBe(1);
    });
  });

  describe('category filter', function() {
    it('should have a list with categories', function() {
      expect(elm.find('button[ng-model="current.category"]').length).toBe(4);
    });
  });

});
